import { Button, Tooltip } from "@pactor-app/ui/components";

import { cn } from "../../lib/utils.js";
import type { RenderSlot } from "./hooks.js";
import type { ConversationRailItem } from "./types.js";

export interface ConversationRailProps {
  /** 产物区标题（内置产物入口的 tooltip） */
  artifactTitle: string;
  /** 产物区展开态（决定内置入口图标 / 提示） */
  artifactOpen: boolean;
  /** 隐藏内置产物入口 */
  hideArtifactRailItem: boolean;
  /** 产物区开关事件 */
  onToggleArtifact: () => void;
  /** 可见附加项（已过滤 hidden） */
  items: ConversationRailItem[];
  /** 当前激活项 key */
  activeKey: string | null;
  /** 附加项 toggle 事件 */
  onToggleItem: (item: ConversationRailItem) => void;
  /** 激活的 popover 项（无 content 的项不渲染弹层） */
  activePopoverItem?: ConversationRailItem;
  /** DslNode 槽渲染 */
  renderSlot: RenderSlot;
}

/**
 * 对话图标栏：header 下方、对话区右缘纵向排列——内置产物入口
 * （可隐藏）+ 附加项；均为空时整栏隐藏。激活的 popover 项在图标栏
 * 旁渲染悬浮弹层。
 */
export function ConversationRail({
  artifactTitle,
  artifactOpen,
  hideArtifactRailItem,
  onToggleArtifact,
  items,
  activeKey,
  onToggleItem,
  activePopoverItem,
  renderSlot,
}: ConversationRailProps) {
  if (hideArtifactRailItem && items.length === 0) {
    return null;
  }

  // 对话图标栏按钮：激活态底色高亮；label 缺省时免 Tooltip
  const button = (
    item: ConversationRailItem,
    active: boolean,
    onClick: () => void,
  ) => {
    const control = (
      <Button
        icon={item.icon}
        variant="text"
        className={cn(
          active ? "bg-accent text-accent-foreground" : undefined,
          "px-2",
        )}
        onClick={onClick}
      />
    );
    return item.label !== undefined ? (
      <Tooltip key={item.key} content={item.label} side="left">
        {control}
      </Tooltip>
    ) : (
      <span key={item.key}>{control}</span>
    );
  };

  return (
    <div
      data-slot="chat-page-conv-rail"
      className="relative flex w-(--pactor-chat-rail-width) shrink-0 flex-col items-center gap-1 px-1 py-2"
    >
      {!hideArtifactRailItem
        ? button(
            {
              key: "artifact",
              icon: artifactOpen ? "panel-right-close" : "package",
              label: artifactOpen ? "收起产物区" : artifactTitle,
            },
            artifactOpen,
            onToggleArtifact,
          )
        : null}
      {items.map((item) =>
        button(item, activeKey === item.key, () => onToggleItem(item)),
      )}
      {activePopoverItem ? (
        <div
          data-slot="chat-page-rail-popover"
          className="absolute right-full top-0 z-10 mr-2 overflow-auto rounded-lg border border-border bg-popover shadow-md"
          style={{
            width: "var(--pactor-chat-rail-popover-width)",
            maxWidth: "calc(100cqw - 2rem)",
            maxHeight: "calc(100% - 1rem)",
          }}
        >
          {renderSlot(activePopoverItem.content)}
        </div>
      ) : null}
    </div>
  );
}
