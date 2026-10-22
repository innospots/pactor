import type { I18nContext } from '@pactor-app/core';
import { createI18nContext } from '@pactor-app/core';
import { createContext, useContext } from 'react';

import { defaultMessages } from './locales/index.js';

/**
 * React Context 形式的 i18n 上下文：供布局外壳等非 Renderer 组件
 * 消费当前 locale 与翻译函数。
 */
const I18nReactContext = createContext<I18nContext | null>(null);

export const I18nContextProvider = I18nReactContext.Provider;

/** 按 locale 创建内置默认 i18n 上下文（缺省 zh-CN） */
function createDefaultI18n(locale?: string): I18nContext {
  return createI18nContext({ locale, messages: defaultMessages });
}

const defaultI18n = createDefaultI18n();

/** 在 React 组件内获取 i18n 上下文；未包裹 I18nContextProvider 时返回缺省上下文 */
export function useI18n(): I18nContext {
  const value = useContext(I18nReactContext);
  if (value === null) {
    return defaultI18n;
  }
  // Provider 的 messages（options / bootstrap 下发）通常不含内置 pactor.* 文案：
  // key 未命中（t 原样返回 key）时先回退内置默认文案（随 Provider locale
  // 选择语言），再回退 key 本身
  const fallback = createDefaultI18n(value.locale);
  return {
    ...value,
    t: (key, params) => {
      const translated = value.t(key, params);
      return translated === key ? fallback.t(key, params) : translated;
    },
  };
}
