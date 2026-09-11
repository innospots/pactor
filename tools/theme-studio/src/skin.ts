/**
 * 皮肤 CSS 合成（spec: theme-studio / 皮肤 CSS 生成与下载）。
 *
 * `composeSkinCss(preset, overrides)` 把「预置主题令牌 ∪ 用户修改」合成为
 * 一份皮肤 CSS 文本：`:root` 亮色覆盖块（overrides 优先于预置主题）；
 * 预置主题带 darkTokens 时同时生成真实 `[data-pactor-theme='dark']` 暗色块，
 * 否则附带注释掉的暗色骨架引导。预览（postMessage 注入
 * iframe）与下载（Blob 导出 pactor-theme.css）共用同一份文本，
 * 保证导出与预览严格一致。
 */
import type { SkinPreset } from './presets';

/** 合成皮肤 CSS 文本：`:root` 亮色覆盖块 + 暗色块（或注释骨架）；
 * darkOverrides（AI 生成的暗色令牌）并入暗色块且优先于预置主题 */
export function composeSkinCss(
  preset: SkinPreset | null,
  overrides: Record<string, string>,
  darkOverrides: Record<string, string> = {},
): string {
  const merged: Record<string, string> = { ...(preset?.tokens ?? {}) };
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
${Object.entries(darkTokens)
  .map(([name, value]) => `  ${name}: ${value};`)
  .join('\n')}
}
`
      : `/* 可选：暗色皮肤骨架。取消注释并按需覆盖暗色令牌；
   未提供的令牌回退到内置暗色皮肤。
[data-pactor-theme='dark'] {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
*/
`;

  return `/**
 * pactor 皮肤文件 —— 由 Theme Studio 生成${themeComment}
 * 用法：在 \`@pactor-app/ui/styles.css\` 之后加载本文件（后加载者胜出）。
 */
:root {
${lines}
}

${darkBlock}`;
}
