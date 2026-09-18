import { DropdownMenu, Icon } from '@pactor-app/ui/components';
import { createContext, useContext, type ReactNode } from 'react';

import type { ChatArtifact } from '../../artifact.js';
import {
  invokeChatPanelClose,
  invokeChatPanelDownload,
  invokeChatPanelToggleList,
} from './actions.js';
import type { ChromeFragment } from './ChromeSlot.js';

/**
 * 产出物面板标题栏 chrome 片段（spec: chat-on-ui-components /
 * chat-artifact-panel）：左端可选目录钮 + 产物切换下拉（或纯标题）+
 * kind 角标，右端下载钮 + 关闭钮（chat 内部组件，行为经 context /
 * 包级 handler 直调）。拖拽调宽手柄与内容区渲染器保持 chat 实现，
 * 不进片段。
 */

/** 面板内部组件的共享上下文（ArtifactPanel 提供；DSL 片段与 fallback 共用） */
export interface ChatPanelContextValue {
  /** 会话内全部产物（下拉项 / 目录列表数据源） */
  artifacts: ChatArtifact[];
  /** 当前激活产物 id */
  activeId?: string;
  /** 面板当前视图：内容 / 产物目录列表 */
  view: 'content' | 'list';
  /** 产物切换回调（下拉 / 目录列表点击） */
  onSelectArtifact?: (artifact: ChatArtifact) => void;
}

export const ChatPanelContext = createContext<ChatPanelContextValue | null>(
  null,
);

/** kind → Icon 白名单名（下拉项 / 触发器共用） */
function kindIconName(kind: ChatArtifact['kind'] | undefined): string {
  if (kind === 'code') {
    return 'code';
  }
  if (kind === 'dsl') {
    return 'layout-grid';
  }
  return 'file-text';
}

/**
 * 面板关闭钮内部组件：原生 title 提示与 aria-label（和 fallback 及
 * Composer 内建钮一致——不用 ui Tooltip，portal 到 body 后脱离
 * chrome 令牌与宿主皮肤作用域，气泡配色与皮肤不一致）
 */
export function ChatPanelCloseButton(): ReactNode {
  return (
    <button
      type="button"
      className="pactor-chat-icon-button pactor-chat-inspector__close"
      title="关闭面板"
      aria-label="关闭面板"
      onClick={() => invokeChatPanelClose()}
    >
      <Icon name="x" size={16} />
    </button>
  );
}

/**
 * 产物目录列表切换钮内部组件：面板 header 左端，点击进入目录列表
 * 视图；目录列表视图下隐藏（此时文件名处已显示"产物目录"）
 */
export function ChatPanelListButton(): ReactNode {
  const ctx = useContext(ChatPanelContext);
  if (ctx?.view === 'list') {
    return null;
  }
  return (
    <button
      type="button"
      className="pactor-chat-icon-button pactor-chat-inspector__list-toggle"
      title="产物目录"
      aria-label="产物目录"
      onClick={() => invokeChatPanelToggleList()}
    >
      <Icon name="arrow-left" size={16} />
    </button>
  );
}

/** 产物下载钮内部组件：header 右端（关闭钮左侧），下载当前激活产物 */
export function ChatPanelDownloadButton(): ReactNode {
  return (
    <button
      type="button"
      className="pactor-chat-icon-button pactor-chat-inspector__download"
      title="下载产物"
      aria-label="下载产物"
      onClick={() => invokeChatPanelDownload()}
    >
      <Icon name="download" size={16} />
    </button>
  );
}

/**
 * 产物切换下拉内部组件：header 文件名处——触发器展示当前产物
 * 图标 + 名称 + chevron；下拉列出全部产物，点击经 context
 * onSelectArtifact 切换。目录列表视图下触发器文案固定为"产物目录"
 * （此时产物名无处可指），选中产物即回内容视图
 */
export function ChatPanelArtifactMenu(): ReactNode {
  const ctx = useContext(ChatPanelContext);
  if (!ctx || ctx.artifacts.length === 0) {
    return null;
  }
  const active = ctx.artifacts.find((item) => item.id === ctx.activeId);
  const inList = ctx.view === 'list';
  return (
    <DropdownMenu
      items={ctx.artifacts.map((item) => ({
        label: item.title,
        value: item.id,
        icon: kindIconName(item.kind),
      }))}
      onSelect={(value) => {
        const target = ctx.artifacts.find((item) => item.id === value);
        if (target) {
          ctx.onSelectArtifact?.(target);
        }
      }}
    >
      <span
        className="pactor-chat-inspector__menu-trigger"
        data-view={ctx.view}
      >
        <Icon
          name={inList ? 'folder' : kindIconName(active?.kind)}
          size={13}
        />
        <span className="pactor-chat-inspector__title">
          {inList ? '产物目录' : (active?.title ?? '产出物')}
        </span>
        <Icon name="chevron-down" size={12} />
      </span>
    </DropdownMenu>
  );
}

/** 经 ChromeSlot 注册进 ambient registry 的 chat 内部组件（不覆盖宿主同名） */
export const PANEL_HEADER_INTERNAL_COMPONENTS = {
  ChatPanelCloseButton,
  ChatPanelDownloadButton,
  ChatPanelListButton,
  ChatPanelArtifactMenu,
};

export function buildPanelHeaderFragment(props: {
  title: string;
  kind: ChatArtifact['kind'];
  /** 多产物场景在 header 左端展示目录列表切换钮 */
  showListButton?: boolean;
  /** 有激活产物时在 header 右端展示下载钮 */
  showDownload?: boolean;
  /** 有产物清单时文件名处渲染切换下拉（否则纯标题文本） */
  showMenu?: boolean;
  /** 当前视图：list 时隐藏 kind 角标（标题已由下拉显示"产物目录"） */
  view?: 'content' | 'list';
}): ChromeFragment {
  return {
    requires: [
      'Flex',
      'Text',
      'Badge',
      'ChatPanelCloseButton',
      'ChatPanelDownloadButton',
      'ChatPanelListButton',
      'ChatPanelArtifactMenu',
    ],
    node: {
      type: 'Flex',
      props: {
        justify: 'space-between',
        align: 'center',
        gap: 'small',
        className: 'pactor-chat-inspector__header-dsl',
      },
      children: [
        {
          type: 'Flex',
          props: { align: 'center', gap: 'small' },
          children: [
            ...(props.showListButton ? [{ type: 'ChatPanelListButton' }] : []),
            props.showMenu
              ? { type: 'ChatPanelArtifactMenu' }
              : {
                  type: 'Text',
                  props: {
                    text: props.title,
                    strong: true,
                    className: 'pactor-chat-inspector__title',
                  },
                },
            ...(props.view === 'list'
              ? []
              : [
                  {
                    type: 'Badge',
                    props: {
                      text: props.kind,
                      variant: 'secondary',
                      className: 'pactor-chat-inspector__kind',
                    },
                  },
                ]),
          ],
        },
        {
          type: 'Flex',
          props: { align: 'center', gap: 'small' },
          children: [
            ...(props.showDownload ? [{ type: 'ChatPanelDownloadButton' }] : []),
            { type: 'ChatPanelCloseButton' },
          ],
        },
      ],
    },
  };
}
