import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import {
  ShadcnAdminLayout,
  ShadcnBlankLayout,
  ShadcnLandingLayout,
  ShadcnLoginLayout,
  type AdminLayoutProps,
  type BlankLayoutProps,
  type LandingLayoutProps,
  type LoginLayoutProps,
} from '../../src/layout/index.js';

describe('布局契约：props 类型为 pactor-ui 本地导出', () => {
  it('shadcn 布局组件满足 props 契约（编译期断言）', () => {
    const admin: ComponentType<AdminLayoutProps> = ShadcnAdminLayout;
    const blank: ComponentType<BlankLayoutProps> = ShadcnBlankLayout;
    const login: ComponentType<LoginLayoutProps> = ShadcnLoginLayout;
    const landing: ComponentType<LandingLayoutProps> = ShadcnLandingLayout;

    expect(admin).toBe(ShadcnAdminLayout);
    expect(blank).toBe(ShadcnBlankLayout);
    expect(login).toBe(ShadcnLoginLayout);
    expect(landing).toBe(ShadcnLandingLayout);
  });
});
