"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Icon } from "@pactor-app/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@pactor-app/ui/ui";
import {
  applySkinStylesheet,
  DEFAULT_SKIN,
  DEFAULT_SKIN_OPTION,
  resolveSkin,
  SKINS,
  SKIN_STORAGE_KEY,
  type SkinValue,
} from "../skin";

/**
 * 外壳 Header 右侧的皮肤切换器：
 * - 皮肤下拉：可用皮肤（色点 + 名称，当前项打勾），
 *   切换即换 <link data-pactor-skin> 皮肤样式表（app/skin.ts）并持久化
 *   localStorage(mc-skin)；
 * - 明暗切换：太阳/月亮按钮，写 `<html data-pactor-theme="dark">` 并
 *   持久化 localStorage(mc-mode)；缺省（system）跟随系统深浅色。
 * 首屏皮肤 link 与明暗属性由 layout.tsx 内联脚本预置，组件挂载后接管切换。
 */

type Mode = "light" | "dark" | "system";

const MODE_STORAGE_KEY = "mc-mode";
const PREFERENCES_CHANGE_EVENT = "pactor-preferences-change";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function subscribePreferences(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(PREFERENCES_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PREFERENCES_CHANGE_EVENT, onChange);
  };
}

function notifyPreferencesChanged() {
  window.dispatchEvent(new Event(PREFERENCES_CHANGE_EVENT));
}

function getSkinSnapshot(): SkinValue {
  return resolveSkin(localStorage.getItem(SKIN_STORAGE_KEY));
}

function getDefaultSkinSnapshot(): SkinValue {
  return DEFAULT_SKIN;
}

function getModeSnapshot(): Mode {
  return (localStorage.getItem(MODE_STORAGE_KEY) ?? "system") as Mode;
}

function getDefaultModeSnapshot(): Mode {
  return "system";
}

function subscribeSystemDark(onChange: () => void) {
  const media = window.matchMedia(DARK_MODE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSystemDarkSnapshot() {
  return window.matchMedia(DARK_MODE_QUERY).matches;
}

function getDefaultSystemDarkSnapshot() {
  return false;
}

function applyDark(dark: boolean) {
  const root = document.documentElement;
  if (dark) {
    root.setAttribute("data-pactor-theme", "dark");
  } else {
    root.removeAttribute("data-pactor-theme");
  }
}

const triggerClass =
  "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground outline-hidden cursor-pointer";

export function ThemeSwitcher() {
  const skin = useSyncExternalStore(
    subscribePreferences,
    getSkinSnapshot,
    getDefaultSkinSnapshot,
  );
  const mode = useSyncExternalStore(
    subscribePreferences,
    getModeSnapshot,
    getDefaultModeSnapshot,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    getSystemDarkSnapshot,
    getDefaultSystemDarkSnapshot,
  );
  const dark = mode === "dark" || (mode === "system" && systemDark);

  useEffect(() => {
    applySkinStylesheet(skin);
  }, [skin]);

  useEffect(() => {
    applyDark(dark);
  }, [dark]);

  const selectSkin = (value: SkinValue) => {
    localStorage.setItem(SKIN_STORAGE_KEY, value);
    notifyPreferencesChanged();
  };

  const toggleMode = () => {
    const next: Mode = dark ? "light" : "dark";
    localStorage.setItem(MODE_STORAGE_KEY, next);
    notifyPreferencesChanged();
  };

  const current = SKINS.find((s) => s.value === skin) ?? DEFAULT_SKIN_OPTION;

  return (
    <div data-slot="theme-switcher" className="ml-auto flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          data-slot="theme-switcher-trigger"
          className={triggerClass}
        >
          <span
            aria-hidden="true"
            className="size-3 rounded-full border border-black/10"
            style={{ backgroundColor: current.color }}
          />
          {current.label}
          <Icon name="chevron-down" size="sm" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {SKINS.map((s) => (
            <DropdownMenuItem
              key={s.value}
              className="cursor-pointer"
              onClick={() => selectSkin(s.value)}
            >
              <span
                aria-hidden="true"
                className="size-3 rounded-full border border-black/10"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
              {s.value === skin && (
                <Icon name="check" size="sm" className="ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        type="button"
        data-slot="theme-mode-toggle"
        aria-label={dark ? "切换为浅色" : "切换为深色"}
        className={triggerClass}
        onClick={toggleMode}
      >
        <Icon name={dark ? "sun" : "moon"} size="sm" />
      </button>
    </div>
  );
}
