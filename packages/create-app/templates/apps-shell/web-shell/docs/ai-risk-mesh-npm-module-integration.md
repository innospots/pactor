# ai-risk-mesh（nextjs-version）以 npm 包接入 InnoSpots Web Shell 可行性文档

- 日期：2026-10-23
- 目标工程：`web-shell`（`innospots-web-shell`）
- 待接入工程：`/Users/Zhuanz/Documents/workspace/nextjs-version`（`ai-risk-mesh`）
- 约束：**不修改 `nextjs-version` 的既有源码**；Shell 侧除 `package.json` 与模块清单外，尽量不改代码
- 结论等级：**有条件可行** —— 直接安装不可行；通过一个独立“适配打包层”可行，构建期装配已实测通过；完整运行能力受 Shell 现状限制

> **历史文档**：文中“Shell 需逐个补齐业务 API 路由”的结论已被 **Module server entry** 方案取代。模块现在可用 `module/server.ts` + `serverEntry`/`apiPrefixes` 把服务端 API 打进 tgz，由 Shell 的 `/api/modules/<moduleId>/*` 统一分发；当前实现见 `README.md`「模块服务端 API（server entry）」。

---

## 0. 结论摘要

### 0.1 一句话结论

`nextjs-version` 是一个**完整的独立 Next.js 应用**，不是 Shell 契约中的“UI npm 模块”。因此：

- **直接把 `/nextjs-version` 作为 npm 依赖安装进 Shell，再期望它的页面/接口自动出现在 Shell 中：不可行。**
- **不修改 `nextjs-version` 源码，新增一个适配打包层（adapter package），用 `npm pack` 产出真正的模块包，再安装到 Shell 并启用：可行。** 构建期装配链路已在隔离环境实测通过（22 个页面、22 条路由）。
- **完全不改任何代码（连适配包也不新增）：只能以独立进程 + 反向代理 / iframe / 外链方式共存，不属于“npm 模块装配”。**
- **即使采用适配包，在“不改 Shell 代码”的前提下也只能跑通“公开的静态演示子集”**；登录、权限、业务接口、多语言、皮肤等需要 Shell 侧补齐能力。

### 0.2 三条路径对比

| 路径 | 是否改 `nextjs-version` 源码 | 是否改 Shell 代码 | 能否作为 npm 包装配 | 功能完整度 | 建议 |
| --- | --- | --- | --- | --- | --- |
| **A. 适配包**（推荐） | 否（只新增外部打包层） | 仅改 `package.json` + `module-list.json`（配置） | ✅ | 静态页面/页内交互可用；登录、数据、i18n 不可用 | 作为一期交付 |
| **B. 独立部署**（反向代理 / iframe / 外链） | 否 | 否（用网关或 iframe，不改仓库代码） | ❌（不是模块） | 100%（原应用完整功能） | 作为零改动兜底 |
| **C. 原生融合** | 否 | 是（会话、BFF、i18n、装配器等） | ✅ | 100% | 二期演进 |

> 本文重点展开 A；B、C 在 §6、§7 说明。

### 0.3 最小可行交付

1. 新建独立目录（例如 `ai-risk-mesh-module/`，与两个仓库平级），**不修改 `nextjs-version`**。
2. 在适配层中读取 `nextjs-version` 的 `sitemap.yaml`、页面 DSL、布局、actions、CSS，产出一个标准 npm 包：
   - `manifest.json`（Manifest V1）
   - `dsl/*.yaml`（`$include` 已展开、文件名为 `<pageId>.yaml`）
   - `client/index.js`（打包后的 components/actions）
   - `assets/`（静态资源）
3. `npm pack` 后在 Shell 中安装，编辑 `src/modules/module-list.json` 启用。
4. `npm run assemble:modules && npm run validate:modules && npm run dev`。
5. 访问 `http://localhost:9020/risk/...`（`basePath` 建议使用 `/risk`，原因见 §5.10）。

---

## 1. 验证范围与方法

本文的结论来自两部分：

### 1.1 源码对照

逐项阅读了两个工程的模块装配、运行期、API、DSL、样式与依赖配置，关键证据见附录 C。

### 1.2 隔离 PoC（已完成）

在 `/tmp/airisk-module-poc/` 中复制了 Shell 的装配脚本与适配包，**未修改两个原始工程**，完成了以下实测：

| 验证项 | 结果 |
| --- | --- |
| 适配包生成（22 页 DSL、`$include` 展开、布局内联） | ✅ 通过 |
| `npm pack` 产出 tarball | ✅ `ai-risk-mesh-module-0.1.0.tgz`，139,676 字节，35 个条目 |
| 在空目录 `npm install` tarball 并解析 `./manifest`、`./client` | ✅ 通过 |
| Shell `assemble-modules.mjs` 装配 | ✅ 1 个模块、22 条路由 |
| Shell `validate-modules.mjs` 校验 | ✅ 22 条路由、22 个页面 |
| 根 `basePath: "/"` 行为 | ❌ 生成 `//login`、`//risk-analysis/...`（Shell 脚本缺陷，见 §5.10） |
| `next build` / 浏览器运行 | ⚠️ **未验证**（原因见下） |

**未做运行时验证的原因**：

- `web-shell` 当前**没有安装 `node_modules`**。
- 当前检出的 `@innospots/ui-console`（`file:` 依赖）**没有 `manifest.json`、`exports`、`styles.css`、`build:module` 脚本**，仓库现状下对它执行 `assemble:modules` 本身就会失败；同时 `app/(workspace)/layout.tsx` 硬编码了 `import "@innospots/ui-console/styles.css"`。
- 因此本次只验证了“适配包 + 装配”这一段确定性链路。真正 `next build`/浏览器验收需要在补齐上述基线后进行，验收清单见 §5.9。

> 这不是 `nextjs-version` 的问题，而是 Shell 模板当前的基线状态；接入任何新模块前都应先处理。

---

## 2. Shell 的模块契约（`web-shell`）

### 2.1 模块 = npm 包 + Manifest V1 + client 扩展 + DSL + 资源

Shell 期望的模块包至少提供：

```jsonc
// package.json
{
  "name": "@scope/ui-xxx",
  "exports": {
    "./manifest": "./manifest.json",
    "./client": "./dist-module/client/index.js"
  }
}
```

```jsonc
// manifest.json（schemaVersion = "1"）
{
  "schemaVersion": "1",
  "id": "console",
  "name": "Console",
  "version": "0.1.0",
  "pactorVersionRange": "^1.54.0",
  "basePath": "/console",
  "sitemap": "dsl/sitemap.yaml",
  "dslRoot": "dsl",
  "assetsRoot": "assets",
  "clientEntry": "client/index.js"
}
```

