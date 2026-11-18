# __APP_NAME__

基于 **Next.js + Pactor** 的多业务前端起始工程：一个统一宿主 `web-shell` + 多个可独立开发、以 npm 包交付的业务模块 `pactor-apps/*`。提炼自 `innospots-apps-template`，作为本仓库多应用架构的参考起点。

外壳能力（一级菜单 / 皮肤设置 / 布局外壳、Runtime DSL API、模块装配 CLI）全部来自 **`@pactor-app/shell`** 包（本仓库 `packages/shell`），`web-shell` 为最薄宿主示范：

- **构建期装配**：`pactor-shell assemble` 扫描已安装的模块包，生成路由、菜单、页面索引与注册表；
- **运行期渲染**：页面由 Pactor 的 YAML DSL 描述，`PactorShellHost` 通过 `/api/runtime/*` 加载页面、片段与布局；
- **模块交付物**：模块工程产出 `dist-module/`（Manifest V1 + DSL + client bundle + assets + 可选 server bundle），打包为 tgz 后由 Shell 以 `file:` 依赖安装。

更完整的架构、模块契约与排查手册见 [`web-shell/README.md`](web-shell/README.md)。

## 目录结构

```text
apps-shell-starter/
├── web-shell/                       # 统一 Web Shell（Next.js 最薄宿主，端口 9020）
│   ├── src/
│   │   ├── app/                     # Next 路由：工作区入口 + runtime/auth/modules API
│   │   ├── frontend/                # WorkspaceShell（AppShell + PactorShellHost）
│   │   ├── backend/                 # 演示会话占位与 CORS（无业务数据）
│   │   ├── shared/types/            # 模块入口的通配类型声明
│   │   ├── shell/sitemap.yaml       # 品牌 + 全量导航（模块菜单统一 hidden）
│   │   └── modules/                 # module-list.json（启停 / menuMode / access）与基础皮肤 theme.css
│   ├── scripts/                     # smoke-module-api 冒烟脚本
│   ├── .generated/pactor/           # 装配产物（pactor-shell assemble 生成，已 gitignore）
│   ├── public/modules/              # 模块静态资源 <moduleId>/<version>/（含 i18n/）
│   └── public/themes/               # 预置皮肤 CSS（pactor-shell theme sync 生成）
└── pactor-apps/
    ├── general-app/                 # 通用业务应用（8030：工作台/数据概览/系统管理，含 server entry 与 i18n）
    ├── data-analysis/               # 数据分析（8021，纯 DSL：看板/报表/用户分析/详情）
    └── product-center/              # 产品中心（8022，纯 DSL：产品管理/配置/任务看板）
```

每个业务模块工程结构一致（`general-app` 是完整示例）：

```text
pactor-apps/<app>/
├── src/
│   ├── app/                       # Next 路由与 API 薄入口
│   ├── frontend/                  # PactorApp、自定义组件、组件文案与样式
│   ├── backend/
│   │   ├── api/                   # 业务数据实现（可选）
│   │   ├── fixtures/              # 演示数据（可选）
│   │   └── pages/                 # sitemap.ts + yaml/{sitemap.yaml,<模块>/*.yaml}
│   └── shared/                    # 同构类型 / 纯函数（可选）
├── module/
│   ├── client.ts                  # 扩展注册表入口（components / actions）+ 样式 import
│   └── server.ts                  # 模块服务端 API（可选）
├── public/i18n/                   # 页面语言包 + 可翻译字段（随模块资源分发，可选）
├── pactor.module.json             # 模块打包配置
└── dist-module/                   # pactor module build 产物（不进 git）
```

## 配置速查

