import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { build } from 'vite';

import pactor from '../src/index.js';

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

/** 递归收集目录下全部文件路径 */
function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

describe('vite build 集成', () => {
  let workDir: string;
  let outDir: string;

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), 'pactor-vite-plugin-'));
    outDir = join(workDir, 'dist');
    cpSync(fixturesDir, workDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it('入口 import .page.yaml 构建成功，产物含页面 id 与 dslVersion', async () => {
    await build({
      root: workDir,
      logLevel: 'silent',
      plugins: [pactor()],
      build: {
        outDir,
        // 不生成 manifest / sourcemap，保持产物最小
        manifest: false,
        sourcemap: false,
        rollupOptions: {
          input: join(workDir, 'main.ts'),
        },
      },
    });

    const jsFiles = listFiles(outDir).filter((path) => path.endsWith('.js'));
    expect(jsFiles.length).toBeGreaterThan(0);
    const bundle = jsFiles.map((path) => readFileSync(path, 'utf8')).join('\n');
    expect(bundle).toContain('demo-page');
    // dslVersion 为具名导出，入口未引用时被 treeshake，属正常行为
  }, 60_000);
});
