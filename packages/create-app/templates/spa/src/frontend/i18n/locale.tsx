import { useEffect, useState } from "react";

export type Locale = "zh-CN" | "en-US";
const supported = (value: string | null): value is Locale => value === "zh-CN" || value === "en-US";

export function useLocale() {
  const [locale, setLocale] = useState<Locale | null>(null);
  useEffect(() => {
    const query = new URL(window.location.href).searchParams.get("locale");
    const saved = localStorage.getItem("pactor.example.locale");
    const next = supported(query) ? query : supported(saved) ? saved : navigator.language.toLowerCase().startsWith("en") ? "en-US" : "zh-CN";
    document.documentElement.lang = next;
    setLocale(next);
  }, []);
  function changeLocale(next: string) {
    if (!supported(next)) return;
    localStorage.setItem("pactor.example.locale", next);
    const url = new URL(window.location.href);
    url.searchParams.set("locale", next);
    window.history.replaceState(window.history.state, "", url);
    document.documentElement.lang = next;
    setLocale(next);
  }
  return { locale, changeLocale };
}

export function LocaleSelector({ locale, onChange }: { locale: Locale; onChange: (value: string) => void }) {
  return (
    <label style={{ position: "fixed", right: 12, bottom: 12, zIndex: 50, padding: "6px 10px", borderRadius: 6, background: "var(--background, white)", border: "1px solid var(--border, #ccc)" }}>
      <select aria-label={locale === "en-US" ? "Language" : "语言"} value={locale} onChange={(event) => onChange(event.target.value)}>
        <option value="zh-CN">中文</option>
        <option value="en-US">English</option>
      </select>
    </label>
  );
}
