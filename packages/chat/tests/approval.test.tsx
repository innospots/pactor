// @vitest-environment jsdom
/**
 * 高风险审批队列 POC：控制器决议 / 授权范围 / ChatConfirm 适配 /
 * capability 执行链集成 / UI 键盘与播报。
 */
import './setup.js';

import { Registry } from '@pactor-app/core';
import {
  ActionEngine,
  createRuntimeContext,
  registerBuiltinActions,
} from '@pactor-app/runtime';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ApprovalQueue,
  createApprovalConfirm,
  createApprovalQueue,
  registerCapabilityAction,
  type ApprovalDecisionEvent,
  type CapabilityHandler,
  type ChatCapabilityRegistry,
} from '../src/index.js';

afterEach(cleanup);

describe('ApprovalQueueController', () => {
  it('批准「仅本次」：resolve true，不写 session 授权', async () => {
    const queue = createApprovalQueue();
    const pending = queue.enqueue({ name: 'shell.run', params: { cmd: 'ls' } });

    expect(queue.getSnapshot()).toHaveLength(1);
    queue.decide(queue.getSnapshot()[0]!.id, 'approved', 'once');

    await expect(pending).resolves.toBe(true);
    expect(queue.hasGrant('shell.run')).toBe(false);
    expect(queue.getSnapshot()).toHaveLength(0);
  });

  it('批准「本会话」：写入授权，后续同 capability 直接放行', async () => {
    const queue = createApprovalQueue();
    const pending = queue.enqueue({ name: 'shell.run', params: {} });
    queue.decide(queue.getSnapshot()[0]!.id, 'approved', 'session');

    await expect(pending).resolves.toBe(true);
    expect(queue.hasGrant('shell.run')).toBe(true);

    const confirm = createApprovalConfirm({ queue });
    await expect(confirm({ name: 'shell.run', params: {} })).resolves.toBe(true);
    expect(queue.getSnapshot()).toHaveLength(0);

    // clearGrants 后重新入队
    queue.clearGrants();
    const again = confirm({ name: 'shell.run', params: {} });
    expect(queue.getSnapshot()).toHaveLength(1);
    queue.decide(queue.getSnapshot()[0]!.id, 'denied', 'once');
    await expect(again).resolves.toBe(false);
  });

  it('拒绝：resolve false，并派发审计事件', async () => {
    const events: ApprovalDecisionEvent[] = [];
    const queue = createApprovalQueue({ onDecision: (event) => events.push(event) });
    const pending = queue.enqueue({ name: 'data.delete', params: { id: 1 } });
    const [entry] = queue.getSnapshot();

    queue.decide(entry!.id, 'denied', 'once');

    await expect(pending).resolves.toBe(false);
    expect(events).toEqual([
      { request: entry, decision: 'denied', scope: 'once' },
    ]);
  });

  it('always：仅宿主提供 persistGrant 时可用，并回调持久化', async () => {
    const persistGrant = vi.fn();
    const queue = createApprovalQueue({ persistGrant });
    expect(queue.canPersistAlways).toBe(true);

    const pending = queue.enqueue({ name: 'email.send', params: {} });
    queue.decide(queue.getSnapshot()[0]!.id, 'approved', 'always');

    await expect(pending).resolves.toBe(true);
    expect(persistGrant).toHaveBeenCalledWith('email.send', 'always');
    expect(queue.hasGrant('email.send')).toBe(true);
  });

  it('ChatConfirm 适配 + capability 执行链：批准后执行，session 内不再询问', async () => {
    const capabilities: ChatCapabilityRegistry = new Registry<CapabilityHandler>(
      'CapabilityRegistry',
    );
    const execute = vi.fn(() => 'done');
    capabilities.register('data.delete', { risk: 'high', execute });

    const queue = createApprovalQueue();
    const confirm = createApprovalConfirm({ queue });
    const context = createRuntimeContext({});
    registerBuiltinActions(context.actions);
    registerCapabilityAction(context.actions, { capabilities, confirm });
    const engine = new ActionEngine(context);

    const running = engine.execute({
      action: 'capability',
      params: { name: 'data.delete', params: { id: 7 } },
    });

    await waitFor(() => expect(queue.getSnapshot()).toHaveLength(1));
    queue.decide(queue.getSnapshot()[0]!.id, 'approved', 'session');
    await expect(running).resolves.toEqual({ ok: true, data: 'done' });
    expect(execute).toHaveBeenCalledWith({ id: 7 }, expect.anything());

    // session 授权命中：第二次直接执行
    await expect(
      engine.execute({
        action: 'capability',
        params: { name: 'data.delete', params: { id: 8 } },
      }),
    ).resolves.toEqual({ ok: true, data: 'done' });
    expect(queue.getSnapshot()).toHaveLength(0);
    expect(execute).toHaveBeenCalledTimes(2);
  });

  it('拒绝后 capability 返回 skipped 且不执行', async () => {
    const capabilities: ChatCapabilityRegistry = new Registry<CapabilityHandler>(
      'CapabilityRegistry',
    );
    const execute = vi.fn();
    capabilities.register('data.delete', { risk: 'high', execute });

    const queue = createApprovalQueue();
    const context = createRuntimeContext({});
    registerBuiltinActions(context.actions);
    registerCapabilityAction(context.actions, {
      capabilities,
      confirm: createApprovalConfirm({ queue }),
    });
    const engine = new ActionEngine(context);

    const running = engine.execute({
      action: 'capability',
      params: { name: 'data.delete' },
    });
    await waitFor(() => expect(queue.getSnapshot()).toHaveLength(1));
    queue.decide(queue.getSnapshot()[0]!.id, 'denied', 'once');

    await expect(running).resolves.toEqual({ ok: true, skipped: true });
    expect(execute).not.toHaveBeenCalled();
  });
});

