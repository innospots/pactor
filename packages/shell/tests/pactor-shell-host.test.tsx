// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import type { ComponentType } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

const captured = vi.hoisted(() => ({ props: null as Record<string, unknown> | null }));
const pushMock = vi.hoisted(() => vi.fn());

vi.mock('pactor-app', () => ({
  SitemapApp: (props: Record<string, unknown>) => {
    captured.props = props;
    return null;
  },
  createHttpHooks: () => ({ tag: 'default-http' }),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/pactor-app-risk-analysis',
  useSearchParams: () => new URLSearchParams('tab=a'),
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// blocks 的 Login 实现与本包注册逻辑无关，桩掉避免拉起整条组件依赖链
vi.mock('@pactor-app/blocks', () => ({
  Login: () => null,
}));

import { PactorShellHost } from '../src/client/PactorShellHost.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(cleanup);

const Panel: ComponentType<unknown> = () => null;

describe('PactorShellHost', () => {
  it('默认端点、模块扩展合并与 SkinSwitcher 注册', () => {
    render(<PactorShellHost extensions={{ m1: { components: { Panel } } }} />);
    const props = captured.props!;
    expect(props.sources).toEqual(['/api/runtime/bootstrap']);
    expect((props.pageEndpoint as (id: string) => string)('m1:home')).toBe(
      '/api/runtime/pages/m1%3Ahome',
    );
    expect(props.pathname).toBe('/pactor-app-risk-analysis');
    expect(props.query).toEqual({ tab: 'a' });
    const components = props.components as Record<string, unknown>;
    expect(components.Panel).toBe(Panel);
    expect(components['m1/Panel']).toBe(Panel);
    expect(components.SkinSwitcher).toBeTypeOf('function');
    expect(props.httpAdapter).toEqual({ tag: 'default-http' });
  });

  it('skinSwitcher=false 时不注册 DSL 皮肤组件', () => {
    render(<PactorShellHost extensions={{}} skinSwitcher={false} />);
    const components = captured.props!.components as Record<string, unknown>;
    expect('SkinSwitcher' in components).toBe(false);
  });

  it('navigate 走宿主 router.push；端点可覆盖', () => {
    render(
      <PactorShellHost
        extensions={{}}
        sitemapSource="/api/custom/sitemap"
        pageEndpoint={(id) => `/api/custom/${id}`}
      />,
    );
    const props = captured.props!;
    expect(props.sources).toEqual(['/api/custom/sitemap']);
    expect((props.pageEndpoint as (id: string) => string)('m1:home')).toBe('/api/custom/m1:home');
    (props.navigate as (to: string) => void)('/m1');
    expect(pushMock).toHaveBeenCalledWith('/m1');
  });

  it('内建注册 NavigationShell / SkinGallery / Login（默认站点布局与页面依赖）', () => {
    render(<PactorShellHost extensions={{}} />);
    const components = captured.props!.components as Record<string, unknown>;
    expect(components.NavigationShell).toBeTypeOf('function');
    expect(components.SkinGallery).toBeTypeOf('function');
    expect(components.Login).toBeTypeOf('function');
    // UserMenu 覆盖 UI kit 同名注册：叠加外壳默认配置与外观模式同步
    expect(components.UserMenu).toBeTypeOf('function');
  });

  it('宿主 components 同名覆盖内建注册', () => {
    render(
      <PactorShellHost extensions={{}} components={{ NavigationShell: Panel }} />,
    );
    const components = captured.props!.components as Record<string, unknown>;
    expect(components.NavigationShell).toBe(Panel);
    expect(components.SkinGallery).toBeTypeOf('function');
  });
});
