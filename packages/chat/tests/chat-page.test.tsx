// @vitest-environment jsdom
/**
 * ChatPage 对话工作页契约：四区布局（图标栏 / 展开菜单区 / 对话区 /
 * 产物区）、图标栏右侧 Tooltip、产物区显隐与受控开关、发送与导航事件。
 */
import { fireEvent, screen, within } from '@testing-library/react';
import type { DslNode } from '@pactor-app/core';
import type { CreateRuntimeContextOptions } from '@pactor-app/runtime';
import { describe, expect, it } from 'vitest';

import { createComponentRegistry } from './helpers.js';
import {
  expectEventState,
  renderDslWith,
  type RenderDslResult,
} from './helpers.js';

function renderDsl(node: DslNode, options: CreateRuntimeContextOptions = {}): RenderDslResult {
  return renderDslWith(createComponentRegistry(), node, options);
}

const MENU_ITEMS = [
  { key: 'new', label: '新建任务', icon: 'square-pen' },
  { key: 'assistant', label: '助理', icon: 'brain' },
];

function baseProps(): Record<string, unknown> {
  return {
    brand: { title: 'Pactor Chat', version: '0.1.0' },
    menuItems: MENU_ITEMS,
    railItems: MENU_ITEMS,
    railFooterItems: [{ key: 'settings', label: '设置', icon: 'settings' }],
    conversationSectionTitle: '任务',
    conversations: [{ id: 'c1', title: '月报讨论', time: '09:30' }],
    activeConversationId: 'c1',
    conversationTitle: '月报讨论',
    messages: [{ id: 'm1', role: 'user', parts: [{ type: 'text', content: '问题' }] }],
    welcome: { prompts: [{ title: '写周报', value: '帮我写周报' }] },
    artifacts: [
      { id: 'a1', kind: 'markdown', title: '报告.md', content: '# 报告' },
    ],
    // 产物栏缺省不展示（组件约定），多数用例需要面板在场 → 非受控初始展开
    defaultArtifactOpen: true,
  };
}

function renderChatPage(
  overrides: Record<string, unknown> = {},
  events?: DslNode['events'],
): RenderDslResult {
  return renderDsl({
    type: 'ChatPage',
    props: { ...baseProps(), ...overrides },
    events,
  });
}

