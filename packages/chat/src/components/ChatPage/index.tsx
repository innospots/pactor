import { Panel, PanelGroup, ResizableHandle } from "@pactor-app/ui/ui";

import { cn } from "../../lib/utils.js";
import { ArtifactPane } from "./artifact-pane.js";
import { ConversationArea } from "./conversation-area.js";
import { ConversationRail } from "./conversation-rail.js";
import {
  useControlledValue,
  useConversationRail,
  useRenderSlot,
  useSectionCollapse,
} from "./hooks.js";
import { IconRail } from "./icon-rail.js";
import { MenuPane } from "./menu-pane.js";
import type { ChatPageProps } from "./types.js";

export type {
  ChatPageBrand,
  ChatPageMenuItem,
  ChatPageProps,
  ConversationRailItem,
} from "./types.js";

/**
 * ChatPage 对话工作页（shadcn kit）：四区整页布局——
 * 最左图标栏（railItems 独立定义，仅图标，hover 右侧 Tooltip 展示
 * 菜单名；不传则整栏隐藏）、展开菜单区（品牌 + 图标文字导航固定于顶部，
 * 可折叠的会话列表与底部分组各占独立滚动区，内容短时下方留空）、中间对话区（头部 / Welcome /
 * MessageList / Composer——Composer 支持模型选择 chip（models/model）、
 * 行内提及（contexts：输入触发符在光标处弹菜单，选中替换为行内提及块，
 * 退格整体删除；受控 contextItems）、附件
 * 入口（onAttachFiles + 受控 attachments）与 composerFooter /
 * composerBottom 槽位）、对话图标栏（header 下方、对话区右缘纵向
 * 图标列：内置产物入口 + conversationRailItems 附加项，点击 toggle
 * 展示附加内容——popover 悬浮弹框或 panel 右侧分栏，与产物区互斥）、
 * 右端固定块（sidePanel 槽：与对话图标栏同处 chat-page-aside 容器，
 * 渲染在图标栏左侧，sidePanelOpen 受控显隐并带宽度 / 透明度过渡，
 * 块背景经 --pactor-chat-side-panel-bg 跟随皮肤，可放入任务列表等
 * 任意元素）、
 * 最右产物区（ArtifactPanel：内建产物预览、
 * 目录树与下载，可显隐；展示时经 Resizable 拖拽调节与对话区的宽度）。
 * content 槽（React 元素或 DslNode）提供时整体替换右侧主区域（含对话
 * header），由调用方自带完整主体内容；左侧图标栏与展开菜单区保留
 *（hideMenu: true 时展开菜单区整体不渲染）。
 * 数据与行为全部经 props / events 进出，
 * 本组件不持有业务状态（产物区开关、图标栏激活项与分区折叠缺省非受控，
 * 均可经受控 prop + change 事件闭环）。
 *
 * 内部按区域拆分：IconRail / MenuPane / ConversationArea /
 * ConversationRail / ArtifactPane 各自独立文件，受控状态与槽位渲染
 * 收在 hooks.ts，本文件仅承载组合与公开契约。
 */
