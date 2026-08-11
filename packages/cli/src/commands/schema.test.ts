import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { parseArgs } from '../args.js';
import { createTempDir, createTestIo } from '../test-utils.js';
import { runSchema } from './schema.js';

describe('pactor schema', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('输出合法 JSON 且含 page/dsl 等关键定义', () => {
    const { io, out } = createTestIo();
    const code = runSchema(parseArgs([]), io);
    expect(code).toBe(0);
    const json = JSON.parse(out.join('\n')) as Record<string, unknown>;
    expect(json['pactor:page-dsl']).toBeDefined();
    expect(json['pactor:dsl-node']).toBeDefined();
    expect(json['pactor:action-config']).toBeDefined();
    expect(out.join('\n')).toContain('"dsl"');
    expect(out.join('\n')).toContain('"page"');
  });

  it('-o 写文件', () => {
    const target = join(temp.dir, 'schema.json');
    const { io } = createTestIo();
    const code = runSchema(parseArgs(['-o', target]), io);
    expect(code).toBe(0);
    expect(existsSync(target)).toBe(true);
    const json = JSON.parse(readFileSync(target, 'utf8')) as Record<string, unknown>;
    expect(json['pactor:page-dsl']).toBeDefined();
  });
});
