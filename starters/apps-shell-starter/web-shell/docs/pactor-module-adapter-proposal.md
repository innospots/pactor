# 在 pactor 仓库中开发「模块适配器」的可行性与设计方案

- 日期：2026-10-23
- 问题：是否可以在 `/Users/Zhuanz/Documents/workspace/pactor`（Pactor monorepo）中开发一个适配器，帮助被引用的工程（如 `nextjs-version`）适配为 npm 依赖包、被底座（`innospots-web-shell`）装配引用？
- 结论：**可行，且 pactor 仓库是最佳归属地**。建议形态为新包 `@pactor-app/module-pack` + `@pactor-app/cli` 新增 `pactor module *` 子命令。
- 相关文档：
  - `docs/ai-risk-mesh-npm-module-integration.md`（适配包 PoC，转换逻辑蓝本）
  - `docs/ai-risk-mesh-npm-package-required-changes.md`（目标工程改造清单）

> **历史文档**：本提案中的模块 API 缺口已由后续的 **Module server entry** 方案补齐
> （`module/server.ts` + `serverEntry`/`apiPrefixes` + Shell `/api/modules/<moduleId>/*`）。
> 当前实现见 `README.md` 与 `pactor` 仓库 `packages/module-pack/README.md`。

---

## 1. 为什么适配器应该放在 pactor 仓库

### 1.1 转换逻辑是框架级约定，不是业务工程特有

上一阶段为 `ai-risk-mesh` 梳理的全部打包转换（`$include` 展开、`.page.yaml` 改名、布局字符串内联、菜单去 `path`、去 `lazy`、URL 重写、client bundle、Tailwind 预编译、Manifest 生成），**没有一项与 ai-risk-mesh 业务相关**。它们全部来自 Pactor 应用的标准结构：

```text
src/server/yaml/sitemap.yaml        # 页面/菜单/布局清单
src/server/yaml/**/<id>.page.yaml   # 页面 DSL
src/server/yaml/**/*.fragment.yaml  # $include 片段
src/pactor/components/index.ts      # 组件注册表 + CSS side-effect
src/pactor/*-actions.ts             # 自定义 actions
```

`pactor/starters/next-app-starter`、`nextjs-version`、`ui-console` 结构同构（同样的 `scripts/build.mjs`、同样的 yaml 目录约定）。任何一个从 starter 衍生的工程要变成 Shell 模块，需要的转换是同一套——放在 pactor 仓库做一次，所有工程受益。

### 1.2 契约语义的权威实现在框架侧

PoC 适配层（`/tmp/airisk-module-poc/build-adapter.mjs`）最大的隐患是**语义分叉**：它重新实现了 `nextjs-version/src/server/sitemap.ts` 的 `$include` 展开、`collectPageFiles` 收集规则、布局路径解析。一旦各工程的 `sitemap.ts` 演进，外部适配层就会静默漂移。

而 pactor 仓库才是这些约定应该沉淀的地方。关键事实：

- **`$include` 目前不是框架特性**：`pactor/packages/*/src` 中没有任何 `$include` 实现，它是各应用在自己的 `sitemap.ts` 里重复实现的应用层约定。
- **布局字符串引用同理**（`sitemap.ts` 解析 `layouts.<name>: <path>`）。
- 框架侧已有可复用资产：`packages/cli/src/dsl-io.ts`（`collectDslFiles` / `readDslFile` / `validateDsl` / `isFragmentFile`）、`packages/app/src/sitemap/*`（loader/merge/route 等运行时逻辑）。

适配器放在 pactor，可以顺势把 `$include`、布局引用**上游化为框架能力**（§3.4），应用层与打包层共用一份实现，从根上消除分叉。

### 1.3 双向契约的单一管理点

