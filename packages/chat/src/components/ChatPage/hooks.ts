import type { DslNode } from "@pactor-app/core";
import { useRenderer } from "@pactor-app/runtime";
import {
  isValidElement,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { ConversationRailItem } from "./types.js";

/** 槽位渲染：React 元素直接渲染，其余按 DslNode 走 Renderer */
export type RenderSlot = (slot: DslNode | ReactNode) => ReactNode;

/** 受控 / 非受控值：controlled 提供即受控，变更仅经 onChange 上报 */
export function useControlledValue<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [inner, setInner] = useState(defaultValue);
  const value = controlled !== undefined ? controlled : inner;
  const setValue = (next: T): void => {
    if (controlled === undefined) setInner(next);
    onChange?.(next);
  };
  return [value, setValue];
}

/** 分区折叠（受控 prop 优先，缺省内部维护），返回折叠态与 toggle */
export function useSectionCollapse(
  controlled: boolean | undefined,
  defaultCollapsed: boolean,
  onChange?: (collapsed: boolean) => void,
): [boolean, () => void] {
  const [collapsed, setCollapsed] = useControlledValue(
    controlled,
    defaultCollapsed,
    onChange,
  );
  return [collapsed, () => setCollapsed(!collapsed)];
}

/** 槽位渲染函数：在组件内取 Renderer，供各视图区域渲染 DslNode 槽 */
export function useRenderSlot(): RenderSlot {
  const { renderChildren } = useRenderer();
  return (slot) =>
    isValidElement(slot) || typeof slot !== "object" || slot === null
      ? slot
      : renderChildren([slot as DslNode]);
}

/** 对话图标栏状态：受控激活项 + 可见项 / 弹层与分栏内容派生 + toggle */
export interface ConversationRailState {
  /** 过滤 hidden 后的可见项 */
  visibleItems: ConversationRailItem[];
  activeKey: string | null;
  /** panel 形态且带 content 的激活项（右侧分栏） */
  activePanelItem?: ConversationRailItem;
  /** popover 形态且带 content 的激活项（图标栏旁弹层） */
  activePopoverItem?: ConversationRailItem;
  setActiveKey: (key: string | null) => void;
  toggleItem: (item: ConversationRailItem) => void;
}

/**
 * 对话图标栏状态。
 * onOpenPanel：激活 panel 项时回调（由组合层关闭产物区，二者互斥）。
 */
export function useConversationRail({
  items,
  activeKey: controlledActiveKey,
  onChange,
  onOpenPanel,
}: {
  items: ConversationRailItem[];
  activeKey?: string | null;
  onChange?: (key: string | null) => void;
  onOpenPanel?: () => void;
}): ConversationRailState {
  const [activeKey, setActiveKey] = useControlledValue<string | null>(
    controlledActiveKey,
    null,
    onChange,
  );

  // hidden 项不渲染，且不参与激活（隐藏即收起其内容层）
  const visibleItems = items.filter((item) => item.hidden !== true);
  const activeItem = visibleItems.find((item) => item.key === activeKey);
  // 无 content 的项仅作入口：激活只触发 change 事件，不渲染内容层
  const activePanelItem =
    activeItem?.display === "panel" && activeItem.content !== undefined
      ? activeItem
      : undefined;
  const activePopoverItem =
    activeItem !== undefined &&
    activeItem.display !== "panel" &&
    activeItem.content !== undefined
      ? activeItem
      : undefined;

  const toggleItem = (item: ConversationRailItem): void => {
    const next = activeKey === item.key ? null : item.key;
    // panel 与产物区互斥：激活 panel 项时关闭产物区（受控宿主经 change 事件闭环）
    if (next !== null && item.display === "panel") {
      onOpenPanel?.();
    }
    setActiveKey(next);
  };

  // popover 关闭交互：Esc / 点击弹层外部（图标栏自身点击由 toggle 处理）
  useEffect(() => {
    if (!activePopoverItem) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setActiveKey(null);
    };
    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (
        target.closest("[data-slot=chat-page-rail-popover]") ||
        target.closest("[data-slot=chat-page-conv-rail]")
      ) {
        return;
      }
      setActiveKey(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  });

  return {
    visibleItems,
    activeKey,
    activePanelItem,
    activePopoverItem,
    setActiveKey,
    toggleItem,
  };
}
