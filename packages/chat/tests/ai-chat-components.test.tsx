// @vitest-environment jsdom
/**
 * AI 与会话类组件契约（第八批：chat 子目录）：
 * Bubble / Sender / Thinking / AgentStatus / StreamingText / Suggestion /
 * Prompt / Welcome / Citation / Attachment / ToolCall / ChatMessage /
 * MessageList / Composer / ConversationList 的 props 映射、交互行为与通用 props。
 */
import { fireEvent, screen } from '@testing-library/react';
import type { DslNode } from '@pactor-app/core';
import type { CreateRuntimeContextOptions } from '@pactor-app/runtime';
import { describe, expect, it, vi } from 'vitest';

import { createComponentRegistry } from './helpers.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDslWith,
  type RenderDslResult,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

function renderDsl(node: DslNode, options: CreateRuntimeContextOptions = {}): RenderDslResult {
  return renderDslWith(createComponentRegistry(), node, options);
}

/** 向行内提及输入区（contenteditable）追加文本并把光标置于末尾，触发 input */
function typeIntoMentionField(field: HTMLElement, text: string): void {
  const node = document.createTextNode(text);
  field.appendChild(node);
  const range = document.createRange();
  range.setStart(node, text.length);
  range.collapse(true);
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  fireEvent.input(field);
}

describe('Bubble', () => {
  it('align / variant 映射；渲染 DSL 子树；通用 props', () => {
    const { container } = renderDsl({
      type: 'Bubble',
      props: { align: 'end', variant: 'outline', ...COMMON_PROPS },
      children: [{ type: 'Text', props: { text: '气泡内容' } }],
    });

    const root = container.querySelector('[data-slot=bubble]') as HTMLElement;
    expect(root.getAttribute('data-align')).toBe('end');
    expect(root.getAttribute('data-variant')).toBe('outline');
    expect(screen.getByText('气泡内容')).toBeTruthy();
    expectCommonProps(root);
  });
});

describe('Sender', () => {
  it('名称 / 角色 / 时间 / 头像占位；end 对齐反转', () => {
    renderDsl({
      type: 'Sender',
      props: { name: '小助手', role: 'AI', time: '10:24', align: 'end' },
    });

    expect(screen.getByText('小助手')).toBeTruthy();
    expect(screen.getByText('AI')).toBeTruthy();
    expect(screen.getByText('10:24')).toBeTruthy();
    expect(screen.getByText('小')).toBeTruthy();
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'Sender', props: { name: '探', ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=sender]'));
  });

  it('icon 头像位渲染 Icon（优先于占位文本）；hideAvatar 隐藏头像位', () => {
    const { container, unmount } = renderDsl({
      type: 'Sender',
      props: { name: '小助手', icon: 'sparkles' },
    });
    expect(container.querySelector('[data-slot=sender-icon] svg')).not.toBeNull();
    // 图标优先于 name 首字符占位
    expect(screen.queryByText('小')).toBeNull();
    unmount();

    const { container: bare } = renderDsl({
      type: 'Sender',
      props: { name: '小助手', hideAvatar: true },
    });
    expect(bare.querySelector('[data-slot=sender-icon]')).toBeNull();
    expect(bare.querySelector('[data-slot=avatar]')).toBeNull();
    expect(screen.getByText('小助手')).toBeTruthy();
  });
});

describe('Thinking', () => {
  it('thinking 态默认展开 + 图标脉冲；点击折叠', () => {
    renderDsl({ type: 'Thinking', props: { content: '推理过程…' } });

    expect(screen.getByText('思考中…')).toBeTruthy();
    expect(screen.getByText('推理过程…')).toBeTruthy();
    expect(document.querySelector('[data-slot=thinking] .animate-pulse')).not.toBeNull();

    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('推理过程…')).toBeNull();
  });

  it('受控 expanded：切换仅经 onToggle 上报', async () => {
    const { context } = renderDsl({
      type: 'Thinking',
      props: { content: '推理', status: 'done', expanded: false },
      events: { onToggle: { action: 'setState', params: { open: '${event}' } } },
    });

    expect(screen.queryByText('推理')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    await expectEventState(context, 'open', true);
    expect(screen.queryByText('推理')).toBeNull();
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'Thinking', props: { content: 'x', ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=thinking]'));
  });
});

