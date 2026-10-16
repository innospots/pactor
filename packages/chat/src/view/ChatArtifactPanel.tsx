import {
  ArtifactPanel as UiArtifactPanel,
} from '../components/ArtifactPanel/index.js';
import { downloadArtifact } from '../components/ArtifactPanel/download.js';
import type { ArtifactViewers } from '../components/ArtifactPanel/index.js';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import type { ChatArtifact } from '../artifact.js';
import type { Registry } from '@pactor-app/core';
import { setChatChromeHandlers } from './chrome/actions.js';
import { ChromeSlot } from './chrome/ChromeSlot.js';
import {
  buildPanelHeaderFragment,
  ChatPanelArtifactMenu,
  ChatPanelCloseButton,
  ChatPanelContext,
  ChatPanelDownloadButton,
  ChatPanelListButton,
  PANEL_HEADER_INTERNAL_COMPONENTS,
} from './chrome/panel-header.js';

// 产物目录树 / 查看器类型：单一实现归属包内展示组件层
// （src/components/ArtifactPanel），此处再导出保持导出面稳定
export { buildArtifactTree } from '../components/ArtifactPanel/artifact.js';
export type {
  ArtifactTreeNode,
} from '../components/ArtifactPanel/artifact.js';
export type {
  ArtifactViewer,
  ArtifactViewers,
} from '../components/ArtifactPanel/index.js';

/**
 * ArtifactPanel（spec: chat-artifact-panel）：chat 组合层——展示由包内
 * 展示组件（src/components/ArtifactPanel，单一实现，自 @pactor-app/ui
 * 迁入）承载，本层保留 chat 运行时
 * 接线：整对象 onSelectArtifact（ui 为 id 形式，经 artifacts 回查）、
 * 面板皮肤类（pactor-chat-inspector）、拖拽调宽（resizable 常开）与
 * chrome DSL 标题栏（ChatPanel* 内部组件 + chat.panelClose /
 * panelToggleList / panelDownload 包级动作桥接，无 renderer 或类型
 * 缺失时回退同一组内部组件的手写组合）。
 *
 * 目录列表视图状态由本层受控持有（ui view / onViewChange），chrome
 * 标题栏的目录钮 / 切换下拉经 ChatPanelContext 共享同一状态。
 */
export interface ArtifactPanelProps {
  /** 当前产出物；null 时内容区为空态（inspector 槽场景常见） */
  artifact?: ChatArtifact | null;
  /**
   * 会话内全部产出物（多产物场景）：提供后 header 左端展示目录列表
   * 切换钮，文件名处展示产物切换下拉
   */
  artifacts?: ChatArtifact[];
  /** 当前激活产出物 id（下拉高亮；缺省取 artifact.id） */
  activeArtifactId?: string;
  /** 下拉 / 目录列表点击切换回调（受控切换，面板不自改外部状态） */
  onSelectArtifact?: (artifact: ChatArtifact) => void;
  /**
   * 定位产物目录视图的请求信号（卡片区"查看所有产物"）：数值变化即
   * 切换列表视图并经 onViewRequestConsumed 消费复位（消费后普通
   * 打开回内容视图）
   */
  viewRequest?: number | null;
  /** viewRequest 消费回调（组合层复位信号） */
  onViewRequestConsumed?: () => void;
  /** 面板内容槽：提供时整体替代内建渲染器（标题栏保留） */
  inspector?: ReactNode;
  /** 关闭按钮 / 遮罩点击回调 */
  onClose?: () => void;
  /** 下载回调；缺省内部走浏览器下载（downloadArtifact） */
  onDownload?: (artifact: ChatArtifact) => void;
  /** dsl 产出物活预览的 Safe Registry；缺省时 dsl 内容渲染降级块 */
  safeRegistry?: Registry<unknown>;
  /** 注入 dsl 预览作用域 user */
  user?: Record<string, unknown>;
  /**
   * 自定义产物查看器（spec: chat-artifact-panel / 自定义预览）：
   * 按扩展名 / kind 对特定文件格式提供自定义预览，优先于内建渲染器
   */
  artifactViewers?: ArtifactViewers;
  className?: string;
}

