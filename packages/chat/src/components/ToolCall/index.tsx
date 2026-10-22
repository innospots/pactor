import { useI18n } from '@pactor-app/runtime';
import { useState, type CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';

/** 工具调用状态 */
export type ToolCallStatus = 'running' | 'done' | 'error';

export interface ToolCallProps {
  /** 工具名称 */
  name?: string;
  /** 调用参数（对象按 JSON 缩进展示，字符串原样展示） */
  params?: unknown;
  /** 状态，默认 done */
  status?: ToolCallStatus;
  /** 调用结果文本 */
  result?: string;
  /** 耗时（毫秒，展示为秒） */
  durationMs?: number;
  /** 非受控初始展开（缺省：running 展开、其余折叠） */
  defaultExpanded?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const statusIcon: Record<ToolCallStatus, { icon: string; className: string; spin?: boolean }> = {
  running: { icon: 'loader-circle', className: 'text-info', spin: true },
  done: { icon: 'circle-check', className: 'text-success' },
  error: { icon: 'circle-x', className: 'text-destructive' },
};

function renderValue(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * ToolCall 适配器（shadcn kit）：工具调用——无边框无底色：头部
 * （terminal 图标 + 名称 + 状态 + 耗时 + chevron 紧随其后）可折叠，
 * 展开后参数 / 结果仅以浅色文字呈现；缺省 running 展开、done / error 折叠。
 */
export function ToolCall({ name, params, status = 'done', result, durationMs, defaultExpanded, className, style }: ToolCallProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(defaultExpanded ?? status === 'running');
  const meta = statusIcon[status];
  const paramsText = renderValue(params);
  // 无参数且无结果时不可展开：头部纯展示，不渲染 chevron、不响应点击
  const hasDetail = Boolean(paramsText) || Boolean(result);

  const headerInner = (
    <>
      <span className="shrink-0 text-muted-foreground">
        <Icon name="terminal" size="sm" />
      </span>
      <span data-slot="tool-call-name" className="min-w-0 truncate font-medium">
        {name ?? t('pactor.chat.toolCall.title')}
      </span>
      <span className={cn('shrink-0', meta.className, meta.spin && 'animate-spin motion-reduce:animate-none')}>
        <Icon name={meta.icon} size="sm" />
      </span>
      {durationMs !== undefined ? (
        <span className="shrink-0 text-xs text-muted-foreground">{(durationMs / 1000).toFixed(1)}s</span>
      ) : null}
      {hasDetail ? (
        <span className="shrink-0 text-muted-foreground">
          <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size="sm" />
        </span>
      ) : null}
    </>
  );

  return (
    <div
      data-slot="tool-call"
      data-status={status}
      className={cn('w-full', className)}
      style={style}
    >
      {hasDetail ? (
        <button
          type="button"
          data-slot="tool-call-trigger"
          aria-expanded={expanded}
          className="flex w-full cursor-pointer items-center gap-2 py-1 text-left text-sm"
          onClick={() => setExpanded((value) => !value)}
        >
          {headerInner}
        </button>
      ) : (
        <div
          data-slot="tool-call-trigger"
          className="flex w-full items-center gap-2 py-1 text-left text-sm"
        >
          {headerInner}
        </div>
      )}
      {hasDetail && expanded ? (
        <div data-slot="tool-call-body" className="flex flex-col gap-2 py-1 pl-6">
          {paramsText ? (
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                {t('pactor.chat.toolCall.args')}
              </div>
              <pre data-slot="tool-call-params" className="mt-1 overflow-x-auto text-xs whitespace-pre-wrap text-muted-foreground">
                {paramsText}
              </pre>
            </div>
          ) : null}
          {result ? (
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                {t('pactor.chat.toolCall.result')}
              </div>
              <pre data-slot="tool-call-result" className="mt-1 overflow-x-auto text-xs whitespace-pre-wrap text-muted-foreground">
                {result}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
