import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import {
  buildModule,
  bumpPackageVersion,
  ConfigError,
  initModule,
  ModuleBuildError,
  ProfileError,
  validateModule,
} from '@pactor-app/module-pack';

import { flagValue, type CliIo, type ParsedArgs } from '../args.js';

/**
 * `pactor module <init|build|validate|pack|publish>`：模块打包命令族，
 * 全部转换逻辑在 @pactor-app/module-pack，本文件只做参数适配与输出。
 *
 * 退出码：0 成功；1 构建/校验失败；2 用法/配置错误。
 */

const MODULE_USAGE = `用法: pactor module <subcommand> [options]

子命令:
  pactor module init [--dir <工程根>]               初始化模块接入面（幂等，只新增不破坏）
  pactor module build [--dir <工程根>] [--config <配置文件>]  构建 dist-module/ 产物
  pactor module validate [--dir <工程根>]           校验 dist-module/ 产物
  pactor module pack [--dir <工程根>]               自动递增版本号 + build + npm pack 生成 tgz
      [--bump patch|minor|major|x.y.z]              版本递增方式（默认 patch），--no-bump 关闭
  pactor module publish [--dir <工程根>]            pack 全流程 + npm publish 发布到 npm 服务器
      [--registry <url>] [--tag <tag>] [--access public|restricted] [--otp <code>] [--dry-run]

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
      return runModulePack(args, io);
    case 'publish':
      return runModulePublish(args, io);
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

/** 版本递增：默认 patch，--bump 指定级别/显式版本号，--no-bump 关闭 */
function bumpModuleVersion(args: ParsedArgs, projectDir: string, io: CliIo): number {
  if (args.flags['bump'] === true) {
    io.err('选项 --bump 缺少值（patch | minor | major | x.y.z）');
    return 2;
  }
  if (args.flags['no-bump']) {
    return 0;
  }
  const release = flagValue(args, 'bump') ?? 'patch';
  try {
    const result = bumpPackageVersion({ dir: projectDir, release });
    io.out(`版本号已更新: ${result.name} ${result.from} → ${result.to}`);
    return 0;
  } catch (error) {
    return handleError(error, io);
  }
}

/**
 * pack 全流程：版本递增 → build → npm pack --dry-run 校验 files → npm pack。
 * 返回退出码与 tgz 文件名（成功时 code 为 0 且 tgz 非空）。
 */
function packModule(args: ParsedArgs, io: CliIo): { code: number; tgz?: string } {
  const dir = flagValue(args, 'dir');
  const config = flagValue(args, 'config');
  const projectDir = resolve(dir ?? process.cwd());

  const bumpCode = bumpModuleVersion(args, projectDir, io);
  if (bumpCode !== 0) {
    return { code: bumpCode };
  }

  const buildCode = runModuleBuild(dir, config, io);
  if (buildCode !== 0) {
    return { code: buildCode };
  }

  // dry-run 检查 files 列表是否覆盖 dist-module（--json 输出在 stdout，notice 在 stderr）
  let packedFiles: string[];
  try {
    const dryRun = execFileSync('npm', ['pack', '--dry-run', '--json'], {
      cwd: projectDir,
      encoding: 'utf8',
    });
    const report = JSON.parse(dryRun) as { files?: { path: string }[] }[];
    packedFiles = (report[0]?.files ?? []).map((file) => file.path);
  } catch (error) {
    io.err(`npm pack --dry-run 失败: ${(error as Error).message}`);
    return { code: 1 };
  }
  if (!packedFiles.includes('dist-module/manifest.json')) {
    io.err('npm pack --dry-run 检查失败: 打包列表未包含 dist-module/manifest.json');
    io.err(`实际打包文件: ${packedFiles.join(', ') || '(空)'}`);
    io.err('请确认 package.json files 含 "dist-module"（可执行 pactor module init 注入）');
    return { code: 1 };
  }
  io.out(`npm pack --dry-run 检查通过（${packedFiles.length} 个文件，覆盖 dist-module）`);

  try {
    const output = execFileSync('npm', ['pack'], { cwd: projectDir, encoding: 'utf8' });
    const tgz = output.trim().split('\n').pop() ?? '';
    io.out(`npm pack 完成: ${tgz}`);
    return { code: 0, tgz };
  } catch (error) {
    io.err(`npm pack 失败: ${(error as Error).message}`);
    return { code: 1 };
  }
}

function runModulePack(args: ParsedArgs, io: CliIo): number {
  return packModule(args, io).code;
}

/** publish = pack 全流程 + npm publish <tgz>（--dry-run 只演练不上传） */
function runModulePublish(args: ParsedArgs, io: CliIo): number {
  const dir = flagValue(args, 'dir');
  const projectDir = resolve(dir ?? process.cwd());

  const { code, tgz } = packModule(args, io);
  if (code !== 0 || tgz === undefined) {
    return code;
  }

  const publishArgs = ['publish', tgz];
  const registry = flagValue(args, 'registry');
  const tag = flagValue(args, 'tag');
  const access = flagValue(args, 'access');
  const otp = flagValue(args, 'otp');
  if (registry) publishArgs.push('--registry', registry);
  if (tag) publishArgs.push('--tag', tag);
  if (access) publishArgs.push('--access', access);
  if (otp) publishArgs.push('--otp', otp);
  if (args.flags['dry-run']) publishArgs.push('--dry-run');

  try {
    const output = execFileSync('npm', publishArgs, { cwd: projectDir, encoding: 'utf8' });
    const lastLine = output.trim().split('\n').pop() ?? '';
    if (args.flags['dry-run']) {
      io.out(`npm publish --dry-run 通过（未实际上传）: ${lastLine}`);
    } else {
      io.out(`发布完成: ${lastLine}`);
    }
    return 0;
  } catch (error) {
    io.err(`npm publish 失败: ${(error as Error).message}`);
    return 1;
  }
}
