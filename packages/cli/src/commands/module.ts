import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import {
  buildModule,
  ConfigError,
  initModule,
  ModuleBuildError,
  ProfileError,
  validateModule,
} from '@pactor-app/module-pack';

import { flagValue, type CliIo, type ParsedArgs } from '../args.js';

/**
 * `pactor module <init|build|validate|pack>`：模块打包命令族，
 * 全部转换逻辑在 @pactor-app/module-pack，本文件只做参数适配与输出。
 *
 * 退出码：0 成功；1 构建/校验失败；2 用法/配置错误。
 */

const MODULE_USAGE = `用法: pactor module <subcommand> [options]

子命令:
  pactor module init [--dir <工程根>]               初始化模块接入面（幂等，只新增不破坏）
  pactor module build [--dir <工程根>] [--config <配置文件>]  构建 dist-module/ 产物
  pactor module validate [--dir <工程根>]           校验 dist-module/ 产物
  pactor module pack [--dir <工程根>]               build + npm pack 生成 tgz

退出码: 0 成功；1 构建/校验失败；2 用法/配置错误
`;

/** `pactor module` 二级子命令分发 */
export function runModule(args: ParsedArgs, io: CliIo): number {
  const [sub] = args.positionals;
  const dir = flagValue(args, 'dir');
  const config = flagValue(args, 'config');

  switch (sub) {
    case 'init':
      return runModuleInit(dir, io);
    case 'build':
      return runModuleBuild(dir, config, io);
    case 'validate':
      return runModuleValidate(dir, config, io);
    case 'pack':
      return runModulePack(dir, config, io);
    case undefined:
      io.err(MODULE_USAGE);
      return 2;
    default:
      io.err(`未知 module 子命令: ${sub}`);
      io.err(MODULE_USAGE);
      return 2;
  }
}

/** 错误归类：配置/用法类退出码 2，构建/校验类退出码 1，其余上抛 */
function handleError(error: unknown, io: CliIo): number {
  if (error instanceof ModuleBuildError) {
    io.err(error.message);
    for (const item of error.errors) {
      io.err(`  - ${item}`);
    }
    return 1;
  }
  if (error instanceof ConfigError || error instanceof ProfileError) {
    io.err(error.message);
    return 2;
  }
  throw error;
}

function runModuleInit(dir: string | undefined, io: CliIo): number {
  const result = initModule({ dir });
  for (const file of result.created) {
    io.out(`已生成: ${file}`);
  }
  for (const file of result.skipped) {
    io.out(`已跳过: ${file}`);
  }
  for (const warning of result.warnings) {
    io.err(`警告: ${warning}`);
  }
  io.out('模块初始化完成（未修改 app/ 与 src/ 现有文件）');
  return 0;
}

function runModuleBuild(
  dir: string | undefined,
  config: string | undefined,
  io: CliIo,
): number {
  try {
    const result = buildModule({ dir, config });
    for (const warning of result.warnings) {
      io.err(`警告: ${warning}`);
    }
    const { stats } = result;
    io.out(`模块构建完成: ${result.outDir}`);
    io.out(
      `  页面 ${stats.pages} / 菜单 ${stats.menus} / 布局 ${stats.layouts} / 资源 ${stats.assets}` +
        ` / client ${result.clientBundled ? '已打包' : '未打包（纯 DSL 模块）'}`,
    );
    return 0;
  } catch (error) {
    return handleError(error, io);
  }
}

function runModuleValidate(
  dir: string | undefined,
  config: string | undefined,
  io: CliIo,
): number {
  const result = validateModule({ dir, config });
  for (const warning of result.warnings) {
    io.err(`警告: ${warning}`);
  }
  if (!result.ok) {
    for (const error of result.errors) {
      io.err(`错误: ${error}`);
    }
    io.err(`校验失败: ${result.errors.length} 个错误`);
    return 1;
  }
  io.out('校验通过: dist-module 产物符合 Manifest V1 与 target profile 契约');
  return 0;
}

function runModulePack(dir: string | undefined, config: string | undefined, io: CliIo): number {
  const buildCode = runModuleBuild(dir, config, io);
  if (buildCode !== 0) {
    return buildCode;
  }
  const projectDir = resolve(dir ?? process.cwd());

  // dry-run 检查 files 列表是否覆盖 dist-module
  let dryRun: string;
  try {
    dryRun = execFileSync('npm', ['pack', '--dry-run'], {
      cwd: projectDir,
      encoding: 'utf8',
    });
  } catch (error) {
    io.err(`npm pack --dry-run 失败: ${(error as Error).message}`);
    return 1;
  }
  if (!dryRun.includes('dist-module/manifest.json')) {
    io.err('npm pack --dry-run 检查失败: 打包列表未包含 dist-module/manifest.json');
    io.err('请确认 package.json files 含 "dist-module"（可执行 pactor module init 注入）');
    return 1;
  }
  io.out('npm pack --dry-run 检查通过（files 覆盖 dist-module）');

  try {
    const output = execFileSync('npm', ['pack'], { cwd: projectDir, encoding: 'utf8' });
    const tgz = output.trim().split('\n').pop() ?? '';
    io.out(`npm pack 完成: ${tgz}`);
    return 0;
  } catch (error) {
    io.err(`npm pack 失败: ${(error as Error).message}`);
    return 1;
  }
}
