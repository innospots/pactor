import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

export interface AudioProps {
  /** 音频地址 */
  src?: string;
  /** 是否显示原生控制条，默认 true */
  controls?: boolean;
  /** 自动播放（浏览器策略要求同时 muted 才生效） */
  autoplay?: boolean;
  /** 循环播放 */
  loop?: boolean;
  /** 静音 */
  muted?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Audio 适配器（shadcn kit）：原生 audio 包装，默认全宽 + 控制条 */
export function Audio({
  src,
  controls = true,
  autoplay,
  loop,
  muted,
  className,
  style,
}: AudioProps) {
  return (
    <audio
      data-slot="audio"
      className={cn('w-full', className)}
      style={style}
      src={src}
      controls={controls}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
    />
  );
}
