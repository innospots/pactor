import { createRuntimeContext, ActionEngine } from '@pactor-app/runtime';
import { describe, expect, it, vi } from 'vitest';

import { createPactorAssembly } from '../src/assembly.js';

/** 组装内核（spec: application-bootstrap / embedded-page-view） */
describe('createPactorAssembly 组装内核', () => {
  it('navigate 动作委托给调用形态注入的实现', async () => {
    const navigate = vi.fn();
    const assembly = createPactorAssembly({ navigate });
    const context = createRuntimeContext({ actions: assembly.actions });
    const engine = new ActionEngine(context);

    const result = await engine.execute({
      action: 'navigate',
      params: { to: '/customers' },
    });

    expect(result.ok).toBe(true);
    expect(navigate).toHaveBeenCalledWith('/customers');
  });

  it('navigate 缺少 to 参数时受控失败', async () => {
    const assembly = createPactorAssembly({ navigate: vi.fn() });
    const context = createRuntimeContext({ actions: assembly.actions });
    const engine = new ActionEngine(context);

    const result = await engine.execute({ action: 'navigate', params: {} });

    expect(result.ok).toBe(false);
    expect(result.error?.message).toContain('params.to');
  });

  it('options 扩展覆盖/叠加到共享 registries', () => {
    const custom = () => null;
    const assembly = createPactorAssembly({
      navigate: vi.fn(),
      components: { BizCard: custom },
      actions: { 'biz.act': () => ({ ok: true }) },
      services: { 'biz.svc': async () => ({}) },
    });

    expect(assembly.components.get('BizCard')).toBe(custom);
    expect(assembly.actions.has('biz.act')).toBe(true);
    expect(assembly.services.has('biz.svc')).toBe(true);
    // 内置组件与交互动作仍在
    expect(assembly.components.has('Button')).toBe(true);
    expect(assembly.actions.has('confirm')).toBe(true);
  });
});
