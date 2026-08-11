import type { ComponentType } from 'react';
import type {
  AdminLayoutProps,
  BlankLayoutProps,
  LandingLayoutProps,
  LoginLayoutProps,
} from 'pactor-ui-antd/layout';
import { describe, expect, it } from 'vitest';

import {
  RadixAdminLayout,
  RadixBlankLayout,
  RadixLandingLayout,
  RadixLoginLayout,
} from '../../src/layout/index.js';

describe('契约一致性：props 类型复用 pactor-layout 导出', () => {
  it('Radix 布局组件满足 antd 版 props 契约（编译期断言）', () => {
    const admin: ComponentType<AdminLayoutProps> = RadixAdminLayout;
    const blank: ComponentType<BlankLayoutProps> = RadixBlankLayout;
    const login: ComponentType<LoginLayoutProps> = RadixLoginLayout;
    const landing: ComponentType<LandingLayoutProps> = RadixLandingLayout;

    expect(admin).toBe(RadixAdminLayout);
    expect(blank).toBe(RadixBlankLayout);
    expect(login).toBe(RadixLoginLayout);
    expect(landing).toBe(RadixLandingLayout);
  });
});
