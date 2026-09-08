import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import {
  AdminLayout,
  BlankLayout,
  LandingLayout,
  LoginLayout,
  type AdminLayoutProps,
  type BlankLayoutProps,
  type LandingLayoutProps,
  type LoginLayoutProps,
} from '../../src/layout/index.js';

describe('布局契约：props 类型为 @pactor-app/ui 本地导出', () => {
  it('内置布局组件满足 props 契约（编译期断言）', () => {
    const admin: ComponentType<AdminLayoutProps> = AdminLayout;
    const blank: ComponentType<BlankLayoutProps> = BlankLayout;
    const login: ComponentType<LoginLayoutProps> = LoginLayout;
    const landing: ComponentType<LandingLayoutProps> = LandingLayout;

    expect(admin).toBe(AdminLayout);
    expect(blank).toBe(BlankLayout);
    expect(login).toBe(LoginLayout);
    expect(landing).toBe(LandingLayout);
  });
});
