import {
  ActionEngine,
  createRuntimeContext,
  registerBuiltinActions,
  type RuntimeContext,
} from 'pactor-runtime';
import { describe, expect, it, vi } from 'vitest';

import {
  createUiBridge,
  registerInteractionActions,
} from '../src/actions.js';
import { OverlayManager } from '../src/manager.js';

function setup() {
  const context = createRuntimeContext();
  registerBuiltinActions(context.actions);
  const manager = new OverlayManager();
  const ui = createUiBridge();
  registerInteractionActions(context.actions, manager, ui);
  const engine = new ActionEngine(context);
  return { context, manager, ui, engine };
}

/** 等 manager.open 的 Promise 入栈（open 在微任务中推进） */
async function waitStack(manager: OverlayManager, length = 1) {
  await vi.waitFor(() => {
    expect(manager.stack()).toHaveLength(length);
  });
}

describe('overlay.open / overlay.close 动作', () => {
  it('overlay.open 打开弹层，close payload 作为动作 data 返回', async () => {
    const { manager, engine } = setup();

    const executing = engine.execute({
      id: 'editResult',
      action: 'overlay.open',
      params: { overlay: { type: 'modal', title: '用户详情' } },
    });
    await waitStack(manager);
    expect(manager.stack()[0]).toMatchObject({
      type: 'modal',
      title: '用户详情',
    });

    manager.close(manager.stack()[0]!.id, { success: true, userId: 1001 });
    const result = await executing;

    expect(result).toEqual({
      ok: true,
      data: { success: true, userId: 1001 },
    });
  });

  it('overlay.close 缺省关栈顶并原样 resolve payload', async () => {
    const { manager, engine } = setup();

    const executing = engine.execute({
      action: 'overlay.open',
      params: { overlay: { type: 'drawer' } },
    });
    await waitStack(manager);

    const closeResult = await engine.execute({
      action: 'overlay.close',
      params: { payload: { success: true } },
    });

    expect(closeResult.ok).toBe(true);
    expect(manager.stack()).toHaveLength(0);
    await expect(executing).resolves.toEqual({
      ok: true,
      data: { success: true },
    });
  });

  it('overlay.close 携带 id 关闭指定条目；payload 缺省为取消语义', async () => {
    const { manager, engine } = setup();

    const first = engine.execute({
      action: 'overlay.open',
      params: { overlay: { type: 'modal', title: 'A' } },
    });
    const second = engine.execute({
      action: 'overlay.open',
      params: { overlay: { type: 'modal', title: 'B' } },
    });
    await waitStack(manager, 2);
    const [a, b] = manager.stack();

    await engine.execute({
      action: 'overlay.close',
      params: { id: a!.id },
    });

    expect(manager.stack().map((e) => e.id)).toEqual([b!.id]);
    await expect(first).resolves.toEqual({
      ok: true,
      data: { success: false },
    });
    manager.close(b!.id, { success: true });
    await second;
  });

  it('overlay.open 缺少 overlay 参数返回受控失败', async () => {
    const { engine } = setup();

    const result = await engine.execute({ action: 'overlay.open' });

    expect(result.ok).toBe(false);
    expect(result.error?.message).toContain('overlay');
  });

  it('overlay 配置字段表达式已求值，content DslNode 子树保留原样', async () => {
    const { context, manager, engine } = setup();
    context.state.set({ title: '详情' });

    const executing = engine.execute({
      action: 'overlay.open',
      params: {
        overlay: {
          type: 'modal',
          title: '用户${state.title}',
          params: { id: 7 },
          content: {
            type: 'Button',
            props: { text: '${params.id}' },
          },
        },
      },
    });
    await waitStack(manager);

    expect(manager.stack()[0]).toMatchObject({
      title: '用户详情',
      params: { id: 7 },
      content: { type: 'Button', props: { text: '${params.id}' } },
    });
    manager.close();
    await executing;
  });

  it('overlay.open 记录父作用域浅快照（parentScopeOf 可读）', async () => {
    const { context, manager, engine } = setup();
    context.state.set({ user: '张三' });

    const executing = engine.execute({
      action: 'overlay.open',
      params: { overlay: { type: 'modal' } },
    });
    await waitStack(manager);

    const parent = manager.parentScopeOf(manager.stack()[0]!.id);
    expect((parent?.['state'] as Record<string, unknown>)['user']).toBe('张三');
    manager.close();
    await executing;
  });

  it('已注册的同名动作不被覆盖', async () => {
    const context = createRuntimeContext();
    const custom = vi.fn(() => ({ ok: true as const }));
    context.actions.register('message', custom);
    registerInteractionActions(
      context.actions,
      new OverlayManager(),
      createUiBridge(),
    );

    await new ActionEngine(context).execute({ action: 'message' });
    expect(custom).toHaveBeenCalledTimes(1);
  });
});

