// @vitest-environment jsdom
/**
 * 阶段 C 展示层契约：MessageBranches（inline / map / 受控 / 键盘 /
 * 编辑提示 / 重新生成），ContextWindowMeter（inline / card / 告警 /
 * 压缩入口 / a11y），Suggestion 刷新，Attachment 图片缩略图，
 * AgentStatus 步骤 / 停止，ArtifactPanel 版本历史，Composer 模型
 * 选择子集（搜索 / 分组 / 能力徽章 / 推荐 / 空态）。
 */
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AgentStatus } from '../src/components/AgentStatus/index.js';
import { ArtifactPanel } from '../src/components/ArtifactPanel/index.js';
import type { ChatPageArtifact } from '../src/components/ArtifactPanel/artifact.js';
import { Attachment } from '../src/components/Attachment/index.js';
import { Composer as DslComposer } from '../src/components/Composer/index.js';
import type { ComposerModelOption } from '../src/components/Composer/index.js';
import { ContextWindowMeter } from '../src/components/ContextWindowMeter/index.js';
import { MessageBranches } from '../src/components/MessageBranches/index.js';
import { Suggestion } from '../src/components/Suggestion/index.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  renderDsl,
} from './helpers.js';

afterEach(cleanup);

const VERSIONS = [
  { id: 'v1', content: '第一版回答' },
  { id: 'v2', content: '第二版回答' },
  { id: 'v3', content: '第三版回答' },
];

