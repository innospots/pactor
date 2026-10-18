import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('../', import.meta.url));
let css;

beforeAll(() => {
  execFileSync(process.execPath, ['packages/pactor/scripts/build-styles.mjs'], {
    cwd: root,
    stdio: 'pipe',
  });
  css = readFileSync(fileURLToPath(new URL('../packages/pactor/styles.css', import.meta.url)), 'utf8');
});

describe('pactor-app aggregated styles', () => {
  it('keeps ordinary utilities before unwrapped state variants across packages', () => {
    const ordinary = '.text-destructive {';
    const state = '.data-open\\:text-\\(--menu-active-foreground\\)';

    expect(css.lastIndexOf(ordinary)).toBeGreaterThan(-1);
    expect(css.indexOf(state)).toBeGreaterThan(-1);
    expect(css.lastIndexOf(ordinary)).toBeLessThan(css.indexOf(state));
  });

  it('orders every sm rule before every md rule across packages', () => {
    const sm = '.sm\\:';
    const md = '.md\\:';

    expect(css.lastIndexOf(sm)).toBeGreaterThan(-1);
    expect(css.indexOf(md)).toBeGreaterThan(-1);
    expect(css.lastIndexOf(sm)).toBeLessThan(css.indexOf(md));
  });
});
