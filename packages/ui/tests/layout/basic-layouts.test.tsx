// @vitest-environment jsdom
import './setup.js';

import { cleanup, render, screen } from '@testing-library/react';
import { Registry } from 'pactor-core';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createShadcnLayoutRegistry,
  registerShadcnLayouts,
  resolveLayout,
  ShadcnAdminLayout,
  ShadcnBlankLayout,
  ShadcnLandingLayout,
  ShadcnLoginLayout,
  type LayoutComponent,
} from '../../src/layout/index.js';

afterEach(cleanup);

describe('ShadcnBlankLayout', () => {
  it('直接渲染 children（无外壳元素）', () => {
    render(<ShadcnBlankLayout>裸内容</ShadcnBlankLayout>);

    expect(screen.getByText('裸内容')).toBeTruthy();
  });
});

describe('ShadcnLoginLayout', () => {
  it('center 变体：出现品牌标题与 children', () => {
    const { container } = render(
      <ShadcnLoginLayout
        variant="center"
        brand={{ title: '智能决策运营平台', description: '描述文案' }}
      >
        <form>登录表单</form>
      </ShadcnLoginLayout>,
    );

    expect(screen.getAllByText('智能决策运营平台').length).toBeGreaterThan(0);
    expect(screen.getByText('描述文案')).toBeTruthy();
    expect(screen.getByText('登录表单')).toBeTruthy();
    expect(
      container.querySelector('[data-slot=login-layout][data-variant=center]'),
    ).toBeTruthy();
  });

  it('split 变体：品牌区与表单区并列呈现', () => {
    const { container } = render(
      <ShadcnLoginLayout variant="split" brand={{ title: '智能决策运营平台' }}>
        <form>登录表单</form>
      </ShadcnLoginLayout>,
    );

    expect(
      container.querySelector('[data-slot=login-layout][data-variant=split]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-slot=login-brand-panel]')?.textContent,
    ).toContain('智能决策运营平台');
    expect(
      container.querySelector('[data-slot=login-form-panel]')?.textContent,
    ).toContain('登录表单');
  });

  it('缺省 variant 为 center', () => {
    const { container } = render(
      <ShadcnLoginLayout brand={{ title: '平台' }}>
        <span>表单</span>
      </ShadcnLoginLayout>,
    );

    expect(
      container.querySelector('[data-slot=login-layout][data-variant=center]'),
    ).toBeTruthy();
  });
});

describe('ShadcnLandingLayout', () => {
  it('navbar 与 footer 分别出现在内容区上下方', () => {
    const { container } = render(
      <ShadcnLandingLayout navbar={<nav>顶部导航</nav>} footer={<div>底部信息</div>}>
        <section>主内容</section>
      </ShadcnLandingLayout>,
    );

    const navbar = container.querySelector('[data-slot=landing-navbar]');
    const content = container.querySelector('[data-slot=landing-content]');
    const footer = container.querySelector('[data-slot=landing-footer]');
    expect(navbar?.textContent).toContain('顶部导航');
    expect(content?.textContent).toContain('主内容');
    expect(footer?.textContent).toContain('底部信息');
    // DOM 顺序：navbar → content → footer
    expect(
      navbar!.compareDocumentPosition(content!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      content!.compareDocumentPosition(footer!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('未传 navbar / footer 时不渲染对应插槽', () => {
    const { container } = render(
      <ShadcnLandingLayout>
        <section>主内容</section>
      </ShadcnLandingLayout>,
    );

    expect(container.querySelector('[data-slot=landing-navbar]')).toBeNull();
    expect(container.querySelector('[data-slot=landing-footer]')).toBeNull();
    expect(screen.getByText('主内容')).toBeTruthy();
  });
});

describe('Shadcn LayoutRegistry', () => {
  it('预注册类型名恰为 admin/blank/login/landing（硬编码断言）', () => {
    const registry = createShadcnLayoutRegistry();

    expect(registry.list().sort()).toEqual(
      ['admin', 'blank', 'landing', 'login'].sort(),
    );
  });

  it('四种预注册类型均可解析为 shadcn 实现', () => {
    const registry = createShadcnLayoutRegistry();

    expect(resolveLayout(registry, 'admin')).toBe(ShadcnAdminLayout);
    expect(resolveLayout(registry, 'blank')).toBe(ShadcnBlankLayout);
    expect(resolveLayout(registry, 'login')).toBe(ShadcnLoginLayout);
    expect(resolveLayout(registry, 'landing')).toBe(ShadcnLandingLayout);
  });

  it('未知类型回退 BlankLayout 并告警，不抛错（resolveLayout 回退语义）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const registry = createShadcnLayoutRegistry();
      const component = resolveLayout(registry, 'unknown');

      expect(component).toBe(ShadcnBlankLayout);
      expect(warn).toHaveBeenCalledOnce();
    } finally {
      warn.mockRestore();
    }
  });

  it('registerShadcnLayouts 注册到已有注册表；业务自定义布局可叠加', () => {
    const Workspace = () => <div>workspace</div>;
    const registry = new Registry<LayoutComponent>('LayoutRegistry');
    registerShadcnLayouts(registry);
    registry.register('workspace', Workspace);

    expect(resolveLayout(registry, 'admin')).toBe(ShadcnAdminLayout);
    expect(resolveLayout(registry, 'workspace')).toBe(Workspace);
  });
});