describe('ApprovalQueue UI', () => {
  it('空队列不占位；入队后展示名称、参数与授权范围', async () => {
    const queue = createApprovalQueue();
    const { container } = render(<ApprovalQueue queue={queue} />);
    expect(container.firstChild).toBeNull();

    let pending: Promise<boolean> | undefined;
    act(() => {
      pending = queue.enqueue({
        name: 'deploy.production',
        params: { service: 'api', version: '1.2.3' },
      });
    });

    screen.getByText('deploy.production');
    screen.getByText(/"service": "api"/);
    expect(
      screen.getByRole('radio', { name: '仅本次' }).getAttribute('aria-checked'),
    ).toBe('true');
    // 未提供 persistGrant：不展示「始终允许」
    expect(screen.queryByRole('radio', { name: '始终允许' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '批准' }));
    await expect(pending).resolves.toBe(true);
    // 审批卡片消失，仅保留 sr-only 播报区
    expect(screen.queryByRole('button', { name: '批准' })).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('已批准 deploy.production');
  });

  it('选择「本会话」后批准：写入授权；提供 persistGrant 时展示「始终允许」', async () => {
    const persistGrant = vi.fn();
    const queue = createApprovalQueue({ persistGrant });
    render(<ApprovalQueue queue={queue} />);

    let pending: Promise<boolean> | undefined;
    act(() => {
      pending = queue.enqueue({ name: 'email.send', params: { to: 'a@b.c' } });
    });

    const session = screen.getByRole('radio', { name: '本会话' });
    fireEvent.click(session);
    expect(session.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: '始终允许' })).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '批准' }));
    await expect(pending).resolves.toBe(true);
    expect(queue.hasGrant('email.send')).toBe(true);
  });

  it('拒绝：队列清空并播报', async () => {
    const queue = createApprovalQueue();
    render(<ApprovalQueue queue={queue} />);

    let pending: Promise<boolean> | undefined;
    act(() => {
      pending = queue.enqueue({ name: 'file.delete', params: {} });
    });
    fireEvent.click(screen.getByRole('button', { name: '拒绝' }));

    await expect(pending).resolves.toBe(false);
    expect(screen.getByRole('status').textContent).toBe('已拒绝 file.delete');
  });
});
