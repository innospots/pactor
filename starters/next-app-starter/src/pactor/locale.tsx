"use client";

import { useEffect, useState } from "react";

export type Locale = "zh-CN" | "en-US";
const supported = (value: string | null | undefined): value is Locale => value === "zh-CN" || value === "en-US";

/** Keep one effective locale for the sitemap, lazy pages and built-in UI. */
export function useLocale() {
  const [locale, setLocale] = useState<Locale | null>(null);
  useEffect(() => {
    const urlLocale = new URL(window.location.href).searchParams.get("locale");
    const cookie = document.cookie.split("; ").find((part) => part.startsWith("locale="))?.slice(7);
    const saved = cookie ? decodeURIComponent(cookie) : undefined;
    const next = supported(urlLocale) ? urlLocale : supported(saved) ? saved : navigator.language.toLowerCase().startsWith("en") ? "en-US" : "zh-CN";
    document.documentElement.lang = next;
    setLocale(next);
  }, []);
  function changeLocale(next: string) {
    if (!supported(next)) return;
    document.cookie = `locale=${encodeURIComponent(next)}; Path=/; SameSite=Lax; Max-Age=31536000`;
    const url = new URL(window.location.href);
    url.searchParams.set("locale", next);
    window.history.replaceState(window.history.state, "", url);
    document.documentElement.lang = next;
    setLocale(next);
  }
  return { locale, changeLocale };
}

export function LocaleSelector({ locale, onChange }: { locale: Locale; onChange: (locale: string) => void }) {
  return (
    <label style={{ position: "fixed", right: 12, bottom: 12, zIndex: 50, padding: "6px 10px", borderRadius: 6, background: "var(--background, white)", border: "1px solid var(--border, #ccc)" }}>
      <span className="sr-only">{locale === "en-US" ? "Language" : "语言"}</span>
      <select aria-label={locale === "en-US" ? "Language" : "语言"} value={locale} onChange={(event) => onChange(event.target.value)}>
        <option value="zh-CN">中文</option>
        <option value="en-US">English</option>
      </select>
    </label>
  );
}
