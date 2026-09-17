/**
 * 皮肤 CSS 合成（spec: theme-studio / 皮肤 CSS 生成与下载）。
 *
 * `composeSkinCss(preset, overrides)` 把「令牌默认值 ∪ 预置主题令牌 ∪ 用户修改」
 *（后者优先）合成为一份皮肤 CSS 文本：`:root:not([data-pactor-theme='dark'])`
 * 亮色覆盖块包含 tokens.ts 登记的全部令牌；预置主题带 darkTokens 时同时生成真实
 * `[data-pactor-theme='dark']` 暗色块，否则附带注释掉的暗色骨架引导。预览（postMessage 注入
 * iframe）与下载（Blob 导出 pactor-theme.css）共用同一份文本，
 * 保证导出与预览严格一致。
 *
 * 亮色块选择器必须排除 `[data-pactor-theme='dark']`：皮肤在 styles.css 之后加载，
 * 裸 `:root` 与内置暗色块优先级相同（0,1,0），后加载者胜出会把亮色值
 * （如 --border 近白色）泄漏进暗色模式；排除后未覆盖的暗色令牌真正回退到内置暗色皮肤。
 * 本块优先级（0,2,0）高于系统偏好暗色兜底块（:where() 降为 0,1,0），
 * 因此加载皮肤后系统暗色偏好不会把皮肤压成内置暗色；
 * 显式 `data-pactor-theme='dark'` 时本块不匹配，暗色块照常生效（三态语义不受影响）。
 * 亮/暗两块都显式声明 color-scheme：皮肤令牌压过兜底块时，兜底块的
 * color-scheme: dark 声明仍会命中（皮肤不覆盖该属性），导致亮色皮肤下
 * 原生滚动条/表单控件呈现深色；显式声明后浏览器原生控件随皮肤明暗翻转。
 */
import type { SkinPreset } from './presets';
import { TOKEN_DEFAULTS } from './resolve';

/** 合成皮肤 CSS 文本：`:root:not([data-pactor-theme='dark'])` 亮色覆盖块 + 暗色块（或注释骨架）；
 * 亮色合并链：tokens.ts 默认值（全量令牌）→ 预置主题 tokens → 用户 overrides（后者优先），
 * 预置主题未定义的令牌（如 --sidebar 基座族）以默认值出现在导出中；
 * darkOverrides（AI 生成的暗色令牌）并入暗色块且优先于预置主题 */
export function composeSkinCss(
  preset: SkinPreset | null,
  overrides: Record<string, string>,
  darkOverrides: Record<string, string> = {},
): string {
  const merged: Record<string, string> = {
    ...TOKEN_DEFAULTS,
    ...(preset?.tokens ?? {}),
  };
  for (const [name, value] of Object.entries(overrides)) {
    const trimmed = value.trim();
    if (trimmed === '') {
      continue;
    }
    merged[name] = trimmed;
  }

  const lines = Object.entries(merged)
    .filter(([, value]) => value.trim() !== '')
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  const themeComment =
    preset === null ? '' : `（基于预置主题「${preset.name}」）`;

  // 预置主题带配套暗色令牌组时生成真实暗色块；AI 暗色令牌并入且优先；
  // 两者皆无则保留注释骨架引导
  const darkTokens = { ...(preset?.darkTokens ?? {}), ...darkOverrides };
  const darkBlock =
    Object.keys(darkTokens).length > 0
      ? `[data-pactor-theme='dark'] {
  color-scheme: dark;
${Object.entries(darkTokens)
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}
}
`
      : `/* 可选：暗色皮肤骨架。取消注释并按需覆盖暗色令牌；
   未提供的令牌回退到内置暗色皮肤。
[data-pactor-theme='dark'] {
  color-scheme: dark;
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
*/
`;

  return `/**
 * pactor 皮肤文件 —— 由 Theme Studio 生成${themeComment}
 * 用法：在 \`@pactor-app/ui/styles.css\` 之后加载本文件（后加载者胜出）。
 */
:root:not([data-pactor-theme='dark']) {
  color-scheme: light;
${lines}
}

${darkBlock}`;
}