describe('MessageBranches', () => {
  it('inline：缺省展示末版，上一版 / 下一版切换内容并上报下标', () => {
    const onIndexChange = vi.fn();
    render(
      <MessageBranches versions={VERSIONS} onIndexChange={onIndexChange} />,
    );

    const root = screen.getByRole('group', { name: '消息版本' });
    expect(root.getAttribute('data-index')).toBe('2');
    expect(screen.getByText('第三版回答')).toBeTruthy();
    expect(screen.getByText('第 3 / 3 个版本')).toBeTruthy();

    const next = screen.getByRole('button', { name: '下一个版本' }) as HTMLButtonElement;
    expect(next.disabled).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: '上一个版本' }));
    expect(onIndexChange).toHaveBeenCalledWith(1, VERSIONS[1]);
    expect(screen.getByText('第二版回答')).toBeTruthy();
    expect(screen.getByText('第 2 / 3 个版本')).toBeTruthy();
  });

  it('键盘：←/↑ 上一版、→/↓ 下一版，首尾不越界', () => {
    const onIndexChange = vi.fn();
    render(
      <MessageBranches
        versions={VERSIONS}
        defaultIndex={1}
        onIndexChange={onIndexChange}
      />,
    );
    const root = screen.getByRole('group', { name: '消息版本' });

    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(onIndexChange).toHaveBeenLastCalledWith(0, VERSIONS[0]);
    fireEvent.keyDown(root, { key: 'ArrowUp' });
    // 已在首项：不重复上报
    expect(onIndexChange).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(onIndexChange).toHaveBeenLastCalledWith(1, VERSIONS[1]);
    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(onIndexChange).toHaveBeenLastCalledWith(2, VERSIONS[2]);
  });

  it('受控：index 以 props 为准，点击只上报，重渲染后才切换', () => {
    const onIndexChange = vi.fn();
    const { rerender } = render(
      <MessageBranches versions={VERSIONS} index={0} onIndexChange={onIndexChange} />,
    );
    expect(screen.getByText('第一版回答')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '下一个版本' }));
    expect(onIndexChange).toHaveBeenCalledWith(1, VERSIONS[1]);
    // 受控：未回传新 index 前内容不变
    expect(screen.getByText('第一版回答')).toBeTruthy();

    rerender(
      <MessageBranches versions={VERSIONS} index={1} onIndexChange={onIndexChange} />,
    );
    expect(screen.getByText('第二版回答')).toBeTruthy();
  });

  it('edited 版本展示编辑后的提示词与来源标签', () => {
    render(
      <MessageBranches
        versions={[
          { id: 'v1', content: '原始回答' },
          {
            id: 'v2',
            kind: 'edited',
            content: '编辑后回答',
            prompt: '请补充数据来源',
          },
        ]}
      />,
    );

    const root = screen.getByRole('group', { name: '消息版本' });
    expect(root.getAttribute('data-kind')).toBe('edited');
    const prompt = document.querySelector('[data-slot=message-branches-prompt]')!;
    expect(prompt.textContent).toContain('编辑后的提示：');
    expect(prompt.textContent).toContain('请补充数据来源');
    expect(screen.getByText('已编辑')).toBeTruthy();
  });

  it('map：逐版本列出，切换项带 aria-current，切换经回调', () => {
    const onIndexChange = vi.fn();
    render(
      <MessageBranches
        versions={[
          { id: 'v1', content: '一', meta: 'model-a', turnsAfter: 2 },
          { id: 'v2', content: '二', label: '修订版', turnsAfter: 1 },
        ]}
        variant="map"
        defaultIndex={0}
        onIndexChange={onIndexChange}
      />,
    );

    expect(screen.getByRole('list', { name: '分支视图' })).toBeTruthy();
    const items = document.querySelectorAll('[data-slot=message-branches-map-item]');
    expect(items).toHaveLength(2);
    expect(items[0]!.getAttribute('aria-current')).toBe('true');
    expect(items[1]!.getAttribute('aria-current')).toBeNull();
    expect(items[0]!.textContent).toContain('model-a');
    expect(items[0]!.textContent).toContain('+2');
    expect(items[1]!.textContent).toContain('修订版');

    fireEvent.click(screen.getByRole('button', { name: '切换到版本 2' }));
    expect(onIndexChange).toHaveBeenCalledWith(1, expect.objectContaining({ id: 'v2' }));
    expect(
      document.querySelectorAll('[data-slot=message-branches-map-item]')[1]!.getAttribute('aria-current'),
    ).toBe('true');
  });

  it('onRegenerate 提供时展示重新生成；空 versions 不渲染', () => {
    const onRegenerate = vi.fn();
    const { container, rerender } = render(
      <MessageBranches versions={VERSIONS} onRegenerate={onRegenerate} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '重新生成' }));
    expect(onRegenerate).toHaveBeenCalledTimes(1);

    rerender(<MessageBranches versions={[]} onRegenerate={onRegenerate} />);
    expect(container.querySelector('[data-slot=message-branches]')).toBeNull();
  });

  it('通用 props 作用于根节点；DSL 类型可声明渲染', () => {
    const { container } = render(
      <MessageBranches versions={VERSIONS} {...COMMON_PROPS_PROBE} />,
    );
    expectCommonProps(container.querySelector('[data-slot=message-branches]'));

    cleanup();
    renderDsl({
      type: 'MessageBranches',
      props: { versions: [{ id: 'a', content: 'DSL 版本' }] },
    });
    expect(screen.getByText('DSL 版本')).toBeTruthy();
  });
});