describe('ChatPage', () => {
  it('四区渲染：图标栏（仅图标）/ 展开菜单（图标+文字）/ 对话区 / 产物区', () => {
    const { container } = renderChatPage();

    // 展开菜单区：品牌 + 菜单文字 + 会话列表（含数量拼接）
    expect(screen.getByText('Pactor Chat')).toBeTruthy();
    expect(screen.getByText('0.1.0')).toBeTruthy();
    expect(screen.getByText('助理')).toBeTruthy();
    expect(screen.getByText('任务 (1)')).toBeTruthy();
    // 会话列表项 + 对话区标题同名 → 多处
    expect(screen.getAllByText('月报讨论').length).toBeGreaterThanOrEqual(2);

    // 图标栏：仅图标按钮（栏内无菜单文字，不展示品牌区）
    const rail = container.querySelector('[data-slot=chat-page-rail]')!;
    expect(rail.querySelector('.lucide-square-pen')).toBeTruthy();
    expect(rail.textContent).toBe('');

    // 对话区：消息渲染
    expect(screen.getByText('问题')).toBeTruthy();

    // 产物区：ArtifactPanel 标题（当前产物）+ markdown 内容渲染
    expect(screen.getByText('报告.md')).toBeTruthy();
    expect(screen.getByRole('heading', { name: '报告' })).toBeTruthy();
  });

  it('图标栏 hover（focus）在图标右侧展示菜单名 Tooltip', async () => {
    const { container } = renderChatPage();

    const railTrigger = container
      .querySelector('[data-slot=chat-page-rail] .lucide-square-pen')!
      .closest('[data-slot=tooltip-trigger-wrap]')!;
    fireEvent.focus(railTrigger);

    const tip = await screen.findByText('新建任务', {
      selector: '[data-slot=tooltip-content]',
    });
    expect(tip.closest('[data-side]')?.getAttribute('data-side')).toBe('right');
  });

  it('产物区开关：非受控点击隐藏 / 受控仅经 onArtifactOpenChange 上报；图标随展开态切换', async () => {
    // 非受控：展开时图标为 panel-right-close，点击后产物区消失、图标变 package
    const { container } = renderChatPage();
    expect(container.querySelector('.lucide-panel-right-close')).not.toBeNull();
    fireEvent.click(
      container.querySelector('.lucide-panel-right-close')!.closest('button')!,
    );
    expect(container.querySelector('[data-slot=chat-page-artifact]')).toBeNull();
    expect(container.querySelector('.lucide-package')).not.toBeNull();

    // 受控：仅上报，不自行关闭
    const { container: c2, context } = renderChatPage(
      { artifactOpen: true },
      { onArtifactOpenChange: { action: 'setState', params: { open: '${event}' } } },
    );
    fireEvent.click(
      c2.querySelector('.lucide-panel-right-close')!.closest('button')!,
    );
    await expectEventState(context, 'open', false);
    expect(c2.querySelector('[data-slot=chat-page-artifact]')).not.toBeNull();
  });

  it('对话区头部右侧操作：仅配置时渲染，点击经事件传出', async () => {
    // 未配置：header 不渲染任何按钮（缺省产物开关已迁移至对话图标栏）
    const { container: c0 } = renderChatPage();
    expect(
      c0.querySelector('[data-slot=chat-page-conversation-header] button'),
    ).toBeNull();

    const { container, context } = renderChatPage(
      { conversationHeaderAction: { icon: 'star', tooltip: '收藏会话' } },
      { onConversationHeaderAction: { action: 'setState', params: { starred: true } } },
    );

    // header 渲染自定义操作（产物图标只存在于图标栏，不在 header）
    const header = container.querySelector('[data-slot=chat-page-conversation-header]')!;
    expect(header.querySelector('.lucide-star')).not.toBeNull();
    expect(header.querySelector('.lucide-package')).toBeNull();
    fireEvent.click(
      container.querySelector('.lucide-star')!.closest('button')!,
    );
    await expectEventState(context, 'starred', true);
  });

  it('发送：Welcome prompt 选择经 onSend 传出文本', async () => {
    const { context } = renderChatPage(
      { messages: [] },
      { onSend: { action: 'setState', params: { sent: '${event}' } } },
    );

    // 空消息 → Welcome 空态；prompt 选择即发送
    fireEvent.click(screen.getByText('写周报'));
    await expectEventState(context, 'sent', '帮我写周报');
  });

  it('图标栏独立定义：不传 railItems 时整栏隐藏，传值仅展示 railItems', () => {
    // 不传 railItems / railFooterItems → 图标栏不渲染，展开菜单不受影响
    const { container } = renderChatPage({ railItems: undefined, railFooterItems: undefined });
    expect(container.querySelector('[data-slot=chat-page-rail]')).toBeNull();
    expect(screen.getByText('助理')).toBeTruthy();

    // railItems 与 menuItems 独立：栏内只渲染 railItems 的图标
    const { container: c2 } = renderChatPage({
      railItems: [{ key: 'assistant', label: '助理', icon: 'brain' }],
      railFooterItems: [],
    });
    const rail = c2.querySelector('[data-slot=chat-page-rail]')!;
    expect(rail.querySelector('.lucide-brain')).toBeTruthy();
    expect(rail.querySelector('.lucide-square-pen')).toBeNull();
    // 展开菜单仍渲染全部 menuItems
    const menu = c2.querySelector('[data-slot=chat-page-menu]')!;
    expect(within(menu as HTMLElement).getByText('新建任务')).toBeTruthy();
    expect(within(menu as HTMLElement).getByText('助理')).toBeTruthy();
  });

  it('对话图标栏背景与 sidePanel 一致；sidePanel 展示时左缘补边框', () => {
    const { container } = renderChatPage({
      sidePanel: { type: 'Text', props: { text: '今日任务' } },
      sidePanelOpen: false,
    });
    const rail = container.querySelector<HTMLElement>(
      '[data-slot=chat-page-conv-rail]',
    )!;
    // 背景引用与固定块相同的 chat 皮肤令牌
    expect(rail.getAttribute('style')).toContain(
      '--pactor-chat-side-panel-bg',
    );
    // 固定块收起时不显示左边框
    expect(rail.className).not.toContain('border-l');

    const { container: open } = renderChatPage({
      sidePanel: { type: 'Text', props: { text: '今日任务' } },
      sidePanelOpen: true,
    });
    const openRail = open.querySelector<HTMLElement>(
      '[data-slot=chat-page-conv-rail]',
    )!;
    // 固定块展示时左缘补边框
    expect(openRail.className).toContain('border-l');
    expect(openRail.className).toContain('border-border');

    // 未提供 sidePanel 时即使 sidePanelOpen 为 true 也不展示左边框
    const { container: absent } = renderChatPage({ sidePanelOpen: true });
    expect(
      absent.querySelector<HTMLElement>(
        '[data-slot=chat-page-conv-rail]',
      )!.className,
    ).not.toContain('border-l');
  });

  it('产物栏背景与 sidePanel 一致（同一 chat 皮肤令牌）', () => {
    const { container } = renderChatPage();
    const pane = container.querySelector<HTMLElement>(
      '[data-slot=chat-page-artifact]',
    )!;
    expect(pane.getAttribute('style')).toContain(
      '--pactor-chat-side-panel-bg',
    );
    // 不再使用弱底色
    expect(pane.className).not.toContain('bg-muted');
  });

  it('hideMenu：展开菜单区整体不渲染，图标栏与对话区保留', () => {
    const { container } = renderChatPage({ hideMenu: true });
    expect(container.querySelector('[data-slot=chat-page-menu]')).toBeNull();
    expect(screen.queryByText('新建任务')).toBeNull();
    expect(container.querySelector('[data-slot=chat-page-rail]')).toBeTruthy();
    expect(container.querySelector('[data-slot=chat-page-conversation]')).toBeTruthy();
  });

  it('会话区折叠 / 展开：点击标题切换列表显隐与 chevron', () => {
    renderChatPage();

    const sectionToggle = screen.getByText('任务 (1)').closest('button')!;
    // 缺省展开
    expect(document.querySelector('[data-slot=conversation-list]')).not.toBeNull();

    fireEvent.click(sectionToggle);
    expect(document.querySelector('[data-slot=conversation-list]')).toBeNull();
    expect(sectionToggle.querySelector('.lucide-chevron-right')).toBeTruthy();

    fireEvent.click(sectionToggle);
    expect(document.querySelector('[data-slot=conversation-list]')).not.toBeNull();
    expect(sectionToggle.querySelector('.lucide-chevron-down')).toBeTruthy();
  });

  it('底部分组折叠 / 展开：footerItems 随折叠显隐', () => {
    renderChatPage({
      footerSectionTitle: '空间 (14)',
      footerItems: [{ key: 'design', label: '设计团队', icon: 'users' }],
    });

    const footerToggle = screen.getByText('空间 (14)').closest('button')!;
    expect(screen.getByText('设计团队')).toBeTruthy();
    fireEvent.click(footerToggle);
    expect(screen.queryByText('设计团队')).toBeNull();
    fireEvent.click(footerToggle);
    expect(screen.getByText('设计团队')).toBeTruthy();
  });

  it('分区受控折叠：仅经 toggle 事件上报，不自行折叠', async () => {
    const { context } = renderChatPage(
      {
        conversationSectionCollapsed: false,
        footerSectionTitle: '空间 (14)',
        footerItems: [{ key: 'design', label: '设计团队', icon: 'users' }],
        footerSectionCollapsed: false,
      },
      {
        onConversationSectionToggle: {
          action: 'setState',
          params: { convCollapsed: '${event}' },
        },
        onFooterSectionToggle: {
          action: 'setState',
          params: { footerCollapsed: '${event}' },
        },
      },
    );

    fireEvent.click(screen.getByText('任务 (1)').closest('button')!);
    await expectEventState(context, 'convCollapsed', true);
    expect(document.querySelector('[data-slot=conversation-list]')).not.toBeNull();

    fireEvent.click(screen.getByText('空间 (14)').closest('button')!);
    await expectEventState(context, 'footerCollapsed', true);
    expect(screen.getByText('设计团队')).toBeTruthy();
  });

  it('点击「已生成 n 个产物」段打开产物区（受控经 onArtifactOpenChange 上报）', async () => {
    const { context } = renderChatPage(
      {
        messages: [
          {
            id: 'm1',
            role: 'assistant',
            parts: [
              { type: 'markdown', content: '结论' },
              { type: 'artifacts', count: 1 },
            ],
          },
        ],
        artifactOpen: false,
      },
      { onArtifactOpenChange: { action: 'setState', params: { open: '${event}' } } },
    );

    fireEvent.click(screen.getByText('已生成 1 个产物'));
    await expectEventState(context, 'open', true);
  });

  it('导航与会话事件：onMenuSelect / onSelectConversation 传出 key / id', async () => {
    const { context } = renderChatPage({}, {
      onMenuSelect: { action: 'setState', params: { menu: '${event}' } },
      onSelectConversation: { action: 'setState', params: { conv: '${event}' } },
    });

    fireEvent.click(screen.getByText('助理'));
    await expectEventState(context, 'menu', 'assistant');

    fireEvent.click(
      document.querySelector('[data-slot=conversation-list-item]')!,
    );
    await expectEventState(context, 'conv', 'c1');
  });

  it('content 槽：整体替换右侧主区域（含 header），左侧图标栏与菜单保留', () => {
    const { container } = renderChatPage({
      content: { type: 'Text', props: { text: '自定义主体' } },
    });

    expect(screen.getByText('自定义主体')).toBeTruthy();
    // 右侧主区域整体被替换：对话 header / 消息区 / Composer / 对话图标栏 / 产物区均不渲染
    expect(screen.queryByText('月报讨论', { selector: '[data-slot=chat-page-conversation-header] *' })).toBeNull();
    expect(container.querySelector('[data-slot=chat-page-conversation]')).toBeNull();
    expect(container.querySelector('[data-slot=chat-page-conv-rail]')).toBeNull();
    expect(container.querySelector('[data-slot=chat-page-artifact]')).toBeNull();
    // 左侧图标栏与展开菜单区不受影响
    expect(container.querySelector('[data-slot=chat-page-rail]')).not.toBeNull();
    expect(container.querySelector('[data-slot=chat-page-menu]')).not.toBeNull();
  });
});

