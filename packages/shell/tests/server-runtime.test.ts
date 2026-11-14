import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildRuntimeBootstrap } from '../src/server/bootstrap.js';
import { getRuntimeFragmentDsl } from '../src/server/fragments.js';
import { getRuntimePage } from '../src/server/pages.js';
import { resolvePublicPath } from '../src/server/route-resolver.js';
import type { ShellUser } from '../src/server/session.js';

const ADMIN: ShellUser = {
  id: 'u1',
  username: 'admin',
  permissions: ['risk:view'],
};

function fixtureDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'shell-runtime-'));
  mkdirSync(join(dir, 'dsl/m1'), { recursive: true });
  writeFileSync(
    join(dir, 'dsl/m1/home.yaml'),
    'dsl: "1.0"\npage: { id: home, title: 首页 }\nbody: { type: Text, props: { content: hello } }\n',
  );
  writeFileSync(
    join(dir, 'dsl/m1/log-detail.yaml'),
    'dsl: "1.0"\npage: { id: log-detail, title: 日志 }\nbody: { type: Text, props: { content: logs } }\n',
  );
  writeFileSync(
    join(dir, 'assembly.json'),
    JSON.stringify({
      generatedAt: 'x',
      modules: [],
      routes: [
        { publicPath: '/m1', moduleId: 'm1', pageId: 'home', globalPageId: 'm1:home', pattern: '/m1', paramNames: [] },
        { publicPath: '/m1/logs/:id', moduleId: 'm1', pageId: 'log-detail', globalPageId: 'm1:log-detail', pattern: '/m1/logs/:id', paramNames: ['id'] },
      ],
    }),
  );
  writeFileSync(
    join(dir, 'pages.json'),
    JSON.stringify({
      pages: [
        { globalPageId: 'm1:home', moduleId: 'm1', pageId: 'home', path: '/m1', title: '首页', version: 1, public: true, dslRef: 'dsl/m1/home.yaml' },
        { globalPageId: 'm1:log-detail', moduleId: 'm1', pageId: 'log-detail', path: '/m1/logs/:id', title: '日志', version: 1, permission: 'risk:view', lazy: true, dslRef: 'dsl/m1/log-detail.yaml' },
      ],
    }),
  );
  writeFileSync(
    join(dir, 'menus.json'),
    JSON.stringify({
      menus: [
        { id: 'home', type: 'page', pageId: 'm1:home', title: '首页', public: true },
        { id: 'logs', type: 'page', pageId: 'm1:log-detail', title: '日志' },
      ],
    }),
  );
  writeFileSync(
    join(dir, 'sitemap-meta.json'),
    JSON.stringify({ layout: 'shell', dslVersion: '1.0', app: { name: 'Fixture' }, auth: { loginPath: '/login' }, layouts: {} }),
  );
  writeFileSync(join(dir, 'fragments.json'), JSON.stringify({ fragments: {} }));
  return dir;
}

describe('buildRuntimeBootstrap', () => {
  it('匿名用户只见 public 页面与菜单；非 lazy 页内联 pageDsl', () => {
    const sitemap = buildRuntimeBootstrap(null, { generatedDir: fixtureDir() });
    expect(sitemap.resourceType).toBe('sitemap');
    expect(sitemap.pages).toHaveLength(1);
    expect(sitemap.pages?.[0]?.id).toBe('m1:home');
    expect(sitemap.pages?.[0]?.pageDsl).toMatchObject({ page: { id: 'home' } });
    expect(sitemap.menus).toHaveLength(1);
    expect(sitemap.user).toBeUndefined();
  });

  it('登录用户带权限时可见 permission 页面（lazy 页不内联 DSL）', () => {
    const sitemap = buildRuntimeBootstrap(ADMIN, { generatedDir: fixtureDir() });
    expect(sitemap.pages).toHaveLength(2);
    const lazy = sitemap.pages?.find((p) => p.id === 'm1:log-detail');
    expect(lazy?.pageDsl).toBeUndefined();
    expect(sitemap.user).toMatchObject({ id: 'u1', username: 'admin' });
    expect(sitemap.permissions).toEqual(['risk:view']);
  });
});

describe('getRuntimePage', () => {
  it('页面不存在 → not_found', () => {
    expect(getRuntimePage('m1:nope', null, { generatedDir: fixtureDir() }).kind).toBe('not_found');
  });

  it('匿名访问 permission 页 → unauthorized；登录无权限 → forbidden；有权限 → ok', () => {
    const generatedDir = fixtureDir();
    expect(getRuntimePage('m1:log-detail', null, { generatedDir }).kind).toBe('unauthorized');
    expect(
      getRuntimePage('m1:log-detail', { id: 'u2', username: 'u2', permissions: [] }, { generatedDir }).kind,
    ).toBe('forbidden');
    const ok = getRuntimePage('m1:log-detail', ADMIN, { generatedDir });
    expect(ok.kind).toBe('ok');
    if (ok.kind === 'ok') {
      expect(ok.resource.resourceType).toBe('page');
      expect(ok.resource.id).toBe('m1:log-detail');
    }
  });
});

describe('getRuntimeFragmentDsl', () => {
  it('未命中返回 null', () => {
    expect(getRuntimeFragmentDsl('f1', null, { generatedDir: fixtureDir() })).toBeNull();
  });
});

describe('resolvePublicPath', () => {
  it('精确匹配与 :param 模式匹配', () => {
    const generatedDir = fixtureDir();
    expect(resolvePublicPath('/m1', { generatedDir })?.globalPageId).toBe('m1:home');
    const resolved = resolvePublicPath('/m1/logs/42', { generatedDir });
    expect(resolved?.globalPageId).toBe('m1:log-detail');
    expect(resolved?.params).toEqual({ id: '42' });
    expect(resolvePublicPath('/nope', { generatedDir })).toBeNull();
  });
});
