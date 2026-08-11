import type { LoginLayoutProps } from 'pactor-ui-antd/layout';

/**
 * RadixLoginLayout：与 pactor-layout 的 LoginLayout（antd 版）契约一致——
 * 登录页外壳，只负责品牌区与表单出口的布局，不含任何认证逻辑。
 * variant center：居中卡片；split：左品牌右表单（缺省 center）。
 */
export function RadixLoginLayout({
  variant = 'center',
  brand,
  children,
}: LoginLayoutProps) {
  const brandBlock = (
    <div className="pcr-login-brand">
      {brand.logo}
      <h1 className="pcr-login-brand-title">{brand.title}</h1>
      {brand.description !== undefined && (
        <div className="pcr-login-brand-description">{brand.description}</div>
      )}
    </div>
  );

  if (variant === 'split') {
    return (
      <div className="pcr-login-layout pcr-login-layout--split">
        <div className="pcr-login-brand-panel">{brandBlock}</div>
        <div className="pcr-login-form-panel">{children}</div>
      </div>
    );
  }

  return (
    <div className="pcr-login-layout pcr-login-layout--center">
      <div className="pcr-login-card">
        {brandBlock}
        {children}
      </div>
    </div>
  );
}
