import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';

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
import { SkinCardGrid } from './SkinGallery.js';

export interface SkinSwitcherProps {
  /** 可选皮肤名单，缺省主题包全部预置 */
  skins?: ThemeName[];
  /** 无持久化值时的缺省皮肤（应与 SkinHeadScript 的 defaultSkin 一致） */
  defaultSkin?: ThemeName;
  /** 画廊首卡提供「默认皮肤」（清除覆盖，回到宿主基础皮肤），缺省 false */
  allowDefault?: boolean;
  /** 皮肤持久化键，缺省 pactor.theme */
  storageKey?: string;
  /** 外观模式持久化键，缺省 pactor.mode */
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

function PaletteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

/**
 * 皮肤切换器：侧栏/头部紧凑入口 + 弹层画廊。同时可作为 Pactor DSL 组件
 * 使用（PactorShellHost 自动注册为 `SkinSwitcher`，布局 YAML 以
 * `type: SkinSwitcher` 引用，DSL props 与本组件 props 同名）。
 */
export function SkinSwitcher({
  skins,
  defaultSkin,
  allowDefault = false,
  storageKey = SHELL_SKIN_STORAGE_KEY,
  modeStorageKey = SHELL_MODE_STORAGE_KEY,
  locale = 'zh-CN',
  onChange,
}: SkinSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<{ left: number; bottom: number; maxHeight: number }>();

  // 弹层经 portal 挂到 body：侧栏（fixed + z-index）是层叠上下文，
  // 行内 absolute 弹层会被内容区 sticky header（z-index 更高）遮挡。
  const toggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const width = Math.min(560, window.innerWidth - 48);
      setAnchor({
        left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 16)),
        bottom: window.innerHeight - rect.top + 8,
        maxHeight: Math.max(160, rect.top - 24),
      });
    }
    setOpen(!open);
  };

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

  // 皮肤落地：运行时 <style> 替换首屏 <link>（宿主基础皮肤 selected=null 时不动）
  useEffect(() => {
    if (selected !== null) void applyShellSkin(selected, storageKey);
  }, [selected, storageKey]);

  // 外观模式落地：data-pactor-theme="dark"
  useEffect(() => {
    applyShellMode(mode, systemDark);
  }, [mode, systemDark]);

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    const keyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keyboard);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', keyboard);
    };
  }, [open]);

  const currentLabel =
    selected === null
      ? '默认皮肤'
      : themeText(THEMES.find((t) => t.name === selected)!, locale).label;

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
    <div ref={ref} className="pactor-shell-skin">
      <button
        type="button"
        ref={triggerRef}
        className="pactor-shell-skin-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`皮肤设置：${currentLabel}`}
        onClick={toggle}
      >
        <PaletteIcon />
        <span className="pactor-shell-skin-label">{currentLabel}</span>
      </button>
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="pactor-shell-skin-popover"
            role="dialog"
            aria-label="皮肤设置"
            style={anchor}
          >
          <div className="pactor-shell-skin-section">
            <div className="pactor-shell-skin-heading">外观模式</div>
            <div className="pactor-shell-mode" role="group" aria-label="外观模式">
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
          </div>
          <div className="pactor-shell-skin-section">
            <div className="pactor-shell-skin-heading">皮肤</div>
            <SkinCardGrid
              skins={skins}
              selected={selected}
              allowDefault={allowDefault}
              locale={locale}
              onPick={pick}
            />
          </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
