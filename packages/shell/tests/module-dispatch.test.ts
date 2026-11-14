import { describe, expect, it } from 'vitest';

import {
  createModuleDispatcher,
  type ModuleApiRouteContext,
} from '../src/server/module-dispatch.js';

const dispatcher = createModuleDispatcher({
  'mod-a': {
    moduleId: 'mod-a',
    package: 'mod-a',
    prefixes: ['/api/mod-a'],
    handlers: {
      '/api/mod-a/items': {
        GET: (_request, ctx) =>
          Response.json({ ok: true, q: ctx.url.searchParams.get('q') }),
      },
      '/api/mod-a/items/:id': {
        GET: (_request, ctx) => Response.json({ id: ctx.params.id }),
      },
      '/api/mod-a/submit': { POST: () => new Response(null, { status: 201 }) },
      '/api/mod-a/boom': {
        GET: () => {
          throw new Error('explode');
        },
      },
    },
  },
});

function ctx(moduleId: string): ModuleApiRouteContext {
  return { params: Promise.resolve({ moduleId }) };
}

function req(path: string, method = 'GET'): Request {
  return new Request(`http://localhost:9020${path}`, { method });
}

describe('createModuleDispatcher', () => {
  it('命中 handler 并透传 query', async () => {
    const res = await dispatcher(req('/api/modules/mod-a/mod-a/items?q=x'), ctx('mod-a'));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true, q: 'x' });
  });

  it(':param 模式匹配并解码参数', async () => {
    const res = await dispatcher(req('/api/modules/mod-a/mod-a/items/42'), ctx('mod-a'));
    await expect(res.json()).resolves.toEqual({ id: '42' });
  });

  it('未知模块 / 前缀外路径 / 未注册路径 → 404', async () => {
    expect((await dispatcher(req('/api/modules/nope/items'), ctx('nope'))).status).toBe(404);
    expect((await dispatcher(req('/api/modules/mod-a/other'), ctx('mod-a'))).status).toBe(404);
    expect((await dispatcher(req('/api/modules/mod-a'), ctx('mod-a'))).status).toBe(404);
  });

  it('route params 与 URL 还原的 moduleId 不一致 → 404', async () => {
    expect((await dispatcher(req('/api/modules/mod-a/items'), ctx('mod-b'))).status).toBe(404);
  });

  it('路径命中但方法不支持 → 405 + Allow', async () => {
    const res = await dispatcher(req('/api/modules/mod-a/mod-a/items', 'POST'), ctx('mod-a'));
    expect(res.status).toBe(405);
    expect(res.headers.get('allow')).toBe('GET, HEAD, OPTIONS');
  });

  it('HEAD 无 handler 时回退 GET；OPTIONS 返回 204 + Allow', async () => {
    const head = await dispatcher(req('/api/modules/mod-a/mod-a/items', 'HEAD'), ctx('mod-a'));
    expect(head.status).toBe(200);
    const options = await dispatcher(req('/api/modules/mod-a/mod-a/submit', 'OPTIONS'), ctx('mod-a'));
    expect(options.status).toBe(204);
    expect(options.headers.get('allow')).toBe('POST, OPTIONS');
  });

  it('handler 抛错 → 500', async () => {
    const res = await dispatcher(req('/api/modules/mod-a/mod-a/boom'), ctx('mod-a'));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'internal_error' });
  });
});
