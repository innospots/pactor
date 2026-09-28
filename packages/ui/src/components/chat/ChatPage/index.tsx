import type { Registry } from '@pactor-app/core';
import { useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Panel,
  PanelGroup,
  ResizableHandle,
} from '../../../ui/resizable.js';
import { Button } from '../../components/Button/index.js';
import { Icon } from '../../components/Icon/index.js';
import { Menu } from '../../components/Menu/index.js';
import { Text } from '../../components/Text/index.js';
import { Tooltip } from '../../components/Tooltip/index.js';
import { ArtifactPanel, type ArtifactViewers } from '../ArtifactPanel/index.js';
import type { ChatPageArtifact } from '../ArtifactPanel/artifact.js';
import { Composer } from '../Composer/index.js';
import { ConversationList, type ConversationItemData } from '../ConversationList/index.js';
import { MessageList, type MessageListItem } from '../MessageList/index.js';
import { Welcome, type WelcomePromptItem } from '../Welcome/index.js';

/** 图标栏 / 展开菜单共用的导航项 */
export interface ChatPageMenuItem {
  key: string;
  label: string;
  /** 图标名（Icon 白名单） */
  icon?: string;
}

/** 品牌区（展开菜单区标题 / 版本） */
export interface ChatPageBrand {
  title: string;
  version?: string;
}

