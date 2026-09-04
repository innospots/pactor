import { describe, expect, it } from 'vitest';

import type { DslNode, PageDsl } from './index.js';
import { resolveRootNodes } from './index.js';

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

  it('accepts a Page DSL without body and with root children (type check)', () => {
    const doc: PageDsl = makePage({ children });
    expect(doc.body).toBeUndefined();
    expect(doc.children).toHaveLength(2);
  });
});
