// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';
import type { PageDsl } from '@pactor-app/core';
import {
  ActionEngine,
  createRuntimeContext,
  DslRenderer,
  registerBuiltinActions,
  type RuntimeContext,
} from '@pactor-app/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createUiBridge,
  OverlayManager,
  registerInteractionActions,
  OverlayHost,
  type ResolvePageFn,
} from '../../src/interaction/index.js';

afterEach(cleanup);

interface HostSetup {
  context: RuntimeContext;
  manager: OverlayManager;
  engine: ActionEngine;
}

/** 在 Renderer 上下文内挂载 OverlayHost（依赖 useRenderer） */
function setupHost(resolvePage?: ResolvePageFn): HostSetup {
  const context = createRuntimeContext();
  registerBuiltinActions(context.actions);
  const manager = new OverlayManager();
  registerInteractionActions(context.actions, manager, createUiBridge());
  const engine = new ActionEngine(context);
  render(
    <DslRenderer context={context}>
      <OverlayHost manager={manager} resolvePage={resolvePage} />
    </DslRenderer>,
  );
  return { context, manager, engine };
}

describe('Modal / Drawer 渲染（shadcn 实现）', () => {
  it('渲染打开的 modal：标题与 content 文本出现（shadcn Dialog，无 ant 元素）', async () => {
    const { context, manager } = setupHost();
    context.components.register('Text', ({ value }: { value?: string }) => (
      <span>{value}</span>
    ));

    void manager.open({
      type: 'modal',
      title: '用户详情',
      content: { type: 'Text', props: { value: '详情内容' } },
    });

    await screen.findByText('用户详情');
    expect(document.querySelector('[data-slot=overlay-modal]')).toBeTruthy();
    await screen.findByText('详情内容');
    expect(document.querySelector('.ant-modal')).toBeNull();
  });

  it('overlay 内容绑定 state 的表达式随 state 变化重渲染（表单联动基础）', async () => {
    const { context, manager } = setupHost();
    context.components.register('Text', ({ value }: { value?: string }) => (
      <span>{value}</span>
    ));

    context.state.set('label', '初始');
    void manager.open({
      type: 'modal',
      title: '联动',
      content: { type: 'Text', props: { value: '${state.label}' } },
    });
    await screen.findByText('初始');

    act(() => {
      context.state.set('label', '更新后');
    });
    await screen.findByText('更新后');
  });

  it('type 为 drawer 时渲染 vendored drawer 原语面板并应用 title', async () => {
    const { manager } = setupHost();

    void manager.open({ type: 'drawer', title: '编辑面板' });

    await screen.findByText('编辑面板');
    expect(document.querySelector('[data-slot=drawer-panel]')).toBeTruthy();
    expect(document.querySelector('[data-slot=overlay-modal]')).toBeFalsy();
    expect(document.querySelector('.ant-drawer')).toBeNull();
  });

  it('点击 Modal 关闭按钮触发取消语义：resolve { success: false }，弹层消失', async () => {
    const { manager } = setupHost();

    const opened = manager.open({ type: 'modal', title: '用户详情' });
    await screen.findByText('用户详情');

    fireEvent.click(document.querySelector('[data-slot=overlay-modal-close]')!);

    await expect(opened).resolves.toEqual({ success: false });
    await vi.waitFor(() => {
      expect(manager.stack()).toHaveLength(0);
    });
    await vi.waitFor(() => {
      expect(screen.queryByText('用户详情')).toBeFalsy();
    });
  });

  it('Drawer 为 modal=false：body 不挂 pointer-events:none（抽屉内 portal 弹层可点）', async () => {
    const { manager } = setupHost();

    void manager.open({ type: 'drawer', title: '编辑面板' });
    await screen.findByText('编辑面板');

    // vaul 在 rAF 中手动复位 body pointer-events（Radix 底层会先置 none）
    await vi.waitFor(() => {
      expect(document.body.style.pointerEvents).not.toBe('none');
    });
  });

  it('Drawer 遮罩点击触发取消语义 close', async () => {
    const { manager } = setupHost();

    const opened = manager.open({ type: 'drawer', title: '编辑面板' });
    await screen.findByText('编辑面板');

    // modal={false} 后遮罩关闭由 overlay 自身 onPointerDown 承担
    // （pointerdown 无点击穿透窗口，弹层选项关闭动画后的 pointerup 不会误触）
    fireEvent.pointerDown(document.querySelector('[data-slot=drawer-overlay]')!);

    await expect(opened).resolves.toEqual({ success: false });
    expect(manager.stack()).toHaveLength(0);
  });

  it('Drawer 按 Escape 触发取消语义 close', async () => {
    const { manager } = setupHost();

    const opened = manager.open({ type: 'drawer', title: '编辑面板' });
    await screen.findByText('编辑面板');

    fireEvent.keyDown(document, { key: 'Escape' });

    await expect(opened).resolves.toEqual({ success: false });
    expect(manager.stack()).toHaveLength(0);
  });

  it('width 应用到 Modal（number 转 px）', async () => {
    const { manager } = setupHost();

    void manager.open({ type: 'modal', title: '宽弹层', width: 640 });

    await screen.findByText('宽弹层');
    const dialog = document.querySelector('[data-slot=overlay-modal]') as HTMLElement;
    expect(dialog.style.width).toBe('640px');
  });

  it('width 应用到 Drawer 面板', async () => {
    const { manager } = setupHost();

    void manager.open({ type: 'drawer', title: '宽面板', width: 480 });

    await screen.findByText('宽面板');
    const panel = document.querySelector('[data-slot=drawer-panel]') as HTMLElement;
    expect(panel.style.width).toBe('480px');
    // maxWidth 同步内联，避免 vaul 原语的 sm:max-w-sm（384px）上限压过 width
    expect(panel.style.maxWidth).toBe('480px');
  });
});

