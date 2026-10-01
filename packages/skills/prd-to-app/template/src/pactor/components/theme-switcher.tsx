"use client";

import { useEffect, useState } from "react";
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
  SKINS,
  SKIN_STORAGE_KEY,
} from "../skin";

/**
 * 外壳 Header 右侧的皮肤切换器：
 * - 皮肤下拉：三套 Theme Studio 皮肤（色点 + 名称，当前项打勾），
 *   切换即换 <link data-pactor-skin> 皮肤样式表（app/skin.ts）并持久化
 *   localStorage(mc-skin)；
 * - 明暗切换：太阳/月亮按钮，写 `<html data-pactor-theme="dark">` 并
 *   持久化 localStorage(mc-mode)；缺省（system）跟随系统深浅色。
 * 首屏皮肤 link 与明暗属性由 layout.tsx 内联脚本预置，组件挂载后接管切换。
 */

type SkinValue = (typeof SKINS)[number]["value"];
type Mode = "light" | "dark" | "system";

function isDarkMode(mode: Mode) {
  return (
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

function applyMode(mode: Mode) {
  const root = document.documentElement;
  const dark = isDarkMode(mode);
  if (dark) {
    root.setAttribute("data-pactor-theme", "dark");
  } else {
    root.removeAttribute("data-pactor-theme");
  }
  return dark;
}

const triggerClass =
  "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground outline-hidden cursor-pointer";

export function ThemeSwitcher() {
  const [skin, setSkin] = useState<SkinValue>(DEFAULT_SKIN);
  const [mode, setMode] = useState<Mode>("system");
  const [dark, setDark] = useState(false);

  // 挂载后读取持久化偏好并接管系统深浅色监听（mode 为 system 时）
  useEffect(() => {
    const savedSkin = (localStorage.getItem(SKIN_STORAGE_KEY) ??
      DEFAULT_SKIN) as SkinValue;
    const savedMode = (localStorage.getItem("mc-mode") ?? "system") as Mode;
    setSkin(savedSkin);
    setMode(savedMode);
    setDark(applyMode(savedMode));

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (savedMode === "system") setDark(applyMode("system"));
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const selectSkin = (value: SkinValue) => {
    setSkin(value);
    localStorage.setItem(SKIN_STORAGE_KEY, value);
    applySkinStylesheet(value);
  };

  const toggleMode = () => {
    const next: Mode = dark ? "light" : "dark";
    setMode(next);
    localStorage.setItem("mc-mode", next);
    setDark(applyMode(next));
  };

  const current = SKINS.find((s) => s.value === skin) ?? SKINS[0];

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
