# ai-risk-mesh（nextjs-version）改造为 Shell 标准 npm 模块所需的修改清单

- 日期：2026-10-23
- 依据契约：`web-shell/README.md`「模块交付契约（npm 包）」「UI 模块工程结构（以 risk-analysis 为例）」
- 目标工程：`/Users/Zhuanz/Documents/workspace/nextjs-version`（`ai-risk-mesh`）
- 相关文档：`docs/ai-risk-mesh-npm-module-integration.md`（适配包方案 A / 独立部署方案 B / 原生融合方案 C）
- 本文立场：**允许修改 `nextjs-version` 自身**（与集成文档的「不改源码」前提相反），把它直接改造成符合 Shell 契约的 npm 模块仓库，即 README 中 `ui-console` 所采用的「双流水线」模式

> **历史文档**：文中关于业务 API 只能由 Shell 承接的结论已被 **Module server entry** 取代；模块可通过 `module/server.ts` 与 `serverEntry`/`apiPrefixes` 随 tgz 分发服务端 API，由 `/api/modules/<moduleId>/*` 统一分发。当前契约见 `README.md`。

---

## 1. 结论摘要

`nextjs-version` 目前是一个完整的独立 Next.js 应用（`private: true`，无 `exports`/`files`/`manifest`/`client` 入口），不满足 Shell 的模块契约。要让它能被 `npm install` 后被 `assemble:modules` 正常装配，需要做的修改分为六类：

| 类别 | 内容 | 性质 |
| --- | --- | --- |
| ① npm 包契约 | `package.json` 增加 `files` / `exports` / `peerDependencies` / `build:module` 脚本 | 新增配置，不破坏现有脚本 |
| ② 模块元数据 | 新增 `module/manifest.json`、`module/client.ts` | 新增文件 |
| ③ 打包流水线 | 新增 `scripts/build-module.mjs`，产出 `dist-module/` | 新增脚本（双流水线之一） |
| ④ DSL 规范化 | 打包时解决 `.page.yaml` 命名、`$include`、布局字符串、菜单 `path`、`lazy`、绝对 URL、导航路径、资源 URL | 由打包脚本在产物侧转换，**源 YAML 可不改**；部分建议同步修源 |
| ⑤ 客户端扩展 | actions 汇总导出、CSS 打包、Tailwind 预编译 | 新增打包逻辑，复用现有 `src/pactor/*` |
| ⑥ 依赖治理 | Pactor 版本从 `latest` 固定到与 Shell 对齐的范围 | 修改 `package.json` |

按 README 的设计目标 G1，改造后 `nextjs-version` 必须**同时保留** `npm run dev` / `next build`（独立应用）与 `npm run build:module`（npm 交付）两条流水线，互不替代；`app/`、`.next/` 不进入发布目录。

---

## 2. Shell 模块契约对照（差距清单）

依据 README「模块交付契约」五条逐项对照 `nextjs-version` 现状：

| 契约 | 要求 | nextjs-version 现状 | 差距 |
| --- | --- | --- | --- |
| Manifest V1 | `schemaVersion: "1"` 的 `manifest.json`（id、version、basePath、dslRoot、sitemap、assetsRoot、clientEntry 等） | 无 | 需新增 |
| exports 显式 | 至少 `./manifest`、`./client`，路径相对发布根，禁止 `../` 逃逸 | `package.json` 无 `exports` 字段 | 需新增 |
| 双流水线分离 | `next build` 与 `build:module` 互不替代；`app/`、`.next/` 不打入 `files` | 只有应用流水线（`dev`/`build`/`start`） | 需新增 `build:module` |
| peer 单例 | React、React DOM、Pactor、Next 由 Shell 提供兼容版本；不得初始化全局 Router 或覆盖 Shell 全局 Context | Pactor 系列全部为 `latest` 的 `dependencies`；组件/actions 会被打进 Shell bundle | 需改为 `peerDependencies` 并固定版本范围；打包时设 external |
| sitemap 可合并 | `pages[].path` 为模块相对路径；Shell 拼 `basePath` 并做 URL 唯一性校验 | `sitemap.yaml` 中 `path` 为 `/risk-analysis/...` 等应用根相对路径 | 打包后作为「模块相对路径」语义成立，但需配合 §5.4 的导航重写 |

