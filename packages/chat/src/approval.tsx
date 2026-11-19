import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useI18n } from '@pactor-app/runtime';
import { Icon } from '@pactor-app/ui/components';
import { Button } from '@pactor-app/ui/ui';

import type { ChatConfirm, ChatConfirmRequest } from './capability-action.js';
import { cn } from './lib/utils.js';

/**
 * 高风险审批队列（文档站「组件交付 / 审批队列」一项）：
 * 保持 `ChatConfirm` 公开签名不变，由宿主选择接入：
 *
 * ```tsx
 * const queue = createApprovalQueue({ onDecision: audit, onUndo: auditUndo });
 * const confirm = createApprovalConfirm({ queue });
 * registerCapabilityAction(actions, { capabilities, confirm });
 * // 在宿主 UI 中渲染 <ApprovalQueue queue={queue} />（缺省隐藏空态）
 * ```
 *
 * 一期：`risk: 'high'` + once / session 授权 + 单请求顺序处理；
 * `always` 仅在宿主提供 `persistGrant` 时展示（持久化由宿主决定）。
 * 二期：风险分组布局、多选批量决议（固定 once）、resolved log + Undo
 * （重新入队）、结构化 payload 经 `renderPayload` 由宿主渲染。
 */

/** 风险等级 */
export type ApprovalRisk = 'low' | 'medium' | 'high';

/** 授权范围：once 仅本次，session 本会话，always 需宿主持久化 */
export type ApprovalScope = 'once' | 'session' | 'always';

export type ApprovalDecision = 'approved' | 'denied';

/** 待审批请求：在 ChatConfirmRequest 上补 id / risk */
export interface ApprovalRequest extends ChatConfirmRequest {
  id: string;
  risk?: ApprovalRisk;
}

/** 决议事件：用于宿主写审计流（approval.decided） */
export interface ApprovalDecisionEvent {
  request: ApprovalRequest;
  decision: ApprovalDecision;
  scope: ApprovalScope;
}

/** 已决议记录（resolved log；保留最近若干条用于审计与 Undo） */
export interface ApprovalResolution extends ApprovalDecisionEvent {
  /** 决议时间戳（毫秒） */
  resolvedAt: number;
}

/** Undo 事件：请求已重新入队，宿主据此写审计流 */
export interface ApprovalUndoEvent {
  request: ApprovalRequest;
  previousDecision: ApprovalDecision;
  scope: ApprovalScope;
}

export interface ApprovalQueueOptions {
  /** 请求 id 生成器（缺省自增） */
  createId?: () => string;
  /** always 授权持久化；提供后 UI 才展示「始终允许」 */
  persistGrant?: (name: string, scope: 'always') => void | Promise<void>;
  /** 决议回调：宿主在此写审计事件 / transcript */
  onDecision?: (event: ApprovalDecisionEvent) => void;
  /** Undo 回调：请求已重新进入待审批队列 */
  onUndo?: (event: ApprovalUndoEvent) => void;
}

const EMPTY: readonly ApprovalRequest[] = [];
const EMPTY_RESOLVED: readonly ApprovalResolution[] = [];
const RESOLVED_LIMIT = 20;

/**
 * 审批队列控制器（框架无关；组件经 useSyncExternalStore 订阅）。
 * 同一 capability 的 session 授权命中后不再入队，由 confirm 直接放行。
 */
export class ApprovalQueueController {
  private pending: readonly ApprovalRequest[] = EMPTY;
  private resolved: readonly ApprovalResolution[] = EMPTY_RESOLVED;
  private readonly listeners = new Set<() => void>();
  private readonly resolvers = new Map<string, (approved: boolean) => void>();
  private readonly grants = new Set<string>();
  private seq = 0;
  private readonly createId: () => string;
  private readonly persistGrant?: ApprovalQueueOptions['persistGrant'];
  private readonly onDecision?: ApprovalQueueOptions['onDecision'];
  private readonly onUndo?: ApprovalQueueOptions['onUndo'];

  constructor(options: ApprovalQueueOptions = {}) {
    this.createId = options.createId ?? (() => `approval-${++this.seq}`);
    this.persistGrant = options.persistGrant;
    this.onDecision = options.onDecision;
    this.onUndo = options.onUndo;
  }

  /** 宿主是否提供了 always 持久化 */
  get canPersistAlways(): boolean {
    return this.persistGrant !== undefined;
  }

  /** 当前待审批请求（快照，引用随变更替换） */
  getSnapshot = (): readonly ApprovalRequest[] => this.pending;

