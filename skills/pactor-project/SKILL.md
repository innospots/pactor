---
name: pactor-project
description: |
  Use when initializing or scaffolding a new Pactor application — empty repo, greenfield project, or "how do I start" (skill id pactor-project). Triggers: pactor-project, create-pactor-app, pnpm create pactor-app, pactor create, 初始化项目, 创建脚手架, 新建 Pactor 工程, next-app/spa starter, copy starters/. Guides template choice (next-app vs spa vs minimal Vite), exact CLI commands, post-scaffold verification, and when to use pactor-prd or manual StaticDslLoader instead.
version: 1.1.0
---

# Pactor 工程初始化与脚手架

帮助 Agent **从零创建可运行的 Pactor 业务工程**：选对模板、执行官方脚手架、安装依赖、启动 dev，并说明生成后的目录该改哪里。

## When to activate

- 用户要**新建 / 初始化** Pactor 项目，或问「怎么搭架子」
- 提到 `pnpm create pactor-app`、`create-pactor-app`、`pactor create`
- 要在现有空目录生成工程，或从 monorepo 的 `starters/` 复制模板
- 在 **next-app（全栈）** 与 **spa（纯前端）** 之间选型
- 用户**不是**从 PRD 批量生成多模块后台（那种场景用 `pactor-prd` skill）

## What this skill does NOT cover

| 场景 | 使用 |
| --- | --- |
| 写/改 `*.page.yaml`、组件 props、动作编排 | `pactor-dsl` skill + `pactor-dsl/references/dsl-authoring.md` |
| 根据 PRD / 线框图生成整站页面与 mock API | `pactor-prd` skill（复制其 `template/`，不用本 skill 的 create 命令） |
| 在已有 Vite 里只加几行 `createPactorApplication` | `pactor-dsl` skill「Quick start」+ 文档 manual-setup |

## 选型（先问清楚再执行）

```text
需要自带 mock API + 登录 + sitemap 端点？
  ├─ 是 → next-app（Next.js 全栈，dev :9011）
  └─ 否，只要浏览器壳，接口已有或另起服务？
        ├─ 接口形态已是 sitemap + /pages/{id} → spa（Vite，dev :9012，baseUrl 指后端）
        └─ 单页原型 / 教学最小集 → pactor create（Vite + StaticDslLoader，见 references/minimal-vite.md）
```

**默认推荐**：不确定时用 **next-app**（与 `create-pactor-app` 默认模板一致）。

## 标准流程（Agent 执行清单）

1. **确认目标路径**：目录不存在或为空；脚手架**拒绝覆盖非空目录**（退出码 2）。
2. **确认包管理器**：优先 `pnpm`（模板带 lockfile）；用户坚持用 npm/yarn 可改，但需说明 lock 差异。
3. **运行脚手架**（在目标父目录执行）：

```bash
pnpm create pactor-app <dir-name>              # TTY 交互选模板；非 TTY 默认 next-app
pnpm create pactor-app <dir-name> -t next-app  # Next.js 全栈 + mock API
pnpm create pactor-app <dir-name> -t spa       # Vite SPA + SitemapApp
```

等价：`npx create-pactor-app <dir-name> [-t next-app|spa]`。

4. **安装与启动**：

```bash
cd <dir-name>
pnpm install
pnpm dev
```

5. **验收**：
   - **next-app**：打开 http://localhost:9011 ，用 `admin` / `pactor123` 登录
   - **spa**：先在同一机器启动 next-app 或兼容的 sitemap 服务（:9011），再开 http://localhost:9012
6. **告诉用户改哪里**：见 `references/templates.md` 中的「生成后首要修改点」。

## 备选入口

### `@pactor-app/cli` 最小 Vite 工程

仅生成 **StaticDslLoader + 单页 YAML** 的瘦项目（无 sitemap、无 Next）：

```bash
pnpm add -D @pactor-app/cli
pnpm pactor create my-app          # 模板 id 目前仅 app
cd my-app && pnpm install && pnpm dev
```

细节见 `references/minimal-vite.md`。

### 在 Pactor monorepo 内

不跑 npm 发布包时，可直接复制源码模板（与 `packages/create-app/templates` 同步）：

```bash
cp -R starters/next-app-starter ../my-app    # 或 spa-starter
cd ../my-app && pnpm install && pnpm dev
```

改框架包后若示例依赖 workspace `dist`，在 monorepo 根目录先 `pnpm build`。

### 同步模板到 create-app

维护者更新 `starters/*` 后，在 `packages/create-app` 执行 `pnpm sync-templates`（再发布 `create-pactor-app`）。

## 红线

1. **不要**对非空目录强行 `scaffold`；应新建子目录或让用户清空/换路径。
2. **不要**在 spa 单独开发时忘记后端：默认 `apiBaseUrl` 指向 `http://localhost:9011`。
3. **不要**把 PRD 整站生成与普通空壳脚手架混用；PRD 流程（pactor-prd）同样经 create-pactor-app next-app 模板创建，但必须带 `--values` 渲染占位符并走该 skill 的页面生成与验收流程。
4. 使用内置 UI 时，入口必须 `import '@pactor-app/ui/styles.css'`（模板已包含；手动接入时勿漏）。
5. 生成后加页：官方 next-app 默认 **`src/server/yaml/pages/*.page.yaml`**（平铺）；模块多或页面 >5 时迁到 **`yaml/<模块>/<id>.yaml`**，规则见 `pactor-dsl/references/page-catalog-and-layout.md`。spa 由远端 sitemap 声明 pageId，yaml 通常在 API 侧。

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 目标目录非空 | 换空目录名或新建文件夹 |
| spa 白屏 / 接口失败 | 确认 :9011 sitemap 已启动、`src/pactor/config.ts` 的 `apiBaseUrl` 正确 |
| CORS | spa 模板用 `createHttpHooks`；跨域需后端允许来源 |
| 想改 dev 端口 | 改各模板 `package.json` scripts 或框架 dev 配置（next/vite） |

更多结构说明：`references/templates.md`、`references/minimal-vite.md`。

## References

- `references/templates.md` — next-app / spa 目录树、端口、演示账号、首要修改点
- `references/minimal-vite.md` — `pactor create` 与手写 Vite 接入对比
- 官方文档：`docs/src/content/docs/guides/getting-started.md`
- 脚手架实现：`packages/create-app`（`create-pactor-app`）
- 生成后写页面：启用 `pactor-dsl` skill
