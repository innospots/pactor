// @vitest-environment jsdom
/**
 * WorkspaceSwitcher 契约（ChatPage Composer footer）：内建渲染 /
 * 选择与清除受控闭环 / 搜索过滤 / 新建弹框；独立使用时受控
 * value + onChange。样式为 Tailwind 内联（无独立 CSS 文件）。
 */
import './setup.js';

import type { DslNode } from '@pactor-app/core';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { WorkspaceSwitcher } from '../src/components/WorkspaceSwitcher/index.js';
import {
  expectEventState,
  renderDsl,
  type RenderDslResult,
} from './helpers.js';

afterEach(cleanup);

const OPTIONS = [
  { label: '默认工作空间', value: '默认工作空间' },
  { label: '设计团队空间', value: '设计团队空间' },
  { label: '前端研发空间', value: '前端研发空间' },
];

function renderChatPage(
  props: Record<string, unknown> = {},
  events?: DslNode['events'],
  state: Record<string, unknown> = {},
): RenderDslResult {
  return renderDsl(
    {
      type: 'ChatPage',
      props: { conversationTitle: '会话', messages: [], ...props },
      events,
    },
    { state },
  );
}

function openTrigger(): void {
  fireEvent.click(screen.getByRole('button', { name: /选择工作空间|工作空间/ }));
}

function popover(): HTMLElement {
  return document.querySelector(
    '[data-slot=workspace-switcher-popover]',
  ) as HTMLElement;
}

describe('WorkspaceSwitcher（ChatPage 内建）', () => {
  it('提供 workspaces 时渲染在 Composer footer；选择 / 清除经事件闭环', async () => {
    const { context } = renderChatPage(
      {
        workspaces: OPTIONS,
        workspace: '${state.workspace}',
      },
      {
        onWorkspaceChange: {
          action: 'setState',
          params: { workspace: '${event}' },
        },
      },
      { workspace: '' },
    );

    const trigger = screen.getByRole('button', { name: /选择工作空间/ });
    expect(trigger.getAttribute('data-slot')).toBe(
      'workspace-switcher-trigger',
    );
    fireEvent.click(trigger);
    const list = popover();
    expect(within(list).getByText('设计团队空间')).toBeTruthy();

    fireEvent.click(within(list).getByText('设计团队空间'));
    await expectEventState(context, 'workspace', '设计团队空间');
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /设计团队空间/ }),
      ).toBeTruthy(),
    );

    // 再次打开：当前项打勾，提供清除项
    fireEvent.click(screen.getByRole('button', { name: /设计团队空间/ }));
    expect(within(popover()).getByText('不使用工作空间')).toBeTruthy();
    fireEvent.click(within(popover()).getByText('不使用工作空间'));
    await expectEventState(context, 'workspace', '');
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /选择工作空间/ }),
      ).toBeTruthy(),
    );
  });

  it('新建工作空间经 events.onWorkspaceCreate 上报名称', async () => {
    const { context } = renderChatPage(
      { workspaces: OPTIONS },
      {
        onWorkspaceCreate: {
          action: 'setState',
          params: { created: '${event}' },
        },
      },
    );

    fireEvent.click(screen.getByRole('button', { name: /选择工作空间/ }));
    fireEvent.click(within(popover()).getByText('新建工作空间'));
    const input = await screen.findByPlaceholderText('请输入工作空间名称');
    fireEvent.change(input, { target: { value: '客服空间' } });
    fireEvent.click(screen.getByRole('button', { name: '创建' }));

    await expectEventState(context, 'created', '客服空间');
  });

  it('未提供 workspaces 时不渲染切换器', () => {
    renderChatPage();
    expect(
      screen.queryByRole('button', { name: /选择工作空间/ }),
    ).toBeNull();
    expect(
      document.querySelector('[data-slot=workspace-switcher-trigger]'),
    ).toBeNull();
  });

  it('与 composerFooter 同时提供时并排渲染', () => {
    renderChatPage({
      workspaces: OPTIONS,
      composerFooter: {
        type: 'Text',
        props: { text: '自定义 footer' },
      },
    });

    expect(
      screen.getByRole('button', { name: /选择工作空间/ }),
    ).toBeTruthy();
    expect(screen.getByText('自定义 footer')).toBeTruthy();
  });
});

describe('WorkspaceSwitcher（独立 / 交互）', () => {
  it('搜索过滤候选，无匹配展示空态', () => {
    render(<WorkspaceSwitcher options={OPTIONS} />);
    openTrigger();

    const search = screen.getByPlaceholderText('搜索工作空间');
    fireEvent.change(search, { target: { value: '设计' } });
    expect(within(popover()).getByText('设计团队空间')).toBeTruthy();
    expect(within(popover()).queryByText('前端研发空间')).toBeNull();

    fireEvent.change(search, { target: { value: '不存在' } });
    expect(within(popover()).getByText('无匹配的工作空间')).toBeTruthy();
  });

  it('新建工作空间：onCreate 上报新名称并追加列表；同名视为选择已有项', async () => {
    const onChange = vi.fn();
    const onCreate = vi.fn();
    render(
      <WorkspaceSwitcher
        options={OPTIONS}
        onChange={onChange}
        onCreate={onCreate}
      />,
    );
    openTrigger();

    fireEvent.click(within(popover()).getByText('新建工作空间'));
    const input = await screen.findByPlaceholderText('请输入工作空间名称');
    const create = screen.getByRole('button', { name: '创建' });
    expect((create as HTMLButtonElement).disabled).toBe(true);

    fireEvent.change(input, { target: { value: '新团队空间' } });
    fireEvent.click(create);

    expect(onCreate).toHaveBeenCalledWith('新团队空间');
    expect(onChange).toHaveBeenCalledWith('新团队空间');
    await waitFor(() =>
      expect(
        screen.queryByPlaceholderText('请输入工作空间名称'),
      ).toBeNull(),
    );

    // 重新打开：新建项已并入候选
    openTrigger();
    expect(within(popover()).getByText('新团队空间')).toBeTruthy();

    // 同名再次「创建」不触发 onCreate，仅按选择处理
    fireEvent.click(within(popover()).getByText('新建工作空间'));
    const again = await screen.findByPlaceholderText('请输入工作空间名称');
    fireEvent.change(again, { target: { value: '新团队空间' } });
    fireEvent.click(screen.getByRole('button', { name: '创建' }));
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith('新团队空间');
  });
});
