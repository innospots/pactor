import { Icon } from '@pactor-app/ui/components';
import type { ReactNode } from 'react';

import type { ChatArtifact } from '../../artifact.js';
import { invokeChatPanelClose } from './actions.js';
import type { ChromeFragment } from './ChromeSlot.js';

/**
 * 产出物面板标题栏 chrome 片段（spec: chat-on-ui-components /
 * chat-artifact-panel）：Text strong（标题）+ Badge（kind 角标）+
 * 关闭钮（chat 内部组件，行为直调包级 panelClose handler——与
 * chat.panelClose 动作同一注册表）。拖拽调宽手柄与内容区渲染器
 * 保持 chat 实现，不进片段。
 */

/**
 * 面板关闭钮内部组件：原生 title 提示与 aria-label（和 fallback 及
 * Composer 内建钮一致——不用 ui Tooltip，portal 到 body 后脱离
 * chrome 令牌与宿主皮肤作用域，气泡配色与皮肤不一致）
 */
function ChatPanelCloseButton(): ReactNode {
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

/** 经 ChromeSlot 注册进 ambient registry 的 chat 内部组件（不覆盖宿主同名） */
export const PANEL_HEADER_INTERNAL_COMPONENTS = { ChatPanelCloseButton };

export function buildPanelHeaderFragment(props: {
  title: string;
  kind: ChatArtifact['kind'];
}): ChromeFragment {
  return {
    requires: ['Flex', 'Text', 'Badge', 'ChatPanelCloseButton'],
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
        { type: 'ChatPanelCloseButton' },
      ],
    },
  };
}
