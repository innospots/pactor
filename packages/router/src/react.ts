import {
  checkPagePermission,
  type PermissionChecker,
} from '@pactor/permission';
import { useMemo, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { MenuRegistry } from './menu.js';
import type { NavigationBridge } from './navigation.js';
import { resolveRoute, type RouteContext } from './path-matcher.js';

/** 命中页面时 render 的入参 */
export interface RenderPageArgs {
  pageId: string;
  route: RouteContext;
}

/** DynamicDslRoute 的 props（决策 D5） */
export interface DynamicDslRouteProps {
  registry: MenuRegistry;
  /** 命中且有权限时渲染页面 */
  render(page: RenderPageArgs): ReactNode;
  /** 路径未命中（404）渲染内容，缺省为 null */
  fallback?: ReactNode;
  /** 无权限（403）渲染内容，缺省为 null */
  forbidden?: ReactNode;
  /** 权限判定（@pactor/permission PermissionChecker，直接传 PermissionStore 即可） */
  permissionChecker?: PermissionChecker;
}

/**
 * DynamicDslRoute（设计文档第 31 节，决策 D5），用法：
 * `<Route path="*" element={<DynamicDslRoute registry={...} render={...} />} />`。
 *
 * useLocation 变化 → 重新解析：未命中（或命中项无 pageId）渲染 fallback；
 * 配置了 permissionChecker 且页面无权限时渲染 forbidden（不调用 render）；
 * 否则 `render({ pageId, route })`。
 */
export function DynamicDslRoute(props: DynamicDslRouteProps): ReactNode {
  const {
    registry,
    render,
    fallback = null,
    forbidden = null,
    permissionChecker,
  } = props;
  const location = useLocation();
  const hit = registry.findByPath(location.pathname);
  const route = resolveRoute(registry, {
    pathname: location.pathname,
    search: location.search,
  });
  if (hit === null || route === null || hit.menu.pageId === undefined) {
    return fallback;
  }
  if (
    permissionChecker !== undefined &&
    !checkPagePermission(hit.menu, permissionChecker)
  ) {
    return forbidden;
  }
  return render({ pageId: hit.menu.pageId, route });
}

/**
 * 把 React Router 的 useNavigate / useLocation 包装为 NavigationBridge
 * （决策 D5）。仅用稳定 API，兼容 react-router-dom v6/v7。
 *
 * 注意：React Router 自身驱动组件重渲染，无裸事件源，故 subscribe
 * 返回 no-op 退订函数；getLocation 始终返回当前渲染的 location。
 */
export function useReactRouterBridge(): NavigationBridge {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  locationRef.current = location;
  return useMemo<NavigationBridge>(
    () => ({
      getLocation: () => ({
        pathname: locationRef.current.pathname,
        search: locationRef.current.search,
      }),
      push: (to) => navigate(to),
      replace: (to) => navigate(to, { replace: true }),
      subscribe: () => () => {},
    }),
    [navigate],
  );
}
