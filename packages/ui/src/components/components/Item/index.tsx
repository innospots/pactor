import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  Item as ShadcnItem,
  ItemTitle,
} from '../../../ui/item.js';

export interface ItemProps {
  /** 标题 */
  title?: string;
  /** 描述文本 */
  description?: string;
  /** 媒体区（DSL 子树，经 renderChildren 渲染） */
  media?: DslNode | DslNode[];
  /** 操作区（DSL 子树，经 renderChildren 渲染） */
  actions?: DslNode[];
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Item 适配器（shadcn kit）：media / title+description / actions 三段式
 * 列表项；media 与 actions 为 DSL 子树，经 renderChildren 渲染。
 */
export function Item({
  title,
  description,
  media,
  actions,
  className,
  style,
}: ItemProps) {
  const { renderChildren } = useRenderer();
  const mediaNodes = media === undefined ? [] : Array.isArray(media) ? media : [media];
  return (
    <ShadcnItem className={className} style={style}>
      {mediaNodes.length > 0 ? <ItemMedia>{renderChildren(mediaNodes)}</ItemMedia> : null}
      <ItemContent>
        {title ? <ItemTitle>{title}</ItemTitle> : null}
        {description ? <ItemDescription>{description}</ItemDescription> : null}
      </ItemContent>
      {actions && actions.length > 0 ? (
        <ItemActions>{renderChildren(actions)}</ItemActions>
      ) : null}
    </ShadcnItem>
  );
}
