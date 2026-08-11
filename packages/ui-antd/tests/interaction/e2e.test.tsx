// @vitest-environment jsdom
import './setup.js';

import type { PageDsl } from 'pactor-core';
import { createBuiltinComponentRegistry } from '../../src/components/index.js';
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createUiBridge,
  InteractionProvider,
  OverlayHost,
  OverlayManager,
  registerInteractionActions,
} from '../../src/interaction/index.js';

afterEach(cleanup);

/**
 * 端到端：PageRuntime + 内置组件 + 交互动作。
 * 链路：DSL 按钮点击 → overlay.open（命名 id）→ OverlayHost 渲染 antd
 * Modal → 弹层内按钮 overlay.close 携带 { success: true } →
 * if 动作读取 ${actions.editResult.success} 执行 then 分支 →
 * state.saved 更新并驱动页面 Alert 渲染。
 */
function createHost() {
  const pageDsl: PageDsl = {
    dsl: '1.0',
    page: { id: 'user-list', title: '用户列表' },
    body: {
      type: 'Page',
      props: { title: '用户列表' },
      children: [
        {
          type: 'Button',
          props: { text: '编辑用户', variant: 'primary' },
          events: {
            onClick: [
              {
                id: 'editResult',
                action: 'overlay.open',
                params: {
                  overlay: {
                    type: 'modal',
                    title: '用户详情',
                    params: { id: 1001 },
                    content: {
                      type: 'Button',
                      props: { text: '确认保存', variant: 'primary' },
                      events: {
                        onClick: {
                          action: 'overlay.close',
                          params: { payload: { success: true, id: '${params.id}' } },
                        },
                      },
                    },
                  },
                },
              },
              {
                action: 'if',
                params: {
                  condition: '${actions.editResult.success}',
                  then: { action: 'setState', params: { saved: true } },
                  else: {
                    action: 'message',
                    params: { type: 'info', text: '已取消编辑' },
                  },
                },
              },
            ],
          },
        },
        {
          type: 'Alert',
          when: '${state.saved}',
          props: { variant: 'success', message: '已保存用户 ${actions.editResult.id}' },
        },
      ],
    },
  };

  const manager = new OverlayManager();
  const ui = createUiBridge();
  const runtime = createPageRuntime(pageDsl, {
    components: createBuiltinComponentRegistry(),
  });
  registerInteractionActions(runtime.context.actions, manager, ui);

  render(
    <InteractionProvider bridge={ui}>
      <PageRuntimeView runtime={runtime}>
        <OverlayHost manager={manager} />
      </PageRuntimeView>
    </InteractionProvider>,
  );
  return { manager, runtime };
}

describe('PageRuntime + 内置组件 + 交互动作端到端', () => {
  it('DSL 按钮 → overlay.open → Modal 渲染 → close 携带 { success: true } → if then 分支', async () => {
    const { manager, runtime } = createHost();
    await runtime.initialized;

    // DSL 按钮触发 overlay.open（命名 editResult）
    fireEvent.click(screen.getByRole('button', { name: '编辑用户' }));

    // OverlayHost 渲染 antd Modal + DSL content（params.id 注入作用域）
    await screen.findByText('用户详情');
    expect(manager.stack()).toHaveLength(1);
    const confirmButton = await screen.findByRole('button', {
      name: '确认保存',
    });

    // 弹层内按钮 overlay.close 携带 payload
    fireEvent.click(confirmButton);

    // open Promise resolve payload → actions.editResult 记录 → if then 分支
    await vi.waitFor(() => {
      expect(runtime.context.state.get('saved')).toBe(true);
    });
    expect(runtime.context.actionResults['editResult']).toEqual({
      success: true,
      id: 1001,
    });
    expect(manager.stack()).toHaveLength(0);
    // state 驱动页面 Alert 重渲染（${actions.editResult.id} 在渲染作用域可见）
    await screen.findByText('已保存用户 1001');

    await runtime.destroy();
  });

  it('UI 取消（Modal X）→ 取消语义 → if else 分支执行 message 动作', async () => {
    const { manager, runtime } = createHost();
    await runtime.initialized;

    fireEvent.click(screen.getByRole('button', { name: '编辑用户' }));
    await screen.findByText('用户详情');

    // 点击 X：取消语义 resolve { success: false }
    fireEvent.click(document.querySelector('.ant-modal-close')!);

    await vi.waitFor(() => {
      expect(runtime.context.actionResults['editResult']).toEqual({
        success: false,
      });
    });
    expect(runtime.context.state.get('saved')).toBeUndefined();
    expect(manager.stack()).toHaveLength(0);
    // else 分支：message 动作经 InteractionProvider 注入的 antd message 展示
    await screen.findByText('已取消编辑');

    await runtime.destroy();
  });
});
