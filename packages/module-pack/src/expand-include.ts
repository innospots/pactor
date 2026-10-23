import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { parseDocument } from 'yaml';

/**
 * `$include` 展开器（语义以 PoC build-adapter.mjs 为蓝本）：
 * - `$include` 必须是对象唯一键，值为 yamlRoot 相对路径字符串；
 * - 递归展开，循环引用报错并带引用链；
 * - 解析失败的错误均带文件上下文。
 *
 * 注意：`$include` 目前是应用层约定（各工程在自己的 sitemap.ts 中重复实现），
 * 本实现是上游化为框架能力的第一步，后续应迁移到 dsl-io 供运行时与打包共用。
 */

export const INCLUDE_KEY = '$include';

/** include 展开相关错误（循环引用 / 非法 $include / YAML 语法错误） */
export class IncludeError extends Error {}

/** 解析 YAML 文件为 JS 值，语法错误带文件路径 */
export function parseYamlFile(file: string): unknown {
  const doc = parseDocument(readFileSync(file, 'utf8'));
  if (doc.errors.length > 0) {
    throw new IncludeError(
      `${file}: ${doc.errors.map((error) => error.message).join('; ')}`,
    );
  }
  return doc.toJS() as unknown;
}

interface ExpandContext {
  yamlRoot: string;
  /** 当前文件（yamlRoot 相对路径，用于错误信息） */
  current: string;
  /** 引用链（yamlRoot 相对路径），用于循环检测 */
  stack: string[];
}

/**
 * 加载 yamlRoot 下的相对路径文件并递归展开其中的 `$include`。
 * 循环引用时报错，信息形如 `循环引用: a.yaml -> b.yaml -> a.yaml`。
 */
export function loadYamlExpanded(
  yamlRoot: string,
  relPath: string,
  stack: string[] = [],
): unknown {
  if (stack.includes(relPath)) {
    throw new IncludeError(`循环引用: ${[...stack, relPath].join(' -> ')}`);
  }
  const value = parseYamlFile(join(yamlRoot, relPath));
  return expandIncludes(value, { yamlRoot, current: relPath, stack: [...stack, relPath] });
}

/** 递归展开值中的 `$include` 节点（非 $include 对象/数组/标量原样递归返回） */
export function expandIncludes(value: unknown, ctx: ExpandContext): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => expandIncludes(item, ctx));
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  const record = value as Record<string, unknown>;
  if (INCLUDE_KEY in record) {
    if (Object.keys(record).length > 1) {
      throw new IncludeError(`${ctx.current}: $include 不能与其他字段并列`);
    }
    const target = record[INCLUDE_KEY];
    if (typeof target !== 'string') {
      throw new IncludeError(`${ctx.current}: $include 必须是字符串`);
    }
    return loadYamlExpanded(ctx.yamlRoot, target, ctx.stack);
  }
  return Object.fromEntries(
    Object.entries(record).map(([key, item]) => [key, expandIncludes(item, ctx)]),
  );
}
