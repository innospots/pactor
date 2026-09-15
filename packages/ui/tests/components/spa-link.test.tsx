// @vitest-environment jsdom
/**
 * 站内链接 SPA 导航契约（spec: embedded-page-view / 站内导航）：
 * Link / Breadcrumb 仍渲染原生 `<a href>`，仅拦截「站内路径（/ 开头）+
 * 左键无修饰键 + target 缺省或 _self」的点击，preventDefault 后走
 * route.navigate；外链 / 锚点 / 显式 target / 修饰键点击保持原生行为。
 */
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderDsl } from './helpers.js';

describe('Link SPA 导航', () => {
  it('站内路径左键点击：拦截并走 route.navigate', () => {
    const navigate = vi.fn();
    renderDsl(
      { type: 'Link', props: { text: '详情', href: '/items/1' } },
      { router: { navigate } },
    );

    fireEvent.click(screen.getByRole('link', { name: '详情' }));
    expect(navigate).toHaveBeenCalledWith('/items/1');
  });

  it('修饰键点击（Cmd/Ctrl）保持原生行为，不拦截', () => {
    const navigate = vi.fn();
    renderDsl(
      { type: 'Link', props: { text: '详情', href: '/items/1' } },
      { router: { navigate } },
    );

    fireEvent.click(screen.getByRole('link', { name: '详情' }), { metaKey: true });
    fireEvent.click(screen.getByRole('link', { name: '详情' }), { ctrlKey: true });
    expect(navigate).not.toHaveBeenCalled();
  });

  it('外链与锚点不拦截', () => {
    const navigate = vi.fn();
    renderDsl(
      { type: 'Link', props: { text: '外部', href: 'https://example.com/x' } },
      { router: { navigate } },
    );

    fireEvent.click(screen.getByRole('link', { name: '外部' }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it('显式 target=_blank 的站内链接不拦截', () => {
    const navigate = vi.fn();
    renderDsl(
      { type: 'Link', props: { text: '新窗口', href: '/items/1', target: '_blank' } },
      { router: { navigate } },
    );

    fireEvent.click(screen.getByRole('link', { name: '新窗口' }));
    expect(navigate).not.toHaveBeenCalled();
  });
});

describe('Breadcrumb SPA 导航', () => {
  it('带 href 的站内项点击走 route.navigate，末项不拦截', () => {
    const navigate = vi.fn();
    renderDsl(
      {
        type: 'Breadcrumb',
        props: {
          items: [
            { label: '首页', href: '/' },
            { label: '列表', href: '/list' },
            { label: '详情' },
          ],
        },
      },
      { router: { navigate } },
    );

    fireEvent.click(screen.getByRole('link', { name: '列表' }));
    expect(navigate).toHaveBeenCalledWith('/list');

    navigate.mockClear();
    fireEvent.click(screen.getByRole('link', { name: '首页' }), { metaKey: true });
    expect(navigate).not.toHaveBeenCalled();
  });
});
