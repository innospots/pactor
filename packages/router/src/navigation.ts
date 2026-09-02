/** 导航位置（pathname + search，search 含前导 `?` 或为空串） */
export interface NavigationLocation {
  pathname: string;
  search: string;
}

/** location 变化监听器 */
export type NavigationListener = (location: NavigationLocation) => void;

/**
 * 导航桥接抽象（决策 D4）：核心逻辑与具体路由库
 * （React Router / hash / memory）解耦。
 */
export interface NavigationBridge {
  getLocation(): NavigationLocation;
  push(to: string): void;
  replace(to: string): void;
  /** 订阅 location 变化，返回退订函数 */
  subscribe(listener: NavigationListener): () => void;
}

/** 把 `/customers?tab=risk` 拆为 pathname + search（search 保留前导 `?`） */
function splitTo(to: string): NavigationLocation {
  const queryIndex = to.indexOf('?');
  if (queryIndex === -1) {
    return { pathname: to, search: '' };
  }
  return { pathname: to.slice(0, queryIndex), search: to.slice(queryIndex) };
}

/**
 * MemoryNavigation（决策 D4）：零依赖内存导航，维护历史栈。
 * push 追加历史（截断 forward 分支）、replace 替换当前、back 回退；
 * 任何变化通知订阅者。可纯 Node 使用与测试。
 */
export class MemoryNavigation implements NavigationBridge {
  private history: NavigationLocation[];
  private index = 0;
  private readonly listeners = new Set<NavigationListener>();

  constructor(initial = '/') {
    this.history = [splitTo(initial)];
  }

  getLocation(): NavigationLocation {
    return this.history[this.index];
  }

  push(to: string): void {
    this.history = this.history.slice(0, this.index + 1);
    this.history.push(splitTo(to));
    this.index += 1;
    this.notify();
  }

  replace(to: string): void {
    this.history[this.index] = splitTo(to);
    this.notify();
  }

  /** 回退一步；已在栈底时不动作并返回 false */
  back(): boolean {
    if (this.index === 0) {
      return false;
    }
    this.index -= 1;
    this.notify();
    return true;
  }

  /** 当前历史栈长度（调试与测试观察用） */
  get size(): number {
    return this.history.length;
  }

  subscribe(listener: NavigationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const location = this.getLocation();
    for (const listener of [...this.listeners]) {
      listener(location);
    }
  }
}

/**
 * runtime RouterAdapter 的结构化形状（与 @pactor-app/runtime 的 RouterAdapter
 * 结构化兼容，避免对 @pactor-app/runtime 的运行时依赖；编译期断言见测试）。
 */
export interface RouterAdapterLike {
  navigate(to: string): void;
}

/**
 * 桥接 @pactor-app/runtime 的 RouterAdapter（决策 D4）：DSL navigate 动作
 * 经 runtime `route.navigate(to)` → `adapter.navigate(to)` → `bridge.push(to)`。
 */
export function createRouterAdapter(
  bridge: NavigationBridge,
): RouterAdapterLike {
  return {
    navigate(to: string) {
      bridge.push(to);
    },
  };
}
