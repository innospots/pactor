import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import themesJson from '../themes.json';
import { THEMES } from '../src/index.js';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(packageRoot, 'src', 'skins');
const outputDir = join(packageRoot, 'skins');

function readSkin(name: string): string {
  return readFileSync(join(outputDir, `${name}.css`), 'utf8');
}

function withoutComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

describe('generated skins', () => {
  it('emits one file per manifest entry', () => {
    const files = readdirSync(outputDir)
      .filter((file) => file.endsWith('.css'))
      .sort();
    expect(files).toEqual(
      themesJson.themes.map((theme) => `${theme.name}.css`).sort(),
    );
  });

  it('has a source file for every theme except the shared base', () => {
    const sources = readdirSync(sourceDir)
      .filter((file) => file.endsWith('.css') && file !== '_base.css')
      .sort();
    expect(sources).toEqual(
      themesJson.themes.map((theme) => `${theme.name}.css`).sort(),
    );
    expect(existsSync(join(sourceDir, '_base.css'))).toBe(true);
  });

  it('is self-contained and satisfies the skin contract', () => {
    for (const theme of THEMES) {
      const css = readSkin(theme.name);
      const declarations = withoutComments(css);

      expect(css, theme.name).not.toMatch(/@import\b/);
      expect(css, theme.name).toMatch(
        /:root:not\(\[data-pactor-theme=['"]dark['"]\]\)/,
      );
      expect(css, theme.name).toMatch(/\[data-pactor-theme=['"]dark['"]\]/);
      expect(css, theme.name).toMatch(/color-scheme\s*:\s*light\b/);
      expect(css, theme.name).toMatch(/color-scheme\s*:\s*dark\b/);
      expect(css, theme.name).toMatch(/--background\s*:/);
      expect(declarations, theme.name).not.toMatch(
        /--pactor-control-[a-z0-9-]+\s*:/,
      );

      const colors = [
        ...declarations.matchAll(/--theme-source\s*:\s*(#[0-9a-f]{6})\b/gi),
      ].map((match) => match[1].toLowerCase());
      expect(colors.length, theme.name).toBeGreaterThan(0);
      for (const color of colors) {
        expect(color, theme.name).toBe(theme.color.toLowerCase());
      }
    }
  });

  it('inlines the shared base for thin skins', () => {
    const base = readFileSync(join(sourceDir, '_base.css'), 'utf8');
    for (const theme of THEMES) {
      const source = readFileSync(
        join(sourceDir, `${theme.name}.css`),
        'utf8',
      );
      if (!source.startsWith("@import './_base.css';")) continue;
      expect(readSkin(theme.name).includes(base.trimEnd())).toBe(true);
    }
  });
});
