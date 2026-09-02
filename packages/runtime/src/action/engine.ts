import { Registry, type ActionConfig } from '@pactor/core';
import {
  resolveTemplate,
  type ExpressionScope,
} from '@pactor/expression';

import type { RuntimeContext } from '../context/context.js';
import { buildScope } from '../context/scope.js';
import { resolveDeep, toError } from '../utils/resolve.js';

/** 动作执行结果：全程受控，不向 UI 层抛未捕获异常 */
export interface ActionResult {
  ok: boolean;
  data?: unknown;
  error?: Error;
  /** condition 求值为 false 时跳过执行 */
  skipped?: boolean;
}

/** handler 可见的执行上下文 */
export interface ActionContext {
  /** 完整 RuntimeContext（state / data / services / http 等） */
  context: RuntimeContext;
  /** 本次执行的求值作用域（含事件等局部作用域） */
  scope: ExpressionScope;
  /** 以当前局部作用域执行子动作（编排动作用） */
  execute(action: ActionConfig): Promise<ActionResult>;
}

export type ActionHandler = (
  action: ActionConfig,
  ctx: ActionContext,
) => ActionResult | Promise<ActionResult>;

/** Action Registry：动作名 → handler（设计文档第 17 节） */
export type ActionRegistry = Registry<ActionHandler>;

/**
 * Action 引擎（设计文档第 17 节，决策 D4）。
 *
 * 执行管线：求值 `condition`（false 则跳过，返回 `{ ok: true, skipped: true }`）
 * → 检查 `permission`（拒绝返回 `{ ok: false }`）→ 查 ActionRegistry 执行。
 * 未注册动作返回受控失败；任何异常收敛为 `{ ok: false, error }`。
 *
 * 命名动作结果（设计文档第 48 节，决策 D2）：动作声明 `id` 时，
 * 执行完成（含 skipped / 失败）后把结果写入 context 级 `actionResults`
 * ——成功时为 `result.data`，失败时为 `{ ok: false, error }`；
 * 经 buildScope 的 `actions` 键供后续动作引用（`${actions.<id>}`）。
 * 未命名动作行为不变。
 */
export class ActionEngine {
  constructor(private readonly context: RuntimeContext) {}

  async execute(
    action: ActionConfig,
    localScope?: ExpressionScope,
  ): Promise<ActionResult> {
    const scope = buildScope(this.context, localScope);
    let result: ActionResult;
    try {
      if (action.condition !== undefined) {
        const expression =
          typeof action.condition === 'string'
            ? action.condition
            : action.condition.expression;
        if (!resolveTemplate(expression, scope)) {
          result = { ok: true, skipped: true };
          this.recordNamedResult(action, result);
          return result;
        }
      }

      if (
        action.permission !== undefined &&
        !this.context.permission.check(action.permission)
      ) {
        result = {
          ok: false,
          error: new Error(
            `[@pactor/runtime] permission denied for action "${action.action}"`,
          ),
        };
        this.recordNamedResult(action, result);
        return result;
      }

      const handler = this.context.actions.get(action.action);
      if (!handler) {
        result = {
          ok: false,
          error: new Error(
            `[@pactor/runtime] action not registered: "${action.action}"`,
          ),
        };
        this.recordNamedResult(action, result);
        return result;
      }

      const resolvedAction: ActionConfig = {
        ...action,
        // 内嵌的子动作配置（sequence/parallel/if 的 actions/then/else）
        // 与内嵌的 DslNode 子树（overlay.open 的 content 等，约定同
        // Renderer 的 resolveProps）保持原样，由各自执行/渲染时
        // 按当时的 state 与作用域求值
        params: resolveDeep(action.params ?? {}, scope, {
          isOpaque: (value) =>
            typeof value['action'] === 'string' ||
            typeof value['type'] === 'string',
        }) as Record<string, unknown>,
      };
      const ctx: ActionContext = {
        context: this.context,
        scope,
        // 子动作继承局部作用域（而非作用域快照），保证 state 始终取当前值
        execute: (child) => this.execute(child, localScope),
      };
      result = await handler(resolvedAction, ctx);
    } catch (cause) {
      result = { ok: false, error: toError(cause) };
    }
    this.recordNamedResult(action, result);
    return result;
  }

  /** 命名动作结果落盘：成功 → data；失败 → `{ ok: false, error }` */
  private recordNamedResult(action: ActionConfig, result: ActionResult): void {
    if (action.id === undefined) {
      return;
    }
    this.context.actionResults[action.id] = result.ok
      ? result.data
      : { ok: false, error: result.error };
  }

  /** 事件动作数组按声明顺序串行执行 */
  async executeAll(
    actions: ActionConfig | ActionConfig[],
    localScope?: ExpressionScope,
  ): Promise<ActionResult[]> {
    const list = Array.isArray(actions) ? actions : [actions];
    const results: ActionResult[] = [];
    for (const action of list) {
      results.push(await this.execute(action, localScope));
    }
    return results;
  }
}
