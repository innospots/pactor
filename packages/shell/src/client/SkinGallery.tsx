import { useEffect, useSyncExternalStore } from 'react';

import { THEMES, themeText, type ThemeName } from '@pactor-app/theme';

import {
  applyShellMode,
  applyShellSkin,
  clearShellSkin,
  readShellMode,
  readStoredShellSkin,
  resolveShellSkin,
  selectShellMode,
  selectShellSkin,
  SHELL_MODE_STORAGE_KEY,
  SHELL_PREFERENCES_EVENT,
  SHELL_SKIN_STORAGE_KEY,
  type ShellMode,
} from './skin.js';

export interface SkinCardGridProps {
  /** 可选皮肤名单（已按 presets 过滤），缺省主题包全部预置 */
  skins?: ThemeName[];
  /** 当前选中皮肤；null 表示宿主基础皮肤 */
  selected: ThemeName | null;
  /** 首卡提供「默认皮肤」（回宿主基础皮肤） */
  allowDefault?: boolean;
  /** 皮肤名文案语言，缺省 zh-CN */
  locale?: string;
  onPick: (skin: ThemeName | null) => void;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** 皮肤卡片网格：SkinSwitcher 弹层与 SkinGallery 页面共用。 */
export function SkinCardGrid({
  skins,
  selected,
  allowDefault = false,
  locale = 'zh-CN',
  onPick,
}: SkinCardGridProps) {
  const list = THEMES.filter((t) => skins === undefined || skins.includes(t.name));
  return (
    <div className="pactor-shell-theme-grid">
      {allowDefault && (
        <button
          type="button"
          className={`pactor-shell-theme-card${selected === null ? ' is-selected' : ''}`}
          aria-pressed={selected === null}
          aria-label="默认皮肤"
          onClick={() => onPick(null)}
        >
          <div className="pactor-shell-theme-preview">
            <div className="pactor-shell-theme-preview-window">
              <span />
              <div><i /><i /><i /></div>
            </div>
            {selected === null && (
              <span className="pactor-shell-theme-selected"><CheckIcon /> 已应用</span>
            )}
          </div>
          <div className="pactor-shell-theme-card-body">
            <div><strong>默认皮肤</strong><p>宿主基础皮肤</p></div>
          </div>
        </button>
      )}
      {list.map((theme) => {
        const text = themeText(theme, locale);
        const active = selected === theme.name;
        return (
          <button
            key={theme.name}
            type="button"
            className={`pactor-shell-theme-card${active ? ' is-selected' : ''}`}
            aria-pressed={active}
            aria-label={text.label}
            onClick={() => onPick(theme.name)}
          >
            <div
              className="pactor-shell-theme-preview"
              style={{ backgroundColor: theme.color }}
            >
              <div className="pactor-shell-theme-preview-window">
                <span style={{ backgroundColor: theme.color }} />
                <div><i /><i /><i /></div>
              </div>
              {active && (
                <span className="pactor-shell-theme-selected"><CheckIcon /> 已应用</span>
              )}
            </div>
            <div className="pactor-shell-theme-card-body">
              <div>
                <strong>{text.label}</strong>
                <p>{text.family} · {text.source}</p>
              </div>
              <span className="pactor-shell-theme-hex">{theme.color}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export interface SkinGalleryProps {
  /** 页面标题，缺省「主题设置」 */
  title?: string;
  /** 副标题，缺省内置文案 */
  subtitle?: string;
  /** 区块标题，缺省「内置皮肤」 */
  sectionTitle?: string;
  /** 区块描述，缺省内置文案 */
  sectionDescription?: string;
  /** 可选皮肤名单，缺省主题包全部预置 */
  skins?: ThemeName[];
  /** 无持久化值时的缺省皮肤（应与 SkinHeadScript 的 defaultSkin 一致） */
  defaultSkin?: ThemeName;
  /** 画廊首卡提供「默认皮肤」（回宿主基础皮肤），缺省 false */
  allowDefault?: boolean;
  storageKey?: string;
  modeStorageKey?: string;
  /** 皮肤名文案语言，缺省 zh-CN */
  locale?: string;
  onChange?: (skin: ThemeName | null) => void;
}

const MODE_OPTIONS: { value: ShellMode; label: string }[] = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'system', label: '跟随系统' },
];

function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  window.addEventListener(SHELL_PREFERENCES_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(SHELL_PREFERENCES_EVENT, onChange);
  };
}

function subscribeSystemDark(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/**
 * 主题设置页画廊（移植自 starters/next-app-starter 的 ThemeGallery，去 host i18n）：
 * 页头 + 外观模式 + 皮肤卡片网格。同时作为 Pactor DSL 组件使用
 * （PactorShellHost 内建注册为 `SkinGallery`，默认 themes 页面以
 * `type: SkinGallery` 引用，DSL props 与本组件 props 同名）。
 */
export function SkinGallery({
  title = '主题设置',
  subtitle = '从内置配色中选择适合你的工作空间色彩。',
  sectionTitle = '内置皮肤',
  sectionDescription = '选用后立即应用，可同时切换浅色 / 深色外观模式。',
  skins,
  defaultSkin,
  allowDefault = false,
  storageKey = SHELL_SKIN_STORAGE_KEY,
  modeStorageKey = SHELL_MODE_STORAGE_KEY,
  locale = 'zh-CN',
  onChange,
}: SkinGalleryProps) {
  const stored = useSyncExternalStore(
    subscribe,
    () => readStoredShellSkin(storageKey),
    () => null,
  );
  const mode = useSyncExternalStore(
    subscribe,
    () => readShellMode(modeStorageKey),
    () => 'system' as ShellMode,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false,
  );

  const selected = resolveShellSkin(stored, defaultSkin);
  const list = THEMES.filter((t) => skins === undefined || skins.includes(t.name));

  useEffect(() => {
    if (selected !== null) void applyShellSkin(selected, storageKey);
  }, [selected, storageKey]);

  useEffect(() => {
    applyShellMode(mode, systemDark);
  }, [mode, systemDark]);

  const pick = (name: ThemeName | null) => {
    if (name === null) {
      clearShellSkin(storageKey);
      onChange?.(null);
    } else {
      selectShellSkin(name, storageKey);
      onChange?.(name);
    }
  };

  return (
    <div className="pactor-shell-gallery">
      <div className="pactor-shell-gallery-heading">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="pactor-shell-gallery-section">
        <div className="pactor-shell-gallery-section-head">
          <div>
            <h2>{sectionTitle}</h2>
            <p>{sectionDescription}</p>
          </div>
          <span>{list.length} 套主题</span>
        </div>
        <div
          className="pactor-shell-mode pactor-shell-gallery-mode"
          role="group"
          aria-label="外观模式"
        >
          {MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={mode === option.value}
              onClick={() => selectShellMode(option.value, modeStorageKey)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <SkinCardGrid
          skins={skins}
          selected={selected}
          allowDefault={allowDefault}
          locale={locale}
          onPick={pick}
        />
      </div>
    </div>
  );
}
