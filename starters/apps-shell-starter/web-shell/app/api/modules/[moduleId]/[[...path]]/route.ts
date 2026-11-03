import {
  dispatchModuleApi,
  type ModuleApiRouteContext,
} from "@/server/modules/dispatch";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 模块 API 统一分发入口。
 *
 * 模块 tgz 自带 server/index.mjs，装配器生成 server-registry 后由此处按
 * moduleId + 逻辑路径分发；不需要在 Shell 逐模块复制业务路由。
 *
 * 不导出 HEAD：Next 会把 HEAD 自动映射到 GET 并去掉响应体。
 */
export function GET(request: Request, context: ModuleApiRouteContext) {
  return dispatchModuleApi(request, context);
}

export function POST(request: Request, context: ModuleApiRouteContext) {
  return dispatchModuleApi(request, context);
}

export function PUT(request: Request, context: ModuleApiRouteContext) {
  return dispatchModuleApi(request, context);
}

export function PATCH(request: Request, context: ModuleApiRouteContext) {
  return dispatchModuleApi(request, context);
}

export function DELETE(request: Request, context: ModuleApiRouteContext) {
  return dispatchModuleApi(request, context);
}

export function OPTIONS(request: Request, context: ModuleApiRouteContext) {
  return dispatchModuleApi(request, context);
}
