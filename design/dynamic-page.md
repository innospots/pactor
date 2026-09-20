# 动态页面模板

- 需要提供一个构建动态页面项目的示例工程 starter
- 开发者在入口中配置一个或多个接口url，此接口会返回一个类似 sitemap 的对象
- 此对象中定义了页面的 url、页面名称、页面结构、构建页面的 dsl 等信息

## Sitemap 对象结构（方案 B，已选定）

扁平 `pages` + 独立 `menus` + DSL 布局 `layouts`。完整示例见
`dynamic-page.sitemap.jsonc`。

```ts
import type { DslNode, MenuItem, PageDsl } from 'pactor-app';

/** 布局定义：DSL 描述外壳结构，PageOutlet 组件为页面内容出口。
 * 不套 PageDsl 的 page 包装——id 即 layouts 的键，无重复声明 */
export interface LayoutDsl {
  dsl: string;
  body: DslNode; // 内嵌一个 PageOutlet 标记页面渲染位置
}

/** 页面定义：id 主键；pageDsl 缺省 → loadPage(id) 懒加载 */
export interface SitemapPageEntry {
  id: string;
  path: string; // 页面 url，支持 /reports/:id 参数
  title: string; // 页面名称
  version?: number; // 单页版本，参与缓存键 id@version
  pageDsl?: PageDsl; // 内联页面 DSL；缺省 = 懒加载
}

/** 菜单/路由条目：现有 MenuItem + layout 引用 + public 标记。
 * type: 'page' 且带 pageId 时，path / title 缺省从引用页面继承，
 * 仅在导航与页面分叉（菜单标题 ≠ 页面标题等）时显式覆写；
 * group / link 不是页面，只出现在 menus 中，title / path 自带 */
export interface SitemapMenuItem extends MenuItem {
  pageId?: string; // 引用 pages[].id（已有字段）
  layout?: string; // 引用 layouts 的键；缺省用顶层 layout
  public?: boolean; // 免登录可访问（登录/注册/落地页）
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
```

### 关键约定

- **布局**：`layouts` 以名称为主键，DSL 定义外壳结构，内嵌 `PageOutlet`
  组件标记页面内容出口；布局 DSL 与页面 DSL 共用作用域链与动作体系——
  可读 `user` / `app` / `menus`（合并 pages 后的可见菜单树）作用域，
  节点 `events` 可挂标准动作（如 header 右侧用户下拉的退出登录：
  `request` 调宿主服务 + `navigate` 回登录页）。`menus` 条目经 `layout`
  字段引用，缺省回退顶层 `layout`
- **懒加载**：`pages[].pageDsl` 缺省时运行时 `loadPage(id)` 按需获取；
  `version` 参与缓存键 `id@version`，sitemap 经 etag 条件请求刷新后按页
  diff 失效。内联与懒加载可在同一对象中混用
- **登录/注册**：对应 menus 条目 `public: true` + `layout: 'login'` +
  `hidden: true`；匿名请求时 `user` / `permissions` 缺省；未登录访问非
  public 页重定向 `auth.loginPath`
- **一致性**：`type: 'page'` 的 menus 条目经 `pageId` 引用页面，`path` /
  `title` 缺省继承自 `pages[]`，仅在导航与页面分叉时覆写；路由匹配与
  守卫消费合并后的条目

### 动态菜单与角色

对象结构不为角色建模——sitemap 端点按会话裁剪内容，是动态性的唯一来源：

- **端点会话感知**：匿名请求返回 public 页（登录/注册）+ 空 menus 或
  公共菜单；登录后返回该角色可见的 menus / pages / permissions。同一
  URL，不同用户拿到不同 sitemap
- **登录/登出触发重取**：认证状态变化时失效 sitemap 缓存并重新拉取
  （或沿用现有模式：登录成功后整页重载，bootstrap 自然重来）。
  安全要求：登出 MUST 清空本地 sitemap / 页面缓存，避免同一浏览器上
  前一个用户的页面残留给后一个用户
- **etag 按会话区分**：条件请求必须带会话凭证，缓存键不能跨用户共享
- **细粒度 UI 过滤**：同一角色内更细的显隐/禁用，仍用 menus 条目的
  `permission` 字段走现有 @pactor-app/permission 守卫（客户端滤镜，
  不承担安全职责）
- **多源拆分（可选）**：公共部分（登录/注册/落地页，静态可缓存）与
  角色相关部分（业务菜单，会话感知）可拆成两个接口，经 `sources`
  数组合并——静态源命中 CDN 缓存，动态源按会话刷新
- **多接口 URL**：入口配 `sources: [url1, url2]`，`pages` / `menus` /
  `layouts` 按键合并，`id` / `path` 冲突后源覆盖前源并 dev 告警；
  `app` / `user` / `permissions` / `auth` 取第一个源

### 落地影响（实现时需补的能力）

1. `@pactor-app/resource`：`SitemapDslLoader`——内联 `pageDsl` 预置进
   `id@version` 缓存，缺省项走 `loadPage`；认证状态变化时失效 sitemap
   缓存并重取，登出时清空全部本地缓存（不跨用户残留）；
   `DslResourceLoader` 接口不变
2. `@pactor-app/router`：`SitemapMenuItem` 的 `layout` / `public` 字段
   透传；构建 MenuRegistry 前把 `type: 'page'` 条目与 `pages[]` 合并
   （`path` / `title` 继承）；路由守卫：非 public + 无 user → 重定向
   `loginPath`
3. `@pactor-app/ui`：注册 `PageOutlet` 组件；布局解析从固定注册表扩展为
   DSL 布局（`layouts[name]` 渲染，页面塞进 PageOutlet）；表达式作用域对
   布局 DSL 暴露 `menus`（现有内建布局内部消费菜单树，未开放为作用域，
   需新增）