Shell 模块契约（Manifest V1、`globalPageId`、lazy 端点响应格式）本质上是「Pactor 运行时 ↔ 底座」的协议。协议双方演进时（例如 Pactor 1.54.x 的 lazy 加载读 `resource.schema`，而 Shell 返回 `{pageDsl}`），在框架仓库里能同时看到两端契约，比散落在各业务工程的 `build-module.mjs` 副本更容易保持一致。

---

## 2. 现有基础盘点（pactor 仓库）

| 资产 | 位置 | 对适配器的价值 |
| --- | --- | --- |
| DSL 工具链 | `packages/cli`（validate / inspect / lint / schema / build / create） | 适配器作为新命令族 `pactor module *` 挂载，复用 CLI 框架（`args.ts`、`dsl-io.ts`） |
| DSL 收集/校验 | `packages/cli/src/dsl-io.ts` | 页面/片段文件识别、YAML 解析、schema 校验直接复用 |
| sitemap 运行时 | `packages/app/src/sitemap/*` | 菜单合并、路由解析语义参照；`mergeSitemapMenus` 按 pageId 回填 path 的行为正是「菜单去 path」的依据 |
| 标准工程模板 | `starters/next-app-starter` | 适配器的 fixture 与 `module init` 的改造对象；也是契约的默认假设来源 |
| 转换逻辑蓝本 | PoC `/tmp/airisk-module-poc/build-adapter.mjs` + `docs/ai-risk-mesh-npm-module-integration.md` §5/附录B | 已实测通过（22 页 / 22 路由），直接作为实现起点 |

---

## 3. 设计方案

### 3.1 形态：`@pactor-app/module-pack` + CLI 子命令

```text
packages/
├── module-pack/                # 【新增】库：全部打包转换逻辑（可编程 API）
│   ├── src/
│   │   ├── collect.ts          # 页面/布局/片段收集（基于 cli dsl-io 抽象）
│   │   ├── expand-include.ts   # $include 展开（§3.4 上游化）
│   │   ├── transform-sitemap.ts# 布局内联 / 菜单去 path / 去 lazy / public 演示
│   │   ├── rewrite-urls.ts     # 导航 to 重写、资源 URL 重写（区分 API url）
│   │   ├── bundle-client.ts    # esbuild client 打包（external 规则内置）
│   │   ├── compile-styles.ts   # Tailwind 预编译 + CSS 合并
│   │   ├── emit-manifest.ts    # Manifest V1 生成 + module-assets.json
│   │   └── profiles/           # 底座契约 profile（§3.3）
│   └── package.json            # @pactor-app/module-pack
└── cli/src/commands/
    ├── module-init.ts          # 【新增】pactor module init
    ├── module-build.ts         # 【新增】pactor module build
    ├── module-validate.ts      # 【新增】pactor module validate
    └── module-pack.ts          # 【新增】pactor module pack（build + npm pack）
```

库的 API 与 CLI 分离，保证 Shell 装配器、CI 或其他工具也能编程调用。

### 3.2 目标工程侧的接入面（`pactor module init` 生成）

```text
<目标工程>/
├── module/
│   ├── client.ts               # export const extensions（init 时扫描 src/pactor 生成）
│   └── ...
├── pactor.module.json          # 【新增】适配器配置
└── package.json                # init 注入 build:module 脚本与 exports/files/peerDependencies
```

```jsonc
// pactor.module.json
{
  "id": "risk",                    // 模块 id → globalPageId 前缀
  "name": "AI Risk Mesh",
  "basePath": "/risk",
  "yamlRoot": "src/server/yaml",   // 默认即 starter 约定，允许偏离
  "clientEntry": "module/client.ts",
  "actions": [                     // init 时自动发现 src/pactor/*-actions.ts
    "src/pactor/risk-actions.ts",
    "src/pactor/develop-actions.ts",
    "src/pactor/locale-actions.ts"
  ],
  "publicDir": "public",
  "target": "innospots-web-shell@1", // 底座契约 profile
  "demo": { "public": false }        // 演示模式：pages/menus 标 public
}
```

