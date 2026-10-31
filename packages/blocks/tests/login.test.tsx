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
  it('默认 split + 认证卡片：品牌区 + 用户名字段 + 密码字段', () => {
    const { container } = renderDsl({
      type: 'Login',
      props: { brand },
    });

    const root = container.querySelector('[data-slot=login]');
    expect(root).not.toBeNull();
    expect(root!.getAttribute('data-layout')).toBe('split');
    // 分栏布局渲染两处品牌标识（桌面品牌区 + 窄屏收缩行）
    expect(screen.getAllByText('Pactor Console').length).toBe(2);
    expect(screen.getByText('统一管理后台')).toBeTruthy();
    expect(screen.getByText('面向管理员的一站式控制台')).toBeTruthy();
    expect(container.querySelector('img[src="/brand.webp"]')).not.toBeNull();
    expect(screen.getByPlaceholderText('请输入用户名')).toBeTruthy();
    expect(screen.getByPlaceholderText('请输入密码')).toHaveProperty('type', 'password');
    expect(screen.getByRole('button', { name: '登 录' })).toBeTruthy();
  });

  it.each(['split', 'centered', 'brand-card', 'overlap', 'backdrop'])(
    'layout=%s 渲染对应 data-layout',
    (layout) => {
      const { container } = renderDsl({ type: 'Login', props: { layout } });
      expect(
        container.querySelector('[data-slot=login]')!.getAttribute('data-layout'),
      ).toBe(layout);
    },
  );

  it('authVariant：plain 无卡片容器，float 大尺寸悬浮卡片（440px + shadow-xl）', () => {
    const plain = renderDsl({
      type: 'Login',
      props: { layout: 'centered', authVariant: 'plain' },
    });
    expect(plain.container.querySelector('[data-slot=card]')).toBeNull();
    plain.unmount();

    const float = renderDsl({
      type: 'Login',
      props: { layout: 'centered', authVariant: 'float' },
    });
    const card = float.container.querySelector('[data-slot=card]');
    expect(card).not.toBeNull();
    expect(card!.className).toContain('max-w-[440px]');
    expect(card!.className).toContain('shadow-xl');
  });

  it('brandRatio 写入分栏比例 CSS 变量，brandSide=right 品牌面板在右', () => {
    const { container, unmount } = renderDsl({
      type: 'Login',
      props: { brandRatio: 0.6 },
    });
    const root = container.querySelector('[data-slot=login]') as HTMLElement;
    expect(root.style.getPropertyValue('--login-grid')).toContain('0.6fr');
    unmount();

    const right = renderDsl({
      type: 'Login',
      props: { brandSide: 'right', authVariant: 'plain', brand: { name: 'A', title: '概念展示' } },
    });
    const panel = right.container.querySelector('.order-last');
    expect(panel).not.toBeNull();
    expect(panel!.querySelector('[data-slot=login-default-illustration]')).not.toBeNull();
  });

  it('居中布局不渲染分栏品牌区（无插画与品牌描述）', () => {
    const { container } = renderDsl({
      type: 'Login',
      props: { layout: 'centered', brand },
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

  it('brandSide=right：brand-card / overlap / backdrop 品牌区镜像到右侧（DOM 后置 + 叠加方向翻转）', () => {
    // brand-card：表单在前、品牌卡在后
    const bc = renderDsl({
      type: 'Login',
      props: { layout: 'brand-card', brandSide: 'right', brand },
    });
    const bcRow = bc.container.querySelector('.md\\:flex-row')!;
    expect(
      bc.container.querySelector('[data-slot=login]')!.getAttribute('data-brand-side'),
    ).toBe('right');
    // 品牌卡（含插画）为行内最后一个节点
    expect(bcRow.lastElementChild!.querySelector('img[src="/brand.webp"]')).not.toBeNull();
    bc.unmount();

    // overlap：登录卡在前、品牌卡在后，叠加方向翻转为 -mr-24；
    // 品牌卡内容右对齐（文字右对齐 + 插画贴右缘），但容器保持全宽、尺寸不变
    const ol = renderDsl({
      type: 'Login',
      props: { layout: 'overlap', brandSide: 'right', brand },
    });
    const olRow = ol.container.querySelector('.md\\:flex-row')!;
    expect(olRow.firstElementChild!.className).toContain('md:-mr-24');
    const olBrandCard = olRow.lastElementChild!;
    expect(olBrandCard.querySelector('img[src="/brand.webp"]')).not.toBeNull();
    const rightContent = olBrandCard.querySelector(
      '[data-slot=login-brand-card-content]',
    )!;
    expect(rightContent.className).toContain('text-right');
    // 不用 items-end（shrink-to-fit 会缩窄插画、改变卡片高度）
    expect(rightContent.className).not.toContain('items-end');
    // 视觉区保持全宽，插画贴右缘
    const visual = rightContent.querySelector('img[src="/brand.webp"]')!;
    expect(visual.className).toContain('w-full');
    expect(visual.className).toContain('self-end');
    ol.unmount();

    // overlap 默认 left：品牌卡内容不右对齐
    const olLeft = renderDsl({
      type: 'Login',
      props: { layout: 'overlap', brand },
    });
    const leftContent = olLeft.container.querySelector(
      '[data-slot=login-brand-card-content]',
    )!;
    expect(leftContent.className).not.toContain('text-right');
    olLeft.unmount();

    // backdrop：认证列在前、品牌列（含插画）在后
    const bd = renderDsl({
      type: 'Login',
      props: { layout: 'backdrop', brandSide: 'right', brand },
    });
    const bdRoot = bd.container.querySelector('[data-slot=login]')!;
    expect(bdRoot.getAttribute('data-brand-side')).toBe('right');
    expect(bdRoot.lastElementChild!.querySelector('img[src="/brand.webp"]')).not.toBeNull();
    bd.unmount();
  });

  it('默认渲染背景装饰，decor=false 关闭，brandPanelBackground=false 去品牌面板渐变', () => {
    const { container, unmount } = renderDsl({ type: 'Login', props: {} });
    expect(container.querySelector('[data-slot=login-bg-decor]')).not.toBeNull();
    unmount();

    const noDecor = renderDsl({ type: 'Login', props: { decor: false } });
    expect(noDecor.container.querySelector('[data-slot=login-bg-decor]')).toBeNull();
    noDecor.unmount();

    const noPanelBg = renderDsl({
      type: 'Login',
      props: { brandPanelBackground: false },
    });
    const panel = noPanelBg.container.querySelector('.md\\:flex');
    expect(panel).not.toBeNull();
    expect(panel!.className).not.toContain('bg-muted');
  });

  it('文案 props 覆盖 i18n 缺省', () => {
    renderDsl({
      type: 'Login',
      props: { title: '欢迎回来', submitText: '进入控制台' },
    });
    expect(screen.getByText('欢迎回来')).toBeTruthy();
    expect(screen.getByRole('button', { name: '进入控制台' })).toBeTruthy();
  });

  it('errorMessage：缺省非空即展示内联错误提示（destructive Alert）', () => {
    renderDsl({
      type: 'Login',
      props: { errorMessage: '用户名或密码错误' },
    });
    expect(screen.getByText('用户名或密码错误')).toBeTruthy();
    expect(document.querySelector('[data-slot=alert]')).not.toBeNull();
  });

  it('errorVisible：显式关闭时隐藏错误提示，驱动 DSL 失败/复位编排', () => {
    renderDsl({
      type: 'Login',
      props: {
        errorMessage: '${state.msg}',
        errorVisible: '${state.show}',
      },
    }, { state: { msg: '用户名或密码错误', show: false } });
    expect(screen.queryByText('用户名或密码错误')).toBeNull();
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

    await user.type(screen.getByPlaceholderText('请输入用户名'), 'admin');
    await user.type(screen.getByPlaceholderText('请输入密码'), 'pactor123');
    await user.click(screen.getByRole('button', { name: '登 录' }));
    await expectEventState(context, 'loginUser', 'admin');
  });

  it('children 插槽替换内置表单：内嵌 Tabs 切换登录方式，标题与辅助入口保留', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Login',
      props: {
        title: '登录你的设计账号',
        registerLink: { text: '立即注册' },
      },
      events: {
        onRegisterClick: { action: 'setState', params: { register: true } },
      },
      children: [
        {
          type: 'Tabs',
          props: {
            items: [
              {
                key: 'sms',
                label: '手机验证码登录',
                children: [
                  {
                    type: 'Form',
                    props: { name: 'smsLogin' },
                    children: [
                      { type: 'Input', props: { name: 'phone', placeholder: '请输入手机号' } },
                      { type: 'Button', props: { submit: true, text: '获取验证码并登录' } },
                    ],
                    events: {
                      onSubmit: { action: 'setState', params: { smsPhone: '${event.phone}' } },
                    },
                  },
                ],
              },
              {
                key: 'password',
                label: '账号密码登录',
                children: [
                  { type: 'Text', props: { text: '账号密码表单占位' } },
                ],
              },
            ],
          },
        },
      ],
    });

    // 内置账号密码表单被插槽替换
    expect(screen.queryByLabelText('用户名')).toBeNull();
    // 标题与辅助入口保留
    expect(screen.getByText('登录你的设计账号')).toBeTruthy();
    expect(screen.getByText('立即注册')).toBeTruthy();
    // Tabs 两个页签渲染，默认第一个页签的内容可见
    expect(screen.getByRole('tab', { name: '手机验证码登录' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: '账号密码登录' })).toBeTruthy();
    expect(screen.getByPlaceholderText('请输入手机号')).toBeTruthy();

    // 插槽内表单事件自行编排
    await user.type(screen.getByPlaceholderText('请输入手机号'), '13800001111');
    await user.click(screen.getByRole('button', { name: '获取验证码并登录' }));
    await expectEventState(context, 'smsPhone', '13800001111');

    // 切换到账号密码页签
    await user.click(screen.getByRole('tab', { name: '账号密码登录' }));
    expect(await screen.findByText('账号密码表单占位')).toBeTruthy();
  });
});
