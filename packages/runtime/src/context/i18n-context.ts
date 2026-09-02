import type { I18nContext } from '@pactor/core';
import { createI18nContext } from '@pactor/core';
import { createContext, useContext } from 'react';

/**
 * React Context 形式的 i18n 上下文：供布局外壳等非 Renderer 组件
 * 消费当前 locale 与翻译函数。
 */
const I18nReactContext = createContext<I18nContext | null>(null);

export const I18nContextProvider = I18nReactContext.Provider;

/** 缺省中文文案（无 Provider 时回退，保持向后兼容） */
const defaultI18n = createI18nContext({
  messages: {
    'pactor.layout.expandSidebar': '展开侧边栏',
    'pactor.layout.collapseSidebar': '收起侧边栏',
    'pactor.layout.closeTab': '关闭 {{title}}',
    'pactor.layout.breadcrumb': '面包屑',
    'pactor.table.loading': '加载中…',
    'pactor.table.empty': '暂无数据',
    'pactor.form.required': '必填',
    'pactor.select.clear': '清除',
  },
});

/** 在 React 组件内获取 i18n 上下文；未包裹 I18nContextProvider 时返回缺省上下文 */
export function useI18n(): I18nContext {
  const value = useContext(I18nReactContext);
  if (value === null) {
    return defaultI18n;
  }
  // Provider 的 messages（options / bootstrap 下发）通常不含内置 pactor.* 文案：
  // key 未命中（t 原样返回 key）时先回退内置默认文案，再回退 key 本身
  return {
    ...value,
    t: (key, params) => {
      const translated = value.t(key, params);
      return translated === key ? defaultI18n.t(key, params) : translated;
    },
  };
}
