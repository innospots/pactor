import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillManifestPath = join(root, 'skills/pactor-prd/template-placeholders.json');
const templateManifestPath = join(
  root,
  'packages/create-app/templates/next-app/placeholders.json',
);

function readKeys(path) {
  return Object.keys(JSON.parse(readFileSync(path, 'utf8'))).sort();
}

describe('占位符清单一致性（pactor-prd skill ↔ create-app next-app 模板）', () => {
  it('模板 placeholders.json 存在（由 starters/next-app-starter 经 sync-templates 同步）', () => {
    expect(existsSync(templateManifestPath), templateManifestPath).toBe(true);
  });

  it('两份清单键集合完全相等', () => {
    expect(readKeys(templateManifestPath)).toEqual(readKeys(skillManifestPath));
  });

  it('每个键都有字符串 example（create-app 默认值来源）', () => {
    const manifest = JSON.parse(readFileSync(templateManifestPath, 'utf8'));
    for (const [key, entry] of Object.entries(manifest)) {
      expect(typeof entry.example, key).toBe('string');
    }
  });
});
