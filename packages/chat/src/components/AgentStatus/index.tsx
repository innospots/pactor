import type { CSSProperties } from 'react';

import { useI18n } from '@pactor-app/runtime';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';

/** 智能体状态 */
export type AgentStatusType = 'running' | 'waiting' | 'done' | 'error';

/** 执行步骤（当前步骤 + 已完成步骤，宿主按运行事件更新） */
export interface AgentStatusStep {
  label: string;
  /** 缺省 running（正在执行的步骤） */
  status?: AgentStatusType;
  /** 步骤补充说明（如工具名、错误信息） */
  detail?: string;
}

export interface AgentStatusProps {
  /** 状态，默认 running */
  status?: AgentStatusType;
  /** 状态文本 */
  text?: string;
  /** 耗时（秒，展示为「已用时 Xs」） */
  elapsed?: number;
  /** 分步执行明细（可选；空数组等同未提供） */
  steps?: AgentStatusStep[];
  /** 停止事件（running / waiting 时展示停止按钮；由宿主中断运行） */
  onStop?: () => void;
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
export function AgentStatus({
  status = 'running',
  text,
  elapsed,
  steps,
  onStop,
  className,
  style,
}: AgentStatusProps) {
  const { t } = useI18n();
  const meta = statusMeta[status];
  const showStop = onStop !== undefined && (status === 'running' || status === 'waiting');
  return (
    <div
      data-slot="agent-status"
      data-status={status}
      className={cn('flex flex-wrap items-center gap-2 text-sm', className)}
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
      {showStop ? (
        <button
          type="button"
          data-slot="agent-status-stop"
          aria-label={t('pactor.chat.agentStatus.stop')}
          className="ml-auto flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={onStop}
        >
          <Icon name="square" size={11} />
          {t('pactor.chat.agentStatus.stop')}
        </button>
      ) : null}
      {steps && steps.length > 0 ? (
        <ol
          data-slot="agent-status-steps"
          aria-label={t('pactor.chat.agentStatus.steps')}
          className="flex w-full flex-col gap-1 border-t border-border pt-1.5"
        >
          {steps.map((step, index) => {
            const stepStatus = step.status ?? 'running';
            const stepMeta = statusMeta[stepStatus];
            return (
              <li
                key={`${step.label}-${index}`}
                data-slot="agent-status-step"
                data-status={stepStatus}
                className="flex items-start gap-1.5 text-xs text-muted-foreground"
              >
                <span
                  className={cn(
                    'mt-0.5 shrink-0',
                    stepMeta.className,
                    stepMeta.spin && 'animate-spin motion-reduce:animate-none',
                  )}
                >
                  <Icon name={stepMeta.icon} size={12} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-foreground">{step.label}</span>
                  {step.detail ? (
                    <span data-slot="agent-status-step-detail" className="ml-1.5 text-muted-foreground">
                      {step.detail}
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
