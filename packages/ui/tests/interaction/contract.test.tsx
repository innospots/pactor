// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import {
  createRuntimeContext,
  DslRenderer,
  registerBuiltinActions,
} from 'pactor-runtime';
import { afterEach, describe, expect, it } from 'vitest';

import { createShadcnComponentRegistry } from '../../src/components/index.js';
import {
  createUiBridge,
  OverlayManager,
  registerInteractionActions,
  ShadcnInteractionProvider,
  ShadcnOverlayHost,
  type InteractionProviderProps,
  type OverlayHostProps,
} from '../../src/interaction/index.js';

afterEach(cleanup);

describe('交互契约：props 类型与核心均来自 pactor-ui 本地导出', () => {
  it('ShadcnOverlayHost / ShadcnInteractionProvider 满足 props 契约（编译期断言）', () => {
    const host: ComponentType<OverlayHostProps> = ShadcnOverlayHost;
    const provider: ComponentType<InteractionProviderProps> =
      ShadcnInteractionProvider;

    expect(host).toBe(ShadcnOverlayHost);
    expect(provider).toBe(ShadcnInteractionProvider);
  });

  it('content DSL 经 shadcn 组件注册表渲染（shadcn Button 事件触发 overlay.close）', async () => {
    const context = createRuntimeContext({
      components: createShadcnComponentRegistry(),
    });
    registerBuiltinActions(context.actions);
    const manager = new OverlayManager();
    registerInteractionActions(context.actions, manager, createUiBridge());
    render(
      <DslRenderer context={context}>
        <ShadcnOverlayHost manager={manager} />
      </DslRenderer>,
    );

    const opened = manager.open({
      type: 'modal',
      title: '操作确认',
      content: {
        type: 'Button',
        props: { text: '完成', variant: 'primary' },
        events: {
          onClick: {
            action: 'overlay.close',
            params: { payload: { success: true } },
          },
        },
      },
    });

    const button = await screen.findByRole('button', { name: '完成' });
    // variant: primary → shadcn default 变体（bg-primary）
    expect(button.className).toContain('bg-primary');
    fireEvent.click(button);

    await expect(opened).resolves.toEqual({ success: true });
    expect(manager.stack()).toHaveLength(0);
  });
});