describe('ChatPage 对话图标栏（conversation rail）', () => {
  const RAIL_ITEMS = [
    { key: 'steps', label: '执行步骤', icon: 'brain', content: { type: 'Text', props: { text: '步骤面板' } } },
    { key: 'info', label: '会话信息', icon: 'star', display: 'panel', content: { type: 'Text', props: { text: '信息侧栏' } } },
  ];

  it('默认渲染：首项为产物入口；hideArtifactRailItem 且无附加项时整栏隐藏', () => {
    const { container } = renderChatPage({ defaultArtifactOpen: false });
    const rail = container.querySelector('[data-slot=chat-page-conv-rail]')!;
    expect(rail).not.toBeNull();
    expect(rail.querySelector('button .lucide-package')).not.toBeNull();

    const { container: c2 } = renderChatPage({
      defaultArtifactOpen: false,
      hideArtifactRailItem: true,
    });
    expect(c2.querySelector('[data-slot=chat-page-conv-rail]')).toBeNull();
  });

  it('hidden 项：不渲染；全部隐藏且产物入口也隐藏时整栏隐藏', () => {
    const { container } = renderChatPage({
      defaultArtifactOpen: false,
      conversationRailItems: [
        { key: 'steps', label: '执行步骤', icon: 'brain', hidden: true },
        { key: 'info', label: '会话信息', icon: 'star' },
      ],
    });
    const rail = container.querySelector('[data-slot=chat-page-conv-rail]')!;
    expect(rail.querySelector('.lucide-brain')).toBeNull();
    expect(rail.querySelector('.lucide-star')).not.toBeNull();

    const { container: c2 } = renderChatPage({
      defaultArtifactOpen: false,
      hideArtifactRailItem: true,
      conversationRailItems: [{ key: 'steps', icon: 'brain', hidden: true }],
    });
    expect(c2.querySelector('[data-slot=chat-page-conv-rail]')).toBeNull();
  });

  it('popover 项：点击 toggle 弹层，再次点击 / Esc / 外点关闭；DSL content 经渲染', () => {
    const { container } = renderChatPage({
      defaultArtifactOpen: false,
      conversationRailItems: RAIL_ITEMS,
    });
    const rail = container.querySelector('[data-slot=chat-page-conv-rail]')!;
    const stepsButton = rail.querySelector('.lucide-brain')!.closest('button')!;

    fireEvent.click(stepsButton);
    expect(container.querySelector('[data-slot=chat-page-rail-popover]')).not.toBeNull();
    expect(screen.getByText('步骤面板')).not.toBeNull();

    // 再次点击收起
    fireEvent.click(stepsButton);
    expect(container.querySelector('[data-slot=chat-page-rail-popover]')).toBeNull();

    // Esc 关闭
    fireEvent.click(stepsButton);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(container.querySelector('[data-slot=chat-page-rail-popover]')).toBeNull();

    // 外点关闭
    fireEvent.click(stepsButton);
    fireEvent.mouseDown(document.body);
    expect(container.querySelector('[data-slot=chat-page-rail-popover]')).toBeNull();
  });

  it('panel 项：内容渲染进右侧分栏，与产物区互斥', () => {
    const { container } = renderChatPage({
      conversationRailItems: RAIL_ITEMS,
      // 产物区初始展开（baseProps defaultArtifactOpen: true）
    });
    expect(container.querySelector('[data-slot=chat-page-artifact]')).not.toBeNull();

    const rail = container.querySelector('[data-slot=chat-page-conv-rail]')!;
    fireEvent.click(rail.querySelector('.lucide-star')!.closest('button')!);

    // 产物区关闭，panel 项内容展示
    expect(container.querySelector('[data-slot=chat-page-artifact]')).toBeNull();
    expect(container.querySelector('[data-slot=chat-page-rail-panel]')).not.toBeNull();
    expect(screen.getByText('信息侧栏')).not.toBeNull();

    // 打开产物区 → panel 项关闭
    fireEvent.click(rail.querySelector('.lucide-package')!.closest('button')!);
    expect(container.querySelector('[data-slot=chat-page-rail-panel]')).toBeNull();
    expect(container.querySelector('[data-slot=chat-page-artifact]')).not.toBeNull();
  });

  it('受控激活项：仅经 onConversationRailChange 上报，不自行变更', async () => {
    const { container, context } = renderChatPage(
      {
        defaultArtifactOpen: false,
        conversationRailItems: RAIL_ITEMS,
        activeConversationRailKey: null,
      },
      { onConversationRailChange: { action: 'setState', params: { rail: '${event}' } } },
    );
    const rail = container.querySelector('[data-slot=chat-page-conv-rail]')!;
    fireEvent.click(rail.querySelector('.lucide-brain')!.closest('button')!);
    await expectEventState(context, 'rail', 'steps');
    // 受控 null：弹层不出现
    expect(container.querySelector('[data-slot=chat-page-rail-popover]')).toBeNull();
  });

  it('无 content 项：激活仅触发事件，不渲染内容层', async () => {
    const { container, context } = renderChatPage(
      {
        defaultArtifactOpen: false,
        conversationRailItems: [{ key: 'noop', label: '空入口', icon: 'star' }],
      },
      { onConversationRailChange: { action: 'setState', params: { rail: '${event}' } } },
    );
    const rail = container.querySelector('[data-slot=chat-page-conv-rail]')!;
    fireEvent.click(rail.querySelector('.lucide-star')!.closest('button')!);
    await expectEventState(context, 'rail', 'noop');
    expect(container.querySelector('[data-slot=chat-page-rail-popover]')).toBeNull();
    expect(container.querySelector('[data-slot=chat-page-rail-panel]')).toBeNull();
  });
});

