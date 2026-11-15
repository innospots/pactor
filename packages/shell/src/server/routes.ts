import { cookies } from 'next/headers';

import { buildRuntimeBootstrap } from './bootstrap.js';
import { getRuntimeFragmentDsl } from './fragments.js';
import { getRuntimePage } from './pages.js';
import type { ShellGeneratedOptions } from './registry.js';
import {
  defaultResolveSessionUser,
  type ShellCookieStore,
  type ShellUser,
} from './session.js';

export interface ShellRuntimeConfig extends ShellGeneratedOptions {
  /** 会话解析扩展点；缺省恒匿名（defaultResolveSessionUser） */
  resolveUser?: (store: ShellCookieStore) => ShellUser | null;
  /** Cookie 读取工厂（缺省 next/headers 的 cookies()）。
   *  宿主与包分属不同 next 实例时（monorepo link），包内 cookies() 会因
   *  AsyncLocalStorage 不共享而报 outside request scope——宿主注入自身的
   *  cookies 即可。 */
  cookies?: () => Promise<ShellCookieStore>;
}

type PageRouteContext = { params: Promise<{ pageId: string }> };
type FragmentRouteContext = { params: Promise<{ fragmentId: string }> };

export interface RuntimeRouteHandlers {
  bootstrap: () => Promise<Response>;
  page: (request: Request, context: PageRouteContext) => Promise<Response>;
  fragment: (
    request: Request,
    context: FragmentRouteContext,
  ) => Promise<Response>;
}

const STATUS_BY_KIND = {
  not_found: 404,
  unauthorized: 401,
  forbidden: 403,
} as const;

/** Runtime DSL API 的 Next route handler 工厂（路径约定见 README：/api/runtime/*）。 */
export function createRuntimeHandlers(
  config: ShellRuntimeConfig = {},
): RuntimeRouteHandlers {
  const resolveUser = config.resolveUser ?? defaultResolveSessionUser;
  const getCookieStore = config.cookies ?? cookies;

  return {
    async bootstrap() {
      const store = await getCookieStore();
      const body = buildRuntimeBootstrap(resolveUser(store), config);
      return Response.json(body, {
        headers: { 'cache-control': 'no-store' },
      });
    },

    async page(_request, context) {
      const { pageId } = await context.params;
      const store = await getCookieStore();
      const result = getRuntimePage(pageId, resolveUser(store), config);
      if (result.kind !== 'ok') {
        return Response.json(
          { error: result.kind },
          { status: STATUS_BY_KIND[result.kind] },
        );
      }
      return Response.json(result.resource, {
        headers: { 'cache-control': 'no-store' },
      });
    },

    async fragment(_request, context) {
      const { fragmentId } = await context.params;
      const store = await getCookieStore();
      const fragment = getRuntimeFragmentDsl(fragmentId, resolveUser(store), config);
      if (!fragment) {
        return Response.json({ error: 'not_found' }, { status: 404 });
      }
      return Response.json(fragment, {
        headers: { 'cache-control': 'no-store' },
      });
    },
  };
}

/** 默认配置的就绪 handler：宿主 route 文件可一行 re-export（生成目录为缺省 .generated/pactor）。 */
const defaultHandlers = createRuntimeHandlers();

export const runtimeBootstrapHandler = defaultHandlers.bootstrap;
export const runtimePageHandler = defaultHandlers.page;
export const runtimeFragmentHandler = defaultHandlers.fragment;
