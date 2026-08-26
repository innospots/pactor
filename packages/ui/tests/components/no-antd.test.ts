import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, expect, it } from 'vitest';

const packageDir = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

/** 递归收集目录下的文本文件（相对路径） */
function collectFiles(dir: string, prefix = ''): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...collectFiles(join(dir, entry.name), rel));
    } else {
      files.push(rel);
    }
  }
  return files;
}

describe('不依赖 antd', () => {
  it('package.json dependencies / peerDependencies 无 antd', () => {
    const pkg = JSON.parse(
      readFileSync(join(packageDir, 'package.json'), 'utf8'),
    ) as {
      dependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    expect(Object.keys(pkg.dependencies ?? {})).not.toContain('antd');
    expect(Object.keys(pkg.peerDependencies ?? {})).not.toContain('antd');
  });

  it('src 源码无 antd 引用', () => {
    const sources = collectFiles(join(packageDir, 'src'), '');
    expect(sources.length).toBeGreaterThan(0);
    for (const rel of sources) {
      const content = readFileSync(join(packageDir, 'src', rel), 'utf8');
      expect(content, `${rel} 不应引用 antd`).not.toMatch(/from 'antd'/);
    }
  });

  it('构建产物（若已构建）无 antd 引用', () => {
    const distDir = join(packageDir, 'dist');
    if (!existsSync(distDir)) {
      // 未构建时跳过（根验收流程先 build 后 test，会覆盖此检查）
      return;
    }
    for (const rel of collectFiles(distDir)) {
      const content = readFileSync(join(distDir, rel), 'utf8');
      expect(content, `dist/${rel} 不应引用 antd`).not.toMatch(/from ['"]antd['"]/);
    }
  });
});
