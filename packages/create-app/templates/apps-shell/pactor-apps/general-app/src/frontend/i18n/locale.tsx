"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Locale = "zh-CN" | "en-US";
const LOCALE_CHANGE_EVENT = "pactor-locale-change";
const supported = (value: string | null | undefined): value is Locale =>
  value === "zh-CN" || value === "en-US";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCALE_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onChange);
  };
}

/** Read URL, cookie and browser preferences in one place. */
function readLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const urlLocale = new URL(window.location.href).searchParams.get("locale");
  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith("locale="))
    ?.slice(7);
  const saved = cookie ? decodeURIComponent(cookie) : undefined;
  return supported(urlLocale)
    ? urlLocale
    : supported(saved)
      ? saved
      : navigator.language.toLowerCase().startsWith("en")
        ? "en-US"
        : "zh-CN";
}

function getSnapshot(): Locale | null {
  const locale = readLocale();
  if (locale && document.documentElement.lang !== locale) {
    document.documentElement.lang = locale;
  }
  return locale;
}

function getServerSnapshot(): Locale | null {
  return null;
}

/** Keep one effective locale for the sitemap, lazy pages and built-in UI. */
export function useLocale() {
  const locale = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const changeLocale = useCallback((next: string) => {
    if (!supported(next)) return;
    document.cookie = `locale=${encodeURIComponent(next)}; Path=/; SameSite=Lax; Max-Age=31536000`;
    const url = new URL(window.location.href);
    url.searchParams.set("locale", next);
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);
  return { locale, changeLocale };
}
