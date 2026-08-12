import { describe, expect, it } from 'vitest';

import {
  ConversationStore,
  createManualDriver,
  runChatTurn,
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
});

async function vi_waitMicrotask(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