describe('ContextWindowMeter', () => {
  const SEGMENTS = [
    { label: '系统提示', tokens: 4000, pinned: true },
    { label: '对话', tokens: 36000 },
  ];

  it('inline：分段合计与进度格、progressbar 语义', () => {
    const { container } = render(
      <ContextWindowMeter limit={100000} segments={SEGMENTS} model="demo" />,
    );

    const root = container.querySelector('[data-slot=context-window-meter]')!;
    expect(root.getAttribute('data-variant')).toBe('inline');
    expect(root.getAttribute('data-level')).toBe('normal');
    expect(container.querySelector('[data-slot=context-window-model]')!.textContent).toBe('demo');

    expect(container.querySelectorAll('[data-slot=context-window-grid] > span')).toHaveLength(20);
    const filled = container.querySelectorAll('[data-filled=true]');
    expect(filled).toHaveLength(8);

    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('40000');
    expect(bar.getAttribute('aria-valuemax')).toBe('100000');
    expect(bar.textContent).toBe('40000 / 100000 tokens');
    expect(bar.getAttribute('aria-valuetext')).toContain('已用 40%');
  });

  it('warnAt 达到阈值：警示态、sr-only 提示与压缩入口（有回调才展示）', () => {
    const onCompact = vi.fn();
    const { container } = render(
      <ContextWindowMeter
        limit={50000}
        segments={[{ label: '对话', tokens: 45000 }]}
        onCompact={onCompact}
      />,
    );

    const root = container.querySelector('[data-slot=context-window-meter]')!;
    expect(root.getAttribute('data-level')).toBe('warning');
    expect(screen.getByText('上下文即将用完')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '压缩上下文' }));
    expect(onCompact).toHaveBeenCalledTimes(1);

    cleanup();
    render(
      <ContextWindowMeter limit={50000} segments={[{ label: '对话', tokens: 45000 }]} />,
    );
    expect(screen.queryByRole('button', { name: '压缩上下文' })).toBeNull();
    expect(screen.getByText('上下文即将用完')).toBeTruthy();
  });

  it('card：分段条形宽度、图例（pinned 标记）与剩余用量', () => {
    const { container } = render(
      <ContextWindowMeter
        limit={100000}
        segments={[
          { label: '系统提示', tokens: 10000, pinned: true },
          { label: '对话', tokens: 30000 },
          { label: '工具', tokens: 10000, color: 'rgb(1, 2, 3)' },
        ]}
        variant="card"
        model="demo"
      />,
    );

    expect(
      screen.getByRole('region', { name: '上下文窗口' }),
    ).toBeTruthy();
    const bars = container.querySelectorAll('[data-slot=context-window-bar-segment]');
    expect(bars).toHaveLength(3);
    expect((bars[0] as HTMLElement).style.width).toBe('10%');
    expect((bars[2] as HTMLElement).style.width).toBe('10%');
    expect((bars[2] as HTMLElement).style.backgroundColor).toBe('rgb(1, 2, 3)');

    const legends = container.querySelectorAll('[data-slot=context-window-legend-item]');
    expect(legends).toHaveLength(3);
    expect(legends[0]!.getAttribute('data-pinned')).toBe('true');
    expect(container.querySelector('[data-slot=context-window-pinned]')).not.toBeNull();
    expect(legends[0]!.textContent).toContain('系统提示');
    expect(legends[0]!.textContent).toContain('10000');
    expect(screen.getByText('剩余 50000 tokens')).toBeTruthy();
    expect(container.querySelector('[data-slot=context-window-model]')!.textContent).toBe('demo');
  });

  it('通用 props 作用于根节点；DSL 类型可声明渲染', () => {
    const { container } = render(
      <ContextWindowMeter limit={1000} {...COMMON_PROPS_PROBE} />,
    );
    expectCommonProps(container.querySelector('[data-slot=context-window-meter]'));

    cleanup();
    renderDsl({
      type: 'ContextWindowMeter',
      props: { limit: 1000, segments: [{ label: '对话', tokens: 250 }] },
    });
    expect(screen.getByText('250 / 1000 tokens')).toBeTruthy();
  });
});

describe('Suggestion 刷新', () => {
  it('提供 onRefresh 时展示刷新按钮；刷新中禁用并 aria-busy', () => {
    const onRefresh = vi.fn();
    const { rerender, container } = render(
      <Suggestion items={['继续']} onRefresh={onRefresh} />,
    );

    const button = screen.getByRole('button', { name: '换一批' });
    expect(button.getAttribute('aria-busy')).toBe('false');
    fireEvent.click(button);
    expect(onRefresh).toHaveBeenCalledTimes(1);

    rerender(<Suggestion items={['继续']} onRefresh={onRefresh} refreshing />);
    const busy = screen.getByRole('button', { name: '正在刷新建议' }) as HTMLButtonElement;
    expect(busy.disabled).toBe(true);
    expect(busy.getAttribute('aria-busy')).toBe('true');
    expect(
      container.querySelector('[data-slot=suggestion-refresh] .animate-spin'),
    ).not.toBeNull();

    cleanup();
    render(<Suggestion items={['继续']} />);
    expect(
      document.querySelector('[data-slot=suggestion-refresh]'),
    ).toBeNull();
  });
});

