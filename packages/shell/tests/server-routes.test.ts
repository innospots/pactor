import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => undefined }),
}));

import { createRuntimeHandlers } from '../src/server/routes.js';

function fixtureDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'shell-routes-'));
  mkdirSync(join(dir, 'dsl/m1'), { recursive: true });
  writeFileSync(
    join(dir, 'dsl/m1/home.yaml'),
    'dsl: "1.0"\npage: { id: home, title: 首页 }\nbody: { type: Text, props: { content: hello } }\n',
  );
  writeFileSync(
    join(dir, 'assembly.json'),
    JSON.stringify({ generatedAt: 'x', modules: [], routes: [] }),
  );
  writeFileSync(
    join(dir, 'pages.json'),
    JSON.stringify({
      pages: [
        { globalPageId: 'm1:home', moduleId: 'm1', pageId: 'home', path: '/m1', title: '首页', version: 1, public: true, dslRef: 'dsl/m1/home.yaml' },
      ],
    }),
  );
  writeFileSync(join(dir, 'menus.json'), JSON.stringify({ menus: [] }));
  writeFileSync(
    join(dir, 'sitemap-meta.json'),
    JSON.stringify({ layout: 'shell', dslVersion: '1.0', app: { name: 'Fixture' }, auth: { loginPath: '/login' }, layouts: {} }),
  );
  writeFileSync(join(dir, 'fragments.json'), JSON.stringify({ fragments: {} }));
  return dir;
}

describe('createRuntimeHandlers', () => {
  it('bootstrap 返回合并 sitemap（no-store）', async () => {
    const handlers = createRuntimeHandlers({ generatedDir: fixtureDir() });
    const res = await handlers.bootstrap();
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    const body = await res.json();
    expect(body.resourceType).toBe('sitemap');
    expect(body.pages).toHaveLength(1);
  });

  it('page 命中返回 PageResource 信封；未命中 404', async () => {
    const handlers = createRuntimeHandlers({ generatedDir: fixtureDir() });
    const ok = await handlers.page(new Request('http://x/api/runtime/pages/m1%3Ahome'), {
      params: Promise.resolve({ pageId: 'm1:home' }),
    });
    expect(ok.status).toBe(200);
    await expect(ok.json()).resolves.toMatchObject({ id: 'm1:home', resourceType: 'page' });

    const missing = await handlers.page(new Request('http://x/api/runtime/pages/m1%3Anope'), {
      params: Promise.resolve({ pageId: 'm1:nope' }),
    });
    expect(missing.status).toBe(404);
  });

  it('fragment 未命中 404', async () => {
    const handlers = createRuntimeHandlers({ generatedDir: fixtureDir() });
    const res = await handlers.fragment(new Request('http://x/api/runtime/fragments/f1'), {
      params: Promise.resolve({ fragmentId: 'f1' }),
    });
    expect(res.status).toBe(404);
  });
});
