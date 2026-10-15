import {
  Check,
  CircleQuestionMark,
  Copy,
  Menu,
  Minus,
  Pause,
  Play,
  Plus,
  X,
  type LucideIcon,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils.js';

/**
 * 预设图标对白名单（lucide-react 静态导入，可 tree-shake）。
 * a/b 为受控两态对应的图标组件；未知名对走占位渲染，不抛错。
 */
const MORPH_PAIRS: Record<string, { a: LucideIcon; b: LucideIcon }> = {
  'menu-close': { a: Menu, b: X },
  'play-pause': { a: Play, b: Pause },
  'copy-check': { a: Copy, b: Check },
  'plus-minus': { a: Plus, b: Minus },
};

export type IconMorphPreset = keyof typeof MORPH_PAIRS;

export interface IconMorphProps {
  /** 预设图标对名（menu-close / play-pause / copy-check / plus-minus） */
  morph: IconMorphPreset | (string & {});
  /** 受控状态：'a' 显示对中首图标，'b' 显示次图标 */
  state: 'a' | 'b';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: React.CSSProperties;
}

/**
 * IconMorph 图标形变：扩展按钮组件，交互设计参考 arc-library
 * （https://github.com/kuratlielia/arc-library），Tailwind 实现。
 * 双图层绝对定位堆叠，受控 `state` 切换时一层 rotate+scale+fade 出、
 * 另一层入（transition-all，motion-reduce 降级为无过渡直切）；
 * 未知名对渲染占位图标（CircleQuestionMark，标 data-unknown）并 dev 告警。
 */
function IconMorph({ morph, state, className, style }: IconMorphProps) {
  const pair = MORPH_PAIRS[morph];

  if (!pair) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `[IconMorph] 未知预设图标对 "${morph}"，已渲染占位图标。可用值：${Object.keys(MORPH_PAIRS).join(' / ')}`,
      );
    }
    return (
      <span
        data-slot="icon-morph"
        data-unknown={morph}
        className={cn('relative inline-flex size-4 shrink-0', className)}
        style={style}
        aria-hidden="true"
      >
        <CircleQuestionMark className="size-full" />
      </span>
    );
  }

  const layers: { key: 'a' | 'b'; Icon: LucideIcon }[] = [
    { key: 'a', Icon: pair.a },
    { key: 'b', Icon: pair.b },
  ];

  return (
    <span
      data-slot="icon-morph"
      data-state={state}
      className={cn('relative inline-flex size-4 shrink-0', className)}
      style={style}
      aria-hidden="true"
    >
      {layers.map(({ key, Icon }) => {
        const active = state === key;
        return (
          <Icon
            key={key}
            data-state={active ? 'active' : 'inactive'}
            className={cn(
              'absolute inset-0 size-full transition-all duration-200 ease-out motion-reduce:transition-none',
              active
                ? 'rotate-0 scale-100 opacity-100'
                : 'scale-50 opacity-0',
              !active && (key === 'a' ? '-rotate-90' : 'rotate-90'),
            )}
          />
        );
      })}
    </span>
  );
}

export { IconMorph, MORPH_PAIRS };
