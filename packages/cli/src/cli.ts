#!/usr/bin/env node
import { pathToFileURL } from 'node:url';

import { UsageError, parseArgs, type CliIo } from './args.js';
import { runBuild } from './commands/build.js';
import { runCreate } from './commands/create.js';
import { runInspect } from './commands/inspect.js';
import { runLint } from './commands/lint.js';
import { runModule } from './commands/module.js';
import { runSchema } from './commands/schema.js';
import { runValidate } from './commands/validate.js';

/** 命令清单与用法（--help 输出） */
export const HELP_TEXT = `pactor — Pactor DSL 命令行工具

用法: pactor <command> [options]

命令:
  pactor validate <files...>      校验 DSL 文件（page 完整校验，fragment 宽松检查）
  pactor inspect <file>           输出 DSL 结构摘要（组件计数 / 动作 / 权限 / 表达式）
  pactor lint <paths...>          校验 + 静态检查（目录递归 .page/.fragment.yaml）
  pactor schema [-o <file>]       输出 Page DSL JSON Schema
  pactor build <src> -o <dir>     编译 DSL 为 Runtime Envelope JSON
  pactor create <name> [-t app]   从模板生成业务工程
  pactor module <sub> [--dir .]   模块打包：init / build / validate / pack（Shell 可装配 npm 模块）

退出码: 0 成功；1 校验/lint 失败；2 用法错误
`;

/**
 * CLI 分发入口（可测）：解析 argv → 分发命令 → 返回退出码。
 */
export function runCli(argv: string[], io: CliIo): number {
  const [command, ...rest] = argv;

  if (command === undefined || command === '--help' || command === '-h') {
    io.out(HELP_TEXT);
    return 0;
  }

  let args;
  try {
    args = parseArgs(rest);
  } catch (error) {
    if (error instanceof UsageError) {
      io.err(`参数错误: ${error.message}`);
      return 2;
    }
    throw error;
  }

  switch (command) {
    case 'validate':
      return runValidate(args, io);
    case 'inspect':
      return runInspect(args, io);
    case 'lint':
      return runLint(args, io);
    case 'schema':
      return runSchema(args, io);
    case 'build':
      return runBuild(args, io);
    case 'create':
      return runCreate(args, io);
    case 'module':
      return runModule(args, io);
    default:
      io.err(`未知命令: ${command}`);
      io.err(HELP_TEXT);
      return 2;
  }
}

const isMain =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const io: CliIo = {
    out: (line) => process.stdout.write(`${line}\n`),
    err: (line) => process.stderr.write(`${line}\n`),
  };
  process.exit(runCli(process.argv.slice(2), io));
}
