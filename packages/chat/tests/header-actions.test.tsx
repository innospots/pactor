// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Chat,
  ChatServicesProvider,
  ConversationStore,
  createManualDriver,
  type ChatServices,
} from '../src/index.js';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-pactor-theme');
});

function renderChat(
  ui: React.ReactElement,
  services?: Partial<ChatServices>,
): ReturnType<typeof render> {
  const driver = createManualDriver();
  return render(
    <ChatServicesProvider
      value={{ transport: driver.transport, ...services }}
    >
      {ui}
    </ChatServicesProvider>,
  );
}

function storeWithMessage(): ConversationStore {
  const store = new ConversationStore();
  store.appendMessage({
    id: 'u1',
    role: 'user',
    status: 'completed',
    parts: [{ type: 'text', content: '看下数据', status: 'ready' }],
  });
  return store;
}

describe('内建 header 操作组（spec: chat-dsl-component / Header 配置，决策 D4）', () => {
  it('headerActions 按数组顺序渲染在 headerExtra 槽之前', () => {
    renderChat(
      <Chat
        title="会话"
        headerActions={['clear', 'export', 'theme']}
        headerExtra={<span data-testid="extra">扩展</span>}
      />,
    );
    const labels = Array.from(
      document.querySelectorAll(
        '.pactor-chat-workspace__header-actions button',
      ),
    ).map((button) => button.getAttribute('aria-label'));
    expect(labels).toEqual(['清空会话', '导出 Markdown', '切换明暗主题']);

    const actions = document.querySelector(
      '.pactor-chat-workspace__header-actions',
    )!;
    const extra = screen.getByTestId('extra');
    expect(
      actions.compareDocumentPosition(extra) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('内建导出：序列化 store 消息为 Markdown 并触发下载，并行触发 onExport（spec: 内建导出）', () => {
    const store = storeWithMessage();
    const createdUrls: string[] = [];
    const createObjectURL = vi.fn((blob: Blob) => {
      expect(blob).toBeInstanceOf(Blob);
      const url = `blob:mock-${createdUrls.length}`;
      createdUrls.push(url);
      return url;
    });
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    const onExport = vi.fn();

    renderChat(<Chat title="周报" headerActions={['export']} onExport={onExport} />, {
      store,
    });
    fireEvent.click(screen.getByRole('button', { name: '导出 Markdown' }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    const anchor = clickSpy.mock.instances[0] as unknown as HTMLAnchorElement;
    expect(anchor.download).toBe('周报.md');
    expect(anchor.href).toBe(createdUrls[0]!);
    expect(revokeObjectURL).toHaveBeenCalledWith(createdUrls[0]!);
    expect(onExport).toHaveBeenCalledTimes(1);

    clickSpy.mockRestore();
  });

  it('内建主题切换：切换 documentElement 的 data-pactor-theme，事件带新 theme（spec: 内建操作）', () => {
    const onThemeChange = vi.fn();
    renderChat(
      <Chat title="会话" headerActions={['theme']} onThemeChange={onThemeChange} />,
    );
    const button = screen.getByRole('button', { name: '切换明暗主题' });

    fireEvent.click(button);
    expect(
      document.documentElement.getAttribute('data-pactor-theme'),
    ).toBe('dark');
    expect(onThemeChange).toHaveBeenLastCalledWith('dark');

    fireEvent.click(button);
    expect(
      document.documentElement.getAttribute('data-pactor-theme'),
    ).toBeNull();
    expect(onThemeChange).toHaveBeenLastCalledWith('light');
  });

  it('内建清空：store 清空并触发 onClear（spec: 内建清空）', () => {
    const store = storeWithMessage();
    const onClear = vi.fn();
    renderChat(<Chat title="会话" headerActions={['clear']} onClear={onClear} />, {
      store,
    });
    expect(screen.getByText('看下数据')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '清空会话' }));
    expect(store.getMessages()).toEqual([]);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('headerActions 缺省时不渲染任何操作按钮（零渲染承诺）', () => {
    renderChat(<Chat title="会话" />);
    expect(
      document.querySelector('.pactor-chat-workspace__header-actions'),
    ).toBeNull();
    expect(screen.queryByRole('button', { name: '导出 Markdown' })).toBeNull();
  });
});

describe('可编辑标题（spec: chat-dsl-component / Header 配置 / 可编辑标题）', () => {
  it('点击标题进入编辑，Enter 提交并触发 onTitleChange（spec: 可编辑标题）', () => {
    const onTitleChange = vi.fn();
    renderChat(
      <Chat title="原标题" editableTitle onTitleChange={onTitleChange} />,
    );

    fireEvent.click(document.querySelector('.pactor-chat-workspace__title--editable')!);
    const input = screen.getByRole('textbox', { name: '编辑标题' });
    fireEvent.change(input, { target: { value: '周报助手' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onTitleChange).toHaveBeenCalledWith('周报助手');
    // header 显示新标题（编辑态退出）
    expect(screen.getByText('周报助手')).toBeTruthy();
    expect(screen.queryByRole('textbox', { name: '编辑标题' })).toBeNull();
  });

  it('blur 提交；空串或与原标题相同则不触发事件', () => {
    const onTitleChange = vi.fn();
    renderChat(
      <Chat title="原标题" editableTitle onTitleChange={onTitleChange} />,
    );

    // 空串提交：不触发事件，回退原标题
    fireEvent.click(document.querySelector('.pactor-chat-workspace__title--editable')!);
    let input = screen.getByRole('textbox', { name: '编辑标题' });
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.blur(input);
    expect(onTitleChange).not.toHaveBeenCalled();
    expect(screen.getByText('原标题')).toBeTruthy();

    // 原标题提交：不触发事件
    fireEvent.click(document.querySelector('.pactor-chat-workspace__title--editable')!);
    input = screen.getByRole('textbox', { name: '编辑标题' });
    fireEvent.change(input, { target: { value: '原标题' } });
    fireEvent.blur(input);
    expect(onTitleChange).not.toHaveBeenCalled();
  });

  it('Escape 取消编辑，不触发事件', () => {
    const onTitleChange = vi.fn();
    renderChat(
      <Chat title="原标题" editableTitle onTitleChange={onTitleChange} />,
    );

    fireEvent.click(document.querySelector('.pactor-chat-workspace__title--editable')!);
    const input = screen.getByRole('textbox', { name: '编辑标题' });
    fireEvent.change(input, { target: { value: '改动' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onTitleChange).not.toHaveBeenCalled();
    expect(screen.getByText('原标题')).toBeTruthy();
  });

  it('未开 editableTitle 时标题为静态 div（零渲染承诺）', () => {
    renderChat(<Chat title="会话" />);
    expect(document.querySelector('.pactor-chat-workspace__title--editable')).toBeNull();
    expect(
      document.querySelector('.pactor-chat-workspace__title')?.tagName,
    ).toBe('DIV');
  });
});
