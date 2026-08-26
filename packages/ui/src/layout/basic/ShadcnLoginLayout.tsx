import type { LoginLayoutProps } from '../types.js';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../ui/card.js';

/**
 * ShadcnLoginLayout：与 pactor-layout 的 LoginLayout（antd 版）契约一致——
 * 登录页外壳，只负责品牌区与表单出口的布局，不含任何认证逻辑。
 * variant center：居中卡片（vendored shadcn Card）；split：左品牌右表单
 * （缺省 center）。
 */
export function ShadcnLoginLayout({
  variant = 'center',
  brand,
  children,
}: LoginLayoutProps) {
  const brandBlock = (
    <div data-slot="login-brand" className="flex flex-col items-center gap-2">
      {brand.logo}
      <h1 className="text-xl font-semibold">{brand.title}</h1>
      {brand.description !== undefined && (
        <div className="text-sm text-muted-foreground">{brand.description}</div>
      )}
    </div>
  );

  if (variant === 'split') {
    return (
      <div
        data-slot="login-layout"
        data-variant="split"
        className="grid min-h-screen grid-cols-2 bg-background text-foreground"
      >
        <div
          data-slot="login-brand-panel"
          className="flex items-center justify-center bg-muted/40 p-10"
        >
          {brandBlock}
        </div>
        <div
          data-slot="login-form-panel"
          className="flex items-center justify-center p-10"
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="login-layout"
      data-variant="center"
      className="flex min-h-screen items-center justify-center bg-muted/40 text-foreground"
    >
      <Card data-slot="login-card" className="w-full max-w-sm gap-4 py-6">
        <CardHeader className="px-6">
          <CardTitle className="sr-only">{brand.title}</CardTitle>
          {brandBlock}
        </CardHeader>
        <CardContent className="px-6">{children}</CardContent>
      </Card>
    </div>
  );
}
