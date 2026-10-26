"use client";

/**
 * 宿主 locale 状态（与 ThemeSwitcher 的偏好模式同构）：
 * localStorage(pactor.locale) 持久化 + 自定义事件通知，App.tsx 经
 * useSyncExternalStore 订阅并传给 SitemapApp 的 locale prop；
 * app.setLocale 动作（src/pactor/actions.ts）经 setLocale 写入。
 *
 * translateHost 供 SitemapApp 之外的宿主视图（page-access 门禁等）
 * 直接按当前 locale 查业务语言包。
 */

import {
  DEFAULT_LOCALE,
  MESSAGES,
  SUPPORTED_LOCALES,
  type Locale,
  type MessageKey,
} from "./messages";

export const LOCALE_STORAGE_KEY = "pactor.locale";
const LOCALE_CHANGE_EVENT = "pactor-locale-change";

export function isSupportedLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

export function subscribeLocale(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCALE_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onChange);
  };
}

/** 客户端快照：非法持久化值回退默认语言 */
export function getLocaleSnapshot(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return isSupportedLocale(stored) ? stored : DEFAULT_LOCALE;
}

/** 服务端快照（SSR/水合一致）：恒为默认语言 */
export function getServerLocaleSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

/** 切换语言：持久化 + 同步 <html lang> + 通知订阅者（宿主重渲染） */
export function setLocale(locale: string): void {
  const next = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    // 持久化不可用（隐私模式等）：切换仍生效，仅不持久化
  }
  document.documentElement.lang = next;
  window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
}

/** 宿主侧文案翻译（{{name}} 插值，缺失 key 回退默认语言再回退 key 本身） */
export function translateHost(
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  // SSR 渲染期无 localStorage：与服务端快照一致回退默认语言
  const locale =
    typeof window === "undefined" ? DEFAULT_LOCALE : getLocaleSnapshot();
  const template = MESSAGES[locale][key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? key;
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (raw, name: string) =>
    params[name] !== undefined ? String(params[name]) : raw,
  );
}
