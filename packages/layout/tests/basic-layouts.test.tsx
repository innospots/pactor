// @vitest-environment jsdom
import './setup.js';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AdminLayout,
  BlankLayout,
  createLayoutRegistry,
  LandingLayout,
  LoginLayout,
  resolveLayout,
} from '../src/index.js';

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

    expect(screen.getByText('智能决策运营平台')).toBeTruthy();
    expect(screen.getByText('描述文案')).toBeTruthy();
    expect(screen.getByText('登录表单')).toBeTruthy();
    expect(container.querySelector('.pactor-login-layout--center')).toBeTruthy();
  });

  it('split 变体：品牌区与表单区并列呈现', () => {
    const { container } = render(
      <LoginLayout variant="split" brand={{ title: '智能决策运营平台' }}>
        <form>登录表单</form>
      </LoginLayout>,
    );

    expect(container.querySelector('.pactor-login-layout--split')).toBeTruthy();
    expect(
      container.querySelector('.pactor-login-brand-panel')?.textContent,
    ).toContain('智能决策运营平台');
    expect(
      container.querySelector('.pactor-login-form-panel')?.textContent,
    ).toContain('登录表单');
  });

  it('缺省 variant 为 center', () => {
    const { container } = render(
      <LoginLayout brand={{ title: '平台' }}>
        <span>表单</span>
      </LoginLayout>,
    );

    expect(container.querySelector('.pactor-login-layout--center')).toBeTruthy();
  });
});

describe('LandingLayout', () => {
  it('navbar 与 footer 分别出现在内容区上下方', () => {
    const { container } = render(
      <LandingLayout navbar={<nav>顶部导航</nav>} footer={<div>底部信息</div>}>
        <section>主内容</section>
      </LandingLayout>,
    );

    const navbar = container.querySelector('.pactor-landing-navbar');
    const content = container.querySelector('.pactor-landing-content');
    const footer = container.querySelector('.pactor-landing-footer');
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

    expect(container.querySelector('.pactor-landing-navbar')).toBeNull();
    expect(container.querySelector('.pactor-landing-footer')).toBeNull();
    expect(screen.getByText('主内容')).toBeTruthy();
  });
});

describe('LayoutRegistry', () => {
  it('四种预注册类型均可解析', () => {
    const registry = createLayoutRegistry();

    expect(resolveLayout(registry, 'admin')).toBe(AdminLayout);
    expect(resolveLayout(registry, 'blank')).toBe(BlankLayout);
    expect(resolveLayout(registry, 'login')).toBe(LoginLayout);
    expect(resolveLayout(registry, 'landing')).toBe(LandingLayout);
  });

  it('未知类型回退 BlankLayout 并告警，不抛错', () => {
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

  it('注册自定义布局后可解析', () => {
    const Workspace = () => <div>workspace</div>;
    const registry = createLayoutRegistry();
    registry.register('workspace', Workspace);

    expect(resolveLayout(registry, 'workspace')).toBe(Workspace);
  });
});
