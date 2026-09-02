import type { PermissionConfig } from '@pactor/core';

/**
 * 适配接口（设计文档第 15、17 节，决策 D2）：
 *
 * 动作能力边界 —— `navigate` / 权限判定 / HTTP 传输依赖上层模块
 * （@pactor/router / @pactor/permission / 宿主应用），本包只定义接口与
 * 默认实现，真实现经 `createRuntimeContext` 注入。
 */

/**
 * 权限适配接口：检查权限配置（string / string[] 任一命中即放行 /
 * `{ code, denied }` 对象形式）。三种形态均只判定"有没有权限"——
 * 对象形式只检查 `code`，denied 策略由 Renderer / Guard 解释。
 */
export interface PermissionAdapter {
  check(permission: PermissionConfig): boolean;
}

/** 路由适配接口 */
export interface RouterAdapter {
  navigate(to: string): void;
}

/** HTTP 请求描述（与 DataSourceConfig.request 结构对齐） */
export interface HttpRequestConfig {
  method?: string;
  url: string;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: unknown;
}

/** HTTP 适配接口：统一出口，便于测试替换与统一认证 */
export interface HttpAdapter {
  request(config: HttpRequestConfig): Promise<unknown>;
}

/** 默认权限适配器：全部放行（真实权限由 @pactor/permission 提供） */
export function createDefaultPermissionAdapter(): PermissionAdapter {
  return { check: () => true };
}

/** 默认路由适配器：no-op 并告警（真实导航由 @pactor/router 提供） */
export function createDefaultRouterAdapter(): RouterAdapter {
  return {
    navigate(to: string) {
      console.warn(
        `[@pactor/runtime] RouterAdapter 未注入，navigate("${to}") 已忽略`,
      );
    },
  };
}

/**
 * 默认 HTTP 适配器：基于全局 fetch。
 * GET/HEAD 请求把 params 拼到 query string；body 统一 JSON 编码；
 * 非 2xx 响应抛错；响应优先按 JSON 解析，失败则返回原文本。
 */
export function createFetchHttpAdapter(): HttpAdapter {
  return {
    async request(config) {
      const method = (config.method ?? 'GET').toUpperCase();
      let url = config.url;
      if (config.params) {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(config.params)) {
          if (value !== undefined && value !== null) {
            search.set(key, String(value));
          }
        }
        const query = search.toString();
        if (query) {
          url += (url.includes('?') ? '&' : '?') + query;
        }
      }

      const headers: Record<string, string> = { ...config.headers };
      let body: string | undefined;
      if (config.body !== undefined) {
        headers['content-type'] ??= 'application/json';
        body = JSON.stringify(config.body);
      }

      const response = await fetch(url, { method, headers, body });
      if (!response.ok) {
        throw new Error(
          `[@pactor/runtime] http request failed: ${response.status} ${response.statusText} (${config.url})`,
        );
      }
      const text = await response.text();
      if (!text) {
        return undefined;
      }
      try {
        return JSON.parse(text) as unknown;
      } catch {
        return text;
      }
    },
  };
}
