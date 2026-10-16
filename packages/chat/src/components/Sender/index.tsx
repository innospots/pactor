import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Avatar } from '@pactor-app/ui/components';
import { Icon } from '@pactor-app/ui/components';

export interface SenderProps {
  /** 发送方名称 */
  name?: string;
  /** 头像图片地址 */
  avatar?: string;
  /** 头像占位文本（缺省取 name 首字符） */
  avatarText?: string;
  /** 头像位图标（Icon 白名单；提供时头像位渲染图标，优先于 avatarText 兜底） */
  icon?: string;
  /** 隐藏头像位（缺省 false；无头像 / 图标 / 占位诉求的场景） */
  hideAvatar?: boolean;
  /** 角色说明（如「AI 助手」「我」），展示在名称后 */
  role?: string;
  /** 时间文本（已格式化，如「10:24」） */
  time?: string;
  /** 对齐：start 居左、end 居右，默认 start */
  align?: 'start' | 'end';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Sender 适配器（shadcn kit）：消息发送方行——头像 + 名称 + 角色 + 时间 */
export function Sender({ name, avatar, avatarText, icon, hideAvatar = false, role, time, align = 'start', className, style }: SenderProps) {
  return (
    <div
      data-slot="sender"
      className={cn('flex items-center gap-2', align === 'end' && 'flex-row-reverse', className)}
      style={style}
    >
      {hideAvatar ? null : icon && !avatar ? (
        <span
          data-slot="sender-icon"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
        >
          <Icon name={icon} size="sm" />
        </span>
      ) : (
        <Avatar src={avatar} fallback={avatarText ?? name?.slice(0, 1) ?? '?'} className="size-7" />
      )}
      <div className={cn('flex min-w-0 items-baseline gap-1.5', align === 'end' && 'flex-row-reverse')}>
        {name ? (
          <span data-slot="sender-name" className="truncate text-sm font-medium">
            {name}
          </span>
        ) : null}
        {role ? (
          <span data-slot="sender-role" className="shrink-0 text-xs text-muted-foreground">
            {role}
          </span>
        ) : null}
        {time ? (
          <span data-slot="sender-time" className="shrink-0 text-xs text-muted-foreground">
            {time}
          </span>
        ) : null}
      </div>
    </div>
  );
}