装配器行为（`scripts/assemble-modules.mjs`）：

1. 通过 `require.resolve("<package>/manifest")` 定位 Manifest（`:75-81`、`:259-266`）。
2. 解析 `manifest.sitemap` 指向的 sitemap YAML，生成路由与 `globalPageId = <moduleId>:<pageId>`（`:136-215`）。
3. 在 `manifest.dslRoot` 下**按文件名 `<pageId>.yaml` 递归查找**页面 DSL（`:120-133`），复制到 `.generated/pactor/dsl/<moduleId>/`。
4. 把 `manifest.assetsRoot` 复制到 `public/modules/<moduleId>/<version>/`。
5. 生成 `.generated/pactor/client-registry.ts`，静态 `import { extensions } from "<package>/client"`（`:224-236`、`:287`）。
6. 运行期由 `PactorHost` 挂载 `SitemapApp`，从 `/api/runtime/bootstrap` 拉取 sitemap，从 `/api/runtime/pages/<globalPageId>` 懒加载页面 DSL（`src/runtime/PactorHost.tsx:22-30`、`src/runtime/pactor-adapter.ts`）。

**关键约束**（Shell README 已明确）：

- 不是把另一个 Next 应用的 `.next` 当插件嵌入（README 非目标 N2）。
- 交付物是 **DSL + client + assets**，不是整个应用产物。
- 页面逻辑标识 `globalPageId = moduleId:pageId`，不对 URL 暴露 YAML 路径。

### 2.2 Shell 运行期的已知占位能力

| 能力 | 现状 | 证据 |
| --- | --- | --- |
| 会话 | 恒返回未登录 | `src/server/auth/session.ts:16` |
| 页面可见性 | 非 `public` 页面匿名一律不可见 | `src/server/runtime/visibility.ts:4-10` |
| 页面懒加载 API | 返回 `{ version, pageDsl }` | `src/server/runtime/pages.ts:10-15` |
| Pactor props | 未传 `locale` / `messages` / `httpAdapter` | `src/runtime/PactorHost.tsx:22-30` |
| 业务 BFF | 无 `/api/d/*`、无 `/api/auth/*` | `app/api/` 仅 runtime 三条路由 |
| 模块样式 | workspace layout 硬编码 ui-console 样式 | `app/(workspace)/layout.tsx:1` |

---

## 3. `nextjs-version` 的现状

### 3.1 它是一个独立应用，而不是模块

`package.json`：

- 名称 `ai-risk-mesh`，`private: true`（`:2`、`:4`）
- **没有 `main` / `module` / `exports` / `files`**
- 没有 `manifest.json`
- 没有 `client` 入口
- 没有 `build:module` 脚本
- 脚本只有 `dev` / `build` / `start` / `lint` / `build:dev` / `build:test`

### 3.2 功能规模

| 项 | 数量/说明 |
| --- | --- |
| 页面（sitemap `pages`） | 22 |
| 菜单（sitemap `menus`） | 22 |
| 布局（`layouts`） | 6（`admin`、`risk-analysis`、`risk-decision`、`system-management`、`login`、`blank`） |
| 页面 DSL 文件 | 21 个 `*.page.yaml` + 1 个登录页 `common/login.yaml` |
| 片段文件 | 145 个 `*.fragment.yaml` |
| `$include` 引用 | 页面级 103 处（含片段嵌套共 368 行匹配） |
| YAML 总体积 | 约 1.0 MB |
| 自定义 actions | `riskActions`、`developActions`、`localeActions` |
| 自定义组件注册表 | `pactorComponents = {}`（空）；实际使用 Pactor 内置组件 |
| 业务 CSS | 15 个 CSS 文件，由 `src/pactor/components/index.ts` 引入 |
| API 路由 | 9 条（auth、sitemap、public pages、d、risk-analysis、users） |

### 3.3 页面后端依赖

| 页面 | 依赖 |
| --- | --- |
| `login` | `POST http://localhost:8011/api/auth/login`，成功后 `app.reload` |
| `risk-data-value` | `GET /api/risk-analysis/data-value` |
| `risk-reject-recovery` | `GET /api/risk-analysis/reject-recovery` |
| `risk-task` | `GET /api/risk-analysis/tasks/:id` |
| 其余 18 页 | 纯静态 DSL（`state` 内数据 + 页内 actions），无需后端 |

> 这是好消息：**大部分页面在不接后端的情况下可以静态演示**。

### 3.4 版本矩阵

| 依赖 | Shell | nextjs-version | 结论 |
| --- | --- | --- | --- |
| Next.js | 16.3.5 | 16.3.5 | ✅ 一致 |
| React / React DOM | 19.2.8 | 19.2.8 | ✅ 一致 |
| Pactor | `^1.48.1`（lock 1.54.2） | `latest`（实测 1.54.5） | ⚠️ 次版本漂移，需对齐/回归 |
| TypeScript | 5.9.3 | 5.x | ✅ |
| Tailwind | 4.3.3 | 4.x | ✅ |

---

## 4. 差异与阻断项清单

> 严重度：🔴 阻断（不改代码无法绕过）/ 🟠 需适配（适配层可解决）/ 🟡 差异（会影响体验或需要配置）

