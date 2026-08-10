/** 权限变更监听器 */
export type PermissionListener = () => void;

/**
 * PermissionStore（设计文档第 43 节，决策 D1）：
 * 浏览器端只持有权限码集合（Permission Set），DSL 中不出现 Role。
 *
 * 内部为 `Set<string>`；`setPermissions` 整体替换（bootstrap 阶段一次性
 * 注入），`clear` 清空；两者都会通知订阅者。精确匹配，不做通配符。
 */
export class PermissionStore {
  private codes = new Set<string>();
  private listeners = new Set<PermissionListener>();

  /** 整体替换权限码集合并通知订阅者 */
  setPermissions(codes: string[]): void {
    this.codes = new Set(codes);
    this.notify();
  }

  /** 清空权限码并通知订阅者 */
  clear(): void {
    this.codes.clear();
    this.notify();
  }

  /** 是否持有某权限码；未设置（含空集合）一律返回 false */
  has(code: string): boolean {
    return this.codes.has(code);
  }

  /** 任一命中即返回 true（组件 / 动作配置数组的语义） */
  hasAny(codes: string[]): boolean {
    return codes.some((code) => this.codes.has(code));
  }

  /** 全部命中才返回 true */
  hasAll(codes: string[]): boolean {
    return codes.every((code) => this.codes.has(code));
  }

  /** 订阅权限变更，返回退订函数 */
  subscribe(listener: PermissionListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of [...this.listeners]) {
      listener();
    }
  }
}
