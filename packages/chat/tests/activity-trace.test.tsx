// @vitest-environment jsdom
import './setup.js';

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyChatEvent,
  ChatView,
  ConversationStore,
  detectStreamingMode,
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

  it('工具调用列表与状态头同块，思考过程为独立块', () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        { type: 'thinking', content: '先想想', status: 'ready' },
        {
          type: 'tool-call',
          name: 'search',
          title: '搜索数据',
          status: 'success',
        },
        { type: 'tool-result', name: 'search', status: 'success', result: 1 },
        { type: 'text', content: '正文', status: 'ready' },
      ],
    });

    render(<ChatView store={store} />);
    fireEvent.click(screen.getByText(/已完成 · 1 个工具调用/));

    const trace = document.querySelector('.pactor-chat-trace')!;
    const entries = document.querySelector('.pactor-chat-trace__entries')!;
    const thinking = document.querySelector('.pactor-chat-thinking')!;
    expect(entries).toBeTruthy();
    expect(thinking).toBeTruthy();
    // entries 必须在 thinking 之前（工具列表与“已完成 · n 个工具调用”放在一起）
    expect(
      entries.compareDocumentPosition(thinking) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // 两块同在统一折叠的外层容器内，但思考过程不嵌在工具列表块内
    expect(trace.contains(entries)).toBe(true);
    expect(trace.contains(thinking)).toBe(true);
    expect(thinking.closest('.pactor-chat-trace__entries')).toBeNull();
  });

  it('外层容器统一折叠展开：折叠时工具列表与思考过程同时隐藏', () => {
    const store = createStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        { type: 'thinking', content: '先想想', status: 'ready' },
        { type: 'tool-call', name: 'search', title: '搜索数据', status: 'success' },
        { type: 'tool-result', name: 'search', status: 'success', result: 1 },
        { type: 'text', content: '正文', status: 'ready' },
      ],
    });

    render(<ChatView store={store} />);
    const header = screen.getByText(/已完成 · 1 个工具调用/);

    // 默认折叠：两块都不可见
    expect(document.querySelector('.pactor-chat-trace__entries')).toBeNull();
    expect(document.querySelector('.pactor-chat-thinking')).toBeNull();

    // 展开：两块同时出现
    fireEvent.click(header);
    expect(document.querySelector('.pactor-chat-trace__entries')).toBeTruthy();
    expect(document.querySelector('.pactor-chat-thinking')).toBeTruthy();

    // 再折叠：两块同时隐藏
    fireEvent.click(header);
    expect(document.querySelector('.pactor-chat-trace__entries')).toBeNull();
    expect(document.querySelector('.pactor-chat-thinking')).toBeNull();
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

  it('答案阶段又来工具调用不重新自动展开（单向闩锁，防闪烁）', () => {
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
    render(<ChatView store={store} />);
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeTruthy();

    // 正文开始流式 → 自动折叠
    act(() => {
      applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '正文' });
    });
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeNull();

    // 答案阶段又来工具活动（mode 回跳 'tool'，answerPhase 变 false）：
    // 单向闩锁保持折叠，不重新自动展开
    act(() => {
      applyChatEvent(store, {
        type: 'tool.start',
        messageId: 'a1',
        name: 'write',
        title: '写入文件',
      });
    });
    expect(detectStreamingMode(store.getMessage('a1')!)).toBe('tool');
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeNull();

    // 用户仍可手动展开（pin）
    fireEvent.click(screen.getByText('正在调用工具…'));
    expect(document.querySelector('.pactor-chat-trace__entry')).toBeTruthy();
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
  it('流式期间展开并带进行中指示，正文走节流纯文本；结束后回切 markdown（spec: thinking 流式展开）', () => {
    const store = createStore();
    applyChatEvent(store, { type: 'message.start', messageId: 'a1' });
    applyChatEvent(store, {
      type: 'thinking.delta',
      messageId: 'a1',
      delta: '**关键**推理',
    });
    const { rerender } = render(<ChatView store={store} />);

    const card = document.querySelector('.pactor-chat-thinking')!;
    expect(card.getAttribute('data-open')).toBe('true');
    expect(card.getAttribute('data-streaming')).toBe('true');
    // 流式期间：纯文本（不解析 markdown，避免逐 token O(n²) 解析）
    const body = document.querySelector('.pactor-chat-thinking__body')!;
    expect(body.querySelector('strong')).toBeNull();
    expect(body.textContent).toContain('**关键**推理');

    // 结束后回切 markdown 渲染（外层轨迹区与卡片均自动折叠，逐层展开再断言）
    act(() => {
      applyChatEvent(store, { type: 'message.end', messageId: 'a1' });
    });
    rerender(<ChatView store={store} />);
    fireEvent.click(screen.getByText('已完成'));
    fireEvent.click(screen.getByText('思考过程'));
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

    // 正文开始流式 → 外层轨迹区自动折叠（thinking 随之隐藏）
    act(() => {
      applyChatEvent(store, { type: 'text.delta', messageId: 'a1', delta: '正文回答' });
    });
    expect(screen.queryByText('深层推理内容')).toBeNull();

    // 用户展开外层轨迹区 → pin，再展开 thinking 卡 → pin；正文继续流式不再自动折叠
    fireEvent.click(screen.getByText('正在生成回复…'));
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

    // 外层轨迹区默认折叠，thinking 卡片随之隐藏
    expect(document.querySelector('.pactor-chat-thinking')).toBeNull();

    // 展开外层 → thinking 卡片出现且自身默认折叠，markdown 正文在展开后渲染
    fireEvent.click(screen.getByText('已完成'));
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