---

## 3. 修改项 ①：`package.json`

### 3.1 必改字段

```jsonc
{
  "name": "@innospots/ai-risk-mesh",   // 建议加 scope，避免与公共包冲突
  "version": "0.1.0",
  // "private": true 可保留（仍可 npm pack / file: 安装）；要发布到 registry 时移除

  "files": ["dist-module"],            // 只发布构建产物

  "exports": {
    "./manifest": "./dist-module/manifest.json",
    "./client": {
      "types": "./dist-module/client/index.d.ts",
      "import": "./dist-module/client/index.js"
    },
    "./styles.css": "./dist-module/client/index.css"
  },

  "scripts": {
    // 现有脚本全部保留（双流水线）
    "dev": "next dev -p 8011",
    "build": "node scripts/build.mjs production",
    "start": "next start -p 8011",
    // 新增模块流水线
    "build:module": "node scripts/build-module.mjs",
    "pack:module": "npm run build:module && npm pack --dry-run && npm pack"
  }
}
```

注意：`exports` 一旦声明，未列出的子路径（如 `@innospots/ai-risk-mesh/package.json`）将无法被 import，需按需补充。

### 3.2 依赖治理（契约第 4 条「peer 单例」）

当前 `dependencies` 中的运行时依赖全部声明为 `"latest"`，这会导致：打进 client bundle 时解析出与 Shell 不同的 Pactor 实例（双实例），以及不可复现的构建。需要：

```jsonc
{
  "peerDependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "next": "^16.3.5",
    "pactor-app": "^1.54.0",
    "@pactor-app/core": "^1.54.0",
    "@pactor-app/runtime": "^1.54.0",
    "@pactor-app/ui": "^1.54.0",
    "@pactor-app/blocks": "^1.54.0",
    "@pactor-app/chat": "^1.54.0",
    "@pactor-app/i18n": "^1.54.0"
  },
  "devDependencies": {
    // 保留一份用于独立 dev / build 的实际安装版本（与 Shell lock 对齐，当前 Shell lock 为 1.54.2）
    "pactor-app": "1.54.2",
    "@pactor-app/core": "1.54.2",
    "...": "..."
  }
}
```

- 版本范围须与 Shell 实际安装版本兼容（Shell 当前 lock 在 `1.54.2`，`nextjs-version` 实测装到 `1.54.5`，**必须先对齐再回归**）。
- `yaml` 仅在服务端/打包脚本中使用，可留在 `devDependencies`。
- `vendor/` 下的 `pactor-app-*.tgz` 私有制品若仍被引用，需在打包/发布流程中说明来源，避免 `npm install` 时解析失败。

---

## 4. 修改项 ②：模块元数据（新增文件）

### 4.1 `module/manifest.json`（模板，`version` 由打包脚本写入）

```json
{
  "schemaVersion": "1",
  "id": "risk",
  "name": "AI Risk Mesh",
  "version": "0.1.0",
  "pactorVersionRange": "^1.54.0",
  "basePath": "/risk",
  "sitemap": "dsl/sitemap.yaml",
  "dslRoot": "dsl",
  "assetsRoot": "assets",
  "styles": ["./client/index.css"],
  "clientEntry": "./client/index.js"
}
```

- `id: "risk"` 会进入 `globalPageId`（如 `risk:risk-model-diagnosis`）与 `public/modules/risk/<version>/` 路径，选定后保持稳定。
- `basePath` **不要用 `/`**：Shell 的 `joinPublicPath` 会产生 `//login`（集成文档 §5.10 已实测）。
- 字段名与 README「Manifest V1」表保持一致；`sitemap`/`dslRoot`/`assetsRoot`/`clientEntry` 均相对发布根 `dist-module/`。

