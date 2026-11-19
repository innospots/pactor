// @vitest-environment jsdom
/**
 * 阶段 B 交互契约：Composer 队列 / 模式 / 命令 / token 托盘 / 文件规则，
 * MessageList 分组 / 日期 / 未读，自动滚动新消息计数，SourceList 脚注 /
 * 面板，ToolCall 结构化结果 / 计时 / 重试，审批队列二期（风险分组 /
 * 批量决议 / resolved log + Undo / 结构化 payload）。
 */
import './setup.js';

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  checkFiles,
  Composer as DslComposer,
} from '../src/components/Composer/index.js';
import { MessageList } from '../src/components/MessageList/index.js';
import {
  SourceList,
  parseSourceText,
} from '../src/components/SourceList/index.js';
import { ToolCall } from '../src/components/ToolCall/index.js';
import {
  ApprovalQueue,
  ChatView,
  Composer as ProductComposer,
  ConversationStore,
  createApprovalQueue,
  type ApprovalDecisionEvent,
  type ApprovalUndoEvent,
  type ChatMessage,
} from '../src/index.js';
import {
  COMMON_PROPS_PROBE,
  createComponentRegistry,
  expectCommonProps,
  renderDsl,
} from './helpers.js';

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

function makeFile(name: string, bytes: number, type: string): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

function getDslTextarea(): HTMLTextAreaElement {
  return document.querySelector('[data-slot=composer] textarea')!;
}

describe('SourceList', () => {
  it('parseSourceText：切分 [n] / [n,m] marker，0 与普通文本原样保留', () => {
    expect(parseSourceText('增长 [1] 来自 [2, 3]，另见 [0]。')).toEqual([
      { type: 'text', text: '增长 ' },
      { type: 'markers', text: '[1]', numbers: [1] },
      { type: 'text', text: ' 来自 ' },
      { type: 'markers', text: '[2, 3]', numbers: [2, 3] },
      { type: 'text', text: '，另见 ' },
      { type: 'text', text: '[0]' },
      { type: 'text', text: '。' },
    ]);
    expect(parseSourceText('普通文本')).toEqual([
      { type: 'text', text: '普通文本' },
    ]);
    expect(parseSourceText('')).toEqual([]);
  });

  it('footnotes：marker 悬浮卡、点击回调、编号来源与标题语义；通用 props', () => {
    const onSourceClick = vi.fn();
    const sources = [
      {
        id: 'a',
        title: '财报',
        url: 'https://example.com/report',
        snippet: '营收增长',
      },
      { id: 'b', title: '公告', url: 'https://example.com/news' },
    ];
    const { container } = render(
      <SourceList
        text="增长来自 [1]，成本见 [2,3]。"
        sources={sources}
        onSourceClick={onSourceClick}
        className={COMMON_PROPS_PROBE.className}
        style={COMMON_PROPS_PROBE.style}
      />,
    );

    const section = container.querySelector('[data-slot=source-list]')!;
    expectCommonProps(section);
    expect(section.getAttribute('data-variant')).toBe('footnotes');
    expect(
      section.getAttribute('aria-labelledby'),
    ).toBe(
      container.querySelector('[data-slot=source-list-header] h3')!.id,
    );
    expect(screen.getByText('来源')).toBeTruthy();
    expect(screen.getByText('2 个来源')).toBeTruthy();

    // 只有存在对应来源的编号渲染可交互 marker；越界编号退化为纯文本
    const markers = container.querySelectorAll(
      '[data-slot=source-list-marker]',
    );
    expect(markers).toHaveLength(2);
    expect(
      container.querySelector('[data-slot=source-list-text]')!.textContent,
    ).toContain('[3]');
    expect(
      screen.getByRole('button', { name: '来源 1：财报' }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '来源 1：财报' }));
    expect(onSourceClick).toHaveBeenCalledWith(sources[0], 0);

    const items = container.querySelectorAll(
      '[data-slot=source-list-item]',
    );
    expect(items).toHaveLength(2);
    expect(items[0]!.getAttribute('data-source-index')).toBe('1');
    const link = screen.getByRole('link', { name: '打开来源 财报' });
    expect(link.getAttribute('href')).toBe('https://example.com/report');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noreferrer');
  });

  it('footnotes 空态：暂无来源 + 0 个来源；自定义标题', () => {
    render(<SourceList title="引用" />);
    expect(screen.getByText('引用')).toBeTruthy();
    expect(screen.getByText('0 个来源')).toBeTruthy();
    expect(screen.getByText('暂无来源')).toBeTruthy();
  });

  it('panel：按站点分组、claims 映射（id / 序号兜底）与来源链接', () => {
    const sources = [
      {
        id: 'a',
        title: '财报',
        url: 'https://www.example.com/report',
        snippet: '营收增长',
      },
      { id: 'b', title: '公告', site: '交易所' },
      // 无 id 的来源允许 claims 用序号（从 1 起）兜底映射
      { title: '博客', url: 'https://blog.example.com/post' },
    ];
    const claims = [
      { id: 'c1', text: '营收增长 20%', sourceIds: ['a'] },
      { id: 'c2', text: '公告提及回购', sourceIds: ['b'] },
      { id: 'c3', text: '社区讨论', sourceIds: ['3'] },
      { id: 'c4', text: '未命中的说明', sourceIds: ['missing'] },
    ];
    const { container } = render(
      <SourceList variant="panel" sources={sources} claims={claims} />,
    );

    const groups = Array.from(
      container.querySelectorAll('[data-slot=source-list-group]'),
    );
    expect(groups.map((group) => group.getAttribute('data-site'))).toEqual([
      'example.com',
      '交易所',
      'blog.example.com',
    ]);
    const itemText = (index: number): string =>
      container.querySelector(
        `[data-slot=source-list-item][data-source-index="${index}"]`,
      )!.textContent ?? '';
    expect(itemText(1)).toContain('营收增长 20%');
    expect(itemText(2)).toContain('公告提及回购');
    expect(itemText(3)).toContain('社区讨论');
    expect(itemText(3)).not.toContain('未命中的说明');
    expect(screen.getAllByText('相关说明')).toHaveLength(3);
    expect(
      screen.getByRole('link', { name: '打开来源 财报' }).getAttribute('href'),
    ).toBe('https://www.example.com/report');
    // 无 url 的来源不渲染链接
    expect(screen.getByText('公告')).toBeTruthy();
  });

  it('DSL 注册：SourceList 可声明渲染', () => {
    expect(createComponentRegistry().has('SourceList')).toBe(true);
    renderDsl({
      type: 'SourceList',
      props: {
        text: '结论 [1]',
        sources: [{ id: 'a', title: '财报', url: 'https://example.com' }],
      },
    });
    expect(
      screen.getByRole('link', { name: '打开来源 财报' }),
    ).toBeTruthy();
  });
});

