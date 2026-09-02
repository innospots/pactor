import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { parseArgs } from '../args.js';
import { createTempDir, createTestIo } from '../test-utils.js';
import { runCreate } from './create.js';

describe('pactor create', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('生成工程骨架：关键文件存在且占位被替换', () => {
    const target = join(temp.dir, 'my-app');
    const { io, out } = createTestIo();

    const code = runCreate(parseArgs([target]), io);
    expect(code).toBe(0);
    expect(out.join('\n')).toContain('已创建工程');

    for (const file of [
      'package.json',
      'vite.config.ts',
      'index.html',
      'tsconfig.json',
      'README.md',
      'src/main.tsx',
      'src/pages/home.page.yaml',
    ]) {
      expect(existsSync(join(target, file)), file).toBe(true);
    }

    const pkg = JSON.parse(
      readFileSync(join(target, 'package.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(pkg.name).toBe('my-app');

    const mainTsx = readFileSync(join(target, 'src/main.tsx'), 'utf8');
    expect(mainTsx).toContain("appId: 'my-app'");
    expect(mainTsx).toContain("import '@pactor-app/ui/styles.css'");
    expect(mainTsx).toContain('StaticDslLoader');
    expect(mainTsx).toContain('createPactorApplication');
    expect(mainTsx).not.toContain('__APP_NAME__');
    expect(readFileSync(join(target, 'index.html'), 'utf8')).not.toContain('__APP_NAME__');
  });

  it('非空目录拒绝：退出码 2 且目录内容不变', () => {
    const target = join(temp.dir, 'existing');
    mkdirSync(target);
    writeFileSync(join(target, 'keep.txt'), 'original', 'utf8');
    const { io, err } = createTestIo();

    const code = runCreate(parseArgs([target]), io);
    expect(code).toBe(2);
    expect(err.join('\n')).toContain('非空');
    // 目录内容不变：未生成模板文件，原有文件保持
    expect(readFileSync(join(target, 'keep.txt'), 'utf8')).toBe('original');
    expect(existsSync(join(target, 'package.json'))).toBe(false);
  });

  it('已存在的空目录允许生成', () => {
    const target = join(temp.dir, 'empty');
    mkdirSync(target);
    const { io } = createTestIo();
    expect(runCreate(parseArgs([target]), io)).toBe(0);
    expect(existsSync(join(target, 'package.json'))).toBe(true);
  });

  it('无参数或未知模板退出码 2', () => {
    const { io } = createTestIo();
    expect(runCreate(parseArgs([]), io)).toBe(2);
    expect(runCreate(parseArgs([join(temp.dir, 'x'), '-t', 'unknown']), io)).toBe(2);
  });
});
