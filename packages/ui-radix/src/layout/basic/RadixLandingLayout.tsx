import type { LandingLayoutProps } from 'pactor-ui-antd/layout';

/**
 * RadixLandingLayout：与 pactor-layout 的 LandingLayout（antd 版）契约一致——
 * 落地页外壳，可选 navbar / footer 插槽，children 为主内容区。
 */
export function RadixLandingLayout({
  navbar,
  footer,
  children,
}: LandingLayoutProps) {
  return (
    <div className="pcr-landing-layout">
      {navbar !== undefined && (
        <header className="pcr-landing-navbar">{navbar}</header>
      )}
      <main className="pcr-landing-content">{children}</main>
      {footer !== undefined && (
        <footer className="pcr-landing-footer">{footer}</footer>
      )}
    </div>
  );
}
