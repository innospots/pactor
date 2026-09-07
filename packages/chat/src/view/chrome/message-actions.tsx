import type { ResolvedMessageAction } from '../MessageActions.js';

import type { ChromeFragment } from './ChromeSlot.js';

/**
 * 消息操作条 chrome 片段（spec: chat-chrome-dsl / chat-message-actions）：
 * Tooltip(content=label) > Button(variant=text，复用 pactor-chat-icon-button
 * 皮肤类) > Icon 的按钮组；点击统一经 chat.messageAction 内建动作按
 * token（message.id）寻址 per-instance dispatcher——复制 / 重新生成 /
 * 重试 / 编辑与自定义 service 派发的行为实现全部留在 MessageActions
 * 包内（与回退路径同一份 dispatch）。
 * hover 显现容器与可见性求值留在 chat 侧（MessageActions）。
 */

export function buildMessageActionsFragment(args: {
  actions: ResolvedMessageAction[];
  copied: boolean;
  token: string;
}): ChromeFragment {
  const { actions, copied, token } = args;
  return {
    requires: ['Flex', 'Tooltip', 'Button', 'Icon'],
    node: {
      type: 'Flex',
      props: { gap: 'small' },
      children: actions.map((action) => {
        const copiedFeedback = action.builtin === 'copy' && copied;
        const label = copiedFeedback ? '已复制' : action.label;
        const iconName = copiedFeedback ? 'check' : action.icon;
        return {
          type: 'Tooltip',
          props: { content: label },
          children: [
            {
              type: 'Button',
              props: {
                variant: 'text',
                size: 'small',
                className: 'pactor-chat-icon-button',
              },
              events: {
                onClick: [
                  {
                    action: 'chat.messageAction',
                    params: { token, actionId: action.id },
                  },
                ],
              },
              children: [
                {
                  type: 'Icon',
                  props: {
                    // 契约图标名直通 ui Icon 白名单（spec: chat-icon-convergence；
                    // 未知名由 ui Icon 渲染占位）
                    name: iconName ?? 'help-circle',
                    size: 14,
                  },
                },
              ],
            },
          ],
        };
      }),
    },
  };
}
