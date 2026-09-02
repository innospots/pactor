import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { FragmentDsl, PageDsl } from '@pactor-app/core';

import { flagValue, type CliIo, type ParsedArgs } from '../args.js';
import {
  collectDslFiles,
  isFragmentFile,
  readDslFile,
  validateDsl,
} from '../dsl-io.js';

/**
 * `pactor build <src> -o <dir>`：递归编译 src 下 DSL 文件为 Runtime
 * Envelope JSON（`{ id, resourceType, version: 1, dslVersion, schema }`），
 * 写入 `<dir>/<id>.json`。任一文件校验失败即报告并以退出码 1 中止（不写产物）。
 */
export function runBuild(args: ParsedArgs, io: CliIo): number {
  const src = args.positionals[0];
  const outDir = flagValue(args, 'o');
  if (src === undefined || outDir === undefined || outDir === '') {
    io.err('用法: pactor build <src> -o <dir>');
    return 2;
  }
  if (!existsSync(src) || !statSync(src).isDirectory()) {
    io.err(`源目录不存在: ${src}`);
    return 2;
  }

  const { files } = collectDslFiles([src]);
  if (files.length === 0) {
    io.err(`未找到 DSL 文件: ${src}（.page/.fragment.yaml/.yml）`);
    return 1;
  }

  // 先全部解析校验，任一失败即中止，不产生半成品输出
  const compiled: { id: string; envelope: Record<string, unknown> }[] = [];
  let failed = false;
  for (const file of files) {
    const read = readDslFile(file);
    const errors = read.ok
      ? validateDsl(read.data, isFragmentFile(file))
      : read.errors;
    if (errors.length > 0) {
      failed = true;
      for (const error of errors) {
        io.err(`${file}: ${error.path}: ${error.message} (${error.keyword})`);
      }
      continue;
    }
    if (!read.ok) continue; // 类型收窄，实际不可达

    const isFragment = isFragmentFile(file);
    const data = read.data as PageDsl & FragmentDsl;
    const id = isFragment ? data.fragment.id : data.page.id;
    compiled.push({
      id,
      envelope: {
        id,
        resourceType: isFragment ? 'fragment' : 'page',
        version: 1,
        dslVersion: data.dsl,
        schema: data,
      },
    });
  }

  if (failed) {
    io.err('构建中止: 存在校验失败的 DSL 文件');
    return 1;
  }

  mkdirSync(outDir, { recursive: true });
  for (const { id, envelope } of compiled) {
    const target = join(outDir, `${id}.json`);
    writeFileSync(target, `${JSON.stringify(envelope, null, 2)}\n`, 'utf8');
    io.out(`已生成: ${target}`);
  }
  io.out(`构建完成: ${compiled.length} 个资源`);
  return 0;
}