export function ChatPage({
  brand,
  menuItems = [],
  activeMenuKey,
  railItems = [],
  railFooterItems = [],
  hideMenu = false,
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
  conversationRailItems = [],
  hideArtifactRailItem = false,
  activeConversationRailKey,
  onConversationRailChange,
  sidePanel,
  sidePanelOpen = false,
  sidePanelWidth,
  messages = [],
  sending,
  composerPlaceholder,
  welcome,
  onSend,
  onMessageAction,
  models,
  model,
  onModelChange,
  contexts,
  contextItems,
  onContextItemsChange,
  attachments,
  onAttachFiles,
  onRemoveAttachment,
  onRetryAttachment,
  composerFooter,
  composerBottom,
  artifactTitle = "产物",
  artifacts = [],
  activeArtifactId,
  onSelectArtifact,
  artifactEmptyText = "暂无产物，发送消息后生成的文件将展示在这里",
  safeRegistry,
  user,
  artifactViewers,
  onDownloadArtifact,
  artifactOpen,
  defaultArtifactOpen = false,
  onArtifactOpenChange,
  content,
  className,
  style,
}: ChatPageProps) {
  // 产物区开关：受控 prop 优先，缺省内部维护
  const [artifactPanelOpen, setArtifactOpen] = useControlledValue(
    artifactOpen,
    defaultArtifactOpen,
    onArtifactOpenChange,
  );

  // 对话图标栏激活项与内容层派生；激活 panel 项时与产物区互斥
  const rail = useConversationRail({
    items: conversationRailItems,
    activeKey: activeConversationRailKey,
    onChange: onConversationRailChange,
    onOpenPanel: () => setArtifactOpen(false),
  });

  // 分区折叠：受控 prop 优先，缺省内部维护
  const [conversationCollapsed, toggleConversationSection] = useSectionCollapse(
    conversationSectionCollapsed,
    defaultConversationSectionCollapsed,
    onConversationSectionToggle,
  );
  const [footerCollapsed, toggleFooterSection] = useSectionCollapse(
    footerSectionCollapsed,
    defaultFooterSectionCollapsed,
    onFooterSectionToggle,
  );

  const renderSlot = useRenderSlot();

  const toggleArtifact = (): void => {
    // 打开产物区时关闭激活的 panel 项（互斥）
    if (!artifactPanelOpen && rail.activePanelItem) {
      rail.setActiveKey(null);
    }
    setArtifactOpen(!artifactPanelOpen);
  };

  const conversationRail = (
    <ConversationRail
      artifactTitle={artifactTitle}
      artifactOpen={artifactPanelOpen}
      hideArtifactRailItem={hideArtifactRailItem}
      onToggleArtifact={toggleArtifact}
      items={rail.visibleItems}
      activeKey={rail.activeKey}
      onToggleItem={rail.toggleItem}
      activePopoverItem={rail.activePopoverItem}
      renderSlot={renderSlot}
    />
  );

  const chatArea = (
    <ConversationArea
      conversationTitle={conversationTitle}
      conversationHeaderAction={conversationHeaderAction}
      onConversationHeaderAction={onConversationHeaderAction}
      messages={messages}
      welcome={welcome}
      sending={sending}
      composerPlaceholder={composerPlaceholder}
      onSend={onSend}
      onMessageAction={onMessageAction}
      models={models}
      model={model}
      onModelChange={onModelChange}
      contexts={contexts}
      contextItems={contextItems}
      onContextItemsChange={onContextItemsChange}
      attachments={attachments}
      onAttachFiles={onAttachFiles}
      onRemoveAttachment={onRemoveAttachment}
      onRetryAttachment={onRetryAttachment}
      composerFooter={composerFooter}
      composerBottom={composerBottom}
      sidePanel={sidePanel}
      sidePanelOpen={sidePanelOpen}
      sidePanelWidth={sidePanelWidth}
      onOpenArtifacts={() => setArtifactOpen(true)}
      renderSlot={renderSlot}
      rail={conversationRail}
    />
  );

  // 当前产物：显式 activeArtifactId 优先（未命中为空态）；缺省展示最新产物
  const activeArtifact =
    artifacts.find((item) => item.id === activeArtifactId) ??
    (activeArtifactId === undefined || activeArtifactId === ""
      ? artifacts[artifacts.length - 1]
      : undefined);

  const artifactPane = (
    <ArtifactPane
      artifact={activeArtifact}
      artifacts={artifacts}
      activeArtifactId={activeArtifactId}
      artifactTitle={artifactTitle}
      artifactEmptyText={artifactEmptyText}
      safeRegistry={safeRegistry}
      user={user}
      artifactViewers={artifactViewers}
      onSelectArtifact={onSelectArtifact}
      onDownloadArtifact={onDownloadArtifact}
      onClose={() => setArtifactOpen(false)}
    />
  );

  return (
    <div
      data-slot="chat-page"
      className={cn("flex w-full overflow-hidden", className)}
      style={{ height: "100vh", ...style }}
    >
      {/* 最左：图标栏（railItems 独立定义；仅图标，hover 右侧 Tooltip 展示菜单名） */}
      <IconRail
        items={railItems}
        footerItems={railFooterItems}
        onSelect={onMenuSelect}
      />
      {/* 展开菜单区：品牌 + 图标文字导航（固定）+ 会话 / 底部分组（各自独立滚动）；
          hideMenu 时整区不渲染（如会话详情页只要对话区） */}
      {hideMenu ? null : (
        <MenuPane
          brand={brand}
          menuItems={menuItems}
          activeMenuKey={activeMenuKey}
          menuAction={menuAction}
          onMenuAction={onMenuAction}
          onMenuSelect={onMenuSelect}
          conversationSectionTitle={conversationSectionTitle}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          conversationCollapsed={conversationCollapsed}
          onToggleConversationSection={toggleConversationSection}
          moreLabel={moreLabel}
          onMore={onMore}
          footerSectionTitle={footerSectionTitle}
          footerItems={footerItems}
          footerCollapsed={footerCollapsed}
          onToggleFooterSection={toggleFooterSection}
        />
      )}
      {/* 主区域：对话区 + 右侧分栏（产物区或 panel 形态附加内容，互斥；
          展示时拖拽调宽）。@container 使对话内容列的 61.8cqw 相对主区域解析。
          content 槽提供时整体替换本区域（含 header，调用方自带完整主体） */}
      <div className="@container h-full min-w-0 flex-1">
        {content !== undefined ? (
          renderSlot(content)
        ) : artifactPanelOpen || rail.activePanelItem ? (
          <PanelGroup
            orientation="horizontal"
            style={{ width: "100%", height: "100%" }}
          >
            <Panel defaultSize="70%">{chatArea}</Panel>
            <ResizableHandle withHandle />
            <Panel defaultSize="30%" minSize="380px" maxSize="760px">
              {rail.activePanelItem ? (
                <div
                  data-slot="chat-page-rail-panel"
                  className="flex h-full min-w-0 flex-col border-l border-border bg-muted"
                >
                  {renderSlot(rail.activePanelItem.content)}
                </div>
              ) : (
                artifactPane
              )}
            </Panel>
          </PanelGroup>
        ) : (
          chatArea
        )}
      </div>
    </div>
  );
}
