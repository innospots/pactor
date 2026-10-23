import { execFileSync } from 'node:child_process';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import type { TailwindConfig } from './config.js';

/**
 * 可选 Tailwind 预编译（配置 `tailwind: { enabled, input?, scan? }`）：
 * 调用目标工程的 tailwindcss CLI（npx --no-install tailwindcss，v4 / @tailwindcss/cli），
 * 扫描 dist-module/dsl 与 client 源码生成工具类 CSS，合并进 client/index.css。
 * tailwind 不可用或编译失败时降级为 warning，不 fail 构建。
 */

export interface CompileTailwindOptions {
  projectDir: string;
  tailwind: TailwindConfig;
  /** 默认扫描目录（dist-module/dsl 产物目录 + client entry 源码目录） */
  scanDirs: string[];
  /** 目标 CSS 文件（client/index.css，不存在则创建） */
  cssFile: string;
}

export interface CompileTailwindResult {
  compiled: boolean;
  warnings: string[];
}

/** 执行 Tailwind 预编译并把工具类 CSS 追加到 cssFile */
export function compileTailwind(options: CompileTailwindOptions): CompileTailwindResult {
  const warnings: string[] = [];
  if (!options.tailwind.enabled) {
    return { compiled: false, warnings };
  }

  const work = mkdtempSync(join(tmpdir(), 'pactor-tailwind-'));
  try {
    let input: string;
    if (options.tailwind.input !== undefined) {
      input = join(options.projectDir, options.tailwind.input);
      if (!existsSync(input)) {
        warnings.push(`tailwind.input 不存在: ${options.tailwind.input}，跳过预编译`);
        return { compiled: false, warnings };
      }
    } else {
      const scan = (options.tailwind.scan ?? options.scanDirs).map((dir) =>
        `@source "${dir.replace(/\\/g, '/')}";`,
      );
      input = join(work, 'input.css');
      writeFileSync(input, `@import "tailwindcss";\n${scan.join('\n')}\n`, 'utf8');
    }

    const out = join(work, 'tailwind.css');
    execFileSync(
      'npx',
      ['--no-install', 'tailwindcss', '--input', input, '--output', out],
      { cwd: options.projectDir, stdio: 'pipe' },
    );

    if (existsSync(out)) {
      const css = readFileSync(out, 'utf8');
      if (css.trim().length > 0) {
        mkdirSync(dirname(options.cssFile), { recursive: true });
        appendFileSync(
          options.cssFile,
          `\n/* tailwind utilities（pactor module build 预编译） */\n${css}`,
          'utf8',
        );
        return { compiled: true, warnings };
      }
    }
    warnings.push('tailwind 预编译产物为空，已跳过');
    return { compiled: false, warnings };
  } catch (error) {
    const firstLine = (error as Error).message.split('\n')[0] ?? '未知错误';
    warnings.push(`tailwind 不可用或编译失败，已降级跳过预编译（${firstLine}）`);
    return { compiled: false, warnings };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}
