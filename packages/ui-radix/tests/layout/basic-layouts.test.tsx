// @vitest-environment jsdom
import './setup.js';

import { cleanup, render, screen } from '@testing-library/react';
import {
  BlankLayout,
  createLayoutRegistry,
  resolveLayout,
} from 'pactor-ui-antd/layout';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createRadixLayoutRegistry,
  RadixAdminLayout,
  RadixBlankLayout,
  RadixLandingLayout,
  RadixLoginLayout,
  registerRadixLayouts,
} from '../../src/layout/index.js';

afterEach(cleanup);

describe('RadixBlankLayout', () => {
  it('直接渲染 children（无外壳元素）', () => {
    render(<RadixBlankLayout>裸内容</RadixBlankLayout>);

    expect(screen.getByText('裸内容')).toBeTruthy();
  });
});

describe('RadixLoginLayout', () => {
  it('center 变体：出现品牌标题与 children', () => {
    const { container } = render(
      <RadixLoginLayout
        variant="center"
        brand={{ title: '智能决策运营平台', description: '描述文案' }}
      >
        <form>登录表单</form>
      </RadixLoginLayout>,
    );

    expect(screen.getByText('智能决策运营平台')).toBeTruthy();
    expect(screen.getByText('描述文案')).toBeTruthy();
    expect(screen.getByText('登录表单')).toBeTruthy();
    expect(container.querySelector('.pcr-login-layout--center')).toBeTruthy();
  });

  it('split 变体：品牌区与表单区并列呈现', () => {
    const { container } = render(
      <RadixLoginLayout variant="split" brand={{ title: '智能决策运营平台' }}>
        <form>登录表单</form>
      </RadixLoginLayout>,
    );

    expect(container.querySelector('.pcr-login-layout--split')).toBeTruthy();
    expect(
      container.querySelector('.pcr-login-brand-panel')?.textContent,
    ).toContain('智能决策运营平台');
    expect(
      container.querySelector('.pcr-login-form-panel')?.textContent,
    ).toContain('登录表单');
  });

  it('缺省 variant 为 center', () => {
    const { container } = render(
      <RadixLoginLayout brand={{ title: '平台' }}>
        <span>表单</span>
      </RadixLoginLayout>,
    );

    expect(container.querySelector('.pcr-login-layout--center')).toBeTruthy();
  });
});

describe('RadixLandingLayout', () => {
  it('navbar 与 footer 分别出现在内容区上下方', () => {
    const { container } = render(
      <RadixLandingLayout navbar={<nav>顶部导航</nav>} footer={<div>底部信息</div>}>
        <section>主内容</section>
      </RadixLandingLayout>,
    );

    const navbar = container.querySelector('.pcr-landing-navbar');
    const content = container.querySelector('.pcr-landing-content');
    const footer = container.querySelector('.pcr-landing-footer');
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
      <RadixLandingLayout>
        <section>主内容</section>
      </RadixLandingLayout>,
    );

    expect(container.querySelector('.pcr-landing-navbar')).toBeNull();
    expect(container.querySelector('.pcr-landing-footer')).toBeNull();
    expect(screen.getByText('主内容')).toBeTruthy();
  });
});

describe('Radix LayoutRegistry', () => {
  it('类型名与 antd 版一致：list() 均含 admin/blank/login/landing', () => {
    const radix = createRadixLayoutRegistry();
    const antd = createLayoutRegistry();

    for (const type of ['admin', 'blank', 'login', 'landing']) {
      expect(radix.list()).toContain(type);
      expect(antd.list()).toContain(type);
    }
  });

  it('四种预注册类型均可解析为 Radix 实现', () => {
    const registry = createRadixLayoutRegistry();

    expect(resolveLayout(registry, 'admin')).toBe(RadixAdminLayout);
    expect(resolveLayout(registry, 'blank')).toBe(RadixBlankLayout);
    expect(resolveLayout(registry, 'login')).toBe(RadixLoginLayout);
    expect(resolveLayout(registry, 'landing')).toBe(RadixLandingLayout);
  });

  it('未知类型回退 BlankLayout 并告警，不抛错（resolveLayout 回退语义对 radix 注册表适用）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const registry = createRadixLayoutRegistry();
      const component = resolveLayout(registry, 'unknown');

      expect(component).toBe(BlankLayout);
      expect(warn).toHaveBeenCalledOnce();
    } finally {
      warn.mockRestore();
    }
  });

  it('registerRadixLayouts 注册到已有注册表；业务自定义布局可叠加', () => {
    const Workspace = () => <div>workspace</div>;
    const registry = createLayoutRegistry();
    // 清空再注册 radix 版（模拟向已有注册表切换）
    for (const name of registry.list()) {
      registry.unregister(name);
    }
    registerRadixLayouts(registry);
    registry.register('workspace', Workspace);

    expect(resolveLayout(registry, 'admin')).toBe(RadixAdminLayout);
    expect(resolveLayout(registry, 'workspace')).toBe(Workspace);
  });
});
