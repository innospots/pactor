import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface WatermarkProps {
  /** 水印文本：字符串或字符串数组（多行纵向排列） */
  content?: string | string[];
  /** 旋转角度，缺省 -22 */
  rotate?: number;
  /** 平铺间距 [水平, 垂直]（px），缺省 [100, 100] */
  gap?: [number, number];
  /** 文本透明度（0~1），缺省 0.15 */
  opacity?: number;
  /** 被覆盖内容（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 把水印文本平铺编码进 SVG data-uri 背景（background-repeat 平铺） */
function buildWatermarkImage(
  lines: string[],
  rotate: number,
  gap: [number, number],
  opacity: number,
): string {
  const fontSize = 14;
  const lineHeight = fontSize * 1.5;
  const width = gap[0] + 160;
  const height = gap[1] + lines.length * lineHeight + 20;
  const texts = lines
    .map(
      (line, i) =>
        `<text x="50%" y="${lineHeight * (i + 1)}">${escapeXml(line)}</text>`,
    )
    .join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<g transform="rotate(${rotate} ${width / 2} ${height / 2})" fill="black" fill-opacity="${opacity}" font-size="${fontSize}" font-family="sans-serif" text-anchor="middle">${texts}</g>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Watermark 适配器（shadcn kit）：容器相对定位包 children，水印为绝对
 * 定位 inset-0、pointer-events-none 的 SVG data-uri 平铺背景层；
 * 多行 content 纵向排列。
 */
export function Watermark({
  content,
  rotate = -22,
  gap = [100, 100],
  opacity = 0.15,
  children,
  className,
  style,
}: WatermarkProps) {
  const lines = (
    Array.isArray(content) ? content : content !== undefined ? [content] : []
  ).filter((line): line is string => typeof line === 'string' && line !== '');

  return (
    <div
      data-slot="watermark"
      className={cn('relative', className)}
      style={style}
    >
      {children}
      {lines.length > 0 ? (
        <div
          data-slot="watermark-layer"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage: buildWatermarkImage(lines, rotate, gap, opacity),
            backgroundRepeat: 'repeat',
          }}
        />
      ) : null}
    </div>
  );
}
