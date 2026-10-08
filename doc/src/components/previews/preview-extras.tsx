/**
 * 线框模板预览的扩展组件（注册进预览运行时，模板工程自定义组件的文档站对应物）：
 * - SitemapMenu：站点地图菜单（ui Menu 的 inline 形态，collapsible 子菜单收起/展开）
 */
import type { ReactElement } from 'react';
import { Menu, type MenuItem } from '@pactor-app/ui/components';

export function SitemapMenu({
  items,
  collapsible,
  selectedKey,
  onSelect,
}: {
  items?: MenuItem[];
  collapsible?: boolean;
  selectedKey?: string;
  onSelect?: (key: string) => void;
}): ReactElement {
  return (
    <Menu
      items={items}
      collapsible={collapsible}
      selectedKey={selectedKey}
      onSelect={onSelect}
    />
  );
}

/** 注册进预览运行时的扩展组件表 */
export const previewExtraComponents = {
  SitemapMenu,
};
