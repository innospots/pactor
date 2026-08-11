import { describe, expect, it } from 'vitest';

import {
  antdUiKit,
  createBuiltinComponentRegistry,
  createLayoutRegistry,
  InteractionProvider,
  OverlayHost,
} from '../src/index.js';

describe('pactor-ui-antd 聚合 re-export', () => {
  it('关键符号可从聚合包导入并使用', () => {
    const components = createBuiltinComponentRegistry();
    expect(components.has('Button')).toBe(true);

    const layouts = createLayoutRegistry();
    expect(layouts.has('admin')).toBe(true);

    expect(typeof InteractionProvider).toBe('function');
    expect(typeof OverlayHost).toBe('function');
  });
});

describe('antdUiKit 预设对象', () => {
  it('三个槽位齐全', () => {
    expect(antdUiKit.componentRegistry).toBe(createBuiltinComponentRegistry);
    expect(antdUiKit.layoutRegistry).toBe(createLayoutRegistry);
    expect(antdUiKit.interactionKit?.Provider).toBe(InteractionProvider);
    expect(antdUiKit.interactionKit?.OverlayHost).toBe(OverlayHost);
  });
});
