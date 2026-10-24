import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { bundleServer, ServerBundleError } from './bundle-server.js';
import { createTempDir, writeText } from './test-utils.js';

describe('bundleServer', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
    writeText(
      join(temp.dir, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@/*': ['src/*'] } } }),
    );
    writeText(join(temp.dir, 'src/lib/value.ts'), 'export const answer = 42;\n');
  });
  afterEach(() => temp.cleanup());

  it('输出 server/index.mjs（outExtension 生效）+ sourcemap，支持 @/* alias', () => {
    writeText(
      join(temp.dir, 'module/server.ts'),
      `import { answer } from '@/lib/value';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';

export const handlers = {
  value: answer,
  hasCreateElement: typeof createElement === 'function',
  hasFs: typeof readFileSync === 'function',
};
`,
    );
    const outDir = join(temp.dir, 'out', 'server');
    const result = bundleServer({
      projectDir: temp.dir,
      serverEntry: 'module/server.ts',
      outDir,
    });

    expect(result.entry).toBe('index.mjs');
    expect(existsSync(join(outDir, 'index.mjs'))).toBe(true);
    expect(existsSync(join(outDir, 'index.mjs.map'))).toBe(true);
    // format=esm 不会自动把 .js 改成 .mjs
    expect(existsSync(join(outDir, 'index.js'))).toBe(false);

    const text = readFileSync(join(outDir, 'index.mjs'), 'utf8');
    // @/* alias 在打包期解析（源码被内联）；react / node builtin 保持 external
    expect(text).toContain('answer = 42');
    expect(text).not.toContain('@/lib/value');
    expect(text).toMatch(/from\s*["']react["']/);
    expect(text).toMatch(/from\s*["']node:fs["']/);
  });

  it('入口不存在抛 ServerBundleError', () => {
    expect(() =>
      bundleServer({
        projectDir: temp.dir,
        serverEntry: 'module/missing.ts',
        outDir: join(temp.dir, 'out'),
      }),
    ).toThrowError(ServerBundleError);
  });

  it('入口越出工程根抛 ServerBundleError', () => {
    expect(() =>
      bundleServer({
        projectDir: temp.dir,
        serverEntry: '../outside-server.ts',
        outDir: join(temp.dir, 'out'),
      }),
    ).toThrowError(/工程根内/);
  });
});
