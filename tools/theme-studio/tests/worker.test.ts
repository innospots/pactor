/**
 * Worker 代理接口测试（spec: theme-studio-ai-generate / 大模型代理接口）。
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import worker, { buildMessages, type Env } from '../worker/index';

function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    ASSETS: { fetch: async () => new Response('asset') },
    LLM_API_KEY: 'test-key',
    ...overrides,
  };
}

function post(body: unknown): Request {
  return new Request('https://studio.test/api/theme-generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('buildMessages', () => {
  it('注入令牌清单与格式约束', () => {
    const messages = buildMessages({ style: '科技', palette: '青碧' });
    const system = messages[0]!.content;
    expect(system).toContain('--primary');
    expect(system).toContain('```css');
    expect(messages[1]!.content).toContain('科技');
    expect(messages[1]!.content).toContain('青碧');
  });

  it('自定义系统提示词替换默认开头，约束仍附加', () => {
    const messages = buildMessages({ style: '科技' }, '你是国风设计师');
    const system = messages[0]!.content;
    expect(system).toContain('你是国风设计师');
    expect(system).not.toContain('皮肤设计助手');
    expect(system).toContain('--primary');
  });
});

describe('POST /api/theme-generate', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('缺少 LLM_API_KEY 时返回 501 可读错误', async () => {
    const res = await worker.fetch(post({ style: '科技' }), makeEnv({ LLM_API_KEY: undefined }));
    expect(res.status).toBe(501);
    expect(((await res.json()) as { error: string }).error).toContain('未配置模型服务');
  });

  it('流式透传上游 SSE 与鉴权头', async () => {
    const sse = [
      'data: {"choices":[{"delta":{"content":"```css\\n"}}]}',
      'data: {"choices":[{"delta":{"content":":root {}"}}]}',
      'data: [DONE]',
      '',
    ].join('\n');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(sse, { status: 200, headers: { 'content-type': 'text/event-stream' } }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const res = await worker.fetch(post({ style: '科技', palette: '青碧' }), makeEnv());
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');
    expect(await res.text()).toBe(sse);
    // 鉴权头、默认 base URL 与流式开关
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.openai.com/v1/chat/completions');
    expect((init.headers as Record<string, string>).authorization).toBe('Bearer test-key');
    expect(JSON.parse(init.body as string).stream).toBe(true);
  });

  it('上游失败时返回 502', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ error: { message: 'boom' } }, { status: 429 })),
    );
    const res = await worker.fetch(post({ style: '科技' }), makeEnv());
    expect(res.status).toBe(502);
    expect(((await res.json()) as { error: string }).error).toContain('boom');
  });

  it('上游网络异常时返回 502 可读错误（而非裸 500）', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network connection lost.')));
    const res = await worker.fetch(post({ style: '科技' }), makeEnv());
    expect(res.status).toBe(502);
    expect(((await res.json()) as { error: string }).error).toContain('无法连接模型服务');
  });

  it('非 POST 返回 405，非 api 路径交给 assets', async () => {
    const res405 = await worker.fetch(
      new Request('https://studio.test/api/theme-generate', { method: 'GET' }),
      makeEnv(),
    );
    expect(res405.status).toBe(405);
    const resAssets = await worker.fetch(new Request('https://studio.test/'), makeEnv());
    expect(await resAssets.text()).toBe('asset');
  });
});
