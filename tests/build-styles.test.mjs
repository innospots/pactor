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

  it('包含全局密度令牌与档位选择器', () => {
    expect(css).toContain('--pactor-control-height-md');
    expect(css).toContain('--pactor-control-text-lg');
    expect(css).toContain('--pactor-control-box');
    expect(css).toContain("[data-pactor-size='compact']");
    expect(css).toContain("[data-pactor-size='comfortable']");
  });

  it('控件原语编译为令牌引用（运行时随密度档位变化）', () => {
    // Tailwind v4 var 语法编译为 var() 引用；选择器中的 ( ) 转义为 \( \)
    expect(css).toContain('.h-\\(--pactor-control-height-md\\)');
    expect(css).toContain('.text-\\[length\\:var\\(--pactor-control-text-md\\)\\]');
    expect(css).toContain('.size-\\(--pactor-control-box\\)');
    expect(css).toContain('.data-\\[size\\=sm\\]\\:h-\\(--pactor-control-height-sm\\)');
  });

  it('菜单项编译为密度令牌引用', () => {
    expect(css).toContain('.py-\\(--pactor-menu-item-padding-y\\)');
  });
});
