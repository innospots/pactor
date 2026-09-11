/**
 * TokenEditor（DSL 自定义组件）：分组以 Tab 切换列出全部可覆盖皮肤令牌
 * （语义令牌 + 组件级令牌，元数据见 ../tokens.ts）。
 *
 * color 型给原生 `<input type="color">` 取色器 + 文本框；数值型（length
 * 且带 slider 范围）给 ui Slider + 文本框；其余给文本输入。修改即写入
 * store overrides，实时叠加在当前预置主题之上并同步到预览；已修改项旁
 * 提供单项重置。空值 = 不覆盖（回退预置主题 / 默认令牌）。
 */
import { useMemo, useState, useSyncExternalStore, type CSSProperties } from 'react';

import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@pactor-app/ui/ui';

import { getPreset } from '../presets';
import {
  getStudioState,
  resetOverrides,
  setTokenOverride,
  subscribeStudio,
} from '../store';
import { resolveTokenColor } from '../resolve';
import { TOKEN_GROUPS, type TokenMeta } from '../tokens';

interface TokenEditorProps {
  style?: CSSProperties;
}

function TokenRow({ token }: { token: TokenMeta }) {
  const { presetKey, overrides } = useSyncExternalStore(
    subscribeStudio,
    getStudioState,
  );
  const presetValue = getPreset(presetKey)?.tokens[token.name] ?? '';
  const value = overrides[token.name] ?? presetValue;
  // 颜色令牌：无显式值时把 var()/oklch() 默认值解析为实际颜色显示
  // （文本框与取色器一致）。纯数据解析（有效值表 = 预置 ∪ overrides ∪
  // tokens.ts 默认值），与合成皮肤 CSS 同源——无 DOM 探针、无时序竞态
  const resolvedColor = useMemo(() => {
    if (token.type !== 'color') {
      return null;
    }
    const effective = { ...getPreset(presetKey)?.tokens, ...overrides };
    return resolveTokenColor(token.name, effective);
  }, [token.type, token.name, presetKey, overrides]);
  const textValue = token.type === 'color' && !value ? (resolvedColor ?? '') : value;

  // 数值型令牌（带 slider 元数据且当前值可解析为 <number><unit>）给滑杆
  const sliderValue = useMemo(() => {
    if (!token.slider) {
      return null;
    }
    const m = /^([\d.]+)(px|rem)$/.exec((value || token.defaultValue).trim());
    return m ? { num: Number(m[1]), unit: m[2]! } : null;
  }, [token.slider, token.defaultValue, value]);

  const modified = overrides[token.name] !== undefined;

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
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          minWidth: 0,
        }}
      >
        <code style={{ fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
          {token.description}
        </code>
        <span
          title={token.description}
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 11,
            color: 'var(--muted-foreground)',
          }}
        >
          {token.name}
        </span>
        {modified && (
          <>
            <button
              type="button"
              aria-label={`重置 ${token.name}`}
              title="重置为默认值"
              onClick={() => setTokenOverride(token.name, '')}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--muted-foreground)',
                cursor: 'pointer',
                fontSize: 12,
                padding: '0 2px',
                lineHeight: 1,
                marginRight: 4,
              }}
            >
              ↺ 重置
            </button>
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {token.type === 'color' && (
          <input
            type="color"
            aria-label={`${token.name} 取色器`}
            value={resolvedColor ?? '#cccccc'}
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
        {sliderValue && (
          <Slider
            aria-label={`${token.name} 滑杆`}
            value={sliderValue.num}
            min={token.slider!.min}
            max={token.slider!.max}
            step={token.slider!.step}
            onValueChange={(next) =>
              setTokenOverride(token.name, `${next}${sliderValue.unit}`)
            }
            style={{ width: 120, flexShrink: 0 }}
          >
            <SliderControl>
              <SliderTrack>
                <SliderIndicator />
              </SliderTrack>
              <SliderThumb />
            </SliderControl>
          </Slider>
        )}
        <input
          type="text"
          aria-label={token.name}
          value={textValue}
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
  const [activeGroup, setActiveGroup] = useState(TOKEN_GROUPS[0]!.key);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
          flexShrink: 0,
        }}
      >
        <span className="font-semibold">
          令牌编辑器
        </span>
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 12,
            color: 'var(--muted-foreground)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          已修改 {overrideCount} 项
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
          重置全部
        </button>
      </div>
      <Tabs
        value={activeGroup}
        onValueChange={(value) => setActiveGroup(String(value))}
        style={{ flex: 1, minHeight: 0 }}
      >
        {/* 分类 tab 固定在滚动区外 */}
        <TabsList
          className="flex h-auto w-full flex-none flex-wrap justify-start gap-1"
          style={{ height: 'auto', flexShrink: 0 }}
        >
          {TOKEN_GROUPS.map((group) => (
            <TabsTrigger
              key={group.key}
              value={group.key}
              className="flex-none px-2.5 py-1 text-xs"
            >
              {group.title.replace(/^组件级：/, '').replace(/（.*?）/g, '')}
            </TabsTrigger>
          ))}
        </TabsList>
        {TOKEN_GROUPS.map((group) => (
          <TabsContent
            key={group.key}
            value={group.key}
            style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}
          >
            {group.tokens.map((token) => (
              <TokenRow key={token.name} token={token} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
