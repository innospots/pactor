import type { DslNode } from '@pactor-app/core';

import type { ChromeFragment } from './ChromeSlot.js';
import type { ChatSuggestion } from '../EmptyState.js';

function suggestionLabel(suggestion: ChatSuggestion): string {
  return typeof suggestion === 'string' ? suggestion : suggestion.label;
}

function suggestionPrompt(suggestion: ChatSuggestion): string {
  return typeof suggestion === 'string'
    ? suggestion
    : (suggestion.prompt ?? suggestion.label);
}

/**
 * 空态区 chrome 片段（spec: chat-chrome-dsl / chat-empty-state）：
 * 问候语（Typography，className 复用 chat 皮肤类保住 display 衬线
 * 字体栈）+ 副标题（Text secondary）+ 建议按钮组（Button，
 * chat.sendSuggestion 内建动作接回 ChatView 发送路径）。
 * 外层 pactor-chat-empty 容器与居中组布局留在 chat 侧（EmptyState）。
 */
export function buildEmptyStateFragment(props: {
  greeting: string;
  subtitle?: string;
  suggestions?: ChatSuggestion[];
}): ChromeFragment {
  const children: DslNode[] = [
    {
      type: 'Typography',
      props: {
        variant: 'h3',
        text: props.greeting,
        className: 'pactor-chat-empty__greeting',
      },
    },
  ];
  if (props.subtitle) {
    children.push({
      type: 'Text',
      props: {
        type: 'secondary',
        text: props.subtitle,
        className: 'pactor-chat-empty__subtitle',
      },
    });
  }
  if (props.suggestions && props.suggestions.length > 0) {
    children.push({
      type: 'Flex',
      props: {
        gap: 'small',
        justify: 'center',
        className: 'pactor-chat-empty__suggestions',
      },
      children: props.suggestions.map((suggestion) => ({
        type: 'Button',
        props: {
          text: suggestionLabel(suggestion),
          variant: 'default',
          size: 'middle',
          className: 'pactor-chat-empty__suggestion',
        },
        events: {
          onClick: [
            {
              action: 'chat.sendSuggestion',
              params: { text: suggestionPrompt(suggestion) },
            },
          ],
        },
      })),
    });
  }
  return {
    requires: ['Flex', 'Typography', 'Text', 'Button'],
    node: {
      type: 'Flex',
      props: { direction: 'vertical', align: 'center', gap: 'middle' },
      children,
    },
  };
}
