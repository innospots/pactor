import type {
  ActionRegistry,
  ActionResult,
} from '@pactor-app/runtime';
import { resolveDeep } from '@pactor-app/runtime';

import { OverlayManager, type OverlayConfig } from './manager.js';

/**
 * modal 实例（结构化类型，仅声明本包用到的 API）：
 * 由 InteractionProvider（shadcn 实现为 ShadcnInteractionProvider）
 * 在 mount 时注入 UiBridge。
 */
export interface UiModal {
  confirm(config: {
    title?: unknown;
    content?: unknown;
    onOk?: () => void;
    onCancel?: () => void;
  }): unknown;
}

/** message 实例（结构化类型）：toast 反馈四态 */
export interface UiMessage {
  success(content: unknown): unknown;
  error(content: unknown): unknown;
  info(content: unknown): unknown;
  warning(content: unknown): unknown;
}

/**
 * UiBridge（决策 D3）：manager 旁路的可变引用，
 * InteractionProvider 在 mount 时赋值、unmount 时清空；
 * `confirm` / `message` 动作经它调用 UI 层 API，未注入时返回
 * 受控失败而非抛出。
 */
export interface UiBridge {
  modal?: UiModal;
  message?: UiMessage;
}

/** 创建空 UiBridge：传给 registerInteractionActions 与 InteractionProvider */
export function createUiBridge(): UiBridge {
  return {};
}

/**
 * 注册交互动作（设计文档第 45、48 节，决策 D3）：
 *
 * - `overlay.open`：`params.overlay`（配置字段表达式已求值，content
 *   DslNode 子树保留给渲染层求值）→ `manager.open`，close payload
 *   作为动作 data 返回；父页面作用域浅快照记入 parentScope
 * - `overlay.close`：`params.id`（缺省栈顶）+ `params.payload`
 *   （缺省取消语义 `{ success: false }`）→ `manager.close`
 * - `confirm`：`params.title` / `params.content` → UiBridge 注入的
 *   modal.confirm，确认返回 data `true`，取消返回 `false`；UiBridge
 *   未注入 modal 时返回 `{ ok: false }` 受控失败
 * - `message`：`params.messageType`（success / error / info / warning，
 *   缺省 info；推荐别名——params 带 `type` 键会被动作引擎 isOpaque
 *   约定跳过表达式求值）+ `params.text` → UiBridge 注入的 message；
 *   未注入时受控失败。`params.type` 保留为兼容别名（静态文案可用）
 *
 * 已注册的同名动作不会被覆盖（与 registerBuiltinActions 同约定）。
 */
export function registerInteractionActions(
  actions: ActionRegistry,
  manager: OverlayManager,
  ui: UiBridge,
): void {
  const register = (
    name: string,
    handler: Parameters<ActionRegistry['register']>[1],
  ): void => {
    if (!actions.has(name)) {
      actions.register(name, handler);
    }
  };

  register('overlay.open', async (action, ctx) => {
    const overlay = action.params?.['overlay'];
    if (!isRecord(overlay)) {
      return failure('[pactor-interaction] overlay.open 缺少 overlay 配置参数');
    }
    // 引擎对含 type 字段的对象不做求值（内嵌 DSL 约定），这里求值
    // overlay 配置自身（title / width / params / page.pageId 等），
    // content DslNode 子树保留原样，由渲染层以 overlay 作用域求值
    const { content, ...rest } = overlay;
    const resolved = resolveDeep(rest, ctx.scope) as Record<string, unknown>;
    const config = { ...resolved, content } as unknown as OverlayConfig;
    // 父页面作用域浅快照（只读约定），overlay 内容以 parent 键访问
    const data = await manager.open(config, {
      parentScope: { ...ctx.scope },
    });
    return { ok: true, data };
  });

  register('overlay.close', (action) => {
    const id = action.params?.['id'];
    const payload = action.params?.['payload'];
    if (typeof id === 'string' && id) {
      manager.close(id, payload);
    } else if (payload !== undefined) {
      // 无 id 且 payload 为字符串时会被 close 视作 id（找不到即 no-op），
      // 字符串 payload 请显式携带 id
      manager.close(payload);
    } else {
      manager.close();
    }
    return { ok: true };
  });

  register('confirm', async (action) => {
    const modal = ui.modal;
    if (!modal) {
      return failure(
        '[pactor-interaction] confirm 动作需要 <InteractionProvider> 注入 modal 实例',
      );
    }
    const params = action.params ?? {};
    const data = await new Promise<boolean>((resolve) => {
      modal.confirm({
        title: params['title'],
        content: params['content'],
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
    return { ok: true, data };
  });

  register('message', (action) => {
    const message = ui.message;
    if (!message) {
      return failure(
        '[pactor-interaction] message 动作需要 <InteractionProvider> 注入 message 实例',
      );
    }
    const params = action.params ?? {};
    const type = params['messageType'] ?? params['type'];
    const text = params['text'];
    if (type === 'success' || type === 'error' || type === 'warning') {
      message[type](text);
    } else {
      message.info(text);
    }
    return { ok: true };
  });
}

function failure(message: string): ActionResult {
  return { ok: false, error: new Error(message) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
