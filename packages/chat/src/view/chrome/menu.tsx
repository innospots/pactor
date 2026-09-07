import type { ChatMenuItem } from '../Chat.js';

import type { ChromeFragment } from './ChromeSlot.js';

/**
 * 侧栏菜单 chrome 片段（spec: chat-on-ui-components / chat-dsl-component
 * 左侧菜单配置）：ChatMenuItem[] → ui Menu items（badge / dot / group /
 * disabled 经 Menu 扩展字段表达；icon 契约名直通 ui Icon 白名单，
 * 未知名由 ui Icon 渲染占位），selectedKey 受控高亮；选择经
 * chat.menuSelect 内建动作接回包内传播（onMenuSelect + 移动端
 * drawer close，语义与手写路径一致）。
 */
export function buildSidebarMenuFragment(props: {
  menu: ChatMenuItem[];
  activeMenuKey?: string;
}): ChromeFragment {
  return {
    requires: ['Menu'],
    node: {
      type: 'Menu',
      props: {
        mode: 'inline',
        selectedKey: props.activeMenuKey,
        items: props.menu.map((item) => ({
          key: item.key,
          label: item.label,
          ...(item.icon !== undefined ? { icon: item.icon } : {}),
          ...(item.badge !== undefined ? { badge: item.badge } : {}),
          ...(item.dot === true ? { dot: true } : {}),
          ...(item.group !== undefined ? { group: item.group } : {}),
          ...(item.disabled === true ? { disabled: true } : {}),
        })),
      },
      events: {
        onSelect: [{ action: 'chat.menuSelect', params: { key: '${event}' } }],
      },
    },
  };
}