### 4.2 `module/client.ts`（client 入口，契约的 `extensions` 导出）

```ts
import { pactorComponents } from "../src/pactor/components";
import { riskActions } from "../src/pactor/risk-actions";
import { developActions } from "../src/pactor/develop-actions";
import { localeActions } from "../src/pactor/locale-actions";
import "../src/pactor/components/index"; // 15 个业务 CSS 的 side-effect import

export const extensions = {
  components: pactorComponents,
  actions: { ...riskActions, ...developActions, ...localeActions },
};
```

现状要点（决定了这个入口的必要性）：

- `src/pactor/components/index.ts` 中 `pactorComponents = {}`（空注册表，页面全部使用 Pactor 内置组件），但该文件承担了 **15 个业务 CSS 的 side-effect 引入**，打包时必须保留。
- 页面 `onInit` 依赖 `risk.enterPage`、布局依赖 `risk.syncShell`、数据接口页依赖 `develop.*`、账户菜单依赖 `locale.set`——这些 action 不在 `extensions.actions` 中注册，页面初始化即失败。
- `riskActions` 与布局 `riskShell` 状态同源，**必须打进同一份 bundle**，不能拆分。

---

## 5. 修改项 ③④：打包流水线 `scripts/build-module.mjs`（核心新增）

参照 `ui-console` 的 `scripts/build-module.mjs` 模式，用 esbuild + 文件复制产出 `dist-module/`。该脚本需要完成以下七件事；其中 1–5 是对现有 YAML 组织方式的**产物侧规范化**（源文件可不动）。

### 5.1 页面 DSL：展开 `$include` + 改名落盘

现状：

- 页面源文件为 `src/server/yaml/**/<id>.page.yaml`（登录页为 `common/login.yaml`），共 22 页；另有约 145 个 `*.fragment.yaml` 通过 `$include` 引用（页面级 103 处，含嵌套共 368 行匹配）。
- `$include` 目前由 `src/server/sitemap.ts` 在**请求期**展开；Shell 装配器不做展开，只按文件名 `<pageId>.yaml` 在 `dslRoot` 下递归查找。

打包脚本需要：

1. 递归收集 `src/server/yaml/**`，按 `sitemap.ts` 的 `collectPageFiles` 同一套规则识别页面文件（排除 `sitemap.yaml`、`*.layout.yaml`、`*.fragment.yaml`）。
2. 对每个页面做 `$include` 递归展开（`$include` 必须是对象唯一键；递归时检测循环引用），把 fragment 内容内联进页面。
3. 输出为 `dist-module/dsl/<pageId>.yaml`（去掉 `.page` 后缀；登录页 `common/login.yaml` → `dsl/login.yaml`）。

替代方案：修改源仓库规范，直接把所有页面改名为 `<id>.yaml` 并手工内联 fragment——不推荐，破坏现有 `sitemap.ts` 的请求期展开链路和独立应用运行。

### 5.2 sitemap：布局字符串内联 + 菜单去 `path` + 页面去 `lazy`

现状（`src/server/yaml/sitemap.yaml`）：

- `layouts` 中 6 个布局里 `risk-analysis` / `risk-decision` / `system-management` 三个的值是**字符串路径**（如 `risk-analysis/risk-analysis.layout.yaml`），由 `sitemap.ts:146` 在服务端解析；Shell 会把字符串原样透传给客户端，`SitemapApp` 无法解析。
- 22 个页面均 `lazy: true`；Shell 的 lazy 端点返回 `{ version, pageDsl }`，而 Pactor 1.54.x 的加载器读取 `resource.schema`，两者不一致（Shell 自身缺陷）。
- 菜单项多带显式 `path`；Shell 装配只给 `pageId` 加 `moduleId:` 命名空间，不给 `path` 加 `basePath` 前缀，保留会跳到未装配的 URL。