  /** 最近决议（resolved log 快照，最多保留 20 条） */
  getResolvedSnapshot = (): readonly ApprovalResolution[] => this.resolved;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /** 该 capability 是否已有 session / always 授权 */
  hasGrant(name: string): boolean {
    return this.grants.has(name);
  }

  /** 撤销 session 授权（宿主切换会话 / 登出时调用） */
  clearGrants(): void {
    this.grants.clear();
  }

  /**
   * 入队并等待用户决议：批准 resolve true，拒绝 resolve false。
   * 调用方（createApprovalConfirm）负责先检查 hasGrant。
   * 可附带 `risk` 供 `layout="grouped"` 按风险分组（缺省 high）。
   */
  enqueue(request: Omit<ApprovalRequest, 'id'>): Promise<boolean> {
    const id = this.createId();
    const entry: ApprovalRequest = { ...request, id };
    return new Promise<boolean>((resolve) => {
      this.resolvers.set(id, resolve);
      this.pending = [...this.pending, entry];
      this.emit();
    });
  }

  /** 决议：批准时按 scope 写入授权；事件同步给宿主用于审计 */
  decide(id: string, decision: ApprovalDecision, scope: ApprovalScope = 'once'): void {
    const entry = this.pending.find((item) => item.id === id);
    if (!entry) return;

    this.pending = this.pending.filter((item) => item.id !== id);

    if (decision === 'approved' && scope !== 'once') {
      this.grants.add(entry.name);
      if (scope === 'always') {
        void this.persistGrant?.(entry.name, 'always');
      }
    }

    const resolve = this.resolvers.get(id);
    this.resolvers.delete(id);
    resolve?.(decision === 'approved');

    this.resolved = [
      ...this.resolved,
      { request: entry, decision, scope, resolvedAt: Date.now() },
    ].slice(-RESOLVED_LIMIT);

    this.onDecision?.({ request: entry, decision, scope });
    this.emit();
  }

  /**
   * 批量决议：仅按 once 授权（避免一次点击扩散 session / always 权限）。
   * 不存在的 id 忽略；每项独立写 resolved log 与审计事件。
   */
  decideMany(ids: readonly string[], decision: ApprovalDecision): void {
    for (const id of ids) {
      this.decide(id, decision, 'once');
    }
  }

