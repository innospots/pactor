# Apps Shell Starter

基于 **Next.js + Pactor** 的多业务前端起始工程：一个统一宿主 `web-shell` + 多个可独立开发、以 npm 包交付的业务模块 `pactor-apps/*`。提炼自 `innospots-apps-template`，作为本仓库多应用架构的参考起点。

外壳能力（一级菜单 / 皮肤设置 / 布局外壳、Runtime DSL API、模块装配 CLI）全部来自 **`@pactor-app/shell`** 包（本仓库 `packages/shell`），`web-shell` 为最薄宿主示范。

- **构建期装配**：`pactor-shell assemble`（`@pactor-app/shell` 的 CLI）在构建前扫描已安装的模块包，生成路由、菜单、页面索引与注册表；
- **运行期渲染**：页面由 Pactor 的 YAML DSL 描述，`PactorShellHost`（`@pactor-app/shell/client`）通过 `/api/runtime/*` 加载页面、片段与布局；
- **模块交付物**：模块工程产出 `dist-module/`（Manifest V1 + DSL + client bundle + assets + 可选 server bundle），打包为 tgz 后由 Shell 以 `file:` 依赖安装。

更完整的架构、模块契约与排查手册见 [`web-shell/README.md`](web-shell/README.md)。

## 目录结构

```text
apps-shell-starter/
├── web-shell/                       # 统一 Web Shell（Next.js 最薄宿主，端口 9020）
│   ├── app/
│   │   ├── (workspace)/[...slug]/   # 工作区页面入口（AppShell + PactorShellHost，所有模块页面在此渲染）
│   │   └── api/
│   │       ├── runtime/             # bootstrap / pages（按模块语言包本地化）/ fragments
│   │       ├── auth/                # 演示会话（真实项目替换）
│   │       └── modules/[moduleId]/  # createModuleDispatcher(moduleServers)（/api/modules/<id>/*）
│   ├── src/
│   │   ├── shell/                   # Shell 站点定制层（sitemap.yaml；布局/页面回退包默认站点）
│   │   ├── backend/                 # 演示会话占位与 CORS（无业务数据）
│   │   └── modules/                 # module-list.json（启停 / menuMode / access）与基础皮肤 theme.css
│   ├── scripts/                     # smoke-module-api 冒烟脚本（assemble / validate 由 pactor-shell CLI 承接）
│   ├── .generated/pactor/           # 装配产物（pactor-shell assemble 生成，已 gitignore）
│   ├── public/modules/              # 模块静态资源 <moduleId>/<version>/（含 i18n/）
│   └── public/themes/               # 预置皮肤 CSS（pactor-shell theme sync 生成）
└── pactor-apps/
    ├── general-app/                 # 通用业务应用（端口 8030：工作台/看板/系统管理，含 server entry 与 i18n）
    ├── data-analysis/               # 数据分析（端口 8021，纯 DSL：看板/报表/用户分析/详情）
    └── product-center/               # 产品中心（端口 8022，纯 DSL：产品管理/配置/任务看板）
```

每个业务模块工程结构一致（`general-app` 是完整示例）：

```text
pactor-apps/<app>/
├── app/                           # 独立运行入口（PactorApp、sitemap API、业务 API 薄路由）
├── module/                        # 模块接入面
│   ├── client.ts                  # 扩展注册表入口（components / actions）+ 样式 import
│   └── server.ts                  # 模块服务端 API（可选）
├── src/
│   ├── server/yaml/               # sitemap 与页面 DSL
│   ├── server/api/                # 业务数据实现（独立运行与 server entry 共用）
│   ├── server/fixtures/           # 演示数据（可选）
│   ├── pactor/                    # PactorApp 配置、自定义组件、组件文案与样式
│   └── shared/                    # 前后端共享类型 / 纯函数（可选）
├── public/i18n/                   # 页面语言包 + 可翻译字段（随模块资源分发，可选）
├── pactor.module.json             # 模块打包配置
└── dist-module/                   # pactor module build 产物（不进 git）
```

## 环境要求

- Node.js 20+
- pnpm（各子工程独立安装依赖，本目录没有 workspace 配置）
- 本仓库 `packages/*` 已构建（在仓库根执行 `pnpm build`）。所有 `@pactor-app/*`、`pactor-app`、`@pactor-app/cli` 均以 `link:` 指向本仓库源码，随源码演进。

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
pnpm install             # 若模块版本已变化，先用 pnpm add 更新 tgz 引用（见下文）
pnpm assemble:modules    # 读取已安装的模块包，生成 .generated/ 与 public/modules/
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

## 模块改动后的再发布流程

示例模块的 `pack:module` 固定版本（`--no-bump`），tgz 文件名不变，流程只有两步：

```bash
# 1. 模块侧：重新打包（覆盖同名 tgz）
cd pactor-apps/data-analysis && pnpm pack:module

# 2. Shell 侧：重新安装该模块并装配
cd ../../web-shell
pnpm install --force
pnpm assemble:modules && pnpm dev
```

`pnpm dev` **不会**监听模块包或自动 re-assemble，改模块后必须重走上述流程。

> 如果去掉了 `--no-bump` 或手动 bump 了模块版本，tgz 文件名会变化，需要在 Shell 侧
> `pnpm add ../pactor-apps/<app>/<name>-<new-version>.tgz` 更新 `file:` 引用后再装配。

## 替换为自己的业务模块

以 `general-app`（完整：页面 + 组件 + server entry + i18n）或 `data-analysis` / `product-center`（纯 DSL 页面示例）为模板复制一份，然后修改：

| 位置 | 修改内容 |
| --- | --- |
| `package.json` | `name`、`version`、dev 端口 |
| `pactor.module.json` | `id`、`name`、`basePath`、`yamlRoot`、`apiPrefixes` |
| `src/server/yaml/` | sitemap 与页面 DSL（目录名与 `id` 对应） |
| `src/pactor/`、`module/client.ts` | 自定义组件 / Actions 与组件文案 |
| `module/server.ts` + `pactor.module.json` 的 `serverEntry`/`apiPrefixes` | 业务 API（可选，参考 general-app） |
| `public/i18n/` | 页面语言包与可翻译字段（可选，参考 general-app） |
| web-shell `package.json` | `pnpm add` 新模块 tgz |
| web-shell `src/modules/module-list.json` | 启用新模块（`enabled` / `menuMode` / `access`）；接入统一导航时设 `menuMode: "hidden"` |
| web-shell `src/shell/sitemap.yaml` | 在 Shell 统一定义菜单条目（全局 `pageId` + 显式 `path`） |

也可以使用 `pactor create <name>` 生成基础工程，再执行 `pactor module init` 补齐模块接入面。

## 端口约定

| 工程 | 端口 |
| --- | --- |
| web-shell | 9020 |
| general-app | 8030 |
| data-analysis | 8021 |
| product-center | 8022 |

## 验证

```bash
# Shell 运行中：模块 API 分发冒烟（GET/HEAD/OPTIONS/405/404）
cd web-shell && pnpm smoke:module-api
```
