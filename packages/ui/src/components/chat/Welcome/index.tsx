import type { CSSProperties } from 'react';

import { cn } from '../../../../lib/utils.js';
import { Icon } from '../../Icon/index.js';
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
  /** 主图标名（Icon 白名单），缺省 chat */
  icon?: string;
  /** 起始任务卡片列表 */
  prompts?: WelcomePromptItem[];
  /** 起始任务选择事件，传出 value（Renderer 绑定 events.onSelect） */
  onSelect?: (value: string) => void;
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
  className,
  style,
}: WelcomeProps) {
  return (
    <div
      data-slot="welcome"
      className={cn('flex w-full flex-col items-center gap-4 py-10 text-center', className)}
      style={style}
    >
      <span data-slot="welcome-icon" className="text-primary">
        <Icon name={icon} size="lg" />
      </span>
      <div>
        <div data-slot="welcome-title" className="text-xl font-semibold">
          {title}
        </div>
        {description ? (
          <div data-slot="welcome-description" className="mt-1 text-sm text-muted-foreground">
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
