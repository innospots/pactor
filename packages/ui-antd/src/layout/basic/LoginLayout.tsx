import type { ReactNode } from 'react';
import { Card } from 'antd';

/** 登录页品牌区 */
export interface LoginBrand {
  title: string;
  logo?: ReactNode;
  description?: ReactNode;
}

export interface LoginLayoutProps {
  /** center：居中卡片；split：左品牌右表单（缺省 center） */
  variant?: 'center' | 'split';
  brand: LoginBrand;
  children?: ReactNode;
}

/**
 * LoginLayout（设计决策 D4）：登录页外壳。
 * 只负责品牌区与表单出口的布局，不含任何认证逻辑（认证属 pactor-app）。
 */
export function LoginLayout({
  variant = 'center',
  brand,
  children,
}: LoginLayoutProps) {
  const brandBlock = (
    <div className="pactor-login-brand">
      {brand.logo}
      <h1 className="pactor-login-brand-title">{brand.title}</h1>
      {brand.description !== undefined && (
        <div className="pactor-login-brand-description">{brand.description}</div>
      )}
    </div>
  );

  if (variant === 'split') {
    return (
      <div
        className="pactor-login-layout pactor-login-layout--split"
        style={{ display: 'flex', minHeight: '100vh' }}
      >
        <div
          className="pactor-login-brand-panel"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {brandBlock}
        </div>
        <div
          className="pactor-login-form-panel"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className="pactor-login-layout pactor-login-layout--center"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card className="pactor-login-card" style={{ width: 360 }}>
        {brandBlock}
        {children}
      </Card>
    </div>
  );
}
