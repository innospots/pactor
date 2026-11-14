import type { ComponentType } from 'react';

import { describe, expect, it, vi } from 'vitest';

import {
  mergeModuleActions,
  mergeModuleComponents,
} from '../src/client/register-extensions.js';

const A: ComponentType<unknown> = () => null;
const B: ComponentType<unknown> = () => null;

describe('mergeModuleComponents', () => {
  it('注册原名与命名空间键', () => {
    const merged = mergeModuleComponents({ m1: { components: { Panel: A } } });
    expect(merged.Panel).toBe(A);
    expect(merged['m1/Panel']).toBe(A);
  });

  it('重名时先注册者占短名并告警，后续模块只保留命名空间键', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const merged = mergeModuleComponents({
      m1: { components: { Panel: A } },
      m2: { components: { Panel: B } },
    });
    expect(merged.Panel).toBe(A);
    expect(merged['m2/Panel']).toBe(B);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});

describe('mergeModuleActions', () => {
  it('合并动作并带命名空间键', () => {
    const act = () => ({ ok: true });
    const merged = mergeModuleActions({ m1: { actions: { refresh: act } } });
    expect(merged.refresh).toBe(act);
    expect(merged['m1/refresh']).toBe(act);
  });
});
