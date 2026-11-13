import {
  THEMES,
  applyTheme,
  isThemeName,
  themeText,
  type ThemeName,
} from "@pactor-app/theme";

export const SKIN_STORAGE_KEY = "mc-skin";
export const PREFERENCES_CHANGE_EVENT = "pactor-preferences-change";

export const SKINS = THEMES;
export type SkinValue = ThemeName;

/** Starter 默认皮肤；主题包默认是 qing-hui，这里保持青冥深蓝。 */
export const DEFAULT_SKIN = "qing-ming" as const satisfies SkinValue;

export { themeText };

export function resolveSkin(skin: string | null | undefined): SkinValue {
  return isThemeName(skin) ? skin : DEFAULT_SKIN;
}

export function selectSkin(skin: SkinValue): void {
  localStorage.setItem(SKIN_STORAGE_KEY, skin);
  window.dispatchEvent(new Event(PREFERENCES_CHANGE_EVENT));
}

/**
 * 应用皮肤：运行时由主题包懒加载并注入 <style>；首屏 link 在 layout.tsx
 * 的内联脚本中预置，应用成功后移除，避免同一皮肤的双份 CSS。
 */
export async function applySkinStylesheet(skin: string): Promise<void> {
  const nextSkin = resolveSkin(skin);
  document.documentElement.dataset.requestedSkin = nextSkin;
  try {
    await applyTheme(nextSkin, {
      storageKey: SKIN_STORAGE_KEY,
      persist: false,
    });
    document
      .querySelectorAll("link[data-pactor-skin]")
      .forEach((link) => link.remove());
  } catch {
    // 主题 chunk 加载失败时保留首屏 link，下一次切换会重试。
  }
}
