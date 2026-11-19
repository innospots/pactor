import { useId, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { useI18n } from '@pactor-app/runtime';
import { Icon } from '@pactor-app/ui/components';
import { Button } from '@pactor-app/ui/ui';

import type { ChatConfirm, ChatConfirmRequest } from './capability-action.js';
import { cn } from './lib/utils.js';

/**
 * 高风险审批队列 POC（文档站「组件交付 / 审批队列」一项）：
 * 保持 `ChatConfirm` 公开签名不变，由宿主选择接入：
 *
 * ```tsx
 * const queue = createApprovalQueue({ onDecision: audit });
 * const confirm = createApprovalConfirm({ queue });
 * registerCapabilityAction(actions, { capabilities, confirm });
 * // 在宿主 UI 中渲染 <ApprovalQueue queue={queue} />（缺省隐藏空态）
 * ```
 *
 * 一期范围：`risk: 'high'` + once / session 授权 + 单请求顺序处理；
 * `always` 仅在宿主提供 `persistGrant` 时展示（持久化由宿主决定）。
 * 批量、undo、中风险分级与 diff 渲染留待二期。
 */

/** 风险等级：POC 只处理 high，medium / low 预留 */
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

export interface ApprovalQueueOptions {
  /** 请求 id 生成器（缺省自增） */
  createId?: () => string;
  /** always 授权持久化；提供后 UI 才展示「始终允许」 */
  persistGrant?: (name: string, scope: 'always') => void | Promise<void>;
  /** 决议回调：宿主在此写审计事件 / transcript */
  onDecision?: (event: ApprovalDecisionEvent) => void;
}

const EMPTY: readonly ApprovalRequest[] = [];

/**
 * 审批队列控制器（框架无关；组件经 useSyncExternalStore 订阅）。
 * 同一 capability 的 session 授权命中后不再入队，由 confirm 直接放行。
 */
export class ApprovalQueueController {
  private pending: readonly ApprovalRequest[] = EMPTY;
  private readonly listeners = new Set<() => void>();
  private readonly resolvers = new Map<string, (approved: boolean) => void>();
  private readonly grants = new Set<string>();
  private seq = 0;
  private readonly createId: () => string;
  private readonly persistGrant?: ApprovalQueueOptions['persistGrant'];
  private readonly onDecision?: ApprovalQueueOptions['onDecision'];

  constructor(options: ApprovalQueueOptions = {}) {
    this.createId = options.createId ?? (() => `approval-${++this.seq}`);
    this.persistGrant = options.persistGrant;
    this.onDecision = options.onDecision;
  }

  /** 宿主是否提供了 always 持久化 */
  get canPersistAlways(): boolean {
    return this.persistGrant !== undefined;
  }

  /** 当前待审批请求（快照，引用随变更替换） */
  getSnapshot = (): readonly ApprovalRequest[] => this.pending;

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
   */
  enqueue(request: ChatConfirmRequest): Promise<boolean> {
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

    this.onDecision?.({ request: entry, decision, scope });
    this.emit();
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
  className?: string;
  style?: CSSProperties;
}

/**
 * 审批队列 UI：逐条展示高风险请求（参数 JSON）+ 授权范围 + 批准 / 拒绝。
 * 决议经 `role="status"` 区域播报；空队列缺省不占位。
 */
export function ApprovalQueue({
  queue,
  title,
  showEmpty = false,
  className,
  style,
}: ApprovalQueueProps) {
  const { t } = useI18n();
  const requests = useSyncExternalStore(
    queue.subscribe,
    queue.getSnapshot,
    queue.getSnapshot,
  );
  const [announcement, setAnnouncement] = useState('');

  if (requests.length === 0 && !showEmpty && !announcement) return null;

  return (
    <div
      data-slot="approval-queue"
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
          <div className="flex items-center gap-2 text-sm font-medium">
            <Icon name="shield" size={16} />
            {title ?? t('pactor.chat.approval.title')}
          </div>
          {requests.map((request) => (
            <ApprovalCard
              key={request.id}
              request={request}
              canPersistAlways={queue.canPersistAlways}
              onDecide={(decision, scope) => {
                queue.decide(request.id, decision, scope);
                setAnnouncement(
                  decision === 'approved'
                    ? t('pactor.chat.approval.approved', { name: request.name })
                    : t('pactor.chat.approval.denied', { name: request.name }),
                );
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

const SCOPES: readonly ApprovalScope[] = ['once', 'session', 'always'];

interface ApprovalCardProps {
  request: ApprovalRequest;
  canPersistAlways: boolean;
  onDecide: (decision: ApprovalDecision, scope: ApprovalScope) => void;
}

function ApprovalCard({
  request,
  canPersistAlways,
  onDecide,
}: ApprovalCardProps) {
  const { t } = useI18n();
  const [scope, setScope] = useState<ApprovalScope>('once');
  const scopeLabelId = useId();

  const paramsText = JSON.stringify(request.params, null, 2);
  const scopes = canPersistAlways
    ? SCOPES
    : SCOPES.filter((item) => item !== 'always');

  return (
    <div
      data-slot="approval-card"
      className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
    >
      <div className="flex items-start gap-2">
        <Icon name="shield" size={16} className="mt-0.5 text-warning" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{request.name}</p>
          <p className="text-xs text-muted-foreground">
            {t('pactor.chat.approval.description')}
          </p>
        </div>
        <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning">
          {t('pactor.chat.approval.risk.high')}
        </span>
      </div>

      <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-muted p-2 text-xs whitespace-pre-wrap break-all">
        {paramsText}
      </pre>

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
