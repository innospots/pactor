// @vitest-environment jsdom
import './setup.js';

import { cleanup, render, screen } from '@testing-library/react';
import { Registry } from '@pactor-app/core';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createLayoutRegistry,
  registerBuiltinLayouts,
  resolveLayout,
  AdminLayout,
  BlankLayout,
  ChatLayout,
  LandingLayout,
  LoginLayout,
  type LayoutComponent,
} from '../../src/layout/index.js';

afterEach(cleanup);

describe('BlankLayout', () => {
  it('直接渲染 children（无外壳元素）', () => {
    render(<BlankLayout>裸内容</BlankLayout>);

    expect(screen.getByText('裸内容')).toBeTruthy();
  });
});

describe('LoginLayout', () => {
  it('center 变体：出现品牌标题与 children', () => {
    const { container } = render(
      <LoginLayout
        variant="center"
        brand={{ title: '智能决策运营平台', description: '描述文案' }}
      >
        <form>登录表单</form>
      </LoginLayout>,
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
      <LoginLayout variant="split" brand={{ title: '智能决策运营平台' }}>
        <form>登录表单</form>
      </LoginLayout>,
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
      <LoginLayout brand={{ title: '平台' }}>
        <span>表单</span>
      </LoginLayout>,
    );

    expect(
      container.querySelector('[data-slot=login-layout][data-variant=center]'),
    ).toBeTruthy();
  });
});

describe('LandingLayout', () => {
  it('navbar 与 footer 分别出现在内容区上下方', () => {
    const { container } = render(
      <LandingLayout navbar={<nav>顶部导航</nav>} footer={<div>底部信息</div>}>
        <section>主内容</section>
      </LandingLayout>,
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
      <LandingLayout>
        <section>主内容</section>
      </LandingLayout>,
    );

    expect(container.querySelector('[data-slot=landing-navbar]')).toBeNull();
    expect(container.querySelector('[data-slot=landing-footer]')).toBeNull();
    expect(screen.getByText('主内容')).toBeTruthy();
  });
});

describe('LayoutRegistry', () => {
  it('预注册类型名恰为 admin/blank/login/landing/chat（硬编码断言）', () => {
    const registry = createLayoutRegistry();

    expect(registry.list().sort()).toEqual(
      ['admin', 'blank', 'chat', 'landing', 'login'].sort(),
    );
  });

  it('五种预注册类型均可解析为内置实现', () => {
    const registry = createLayoutRegistry();

    expect(resolveLayout(registry, 'admin')).toBe(AdminLayout);
    expect(resolveLayout(registry, 'blank')).toBe(BlankLayout);
    expect(resolveLayout(registry, 'login')).toBe(LoginLayout);
    expect(resolveLayout(registry, 'landing')).toBe(LandingLayout);
    expect(resolveLayout(registry, 'chat')).toBe(ChatLayout);
  });

  it('未知类型回退 BlankLayout 并告警，不抛错（resolveLayout 回退语义）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const registry = createLayoutRegistry();
      const component = resolveLayout(registry, 'unknown');

      expect(component).toBe(BlankLayout);
      expect(warn).toHaveBeenCalledOnce();
    } finally {
      warn.mockRestore();
    }
  });

  it('registerBuiltinLayouts 注册到已有注册表；业务自定义布局可叠加', () => {
    const Workspace = () => <div>workspace</div>;
    const registry = new Registry<LayoutComponent>('LayoutRegistry');
    registerBuiltinLayouts(registry);
    registry.register('workspace', Workspace);

    expect(resolveLayout(registry, 'admin')).toBe(AdminLayout);
    expect(resolveLayout(registry, 'workspace')).toBe(Workspace);
  });
});
