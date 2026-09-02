import {
  hasExpression,
  resolveTemplate,
  type ExpressionScope,
} from '@pactor-app/expression';

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export interface ResolveDeepOptions {
  /**
   * 返回 true 时该对象（及其子树）不求值、原样保留。
   * Action 引擎用它跳过 params 中内嵌的子动作配置
   * （`sequence` / `parallel` / `if` 的子动作须在各自执行时
   * 按当时的 state 求值，不能随父动作提前求值）。
   */
  isOpaque?: (value: Record<string, unknown>) => boolean;
}

/**
 * 深度表达式求值（设计文档第 21 节，D5）：
 *
 * - 字符串经 @pactor-app/expression `resolveTemplate` 求值
 *   （整体单表达式保留原始类型，无 `${` 快速返回）
 * - 数组 / 普通对象递归处理
 * - 其余类型原样保留
 */
export function resolveDeep(
  value: unknown,
  scope: ExpressionScope,
  options: ResolveDeepOptions = {},
): unknown {
  if (typeof value === 'string') {
    return hasExpression(value) ? resolveTemplate(value, scope) : value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveDeep(item, scope, options));
  }
  if (isPlainRecord(value)) {
    if (options.isOpaque?.(value)) {
      return value;
    }
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = resolveDeep(item, scope, options);
    }
    return out;
  }
  return value;
}

/** 把任意 thrown 值规整为 Error */
export function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error(String(cause));
}
