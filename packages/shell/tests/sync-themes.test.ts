import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { syncThemes } from '../src/skin/sync-themes.js';

describe('syncThemes', () => {
  it('同步主题包全部皮肤到 public/themes', () => {
    const appRoot = mkdtempSync(join(tmpdir(), 'shell-themes-'));
    const result = syncThemes({ appRoot });
    expect(result.synced).toBeGreaterThanOrEqual(14);
    const css = readFileSync(join(appRoot, 'public/themes/qing-hui.css'), 'utf8');
    expect(css).toContain('--background');
  });

  it('checkOnly：同步后通过；篡改后抛错并列出过期文件', () => {
    const appRoot = mkdtempSync(join(tmpdir(), 'shell-themes-'));
    syncThemes({ appRoot });
    expect(() => syncThemes({ appRoot, checkOnly: true })).not.toThrow();

    writeFileSync(join(appRoot, 'public/themes/qing-hui.css'), '/* tampered */');
    expect(() => syncThemes({ appRoot, checkOnly: true })).toThrow(/qing-hui\.css/);
  });

  it('孤儿文件在同步时清理', () => {
    const appRoot = mkdtempSync(join(tmpdir(), 'shell-themes-'));
    syncThemes({ appRoot });
    writeFileSync(join(appRoot, 'public/themes/ghost.css'), '/* orphan */');
    const result = syncThemes({ appRoot });
    expect(result.synced).toBeGreaterThanOrEqual(14);
    expect(() => readFileSync(join(appRoot, 'public/themes/ghost.css'), 'utf8')).toThrow();
  });
});
