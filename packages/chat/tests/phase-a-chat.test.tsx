// @vitest-environment jsdom
/**
 * 阶段 A 交互契约：ConversationList 管理能力 / ResponseFeedback /
 * AgentQuestion（DSL 注册与 question part 集成）。
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AgentQuestion } from '../src/components/AgentQuestion/index.js';
import { ConversationList } from '../src/components/ConversationList/index.js';
import { ResponseFeedback } from '../src/components/ResponseFeedback/index.js';
import { createComponentRegistry } from './helpers.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  renderDsl,
} from './helpers.js';
import { ChatView, ConversationStore, type ChatMessage } from '../src/index.js';

afterEach(cleanup);

const OPTIONS = [
  { id: 'a', label: '方案 A' },
  { id: 'b', label: '方案 B', description: '更稳妥' },
  { id: 'c', label: '方案 C' },
];

describe('ConversationList 管理能力', () => {
  const baseItems = [
    {
      id: 'pinned-1',
      title: '置顶会话',
      pinned: true,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'today-1',
      title: '今天的会话',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'yesterday-1',
      title: '昨天的会话',
      updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
    },
    {
      id: 'older-1',
      title: '更早的会话',
      updatedAt: new Date(Date.now() - 40 * 86_400_000).toISOString(),
    },
    {
      id: 'archived-1',
      title: '已归档会话',
      archived: true,
    },
  ];

  it('groupByDate：置顶 / 今天 / 昨天 / 更早 / 已归档分组与文案；通用 props', () => {
    const { container } = render(
      <ConversationList
        items={baseItems}
        groupByDate
        className={COMMON_PROPS_PROBE.className}
        style={COMMON_PROPS_PROBE.style}
      />,
    );

    const labels = Array.from(
      container.querySelectorAll('[data-slot=conversation-group-label]'),
    ).map((node) => node.textContent);
    expect(labels).toEqual(['置顶', '今天', '昨天', '更早', '已归档']);
    const groups = Array.from(
      container.querySelectorAll('[data-slot=conversation-group]'),
    ).map((node) => node.getAttribute('data-group'));
    expect(groups).toEqual(['pinned', 'today', 'yesterday', 'older', 'archived']);
    expectCommonProps(container.querySelector('[data-slot=conversation-list]'));
  });

  it('置顶回调与运行中指示点', () => {
    const onPin = vi.fn();
    render(
      <ConversationList
        items={[{ id: 'a', title: '会话 A', running: true }]}
        onPin={onPin}
      />,
    );

    expect(screen.getByText('运行中')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '置顶' }));
    expect(onPin).toHaveBeenCalledWith('a', true);
  });

  it('重命名：Enter 提交、Esc 取消、空值忽略', () => {
    const onRename = vi.fn();
    render(
      <ConversationList
        items={[{ id: 'a', title: '旧标题' }]}
        onRename={onRename}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '重命名' }));
    const input = screen.getByDisplayValue('旧标题');
    fireEvent.change(input, { target: { value: '  新标题  ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRename).toHaveBeenCalledWith('a', '新标题');
    expect(screen.getByText('旧标题')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '重命名' }));
    fireEvent.change(screen.getByDisplayValue('旧标题'), {
      target: { value: '放弃的标题' },
    });
    fireEvent.keyDown(screen.getByDisplayValue('放弃的标题'), {
      key: 'Escape',
    });
    expect(screen.queryByDisplayValue('放弃的标题')).toBeNull();
    expect(onRename).toHaveBeenCalledTimes(1);
  });

  it('归档：先隐藏并显示 Undo，撤销后恢复且不回调；undoMs=0 立即回调', () => {
    const onArchive = vi.fn();
    const { container, rerender } = render(
      <ConversationList
        items={[{ id: 'a', title: '待归档' }]}
        onArchive={onArchive}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '归档' }));
    expect(screen.queryByText('待归档')).toBeNull();
    expect(onArchive).not.toHaveBeenCalled();
    expect(
      container.querySelector('[data-slot=conversation-list-undo]')
        ?.textContent,
    ).toContain('已归档 待归档');
    expect(
      container.querySelector('[role=status]')?.textContent,
    ).toContain('已归档 待归档');

    fireEvent.click(screen.getByRole('button', { name: '撤销' }));
    expect(screen.getByText('待归档')).toBeTruthy();
    expect(onArchive).not.toHaveBeenCalled();

    rerender(
      <ConversationList
        items={[{ id: 'a', title: '待归档' }]}
        onArchive={onArchive}
        undoMs={0}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '归档' }));
    expect(onArchive).toHaveBeenCalledWith('a');
  });

  it('删除：缺省保持同步回调（存量语义）；显式 undoMs 时进入 Undo 窗口', () => {
    const onDelete = vi.fn();
    const { container, rerender } = render(
      <ConversationList
        items={[{ id: 'a', title: '待删除' }]}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '删除 待删除' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('a');

    onDelete.mockClear();
    rerender(
      <ConversationList
        items={[{ id: 'a', title: '待删除' }]}
        onDelete={onDelete}
        undoMs={5000}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '删除 待删除' }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText('待删除')).toBeNull();
    expect(
      container.querySelector('[data-slot=conversation-list-undo]')
        ?.textContent,
    ).toContain('已删除 待删除');

    fireEvent.click(screen.getByRole('button', { name: '撤销' }));
    expect(screen.getByText('待删除')).toBeTruthy();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('键盘 ↑/↓ 移动焦点，Enter 选择，aria-current 标记激活项', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <ConversationList
        items={[
          { id: 'a', title: '会话 A' },
          { id: 'b', title: '会话 B' },
        ]}
        onSelect={onSelect}
      />,
    );

    const rows = Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-slot=conversation-list-item-button]',
      ),
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]!.getAttribute('tabindex')).toBe('0');
    expect(rows[1]!.getAttribute('tabindex')).toBe('-1');

    rows[0]!.focus();
    fireEvent.keyDown(rows[0]!, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(rows[1]);
    fireEvent.keyDown(rows[1]!, { key: 'Home' });
    expect(document.activeElement).toBe(rows[0]);

    fireEvent.keyDown(rows[0]!, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('a');
    expect(
      container
        .querySelector('[data-slot=conversation-list-item]')
        ?.getAttribute('data-active'),
    ).toBe('true');
    expect(
      container
        .querySelector('[data-slot=conversation-list-item-button]')
        ?.getAttribute('aria-current'),
    ).toBe('page');
  });

  it('DSL 注册：items/searchable/events 与旧契约一致', () => {
    const registry = createComponentRegistry();
    expect(registry.has('ConversationList')).toBe(true);

    const { container } = renderDsl({
      type: 'ConversationList',
      props: {
        items: [
          { id: 'a', title: '架构评审' },
          { id: 'b', title: '月报讨论' },
        ],
        searchable: true,
      },
    });
    fireEvent.change(
      container.querySelector('[data-slot=conversation-list-search]')!,
      { target: { value: '架构' } },
    );
    expect(screen.getByText('架构评审')).toBeTruthy();
    expect(screen.queryByText('月报讨论')).toBeNull();
  });
});

describe('ResponseFeedback', () => {
  it('inline：点赞立即提交，致谢 + Undo 撤销', () => {
    const onRate = vi.fn();
    const onSubmit = vi.fn();
    const onUndo = vi.fn();
    render(
      <ResponseFeedback
        onRate={onRate}
        onSubmit={onSubmit}
        onUndo={onUndo}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '有帮助' }));
    expect(onRate).toHaveBeenCalledWith('up');
    expect(onSubmit).toHaveBeenCalledWith({
      rating: 'up',
      reasons: [],
      note: '',
    });
    expect(screen.getAllByText('感谢你的反馈').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('status').textContent,
    ).toContain('感谢你的反馈');

    fireEvent.click(screen.getByRole('button', { name: '撤销' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '有帮助' })).toBeTruthy();
  });

  it('inline：点踩展开原因 chips（aria-pressed）+ 备注，提交完整反馈', () => {
    const onSubmit = vi.fn();
    const reasonOptions = [
      { id: 'inaccurate', label: '不准确' },
      { id: 'offTopic', label: '跑题' },
    ];
    const { container } = render(
      <ResponseFeedback
        reasonOptions={reasonOptions}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '没有帮助' }));
    const panel = container.querySelector('[data-slot=response-feedback-panel]');
    expect(panel).not.toBeNull();
    expect(
      screen.getByRole('group', { name: '原因' }),
    ).toBeTruthy();

    const chip = screen.getByRole('button', { name: '不准确' });
    fireEvent.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    fireEvent.change(
      container.querySelector('[data-slot=response-feedback-note]')!,
      { target: { value: '缺少数据来源' } },
    );
    fireEvent.click(screen.getByRole('button', { name: '提交反馈' }));

    expect(onSubmit).toHaveBeenCalledWith({
      rating: 'down',
      reasons: ['inaccurate'],
      note: '缺少数据来源',
    });
    expect(screen.getAllByText('感谢你的反馈').length).toBeGreaterThan(0);
  });

  it('detailed：1–5 分 + 原因常显；undoMs=0 不展示 Undo', () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <ResponseFeedback variant="detailed" undoMs={0} onSubmit={onSubmit} />,
    );

    expect(
      container.querySelectorAll('[data-slot=response-feedback-score]'),
    ).toHaveLength(5);
    expect(
      container.querySelector('[data-slot=response-feedback-panel]'),
    ).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '4 分' }));
    expect(
      screen.getByRole('button', { name: '4 分' }).getAttribute('aria-pressed'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '提交反馈' }));
    expect(onSubmit).toHaveBeenCalledWith({
      rating: 4,
      reasons: [],
      note: '',
    });
    expect(screen.queryByRole('button', { name: '撤销' })).toBeNull();
  });

  it('通用 props 与 DSL 注册', () => {
    const { container } = render(
      <ResponseFeedback
        className={COMMON_PROPS_PROBE.className}
        style={COMMON_PROPS_PROBE.style}
      />,
    );
    expectCommonProps(container.querySelector('[data-slot=response-feedback]'));
  });
});

describe('AgentQuestion', () => {
  it('单选点击即提交；推荐项标记与理由；回答后可 Undo', () => {
    const onSubmit = vi.fn();
    const onUndo = vi.fn();
    const { container } = render(
      <AgentQuestion
        question="选择部署方案"
        description="会影响发布窗口"
        options={OPTIONS}
        suggested={{ optionId: 'b', reason: '风险最低' }}
        onSubmit={onSubmit}
        onUndo={onUndo}
      />,
    );

    const group = screen.getByRole('radiogroup', { name: '选择部署方案' });
    expect(group).toBeTruthy();
    expect(screen.getByText('推荐理由：风险最低')).toBeTruthy();

    fireEvent.click(screen.getByRole('radio', { name: /方案 B/ }));
    expect(onSubmit).toHaveBeenCalledWith({ optionIds: ['b'] });
    expect(container.querySelector('[data-status=answered]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot=agent-question-result]')?.textContent,
    ).toBe('方案 B');

    fireEvent.click(screen.getByRole('button', { name: '撤销' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('radiogroup')).toBeTruthy();
  });

  it('多选：aria-checked 切换、其他输入与提交按钮', () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <AgentQuestion
        question="选择关注指标"
        options={OPTIONS}
        multiple
        allowOther
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByRole('group', { name: '选择关注指标' })).toBeTruthy();
    fireEvent.click(screen.getByRole('checkbox', { name: /方案 A/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: /方案 C/ }));
    expect(
      screen.getByRole('checkbox', { name: /方案 A/ }).getAttribute('aria-checked'),
    ).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: /其他…/ }));
    fireEvent.change(
      container.querySelector('[data-slot=agent-question-other-input]')!,
      { target: { value: '留存率' } },
    );
    fireEvent.click(screen.getByRole('button', { name: '提交' }));

    expect(onSubmit).toHaveBeenCalledWith({
      optionIds: ['a', 'c'],
      other: '留存率',
    });
    expect(container.querySelector('[data-status=answered]')).not.toBeNull();
  });

  it('让 agent 决定：delegated 状态与 Undo', () => {
    const onDelegate = vi.fn();
    const onUndo = vi.fn();
    const { container } = render(
      <AgentQuestion
        question="是否继续"
        options={OPTIONS}
        onDelegate={onDelegate}
        onUndo={onUndo}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /让 agent 决定/ }));
    expect(onDelegate).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[data-status=delegated]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot=agent-question-result]')?.textContent,
    ).toBe('已交由 agent 决定');

    fireEvent.click(screen.getByRole('button', { name: '撤销' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('radiogroup')).toBeTruthy();
  });

  it('键盘：方向键移动焦点、Home/End 边界；通用 props', () => {
    const { container } = render(
      <AgentQuestion
        question="选择方案"
        options={OPTIONS}
        className={COMMON_PROPS_PROBE.className}
        style={COMMON_PROPS_PROBE.style}
      />,
    );
    expectCommonProps(container.querySelector('[data-slot=agent-question]'));

    const radios = screen.getAllByRole('radio');
    radios[0]!.focus();
    fireEvent.keyDown(radios[0]!, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(radios[1]);
    fireEvent.keyDown(radios[1]!, { key: 'End' });
    expect(document.activeElement).toBe(radios[2]);
    fireEvent.keyDown(radios[2]!, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(radios[1]);
  });

  it('DSL 注册 + question part 经 ChatView 分发回答事件', () => {
    const registry = createComponentRegistry();
    expect(registry.has('AgentQuestion')).toBe(true);

    const store = new ConversationStore();
    const message: ChatMessage = {
      id: 'a1',
      role: 'assistant',
      status: 'completed',
      parts: [
        {
          id: 'q1',
          type: 'question',
          status: 'ready',
          question: {
            question: '选择部署方案',
            options: OPTIONS,
          },
        },
      ],
    };
    store.appendMessage(message);
    const onQuestionAnswer = vi.fn();
    render(
      <ChatView store={store} onQuestionAnswer={onQuestionAnswer} />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /方案 A/ }));
    expect(onQuestionAnswer).toHaveBeenCalledWith({
      messageId: 'a1',
      partId: 'q1',
      answer: { optionIds: ['a'] },
    });
  });
});
