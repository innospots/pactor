import { MemoryResourceCache } from '../cache/memory-cache.js';
import { ResourceError } from '../errors.js';
import { createFetchAdapter, type HttpAdapter } from '../http-adapter.js';
import {
  parseBootstrapResource,
  parseEnvelope,
  type BootstrapResource,
  type DslResourceEnvelope,
  type DslResourceLoader,
  type FragmentResource,
  type PageResource,
} from '../types.js';

/** HttpDslResourceLoader 配置 */
export interface HttpDslResourceLoaderOptions {
  /** API 基础路径，默认 `/api/runtime` */
  baseUrl?: string;
  /** HTTP 适配器，默认基于全局 fetch */
  adapter?: HttpAdapter;
  /** 缓存实例，默认内置 MemoryResourceCache */
  cache?: MemoryResourceCache<DslResourceEnvelope<unknown>>;
}

type ResourceKind = 'page' | 'fragment';

/**
 * 基于 HTTP 的 DSL 资源加载器：
 * - 端点 `{baseUrl}/pages/{id}` / `{baseUrl}/fragments/{id}` / `{baseUrl}/bootstrap`
 * - 内存缓存：`id@version` 键；版本表来自 bootstrap 的 pageVersions 或手动 updateVersions
 * - 无版本表时退化为 ETag 条件请求 / 普通缓存
 * - 同资源并发加载复用同一进行中 Promise（inflight 去重）
 */
export class HttpDslResourceLoader implements DslResourceLoader {
  private readonly baseUrl: string;
  private readonly adapter: HttpAdapter;
  private readonly cache: MemoryResourceCache<DslResourceEnvelope<unknown>>;
  private versions: Record<string, number> = {};
  private readonly inflight = new Map<string, Promise<unknown>>();

  constructor(options: HttpDslResourceLoaderOptions = {}) {
    this.baseUrl = (options.baseUrl ?? '/api/runtime').replace(/\/+$/, '');
    this.adapter = options.adapter ?? createFetchAdapter();
    this.cache =
      options.cache ?? new MemoryResourceCache<DslResourceEnvelope<unknown>>();
  }

  loadPage(pageId: string): Promise<PageResource> {
    return this.load<PageResource>('page', pageId);
  }

  loadFragment(fragmentId: string): Promise<FragmentResource> {
    return this.load<FragmentResource>('fragment', fragmentId);
  }

  async loadBootstrap(): Promise<BootstrapResource> {
    const response = await this.request(`${this.baseUrl}/bootstrap`);
    const bootstrap = parseBootstrapResource(response.data);
    // bootstrap 携带的版本表自动更新缓存版本控制
    if (bootstrap.pageVersions) {
      this.updateVersions(bootstrap.pageVersions);
    }
    return bootstrap;
  }

  /** 手动更新页面版本表（pageId → version）；版本变化后同 id 资源以新键重新加载 */
  updateVersions(versions: Record<string, number>): void {
    this.versions = { ...this.versions, ...versions };
  }

  /** 删除该 id 全部版本的缓存条目 */
  invalidate(id: string): void {
    for (const key of this.keysOf(id)) {
      this.cache.delete(key);
    }
  }

  /** 清空缓存与版本表 */
  clear(): void {
    this.cache.clear();
    this.versions = {};
  }

  private load<T extends DslResourceEnvelope<unknown>>(
    kind: ResourceKind,
    id: string,
  ): Promise<T> {
    // inflight 去重：同资源并发加载复用同一进行中 Promise
    const inflightKey = `${kind}:${id}`;
    const pending = this.inflight.get(inflightKey);
    if (pending) {
      return pending as Promise<T>;
    }
    const promise = this.doLoad<T>(kind, id).finally(() => {
      this.inflight.delete(inflightKey);
    });
    this.inflight.set(inflightKey, promise);
    return promise;
  }

  private async doLoad<T extends DslResourceEnvelope<unknown>>(
    kind: ResourceKind,
    id: string,
  ): Promise<T> {
    const resourceType: DslResourceEnvelope<unknown>['resourceType'] = kind;
    const url = `${this.baseUrl}/${kind === 'page' ? 'pages' : 'fragments'}/${encodeURIComponent(id)}`;
    const version = this.versions[id];

    if (version !== undefined) {
      // 有版本表：键为 id@version，命中直接返回，未命中普通 GET
      const key = `${id}@${version}`;
      const hit = this.cache.get(key);
      if (hit) {
        return hit.value as T;
      }
      const response = await this.request(url);
      const resource = parseEnvelope(response.data, { id, resourceType });
      this.cache.set(key, {
        value: resource,
        etag: response.etag ?? resource.etag,
      });
      return resource as T;
    }

    // 无版本表：退化为 ETag 条件请求 / 普通缓存
    const cached = this.findCached(id);
    if (cached && !cached.etag) {
      // 普通缓存：命中直接返回
      return cached.value as T;
    }
    const response = await this.request(
      url,
      cached?.etag ? { 'If-None-Match': cached.etag } : undefined,
      cached?.etag ? [304] : [],
    );
    if (response.status === 304 && cached) {
      // 服务端未变化：返回缓存副本
      return cached.value as T;
    }
    const resource = parseEnvelope(response.data, { id, resourceType });
    // 以响应中的真实版本缓存；旧版本条目一并清理，避免同 id 多版本堆积
    this.invalidate(id);
    this.cache.set(`${id}@${resource.version}`, {
      value: resource,
      etag: response.etag ?? resource.etag,
    });
    return resource as T;
  }

  private async request(
    url: string,
    headers?: Record<string, string>,
    extraOkStatuses: number[] = [],
  ) {
    const response = await this.adapter({ url, method: 'GET', headers });
    const ok =
      (response.status >= 200 && response.status < 300) ||
      extraOkStatuses.includes(response.status);
    if (!ok) {
      // 自定义 adapter 未自行抛错时兜底：非 2xx/约定状态统一抛 ResourceError
      throw new ResourceError(`请求返回 ${response.status}: GET ${url}`, {
        status: response.status,
      });
    }
    return response;
  }

  /** 查找该 id 的任一缓存条目（无版本表时用于 ETag / 普通缓存） */
  private findCached(id: string) {
    for (const key of this.keysOf(id)) {
      const entry = this.cache.get(key);
      if (entry) {
        return entry;
      }
    }
    return undefined;
  }

  private keysOf(id: string): string[] {
    const prefix = `${id}@`;
    return this.cache.keys().filter((key) => key.startsWith(prefix));
  }
}
