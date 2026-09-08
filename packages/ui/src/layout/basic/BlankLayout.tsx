import type { BlankLayoutProps } from '../types.js';

/**
 * BlankLayout：内置默认 UI 实现的无壳布局——
 * 直接渲染 children（带最小页面容器样式）。
 */
export function BlankLayout({ children }: BlankLayoutProps) {
  return (
    <div
      data-slot="blank-layout"
      className="min-h-screen bg-background text-foreground"
    >
      {children}
    </div>
  );
}
