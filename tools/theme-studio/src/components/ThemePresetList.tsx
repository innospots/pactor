/**
 * ThemePresetList（DSL 自定义组件）：预置主题列表——色板缩略 + 名称，
 * 点击即应用（写入模块级 store），当前主题高亮；含「默认（无主题）」项。
 */
import { useSyncExternalStore, type CSSProperties } from 'react';

import { SKIN_PRESETS } from '../presets';
import { getStudioState, selectPreset, subscribeStudio } from '../store';

interface ThemePresetListProps {
  style?: CSSProperties;
}

export function ThemePresetList({ style }: ThemePresetListProps) {
  const { presetKey } = useSyncExternalStore(subscribeStudio, getStudioState);

  const renderItem = (
    key: string | null,
    name: string,
    description: string,
    swatches: string[],
  ) => {
    const active = presetKey === key;
    return (
      <button
        key={key ?? '__default__'}
        type="button"
        aria-pressed={active}
        onClick={() => selectPreset(key)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '8px 10px',
          borderRadius: 'var(--radius)',
          border: active
            ? '2px solid var(--primary)'
            : '1px solid var(--border)',
          background: active ? 'var(--accent)' : 'var(--card)',
          color: 'var(--card-foreground)',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: 13,
        }}
      >
        <span style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          {swatches.map((color) => (
            <span
              key={color}
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                backgroundColor: color,
                border: '1px solid var(--border)',
              }}
            />
          ))}
        </span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontWeight: 600 }}>{name}</span>
          <span
            style={{
              display: 'block',
              color: 'var(--muted-foreground)',
              fontSize: 12,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {description}
          </span>
        </span>
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {renderItem(null, '默认（无主题）', '不覆盖任何令牌，从零开始', [
        'oklch(0.205 0 0)',
        'oklch(0.97 0 0)',
        'oklch(0.708 0 0)',
      ])}
      {SKIN_PRESETS.map((preset) =>
        renderItem(preset.key, preset.name, preset.description, preset.swatches),
      )}
    </div>
  );
}