| 配置 | 文件 | 作用 |
| --- | --- | --- |
| 模块启停 / 菜单接入 | `web-shell/src/modules/module-list.json` | 哪些模块参与装配、`menuMode`、`access`、可选 `basePath` 覆盖 |
| 模块打包契约 | `pactor-apps/<app>/pactor.module.json` | 模块 id、basePath、yamlRoot、client/server 入口、API 前缀、target |
| 包导出 | `pactor-apps/<app>/package.json` | `exports`：`./manifest`、`./client`、`./styles.css`、可选 `./server` |
| 导航 | `web-shell/src/shell/sitemap.yaml` | 品牌 + 全量菜单（全局 `pageId` + 显式 `path`） |
| 国际化（页面） | 模块 `public/i18n/<locale>/app.yaml` + `fields.json` | DSL 文案与自定义组件可翻译字段 |
| 国际化（组件） | 模块 `src/frontend/i18n/messages.ts` + `locale.tsx` | React 组件内的文案与语言切换 |
| 基础皮肤 | `web-shell/src/modules/styles/theme.css` | 皮肤系统默认基底；预置皮肤由 theme sync 生成 |
| 会话 | `web-shell/src/backend/session.ts` | 演示会话占位，接真实登录时替换 |
| 路由重定向 | `web-shell/next.config.ts` | `/`、`/workspace` 指向 general-app 工作台 |

## 环境要求

- Node.js 20+
- pnpm（每个工程独立安装依赖；根仓库 workspace **不包含** `starters/`，各工程自带 `pnpm-workspace.yaml`）
- 本仓库 `packages/*` 已构建（在仓库根执行 `pnpm build`）。示例工程中 `@pactor-app/*`、`pactor-app`、`@pactor-app/cli` 以 `link:` 指向本仓库源码，随源码演进。

## 快速开始

**顺序很重要：模块先 pack，Shell 再 install**（Shell 以 `file:` 引用模块 tgz）。

### 1. 打包三个示例模块

```bash
cd pactor-apps/general-app && pnpm install && pnpm pack:module
cd ../data-analysis && pnpm install && pnpm pack:module
cd ../product-center && pnpm install && pnpm pack:module
```

`pack:module` = `pactor module pack --no-bump`（含 build），产出 `dist-module/` 与 `<name>-<version>.tgz`。示例模块的 pack 脚本默认 `--no-bump`：版本固定，tgz 文件名稳定，Shell 侧的 `file:` 引用无需跟随变化。

### 2. 启动 Shell

```bash
cd web-shell
pnpm install             # 安装三个 tgz 与 @pactor-app/* 依赖
pnpm assemble:modules    # 读取已安装模块，生成 .generated/ 与 public/modules/
pnpm dev                 # http://localhost:9020
```

生产构建与启动：

```bash
pnpm build   # pactor-shell assemble → validate → theme sync → next build
pnpm start   # http://localhost:9020
```

### 3. 独立运行某个业务模块

```bash
cd pactor-apps/general-app
pnpm install
pnpm dev      # http://localhost:8030
```

`data-analysis` 端口 8021、`product-center` 端口 8022，同理。独立运行时页面与 API 都在本工程内；打包进 Shell 后由 Shell 统一承接。

当前默认页面：

| 模块 | 公开路径 | 说明 |
| --- | --- | --- |
| general-app | `/general-app/*` | 工作台 / 数据概览 / 系统管理（系统设置 / 字典 / 审计 / 角色 / 用户），含 `/api/general-app/*` 服务端 API 与中英文语言包 |
| data-analysis | `/data-analysis/*` | 数据看板 / 数据报表 / 用户分析 / 数据详情 |
| product-center | `/product-center/*` | 产品管理 / 产品配置设置 / 产品状态任务看板 |

## 模块化配置

### 1. 宿主侧：`web-shell/src/modules/module-list.json`

装配器只处理 `enabled: true` 的项，不会扫描整个 `node_modules`：

```json
{
  "modules": [
    { "package": "data-analysis",  "enabled": true, "menuMode": "hidden", "access": "public" },
    { "package": "product-center", "enabled": true, "menuMode": "hidden", "access": "public" },
    { "package": "general-app",    "enabled": true, "menuMode": "hidden" }
  ]
}
```

