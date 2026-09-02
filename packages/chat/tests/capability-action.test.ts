import { Registry } from '@pactor-app/core';
import { PermissionStore, createPermissionAdapter } from '@pactor-app/permission';
import {
  ActionEngine,
  createRuntimeContext,
  registerBuiltinActions,
} from '@pactor-app/runtime';
import { describe, expect, it, vi } from 'vitest';

import type { CapabilityHandler, ChatCapabilityRegistry } from '../src/index.js';
import { createChatRuntime, registerCapabilityAction } from '../src/index.js';

function createCapabilities(): ChatCapabilityRegistry {
  return new Registry<CapabilityHandler>('CapabilityRegistry');
}

describe('registerCapabilityAction（spec: chat-safe-registry / capability 动作）', () => {
  it('正常执行：execute 以 params 调用，返回值作为动作 data（spec: 正常执行）', async () => {
    const capabilities = createCapabilities();
    const execute = vi.fn((params: Record<string, unknown>) => ({ applied: params['id'] }));
    capabilities.register('strategy.applySuggestion', { execute });

    const context = createRuntimeContext({});
    registerBuiltinActions(context.actions);
    registerCapabilityAction(context.actions, { capabilities });
    const engine = new ActionEngine(context);

    const result = await engine.execute({
      action: 'capability',
      params: { name: 'strategy.applySuggestion', params: { id: 7 } },
    });
    expect(result).toEqual({ ok: true, data: { applied: 7 } });
    expect(execute).toHaveBeenCalledWith({ id: 7 }, expect.anything());
  });

  it('未注册 capability 受控失败', async () => {
    const context = createRuntimeContext({});
    registerCapabilityAction(context.actions, { capabilities: createCapabilities() });
    const engine = new ActionEngine(context);
    const result = await engine.execute({
      action: 'capability',
      params: { name: 'ghost' },
    });
    expect(result.ok).toBe(false);
    expect(result.error?.message).toContain('ghost');
  });

  it('权限拒绝：execute 不被调用，返回 { ok: false }（spec: 权限拒绝）', async () => {
    const capabilities = createCapabilities();
    const execute = vi.fn();
    capabilities.register('admin.reset', { permission: 'admin:reset', execute });

    const store = new PermissionStore();
    const permission = createPermissionAdapter(store);

    const context = createRuntimeContext({});
    registerCapabilityAction(context.actions, { capabilities, permission });
    const engine = new ActionEngine(context);

    const result = await engine.execute({
      action: 'capability',
      params: { name: 'admin.reset' },
    });
    expect(result.ok).toBe(false);
    expect(execute).not.toHaveBeenCalled();

    // 授权后放行
    store.setPermissions(['admin:reset']);
    const allowed = await engine.execute({
      action: 'capability',
      params: { name: 'admin.reset' },
    });
    expect(allowed.ok).toBe(true);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('高风险确认：取消返回 skipped 且不执行；确认则执行（spec: 高风险确认）', async () => {
    const capabilities = createCapabilities();
    const execute = vi.fn(() => 'done');
    capabilities.register('data.delete', { risk: 'high', execute });

    const context = createRuntimeContext({});
    const confirm = vi.fn(async () => false);
    registerCapabilityAction(context.actions, { capabilities, confirm });
    const engine = new ActionEngine(context);

    const cancelled = await engine.execute({
      action: 'capability',
      params: { name: 'data.delete', params: { id: 1 } },
    });
    expect(cancelled).toEqual({ ok: true, skipped: true });
    expect(execute).not.toHaveBeenCalled();
    expect(confirm).toHaveBeenCalledWith({ name: 'data.delete', params: { id: 1 } });

    confirm.mockResolvedValue(true);
    const confirmed = await engine.execute({
      action: 'capability',
      params: { name: 'data.delete', params: { id: 1 } },
    });
    expect(confirmed).toEqual({ ok: true, data: 'done' });
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('高风险但未注入 confirm：受控拒绝（design Risks 约定）', async () => {
    const capabilities = createCapabilities();
    const execute = vi.fn();
    capabilities.register('data.delete', { risk: 'high', execute });

    const context = createRuntimeContext({});
    registerCapabilityAction(context.actions, { capabilities });
    const engine = new ActionEngine(context);

    const result = await engine.execute({
      action: 'capability',
      params: { name: 'data.delete' },
    });
    expect(result.ok).toBe(false);
    expect(execute).not.toHaveBeenCalled();
  });

  it('capability 抛错经引擎收敛为受控失败', async () => {
    const capabilities = createCapabilities();
    capabilities.register('boom', {
      execute: () => {
        throw new Error('炸了');
      },
    });
    const context = createRuntimeContext({});
    registerCapabilityAction(context.actions, { capabilities });
    const engine = new ActionEngine(context);
    const result = await engine.execute({ action: 'capability', params: { name: 'boom' } });
    expect(result.ok).toBe(false);
    expect(result.error?.message).toBe('炸了');
  });
});

describe('createChatRuntime（runtime 引擎集成）', () => {
  it('注册内置动作与 capability 动作；permissionStore 构造权限检查器', async () => {
    const capabilities = createCapabilities();
    const execute = vi.fn(() => 'ok');
    capabilities.register('secure.op', { permission: 'secure:op', execute });

    const store = new PermissionStore();
    store.setPermissions(['secure:op']);
    const { context, engine } = createChatRuntime({
      capabilities,
      permissionStore: store,
    });

    expect(context.actions.has('setState')).toBe(true);
    expect(context.actions.has('capability')).toBe(true);

    const result = await engine.execute({
      action: 'capability',
      params: { name: 'secure.op' },
    });
    expect(result).toEqual({ ok: true, data: 'ok' });
  });

  it('未注入 capabilities 时不注册 capability 动作（DSL 侧受控失败）', async () => {
    const { engine } = createChatRuntime({});
    const result = await engine.execute({
      action: 'capability',
      params: { name: 'x' },
    });
    expect(result.ok).toBe(false);
  });
});