export interface ChatPageProps {
  brand?: ChatPageBrand;
  /** 主导航项：展开菜单区为图标 + 文字 */
  menuItems?: ChatPageMenuItem[];
  /** 受控选中导航 key（可绑 `${state.x}`） */
  activeMenuKey?: string;
  /**
   * 图标栏导航项（仅图标，hover 右侧 Tooltip 展示 label），与展开菜单
   * 独立定义；railItems 与 railFooterItems 均为空时整个图标栏隐藏
   */
  railItems?: ChatPageMenuItem[];
  /** 图标栏底部附加项（如设置 / 个人中心） */
  railFooterItems?: ChatPageMenuItem[];
  /** 展开菜单区右上角操作（如「发现应用」）；提供才渲染 */
  menuAction?: { label: string; icon?: string };
  /** 导航选中事件（图标栏 / 展开菜单 / 底部分组共用），传出 item key */
  onMenuSelect?: (key: string) => void;
  /** menuAction 点击事件 */
  onMenuAction?: () => void;
  /** 会话区标题（如「任务」，自动拼接数量）；点击标题折叠 / 展开列表 */
  conversationSectionTitle?: string;
  /** 会话区受控折叠（提供即受控，配合 onConversationSectionToggle 闭环） */
  conversationSectionCollapsed?: boolean;
  /** 会话区非受控初始折叠，缺省 false */
  defaultConversationSectionCollapsed?: boolean;
  /** 会话区折叠变化事件，传出 boolean */
  onConversationSectionToggle?: (collapsed: boolean) => void;
  conversations?: ConversationItemData[];
  activeConversationId?: string;
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  /** 「查看更多」入口文案；提供才渲染（随会话区折叠隐藏） */
  moreLabel?: string;
  onMore?: () => void;
  /** 菜单区底部附加分组标题（如「空间 (14)」）；提供才渲染，点击折叠 / 展开 */
  footerSectionTitle?: string;
  /** 底部分组列表项（图标 + 文字，点击经 onMenuSelect 传出） */
  footerItems?: ChatPageMenuItem[];
  /** 底部分组受控折叠（提供即受控，配合 onFooterSectionToggle 闭环） */
  footerSectionCollapsed?: boolean;
  /** 底部分组非受控初始折叠，缺省 false */
  defaultFooterSectionCollapsed?: boolean;
  /** 底部分组折叠变化事件，传出 boolean */
  onFooterSectionToggle?: (collapsed: boolean) => void;
  /** 对话区头部标题（通常为当前会话标题） */
  conversationTitle?: string;
  /**
   * 对话区头部右侧自定义操作（图标 + 提示）；提供时替换缺省的产物区
   * 开关钮，点击经 onConversationHeaderAction 传出（产物区开关可经
   * 受控 artifactOpen + onArtifactOpenChange 自行接线）
   */
  conversationHeaderAction?: { icon?: string; label?: string; tooltip?: string };
  /** 对话区头部右侧自定义操作点击事件 */
  onConversationHeaderAction?: () => void;
  messages?: MessageListItem[];
  /** 发送中（禁用 Composer 发送钮，由调用方完成后复位） */
  sending?: boolean;
  composerPlaceholder?: string;
  /** 空会话欢迎区（messages 为空时展示；prompts 选择即发送） */
  welcome?: {
    title?: string;
    description?: string;
    prompts?: WelcomePromptItem[];
  };
  /** 发送事件（Composer 提交 / Welcome prompts 选择），传出文本 */
  onSend?: (text: string) => void;
  /** 消息操作事件，传出 { id, action } */
  onMessageAction?: (event: { id?: string; action: string }) => void;
  /** 产物区标题，缺省「产物」 */
  artifactTitle?: string;
  /**
   * 产物列表（富模型：id / kind / title / content，面板内建预览——
   * markdown / code / text / dsl 活预览 / 图片，含目录树与下载）
   */
  artifacts?: ChatPageArtifact[];
  activeArtifactId?: string;
  onSelectArtifact?: (id: string) => void;
  artifactEmptyText?: string;
  /** dsl 产物活预览的 Safe Registry（缺省时 dsl 内容渲染降级块） */
  safeRegistry?: Registry<unknown>;
  /** 注入 dsl 预览作用域 user */
  user?: Record<string, unknown>;
  /** 自定义产物查看器（扩展名 / kind → 预览），优先于内建渲染器 */
  artifactViewers?: ArtifactViewers;
  /** 产物下载事件；缺省面板内部走浏览器下载 */
  onDownloadArtifact?: (artifact: ChatPageArtifact) => void;
  /** 产物区受控开关（提供即受控，配合 onArtifactOpenChange 闭环） */
  artifactOpen?: boolean;
  /** 非受控初始开关，缺省 false（产物栏不默认展示） */
  defaultArtifactOpen?: boolean;
  /** 产物区开关变化事件，传出 boolean */
  onArtifactOpenChange?: (open: boolean) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * ChatPage 对话工作页（shadcn kit）：四区整页布局——
 * 最左图标栏（railItems 独立定义，仅图标，hover 右侧 Tooltip 展示
 * 菜单名；不传则整栏隐藏）、展开菜单区（品牌 + 图标文字导航固定于顶部，
 * 可折叠的会话列表与底部分组各占独立滚动区，内容短时下方留空）、中间对话区（头部 / Welcome /
 * MessageList / Composer）、最右产物区（ArtifactPanel：内建产物预览、
 * 目录树与下载，可显隐；展示时经 Resizable 拖拽调节与对话区的宽度）。
 * 数据与行为全部经 props / events 进出，
 * 本组件不持有业务状态（产物区开关与分区折叠缺省非受控，均可经
 * 受控 prop + change 事件闭环）。
 */
export function ChatPage({
  brand,
  menuItems = [],
  activeMenuKey,
  railItems = [],
  railFooterItems = [],
  menuAction,
  onMenuSelect,
  onMenuAction,
  conversationSectionTitle,
  conversationSectionCollapsed,
  defaultConversationSectionCollapsed = false,
  onConversationSectionToggle,
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  moreLabel,
  onMore,
  footerSectionTitle,
  footerItems = [],
  footerSectionCollapsed,
  defaultFooterSectionCollapsed = false,
  onFooterSectionToggle,
  conversationTitle,
  conversationHeaderAction,
  onConversationHeaderAction,
  messages = [],
  sending,
  composerPlaceholder,
  welcome,
  onSend,
  onMessageAction,
  artifactTitle = '产物',
  artifacts = [],
  activeArtifactId,
  onSelectArtifact,
  artifactEmptyText = '暂无产物，发送消息后生成的文件将展示在这里',
  safeRegistry,
  user,
  artifactViewers,
  onDownloadArtifact,
  artifactOpen,
  defaultArtifactOpen = false,
  onArtifactOpenChange,
  className,
  style,
}: ChatPageProps) {
  const controlled = artifactOpen !== undefined;
  const [innerOpen, setInnerOpen] = useState(defaultArtifactOpen);
  const open = controlled ? artifactOpen === true : innerOpen;
  const setOpen = (next: boolean): void => {
    if (!controlled) setInnerOpen(next);
    onArtifactOpenChange?.(next);
  };

  // 分区折叠：受控 prop 优先，缺省内部维护（同 artifactOpen 模式）
  const convCollControlled = conversationSectionCollapsed !== undefined;
  const [convCollapsedInner, setConvCollapsedInner] = useState(
    defaultConversationSectionCollapsed,
  );
  const convCollapsed = convCollControlled
    ? conversationSectionCollapsed === true
    : convCollapsedInner;
  const toggleConvSection = (): void => {
    const next = !convCollapsed;
    if (!convCollControlled) setConvCollapsedInner(next);
    onConversationSectionToggle?.(next);
  };

  const footerCollControlled = footerSectionCollapsed !== undefined;
  const [footerCollapsedInner, setFooterCollapsedInner] = useState(
    defaultFooterSectionCollapsed,
  );
  const footerCollapsed = footerCollControlled
    ? footerSectionCollapsed === true
    : footerCollapsedInner;
  const toggleFooterSection = (): void => {
    const next = !footerCollapsed;
    if (!footerCollControlled) setFooterCollapsedInner(next);
    onFooterSectionToggle?.(next);
  };

  // 图标栏独立定义：railItems / railFooterItems 均为空时整栏隐藏
  const railVisible = railItems.length > 0 || railFooterItems.length > 0;

  const railButton = (item: ChatPageMenuItem) => (
    <Tooltip key={item.key} content={item.label} side="right">
      <Button
        icon={item.icon}
        variant="text"
        onClick={() => onMenuSelect?.(item.key)}
      />
    </Tooltip>
  );

  const chatArea = (
    <div data-slot="chat-page-conversation" className="flex h-full min-w-0 flex-1 flex-col">
      <div
        className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5"
      >
        <Text text={conversationTitle} strong />
        {conversationHeaderAction ? (
          <Tooltip content={conversationHeaderAction.tooltip ?? conversationHeaderAction.label} side="bottom">
            <Button
              text={conversationHeaderAction.label}
              icon={conversationHeaderAction.icon}
              variant="text"
              onClick={() => onConversationHeaderAction?.()}
            />
          </Tooltip>
        ) : (
          <Tooltip content={open ? '收起产物区' : artifactTitle} side="bottom">
            <Button
              icon={open ? 'panel-right-close' : 'panel-right-open'}
              variant="text"
              onClick={() => setOpen(!open)}
            />
          </Tooltip>
        )}
      </div>
      {/* 内容列宽相对主区域（cqw）：产物栏关闭时对话列占主区域 61.8%（居中），
          产物栏拖宽时分栏收窄、对话列逐渐撑满分栏（max-w-full 封顶） */}
      <div
        data-slot="chat-page-conversation-body"
        className="mx-auto flex min-h-0 w-[61.8cqw] max-w-full flex-1 flex-col"
      >
        {messages.length === 0 ? (
          <Welcome
            title={welcome?.title}
            description={welcome?.description}
            prompts={welcome?.prompts}
            style={{ flex: 1 }}
            onSelect={(value) => onSend?.(value)}
          />
        ) : (
          <MessageList
            messages={messages}
            className="scrollbar-subtle"
            style={{ flex: 1, minHeight: 0, padding: 16 }}
            onAction={onMessageAction}
            onOpenArtifacts={() => setOpen(true)}
          />
        )}
        <Composer
          placeholder={composerPlaceholder}
          loading={sending}
          style={{ padding: 16, flexShrink: 0 }}
          onSubmit={(text) => onSend?.(text)}
        />
      </div>
    </div>
  );

  // 当前产物：显式 activeArtifactId 优先（未命中为空态）；缺省展示最新产物
  const activeArtifact =
    artifacts.find((item) => item.id === activeArtifactId) ??
    (activeArtifactId === undefined || activeArtifactId === ''
      ? artifacts[artifacts.length - 1]
      : undefined);

  const artifactPanel = (
    <div
      data-slot="chat-page-artifact"
      className="flex h-full min-w-0 flex-col border-l border-border bg-muted"
    >
      <ArtifactPanel
        artifact={activeArtifact}
        artifacts={artifacts}
        activeArtifactId={activeArtifactId}
        title={artifactTitle}
        emptyText={artifactEmptyText}
        safeRegistry={safeRegistry}
        user={user}
        artifactViewers={artifactViewers}
        onSelectArtifact={(id) => onSelectArtifact?.(id)}
        onDownload={onDownloadArtifact}
        onClose={() => setOpen(false)}
      />
    </div>
  );

  return (
    <div
      data-slot="chat-page"
      className={cn('flex w-full overflow-hidden', className)}
      style={{ height: '100vh', ...style }}
    >
      {/* 最左：图标栏（railItems 独立定义；仅图标，hover 右侧 Tooltip 展示菜单名） */}
      {railVisible ? (
        <div
          data-slot="chat-page-rail"
          className="flex h-full w-[52px] shrink-0 flex-col items-center gap-1 border-r border-border py-2.5"
        >
          {railItems.map(railButton)}
          <div className="flex-1" />
          {railFooterItems.map(railButton)}
        </div>
      ) : null}
      {/* 展开菜单区：品牌 + 图标文字导航（固定）+ 会话 / 底部分组（各自独立滚动） */}
      <div
        data-slot="chat-page-menu"
        className="flex h-full w-[264px] shrink-0 flex-col gap-2 overflow-hidden border-r border-border px-2 py-3"
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
            aria-expanded={!convCollapsed}
            className="flex w-full shrink-0 cursor-pointer items-center justify-between px-2 pt-2"
            onClick={toggleConvSection}
          >
            <Text
              text={`${conversationSectionTitle} (${conversations.length})`}
              type="secondary"
              className="text-sm"
              strong
            />
            <Icon name={convCollapsed ? 'chevron-right' : 'chevron-down'} size={14} />
          </button>
        ) : null}
        {!convCollapsed ? (
          <div data-slot="chat-page-section-body" className="scrollbar-subtle flex min-h-0 flex-1 flex-col overflow-y-auto">
            <ConversationList
              items={conversations}
              activeId={activeConversationId}
              onSelect={(id) => onSelectConversation?.(id)}
              onDelete={(id) => onDeleteConversation?.(id)}
            />
            {moreLabel !== undefined ? (
              <div className="flex justify-end">
                <Button text={`${moreLabel} >>`} variant="link" size="small" onClick={() => onMore?.()} />
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
            onClick={toggleFooterSection}
          >
            <Text text={footerSectionTitle} type="secondary" className="text-sm" strong />
            <Icon name={footerCollapsed ? 'chevron-right' : 'chevron-down'} size={14} />
          </button>
        ) : null}
        {!footerCollapsed && footerItems.length > 0 ? (
          <div data-slot="chat-page-section-body" className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto">
            <Menu
              items={footerItems}
              onSelect={(key) => onMenuSelect?.(key)}
            />
          </div>
        ) : null}
      </div>
      {/* 主区域：对话区 + 产物区（产物区可显隐；展示时拖拽调宽）。
          @container 使对话内容列的 61.8cqw 相对主区域解析 */}
      <div className="@container h-full min-w-0 flex-1">
        {open ? (
          <PanelGroup orientation="horizontal" style={{ width: '100%', height: '100%' }}>
            <Panel defaultSize="62%">{chatArea}</Panel>
            <ResizableHandle withHandle />
            <Panel defaultSize="38%" minSize="380px" maxSize="760px">
              {artifactPanel}
            </Panel>
          </PanelGroup>
        ) : (
          chatArea
        )}
      </div>
    </div>
  );
}
