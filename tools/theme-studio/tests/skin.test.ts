/**
 * 皮肤 CSS 合成测试（spec: theme-studio / 皮肤 CSS 生成与下载）：
 * - 预置主题令牌子集原样合成进 :root 块
 * - overrides 优先于预置主题，且可新增预置主题未覆盖的令牌
 * - 空串 override 视为未修改
 * - 输出附带注释掉的 [data-pactor-theme='dark'] 暗色骨架
 * - 预置主题只覆盖令牌清单内的令牌子集
 */
import { describe, expect, it } from 'vitest';

import { SKIN_PRESETS } from '../src/presets';
import { composeSkinCss } from '../src/skin';
import { TOKEN_NAMES } from '../src/tokens';

const preset = SKIN_PRESETS[0]!;

describe('composeSkinCss', () => {
  it('预置主题令牌原样合成进 :root 块', () => {
    const css = composeSkinCss(preset, {});
    expect(css).toContain(':root {');
    expect(css).toContain(`--primary: ${preset.tokens['--primary']};`);
    expect(css).toContain(preset.name);
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

  it('预置主题带 darkTokens 时生成真实暗色块', () => {
    const css = composeSkinCss(preset, {});
    expect(css).toContain("[data-pactor-theme='dark'] {");
    // 暗色块不被注释包住：暗色令牌作为真实规则存在
    const darkStart = css.indexOf("[data-pactor-theme='dark'] {");
    expect(darkStart).toBeGreaterThan(-1);
    const darkBlock = css.slice(darkStart, css.indexOf('}', darkStart));
    expect(darkBlock).toContain('--background:');
    // 无暗色骨架注释
    expect(css).not.toContain('/* 可选：暗色皮肤骨架');
  });

  it('无预置主题时附带注释掉的暗色骨架', () => {
    const css = composeSkinCss(null, { '--radius': '1rem' });
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

describe('预置主题为风格化令牌子集', () => {
  it('每套预置主题只定义令牌清单内的合法令牌', () => {
    for (const item of SKIN_PRESETS) {
      for (const name of Object.keys(item.tokens)) {
        expect(TOKEN_NAMES).toContain(name);
      }
    }
  });

  it('内置至少 5 套风格化主题，且风格不限于换主色（含形状/阴影/字体/背景等覆盖）', () => {
    expect(SKIN_PRESETS.length).toBeGreaterThanOrEqual(5);
    const nonColorTokens = /^--(radius|card-shadow|font-sans|background)$/;
    const styled = SKIN_PRESETS.filter((item) =>
      Object.keys(item.tokens).some((name) => nonColorTokens.test(name)),
    );
    expect(styled.length).toBeGreaterThanOrEqual(3);
  });

  it('每套主题含语义四色（destructive/success/warning/info），亮色与暗色成组', () => {
    const semantic = ['--destructive', '--success', '--warning', '--info'];
    for (const item of SKIN_PRESETS) {
      for (const name of semantic) {
        expect(item.tokens[name], `${item.key} ${name}`).toBeTruthy();
        expect(item.darkTokens[name], `${item.key} dark ${name}`).toBeTruthy();
      }
    }
  });

  it('每套主题按钮展示代表色板（swatches 非空且为合法颜色值）', () => {
    for (const item of SKIN_PRESETS) {
      expect(item.swatches.length).toBeGreaterThan(0);
      for (const swatch of item.swatches) {
        expect(swatch).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });
});
