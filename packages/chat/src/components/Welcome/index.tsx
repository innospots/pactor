import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';
import { Prompt } from '../Prompt/index.js';

/** 起始任务项（value 缺省取 title） */
export interface WelcomePromptItem {
  title: string;
  description?: string;
  icon?: string;
  value?: string;
}

export interface WelcomeProps {
  /** 主标题，默认「有什么可以帮你？」 */
  title?: string;
  /** 副标题（能力说明） */
  description?: string;
  /** 主图标名（Icon 白名单），缺省 chat；传 null 不渲染图标 */
  icon?: string | null;
  /** 起始任务卡片列表 */
  prompts?: WelcomePromptItem[];
  /** 起始任务选择事件，传出 value（Renderer 绑定 events.onSelect） */
  onSelect?: (value: string) => void;
  /** 主标题节点 class（与内置样式合并） */
  titleClassName?: string;
  /** 副标题节点 class（与内置样式合并） */
  descriptionClassName?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Welcome 适配器（shadcn kit）：会话空状态——居中的图标 + 主副标题 +
 * 起始任务卡片栅格（复用 Prompt）；点击卡片经 onSelect 传出 value。
 */
export function Welcome({
  title = '有什么可以帮你？',
  description,
  icon = 'chat',
  prompts = [],
  onSelect,
  titleClassName,
  descriptionClassName,
  className,
  style,
}: WelcomeProps) {
  return (
    <div
      data-slot="welcome"
      className={cn('flex w-full flex-col items-center gap-4 py-10 text-center', className)}
      style={style}
    >
      {icon ? (
        <span data-slot="welcome-icon" className="text-primary">
          <Icon name={icon} size="lg" />
        </span>
      ) : null}
      <div>
        <div data-slot="welcome-title" className={cn('text-xl font-semibold', titleClassName)}>
          {title}
        </div>
        {description ? (
          <div data-slot="welcome-description" className={cn('mt-1 text-sm text-muted-foreground', descriptionClassName)}>
            {description}
          </div>
        ) : null}
      </div>
      {prompts.length > 0 ? (
        <div data-slot="welcome-prompts" className="grid w-full max-w-xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
          {prompts.map((item, index) => (
            <Prompt
              key={`${item.title}-${index}`}
              title={item.title}
              description={item.description}
              icon={item.icon}
              value={item.value}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
