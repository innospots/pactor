import type { PageDsl } from 'pactor-core';
import { describe, expect, it } from 'vitest';

import {
  parseBootstrapResource,
  parseEnvelope,
  type PageResource,
} from './types.js';

const pageDsl: PageDsl = {
  dsl: '1.0',
  page: { id: 'customer-list', title: '客户管理', type: 'list' },
  body: { type: 'Page', children: [] },
};

describe('parseEnvelope（资源 Envelope 模型）', () => {
  it('完整 envelope 解析：各字段可访问', () => {
    const raw = {
      id: 'customer-list',
      resourceType: 'page',
      version: 103,
      dslVersion: '1.0',
      etag: 'v1',
      requires: { runtime: '>=1.0.0' },
      schema: pageDsl,
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const resource: PageResource = parseEnvelope(raw, {
      id: 'customer-list',
      resourceType: 'page',
    });

    expect(resource.id).toBe('customer-list');
    expect(resource.resourceType).toBe('page');
    expect(resource.version).toBe(103);
    expect(resource.dslVersion).toBe('1.0');
    expect(resource.etag).toBe('v1');
    expect(resource.requires).toEqual({ runtime: '>=1.0.0' });
    expect(resource.schema).toEqual(pageDsl);
    expect(resource.updatedAt).toBe('2026-01-01T00:00:00Z');
  });

  it('宽容缺省：缺少 etag / updatedAt 时正常解析，缺失字段为 undefined', () => {
    const raw = {
      id: 'customer-list',
      resourceType: 'page',
      version: 1,
      dslVersion: '1.0',
      schema: pageDsl,
    };

    const resource = parseEnvelope(raw, {
      id: 'customer-list',
      resourceType: 'page',
    });

    expect(resource.etag).toBeUndefined();
    expect(resource.updatedAt).toBeUndefined();
    expect(resource.requires).toBeUndefined();
  });

  it('resourceType 缺省时由端点推断，id / version / dslVersion 给默认值', () => {
    const resource = parseEnvelope(
      { schema: pageDsl },
      { id: 'fallback-id', resourceType: 'fragment' },
    );

    expect(resource.id).toBe('fallback-id');
    expect(resource.resourceType).toBe('fragment');
    expect(resource.version).toBe(1);
    expect(resource.dslVersion).toBe('1.0'); // 取自 schema.dsl
  });

  it('服务端直接返回裸 DSL（无 schema 字段）时整体作为 schema', () => {
    const resource = parseEnvelope(pageDsl, {
      id: 'customer-list',
      resourceType: 'page',
    });

    expect(resource.schema).toEqual(pageDsl);
    expect(resource.version).toBe(1);
  });
});

describe('parseBootstrapResource（Bootstrap 加载）', () => {
  it('bootstrap 返回版本表：pageVersions 可读取', () => {
    const bootstrap = parseBootstrapResource({
      app: { id: 'crm' },
      user: { id: 'u1', name: '张三' },
      permissions: ['customer:view'],
      menus: [{ id: 'customer' }],
      pageVersions: { 'customer-list': 103 },
    });

    expect(bootstrap.resourceType).toBe('bootstrap');
    expect(bootstrap.pageVersions?.['customer-list']).toBe(103);
    expect(bootstrap.app).toEqual({ id: 'crm' });
    expect(bootstrap.permissions).toEqual(['customer:view']);
  });

  it('字段全部可选：空响应也可解析', () => {
    const bootstrap = parseBootstrapResource({});

    expect(bootstrap.id).toBe('bootstrap');
    expect(bootstrap.version).toBe(1);
    expect(bootstrap.pageVersions).toBeUndefined();
    expect(bootstrap.menus).toBeUndefined();
  });
});
