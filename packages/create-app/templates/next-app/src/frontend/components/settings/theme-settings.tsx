"use client";

import { useSyncExternalStore } from "react";
import { Check } from "lucide-react";
import { DEFAULT_SKIN, PREFERENCES_CHANGE_EVENT, resolveSkin, selectSkin, SKINS, SKIN_STORAGE_KEY } from "../../skin";
import { themeText } from "../../themes";
import { useHostI18n } from "../../i18n/messages";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(PREFERENCES_CHANGE_EVENT, onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener(PREFERENCES_CHANGE_EVENT, onChange); };
}
function snapshot() { return resolveSkin(localStorage.getItem(SKIN_STORAGE_KEY)); }

export function ThemeGallery() {
  const selected = useSyncExternalStore(subscribe, snapshot, () => DEFAULT_SKIN);
  const { locale, t } = useHostI18n();
  return <div className="theme-grid">{SKINS.map((theme) => {
      const text = themeText(theme, locale);
      return <button type="button" key={theme.value} className={`theme-card${selected === theme.value ? " is-selected" : ""}`} onClick={() => selectSkin(theme.value)} aria-pressed={selected === theme.value}>
        <div className="theme-preview" style={{ backgroundColor: theme.color }}><div className="theme-preview-window"><span style={{ backgroundColor: theme.color }} /><div><i /><i /><i /></div></div>{selected === theme.value && <span className="theme-selected"><Check size={14} aria-hidden="true" /> {t("theme.applied")}</span>}</div>
        <div className="theme-card-body"><div><strong>{text.label}</strong><p>{text.family} · {text.source}</p></div><span className="theme-hex">{theme.color}</span></div>
      </button>;
    })}</div>;
}

// Keep cached pages from older versions usable until their DSL is refreshed.
export function ThemeSettings() {
  const { t } = useHostI18n();
  return <div className="theme-page"><div className="kb-heading"><div><h1>{t("theme.title")}</h1><p>{t("theme.subtitle")}</p></div></div><div className="theme-section-heading"><div><h2>{t("theme.sectionTitle")}</h2><p>{t("theme.sectionDescription")}</p></div><span>{t("theme.count")}</span></div><ThemeGallery /></div>;
}
