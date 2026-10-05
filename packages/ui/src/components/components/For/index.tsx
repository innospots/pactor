import { Fragment, type CSSProperties } from 'react';

import type { DslChildren } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';

import { cn } from '../../../lib/utils.js';

export interface ForProps {
  /** 循环数据源（表达式解析后的数组）；非数组时不渲染 */
  items?: unknown[];
  /** 行唯一键字段（React key）；缺省按下标 */
  keyField?: string;
  /**
   * 网格列数：设置后由 For 承担网格容器（每行包一层 grid-item），
   * 语义同 Grid。注意必须如此——Grid 按 React children 逐个包装单元格，
   * 循环体若作为 Grid 子节点会被整体当成一格。
   */
  columns?: number;
  /** 网格栏间距（px）；未指定时应用默认间距令牌 `--grid-gap` */
  gap?: number;
  /** 网格首格内容（DSL 子树），如列表页的「新建」静态卡 */
  before?: DslChildren;
  /** 通用：根节点 class（与内置样式合并；平铺模式无根节点，不生效） */
  className?: string;
  /** 通用：根节点内联样式（网格模式） */
  style?: CSSProperties;
  /** withScope 注入：原始 DSL children（行模板），不对外声明 */
  dslChildren?: DslChildren;
}

/**
 * For 循环渲染（shadcn kit）：对 items 逐项渲染 DSL children 模板。
 * 以 withScope 注册——原始 DSL children 以 dslChildren 传入，逐项经
 * useRenderer().renderChildren 渲染，作用域注入 `{ row, rowIndex }`
 * （与 Table cell 模板一致，设计决策 D4）。
 *
 * 不设 columns 时输出平铺 Fragment（排列由外层布局承担）；
 * 设置 columns 时自带网格容器（见 columns 注释）。
 */
export function For({
  items,
  keyField,
  columns,
  gap,
  before,
  className,
  style,
  dslChildren,
}: ForProps) {
  const { renderChildren } = useRenderer();
  const rows = Array.isArray(items) ? items : [];
  const keyOf = (item: unknown, index: number) => {
    const key =
      keyField && typeof item === 'object' && item !== null
        ? (item as Record<string, unknown>)[keyField]
        : undefined;
    return key === undefined || key === null ? index : String(key);
  };
  const renderRow = (item: unknown, index: number) =>
    renderChildren(dslChildren, { row: item, rowIndex: index });

  if (columns !== undefined) {
    const cols = Math.max(1, columns);
    return (
      <div
        data-slot="grid"
        data-columns={cols}
        className={cn('grid', gap === undefined && 'gap-(--grid-gap)', className)}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          ...(gap !== undefined ? { gap } : {}),
          ...style,
        }}
      >
        {before ? <div data-slot="grid-item">{renderChildren(before)}</div> : null}
        {rows.map((item, index) => (
          <div key={keyOf(item, index)} data-slot="grid-item">
            {renderRow(item, index)}
          </div>
        ))}
      </div>
    );
  }
  return (
    <>
      {rows.map((item, index) => (
        <Fragment key={keyOf(item, index)}>{renderRow(item, index)}</Fragment>
      ))}
    </>
  );
}