`init` 原则：**只新增、不破坏**——保留目标工程 `dev`/`build`/`start` 双流水线（README G1），不修改现有源码文件。

### 3.3 底座 profile：不硬编码 Shell 的怪癖

前一阶段文档中的若干转换本质上是**当前 Shell 实现的缺陷规避**，而非永恒契约：

| 转换 | 性质 |
| --- | --- |
| 去 `lazy`（绕开 `{pageDsl}` vs `resource.schema` 不一致） | Shell `pages.ts` 缺陷，应修 Shell |
| 菜单去显式 `path`（装配不加 basePath 前缀） | Shell 装配器行为 |
| 布局字符串内联（装配器透传字符串） | Shell 装配器缺陷 |
| 导航 URL 加 basePath 前缀、资源 URL 重写为 `/modules/<id>/<version>/` | Shell 装配不重写 DSL |
| `basePath` 禁止 `/`（`joinPublicPath` 产生 `//`） | Shell 脚本缺陷 |

如果把这些写死在适配器里，Shell 修复后适配器反而制造错误产物。因此设计 **target profile**：

```ts
// packages/module-pack/src/profiles/innospots-web-shell.ts
export const innospotsWebShellV1: TargetProfile = {
  name: "innospots-web-shell",
  version: 1,
  inlineStringLayouts: true,
  stripMenuPaths: true,
  forceInlinePages: true,          // 去 lazy（Shell lazy 端点修好前）
  rewriteNavigation: { basePath: true, excludeApiUrls: true },
  rewriteAssetUrls: (id, version) => `/modules/${id}/${version}/`,
  forbidRootBasePath: true,
};
```

Shell 修复某项后发布 `innospots-web-shell@2` profile，模块侧改一行配置即可重新打包。框架侧修好了 lazy 契约（Pactor loader 兼容 `pageDsl`），`forceInlinePages` 全局关闭。

### 3.4 `$include` 与布局引用：建议上游化为框架能力

两步走：

1. **第一步（适配器自带）**：在 `module-pack` 中实现展开器（语义以 PoC 为蓝本：`$include` 为对象唯一键、递归、循环引用检测），立刻可用。
2. **第二步（上游化）**：把展开器移入 `@pactor-app/schema` 或 `@pactor-app/cli` 的 dsl-io，作为 `pactor build` 的标准能力；各应用的 `src/server/sitemap.ts` 改为调用框架实现。应用运行时展开与打包时展开共用一份代码，语义不再分叉。布局字符串引用同此处理（`packages/app/src/sitemap/loader.ts` 是自然落点）。

### 3.5 client bundle 与样式（内置最佳实践）

- esbuild 打包 `clientEntry`，React / React DOM / Next / `pactor-app` / `@pactor-app/*` 内置 external（peer 单例契约，防双实例）；
- `--alias` 自动从目标工程 `tsconfig.json` 的 `paths` 生成（解决 `@/` 别名）；
- 同一 bundle 保证 actions 状态同源（`risk.enterPage` 与 `risk.syncShell` 教训）；
- CSS：esbuild 收集 side-effect CSS + 调用 Tailwind CLI 扫描 `dsl/` 产物预编译工具类 + 合并 pactor 聚合样式，输出单文件 `client/index.css`；
- 版本写入：读取目标工程安装的 pactor 版本写 `pactorVersionRange`，读 Shell lock（可选参数）写 `peerDependencies` 建议，版本漂移在 `module validate` 时报警。

### 3.6 命令行为摘要

| 命令 | 行为 |
| --- | --- |
| `pactor module init` | 扫描工程结构 → 生成 `pactor.module.json`、`module/client.ts`、注入 `package.json`（exports/files/scripts/peerDependencies），全部幂等、不覆盖已有文件 |
| `pactor module build` | 执行 §3.3–§3.5 全链路 → `dist-module/`；任一页面缺失/校验失败即中止（与 README「失败即阻断」对齐） |
| `pactor module validate` | 对照 Manifest V1 + target profile 校验产物：`$include` 残留、页面文件齐备、exports 可解析、client 未内嵌 react/pactor、版本范围与底座兼容 |
| `pactor module pack` | build + `npm pack --dry-run` 检查 + 生成 tgz |

