// @vitest-environment jsdom
import { it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { createElement, act } from 'react';
import { createRuntimeContext, DslRenderer, registerBuiltinActions } from '@pactor-app/runtime';
import { createComponentRegistry } from '@pactor-app/ui/components';

it('renders Form/Table skeleton', async () => {
  const node: any = { type: 'Page', children: [
    { type: 'Card', children: [ { type: 'Form', props: { name: 'filter', layout: 'inline' } } ] },
    { type: 'Card', children: [ { type: 'Table', props: { dataSource: [] } } ] },
    { type: 'Pagination' },
  ]};
  const ctx = createRuntimeContext({ components: createComponentRegistry() });
  registerBuiltinActions(ctx.actions);
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  await act(async () => { root.render(createElement(DslRenderer, { context: ctx, node })); });
  expect(el.textContent).not.toContain('Unsupported');
});
