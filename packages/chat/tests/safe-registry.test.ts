import { Registry } from 'pactor-core';
import type { DslNode } from 'pactor-core';
import { describe, expect, it } from 'vitest';

import { CHAT_DENIED_TYPE, createSafeRegistry, guardChatDsl } from '../src/index.js';

describe('createSafeRegistry（spec: chat-safe-registry / Safe Registry）', () => {
  it('白名单过滤：get/has 取 allowed ∩ source，list 为交集（spec: 白名单过滤）', () => {
    const source = new Registry<unknown>('ComponentRegistry');
    source.register('Card', () => 'Card');
    source.register('Table', () => 'Table');
    source.register('Button', () => 'Button');

    const safe = createSafeRegistry(source, ['Card', 'Table']);
    expect(safe.get('Card')).toBeDefined();
    expect(safe.has('Table')).toBe(true);
    expect(safe.get('Button')).toBeUndefined();
    expect(safe.has('Button')).toBe(false);
    // allowed 中 source 不存在的类型同样不可见
    expect(safe.has('Ghost')).toBe(false);
    expect(safe.list()).toEqual(['Card', 'Table']);
  });

  it('实时代理：source 后续注册的白名单类型可见', () => {
    const source = new Registry<unknown>('ComponentRegistry');
    const safe = createSafeRegistry(source, ['Card']);
    expect(safe.has('Card')).toBe(false);
    source.register('Card', () => 'Card');
    expect(safe.has('Card')).toBe(true);
    expect(safe.list()).toEqual(['Card']);
  });
});

describe('guardChatDsl（DSL part 白名单守卫）', () => {
  it('白名单外节点替换为受控占位，children 丢弃', () => {
    const source = new Registry<unknown>('ComponentRegistry');
    source.register('Card', () => 'Card');
    const safe = createSafeRegistry(source, ['Card']);

    const schema: DslNode = {
      type: 'Button',
      props: { text: '危险' },
      children: [{ type: 'Card' }],
    };
    const guarded = guardChatDsl(schema, safe);
    expect(guarded).toEqual({
      type: CHAT_DENIED_TYPE,
      props: { deniedType: 'Button' },
    });
  });

  it('白名单内节点保留，children 递归守卫', () => {
    const source = new Registry<unknown>('ComponentRegistry');
    source.register('Card', () => 'Card');
    source.register('Statistic', () => 'Statistic');
    const safe = createSafeRegistry(source, ['Card', 'Statistic']);

    const schema: DslNode = {
      type: 'Card',
      children: [
        { type: 'Statistic', props: { value: 1 } },
        { type: 'Table' },
      ],
    };
    const guarded = guardChatDsl(schema, safe);
    expect(guarded.type).toBe('Card');
    expect(guarded.children?.[0]).toEqual({ type: 'Statistic', props: { value: 1 } });
    expect(guarded.children?.[1]).toEqual({
      type: CHAT_DENIED_TYPE,
      props: { deniedType: 'Table' },
    });
  });
});
