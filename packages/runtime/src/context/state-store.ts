/**
 * StateStore：框架无关的最小状态容器（设计文档第 15 节，决策 D1）。
 *
 * 手写约百行、零依赖，不引入 Zustand；React 侧经 `useSyncExternalStore`
 * 订阅（见 renderer/）。所有写入均为不可变更新，`reset()` 因此可以安全地
 * 恢复到创建时的初始值。
 */
export class StateStore {
  private state: Record<string, unknown>;
  private readonly initialState: Record<string, unknown>;
  private readonly listeners = new Set<() => void>();
  private version = 0;

  constructor(initialState: Record<string, unknown> = {}) {
    this.initialState = initialState;
    this.state = initialState;
  }

  /** 当前完整 state 对象 */
  getState(): Record<string, unknown> {
    return this.state;
  }

  /** 按点路径读取，如 `get('user.name')`；路径不存在时返回 undefined */
  get(path: string): unknown {
    let current: unknown = this.state;
    for (const key of path.split('.')) {
      if (typeof current !== 'object' || current === null) {
        return undefined;
      }
      current = (current as Record<string, unknown>)[key];
    }
    return current;
  }

  /** 对象合并：`set({ b: 3 })` */
  set(patch: Record<string, unknown>): void;
  /** 路径写入：`set('user.name', 'Bob')` */
  set(path: string, value: unknown): void;
  set(patchOrPath: Record<string, unknown> | string, value?: unknown): void {
    if (typeof patchOrPath === 'string') {
      this.state = setPath(this.state, patchOrPath.split('.'), value);
    } else {
      this.state = { ...this.state, ...patchOrPath };
    }
    this.notify();
  }

  /** 恢复为创建时的初始值 */
  reset(): void {
    this.state = this.initialState;
    this.notify();
  }

  /** 订阅变化，返回退订函数 */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 单调递增的版本号，供 `useSyncExternalStore` 的 getSnapshot 使用
   * （V1 简化策略：任一变化重渲染整棵 DSL 树）。
   */
  getVersion(): number {
    return this.version;
  }

  private notify(): void {
    this.version += 1;
    for (const listener of [...this.listeners]) {
      listener();
    }
  }
}

/** 不可变路径写入：沿途克隆对象链 */
function setPath(
  source: Record<string, unknown>,
  path: string[],
  value: unknown,
): Record<string, unknown> {
  const [key, ...rest] = path;
  if (key === undefined) {
    return source;
  }
  const clone: Record<string, unknown> = { ...source };
  if (rest.length === 0) {
    clone[key] = value;
    return clone;
  }
  const child = clone[key];
  clone[key] = setPath(
    typeof child === 'object' && child !== null && !Array.isArray(child)
      ? (child as Record<string, unknown>)
      : {},
    rest,
    value,
  );
  return clone;
}