describe('AgentStatus', () => {
  it('running 旋转图标 + 文本 + 耗时', () => {
    renderDsl({ type: 'AgentStatus', props: { status: 'running', text: '检索文档', elapsed: 3 } });

    expect(screen.getByText('检索文档')).toBeTruthy();
    expect(screen.getByText('已用时 3s')).toBeTruthy();
    expect(document.querySelector('[data-slot=agent-status] .animate-spin')).not.toBeNull();
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'AgentStatus', props: { status: 'done', ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=agent-status]'));
  });
});

describe('StreamingText', () => {
  it('streaming 渲染光标；typing 渐进揭示后光标消失', async () => {
    vi.useFakeTimers();
    try {
      renderDsl({ type: 'StreamingText', props: { content: '你好世界', typing: true, speed: 2 } });

      const root = document.querySelector('[data-slot=streaming-text]')!;
      expect(root.textContent).not.toContain('你好世界');
      expect(document.querySelector('[data-slot=streaming-text-cursor]')).not.toBeNull();

      await vi.advanceTimersByTimeAsync(200);
      expect(root.textContent).toContain('你好世界');
      expect(document.querySelector('[data-slot=streaming-text-cursor]')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'StreamingText', props: { content: '探', ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=streaming-text]'));
  });
});

describe('Suggestion', () => {
  it('字符串与对象项混排；点击传出 value', async () => {
    const { context } = renderDsl({
      type: 'Suggestion',
      props: { items: ['写周报', { label: '总结文档', value: 'summarize', icon: 'file-text' }] },
      events: { onSelect: { action: 'setState', params: { picked: '${event}' } } },
    });

    fireEvent.click(screen.getByText('总结文档'));
    await expectEventState(context, 'picked', 'summarize');

    fireEvent.click(screen.getByText('写周报'));
    await expectEventState(context, 'picked', '写周报');
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'Suggestion', props: { items: ['探'], ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=suggestion]'));
  });
});

describe('Prompt / Welcome', () => {
  it('Prompt：标题 / 描述 / 图标；点击传出 value（缺省取 title）', async () => {
    const { context } = renderDsl({
      type: 'Prompt',
      props: { title: '生成月报', description: '汇总本月数据', icon: 'chart-column' },
      events: { onSelect: { action: 'setState', params: { task: '${event}' } } },
    });

    expect(screen.getByText('汇总本月数据')).toBeTruthy();
    fireEvent.click(screen.getByText('生成月报'));
    await expectEventState(context, 'task', '生成月报');
  });

  it('Welcome：默认标题 + prompts 栅格，选择经 onSelect 传出', async () => {
    const { context } = renderDsl({
      type: 'Welcome',
      props: {
        description: '可以问答、写作、分析',
        prompts: [
          { title: '写周报', value: 'weekly' },
          { title: '翻译文档', value: 'translate' },
        ],
      },
      events: { onSelect: { action: 'setState', params: { task: '${event}' } } },
    });

    expect(screen.getByText('有什么可以帮你？')).toBeTruthy();
    expect(screen.getByText('可以问答、写作、分析')).toBeTruthy();
    fireEvent.click(screen.getByText('翻译文档'));
    await expectEventState(context, 'task', 'translate');
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'Welcome', props: { ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=welcome]'));
  });
});

describe('Citation', () => {
  it('编号从 start 起；悬浮展示来源卡', async () => {
    renderDsl({
      type: 'Citation',
      props: {
        start: 3,
        items: [{ title: '设计规范 v2', url: 'https://example.com/spec', snippet: '第三章 组件' }],
      },
    });

    expect(screen.getByText('[3]')).toBeTruthy();
    fireEvent.mouseEnter(screen.getByText('[3]'));
    expect(await screen.findByText('设计规范 v2')).toBeTruthy();
    expect(screen.getByText('第三章 组件')).toBeTruthy();
  });

  it('通用 props', () => {
    const { container } = renderDsl({
      type: 'Citation',
      props: { items: [{ title: '探' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=citation]'));
  });
});

describe('Attachment', () => {
  const items = [
    { id: 'f1', name: '需求.md', fileSize: 2048 },
    { id: 'f2', name: '录屏.mp4', status: 'uploading', progress: 40 },
    { name: '数据.zip', status: 'error' },
  ];

  it('状态呈现：uploading 进度 / error 重试；移除传出 id（无 id 传下标）', async () => {
    const { context } = renderDsl({
      type: 'Attachment',
      props: { items },
      events: {
        onRemove: { action: 'setState', params: { removed: '${event}' } },
        onRetry: { action: 'setState', params: { retried: '${event}' } },
      },
    });

    expect(document.querySelector('[data-slot=attachment-progress]')).not.toBeNull();
    expect(screen.getByText('上传失败')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '移除 需求.md' }));
    await expectEventState(context, 'removed', 'f1');

    fireEvent.click(screen.getByRole('button', { name: '重试 数据.zip' }));
    await expectEventState(context, 'retried', 2);
  });

  it('通用 props', () => {
    const { container } = renderDsl({
      type: 'Attachment',
      props: { items: [{ name: 'a.txt' }], ...COMMON_PROPS },
    });
    expectCommonProps(container.querySelector('[data-slot=attachment]'));
  });
});

describe('ToolCall', () => {
  it('running 默认展开 + 旋转图标；参数 JSON 缩进展示', () => {
    renderDsl({
      type: 'ToolCall',
      props: { name: 'search_docs', status: 'running', params: { query: '月报' }, durationMs: 1200 },
    });

    expect(screen.getByText('search_docs')).toBeTruthy();
    expect(screen.getByText('1.2s')).toBeTruthy();
    expect(document.querySelector('[data-slot=tool-call-params]')!.textContent).toContain('"query": "月报"');
    expect(document.querySelector('[data-slot=tool-call] .animate-spin')).not.toBeNull();
  });

  it('done 默认折叠，点击展开查看结果；通用 props', () => {
    const { container } = renderDsl({
      type: 'ToolCall',
      props: { name: 'calc', result: '42', ...COMMON_PROPS },
    });

    expect(screen.queryByText('42')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('42')).toBeTruthy();
    expectCommonProps(container.querySelector('[data-slot=tool-call]'));
  });

  it('无参数且无结果时不可展开：无 chevron、头部非按钮', () => {
    renderDsl({
      type: 'ToolCall',
      props: { name: 'search_docs', status: 'done' },
    });

    const trigger = document.querySelector('[data-slot=tool-call-trigger]')!;
    expect(trigger.tagName).not.toBe('BUTTON');
    expect(trigger.querySelector('.lucide-chevron-right')).toBeNull();
    expect(trigger.querySelector('.lucide-chevron-down')).toBeNull();
    expect(document.querySelector('[data-slot=tool-call-body]')).toBeNull();
  });
});

describe('ChatMessage', () => {
  it('用户消息右对齐气泡；助手消息 Sender + markdown + thinking + tool-call 段', () => {
    renderDsl({
      type: 'ChatMessage',
      props: {
        role: 'assistant',
        agent: { name: '小 P' },
        time: '10:24',
        showSender: true,
        parts: [
          { type: 'thinking', content: '先检索再回答' },
          { type: 'markdown', content: '**结论**：已完成' },
          { type: 'tool-call', name: 'search', status: 'done' },
          { type: 'status', text: '已生成' },
        ],
        actions: [{ name: 'retry', label: '重试' }],
      },
    });

    expect(screen.getByText('小 P')).toBeTruthy();
    expect(screen.getByText('10:24')).toBeTruthy();
    // thinking 段 done 态默认折叠，展开后可见内容
    expect(screen.queryByText('先检索再回答')).toBeNull();
    fireEvent.click(screen.getByText('思考完成'));
    expect(screen.getByText('先检索再回答')).toBeTruthy();
    expect(screen.getByText('结论').tagName).toBe('STRONG');
    expect(screen.getByText('search')).toBeTruthy();
    expect(screen.getByText('已生成')).toBeTruthy();
    // 操作按钮图标化：无文字 label，仅图标 + Tooltip（label 进 aria-label）
    const retry = document.querySelector('[data-slot=chat-message-action][data-action=retry]')!;
    expect(retry.textContent).toBe('');
    expect(retry.getAttribute('aria-label')).toBe('重试');
    expect(retry.querySelector('[data-slot=icon]')).not.toBeNull();
  });

  it('streaming 态渲染光标；操作经 onAction 传出 name', async () => {
    const { context } = renderDsl({
      type: 'ChatMessage',
      props: {
        role: 'assistant',
        status: 'completed',
        parts: [{ type: 'text', content: '回答' }],
        actions: [{ name: 'copy' }],
      },
      events: { onAction: { action: 'setState', params: { acted: '${event}' } } },
    });

    fireEvent.click(document.querySelector('[data-slot=chat-message-action][data-action=copy]')!);
    await expectEventState(context, 'acted', 'copy');
  });

  it('system 消息居中弱提示：无 Sender、无气泡，12px 浅色文字', () => {
    const { container } = renderDsl({
      type: 'ChatMessage',
      props: {
        role: 'system',
        time: '10:24',
        parts: [{ type: 'text', content: '会话已开启' }],
      },
    });

    const root = container.querySelector('[data-slot=chat-message]')!;
    expect(root.className).toContain('items-center');
    // 不渲染 Sender / 气泡
    expect(container.querySelector('[data-slot=sender]')).toBeNull();
    expect(container.querySelector('[data-slot=bubble]')).toBeNull();
    const part = container.querySelector('[data-slot=chat-message-system-part]')!;
    expect(part.textContent).toBe('会话已开启');
    expect(part.className).toContain('text-center');
    expect(part.className).toContain('text-xs');
    expect(part.className).toContain('text-muted-foreground');
  });

  it('streaming 光标；通用 props', () => {
    const { container } = renderDsl({
      type: 'ChatMessage',
      props: { parts: [{ type: 'text', content: '生成中' }], status: 'streaming', ...COMMON_PROPS },
    });

    expect(document.querySelector('[data-slot=streaming-text-cursor]')).not.toBeNull();
    expectCommonProps(container.querySelector('[data-slot=chat-message]'));
  });
});

describe('MessageList', () => {
  it('逐条渲染；onAction 传出 { id, action }', async () => {
    const { context } = renderDsl({
      type: 'MessageList',
      props: {
        messages: [
          { id: 'm1', role: 'user', parts: [{ type: 'text', content: '问题' }] },
          {
            id: 'm2',
            role: 'assistant',
            parts: [{ type: 'text', content: '回答' }],
            actions: [{ name: 'retry' }],
          },
        ],
      },
      events: { onAction: { action: 'setState', params: { acted: '${event}' } } },
    });

    expect(screen.getByText('问题')).toBeTruthy();
    expect(screen.getByText('回答')).toBeTruthy();

    fireEvent.click(document.querySelector('[data-slot=chat-message-action][data-action=retry]')!);
    await expectEventState(context, 'acted', { id: 'm2', action: 'retry' });
  });

  it('artifacts 段（产物计数）点击经 onOpenArtifacts 传出 { id }；未提供时纯展示', async () => {
    const { context } = renderDsl({
      type: 'MessageList',
      props: {
        messages: [
          {
            id: 'm1',
            role: 'assistant',
            parts: [{ type: 'artifacts', count: 2 }],
          },
        ],
      },
      events: { onOpenArtifacts: { action: 'setState', params: { clicked: '${event}' } } },
    });

    const el = screen.getByText('已生成 2 个产物');
    expect(el.closest('button')).not.toBeNull();
    fireEvent.click(el);
    await expectEventState(context, 'clicked', { id: 'm1' });

    // 未提供 onOpenArtifacts：纯展示，不可点击
    renderDsl({
      type: 'ChatMessage',
      props: { role: 'assistant', parts: [{ type: 'artifacts', count: 1 }] },
    });
    const plain = screen.getAllByText('已生成 1 个产物').pop()!;
    expect(plain.closest('button')).toBeNull();
    expect(plain.closest('[data-slot=chat-message-artifacts]')).not.toBeNull();
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'MessageList', props: { messages: [], ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=message-list]'));
  });
});

describe('Composer', () => {
  it('附件区 + 输入区；发送传出文本；loading 禁用', async () => {
    const { context } = renderDsl({
      type: 'Composer',
      props: {
        placeholder: '输入消息',
        attachments: [{ id: 'a1', name: '资料.pdf' }],
      },
      events: {
        onSubmit: { action: 'setState', params: { sent: '${event}' } },
        onRemoveAttachment: { action: 'setState', params: { removed: '${event}' } },
      },
    });

    expect(screen.getByText('资料.pdf')).toBeTruthy();
    const textarea = screen.getByPlaceholderText('输入消息');
    fireEvent.change(textarea, { target: { value: '你好' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    await expectEventState(context, 'sent', '你好');

    fireEvent.click(screen.getByRole('button', { name: '移除 资料.pdf' }));
    await expectEventState(context, 'removed', 'a1');
  });

  it('无附件时不渲染附件区；通用 props', () => {
    const { container } = renderDsl({ type: 'Composer', props: { ...COMMON_PROPS } });

    expect(container.querySelector('[data-slot=attachment]')).toBeNull();
    expectCommonProps(container.querySelector('[data-slot=composer]'));
  });

  it('模型选择 chip：展示当前模型，弹层选中经 onModelChange 传出 value', async () => {
    const { context } = renderDsl({
      type: 'Composer',
      props: {
        models: [
          { value: 'demo-mock', label: 'demo-mock' },
          { value: 'demo-pro', label: 'demo-pro' },
        ],
        model: 'demo-mock',
      },
      events: {
        onModelChange: { action: 'setState', params: { model: '${event}' } },
      },
    });

    const chip = screen.getByRole('button', { name: '选择模型' });
    expect(chip.textContent).toContain('demo-mock');
    fireEvent.click(chip);
    fireEvent.click(screen.getByRole('option', { name: 'demo-pro' }));
    await expectEventState(context, 'model', 'demo-pro');
    // 选中后弹层关闭
    expect(document.querySelector('[data-slot=composer-model-popover]')).toBeNull();
  });

  it("'+' 按钮弹层：选中在输入区插入行内提及块；发送后由调用方清空", async () => {
    const { context } = renderDsl(
      {
        type: 'Composer',
        props: {
          placeholder: '输入消息',
          contexts: [
            {
              trigger: '+',
              label: '上下文',
              items: [{ id: 'm1', label: '记忆：偏好设置' }],
            },
          ],
          contextItems: '${state.chips}',
        },
        events: {
          onContextItemsChange: { action: 'setState', params: { chips: '${event}' } },
          // 发送后清空 chips 由调用方在 onSubmit 闭环里处理（组件不擅自清空受控数据）
          onSubmit: [
            { action: 'setState', params: { sent: '${event}' } },
            { action: 'setState', params: { chips: [] } },
          ],
        },
      },
      { state: { chips: [] } },
    );

    fireEvent.click(screen.getByRole('button', { name: '添加上下文' }));
    const popover = document.querySelector('[data-slot=composer-context-popover]')!;
    expect(popover.textContent).toContain('上下文');
    fireEvent.click(screen.getByText('记忆：偏好设置'));

    // 行内提及块插入输入区（contenteditable，无独立 chips 行）
    const field = document.querySelector('[data-slot=mention-input]')!;
    expect(field.querySelector('[data-mention-chip]')!.textContent).toContain('记忆：偏好设置');
    await expectEventState(context, 'chips', [
      { id: 'm1', label: '记忆：偏好设置', trigger: '+' },
    ]);

    // 发送：块序列化为 trigger+label；发送后输入区与 chips 清空
    typeIntoMentionField(field as HTMLElement, '你好');
    fireEvent.keyDown(field, { key: 'Enter' });
    await expectEventState(context, 'sent', '+记忆：偏好设置 你好');
    await expectEventState(context, 'chips', []);
    expect(field.querySelector('[data-mention-chip]')).toBeNull();
  });

  it("'@' 行内提及：词边界触发光标处菜单并过滤，回车选中替换为行内块，退格整体删除", async () => {
    const { context } = renderDsl(
      {
        type: 'Composer',
        props: {
          placeholder: '输入消息',
          contexts: [
            {
              trigger: '@',
              label: '智能体',
              items: [
                { id: 'helper', label: '小助手' },
                { id: 'coder', label: '代码专家' },
              ],
            },
          ],
          contextItems: '${state.chips}',
        },
        events: {
          onContextItemsChange: { action: 'setState', params: { chips: '${event}' } },
          onChange: { action: 'setState', params: { text: '${event}' } },
        },
      },
      { state: { chips: [] } },
    );

    const field = document.querySelector('[data-slot=mention-input]') as HTMLElement;
    // 非词边界的 @ 不触发
    typeIntoMentionField(field, '邮件 a@b');
    expect(document.querySelector('[data-slot=mention-menu]')).toBeNull();

    // 词边界 @：菜单在光标处打开并按 query 过滤（只留「小助手」）
    typeIntoMentionField(field, ' @小');
    const menu = document.querySelector('[data-slot=mention-menu]')!;
    expect(menu.textContent).toContain('智能体');
    expect(menu.textContent).toContain('小助手');
    expect(menu.textContent).not.toContain('代码专家');

    // ↑/↓ 移动候选（仅一项保持 0），回车选中：'@小' 替换为行内提及块
    fireEvent.keyDown(field, { key: 'ArrowDown' });
    fireEvent.keyDown(field, { key: 'ArrowUp' });
    fireEvent.keyDown(field, { key: 'Enter' });
    const chip = field.querySelector('[data-mention-chip]')!;
    expect(chip.textContent).toContain('小助手');
    // 行内块样式：浅色背景 + 圆角 + 图标
    expect(chip.className).toContain('bg-muted');
    expect(chip.className).toContain('rounded-md');
    expect(chip.querySelector('svg')).not.toBeNull();
    // 菜单关闭；块列表与序列化文本同步（块 → trigger+label）
    expect(document.querySelector('[data-slot=mention-menu]')).toBeNull();
    await expectEventState(context, 'chips', [
      { id: 'helper', label: '小助手', trigger: '@' },
    ]);
    await expectEventState(context, 'text', '邮件 a@b @小助手 ');

    // 退格整体删除：光标紧贴块后（尾随文本节点 0 偏移）
    const caretNode = chip.nextSibling as Text;
    const range = document.createRange();
    range.setStart(caretNode, 0);
    range.collapse(true);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    fireEvent.keyDown(field, { key: 'Backspace' });
    expect(field.querySelector('[data-mention-chip]')).toBeNull();
    await expectEventState(context, 'chips', []);
  });

  it('非受控提及（不传 contextItems）：插入的行内块不被清空', async () => {
    renderDsl({
      type: 'Composer',
      props: {
        placeholder: '输入消息',
        contexts: [
          {
            trigger: '@',
            label: '智能体',
            items: [{ id: 'helper', label: '小助手' }],
          },
        ],
      },
    });

    const field = document.querySelector('[data-slot=mention-input]') as HTMLElement;
    typeIntoMentionField(field, '@');
    expect(document.querySelector('[data-slot=mention-menu]')).not.toBeNull();
    fireEvent.keyDown(field, { key: 'Enter' });

    const chip = field.querySelector('[data-mention-chip]')!;
    expect(chip.textContent).toContain('小助手');
    // 回归：非受控模式下 chips 内部自持，插入后不应被受控同步效应移除
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(field.querySelector('[data-mention-chip]')).not.toBeNull();
  });

  it('footer 槽渲染 DSL 子树；提供 onAttachFiles 时渲染附件钮', () => {
    renderDsl({
      type: 'Composer',
      props: {
        footer: { type: 'Text', props: { text: '底部槽内容' } },
      },
      events: {
        onAttachFiles: { action: 'setState', params: { files: 'attached' } },
      },
    });

    expect(screen.getByText('底部槽内容')).toBeTruthy();
    expect(screen.getByRole('button', { name: '添加附件' })).toBeTruthy();
  });

  it('streaming 时发送钮切换为停止钮：点击经 onStop 传出，不打断输入、不触发发送', async () => {
    const { context } = renderDsl({
      type: 'Composer',
      props: { placeholder: '输入消息', streaming: true },
      events: {
        onStop: { action: 'setState', params: { stopped: true } },
        onSubmit: { action: 'setState', params: { sent: '${event}' } },
      },
    });

    const textarea = screen.getByPlaceholderText('输入消息') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '写到一半' } });
    const stopButton = screen.getByRole('button', { name: '停止生成' }) as HTMLButtonElement;
    expect(stopButton.disabled).toBe(false);
    fireEvent.click(stopButton);
    await expectEventState(context, 'stopped', true);
    expect(context.state.get('sent')).toBeUndefined();
    expect(textarea.value).toBe('写到一半');
  });

  it('toolbarStart / toolbarEnd 槽渲染 DSL 子树（内建按钮保留）', () => {
    renderDsl({
      type: 'Composer',
      props: {
        toolbarStart: { type: 'Text', props: { text: '左槽内容' } },
        toolbarEnd: { type: 'Text', props: { text: '右槽内容' } },
      },
      events: {
        onAttachFiles: { action: 'setState', params: { files: 'attached' } },
      },
    });

    expect(screen.getByText('左槽内容')).toBeTruthy();
    expect(screen.getByText('右槽内容')).toBeTruthy();
    // 内建附件钮与发送钮不受槽位影响
    expect(screen.getByRole('button', { name: '添加附件' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '发送' })).toBeTruthy();
  });

  it('hideToolbar 抑制工具栏行（内建按钮 / 槽位 / 发送钮一并隐藏），Enter 发送保留', async () => {
    const { context } = renderDsl({
      type: 'Composer',
      props: {
        placeholder: '输入消息',
        hideToolbar: true,
        toolbarStart: { type: 'Text', props: { text: '左槽内容' } },
        models: [{ value: 'demo-mock', label: 'demo-mock' }],
      },
      events: {
        onAttachFiles: { action: 'setState', params: { files: 'attached' } },
        onSubmit: { action: 'setState', params: { sent: '${event}' } },
      },
    });

    expect(screen.queryByRole('button', { name: '发送' })).toBeNull();
    expect(screen.queryByRole('button', { name: '添加附件' })).toBeNull();
    expect(screen.queryByRole('button', { name: '选择模型' })).toBeNull();
    expect(screen.queryByText('左槽内容')).toBeNull();

    const textarea = screen.getByPlaceholderText('输入消息');
    fireEvent.change(textarea, { target: { value: '回车发送' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    await expectEventState(context, 'sent', '回车发送');
  });

  it('onPlusMenu 接管 + 钮：点击传出锚点、不开内建弹层；无 + 源也渲染入口', async () => {
    const { context, unmount } = renderDsl({
      type: 'Composer',
      props: {
        contexts: [
          { trigger: '+', label: '上下文', items: [{ id: 'm1', label: '记忆：偏好设置' }] },
        ],
      },
      events: {
        onPlusMenu: { action: 'setState', params: { plusAnchor: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '添加上下文' }));
    await vi.waitFor(() => {
      expect(context.state.get('plusAnchor')).toBeTruthy();
    });
    // 内建候选弹层不再打开
    expect(document.querySelector('[data-slot=composer-context-popover]')).toBeNull();
    unmount();

    // 无 '+' 源时提供回调同样渲染入口
    renderDsl({
      type: 'Composer',
      events: {
        onPlusMenu: { action: 'setState', params: { plusAnchor: '${event}' } },
      },
    });
    expect(screen.getByRole('button', { name: '添加上下文' })).toBeTruthy();
  });

  it('onMentionTrigger 接管 @ 提及：内建 @ 源让位为纯 textarea，词边界 @ 传出 query', async () => {
    const { context } = renderDsl({
      type: 'Composer',
      props: {
        placeholder: '输入消息',
        contexts: [
          {
            trigger: '@',
            label: '智能体',
            items: [{ id: 'helper', label: '小助手' }],
          },
        ],
      },
      events: {
        onMentionTrigger: { action: 'setState', params: { mentionQuery: '${event}' } },
      },
    });

    // '@' 源让位给调用方：输入区为纯 textarea（非 contenteditable 行内提及）
    expect(document.querySelector('[data-slot=mention-input]')).toBeNull();
    const textarea = screen.getByPlaceholderText('输入消息') as HTMLTextAreaElement;

    // 非词边界的 @ 不触发
    fireEvent.change(textarea, { target: { value: '邮件 a@b' } });
    expect(context.state.get('mentionQuery')).toBeUndefined();

    // 词边界 @：传出 '@' 后 query
    fireEvent.change(textarea, { target: { value: '邮件 a@b @小' } });
    await expectEventState(context, 'mentionQuery', '小');
  });

  it('附件卡片点击经 onAttachmentClick 传出该附件项；移除钮不冒泡触发点击', async () => {
    const { context } = renderDsl({
      type: 'Composer',
      props: { attachments: [{ id: 'a1', name: '资料.pdf' }] },
      events: {
        onAttachmentClick: { action: 'setState', params: { clicked: '${event}' } },
        onRemoveAttachment: { action: 'setState', params: { removed: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: '移除 资料.pdf' }));
    await expectEventState(context, 'removed', 'a1');
    // 移除钮 stopPropagation：不触发卡片点击
    expect(context.state.get('clicked')).toBeUndefined();

    fireEvent.click(screen.getByText('资料.pdf'));
    await vi.waitFor(() => {
      expect(context.state.get('clicked')).toEqual({ id: 'a1', name: '资料.pdf' });
    });
  });
});

describe('ConversationList', () => {
  const items = [
    { id: 'c1', title: '月报讨论', description: '已生成初稿', time: '09:30' },
    { id: 'c2', title: '架构评审', description: '待确认方案', time: '昨天' },
  ];

  it('选择（非受控高亮）；删除传出 id 且阻止冒泡', async () => {
    const { context } = renderDsl({
      type: 'ConversationList',
      props: { items },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
        onDelete: { action: 'setState', params: { deleted: '${event}' } },
      },
    });

    fireEvent.click(screen.getByText('月报讨论'));
    await expectEventState(context, 'selected', 'c1');
    expect(document.querySelector('[data-slot=conversation-list-item][data-active]')!.textContent).toContain('月报讨论');

    fireEvent.click(screen.getByRole('button', { name: '删除 架构评审' }));
    await expectEventState(context, 'deleted', 'c2');
    // 删除不触发选择
    expect(context.state.get('selected')).toBe('c1');
  });

  it('searchable 过滤；受控 activeId 不自行切换', async () => {
    const { context } = renderDsl({
      type: 'ConversationList',
      props: { items, searchable: true, activeId: 'c1' },
      events: { onSelect: { action: 'setState', params: { selected: '${event}' } } },
    });

    fireEvent.change(document.querySelector('[data-slot=conversation-list-search]')!, {
      target: { value: '架构' },
    });
    expect(screen.queryByText('月报讨论')).toBeNull();
    expect(screen.getByText('架构评审')).toBeTruthy();

    fireEvent.change(document.querySelector('[data-slot=conversation-list-search]')!, { target: { value: '' } });
    fireEvent.click(screen.getByText('架构评审'));
    await expectEventState(context, 'selected', 'c2');
    expect(document.querySelector('[data-slot=conversation-list-item][data-active]')!.textContent).toContain('月报讨论');
  });

  it('通用 props', () => {
    const { container } = renderDsl({ type: 'ConversationList', props: { items, ...COMMON_PROPS } });
    expectCommonProps(container.querySelector('[data-slot=conversation-list]'));
  });
});
