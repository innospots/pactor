# Pactor

**Dynamic Application Runtime** — 企业级 **Server-Driven UI（服务端驱动界面）** 与 **AI-Native** 前端运行时。

用 YAML/JSON 写页面，浏览器里一套公共 Runtime 负责渲染、数据、权限和交互；**换页面往往不用重新打包前端**，适合后台、运营台、可配置工作台和 AI 对话类产品。

- 环境：Node.js ≥ 18，pnpm ≥ 9（npm / yarn 亦可）

---

## 这是什么？

传统做法里，每个列表页、表单页都要写 React 组件并打进同一个 bundle。Pactor 把**页面结构**抽成 DSL（`*.page.yaml`），把**能力**留在前端注册（组件库、接口、动作），两者通过协议对接：

```text
  你写的 YAML 页面          前端一次集成的 Runtime
  (可来自 Git / 接口)  →    (React + 内置 UI + 路由 + 权限)
         │                           │
         └──── 表达式、事件、数据源 ────┘
```

**你负责**：搭一次应用壳、注册业务组件/服务、提供菜单与页面 DSL（或 sitemap API）。  
**框架负责**：解析 DSL、拉数、表达式、按钮事件、菜单路由、权限显隐、主题布局。

DSL 里不能塞任意 JavaScript（无 `eval`），保证服务端下发的页面在安全、可校验的边界内运行。

---

## 适合做什么？

| 场景 | 为什么用 Pactor |
| --- | --- |
| **管理后台 / 运营后台** | 列表、表单、详情多且相似；改字段、改按钮常只需改 YAML |
| **多租户 / 多环境界面差异** | 同一套 Runtime，不同客户下发不同菜单与页面 |
| **低代码、配置化工作台** | 页面当资源版本管理，与「发版改一个按钮」解耦 |
| **AI 助手 / Copilot 界面** | 内置 Chat 工作区，消息里可嵌 Markdown + DSL 片段 |
| **原型与 POC** | 脚手架 + mock API，先跑通交互再接真实后端 |

不适合：强依赖复杂客户端状态机、大量自定义 Canvas/WebGL、完全离线单页游戏类应用（仍可用 React 逃生舱写个别页面）。

---

## 三分钟上手

**推荐**：用官方脚手架生成可运行工程（含示例页面与 mock 接口）。

```bash
pnpm create pactor-app my-app -t next-app   # 全栈 Next.js，dev :9011
cd my-app && pnpm install && pnpm dev
```

浏览器打开 http://localhost:9011 ，演示登录 **`admin` / `pactor123`**（访客：`guest` / `guest123`）。

改页面：编辑 `src/server/yaml/pages/*.page.yaml` 和 `sitemap.yaml` 里的菜单，保存后刷新即可看到效果（无需改 React 业务代码）。

其他模板：

```bash
pnpm create pactor-app my-app -t spa   # 纯前端 Vite，dev :9012（需另起 :9011 的 API）
```

---

## 三种常见用法

| 方式 | 一句话 | 何时选 |
| --- | --- | --- |
| **① 脚手架工程** | `pnpm create pactor-app`，sitemap 驱动导航与懒加载页面 | 新项目、要登录/菜单/多页后台 |
| **② 嵌入现有 Vite** | `createPactorApplication` + `StaticDslLoader` + `*.page.yaml` | 单页或少量静态 DSL、原型 |
| **③ 对接后端 API** | 只挂载 Runtime，`api.baseURL` 指向你的服务 | 生产：页面与菜单由后端下发 |

### ② 嵌入 Vite（精简示例）

```bash
pnpm add @pactor-app/app @pactor-app/ui @pactor-app/resource react react-dom
pnpm add -D @pactor-app/vite-plugin
```

```ts
// vite.config.ts
import react from '@vitejs/plugin-react';
import pactor from '@pactor-app/vite-plugin';
export default defineConfig({ plugins: [react(), pactor()] });
```

```tsx
// main.tsx — 详见 examples/vite-starter
import { createPactorApplication } from '@pactor-app/app';
import { StaticDslLoader } from '@pactor-app/resource';
import '@pactor-app/ui/styles.css';
import homePage from './pages/home.page.yaml';

createPactorApplication({
  appId: 'my-app',
  loader: new StaticDslLoader({
    bootstrap: {
      app: { name: 'My App' },
      menus: [{ id: 'home', type: 'page', title: 'Home', path: '/', pageId: 'home' }],
      layout: { type: 'blank' },
    },
    pages: { home: homePage },
  }),
}).mount('#root');
```

