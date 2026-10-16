// @vitest-environment jsdom
/**
 * registerChatComponents 注册契约（spec: chat-ui-components /
 * 展示组件 DSL 注册 + chat-dsl-component / Chat 展示组件注册）：
 * 18 个 DSL 类型名注册、同名不覆盖、ui createComponentRegistry 不内置。
 */
import './setup.js';

import { createComponentRegistry } from '@pactor-app/ui/components';
import { cleanup, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { registerChatComponents } from '../src/components/index.js';
import { renderDsl } from './helpers.js';

afterEach(cleanup);

const CHAT_COMPONENT_TYPES = [
  'ChatPage',
  'Bubble',
  'ChatMessage',
  'MessageList',
  'Composer',
  'ConversationList',
  'ArtifactPanel',
  'AgentStatus',
  'Attachment',
  'Citation',
  'Prompt',
  'Sender',
  'StepsPanel',
  'StreamingText',
  'Suggestion',
  'Thinking',
  'ToolCall',
  'Welcome',
];

describe('registerChatComponents（spec: chat-ui-components / 展示组件 DSL 注册）', () => {  it('注册 18 个 chat 展示组件类型名，注册后可声明渲染 ChatPage（spec scenario: 注册并声明）', () => {
    const registry = createComponentRegistry();
    registerChatComponents(registry);
    for (const type of CHAT_COMPONENT_TYPES) {
      expect(registry.has(type), type).toBe(true);
    }

    renderDsl({
      type: 'ChatPage',
      props: { conversationTitle: '会话', messages: [] },
    });
    expect(document.querySelector('[data-slot=chat-page]')).not.toBeNull();
    expect(screen.getByText('会话')).toBeTruthy();
  });

  it('同名不覆盖：已注册类型保留原实现（spec scenario: 不覆盖已有注册）', () => {
    const registry = createComponentRegistry();
    const HostChatPage = () => <div data-testid="host-chat-page" />;
    registry.register('ChatPage', HostChatPage);
    registerChatComponents(registry);
    expect(registry.get('ChatPage')).toBe(HostChatPage);
  });

  it('ui createComponentRegistry 不内置 chat 类型（spec scenario: 未注册时不内置）', () => {
    const registry = createComponentRegistry();
    for (const type of CHAT_COMPONENT_TYPES) {
      expect(registry.has(type), type).toBe(false);
    }
  });
});

describe('样式独立分发（spec: chat-ui-components / 样式独立分发）', () => {
  it('样式源文件为 lean 形式（无 preflight / 桥接 import）；编译产物含迁移组件工具类', () => {
    const src = readFileSync(join(__dirname, '../src/styles.css'), 'utf8');
    // lean 模式（与 blocks/chart 同一契约）：theme + utilities 层，无 preflight
    expect(src).toContain("@import 'tailwindcss/theme.css' layer(theme)");
    expect(src).toContain("@import 'tailwindcss/utilities.css' layer(utilities)");
    // 语义令牌桥全仓单源：无 @theme inline 拷贝
    expect(src).toContain("@import '@pactor-app/ui/theme-bridge.css'");
    expect(src).not.toContain('@theme inline');
    expect(src).toContain('--pactor-chat-rail-width:');
    expect(src).toContain('--pactor-chat-rail-popover-width:');

    // 编译产物（build:styles 输出）：迁移组件工具类与 rail 令牌随包分发；
    // preflight 由 ui 提供，chat 产物不含盒模型基线
    const built = readFileSync(join(__dirname, '../styles.css'), 'utf8');
    expect(built).toContain('--pactor-chat-rail-width:');
    expect(built).toContain('scrollbar-subtle');
    expect(built).toContain('rounded-xl');
    expect(built).not.toContain('@layer base {');
    // 桥接内联：bg-background 等语义工具类可用
    expect(built).toContain('bg-background');
  });
});
