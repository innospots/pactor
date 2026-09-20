import type { DslNode, PageDsl } from '@pactor-app/core';
import type { BootstrapResource } from '@pactor-app/resource';
import type { MenuItem } from '@pactor-app/router';

/**
 * Sitemap 对象结构（design/dynamic-page.md，方案 B）：
 * 扁平 pages + 独立 menus + DSL 布局 layouts。
 * 服务端按会话裁剪内容（匿名 / 角色），对象本身不为角色建模。
 */

/** 布局定义：DSL 描述外壳结构，PageOutlet 组件为页面内容出口。
 * 不套 PageDsl 的 page 包装——id 即 layouts 的键，无重复声明 */
export interface LayoutDsl {
  dsl: string;
  body: DslNode;
}

/** 页面定义：id 主键；pageDsl 缺省 → loadPage(id) 懒加载 */
export interface SitemapPageEntry {
  id: string;
  /** 页面 url，支持 /reports/:id 参数 */
  path: string;
  title: string;
  /** 单页版本，参与缓存键 id@version */
  version?: number;
  /** 内联页面 DSL；缺省 = 懒加载 */
  pageDsl?: PageDsl;
}

/** 菜单/路由条目：MenuItem + layout 引用 + public 标记。
 * type: 'page' 且带 pageId 时，path / title 缺省从引用页面继承，
 * 仅在导航与页面分叉时显式覆写；group / link 只出现在 menus 中 */
export interface SitemapMenuItem extends MenuItem {
  /** 引用 layouts 的键；缺省用顶层 layout */
  layout?: string;
  /** 免登录可访问（登录/注册/落地页） */
  public?: boolean;
  children?: SitemapMenuItem[];
}

export interface SitemapResource extends BootstrapResource {
  /** 应用级缺省布局名，引用 layouts 的键 */
  layout?: string;
  /** 匿名访问控制：未登录访问非 public 页时重定向到 loginPath */
  auth?: { loginPath?: string };
  layouts: Record<string, LayoutDsl>;
  pages: SitemapPageEntry[];
  menus: SitemapMenuItem[];
}

/** 可渲染路由匹配结果（resolveSitemapRoute 产物） */
export interface SitemapRouteMatch {
  pageId: string;
  layoutName: string;
  /** 菜单高亮 key：activeMenu 指向的菜单项 path（缺省自身 path） */
  highlightKey: string;
  params: Record<string, string>;
}
