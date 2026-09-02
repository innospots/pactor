import type {
  PermissionConfig,
  PermissionDeniedStrategy,
} from '@pactor/core';

/**
 * 结构化权限判定接口（决策 D3）：只需 `hasAny`。
 * PermissionStore 天然满足该接口；runtime 的 PermissionAdapter
 * 也可经简单包装适配。避免 permission → runtime 的依赖。
 */
export interface PermissionChecker {
  hasAny(codes: string[]): boolean;
}

/** 权限解析结果：是否放行 + 无权限时的处理策略 */
export interface ResolvedPermission {
  allowed: boolean;
  denied: PermissionDeniedStrategy;
}

/** 提取权限码数组：string / string[] / `{ code }` 三种形态归一 */
export function resolvePermissionCodes(config: PermissionConfig): string[] {
  if (typeof config === 'string') {
    return [config];
  }
  if (Array.isArray(config)) {
    return config;
  }
  return Array.isArray(config.code) ? config.code : [config.code];
}

/**
 * 权限配置统一解析（决策 D3）：
 * string / string[] / `{ code, denied }` 三种形态归一为
 * `{ allowed, denied }`；数组按 hasAny；denied 缺省 `'hidden'`；
 * 未配置 permission（undefined）视为放行。
 *
 * Renderer 与 Menu / Page Guard 复用同一逻辑，避免各处重复解释配置形状。
 */
export function resolvePermissionCheck(
  config: PermissionConfig | undefined,
  checker: PermissionChecker,
): ResolvedPermission {
  if (config === undefined) {
    return { allowed: true, denied: 'hidden' };
  }
  const denied: PermissionDeniedStrategy =
    typeof config === 'object' && !Array.isArray(config)
      ? (config.denied ?? 'hidden')
      : 'hidden';
  return { allowed: checker.hasAny(resolvePermissionCodes(config)), denied };
}
