// @vitest-environment jsdom
import './setup.js';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyChatEvent,
  ChatView,
  ConversationStore,
} from '../src/index.js';

afterEach(cleanup);

function createStore(): ConversationStore {
  return new ConversationStore();
}

describe('ActivityTrace 流式状态头（spec: chat-activity-trace / 流式状态头）', () => {
  it('模式推导：reasoning → tool → responding（spec: 模式推导）', () => {
    const store = createStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
    render(<ChatView store={store} />);
    // 无活动 part：通用响应文案
    expect(screen.getByText('正在响应…')).toBeTruthy();

    act(() => {
      applyChatEvent(store, { type: 'thinking.delta', messageId: 'a1', delta: '嗯' });
    });
    expect(screen.getByText('正在思考…')).toBeTruthy();

    act(() => {
      applyChatEvent(store, {
        type: 'tool.start',
        messageId: 'a1',
        name: 'search',
        title: '搜索数据',
        args: { q: '营收' },
      });
    });
    expect(screen.getByText('正在调用工具…')).toBeTruthy();

    act(() => {
      applyChatEvent(store, {
        type: 'tool.result',
        messageId: 'a1',
        name: 'search',
        status: 'success',
        result: { total: 3 },
      });
      applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '结论' });
    });
    expect(screen.getByText('正在生成回复…')).toBeTruthy();
  });

  it('结束定格：message.end 后显示完成文案与最终时长，不再跳动（spec: 结束定格）', () => {
    vi.useFakeTimers();
    try {
      const store = createStore();
      applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
      render(<ChatView store={store} />);

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByText('3s')).toBeTruthy();

      act(() => {
        applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '答' });
        applyChatEvent(store, { type: 'message.end', messageId: 'a1' });
      });
      expect(screen.getByText('已完成')).toBeTruthy();

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      // 定格在 3s，不再跳动
      expect(screen.getByText('3s')).toBeTruthy();
      expect(screen.queryByText(/\d+s/)).toBeTruthy();
      expect(screen.queryByText('8s')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('ActivityTrace 配对工具轨迹（spec: chat-activity-trace / 配对工具轨迹）', () => {
  it('tool-call 与 tool-result 配对为单条轨迹行，不再渲染独立状态卡（spec: call 与 result 配对为一行）', () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        {
          type: 'tool-call',
          name: 'search',
          title: '搜索数据',
          args: { q: '营收' },
          status: 'success',
        },
        {
          type: 'tool-result',
          name: 'search',
          status: 'success',
          result: { total: 3 },
        },
        { type: 'text', content: '正文', status: 'ready' },
      ],
    });

    render(<ChatView store={store} />);
    // 不再有旧的独立折叠状态卡
    expect(document.querySelector('.pactor-chat-collapse')).toBeNull();

    // 完成态自动折叠为一行摘要；点击摘要展开轨迹列表
    fireEvent.click(screen.getByText(/已完成 · 1 个工具调用/));
    const entries = document.querySelectorAll('.pactor-chat-trace__entry');
    expect(entries.length).toBe(1);
    expect(entries[0]!.getAttribute('data-status')).toBe('success');
    expect(screen.getByText('搜索数据')).toBeTruthy();
  });

  it('轨迹行展开显示参数与结果 / 错误详情（spec: 展开查看详情 + 轨迹条目携带调用参数）', () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        {
          type: 'tool-call',
          name: 'search',
          title: '搜索数据',
          args: { q: '营收' },
          status: 'failed',
        },
        {
          type: 'tool-result',
          name: 'search',
          status: 'failed',
          error: '上游超时',
        },
      ],
    });

    render(<ChatView store={store} />);
    // 展开轨迹区，再展开条目
    fireEvent.click(screen.getByText(/已完成 · 1 个工具调用/));
    fireEvent.click(screen.getByText('搜索数据'));

    const body = document.querySelector('.pactor-chat-trace__entry-body')!;
    expect(body).toBeTruthy();
    // 参数详情（来自配对 tool-call 的 args）与错误详情
    expect(body.textContent).toContain('"q": "营收"');
    expect(body.textContent).toContain('上游超时');
  });

  it('多个工具调用按序排列，状态图标区分 waiting/running/success/failed', () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'streaming',
      parts: [
        { type: 'tool-call', name: 'a', title: '甲工具', status: 'success' },
        { type: 'tool-result', name: 'a', status: 'success', result: 1 },
        { type: 'tool-call', name: 'b', title: '乙工具', status: 'running' },
        { type: 'tool-call', name: 'c', title: '丙工具', status: 'waiting' },
      ],
    });

    render(<ChatView store={store} />);
    const entries = document.querySelectorAll('.pactor-chat-trace__entry');
    expect(entries.length).toBe(3);
    expect(entries[0]!.getAttribute('data-status')).toBe('success');
    expect(entries[1]!.getAttribute('data-status')).toBe('running');
    expect(entries[2]!.getAttribute('data-status')).toBe('waiting');
    // 顺序与 parts 中 call 顺序一致
    expect(entries[0]!.textContent).toContain('甲工具');
    expect(entries[1]!.textContent).toContain('乙工具');
    expect(entries[2]!.textContent).toContain('丙工具');
  });
});

