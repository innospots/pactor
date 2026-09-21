import { Fragment, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

/** 步骤状态；缺省按 current 推导（小于 current 为 finish，等于为 process，大于为 wait） */
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export interface StepItemData {
  /** 步骤标题 */
  title: string;
  /** 步骤描述 */
  description?: string;
  /** 显式指定状态（覆盖按 current 的推导） */
  status?: StepStatus;
  /** 自定义图标名（Icon 白名单）；提供时替代序号 / 状态图标 */
  icon?: string;
}

export interface StepsProps {
  /** 步骤列表（可含表达式解析后的数组） */
  items?: StepItemData[];
  /** 当前步骤下标（从 0 开始），默认 0 */
  current?: number;
  /** 方向，默认 horizontal */
  direction?: 'horizontal' | 'vertical';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const iconBoxClass: Record<StepStatus, string> = {
  finish: 'border-primary text-primary',
  process: 'border-primary bg-primary text-primary-foreground',
  wait: 'border-border text-muted-foreground',
  error: 'border-destructive text-destructive',
};

const titleClass: Record<StepStatus, string> = {
  finish: 'text-foreground',
  process: 'font-semibold text-foreground',
  wait: 'text-muted-foreground',
  error: 'text-destructive',
};

function statusIcon(status: StepStatus): string | null {
  if (status === 'finish') return 'check';
  if (status === 'error') return 'x';
  return null;
}

/**
 * Steps 适配器（shadcn kit）：流程步骤条；状态按 current 推导、可被
 * item.status 覆盖，图标优先级 item.icon > 状态图标（√/×）> 序号。
 */
export function Steps({ items = [], current = 0, direction = 'horizontal', className, style }: StepsProps) {
  const vertical = direction === 'vertical';

  return (
    <ol
      data-slot="steps"
      className={cn('flex w-full', vertical ? 'flex-col' : 'flex-row', className)}
      style={style}
    >
      {items.map((item, index) => {
        const status: StepStatus =
          item.status ?? (index < current ? 'finish' : index === current ? 'process' : 'wait');
        const stateIcon = statusIcon(status);
        const last = index === items.length - 1;

        return (
          <Fragment key={index}>
            <li
              data-slot="steps-item"
              data-status={status}
              className={cn('flex gap-2', vertical ? 'items-start' : 'shrink-0 items-start')}
            >
              <span
                data-slot="steps-icon"
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border text-sm',
                  iconBoxClass[status],
                )}
              >
                {item.icon ? (
                  <Icon name={item.icon} size="sm" />
                ) : stateIcon ? (
                  <Icon name={stateIcon} size="sm" />
                ) : (
                  index + 1
                )}
              </span>
              <div className={cn('min-w-0', !vertical && 'pt-0.5')}>
                <div data-slot="steps-title" className={cn('text-sm', titleClass[status])}>
                  {item.title}
                </div>
                {item.description ? (
                  <div data-slot="steps-description" className="mt-0.5 text-xs text-muted-foreground">
                    {item.description}
                  </div>
                ) : null}
              </div>
            </li>
            {!last ? (
              <li
                aria-hidden="true"
                data-slot="steps-connector"
                className={cn(
                  'bg-border',
                  vertical ? 'mt-1 mb-1 ml-[13px] h-6 w-px' : 'mx-3 mt-3.5 h-px min-w-6 flex-1 self-start',
                )}
              />
            ) : null}
          </Fragment>
        );
      })}
    </ol>
  );
}
