import { useI18n } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from '../../../ui/avatar.js';

/** 在线状态（右下角指示点） */
export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';

/** 头像形态：user 圆形；agent 方形（智能体 / 机器人） */
export type AvatarKind = 'user' | 'agent';

export interface AvatarProps {
  /** 图片地址 */
  src?: string;
  /** 图片替代文本 */
  alt?: string;
  /** 加载失败或缺省时的占位文本（如首字母） */
  fallback?: string;
  /** 头像形态，缺省 user（圆形） */
  kind?: AvatarKind;
  /** 在线状态（提供时右下角展示状态点） */
  status?: AvatarStatus;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export interface AvatarGroupProps {
  /** 头像列表（按顺序展示前 max 个，其余聚合为 +N） */
  items: AvatarProps[];
  /** 最多展示数量（缺省 4；0 表示全部聚合） */
  max?: number;
  /** 尺寸（缺省 md） */
  size?: 'sm' | 'md' | 'lg';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const STATUS_CLASS: Record<AvatarStatus, string> = {
  online: 'bg-success',
  busy: 'bg-destructive',
  away: 'bg-warning',
  offline: 'bg-muted-foreground',
};

const SIZE_CLASS = {
  sm: 'size-6 text-xs',
  md: 'size-8 text-sm',
  lg: 'size-10 text-base',
} as const;

/** Avatar 适配器（shadcn kit）：src / alt / fallback → vendored Avatar */
export function Avatar({
  src,
  alt,
  fallback,
  kind = 'user',
  status,
  className,
  style,
}: AvatarProps) {
  const { t } = useI18n();
  const square = kind === 'agent';
  return (
    <ShadcnAvatar
      data-kind={kind}
      data-status={status}
      className={cn(
        square && 'rounded-md',
        status && 'overflow-visible',
        className,
      )}
      style={style}
    >
      {src ? <AvatarImage src={src} alt={alt ?? ''} /> : null}
      {fallback ? (
        <AvatarFallback className={square ? 'rounded-md' : undefined}>
          {fallback}
        </AvatarFallback>
      ) : null}
      {status ? (
        <span
          data-slot="avatar-status"
          data-status={status}
          role="img"
          aria-label={t(`pactor.avatar.${status}`)}
          className={cn(
            'absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-background',
            STATUS_CLASS[status],
          )}
        />
      ) : null}
    </ShadcnAvatar>
  );
}

/** 头像组：重叠展示前 max 个，溢出聚合为 +N（aria-hidden 装饰） */
export function AvatarGroup({
  items,
  max = 4,
  size = 'md',
  className,
  style,
}: AvatarGroupProps) {
  const visible = items.slice(0, Math.max(0, max));
  const rest = items.length - visible.length;
  return (
    <div
      data-slot="avatar-group"
      role="group"
      className={cn('flex items-center', className)}
      style={style}
    >
      {visible.map((item, index) => (
        <span
          key={index}
          data-slot="avatar-group-item"
          className="-ml-2 rounded-full ring-2 ring-background first:ml-0"
        >
          <Avatar
            {...item}
            className={cn(SIZE_CLASS[size], item.className)}
          />
        </span>
      ))}
      {rest > 0 ? (
        <span
          data-slot="avatar-group-more"
          aria-hidden="true"
          className={cn(
            '-ml-2 flex items-center justify-center rounded-full border border-border bg-muted font-medium text-muted-foreground ring-2 ring-background',
            SIZE_CLASS[size],
          )}
        >
          +{rest}
        </span>
      ) : null}
    </div>
  );
}
