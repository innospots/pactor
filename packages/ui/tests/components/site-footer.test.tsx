// @vitest-environment jsdom
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { COMMON_PROPS_PROBE, expectEventState, renderDsl } from './helpers.js';

const FOOTER_NODE = {
  type: 'SiteFooter',
  props: {
    brand: {
      name: 'Pactor',
      description: 'DSL 驱动的应用构建平台',
    },
    groups: [
      {
        title: '产品',
        links: [
          { text: '组件库', href: '/components' },
          { text: '模板中心', href: '/templates' },
        ],
      },
      {
        title: '资源',
        links: [{ text: '反馈问题', href: '/feedback' }],
      },
    ],
    copyright: '© 2026 Pactor',
    bottomLinks: [
      { text: '隐私协议', href: '/privacy' },
      { text: '服务条款' },
    ],
  },
} as const;

describe('SiteFooter 业务组件', () => {
  it('完整形态：品牌区 + 链接列组 + 底部版权栏', () => {
    const { container } = renderDsl(FOOTER_NODE);

    const root = container.querySelector('[data-slot=site-footer]');
    expect(root).not.toBeNull();
    // 品牌区
    expect(screen.getByText('Pactor')).toBeTruthy();
    expect(screen.getByText('DSL 驱动的应用构建平台')).toBeTruthy();
    // 链接列组
    expect(screen.getByText('产品')).toBeTruthy();
    expect(screen.getByText('资源')).toBeTruthy();
    // 底部栏
    expect(screen.getByText('© 2026 Pactor')).toBeTruthy();
    expect(screen.getByText('隐私协议')).toBeTruthy();
    expect(screen.getByText('服务条款')).toBeTruthy();
  });

  it('href 链接渲染 <a>，无 href 链接渲染 button 并触发 onLinkClick 事件', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'SiteFooter',
      props: {
        copyright: '© 2026 Pactor',
        groups: [
          {
            title: '产品',
            links: [{ text: '组件库', href: '/components' }, { text: '反馈问题' }],
          },
        ],
      },
      events: {
        onLinkClick: {
          action: 'setState',
          params: { clicked: '${event}' },
        },
      },
    });

    const anchor = container.querySelector(
      '[data-slot=site-footer] a[href="/components"]',
    );
    expect(anchor).not.toBeNull();
    expect(anchor!.textContent).toBe('组件库');

    await user.click(screen.getByRole('button', { name: '反馈问题' }));
    await expectEventState(context, 'clicked', {
      key: '反馈问题',
      text: '反馈问题',
    });
  });

  it('空配置渲染 null（无任何区块）', () => {
    const { container } = renderDsl({ type: 'SiteFooter', props: {} });
    expect(container.querySelector('[data-slot=site-footer]')).toBeNull();
  });

  it('通用 props：className / style 挂根节点', () => {
    const { container } = renderDsl({
      type: 'SiteFooter',
      props: {
        copyright: '© 2026 Pactor',
        ...COMMON_PROPS_PROBE,
      },
    });
    const root = container.querySelector('[data-slot=site-footer]');
    expect(root!.className).toContain('biz-probe');
    expect(root!.getAttribute('style')).toContain('opacity: 0.5');
  });

  it('logo 图片渲染并取 name 作 alt', () => {
    const { container } = renderDsl({
      type: 'SiteFooter',
      props: {
        brand: { logo: '/logo.png', name: 'Pactor' },
        copyright: '© 2026 Pactor',
      },
    });
    const img = container.querySelector('img[src="/logo.png"]');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('alt')).toBe('Pactor');
  });
});