describe('MessageList 会话流增强', () => {
  const t0 = new Date(2026, 0, 5, 10, 0).getTime();

  function message(
    id: string,
    role: 'user' | 'assistant' | 'system',
    createdAt: number,
    status: ChatMessage['status'] = 'completed',
  ) {
    return {
      id,
      role,
      status,
      createdAt,
      showSender: true,
      parts: [{ type: 'text' as const, content: id }],
    };
  }

  it('同角色窗口内归组（仅组首展示发送方）与 role=log / aria-busy', () => {
    const { container } = render(
      <MessageList
        messages={[
          message('m1', 'user', t0),
          message('m2', 'user', t0 + 60_000),
          message('m3', 'assistant', t0 + 120_000),
          message('m4', 'assistant', t0 + 120_000 + 6 * 60_000),
        ]}
      />,
    );

    const root = container.querySelector('[data-slot=message-list]')!;
    expect(root.getAttribute('role')).toBe('log');
    expect(root.getAttribute('aria-label')).toBe('消息列表');
    expect(root.getAttribute('tabindex')).toBe('0');
    expect(root.getAttribute('aria-busy')).toBeNull();

    expect(container.querySelectorAll('[data-slot=sender]')).toHaveLength(3);
    const groups = Array.from(
      container.querySelectorAll('[data-slot=message-list-group]'),
    );
    expect(
      groups.map((group) => group.getAttribute('data-group-start')),
    ).toEqual(['true', null, 'true', 'true']);
  });

  it('streaming 状态设置 aria-busy；groupWindowMs=0 关闭分组', () => {
    const { container } = render(
      <MessageList
        groupWindowMs={0}
        messages={[
          message('m1', 'user', t0),
          message('m2', 'user', t0 + 1000, 'streaming'),
        ]}
      />,
    );
    expect(
      container
        .querySelector('[data-slot=message-list]')!
        .getAttribute('aria-busy'),
    ).toBe('true');
    expect(container.querySelectorAll('[data-slot=sender]')).toHaveLength(2);
  });

  it('日期分隔（今天 / 昨天）与未读分隔', () => {
    const now = new Date();
    const todayTs = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      10,
    ).getTime();
    const yesterdayTs = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
      10,
    ).getTime();

    const { container } = render(
      <MessageList
        showDateDividers
        unreadFrom="m2"
        messages={[
          message('m1', 'assistant', yesterdayTs),
          message('m2', 'assistant', todayTs),
        ]}
      />,
    );

    const dates = Array.from(
      container.querySelectorAll('[data-slot=message-list-date]'),
    ).map((node) => node.textContent);
    expect(dates).toEqual(['昨天', '今天']);
    expect(
      container.querySelector('[data-slot=message-list-unread]')?.textContent,
    ).toContain('未读消息');
    // 未读分隔位于 m2 之前（消息 DOM 顺序：m1 → 分隔 → m2）
    const slots = Array.from(
      container.querySelectorAll(
        '[data-slot=message-list-date], [data-slot=message-list-unread], [data-slot=message-list-group]',
      ),
    ).map((node) => node.getAttribute('data-slot'));
    expect(slots).toEqual([
      'message-list-date',
      'message-list-group',
      'message-list-date',
      'message-list-unread',
      'message-list-group',
    ]);
  });

  it('缺省不插入日期 / 未读分隔；通用 props', () => {
    const { container } = render(
      <MessageList
        messages={[message('m1', 'assistant', t0)]}
        className={COMMON_PROPS_PROBE.className}
        style={COMMON_PROPS_PROBE.style}
      />,
    );
    expectCommonProps(
      container.querySelector('[data-slot=message-list]'),
    );
    expect(
      container.querySelector('[data-slot=message-list-date]'),
    ).toBeNull();
    expect(
      container.querySelector('[data-slot=message-list-unread]'),
    ).toBeNull();
  });
});