| 字段 | 说明 |
| --- | --- |
| `package` | npm 包名；必须提供 `exports["./manifest"]` 与 `./client` |
| `enabled` | 是否参与本次装配 |
| `basePath` | 可选；覆盖模块 manifest 的 `basePath`（URL 前缀） |
| `menuMode` | 可选；`merge`（默认，模块菜单并入导航）或 `hidden`（只注册隐藏路由，导航由 Shell 定义） |
| `access` | 可选；`public` 时模块内未声明 `public` 的页面默认公开 |

模块页面路径 = `basePath` + 模块 sitemap 的 `pages[].path`；模块 API 公开路径 =
`/api/modules/<manifest.id>/<原 /api 之后的路径>`（构建时 DSL 中的模块 API URL 会自动改写）。

### 2. 模块侧：`pactor-apps/<app>/pactor.module.json`

```json
{
  "id": "pactor-app-general-app",
  "name": "general-app",
  "basePath": "/general-app",
  "yamlRoot": "src/backend/pages/yaml",
  "clientEntry": "module/client.ts",
  "serverEntry": "module/server.ts",
  "apiPrefixes": ["/api/general-app"],
  "actions": [],
  "publicDir": "public",
  "target": "innospots-web-shell@3",
  "access": { "default": "authenticated" },
  "tailwind": { "enabled": false }
}
```

| 字段 | 说明 |
| --- | --- |
| `id` | 模块 id；进入 `globalPageId = <id>:<pageId>` 与资源目录 |
| `basePath` | 路由前缀；`target: innospots-web-shell@*` 时禁止 `/` |
| `yamlRoot` | sitemap 与页面 DSL 的根目录（相对工程） |
| `clientEntry` | client bundle 入口：导出具名 `extensions`（components / actions） |
| `serverEntry` + `apiPrefixes` | 可选，成对出现；server bundle 由 Shell 的 `/api/modules/*` 统一分发 |
| `publicDir` | 静态资源目录，构建时复制为 `dist-module/assets`，装配后挂到 `/modules/<id>/<version>/` |
| `target` | 装配契约版本；`@3` 支持 server entry，纯 DSL 可用 `@2` |
| `access.default` | `authenticated`（默认，不改动页面访问声明）或 `public`（缺省补 `public: true`） |
| `tailwind` | 模块 CSS 是否需要 Tailwind 预编译（示例模块为 false） |

模块 `package.json` 的 `exports` 必须包含：

```json
{
  "./manifest": "./dist-module/manifest.json",
  "./client": "./dist-module/client/index.js",
  "./styles.css": "./dist-module/client/index.css",
  "./server": "./dist-module/server/index.mjs"
}
```

无 server 的纯 DSL 模块去掉 `./server`；无样式产物时可去掉 `./styles.css`。

### 3. 模块生命周期

```bash
pnpm build:module   # pactor module build → dist-module/
pnpm pack:module    # build + npm pack → <name>-<version>.tgz
# Shell 侧
pnpm install --force
pnpm assemble:modules && pnpm validate:modules
```

`pnpm dev` **不会**监听模块包或自动 re-assemble；改动模块 YAML / 组件 / server 后必须重走上述流程。

## 菜单配置

当前策略：**所有模块 `menuMode: "hidden"`，导航统一在 `web-shell/src/shell/sitemap.yaml` 定义**。模块自带菜单只保留为隐藏路由（直达 URL 可用），不进入导航。

### 1. Shell 菜单写法

```yaml
# web-shell/src/shell/sitemap.yaml
menus:
  - { id: workspace, type: page, pageId: "pactor-app-general-app:workspace", path: /general-app/workspace, title: 工作台, icon: workspace }

  - id: system
    type: group
    title: 系统管理
    icon: settings
    children:
      - { id: system-settings, type: page, pageId: "pactor-app-general-app:system-settings", path: /general-app/settings/general, title: 系统设置 }

  - id: data-analysis
    type: group
    title: 数据分析
    icon: chart
    children:
      - { id: da-dashboard, type: page, pageId: "pactor-app-data-analysis:dashboard", path: /data-analysis/dashboard, title: 数据看板, public: true }
```

