import type { FragmentDsl, PageDsl } from '@pactor-app/core';

import { ResourceError } from '../errors.js';
import {
  parseBootstrapResource,
  parseEnvelope,
  type BootstrapResource,
  type DslResourceLoader,
  type FragmentResource,
  type PageResource,
} from '../types.js';

/** StaticDslLoader 数据源：裸 DSL 或完整 envelope */
export interface StaticDslLoaderData {
  pages?: Record<string, PageDsl | PageResource>;
  fragments?: Record<string, FragmentDsl | FragmentResource>;
  /** bootstrap 资源（应用启动编排用；缺省时 loadBootstrap 拒绝） */
  bootstrap?: BootstrapResource | Record<string, unknown>;
}

/**
 * 静态资源加载器：从构造时传入的 Map 数据返回资源。
 * 裸 DSL 包装为默认 envelope（version 1）；用于 examples、单测与本地 DSL 开发。
 */
export class StaticDslLoader implements DslResourceLoader {
  private readonly pages: Record<string, PageDsl | PageResource>;
  private readonly fragments: Record<string, FragmentDsl | FragmentResource>;
  private readonly bootstrap?: BootstrapResource | Record<string, unknown>;

  constructor(data: StaticDslLoaderData = {}) {
    this.pages = data.pages ?? {};
    this.fragments = data.fragments ?? {};
    this.bootstrap = data.bootstrap;
  }

  loadPage(pageId: string): Promise<PageResource> {
    const raw = this.pages[pageId];
    if (raw === undefined) {
      return Promise.reject(
        new ResourceError(`页面资源不存在: ${pageId}`),
      );
    }
    return Promise.resolve(parseEnvelope(raw, { id: pageId, resourceType: 'page' }));
  }

  loadFragment(fragmentId: string): Promise<FragmentResource> {
    const raw = this.fragments[fragmentId];
    if (raw === undefined) {
      return Promise.reject(
        new ResourceError(`Fragment 资源不存在: ${fragmentId}`),
      );
    }
    return Promise.resolve(
      parseEnvelope(raw, { id: fragmentId, resourceType: 'fragment' }),
    );
  }

  loadBootstrap(): Promise<BootstrapResource> {
    if (this.bootstrap === undefined) {
      return Promise.reject(
        new ResourceError('StaticDslLoader 不提供 bootstrap 资源'),
      );
    }
    return Promise.resolve(parseBootstrapResource(this.bootstrap));
  }
}
