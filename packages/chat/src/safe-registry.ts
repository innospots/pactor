import { Registry } from '@pactor/core';

/**
 * Safe Registry（设计决策 D3，设计文档第 63、81.4 节）：
 * LLM 生成的 DSL 必须经白名单过滤的组件注册表渲染。
 *
 * 继承 core Registry 保持与 `ComponentRegistry` 的类型兼容；
 * get / has / list 实时代理 source 并与 allowed 求交集——
 * source 后续注册的白名单类型同样可见。
 */
class SafeComponentRegistry extends Registry<unknown> {
  constructor(
    private readonly source: Registry<unknown>,
    private readonly allowed: ReadonlySet<string>,
  ) {
    super('SafeComponentRegistry');
  }

  override get(name: string): unknown {
    if (!this.allowed.has(name)) {
      return undefined;
    }
    return this.source.get(name);
  }

  override has(name: string): boolean {
    return this.allowed.has(name) && this.source.has(name);
  }

  override list(): string[] {
    return this.source.list().filter((name) => this.allowed.has(name));
  }
}

/**
 * 创建 Safe Registry：`allowed` ∩ `source` 之外的类型对渲染层不可见
 * （get 返回 undefined，Renderer 走受控占位）。
 */
export function createSafeRegistry(
  source: Registry<unknown>,
  allowed: string[],
): Registry<unknown> {
  return new SafeComponentRegistry(source, new Set(allowed));
}
