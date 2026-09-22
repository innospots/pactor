/**
 * 图表颜色规范化契约：oklch()/oklab() 令牌转为 echarts 可解析的 rgb()，
 * 其他格式透传（echarts 内部色彩计算不支持 oklch，会退化为黑色）。
 */
import { describe, expect, it } from 'vitest';

import { normalizeColor } from '../../src/components/chart/lib/color.js';

describe('normalizeColor', () => {
  it('黑白锚点', () => {
    expect(normalizeColor('oklch(100% 0 0)')).toBe('rgb(255, 255, 255)');
    expect(normalizeColor('oklch(0% 0 0)')).toBe('rgb(0, 0, 0)');
    expect(normalizeColor('oklch(1 0 0)')).toBe('rgb(255, 255, 255)');
  });

  it('中灰锚点：L=0.5 无彩度 → 三通道相等', () => {
    expect(normalizeColor('oklch(50% 0 0)')).toBe('rgb(99, 99, 99)');
    expect(normalizeColor('oklab(0.5 0 0)')).toBe('rgb(99, 99, 99)');
  });

  it('百分比与无单位亮度等价', () => {
    expect(normalizeColor('oklch(64.6% 0.222 41.116)')).toBe(
      normalizeColor('oklch(0.646 .222 41.116)'),
    );
  });

  it('带 alpha 的 oklch 忽略透明度（皮肤令牌均不透明）', () => {
    expect(normalizeColor('oklch(50% 0 0 / 0.5)')).toBe('rgb(99, 99, 99)');
  });

  it('彩色 oklch 输出非黑 rgb 且三通道不全等', () => {
    const out = normalizeColor('oklch(64.6% 0.222 41.116)');
    expect(out).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    const [r, g, b] = out.match(/\d+/g)!.map(Number);
    expect(r! + g! + b!).toBeGreaterThan(120);
    expect(new Set([r, g, b]).size).toBeGreaterThan(1);
  });

  it('非 oklch 格式原样透传', () => {
    expect(normalizeColor('#ff8800')).toBe('#ff8800');
    expect(normalizeColor('rgb(1, 2, 3)')).toBe('rgb(1, 2, 3)');
    expect(normalizeColor('steelblue')).toBe('steelblue');
    expect(normalizeColor('var(--chart-1)')).toBe('var(--chart-1)');
  });

  it('首尾空白裁剪', () => {
    expect(normalizeColor('  oklch(0% 0 0)  ')).toBe('rgb(0, 0, 0)');
  });
});
