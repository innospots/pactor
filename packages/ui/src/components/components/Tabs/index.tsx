import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../ui/tabs.js';

/** Tabs 页签定义；`children` 为 DSL 子树，经 Renderer children 机制渲染 */
export interface TabItem {
  key: string;
  label: string;
  children?: DslNode[];
  /**
   * 页签栏右端扩展区（DSL 子树列表，如区块操作按钮——与 Card.extra
   * 同构）。渲染当前激活页签的 extra：受控 activeKey 跟随切换，
   * 非受控取首项（单页签 Tabs 恒渲染）；tabPosition=left 竖排时
   * 不渲染（右端槽位无落点）
   */
  extra?: DslNode[];
  /** 该页签内容区 class（与 Tabs 的 contentClassName 合并，此项在后） */
  className?: string;
  /** 该页签内容区内联样式（同 className 的合并规则） */
  style?: CSSProperties;
}

export interface TabsProps {
  items?: TabItem[];
  /** 当前激活页签 key（可绑表达式） */
  activeKey?: string;
  /** 页签栏样式：default 胶囊（缺省）/ line 下划线 */
  variant?: 'default' | 'line';
  /** 页签位置：top 顶部（缺省）/ left 左侧竖排（子 Tab 较多或左侧需放摘要时用） */
  tabPosition?: 'top' | 'left';
  /** 页签切换事件，传出新激活的 key */
  onChange?: (key: string) => void;
  /** 页签内容区 class（TabsContent 根节点，与内置样式合并；内间距
   *  由消费方按需传入，如 p-4） */
  contentClassName?: string;
  /** 页签内容区内联样式（同 contentClassName 的挂载规则） */
  contentStyle?: CSSProperties;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Tabs 容器（shadcn kit，语义对齐 antd 版）：
 * 基于 vendored shadcn Tabs（@base-ui/react），每个 pane 的内容经
 * renderChildren 渲染；未传 activeKey 时缺省激活第一个页签。
 */
export function Tabs({
  items = [],
  activeKey,
  variant,
  tabPosition = 'top',
  onChange,
  contentClassName,
  contentStyle,
  className,
  style,
}: TabsProps) {
  const { renderChildren } = useRenderer();
  const vertical = tabPosition === 'left';
  // 页签栏右端扩展区：当前激活项（受控 activeKey / 非受控首项）的 extra
  const activeItem =
    items.find((item) => item.key === (activeKey ?? items[0]?.key)) ?? items[0];
  const tabList = (
    <TabsList
      variant={variant}
      className={
        vertical
          ? cn(
              'h-auto w-auto shrink-0 flex-col items-stretch justify-start',
              variant === 'line' && 'gap-0 border-b-0 border-r pr-2',
            )
          : undefined
      }
    >
      {items.map((item) => (
        <TabsTrigger
          key={item.key}
          value={item.key}
          // 胶囊变体挂专用手写类（styles.css 中 .pactor-tabs-pill）：
          // 消费方多层样式叠加 / 全局 button cursor 重置会击败 tailwind
          // 的 .cursor-pointer 工具类，专用类保证胶囊页签恒显手型
          className={variant === 'line' ? undefined : 'pactor-tabs-pill'}
        >
          {item.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
  return (
    <ShadcnTabs
      value={activeKey}
      defaultValue={activeKey === undefined ? items[0]?.key : undefined}
      onValueChange={(key) => onChange?.(key)}
      orientation={vertical ? 'vertical' : undefined}
      className={cn(vertical && 'flex-row items-start gap-4', className)}
      style={style}
    >
      {vertical ? (
        tabList
      ) : (
        <div className="flex items-center justify-between gap-2">
          {tabList}
          {activeItem?.extra !== undefined && activeItem.extra.length > 0 && (
            <div
              data-slot="tabs-extra"
              className="flex shrink-0 items-center justify-end gap-2"
            >
              {renderChildren(activeItem.extra)}
            </div>
          )}
        </div>
      )}
      {items.map((item) => (
        <TabsContent
          key={item.key}
          value={item.key}
          className={cn(vertical && 'flex-1', contentClassName, item.className)}
          style={{ ...contentStyle, ...item.style }}
        >
          {renderChildren(item.children)}
        </TabsContent>
      ))}
    </ShadcnTabs>
  );
}
