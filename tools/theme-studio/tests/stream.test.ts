/**
 * SSE 解析测试（spec: theme-studio-ai-generate / 大模型代理接口）。
 */
import { describe, expect, it } from 'vitest';

import { parseSseLine, parseSseLineParts, readSseStream } from '../src/ai/stream';

describe('parseSseLine', () => {
  it('提取 delta 文本', () => {
    expect(parseSseLine('data: {"choices":[{"delta":{"content":"你好"}}]}')).toBe('你好');
  });

  it('忽略 [DONE]、心跳、注释与非 data 行', () => {
    expect(parseSseLine('data: [DONE]')).toBeNull();
    expect(parseSseLine(':')).toBeNull();
    expect(parseSseLine('event: message')).toBeNull();
    expect(parseSseLine('')).toBeNull();
  });

  it('残缺 JSON 或空 delta 返回 null', () => {
    expect(parseSseLine('data: {"choices":')).toBeNull();
    expect(parseSseLine('data: {"choices":[{"delta":{}}]}')).toBeNull();
  });
});

describe('parseSseLineParts', () => {
  it('正文与推理过程分别提取', () => {
    expect(
      parseSseLineParts('data: {"choices":[{"delta":{"content":"css","reasoning_content":"想想"}}]}'),
    ).toEqual({ content: 'css', reasoning: '想想' });
  });

  it('仅推理帧 content 为 null，仅正文帧 reasoning 为 null', () => {
    expect(
      parseSseLineParts('data: {"choices":[{"delta":{"reasoning_content":"推理"}}]}'),
    ).toEqual({ content: null, reasoning: '推理' });
    expect(
      parseSseLineParts('data: {"choices":[{"delta":{"content":"正文"}}]}'),
    ).toEqual({ content: '正文', reasoning: null });
  });
});

describe('readSseStream', () => {
  it('跨 chunk 拼接并逐 delta 回调', async () => {
    const chunks = [
      'data: {"choices":[{"delta":{"content":":ro',
      'ot {}"}}]}\n\ndata: {"choices":[{"delta":{"content":"--p"}}]}\n\ndata: [DONE]\n\n',
    ];
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const c of chunks) {
          controller.enqueue(new TextEncoder().encode(c));
        }
        controller.close();
      },
    });
    const seen: string[] = [];
    const full = await readSseStream(stream, (text) => seen.push(text));
    expect(full).toBe(':root {}--p');
    expect(seen).toEqual([':root {}', ':root {}--p']);
  });
});