describe('ChatView 自动滚动与排队排空', () => {
  it('上翻释放跟随：回到底部按钮展示新增消息计数，点击恢复跟随', () => {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'm1',
      role: 'assistant',
      status: 'completed',
      parts: [{ type: 'text', content: '开始' }],
    });
    const { container } = render(<ChatView store={store} />);

    const scroller = container.querySelector(
      '.pactor-chat-messages',
    ) as HTMLDivElement;
    Object.defineProperty(scroller, 'scrollHeight', {
      configurable: true,
      value: 1200,
    });
    Object.defineProperty(scroller, 'clientHeight', {
      configurable: true,
      value: 200,
    });
    scroller.scrollTop = 100;
    fireEvent.scroll(scroller);

    const button = screen.getByRole('button', { name: '回到底部' });
    expect(button.getAttribute('data-new-messages')).toBeNull();

    act(() => {
      store.appendMessage({
        id: 'm2',
        role: 'assistant',
        status: 'completed',
        parts: [{ type: 'text', content: '第二条' }],
      });
      store.appendMessage({
        id: 'm3',
        role: 'assistant',
        status: 'completed',
        parts: [{ type: 'text', content: '第三条' }],
      });
    });

    const updated = screen.getByRole('button', {
      name: '回到底部 · 2 条新消息',
    });
    expect(updated.getAttribute('data-new-messages')).toBe('2');

    fireEvent.click(updated);
    expect(
      screen.queryByRole('button', { name: /回到底部/ }),
    ).toBeNull();
    expect(scroller.scrollTop).toBe(1200);
  });

  it('streaming 中 Enter 入队；结束后自动发送队首并移除队列', async () => {
    const onSend = vi.fn();
    const onQueueChange = vi.fn();
    const store = new ConversationStore();
    store.appendMessage({
      id: 'a1',
      role: 'assistant',
      status: 'streaming',
      parts: [],
    });
    const { container } = render(
      <ChatView
        store={store}
        onSend={onSend}
        onQueueChange={onQueueChange}
      />,
    );

    const textarea = container.querySelector(
      '.pactor-chat-composer textarea',
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '排队消息' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(onSend).not.toHaveBeenCalled();
    expect(screen.getByText(/待发送/)).toBeTruthy();
    expect(screen.getByText('排队消息')).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: '移除排队消息 排队消息',
      }),
    ).toBeTruthy();

    act(() => store.setStatus('a1', 'completed'));
    await waitFor(() => expect(onSend).toHaveBeenCalledWith('排队消息'));
    expect(screen.queryByText(/待发送/)).toBeNull();
    expect(onQueueChange).toHaveBeenLastCalledWith([]);
  });
});

