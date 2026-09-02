// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { createI18nContext } from '@pactor-app/core';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

import { I18nContextProvider, useI18n } from './i18n-context.js';

function wrapper(messages: Record<string, string>) {
  const i18n = createI18nContext({ messages });
  return ({ children }: { children?: ReactNode }) =>
    createElement(I18nContextProvider, { value: i18n }, children);
}

describe('useI18n', () => {
  it('无 Provider 时回退内置默认文案', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.t('pactor.table.empty')).toBe('暂无数据');
    expect(result.current.locale).toBe('zh-CN');
  });

  it('Provider 覆盖内置文案时以 Provider 为准', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: wrapper({ 'pactor.table.empty': 'No data available' }),
    });
    expect(result.current.t('pactor.table.empty')).toBe('No data available');
  });

  it('Provider messages 不含内置 key 时回退默认文案而非 key 本身', () => {
    // 应用层 messages 只含业务 key（如 menu.*）时，布局/组件的 pactor.*
    // 内置文案不应裸显 key（回归：aria-label 出现 "pactor.layout.collapseSidebar"）
    const { result } = renderHook(() => useI18n(), {
      wrapper: wrapper({ 'menu.home': '首页' }),
    });
    expect(result.current.t('pactor.layout.collapseSidebar')).toBe('收起侧边栏');
    expect(result.current.t('menu.home')).toBe('首页');
    expect(result.current.t('missing.key')).toBe('missing.key');
  });

  it('回退支持参数插值', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: wrapper({}),
    });
    expect(result.current.t('pactor.layout.closeTab', { title: '工作台' })).toBe(
      '关闭 工作台',
    );
  });
});
