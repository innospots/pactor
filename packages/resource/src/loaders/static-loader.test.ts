import type { FragmentDsl, PageDsl } from 'pactor-core';
import { describe, expect, it } from 'vitest';

import { ResourceError } from '../errors.js';
import type { PageResource } from '../types.js';
import { StaticDslLoader } from './static-loader.js';

const pageDsl: PageDsl = {
  dsl: '1.0',
  page: { id: 'demo', title: '演示页' },
  body: { type: 'Page', children: [] },
};

const fragmentDsl: FragmentDsl = {
  dsl: '1.0',
  fragment: { id: 'demo-card' },
  body: { type: 'Card' },
};

describe('StaticDslLoader', () => {
  it('裸 DSL 包装：schema 为该 DSL，version 为 1', async () => {
    const loader = new StaticDslLoader({ pages: { demo: pageDsl } });

    const resource = await loader.loadPage('demo');

    expect(resource.schema).toEqual(pageDsl);
    expect(resource.version).toBe(1);
    expect(resource.resourceType).toBe('page');
    expect(resource.dslVersion).toBe('1.0');
  });

  it('接受完整 envelope：按 envelope 字段返回', async () => {
    const envelope: PageResource = {
      id: 'demo',
      resourceType: 'page',
      version: 7,
      dslVersion: '1.0',
      etag: 'static-v7',
      schema: pageDsl,
    };
    const loader = new StaticDslLoader({ pages: { demo: envelope } });

    const resource = await loader.loadPage('demo');

    expect(resource.version).toBe(7);
    expect(resource.etag).toBe('static-v7');
  });

  it('Fragment：裸 DSL 包装为 version 1 envelope', async () => {
    const loader = new StaticDslLoader({ fragments: { 'demo-card': fragmentDsl } });

    const resource = await loader.loadFragment('demo-card');

    expect(resource.schema).toEqual(fragmentDsl);
    expect(resource.version).toBe(1);
    expect(resource.resourceType).toBe('fragment');
  });

  it('未命中抛错：loadPage 不存在的 id 抛 ResourceError', async () => {
    const loader = new StaticDslLoader({ pages: { demo: pageDsl } });

    await expect(loader.loadPage('missing')).rejects.toBeInstanceOf(
      ResourceError,
    );
    await expect(loader.loadFragment('missing')).rejects.toBeInstanceOf(
      ResourceError,
    );
  });

  it('loadBootstrap 抛 ResourceError（静态加载器不提供 bootstrap）', async () => {
    const loader = new StaticDslLoader();

    await expect(loader.loadBootstrap()).rejects.toBeInstanceOf(ResourceError);
  });
});
