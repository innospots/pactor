// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { expectEventState, renderDsl } from './helpers.js';

const brand = {
  name: 'Pactor Console',
  title: '统一管理后台',
  description: '面向管理员的一站式控制台',
  illustration: '/brand.webp',
};

describe('Login 业务组件', () => {
  it('默认 split-card 布局：品牌区 + 认证卡片 + 用户名字段 + 密码字段', () => {
    const { container } = renderDsl({
      type: 'Login',
      props: { brand },
    });

    const root = container.querySelector('[data-slot=login]');
    expect(root).not.toBeNull();
    expect(root!.getAttribute('data-layout')).toBe('split-card');
    // 分栏布局渲染两处品牌标识（桌面品牌区 + 窄屏收缩行）
    expect(screen.getAllByText('Pactor Console').length).toBe(2);
    expect(screen.getByText('统一管理后台')).toBeTruthy();
    expect(screen.getByText('面向管理员的一站式控制台')).toBeTruthy();
    expect(container.querySelector('img[src="/brand.webp"]')).not.toBeNull();
    expect(screen.getByLabelText('用户名')).toBeTruthy();
    expect(screen.getByLabelText('密码')).toBeTruthy();
    expect(screen.getByRole('button', { name: '登 录' })).toBeTruthy();
  });

  it.each([
    'split',
    'split-card',
    'split-card-float',
    'split-wide',
    'centered-card',
    'centered-plain',
    'brand-card',
    'overlap',
    'backdrop',
    'reverse-split',
  ])('layout=%s 渲染对应 data-layout', (layout) => {
    const { container } = renderDsl({ type: 'Login', props: { layout } });
    expect(
      container.querySelector('[data-slot=login]')!.getAttribute('data-layout'),
    ).toBe(layout);
  });

  it('居中布局不渲染分栏品牌区（无插画与品牌描述）', () => {
    const { container } = renderDsl({
      type: 'Login',
      props: { layout: 'centered-card', brand },
    });
    expect(screen.queryByText('面向管理员的一站式控制台')).toBeNull();
    expect(container.querySelector('img[src="/brand.webp"]')).toBeNull();
    // 居中布局保留 logo+name 紧凑标识
    expect(screen.getByText('Pactor Console')).toBeTruthy();
  });

  it('品牌插画：缺省展示内置默认插画，传地址替换，传空字符串隐藏', () => {
    const { container, unmount } = renderDsl({
      type: 'Login',
      props: { brand: { name: 'A' } },
    });
    expect(
      container.querySelector('[data-slot=login-default-illustration]'),
    ).not.toBeNull();
    unmount();

    const withImg = renderDsl({ type: 'Login', props: { brand } });
    expect(withImg.container.querySelector('img[src="/brand.webp"]')).not.toBeNull();
    expect(
      withImg.container.querySelector('[data-slot=login-default-illustration]'),
    ).toBeNull();
    withImg.unmount();

    const hidden = renderDsl({
      type: 'Login',
      props: { brand: { name: 'A', illustration: '' } },
    });
    expect(
      hidden.container.querySelector('[data-slot=login-default-illustration]'),
    ).toBeNull();
    expect(hidden.container.querySelector('img')).toBeNull();
  });

  it('overlap 布局渲染品牌卡片 + 登录卡片双卡结构', () => {
    const { container } = renderDsl({
      type: 'Login',
      props: { layout: 'overlap', brand },
    });
    expect(container.querySelectorAll('[data-slot=card]').length).toBe(2);
  });

  it('reverse-split 布局品牌面板在右（order-last）、表单在左', () => {
    const { container } = renderDsl({
      type: 'Login',
      props: { layout: 'reverse-split', brand: { name: 'A', title: '概念展示' } },
    });
    const panel = container.querySelector('.order-last');
    expect(panel).not.toBeNull();
    expect(panel!.querySelector('[data-slot=login-default-illustration]')).not.toBeNull();
  });

  it('默认渲染背景装饰（圆斑/圆环/点阵/流线），深浅色自适应', () => {
    const { container, unmount } = renderDsl({ type: 'Login', props: {} });
    expect(container.querySelector('[data-slot=login-bg-decor]')).not.toBeNull();
    unmount();

    const centered = renderDsl({ type: 'Login', props: { layout: 'centered-card' } });
    expect(
      centered.container.querySelector('[data-slot=login-bg-decor]'),
    ).not.toBeNull();
    centered.unmount();

    const backdrop = renderDsl({ type: 'Login', props: { layout: 'backdrop' } });
    expect(
      backdrop.container.querySelector('[data-slot=login-bg-decor]'),
    ).not.toBeNull();
  });

  it('文案 props 覆盖 i18n 缺省', () => {
    renderDsl({
      type: 'Login',
      props: { title: '欢迎回来', submitText: '进入控制台' },
    });
    expect(screen.getByText('欢迎回来')).toBeTruthy();
    expect(screen.getByRole('button', { name: '进入控制台' })).toBeTruthy();
  });

  it('未配置辅助入口与页脚时不渲染', () => {
    const { container } = renderDsl({ type: 'Login' });
    expect(container.querySelector('footer')).toBeNull();
    expect(container.querySelector('[data-slot=link]')).toBeNull();
  });

  it('辅助入口：配 href 渲染链接，未配 href 触发 DSL 事件', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Login',
      props: {
        registerLink: { text: '注册账号' },
        forgotLink: { text: '忘记密码', href: '/forgot' },
        footer: '© 2026 Pactor',
      },
      events: {
        onRegisterClick: { action: 'setState', params: { went: 'register' } },
      },
    });

    const forgot = screen.getByText('忘记密码');
    expect(forgot.tagName).toBe('A');
    expect(forgot.getAttribute('href')).toBe('/forgot');

    await user.click(screen.getByText('注册账号'));
    await expectEventState(context, 'went', 'register');
    expect(screen.getByText('© 2026 Pactor')).toBeTruthy();
  });

  it('必填校验失败就地报错且不触发 onSubmit', async () => {
    const { context } = renderDsl({
      type: 'Login',
      events: {
        onSubmit: { action: 'setState', params: { submitted: true } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '登 录' }));
    expect(await screen.findByText('请输入用户名')).toBeTruthy();
    expect(screen.getByText('请输入密码')).toBeTruthy();
    expect(context.state.get('submitted')).toBeUndefined();
  });

  it('校验通过后 onSubmit 抛出 values', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Login',
      events: {
        onSubmit: {
          action: 'setState',
          params: { loginUser: '${event.username}' },
        },
      },
    });

    await user.type(screen.getByLabelText('用户名'), 'admin');
    await user.type(screen.getByLabelText('密码'), 'pactor123');
    await user.click(screen.getByRole('button', { name: '登 录' }));
    await expectEventState(context, 'loginUser', 'admin');
  });
});