| 字段 | 说明 |
| --- | --- |
| `id` | 菜单 id；与包默认站点同名时覆盖默认条目（如 `workspace` / `themes`） |
| `type` | `page`（叶子路由）或 `group`（分组，可含 children） |
| `pageId` | **全局页面 id**（`<moduleId>:<pageId>`）；校验会在页面索引中查找 |
| `path` | 公开路径；跨模块引用必须显式写（Shell 不会自动推导模块页面 path） |
| `title` / `icon` | 导航文案与图标（内置图标名，如 `workspace` / `chart` / `settings`） |
| `hidden` | 不显示在导航，但路由保留 |
| `permission` | 需要登录且具备权限；叶子也会跟随目标页面的 `public` / `permission` |
| `activeMenu` | 详情页高亮父菜单 |
| `badge` | 菜单徽标（数字或字符串） |
| `children` | 分组子项，结构相同 |

补充规则：

- 包默认站点（登录 / 主题设置 / 个人中心 / 错误页）的菜单按 `id` 合并；要完全接管导航，用同名 `id` 覆盖或 `hidden: true`。
- 页面访问控制仍由服务端 `filterVisibleMenus` 按目标页面的 `public` / `permission` 裁剪；匿名访问非 public 页面会重定向到 `auth.loginPath`（默认 `/login`）。
- 修改菜单后执行 `pnpm assemble:modules`；运行期不再读 sitemap 文件。

### 2. 菜单如何到达页面

```text
模块 sitemap.menus ─┐
Shell sitemap.menus ─┼─▶ pactor-shell assemble ─▶ .generated/pactor/menus.json
包默认 sitemap.menus ┘                              │
                                                   ▼
                    GET /api/runtime/bootstrap（按会话 / 权限过滤）
                                                   │
                                                   ▼
              PactorShellHost → SitemapApp → data.session.menus
                                                   │
                                                   ▼
                   @pactor-app/shell admin 布局的 NavigationShell 渲染
```

### 3. 使用模块自带菜单（可选）

把对应模块的 `menuMode` 改为 `merge`（或删掉该字段，默认即 merge），模块 sitemap 的 `menus` 会并入导航；模块页面 path 由装配器按 `basePath + pages[].path` 推导。菜单级 `layout` 与 Shell 同名布局合并时 Shell 优先。

接入新模块到统一导航：`menuMode: "hidden"` + 在 Shell sitemap 增加菜单条目，然后重新装配。

## 国际化配置

分两层：**页面 DSL 文案**（服务端本地化）和 **React 组件文案**（客户端）。

### 1. 页面 DSL 文案

模块页面用 `$i18n{key:默认值}` 声明，语言包放在模块 `public/i18n/` 下：

```yaml
# src/backend/pages/yaml/general-app/workspace.yaml（general-app 实际使用）
page:
  id: workspace
  title: "$i18n{page.workspace.title:工作台}"
i18n: { namespaces: [app] }
body:
  type: Page
  children:
    - type: Text
      props: { text: "$i18n{workbench.data.title:数据经营}" }
```

```yaml
# public/i18n/zh-CN/app.yaml
page.workspace.title: 工作台
workbench.data.title: 数据经营

# public/i18n/en-US/app.yaml
page.workspace.title: Workspace
workbench.data.title: Analytics
```

- 语言包是**扁平点分 key**，`fields.json` 声明自定义组件的可翻译字段：

```json
{
  "components": {
    "FilterSelect": ["props.label", "props.options[*].label"],
    "WorkbenchEntry": ["props.title", "props.description"]
  },
  "actions": { "overlay.open": "params.overlay.title" }
}
```

- 构建期：`public/i18n/` 随模块 assets 进入 `dist-module/assets/i18n/`；装配后位于
  `public/modules/<moduleId>/<version>/i18n/`。
- 运行期：`web-shell/src/app/api/runtime/pages/[pageId]/route.ts` 根据 `globalPageId` 的
  `moduleId:` 前缀找到模块语言包，经 `localizePageDsl` 转换后下发；`fields.json`
  与默认字段注册表合并。
