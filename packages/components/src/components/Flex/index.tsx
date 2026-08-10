import { Flex as AntFlex } from 'antd';
import type { ReactNode } from 'react';

export interface FlexProps {
  /** 主轴方向，默认 horizontal（vertical 映射 antd `vertical`） */
  direction?: 'horizontal' | 'vertical';
  /** 间距 */
  gap?: number | 'small' | 'middle' | 'large';
  /** 主轴对齐（映射 antd `justify`） */
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  /** 交叉轴对齐（映射 antd `align`） */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  children?: ReactNode;
}

/** Flex 布局（设计决策 D5）：直接映射 antd Flex */
export function Flex({
  direction = 'horizontal',
  gap,
  justify,
  align,
  children,
}: FlexProps) {
  return (
    <AntFlex vertical={direction === 'vertical'} gap={gap} justify={justify} align={align}>
      {children}
    </AntFlex>
  );
}
