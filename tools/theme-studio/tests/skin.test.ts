/**
 * 皮肤 CSS 合成测试（spec: theme-studio / 皮肤 CSS 生成与下载）：
 * - 预置主题令牌子集原样合成进 :root 块
 * - overrides 优先于预置主题，且可新增预置主题未覆盖的令牌
 * - 空串 override 视为未修改
 * - 输出附带注释掉的 [data-pactor-theme='dark'] 暗色骨架
 * - 预置主题只覆盖语义令牌子集（不含组件级令牌）
 */
import { describe, expect, it } from 'vitest';

import { SKIN_PRESETS } from '../src/presets';
import { composeSkinCss } from '../src/skin';
import { TOKEN_NAMES } from '../src/tokens';

const preset = SKIN_PRESETS[0]!; // 珊瑚赫

describe('composeSkinCss', () => {
  it('预置主题令牌原样合成进 :root 块', () => {
    const css = composeSkinCss(preset, {});
    expect(css).toContain(':root {');
    expect(css).toContain(`--primary: ${preset.tokens['--primary']};`);
    expect(css).toContain('珊瑚赫');
  });

  it('无预置主题时仅合成用户 overrides', () => {
    const css = composeSkinCss(null, { '--radius': '1.5rem' });
    expect(css).toContain('--radius: 1.5rem;');
    expect(css).not.toContain('--primary:');
  });

  it('overrides 优先于预置主题同名令牌', () => {
    const css = composeSkinCss(preset, { '--primary': '#000000' });
    expect(css).toContain('--primary: #000000;');
    expect(css).not.toContain(`--primary: ${preset.tokens['--primary']};`);
  });

  it('overrides 可新增预置主题未覆盖的令牌（含组件级令牌）', () => {
    const css = composeSkinCss(preset, { '--switch-track-checked': '#123456' });
    expect(css).toContain('--switch-track-checked: #123456;');
  });

  it('空串 override 视为未修改（不落进输出）', () => {
    const css = composeSkinCss(null, { '--radius': '   ' });
    expect(css).not.toContain('--radius');
  });

  it('附带注释掉的暗色骨架', () => {
    const css = composeSkinCss(preset, {});
    const commentStart = css.indexOf('/* 可选：暗色皮肤骨架');
    const commentEnd = css.indexOf('*/', commentStart);
    expect(commentStart).toBeGreaterThan(-1);
    expect(commentEnd).toBeGreaterThan(commentStart);
    const skeleton = css.slice(commentStart, commentEnd);
    expect(skeleton).toContain("[data-pactor-theme='dark']");
  });

  it('预览与下载同源：同一输入产出完全相同的文本', () => {
    const overrides = { '--radius': '1rem' };
    expect(composeSkinCss(preset, overrides)).toBe(
      composeSkinCss(preset, overrides),
    );
  });
});

describe('预置主题为语义令牌子集', () => {
  it('每套预置主题只定义令牌清单内的合法令牌', () => {
    for (const item of SKIN_PRESETS) {
      for (const name of Object.keys(item.tokens)) {
        expect(TOKEN_NAMES).toContain(name);
      }
    }
  });

  it('预置主题不含组件级令牌（组件级视觉经 var() 回退跟随）', () => {
    const componentLevel = /^--(switch|slider|radio|progress|pagination|menu|bubble|calendar)-/;
    for (const item of SKIN_PRESETS) {
      const violations = Object.keys(item.tokens).filter((name) =>
        componentLevel.test(name),
      );
      expect(violations).toEqual([]);
    }
  });

  it('内置至少 5 套中国传统色主题', () => {
    const china = SKIN_PRESETS.filter((item) =>
      /立春|雨水|驚蟄|春分|清明/.test(item.description),
    );
    expect(china.length).toBeGreaterThanOrEqual(5);
  });
});