describe('Attachment 图片缩略图', () => {
  it('image 且提供 src：渲染缩略图；缺省回退类别图标', () => {
    const { container } = render(
      <Attachment
        items={[
          { id: 'a', name: 'photo.png', src: 'data:image/png;base64,AA' },
          { id: 'b', name: 'notes.txt' },
        ]}
      />,
    );

    const items = container.querySelectorAll('[data-slot=attachment-item]');
    expect(items[0]!.getAttribute('data-kind')).toBe('image');
    const thumb = items[0]!.querySelector('[data-slot=attachment-thumbnail]') as HTMLImageElement;
    expect(thumb).not.toBeNull();
    expect(thumb.getAttribute('src')).toBe('data:image/png;base64,AA');
    expect(thumb.getAttribute('alt')).toBe('photo.png');
    expect(thumb.getAttribute('loading')).toBe('lazy');

    expect(items[1]!.querySelector('[data-slot=attachment-thumbnail]')).toBeNull();
  });

  it('点击卡片透传附件项', () => {
    const onClick = vi.fn();
    render(<Attachment items={[{ id: 'a', name: 'photo.png', src: 'x' }]} onClick={onClick} />);
    fireEvent.click(document.querySelector('[data-slot=attachment-item]')!);
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'a', name: 'photo.png', src: 'x' }),
    );
  });
});

describe('AgentStatus 步骤与停止', () => {
  it('running：停止按钮、耗时与分步明细', () => {
    const onStop = vi.fn();
    const { container } = render(
      <AgentStatus
        status="running"
        text="执行中"
        elapsed={3}
        onStop={onStop}
        steps={[
          { label: '检索资料', status: 'done' },
          { label: '生成回答', detail: 'tool: search' },
        ]}
      />,
    );

    expect(screen.getByText('已用时 3s')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '停止' }));
    expect(onStop).toHaveBeenCalledTimes(1);

    const steps = container.querySelectorAll('[data-slot=agent-status-step]');
    expect(steps).toHaveLength(2);
    expect(steps[0]!.getAttribute('data-status')).toBe('done');
    expect(steps[1]!.getAttribute('data-status')).toBe('running');
    expect(screen.getByText('检索资料')).toBeTruthy();
    expect(screen.getByText('tool: search')).toBeTruthy();
    expect(
      container.querySelector('[data-slot=agent-status-steps]')!.getAttribute('aria-label'),
    ).toBe('步骤');
  });

  it('done / 无 onStop 时不展示停止按钮；waiting 展示', () => {
    const { rerender } = render(
      <AgentStatus status="done" text="完成" onStop={() => {}} />,
    );
    expect(screen.queryByRole('button', { name: '停止' })).toBeNull();

    rerender(<AgentStatus status="waiting" text="等待确认" onStop={() => {}} />);
    expect(screen.getByRole('button', { name: '停止' })).toBeTruthy();

    rerender(<AgentStatus status="running" text="运行" />);
    expect(screen.queryByRole('button', { name: '停止' })).toBeNull();
  });
});