### 3.7 端到端流程（改造后）

```text
业务工程（starter 衍生）                pactor 仓库
┌─────────────────────┐      pactor module init（一次性）
│ src/server/yaml/**  │ ─────────────────────────────► 生成配置与入口
│ src/pactor/*        │
└─────────────────────┘      pactor module build（每次发布）
                              │
                              ▼
                    dist-module/（Manifest V1 + DSL + client + assets）
                              │
                              ▼ npm pack / publish
                    Shell：pnpm add + module-list 启用
                              │
                              ▼
                    assemble:modules → validate:modules → next build
```

---

## 4. 边界：适配器不解决什么

以下属于**底座运行时能力**，适配器不应也不可能在产物侧绕过，保持显式声明（与既有文档一致）：

| 能力 | 责任方 |
| --- | --- |
| 会话 / 登录 / 权限（`/api/auth/*`、真实 session） | Shell 接统一登录 + BFF |
| 业务数据接口（`/api/d/*`、`/api/risk-analysis/*`） | Shell BFF/代理 + `httpAdapter` 注入 |
| 多语言（`locale`/`messages` 传递） | Shell `PactorHost` props + 框架 i18n 包 |
| 皮肤首屏注入 | Shell |
| lazy 契约不一致的根本修复 | Pactor loader 与 Shell `pages.ts` 对齐（框架仓库内可主导） |

---

## 5. 风险与注意事项

1. **同构假设**：适配器默认工程从 `next-app-starter` 衍生；`pactor.module.json` 的 `yamlRoot`/`clientEntry`/`actions` 提供逃生口，但结构大幅偏离的工程仍需个案处理。
2. **不要复制 PoC 的临时语义**：PoC 中「菜单去 path」「去 lazy」是规避手段，必须通过 profile 显式化，避免 Shell 修复后双重错误。
3. **版本绑定发布**：`module-pack` 与 `@pactor-app/*` 同版本发布（changeset/lockfile），避免工具链与运行时漂移。
4. **产物安全**：适配器产出的 npm 包会被 Shell 构建期执行（README「供应链」），`module validate` 应包含 client bundle 的 external 审计。
5. **向后兼容 ui-console**：`ui-console` 现有 `scripts/build-module.mjs` 可作为第二个 fixture 验证通用性，成熟后可替换为 `pactor module build`，统一全集团模块打包方式。
6. **测试策略**：以 `starters/next-app-starter`（最小）与 `nextjs-version`（22 页/145 片段/真实 actions）为 fixtures，快照比对 `dist-module` 产物 + 在 Shell PoC 环境跑装配回归。

---

## 6. 实施路线建议

| 阶段 | 内容 | 验收 |
| --- | --- | --- |
| P0 | `module-pack` 核心：collect / expand-include / transform-sitemap / emit-manifest + `pactor module build` | `next-app-starter` 与 `nextjs-version` 均产出可通过 Shell 装配的 `dist-module` |
| P1 | `module init` / `module validate` / `module pack`、client bundle、Tailwind 预编译、profile 机制 | ai-risk-mesh 全量验收清单通过（见改造文档 §9） |
| P2 | `$include`/布局引用上游化到框架；`innospots-web-shell@2` profile（Shell 修复 lazy/布局/资源重写后） | 应用 `sitemap.ts` 切换到框架实现；profile 切换回归 |
| P3 | 替换 `ui-console` 的 `build-module.mjs`；文档与 starter 内置 `build:module` | 所有模块工程统一走 `pactor module build` |

P0 的实现起点就是 PoC `/tmp/airisk-module-poc/build-adapter.mjs`——它的转换逻辑已实测通过，需要的是产品化（配置化、profile 化、错误处理、测试），而非重新设计。
