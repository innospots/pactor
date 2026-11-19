import { useI18n } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';

/** 上下文分段：label + tokens；pinned 在 card 图例中标记为常驻 */
export interface ContextWindowSegment {
  label: string;
  tokens: number;
  /** 常驻上下文（如系统提示），图例中带 pin 标记 */
  pinned?: boolean;
  /** 自定义颜色（CSS 颜色值；缺省按分段顺序取 chart-1…5） */
  color?: string;
}

export interface ContextWindowMeterProps {
  /** 上下文窗口上限（tokens，宿主按模型提供） */
  limit: number;
  /** 分段明细（合计超过 limit 时按已用量归一展示） */
  segments?: ContextWindowSegment[];
  /** 当前模型名（右侧弱化展示） */
  model?: string;
  /** 告警阈值（占比 0–1，缺省 0.8）：达到后计数变警示色并显示压缩入口 */
  warnAt?: number;
  /** inline：20 格 composer footer；card：分段条形 + 图例面板 */
  variant?: 'inline' | 'card';
  /** 压缩上下文回调（策略由宿主实现；达到 warnAt 后展示按钮） */
  onCompact?: () => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const SEGMENT_CLASSES = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
] as const;

const INLINE_CELLS = 20;

function formatTokens(value: number): string {
  return String(Math.max(0, Math.round(value)));
}

/**
 * ContextWindowMeter：纯展示的上下文用量表（不内置 tokenizer）。
 * 数据（limit / segments / model）全部由宿主提供；`warnAt` 后计数变
 * 警示色并展示 Compact 入口，压缩策略由 onCompact 宿主实现。
 */
export function ContextWindowMeter({
  limit,
  segments = [],
  model,
  warnAt = 0.8,
  variant = 'inline',
  onCompact,
  className,
  style,
}: ContextWindowMeterProps) {
  const { t } = useI18n();
  const used = segments.reduce(
    (sum, segment) => sum + Math.max(0, segment.tokens),
    0,
  );
  const ratio = limit > 0 ? used / limit : used > 0 ? 1 : 0;
  const percent = Math.min(Math.round(ratio * 100), 100);
  const warning = ratio >= warnAt;
  const compactVisible = warning && onCompact !== undefined;
  const usageText = t('pactor.chat.contextMeter.tokens', {
    used: formatTokens(used),
    limit: formatTokens(limit),
  });
  const valueText = `${t('pactor.chat.contextMeter.tokens', {
    used: formatTokens(used),
    limit: formatTokens(limit),
  })} · ${t('pactor.chat.contextMeter.used', { percent })}`;
  const progressRole = (
    <span
      data-slot="context-window-value"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={Math.max(limit, 1)}
      aria-valuenow={Math.min(used, Math.max(limit, 1))}
      aria-valuetext={valueText}
      className={cn(
        'tabular-nums',
        warning ? 'text-warning' : 'text-muted-foreground',
      )}
    >
      {usageText}
    </span>
  );
  const warningText = warning ? (
    <span data-slot="context-window-warning" className="sr-only">
      {t('pactor.chat.contextMeter.warning')}
    </span>
  ) : null;
  const compactButton = compactVisible ? (
    <button
      type="button"
      data-slot="context-window-compact"
      className="shrink-0 rounded border border-warning/40 px-1.5 py-0.5 text-[11px] font-medium text-warning hover:bg-warning/10"
      onClick={onCompact}
    >
      {t('pactor.chat.contextMeter.compact')}
    </button>
  ) : null;

  if (variant === 'inline') {
    const filled = Math.min(
      INLINE_CELLS,
      Math.ceil((percent / 100) * INLINE_CELLS),
    );
    return (
      <div
        data-slot="context-window-meter"
        data-variant="inline"
        data-level={warning ? 'warning' : 'normal'}
        className={cn(
          'flex min-w-0 items-center gap-2 text-xs text-muted-foreground',
          className,
        )}
        style={style}
      >
        {model ? (
          <span
            data-slot="context-window-model"
            className="shrink-0 truncate"
          >
            {model}
          </span>
        ) : null}
        <span
          data-slot="context-window-grid"
          aria-hidden="true"
          className="grid shrink-0 grid-cols-[repeat(20,4px)] gap-px"
        >
          {Array.from({ length: INLINE_CELLS }, (_, cell) => (
            <span
              key={cell}
              data-filled={cell < filled ? 'true' : 'false'}
              className={cn(
                'h-2.5 w-1 rounded-[1px]',
                cell < filled
                  ? warning
                    ? 'bg-warning'
                    : 'bg-primary'
                  : 'bg-muted',
              )}
            />
          ))}
        </span>
        {progressRole}
        {warningText}
        {compactButton}
      </div>
    );
  }

  const scale = Math.max(used, limit, 1);
  return (
    <section
      data-slot="context-window-meter"
      data-variant="card"
      data-level={warning ? 'warning' : 'normal'}
      aria-label={t('pactor.chat.contextMeter.label')}
      className={cn(
        'flex w-full flex-col gap-2 rounded-md border border-border p-3',
        className,
      )}
      style={style}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium">
          {t('pactor.chat.contextMeter.label')}
        </span>
        <span className="flex-1" />
        {warningText}
        {progressRole}
        {model ? (
          <span
            data-slot="context-window-model"
            className="text-xs text-muted-foreground"
          >
            {model}
          </span>
        ) : null}
      </div>
      <div
        data-slot="context-window-bar"
        aria-hidden="true"
        className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        {segments.map((segment, index) => (
          <span
            key={`${segment.label}-${index}`}
            data-slot="context-window-bar-segment"
            className={cn(
              'h-full shrink-0',
              segment.color ? undefined : SEGMENT_CLASSES[index % SEGMENT_CLASSES.length],
            )}
            style={{
              width: `${(Math.max(0, segment.tokens) / scale) * 100}%`,
              ...(segment.color ? { backgroundColor: segment.color } : {}),
            }}
          />
        ))}
      </div>
      {segments.length > 0 ? (
        <ul
          data-slot="context-window-legend"
          aria-label={t('pactor.chat.contextMeter.segments')}
          className="flex flex-col gap-1 text-xs"
        >
          {segments.map((segment, index) => (
            <li
              key={`${segment.label}-${index}`}
              data-slot="context-window-legend-item"
              data-pinned={segment.pinned ? 'true' : undefined}
              className="flex items-center gap-1.5"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'size-2 shrink-0 rounded-full',
                  segment.color ? undefined : SEGMENT_CLASSES[index % SEGMENT_CLASSES.length],
                )}
                style={segment.color ? { backgroundColor: segment.color } : undefined}
              />
              {segment.pinned ? (
                <span
                  data-slot="context-window-pinned"
                  className="shrink-0 text-muted-foreground"
                >
                  <Icon name="pin" size={11} />
                </span>
              ) : null}
              <span className="min-w-0 flex-1 truncate">{segment.label}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatTokens(segment.tokens)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {t('pactor.chat.contextMeter.remaining', {
            tokens: formatTokens(Math.max(0, limit - used)),
          })}
        </span>
        <span className="flex-1" />
        {compactButton}
      </div>
    </section>
  );
}