  /**
   * 撤销最近一条决议：把请求重新放回待审批队列（原 Promise 已 settle，
   * 无法反解；宿主经 onUndo 得知并自行处理后续）。仅撤销 resolved log
   * 中的记录；若请求已在队列中则跳过。返回被撤销的记录。
   */
  undo(id?: string): ApprovalResolution | null {
    const resolution = id
      ? this.resolved.find((item) => item.request.id === id)
      : this.resolved[this.resolved.length - 1];
    if (!resolution) return null;

    this.resolved = this.resolved.filter((item) => item !== resolution);
    if (!this.pending.some((item) => item.id === resolution.request.id)) {
      this.pending = [...this.pending, resolution.request];
    }

    this.onUndo?.({
      request: resolution.request,
      previousDecision: resolution.decision,
      scope: resolution.scope,
    });
    this.emit();
    return resolution;
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

/** 创建审批队列控制器 */
export function createApprovalQueue(
  options: ApprovalQueueOptions = {},
): ApprovalQueueController {
  return new ApprovalQueueController(options);
}

export interface ApprovalConfirmOptions {
  queue: ApprovalQueueController;
}

/**
 * 由审批队列派生 `ChatConfirm`：session / always 授权命中直接放行，
 * 否则入队等待 UI 决议。不改变 ChatConfirm 的签名与现有 confirm 用法。
 */
export function createApprovalConfirm({
  queue,
}: ApprovalConfirmOptions): ChatConfirm {
  return async (request) => {
    if (queue.hasGrant(request.name)) return true;
    return queue.enqueue(request);
  };
}

export interface ApprovalQueueProps {
  queue: ApprovalQueueController;
  /** 队列标题，缺省取 i18n */
  title?: string;
  /** 无待审批请求时仍渲染标题（缺省隐藏整个队列） */
  showEmpty?: boolean;
  /**
   * `grouped` 按风险 high → medium → low 分组（组内保持入队顺序）；
   * 缺省 `list` 保持一期平铺顺序
   */
  layout?: 'list' | 'grouped';
  /** 结构化 payload 渲染（shell / diff / email 等由宿主决定）；缺省 JSON */
  renderPayload?: (request: ApprovalRequest) => ReactNode;
  /** 多选（受控）：selected 提供即受控 */
  selected?: string[];
  /** 多选变更 */
  onSelectedChange?: (ids: string[]) => void;
  /** 已决议区展示（缺省 true） */
  showResolved?: boolean;
  /** Undo 窗口（毫秒，缺省 5000；0 不展示 Undo） */
  undoMs?: number;
  className?: string;
  style?: CSSProperties;
}

const RISK_ORDER: readonly ApprovalRisk[] = ['high', 'medium', 'low'];

const riskBadgeClass: Record<ApprovalRisk, string> = {
  high: 'bg-warning/15 text-warning',
  medium: 'bg-info/15 text-info',
  low: 'bg-success/15 text-success',
};

/**
 * 审批队列 UI：展示待审批请求（payload + 授权范围 + 批准 / 拒绝）。
 * 决议经 `role="status"` 区域播报；空队列缺省不占位。
 *
 * 二期 opt-in：`layout="grouped"` 风险分组；行选择 + 批量决议（固定
 * once）；resolved log + Undo（重新入队）；`renderPayload` 结构化 payload。
 */
export function ApprovalQueue({
  queue,
  title,
  showEmpty = false,
  layout = 'list',
  renderPayload,
  selected,
  onSelectedChange,
  showResolved = true,
  undoMs = 5000,
  className,
  style,
}: ApprovalQueueProps) {
  const { t } = useI18n();
  const requests = useSyncExternalStore(
    queue.subscribe,
    queue.getSnapshot,
    queue.getSnapshot,
  );
  const resolved = useSyncExternalStore(
    queue.subscribe,
    queue.getResolvedSnapshot,
    queue.getResolvedSnapshot,
  );
  const [announcement, setAnnouncement] = useState('');
  const [innerSelected, setInnerSelected] = useState<string[]>([]);
  const [focusIndex, setFocusIndex] = useState(0);
  // Undo 窗口到期后强制重渲染（隐藏撤销入口）
  const [, setUndoTick] = useState(0);
  const undoLabelId = useId();

  const selectionControlled = selected !== undefined;
  const selectedIds = selectionControlled ? selected : innerSelected;
  const setSelectedIds = (ids: string[]): void => {
    if (!selectionControlled) {
      setInnerSelected(ids);
    }
    onSelectedChange?.(ids);
  };

  const lastResolution = resolved[resolved.length - 1];
  const undoRemaining =
    lastResolution && undoMs > 0
      ? undoMs - (Date.now() - lastResolution.resolvedAt)
      : 0;
  const undoAvailable = undoRemaining > 0;

  useEffect(() => {
    if (!undoAvailable) return;
    const timer = setTimeout(
      () => setUndoTick((tick) => tick + 1),
      undoRemaining,
    );
    return () => clearTimeout(timer);
  }, [undoAvailable, undoRemaining]);

  // 决议后清理已不在队列中的选择
  useEffect(() => {
    const pendingIds = new Set(requests.map((request) => request.id));
    const next = selectedIds.filter((id) => pendingIds.has(id));
    if (next.length !== selectedIds.length) {
      setSelectedIds(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

  if (
    requests.length === 0 &&
    !showEmpty &&
    !announcement &&
    !(showResolved && resolved.length > 0)
  ) {
    return null;
  }

  const pendingIds = requests.map((request) => request.id);
  const validSelected = selectedIds.filter((id) => pendingIds.includes(id));
  const allSelected =
    pendingIds.length > 0 && validSelected.length === pendingIds.length;

  const toggleSelected = (id: string): void => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );
  };

  const announceDecisions = (ids: string[], decision: ApprovalDecision): void => {
    const names = requests
      .filter((request) => ids.includes(request.id))
      .map((request) => request.name);
    setAnnouncement(
      decision === 'approved'
        ? t('pactor.chat.approval.bulk.approved', { count: names.length })
        : t('pactor.chat.approval.bulk.denied', { count: names.length }),
    );
  };

  const handleBulk = (decision: ApprovalDecision): void => {
    if (validSelected.length === 0) return;
    const ids = [...validSelected];
    announceDecisions(ids, decision);
    queue.decideMany(ids, decision);
    setSelectedIds([]);
  };

  const handleUndo = (): void => {
    if (!lastResolution) return;
    const restored = queue.undo(lastResolution.request.id);
    if (restored) {
      setAnnouncement(
        t('pactor.chat.approval.undone', {
          name: restored.request.name,
        }),
      );
      setUndoTick((tick) => tick + 1);
    }
  };

  // 渲染顺序（grouped 时按风险重排；键盘焦点与 DOM 顺序保持一致）
  const groups: Array<{ risk: ApprovalRisk; items: ApprovalRequest[] }> =
    layout === 'grouped'
      ? RISK_ORDER.map((risk) => ({
          risk,
          items: requests.filter(
            (request) => (request.risk ?? 'high') === risk,
          ),
        })).filter((group) => group.items.length > 0)
      : [{ risk: 'high', items: [...requests] }];
  const orderedRequests = groups.flatMap((group) => group.items);

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    request: ApprovalRequest,
    index: number,
  ): void => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const next =
        (index + delta + orderedRequests.length) %
        Math.max(orderedRequests.length, 1);
      setFocusIndex(next);
      const cards = event.currentTarget
        .closest('[data-slot=approval-queue]')
        ?.querySelectorAll<HTMLElement>('[data-slot=approval-card]');
      cards?.[next]?.focus();
      return;
    }
    if (event.target !== event.currentTarget) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      toggleSelected(request.id);
    }
  };

