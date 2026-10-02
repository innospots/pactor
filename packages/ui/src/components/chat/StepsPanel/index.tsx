import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../../components/Icon/index.js';

export interface StepsPanelItemData {
  title: string;
  description?: string;
  /** done 已完成 / running 进行中 / pending 待执行（缺省 pending） */
  status?: 'done' | 'running' | 'pending';
  duration?: string;
}

export interface StepsPanelProps {
  /** 面板标题（缺省「执行步骤」） */
  title?: string;
  /** 步骤列表（DSL 绑定 ${data.steps}） */
  steps?: StepsPanelItemData[];
  /** 空态文案（steps 为空时展示） */
  emptyText?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * StepsPanel 执行步骤面板（chat 目录）：纵向时间线展示任务执行步骤，
 * 状态图标区分已完成 / 进行中 / 待执行。典型用法是作为 ChatPage
 * 对话图标栏 popover 项的 content（`type: "StepsPanel"`），
 * 样式全走语义令牌（深浅色/换肤自适应）。
 */
export function StepsPanel({
  title = '执行步骤',
  steps = [],
  emptyText = '当前会话暂无执行步骤',
  className,
  style,
}: StepsPanelProps) {
  return (
    <div
      data-slot="steps-panel"
      className={cn('px-3.5 py-3 text-foreground', className)}
      style={style}
    >
      <div className="mb-1 text-[13px] font-semibold">{title}</div>
      {steps.length === 0 ? (
        <div className="py-4 text-center text-[13px] text-muted-foreground">{emptyText}</div>
      ) : (
        <ol>
          {steps.map((step, index) => {
            const status = step.status ?? 'pending';
            return (
              <li
                key={`${step.title}-${index}`}
                data-status={status}
                className={cn(
                  'relative flex gap-2 py-1.5',
                  // 步骤之间的连接线（对齐 16px 图标中心）
                  'not-last:before:absolute not-last:before:left-[7.5px] not-last:before:top-7 not-last:before:-bottom-1 not-last:before:w-px not-last:before:bg-border not-last:before:content-[""]',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-4 shrink-0 items-center justify-center',
                    status !== 'pending' && 'text-primary',
                  )}
                >
                  {status === 'done' ? (
                    <Icon name="check-circle" size={16} />
                  ) : status === 'running' ? (
                    <Icon
                      name="loading"
                      size={16}
                      className="animate-spin motion-reduce:animate-none"
                    />
                  ) : (
                    <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      'text-[13px] leading-5',
                      status === 'pending' && 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description ? (
                    <div className="mt-0.5 text-xs leading-[18px] text-muted-foreground">
                      {step.description}
                    </div>
                  ) : null}
                </div>
                {step.duration ? (
                  <span className="shrink-0 text-xs leading-5 text-muted-foreground">
                    {step.duration}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
