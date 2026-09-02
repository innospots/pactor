import type { PermissionConfig } from '@pactor/core';
import { Registry } from '@pactor/core';
import type {
  ActionContext,
  ActionRegistry,
  ActionResult,
} from '@pactor/runtime';

/**
 * capability 动作（设计决策 D4，设计文档第 64、81.5 节）：
 * AI DSL 触发业务能力的唯一通道，执行链为
 * CapabilityRegistry → Permission → Confirmation → Execute。
 */

/** 业务能力 handler */
export interface CapabilityHandler {
  /** 声明权限：执行前经 PermissionAdapter 检查 */
  permission?: PermissionConfig;
  /** 风险等级；'high' 需经 confirm 确认（注入时） */
  risk?: 'low' | 'high';
  /** 以求值后的 params 执行，返回值作为动作 data */
  execute(
    params: Record<string, unknown>,
    ctx: ActionContext,
  ): unknown | Promise<unknown>;
}

/** Capability Registry：能力名 → handler */
export type ChatCapabilityRegistry = Registry<CapabilityHandler>;

/** 结构化权限检查器（兼容 @pactor/runtime PermissionAdapter 与 @pactor/permission createPermissionAdapter 的返回） */
export interface ChatPermissionChecker {
  check(permission: PermissionConfig): boolean;
}

/** 高风险确认请求 */
export interface ChatConfirmRequest {
  name: string;
  params: Record<string, unknown>;
}

/** 高风险确认回调：返回 true 继续执行，false 取消（skipped 语义） */
export type ChatConfirm = (request: ChatConfirmRequest) => Promise<boolean>;

export interface CapabilityActionDeps {
  capabilities: ChatCapabilityRegistry;
  /** 缺省时视为全部放行 */
  permission?: ChatPermissionChecker;
  /** 缺省时高风险 capability 受控拒绝（design Risks 约定） */
  confirm?: ChatConfirm;
}

function failure(message: string): ActionResult {
  return { ok: false, error: new Error(message) };
}

/**
 * 注册 `capability` 动作（已注册的同名动作不会被覆盖）。
 *
 * DSL 侧：`{ action: 'capability', params: { name: '<能力名>', params: {...} } }`。
 *
 * 执行链（每步失败均为受控返回，不抛出）：
 * 1. `params.name` 查 CapabilityRegistry，未注册 → `{ ok: false }`
 * 2. capability 声明 `permission` 且检查拒绝 → `{ ok: false }`
 * 3. capability 声明 `risk: 'high'`：注入 confirm 时先确认，
 *    取消 → `{ ok: true, skipped: true }`；未注入 confirm → `{ ok: false }`
 * 4. `capability.execute(params.params, ctx)`，返回值作为动作 data
 */
export function registerCapabilityAction(
  actions: ActionRegistry,
  deps: CapabilityActionDeps,
): void {
  if (actions.has('capability')) {
    return;
  }
  actions.register('capability', async (action, ctx) => {
    const name = action.params?.['name'];
    if (typeof name !== 'string' || !name) {
      return failure('[@pactor/chat] capability 动作缺少 name 参数');
    }
    const capability = deps.capabilities.get(name);
    if (!capability) {
      return failure(`[@pactor/chat] capability not registered: "${name}"`);
    }

    if (
      capability.permission !== undefined &&
      deps.permission !== undefined &&
      !deps.permission.check(capability.permission)
    ) {
      return failure(
        `[@pactor/chat] permission denied for capability "${name}"`,
      );
    }

    const params = (action.params?.['params'] ?? {}) as Record<
      string,
      unknown
    >;

    if (capability.risk === 'high') {
      if (!deps.confirm) {
        return failure(
          `[@pactor/chat] capability "${name}" 为高风险操作，但未注入 confirm`,
        );
      }
      const confirmed = await deps.confirm({ name, params });
      if (!confirmed) {
        return { ok: true, skipped: true };
      }
    }

    const data = await capability.execute(params, ctx);
    return { ok: true, data };
  });
}