打包脚本需要输出一份**改写后的** `dist-module/dsl/sitemap.yaml`：

1. 读取字符串形式的布局文件，内联为布局对象（`admin`、`login`、`blank` 已是内联对象，原样保留）。
2. 页面去掉 `lazy: true`，让 `pageDsl` 随 `/api/runtime/bootstrap` 内联下发，绕开 Shell lazy 端点的契约不一致；或等 Shell 修好 `pages.ts` 后保留 lazy（见 §8）。
3. 菜单删除显式 `path`，由 Pactor 的 `mergeSitemapMenus` 按 `pageId` 回填。
4. 演示期可选给 pages/menus 加 `public: true`（Shell 会话恒 `null`，非 public 页匿名不可见）；**生产必须移除**，接真实会话后由权限字段控制。

### 5.3 绝对 API 地址

DSL 中存在两处硬编码绝对地址：

- `src/server/yaml/common/login.yaml:35`：`http://localhost:8011/api/auth/login`
- `src/server/yaml/sitemap.yaml:542`：`http://localhost:8011/api/auth/logout`

模块装入 Shell 后源应用的 8011 端口不复存在。打包脚本应将其重写为 **Shell 相对路径**（如 `/api/auth/login`），并在 Shell 侧实现/代理对应路由（属 Shell 改动，见集成文档 §7 P0）；源 YAML 建议同步改为环境变量或相对路径，避免双端漂移。另有 3 个页面（`risk-data-value`、`risk-reject-recovery`、`risk-task`）依赖 `/api/risk-analysis/*`，同样需要 Shell BFF/代理，不在模块改造范围内，但要在文档中声明。

### 5.4 页内导航路径重写

装配后所有 URL 带 `/risk` 前缀，DSL 中以下模块内绝对导航需加前缀，否则 404：

- `common/login.yaml:57-58`：`app.reload` → `/risk-analysis/model-diagnosis`
- `risk-decision/backtest/sections/backtest-table.fragment.yaml`：`/risk-decision/sandbox/backtest/executions/:taskId`
- `risk-decision/backtest/sections/execution-record-topbar.fragment.yaml`：`/risk-decision/sandbox/backtest`
- `sitemap.yaml` 登出后 `app.reload` → `/login`

规则：**只重写 `navigate` / `app.reload` 的 `to`，绝不重写 `request` 的 API `url`**。此项在打包脚本中按 DSL 结构遍历完成；更彻底的做法是修改源 YAML 改用相对导航或 pageId 导航（如 Pactor 支持），消除重写步骤。

### 5.5 静态资源与资源 URL 重写

- `public/**`（含 `skins/`、`next.svg` 等）复制到 `dist-module/assets/`；装配后浏览器路径为 `/modules/risk/<version>/<file>`。
- DSL 中的资源引用（如 `sitemap.yaml` 布局里的 `/next.svg`）需重写为 `/modules/risk/<version>/next.svg`——Shell 装配器**不会**自动重写（README「设计不足」已列明）。
- `public/skins/*.css` 虽可随 assets 复制，但首屏注入逻辑在 `app/layout.tsx`（不打入模块），皮肤能力依赖 Shell 改造，模块侧只需保证资源可达。

### 5.6 client bundle 打包（esbuild）

```bash
esbuild module/client.ts \
  --bundle --format=esm --platform=browser \
  --alias:@=./src \
  --external:react --external:react-dom --external:next \
  --external:pactor-app --external:@pactor-app/* \
  --outfile=dist-module/client/index.js
```

要点：

