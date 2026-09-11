/**
 * PreviewModeToggle：预览亮色/暗色切换，渲染在 SkinPreviewFrame 的
 * Tab 栏右端；模式存于模块级 store，SkinPreviewFrame 经 postMessage
 * 同步给 iframe 预览页。
 */
import { useSyncExternalStore, type CSSProperties } from 'react';

import { getStudioState, setMode, subscribeStudio } from '../store';

const buttonStyle = (active: boolean): CSSProperties => ({
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  background: active ? 'var(--primary)' : 'transparent',
  color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
  padding: '2px 12px',
  fontSize: 12,
  cursor: 'pointer',
});

export function PreviewModeToggle({ style }: { style?: CSSProperties }) {
  const { mode } = useSyncExternalStore(subscribeStudio, getStudioState);
  return (
    <div style={{ display: 'flex', gap: 6, ...style }}>
      <button
        type="button"
        aria-pressed={mode === 'light'}
        onClick={() => setMode('light')}
        style={buttonStyle(mode === 'light')}
      >
        亮色
      </button>
      <button
        type="button"
        aria-pressed={mode === 'dark'}
        onClick={() => setMode('dark')}
        style={buttonStyle(mode === 'dark')}
      >
        暗色
      </button>
    </div>
  );
}