export function ArtifactPanel({
  artifact,
  artifacts,
  activeArtifactId,
  onSelectArtifact,
  viewRequest,
  onViewRequestConsumed,
  inspector,
  onClose,
  onDownload,
  safeRegistry,
  user,
  artifactViewers,
  className,
}: ArtifactPanelProps): ReactNode {
  // 目录列表视图状态：受控持有（ui onViewChange 回写），chrome 标题栏
  // 内部组件经 ChatPanelContext 共享
  const [view, setView] = useState<'content' | 'list'>('content');
  const activeId = activeArtifactId ?? artifact?.id;
  const hasArtifacts = artifacts !== undefined && artifacts.length > 0;
  const headerTitle = view === 'list' ? '产物目录' : (artifact?.title ?? '产出物');

  // chrome 桥接（spec: chat-on-ui-components）：chat.panelClose /
  // panelToggleList / panelDownload 内建动作 → 回调（refs 保证最新；
  // 单活动面板语义，与既有实现一致）
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const artifactRef = useRef(artifact);
  artifactRef.current = artifact;
  const downloadRef = useRef(onDownload);
  downloadRef.current = onDownload;
  useEffect(() => {
    setChatChromeHandlers({
      panelClose: () => closeRef.current?.(),
      panelToggleList: () =>
        setView((value) => (value === 'list' ? 'content' : 'list')),
      panelDownload: () => {
        const current = artifactRef.current;
        if (current) {
          if (downloadRef.current) {
            downloadRef.current(current);
          } else {
            void downloadArtifact(current);
          }
        }
      },
    });
  }, []);

  // ui 侧 onSelectArtifact 为 id 形式：经 artifacts 回查整对象透出
  const handleSelectArtifact = (id: string): void => {
    const target = artifacts?.find((item) => item.id === id);
    if (target) {
      onSelectArtifact?.(target);
    }
  };

  // chrome 标题栏回退（无 renderer / 类型缺失）：与 DSL 片段同语义的
  // 手写组合（内部组件经 ChatPanelContext / 包级 handlers 取行为）
  const headerFallback = (
    <>
      {hasArtifacts ? <ChatPanelListButton /> : null}
      {hasArtifacts ? (
        <ChatPanelArtifactMenu />
      ) : (
        <span className="pactor-chat-inspector__title">{headerTitle}</span>
      )}
      {view !== 'list' && artifact ? (
        <span className="pactor-chat-inspector__kind">{artifact.kind}</span>
      ) : null}
      {artifact != null ? <ChatPanelDownloadButton /> : null}
      <ChatPanelCloseButton />
    </>
  );

  return (
    <ChatPanelContext.Provider
      value={{
        artifacts: artifacts ?? [],
        activeId,
        view,
        onSelectArtifact,
      }}
    >
      <UiArtifactPanel
        artifact={artifact}
        artifacts={artifacts}
        activeArtifactId={activeArtifactId}
        onSelectArtifact={handleSelectArtifact}
        view={view}
        onViewChange={setView}
        viewRequest={viewRequest}
        onViewRequestConsumed={onViewRequestConsumed}
        inspector={inspector}
        onClose={onClose}
        onDownload={onDownload}
        safeRegistry={safeRegistry}
        user={user}
        artifactViewers={artifactViewers}
        resizable
        className={
          className ? `pactor-chat-inspector ${className}` : 'pactor-chat-inspector'
        }
        header={
          <div className="pactor-chat-inspector__header">
            <ChromeSlot
              fragment={buildPanelHeaderFragment({
                title: headerTitle,
                kind: artifact?.kind ?? 'text',
                showListButton: hasArtifacts,
                showDownload: artifact != null,
                showMenu: hasArtifacts,
                view,
              })}
              components={PANEL_HEADER_INTERNAL_COMPONENTS}
              fallback={headerFallback}
            />
          </div>
        }
      />
    </ChatPanelContext.Provider>
  );
}
