import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import {
  Accordion as ShadcnAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../ui/accordion.js';

/** 手风琴面板；`children` 为 DSL 子树，经 Renderer children 机制渲染 */
export interface AccordionItemData {
  key: string;
  title: string;
  children?: DslNode[];
}

export interface AccordionProps {
  /** 面板列表（可含表达式解析后的数组） */
  items?: AccordionItemData[];
  /** 允许收起全部面板（契约兼容字段；Base UI single 模式天然允许收起） */
  collapsible?: boolean;
  /** 允许多个面板同时展开 */
  multiple?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Accordion 适配器（shadcn kit）：items 声明面板，pane 内容经
 * renderChildren 渲染 DSL 子树；multiple 切换单开/多开模式。
 */
export function Accordion({
  items = [],
  multiple,
  className,
  style,
}: AccordionProps) {
  const { renderChildren } = useRenderer();
  return (
    <ShadcnAccordion
      type={multiple ? 'multiple' : 'single'}
      className={className}
      style={style}
    >
      {items.map((item) => (
        <AccordionItem key={item.key} value={item.key}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{renderChildren(item.children)}</AccordionContent>
        </AccordionItem>
      ))}
    </ShadcnAccordion>
  );
}
