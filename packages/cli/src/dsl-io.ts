import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import type { DslNode, PageDsl } from '@pactor-app/core';
import { isDslSourceRef } from '@pactor-app/core';
import { validatePageDsl, type DslValidationError } from '@pactor-app/schema';
import { parseDocument } from 'yaml';

/**
 * dsl-io 共享层：DSL 文件读取 / YAML 解析 / page 与 fragment 判定 /
 * 校验聚合 / 目录递归收集 / DSL 树遍历。
 *
 * 语义与 @pactor-app/vite-plugin 的构建期转换一致（独立实现，不相互依赖）。
 */

/** DSL 文件匹配约定：仅 `.page.` / `.fragment.` 后缀的 YAML 文件 */
export const DSL_FILE_RE = /\.(page|fragment)\.(yaml|yml)$/;

/** fragment 文件名识别 */
export const FRAGMENT_FILE_RE = /\.fragment\.(yaml|yml)$/;

/** 是否 DSL 文件（`.page.yaml` / `.fragment.yaml` 等） */
export function isDslFile(path: string): boolean {
  return DSL_FILE_RE.test(path);
}

/** 是否 fragment 文件 */
export function isFragmentFile(path: string): boolean {
  return FRAGMENT_FILE_RE.test(path);
}

/** 读取并解析 DSL 文件的结果 */
export type ReadDslResult =
  | { ok: true; data: unknown }
  | { ok: false; errors: DslValidationError[] };

/**
 * 读取文件并解析 YAML。
 * 语法错误转为带行列位置的结构化错误（keyword 为 `yaml`）。
 */
export function readDslFile(file: string): ReadDslResult {
  const source = readFileSync(file, 'utf8');
  const doc = parseDocument(source);
  if (doc.errors.length > 0) {
    return {
      ok: false,
      errors: doc.errors.map((error) => {
        const pos = error.linePos?.[0];
        const where = pos ? `行 ${pos.line} 列 ${pos.col}` : '未知位置';
        return { path: '/', message: `${where}: ${error.message}`, keyword: 'yaml' };
      }),
    };
  }
  return { ok: true, data: doc.toJS() as unknown };
}

/**
 * 校验 DSL 数据：page 走完整 Schema 校验，fragment 宽松检查
 * （存在 `dsl` 与 `body`）。返回错误列表，空数组表示通过。
 */
export function validateDsl(data: unknown, isFragment: boolean): DslValidationError[] {
  if (isFragment) {
    const fragment = data as Partial<PageDsl> | null;
    if (
      fragment === null ||
      typeof fragment !== 'object' ||
      !('dsl' in fragment) ||
      !('body' in fragment)
    ) {
      return [{ path: '/', message: '必须存在 dsl 与 body 字段', keyword: 'required' }];
    }
    return [];
  }
  const result = validatePageDsl(data);
  return result.errors;
}

/**
 * 递归收集路径列表下的全部 DSL 文件（目录深度优先，结果排序）。
 * 不存在的路径记入 `missing`；普通文件按后缀约定过滤。
 */
export function collectDslFiles(paths: string[]): { files: string[]; missing: string[] } {
  const files: string[] = [];
  const missing: string[] = [];

  const walk = (target: string): void => {
    if (!existsSync(target)) {
      missing.push(target);
      return;
    }
    const stat = statSync(target);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(target)) {
        walk(join(target, entry));
      }
      return;
    }
    if (isDslFile(target)) {
      files.push(target);
    }
  };

  for (const path of paths) {
    walk(path);
  }
  files.sort();
  return { files, missing };
}

/** DSL 树中的字符串条目（路径为 JSON Pointer 形态，如 `/body/props/title`） */
export interface DslStringEntry {
  path: string;
  value: string;
}

/** 递归收集 DSL 文档中的全部字符串值（含 state / params / props 等任意层级） */
export function collectStrings(data: unknown, basePath = ''): DslStringEntry[] {
  const entries: DslStringEntry[] = [];

  const walk = (value: unknown, path: string): void => {
    if (typeof value === 'string') {
      entries.push({ path: path === '' ? '/' : path, value });
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${path}/${index}`));
      return;
    }
    if (value !== null && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        walk(item, `${path}/${key}`);
      }
    }
  };

  walk(data, basePath);
  return entries;
}

/** 模板表达式抽取结果 */
export interface TemplateExpressions {
  /** 抽取到的表达式源码列表 */
  sources: string[];
  /** 是否存在未闭合的 `${` */
  unterminated: boolean;
}

/**
 * 从模板字符串中抽取 `${...}` 表达式源码。
 * 与 @pactor-app/expression 的模板切分同语义：表达式内支持字符串字面量
 * （其中可含 `}` / `${`）与嵌套花括号。
 */
export function extractTemplateExpressions(value: string): TemplateExpressions {
  const sources: string[] = [];
  let i = 0;
  let unterminated = false;

  while (i < value.length) {
    if (value[i] === '$' && value[i + 1] === '{') {
      i += 2;
      let depth = 1;
      let quote: string | undefined;
      let source = '';
      let closed = false;

      while (i < value.length) {
        const c = value[i]!;
        if (quote !== undefined) {
          source += c;
          if (c === '\\' && i + 1 < value.length) {
            source += value[i + 1];
            i += 2;
            continue;
          }
          if (c === quote) {
            quote = undefined;
          }
          i += 1;
          continue;
        }
        if (c === "'" || c === '"') {
          quote = c;
          source += c;
          i += 1;
          continue;
        }
        if (c === '{') {
          depth += 1;
          source += c;
          i += 1;
          continue;
        }
        if (c === '}') {
          depth -= 1;
          if (depth === 0) {
            closed = true;
            i += 1;
            break;
          }
          source += c;
          i += 1;
          continue;
        }
        source += c;
        i += 1;
      }

      if (!closed) {
        unterminated = true;
        break;
      }
      sources.push(source);
      continue;
    }
    i += 1;
  }

  return { sources, unterminated };
}

/** 递归遍历 DSL 组件树（body 根 + children）；children 为 DslSourceRef 或数组中含引用元素时跳过（无内联子树） */
export function walkDslTree(
  root: DslNode | undefined,
  visit: (node: DslNode, path: string) => void,
  basePath = '/body',
): void {
  if (root === undefined || root === null || typeof root !== 'object') return;
  visit(root, basePath);
  if (Array.isArray(root.children)) {
    root.children.forEach((child, index) => {
      // 数组中混排的引用元素无内联子树可遍历
      if (isDslSourceRef(child)) return;
      walkDslTree(child, visit, `${basePath}/children/${index}`);
    });
  }
}

/**
 * 遍历 Page DSL 的 UI 树根：body 存在时遍历 body（路径基 /body）；
 * 否则遍历根级 children（路径基 /children/<i>）。与 resolveRootNodes 同语义。
 */
export function walkPageTrees(
  data: Partial<PageDsl>,
  visit: (node: DslNode, path: string) => void,
): void {
  if (data.body !== undefined) {
    walkDslTree(data.body, visit, '/body');
    return;
  }
  if (Array.isArray(data.children)) {
    data.children.forEach((child, index) => {
      // 根级数组中混排的引用元素无内联子树可遍历
      if (isDslSourceRef(child)) return;
      walkDslTree(child, visit, `/children/${index}`);
    });
  }
}