- 语言选择：`?locale=` → `locale` Cookie → `Accept-Language`；缺省 `zh-CN`。
  支持列表在 Shell 路由的 `LOCALE_CONFIG` 中维护（当前 `zh-CN` / `en-US`）。
- 语言包缺失或字段未注册时，端点会记录告警并回退原文（`$i18n` 内联默认值仍可显示）。
- 菜单标题来自 sitemap 静态配置，**不参与**页面 DSL 本地化；切换英文只影响页面内容与组件文案。

### 2. React 组件文案

模块自己的 React 视图使用模块内文案表（`general-app` 为完整示例）：

```text
src/frontend/i18n/
├── locale.tsx     # useLocale：Cookie / URL / 浏览器语言 → locale + changeLocale
└── messages.ts    # useHostI18n：translate + 当前 locale
```

- 组件里通过 `useHostI18n()` 取 `t()`；
- `changeLocale` 会写 `locale` Cookie 与 URL 参数，并触发同页刷新；
- 与页面 DSL 使用同一套 locale 来源，切换后服务端页面与客户端组件同时生效；
- Shell 自带页面（登录 / 主题设置 / 个人中心 / 错误页）为直写中文，不经过模块语言包。

### 3. 新增语言

1. 模块 `public/i18n/<locale>/app.yaml` 增加对应语言文件；
2. Shell 路由的 `LOCALE_CONFIG.supportedLocales` 增加该 locale（如 `ja-JP`）；
3. 组件的 `messages.ts` / `locale.tsx` 增加该语言分支（如使用组件文案）；
4. 重新 `build:module`、`pack:module`、`install`、`assemble`。

## 其他宿主配置

- **皮肤**：基础皮肤在 `web-shell/src/modules/styles/theme.css`；预置皮肤由
  `pactor-shell theme sync` 复制到 `public/themes/`，首屏由 `SkinHeadScript` 恢复，
  切换器在「主题设置」页。CI 可用 `pactor-shell theme check` 防漂移。
- **会话**：`web-shell/src/backend/session.ts` 是演示占位（`admin / admin123`，cookie
  `pactor_demo_session`）；接真实登录时替换 `findAccount` / `findUserBySession`，
  `bootstrap` 路由通过 `createRuntimeHandlers({ cookies, resolveUser })` 注入。
- **重定向**：`web-shell/next.config.ts` 将 `/` 与 `/workspace` 指向
  `/general-app/workspace`。
- **端口**：web-shell 9020、general-app 8030、data-analysis 8021、product-center 8022。

## 替换为自己的业务模块

以 `general-app`（完整：页面 + 组件 + server entry + i18n）或 `data-analysis` /
`product-center`（纯 DSL 页面示例）为模板复制一份，然后修改：

| 位置 | 修改内容 |
| --- | --- |
| `package.json` | `name`、`version`、dev 端口、`exports` |
| `pactor.module.json` | `id`、`name`、`basePath`、`yamlRoot`、`clientEntry`、可选 `serverEntry`/`apiPrefixes` |
| `src/backend/pages/yaml/` | sitemap 与页面 DSL（目录名与页面 id 对应） |
| `src/frontend/`、`module/client.ts` | 自定义组件 / Actions 与组件文案 |
| `module/server.ts` | 业务 API（可选，参考 general-app） |
| `public/i18n/` | 页面语言包与可翻译字段（可选，参考 general-app） |
| web-shell `package.json` | 安装新模块 tgz |
| web-shell `src/modules/module-list.json` | 启用模块并设置 `menuMode` / `access` |
| web-shell `src/shell/sitemap.yaml` | 统一导航下增加菜单条目（全局 `pageId` + 显式 `path`） |

也可以使用 `pactor create <name>` 生成基础工程，再执行 `pactor module init` 补齐模块接入面。

## 验证

```bash
# 模块独立运行
cd pactor-apps/data-analysis && pnpm build

# Shell 装配与构建
cd web-shell && pnpm assemble:modules && pnpm validate:modules && pnpm build

# Shell 运行中：模块 API 分发冒烟（GET/HEAD/OPTIONS/405/404）
pnpm smoke:module-api
```
