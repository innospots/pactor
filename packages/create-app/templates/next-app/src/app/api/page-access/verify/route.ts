import { cookies } from "next/headers";

import { findUserBySession, SESSION_COOKIE } from "@/backend/auth/accounts";
import { corsHeaders, corsPreflight } from "@/backend/cors";
import { verifyPageAccess } from "@/backend/resources/page-access";

/**
 * 页面访问校验端点（客户端在页面切换 / 首次打开前调用）：
 * 接收当前 path（或直接给 pageKey），在 Next 服务端解析页面 DSL 的
 * pageKey / grantGroup，转发平台 POST /api/public/page-access/verify，
 * 只按 data.allowed 返回放行 / 拒绝。
 *
 * 平台的域 / 模块标识与接口地址均在服务端配置（见 src/backend/resources/page-access.ts），
 * 浏览器不接触平台地址，也不持有域 / 模块密钥。
 */
interface VerifyBody {
  /** 当前路径（页面路由，如 /users、/reports/monthly/42） */
  path?: string;
  /** 页面 key（page.name，缺省回退 page.id）；与 path 二选一，path 优先 */
  pageKey?: string;
  /** 权限分组（缺省从页面 DSL 的 page.grantGroup 读取） */
  grantGroup?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as VerifyBody;
  const pathname =
    typeof body.path === "string" && body.path !== "" ? body.path : undefined;
  const pageKey = typeof body.pageKey === "string" ? body.pageKey : undefined;

  if (pathname === undefined && (pageKey === undefined || pageKey === "")) {
    return Response.json(
      { allowed: false, reason: "缺少 path 或 pageKey" },
      { status: 400, headers: corsHeaders(request) },
    );
  }

  const store = await cookies();
  const user = findUserBySession(store.get(SESSION_COOKIE)?.value);
  const result = await verifyPageAccess({
    pathname,
    pageKey,
    grantGroup:
      typeof body.grantGroup === "string" ? body.grantGroup : undefined,
    user,
    cookie: request.headers.get("cookie"),
    authorization: request.headers.get("authorization"),
  });

  return Response.json(result, {
    headers: { "cache-control": "no-store", ...corsHeaders(request) },
  });
}

/** 预检（跨源带凭据 / 自定义头时） */
export const OPTIONS = corsPreflight;
