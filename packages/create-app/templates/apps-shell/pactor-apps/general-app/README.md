# General App（通用业务应用）

工作台 / 数据概览 / 系统管理（系统设置 / 字典管理 / 审计日志 / 角色管理 / 用户管理）
的完整业务应用，以 **Pactor UI 模块** 交付：

- **页面**：`src/server/yaml/general-app/*.yaml`（YAML DSL，路径经 Shell 装配后加
  `basePath` 前缀）；
- **组件**：`src/pactor/components/**`，经 `module/client.ts` 注册为 DSL 组件；
- **数据**：`src/server/api/**`（演示数据，进程内可变），独立运行走
  `/api/general-app/*`，接入 Shell 后走 `/api/modules/pactor-app-general-app/*`；
- **文案**：`public/i18n/<locale>/app.yaml` 语言包 + `public/i18n/fields.json`
  自定义组件可翻译字段；随模块 public 资源分发。

## 运行

```bash
pnpm install
pnpm dev        # http://localhost:8030（/ 会跳转 /workspace）
```

独立运行时布局为无导航空壳；接入 Shell 后由 Shell 的 `admin` 布局（rail 导航）
接管，菜单/页面按会话与 permission 裁剪。

## 打包与接入

```bash
pnpm build:module   # dist-module/（Manifest V1 + DSL + client + server + assets）
pnpm pack:module    # general-app-0.1.0.tgz（版本固定，供 Shell 以 file: 引用）
```

Shell 侧：

```bash
cd ../../web-shell
pnpm install --force        # 重新安装 tgz
pnpm assemble:modules       # 生成 .generated/ 并把模块资源复制到 public/modules/
pnpm dev
```

公开路径：`/general-app/workspace`、`/general-app/dashboard`、
`/general-app/settings/*`；模块 API：`/api/modules/pactor-app-general-app/*`。

> 模块 sitemap 里的 `menus` 仅用于本工程独立运行。接入 Shell 时宿主把模块设为
> `menuMode: "hidden"`，导航统一由 `web-shell/src/shell/sitemap.yaml` 定义，
> 因此新增页面后需要在 Shell 侧补一条菜单（全局 `pageId` + 显式 `path`）。

## 结构

| 路径 | 说明 |
| --- | --- |
| `app/` | 独立运行入口（PactorApp 常驻 layout、sitemap API、业务 API 薄路由） |
| `app/api/general-app/[[...parts]]/route.ts` | 独立运行业务 API 分发 |
| `app/api/sitemap/route.ts` | 独立运行 sitemap（按 locale 本地化后内联 DSL） |
| `module/client.ts` | 模块 client entry：组件注册 + 样式入口 |
| `module/server.ts` | 模块 server entry：`/api/general-app/*` 逻辑路径 handler |
| `src/server/api/` | 业务数据实现（独立运行与模块分发共用） |
| `src/server/fixtures/` | 演示数据（用户 / 角色 / 字典 / 审计 / 设置 / 账号） |
| `src/server/yaml/` | sitemap 与页面 DSL |
| `src/pactor/` | PactorApp 配置、自定义组件、组件文案（useHostI18n）与样式 |
| `public/i18n/` | 页面语言包与可翻译字段注册表（随模块资源分发） |
