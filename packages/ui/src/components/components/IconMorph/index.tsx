import type { CSSProperties } from 'react';

import { IconMorph as ShadcnIconMorph } from '../../../ui/icon-morph.js';

export interface IconMorphProps {
  /** 预设图标对名：menu-close / play-pause / copy-check / plus-minus */
  morph: string;
  /** 受控状态：'a' 显示对中首图标，'b' 显示次图标 */
  state: 'a' | 'b';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * IconMorph 适配器（扩展按钮族）：图标形变。受控 state 由 DSL 状态
 * 表达式驱动（如 state="${state.collapsed ? 'a' : 'b'}"）；未知名对
 * 渲染占位图标并 dev 告警，不抛错（ui 层行为直接透传）。
 */
export function IconMorph({ morph, state, className, style }: IconMorphProps) {
  return (
    <ShadcnIconMorph
      morph={morph}
      state={state}
      className={className}
      style={style}
    />
  );
}
