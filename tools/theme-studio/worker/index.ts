/**
 * theme-studio Worker 入口（spec: theme-studio-ai-generate / 大模型代理接口）：
 * 静态 assets 托管 + `POST /api/theme-generate` 代理转发到 OpenAI 兼容
 * chat completions 接口。base URL / model 走 vars，API key 走 secret，
 * 浏览器不直接接触密钥。
 */
import { TOKEN_GROUPS } from '../src/tokens';

/** 最小结构类型（避免引入 @cloudflare/workers-types） */
interface AssetsFetcher {
  fetch(input: Request): Promise<Response>;
}

export interface Env {
  ASSETS: AssetsFetcher;
  LLM_API_KEY?: string;
  LLM_BASE_URL?: string;
  LLM_MODEL?: string;
  /** 自定义系统提示词（提供时替换内置默认，令牌清单与格式约束始终附加） */
  LLM_SYSTEM_PROMPT?: string;
}

export interface GenerateRequest {
  style?: string;
  palette?: string;
  freeText?: string;
}

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';

/** 注入 prompt 的令牌清单（名称 + 默认值 + 用途，来自 tokens.ts 单一来源） */
function tokenCatalog(): string {
  return TOKEN_GROUPS.flatMap((group) => group.tokens)
    .map((t) => `${t.name}: ${t.defaultValue} /* ${t.description} */`)
    .join('\n');
}

export function buildMessages(
  payload: GenerateRequest,
  systemPrompt?: string,
): {
  role: 'system' | 'user';
  content: string;
}[] {
  const base =
    systemPrompt ??
    '你是 pactor UI 的皮肤设计助手。根据用户的风格与色系需求，生成一份皮肤 CSS。';
  const system = [
    base,
    '硬性要求：',
    '1. 只输出一个 ```css 代码块，不要输出任何其它文字。',
    '2. 代码块包含 `:root { ... }` 亮色令牌块；可选包含 `[data-pactor-theme=\'dark\'] { ... }` 暗色令牌块。',
    '3. 只允许使用下面令牌清单中的自定义属性名，不要发明新令牌：',
    tokenCatalog(),
    '4. 颜色值使用 oklch()；--primary、--primary-foreground、--background、--foreground、--card、--border 必须给出。',
  ].join('\n');

  const parts = [
    payload.style ? `主题风格：${payload.style}` : '',
    payload.palette ? `色系：${payload.palette}` : '',
    payload.freeText ? `补充需求：${payload.freeText}` : '',
  ].filter(Boolean);

  return [
    { role: 'system', content: system },
    { role: 'user', content: `请生成皮肤 CSS。${parts.join('；')}` },
  ];
}

interface ChatCompletionResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

export async function handleGenerate(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!env.LLM_API_KEY) {
    return Response.json(
      { error: '未配置模型服务（缺少 LLM_API_KEY），请联系部署方配置' },
      { status: 501 },
    );
  }

  let payload: GenerateRequest;
  try {
    payload = (await request.json()) as GenerateRequest;
  } catch {
    return Response.json({ error: '请求体必须是 JSON' }, { status: 400 });
  }

  const baseUrl = (env.LLM_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, '');
  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.LLM_MODEL ?? DEFAULT_MODEL,
        messages: buildMessages(payload, env.LLM_SYSTEM_PROMPT),
        temperature: 0.7,
        stream: true,
      }),
    });
  } catch (error) {
    // 网络层失败（上游不可达 / DNS / TLS 等）：返回可读错误而非裸 500
    return Response.json(
      {
        error: `无法连接模型服务（${baseUrl}）：${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const data = (await upstream.json().catch(() => ({}))) as ChatCompletionResponse;
    return Response.json(
      { error: `模型接口错误（${upstream.status}）：${data.error?.message ?? '未知错误'}` },
      { status: 502 },
    );
  }
  // 流式透传上游 SSE（OpenAI 兼容 `data: {...}` / `data: [DONE]` 行）
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/theme-generate') {
      if (request.method !== 'POST') {
        return Response.json({ error: '仅支持 POST' }, { status: 405 });
      }
      return handleGenerate(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
