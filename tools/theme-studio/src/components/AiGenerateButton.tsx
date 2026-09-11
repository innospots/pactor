/**
 * AiGenerateButton（DSL 自定义组件，spec: theme-studio-ai-generate /
 * AI 生成入口与滑层）：Header 右端入口，点击打开 AI 生成滑层。
 */
import { type CSSProperties } from 'react';

import { setAiDrawerOpen } from '../store';

export function AiGenerateButton({ style }: { style?: CSSProperties }) {
  return (
    <button
      type="button"
      onClick={() => setAiDrawerOpen(true)}
      style={{
        padding: '4px 12px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--foreground)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        flexShrink: 0,
        ...style,
      }}
    >
      ✨ AI 生成
    </button>
  );
}
