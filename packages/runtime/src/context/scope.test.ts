import { describe, expect, it } from 'vitest';

import { createRuntimeContext } from './context.js';
import { buildScope } from './scope.js';

describe('buildScope', () => {
  it('form 作用域为 state.form 的别名（Form 提交后 ${form.x} 可用）', () => {
    const context = createRuntimeContext();

    expect(buildScope(context)['form']).toBeUndefined();

    context.state.set('form', { keyword: '手机' });
    const scope = buildScope(context);
    expect((scope['form'] as Record<string, unknown>)['keyword']).toBe('手机');
    // 与 state.form 指向同一快照
    expect(scope['form']).toBe(
      (scope['state'] as Record<string, unknown>)['form'],
    );
  });

  it('actions 键为 context.actionResults 的同一引用（后写入立即可见）', () => {
    const context = createRuntimeContext();

    const scope = buildScope(context);
    expect(scope['actions']).toBe(context.actionResults);

    context.actionResults['editResult'] = { success: true };
    expect(
      (buildScope(context)['actions'] as Record<string, unknown>)[
        'editResult'
      ],
    ).toEqual({ success: true });
  });
});
