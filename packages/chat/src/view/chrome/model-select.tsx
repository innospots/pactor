import type { ChatModelOption } from '../../model.js';

import type { ChromeFragment } from './ChromeSlot.js';

/**
 * 模型选择 chrome 片段（spec: chat-on-ui-components / chat-model-selector）：
 * ui Select 承载（options / 受控 value / onChange 语义等同），选择经
 * chat.modelChange 内建动作接回受控规则 D5；DSL 环境视觉向 ui kit
 * 对齐（pactor-chat-model-select 类收敛尺寸），fallback 保留原 chip。
 */
export function buildModelSelectFragment(props: {
  models: ChatModelOption[];
  model?: string;
}): ChromeFragment {
  return {
    requires: ['Select'],
    node: {
      type: 'Select',
      props: {
        options: props.models.map((option) => ({
          value: option.value,
          label: option.label,
        })),
        value: props.model,
        className: 'pactor-chat-model-select',
      },
      events: {
        onChange: [
          { action: 'chat.modelChange', params: { value: '${event}' } },
        ],
      },
    },
  };
}
