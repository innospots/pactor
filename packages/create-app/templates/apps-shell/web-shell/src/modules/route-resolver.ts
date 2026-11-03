import { getAssembly } from "./registry";
import type { AssemblyRoute } from "./types";

export type ResolvedRoute = {
  globalPageId: string;
  moduleId: string;
  pageId: string;
  params: Record<string, string>;
};

function normalizePath(path: string): string {
  if (!path.startsWith("/")) return `/${path}`;
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function matchPattern(
  route: AssemblyRoute,
  publicPath: string,
): Record<string, string> | null {
  if (route.paramNames.length === 0) {
    return route.publicPath === publicPath ? {} : null;
  }
  const patternParts = route.pattern.split("/").filter(Boolean);
  const pathParts = publicPath.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const segment = patternParts[i];
    const value = pathParts[i];
    if (segment.startsWith(":")) {
      params[segment.slice(1)] = value;
      continue;
    }
    if (segment !== value) return null;
  }
  return params;
}

export function resolvePublicPath(pathname: string): ResolvedRoute | null {
  const publicPath = normalizePath(pathname);
  const { routes } = getAssembly();

  const exact = routes.find(
    (r) => r.paramNames.length === 0 && r.publicPath === publicPath,
  );
  if (exact) {
    return {
      globalPageId: exact.globalPageId,
      moduleId: exact.moduleId,
      pageId: exact.pageId,
      params: {},
    };
  }

  for (const route of routes) {
    if (route.paramNames.length === 0) continue;
    const params = matchPattern(route, publicPath);
    if (params) {
      return {
        globalPageId: route.globalPageId,
        moduleId: route.moduleId,
        pageId: route.pageId,
        params,
      };
    }
  }
  return null;
}
