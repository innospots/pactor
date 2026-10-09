import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { useRowGutter } from '../Row/index.js';

/** 响应式断点（对齐 antd：xs <576，其余 min-width） */
const BREAKPOINTS = {
  xs: '(max-width: 575.98px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
} as const;

export type ColBreakpoint = keyof typeof BREAKPOINTS;

/** 响应式配置：number 简写 span；对象可配 span / offset / order / pull / push */
export type ColResponsiveValue =
  | number
  | {
      span?: number;
      offset?: number;
      order?: number;
      pull?: number;
      push?: number;
    };

export interface ColProps {
  /** 栅格占位（24 分栏），默认 24；0 隐藏 */
  span?: number;
  /** 左侧偏移栏数 */
  offset?: number;
  /** 排列顺序 */
  order?: number;
  /** 右移栏数（position relative + right%） */
  pull?: number;
  /** 左移栏数（position relative + left%） */
  push?: number;
  /** flex 布局值：string 原样；number 展开为 `0 0 ${n}px`（对齐 antd） */
  flex?: string | number;
  /** 响应式档位（断点语义同 antd：xs 为 <576 且仅配 xs 时全尺寸生效） */
  xs?: ColResponsiveValue;
  sm?: ColResponsiveValue;
  md?: ColResponsiveValue;
  lg?: ColResponsiveValue;
  xl?: ColResponsiveValue;
  xxl?: ColResponsiveValue;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式（与栅格样式合并，同键后者优先） */
  style?: CSSProperties;
  children?: ReactNode;
}

const clamp = (v: number) => Math.min(Math.max(v, 0), 24);

/** 已注入的响应式类名（构建期/服务端不注入，仅客户端补 style 标签） */
const injected = new Set<string>();

function injectMediaClass(
  bp: ColBreakpoint,
  field: string,
  raw: string | number,
  css: string,
): string {
  const safe = String(raw).replace(/[^a-zA-Z0-9]/g, '-');
  const cls = `pactor-col-${bp}-${field}-${safe}`;
  if (injected.has(cls)) return cls;
  injected.add(cls);
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.setAttribute('data-pactor-col', '');
    style.textContent = `@media ${BREAKPOINTS[bp]}{.${cls}{${css} !important}}`;
    document.head.appendChild(style);
  }
  return cls;
}

function responsiveClasses(bp: ColBreakpoint, value: ColResponsiveValue | undefined): string[] {
  if (value === undefined) return [];
  const v = typeof value === 'number' ? { span: value } : value;
  const classes: string[] = [];
  if (v.span !== undefined) {
    classes.push(
      injectMediaClass(
        bp,
        'span',
        v.span,
        v.span === 0 ? 'display:none' : `width:${(clamp(v.span) / 24) * 100}%`,
      ),
    );
  }
  if (v.offset !== undefined) {
    classes.push(injectMediaClass(bp, 'offset', v.offset, `margin-left:${(clamp(v.offset) / 24) * 100}%`));
  }
  if (v.order !== undefined) {
    classes.push(injectMediaClass(bp, 'order', v.order, `order:${v.order}`));
  }
  if (v.pull !== undefined) {
    classes.push(
      injectMediaClass(bp, 'pull', v.pull, `position:relative;right:${(clamp(v.pull) / 24) * 100}%`),
    );
  }
  if (v.push !== undefined) {
    classes.push(
      injectMediaClass(bp, 'push', v.push, `position:relative;left:${(clamp(v.push) / 24) * 100}%`),
    );
  }
  return classes;
}

/**
 * Col 栅格列（对齐 antd Grid.Col）：24 分栏 span / offset / order / pull / push /
 * flex，及 xs~xxl 响应式档位。与 Row 搭配时读取 gutter 对半拆分为 padding；
 * 响应式样式经客户端注入的 style 标签实现（!important 覆盖基础内联样式）。
 */
export function Col({
  span,
  offset,
  order,
  pull,
  push,
  flex,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  className,
  style,
  children,
}: ColProps) {
  const [gutterH, gutterV] = useRowGutter();

  const base: CSSProperties = { ...style };
  if (span !== undefined) {
    if (span === 0) base.display = 'none';
    else base.width = `${(clamp(span) / 24) * 100}%`;
  }
  if (offset !== undefined) base.marginLeft = `${(clamp(offset) / 24) * 100}%`;
  if (order !== undefined) base.order = order;
  if (pull !== undefined || push !== undefined) {
    base.position = 'relative';
    if (pull !== undefined) base.right = `${(clamp(pull) / 24) * 100}%`;
    if (push !== undefined) base.left = `${(clamp(push) / 24) * 100}%`;
  }
  if (flex !== undefined) {
    base.flex = typeof flex === 'number' ? `0 0 ${flex}px` : flex;
  }
  if (gutterH || gutterV) {
    base.padding = `${gutterV / 2}px ${gutterH / 2}px`;
  }

  const responsive = [
    ...responsiveClasses('xs', xs),
    ...responsiveClasses('sm', sm),
    ...responsiveClasses('md', md),
    ...responsiveClasses('lg', lg),
    ...responsiveClasses('xl', xl),
    ...responsiveClasses('xxl', xxl),
  ];

  return (
    <div data-slot="col" className={cn('min-w-0', className, responsive)} style={base}>
      {children}
    </div>
  );
}