describe('DSL content 渲染作用域', () => {
  it('content 经 ${params.x} 访问 open 传入的 params', async () => {
    const { context, manager } = setupHost();
    const seen: unknown[] = [];
    context.components.register('UserDetail', ({ userId }: { userId?: number }) => {
      seen.push(userId);
      return <span>用户 {userId}</span>;
    });

    void manager.open({
      type: 'modal',
      params: { id: 7 },
      content: { type: 'UserDetail', props: { userId: '${params.id}' } },
    });

    await screen.findByText('用户 7');
    expect(seen).toContain(7);
  });

  it('content 经 ${parent.state.x} 访问父作用域快照', async () => {
    const { context, manager } = setupHost();
    context.state.set({ user: '张三' });
    context.components.register('Text', ({ value }: { value?: string }) => (
      <span>{value}</span>
    ));

    void manager.open(
      {
        type: 'modal',
        content: { type: 'Text', props: { value: '来自 ${parent.state.user}' } },
      },
      { parentScope: { state: context.state.getState() } },
    );

    await screen.findByText('来自 张三');
  });

  it('content 内 DSL 事件经 overlay.close 携带 payload 关闭', async () => {
    const { context, manager } = setupHost();
    context.components.register(
      'ConfirmButton',
      ({ onClick }: { onClick?: () => void }) => (
        <button onClick={() => onClick?.()}>确认</button>
      ),
    );

    const opened = manager.open({
      type: 'modal',
      content: {
        type: 'ConfirmButton',
        events: {
          onClick: {
            action: 'overlay.close',
            params: { payload: { success: true } },
          },
        },
      },
    });

    fireEvent.click(await screen.findByRole('button', { name: '确认' }));

    await expect(opened).resolves.toEqual({ success: true });
    expect(manager.stack()).toHaveLength(0);
  });
});

describe('page overlay 动态加载', () => {
  const pageDsl: PageDsl = {
    dsl: '1.0',
    page: { id: 'user-edit', title: '编辑用户' },
    body: { type: 'PageText', props: { text: '编辑 ${params.name}' } },
    lifecycle: { onDestroy: { action: 'track.destroy' } },
  };

  it('resolvePage 返回 PageDsl：Drawer 中渲染该页面 body，params 注入子运行时作用域', async () => {
    const { context, manager } = setupHost(async () => pageDsl);
    context.components.register('PageText', ({ text }: { text?: string }) => (
      <p>{text}</p>
    ));

    void manager.open({
      type: 'drawer',
      title: '编辑',
      page: { pageId: 'user-edit' },
      params: { name: '张三' },
    });

    await screen.findByText('编辑 张三');
  });

  it('close 时 destroy 子运行时（onDestroy 生命周期执行）', async () => {
    const { context, manager } = setupHost(async () => pageDsl);
    context.components.register('PageText', ({ text }: { text?: string }) => (
      <p>{text}</p>
    ));
    const onDestroy = vi.fn(() => ({ ok: true as const }));
    context.actions.register('track.destroy', onDestroy);

    const opened = manager.open({
      type: 'drawer',
      page: { pageId: 'user-edit' },
      params: { name: '张三' },
    });
    await screen.findByText('编辑 张三');

    manager.close(manager.stack()[0]!.id, { success: true });

    await expect(opened).resolves.toEqual({ success: true });
    await vi.waitFor(() => {
      expect(onDestroy).toHaveBeenCalledTimes(1);
    });
  });

  it('未注入 resolvePage：渲染受控错误提示，不抛未捕获异常', async () => {
    const { manager } = setupHost();

    void manager.open({ type: 'modal', page: { pageId: 'user-edit' } });

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('resolvePage');
    expect(alert.textContent).toContain('user-edit');
    // 受控：可正常关闭
    manager.close();
  });
});
