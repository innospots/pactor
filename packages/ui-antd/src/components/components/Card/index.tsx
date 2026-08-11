import { Card as AntCard } from 'antd';
import type { ReactNode } from 'react';

export interface CardProps {
  /** 卡片标题，可选 */
  title?: string;
  /** 是否有边框，默认 true（false 映射 antd `variant="borderless"`） */
  bordered?: boolean;
  children?: ReactNode;
}

/** Card 适配器（设计决策 D5） */
export function Card({ title, bordered = true, children }: CardProps) {
  return (
    <AntCard title={title} variant={bordered ? 'outlined' : 'borderless'}>
      {children}
    </AntCard>
  );
}
