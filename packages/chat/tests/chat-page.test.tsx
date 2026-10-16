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
