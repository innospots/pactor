#!/usr/bin/env node
import { createInterface } from 'node:readline';
import { pathToFileURL } from 'node:url';

import {
  DEFAULT_TEMPLATE,
  TEMPLATES,
  checkTarget,
  defaultTemplatesDir,
  printNextSteps,
  resolveTarget,
  scaffold,
  type CliIo,
  type TemplateId,
} from './create.js';

/** 命令清单与用法（--help 输出） */
export const HELP_TEXT = `create-pactor-app — 从模板创建 Pactor 应用

用法: create-pactor-app <name> [-t next-app|spa]

参数:
  <name>                目标目录（可为相对/绝对路径，应用名取目录名）
  -t, --template <id>   模板：next-app（Next.js 全栈）/ spa（Vite 纯前端）
  -h, --help            显示帮助

未指定 -t 时：交互终端编号选择（默认 next-app），非 TTY 直接用 next-app。
退出码: 0 成功；2 用法/目标错误
`;

/** 参数用法错误：runCli 捕获后以退出码 2 处理 */
export class UsageError extends Error {}

/** 解析结果 */
export interface ParsedArgs {
  name?: string;
  template?: string;
  help: boolean;
}

/**
 * 极简参数解析（手写，无依赖）：
 * 位置参数取首个为 name；`-t`/`--template` 带值；`-h`/`--help` 布尔。
 */
export function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = { help: false };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]!;

    if (token === '-h' || token === '--help') {
      result.help = true;
      continue;
    }
    if (token === '-t' || token === '--template') {
      const value = argv[i + 1];
      if (value === undefined) throw new UsageError(`选项 ${token} 缺少值`);
      result.template = value;
      i += 1;
      continue;
    }
    if (token.startsWith('--template=')) {
      result.template = token.slice('--template='.length);
      continue;
    }
    if (token.startsWith('-')) {
      throw new UsageError(`未知选项: ${token}`);
    }
    if (result.name !== undefined) {
      throw new UsageError(`多余参数: ${token}（仅接受一个 <name>）`);
    }
    result.name = token;
  }

  return result;
}

/** 校验模板 id */
export function parseTemplateId(value: string): TemplateId {
  if (TEMPLATES.some((t) => t.id === value)) return value as TemplateId;
  throw new UsageError(
    `未知模板: ${value}（可选: ${TEMPLATES.map((t) => t.id).join(' | ')}）`,
  );
}

/** 交互式模板选择（stdin/stdout 均为 TTY 时由 runCli 调用）：编号选择，回车取默认 */
export async function selectTemplateInteractive(io: CliIo): Promise<TemplateId> {
  io.out('请选择模板:');
  TEMPLATES.forEach((t, index) => io.out(`  ${index + 1}) ${t.id} — ${t.label}`));
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await new Promise<string>((resolvePromise) => {
      rl.question(`请输入编号 [1]: `, resolvePromise);
    });
    const trimmed = answer.trim();
    if (trimmed === '') return DEFAULT_TEMPLATE;
    const index = Number.parseInt(trimmed, 10) - 1;
    const picked = TEMPLATES[index];
    if (picked === undefined) {
      throw new UsageError(`无效编号: ${trimmed}`);
    }
    return picked.id;
  } finally {
    rl.close();
  }
}

/** 可注入的依赖（测试用） */
export interface RunCliOptions {
  /** 模板目录定位（默认按 src/dist 层级探测） */
  templatesDir?: (template: string) => string;
  /** 模板选择器：-t 未指定时调用；默认按 TTY 决定交互或取默认模板 */
  selectTemplate?: () => Promise<TemplateId>;
}

/**
 * CLI 入口（可测）：解析 argv → 选模板 → 生成工程 → 返回退出码。
 */
export async function runCli(
  argv: string[],
  io: CliIo,
  options: RunCliOptions = {},
): Promise<number> {
  let args: ParsedArgs;
  try {
    args = parseArgs(argv);
  } catch (error) {
    if (error instanceof UsageError) {
      io.err(`参数错误: ${error.message}`);
      io.err(HELP_TEXT);
      return 2;
    }
    throw error;
  }

  if (args.help) {
    io.out(HELP_TEXT);
    return 0;
  }

  if (args.name === undefined) {
    io.err('缺少参数 <name>');
    io.err(HELP_TEXT);
    return 2;
  }

  let template: TemplateId;
  try {
    if (args.template !== undefined) {
      template = parseTemplateId(args.template);
    } else if (options.selectTemplate !== undefined) {
      template = await options.selectTemplate();
    } else if (process.stdin.isTTY && process.stdout.isTTY) {
      template = await selectTemplateInteractive(io);
    } else {
      template = DEFAULT_TEMPLATE;
    }
  } catch (error) {
    if (error instanceof UsageError) {
      io.err(error.message);
      return 2;
    }
    throw error;
  }

  const target = resolveTarget(args.name);
  if (!checkTarget(target, io)) return 2;

  const templatesDir = options.templatesDir ?? defaultTemplatesDir;
  scaffold(target, template, templatesDir(template));

  io.out(`已创建工程: ${target}`);
  printNextSteps(io, args.name, template);
  return 0;
}

const isMain =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const io: CliIo = {
    out: (line) => process.stdout.write(`${line}\n`),
    err: (line) => process.stderr.write(`${line}\n`),
  };
  void runCli(process.argv.slice(2), io).then((code) => process.exit(code));
}
