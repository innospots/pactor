import type { ChatEvent, ChatInput, ChatTransport } from '@pactor/chat';
import type { DslNode } from '@pactor/core';

/**
 * mock AI transport（examples/admin「AI 工作区」页专用，仿写自
 * examples/chat 的精简版）：async generator 模拟流式节奏，按口令产出
 * markdown 回复与 artifact part（产出物面板演示）。真实接入时替换为
 * 按服务端协议实现的 ChatTransport（SSE / WebSocket）。
 */

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function* streamText(
  messageId: string,
  content: string,
): AsyncGenerator<ChatEvent> {
  for (let i = 0; i < content.length; i += 6) {
    yield {
      type: 'text.delta',
      messageId,
      delta: content.slice(i, i + 6),
      format: 'markdown',
    };
    await sleep(40);
  }
}

/** 「统计页面」产出物的 DSL（dsl kind，白名单组件，面板活预览） */
const ARTIFACT_PAGE_DSL: DslNode = {
  type: 'Flex',
  props: { direction: 'vertical', gap: 'middle' },
  children: [
    {
      type: 'Card',
      props: { title: '本季度概览' },
      children: [
        { type: 'Statistic', props: { title: '营收（万元）', value: 386.2, precision: 1 } },
      ],
    },
    {
      type: 'Alert',
      props: { variant: 'info', message: '本卡片由 dsl kind 产出物经 Safe Registry 白名单活预览渲染。' },
    },
  ],
};

/** 创建 mock AI transport */
export function createMockAiTransport(): ChatTransport {
  return {
    async *send(input: ChatInput): AsyncIterable<ChatEvent> {
      const messageId = 'assistant';
      const text = input.text;
      await sleep(300);
      if (/页面|统计页/.test(text)) {
        yield {
          type: 'artifact',
          messageId,
          artifact: {
            id: 'art-stats-page',
            kind: 'dsl',
            title: '统计页面预览',
            content: ARTIFACT_PAGE_DSL,
          },
        };
        await sleep(200);
        yield* streamText(messageId, '已生成统计页面 DSL，右侧面板以白名单组件活预览渲染。');
      } else if (/月报|报告/.test(text)) {
        yield {
          type: 'artifact',
          messageId,
          artifact: {
            id: 'art-monthly-report',
            kind: 'markdown',
            title: '本月经营月报',
            content:
              '# 本月经营月报\n\n- **营收**：128.6 万元（环比 +8.2%）\n- **新增客户**：342 家\n- **转化率**：23.8%\n\n> 本产出物为 mock 数据，经 artifact part 下发并由右侧面板渲染。',
          },
        };
        await sleep(200);
        yield* streamText(messageId, '已生成本月经营月报，并在右侧产出物面板中打开。');
      } else {
        yield* streamText(
          messageId,
          `你刚才说：「${text}」。\n\n我是 mock AI，试试发送「**月报**」（markdown 产出物）或「**页面**」（dsl 产出物活预览），产出物将在右侧面板打开。`,
        );
      }
      yield { type: 'message.end', messageId };
    },
  };
}
