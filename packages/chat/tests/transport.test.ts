import { describe, expect, it, vi } from 'vitest';

import {
  ConversationStore,
  createManualDriver,
  runChatTurn,
  runRegenerateTurn,
  type ChatInput,
} from '../src/index.js';

describe('runChatTurn + createManualDriver（spec: chat-streaming / ChatTransport）', () => {
  it('完整 turn：driver 推送 message.start / text.delta / message.end（spec: 完整 turn）', async () => {
    const store = new ConversationStore();
    const driver = createManualDriver();

    const turn = runChatTurn(store, driver.transport, { text: '帮我看下数据' });
    driver.push({ type: 'message.start', messageId: 'ignored' });
    driver.push({ type: 'text.delta', messageId: 'ignored', delta: '根据当前' });
    driver.push({ type: 'text.delta', messageId: 'ignored', delta: '数据' });
    driver.push({ type: 'message.end', messageId: 'ignored' });
    driver.complete();

    const { userMessageId, assistantMessageId } = await turn;
    const user = store.getMessage(userMessageId)!;
    expect(user).toMatchObject({ role: 'user', status: 'completed' });
    expect(user.parts[0]).toMatchObject({ type: 'text', content: '帮我看下数据' });

    const assistant = store.getMessage(assistantMessageId)!;
    expect(assistant.role).toBe('assistant');
    expect(assistant.status).toBe('completed');
    expect(assistant.parts[0]).toMatchObject({
      type: 'text',
      content: '根据当前数据',
      status: 'ready',
    });
  });

  it('流式中途 store 可观察到中间态（pending → streaming）', async () => {
    const store = new ConversationStore();
    const driver = createManualDriver();
    const turn = runChatTurn(store, driver.transport, { text: 'hi' });

    const assistant = store.getMessages().find((m) => m.role === 'assistant')!;
    expect(assistant.status).toBe('pending');

    driver.push({ type: 'text.delta', messageId: 'x', delta: '你' });
    await vi_waitMicrotask();
    expect(store.getMessage(assistant.id)?.status).toBe('streaming');

    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();
    await turn;
    expect(store.getMessage(assistant.id)?.status).toBe('completed');
  });

  it('transport 抛错收敛为 message.error，不向上抛出', async () => {
    const store = new ConversationStore();
    const driver = createManualDriver();
    const turn = runChatTurn(store, driver.transport, { text: 'hi' });
    driver.push({ type: 'text.delta', messageId: 'x', delta: '半截' });
    driver.fail(new Error('连接中断'));

    const { assistantMessageId } = await turn;
    const assistant = store.getMessage(assistantMessageId)!;
    expect(assistant.status).toBe('error');
    expect(assistant.parts[assistant.parts.length - 1]).toMatchObject({ type: 'error', message: '连接中断' });
  });

  it('流正常结束但未收到 message.end 时兜底 completed', async () => {
    const store = new ConversationStore();
    const driver = createManualDriver();
    const turn = runChatTurn(store, driver.transport, { text: 'hi' });
    driver.push({ type: 'text.delta', messageId: 'x', delta: '完' });
    driver.complete();

    const { assistantMessageId } = await turn;
    expect(store.getMessage(assistantMessageId)?.status).toBe('completed');
  });

  it('abort 取消 turn：assistant 消息以 cancelled 收尾并正常返回（spec: abort 取消 turn）', async () => {
    const store = new ConversationStore();
    const driver = createManualDriver();
    const controller = new AbortController();
    const turn = runChatTurn(store, driver.transport, { text: 'hi' }, { signal: controller.signal });

    driver.push({ type: 'text.delta', messageId: 'x', delta: '半截内容' });
    await vi_waitMicrotask();
    controller.abort();
    // abort 后 driver 再推送的事件不应再落到 store；结束流让 for-await 退出
    driver.push({ type: 'text.delta', messageId: 'x', delta: '不应出现' });
    driver.complete();

    const { assistantMessageId } = await turn;
    const assistant = store.getMessage(assistantMessageId)!;
    expect(assistant.status).toBe('cancelled');
    const text = assistant.parts
      .filter((p) => p.type === 'text')
      .map((p) => (p as { content: string }).content)
      .join('');
    expect(text).toBe('半截内容');
  });

  it('abort 取消 turn：streaming/pending parts 定格为 ready（thinking 图标不再旋转）', async () => {
    const store = new ConversationStore();
    const driver = createManualDriver();
    const controller = new AbortController();
    const turn = runChatTurn(store, driver.transport, { text: 'hi' }, { signal: controller.signal });

    driver.push({ type: 'thinking.delta', messageId: 'x', delta: '思考中' });
    driver.push({ type: 'text.delta', messageId: 'x', delta: '半截' });
    await vi_waitMicrotask();
    controller.abort();
    driver.complete();

    const { assistantMessageId } = await turn;
    const assistant = store.getMessage(assistantMessageId)!;
    expect(assistant.status).toBe('cancelled');
    const unsettled = assistant.parts.filter(
      (p) =>
        'status' in p && (p.status === 'streaming' || p.status === 'pending'),
    );
    expect(unsettled).toEqual([]);
  });

  it('输入携带模型与上下文：transport.send 收到 model 与 contexts，text 仅为用户文本（spec: 输入携带模型与上下文）', async () => {
    const store = new ConversationStore();
    const send = vi.fn(async function* (_input: ChatInput) {
      yield { type: 'message.end', messageId: 'x' } as const;
    });

    const contexts = [
      { id: 'a1', label: '报表助手' },
      { id: 'c1', label: '销售数据表', trigger: '+' as const, data: { tableId: 't1' } },
    ];
    await runChatTurn(store, { send }, {
      text: '帮我看下数据',
      model: 'demo',
      contexts,
    });

    expect(send).toHaveBeenCalledTimes(1);
    const input = send.mock.calls[0]![0];
    expect(input.text).toBe('帮我看下数据');
    expect(input.model).toBe('demo');
    expect(input.contexts).toEqual(contexts);
    // contexts 不拼接进 text：user 消息正文仍为用户原文
    const user = store.getMessages().find((m) => m.role === 'user')!;
    expect(user.parts[0]).toMatchObject({ type: 'text', content: '帮我看下数据' });
  });

  it('skipUserMessage：不追加 user 消息，仍追加 assistant 占位并 reduce 事件', async () => {
    const store = new ConversationStore();
    const driver = createManualDriver();

    const turn = runChatTurn(store, driver.transport, { text: 'hi' }, { skipUserMessage: true });
    expect(store.getMessages().filter((m) => m.role === 'user')).toHaveLength(0);

    driver.push({ type: 'text.delta', messageId: 'x', delta: '你好' });
    driver.push({ type: 'message.end', messageId: 'x' });
    driver.complete();

    const { assistantMessageId } = await turn;
    expect(store.getMessage(assistantMessageId)?.status).toBe('completed');
    expect(store.getMessages()).toHaveLength(1);
  });
});