| # | 差异点 | nextjs-version 事实 | Shell 期望 | 严重度 | 不改源码的规避方式 |
| --- | --- | --- | --- | --- | --- |
| 1 | **交付形态** | 完整 Next 应用，私有包，无 `exports` | `exports["./manifest"]`、`./client`、Manifest V1 | 🔴→🟠 | 新增独立适配包 |
| 2 | **Next 路由不可合并** | `app/[[...slug]]`、`app/api/*` 由文件系统路由 | 只有 Shell 的 `app/` 生效 | 🔴 | 无法直接安装运行；只能导出 DSL/client/assets |
| 3 | 页面文件名 | `<id>.page.yaml` | 递归查找 `<pageId>.yaml` | 🟠 | 适配层复制/改名 |
| 4 | `$include` 片段 | 请求期在服务端展开（`src/server/sitemap.ts:28-68`） | 不做展开 | 🟠 | 打包时预展开（PoC 已做） |
| 5 | 布局引用 | `sitemap.layouts` 中部分值是字符串路径（`sitemap.ts:146` 解析） | 直接透传，客户端要求对象 | 🟠 | 打包时内联为对象 |
| 6 | 懒加载页面端点 | 22 页均 `lazy: true` | Shell 返回 `{version,pageDsl}`，而 Pactor 1.54.x 期望 `resource.schema` | 🟠 | 打包时去掉 `lazy`，随 bootstrap 内联 `pageDsl` |
| 7 | 匿名会话 | 有登录/权限/角色 | Shell 会话恒 `null`；非 public 页面被过滤 | 🔴（演示可绕过） | 演示模式把 pages/menus 标 `public: true`；生产需改 Shell |
| 8 | 登录/登出 | 绝对地址 `http://localhost:8011/api/auth/*` | Shell 无 auth 路由 | 🔴 | 需 BFF/代理或改 DSL 指向；否则不可用 |
| 9 | 业务接口 | 3 个页面依赖 `/api/risk-analysis/*` | Shell 无对应路由 | 🔴（3 页） | 其余 18 页静态可用；这 3 页需 BFF/代理 |
| 10 | 通用数据接口 | `/api/d/[...parts]` + `createHttpHooks` 拆包 | Shell 无 `/api/d`，未传 `httpAdapter` | 🟠 | 需 Shell 侧补齐（或页面不用该数据源） |
| 11 | 国际化 | `locale` / `messages` 传给 SitemapApp，服务端按 locale 下发 | Shell 未传，`locale.set` 无法驱动 SitemapApp | 🟠 | 不改代码时仅中文静态文案 |
| 12 | Pactor 聚合样式 | `app/globals.css` 引入 `pactor-app/styles.css` | Shell 的 `app/globals.css` 只有 Tailwind | 🟠 | 适配包 client 引入 pactor 样式 |
| 13 | Tailwind 工具类 | 工具类直接写在 YAML 中，独立应用构建时扫描生成 | Shell `.gitignore` 忽略 `.generated` 与 `node_modules`，Tailwind v4 默认跳过 → 工具类缺失 | 🟠→🔴（视觉） | 适配包预编译 Tailwind CSS 并随 client 提供 |
| 14 | 皮肤 | `app/layout.tsx` 首屏注入 `/skins/<skin>.css` | Shell 无注入逻辑 | 🟡 | 明暗主题可用；皮肤需 Shell 改动 |
| 15 | 静态资源 | 布局引用 `/next.svg`；`public/skins/*` | Shell `public/` 只有 `modules/.gitkeep`；装配不重写 YAML 资源路径 | 🟠 | 适配层把资源 URL 重写到 `/modules/risk/0.1.0/...` |
| 16 | 页内导航 | `app.reload` / `navigate` 使用 `/risk-analysis/...`、`/risk-decision/...` | 装配后 URL 带 `basePath` 前缀 | 🟠 | 适配层重写 `to` 路径（不要重写 API URL） |
| 17 | action 注册 | 页面 `onInit` 依赖 `risk.enterPage`、`risk.syncShell`、`develop.*`、`locale.set` | 必须出现在模块 `extensions.actions` | 🟠 | 适配包用 esbuild 打包 actions 并导出 |
| 18 | `basePath: "/"` | — | `joinPublicPath` 会生成 `//login` | 🟡 | 使用 `/risk` 等非根前缀；或修 Shell 脚本 |
| 19 | 菜单显式 path | 多数菜单带 `path` | 装配只给 `pageId` 加命名空间，不改 `path` | 🟠 | 打包时去掉菜单 `path`，交给 Pactor 按 pageId 解析 |
| 20 | 片段运行期 API | 使用编译期 `$include` | Shell `fragments.json` 恒空 | 🟡 | 预展开后不需要 |
| 21 | 版本漂移 | Pactor 1.54.5 | Shell lock 1.54.2 | 🟡 | 对齐版本并回归 |
| 22 | Shell 基线 | — | 本地 `ui-console` 无 manifest/styles、Shell 未装依赖 | 🟡 | 接入前先补齐基线 |

---

## 5. 方案 A：适配包（推荐）

### 5.1 总体架构

```text
nextjs-version（原样不动）
  ├─ src/server/yaml/**          ──┐
  ├─ src/pactor/{actions,css}     │  只读
  ├─ public/**                    │
  └─ package.json                 ┘
                                   │
                         构建期适配脚本（新目录）
                                   │
        ┌──────────────────────────┼───────────────────────────┐
        ▼                          ▼                           ▼
  manifest.json              dsl/<pageId>.yaml            client/index.js
  （Manifest V1）            （$include 已展开）          （actions + CSS）
        │                          │                           │
        └──────────────┬───────────┴───────────────┬───────────┘
                       ▼                           ▼
              npm pack → .tgz               assets/ → public/modules/risk/0.1.0
                       │
                       ▼
          web-shell：npm install + module-list 启用
                       │
                       ▼
   assemble:modules → .generated/pactor/* → next build/dev → /risk/...
```

### 5.2 适配包目录结构

建议放在两个仓库之外（例如 `/Users/Zhuanz/Documents/workspace/ai-risk-mesh-module/`），避免污染 `nextjs-version`：

```text
ai-risk-mesh-module/
├── package.json                 # name: @ai-risk-mesh/module, exports ./manifest ./client
├── build-adapter.mjs            # 读取 nextjs-version，产出 dist-module/
├── client/
│   └── entry.ts                 # export const extensions = { components, actions }
├── dist-module/                 # 构建产物（npm pack 的内容）
│   ├── manifest.json
│   ├── sitemap.yaml
│   ├── dsl/
│   │   ├── login.yaml
│   │   ├── risk-model-diagnosis.yaml
│   │   └── ...                  # 22 个页面
│   ├── client/
│   │   ├── index.js             # esbuild 打包
│   │   └── index.css            # 模块 CSS + 预编译 Tailwind + pactor 样式
│   └── assets/                  # 来自 nextjs-version/public
└── README.md
```

`package.json` 关键字段：

```jsonc
{
  "name": "@ai-risk-mesh/module",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "files": ["manifest.json", "sitemap.yaml", "dsl", "client", "assets"],
  "exports": {
    "./manifest": "./manifest.json",
    "./client": "./client/index.js",
    "./styles.css": "./client/index.css"
  }
}
```

> `private: true` 不影响 `npm pack` / `npm install <tgz>`，只阻止发布到公共 registry；私有 registry 可移除或保留。

### 5.3 构建流程（源码级，PoC 已验证）

适配脚本按以下顺序处理：

#### 1）展开 `$include`

复用 `nextjs-version/src/server/sitemap.ts` 的语义：

- `$include: <yaml/ 下相对路径>` 必须是对象唯一键；
- 片段放在 `children` 位置时，顶层应为节点数组；
- 递归展开并检测循环引用。

