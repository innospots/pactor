import { existsSync, statSync } from 'node:fs';

import type {
  ActionConfig,
  DslNode,
  FragmentDsl,
  PageDsl,
  PermissionConfig,
} from 'pactor-core';

import type { CliIo, ParsedArgs } from '../args.js';
import {
  collectStrings,
  extractTemplateExpressions,
  isFragmentFile,
  readDslFile,
  walkDslTree,
} from '../dsl-io.js';

/** 权限配置归一化为权限码数组 */
function permissionCodes(permission: PermissionConfig | undefined): string[] {
  if (permission === undefined) return [];
  if (typeof permission === 'string') return [permission];
  if (Array.isArray(permission)) return permission;
  return Array.isArray(permission.code) ? permission.code : [permission.code];
}

/** 动作配置归一化为数组（单个或多个动作） */
function actionList(
  config: ActionConfig | ActionConfig[] | undefined,
): ActionConfig[] {
  if (config === undefined) return [];
  return Array.isArray(config) ? config : [config];
}

/**
 * `pactor inspect <file>`：输出 DSL 结构摘要——
 * page id/title/type、状态键、dataSources（type/service）、
 * 组件类型计数（递归 body）、事件动作清单、permission 引用、表达式清单。
 */
export function runInspect(args: ParsedArgs, io: CliIo): number {
  if (args.positionals.length !== 1) {
    io.err('用法: pactor inspect <file>');
    return 2;
  }
  const file = args.positionals[0]!;
  if (!existsSync(file) || !statSync(file).isFile()) {
    io.err(`文件不存在: ${file}`);
    return 2;
  }

  const read = readDslFile(file);
  if (!read.ok) {
    for (const error of read.errors) {
      io.err(`${file}: ${error.path}: ${error.message} (${error.keyword})`);
    }
    return 1;
  }

  const isFragment = isFragmentFile(file);
  const data = read.data as Partial<PageDsl & FragmentDsl>;
  const lines: string[] = [];

  if (isFragment) {
    lines.push(`fragment: ${data.fragment?.id ?? '(未知)'}`);
    if (data.fragment?.title !== undefined) lines.push(`标题: ${data.fragment.title}`);
  } else {
    lines.push(`page: ${data.page?.id ?? '(未知)'}`);
    if (data.page?.title !== undefined) lines.push(`标题: ${data.page.title}`);
    if (data.page?.type !== undefined) lines.push(`类型: ${data.page.type}`);
  }
  lines.push(`dslVersion: ${data.dsl ?? '(未知)'}`);

  // 状态键
  const stateKeys = Object.keys(data.state ?? {});
  lines.push(`状态键: ${stateKeys.length > 0 ? stateKeys.join(', ') : '(无)'}`);

  // dataSources（type/service）
  const dataSources = Object.entries(data.dataSources ?? {});
  lines.push(`数据源: ${dataSources.length} 个`);
  for (const [name, config] of dataSources) {
    const service = config.service !== undefined ? `, service=${config.service}` : '';
    lines.push(`  - ${name} (type=${config.type}${service})`);
  }

  // 组件类型计数（递归 body）+ 事件动作清单 + 组件级权限
  const componentCounts = new Map<string, number>();
  const actions: string[] = [];
  const permissions: string[] = [];

  walkDslTree(data.body as DslNode | undefined, (node, path) => {
    componentCounts.set(node.type, (componentCounts.get(node.type) ?? 0) + 1);
    for (const [event, config] of Object.entries(node.events ?? {})) {
      for (const action of actionList(config)) {
        actions.push(`  - ${path} events.${event} → ${action.action}`);
      }
    }
    for (const code of permissionCodes(node.permission)) {
      permissions.push(`  - ${path} → ${code}`);
    }
  });

  lines.push(`组件: ${[...componentCounts.values()].reduce((a, b) => a + b, 0)} 个`);
  for (const [type, count] of [...componentCounts.entries()].sort()) {
    lines.push(`  - ${type} x${count}`);
  }

  // 生命周期动作 + 页面级权限
  for (const [event, config] of Object.entries(data.lifecycle ?? {})) {
    for (const action of actionList(config as ActionConfig | ActionConfig[])) {
      actions.push(`  - lifecycle.${event} → ${action.action}`);
    }
  }
  for (const code of permissionCodes(data.page?.permission)) {
    permissions.push(`  - /page → ${code}`);
  }

  lines.push(`动作: ${actions.length} 个`);
  lines.push(...(actions.length > 0 ? actions : ['  (无)']));
  lines.push(`权限: ${permissions.length} 个`);
  lines.push(...(permissions.length > 0 ? permissions : ['  (无)']));

  // 表达式清单（收集 `${...}`）
  const expressions: string[] = [];
  for (const entry of collectStrings(data)) {
    const { sources } = extractTemplateExpressions(entry.value);
    for (const source of sources) {
      expressions.push(`  - ${entry.path}: \${${source}}`);
    }
  }
  lines.push(`表达式: ${expressions.length} 个`);
  lines.push(...(expressions.length > 0 ? expressions : ['  (无)']));

  for (const line of lines) {
    io.out(line);
  }
  return 0;
}
