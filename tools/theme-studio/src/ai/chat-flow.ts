/**
 * AI 生成主题的 chat transport（spec: theme-studio-ai-generate）：
 * 把引导状态机包装成 ChatTransport，由 ChatView + runChatTurn 驱动。
 *
 * - 需求明确：直接 SSE 流式生成，CSS 原文以 markdown 流入消息气泡
 * - 需求不明确：text.delta 输出问题 + dsl.complete 输出选项卡片
 *   （按钮走 capability 动作 ai-answer 回灌一轮 user turn）
 * - 生成完成：dsl.complete 输出结果操作卡片（ai-apply / ai-download /
 *   ai-regenerate），ai-regenerate 以 REGENERATE_INPUT 标记重跑生成
 */
import type { ChatEvent, ChatInput, ChatTransport } from '@pactor-app/chat';
import type { DslNode } from '@pactor-app/core';

import {
  detectAnswers,
  isVague,
  PALETTE_OPTIONS,
  QUESTION_PALETTE,
  QUESTION_STYLE,
  STYLE_OPTIONS,
  type AiAnswers,
} from './flow';
import { parseSkinCss, type ParsedSkin } from './parse';
import { parseSseLineParts } from './stream';

/** 「重新生成」capability 回灌的伪输入（不产生 user 消息） */
export const REGENERATE_INPUT = '__ai_theme_regenerate__';

/** 选项卡片 DSL：按钮点击经 capability 动作 ai-answer 回灌答案 */
function optionsCard(options: { label: string; value: string }[]): DslNode {
  return {
    type: 'Flex',
    props: { style: { flexWrap: 'wrap', gap: 8, marginTop: 8 } },
    children: options.map((option) => ({
      type: 'Button',
      props: { text: option.label, size: 'sm' },
      events: {
        onClick: [
          {
            action: 'capability',
            params: { name: 'ai-answer', params: { value: option.value } },
          },
        ],
      },
    })),
  };
}

/** 结果操作卡片 DSL */
function resultCard(): DslNode {
  return {
    type: 'Flex',
    props: { style: { gap: 8, marginTop: 8 } },
    children: [
      {
        type: 'Button',
        props: { text: '应用到预览', variant: 'primary', size: 'sm' },
        events: { onClick: [{ action: 'capability', params: { name: 'ai-apply' } }] },
      },
      {
        type: 'Button',
        props: { text: '下载', size: 'sm' },
        events: { onClick: [{ action: 'capability', params: { name: 'ai-download' } }] },
      },
      {
        type: 'Button',
        props: { text: '重新生成', size: 'sm' },
        events: { onClick: [{ action: 'capability', params: { name: 'ai-regenerate' } }] },
      },
    ],
  };
}

const delta = (content: string): ChatEvent => ({
  type: 'text.delta',
  messageId: '',
  delta: content,
  format: 'markdown',
});

export class AiChatFlow {
  answers: AiAnswers = {};
  step: 'idle' | 'askStyle' | 'askPalette' = 'idle';
  /** 最近一次解析成功的生成结果（ai-apply / ai-download 使用） */
  lastParsed: ParsedSkin | null = null;

  readonly transport: ChatTransport = {
    send: (input, options) => this.handle(input, options?.signal),
  };

  private async *handle(
    input: ChatInput,
    signal?: AbortSignal,
  ): AsyncIterable<ChatEvent> {
    const text = input.text.trim();

    if (text === REGENERATE_INPUT) {
      yield* this.generate(this.answers, signal);
      return;
    }
    if (!text) {
      yield { type: 'message.end', messageId: '' };
      return;
    }
    const detected = detectAnswers(text);

    if (this.step === 'idle') {
      const base: AiAnswers = { ...detected, freeText: text };
      this.answers = base;
      if (!isVague(text)) {
        yield* this.generate(base, signal);
        return;
      }
      // 不明确：缺什么问什么
      this.step = detected.style ? 'askPalette' : 'askStyle';
      yield delta(detected.style ? QUESTION_PALETTE : QUESTION_STYLE);
      yield {
        type: 'dsl.complete',
        messageId: '',
        schema: detected.style ? paletteOptionsCard() : styleOptionsCard(),
      };
      yield { type: 'message.end', messageId: '' };
      return;
    }

    // 澄清问答中：选项或自由输入按当前问题归位
    if (this.step === 'askStyle') {
      this.answers = {
        ...this.answers,
        style: detected.style ?? text,
        palette: this.answers.palette ?? detected.palette,
      };
      if (!this.answers.palette) {
        this.step = 'askPalette';
        yield delta(QUESTION_PALETTE);
        yield { type: 'dsl.complete', messageId: '', schema: paletteOptionsCard() };
        yield { type: 'message.end', messageId: '' };
        return;
      }
    } else {
      this.answers = {
        ...this.answers,
        palette: detected.palette ?? text,
      };
    }
    this.step = 'idle';
    yield* this.generate(this.answers, signal);
  }

  /** 调生成接口：SSE 逐 delta 流入气泡，结束后解析并输出操作卡片；
   * signal abort 时立即中断上游请求并静默结束（runChatTurn 以 cancelled 收尾） */
  private async *generate(
    answers: AiAnswers,
    signal?: AbortSignal,
  ): AsyncIterable<ChatEvent> {
    let res: Response;
    try {
      res = await fetch('/api/theme-generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(answers),
        signal,
      });
    } catch (error) {
      if (signal?.aborted) {
        return;
      }
      yield {
        type: 'message.error',
        messageId: '',
        error: `生成服务不可用：${error instanceof Error ? error.message : String(error)}（本地开发请先启动 wrangler dev）`,
      };
      return;
    }
    if (!res.ok || !res.body) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      yield {
        type: 'message.error',
        messageId: '',
        error: data.error ?? `生成服务不可用（${res.status}），本地开发请先启动 wrangler dev`,
      };
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let full = '';
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const parts = parseSseLineParts(line);
          if (parts?.reasoning) {
            // 推理模型的思考过程：thinking part 独立展示（气泡内折叠区）
            yield {
              type: 'thinking.delta',
              messageId: '',
              delta: parts.reasoning,
            };
          }
          if (parts?.content) {
            full += parts.content;
            yield delta(parts.content);
          }
        }
      }
    } catch {
      // fetch signal abort 会使 reader.read() 抛 AbortError：静默结束本轮
      if (!signal?.aborted) {
        yield {
          type: 'message.error',
          messageId: '',
          error: '生成过程中连接中断，请点击重新生成',
        };
      }
      return;
    }

    const parsed = parseSkinCss(full);
    if (!parsed) {
      yield {
        type: 'message.error',
        messageId: '',
        error: '未能从模型输出中解析出有效的皮肤 CSS，请点击重新生成',
      };
      return;
    }
    this.lastParsed = parsed;
    const darkCount = Object.keys(parsed.dark).length;
    yield delta(
      `\n\n---\n\n✅ 已生成主题：**${Object.keys(parsed.light).length}** 个亮色令牌${darkCount > 0 ? ` + **${darkCount}** 个暗色令牌` : ''}。`,
    );
    yield { type: 'dsl.complete', messageId: '', schema: resultCard() };
    yield { type: 'message.end', messageId: '' };
  }
}

function styleOptionsCard(): DslNode {
  return optionsCard(STYLE_OPTIONS.map((s) => ({ label: s, value: s })));
}

function paletteOptionsCard(): DslNode {
  return optionsCard(
    PALETTE_OPTIONS.map((p) => ({
      label: `${p.label}（${p.ref}）`,
      value: `${p.label}（${p.ref}）`,
    })),
  );
}