PoC 结果：22 个页面全部展开，产物中 `$include` 残留为 **0**。

#### 2）页面改名与落盘

- 源：`src/server/yaml/**/<id>.page.yaml`（登录页为 `common/login.yaml`）
- 目标：`dist-module/dsl/<id>.yaml`

原因：Shell 的 `findPageDslFile` 只认 `<pageId>.yaml`（`scripts/assemble-modules.mjs:120-133`）。

#### 3）布局内联

`nextjs-version` 的 `sitemap.yaml` 中：

```yaml
layouts:
  risk-analysis: risk-analysis/risk-analysis.layout.yaml
  risk-decision: risk-decision/risk-decision.layout.yaml
  system-management: system-management/system-management.layout.yaml
```

适配脚本读取这些文件并替换为**布局对象**，否则 Shell 会把字符串原样下发给客户端，`SitemapApp` 无法解析。

#### 4）菜单处理

- 删除菜单的显式 `path`：装配器只会给 `pageId` 加 `moduleId:` 前缀，不会给 `path` 加 `basePath` 前缀；保留会导致菜单跳转到未装配的 URL。
- 删除后，Pactor 的 `mergeSitemapMenus` 会按 `pageId` 从 pages 中回填 `path`。
- PoC 已验证：生成的 `menus.json` 中 `pageId` 为 `risk:risk-model-diagnosis`，且无 `path`。

#### 5）页面去 `lazy`（关键）

Shell 的懒加载端点返回：

```ts
{ version, pageDsl }   // src/server/runtime/pages.ts:10-15
```

而 Pactor 1.54.x 的 `SitemapApp` 加载器读取的是 `resource.schema`。两者不一致会导致懒加载页无法渲染。适配层把页面改为**非 lazy**，让 `pageDsl` 随 `/api/runtime/bootstrap` 内联下发，绕开该不一致。

> 这是 Shell 自身的契约缺陷，任何使用 lazy 页面的模块都会遇到；建议后续修 Shell（见 §7）。

#### 6）演示模式：`public: true`

Shell 的会话恒为 `null`，`canSeePage` 会过滤所有非 public 页面；客户端的 `defaultSitemapGuard` 也要求菜单 `public === true` 才允许匿名访问。

适配脚本可提供 `--public-demo` 开关：

- pages：`public: true`
- menus：`public: true`

**仅用于演示/验收**。生产环境不能这样标记，必须实现真实会话与权限。

#### 7）静态资源与 URL 重写

- `nextjs-version/public/*` → `dist-module/assets/*`
- 装配后浏览器路径为 `/modules/risk/0.1.0/<file>`
- 需要把布局/DSL 中已知的资源引用重写，例如：
  - `/next.svg` → `/modules/risk/0.1.0/next.svg`
- `public/skins/*.css` 同样复制，但**首屏注入逻辑在 `app/layout.tsx` 中，适配包无法携带**；不改 Shell 时皮肤不会自动生效。

#### 8）页内导航重写（使用非根 `basePath` 时）

以下绝对路径需要加 `/risk` 前缀，否则会 404：

- `common/login.yaml:57-58`：`app.reload` → `/risk-analysis/model-diagnosis`
- `backtest-table.fragment.yaml:97`：`/risk-decision/sandbox/backtest/executions/:taskId`
- `execution-record-topbar.fragment.yaml:20`：`/risk-decision/sandbox/backtest`
- `sitemap.yaml:503`：登出后 `app.reload` → `/login`

**只重写 `navigate` / `app.reload` 的 `to`，不要重写 `request` 的 API `url`**（API 地址需要单独由 BFF/代理处理）。

#### 9）生成 Manifest

```json
{
  "schemaVersion": "1",
  "id": "risk",
  "name": "AI Risk Mesh",
  "version": "0.1.0",
  "pactorVersionRange": "^1.54.0",
  "basePath": "/risk",
  "sitemap": "sitemap.yaml",
  "dslRoot": "dsl",
  "assetsRoot": "assets",
  "clientEntry": "client/index.js"
}
```

说明：

- `id` 会进入 `globalPageId`（如 `risk:risk-analysis`）与 CSS 命名空间，建议短且稳定。
- `basePath` 建议 `/risk`；**不要用 `/`**（见 §5.10）。
- `version` 用于 `public/modules/<id>/<version>/`，升级时递增。

### 5.4 客户端扩展打包

`nextjs-version` 的 `pactorComponents` 是空对象，但**不等于没有客户端逻辑**：

- 15 个业务 CSS 通过 `src/pactor/components/index.ts:11-26` 引入；
- 页面 `onInit` 依赖 `risk.enterPage`；
- 布局 `onInit` 依赖 `risk.syncShell`；
- 数据接口页依赖 `develop.*`；
- 账户菜单语言切换依赖 `locale.set`。

因此适配包必须导出：

```ts
// client/entry.ts
import { pactorComponents } from "../../nextjs-version/src/pactor/components";
import { riskActions } from "../../nextjs-version/src/pactor/risk-actions";
import { developActions } from "../../nextjs-version/src/pactor/develop-actions";
import { localeActions } from "../../nextjs-version/src/pactor/locale-actions";
import "../../nextjs-version/src/pactor/components/index"; // CSS side effects

export const extensions = {
  components: pactorComponents,
  actions: { ...riskActions, ...developActions, ...localeActions },
};
```

打包建议（esbuild）：

```bash
npx esbuild client/entry.ts \
  --bundle \
  --format=esm \
  --platform=browser \
  --alias:@=<nextjs-version>/src \
  --external:react --external:react-dom \
  --external:@pactor-app/* --external:pactor-app \
  --outfile=dist-module/client/index.js
```

要点：

- `@/` 是 `nextjs-version` 的 tsconfig 路径别名，必须通过 `--alias` 映射到其 `src/`，否则 `@/shared/risk-analysis` 无法解析。
- actions 只 import 类型，不会把 Pactor runtime 打进 bundle；但仍建议把 React/Pactor 设为 external，避免与 Shell 双实例。
- `riskActions` 与 `riskShell` 是同一模块内的状态源，**必须打在同一份 bundle 中**，不能拆包，否则 `risk.enterPage` 与 `risk.syncShell` 不共享状态。
- CSS 由 esbuild 输出为 `index.css`；需要在 Shell 中加载（见下一节）。

### 5.5 样式：必须处理的三件事

