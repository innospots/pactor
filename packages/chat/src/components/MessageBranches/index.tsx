import { useI18n } from '@pactor-app/runtime';
import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';

/** 版本来源：原始回答 / 重新生成 / 编辑提示后重答 */
export type MessageBranchKind = 'original' | 'regenerated' | 'edited';

/** 消息版本：content 由宿主渲染（Markdown / 富文本 / 任意 ReactNode） */
export interface MessageBranchVersion {
  /** 稳定 id（切换回调透传） */
  id: string;
  /** 版本来源；缺省首项 original、其余 regenerated */
  kind?: MessageBranchKind;
  content: ReactNode;
  /** 覆盖缺省文案（如「初稿 / 修订版」） */
  label?: string;
  /** 次要信息（模型名、时间等） */
  meta?: string;
  /** kind=edited 时的编辑后提示词 */
  prompt?: string;
  /** 该分支后续轮数（分支图展示） */
  turnsAfter?: number;
}

export interface MessageBranchesProps {
  /** 同一回答的全部版本（旧 → 新）；空数组不渲染 */
  versions: MessageBranchVersion[];
  /** 受控当前版本下标；缺省自持（defaultIndex，再缺省末项） */
  index?: number;
  /** 非受控初始下标 */
  defaultIndex?: number;
  /** 切换事件（箭头 / 分支图均经此传出） */
  onIndexChange?: (index: number, version: MessageBranchVersion) => void;
  /** 提供时在切换器旁展示「重新生成」 */
  onRegenerate?: () => void;
  /** inline：‹ 2 / 3 › 切换器；map：逐版本分支列表 */
  variant?: 'inline' | 'map';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const KIND_ICON: Record<MessageBranchKind, string> = {
  original: 'message-square',
  regenerated: 'refresh-ccw',
  edited: 'square-pen',
};

function clampIndex(value: number, length: number): number {
  if (length <= 0) return 0;
  return Math.min(Math.max(value, 0), length - 1);
}

/**
 * MessageBranches 展示层：宿主持有版本数据与分支切换语义（pactor 不
 * 改 ConversationStore）。inline 在回答下方渲染 `‹ 2 / 3 ›` 切换器并
 * 支持 ←/→（含 ↑/↓）键盘切换；map 逐版本列出，点击切换。
 * 编辑后重答版本展示编辑过的提示词；切换只经 onIndexChange 上报。
 */
export function MessageBranches({
  versions,
  index,
  defaultIndex,
  onIndexChange,
  onRegenerate,
  variant = 'inline',
  className,
  style,
}: MessageBranchesProps) {
  const { t } = useI18n();
  const [innerIndex, setInnerIndex] = useState(() =>
    clampIndex(defaultIndex ?? versions.length - 1, versions.length),
  );
  const controlled = index !== undefined;
  const current = clampIndex(controlled ? index : innerIndex, versions.length);
  const version = versions[current];

  if (!version) {
    return null;
  }

  const kindOf = (item: MessageBranchVersion, at: number): MessageBranchKind =>
    item.kind ?? (at === 0 ? 'original' : 'regenerated');
  const labelOf = (item: MessageBranchVersion, at: number): string =>
    item.label ?? t(`pactor.chat.branches.${kindOf(item, at)}`);
  const kind = kindOf(version, current);

  const go = (next: number): void => {
    const target = clampIndex(next, versions.length);
    if (target === current) return;
    if (!controlled) setInnerIndex(target);
    onIndexChange?.(target, versions[target]!);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const delta =
      event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? -1
        : event.key === 'ArrowRight' || event.key === 'ArrowDown'
          ? 1
          : 0;
    if (delta === 0) return;
    event.preventDefault();
    go(current + delta);
  };

  return (
    <div
      data-slot="message-branches"
      data-variant={variant}
      data-kind={kind}
      data-index={current}
      data-total={versions.length}
      role="group"
      aria-label={t('pactor.chat.branches.label')}
      className={cn('flex w-full flex-col gap-2', className)}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {kind === 'edited' && version.prompt ? (
        <div
          data-slot="message-branches-prompt"
          className="flex items-start gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground"
        >
          <Icon name="square-pen" size={13} />
          <span>
            <span className="sr-only">
              {t('pactor.chat.branches.editedPrompt')}
            </span>
            {version.prompt}
          </span>
        </div>
      ) : null}
      <div data-slot="message-branches-content">{version.content}</div>
      {variant === 'inline' ? (
        <div
          data-slot="message-branches-switcher"
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <button
            type="button"
            data-slot="message-branches-prev"
            aria-label={t('pactor.chat.branches.previous')}
            disabled={current === 0}
            className="rounded p-0.5 hover:bg-accent hover:text-foreground disabled:opacity-40"
            onClick={() => go(current - 1)}
          >
            <Icon name="chevron-left" size={14} />
          </button>
          <span
            data-slot="message-branches-counter"
            aria-live="polite"
            aria-atomic="true"
            className="flex items-center gap-1.5"
          >
            <span>{labelOf(version, current)}</span>
            <span className="tabular-nums">
              {t('pactor.chat.branches.position', {
                index: current + 1,
                total: versions.length,
              })}
            </span>
            {version.meta ? (
              <span className="text-muted-foreground/70">{version.meta}</span>
            ) : null}
          </span>
          <button
            type="button"
            data-slot="message-branches-next"
            aria-label={t('pactor.chat.branches.next')}
            disabled={current === versions.length - 1}
            className="rounded p-0.5 hover:bg-accent hover:text-foreground disabled:opacity-40"
            onClick={() => go(current + 1)}
          >
            <Icon name="chevron-right" size={14} />
          </button>
          {onRegenerate ? (
            <button
              type="button"
              data-slot="message-branches-regenerate"
              aria-label={t('pactor.chat.message.regenerate')}
              className="rounded p-0.5 hover:bg-accent hover:text-foreground"
              onClick={onRegenerate}
            >
              <Icon name="refresh-cw" size={14} />
            </button>
          ) : null}
        </div>
      ) : (
        <ol
          data-slot="message-branches-map"
          className="flex flex-col gap-0.5"
          aria-label={t('pactor.chat.branches.map')}
        >
          {versions.map((item, at) => {
            const itemKind = kindOf(item, at);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  data-slot="message-branches-map-item"
                  data-kind={itemKind}
                  data-current={at === current ? 'true' : undefined}
                  aria-label={t('pactor.chat.branches.switch', {
                    index: at + 1,
                  })}
                  aria-current={at === current ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-xs',
                    at === current
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                  )}
                  onClick={() => go(at)}
                >
                  <Icon name={KIND_ICON[itemKind]} size={13} />
                  <span className="min-w-0 flex-1 truncate">
                    {labelOf(item, at)}
                  </span>
                  {item.meta ? (
                    <span className="shrink-0 text-muted-foreground/70">
                      {item.meta}
                    </span>
                  ) : null}
                  {item.turnsAfter ? (
                    <span
                      data-slot="message-branches-turns"
                      className="shrink-0 text-muted-foreground/70"
                    >
                      +{item.turnsAfter}
                    </span>
                  ) : null}
                  {at === current ? (
                    <Icon name="check" size={13} />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