页面最小骨架：

```yaml
dsl: '1.0'
page: { id: home, title: Home }
body:
  type: Page
  props: { title: Hello }
  children:
    - type: Button
      props: { text: 点我 }
      events:
        onClick:
          - action: message
            params: { text: 来自 DSL, messageType: success }
```

校验：`npx pactor validate 'src/**/*.page.yaml'`

### ③ 对接服务端

```tsx
createPactorApplication({
  appId: 'my-app',
  api: { baseURL: '/api/runtime' },
}).mount('#root');
```

后端需提供 `bootstrap`（应用、用户、权限、菜单、布局）与 `pages/{id}`（页面 DSL）。全栈参考 next-app 模板中的 `SitemapApp`。

安装聚合包亦可：`pnpm add pactor-app`（meta 包，转发 `@pactor-app/app`）。

---

## 核心能力

- **Server-Driven UI** — 页面 YAML/JSON 描述，Runtime 动态渲染
- **数据与联动** — `state`、`dataSources`（static / service / http）、`${表达式}`、事件 → 标准动作（`setState`、`reload`、`navigate` 等）
- **权限** — 页面 / 菜单 / 组件 / 动作四层守卫（前端控 UI，接口仍需后端鉴权）
- **主题** — CSS 变量换肤，暗色 `data-pactor-theme="dark"`
- **国际化** — DSL 内 `${t('key')}`
- **AI** — `@pactor-app/chat`：流式对话、`Chat` / `ChatShell` DSL 组件

---

## 在本仓库开发（贡献者）

```bash
git clone https://github.com/innospots/pactor.git && cd pactor
pnpm install && pnpm build    # 示例依赖各包 dist
pnpm test && pnpm typecheck
```

**跑示例**

```bash
pnpm --filter example-vite-starter dev   # :5499 最小 YAML 示例
pnpm --filter example-admin dev          # :5199 后台 + 换肤（admin / pactor123）
pnpm --filter example-chat dev           # :5399 AI 对话
pnpm --filter theme-studio dev           # :5710 主题工作室
```

改 `packages/*` 源码后请先 `pnpm build`，示例才会用到新构建产物。

### 仓库结构（简图）

```text
packages/     @pactor-app/* 运行时与工具（core → runtime → app / ui / chat …）
skills/       @pactor-app/skills — Agent 技能（DSL / 脚手架 / PRD 生成）
starters/     pnpm create pactor-app 的模板源码
examples/     仓库内联调示例
tools/        内部工具（如 theme-studio）
```

主要 npm 包：`@pactor-app/app`（入口 `createPactorApplication`）、`@pactor-app/ui`（内置组件 + `styles.css`）、`pactor-app`（meta 全量依赖）、`create-pactor-app`（脚手架）、`@pactor-app/cli`（`pactor validate`）。

依赖方向：`core ← schema ← expression ← runtime ← {permission, resource, router, ui, …} ← app`。  
目录名与包名分离。完整模块表见下文展开。

<details>
<summary>展开：packages 模块一览</summary>

| 目录 | npm 包 | 说明 |
| --- | --- | --- |
| `core` | `@pactor-app/core` | DSL 协议、Registry 接口 |
| `schema` | `@pactor-app/schema` | JSON Schema 校验 |
| `expression` | `@pactor-app/expression` | 安全表达式引擎 |
| `i18n` | `@pactor-app/i18n` | 语言识别与语言包 Provider（服务端） |
| `runtime` | `@pactor-app/runtime` | 页面 Runtime、React 渲染 |
| `permission` | `@pactor-app/permission` | 权限 Store |
| `resource` | `@pactor-app/resource` | DSL 加载与缓存 |
| `router` | `@pactor-app/router` | 菜单与路由 |
| `ui` | `@pactor-app/ui` | 默认 UI 组件库 |
| `markdown` | `@pactor-app/markdown` | Markdown + DSL 片段 |
| `chat` | `@pactor-app/chat` | AI 对话能力 |
| `vite-plugin` | `@pactor-app/vite-plugin` | YAML 导入与 HMR |
| `cli` | `@pactor-app/cli` | CLI |
| `app` | `@pactor-app/app` | 应用装配 |
| `pactor` | `pactor-app` | Meta 包 |
| `create-app` | `create-pactor-app` | 脚手架 |

</details>

Agent 技能在仓库根目录 [`skills/`](skills/)（npm 包名仍为 `@pactor-app/skills`），不在 `packages/` 下。

---

## License

MIT
