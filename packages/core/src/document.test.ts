import { describe, expect, it } from 'vitest';

import type { DslNode, DslSourceRef, PageDsl } from './index.js';
import { isDslSourceRef, resolveRootNodes } from './index.js';

function makePage(partial: Partial<PageDsl>): PageDsl {
  return { dsl: '1.0', page: { id: 'p1' }, ...partial };
}

describe('resolveRootNodes', () => {
  const body: DslNode = { type: 'Page', children: [{ type: 'Alert' }] };
  const children: DslNode[] = [{ type: 'Alert' }, { type: 'Button' }];

  it('returns [body] when body exists', () => {
    expect(resolveRootNodes(makePage({ body }))).toEqual([body]);
  });

  it('returns root children when body is missing', () => {
    expect(resolveRootNodes(makePage({ children }))).toEqual(children);
  });

  it('prefers body when both body and children exist', () => {
    expect(resolveRootNodes(makePage({ body, children }))).toEqual([body]);
  });

  it('returns [] when neither body nor children exist', () => {
    expect(resolveRootNodes(makePage({}))).toEqual([]);
  });

  it('returns [] when root children is a DslSourceRef（动态形态由渲染入口解析）', () => {
    const ref: DslSourceRef = {
      source: { type: 'service', service: 'dsl.root' },
    };
    expect(resolveRootNodes(makePage({ children: ref }))).toEqual([]);
  });

  it('returns mixed arrays as-is（内联节点与引用元素混排）', () => {
    const ref: DslSourceRef = { source: { type: 'service', service: 'dsl.x' } };
    const mixed: (DslNode | DslSourceRef)[] = [{ type: 'Alert' }, ref, { type: 'Button' }];
    expect(resolveRootNodes(makePage({ children: mixed }))).toEqual(mixed);
  });

  it('accepts DslSourceRef at root children / node children / components value', () => {
    const ref: DslSourceRef = {
      source: {
        type: 'http',
        request: { url: '/api/dsl/banner' },
      },
      placeholder: { type: 'Alert' },
    };
    const doc: PageDsl = makePage({
      children: ref,
      components: { banner: ref, local: { type: 'Card' } },
      body: { type: 'Page', children: ref },
    });
    expect(isDslSourceRef(doc.children)).toBe(true);
    expect(isDslSourceRef(doc.components?.['banner'])).toBe(true);
    expect(isDslSourceRef(doc.components?.['local'])).toBe(false);
    expect(isDslSourceRef([{ type: 'A' }])).toBe(false);
    expect(isDslSourceRef(undefined)).toBe(false);
  });

  it('accepts a Page DSL without body and with root children (type check)', () => {
    const doc: PageDsl = makePage({ children });
    expect(doc.body).toBeUndefined();
    expect(doc.children).toHaveLength(2);
  });
});
