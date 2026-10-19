import { Button, Tooltip } from "@pactor-app/ui/components";

import type { ChatPageMenuItem } from "./types.js";

export interface IconRailProps {
  /** 顶部导航项（仅图标，hover 右侧 Tooltip 展示 label） */
  items: ChatPageMenuItem[];
  /** 底部附加项（如设置 / 个人中心） */
  footerItems: ChatPageMenuItem[];
  /** 导航选中事件，传出 item key */
  onSelect?: (key: string) => void;
}

/**
 * 最左图标栏：railItems / railFooterItems 均为空时整栏隐藏；
 * 与展开菜单区独立定义，仅渲染图标按钮。
 */
export function IconRail({ items, footerItems, onSelect }: IconRailProps) {
  if (items.length === 0 && footerItems.length === 0) {
    return null;
  }

  const button = (item: ChatPageMenuItem) => (
    <Tooltip key={item.key} content={item.label} side="right">
      <Button
        icon={item.icon}
        variant="text"
        onClick={() => onSelect?.(item.key)}
      />
    </Tooltip>
  );

  return (
    <div
      data-slot="chat-page-rail"
      className="flex h-full w-[52px] shrink-0 flex-col items-center gap-1 border-r border-border py-2.5"
    >
      {items.map(button)}
      <div className="flex-1" />
      {footerItems.map(button)}
    </div>
  );
}