- `--alias:@=./src`：源码中 `@/shared/...` 等路径别名来自 `tsconfig.json`，esbuild 必须显式映射。
- React / React DOM / Next / Pactor 全部 external（契约第 4 条「peer 单例」），由 Shell 提供单例；打进 bundle 会导致运行时双实例。
- CSS import 由 esbuild 输出为 `dist-module/client/index.css`（见 §6）。
- 可选产出 `index.d.ts`（`exports["./client"].types`）与 sourcemap。

### 5.7 manifest 落盘与校验

- 从 `module/manifest.json` 模板复制到 `dist-module/manifest.json`，写入与 `package.json` 同步的真实 `version`。
- 可选生成 `module-assets.json`（资源路径 + sha256 清单，与 `ui-console` 对齐）。
- 打包结束时自检：22 个页面 DSL 全部存在、`$include` 残留为 0、sitemap 中每个 `pages[].id` 都有对应文件（与装配器「失败即阻断」原则对齐，提前暴露问题）。

---

## 6. 修改项 ⑤：样式三件事

`nextjs-version` 的样式来源分散，装入 Shell 后原样丢失的风险最高（Shell `app/globals.css` 只有 `@import "tailwindcss";`）：

1. **Pactor 聚合样式**：`app/globals.css` 中 `@import "pactor-app/styles.css";`（含其下的显隐修复层规则）需并入 `dist-module/client/index.css`，或推动 Shell 全局引入（Shell 改动）。
2. **Tailwind 工具类**：YAML 中大量 `className: p-4 flex gap-2 ...`，独立应用构建时 Tailwind 扫描 `src/server/yaml` 生成；Shell 的 `.gitignore` 忽略 `.generated` 与 `node_modules`，Tailwind v4 自动扫描会跳过这两处。模块侧方案：打包阶段用 Tailwind CLI 扫描 `dist-module/dsl/` 与 `src/pactor/**`，预编译出普通 CSS 并入 `client/index.css`——不改 Shell 的推荐做法。
3. **应用级全局规则**：`app/globals.css` 里的 `.shell-root` 布局、响应式显隐修复等不在 15 个组件 CSS 中，需剥离 Tailwind/pactor 的重复 import 后一并放入 `client/index.css`。

最终 `client/index.css` = pactor 聚合样式 + 预编译 Tailwind 工具类 + 15 个业务 CSS + 应用级全局规则，通过 `exports["./styles.css"]` 与 manifest `styles` 暴露给 Shell。

---

## 7. 改造后的仓库结构（对照 README 的 ui-console 模式）

```text
nextjs-version/
├── app/                        # 独立 Next：dev / demo（不进 npm 包）
├── src/
│   ├── pactor/
│   │   ├── App.tsx             # 独立应用入口（不打进 client 包）
│   │   ├── components/         # 空注册表 + 15 个业务 CSS（进 client 包）
│   │   ├── risk-actions.ts     # → extensions.actions
│   │   ├── develop-actions.ts  # → extensions.actions
│   │   └── locale-actions.ts   # → extensions.actions
│   └── server/yaml/            # DSL 源（sitemap + 22 页 + 6 布局 + 145 片段）
├── public/                     # 静态资源源 → dist-module/assets
├── module/                     # 【新增】npm 模块元数据
│   ├── manifest.json           # Manifest V1 模板
│   └── client.ts               # export const extensions = {...}
├── scripts/
│   ├── build.mjs               # 现有应用构建（保留）
│   └── build-module.mjs        # 【新增】模块打包
├── dist-module/                # 【新增产物】npm files 唯一发布目录
│   ├── manifest.json
│   ├── dsl/
│   │   ├── sitemap.yaml        # 布局已内联、菜单去 path、页面去 lazy
│   │   └── <pageId>.yaml       # 22 个，$include 已展开
│   ├── client/
│   │   ├── index.js            # extensions（React/Pactor/Next external）
│   │   └── index.css           # pactor 样式 + Tailwind 预编译 + 业务 CSS
│   ├── assets/                 # 自 public/ 复制
│   └── module-assets.json      # 可选
└── package.json                # 增加 exports/files/peerDependencies/build:module
```

