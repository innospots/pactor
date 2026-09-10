/**
 * 皮肤 CSS 合成（spec: theme-studio / 皮肤 CSS 生成与下载）。
 *
 * `composeSkinCss(preset, overrides)` 把「预置主题令牌 ∪ 用户修改」合成为
 * 一份 `:root` 覆盖块文本（overrides 优先于预置主题），附带注释掉的
 * `[data-pactor-theme='dark']` 暗色骨架引导。预览（postMessage 注入
 * iframe）与下载（Blob 导出 pactor-theme.css）共用同一份文本，
 * 保证导出与预览严格一致。
 */
import type { SkinPreset } from './presets';

/** 合成皮肤 CSS 文本：`:root` 覆盖块 + 注释掉的暗色骨架 */
export function composeSkinCss(
  preset: SkinPreset | null,
  overrides: Record<string, string>,
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

  return `/**
 * pactor 皮肤文件 —— 由 Theme Studio 生成${themeComment}
 * 用法：在 \`@pactor-app/ui/styles.css\` 之后加载本文件（后加载者胜出）。
 */
:root {
${lines}
}

/* 可选：暗色皮肤骨架。取消注释并按需覆盖暗色令牌；
   未提供的令牌回退到内置暗色皮肤。
[data-pactor-theme='dark'] {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
*/
`;
}
