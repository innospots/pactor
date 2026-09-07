import type { ChatArtifact } from '../../artifact.js';

import type { ChromeFragment } from './ChromeSlot.js';

/**
 * artifact 卡片 chrome 片段（spec: chat-chrome-dsl / chat-artifact-panel）：
 * Card 外壳 + 标题（Text strong）+ kind 角标（Badge）+ 「在面板中打开」
 * 按钮（chat.openArtifact 内建动作接回 ChatView 的 onOpenArtifact 回调，
 * artifact 对象随 params 传入）。className 复用 chat 皮肤类，与回退
 * 实现共享视觉令牌。
 */
export function buildArtifactCardFragment(
  artifact: ChatArtifact,
): ChromeFragment {
  return {
    requires: ['Card', 'Flex', 'Text', 'Badge', 'Button'],
    node: {
      type: 'Card',
      props: { className: 'pactor-chat-artifact-card' },
      children: [
        {
          type: 'Flex',
          props: { justify: 'space-between', align: 'center', gap: 'small' },
          children: [
            {
              type: 'Text',
              props: {
                text: artifact.title,
                strong: true,
                className: 'pactor-chat-artifact-card__title',
              },
            },
            {
              type: 'Badge',
              props: {
                text: artifact.kind,
                variant: 'secondary',
                className: 'pactor-chat-artifact-card__kind',
              },
            },
            {
              type: 'Button',
              props: {
                text: '在面板中打开',
                variant: 'default',
                size: 'small',
                className: 'pactor-chat-artifact-card__open',
              },
              events: {
                onClick: [
                  {
                    action: 'chat.openArtifact',
                    params: { artifact },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };
}
