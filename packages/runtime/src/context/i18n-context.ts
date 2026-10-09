import type { I18nContext } from '@pactor-app/core';
import { createI18nContext } from '@pactor-app/core';
import { createContext, useContext } from 'react';

/**
 * React Context 形式的 i18n 上下文：供布局外壳等非 Renderer 组件
 * 消费当前 locale 与翻译函数。
 */
const I18nReactContext = createContext<I18nContext | null>(null);

export const I18nContextProvider = I18nReactContext.Provider;

/**
 * 内置默认文案（无 Provider 或 Provider 未覆盖内置 key 时回退，
 * 保持向后兼容）；按 locale 分组，zh-CN 为缺省。
 */
const defaultMessages = {
  'zh-CN': {
    'pactor.layout.expandSidebar': '展开侧边栏',
    'pactor.layout.collapseSidebar': '收起侧边栏',
    'pactor.layout.openNavigation': '打开导航',
    'pactor.layout.closeTab': '关闭 {{title}}',
    'pactor.layout.breadcrumb': '面包屑',
    'pactor.table.loading': '加载中…',
    'pactor.table.empty': '暂无数据',
    'pactor.table.selectAll': '全选',
    'pactor.table.selectRow': '选择行',
    'pactor.table.expandRow': '展开行',
    'pactor.table.collapseRow': '收起行',
    'pactor.table.dragRow': '拖拽排序',
    'pactor.form.required': '必填',
    'pactor.select.clear': '清除',
    'pactor.select.search': '搜索选项',
    'pactor.input.clear': '清除',
    'pactor.numberInput.increase': '增加',
    'pactor.numberInput.decrease': '减少',
    'pactor.alertDialog.confirm': '确定',
    'pactor.alertDialog.cancel': '取消',
    'pactor.command.empty': '无匹配结果',
    'pactor.overlay.close': '关闭',
    'pactor.datePicker.placeholder': '选择日期',
    'pactor.datePicker.placeholderRange': '选择日期范围',
    'pactor.datePicker.today': '今天',
    'pactor.datePicker.thisWeek': '本周',
    'pactor.datePicker.thisMonth': '本月',
    'pactor.login.title': '登录',
    'pactor.login.username': '用户名',
    'pactor.login.usernamePlaceholder': '请输入用户名',
    'pactor.login.usernameRequired': '请输入用户名',
    'pactor.login.password': '密码',
    'pactor.login.passwordPlaceholder': '请输入密码',
    'pactor.login.passwordRequired': '请输入密码',
    'pactor.login.submit': '登 录',
    'pactor.cardList.total': '共 {{count}} 个',
  },
  'en-US': {
    'pactor.layout.expandSidebar': 'Expand sidebar',
    'pactor.layout.collapseSidebar': 'Collapse sidebar',
    'pactor.layout.openNavigation': 'Open navigation',
    'pactor.layout.closeTab': 'Close {{title}}',
    'pactor.layout.breadcrumb': 'Breadcrumb',
    'pactor.table.loading': 'Loading…',
    'pactor.table.empty': 'No data',
    'pactor.table.selectAll': 'Select all',
    'pactor.table.selectRow': 'Select row',
    'pactor.table.expandRow': 'Expand row',
    'pactor.table.collapseRow': 'Collapse row',
    'pactor.table.dragRow': 'Drag to reorder',
    'pactor.form.required': 'Required',
    'pactor.select.clear': 'Clear',
    'pactor.select.search': 'Search options',
    'pactor.input.clear': 'Clear',
    'pactor.numberInput.increase': 'Increase',
    'pactor.numberInput.decrease': 'Decrease',
    'pactor.alertDialog.confirm': 'Confirm',
    'pactor.alertDialog.cancel': 'Cancel',
    'pactor.command.empty': 'No results found',
    'pactor.overlay.close': 'Close',
    'pactor.datePicker.placeholder': 'Select date',
    'pactor.datePicker.placeholderRange': 'Select date range',
    'pactor.datePicker.today': 'Today',
    'pactor.datePicker.thisWeek': 'This Week',
    'pactor.datePicker.thisMonth': 'This Month',
    'pactor.login.title': 'Sign in',
    'pactor.login.username': 'Username',
    'pactor.login.usernamePlaceholder': 'Enter username',
    'pactor.login.usernameRequired': 'Please enter username',
    'pactor.login.password': 'Password',
    'pactor.login.passwordPlaceholder': 'Enter password',
    'pactor.login.passwordRequired': 'Please enter password',
    'pactor.login.submit': 'Sign in',
    'pactor.cardList.total': 'Total {{count}}',
  },
};

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
