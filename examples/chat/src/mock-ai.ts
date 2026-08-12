import type { ChatEvent, ChatInput, ChatTransport } from 'pactor-chat';
import type { DslNode } from 'pactor-core';

/**
 * mock AI transport（examples/chat 专用）：
 * 以 async generator 模拟真实 SSE 服务端的流式节奏——按输入文本匹配意图，
 * 分片产出 thinking / markdown / tool-call / dsl 事件。
 * 真实接入时替换为按服务端协议实现的 ChatTransport（SSE / WebSocket）。
 */

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** 把长文本切成小片流式产出（format 决定 part 类型，缺省 text） */
async function* streamText(
  messageId: string,
  content: string,
  options: { format?: 'text' | 'markdown'; chunk?: number; delay?: number } = {},
): AsyncGenerator<ChatEvent> {
  const { format, chunk = 6, delay = 40 } = options;
  for (let i = 0; i < content.length; i += chunk) {
    yield {
      type: 'text.delta',
      messageId,
      delta: content.slice(i, i + chunk),
      format,
    };
    await sleep(delay);
  }
}

async function* streamThinking(
  messageId: string,
  content: string,
): AsyncGenerator<ChatEvent> {
  for (let i = 0; i < content.length; i += 8) {
    yield { type: 'thinking.delta', messageId, delta: content.slice(i, i + 8) };
    await sleep(30);
  }
}

/** 「报表」意图的 DSL：白名单内组件（Flex/Card/Statistic/Alert）+ 一个白名单外 Table 演示 ChatDenied 占位 */
const REPORT_DSL: DslNode = {
  type: 'Flex',
  props: { direction: 'vertical', gap: 'middle' },
  children: [
    {
      type: 'Flex',
      props: { gap: 'middle' },
      children: [
        {
          type: 'Card',
          props: { title: '本月营收' },
          children: [
            { type: 'Statistic', props: { title: '营收（万元）', value: 128.6, precision: 1 } },
          ],
        },
        {
          type: 'Card',
          props: { title: '新增客户' },
          children: [
            { type: 'Statistic', props: { title: '客户数', value: 342, suffix: '家' } },
          ],
        },
        {
          type: 'Card',
          props: { title: '转化率' },
          children: [
            { type: 'Statistic', props: { title: '转化率', value: 23.8, precision: 1, suffix: '%' } },
          ],
        },
      ],
    },
    {
      type: 'Alert',
      props: { variant: 'info', message: '以上为 mock 数据，由 LLM 下发的 DSL 经 Safe Registry 白名单渲染。' },
    },
    // 白名单外类型：演示 ChatDenied 受控占位
    { type: 'Table', props: { columns: [] } },
  ],
};

/** 「导出」意图的 DSL：按钮触发高风险 capability（data.export），经 confirm 确认后执行 */
const EXPORT_DSL: DslNode = {
  type: 'Card',
  props: { title: '导出客户数据' },
  children: [
    {
      type: 'Flex',
      props: { direction: 'vertical', gap: 'middle' },
      children: [
        {
          type: 'Alert',
          props: {
            variant: 'warning',
            message: '该操作为高风险能力（risk: high），点击后需经确认链确认才会真正执行。',
          },
        },
        {
          type: 'Button',
          props: { text: '导出为 CSV', variant: 'primary' },
          events: {
            onClick: {
              action: 'capability',
              params: { name: 'data.export', params: { format: 'csv' } },
            },
          },
        },
      ],
    },
  ],
};

/** 天气意图：thinking → 工具调用 → markdown 结论 */
async function* weatherTurn(messageId: string): AsyncGenerator<ChatEvent> {
  yield* streamThinking(messageId, '用户询问天气，需要调用 weather.query 工具获取实时数据……');
  yield { type: 'tool.start', messageId, name: 'weather.query', title: '查询天气' };
  await sleep(600);
  yield {
    type: 'tool.result',
    messageId,
    name: 'weather.query',
    status: 'success',
    result: { city: '杭州', temperature: 26, condition: '多云转晴', humidity: '62%' },
  };
  await sleep(200);
  yield* streamText(
    messageId,
    '杭州今天**多云转晴**，气温 26°C，湿度 62%。\n\n- 紫外线中等，外出建议防晒\n- 傍晚有微风，适合出行',
    { format: 'markdown' },
  );
}

/** 报表意图：thinking → DSL 卡片 */
async function* reportTurn(messageId: string): AsyncGenerator<ChatEvent> {
  yield* streamThinking(messageId, '用户想看经营报表，生成统计卡片 DSL 下发……');
  yield { type: 'dsl.start', messageId };
  await sleep(500);
  yield { type: 'dsl.complete', messageId, schema: REPORT_DSL };
  await sleep(200);
  yield* streamText(messageId, '已生成本月经营概览。末尾的 Table 不在白名单内，被替换为受控占位。');
}

/** 导出意图：高风险 capability 确认链 */
async function* exportTurn(messageId: string): AsyncGenerator<ChatEvent> {
  yield* streamThinking(messageId, '用户请求导出数据，属于高风险操作，需要确认链介入……');
  yield { type: 'dsl.complete', messageId, schema: EXPORT_DSL };
}

/** 默认意图：流式 markdown */
async function* defaultTurn(messageId: string, text: string): AsyncGenerator<ChatEvent> {
  yield* streamThinking(messageId, `收到用户输入「${text}」，组织回复……`);
  yield* streamText(
    messageId,
    `你刚才说：「${text}」。\n\n我是 **pactor-chat** 的 mock AI，可以演示这些能力：\n\n- 发送「**天气**」：思考过程 + 工具调用 + 结论\n- 发送「**报表**」：LLM 下发 DSL 卡片（Safe Registry 渲染）\n- 发送「**导出**」：高风险 capability 确认链\n\n支持数学公式（KaTeX）：行内 $E=mc^2$，块级：\n\n$$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$$\n\n\`\`\`ts\n// 真实接入：实现 ChatTransport 对接你的 SSE / WebSocket 服务端\ninterface ChatTransport {\n  send(input: ChatInput): AsyncIterable<ChatEvent>;\n}\n\`\`\``,
    { format: 'markdown', chunk: 4 },
  );
}

/** 创建 mock AI transport */
export function createMockAiTransport(): ChatTransport {
  return {
    async *send(input: ChatInput): AsyncIterable<ChatEvent> {
      // runChatTurn 已建立 assistant 占位消息，事件归一到该消息；
      // 这里的 messageId 会被 runChatTurn 覆盖为占位消息 id
      const messageId = 'assistant';
      const text = input.text;
      await sleep(300);
      if (text.includes('天气')) {
        yield* weatherTurn(messageId);
      } else if (/报表|统计|卡片/.test(text)) {
        yield* reportTurn(messageId);
      } else if (text.includes('导出')) {
        yield* exportTurn(messageId);
      } else {
        yield* defaultTurn(messageId, text);
      }
      yield { type: 'message.end', messageId };
    },
  };
}
