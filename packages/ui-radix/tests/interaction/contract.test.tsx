// @vitest-environment jsdom
import './setup.js';

import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { createRadixComponentRegistry } from '../../src/components/index.js';
import {
  createUiBridge,
  OverlayManager,
  registerInteractionActions,
  type InteractionProviderProps,
  type OverlayHostProps,
} from 'pactor-ui-antd/interaction';
import {
  createRuntimeContext,
  DslRenderer,
  registerBuiltinActions,
} from 'pactor-runtime';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup } from '@testing-library/react';

import { RadixInteractionProvider, RadixOverlayHost } from '../../src/interaction/index.js';

afterEach(cleanup);

describe('契约一致性：props 类型复用 pactor-interaction 导出', () => {
  it('RadixOverlayHost / RadixInteractionProvider 满足 antd 版 props 契约（编译期断言）', () => {
    // 类型断言：props 类型与 antd 版契约互相兼容
    const host: ComponentType<OverlayHostProps> = RadixOverlayHost;
    const provider: ComponentType<InteractionProviderProps> =
      RadixInteractionProvider;

    expect(host).toBe(RadixOverlayHost);
    expect(provider).toBe(RadixInteractionProvider);
  });

  it('content DSL 经 Radix 组件注册表渲染（Radix Button 事件触发 overlay.close）', async () => {
    const context = createRuntimeContext({
      components: createRadixComponentRegistry(),
    });
    registerBuiltinActions(context.actions);
    const manager = new OverlayManager();
    registerInteractionActions(context.actions, manager, createUiBridge());
    render(
      <DslRenderer context={context}>
        <RadixOverlayHost manager={manager} />
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
    expect(document.querySelector('.pcr-btn-primary')).toBeTruthy();
    fireEvent.click(button);

    await expect(opened).resolves.toEqual({ success: true });
    expect(manager.stack()).toHaveLength(0);
  });
});
