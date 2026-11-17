import { dispatchBusinessData } from "@/server/api";
import { corsPreflight } from "@/server/api/http";

type Context = { params: Promise<{ parts?: string[] }> };

/**
 * 独立运行业务 API：`/api/general-app/*` 直接转调共享分发实现。
 * 打包为模块后由 Shell 的 `/api/modules/<moduleId>/*` 承接，二者共用
 * `src/server/api` 的实现（module/server.ts 注册同样的逻辑路径）。
 */
async function handle(request: Request, context: Context) {
  const { parts = [] } = await context.params;
  return dispatchBusinessData(request, parts);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = corsPreflight;
