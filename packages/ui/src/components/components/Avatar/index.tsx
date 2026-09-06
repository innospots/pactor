import type { CSSProperties } from 'react';

import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from '../../../ui/avatar.js';

export interface AvatarProps {
  /** 图片地址 */
  src?: string;
  /** 图片替代文本 */
  alt?: string;
  /** 加载失败或缺省时的占位文本（如首字母） */
  fallback?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Avatar 适配器（shadcn kit）：src / alt / fallback → vendored Avatar */
export function Avatar({ src, alt, fallback, className, style }: AvatarProps) {
  return (
    <ShadcnAvatar className={className} style={style}>
      {src ? <AvatarImage src={src} alt={alt ?? ''} /> : null}
      {fallback ? <AvatarFallback>{fallback}</AvatarFallback> : null}
    </ShadcnAvatar>
  );
}
