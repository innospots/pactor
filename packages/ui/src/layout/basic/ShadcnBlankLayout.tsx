import type { BlankLayoutProps } from '../types.js';

/**
 * ShadcnBlankLayout：与 pactor-layout 的 BlankLayout（antd 版）契约一致——
 * 无壳布局，直接渲染 children（带最小页面容器样式）。
 */
export function ShadcnBlankLayout({ children }: BlankLayoutProps) {
  return (
    <div
      data-slot="blank-layout"
      className="min-h-screen bg-background text-foreground"
    >
      {children}
    </div>
  );
}
