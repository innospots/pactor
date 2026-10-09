import type { ActionConfig } from '@pactor-app/core';

import type {
  ActionHandler,
  ActionRegistry,
  ActionResult,
} from './engine.js';

/**
 * 内置 UI 无关标准动作（设计文档第 17 节，决策 D4）。
 *
 * `navigate` / `message` / `confirm` / `overlay.*` 依赖上层模块，
 * 不在此处实现，由 @pactor-app/router / @pactor-app/ui 的 interaction 层注册。
 * 已注册的同名动作不会被覆盖。
 */
export function registerBuiltinActions(registry: ActionRegistry): void {
  const register = (name: string, handler: ActionHandler): void => {
    if (!registry.has(name)) {
      registry.register(name, handler);
    }
  };

  // params 经表达式求值后合并进 StateStore
  register('setState', (action, ctx) => {
    ctx.context.state.set(action.params ?? {});
    return { ok: true };
  });

  register('resetState', (_action, ctx) => {
    ctx.context.state.reset();
    return { ok: true };
  });

  // params.dataSource 指定数据源；缺省 reload 全部 autoLoad 源
  register('reload', async (action, ctx) => {
    const target = action.params?.['dataSource'];
    await ctx.context.data.reload(
      typeof target === 'string' ? target : undefined,
    );
    return { ok: true };
  });

  // params.ms：等待毫秒数（缺省 300）；演示/原型中的异步等待（如按钮点击后的 loading 态）
  register('delay', async (action) => {
    const raw = Number(action.params?.['ms'] ?? 300);
    await new Promise((resolve) => setTimeout(resolve, Number.isFinite(raw) ? raw : 300));
    return { ok: true };
  });

  // 经 HttpAdapter 发请求，结果写入 params.target 指定的 state 路径
  register('request', async (action, ctx) => {
    const params = action.params ?? {};
    const { target, method, url, headers, body } = params;
    if (typeof url !== 'string' || !url) {
      return {
        ok: false,
        error: new Error('[@pactor-app/runtime] request 动作缺少 url 参数'),
      };
    }
    try {
      const data = await ctx.context.http.request({
        method: typeof method === 'string' ? method : undefined,
        url,
        params: isRecord(params['params']) ? params['params'] : undefined,
        headers: isStringRecord(headers) ? headers : undefined,
        body,
      });
      if (typeof target === 'string' && target) {
        // target 允许写 "state.detail" 或 "detail"，统一落到 StateStore 路径
        const path = target.startsWith('state.') ? target.slice(6) : target;
        ctx.context.state.set(path, data);
      }
      return { ok: true, data };
    } catch (cause) {
      return {
        ok: false,
        error:
          cause instanceof Error ? cause : new Error(String(cause)),
      };
    }
  });

  // 服务层调用桥（request 仅覆盖 HTTP 出口）：params.service 服务名，
  // params.params 入参（表达式求值后传入），返回值为动作结果 data
  register('service.call', async (action, ctx) => {
    const name = action.params?.['service'];
    if (typeof name !== 'string' || name === '') {
      return {
        ok: false,
        error: new Error('[@pactor-app/runtime] service.call 缺少 params.service'),
      };
    }
    const handler = ctx.context.services.get(name);
    if (!handler) {
      return {
        ok: false,
        error: new Error(`[@pactor-app/runtime] service 未注册: ${name}`),
      };
    }
    try {
      const callParams = action.params?.['params'];
      const data = await handler(
        isRecord(callParams) ? callParams : {},
      );
      return { ok: true, data };
    } catch (cause) {
      return {
        ok: false,
        error: cause instanceof Error ? cause : new Error(String(cause)),
      };
    }
  });

  // 串行：任一失败即中断并返回该失败（skipped 视为成功继续）
  register('sequence', async (action, ctx) => {
    for (const child of asActions(action.params?.['actions'])) {
      const result = await ctx.execute(child);
      if (!result.ok) {
        return result;
      }
    }
    return { ok: true };
  });

  // 页面级命名动作复用（PageDsl.actions）：以调用方作用域执行，
  // ${row} / ${event} 等局部作用域原样可用；子动作任一失败即中断
  register('call', async (action, ctx) => {
    const name = action.params?.['name'];
    if (typeof name !== 'string' || !name) {
      return {
        ok: false,
        error: new Error('[@pactor-app/runtime] call 动作缺少 name 参数'),
      };
    }
    const target = ctx.context.namedActions[name];
    if (target === undefined) {
      return {
        ok: false,
        error: new Error(
          `[@pactor-app/runtime] unknown named action: "${name}"`,
        ),
      };
    }
    // 循环引用守卫：命名动作直接或间接 call 自身时按深度受控失败
    const depth = (callDepth.get(ctx.context) ?? 0) + 1;
    if (depth > MAX_CALL_DEPTH) {
      return {
        ok: false,
        error: new Error(
          `[@pactor-app/runtime] call 嵌套超过 ${MAX_CALL_DEPTH} 层（疑似循环引用）: "${name}"`,
        ),
      };
    }
    callDepth.set(ctx.context, depth);
    try {
      for (const child of asActions(target)) {
        const result = await ctx.execute(child);
        if (!result.ok) {
          return result;
        }
      }
      return { ok: true };
    } finally {
      callDepth.set(ctx.context, depth - 1);
    }
  });

  // 并行：全部完成后返回；任一失败则整体失败
  register('parallel', async (action, ctx) => {
    const results = await Promise.all(
      asActions(action.params?.['actions']).map((child) => ctx.execute(child)),
    );
    const failed = results.find((result) => !result.ok);
    return failed ?? { ok: true, data: results };
  });

  // params.condition 已在管线中求值（整体单表达式保留原始类型）
  register('if', async (action, ctx) => {
    const branch = action.params?.['condition']
      ? action.params?.['then']
      : action.params?.['else'];
    for (const child of asActions(branch)) {
      const result = await ctx.execute(child);
      if (!result.ok) {
        return result;
      }
    }
    return { ok: true };
  });

  register(
    'delay',
    (action) =>
      new Promise<ActionResult>((resolve) => {
        const ms = Number(action.params?.['ms'] ?? 0);
        setTimeout(() => resolve({ ok: true }), Number.isFinite(ms) ? ms : 0);
      }),
  );

  // 表单联动：values（已求值）经 FormHandle 写入目标表单字段；
  // 不触发校验与 onValuesChange（避免联动循环）；句柄未注册受控失败
  register('form.setValues', (action, ctx) => {
    const formName = action.params?.['form'];
    const name =
      typeof formName === 'string' && formName !== '' ? formName : 'default';
    const handle = ctx.context.forms.get(name);
    if (!handle) {
      return {
        ok: false,
        error: new Error(
          `[@pactor-app/runtime] form.setValues 目标表单未注册: "${name}"`,
        ),
      };
    }
    const values = action.params?.['values'];
    if (!isRecord(values)) {
      return {
        ok: false,
        error: new Error('[@pactor-app/runtime] form.setValues 缺少 params.values（object）'),
      };
    }
    handle.setValues(values);
    return { ok: true };
  });

  // 表单提交桥：经 FormHandle.submit 触发目标表单原生提交（requestSubmit），
  // 走统一的校验与 onSubmit 链路——用于提交按钮在 <form> DOM 外的场景
  // （如 Drawer footer 槽位内的「保存」按钮）；句柄未注册受控失败
  register('form.submit', (action, ctx) => {
    const formName = action.params?.['form'];
    const name =
      typeof formName === 'string' && formName !== '' ? formName : 'default';
    const handle = ctx.context.forms.get(name);
    if (!handle) {
      return {
        ok: false,
        error: new Error(
          `[@pactor-app/runtime] form.submit 目标表单未注册: "${name}"`,
        ),
      };
    }
    if (typeof handle.submit !== 'function') {
      return {
        ok: false,
        error: new Error(
          `[@pactor-app/runtime] form.submit 目标表单不支持提交: "${name}"`,
        ),
      };
    }
    handle.submit();
    return { ok: true };
  });
}

function asActions(value: unknown): ActionConfig[] {
  if (Array.isArray(value)) {
    return value as ActionConfig[];
  }
  if (isRecord(value) && typeof value['action'] === 'string') {
    return [value as unknown as ActionConfig];
  }
  return [];
}

/** call 动作的嵌套深度（按 RuntimeContext 计，防命名动作循环引用） */
const callDepth = new WeakMap<object, number>();
const MAX_CALL_DEPTH = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) && Object.values(value).every((v) => typeof v === 'string')
  );
}