1. **Pactor 聚合样式**
   - `nextjs-version/app/globals.css` 引入 `pactor-app/styles.css`；
   - Shell 的 `app/globals.css` 只有 `@import "tailwindcss";`；
   - 适配包应在 `client/index.css` 中 `@import "pactor-app/styles.css";`，或由 Shell 的全局样式引入。

2. **Tailwind 工具类**
   - `nextjs-version` 的 YAML 中大量使用 `className: p-4 flex gap-2 ...`；
   - 其独立应用构建时 Tailwind 扫描 `src/server/yaml` 生成这些类；
   - Shell 的 `.gitignore` 忽略 `.generated` 与 `node_modules`，Tailwind v4 自动扫描默认跳过这两处，**这些工具类不会生成**。
   - 适配包应在打包阶段用 Tailwind CLI 扫描自己的 `dsl/` 与组件源码，预编译成一个普通 CSS 文件，随 `client/index.css` 发布。这样不需要改 Shell 的 Tailwind 配置。
   - 备选（需要改 Shell）：在 `app/globals.css` 增加 `@source "../.generated/pactor/dsl";` 与 `@source "../node_modules/@ai-risk-mesh/module";`。

3. **全局覆盖规则与皮肤**
   - `nextjs-version/app/globals.css` 还包含 `.shell-root` 布局、响应式显隐修复等**应用级全局规则**，不在 15 个组件 CSS 中；
   - 适配包应把这些规则一并放入 `client/index.css`（去掉 Tailwind 与 pactor 的重复 import）；
   - 皮肤（`public/skins/*.css`）需要首屏注入 `data-pactor-skin`，Shell 无此逻辑；不改 Shell 时只能做到明暗主题（`data-pactor-theme`），做不到完整换肤。

### 5.6 Shell 侧安装与启用

```bash
# 1) 构建适配包
cd /Users/Zhuanz/Documents/workspace/ai-risk-mesh-module
npm install
npm run build:module
npm pack
# → ai-risk-mesh-module-0.1.0.tgz

# 2) 安装到 Shell（仓库有 pnpm-lock，建议 pnpm；npm 亦可）
cd web-shell
pnpm add ../ai-risk-mesh-module/ai-risk-mesh-module-0.1.0.tgz
# 或：npm install ../ai-risk-mesh-module/ai-risk-mesh-module-0.1.0.tgz
```

编辑 `src/modules/module-list.json`：

```json
{
  "modules": [
    {
      "package": "@ai-risk-mesh/module",
      "enabled": true,
      "basePath": "/risk"
    }
  ]
}
```

> 注意：`basePath` 会覆盖 manifest 中的默认值；两处保持一致即可。
> 如果同时保留 `@innospots/ui-console`，需要确保它本身可装配（当前检出缺少 manifest/styles）。

执行：

```bash
pnpm run assemble:modules
pnpm run validate:modules
pnpm run dev
```

浏览器访问：

| 页面 | URL |
| --- | --- |
| 登录 | `http://localhost:9020/risk/login` |
| 模型诊断工作台 | `http://localhost:9020/risk/risk-analysis/model-diagnosis` |
| 风险决策总览 | `http://localhost:9020/risk/risk-decision` |
| 决策案件 | `http://localhost:9020/risk/risk-decision/decision/cases` |
| 系统管理 | `http://localhost:9020/risk/system-management` |

### 5.7 PoC 实测记录

以下输出来自 `/tmp/airisk-module-poc/`，原始工程未被修改：

```text
[adapter] {
  "pages": 22,
  "menus": 22,
  "layouts": 6,
  "sourceIncludes": 103,
  "dslFiles": 22
}

[assemble] 完成：1 个模块，22 条路由 → .generated/pactor
[validate] 通过：22 条路由，22 个页面

# 路由样例
/risk/login                                      -> risk:login
/risk/risk-analysis/model-diagnosis              -> risk:risk-model-diagnosis
/risk/risk-decision                              -> risk:risk-decision
/risk/risk-decision/:section                     -> risk:risk-decision-section
/risk/risk-decision/integration/list             -> risk:name-list
/risk/system-management                          -> risk:risk-system-management

# 生成的 client-registry.ts
import { extensions as riskExtensions } from "@ai-risk-mesh/module/client";
export const moduleExtensions = { "risk": riskExtensions };

# npm pack
ai-risk-mesh-module-0.1.0.tgz   139,676 bytes   35 entries

# 空目录安装并解析
require.resolve('@ai-risk-mesh/module/manifest')
  -> node_modules/@ai-risk-mesh/module/manifest.json
require.resolve('@ai-risk-mesh/module/client')
  -> node_modules/@ai-risk-mesh/module/client/index.js

# DSL 展开检查
leftover $include: 0
```

### 5.8 适配清单（Checklist）

- [ ] 独立适配包，不修改 `nextjs-version`
- [ ] `manifest.json` 使用 `schemaVersion: "1"`
- [ ] `package.json` 提供 `exports["./manifest"]` 与 `exports["./client"]`
- [ ] 页面 DSL 展开 `$include`
- [ ] 页面文件名改为 `<pageId>.yaml`
- [ ] 布局字符串内联为对象
- [ ] 页面去 `lazy`（或修 Shell 页面端点）
- [ ] 菜单去掉显式 `path`
- [ ] `basePath` 使用 `/risk`（不要 `/`）
- [ ] 演示模式按需给 pages/menus 加 `public: true`
- [ ] 打包 actions（risk/develop/locale）
- [ ] 打包 15 个业务 CSS
- [ ] 引入 `pactor-app/styles.css`
- [ ] 预编译 Tailwind 工具类（扫描 DSL）
- [ ] 复制 `public/*` 到 `assets/`
- [ ] 重写 `/next.svg` 等资源 URL
- [ ] 重写 `navigate` / `app.reload` 的模块内绝对路径
- [ ] 对齐 Pactor 版本（1.54.2 / 1.54.5）
- [ ] 验证 `assemble:modules` 与 `validate:modules`
- [ ] 验证 `/api/runtime/bootstrap` 返回 22 页
- [ ] 浏览器验收静态页、actions、布局、菜单高亮
- [ ] 明确登录/数据/i18n/皮肤的已知不可用范围

### 5.9 运行时验收清单（补齐 Shell 依赖后执行）

```bash
# 1) 检查装配产物
cat .generated/pactor/assembly.json
cat .generated/pactor/routes.json
cat .generated/pactor/pages.json

# 2) 检查 bootstrap（应包含 22 个页面、6 个布局）
curl -s http://localhost:9020/api/runtime/bootstrap | node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
  const j=JSON.parse(s);
  console.log('pages',j.pages.length,'layouts',Object.keys(j.layouts).length,'menus',j.menus.length);
  console.log('first page has dsl:', !!j.pages.find(p=>p.pageDsl));
})"

# 3) 检查页面路由（示例）
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9020/risk/risk-analysis/model-diagnosis
```

