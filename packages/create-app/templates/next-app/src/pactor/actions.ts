/**
 * 页面级自定义动作注册表，经 SitemapApp 的 `actions` prop 全局注册。
 * DSL 表达式做不到的能力（数组操作 / 定时器 / 剪贴板等）在此注册，
 * handler 可经 ctx.context.state 直接读写页面 StateStore，写入即触发
 * DSL 树重渲染（与内置 setState 动作同一通道）。
 *
 * ActionHandler 类型见 @pactor-app/runtime。
 */

import type { ActionHandler } from "@pactor-app/runtime";

import { setLocale } from "./i18n/locale";

/**
 * 语言切换（布局 Header 的 onLocaleChange / 任意页面 DSL 可调用）：
 * 写 localStorage(pactor.locale)、同步 <html lang> 并通知宿主更新
 * SitemapApp 的 locale prop（src/pactor/i18n/locale.ts）。params.locale
 * 已由动作引擎按当前作用域求值；非法语言代码回退默认语言。
 */
const setLocaleAction: ActionHandler = (action) => {
  const params = (action.params ?? {}) as { locale?: unknown };
  if (typeof params.locale === "string") {
    setLocale(params.locale);
  }
  return { ok: true };
};

export const pactorActions: Record<string, ActionHandler> = {
  "app.setLocale": setLocaleAction,
};