describe('Composer 二期（DSL 展示组件）', () => {
  it('checkFiles：类型 / 大小 / 数量规则与判定顺序', () => {
    const png = makeFile('a.PNG', 4, 'image/png');
    const svg = makeFile('b.svg', 4, 'image/svg+xml');
    const txt = makeFile('c.txt', 4, 'text/plain');
    const big = makeFile('big.png', 10, 'image/png');

    expect(checkFiles([png], { accept: ['image/*'] }).accepted).toEqual([
      png,
    ]);
    expect(checkFiles([png], { accept: ['.png'] }).accepted).toEqual([png]);
    expect(checkFiles([png], { accept: ['png'] }).accepted).toEqual([png]);
    expect(
      checkFiles([png], { accept: ['image/png'] }).accepted,
    ).toEqual([png]);
    expect(
      checkFiles([svg], { accept: ['image/png'] }).rejected[0]!.reason,
    ).toBe('type');

    expect(checkFiles([big], { maxSize: 10 }).accepted).toEqual([big]);
    expect(
      checkFiles([big], { maxSize: 9 }).rejected[0]!.reason,
    ).toBe('size');
    // 类型优先于大小
    expect(
      checkFiles([makeFile('big.txt', 20, 'text/plain')], {
        accept: ['image/*'],
        maxSize: 10,
      }).rejected[0]!.reason,
    ).toBe('type');

    const counted = checkFiles([png, png, png], { maxFiles: 2 }, 1);
    expect(counted.accepted).toHaveLength(1);
    expect(counted.rejected[0]!.reason).toBe('count');
    expect(checkFiles([txt], {})).toEqual({
      accepted: [txt],
      rejected: [],
    });
  });

  it('streaming 中入队：onSubmit 不触发、文本清空、队列可逐条移除与播报', () => {
    const onQueueChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <DslComposer
        streaming
        onQueueChange={onQueueChange}
        onSubmit={onSubmit}
      />,
    );
    const textarea = getDslTextarea();

    fireEvent.change(textarea, { target: { value: '后续问题' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onQueueChange).toHaveBeenCalledTimes(1);
    const queued = onQueueChange.mock.calls[0]![0];
    expect(queued).toHaveLength(1);
    expect(queued[0].text).toBe('后续问题');
    expect(textarea.value).toBe('');
    expect(screen.getByText('生成中，消息已加入队列')).toBeTruthy();
    expect(screen.getByText(/待发送/)).toBeTruthy();

    fireEvent.click(
      screen.getByRole('button', {
        name: '移除排队消息 后续问题',
      }),
    );
    expect(onQueueChange).toHaveBeenLastCalledWith([]);
    expect(screen.queryByText(/待发送/)).toBeNull();
  });

  it('命令菜单：过滤 / 方向键 / Enter 只插入不发送 / Escape 与空态', () => {
    const onSubmit = vi.fn();
    render(
      <DslComposer
        commands={[{ name: 'clear' }, { name: 'clone' }]}
        onSubmit={onSubmit}
      />,
    );
    const textarea = getDslTextarea();

    fireEvent.change(textarea, { target: { value: '/' } });
    expect(screen.getByRole('listbox', { name: '命令' })).toBeTruthy();
    expect(screen.getAllByRole('option')).toHaveLength(2);

    fireEvent.change(textarea, { target: { value: '/cl' } });
    expect(screen.getAllByRole('option')).toHaveLength(2);
    fireEvent.keyDown(textarea, { key: 'ArrowDown' });
    expect(
      screen.getAllByRole('option')[1]!.getAttribute('aria-selected'),
    ).toBe('true');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea.value).toBe('/clone ');
    expect(screen.queryByRole('listbox')).toBeNull();

    fireEvent.change(textarea, { target: { value: '/zzz' } });
    expect(screen.getByText('无匹配命令')).toBeTruthy();
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea.value).toBe('/zzz');

    fireEvent.change(textarea, { target: { value: '/c' } });
    expect(screen.getByRole('listbox', { name: '命令' })).toBeTruthy();
    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(textarea.value).toBe('/c');
  });

  it('模式切换：radiogroup 点击与方向键 / Home 漫游', () => {
    const onModeChange = vi.fn();
    render(<DslComposer showModes onModeChange={onModeChange} />);

    expect(screen.getByRole('radiogroup', { name: '模式' })).toBeTruthy();
    const actMode = screen.getByRole('radio', { name: '执行' });
    expect(actMode.getAttribute('aria-checked')).toBe('true');
    expect(actMode.getAttribute('tabindex')).toBe('0');

    fireEvent.click(screen.getByRole('radio', { name: '规划' }));
    expect(onModeChange).toHaveBeenCalledWith('plan');
    expect(
      screen.getByRole('radio', { name: '规划' }).getAttribute('aria-checked'),
    ).toBe('true');

    const plan = screen.getByRole('radio', { name: '规划' });
    plan.focus();
    fireEvent.keyDown(plan, { key: 'ArrowRight' });
    const executed = screen.getByRole('radio', { name: '执行' });
    expect(executed.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(executed);

    fireEvent.keyDown(executed, { key: 'Home' });
    const ask = screen.getByRole('radio', { name: '询问' });
    expect(ask.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(ask);
  });

  it('showModes=false 不渲染模式组（缺省兼容）', () => {
    render(<DslComposer />);
    expect(screen.queryByRole('radiogroup', { name: '模式' })).toBeNull();
  });

  it('上下文 token 托盘：逐项 token 与合计；无 token 不渲染', () => {
    const { container, rerender } = render(
      <DslComposer
        contextItems={[
          { id: 'a', label: '文档 A', tokens: 120 },
          { id: 'b', label: '文档 B', tokens: 80 },
          { id: 'c', label: '文档 C' },
        ]}
      />,
    );
    expect(screen.getByText('上下文 120 tokens')).toBeTruthy();
    expect(screen.getByText('合计 200 tokens')).toBeTruthy();
    expect(
      container.querySelectorAll('[data-slot=composer-context-token]'),
    ).toHaveLength(2);
    expect(
      container.querySelector('[data-slot=composer-context-total]')
        ?.textContent,
    ).toBe('合计 200 tokens');

    rerender(
      <DslComposer contextItems={[{ id: 'c', label: '文档 C' }]} />,
    );
    expect(
      container.querySelector('[data-slot=composer-context-tokens]'),
    ).toBeNull();
  });

  it('文件规则：粘贴文件按类型 / 大小过滤，拒绝项经 onReject + 播报', () => {
    const onAttachFiles = vi.fn();
    const onReject = vi.fn();
    render(
      <DslComposer
        onAttachFiles={onAttachFiles}
        onReject={onReject}
        accept={['image/*']}
        maxSize={1024}
        maxFiles={2}
      />,
    );

    const png = makeFile('a.png', 100, 'image/png');
    const txt = makeFile('b.txt', 10, 'text/plain');
    const big = makeFile('c.png', 2048, 'image/png');
    fireEvent.paste(getDslTextarea(), {
      clipboardData: { files: [png, txt, big] },
    });

    expect(onAttachFiles).toHaveBeenCalledWith([png]);
    const rejected = onReject.mock.calls[0]![0] as Array<{
      file: File;
      reason: string;
    }>;
    expect(rejected.map((item) => item.reason)).toEqual(['type', 'size']);
    expect(rejected[0]!.file).toBe(txt);
    expect(rejected[1]!.file).toBe(big);
    expect(screen.getByRole('status').textContent).toBe(
      '有 2 个文件未添加',
    );
  });
});

describe('Composer 二期（产品层 fallback 接线）', () => {
  it('streaming 入队经 onQueueChange 上报，移除后队列清空', () => {
    const onSend = vi.fn();
    const onQueueChange = vi.fn();
    const { container } = render(
      <ProductComposer
        streaming
        onSend={onSend}
        onQueueChange={onQueueChange}
      />,
    );
    const textarea = container.querySelector(
      '.pactor-chat-composer textarea',
    ) as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: '排队一' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(onSend).not.toHaveBeenCalled();
    const queued = onQueueChange.mock.calls[0]![0];
    expect(queued[0].text).toBe('排队一');
    expect(screen.getByText(/待发送/)).toBeTruthy();
    expect(screen.getByText('排队一')).toBeTruthy();

    fireEvent.click(
      screen.getByRole('button', { name: '移除排队消息 排队一' }),
    );
    expect(onQueueChange).toHaveBeenLastCalledWith([]);
    expect(screen.queryByText(/待发送/)).toBeNull();
  });

  it('模式选择器渲染在 fallback 工具栏并更新选中态', () => {
    render(<ProductComposer showModes />);
    expect(screen.getByRole('radiogroup', { name: '模式' })).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: '询问' }));
    expect(
      screen.getByRole('radio', { name: '询问' }).getAttribute('aria-checked'),
    ).toBe('true');
  });

  it('文件输入规则：拒绝项经 onReject，合规文件才交给 onAttachFiles', () => {
    const onAttachFiles = vi.fn();
    const onReject = vi.fn();
    const { container } = render(
      <ProductComposer
        onAttachFiles={onAttachFiles}
        onReject={onReject}
        accept={['image/*']}
        maxSize={10}
      />,
    );
    const input = container.querySelector(
      '.pactor-chat-composer input[type=file]',
    ) as HTMLInputElement;
    const txt = makeFile('a.txt', 4, 'text/plain');
    const big = makeFile('b.png', 20, 'image/png');
    fireEvent.change(input, { target: { files: [txt, big] } });

    expect(onAttachFiles).not.toHaveBeenCalled();
    const rejected = onReject.mock.calls[0]![0] as Array<{
      reason: string;
    }>;
    expect(rejected.map((item) => item.reason)).toEqual(['type', 'size']);
  });
});

