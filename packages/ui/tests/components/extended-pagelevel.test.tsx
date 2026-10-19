// @vitest-environment jsdom
/**
 * 页面级组合组件契约（spec: shadcn-extended-components / 页面级组合组件）：
 * Sidebar 布局渲染与 collapsible 折叠，以及通用 props。
 */
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  expectIconBeforeLabel,
  renderDsl,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

describe('Sidebar', () => {
  const sidebarDsl = {
    type: 'Sidebar',
    props: {
      brand: { title: '后台', logo: '/logo.svg' },
      items: [
        { label: '概览', href: '/' },
        {
          label: '配置',
          children: [{ label: '成员', href: '/members' }],
        },
      ],
    },
    children: [{ type: 'Text', props: { text: '主内容' } }],
  } as const;

  it('渲染品牌区、导航项（含嵌套子菜单）与主内容区', () => {
    const { container } = renderDsl(sidebarDsl as never);

    // 品牌文案在侧栏品牌行与移动端顶栏各渲染一份（顶栏桌面经 CSS 隐藏）
    expect(screen.getAllByText('后台').length).toBeGreaterThan(0);
    const logo = container.querySelector(
      '[data-slot=sidebar-brand-logo]',
    ) as HTMLImageElement;
    expect(logo.getAttribute('src')).toBe('/logo.svg');

    const overview = screen.getByRole('link', { name: '概览' });
    expect(overview.getAttribute('href')).toBe('/');
    const member = screen.getByRole('link', { name: '成员' });
    expect(member.getAttribute('href')).toBe('/members');

    expect(
      container.querySelector('[data-slot=sidebar-inset]')!.textContent,
    ).toContain('主内容');
  });

  it('collapsible：点击折叠触发器收起侧栏并触发 onCollapse（传 boolean）', async () => {
    const { container, context } = renderDsl({
      type: 'Sidebar',
      props: { brand: { title: '后台' }, items: [{ label: '概览', href: '/' }], collapsible: true },
      events: {
        onCollapse: { action: 'setState', params: { collapsed: '${event}' } },
      },
      children: [{ type: 'Text', props: { text: '主内容' } }],
    });

    const sidebar = container.querySelector('[data-slot=sidebar]')!;
    expect(sidebar.getAttribute('data-state')).toBe('expanded');

    fireEvent.click(
      container.querySelector('[data-slot=sidebar-collapse-trigger]')!,
    );
    await expectEventState(context, 'collapsed', true);
    expect(sidebar.getAttribute('data-state')).toBe('collapsed');
    expect(sidebar.getAttribute('data-collapsible')).toBe('icon');
    // 折叠后收窄为 icon rail：导航区保留（label CSS 视觉隐藏）
    expect(container.querySelector('[data-slot=sidebar-content]')).not.toBeNull();
    // hover 菜单项经 Tooltip 展示
    fireEvent.focus(container.querySelector('[data-slot=sidebar-menu-button]')!);
    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-slot=tooltip-content]')?.textContent,
      ).toBe('概览');
    });

    fireEvent.click(
      container.querySelector('[data-slot=sidebar-collapse-trigger]')!,
    );
    await expectEventState(context, 'collapsed', false);
    expect(sidebar.getAttribute('data-state')).toBe('expanded');
    expect(container.querySelector('[data-slot=sidebar-content]')).not.toBeNull();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Sidebar',
      props: { brand: { title: 'x' }, ...COMMON_PROPS },
      children: [{ type: 'Text', props: { text: 'y' } }],
    });
    expectCommonProps(container.querySelector('[data-slot=sidebar-wrapper]'));
  });

  it('导航项声明 icon 时在文字前渲染图标（链接与纯文本两种形态）', () => {
    const { container } = renderDsl({
      type: 'Sidebar',
      props: {
        items: [
          { label: '概览', href: '/', icon: 'home' },
          { label: '配置', icon: 'settings' },
        ],
      },
      children: [{ type: 'Text', props: { text: '主内容' } }],
    });

    expectIconBeforeLabel(screen.getByRole('link', { name: '概览' }), '概览');
    // 纯文本项（无 href）渲染为 button
    const textItem = Array.from(
      container.querySelectorAll('[data-slot=sidebar-menu-button]'),
    ).find((el) => el.textContent?.includes('配置'));
    expect(textItem).toBeDefined();
    expectIconBeforeLabel(textItem!, '配置');
  });
});