浏览器侧重点：

- 菜单是否渲染、图标/高亮是否正确；
- `risk-analysis` / `risk-decision` / `system-management` 三层布局是否嵌套正确；
- 静态页面的表格、抽屉、Tab、搜索是否可交互；
- 浏览器 Console 是否有 `unknown action`（actions 未注册）或组件解析错误；
- 样式是否缺少 Tailwind 工具类（间距、颜色、响应式）；
- 直接刷新深链是否 404（Shell catch-all + routes.json）；
- 登录按钮是否请求 `8011`（当前预期失败）。

### 5.10 `basePath` 必须避开 `/`

Shell 的 `joinPublicPath`：

```js
combined = `${base}${segment}`; // base "/" + segment "/login" = "//login"
```

PoC 实测：

```text
basePath = "/"  →  "//login", "//risk-analysis/model-diagnosis", ...
basePath = "/risk" → "/risk/login", "/risk/risk-analysis/model-diagnosis", ...
```

因此：

- 推荐 `basePath: "/risk"`，并在适配层重写模块内绝对导航路径；
- 如果必须使用根路径，需要修 `scripts/assemble-modules.mjs` 的 `joinPublicPath`（Shell 代码改动）。

### 5.11 不改代码时能用到什么程度

| 能力 | 结论 | 说明 |
| --- | --- | --- |
| 菜单 / 布局 / 页面渲染 | ✅ | 需布局内联、菜单去 path |
| 18 个静态业务页 | ✅ | 纯 DSL + state + 页内 actions |
| 页内交互 actions | ✅（需打包） | risk/develop/locale |
| 深链与参数页 | ✅ | Shell 路由表支持 `:param` |
| 登录 / 登出 / 会话 | ❌ | Shell 无 auth 路由、会话恒 null |
| 权限 / 角色 / 菜单裁剪 | ❌ | 需真实会话；演示模式为全公开 |
| 3 个风险分析数据页 | ❌ | 缺 `/api/risk-analysis/*` |
| 通用 `/api/d` 数据接口 | ❌ | Shell 无 BFF，且未传 `httpAdapter` |
| 多语言切换 | ❌ | Shell 未传 `locale` / `messages` |
| 皮肤（skin） | ❌ | 首屏注入逻辑不在模块内 |
| 明暗主题 | ⚠️ | Pactor 主题可切换，皮肤不可 |
| 静态资源 / logo | ⚠️ | 需适配层重写 URL |
| 页面样式完整性 | ⚠️ | 需预编译 Tailwind + pactor 样式 |

---

## 6. 方案 B：独立部署（真正零代码改动）

如果不允许新增适配包，也不允许改 Shell，则只能采用“共存”而非“装配”：

### 6.1 反向代理（推荐用于零改动演示）

```text
浏览器
  ├─ /            → Shell       :9020
  └─ /risk/*      → ai-risk-mesh :8011
```

- Nginx / Caddy / 网关按前缀分流；
- 两个应用各自完整运行，`nextjs-version` 的登录、数据、i18n、皮肤全部可用；
- 缺点：不是 npm 模块，Shell 的菜单/路由/权限体系不感知它；部署与升级是两个进程。

### 6.2 iframe / 外链

- 在 Shell 中放一个 iframe 或跳转链接指向 `http://host:8011/risk-analysis/model-diagnosis`；
- 零代码改动（甚至不改 Shell 也可以直接访问 8011）；
- 缺点：URL、会话、主题、菜单都不统一；不适合作为长期模块化方案。

### 6.3 只安装为依赖、不装配

`npm install ../nextjs-version` 在技术上会把目录放进 `node_modules`，但：

- Next 不会读取依赖包中的 `app/` 路由；
- Shell 的装配器找不到 manifest/client；
- 结果是什么都不会发生。

因此“安装依赖”本身没有集成价值。

---

## 7. 方案 C：完整融合所需的 Shell 改动

如果目标是“登录、权限、业务接口、多语言全部可用”，需要改 Shell（`nextjs-version` 仍可不动）。按优先级：

### P0：让业务真正可用

1. **真实会话**
   - `src/server/auth/session.ts`：接入统一登录 cookie / BFF。
   - 可参考 `nextjs-version/src/server/accounts.ts` 的演示账号模型。

2. **认证与数据 BFF**
   - 新增 `app/api/auth/login`、`app/api/auth/logout`（或代理到后端）。
   - 新增 `app/api/d/[...parts]` 转发层（参考 `nextjs-version/app/api/d/[...parts]/route.ts`）。
   - 新增/代理 `/api/risk-analysis/*` 三条路由（参考 `nextjs-version/app/api/risk-analysis/`）。

3. **Pactor props 对齐**
   - `src/runtime/PactorHost.tsx` 增加：
     - `locale`
     - `messages`
     - `httpAdapter={createHttpHooks()}`
   - 参考 `nextjs-version/src/pactor/App.tsx:20`、`:147-152`。

### P1：让装配契约完整

4. **修页面懒加载响应**
   - `src/server/runtime/pages.ts` 返回 `{ version, schema }`（或同时兼容 `pageDsl`），与 Pactor 1.54.x 对齐。
   - 否则任何 lazy 页面都会加载失败。

5. **装配器增强**
   - `scripts/assemble-modules.mjs`：
     - 解析 sitemap 中字符串形式的布局引用；
     - 自动引入 `manifest.styles`；
     - 重写 DSL 中的资源 URL；
     - 支持 `basePath: "/"`；
     - 可选：支持 `$include` 或要求模块预展开；
     - 菜单路径按 `basePath` 重写（如果模块保留 path）。

6. **样式入口**
   - `app/(workspace)/layout.tsx` 不再硬编码 `@innospots/ui-console/styles.css`；
   - `app/globals.css` 引入 `pactor-app/styles.css`，并加 `@source` 指向模块 DSL；
   - 或完全由模块 client 自带预编译 CSS。

### P2：体验与治理

7. 皮肤首屏注入（`data-pactor-skin`）。
8. Fragment 运行期 API（当前 `fragments.json` 恒空）。
9. 组件/action 重名白名单与构建期硬失败。
10. 模块 E2E：路由、懒加载、权限、语言切换。
11. Pactor 版本对齐与 lockfile 固定（1.54.5）。

---

## 8. 建议的实施顺序

