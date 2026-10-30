import { cookies } from "next/headers";

import { findUserBySession, SESSION_COOKIE } from "@/backend/mock/accounts";
import { corsHeaders, corsPreflight } from "@/backend/cors";
import { evaluateMockPageAccess } from "@/backend/pages/page-access";

/**
 * 平台页面访问校验接口的 mock（与真实平台同契约）：
 * 真实项目把 src/backend/pages/page-access.ts 的 API_BASE_URL 指向平台即可，
 * 本路由仅用于模板本地演示（NGINX / 网关按实际平台地址转发）。
 *
 * 请求：{ domainKey, moduleKey, pageKey, grantGroup }
 * 响应：{ success, code, message, data: { allowed, reason }, display }
 *
 * 演示规则（src/backend/pages/page-access.ts 的 GRANT_GROUP_PERMISSIONS）：
 * public 页匿名放行；其余需登录；userGroup 需 user:view，
 * reportGroup 需 report:view。因此 admin 全部放行，guest 仅首页放行。
 */
interface VerifyBody {
  domainKey?: string;
  moduleKey?: string;
  pageKey?: string;
  grantGroup?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as VerifyBody;
  const store = await cookies();
  const user = findUserBySession(store.get(SESSION_COOKIE)?.value);
  const result = evaluateMockPageAccess(user, {
    pageKey: body.pageKey ?? "",
    grantGroup: body.grantGroup ?? "",
  });

  return Response.json(
    {
      success: true,
      code: "OK",
      message: "OK",
      data: result,
      display: {},
    },
    { headers: { "cache-control": "no-store", ...corsHeaders(request) } },
  );
}

/** 预检（跨域带凭据 / 自定义头时） */
export const OPTIONS = corsPreflight;