describe('ToolCall 二期', () => {
  it('对象 result 与参数同一 JSON 展开；aria-expanded 切换', () => {
    render(
      <ToolCall
        name="search"
        params={{ q: 'pactor' }}
        result={{ ok: true, hits: 2 }}
      />,
    );
    const trigger = screen.getByRole('button', { name: /search/ });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(/"ok": true/)).toBeTruthy();
    expect(screen.getByText(/"q": "pactor"/)).toBeTruthy();
  });

  it('pending 状态缺省展开；running 按 startedAt 本地计时', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:03Z'));
    render(
      <ToolCall
        name="deploy"
        status="running"
        startedAt={new Date('2026-01-01T00:00:00Z').getTime()}
        params={{ env: 'prod' }}
      />,
    );
    const root = document.querySelector('[data-slot=tool-call]')!;
    expect(root.getAttribute('data-status')).toBe('running');
    expect(
      screen
        .getByRole('button', { name: /deploy/ })
        .getAttribute('aria-expanded'),
    ).toBe('true');
    const duration = (): string | null =>
      document.querySelector('[data-slot=tool-call-duration]')!.textContent;
    expect(duration()).toBe('3s');
    act(() => vi.advanceTimersByTime(1000));
    expect(duration()).toBe('4s');

    vi.useRealTimers();
    const { container } = render(
      <ToolCall name="wait" status="pending" params={{ id: 1 }} />,
    );
    expect(
      container.querySelector('[data-slot=tool-call]')!.getAttribute(
        'data-status',
      ),
    ).toBe('pending');
  });

  it('固定 durationMs、失败重试入口与无详情不可展开；通用 props', () => {
    const onRetry = vi.fn();
    const { container, rerender } = render(
      <ToolCall
        name="fetch"
        status="error"
        durationMs={1500}
        onRetry={onRetry}
        params={{ url: '/api' }}
        className={COMMON_PROPS_PROBE.className}
        style={COMMON_PROPS_PROBE.style}
      />,
    );
    expectCommonProps(container.querySelector('[data-slot=tool-call]'));
    expect(screen.getByText('1.5s')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '重试' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(<ToolCall name="fetch" status="done" />);
    expect(screen.queryByRole('button', { name: '重试' })).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(
      container.querySelector('[data-slot=tool-call-trigger]')!.tagName,
    ).toBe('DIV');
  });

  it('DSL 注册：ToolCall 可声明渲染', () => {
    expect(createComponentRegistry().has('ToolCall')).toBe(true);
    renderDsl({
      type: 'ToolCall',
      props: {
        name: 'grep',
        status: 'done',
        result: { count: 3 },
        defaultExpanded: true,
      },
    });
    expect(screen.getByText(/"count": 3/)).toBeTruthy();
  });
});

