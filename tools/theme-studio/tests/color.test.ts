/**
 * 取色器默认值解析测试：令牌默认值常为 var() 引用 / oklch() /
 * color-mix()，浏览器计算样式会给出 oklch() 或 color(srgb) 形态，
 * 须归一为 #rrggbb 供 <input type="color"> 显示（归一失败回退色会
 * 误导皮肤作者，曾全部显示为白色/回退色）。
 */
import { describe, expect, it } from 'vitest';

import {
  normalizeComputedColor,
  oklchToHex,
  resolveTokenColor,
  hexToOklch,
} from '../src/resolve';

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

describe('normalizeComputedColor', () => {
  it('hex / rgb / color(srgb) 直接归一', () => {
    expect(normalizeComputedColor('#c12c1f')).toBe('#c12c1f');
    expect(normalizeComputedColor('rgb(193, 44, 31)')).toBe('#c12c1f');
    expect(normalizeComputedColor('rgba(193, 44, 31, 0.5)')).toBe('#c12c1f');
    expect(normalizeComputedColor('color(srgb 0.757 0.173 0.122)')).toBe(
      '#c12c1f',
    );
  });

  it('oklch 灰阶归一为中性灰（对齐 Tailwind neutral）', () => {
    // oklch(0.205 0 0) ≈ neutral-900 #171717；oklch(0.922 0 0) ≈ neutral-200 #e5e5e5
    const dark = hexToRgb(normalizeComputedColor('oklch(0.205 0 0)')!);
    for (const c of dark) {
      expect(Math.abs(c - 23)).toBeLessThanOrEqual(2);
    }
    const light = hexToRgb(normalizeComputedColor('oklch(0.922 0 0)')!);
    for (const c of light) {
      expect(Math.abs(c - 229)).toBeLessThanOrEqual(2);
    }
  });

  it('oklch 彩色与百分比明度', () => {
    expect(normalizeComputedColor('oklch(0.577 0.245 27.325)')).toMatch(
      /^#[0-9a-f]{6}$/,
    );
    expect(normalizeComputedColor('oklch(92.2% 0 0)')).toMatch(
      /^#e[3-6]/,
    );
  });

  it('不可解析时返回 null', () => {
    expect(normalizeComputedColor('')).toBeNull();
    expect(normalizeComputedColor('inherit')).toBeNull();
  });
});

describe('oklchToHex', () => {
  it('黑白端点', () => {
    expect(oklchToHex(0, 0, 0)).toBe('#000000');
    expect(oklchToHex(1, 0, 0)).toBe('#ffffff');
  });

  it('超色域截断不产出 NaN', () => {
    expect(oklchToHex(0.7, 0.4, 30)).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('resolveTokenColor（纯数据解析，主题切换无竞态）', () => {
  it('默认主题：var() 链解析到内置默认值', () => {
    // --switch-track-checked → var(--primary) → oklch(0.205 0 0) ≈ #171717
    expect(resolveTokenColor('--switch-track-checked', {})).toBe('#171717');
    // --slider-track → var(--muted) → oklch(0.97 0 0) ≈ #f5f5f5
    expect(resolveTokenColor('--slider-track', {})).toBe('#f5f5f5');
  });

  it('切换主题后 var() 链解析到新主题值', () => {
    const chalk = { '--primary': '#18181b', '--background': '#fafafa' };
    expect(resolveTokenColor('--switch-track-checked', chalk)).toBe('#18181b');
    // 组件表面令牌默认桥接 --card 而非 --background：改页面背景不连累组件
    expect(resolveTokenColor('--switch-thumb', chalk)).toBe('#ffffff');
    expect(resolveTokenColor('--switch-thumb', { '--card': '#fafafa' })).toBe('#fafafa');
    // 未被主题覆盖的令牌仍回退默认
    expect(resolveTokenColor('--switch-track', chalk)).toBe('#e5e5e5');
  });

  it('用户 override 优先于预置主题', () => {
    const effective = { '--primary': '#18181b', '--switch-track-checked': '#ff0000' };
    expect(resolveTokenColor('--switch-track-checked', effective)).toBe('#ff0000');
  });

  it('oklch 相对颜色（bubble）沿主题源色派生', () => {
    // --bubble-background: oklch(from var(--primary) 0.93 calc(c*0.4) h)
    const def = resolveTokenColor('--bubble-background', {});
    expect(def).toMatch(/^#[0-9a-f]{6}$/);
    // 主题主色为 hex 时也能派生（hex → oklch → 通道替换）
    const themed = resolveTokenColor('--bubble-background', { '--primary': '#c12c1f' });
    expect(themed).toMatch(/^#[0-9a-f]{6}$/);
    expect(themed).not.toBe(def);
  });
});

describe('hexToOklch / oklchToHex 往返', () => {
  it('hex → oklch → hex 近似还原', () => {
    for (const hex of ['#c12c1f', '#3271ae', '#779649']) {
      const oklch = hexToOklch(hex)!;
      const round = oklchToHex(...oklch)!;
      const [r1, g1, b1] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      const [r2, g2, b2] = [1, 3, 5].map((i) => parseInt(round.slice(i, i + 2), 16));
      expect(Math.abs(r1 - r2)).toBeLessThanOrEqual(2);
      expect(Math.abs(g1 - g2)).toBeLessThanOrEqual(2);
      expect(Math.abs(b1 - b2)).toBeLessThanOrEqual(2);
    }
  });
});
