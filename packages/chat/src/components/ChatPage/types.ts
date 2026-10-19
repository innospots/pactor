import type { DslNode, Registry } from "@pactor-app/core";
import type { CSSProperties, ReactNode } from "react";

import type { ChatPageArtifact } from "../ArtifactPanel/artifact.js";
import type { ArtifactViewers } from "../ArtifactPanel/index.js";
import type { AttachmentItemData } from "../Attachment/index.js";
import type {
  ComposerContextItem,
  ComposerContextSource,
  ComposerModelOption,
} from "../Composer/index.js";
import type { ConversationItemData } from "../ConversationList/index.js";
import type { MessageListItem } from "../MessageList/index.js";
import type { WelcomePromptItem } from "../Welcome/index.js";

/** 图标栏 / 展开菜单共用的导航项 */
export interface ChatPageMenuItem {
  key: string;
  label: string;
  /** 图标名（Icon 白名单） */
  icon?: string;
}

/** 对话图标栏项：点击 toggle 展示当前对话的附加内容（产物 / 执行步骤等） */
export interface ConversationRailItem {
  key: string;
  /** 提示文案（hover tooltip） */
  label?: string;
  /** 图标名（Icon 白名单） */
  icon?: string;
  /** 呈现形态：popover（图标栏旁悬浮弹框，缺省）/ panel（产物栏式右侧固定宽栏） */
  display?: "panel" | "popover";
  /** 附加内容（React 元素或 DslNode；缺省时点击仅触发状态事件，不渲染内容层） */
  content?: DslNode | ReactNode;
  /** 隐藏该项（如按当前会话有无对应内容动态显隐）；隐藏时激活态一并失效 */
  hidden?: boolean;
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
  /** 隐藏左侧展开菜单区（品牌 / 导航 / 会话列表 / 底部分组整体不渲染） */
  hideMenu?: boolean;
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
   * 对话区头部右侧自定义操作（图标 + 提示）；提供才渲染（未配置时
   * header 不渲染任何按钮），点击经 onConversationHeaderAction 传出
   */
  conversationHeaderAction?: {
    icon?: string;
    label?: string;
    tooltip?: string;
  };
  /** 对话区头部右侧自定义操作点击事件 */
  onConversationHeaderAction?: () => void;
  /**
   * 对话图标栏附加项（header 下方、对话区右缘纵向排列，产物内置项
   * 之后按序展示）；点击 toggle 展示对应附加内容
   */
  conversationRailItems?: ConversationRailItem[];
  /** 隐藏图标栏内置产物入口（缺省 false：产物开关为图标栏首项） */
  hideArtifactRailItem?: boolean;
  /** 图标栏激活项 key（提供即受控，配合 onConversationRailChange 闭环；null 为全部收起） */
  activeConversationRailKey?: string | null;
  /** 图标栏激活项变化事件，传出 key 或 null */
  onConversationRailChange?: (key: string | null) => void;
  /**
   * 右端固定块内容槽（React 元素或 DslNode）：渲染在对话内容与
   * ConversationRail 之间（对话图标栏左侧，二者同处 chat-page-aside
   * 容器），块自带背景色（经 --pactor-chat-side-panel-bg 跟随皮肤，
   * 回退侧栏 / 页面语义令牌）与纵向滚动，可传入任意元素（如任务列表 /
   * 待办）；提供才渲染
   */
  sidePanel?: DslNode | ReactNode;
  /**
   * 右端固定块展开态（受控）：展开 / 收起带宽度 + 透明度过渡动画；
   * 缺省 false（收起）
   */
  sidePanelOpen?: boolean;
  /** 右端固定块宽度，缺省 280px（数字按 px，支持任意 CSS 宽度） */
  sidePanelWidth?: number | string;
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
  /** 模型选项（非空时 Composer 工具栏右端渲染模型选择 chip） */
  models?: ComposerModelOption[];
  /** 当前选中模型 value（可绑 `${state.x}` 受控闭环） */
  model?: string;
  /** 模型切换事件，传出 value */
  onModelChange?: (value: string) => void;
  /** 上下文数据源（行内提及：输入触发符在光标处弹菜单，选中替换为行内提及块；'+' 源另有工具栏按钮弹层） */
  contexts?: ComposerContextSource[];
  /** 行内提及块列表（受控，与输入区同步，可绑 `${state.x}`） */
  contextItems?: ComposerContextItem[];
  /** chips 变更事件（选中追加 / 移除），传出新数组；发送后的清空由调用方在 onSend 闭环里处理 */
  onContextItemsChange?: (items: ComposerContextItem[]) => void;
  /** 附件列表（受控，展示在输入区上方） */
  attachments?: AttachmentItemData[];
  /** 附件选择入口（提供时启用附件钮与粘贴 / 拖拽文件），传出原始 File[] */
  onAttachFiles?: (files: File[]) => void;
  /** 附件移除事件，传出 id */
  onRemoveAttachment?: (id: string | number) => void;
  /** 附件重试事件，传出 id */
  onRetryAttachment?: (id: string | number) => void;
  /** Composer footer 槽（渲染在输入框内工具栏下方，以分隔线相隔） */
  composerFooter?: DslNode | ReactNode;
  /** Composer 下方自定义内容槽（渲染在输入框之外正下方，如免责声明弱提示行） */
  composerBottom?: DslNode | ReactNode;
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
  /**
   * 主体内容槽（React 元素或 DslNode）：提供时整体替换右侧主区域——
   * 对话 header、Welcome / MessageList、Composer、对话图标栏与右侧
   * 产物 / 附加分栏均不渲染，由调用方自带完整主体（含 header）；
   * 最左图标栏与展开菜单区不受影响
   */
  content?: DslNode | ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}
