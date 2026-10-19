import { Button, Icon, Menu, Text } from "@pactor-app/ui/components";

import {
  ConversationList,
  type ConversationItemData,
} from "../ConversationList/index.js";
import type { ChatPageBrand, ChatPageMenuItem } from "./types.js";

export interface MenuPaneProps {
  /** 品牌区（标题 / 版本）；提供才渲染 */
  brand?: ChatPageBrand;
  /** 主导航项（图标 + 文字） */
  menuItems: ChatPageMenuItem[];
  /** 受控选中导航 key */
  activeMenuKey?: string;
  /** 品牌区右上角操作（如「发现应用」）；提供才渲染 */
  menuAction?: { label: string; icon?: string };
  onMenuAction?: () => void;
  /** 导航选中事件（导航菜单 / 底部分组共用） */
  onMenuSelect?: (key: string) => void;
  /** 会话区标题（自动拼接数量）；提供才渲染 */
  conversationSectionTitle?: string;
  conversations: ConversationItemData[];
  activeConversationId?: string;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  /** 会话区折叠态（由组合层维护受控 / 非受控） */
  conversationCollapsed: boolean;
  onToggleConversationSection: () => void;
  /** 「查看更多」入口文案；提供才渲染 */
  moreLabel?: string;
  onMore?: () => void;
  /** 底部分组标题；提供才渲染 */
  footerSectionTitle?: string;
  footerItems: ChatPageMenuItem[];
  /** 底部分组折叠态 */
  footerCollapsed: boolean;
  onToggleFooterSection: () => void;
}

/**
 * 展开菜单区：品牌 + 图标文字导航（固定于顶部）+ 可折叠会话列表与
 * 底部分组（各自独立滚动）；hideMenu 由组合层处理（整区不渲染）。
 */
export function MenuPane({
  brand,
  menuItems,
  activeMenuKey,
  menuAction,
  onMenuAction,
  onMenuSelect,
  conversationSectionTitle,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  conversationCollapsed,
  onToggleConversationSection,
  moreLabel,
  onMore,
  footerSectionTitle,
  footerItems,
  footerCollapsed,
  onToggleFooterSection,
}: MenuPaneProps) {
  return (
    <div
      data-slot="chat-page-menu"
      className="flex h-full w-[250px] shrink-0 flex-col gap-2 overflow-hidden border-r border-border px-2 py-3"
    >
      {brand ? (
        <div className="flex shrink-0 items-center justify-between px-2">
          <div className="flex flex-col gap-0.5">
            <Text text={brand.title} strong size="large" />
            {brand.version !== undefined ? (
              <Text text={brand.version} type="secondary" size="small" />
            ) : null}
          </div>
          {menuAction ? (
            <Button
              text={menuAction.label}
              icon={menuAction.icon}
              size="small"
              onClick={() => onMenuAction?.()}
            />
          ) : null}
        </div>
      ) : null}
      {/* 导航菜单：高度充裕时不滚动；页面高度不足时上限 40% 并内部滚动，
        把空间让给会话 / 底部分组 */}
      <div className="scrollbar-subtle max-h-[40%] min-h-0 shrink-0 overflow-y-auto">
        <Menu
          items={menuItems}
          selectedKey={activeMenuKey}
          onSelect={(key) => onMenuSelect?.(key)}
        />
      </div>
      {conversationSectionTitle !== undefined ? (
        <button
          type="button"
          data-slot="chat-page-section-toggle"
          aria-expanded={!conversationCollapsed}
          className="flex w-full shrink-0 cursor-pointer items-center justify-between px-2 pt-2"
          onClick={onToggleConversationSection}
        >
          <Text
            text={`${conversationSectionTitle} (${conversations.length})`}
            type="secondary"
            className="text-sm"
            strong
          />
          <Icon
            name={conversationCollapsed ? "chevron-right" : "chevron-down"}
            size={14}
          />
        </button>
      ) : null}
      {!conversationCollapsed ? (
        <div
          data-slot="chat-page-section-body"
          className="scrollbar-subtle flex min-h-0 flex-1 flex-col overflow-y-auto"
        >
          <ConversationList
            items={conversations}
            activeId={activeConversationId}
            onSelect={(id) => onSelectConversation?.(id)}
            onDelete={(id) => onDeleteConversation?.(id)}
          />
          {moreLabel !== undefined ? (
            <div className="flex justify-end">
              <Button
                text={`${moreLabel} >>`}
                variant="link"
                size="small"
                onClick={() => onMore?.()}
              />
            </div>
          ) : null}
        </div>
      ) : null}
      {footerSectionTitle !== undefined ? (
        <button
          type="button"
          data-slot="chat-page-section-toggle"
          aria-expanded={!footerCollapsed}
          className="flex w-full shrink-0 cursor-pointer items-center justify-between px-2 pt-2"
          onClick={onToggleFooterSection}
        >
          <Text
            text={footerSectionTitle}
            type="secondary"
            className="text-sm"
            strong
          />
          <Icon
            name={footerCollapsed ? "chevron-right" : "chevron-down"}
            size={14}
          />
        </button>
      ) : null}
      {!footerCollapsed && footerItems.length > 0 ? (
        <div
          data-slot="chat-page-section-body"
          className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto"
        >
          <Menu items={footerItems} onSelect={(key) => onMenuSelect?.(key)} />
        </div>
      ) : null}
    </div>
  );
}
