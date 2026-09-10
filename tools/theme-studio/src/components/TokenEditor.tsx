/**
 * TokenEditor（DSL 自定义组件）：分组折叠列出全部可覆盖皮肤令牌
 * （语义令牌 + 组件级令牌，元数据见 ../tokens.ts）。
 *
 * color 型给原生 `<input type="color">` 取色器 + 文本框，其余（length /
 * font / image）给文本输入；修改即写入 store overrides，实时叠加在当前
 * 预置主题之上并同步到预览。空值 = 不覆盖（回退预置主题 / 默认令牌）。
 */
import { useSyncExternalStore, type CSSProperties } from 'react';

import { getPreset } from '../presets';
import {
  getStudioState,
  resetOverrides,
  setTokenOverride,
  subscribeStudio,
} from '../store';
import { TOKEN_GROUPS, type TokenMeta } from '../tokens';

interface TokenEditorProps {
  style?: CSSProperties;
}

/** 把任意 CSS 颜色尝试归一为 #rrggbb 供取色器显示；失败返回回退色 */
function toHexInputValue(value: string, fallback: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function TokenRow({ token }: { token: TokenMeta }) {
  const { presetKey, overrides } = useSyncExternalStore(
    subscribeStudio,
    getStudioState,
  );
  const presetValue = getPreset(presetKey)?.tokens[token.name] ?? '';
  const value = overrides[token.name] ?? presetValue;

  const inputStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: '4px 8px',
    borderRadius: 'calc(var(--radius) * 0.8)',
    border: '1px solid var(--input)',
    background: 'var(--background)',
    color: 'var(--foreground)',
    fontSize: 12,
    fontFamily: 'ui-monospace, monospace',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '6px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <code style={{ fontSize: 12, fontWeight: 600 }}>{token.name}</code>
        {overrides[token.name] !== undefined && (
          <span
            style={{
              fontSize: 11,
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              borderRadius: 999,
              padding: '0 6px',
            }}
          >
            已修改
          </span>
        )}
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
        {token.description}（默认：{token.defaultValue}）
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {token.type === 'color' && (
          <input
            type="color"
            aria-label={`${token.name} 取色器`}
            value={toHexInputValue(value, '#ffffff')}
            onChange={(event) => setTokenOverride(token.name, event.target.value)}
            style={{
              width: 32,
              height: 28,
              padding: 0,
              border: '1px solid var(--border)',
              borderRadius: 6,
              background: 'transparent',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
        )}
        <input
          type="text"
          aria-label={token.name}
          value={value}
          placeholder={presetValue || token.defaultValue}
          onChange={(event) => setTokenOverride(token.name, event.target.value)}
          style={inputStyle}
        />
      </div>
    </div>
  );
}

export function TokenEditor({ style }: TokenEditorProps) {
  const { overrides } = useSyncExternalStore(subscribeStudio, getStudioState);
  const overrideCount = Object.keys(overrides).length;

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
          单项修改 {overrideCount} 项（叠加在所选主题之上）
        </span>
        <button
          type="button"
          onClick={() => resetOverrides()}
          disabled={overrideCount === 0}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'transparent',
            color: 'inherit',
            padding: '2px 10px',
            fontSize: 12,
            cursor: overrideCount === 0 ? 'default' : 'pointer',
            opacity: overrideCount === 0 ? 0.5 : 1,
          }}
        >
          清除修改
        </button>
      </div>
      {TOKEN_GROUPS.map((group) => (
        <details
          key={group.key}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            marginBottom: 6,
            background: 'var(--card)',
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              padding: '8px 10px',
              fontSize: 13,
              fontWeight: 600,
              userSelect: 'none',
            }}
          >
            {group.title}（{group.tokens.length}）
          </summary>
          <div style={{ padding: '0 10px 8px' }}>
            {group.tokens.map((token) => (
              <TokenRow key={token.name} token={token} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
