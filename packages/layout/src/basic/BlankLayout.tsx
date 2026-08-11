import type { ReactNode } from 'react';

export interface BlankLayoutProps {
  children?: ReactNode;
}

/**
 * BlankLayout（设计决策 D4）：无壳布局，直接渲染 children
 * （带最小页面容器样式），用于无壳页面与嵌入场景。
 */
export function BlankLayout({ children }: BlankLayoutProps) {
  return (
    <div className="pactor-blank-layout" style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
