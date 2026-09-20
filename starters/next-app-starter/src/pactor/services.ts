import type { ActionHandler, ServiceHandler } from "@pactor-app/runtime";

/**
 * 演示服务与扩展动作（真实项目替换为后端调用）。
 * session.context 会话桥由框架 SitemapApp 内置（${data.session.*}），
 * 此处只保留业务服务。
 *
 * - auth.login / auth.logout：演示认证，写 / 清会话 cookie
 * - app.reload（动作）：整页重载——登录 / 登出后让 sitemap 端点按新会话
 *   重新裁剪内容
 */
export const demoServices: Record<string, ServiceHandler> = {
  "auth.login": async (params) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: params?.["username"],
        password: params?.["password"],
      }),
    });
    if (!res.ok) {
      throw new Error("用户名或密码错误");
    }
    return res.json() as Promise<{ token: string; user: Record<string, unknown> }>;
  },
  "auth.logout": async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    return { ok: true };
  },
};

export const demoActions: Record<string, ActionHandler> = {
  // SPA 导航不会触发 sitemap 重取，登录 / 登出需整页重载
  "app.reload": (action) => {
    const to = action.params?.["to"];
    if (typeof window !== "undefined") {
      window.location.assign(typeof to === "string" && to !== "" ? to : "/");
    }
    return { ok: true };
  },
  // 框架暂无内置"调用服务"动作（request 仅走 HTTP 出口），
  // 经 options.actions 扩展 service.call（与 examples/admin 同款）：
  // params.params 由动作引擎完成表达式求值后传入
  "service.call": async (action, ctx) => {
    const name = action.params?.["service"];
    if (typeof name !== "string" || name === "") {
      return {
        ok: false,
        error: new Error("[next-app-starter] service.call 缺少 params.service"),
      };
    }
    const handler = ctx.context.services.get(name);
    if (!handler) {
      return {
        ok: false,
        error: new Error(`[next-app-starter] service 未注册: ${name}`),
      };
    }
    try {
      const callParams = action.params?.["params"];
      const data = await handler(
        typeof callParams === "object" && callParams !== null
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
