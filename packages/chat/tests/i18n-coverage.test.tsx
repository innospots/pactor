// @vitest-environment jsdom
import './setup.js';

/**
 * chat 内置文案国际化覆盖（spec: i18n「内置组件默认文案国际化」）：
 * 缺省（无 Provider）保持中文；Provider locale=en-US 时渲染英文。
 * 断言均走缺省文案的可见文本 / aria-label，保障中文默认不回归。
 */
import { createI18nContext } from '@pactor-app/core';
import { I18nContextProvider } from '@pactor-app/runtime';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ActivityTrace,
  ConversationStore,
  MessageActions,
  MessageBubble,
  ChatView,
  type ChatMessage,
} from '../src/index.js';

afterEach(cleanup);

function withLocale(locale: string, children: ReactNode): ReactNode {
  const i18n = createI18nContext({ locale, messages: {} });
  return (
    <I18nContextProvider value={i18n}>{children}</I18nContextProvider>
  );
}

const completedAssistant: ChatMessage = {
  id: 'a1',
  role: 'assistant',
  status: 'completed',
  parts: [{ type: 'text', content: '回答内容', status: 'ready' }],
};

const completedUser: ChatMessage = {
  id: 'u1',
  role: 'user',
  status: 'completed',
  parts: [{ type: 'text', content: '问题内容', status: 'ready' }],
};

describe('i18n 覆盖：ChatView 空态与输入框', () => {
  it('缺省中文：问候语与输入占位', () => {
    render(<ChatView store={new ConversationStore()} />);
    expect(screen.getByText('你好，有什么可以帮你？')).toBeTruthy();
    expect(
      screen.getByPlaceholderText('输入消息，Enter 发送，Shift+Enter 换行'),
    ).toBeTruthy();
  });

  it('en-US：问候语与输入占位', () => {
    render(withLocale('en-US', <ChatView store={new ConversationStore()} />));
    expect(screen.getByText('Hello, how can I help?')).toBeTruthy();
    expect(
      screen.getByPlaceholderText(
        'Type a message. Enter to send, Shift+Enter for a new line',
      ),
    ).toBeTruthy();
  });
});

describe('i18n 覆盖：消息操作条', () => {
  it('缺省中文：复制 / 重新生成', () => {
    render(
      <MessageActions
        message={completedAssistant}
        showRegenerate
        onRegenerate={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: '复制' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '重新生成' })).toBeTruthy();
  });

  it('en-US：Copy / Regenerate 与已复制反馈', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    render(
      withLocale(
        'en-US',
        <MessageActions
          message={completedAssistant}
          showRegenerate
          onRegenerate={() => {}}
        />,
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('button', { name: 'Regenerate' })).toBeTruthy();
    await screen.findByRole('button', { name: 'Copied' });
  });
});

describe('i18n 覆盖：用户消息编辑框', () => {
  it('缺省中文：编辑消息 / 发送 / 取消', () => {
    render(
      <MessageBubble message={completedUser} onEditResend={() => {}} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '编辑' }));
    expect(screen.getByLabelText('编辑消息')).toBeTruthy();
    expect(screen.getByRole('button', { name: '确认发送' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '取消' })).toBeTruthy();
  });

  it('en-US：Edit message / Confirm and send / Cancel', () => {
    render(
      withLocale(
        'en-US',
        <MessageBubble message={completedUser} onEditResend={() => {}} />,
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText('Edit message')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Confirm and send' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
  });
});

describe('i18n 覆盖：活动轨迹状态', () => {
  const streaming: ChatMessage = {
    id: 'a2',
    role: 'assistant',
    status: 'streaming',
    parts: [{ type: 'text', content: '生成中', status: 'streaming' }],
  };

  it('缺省中文：正文流式阶段', () => {
    render(<ActivityTrace message={streaming} />);
    expect(screen.getByText('正在生成回复…')).toBeTruthy();
  });

  it('en-US：正文流式阶段', () => {
    render(withLocale('en-US', <ActivityTrace message={streaming} />));
    expect(screen.getByText('Generating response…')).toBeTruthy();
  });
});