describe('命名结果 → if 分支（引擎级链路）', () => {
  async function runBranch(payload: unknown, context: RuntimeContext) {
    const manager = new OverlayManager();
    registerInteractionActions(context.actions, manager, createUiBridge());
    const engine = new ActionEngine(context);

    const executing = engine.executeAll([
      {
        id: 'editResult',
        action: 'overlay.open',
        params: { overlay: { type: 'modal' } },
      },
      {
        action: 'if',
        params: {
          condition: '${actions.editResult.success}',
          then: { action: 'setState', params: { branch: 'then' } },
          else: { action: 'setState', params: { branch: 'else' } },
        },
      },
    ]);
    await waitStack(manager);
    manager.close(manager.stack()[0]!.id, payload);
    await executing;
  }

  it('close payload 为 { success: true } 时 if 的 then 分支执行', async () => {
    const context = createRuntimeContext();
    registerBuiltinActions(context.actions);

    await runBranch({ success: true }, context);

    expect(context.state.get('branch')).toBe('then');
    expect(context.actionResults['editResult']).toEqual({ success: true });
  });

  it('取消关闭（{ success: false }）时 else 分支执行', async () => {
    const context = createRuntimeContext();
    registerBuiltinActions(context.actions);

    await runBranch(undefined, context);

    expect(context.state.get('branch')).toBe('else');
    expect(context.actionResults['editResult']).toEqual({ success: false });
  });
});

describe('confirm 动作', () => {
  function withFakeModal(onClick: 'ok' | 'cancel') {
    const { engine, ui } = setup();
    const confirm = vi.fn((config: { onOk?: () => void; onCancel?: () => void }) => {
      if (onClick === 'ok') {
        config.onOk?.();
      } else {
        config.onCancel?.();
      }
    });
    ui.modal = { confirm };
    return { engine, confirm };
  }

  it('点击确认返回 { ok: true, data: true }，title/content 透传', async () => {
    const { engine, confirm } = withFakeModal('ok');

    const result = await engine.execute({
      action: 'confirm',
      params: { title: '删除', content: '确认删除该记录？' },
    });

    expect(result).toEqual({ ok: true, data: true });
    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ title: '删除', content: '确认删除该记录？' }),
    );
  });

  it('点击取消返回 data 为 false', async () => {
    const { engine } = withFakeModal('cancel');

    const result = await engine.execute({ action: 'confirm' });

    expect(result).toEqual({ ok: true, data: false });
  });

  it('UiBridge 未注入 modal 时返回受控失败', async () => {
    const { engine } = setup();

    const result = await engine.execute({ action: 'confirm' });

    expect(result.ok).toBe(false);
    expect(result.error?.message).toContain('InteractionProvider');
  });
});

describe('message 动作', () => {
  it('以 params.type/text 调用对应 antd message 方法', async () => {
    const { engine, ui } = setup();
    const message = {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    };
    ui.message = message;

    const result = await engine.execute({
      action: 'message',
      params: { type: 'success', text: '保存成功' },
    });

    expect(result.ok).toBe(true);
    expect(message.success).toHaveBeenCalledWith('保存成功');
    expect(message.info).not.toHaveBeenCalled();
  });

  it('未知 type 退化为 info', async () => {
    const { engine, ui } = setup();
    const message = {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    };
    ui.message = message;

    await engine.execute({
      action: 'message',
      params: { type: 'toast', text: 'x' },
    });

    expect(message.info).toHaveBeenCalledWith('x');
  });

  it('未挂载 InteractionProvider（UiBridge 为空）返回 { ok: false } 受控失败', async () => {
    const { engine } = setup();

    const result = await engine.execute({
      action: 'message',
      params: { type: 'success', text: '保存成功' },
    });

    expect(result.ok).toBe(false);
    expect(result.error?.message).toContain('InteractionProvider');
  });
});
