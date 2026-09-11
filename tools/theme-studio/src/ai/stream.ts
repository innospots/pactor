/**
 * SSE 行解析（spec: theme-studio-ai-generate / 大模型代理接口）：
 * OpenAI 兼容流式行 `data: {...}` → delta 文本；`data: [DONE]`、
 * 心跳/注释/残缺行返回 null（调用方忽略）。
 */
export function parseSseLine(line: string): string | null {
  return parseSseLineParts(line)?.content ?? null;
}

/** SSE 行完整解析：正文 content 与推理过程 reasoning_content（推理模型）分别提取 */
export function parseSseLineParts(
  line: string,
): { content: string | null; reasoning: string | null } | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('data:')) {
    return null;
  }
  const data = trimmed.slice(5).trim();
  if (data === '' || data === '[DONE]') {
    return null;
  }
  try {
    const json = JSON.parse(data) as {
      choices?: { delta?: { content?: string; reasoning_content?: string } }[];
    };
    const delta = json.choices?.[0]?.delta;
    if (!delta) {
      return null;
    }
    return {
      content: delta.content ?? null,
      reasoning: delta.reasoning_content ?? null,
    };
  } catch {
    return null;
  }
}

/** 读取 SSE 响应流，逐 delta 回调；返回拼接全文 */
export async function readSseStream(
  body: ReadableStream<Uint8Array>,
  onDelta: (full: string) => void,
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const delta = parseSseLine(line);
      if (delta) {
        full += delta;
        onDelta(full);
      }
    }
  }
  return full;
}
