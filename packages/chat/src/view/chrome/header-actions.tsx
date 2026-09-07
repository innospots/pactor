import type { ChatHeaderAction } from '../WorkspaceHeader.js';

import type { ChromeFragment } from './ChromeSlot.js';

/**
 * header 操作组 chrome 片段（spec: chat-on-ui-components /
 * chat-dsl-component Header 配置）：Tooltip > Button(text) > Icon，
 * 按 headerActions 数组顺序；点击经 chat.headerAction 内建动作接回
 * 包内 export / theme / clear 行为与并行事件（契约不变）。
 * headerExtra 在上游已是解析后节点（DslNode 经 DslNodeSlot 渲染），
 * 不进片段。
 */
export function buildHeaderActionsFragment(props: {
  actions: ChatHeaderAction[];
  theme: 'light' | 'dark';
}): ChromeFragment {
  const meta: Record<ChatHeaderAction, { label: string; icon: string }> = {
    export: { label: '导出 Markdown', icon: 'download' },
    theme: {
      label: props.theme === 'dark' ? '切换为浅色' : '切换为深色',
      icon: props.theme === 'dark' ? 'sun' : 'moon',
    },
    clear: { label: '清空会话', icon: 'trash2' },
  };
  return {
    requires: ['Flex', 'Tooltip', 'Button', 'Icon'],
    node: {
      type: 'Flex',
      props: { gap: 'small', align: 'center' },
      children: props.actions.map((action) => ({
        type: 'Tooltip',
        props: { content: meta[action].label },
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
                { action: 'chat.headerAction', params: { action } },
              ],
            },
            children: [
              {
                type: 'Icon',
                props: { name: meta[action].icon, size: 15 },
              },
            ],
          },
        ],
      })),
    },
  };
}
