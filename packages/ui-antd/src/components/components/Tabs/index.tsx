import { Tabs as AntTabs } from 'antd';
import type { DslNode } from 'pactor-core';
import { useRenderer } from 'pactor-runtime';

/** Tabs 页签定义；`children` 为 DSL 子树，经 Renderer children 机制渲染 */
export interface TabItem {
  key: string;
  label: string;
  children?: DslNode[];
}

export interface TabsProps {
  items?: TabItem[];
  /** 当前激活页签 key（可绑表达式） */
  activeKey?: string;
  /** 页签切换事件，传出新激活的 key */
  onChange?: (key: string) => void;
}

/** Tabs 容器（设计决策 D5）：每个 pane 的内容经 renderChildren 渲染 */
export function Tabs({ items = [], activeKey, onChange }: TabsProps) {
  const { renderChildren } = useRenderer();
  return (
    <AntTabs
      activeKey={activeKey}
      onChange={(key) => onChange?.(key)}
      items={items.map((item) => ({
        key: item.key,
        label: item.label,
        children: renderChildren(item.children),
      }))}
    />
  );
}
