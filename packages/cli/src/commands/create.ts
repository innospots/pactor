import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { flagValue, type CliIo, type ParsedArgs } from '../args.js';

/** 模板占位符 */
const APP_NAME_PLACEHOLDER = /__APP_NAME__/g;

/**
 * 定位内置模板目录：源码（src/commands）与构建产物（dist/cli.js）
 * 层级不同，逐候选探测。
 */
export function defaultTemplatesDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  for (const candidate of [
    join(here, '../templates/app'),
    join(here, '../../templates/app'),
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  return join(here, '../templates/app');
}

/** 递归复制模板目录，文本内容替换 `__APP_NAME__` 占位 */
function copyTemplate(src: string, dest: string, appName: string): void {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const from = join(src, entry);
    const to = join(dest, entry);
    if (statSync(from).isDirectory()) {
      copyTemplate(from, to, appName);
      continue;
    }
    const content = readFileSync(from, 'utf8').replace(APP_NAME_PLACEHOLDER, appName);
    writeFileSync(to, content, 'utf8');
  }
}

/**
 * `pactor create <name> [-t app]`：从模板生成业务工程。
 * 目标目录已存在且非空时报错（退出码 2），不覆盖任何内容。
 */
export function runCreate(
  args: ParsedArgs,
  io: CliIo,
  templatesDir: string = defaultTemplatesDir(),
): number {
  const name = args.positionals[0];
  if (name === undefined) {
    io.err('用法: pactor create <name> [-t app]');
    return 2;
  }

  const template = flagValue(args, 't') ?? 'app';
  if (template !== 'app') {
    io.err(`未知模板: ${template}（当前仅支持 app）`);
    return 2;
  }

  const target = resolve(name);
  /** 应用名取目标目录名（name 可为相对/绝对路径） */
  const appName = basename(target);
  if (existsSync(target)) {
    if (!statSync(target).isDirectory()) {
      io.err(`目标已存在且不是目录: ${target}`);
      return 2;
    }
    if (readdirSync(target).length > 0) {
      io.err(`目标目录非空，拒绝覆盖: ${target}`);
      return 2;
    }
  }

  copyTemplate(templatesDir, target, appName);
  io.out(`已创建工程: ${target}`);
  io.out('下一步:');
  io.out(`  cd ${name}`);
  io.out('  pnpm install');
  io.out('  pnpm dev');
  return 0;
}
