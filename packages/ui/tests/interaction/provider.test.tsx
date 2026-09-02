// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  ActionEngine,
  createRuntimeContext,
  registerBuiltinActions,
} from '@pactor-app/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createUiBridge,
  OverlayManager,
  registerInteractionActions,
  ShadcnInteractionProvider,
} from '../../src/interaction/index.js';

afterEach(cleanup);

/** 注册好交互动作与 ShadcnInteractionProvider 的测试环境 */
function setupProvider() {
  const context = createRuntimeContext();
  registerBuiltinActions(context.actions);
  const ui = createUiBridge();
  registerInteractionActions(context.actions, new OverlayManager(), ui);
  const engine = new ActionEngine(context);
  const result = render(
    <ShadcnInteractionProvider bridge={ui}>
      <div>宿主</div>
    </ShadcnInteractionProvider>,
  );
  return { context, ui, engine, ...result };
}

describe('ShadcnInteractionProvider：message 动作经 toast', () => {
  it('Provider 挂载后 message 动作展示 toast（含文本与类型钩子，无 ant 元素）', async () => {
    const { ui, engine } = setupProvider();
    // UiBridge 注入发生在 mount effect
    await vi.waitFor(() => {
      expect(ui.message).toBeDefined();
    });

    const result = await engine.execute({
      action: 'message',
      params: { type: 'success', text: '保存成功' },
    });

    expect(result.ok).toBe(true);
    await screen.findByText('保存成功');
    expect(
      document.querySelector('[data-slot=toast][data-type=success]'),
    ).toBeTruthy();
    expect(document.querySelector('.ant-message')).toBeNull();
  });

  it('toast 约 3s 后自动消失', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const { ui, engine } = setupProvider();
      await vi.waitFor(() => {
        expect(ui.message).toBeDefined();
      });

      await engine.execute({
        action: 'message',
        params: { type: 'info', text: '提示信息' },
      });
      await screen.findByText('提示信息');

      await vi.advanceTimersByTimeAsync(3500);

      await vi.waitFor(() => {
        expect(screen.queryByText('提示信息')).toBeNull();
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it('Provider 卸载后 UiBridge 清空，message 动作受控失败', async () => {
    const context = createRuntimeContext();
    registerBuiltinActions(context.actions);
    const ui = createUiBridge();
    registerInteractionActions(context.actions, new OverlayManager(), ui);
    const engine = new ActionEngine(context);

    const { unmount } = render(<ShadcnInteractionProvider bridge={ui} />);
    await vi.waitFor(() => {
      expect(ui.message).toBeDefined();
    });
    unmount();

    expect(ui.message).toBeUndefined();
    const result = await engine.execute({
      action: 'message',
      params: { type: 'info', text: 'x' },
    });
    expect(result.ok).toBe(false);
  });
});

describe('ShadcnInteractionProvider：confirm 动作经 shadcn Dialog 确认框', () => {
  it('点击确定：确认框出现并关闭，动作返回 { ok: true, data: true }', async () => {
    const { ui, engine } = setupProvider();
    await vi.waitFor(() => {
      expect(ui.modal).toBeDefined();
    });

    const executed = engine.execute({
      action: 'confirm',
      params: { title: '删除确认', content: '确定删除该记录吗？' },
    });

    await screen.findByText('删除确认');
    expect(document.querySelector('[data-slot=confirm-dialog]')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '确定' }));

    await expect(executed).resolves.toEqual({ ok: true, data: true });
    await vi.waitFor(() => {
      expect(document.querySelector('[data-slot=confirm-dialog]')).toBeNull();
    });
  });

  it('点击取消：动作返回 { ok: true, data: false }', async () => {
    const { ui, engine } = setupProvider();
    await vi.waitFor(() => {
      expect(ui.modal).toBeDefined();
    });

    const executed = engine.execute({
      action: 'confirm',
      params: { title: '删除确认' },
    });
    await screen.findByText('删除确认');

    fireEvent.click(screen.getByRole('button', { name: '取消' }));

    await expect(executed).resolves.toEqual({ ok: true, data: false });
    await vi.waitFor(() => {
      expect(document.querySelector('[data-slot=confirm-dialog]')).toBeNull();
    });
  });
});
