/**
 * 通用 Registry（设计文档第 3.3、12、17、18 节）。
 *
 * Component / Action / Service / Capability / Expression Function 等
 * 具体 Registry 的共同基座：名称 → 条目。
 */
export class Registry<T> {
  private readonly items = new Map<string, T>();

  /**
   * @param label 用于错误信息中标识 Registry 用途，如 "ComponentRegistry"
   */
  constructor(private readonly label: string = 'Registry') {}

  /** 注册条目；重复注册同名条目抛出错误 */
  register(name: string, item: T): void {
    if (this.items.has(name)) {
      throw new Error(`[${this.label}] duplicate registration: "${name}"`);
    }
    this.items.set(name, item);
  }

  /** 获取条目；未注册时返回 undefined，不抛错 */
  get(name: string): T | undefined {
    return this.items.get(name);
  }

  has(name: string): boolean {
    return this.items.has(name);
  }

  /** 注销条目；返回是否存在并被移除 */
  unregister(name: string): boolean {
    return this.items.delete(name);
  }

  /** 全部已注册名称 */
  list(): string[] {
    return [...this.items.keys()];
  }
}
