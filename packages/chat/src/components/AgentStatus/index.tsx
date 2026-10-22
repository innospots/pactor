import type { CSSProperties } from 'react';

import { useI18n } from '@pactor-app/runtime';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';

/** 智能体状态 */
export type AgentStatusType = 'running' | 'waiting' | 'done' | 'error';

export interface AgentStatusProps {
  /** 状态，默认 running */
  status?: AgentStatusType;
  /** 状态文本 */
  text?: string;
  /** 耗时（秒，展示为「已用时 Xs」） */
  elapsed?: number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const statusMeta: Record<AgentStatusType, { icon: string; className: string; spin?: boolean }> = {
  running: { icon: 'loader-circle', className: 'text-info', spin: true },
  waiting: { icon: 'clock', className: 'text-warning' },
  done: { icon: 'circle-check', className: 'text-success' },
  error: { icon: 'circle-x', className: 'text-destructive' },
};

/**
 * AgentStatus 适配器（shadcn kit）：智能体运行 / 等待状态行——
 * 状态图标（running 旋转）+ 文本 + 可选耗时。
 * 与通用分类 Status 的差异：面向智能体执行过程（含耗时语义）。
 */
export function AgentStatus({ status = 'running', text, elapsed, className, style }: AgentStatusProps) {
  const { t } = useI18n();
  const meta = statusMeta[status];
  return (
    <div
      data-slot="agent-status"
      data-status={status}
      className={cn('flex items-center gap-2 text-sm', className)}
      style={style}
    >
      <span className={cn(meta.className, meta.spin && 'animate-spin motion-reduce:animate-none')}>
        <Icon name={meta.icon} size="sm" />
      </span>
      {text ? <span data-slot="agent-status-text">{text}</span> : null}
      {elapsed !== undefined ? (
        <span data-slot="agent-status-elapsed" className="text-xs text-muted-foreground">
          {t('pactor.chat.agentStatus.elapsed', { seconds: elapsed })}
        </span>
      ) : null}
    </div>
  );
}
