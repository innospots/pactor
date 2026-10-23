import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  matchPathPattern,
  rewriteDslUrls,
  rewriteNavigationTo,
  type RewriteContext,
} from './rewrite-urls.js';
import { createTempDir, writeText } from './test-utils.js';

describe('rewrite-urls', () => {
  let temp: ReturnType<typeof createTempDir>;
  let ctx: RewriteContext;

  beforeEach(() => {
    temp = createTempDir();
    writeText(join(temp.dir, 'next.svg'), '<svg/>');
    ctx = {
      basePath: '/risk',
      pagePaths: ['/dashboard', '/tasks/:id'],
      loginPath: '/login',
      publicDir: temp.dir,
      rewriteNavigation: true,
      rewriteAssets: true,
      assetPrefix: '/modules/risk/1.0.0',
      absoluteApiToRelative: true,
    };
  });
  afterEach(() => temp.cleanup());

  it('导航 to 命中模块内页面路径时加 basePath 前缀', () => {
    const { value } = rewriteDslUrls(
      { action: 'navigate', params: { to: '/dashboard' } },
      ctx,
    );
    expect((value as { params: { to: string } }).params.to).toBe('/risk/dashboard');
  });

  it('导航 to 命中 :param 页面模式（含 ${} 模板段）时加前缀', () => {
    expect(rewriteNavigationTo('/tasks/${row.id}', ctx)).toBe('/risk/tasks/${row.id}');
    expect(rewriteNavigationTo('/tasks/42', ctx)).toBe('/risk/tasks/42');
  });

  it('app.reload 的 to 命中 loginPath 时加前缀', () => {
    const { value } = rewriteDslUrls(
      { action: 'app.reload', params: { to: '/login' } },
      ctx,
    );
    expect((value as { params: { to: string } }).params.to).toBe('/risk/login');
  });

  it('不重写：request 的 API url、http 外链、已带前缀、非模块路径', () => {
    const { value } = rewriteDslUrls(
      [
        { action: 'request', params: { url: '/api/auth/login' } },
        { action: 'navigate', params: { to: 'https://example.com/x' } },
        { action: 'navigate', params: { to: '/risk/dashboard' } },
        { action: 'navigate', params: { to: '/unknown/path' } },
        { action: 'navigate', params: { to: '${event}' } },
      ],
      ctx,
    );
    const list = value as { action: string; params: Record<string, string> }[];
    expect(list[0]!.params.url).toBe('/api/auth/login');
    expect(list[1]!.params.to).toBe('https://example.com/x');
    expect(list[2]!.params.to).toBe('/risk/dashboard');
    expect(list[3]!.params.to).toBe('/unknown/path');
    expect(list[4]!.params.to).toBe('${event}');
  });

  it('资源 URL：存在于 publicDir 的 / 开头字符串重写为 /modules/<id>/<version>/ 前缀', () => {
    const { value } = rewriteDslUrls(
      { props: { logo: '/next.svg', missing: '/missing.svg' } },
      ctx,
    );
    const props = (value as { props: Record<string, string> }).props;
    expect(props.logo).toBe('/modules/risk/1.0.0/next.svg');
    expect(props.missing).toBe('/missing.svg');
  });

  it('页面路径字符串不做资源重写', () => {
    const { value } = rewriteDslUrls({ props: { link: '/dashboard' } }, ctx);
    expect((value as { props: { link: string } }).props.link).toBe('/dashboard');
  });

  it('http(s) 外链字符串不重写', () => {
    const { value, warnings } = rewriteDslUrls(
      { props: { doc: 'https://docs.example.com/guide' } },
      ctx,
    );
    expect((value as { props: { doc: string } }).props.doc).toBe(
      'https://docs.example.com/guide',
    );
    expect(warnings).toEqual([]);
  });

  it('绝对 API 地址：默认重写为去 origin 相对路径并告警', () => {
    const { value, warnings } = rewriteDslUrls(
      { action: 'request', params: { url: 'http://localhost:8011/api/auth/login' } },
      ctx,
    );
    expect((value as { params: { url: string } }).params.url).toBe('/api/auth/login');
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('http://localhost:8011/api/auth/login');
  });

  it('绝对 API 地址：absoluteApiToRelative=false 时仅告警不改写', () => {
    const { value, warnings } = rewriteDslUrls(
      { action: 'request', params: { url: 'http://localhost:8011/api/d' } },
      { ...ctx, absoluteApiToRelative: false },
    );
    expect((value as { params: { url: string } }).params.url).toBe(
      'http://localhost:8011/api/d',
    );
    expect(warnings).toHaveLength(1);
  });

  it('rewriteNavigation=false 时导航不重写', () => {
    const { value } = rewriteDslUrls(
      { action: 'navigate', params: { to: '/dashboard' } },
      { ...ctx, rewriteNavigation: false },
    );
    expect((value as { params: { to: string } }).params.to).toBe('/dashboard');
  });

  it('深层嵌套（数组 + 对象）中的字符串也会被遍历重写', () => {
    const { value } = rewriteDslUrls(
      { body: { children: [{ props: { icon: '/next.svg' } }] } },
      ctx,
    );
    const body = (value as { body: { children: { props: { icon: string } }[] } }).body;
    expect(body.children[0]!.props.icon).toBe('/modules/risk/1.0.0/next.svg');
  });

  it('matchPathPattern：段数、:param、查询串', () => {
    expect(matchPathPattern('/a/:id', '/a/1')).toBe(true);
    expect(matchPathPattern('/a/:id', '/a/1?x=2')).toBe(true);
    expect(matchPathPattern('/a/:id', '/a')).toBe(false);
    expect(matchPathPattern('/a/b', '/a/b')).toBe(true);
    expect(matchPathPattern('/a/b', '/a/c')).toBe(false);
  });
});