describe('ArtifactPanel 版本历史', () => {
  const VERSIONED: ChatPageArtifact = {
    id: 'doc',
    kind: 'text',
    title: '分析报告',
    content: '最新内容',
    versions: [
      { id: 'v1', label: '初稿', content: '初稿内容' },
      { id: 'v2', content: '二稿内容' },
    ],
  };

  it('版本下拉：选择历史版本预览内容，恢复回调透传版本与下标', async () => {
    const onRestoreVersion = vi.fn();
    render(
      <ArtifactPanel artifact={VERSIONED} onRestoreVersion={onRestoreVersion} />,
    );
    expect(document.querySelector('[data-slot=artifact-panel-text]')!.textContent).toBe('最新内容');

    fireEvent.click(document.querySelector('[data-slot=artifact-panel-versions-trigger]')!);
    fireEvent.click(await screen.findByRole('menuitem', { name: /初稿/ }));

    const banner = document.querySelector('[data-slot=artifact-panel-version-banner]')!;
    expect(banner.textContent).toContain('初稿');
    expect(document.querySelector('[data-slot=artifact-panel-text]')!.textContent).toBe('初稿内容');
    expect(
      document.querySelector('[data-slot=artifact-panel-versions-trigger]')!.textContent,
    ).toContain('初稿');

    fireEvent.click(document.querySelector('[data-slot=artifact-panel-restore]')!);
    expect(onRestoreVersion).toHaveBeenCalledWith(VERSIONED.versions![0], 0);
  });

  it('未提供 onRestoreVersion：展示恢复不可用提示；切回当前版本清空预览', async () => {
    render(<ArtifactPanel artifact={VERSIONED} />);
    fireEvent.click(document.querySelector('[data-slot=artifact-panel-versions-trigger]')!);
    fireEvent.click(await screen.findByRole('menuitem', { name: /版本 2/ }));

    expect(
      document.querySelector('[data-slot=artifact-panel-version-banner]')!.textContent,
    ).toContain('该版本缺少恢复回调');
    expect(document.querySelector('[data-slot=artifact-panel-restore]')).toBeNull();
    expect(document.querySelector('[data-slot=artifact-panel-text]')!.textContent).toBe('二稿内容');

    fireEvent.click(document.querySelector('[data-slot=artifact-panel-versions-trigger]')!);
    fireEvent.click(await screen.findByRole('menuitem', { name: /当前版本/ }));

    expect(document.querySelector('[data-slot=artifact-panel-version-banner]')).toBeNull();
    expect(document.querySelector('[data-slot=artifact-panel-text]')!.textContent).toBe('最新内容');
  });

  it('无 versions 时不渲染版本入口', () => {
    render(
      <ArtifactPanel
        artifact={{ id: 'plain', kind: 'text', title: '纯文本', content: '内容' }}
      />,
    );
    expect(document.querySelector('[data-slot=artifact-panel-versions-trigger]')).toBeNull();
  });
});

describe('Composer 模型选择子集', () => {
  const MINIMAL_MODELS = [
    { value: 'demo', label: 'demo-mock' },
    { value: 'pro', label: 'pro-max' },
  ];
  const EXTENDED_MODELS: ComposerModelOption[] = [
    {
      value: 'fast',
      label: 'Fast',
      provider: 'Acme',
      description: '低延迟',
      contextWindow: 128000,
      capabilities: ['vision', 'tools'],
      recommended: true,
    },
    {
      value: 'deep',
      label: 'Deep',
      provider: 'Acme',
      capabilities: ['reasoning'],
    },
    { value: 'basic', label: 'Basic', provider: 'Other' },
  ];

  it('仅 value + label：保持原样（无搜索框、无分组）', () => {
    render(<DslComposer models={MINIMAL_MODELS} />);
    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));

    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(document.querySelectorAll('[data-slot=composer-model-group]')).toHaveLength(0);
  });

  it('扩展元数据：搜索过滤、服务商分组、能力徽章、推荐与上下文窗口', () => {
    const onModelChange = vi.fn();
    render(
      <DslComposer
        models={[...EXTENDED_MODELS]}
        model="fast"
        onModelChange={onModelChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '选择模型' }));

    const search = screen.getByRole('searchbox', { name: '搜索模型' });
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(document.querySelectorAll('[data-slot=composer-model-group]')).toHaveLength(2);
    expect(document.querySelectorAll('[data-slot=composer-model-group]')[0]!.textContent).toContain('Acme');
    expect(document.querySelectorAll('[data-slot=composer-model-group]')[1]!.textContent).toContain('Other');

    const fast = document.querySelector('[data-value=fast]')!;
    expect(fast.textContent).toContain('推荐');
    expect(fast.textContent).toContain('低延迟');
    expect(fast.textContent).toContain('上下文 128000');
    expect(fast.textContent).toContain('视觉');
    expect(fast.textContent).toContain('工具');
    expect(fast.querySelector('[data-capability=reasoning]')).toBeNull();
    expect(
      document.querySelector('[data-value=deep] [data-capability=reasoning]'),
    ).not.toBeNull();

    fireEvent.change(search, { target: { value: 'other' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByText('Basic')).toBeTruthy();

    fireEvent.change(search, { target: { value: 'zzz' } });
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('无匹配模型')).toBeTruthy();

    fireEvent.change(search, { target: { value: 'deep' } });
    fireEvent.click(screen.getByRole('option', { name: /Deep/ }));
    expect(onModelChange).toHaveBeenCalledWith('deep');
    expect(document.querySelector('[data-slot=composer-model-popover]')).toBeNull();
  });
});
