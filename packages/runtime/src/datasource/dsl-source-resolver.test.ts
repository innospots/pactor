/**
 * DslSourceResolver 缓存键（G25）：locale 注入时缓存键前置语言上下文，
 * 跨语言互不命中；缺省 locale 维持旧键形（仅引用原文）。
 */
import { Registry } from '@pactor-app/core';
import { describe, expect, it, vi } from 'vitest';

import type { HttpAdapter } from '../context/adapters.js';
import type { ServiceHandler, ServiceRegistry } from '../context/context.js';

import { DslSourceResolver, dslSourceKey } from './dsl-source-resolver.js';

const ref = { source: { type: 'service', service: 'dsl.items' } } as const;

function createResolver(locale?: string) {
  const services: ServiceRegistry = new Registry<ServiceHandler>('ServiceRegistry');
  const handler = vi.fn(async () => ['ok']);
  services.register('dsl.items', handler);
  const http: HttpAdapter = { request: vi.fn(async () => ['ok']) };
  const resolver = new DslSourceResolver({
    services,
    http,
    getScope: () => ({}),
    locale,
  });
  return { resolver, handler, http };
}

describe('dslSourceKey locale 维度（G25）', () => {
  it('无 locale：键形维持引用原文（旧行为不变）', () => {
    expect(dslSourceKey(ref)).toBe('service:dsl.items:{}');
  });

  it('有 locale：键前置语言上下文，两个 locale 的键不同', () => {
    const zh = dslSourceKey(ref, 'zh-CN');
    const en = dslSourceKey(ref, 'en-US');
    expect(zh).toBe('zh-CN|service:dsl.items:{}');
    expect(en).toBe('en-US|service:dsl.items:{}');
    expect(zh).not.toBe(en);
  });

  it('http 引用同样按 locale 区分', () => {
    const httpRef = {
      source: { type: 'http', request: { url: '/api/dsl/root' } },
    } as const;
    expect(dslSourceKey(httpRef, 'zh-CN')).toBe(
      'zh-CN|http:GET:/api/dsl/root:{}:{}',
    );
    expect(dslSourceKey(httpRef)).toBe('http:GET:/api/dsl/root:{}:{}');
  });
});

describe('DslSourceResolver 缓存行为', () => {
  it('同一引用两次 resolve 共享一次加载（Promise 级去重不变）', async () => {
    const { resolver, handler } = createResolver('zh-CN');

    const first = await resolver.resolve(ref);
    const second = await resolver.resolve(ref);
    expect(second).toBe(first);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('locale 注入不影响未注册 service 的错误路径', async () => {
    const { resolver } = createResolver('en-US');
    await expect(
      resolver.resolve({ source: { type: 'service', service: 'dsl.missing' } }),
    ).rejects.toThrow('dsl.missing');
  });
});
