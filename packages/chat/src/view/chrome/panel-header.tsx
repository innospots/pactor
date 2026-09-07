import type { ChatArtifact } from '../../artifact.js';

import type { ChromeFragment } from './ChromeSlot.js';

/**
 * 产出物面板标题栏 chrome 片段（spec: chat-on-ui-components /
 * chat-artifact-panel）：Text strong（标题）+ Badge（kind 角标）+
 * 关闭钮（chat.panelClose 内建动作接回 onClose）。拖拽调宽手柄与
 * 内容区渲染器保持 chat 实现，不进片段。
 */
export function buildPanelHeaderFragment(props: {
  title: string;
  kind: ChatArtifact['kind'];
}): ChromeFragment {
  return {
    requires: ['Flex', 'Text', 'Badge', 'Tooltip', 'Button', 'Icon'],
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
            {
              type: 'Text',
              props: {
                text: props.title,
                strong: true,
                className: 'pactor-chat-inspector__title',
              },
            },
            {
              type: 'Badge',
              props: {
                text: props.kind,
                variant: 'secondary',
                className: 'pactor-chat-inspector__kind',
              },
            },
          ],
        },
        {
          type: 'Tooltip',
          props: { content: '关闭面板' },
          children: [
            {
              type: 'Button',
              props: {
                variant: 'text',
                size: 'small',
                className: 'pactor-chat-icon-button pactor-chat-inspector__close',
              },
              events: {
                onClick: [{ action: 'chat.panelClose' }],
              },
              children: [
                { type: 'Icon', props: { name: 'circle-x', size: 15 } },
              ],
            },
          ],
        },
      ],
    },
  };
}
