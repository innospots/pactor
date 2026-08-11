import type { Registry } from 'pactor-core';
import { createPermissionAdapter } from 'pactor-permission';
import type { PermissionStore } from 'pactor-permission';
import {
  ActionEngine,
  createRuntimeContext,
  registerBuiltinActions,
  type RuntimeContext,
} from 'pactor-runtime';

import {
  registerCapabilityAction,
  type CapabilityActionDeps,
  type ChatCapabilityRegistry,
  type ChatConfirm,
  type ChatPermissionChecker,
} from './capability-action.js';

/**
 * Chat 作用域与 RuntimeContext 组装（设计决策 D5，设计文档第 73 节）。
 *
 * DSL part 经 runtime Renderer 渲染：ComponentRegistry 用 Safe Registry，
 * 作用域在 runtime 全局作用域之上注入 `conversation` / `message` /
 * `params`（`user` 经 RuntimeContext 注入）——沿用表达式引擎约束，
 * 不暴露浏览器全局对象。
 */

/** DSL part 渲染的 chat 局部作用域 */
export interface ChatScope {
  conversation: { id?: string };
  message: { id: string };
  params?: Record<string, unknown>;
}

/** 组装 chat 局部作用域（作为 renderChildren 的 extraScope 传入） */
export function buildChatScope(scope: ChatScope): Record<string, unknown> {
  return {
    conversation: scope.conversation,
    message: scope.message,
    params: scope.params ?? {},
  };
}

export interface CreateChatRuntimeOptions {
  /** Safe Registry；缺省时使用空注册表（dsl part 全部渲染受控占位） */
  safeRegistry?: Registry<unknown>;
  /** capability 白名单；缺省时不注册 capability 动作 */
  capabilities?: ChatCapabilityRegistry;
  /** 权限检查器（与 permissionStore 二选一，permission 优先） */
  permission?: ChatPermissionChecker;
  /** pactor-permission 的 PermissionStore，用于构造权限检查器 */
  permissionStore?: PermissionStore;
  /** 高风险 capability 确认回调 */
  confirm?: ChatConfirm;
  /** 注入作用域 `user` */
  user?: Record<string, unknown>;
}

export interface ChatRuntime {
  context: RuntimeContext;
  engine: ActionEngine;
}

/**
 * 创建 Chat DSL 渲染运行时：
 *
 * - ComponentRegistry 为 Safe Registry（白名单之外的组件不可见）
 * - 注册 runtime 内置动作（setState 等）；注入 capabilities 时注册
 *   `capability` 动作（Safe Registry 只挡组件，动作侧由 capability
 *   白名单兜底——AI DSL 建议只配置 capability 动作）
 * - permissionStore 经 pactor-permission 构造 PermissionAdapter，
 *   供 Renderer 的 `permission` 字段与 capability 链共用
 */
export function createChatRuntime(
  options: CreateChatRuntimeOptions = {},
): ChatRuntime {
  const permission =
    options.permission ??
    (options.permissionStore
      ? createPermissionAdapter(options.permissionStore)
      : undefined);

  const context = createRuntimeContext({
    components: options.safeRegistry,
    user: options.user,
    permission,
  });
  registerBuiltinActions(context.actions);
  if (options.capabilities) {
    const deps: CapabilityActionDeps = {
      capabilities: options.capabilities,
      permission,
      confirm: options.confirm,
    };
    registerCapabilityAction(context.actions, deps);
  }
  return { context, engine: new ActionEngine(context) };
}
