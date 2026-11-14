import {
  applyTheme,
  isThemeName,
  THEME_ATTR,
  THEME_REQUESTED_ATTR,
  THEME_STYLE_ATTR,
  type ThemeName,
} from '@pactor-app/theme';

export const SHELL_SKIN_STORAGE_KEY = 'pactor.theme';
export const SHELL_MODE_STORAGE_KEY = 'pactor.mode';
export const SHELL_PREFERENCES_EVENT = 'pactor-shell:preferences-change';

export type ShellMode = 'light' | 'dark' | 'system';

/**
 * 解析持久化皮肤：合法内置皮肤名原样返回；非法/空值回退 defaultSkin，
 * 未提供 defaultSkin 时返回 null（表示「宿主基础皮肤」，不注入任何皮肤样式）。
 */
export function resolveShellSkin(
  value: string | null | undefined,
  defaultSkin?: ThemeName,
): ThemeName | null {
  if (isThemeName(value)) return value;
  return defaultSkin ?? null;
}

export function readStoredShellSkin(
  storageKey: string = SHELL_SKIN_STORAGE_KEY,
): string | null {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function dispatchPreferencesChange(): void {
  window.dispatchEvent(new Event(SHELL_PREFERENCES_EVENT));
}

/** 选择皮肤：写存储 + 派发偏好事件；实际样式应用由监听方（SkinSwitcher effect）执行。 */
export function selectShellSkin(
  skin: ThemeName,
  storageKey: string = SHELL_SKIN_STORAGE_KEY,
): void {
  try {
    localStorage.setItem(storageKey, skin);
  } catch {
    // 隐私模式 / 存储被禁用：换肤仍生效，只是不持久化
  }
  dispatchPreferencesChange();
}

/** 清除皮肤覆盖，回到宿主基础皮肤（移除注入的 <style>、首屏 <link> 与 html 属性）。 */
export function clearShellSkin(
  storageKey: string = SHELL_SKIN_STORAGE_KEY,
): void {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // 同上：忽略存储异常
  }
  document.querySelector(`style[${THEME_STYLE_ATTR}]`)?.remove();
  document.querySelectorAll(`link[${THEME_ATTR}]`).forEach((link) => link.remove());
  document.documentElement.removeAttribute(THEME_ATTR);
  document.documentElement.removeAttribute(THEME_REQUESTED_ATTR);
  dispatchPreferencesChange();
}

/**
 * 应用皮肤：先写 data-requested-skin（首屏脚本与运行时共用的「目标皮肤」标记），
 * 运行时由主题包懒加载 CSS 注入 <style>；成功后移除首屏 <link data-pactor-skin>，
 * 避免同一皮肤的双份 CSS。加载失败保留首屏 link，下一次切换会重试。
 */
export async function applyShellSkin(
  skin: ThemeName,
  storageKey: string = SHELL_SKIN_STORAGE_KEY,
): Promise<void> {
  document.documentElement.setAttribute(THEME_REQUESTED_ATTR, skin);
  try {
    await applyTheme(skin, { storageKey, persist: false });
    document
      .querySelectorAll(`link[${THEME_ATTR}]`)
      .forEach((link) => link.remove());
  } catch {
    // 主题 chunk 加载失败：保留首屏 link
  }
}

export function readShellMode(
  modeStorageKey: string = SHELL_MODE_STORAGE_KEY,
): ShellMode {
  try {
    const mode = localStorage.getItem(modeStorageKey);
    return mode === 'light' || mode === 'dark' ? mode : 'system';
  } catch {
    return 'system';
  }
}

/** 应用外观模式：dark 或 system+系统深色 → <html data-pactor-theme="dark">。 */
export function applyShellMode(mode: ShellMode, systemDark: boolean): void {
  const dark = mode === 'dark' || (mode === 'system' && systemDark);
  if (dark) {
    document.documentElement.setAttribute('data-pactor-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-pactor-theme');
  }
}

export function selectShellMode(
  mode: ShellMode,
  modeStorageKey: string = SHELL_MODE_STORAGE_KEY,
): void {
  try {
    localStorage.setItem(modeStorageKey, mode);
  } catch {
    // 忽略存储异常
  }
  dispatchPreferencesChange();
}
