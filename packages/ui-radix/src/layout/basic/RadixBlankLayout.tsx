import type { BlankLayoutProps } from 'pactor-ui-antd/layout';

/**
 * RadixBlankLayout：与 pactor-layout 的 BlankLayout（antd 版）契约一致——
 * 无壳布局，直接渲染 children（带最小页面容器样式）。
 */
export function RadixBlankLayout({ children }: BlankLayoutProps) {
  return <div className="pcr-blank-layout">{children}</div>;
}
