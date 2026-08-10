import type { FragmentDsl, PageDsl } from 'pactor-core';
import { describe, expect, it } from 'vitest';

import { MemoryResourceCache } from '../cache/memory-cache.js';
import { ResourceError } from '../errors.js';
import type {
  HttpAdapter,
  HttpAdapterRequest,
  HttpAdapterResponse,
} from '../http-adapter.js';
import type {
  DslResourceEnvelope,
  DslResourceLoader,
  PageResource,
} from '../types.js';
import { HttpDslResourceLoader } from './http-loader.js';
import { StaticDslLoader } from './static-loader.js';

const pageDsl: PageDsl = {
  dsl: '1.0',
  page: { id: 'customer-list', title: '客户管理' },
  body: { type: 'Page', children: [] },
};

const fragmentDsl: FragmentDsl = {
  dsl: '1.0',
  fragment: { id: 'customer-card' },
  body: { type: 'Card' },
};

function pageEnvelope(version = 103, etag?: string): PageResource {
  return {
    id: 'customer-list',
    resourceType: 'page',
    version,
    dslVersion: '1.0',
    etag,
    schema: pageDsl,
  };
}

/** mock HttpAdapter：按队列返回响应，记录全部请求 */
function createMockAdapter(
  queue: Array<HttpAdapterResponse | ((req: HttpAdapterRequest) => HttpAdapterResponse)>,
) {
  const calls: HttpAdapterRequest[] = [];
  const adapter: HttpAdapter = async (request) => {
    calls.push(request);
    const next = queue.shift();
    if (!next) {
      throw new Error(`mock adapter 响应队列已空: ${request.url}`);
    }
    return typeof next === 'function' ? next(request) : next;
  };
  return { adapter, calls };
}

type Cache = MemoryResourceCache<DslResourceEnvelope<unknown>>;

describe('HttpDslResourceLoader', () => {
  it('加载页面资源：adapter 对 /api/runtime/pages/customer-list 返回 200 与 envelope', async () => {
    const { adapter, calls } = createMockAdapter([
      { status: 200, data: pageEnvelope() },
    ]);
    const loader = new HttpDslResourceLoader({ adapter });

    const resource = await loader.loadPage('customer-list');

    expect(calls[0]?.url).toBe('/api/runtime/pages/customer-list');
    expect(resource.id).toBe('customer-list');
    expect(resource.version).toBe(103);
    expect(resource.schema).toEqual(pageDsl);
  });

  it('加载 Fragment 资源：访问 /api/runtime/fragments/{id}', async () => {
    const { adapter, calls } = createMockAdapter([
      {
        status: 200,
        data: {
          id: 'customer-card',
          resourceType: 'fragment',
          version: 2,
          dslVersion: '1.0',
          schema: fragmentDsl,
        },
      },
    ]);
    const loader = new HttpDslResourceLoader({ adapter });

    const resource = await loader.loadFragment('customer-card');

    expect(calls[0]?.url).toBe('/api/runtime/fragments/customer-card');
    expect(resource.resourceType).toBe('fragment');
    expect(resource.schema).toEqual(fragmentDsl);
  });

  it('404 抛 ResourceError 且 status 为 404', async () => {
    const { adapter } = createMockAdapter([{ status: 404 }]);
    const loader = new HttpDslResourceLoader({ adapter });

    const error = await loader.loadPage('missing').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ResourceError);
    expect((error as ResourceError).status).toBe(404);
  });

  it('自定义 baseUrl：请求 URL 以 /custom/runtime/pages/ 开头', async () => {
    const { adapter, calls } = createMockAdapter([
      { status: 200, data: pageEnvelope() },
    ]);
    const loader = new HttpDslResourceLoader({
      adapter,
      baseUrl: '/custom/runtime',
    });

    await loader.loadPage('customer-list');

    expect(calls[0]?.url.startsWith('/custom/runtime/pages/')).toBe(true);
  });

  it('bootstrap 返回版本表：资源中可读取 pageVersions，且自动更新版本表', async () => {
    const cache: Cache = new MemoryResourceCache();
    const { adapter } = createMockAdapter([
      {
        status: 200,
        data: {
          app: { id: 'crm' },
          user: { id: 'u1' },
          permissions: ['customer:view'],
          menus: [],
          pageVersions: { 'customer-list': 103 },
        },
      },
      { status: 200, data: pageEnvelope(103) },
    ]);
    const loader = new HttpDslResourceLoader({ adapter, cache });

    const bootstrap = await loader.loadBootstrap();
    expect(bootstrap.pageVersions?.['customer-list']).toBe(103);
    expect(bootstrap.app).toEqual({ id: 'crm' });

    // bootstrap 后版本表生效：以 id@version 键缓存
    await loader.loadPage('customer-list');
    expect(cache.get('customer-list@103')).toBeDefined();
  });

  it('接口多实现：同一 DslResourceLoader 接口使用 Http 与 Static 两种 loader', async () => {
    const { adapter } = createMockAdapter([
      { status: 200, data: pageEnvelope() },
    ]);
    const httpLoader: DslResourceLoader = new HttpDslResourceLoader({ adapter });
    const staticLoader: DslResourceLoader = new StaticDslLoader({
      pages: { 'customer-list': pageDsl },
    });

    const loadFirstPage = (loader: DslResourceLoader) =>
      loader.loadPage('customer-list');

    const fromHttp = await loadFirstPage(httpLoader);
    const fromStatic = await loadFirstPage(staticLoader);

    expect(fromHttp.schema).toEqual(pageDsl);
    expect(fromStatic.schema).toEqual(pageDsl);
  });
});

