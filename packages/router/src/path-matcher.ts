import type { MenuRegistry } from './menu.js';

/** match 命中结果 */
export interface PathMatchResult {
  params: Record<string, string>;
}

/** 切分为非空段（首尾斜杠与连续斜杠不产生空段） */
function toSegments(path: string): string[] {
  return path.split('/').filter((segment) => segment.length > 0);
}

/**
 * 路径模式匹配（决策 D3）：仅支持静态段与 `:param` 段
 * （如 `/customers/:id/edit`），整路径精确匹配（段数一致）。
 * V1 不支持 `*` 通配与可选段。
 */
export function match(
  pattern: string,
  pathname: string,
): PathMatchResult | null {
  const patternSegments = toSegments(pattern);
  const pathSegments = toSegments(pathname);
  if (patternSegments.length !== pathSegments.length) {
    return null;
  }
  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i += 1) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];
    if (patternSegment.startsWith(':')) {
      params[patternSegment.slice(1)] = pathSegment;
    } else if (patternSegment !== pathSegment) {
      return null;
    }
  }
  return { params };
}

/**
 * 解析查询串：`?tab=risk&page=2` → `{ tab: 'risk', page: '2' }`；
 * 空字符串与裸 `?` 返回空对象。
 */
export function parseQuery(search: string): Record<string, string> {
  const query: Record<string, string> = {};
  if (search === '' || search === '?') {
    return query;
  }
  // URLSearchParams 容忍前导 '?'，并负责百分号解码
  for (const [key, value] of new URLSearchParams(search)) {
    query[key] = value;
  }
  return query;
}

/** 路由上下文（设计文档第 32 节，决策 D3） */
export interface RouteContext {
  /** 当前 pathname */
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  pageId?: string;
  menuId?: string;
  /** 高亮菜单 id：菜单项 activeMenu ?? 自身 id */
  activeMenu?: string;
}

/** resolveRoute 的入参位置（search 可省略，视为无查询串） */
export interface RouteLocation {
  pathname: string;
  search?: string;
}

/**
 * 把当前位置解析为 RouteContext：findByPath 命中 →
 * `{ path, params, query, pageId, menuId, activeMenu }`；未命中返回 null。
 */
export function resolveRoute(
  registry: MenuRegistry,
  location: RouteLocation,
): RouteContext | null {
  const hit = registry.findByPath(location.pathname);
  if (hit === null) {
    return null;
  }
  const { menu, params } = hit;
  return {
    path: location.pathname,
    params,
    query: parseQuery(location.search ?? ''),
    pageId: menu.pageId,
    menuId: menu.id,
    activeMenu: menu.activeMenu ?? menu.id,
  };
}
