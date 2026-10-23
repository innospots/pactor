import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface FlexProps {
  /** 主轴方向，默认 horizontal */
  direction?: 'horizontal' | 'vertical';
  /** 间距 */
  gap?: number | 'small' | 'middle' | 'large';
  /**
   * 换行方式，默认 nowrap；`true` 等价 `wrap`，`false` 等价 `nowrap`
   */
  wrap?: boolean | 'nowrap' | 'wrap' | 'wrap-reverse';
  /** 主轴对齐 */
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  /** 交叉轴对齐 */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式（布局逃逸口，如 `{ flex: 1 }`；与数字 gap 合并） */
  style?: CSSProperties;
  children?: ReactNode;
}

const gapClass: Record<string, string> = {
  small: 'gap-(--flex-gap-sm)',
  middle: 'gap-(--flex-gap-md)',
  large: 'gap-(--flex-gap-lg)',
};

const wrapClass: Record<string, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
};

const justifyClass: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
  'space-evenly': 'justify-evenly',
};

const alignClass: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

/**
 * Flex 布局（shadcn kit）：方向 / 换行 / 对齐映射 Tailwind 工具类，数字 gap 内联。
 * gap 未指定时应用默认间距令牌 `--flex-gap`（命名档位读
 * `--flex-gap-sm/md/lg`），均可被皮肤 CSS 覆盖；`gap: 0` 显式关闭。
 */
export function Flex({
  direction = 'horizontal',
  gap,
  wrap,
  justify,
  align,
  className,
  style,
  children,
}: FlexProps) {
  const wrapValue = wrap === true ? 'wrap' : wrap === false ? 'nowrap' : wrap;
  return (
    <div
      data-slot="flex"
      className={cn(
        'flex',
        direction === 'vertical' && 'flex-col',
        wrapValue && wrapClass[wrapValue],
        gap === undefined && 'gap-(--flex-gap)',
        typeof gap === 'string' && gapClass[gap],
        justify && justifyClass[justify],
        align && alignClass[align],
        className,
      )}
      style={
        typeof gap === 'number' || style
          ? { ...(typeof gap === 'number' ? { gap } : {}), ...style }
          : undefined
      }
    >
      {children}
    </div>
  );
}