describe('缓存集成', () => {
  it('二次加载命中缓存：HttpAdapter 仅被调用一次，两次返回内容一致', async () => {
    const { adapter, calls } = createMockAdapter([
      { status: 200, data: pageEnvelope() }, // 无 etag、无版本表 → 普通缓存
    ]);
    const loader = new HttpDslResourceLoader({ adapter });

    const first = await loader.loadPage('customer-list');
    const second = await loader.loadPage('customer-list');

    expect(calls).toHaveLength(1);
    expect(second).toBe(first);
  });

  it('版本变化重新加载：customer-list@103 已缓存，版本表更新为 104 后重新请求并以新键缓存', async () => {
    const cache: Cache = new MemoryResourceCache();
    const { adapter, calls } = createMockAdapter([
      { status: 200, data: pageEnvelope(103) },
      { status: 200, data: pageEnvelope(104) },
    ]);
    const loader = new HttpDslResourceLoader({ adapter, cache });
    loader.updateVersions({ 'customer-list': 103 });

    await loader.loadPage('customer-list');
    expect(cache.get('customer-list@103')).toBeDefined();

    loader.updateVersions({ 'customer-list': 104 });
    const resource = await loader.loadPage('customer-list');

    expect(calls).toHaveLength(2);
    expect(resource.version).toBe(104);
    expect(cache.get('customer-list@104')).toBeDefined();
  });

  it('invalidate：缓存两个版本条目后删除该 id 全部条目，后续 loadPage 重新请求', async () => {
    const cache: Cache = new MemoryResourceCache();
    const { adapter, calls } = createMockAdapter([
      { status: 200, data: pageEnvelope(103) },
      { status: 200, data: pageEnvelope(104) },
      { status: 200, data: pageEnvelope(104) },
    ]);
    const loader = new HttpDslResourceLoader({ adapter, cache });
    loader.updateVersions({ 'customer-list': 103 });
    await loader.loadPage('customer-list');
    loader.updateVersions({ 'customer-list': 104 });
    await loader.loadPage('customer-list');
    expect(cache.get('customer-list@103')).toBeDefined();
    expect(cache.get('customer-list@104')).toBeDefined();

    loader.invalidate('customer-list');
    expect(cache.get('customer-list@103')).toBeUndefined();
    expect(cache.get('customer-list@104')).toBeUndefined();

    await loader.loadPage('customer-list');
    expect(calls).toHaveLength(3);
  });

  it('304 复用缓存：请求头含 If-None-Match: v1，返回缓存副本', async () => {
    const { adapter, calls } = createMockAdapter([
      { status: 200, data: pageEnvelope(103), etag: 'v1' },
      { status: 304 },
    ]);
    const loader = new HttpDslResourceLoader({ adapter });

    const first = await loader.loadPage('customer-list');
    const second = await loader.loadPage('customer-list');

    expect(calls).toHaveLength(2);
    expect(calls[1]?.headers?.['If-None-Match']).toBe('v1');
    expect(second).toBe(first);
  });

  it('200 更新缓存：条件请求返回 200 与新 etag，返回新资源并更新缓存', async () => {
    const updatedDsl: PageDsl = { ...pageDsl, state: { keyword: '新' } };
    const { adapter, calls } = createMockAdapter([
      { status: 200, data: pageEnvelope(103), etag: 'v1' },
      {
        status: 200,
        data: { ...pageEnvelope(104), schema: updatedDsl },
        etag: 'v2',
      },
      { status: 304 },
    ]);
    const loader = new HttpDslResourceLoader({ adapter });

    const first = await loader.loadPage('customer-list');
    const updated = await loader.loadPage('customer-list');

    expect(calls[1]?.headers?.['If-None-Match']).toBe('v1');
    expect(updated).not.toBe(first);
    expect(updated.version).toBe(104);
    expect(updated.schema).toEqual(updatedDsl);

    // 缓存已更新为新 etag：第三次条件请求带 If-None-Match: v2，304 返回新资源副本
    const third = await loader.loadPage('customer-list');
    expect(calls[2]?.headers?.['If-None-Match']).toBe('v2');
    expect(third).toBe(updated);
  });

  it('并发 loadPage：缓存未命中时并发调用两次，HttpAdapter 仅被调用一次，两个 Promise 解析为同一资源', async () => {
    const calls: HttpAdapterRequest[] = [];
    let resolveRequest!: (response: HttpAdapterResponse) => void;
    const adapter: HttpAdapter = (request) => {
      calls.push(request);
      return new Promise<HttpAdapterResponse>((resolve) => {
        resolveRequest = resolve;
      });
    };
    const loader = new HttpDslResourceLoader({ adapter });

    const p1 = loader.loadPage('a');
    const p2 = loader.loadPage('a');
    expect(calls).toHaveLength(1);

    resolveRequest({ status: 200, data: pageEnvelope() });
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(r2);
  });
});