describe('ActivityTrace 折叠状态机（spec: chat-activity-trace / 轨迹自动折叠）', () => {
  it('流式期间默认展开，正文开始流式后自动折叠为一行摘要（spec: 答案阶段自动折叠）', () => {
    const store = createStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
    applyChatEvent(store, {
      type: 'tool.start',
      messageId: 'a1',
      name: 'search',
      title: '搜索数据',
    });
    render(<ChatView store={store} />);
    // 流式期间（tool 阶段）：轨迹区展开，条目可见
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeTruthy();

    act(() => {
      applyChatEvent(store, {
        type: 'tool.result',
        messageId: 'a1',
        name: 'search',
        status: 'success',
        result: 1,
      });
      applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '正文' });
    });
    // 答案阶段：自动折叠，条目收起
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeNull();
    expect(screen.getByText('正在生成回复…')).toBeTruthy();
  });

  it('用户手动展开后 pin，正文继续流式不再自动折叠（spec: 用户固定展开）', () => {
    const store = createStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
    applyChatEvent(store, {
      type: 'tool.start',
      messageId: 'a1',
      name: 'search',
      title: '搜索数据',
    });
    applyChatEvent(store, {
      type: 'tool.result',
      messageId: 'a1',
      name: 'search',
      status: 'success',
      result: 1,
    });
    applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '正文' });
    render(<ChatView store={store} />);
    // 已进入答案阶段：自动折叠
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeNull();

    // 用户手动展开 → pin
    fireEvent.click(screen.getByText('正在生成回复…'));
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeTruthy();

    // 正文继续流式：保持展开，不再自动变更
    act(() => {
      applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '继续' });
    });
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeTruthy();
  });

  it('用户手动折叠后 pin，后续工具活动不再自动展开', () => {
    const store = createStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
    applyChatEvent(store, {
      type: 'tool.start',
      messageId: 'a1',
      name: 'search',
      title: '搜索数据',
    });
    render(<ChatView store={store} />);
    // 流式 tool 阶段默认展开；用户点击折叠 → pin
    fireEvent.click(screen.getByText('正在调用工具…'));
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeNull();

    // 后续工具活动：保持折叠
    act(() => {
      applyChatEvent(store, {
        type: 'tool.start',
        messageId: 'a1',
        name: 'fetch',
        title: '拉取详情',
      });
    });
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeNull();
  });
});

describe('thinking 折叠卡升级（spec: chat-view / PartRenderer thinking）', () => {
  it('流式期间展开并带进行中指示，正文按 markdown 渲染（spec: thinking 流式展开）', () => {
    const store = createStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
    applyChatEvent(store, {
      type: 'thinking.delta',
      messageId: 'a1',
      delta: '**关键**推理',
    });
    render(<ChatView store={store} />);

    const card = document.querySelector('.pactor-chat-thinking')!;
    expect(card.getAttribute('data-open')).toBe('true');
    expect(card.getAttribute('data-streaming')).toBe('true');
    // markdown 正文：渲染为 strong 元素而非源码
    const strong = document.querySelector('.pactor-chat-thinking__body strong');
    expect(strong?.textContent).toBe('关键');
  });

  it('正文开始流式后 thinking 自动折叠；用户点击后 pin（spec: thinking 流式展开与自动折叠）', () => {
    const store = createStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
    applyChatEvent(store, {
      type: 'thinking.delta',
      messageId: 'a1',
      delta: '深层推理内容',
    });
    render(<ChatView store={store} />);
    // 流式期间展开
    expect(screen.getByText('深层推理内容')).toBeTruthy();

    // 正文开始流式 → 自动折叠
    act(() => {
      applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '正文回答' });
    });
    expect(screen.queryByText('深层推理内容')).toBeNull();

    // 用户点击展开 → pin；正文继续流式不再自动折叠
    fireEvent.click(screen.getByText('思考过程'));
    expect(screen.getByText('深层推理内容')).toBeTruthy();
    act(() => {
      applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '继续' });
    });
    expect(screen.getByText('深层推理内容')).toBeTruthy();
  });

  it('已完成消息的 thinking 默认折叠，markdown 正文在展开后渲染', () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        { type: 'thinking', content: '**深层**推理内容', status: 'ready' },
        { type: 'text', content: '正文回答', status: 'ready' },
      ],
    });
    render(<ChatView store={store} />);

    const card = document.querySelector('.pactor-chat-thinking')!;
    expect(card.getAttribute('data-open')).toBe('false');
    expect(card.getAttribute('data-streaming')).toBe('false');
    expect(screen.getByText('思考过程')).toBeTruthy();
    expect(screen.queryByText('推理内容', { exact: false })).toBeNull();

    fireEvent.click(screen.getByText('思考过程'));
    const strong = document.querySelector('.pactor-chat-thinking__body strong');
    expect(strong?.textContent).toBe('深层');
  });
});