describe('runRegenerateTurn（spec: chat-streaming / 重新生成轮次）', () => {
  it('重新生成：移除原 assistant 回复，以末条 user 文本重跑 turn，user 消息数不变（spec: 重新生成）', async () => {
    const store = new ConversationStore();
    const first = createManualDriver();
    const firstTurn = runChatTurn(store, first.transport, { text: '帮我看下数据' });
    first.push({ type: 'text.delta', messageId: 'x', delta: '旧回复' });
    first.push({ type: 'message.end', messageId: 'x' });
    first.complete();
    const { userMessageId, assistantMessageId } = await firstTurn;
    expect(store.getMessages()).toHaveLength(2);

    const second = createManualDriver();
    const regen = runRegenerateTurn(store, second.transport);
    // 原 assistant 回复被移除，新 assistant 占位追加，user 消息不变
    expect(store.getMessage(assistantMessageId)).toBeUndefined();
    expect(store.getMessages().filter((m) => m.role === 'user')).toHaveLength(1);
    expect(store.getMessages()[0]?.id).toBe(userMessageId);

    second.push({ type: 'message.start', messageId: 'x' });
    second.push({ type: 'text.delta', messageId: 'x', delta: '新回复' });
    second.push({ type: 'message.end', messageId: 'x' });
    second.complete();

    const result = await regen;
    expect(result?.userMessageId).toBe(userMessageId);
    const assistant = store.getMessage(result!.assistantMessageId)!;
    expect(assistant.status).toBe('completed');
    expect(assistant.parts[0]).toMatchObject({ type: 'text', content: '新回复' });
    expect(store.getMessages().filter((m) => m.role === 'user')).toHaveLength(1);
  });

  it('transport 收到的输入文本为末条 user 消息的文本', async () => {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [
        { type: 'text', content: '第一段', status: 'ready' },
        { type: 'markdown', content: '**第二段**', status: 'ready' },
      ],
    });
    store.appendMessage({ id: 'a1', role: 'assistant', status: 'completed', parts: [] });

    let sentText: string | undefined;
    const transport = {
      async *send(input: { text: string }) {
        sentText = input.text;
        yield { type: 'message.end', messageId: 'x' } as const;
      },
    };
    await runRegenerateTurn(store, transport);
    expect(sentText).toBe('第一段**第二段**');
    expect(store.getMessage('a1')).toBeUndefined();
    expect(store.getMessage('u1')).toBeDefined();
  });

  it('无 user 消息：告警并正常返回，store 不变（spec: 无 user 消息）', async () => {
    const store = new ConversationStore();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const driver = createManualDriver();

    const result = await runRegenerateTurn(store, driver.transport);
    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalled();
    expect(store.getMessages()).toHaveLength(0);
    warn.mockRestore();
  });

  it('abort 取消：新 assistant 消息以 cancelled 收尾并正常返回（spec: abort 取消）', async () => {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: 'hi', status: 'ready' }],
    });

    const driver = createManualDriver();
    const controller = new AbortController();
    const regen = runRegenerateTurn(store, driver.transport, { signal: controller.signal });

    driver.push({ type: 'text.delta', messageId: 'x', delta: '半截' });
    await vi_waitMicrotask();
    controller.abort();
    driver.complete();

    const result = await regen;
    const assistant = store.getMessage(result!.assistantMessageId)!;
    expect(assistant.status).toBe('cancelled');
    expect(store.getMessage('u1')).toBeDefined();
  });
});

async function vi_waitMicrotask(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
