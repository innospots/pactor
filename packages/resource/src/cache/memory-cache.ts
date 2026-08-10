/**
 * 内存资源缓存：键为字符串（约定 `id@version`），条目携带 etag 以支持条件请求。
 */

/** 缓存条目 */
export interface ResourceCacheEntry<T = unknown> {
  value: T;
  etag?: string;
}

/** 内存资源缓存（V1 不做 IndexedDB / Browser Cache 持久化） */
export class MemoryResourceCache<T = unknown> {
  private readonly entries = new Map<string, ResourceCacheEntry<T>>();

  get(key: string): ResourceCacheEntry<T> | undefined {
    return this.entries.get(key);
  }

  set(key: string, entry: ResourceCacheEntry<T>): void {
    this.entries.set(key, entry);
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }

  /** 当前全部缓存键（版本失效 / invalidate 时使用） */
  keys(): string[] {
    return [...this.entries.keys()];
  }
}
