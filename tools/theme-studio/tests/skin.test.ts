/**
 * 皮肤 CSS 合成测试（spec: theme-studio / 皮肤 CSS 生成与下载）：
 * - 合并链：tokens.ts 默认值（全量）→ 预置主题 → 用户 overrides（后者优先）
 * - 预置主题未定义的令牌以默认值出现在导出中（如 --sidebar 基座族）
 * - 空串 override 视为未修改（该令牌保持默认值）
 * - 暗色块不做默认值兜底；预置主题带 darkTokens 时生成真实暗色块
 */
import { describe, expect, it } from 'vitest';

import { SKIN_PRESETS } from '../src/presets';
import { TOKEN_DEFAULTS } from '../src/resolve';
import { composeSkinCss } from '../src/skin';
import { TOKEN_NAMES } from '../src/tokens';

const preset = SKIN_PRESETS[0]!;

describe('composeSkinCss', () => {
  it('预置主题令牌原样合成进亮色块', () => {
    const css = composeSkinCss(preset, {});
    expect(css).toContain(":root:not([data-pactor-theme='dark']) {");
    expect(css).toContain(`--primary: ${preset.tokens['--primary']};`);
    expect(css).toContain(preset.name);
  });

  it('亮色块排除暗色模式：亮色令牌不覆盖内置暗色皮肤', () => {
    // 回归：裸 `:root` 与内置 [data-pactor-theme='dark'] 同优先级（0,1,0），
    // 皮肤后加载会把亮色 --border（近白色）泄漏进暗色模式，导致暗色边框刺眼
    const css = composeSkinCss(preset, {});
    expect(css).not.toMatch(/(^|\n):root \{/);
  });

  it('导出包含全部已知令牌：无预置主题时以默认值兜底', () => {
    const css = composeSkinCss(null, { '--radius': '1.5rem' });
    expect(css).toContain('--radius: 1.5rem;');
    expect(css).toContain(`--primary: ${TOKEN_DEFAULTS['--primary']};`);
  });

  it('预置主题未定义的令牌以默认值出现在导出中（--sidebar 基座族）', () => {
    // chalk 预置不含 --sidebar（仅 sidebar-primary/accent 等）
    expect(preset.tokens['--sidebar']).toBeUndefined();
    const css = composeSkinCss(preset, {});
    expect(css).toContain(`--sidebar: ${TOKEN_DEFAULTS['--sidebar']};`);
  });

  it('overrides 优先于预置主题同名令牌', () => {
    const css = composeSkinCss(preset, { '--primary': '#000000' });
    expect(css).toContain('--primary: #000000;');
    expect(css).not.toContain(`--primary: ${preset.tokens['--primary']};`);
  });

  it('覆盖优先级：用户修改 > 预置主题 > 默认值', () => {
    expect(preset.tokens['--primary']).toBeTruthy();
    expect(preset.tokens['--primary']).not.toBe(TOKEN_DEFAULTS['--primary']);
    const fromPreset = composeSkinCss(preset, {});
    expect(fromPreset).toContain(`--primary: ${preset.tokens['--primary']};`);
    const overridden = composeSkinCss(preset, { '--primary': '#111111' });
    expect(overridden).toContain('--primary: #111111;');
  });

  it('overrides 可新增预置主题未覆盖的令牌（含组件级令牌）', () => {
    const css = composeSkinCss(preset, { '--switch-track-checked': '#123456' });
    expect(css).toContain('--switch-track-checked: #123456;');
  });

  it('空串 override 视为未修改（该令牌保持默认值）', () => {
    const css = composeSkinCss(null, { '--radius': '   ' });
    expect(css).toContain(`--radius: ${TOKEN_DEFAULTS['--radius']};`);
    expect(css).not.toContain('--radius:  ;');
  });

  it('预置主题带 darkTokens 时生成真实暗色块', () => {
    const css = composeSkinCss(preset, {});
    expect(css).toContain("[data-pactor-theme='dark'] {");
    // 暗色块不被注释包住：暗色令牌作为真实规则存在
    const darkStart = css.indexOf("[data-pactor-theme='dark'] {");
    expect(darkStart).toBeGreaterThan(-1);
    const darkBlock = css.slice(darkStart, css.indexOf('}', darkStart));
    expect(darkBlock).toContain('--background:');
    // 暗色块不做默认值兜底：预置未定义的暗色令牌不出现
    expect(darkBlock).not.toContain('--calendar-range-background');
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

  it('每套主题的暗色令牌组含 --border/--input（导出的暗色块自包含边框色）', () => {
    for (const item of SKIN_PRESETS) {
      expect(item.darkTokens['--border'], `${item.key} dark --border`).toBeTruthy();
      expect(item.darkTokens['--input'], `${item.key} dark --input`).toBeTruthy();
    }
  });

  it('导出的暗色块包含 --border 令牌', () => {
    for (const item of SKIN_PRESETS) {
      const css = composeSkinCss(item, {});
      const darkStart = css.indexOf("[data-pactor-theme='dark'] {");
      const darkBlock = css.slice(darkStart, css.indexOf('}', darkStart));
      expect(darkBlock, item.key).toContain(`--border: ${item.darkTokens['--border']};`);
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
