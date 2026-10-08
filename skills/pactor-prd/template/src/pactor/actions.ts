/**
 * 页面级自定义动作注册表，经 SitemapApp 的 `actions` prop 全局注册。
 * 模板默认为空；需要 DSL 表达式做不到的能力（数组操作 / 定时器 / 剪贴板等）
 * 时在此注册自定义动作，handler 可经 ctx.context.state 直接读写页面
 * StateStore，写入即触发 DSL 树重渲染（与内置 setState 动作同一通道）。
 *
 * ActionHandler 类型见 @pactor-app/runtime。
 */

import type { ActionHandler } from "@pactor-app/runtime";

export const pactorActions: Record<string, ActionHandler> = {};
