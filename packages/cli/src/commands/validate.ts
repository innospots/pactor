import { existsSync, statSync } from 'node:fs';

import type { CliIo, ParsedArgs } from '../args.js';
import { isFragmentFile, readDslFile, validateDsl } from '../dsl-io.js';

/**
 * `pactor validate <files...>`：逐文件解析并校验。
 * page 走完整 Schema 校验，fragment 宽松检查 dsl + body；
 * 全部通过退出码 0，任一失败退出码 1，无参数或文件不存在退出码 2。
 */
export function runValidate(args: ParsedArgs, io: CliIo): number {
  if (args.positionals.length === 0) {
    io.err('用法: pactor validate <files...>');
    return 2;
  }

  for (const file of args.positionals) {
    if (!existsSync(file) || !statSync(file).isFile()) {
      io.err(`文件不存在: ${file}`);
      return 2;
    }
  }

  let failed = 0;
  for (const file of args.positionals) {
    const read = readDslFile(file);
    if (!read.ok) {
      failed += 1;
      for (const error of read.errors) {
        io.err(`${file}: ${error.path}: ${error.message} (${error.keyword})`);
      }
      continue;
    }
    const errors = validateDsl(read.data, isFragmentFile(file));
    if (errors.length > 0) {
      failed += 1;
      for (const error of errors) {
        io.err(`${file}: ${error.path}: ${error.message} (${error.keyword})`);
      }
    }
  }

  const passed = args.positionals.length - failed;
  if (failed > 0) {
    io.err(`校验失败: ${failed} 个文件未通过，${passed} 个通过`);
    return 1;
  }
  io.out(`校验通过: 共 ${passed} 个文件`);
  return 0;
}
