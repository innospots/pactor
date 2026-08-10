import { Typography } from 'antd';
import type { ReactNode } from 'react';

export interface PageProps {
  /** 页面标题，可选 */
  title?: string;
  children?: ReactNode;
}

/**
 * Page 容器（设计决策 D5）：可选标题 + 内容区。
 * 不引入 antd PageHeader（已废弃），用简单排版实现。
 */
export function Page({ title, children }: PageProps) {
  return (
    <div className="pactor-page">
      {title ? <Typography.Title level={2}>{title}</Typography.Title> : null}
      <div className="pactor-page-content">{children}</div>
    </div>
  );
}
