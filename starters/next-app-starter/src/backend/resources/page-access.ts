import type { PageDsl } from "@pactor-app/core";

import { isPrototype } from "../config";
import type { DemoUser } from "../auth/accounts";
import {
  findPageDsl,
  findPageEntryByPath,
  getLoginPath,
  listPageEntries,
  type PageEntry,
} from "./sitemap";

/**
 * 页面访问校验（平台 /api/public/page-access/verify 的服务端代理）。
 *
 * 页面切换 / 首次打开之前，客户端先请求项目内 POST /api/page-access/verify
 * （见 src/frontend/page-access.tsx）；该路由在 Next 服务端完成：
 * 1. 路径 → 页面（sitemap.yaml 全量页面，不受菜单裁剪影响）；
 * 2. 页面 DSL → pageKey（page.name，缺省回退 page.id）与 grantGroup；
 * 3. 转发平台接口并只按 data.allowed 放行：
 *
 *    POST {API_BASE}/api/public/page-access/verify
 *    { domainKey, moduleKey, pageKey, grantGroup }
 *
 * 平台响应：{ success, code, message, data: { allowed, reason }, display }。
 * 平台不可用 / 响应异常按拒绝处理（fail-closed）。
 */

/** 平台接口基准地址：缺省沿用 apiBaseUrl（模板 mock 即指向自身 9011） */
const API_BASE_URL =
  process.env.PACTOR_PAGE_ACCESS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:9011";

/** 平台域标识（真实项目按部署环境配置） */
const DOMAIN_KEY = process.env.PACTOR_DOMAIN_KEY ?? "platform";

/** 平台模块标识（真实项目按部署环境配置） */
const MODULE_KEY = process.env.PACTOR_MODULE_KEY ?? "organization";

/** 页面访问目标：path / pageKey / grantGroup 一次解析 */
export interface PageAccessTarget {
  /** 命中的页面路径模式（调试用） */
  path: string;
  /** 平台页面 key：page.name 优先，缺省回退页面 id */
  pageKey: string;
  /** 页面权限分组：page.grantGroup，缺省空串 */
  grantGroup: string;
  /** public 页（匿名可访问；被拒时不跳登录直接展示原因） */
  publicPage: boolean;
}

/** 转发给平台的请求体（与平台接口字段一致） */
export interface PageAccessVerifyRequest {
  domainKey: string;
  moduleKey: string;
  pageKey: string;
  grantGroup: string;
}

/** 平台响应（只声明消费的字段） */
interface PageAccessVerifyResponse {
  success?: boolean;
  code?: string;
  message?: string;
  data?: { allowed?: boolean; reason?: string };
}

/** 页面访问校验结果（项目内端点 /api/page-access/verify 的响应） */
export interface PageAccessResult {
  allowed: boolean;
  reason: string;
  /** 匿名访问受保护页面时的登录重定向目标（由本地 auth.loginPath 决定） */
  redirectTo?: string;
}

/**
 * 宿主从页面 DSL 读取的 page 元数据。
 * `grantGroup` 已纳入框架 PageMeta；此处以本地结构读取，兼容尚未声明
 * 该字段的已发布类型（模板依赖 npm latest，类型随版本更新）。
 */
type PageDslMeta = Pick<PageDsl["page"], "name"> & { grantGroup?: string };

/** 页面声明 → 访问目标（DSL 缺省时 pageKey 回退 id、grantGroup 为空） */
function toAccessTarget(entry: PageEntry): PageAccessTarget {
  const dsl = findPageDsl(entry.id);
  const meta = dsl?.page as PageDslMeta | undefined;
  return {
    path: entry.path,
    pageKey: meta?.name ?? entry.id,
    grantGroup: meta?.grantGroup ?? "",
    publicPage: entry.public === true,
  };
}

/** 按路径解析访问目标；未匹配到页面返回 null（404 交由应用处理） */
export function resolvePageAccessTargetByPath(
  pathname: string,
): PageAccessTarget | null {
  const entry = findPageEntryByPath(pathname);
  return entry === null ? null : toAccessTarget(entry);
}

/** 按 pageKey 反查页面（平台 mock / 服务端工具使用）；未命中返回 null */
export function resolvePageAccessTargetByPageKey(
  pageKey: string,
): PageAccessTarget | null {
  if (pageKey === "") {
    return null;
  }
  for (const entry of listPageEntries()) {
    if (entry.id === pageKey) {
      return toAccessTarget(entry);
    }
    const target = toAccessTarget(entry);
    if (target.pageKey === pageKey) {
      return target;
    }
  }
  return null;
}

