import { writeFileSync } from 'node:fs';

import {
  ACTION_CONFIG_SCHEMA_ID,
  actionConfigSchema,
  DSL_NODE_SCHEMA_ID,
  dslNodeSchema,
  PAGE_DSL_SCHEMA_ID,
  pageDslSchema,
} from '@pactor-app/schema';

import { flagValue, type CliIo, type ParsedArgs } from '../args.js';

/**
 * `pactor schema [-o <file>]`：输出 Page DSL JSON Schema。
 * page / node / action 三份 Schema 以 `$id` 为键聚合输出，保持 `$ref` 一致性；
 * 缺省写 stdout，`-o` 写文件。
 */
export function runSchema(args: ParsedArgs, io: CliIo): number {
  const document = {
    [PAGE_DSL_SCHEMA_ID]: pageDslSchema,
    [DSL_NODE_SCHEMA_ID]: dslNodeSchema,
    [ACTION_CONFIG_SCHEMA_ID]: actionConfigSchema,
  };
  const json = JSON.stringify(document, null, 2);

  const output = flagValue(args, 'o');
  if (output !== undefined) {
    if (output === '') {
      io.err('用法: pactor schema [-o <file>]');
      return 2;
    }
    writeFileSync(output, `${json}\n`, 'utf8');
    io.out(`已写入: ${output}`);
    return 0;
  }

  io.out(json);
  return 0;
}
