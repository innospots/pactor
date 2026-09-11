/**
 * AI 聊天 transport 流程测试（spec: theme-studio-ai-generate）。
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ChatEvent } from '@pactor-app/chat';

import { AiChatFlow, REGENERATE_INPUT } from '../src/ai/chat-flow';

async function collect(flow: AiChatFlow, text: string): Promise<ChatEvent[]> {
  const events: ChatEvent[] = [];
  for await (const event of flow.transport.send({ text })) {
    events.push(event);
  }
  return events;
}

function sseBody(cssText: string): ReadableStream<Uint8Array> {
  const line = `data: {"choices":[{"delta":{"content":${JSON.stringify(cssText)}}}]}\n\ndata: [DONE]\n\n`;
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(line));
      controller.close();
    },
  });
}

const VALID_CSS = '```css\n:root { --primary: red; }\n```';

describe('AiChatFlow transport', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('需求不明确：输出问题文本 + 选项卡片，不调接口', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const flow = new AiChatFlow();
    const events = await collect(flow, '帮我生成一个主题');
    expect(fetchMock).not.toHaveBeenCalled();
    const deltas = events.filter((e) => e.type === 'text.delta');
    expect(deltas.map((e) => e.type === 'text.delta' && e.delta).join('')).toContain(
      '主题风格',
    );
    const card = events.find((e) => e.type === 'dsl.complete');
    expect(card).toBeDefined();
    expect(JSON.stringify(card)).toContain('ai-answer');
    expect(JSON.stringify(card)).toContain('科技');
    expect(events[events.length - 1]?.type).toBe('message.end');
  });

  it('澄清问答：风格作答后追问色系，色系作答后生成', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(sseBody(VALID_CSS), { status: 200 }),
      ),
    );
    const flow = new AiChatFlow();
    await collect(flow, '帮我生成一个主题'); // → 问风格
    const after1 = await collect(flow, '科技'); // → 问色系
    expect(
      after1
        .filter((e) => e.type === 'text.delta')
        .map((e) => (e.type === 'text.delta' ? e.delta : ''))
        .join(''),
    ).toContain('色系');
    expect(flow.answers.style).toBe('科技');

    const after2 = await collect(flow, '青碧（青冥）'); // → 生成
    const text = after2
      .filter((e) => e.type === 'text.delta')
      .map((e) => (e.type === 'text.delta' ? e.delta : ''))
      .join('');
    expect(text).toContain('--primary: red;');
    expect(text).toContain('已生成主题');
    expect(flow.lastParsed?.light['--primary']).toBe('red');
    expect(JSON.stringify(after2.find((e) => e.type === 'dsl.complete'))).toContain(
      'ai-apply',
    );
  });

  it('需求明确：直接流式生成，跳过提问', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(sseBody(VALID_CSS), { status: 200 })),
    );
    const flow = new AiChatFlow();
    const events = await collect(flow, '深色背景、大圆角、高对比度的阅读型界面风格');
    expect(JSON.stringify(events)).not.toContain('ai-answer');
    expect(flow.lastParsed?.light['--primary']).toBe('red');
  });

  it('重新生成标记：以现有答案重跑生成，不产生新问题', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response(sseBody(VALID_CSS), { status: 200 })),
      );
    vi.stubGlobal('fetch', fetchMock);
    const flow = new AiChatFlow();
    await collect(flow, '深色背景、大圆角、高对比度的阅读型界面风格');
    const events = await collect(flow, REGENERATE_INPUT);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(flow.lastParsed?.light['--primary']).toBe('red');
    expect(events[events.length - 1]?.type).toBe('message.end');
  });

  it('接口失败：输出 message.error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({ error: '未配置模型服务' }, { status: 501 }),
      ),
    );
    const flow = new AiChatFlow();
    const events = await collect(flow, '深色背景、大圆角、高对比度的阅读型界面风格');
    const error = events.find((e) => e.type === 'message.error');
    expect(error).toBeDefined();
    expect(error?.type === 'message.error' && error.error).toContain('未配置模型服务');
    expect(flow.lastParsed).toBeNull();
  });

  it('推理模型的思考过程以 thinking.delta 流出，正文仅取 content', async () => {
    const sse = [
      'data: {"choices":[{"delta":{"reasoning_content":"先想风格"}}]}',
      '',
      'data: {"choices":[{"delta":{"content":"```css\\n:root { --primary: red; }\\n```"}}]}',
      '',
      'data: [DONE]',
      '',
    ].join('\n');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(sse, { status: 200 })),
    );
    const flow = new AiChatFlow();
    const events = await collect(flow, '深色背景、大圆角、高对比度的阅读型界面风格');
    const thinking = events
      .filter((e) => e.type === 'thinking.delta')
      .map((e) => (e.type === 'thinking.delta' ? e.delta : ''))
      .join('');
    expect(thinking).toContain('先想风格');
    const text = events
      .filter((e) => e.type === 'text.delta')
      .map((e) => (e.type === 'text.delta' ? e.delta : ''))
      .join('');
    expect(text).toContain('--primary: red;');
    expect(text).not.toContain('先想风格');
  });

  it('停止（abort）：流式中静默结束，不产出 error 事件', async () => {    const controller = new AbortController();
    // 慢速流：先吐一个 delta，再挂起直到 abort
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
        const signal = init?.signal;
        return Promise.resolve(
          new Response(
            new ReadableStream({
              start(c) {
                c.enqueue(
                  new TextEncoder().encode(
                    'data: {"choices":[{"delta":{"content":"```css"}}]}\n\n',
                  ),
                );
                signal?.addEventListener('abort', () => {
                  c.error(new DOMException('aborted', 'AbortError'));
                });
              },
            }),
            { status: 200 },
          ),
        );
      }),
    );
    const flow = new AiChatFlow();
    const events: ChatEvent[] = [];
    await (async () => {
      for await (const event of flow.transport.send(
        { text: '深色背景、大圆角、高对比度的阅读型界面风格' },
        { signal: controller.signal },
      )) {
        events.push(event);
        controller.abort();
      }
    })();
    expect(events.some((e) => e.type === 'message.error')).toBe(false);
    expect(events.some((e) => e.type === 'text.delta')).toBe(true);
  });
});
