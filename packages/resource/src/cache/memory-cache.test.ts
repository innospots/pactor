import { describe, expect, it } from 'vitest';

import { MemoryResourceCache } from './memory-cache.js';

describe('MemoryResourceCache（内存缓存）', () => {
  it('存取与清除：set 后 get 同键返回该条目；delete/clear 后 get 返回 undefined', () => {
    const cache = new MemoryResourceCache<string>();

    cache.set('customer-list@103', { value: 'a', etag: 'v1' });
    expect(cache.get('customer-list@103')).toEqual({ value: 'a', etag: 'v1' });
    expect(cache.get('missing@1')).toBeUndefined();

    cache.delete('customer-list@103');
    expect(cache.get('customer-list@103')).toBeUndefined();

    cache.set('a@1', { value: 'a' });
    cache.set('b@1', { value: 'b' });
    cache.clear();
    expect(cache.get('a@1')).toBeUndefined();
    expect(cache.get('b@1')).toBeUndefined();
  });

  it('keys 返回全部缓存键（id@version 约定）', () => {
    const cache = new MemoryResourceCache<string>();
    cache.set('a@1', { value: 'a' });
    cache.set('a@2', { value: 'a2' });
    cache.set('b@1', { value: 'b' });

    expect(cache.keys().sort()).toEqual(['a@1', 'a@2', 'b@1']);
  });
});
