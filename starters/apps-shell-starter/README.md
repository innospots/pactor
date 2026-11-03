# Apps Shell Starter

基于 **Next.js + Pactor** 的多业务前端起始工程：一个统一宿主 `web-shell` + 多个可独立开发、以 npm 包交付的业务模块 `pactor-apps/*`。提炼自 `innospots-apps-template`，作为本仓库多应用架构的参考起点。

- **构建期装配**：Shell 在构建前扫描已安装的模块包，生成路由、菜单、页面索引与注册表；
- **运行期渲染**：页面由 Pactor 的 YAML DSL 描述，`PactorHost` 通过 `/api/runtime/*` 加载页面、片段与布局；
- **模块交付物**：模块工程产出 `dist-module/`（Manifest V1 + DSL + client bundle + assets + 可选 server bundle），打包为 tgz 后由 Shell 以 `file:` 依赖安装。

更完整的架构、模块契约与排查手册见 [`web-shell/README.md`](web-shell/README.md)。

## 目录结构

```text
apps-shell-starter/
├── web-shell/                       # 统一 Web Shell（Next.js 宿主，端口 9020）
│   ├── app/
│   │   ├── (workspace)/[...slug]/   # 工作区页面入口（所有模块页面在此渲染）
│   │   └── api/
│   │       ├── runtime/             # bootstrap / pages / fragments 运行时接口
│   │       └── modules/[moduleId]/  # 模块服务端 API 统一分发（/api/modules/<id>/*）
│   ├── src/
│   │   ├── shell/                   # Shell 自带站点（sitemap.yaml、shell.layout.yaml）
│   │   ├── modules/                 # module-list.json、注册表、路由解析、模块类型
│   │   ├── runtime/                 # PactorHost、扩展注册、Pactor 适配器
│   │   └── server/                  # bootstrap / pages / fragments / 模块 API 分发
│   ├── scripts/                     # assemble / validate / smoke 装配脚本
│   ├── .generated/pactor/           # 装配产物（生成物，勿手改）
│   └── public/modules/              # 模块静态资源 <moduleId>/<version>/
└── pactor-apps/
    ├── risk-analysis/               # 风险分析（端口 8021，含 server entry 示例）
    └── risk-decision/               # 风险决策（端口 8022，纯 DSL 模块示例）
```

每个业务模块工程结构一致：

```text
pactor-apps/<app>/
├── app/                           # 独立运行入口（PactorApp、sitemap API、可选业务 API）
├── module/                        # 模块接入面（由 pactor module init 生成）
│   ├── client.ts                  # 扩展注册表入口（components / actions）
│   ├── module.css                 # 模块自带样式（可选，由 client.ts import）
│   └── server.ts                  # 模块服务端 API（可选，--server 生成）
├── src/
│   ├── server/yaml/               # sitemap 与页面 DSL
│   ├── pactor/                    # PactorApp 配置、自定义组件与样式
│   └── server/api/                # 业务数据实现（独立运行与 server entry 共用）
├── pactor.module.json             # 模块打包配置
└── dist-module/                   # pactor module build 产物（不进 git）
```

## 环境要求

- Node.js 20+
- pnpm（各子工程独立安装依赖，本目录没有 workspace 配置）
- 本仓库 `packages/*` 已构建（在仓库根执行 `pnpm build`）。所有 `@pactor-app/*`、`pactor-app`、`@pactor-app/cli` 均以 `link:` 指向本仓库源码，随源码演进。

## 快速开始

**顺序很重要：模块先 pack，Shell 再 install**（Shell 以 `file:` 引用模块 tgz）。

### 1. 打包两个示例模块

```bash
cd pactor-apps/risk-analysis && pnpm install && pnpm pack:module
cd ../risk-decision && pnpm install && pnpm pack:module
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
pnpm build   # assemble:modules → validate:modules → next build
pnpm start   # http://localhost:9020
```

### 3. 独立运行某个业务模块

```bash
cd pactor-apps/risk-analysis
pnpm install
pnpm dev      # http://localhost:8021
```

`risk-decision` 同理，端口 8022。独立运行时页面与 API 都在本工程内；打包进 Shell 后由 Shell 统一承接。

当前默认页面：

| 模块 | 公开路径 | 说明 |
| --- | --- | --- |
| risk-analysis | `/pactor-app-risk-analysis` | 风险数据取值页，含 `/api/risk-analysis/*` 服务端 API |
| risk-decision | `/pactor-app-risk-decision` | 风险决策页；`/pactor-app-risk-decision/integration-logs` 为隐藏路由 |

## 模块改动后的再发布流程

示例模块的 `pack:module` 固定版本（`--no-bump`），tgz 文件名不变，流程只有两步：

```bash
# 1. 模块侧：重新打包（覆盖同名 tgz）
cd pactor-apps/risk-analysis && pnpm pack:module

# 2. Shell 侧：重新安装该模块并装配
cd ../../web-shell
pnpm install --force
pnpm assemble:modules && pnpm dev
```

`pnpm dev` **不会**监听模块包或自动 re-assemble，改模块后必须重走上述流程。

> 如果去掉了 `--no-bump` 或手动 bump 了模块版本，tgz 文件名会变化，需要在 Shell 侧
> `pnpm add ../pactor-apps/<app>/<name>-<new-version>.tgz` 更新 `file:` 引用后再装配。

## 替换为自己的业务模块

以 `risk-decision`（纯 DSL）或 `risk-analysis`（含 server entry）为模板复制一份，然后修改：

| 位置 | 修改内容 |
| --- | --- |
| `package.json` | `name`、`version`、dev 端口 |
| `pactor.module.json` | `id`、`name`、`basePath`、`yamlRoot` |
| `src/server/yaml/` | sitemap 与页面 DSL（目录名与 `id` 对应） |
| `src/pactor/`、`module/client.ts` | 自定义组件 / Actions（可选） |
| `module/server.ts` + `pactor.module.json` 的 `serverEntry`/`apiPrefixes` | 业务 API（可选，参考 risk-analysis） |
| web-shell `package.json` | `pnpm add` 新模块 tgz |
| web-shell `src/modules/module-list.json` | 启用新模块（`enabled` / `menuMode` / `access`） |
| web-shell `src/shell/sitemap.yaml` | 左侧固定菜单指向新模块页面（`<moduleId>:<pageId>`） |

也可以使用 `pactor create <name>` 生成基础工程，再执行 `pactor module init` 补齐模块接入面。

## 端口约定

| 工程 | 端口 |
| --- | --- |
| web-shell | 9020 |
| risk-analysis | 8021 |
| risk-decision | 8022 |

## 验证

```bash
# Shell 运行中：模块 API 分发冒烟（GET/HEAD/OPTIONS/405/404）
cd web-shell && pnpm smoke:module-api
```
