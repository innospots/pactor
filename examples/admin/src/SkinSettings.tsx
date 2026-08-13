/**
 * SkinSettings（pactor-app headerExtra 槽位）：头部「皮肤」按钮 → 下拉面板
 * （主色预设 / 暗黑开关 / 圆角滑杆 / 恢复默认）。
 *
 * Radix kit 没有设置面板类组件，面板用原生控件 + `.pcr-*` token 内联样式
 * 拼装；皮肤应用走 DOM 属性/CSS 变量（见 skin.ts），无需刷新即时生效。
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { ACCENT_PRESETS, DEFAULT_SKIN, getSkin, setSkin, subscribeSkin } from './skin';

export function SkinSettings() {
  const [open, setOpen] = useState(false);
  const skin = useSyncExternalStore(subscribeSkin, getSkin);
  const rootRef = useRef<HTMLDivElement>(null);

  // 点击面板外关闭
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label="皮肤设置"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        style={{
          border: 'none',
          borderRadius: 'var(--pcr-radius-sm)',
          background: open ? 'rgb(255 255 255 / 0.18)' : 'transparent',
          color: 'inherit',
          padding: '4px 10px',
          cursor: 'pointer',
          fontSize: 'var(--pcr-font-size-sm)',
        }}
      >
        皮肤
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="皮肤设置"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 1000,
            width: 260,
            padding: 16,
            borderRadius: 'var(--pcr-radius-md)',
            border: '1px solid var(--pcr-border-subtle)',
            background: 'var(--pcr-bg-elevated)',
            boxShadow: 'var(--pcr-shadow-lg)',
            color: 'var(--pcr-fg)',
            fontSize: 'var(--pcr-font-size-sm)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>主色</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.key}
                type="button"
                aria-label={`主色 ${preset.label}`}
                title={preset.label}
                onClick={() => setSkin({ accent: preset.key })}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--pcr-radius-sm)',
                  backgroundColor: preset.color,
                  cursor: 'pointer',
                  border:
                    skin.accent === preset.key
                      ? '2px solid var(--pcr-fg)'
                      : '2px solid transparent',
                }}
              />
            ))}
          </div>

          <div style={{ fontWeight: 600, margin: '16px 0 8px' }}>暗黑模式</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={skin.dark}
              onChange={(event) => setSkin({ dark: event.target.checked })}
            />
            暗色皮肤（data-pactor-theme）
          </label>

          <div style={{ fontWeight: 600, margin: '16px 0 8px' }}>圆角</div>
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={skin.radius}
            aria-label="圆角"
            style={{ width: '100%' }}
            onChange={(event) => setSkin({ radius: Number(event.target.value) })}
          />

          <button
            type="button"
            onClick={() => setSkin({ ...DEFAULT_SKIN })}
            style={{
              marginTop: 16,
              width: '100%',
              padding: '6px 0',
              borderRadius: 'var(--pcr-radius-sm)',
              border: '1px solid var(--pcr-border)',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            恢复默认
          </button>
        </div>
      )}
    </div>
  );
}
