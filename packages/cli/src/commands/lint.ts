import type {
  ActionConfig,
  DslNode,
  FragmentDsl,
  PageDsl,
  PermissionConfig,
} from '@pactor/core';
import { ExpressionError, hasExpression, parseExpression } from '@pactor/expression';

import type { CliIo, ParsedArgs } from '../args.js';
import {
  collectDslFiles,
  collectStrings,
  extractTemplateExpressions,
  isFragmentFile,
  readDslFile,
  validateDsl,
  walkDslTree,
} from '../dsl-io.js';

/** lint 分级 */
export type LintLevel = 'error' | 'warning';

/** 单条 lint 发现 */
export interface LintFinding {
  level: LintLevel;
  rule: string;
  path: string;
  message: string;
}

/** 权限配置归一化为权限码数组 */
function permissionCodes(permission: PermissionConfig | undefined): string[] {
  if (permission === undefined) return [];
  if (typeof permission === 'string') return [permission];
  if (Array.isArray(permission)) return permission;
  return Array.isArray(permission.code) ? permission.code : [permission.code];
}

/** 动作配置归一化为数组 */
function actionList(
  config: ActionConfig | ActionConfig[] | undefined,
): ActionConfig[] {
  if (config === undefined) return [];
  return Array.isArray(config) ? config : [config];
}

/** PascalCase 判定（首字母大写，仅字母与数字） */
const PASCAL_CASE_RE = /^[A-Z][A-Za-z0-9]*$/;

/** `resource:action` 形态判定（两段均非空） */
const PERMISSION_CODE_RE = /^[^:]+:[^:]+$/;

/** expression-syntax：解析 DSL 中所有 `${...}` 模板与整体表达式（error） */
function lintExpressions(data: unknown, findings: LintFinding[]): void {
  for (const entry of collectStrings(data)) {
    // 条件对象形式 `{ expression: "..." }` 的裸表达式整体解析
    const bareExpression = entry.path.endsWith('/expression') && !hasExpression(entry.value);
    if (!hasExpression(entry.value) && !bareExpression) continue;

    if (bareExpression) {
      try {
        parseExpression(entry.value);
      } catch (error) {
        findings.push({
          level: 'error',
          rule: 'expression-syntax',
          path: entry.path,
          message: error instanceof ExpressionError ? error.message : String(error),
        });
      }
      continue;
    }

    const { sources, unterminated } = extractTemplateExpressions(entry.value);
    if (unterminated) {
      findings.push({
        level: 'error',
        rule: 'expression-syntax',
        path: entry.path,
        message: '未闭合的 "${"',
      });
      continue;
    }
    for (const source of sources) {
      try {
        parseExpression(source);
      } catch (error) {
        findings.push({
          level: 'error',
          rule: 'expression-syntax',
          path: entry.path,
          message: `表达式 \${${source}} 解析失败: ${
            error instanceof ExpressionError ? error.message : String(error)
          }`,
        });
      }
    }
  }
}

/** component-naming：组件 type 应为 PascalCase（warning） */
function lintComponentNaming(
  body: DslNode | undefined,
  findings: LintFinding[],
): void {
  walkDslTree(body, (node, path) => {
    if (typeof node.type !== 'string' || !PASCAL_CASE_RE.test(node.type)) {
      findings.push({
        level: 'warning',
        rule: 'component-naming',
        path: `${path}/type`,
        message: `组件类型 "${String(node.type)}" 不是 PascalCase`,
      });
    }
  });
}

/** permission-format：权限码应为 `resource:action` 形态（warning） */
function lintPermissionFormat(data: Partial<PageDsl & FragmentDsl>, findings: LintFinding[]): void {
  const check = (codes: string[], path: string): void => {
    for (const code of codes) {
      if (!PERMISSION_CODE_RE.test(code)) {
        findings.push({
          level: 'warning',
          rule: 'permission-format',
          path,
          message: `权限码 "${code}" 不是 resource:action 形态`,
        });
      }
    }
  };

  check(permissionCodes(data.page?.permission), '/page/permission');

  walkDslTree(data.body as DslNode | undefined, (node, path) => {
    check(permissionCodes(node.permission), `${path}/permission`);
    for (const [event, config] of Object.entries(node.events ?? {})) {
      for (const action of actionList(config)) {
        check(permissionCodes(action.permission), `${path}/events/${event}/permission`);
      }
    }
  });

  for (const [event, config] of Object.entries(data.lifecycle ?? {})) {
    for (const action of actionList(config as ActionConfig | ActionConfig[])) {
      check(permissionCodes(action.permission), `/lifecycle/${event}/permission`);
    }
  }
}

/** 对单个 DSL 文件执行 lint（Schema 校验 + 规则集） */
export function lintDslData(data: unknown, isFragment: boolean): LintFinding[] {
  const findings: LintFinding[] = [];

  for (const error of validateDsl(data, isFragment)) {
    findings.push({
      level: 'error',
      rule: 'schema',
      path: error.path,
      message: `${error.message} (${error.keyword})`,
    });
  }

  lintExpressions(data, findings);
  const typed = data as Partial<PageDsl & FragmentDsl>;
  lintComponentNaming(typed.body as DslNode | undefined, findings);
  lintPermissionFormat(typed, findings);
  return findings;
}

/**
 * `pactor lint <paths...>`：对文件 / 目录（递归 `.page/.fragment.yaml`）
 * 执行 Schema 校验 + 规则集。有 error 退出码 1，仅 warning 退出码 0；
 * 无参数或路径不存在退出码 2。输出按文件分组分级。
 */
export function runLint(args: ParsedArgs, io: CliIo): number {
  if (args.positionals.length === 0) {
    io.err('用法: pactor lint <paths...>');
    return 2;
  }

  const { files, missing } = collectDslFiles(args.positionals);
  for (const path of missing) {
    io.err(`路径不存在: ${path}`);
  }
  if (missing.length > 0) {
    return 2;
  }
  if (files.length === 0) {
    io.err('未找到 DSL 文件（.page/.fragment.yaml/.yml）');
    return 2;
  }

  let errors = 0;
  let warnings = 0;

  for (const file of files) {
    const read = readDslFile(file);
    const findings: LintFinding[] = read.ok
      ? lintDslData(read.data, isFragmentFile(file))
      : read.errors.map((error) => ({
          level: 'error' as const,
          rule: 'yaml',
          path: error.path,
          message: error.message,
        }));

    if (findings.length === 0) continue;
    io.out(`${file}:`);
    for (const finding of findings) {
      io.out(`  [${finding.level}] ${finding.rule} ${finding.path}: ${finding.message}`);
      if (finding.level === 'error') errors += 1;
      else warnings += 1;
    }
  }

  io.out(`lint 完成: ${files.length} 个文件，${errors} 个 error，${warnings} 个 warning`);
  return errors > 0 ? 1 : 0;
}
