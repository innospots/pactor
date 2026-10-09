import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

/** Row → Col 传递的 gutter（Col 经 padding 对半拆分实现栏间距） */
const RowContext = createContext<[number, number]>([0, 0]);

/** 读取 Row gutter（Col 专用） */
export function useRowGutter(): [number, number] {
  return useContext(RowContext);
}

export type RowJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch';

export interface RowProps {
  /** 栏间距（px）：number 水平垂直同距；[水平, 垂直] 分别设置；默认 0 */
  gutter?: number | [number, number];
  /** 水平排列（justify-content），默认 start */
  justify?: RowJustify;
  /** 垂直对齐（align-items），默认 top */
  align?: RowAlign;
  /** 是否换行（flex-wrap），默认 true */
  wrap?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

const justifyMap: Record<RowJustify, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-around': 'space-around',
  'space-between': 'space-between',
  'space-evenly': 'space-evenly',
};

const alignMap: Record<RowAlign, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
  stretch: 'stretch',
};

/**
 * Row 栅格行（对齐 antd Grid.Row）：flex 行容器 + gutter 上下文。
 * 子级须为 Col（读取 gutter 对半拆分为左右 padding）；与 antd 一致，
 * 根节点用负 margin 抵消首尾列的外侧留白。
 */
export function Row({
  gutter,
  justify = 'start',
  align = 'top',
  wrap = true,
  className,
  style,
  children,
}: RowProps) {
  const [h, v] = Array.isArray(gutter) ? gutter : [gutter ?? 0, gutter ?? 0];
  return (
    <RowContext.Provider value={[h, v]}>
      <div
        data-slot="row"
        className={cn('flex', className)}
        style={{
          flexWrap: wrap ? 'wrap' : 'nowrap',
          justifyContent: justifyMap[justify],
          alignItems: alignMap[align],
          ...(h || v ? { margin: `0 ${-h / 2}px ${-v / 2}px 0` } : {}),
          ...style,
        }}
      >
        {children}
      </div>
    </RowContext.Provider>
  );
}
