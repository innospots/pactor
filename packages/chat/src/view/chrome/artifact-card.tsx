import { Icon } from '@pactor-app/ui/components';
import { useI18n } from '@pactor-app/runtime';
import { useState, type ReactNode } from 'react';

import type { ChatArtifact } from '../../artifact.js';
import {
  formatArtifactSize,
  resolveArtifactFileType,
  resolveArtifactIcon,
} from '../../artifact.js';
import {
  invokeChatOpenArtifact,
  invokeChatOpenArtifactList,
} from './actions.js';
import type { ChromeFragment } from './ChromeSlot.js';

/**
 * artifact 卡片（spec: chat-chrome-dsl / chat-artifact-panel）：
 * 整卡可点击的产物卡片——文件类型图标（着色图标盒，扩展名优先
 * kind 兜底）+ 标题 + 元信息行（尺寸 · 类型标签）+ 右上箭头，
 * 点击经 invokeChatOpenArtifact 走 chat.openArtifact 同一 handlers
 * 注册表（DSL 片段与 fallback 共用本组件，行为零分叉）。
 *
 * 图标盒按文件类型着色（tone：表格 green / 数据 amber / 代码 blue /
 * 图片 violet / 文档与兜底 slate），修饰类
 * pactor-chat-artifact-card--{tone} 挂在卡片根上。
 */

/** 卡片元信息行：尺寸（meta.size 字节数）· 类型标签（扩展名大写，缺省 kind 大写） */
export function artifactCardMeta(artifact: ChatArtifact): string {
  const ext = resolveArtifactFileType(artifact);
  const typeLabel = (ext ?? artifact.kind).toUpperCase();
  const sizeLabel = formatArtifactSize(artifact.meta?.['size']);
  return [sizeLabel, typeLabel].filter(Boolean).join(' · ');
}

/** 产物卡片本体（chat 内部组件，DSL 片段与 fallback 共用） */
export function ChatArtifactCard({
  artifact,
}: {
  artifact: ChatArtifact;
}): ReactNode {
  const { t } = useI18n();
  const icon = resolveArtifactIcon(artifact);
  const meta = artifactCardMeta(artifact);
  const openLabel = t('pactor.chat.artifact.openInPanel', {
    title: artifact.title,
  });
  return (
    <button
      type="button"
      className={`pactor-chat-artifact-card pactor-chat-artifact-card--${icon.tone}`}
      data-artifact-kind={artifact.kind}
      aria-label={openLabel}
      title={openLabel}
      onClick={() => invokeChatOpenArtifact(artifact)}
    >
      <span className="pactor-chat-artifact-card__icon">
        <Icon name={icon.name} size={20} />
      </span>
      <span className="pactor-chat-artifact-card__text">
        <span className="pactor-chat-artifact-card__title">
          {artifact.title}
        </span>
        {meta ? (
          <span className="pactor-chat-artifact-card__meta">{meta}</span>
        ) : null}
      </span>
      <span className="pactor-chat-artifact-card__arrow">
        <Icon name="arrow-up-right" size={14} />
      </span>
    </button>
  );
}

/** 经 ChromeSlot 注册进 ambient registry 的 chat 内部组件（不覆盖宿主同名） */
export const ARTIFACT_CARD_INTERNAL_COMPONENTS = {
  ChatArtifactCard,
  ChatArtifactCardGroup,
};

/** 卡片区收起阈值：连续产物卡片多于 4 个时只展示前 4 个 */
export const ARTIFACT_CARD_GROUP_LIMIT = 4;

/**
 * 连续产物卡片组（spec: chat-artifact-panel / 卡片区收起）：
 * 同一消息内连续的 artifact part 合为一组渲染；多于
 * ARTIFACT_CARD_GROUP_LIMIT 个时只展示前 4 个，下方右侧
 * 「展开 / 收起」切换查看全部，其右侧「查看所有产物(n) ›」
 * 经 invokeChatOpenArtifactList 打开面板并定位产物目录视图。
 */
export function ChatArtifactCardGroup({
  artifacts,
}: {
  artifacts: ChatArtifact[];
}): ReactNode {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const overflow = artifacts.length > ARTIFACT_CARD_GROUP_LIMIT;
  const visible =
    overflow && !expanded
      ? artifacts.slice(0, ARTIFACT_CARD_GROUP_LIMIT)
      : artifacts;
  return (
    <div className="pactor-chat-artifact-group">
      {visible.map((artifact) => (
        <ChatArtifactCard key={artifact.id} artifact={artifact} />
      ))}
      {overflow ? (
        <div className="pactor-chat-artifact-group__footer">
          <button
            type="button"
            className="pactor-chat-artifact-group__toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            <Icon
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={12}
            />
            {expanded
              ? t('pactor.chat.artifact.collapse')
              : t('pactor.chat.artifact.expand')}
          </button>
          <button
            type="button"
            className="pactor-chat-artifact-group__all"
            onClick={() => invokeChatOpenArtifactList()}
          >
            {t('pactor.chat.artifact.viewAll', { count: artifacts.length })}
            <Icon name="chevron-right" size={12} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * artifact 卡片 chrome 片段：结构 / 行为全部收敛进 ChatArtifactCard
 * 内部组件（卡片不再由通用 DSL 组件拼装——整卡点击、着色图标盒、
 * 元信息行是产物卡片的固有结构，暴露为 DSL 拼装细节只会增加
 * 宿主覆盖面的不一致风险）。
 */
export function buildArtifactCardFragment(
  artifact: ChatArtifact,
): ChromeFragment {
  return {
    requires: ['ChatArtifactCard'],
    node: {
      type: 'ChatArtifactCard',
      props: { artifact },
    },
  };
}

/** 连续产物卡片组 chrome 片段（MessageBubble 按 artifact 连续段构建） */
export function buildArtifactCardGroupFragment(
  artifacts: ChatArtifact[],
): ChromeFragment {
  return {
    requires: ['ChatArtifactCardGroup'],
    node: {
      type: 'ChatArtifactCardGroup',
      props: { artifacts },
    },
  };
}
