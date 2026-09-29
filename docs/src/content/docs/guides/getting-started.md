---
title: 快速开始
description: 用官方模板一键生成可运行的 Pactor 动态页面工程——create-pactor-app 脚手架与 starters 模板说明
---

Pactor 是一套基于 YAML/JSON DSL 的 Server-Driven UI 前端运行时框架：页面用 YAML 描述，浏览器里的公共 Runtime 负责渲染，业务页面无需随前端代码一起打包。最快的上手方式是**从官方模板生成一个完整可运行的工程**，再在其上改成自己的业务。

## 环境要求

- Node.js >= 18
- pnpm >= 9（npm / yarn 亦可）

## 一键生成（推荐）

```bash
pnpm create pactor-app my-app              # 交互选择模板（非 TTY 默认 next-app）
pnpm create pactor-app my-app -t next-app  # Next.js 全栈模板（含 mock API）
pnpm create pactor-app my-app -t spa       # Vite 纯前端模板

cd my-app
pnpm install
pnpm dev
```

也可以直接克隆/复制仓库 `starters/` 下的同名模板目录（`starters/next-app-starter`、`starters/spa-starter`），脚手架模板就是由它们同步生成的。

## 模板：next-app（Next.js 全栈，dev :9011）

动态页面 starter：入口只需配置一个或多个返回 **sitemap 对象**的接口 URL，应用的页面 URL、页面名称、导航结构、布局与页面 DSL 全部由该对象驱动。核心能力（路由解析 / 匿名守卫 / DSL 布局 / 页面加载 / session 桥）由框架 `@pactor-app/app` 的 `SitemapApp` 内置，模板只做宿主接线。

```
app/
  layout.tsx               # PactorApp 挂载点（Next layout 跨导航常驻：
                           # 切换导航只刷新内容区，sitemap 不重复拉取）
  [[...slug]]/page.tsx     # 可选 catch-all：匹配全部站内路径，渲染为空
  api/
    sitemap/route.ts       # sitemap 端点（会话感知：匿名 / 角色裁剪）
    pages/[id]/route.ts    # 懒加载页面端点（PageResource envelope，接口侧鉴权）
    auth/login/route.ts    # 演示登录（写会话 cookie）
    auth/logout/route.ts   # 演示登出（清 cookie）
src/
  pactor/
    config.ts              # ★ 入口配置：sitemapSources 接口 URL 列表 + apiBaseUrl
    App.tsx                # 薄壳：框架 SitemapApp + 宿主路由（pathname / navigate）
  server/
    accounts.ts            # 演示账号与会话 cookie
    sitemap.ts             # mock sitemap 数据源（layouts / pages / menus 按角色裁剪）
    yaml/                  # DSL 文件：sitemap.yaml（入口元数据 + 布局 + 页面/菜单声明）
      pages/               # 页面 DSL（每页一个 *.page.yaml，按 id 约定加载）
```

演示账号：

| 账号 | 密码 | 角色差异 |
| --- | --- | --- |
| `admin` | `pactor123` | 可见「报表」菜单（`report:view`），月报页懒加载 |
| `guest` | `guest123` | 仅可见首页 |

匿名访问任意非 public 路径会重定向到 `/login`；登录 / 登出后整页重载，sitemap 端点按新会话重新裁剪内容。

## 模板：spa（Vite 纯前端，dev :9012）

纯前端（SPA）形态：Vite + React，无宿主框架。与 next-app 的关键差异——**不向 `SitemapApp` 传 `pathname` / `navigate`**，框架内置浏览器路由（History API 导航 + popstate 前进后退）接管全部路由：

```tsx
// src/pactor/App.tsx —— 全部装配
<SitemapApp
  sources={sitemapSources}    // sitemap 接口（相对路径）
  baseUrl={apiBaseUrl}        // 外部接口基准地址（相对路径补全）
  httpAdapter={httpHooks}     // 框架 createHttpHooks：跨域改写 + 响应拆包
/>
```

本模板不自带后端，接口复用 next-app 的 mock API（`apiBaseUrl` 缺省指向 `http://localhost:9011`，已开通 CORS）：

```bash
# 1. 启动接口服务（mock API：sitemap / 页面懒加载 / 认证）
cd next-app && pnpm install && pnpm dev   # :9011

# 2. 启动 spa 模板
cd spa && pnpm install && pnpm dev        # http://localhost:9012
```

## 改成自己的业务

模板即最佳实践的参考实现，按序替换即可：

1. **换页面**：改 `src/server/yaml/pages/*.page.yaml`（页面 DSL）与 `src/server/yaml/sitemap.yaml`（导航 / 布局 / 可见性），无需改动前端代码、无需重新打包
2. **换数据**：把 yaml 中 `dataSources` 的 mock 接口换成真实后端接口（页面声明 `type: http` 数据源）
3. **换外壳**：布局由 sitemap 的 `layouts` 字段驱动；主题换肤见[主题与换肤](/guides/theming/)
4. **接真实服务端**：sitemap / 页面 / 认证三个端点换成你的后端实现，前端零改动——接口形状以模板 mock 为契约（PageResource envelope 见 [@pactor-app/resource](/packages/resource/)）

## 下一步

- [手动安装](/guides/manual-setup/)：在已有工程中接入（安装、`createPactorApplication` 参数、嵌入模式）
- [数据流](/guides/data-flow/)：`${data.x}` 从哪来、何时更新、谁重渲染
- [事件与表单联动](/guides/events/)：动作编排、表单三级联动
- [自定义组件](/guides/custom-components/)：注册你的业务组件
- [DSL 参考](/reference/dsl/)：全部字段与组件 props 手册

## 参与框架开发（monorepo）

```bash
git clone https://github.com/426-330/pactor.git && cd pactor
pnpm install
pnpm build        # 构建全部包（ESM + CJS + d.ts）
pnpm test         # 全部测试
pnpm typecheck    # 全部包 TS 检查
pnpm docs:dev     # 本文档站（端口 4334）
```

示例工程：`examples/vite-starter`（最小上手）、`examples/admin`（shadcn 管理后台，含换肤）、`examples/chat`（AI 对话）。
