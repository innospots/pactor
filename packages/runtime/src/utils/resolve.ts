import {
  isI18nDescriptor,
  isLocalizedText,
  type LocalizedText,
} from '@pactor-app/core';
import {
  hasExpression,
  resolveTemplate,
  type ExpressionScope,
} from '@pactor-app/expression';

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 本地化协议模式：
 * - `client`（默认）：作者态 `$i18n` 描述按普通对象递归（行为同历史版本）
 * - `server`：本地化已在服务端完成，作者态 `$i18n` 出现在解析路径即协议错误
 */
export type LocalizationMode = 'client' | 'server';

/** 本地化协议错误：server 模式下作者态 `$i18n` 漏入客户端解析路径时抛出 */
export class LocalizationProtocolError extends Error {
  constructor(message: string) {
    super(`[@pactor-app/runtime] ${message}`);
    this.name = 'LocalizationProtocolError';
  }
}

export interface ResolveDeepOptions {
  /**
   * 返回 true 时该对象（及其子树）不求值、原样保留。
   * Action 引擎用它跳过 params 中内嵌的子动作配置
   * （`sequence` / `parallel` / `if` 的子动作须在各自执行时
   * 按当时的 state 求值，不能随父动作提前求值）。
   */
  isOpaque?: (value: Record<string, unknown>) => boolean;
  /** 本地化协议模式（缺省 `client`）；`server` 模式下拒绝作者态 `$i18n` */
  localizationMode?: LocalizationMode;
}

/**
 * `$localizedText` 专用插值（设计第 7 节，独立于 core 旧 `t` 插值路径）：
 * `{{name}}` 占位；未知参数保留占位符并记录诊断（旧插值器缺失参数→空串，
 * 为兼容不改动）。
 */
function interpolateLocalizedText(
  template: string,
  params: Record<string, unknown>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, name: string) => {
    const value = params[name];
    if (value === undefined || value === null) {
      console.warn(
        `[@pactor-app/runtime] $localizedText 未知参数 "${name}"，保留占位符 ${match}`,
      );
      return match;
    }
    return String(value);
  });
}

/**
 * 解析下发态 `$localizedText`：只对 params 内的值递归求值，
 * template 本身不进入表达式引擎；插值结果为终值（不再二次解析），
 * 译文 / 参数值中的 `${` 字面量不会被执行（设计第 7 节注入防护）。
 */
function resolveLocalizedText(
  value: LocalizedText,
  scope: ExpressionScope,
  options: ResolveDeepOptions,
): string {
  const { template, params } = value.$localizedText;
  const resolvedParams: Record<string, unknown> = {};
  if (isPlainRecord(params)) {
    for (const [key, item] of Object.entries(params)) {
      resolvedParams[key] = resolveDeep(item, scope, options);
    }
  }
  return interpolateLocalizedText(template, resolvedParams);
}

/**
 * 深度表达式求值（设计文档第 21 节，D5）：
 *
 * - 字符串经 @pactor-app/expression `resolveTemplate` 求值
 *   （整体单表达式保留原始类型，无 `${` 快速返回）
 * - `$localizedText` 包装对象经独立插值路径解析为终值字符串
 * - `localizationMode: 'server'` 时作者态 `$i18n` 描述为协议错误
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
    if (options.localizationMode === 'server' && isI18nDescriptor(value)) {
      throw new LocalizationProtocolError(
        'server 本地化模式下作者态 `$i18n` 不允许出现在客户端解析路径',
      );
    }
    if (isLocalizedText(value)) {
      return resolveLocalizedText(value, scope, options);
    }
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