  const renderCard = (request: ApprovalRequest, index: number) => (
    <ApprovalCard
      key={request.id}
      request={request}
      index={index}
      selected={selectedIds.includes(request.id)}
      focusable={index === Math.min(focusIndex, orderedRequests.length - 1)}
      onToggleSelected={() => toggleSelected(request.id)}
      onKeyDown={(event) => handleRowKeyDown(event, request, index)}
      canPersistAlways={queue.canPersistAlways}
      renderPayload={renderPayload}
      onDecide={(decision, scope) => {
        queue.decide(request.id, decision, scope);
        setAnnouncement(
          decision === 'approved'
            ? t('pactor.chat.approval.approved', { name: request.name })
            : t('pactor.chat.approval.denied', { name: request.name }),
        );
      }}
    />
  );

  const firstIndexOf = (request: ApprovalRequest): number =>
    orderedRequests.findIndex((item) => item.id === request.id);

  return (
    <div
      data-slot="approval-queue"
      data-layout={layout}
      className={cn('flex flex-col gap-3', className)}
      style={style}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      {requests.length === 0 ? (
        showEmpty ? (
          <p className="text-xs text-muted-foreground">
            {t('pactor.chat.approval.empty')}
          </p>
        ) : null
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <Icon name="shield" size={16} />
            {title ?? t('pactor.chat.approval.title')}
            <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-xs font-normal text-muted-foreground">
              <input
                type="checkbox"
                data-slot="approval-select-all"
                aria-label={t('pactor.chat.approval.selectAll')}
                checked={allSelected}
                onChange={() =>
                  setSelectedIds(allSelected ? [] : [...pendingIds])
                }
              />
              {t('pactor.chat.approval.bulk.selectAll')}
            </label>
          </div>
          {validSelected.length > 0 ? (
            <div
              data-slot="approval-bulk-bar"
              className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/50 p-2"
            >
              <span className="text-xs font-medium">
                {t('pactor.chat.approval.bulk.selected', {
                  count: validSelected.length,
                })}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('pactor.chat.approval.bulk.onceOnly')}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulk('denied')}
                >
                  {t('pactor.chat.approval.bulk.deny')}
                </Button>
                <Button size="sm" onClick={() => handleBulk('approved')}>
                  {t('pactor.chat.approval.bulk.approve')}
                </Button>
              </div>
            </div>
          ) : null}
          {groups.map((group) => (
            <div
              key={group.risk}
              data-slot="approval-group"
              data-risk={group.risk}
              className="flex flex-col gap-2"
            >
              {layout === 'grouped' ? (
                <div className="text-xs font-medium text-muted-foreground">
                  {t(`pactor.chat.approval.group.${group.risk}`)}
                </div>
              ) : null}
              {group.items.map((request) =>
                renderCard(request, firstIndexOf(request)),
              )}
            </div>
          ))}
        </>
      )}
      {showResolved && resolved.length > 0 ? (
        <div
          data-slot="approval-resolved"
          className="flex flex-col gap-2 border-t border-border pt-2"
        >
          <div className="text-xs font-medium text-muted-foreground">
            {t('pactor.chat.approval.resolvedCount', {
              count: resolved.length,
            })}
          </div>
          <ul className="flex flex-col gap-1">
            {resolved.map((resolution) => {
              const isLast = resolution === lastResolution;
              return (
                <li
                  key={`${resolution.request.id}-${resolution.resolvedAt}`}
                  data-slot="approval-resolved-item"
                  data-decision={resolution.decision}
                  className="flex items-center gap-2 rounded-sm px-2 py-1 text-xs text-muted-foreground"
                >
                  <Icon
                    name={
                      resolution.decision === 'approved'
                        ? 'circle-check'
                        : 'circle-x'
                    }
                    size={12}
                    className={
                      resolution.decision === 'approved'
                        ? 'text-success'
                        : 'text-destructive'
                    }
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {resolution.request.name}
                  </span>
                  <span>
                    {t(
                      resolution.decision === 'approved'
                        ? 'pactor.chat.approval.approvedLabel'
                        : 'pactor.chat.approval.deniedLabel',
                    )}
                  </span>
                  {isLast && undoAvailable ? (
                    <button
                      type="button"
                      data-slot="approval-undo"
                      aria-label={t('pactor.chat.approval.undo')}
                      aria-describedby={undoLabelId}
                      className="cursor-pointer rounded-sm px-1.5 py-0.5 font-medium text-primary hover:bg-accent"
                      onClick={handleUndo}
                    >
                      {t('pactor.chat.approval.undo')}
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {undoAvailable ? (
            <span id={undoLabelId} className="sr-only">
              {t('pactor.chat.approval.undoHint')}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

const SCOPES: readonly ApprovalScope[] = ['once', 'session', 'always'];

interface ApprovalCardProps {
  request: ApprovalRequest;
  index: number;
  selected: boolean;
  focusable: boolean;
  onToggleSelected: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  canPersistAlways: boolean;
  renderPayload?: (request: ApprovalRequest) => ReactNode;
  onDecide: (decision: ApprovalDecision, scope: ApprovalScope) => void;
}

function ApprovalCard({
  request,
  index,
  selected,
  focusable,
  onToggleSelected,
  onKeyDown,
  canPersistAlways,
  renderPayload,
  onDecide,
}: ApprovalCardProps) {
  const { t } = useI18n();
  const [scope, setScope] = useState<ApprovalScope>('once');
  const scopeLabelId = useId();
  const risk = request.risk ?? 'high';

  const paramsText = JSON.stringify(request.params, null, 2);
  const scopes = canPersistAlways
    ? SCOPES
    : SCOPES.filter((item) => item !== 'always');

  return (
    <div
      data-slot="approval-card"
      data-index={index}
      data-selected={selected || undefined}
      data-risk={risk}
      tabIndex={focusable ? 0 : -1}
      onKeyDown={onKeyDown}
      className={cn(
        'rounded-lg border bg-card p-3 text-card-foreground shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        selected && 'ring-1 ring-primary',
      )}
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          data-slot="approval-select"
          aria-label={t('pactor.chat.approval.select', { name: request.name })}
          checked={selected}
          onChange={onToggleSelected}
          className="mt-1 shrink-0"
        />
        <Icon name="shield" size={16} className="mt-0.5 text-warning" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{request.name}</p>
          <p className="text-xs text-muted-foreground">
            {t('pactor.chat.approval.description')}
          </p>
        </div>
        <span
          data-slot="approval-risk"
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
            riskBadgeClass[risk],
          )}
        >
          {t(`pactor.chat.approval.risk.${risk}`)}
        </span>
      </div>

      <div data-slot="approval-payload" className="mt-2">
        <div className="text-xs font-medium text-muted-foreground">
          {t('pactor.chat.approval.payload')}
        </div>
        {renderPayload ? (
          renderPayload(request)
        ) : (
          <pre className="mt-1 max-h-40 overflow-auto rounded-md bg-muted p-2 text-xs whitespace-pre-wrap break-all">
            {paramsText}
          </pre>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div
          role="radiogroup"
          aria-labelledby={scopeLabelId}
          className="flex items-center gap-1"
        >
          <span id={scopeLabelId} className="sr-only">
            {t('pactor.chat.approval.scope')}
          </span>
          {scopes.map((item) => (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={scope === item}
              onClick={() => setScope(item)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs transition-colors',
                scope === item
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-input text-muted-foreground hover:text-foreground',
              )}
            >
              {t(`pactor.chat.approval.scope.${item}`)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDecide('denied', scope)}
          >
            {t('pactor.chat.approval.deny')}
          </Button>
          <Button size="sm" onClick={() => onDecide('approved', scope)}>
            {t('pactor.chat.approval.approve')}
          </Button>
        </div>
      </div>
    </div>
  );
}