| 阶段 | 目标 | 产出 |
| --- | --- | --- |
| 第 0 步 | 补齐 Shell 基线（安装依赖、确保 ui-console 可装配或有替代） | 可运行的 `pnpm dev` |
| 第 1 步 | 适配包 MVP：22 页 DSL + 去 lazy + 布局内联 + 菜单去 path + public 演示 | `npm pack` 成功、`assemble` 成功 |
| 第 2 步 | 加 client bundle（actions + CSS + Tailwind 预编译） | 页面可交互、样式正确 |
| 第 3 步 | 浏览器验收 18 个静态页 | 验收记录 |
| 第 4 步 | 决定是否投入 P0（会话/BFF/i18n） | 完整功能或保持静态演示 |
| 备选 | 若时间不允许，先用方案 B 反向代理交付 | 零改动可演示 |

---

## 9. 风险与注意事项

1. **不要把“装配成功”误认为“功能完整”**：PoC 只证明构建期链路；运行时还受会话、API、样式影响。
2. **演示模式 `public: true` 是安全降级**：生产环境必须移除，并实现真实鉴权。
3. **Pactor 版本漂移**：Shell lock 1.54.2、源应用 1.54.5；建议在适配包 `peerDependencies` 中声明 Shell 实际版本，并在接入前做一次回归。
4. **双 React / 双 Pactor 风险**：client bundle 必须把 React、Pactor 设为 external，由 Shell 提供单例。
5. **Tailwind 扫描是最容易被忽略的视觉问题**：务必在浏览器中检查间距/颜色/响应式，不能只看 DOM。
6. **actions 未注册会导致页面初始化失败**：`risk.enterPage` / `risk.syncShell` 是布局与页面联动的核心，必须打包。
7. **`basePath` 选择**：`/risk` 可避开 Shell 的 `//` 缺陷；但所有模块内绝对导航都要重写。
8. **静态资源路径**：装配器不重写 DSL 中的 URL，必须在适配层处理，或修 Shell。
9. **Shell 基线依赖**：当前 `ui-console` 检出缺少 manifest/styles；接入前先确认你们的实际依赖来源（私有 registry 或已构建的 `dist-module`）。
10. **npm 包不是“运行时插件”**：升级模块必须重新 `npm install` + `assemble` + `next build`，不支持浏览器热插拔。

---

## 附录 A：Manifest / package.json / client 入口示例

### A.1 `manifest.json`

```json
{
  "schemaVersion": "1",
  "id": "risk",
  "name": "AI Risk Mesh",
  "version": "0.1.0",
  "pactorVersionRange": "^1.54.0",
  "basePath": "/risk",
  "sitemap": "sitemap.yaml",
  "dslRoot": "dsl",
  "assetsRoot": "assets",
  "clientEntry": "client/index.js"
}
```

### A.2 `package.json`

```json
{
  "name": "@ai-risk-mesh/module",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "files": ["manifest.json", "sitemap.yaml", "dsl", "client", "assets"],
  "exports": {
    "./manifest": "./manifest.json",
    "./client": "./client/index.js",
    "./styles.css": "./client/index.css"
  },
  "peerDependencies": {
    "react": "19.x",
    "react-dom": "19.x",
    "pactor-app": "^1.54.0"
  }
}
```

### A.3 `client/entry.ts`

```ts
import { pactorComponents } from "../../nextjs-version/src/pactor/components";
import { riskActions } from "../../nextjs-version/src/pactor/risk-actions";
import { developActions } from "../../nextjs-version/src/pactor/develop-actions";
import { localeActions } from "../../nextjs-version/src/pactor/locale-actions";
import "../../nextjs-version/src/pactor/components/index"; // 15 个业务 CSS

export const extensions = {
  components: pactorComponents,
  actions: { ...riskActions, ...developActions, ...localeActions },
};
```

> 实际路径按适配包位置调整；建议把 `nextjs-version` 作为只读源码目录，不复制业务代码。

---

## 附录 B：适配脚本关键实现

以下为 PoC 的核心逻辑（完整脚本在 `/tmp/airisk-module-poc/build-adapter.mjs`，未写入任何仓库）：

```js
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { join, relative } from "node:path";

const NEXT_SRC = "/path/to/nextjs-version";
const YAML_DIR = join(NEXT_SRC, "src/server/yaml");
const OUT = "./dist-module";
const BASE_PATH = process.env.BASE_PATH ?? "/risk";
const PUBLIC_DEMO = process.env.PUBLIC_DEMO !== "false";

const require = createRequire(join(NEXT_SRC, "package.json"));
const YAML = require("yaml");

function parse(file) {
  const doc = YAML.parseDocument(readFileSync(file, "utf8"));
  if (doc.errors.length) throw new Error(`${file}: ${doc.errors[0].message}`);
  return doc.toJS();
}

const INCLUDE = "$include";

function loadYaml(file, stack = []) {
  if (stack.includes(file)) throw new Error(`循环引用: ${[...stack, file]}`);
  return expand(parse(join(YAML_DIR, file)), file, [...stack, file]);
}

function expand(value, file, stack) {
  if (Array.isArray(value)) return value.map((v) => expand(v, file, stack));
  if (!value || typeof value !== "object") return value;
  if (INCLUDE in value) {
    if (Object.keys(value).length !== 1) throw new Error(`${file}: $include 不能并列`);
    return loadYaml(value[INCLUDE], stack);
  }
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, expand(v, file, stack)]),
  );
}

/** 与 nextjs-version/src/server/sitemap.ts 的 collectPageFiles 一致 */
function collectPages(dir) {
  return new Map(
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return [...collectPages(full)];
      if (
        !entry.name.endsWith(".yaml") ||
        entry.name === "sitemap.yaml" ||
        entry.name.endsWith(".layout.yaml") ||
        entry.name.endsWith(".fragment.yaml")
      ) return [];
      const name = entry.name.slice(0, -5);
      const id = name.endsWith(".page") ? name.slice(0, -5) : name;
      return [[id, relative(YAML_DIR, full)]];
    }),
  );
}

function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, "dsl"), { recursive: true });

  const site = loadYaml("sitemap.yaml");
  const pageFiles = collectPages(YAML_DIR);

  // 1) 页面展开 + 改名
  for (const page of site.pages) {
    const rel = pageFiles.get(page.id);
    if (!rel) throw new Error(`缺少页面 DSL: ${page.id}`);
    writeFileSync(
      join(OUT, "dsl", `${page.id}.yaml`),
      JSON.stringify(loadYaml(rel), null, 2),
    );
  }

  // 2) 布局内联
  const layouts = Object.fromEntries(
    Object.entries(site.layouts).map(([name, def]) => [
      name,
      typeof def === "string" ? loadYaml(def) : def,
    ]),
  );

  // 3) 菜单去 path；演示模式标 public
  const menus = site.menus.map(({ path, ...rest }) =>
    PUBLIC_DEMO ? { ...rest, public: true } : rest,
  );

  // 4) 页面去 lazy；演示模式标 public
  const pages = site.pages.map(({ lazy, ...rest }) =>
    PUBLIC_DEMO ? { ...rest, public: true } : rest,
  );

  writeFileSync(
    join(OUT, "sitemap.yaml"),
    YAML.stringify({ ...site, layouts, pages, menus }, { lineWidth: 0 }),
  );

  writeFileSync(
    join(OUT, "manifest.json"),
    JSON.stringify({
      schemaVersion: "1",
      id: "risk",
      name: "AI Risk Mesh",
      version: "0.1.0",
      pactorVersionRange: "^1.54.0",
      basePath: BASE_PATH,
      sitemap: "sitemap.yaml",
      dslRoot: "dsl",
      assetsRoot: "assets",
      clientEntry: "client/index.js",
    }, null, 2),
  );
}

main();
```

