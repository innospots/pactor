// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import {
  applyGlobalSize,
  applyGlobalSizeValues,
  globalSizeStorageKey,
  persistGlobalSize,
  readGlobalSize,
  readGlobalSizeValues,
  readStoredGlobalSize,
} from '../src/lib/global-size.js';

afterEach(() => {
  document.documentElement.removeAttribute('data-pactor-size');
  applyGlobalSizeValues(null);
  window.localStorage.removeItem(globalSizeStorageKey);
});

describe('global-size', () => {
  it('未设置属性 / 非法值时 readGlobalSize 回退 default', () => {
    expect(readGlobalSize()).toBe('default');
    document.documentElement.setAttribute('data-pactor-size', 'huge');
    expect(readGlobalSize()).toBe('default');
  });

  it('applyGlobalSize：compact/comfortable 写属性，default 移除属性', () => {
    applyGlobalSize('compact');
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
    applyGlobalSize('comfortable');
    expect(readGlobalSize()).toBe('comfortable');
    applyGlobalSize('default');
    expect(document.documentElement.hasAttribute('data-pactor-size')).toBe(false);
  });

  it('持久化往返；非法存储值回退 null', () => {
    expect(readStoredGlobalSize()).toBeNull();
    persistGlobalSize('compact');
    expect(readStoredGlobalSize()).toBe('compact');
    window.localStorage.setItem(globalSizeStorageKey, 'huge');
    expect(readStoredGlobalSize()).toBeNull();
  });

  it('自定义数值：写内联变量、参数即完整覆盖集、null 清除全部', () => {
    const style = document.documentElement.style;

    applyGlobalSizeValues({ heightMd: '40px', textMd: '15px' });
    expect(style.getPropertyValue('--pactor-control-height-md')).toBe('40px');
    expect(style.getPropertyValue('--pactor-control-text-md')).toBe('15px');
    expect(readGlobalSizeValues()).toEqual({ heightMd: '40px', textMd: '15px' });

    // 第二次调用未给出的键移除既有覆盖（不与上一次合并）
    applyGlobalSizeValues({ heightLg: '48px' });
    expect(style.getPropertyValue('--pactor-control-height-md')).toBe('');
    expect(style.getPropertyValue('--pactor-control-height-lg')).toBe('48px');

    applyGlobalSizeValues(null);
    expect(readGlobalSizeValues()).toEqual({});
  });

  it('内联自定义值优先于档位预设（inline style 高于样式表选择器）', () => {
    // jsdom 不计算样式表级联，此处断言实现机制：内联变量与属性可共存，
    // 浏览器中 inline style 优先级天然高于 [data-pactor-size] 块
    applyGlobalSize('compact');
    applyGlobalSizeValues({ heightMd: '40px' });
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
    expect(document.documentElement.style.getPropertyValue('--pactor-control-height-md')).toBe('40px');
  });
});
