import type { LandingLayoutProps } from '../types.js';

/**
 * ShadcnLandingLayout：与 pactor-layout 的 LandingLayout（antd 版）契约一致——
 * 落地页外壳，可选 navbar / footer 插槽，children 为主内容区。
 */
export function ShadcnLandingLayout({
  navbar,
  footer,
  children,
}: LandingLayoutProps) {
  return (
    <div
      data-slot="landing-layout"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      {navbar !== undefined && (
        <header
          data-slot="landing-navbar"
          className="border-b border-border bg-background"
        >
          {navbar}
        </header>
      )}
      <main data-slot="landing-content" className="flex-1">
        {children}
      </main>
      {footer !== undefined && (
        <footer
          data-slot="landing-footer"
          className="border-t border-border text-sm text-muted-foreground"
        >
          {footer}
        </footer>
      )}
    </div>
  );
}