describe('审批队列二期', () => {
  it('decideMany 固定 once；resolved log 保留最近 20 条', async () => {
    const decisions: ApprovalDecisionEvent[] = [];
    const queue = createApprovalQueue({
      onDecision: (event) => decisions.push(event),
    });

    const p1 = queue.enqueue({ name: 'a', params: {} });
    const p2 = queue.enqueue({ name: 'b', params: {} });
    queue.decideMany(
      queue.getSnapshot().map((request) => request.id),
      'approved',
    );
    await expect(p1).resolves.toBe(true);
    await expect(p2).resolves.toBe(true);
    expect(decisions.map((event) => event.scope)).toEqual(['once', 'once']);
    expect(queue.getResolvedSnapshot()).toHaveLength(2);

    const limited = createApprovalQueue();
    for (let index = 0; index < 21; index += 1) {
      const pending = limited.enqueue({
        name: `op-${index}`,
        params: {},
      });
      limited.decide(
        limited.getSnapshot()[0]!.id,
        'denied',
        'once',
      );
      await pending;
    }
    expect(limited.getResolvedSnapshot()).toHaveLength(20);
    expect(limited.getResolvedSnapshot()[0]!.request.name).toBe('op-1');
  });

  it('undo 重新入队、派发 Undo 事件并支持按请求 id 撤销', async () => {
    const undos: ApprovalUndoEvent[] = [];
    const queue = createApprovalQueue({
      onUndo: (event) => undos.push(event),
    });
    const p1 = queue.enqueue({ name: 'a', params: {} });
    const p2 = queue.enqueue({ name: 'b', params: {} });
    const [first, second] = queue.getSnapshot();
    queue.decide(first!.id, 'approved', 'once');
    queue.decide(second!.id, 'denied', 'session');
    await expect(p1).resolves.toBe(true);
    await expect(p2).resolves.toBe(false);

    expect(queue.undo()?.request.name).toBe('b');
    expect(queue.getSnapshot().map((request) => request.name)).toEqual(['b']);
    expect(undos[0]).toMatchObject({
      previousDecision: 'denied',
      scope: 'session',
    });

    expect(queue.undo(first!.id)?.request.name).toBe('a');
    expect(queue.getSnapshot().map((request) => request.name)).toEqual([
      'b',
      'a',
    ]);
    expect(undos[1]).toMatchObject({
      previousDecision: 'approved',
      scope: 'once',
    });
    expect(queue.undo('missing')).toBeNull();
  });

  it('grouped：风险 high → medium → low 分组，键盘焦点按渲染顺序移动', () => {
    const queue = createApprovalQueue();
    act(() => {
      void queue.enqueue({ name: 'medium.op', params: {}, risk: 'medium' });
      void queue.enqueue({ name: 'high.op', params: {}, risk: 'high' });
      void queue.enqueue({ name: 'low.op', params: {}, risk: 'low' });
    });
    const { container } = render(
      <ApprovalQueue
        queue={queue}
        layout="grouped"
        className={COMMON_PROPS_PROBE.className}
        style={COMMON_PROPS_PROBE.style}
      />,
    );

    expectCommonProps(
      container.querySelector('[data-slot=approval-queue]'),
    );
    const groups = Array.from(
      container.querySelectorAll('[data-slot=approval-group]'),
    );
    expect(groups.map((group) => group.getAttribute('data-risk'))).toEqual([
      'high',
      'medium',
      'low',
    ]);
    expect(screen.getByText('高风险操作')).toBeTruthy();
    expect(screen.getByText('中风险操作')).toBeTruthy();
    expect(screen.getByText('低风险操作')).toBeTruthy();

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>('[data-slot=approval-card]'),
    );
    expect(cards.map((card) => card.textContent)).toEqual([
      expect.stringContaining('high.op'),
      expect.stringContaining('medium.op'),
      expect.stringContaining('low.op'),
    ]);

    cards[0]!.focus();
    fireEvent.keyDown(cards[0]!, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(cards[1]);
    fireEvent.keyDown(cards[1]!, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(cards[0]);

    fireEvent.keyDown(cards[0]!, { key: ' ' });
    expect(
      (
        screen.getByRole('checkbox', {
          name: '选择 high.op',
        }) as HTMLInputElement
      ).checked,
    ).toBe(true);
  });

  it('结构化 payload：renderPayload 替换缺省 JSON pre', () => {
    const queue = createApprovalQueue();
    act(() => {
      void queue.enqueue({
        name: 'shell.run',
        params: { cmd: 'ls -la' },
      });
    });
    const { container } = render(
      <ApprovalQueue
        queue={queue}
        renderPayload={(request) => (
          <code data-testid="payload">
            {String((request.params as { cmd?: string }).cmd)}
          </code>
        )}
      />,
    );
    expect(screen.getByTestId('payload').textContent).toBe('ls -la');
    expect(
      container.querySelector('[data-slot=approval-payload] pre'),
    ).toBeNull();
  });

  it('批量选择 / 全选 / 批量批准：逐项 once 决议与播报', () => {
    const decisions: ApprovalDecisionEvent[] = [];
    const queue = createApprovalQueue({
      onDecision: (event) => decisions.push(event),
    });
    act(() => {
      void queue.enqueue({ name: 'a', params: {} });
      void queue.enqueue({ name: 'b', params: {} });
      void queue.enqueue({ name: 'c', params: {} });
    });
    render(<ApprovalQueue queue={queue} />);

    fireEvent.click(screen.getByRole('checkbox', { name: '选择 a' }));
    fireEvent.click(screen.getByRole('checkbox', { name: '选择 c' }));
    expect(screen.getByText('已选择 2 项')).toBeTruthy();
    expect(
      screen.getByText('批量决议仅按「仅本次」授权'),
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole('button', { name: '批量批准' }),
    );
    expect(queue.getSnapshot().map((request) => request.name)).toEqual([
      'b',
    ]);
    expect(decisions).toHaveLength(2);
    expect(
      decisions.every(
        (event) => event.decision === 'approved' && event.scope === 'once',
      ),
    ).toBe(true);
    expect(screen.getByRole('status').textContent).toBe(
      '已批量批准 2 项',
    );
    expect(screen.getByText('已处理 2 项')).toBeTruthy();

    fireEvent.click(
      screen.getByRole('checkbox', { name: '全选待审批项' }),
    );
    expect(
      (
        screen.getByRole('checkbox', {
          name: '选择 b',
        }) as HTMLInputElement
      ).checked,
    ).toBe(true);
    fireEvent.click(
      screen.getByRole('button', { name: '批量拒绝' }),
    );
    expect(queue.getSnapshot()).toHaveLength(0);
    expect(screen.getByRole('status').textContent).toBe(
      '已批量拒绝 1 项',
    );
  });

  it('受控选择：selected 不更新时勾选态保持，onSelectedChange 上报', () => {
    const queue = createApprovalQueue();
    act(() => {
      void queue.enqueue({ name: 'a', params: {} });
    });
    const id = queue.getSnapshot()[0]!.id;
    const onSelectedChange = vi.fn();
    render(
      <ApprovalQueue
        queue={queue}
        selected={[]}
        onSelectedChange={onSelectedChange}
      />,
    );
    const checkbox = screen.getByRole('checkbox', {
      name: '选择 a',
    }) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(onSelectedChange).toHaveBeenCalledWith([id]);
    expect(checkbox.checked).toBe(false);
  });

  it('决议后 resolved log + Undo 重新入队；undoMs=0 不展示撤销', async () => {
    const onUndo = vi.fn();
    const queue = createApprovalQueue({ onUndo });
    let pending: Promise<boolean> | undefined;
    act(() => {
      pending = queue.enqueue({ name: 'deploy', params: {} });
    });
    render(<ApprovalQueue queue={queue} />);

    fireEvent.click(screen.getByRole('button', { name: '批准' }));
    await expect(pending).resolves.toBe(true);
    expect(screen.getByText('已处理 1 项')).toBeTruthy();
    expect(screen.getByText('已批准')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '撤销' }));
    expect(onUndo).toHaveBeenCalledWith({
      request: expect.objectContaining({ name: 'deploy' }),
      previousDecision: 'approved',
      scope: 'once',
    });
    expect(queue.getSnapshot().map((request) => request.name)).toEqual([
      'deploy',
    ]);
    expect(screen.getByRole('button', { name: '批准' })).toBeTruthy();
    expect(screen.queryByText('已处理 1 项')).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('已撤销 deploy');

    cleanup();
    const noUndoQueue = createApprovalQueue();
    act(() => {
      void noUndoQueue.enqueue({ name: 'cleanup', params: {} });
    });
    const { container } = render(
      <ApprovalQueue queue={noUndoQueue} undoMs={0} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '批准' }));
    expect(
      container.querySelector('[data-slot=approval-resolved]'),
    ).not.toBeNull();
    expect(screen.queryByRole('button', { name: '撤销' })).toBeNull();
  });

  it('showEmpty 空态；缺省空队列零渲染', () => {
    const queue = createApprovalQueue();
    const { container, rerender } = render(
      <ApprovalQueue queue={queue} />,
    );
    expect(container.firstChild).toBeNull();

    rerender(<ApprovalQueue queue={queue} showEmpty />);
    expect(screen.getByText('没有待审批的操作')).toBeTruthy();
  });
});
