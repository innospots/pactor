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
  /** 页签内容区 class（TabsContent 根节点，与内置样式合并） */
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
  return (
    <ShadcnTabs
      value={activeKey}
      defaultValue={activeKey === undefined ? items[0]?.key : undefined}
      onValueChange={(key) => onChange?.(key)}
      orientation={vertical ? 'vertical' : undefined}
      className={cn(vertical && 'flex-row items-start gap-4', className)}
      style={style}
    >
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
          <TabsTrigger key={item.key} value={item.key}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
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
