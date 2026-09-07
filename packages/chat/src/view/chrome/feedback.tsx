import type { ChromeFragment } from './ChromeSlot.js';

/**
 * PartRenderer 反馈类 chrome 片段（spec: chat-chrome-dsl / chat-view）：
 * error 警示条（Alert error）与 status / dsl-pending 弱提示
 * （Text secondary）。均无交互，无需内建动作。
 */
export function buildErrorFragment(message: string): ChromeFragment {
  return {
    requires: ['Alert'],
    node: {
      type: 'Alert',
      props: { variant: 'error', message },
    },
  };
}

export function buildStatusFragment(text: string): ChromeFragment {
  return {
    requires: ['Text'],
    node: {
      type: 'Text',
      props: { type: 'secondary', text },
    },
  };
}
