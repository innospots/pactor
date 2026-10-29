import { THEMES } from "./themes";

export const SKIN_STORAGE_KEY = "mc-skin";
export const PREFERENCES_CHANGE_EVENT = "pactor-preferences-change";
export const SKINS = THEMES;
export type SkinValue = (typeof SKINS)[number]["value"];
export const DEFAULT_SKIN: SkinValue = "qing-ming";
export const DEFAULT_SKIN_OPTION = SKINS.find((option) => option.value === DEFAULT_SKIN)!;
export function resolveSkin(skin: string | null | undefined): SkinValue {
  return SKINS.find((option) => option.value === skin)?.value ?? DEFAULT_SKIN;
}
export function skinHref(skin: string): string { return `/themes/${resolveSkin(skin)}.css`; }
export function selectSkin(skin: SkinValue): void {
  localStorage.setItem(SKIN_STORAGE_KEY, skin);
  window.dispatchEvent(new Event(PREFERENCES_CHANGE_EVENT));
}
export function applySkinStylesheet(skin: string): void {
  const nextSkin = resolveSkin(skin);
  const href = skinHref(nextSkin);
  document.documentElement.dataset.requestedSkin = nextSkin;
  if (document.querySelector(`link[data-pactor-skin][href="${href}"]`)) return;
  const next = document.createElement("link");
  next.rel = "stylesheet";
  next.href = href;
  next.dataset.pactorSkin = nextSkin;
  next.onload = () => {
    if (document.documentElement.dataset.requestedSkin !== nextSkin) { next.remove(); return; }
    document.querySelectorAll("link[data-pactor-skin]").forEach((el) => { if (el !== next) el.remove(); });
  };
  next.onerror = () => next.remove();
  document.head.append(next);
}
