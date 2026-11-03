import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Shell 与 Pactor 之间的适配层（非 Pactor 官方 API）。
 * 后续按锁定版本补齐 Loader / Service / Action 注册细节。
 */
export function createShellNavigate(router: AppRouterInstance) {
  return (to: string) => {
    router.push(to);
  };
}

export const runtimeSitemapSource = "/api/runtime/bootstrap";

export const runtimePageEndpoint = (pageId: string) =>
  `/api/runtime/pages/${encodeURIComponent(pageId)}`;
