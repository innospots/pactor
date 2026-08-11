import { Col as AntCol, Row as AntRow } from 'antd';
import { Children, type ReactNode } from 'react';

export interface GridProps {
  /** 列数，默认 1；每列 span = 24 / columns（向下取整） */
  columns?: number;
  /** 栏间距（antd gutter） */
  gap?: number;
  children?: ReactNode;
}

/** Grid 均分栏布局（设计决策 D5）：children 逐项包 Col */
export function Grid({ columns = 1, gap, children }: GridProps) {
  const span = Math.floor(24 / Math.max(1, columns));
  return (
    <AntRow gutter={gap}>
      {Children.map(children, (child, index) => (
        <AntCol key={index} span={span}>
          {child}
        </AntCol>
      ))}
    </AntRow>
  );
}
