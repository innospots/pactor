import type { ActionConfig } from 'pactor-core';

import type {
  ActionHandler,
  ActionRegistry,
  ActionResult,
} from './engine.js';

/**
 * 内置 UI 无关标准动作（设计文档第 17 节，决策 D4）。
 *
 * `navigate` / `message` / `confirm` / `overlay.*` 依赖上层模块，
 * 不在此处实现，由 pactor-router / pactor-interaction 注册。
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

  // 经 HttpAdapter 发请求，结果写入 params.target 指定的 state 路径
  register('request', async (action, ctx) => {
    const params = action.params ?? {};
    const { target, method, url, headers, body } = params;
    if (typeof url !== 'string' || !url) {
      return {
        ok: false,
        error: new Error('[pactor-runtime] request 动作缺少 url 参数'),
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) && Object.values(value).every((v) => typeof v === 'string')
  );
}
