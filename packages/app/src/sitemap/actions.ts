import type { ActionHandler } from '@pactor-app/runtime';

/**
 * SitemapApp 缺省动作（宿主 actions 同名覆盖）：
 * 常见动作开箱即用，无需每个项目重复扩展。
 *
 * - app.reload：整页重载 / 跳转。登录 / 登出后 sitemap 端点需按新会话
 *   重新裁剪内容（SPA 导航不触发重取），params.to 缺省跳 '/'
 * - service.call：调用已注册服务（params.service 服务名，params.params
 *   入参，表达式求值后传入）。request 动作仅覆盖 HTTP 出口，
 *   服务层调用经此桥接
 */
export const defaultSitemapActions: Record<string, ActionHandler> = {
  'app.reload': (action) => {
    const to = action.params?.['to'];
    if (typeof window !== 'undefined') {
      window.location.assign(typeof to === 'string' && to !== '' ? to : '/');
    }
    return { ok: true };
  },
  'service.call': async (action, ctx) => {
    const name = action.params?.['service'];
    if (typeof name !== 'string' || name === '') {
      return {
        ok: false,
        error: new Error('[@pactor-app/app] service.call 缺少 params.service'),
      };
    }
    const handler = ctx.context.services.get(name);
    if (!handler) {
      return {
        ok: false,
        error: new Error(`[@pactor-app/app] service 未注册: ${name}`),
      };
    }
    try {
      const callParams = action.params?.['params'];
      const data = await handler(
        typeof callParams === 'object' && callParams !== null
          ? (callParams as Record<string, unknown>)
          : {},
      );
      return { ok: true, data };
    } catch (cause) {
      return {
        ok: false,
        error: cause instanceof Error ? cause : new Error(String(cause)),
      };
    }
  },
};
