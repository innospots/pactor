import type { ReactNode } from 'react';

export interface LandingLayoutProps {
  /** 顶部导航插槽 */
  navbar?: ReactNode;
  /** 底部插槽 */
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * LandingLayout（设计决策 D4）：落地页外壳，
 * 可选 navbar / footer 插槽，children 为主内容区。
 */
export function LandingLayout({ navbar, footer, children }: LandingLayoutProps) {
  return (
    <div className="pactor-landing-layout" style={{ minHeight: '100vh' }}>
      {navbar !== undefined && (
        <header className="pactor-landing-navbar">{navbar}</header>
      )}
      <main className="pactor-landing-content">{children}</main>
      {footer !== undefined && (
        <footer className="pactor-landing-footer">{footer}</footer>
      )}
    </div>
  );
}