> 资源复制、client 打包、URL 重写为增量步骤；见 §5.3.7、§5.3.8、§5.4。

### B.1 更省事的“黑盒导出”变体（A2）

如果不想自己实现 `$include`/布局解析，可以启动 `nextjs-version` 自身的服务，让它的服务端完成展开与本地化：

```bash
# 1) 启动源应用（需要其 node_modules）
cd /path/to/nextjs-version
npm run dev   # http://localhost:8011

# 2) 用演示账号登录拿 cookie
curl -c /tmp/risk.cookies -H 'content-type: application/json' \
  -d '{"username":"admin","password":"pactor123"}' \
  http://localhost:8011/api/auth/login

# 3) 拉取完整 sitemap（已含布局对象、非 lazy 页面的 pageDsl）
curl -b /tmp/risk.cookies 'http://localhost:8011/api/sitemap?locale=zh-CN' \
  -o /tmp/risk-sitemap.json

# 4) 对 lazy 页逐个拉取 schema（示例）
curl -b /tmp/risk.cookies 'http://localhost:8011/api/public/pages/risk-decision?locale=zh-CN'
```

然后把返回的 `schema` 填回对应 page 的 `pageDsl`、去掉 `lazy`、按 §5.3 处理菜单/命名空间即可。优点：服务端已经完成 `$include`、布局解析和文案本地化；缺点：打包时依赖源应用可运行，且默认语言/登录态要显式指定。

---

## 附录 C：证据索引

| 结论 | 证据 |
| --- | --- |
| Shell 装配器要求 `exports["./manifest"]` | `web-shell/scripts/assemble-modules.mjs:75-81`、`:259-266` |
| Shell 只认 `<pageId>.yaml` | `web-shell/scripts/assemble-modules.mjs:120-133` |
| Shell 生成 client registry | `web-shell/scripts/assemble-modules.mjs:224-236`、`:287` |
| Shell 菜单只命名空间 pageId，不改 path | `web-shell/scripts/assemble-modules.mjs:94-105` |
| Shell 直接透传 layouts | `web-shell/scripts/assemble-modules.mjs:107-118`、`src/server/runtime/bootstrap.ts` |
| Shell 会话恒 null | `web-shell/src/server/auth/session.ts:16` |
| Shell 非 public 页面匿名不可见 | `web-shell/src/server/runtime/visibility.ts:4-10` |
| Shell lazy 页返回 `{version,pageDsl}` | `web-shell/src/server/runtime/pages.ts:10-15` |
| Shell PactorHost 未传 locale/messages/httpAdapter | `web-shell/src/runtime/PactorHost.tsx:22-30` |
| Shell globals 仅 Tailwind | `web-shell/app/globals.css:1` |
| Shell .gitignore 忽略 .generated/node_modules | `web-shell/.gitignore` |
| Shell 硬编码 ui-console 样式 | `web-shell/app/(workspace)/layout.tsx:1` |
| Shell 非目标 N2：不能嵌入另一个 Next 应用 | `web-shell/README.md:28` |
| nextjs-version 无 exports/files/manifest | `nextjs-version/package.json`（无相关字段） |
| nextjs-version 页面使用 `.page.yaml` | `nextjs-version/src/server/sitemap.ts:101-119` |
| nextjs-version 服务端展开 `$include` | `nextjs-version/src/server/sitemap.ts:28-68` |
| nextjs-version 布局字符串解析 | `nextjs-version/src/server/sitemap.ts:146` |
| nextjs-version `locale`/`messages`/`httpAdapter` | `nextjs-version/src/pactor/App.tsx:20`、`:147-152` |
| nextjs-version 皮肤首屏注入 | `nextjs-version/app/layout.tsx:44` |
| nextjs-version 业务 CSS 入口 | `nextjs-version/src/pactor/components/index.ts:11-26` |
| nextjs-version 登录绝对地址 | `nextjs-version/src/server/yaml/common/login.yaml:35` |
| nextjs-version 登出绝对地址 | `nextjs-version/src/server/yaml/sitemap.yaml:502` |
| 资源引用 `/next.svg` | `nextjs-version/src/server/yaml/sitemap.yaml:452` |
| 风险分析 3 页使用 http 数据源 | `nextjs-version/src/server/yaml/risk-analysis/{risk-data-value,risk-reject-recovery,risk-task}.page.yaml` |
| Pactor 1.54.x 懒加载读取 `resource.schema` | `node_modules/@pactor-app/app` 1.54.2 / 1.54.5 `createSitemapLoader` |

---

## 附录 D：术语

| 术语 | 含义 |
| --- | --- |
| Shell | `web-shell`，唯一对外 Next 进程，负责路由、菜单、DSL API、模块装配 |
| 模块（Module） | 一个 npm 包，提供 `manifest` + sitemap + DSL + client extensions + assets |
| Manifest V1 | 模块元数据，`schemaVersion: "1"` |
| `globalPageId` | `<moduleId>:<pageId>`，运行期页面唯一标识 |
| DSL | Pactor YAML 页面描述 |
| `$include` | `nextjs-version` 的编译期 YAML 片段引用 |
| Adapter | 本次新增的适配打包层，把独立应用转换为模块包 |
| 黑盒导出 | 通过运行源应用、调用其 sitemap/pages API 来生成模块包的方式 |