describe('ChatPage 右端固定块（side panel）', () => {
  it('未提供 sidePanel 时不渲染固定块', () => {
    const { container } = renderChatPage({ defaultArtifactOpen: false });
    expect(container.querySelector('[data-slot=chat-page-side-panel]')).toBeNull();
  });

  it('展开：DSL 内容经槽渲染，位于 ConversationRail 左侧，宽度可配', () => {
    const { container } = renderChatPage({
      defaultArtifactOpen: false,
      sidePanel: { type: 'Text', props: { text: '今日任务' } },
      sidePanelOpen: true,
      sidePanelWidth: 320,
    });
    const panel = container.querySelector<HTMLElement>(
      '[data-slot=chat-page-side-panel]',
    )!;
    expect(panel).not.toBeNull();
    expect(panel.getAttribute('data-state')).toBe('open');
    expect(panel.style.width).toBe('320px');
    expect(panel.style.opacity).toBe('1');
    expect(panel.style.transition).toContain('width');
    expect(screen.getByText('今日任务')).not.toBeNull();

    // 与对话图标栏同处右端容器（aside），且位于图标栏之前（左侧）
    const rail = container.querySelector('[data-slot=chat-page-conv-rail]')!;
    const aside = container.querySelector('[data-slot=chat-page-aside]')!;
    expect(aside).not.toBeNull();
    expect(panel.parentElement).toBe(aside);
    expect(rail.parentElement).toBe(aside);
    expect(aside.getAttribute('data-state')).toBe('open');
    expect(
      panel.compareDocumentPosition(rail) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    // 背景色引用 chat 皮肤令牌（跟随当前页面皮肤）
    expect(panel.getAttribute('style')).toContain(
      '--pactor-chat-side-panel-bg',
    );

    // 内层保持目标宽度：动画推进时内容不重排
    const body = panel.querySelector<HTMLElement>(
      '[data-slot=chat-page-side-panel-body]',
    )!;
    expect(body.style.width).toBe('320px');
  });

  it('收起：宽度 0 / 透明 / aria-hidden + inert，内容保留以支持过渡', () => {
    const { container } = renderChatPage({
      defaultArtifactOpen: false,
      sidePanel: { type: 'Text', props: { text: '今日任务' } },
      sidePanelOpen: false,
    });
    const panel = container.querySelector<HTMLElement>(
      '[data-slot=chat-page-side-panel]',
    )!;
    expect(
      container
        .querySelector('[data-slot=chat-page-aside]')!
        .getAttribute('data-state'),
    ).toBe('closed');
    expect(panel.getAttribute('data-state')).toBe('closed');
    expect(panel.style.width).toBe('0px');
    expect(panel.style.opacity).toBe('0');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(panel.hasAttribute('inert')).toBe(true);
    // 内容仍在 DOM（宽度动画结束前不卸载）
    expect(screen.getByText('今日任务')).not.toBeNull();
  });

  it('ReactNode 内容直出；缺省宽度 280px', () => {
    const { container } = renderChatPage({
      defaultArtifactOpen: false,
      sidePanel: <strong>自定义任务元素</strong>,
      sidePanelOpen: true,
    });
    expect(screen.getByText('自定义任务元素')).not.toBeNull();
    const panel = container.querySelector<HTMLElement>(
      '[data-slot=chat-page-side-panel]',
    )!;
    expect(panel.style.width).toBe('280px');
  });

  it('content 槽替换主区域时不渲染右端固定块', () => {
    const { container } = renderChatPage({
      sidePanel: { type: 'Text', props: { text: '今日任务' } },
      sidePanelOpen: true,
      content: { type: 'Text', props: { text: '自定义主体' } },
    });
    expect(screen.getByText('自定义主体')).not.toBeNull();
    expect(container.querySelector('[data-slot=chat-page-side-panel]')).toBeNull();
  });
});

describe('ChatPage 提问导航', () => {
  const question = (id: string, content: string) => ({
    id,
    role: 'user',
    parts: [{ type: 'text', content }],
  });

  it('仅一条提问时不渲染', () => {
    const { container } = renderChatPage();
    expect(
      container.querySelector('[data-slot=chat-page-question-nav]'),
    ).toBeNull();
  });

  it('showQuestionNav=false 时关闭提问导航', () => {
    const { container } = renderChatPage({
      messages: [question('q1', '问题一'), question('q2', '问题二')],
      showQuestionNav: false,
    });
    expect(
      container.querySelector('[data-slot=chat-page-question-nav]'),
    ).toBeNull();
  });

  it('默认 6×2 块、当前浏览 12×2，块位于浮层内；hover 向四周展开', () => {
    const { container } = renderChatPage({
      messages: [
        question('q1', '第一个问题'),
        { id: 'a1', role: 'assistant', parts: [{ type: 'text', content: '回答' }] },
        question('q2', '这是一个超过十个字的提问内容'),
      ],
    });
    const nav = container.querySelector('[data-slot=chat-page-question-nav]')!;
    expect(nav).not.toBeNull();
    expect(nav.getAttribute('aria-label')).toBe('提问导航');

    const items = nav.querySelectorAll('[data-slot=chat-page-question-nav-item]');
    expect(items.length).toBe(2);
    expect(items[0].className).toContain('h-[2px]');
    // 默认块长 6px，当前浏览（jsdom 下为末条）12px
    expect(items[0].className).toContain('w-1.5');
    expect(items[1].className).toContain('w-3');
    expect(items[1].className).toContain('transition-[width,background-color]');

    // 单个浮层汇总全部提问项，导航块本身也在浮层内
    const popover = nav.querySelector(
      '[data-slot=chat-page-question-nav-popover]',
    )!;
    // 浮层背景从中心向四周缩放展开
    const popoverBg = popover.querySelector(
      '[data-slot=chat-page-question-nav-popover-bg]',
    )!;
    expect(popoverBg.className).toContain('group-hover:bg-popover');
    expect(popoverBg.className).toContain('group-hover:border-border');
    expect(popoverBg.className).toContain('scale-90');
    expect(popoverBg.className).toContain('group-hover:scale-100');
    expect(popoverBg.className).toContain('opacity-0');
    expect(popoverBg.className).toContain('group-hover:opacity-100');
    expect(popoverBg.className).toContain(
      'transition-[background-color,border-color,box-shadow,opacity,scale]',
    );
    // 默认 gap-1，hover 放大到 gap-2；x/y 内边距；收起态仅块行可交互
    expect(popover.className).toContain('gap-1');
    expect(popover.className).toContain('group-hover:gap-2');
    expect(popover.className).toContain('px-4');
    expect(popover.className).toContain('py-3');
    expect(popover.className).toContain('pointer-events-none');
    expect(popover.contains(items[0])).toBe(true);
    expect(
      nav.querySelectorAll(':scope > [data-slot=chat-page-question-nav-item]'),
    ).toHaveLength(0);

    const labels = popover.querySelectorAll(
      '[data-slot=chat-page-question-nav-label]',
    );
    expect(labels.length).toBe(2);
    expect(labels[0].textContent).toBe('第一个问题');
    expect(labels[0].className).toContain('pointer-events-auto');
    // 浮层文案保留 10 字截断；完整正文经 title 在 hover 时展示
    expect(labels[1].textContent).toBe('这是一个超过十个字的...');
    expect(labels[1].getAttribute('title')).toBe('这是一个超过十个字的提问内容');
    expect(labels[1].getAttribute('aria-label')).toBe(
      '跳转到提问：这是一个超过十个字的提问内容',
    );
    // 默认提问文字灰色；当前浏览的提问 primary 且加粗；
    // 悬停某条时该条文字变 primary（颜色过渡）
    const idleText = labels[0].querySelector('span')!;
    expect(labels[0].className).toContain('group/item');
    expect(idleText.className).toContain('text-muted-foreground');
    expect(idleText.className).toContain('group-hover/item:text-primary');
    expect(idleText.className).toContain(
      'transition-[max-width,opacity,color]',
    );
    const labelText = labels[1].querySelector('span')!;
    expect(labelText.className).toContain('text-primary');
    expect(labelText.className).toContain('font-semibold');
    expect(labelText.className).toContain('group-hover:opacity-100');
  });

  it('滚动位置对应的提问块高亮（jsdom 下视为底部，末条高亮）', () => {
    const { container } = renderChatPage({
      messages: [
        question('q1', '第一个问题'),
        question('q2', '第二个问题'),
      ],
    });
    const items = container.querySelectorAll(
      '[data-slot=chat-page-question-nav-item]',
    );
    expect(items.length).toBe(2);
    expect(items[1].className).toContain('bg-primary');
    expect(items[1].className).toContain('w-3');
    expect(items[0].className).toContain('bg-muted-foreground/30');
    expect(items[0].className).toContain('w-1.5');
  });

  it('最多展示 10 个块（保留最近提问）', () => {
    const { container } = renderChatPage({
      messages: Array.from({ length: 12 }, (_, index) =>
        question(`q${index + 1}`, `问题${index + 1}`),
      ),
    });
    const labels = container.querySelectorAll(
      '[data-slot=chat-page-question-nav-label]',
    );
    expect(labels.length).toBe(10);
    expect(labels[0].textContent).toBe('问题3');
    expect(labels[9].textContent).toBe('问题12');
  });

  it('位于 chat-page-aside 最左侧（固定块 / 图标栏之前）并垂直居中', () => {
    const { container } = renderChatPage({
      messages: [question('q1', '问题一'), question('q2', '问题二')],
      sidePanel: { type: 'Text', props: { text: '今日任务' } },
      sidePanelOpen: true,
    });
    const aside = container.querySelector('[data-slot=chat-page-aside]')!;
    const nav = container.querySelector('[data-slot=chat-page-question-nav]')!;
    const panel = container.querySelector('[data-slot=chat-page-side-panel]')!;
    const rail = container.querySelector('[data-slot=chat-page-conv-rail]')!;
    expect(nav.parentElement).toBe(aside);
    expect(aside.firstElementChild).toBe(nav);
    expect(nav.className).toContain('self-center');
    expect(
      nav.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      nav.compareDocumentPosition(rail) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