export interface VerifyPageAccessOptions {
  /** 当前路径（客户端校验入口）；与 pageKey 二选一，路径优先 */
  pathname?: string;
  /** 页面 key（服务端 / 工具直接指定） */
  pageKey?: string;
  /** 权限分组（缺省从页面 DSL 读取；页面未命中时原样转发） */
  grantGroup?: string;
  /** 当前会话用户（匿名传 null） */
  user: DemoUser | null;
  /** 透传浏览器会话 Cookie（真实平台与模板 mock 都可能依赖会话鉴权） */
  cookie?: string | null;
  /** 透传 Authorization（使用 bearer token 时） */
  authorization?: string | null;
}

/**
 * 调用平台接口校验页面访问权限。
 *
 * pathname 未匹配到页面时放行——这是「页面不存在」而非「无权限」，
 * 交由 SitemapApp 自行路由（登录用户渲染 404，匿名仍按其守卫跳登录）；
 * 平台请求失败 / 响应异常一律拒绝。
 */
export async function verifyPageAccess(
  options: VerifyPageAccessOptions,
): Promise<PageAccessResult> {
  const target = resolveTarget(options);
  if (target === null) {
    return { allowed: true, reason: "未匹配到页面，交由应用路由处理" };
  }

  const body: PageAccessVerifyRequest = {
    domainKey: DOMAIN_KEY,
    moduleKey: MODULE_KEY,
    pageKey: target.pageKey,
    grantGroup: target.grantGroup,
  };

  let result: PageAccessResult;
  if (isPrototype) {
    result = evaluateMockPageAccess(options.user, body);
    if (!result.allowed && options.user === null && !target.publicPage) {
      result.redirectTo = getLoginPath();
    }
    return result;
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/public/page-access/verify`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(options.cookie ? { cookie: options.cookie } : {}),
          ...(options.authorization
            ? { authorization: options.authorization }
            : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
    const payload = (await response
      .json()
      .catch(() => ({}))) as PageAccessVerifyResponse;
    const allowed = response.ok && payload.data?.allowed === true;
    result = {
      allowed,
      reason:
        payload.data?.reason ??
        (allowed
          ? "OK"
          : (payload.message ?? `页面权限校验失败：HTTP ${response.status}`)),
    };
  } catch (error) {
    result = {
      allowed: false,
      reason: `页面权限校验服务不可用：${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }

  // 匿名访问非 public 页：保留 SitemapApp 原有的登录页跳转体验
  if (!result.allowed && options.user === null && !target.publicPage) {
    result.redirectTo = getLoginPath();
  }
  return result;
}

/** pathname 优先；否则用调用方给出的 pageKey / grantGroup 组成目标 */
function resolveTarget(
  options: VerifyPageAccessOptions,
): PageAccessTarget | null {
  if (options.pathname !== undefined) {
    return resolvePageAccessTargetByPath(options.pathname);
  }
  if (options.pageKey === undefined && options.grantGroup === undefined) {
    return null;
  }
  const resolved =
    options.pageKey !== undefined
      ? resolvePageAccessTargetByPageKey(options.pageKey)
      : null;
  return {
    path: resolved?.path ?? "",
    pageKey: resolved?.pageKey ?? options.pageKey ?? "",
    grantGroup: options.grantGroup ?? resolved?.grantGroup ?? "",
    publicPage: resolved?.publicPage ?? false,
  };
}

/**
 * 演示用平台实现（src/app/api/public/page-access/verify 使用）：
 * 权限分组 → 所需权限码。真实平台由权限中心维护该映射，模板只做等价演示，
 * 保证 admin / guest 账号在本地即可看到放行与拒绝两种结果。
 */
const GRANT_GROUP_PERMISSIONS: Record<string, readonly string[]> = {
  publicGroup: [],
  homeGroup: [],
  workspaceGroup: [],
  analyticsGroup: [],
  systemGroup: [],
  userGroup: ["user:view"],
  reportGroup: ["report:view"],
};

/**
 * 演示校验：public 页匿名放行；其余需登录；grantGroup 命中映射时
 * 要求对应权限码，未声明的分组登录即放行。
 */
export function evaluateMockPageAccess(
  user: DemoUser | null,
  request: Pick<PageAccessVerifyRequest, "pageKey" | "grantGroup">,
): { allowed: boolean; reason: string } {
  const target = resolvePageAccessTargetByPageKey(request.pageKey);
  const grantGroup = request.grantGroup || target?.grantGroup || "";

  if (target?.publicPage === true) {
    return { allowed: true, reason: "公开页面" };
  }
  if (user === null) {
    return { allowed: false, reason: "未登录" };
  }
  if (grantGroup === "") {
    return { allowed: true, reason: "页面未配置权限分组" };
  }
  const required = GRANT_GROUP_PERMISSIONS[grantGroup];
  if (required === undefined) {
    return { allowed: true, reason: `未配置权限分组 ${grantGroup}，默认放行` };
  }
  const missing = required.filter((code) => !user.permissions.includes(code));
  if (missing.length > 0) {
    return { allowed: false, reason: `缺少权限：${missing.join("、")}` };
  }
  return { allowed: true, reason: "OK" };
}