---

## 8. 不在本次模块改造范围、但必须同步声明的事项

以下能力即使模块改造完成也不可用，属 Shell 侧责任（详见集成文档 §7），在模块 README / 交付说明中必须显式列出：

| 能力 | 原因 | 责任方 |
| --- | --- | --- |
| 登录 / 登出 / 会话 | Shell 会话恒 `null`、无 `/api/auth/*` | Shell 接统一登录 + BFF |
| 3 个风险分析数据页 | 缺 `/api/risk-analysis/*` 路由 | Shell BFF/代理 |
| `/api/d` 通用数据源 | Shell 无 BFF 且 `PactorHost` 未传 `httpAdapter` | Shell |
| 多语言 | Shell 未传 `locale` / `messages`，`locale.set` 无法驱动 | Shell |
| 皮肤换肤 | 首屏注入在模块外的 `app/layout.tsx` | Shell |
| lazy 页面 | Shell `pages.ts` 返回 `{pageDsl}` 与 Pactor 1.54.x `resource.schema` 不一致 | Shell（模块侧已用去 lazy 规避） |
| 演示期 `public: true` | 匿名全开放是安全降级 | 生产前必须移除 |

---

## 9. 实施与验收步骤

```bash
# 1. 模块仓库
cd /Users/Zhuanz/Documents/workspace/nextjs-version
npm install
npm run build:module        # 产出 dist-module/
npm run pack:module         # dry-run 检查 files + 生成 tgz

# 2. Shell 仓库
cd web-shell
pnpm add ../nextjs-version/innospots-ai-risk-mesh-0.1.0.tgz
# 编辑 src/modules/module-list.json：{ "package": "@innospots/ai-risk-mesh", "enabled": true, "basePath": "/risk" }
pnpm run assemble:modules && pnpm run validate:modules
pnpm run dev
```

验收清单：

- [ ] `npm pack --dry-run` 只包含 `dist-module/`，无 `app/`、`.next/`、`node_modules/`
- [ ] 空目录安装 tgz 后 `require.resolve` 可解析 `./manifest`、`./client`、`./styles.css`
- [ ] `dist-module/dsl` 下 22 个 `<pageId>.yaml`，`$include` 残留为 0
- [ ] sitemap 布局全部为对象、菜单无 `path`、页面无 `lazy`
- [ ] client bundle 不内嵌 react / pactor（检查产物体积与 import 语句）
- [ ] `assemble:modules` / `validate:modules` 通过（22 路由、22 页面、无 URL 冲突）
- [ ] `/api/runtime/bootstrap` 返回 22 页且内联 `pageDsl`
- [ ] 浏览器验收：菜单/布局嵌套/页内 actions/Tailwind 工具类样式/深链刷新
- [ ] 独立应用回归：`npm run dev`（8011）功能不受影响（双流水线原则）
- [ ] Pactor 版本与 Shell lock 对齐后全量回归

---

## 10. 与既有集成文档的关系

`docs/ai-risk-mesh-npm-module-integration.md` 在「不改 `nextjs-version` 源码」的约束下给出适配包方案（方案 A），其 PoC 已验证装配链路（22 页 / 22 路由）。本文描述的是**放开该约束后的原生改造路径**：

- 适配包方案中的每一项转换（`$include` 展开、改名、布局内联、菜单去 path、去 lazy、URL 重写、Tailwind 预编译、actions 打包）在本文中**全部保留**，只是从外部适配层内化为仓库自己的 `build:module` 流水线——这正是 README 中 `ui-console` 的标准形态。
- 原生改造的额外收益：模块版本随仓库 SemVer 演进、DSL 源与产物同源可追溯（README「开发可溯源」）、不再需要维护第三个仓库。
- 建议：以适配包 PoC 的转换逻辑为蓝本实现 `scripts/build-module.mjs`，验证一致后废弃外部适配层。
