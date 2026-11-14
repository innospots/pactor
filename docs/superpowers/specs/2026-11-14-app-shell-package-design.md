# App Shell 容器组件包（`@pactor-app/shell`）设计

日期：2026-11-14
状态：已确认方向（Next.js 专用单包；皮肤机制参考 next-app-starter；假设见文末）

## 背景与问题

`starters/apps-shell-starter/web-shell` 目前是一个完整 Next.js 应用，职责分三层：

1. **外壳 UI**：`src/shell/layouts/shell.layout.yaml`（左侧固定一级菜单 + 右侧 PageOutlet）、`src/modules/styles/theme.css`（light/dark 两套 CSS 变量令牌，但切换入口未实现，README 已列为缺失项）。
2. **运行时**：`src/runtime/PactorHost.tsx` → Pactor `SitemapApp`；`app/api/runtime/*`（bootstrap / pages / fragments）与 `app/api/modules/*`（模块 server API 分发）。
3. **构建期装配**：`scripts/assemble-modules.mjs` / `validate-modules.mjs` + `src/modules/module-list.json`，子应用以 tgz npm 包接入。

目标：把 web-shell 产品化为**可复用的容器组件**，内置常用功能（一级菜单、皮肤设置）与常用属性（布局样式），**子应用以参数（props）传入**。已确认约束：**只在 Next.js（App Router）框架内使用**，不做框架无关抽象。

## 方案取舍

### 方案 A：单一 Next 专用包（组件 + 服务端 + 装配 CLI）（选定）

一个包 `@pactor-app/shell`，分 `client` / `server` / `bin` 三个出口：React 外壳组件、Next 路由 handler 工厂、装配/校验 CLI。

- **优点**：单一依赖即可接入；React/Next/pactor-app 走 peerDependencies 单例，与现有 Pactor 模块契约一致；组件层与服务端共享类型。
- **缺点**：包内要同时维护 client/server 双入口的打包边界（用 package.json `exports` 条件区分，与 `risk-analysis` 模块的 `./client` `./server` 分包先例同构）。

### 方案 B：框架无关纯 React 组件库 + 独立 Next 适配包

外壳组件不含任何 Next API，适配层另立一包。

- **优点**：复用面最大。
- **缺点**：已被明确排除（web-shell 只在 Next 内使用）；两包拆分带来版本对齐成本，无收益。否决。

### 方案 C：保持 starter 模板 + 配置外置

只把 sitemap / module-list / 主题做成配置文件，不抽包。

- **缺点**：不满足"容器组件复用"目标，升级靠拷贝代码。否决。

**结论：采用方案 A。**

## 设计

### 1. 包结构（`packages/shell/`，包名 `@pactor-app/shell`）

```text
packages/shell/
├── package.json                 # peerDeps: next / react / react-dom / pactor-app / @pactor-app/theme
├── src/
│   ├── client/                  # "use client" 组件层
│   │   ├── AppShell.tsx         # 外壳组件：一级菜单 + 皮肤 + 布局 + 插槽 + 子应用出口
│   │   ├── SkinSwitcher.tsx     # 内建皮肤切换器（侧栏底部入口 + 画廊面板）
│   │   ├── PactorShellHost.tsx  # 现 PactorHost 成品化：SitemapApp + 模块扩展注册
│   │   └── index.ts             # ./client 出口
│   ├── server/                  # 服务端层
│   │   ├── handlers.ts          # createRuntimeHandlers(config) → bootstrap/pages/fragments
│   │   ├── module-dispatch.ts   # /api/modules/<id>/* 分发器（平移现有实现）
│   │   ├── session.ts           # 会话扩展点（平移占位实现）
│   │   └── index.ts             # ./server 出口
│   ├── skin/                    # 皮肤机制（@pactor-app/theme 之上的壳）
│   │   ├── SkinHeadScript.tsx   # 首屏防闪烁内联脚本组件（宿主放根 layout <head>）
│   │   └── sync-themes.ts       # theme sync/check 库函数（bin 调用）
│   ├── next.ts                  # withShell(nextConfig)：transpilePackages 等胶水
│   └── bin/                     # CLI：assemble / validate / theme sync|check
└── styles.css                   # 外壳基础样式（菜单/布局骨架），宿主一行 import
```

`exports` 与 `bin`：

```json
{
  "exports": {
    ".": "./dist/client/index.js",
    "./client": "./dist/client/index.js",
    "./server": "./dist/server/index.js",
    "./next": "./dist/next.js",
    "./styles.css": "./styles.css"
  },
  "bin": { "pactor-shell": "./dist/bin/cli.js" }
}
```

打包沿用 monorepo 现有惯例（tsup，React/Next/pactor-app 全部 external）。

### 2. AppShell 组件（常用功能与属性全部经 props）

```ts
interface AppShellProps {
  /** 品牌区 */
  brand?: { title: string; logo?: ReactNode };

  /** 一级菜单（二选一） */
  menu?:
    | { mode: "items"; items: ShellMenuItem[]; activeKey?: string; onSelect?: (item: ShellMenuItem) => void }
    | { mode: "sitemap" };   // 菜单来自 Pactor sitemap 合并结果（现状行为）

  /** 皮肤设置（详见第 3 节） */
  skin?: {
    presets?: ThemeName[];            // 缺省 @pactor-app/theme 全部预置皮肤
    default?: ThemeName;              // 缺省主题包 DEFAULT_THEME
    storageKey?: string;              // 缺省 'pactor.theme'
    modeStorageKey?: string;          // light/dark 模式键，缺省 'pactor.mode'
    renderSwitcher?: boolean;         // 缺省 true：侧栏底部皮肤入口
    onChange?: (skin: string) => void;
  };

  /** 布局样式 */
  layout?: {
    variant?: "side-fixed" | "side" | "top";  // 缺省 side-fixed（现状：固定一级菜单）
    sidebarWidth?: number;                    // 缺省读 --sidebar-width 令牌
    contentClassName?: string;
    contentStyle?: CSSProperties;
  };

  /** 子应用接入（参数传入，二选一，可混用） */
  pages?: Record<string, ComponentType<SubAppProps>>;       // path → 纯 React 子应用
  renderSubApp?: (ctx: { pathname: string }) => ReactNode;  // 自定义渲染，如 <PactorShellHost />

  /** 插槽 */
  headerExtra?: ReactNode;      // 用户信息、租户切换等
  sidebarFooter?: ReactNode;
  footer?: ReactNode;

  /** 路由对接：缺省自动使用 next/navigation（usePathname / useRouter），一般不用传 */
  pathname?: string;
  navigate?: (to: string) => void;
}

interface ShellMenuItem {
  id: string;
  title: string;
  icon?: string;          // 与 Pactor 菜单图标同名集合
  path: string;
  order?: number;
  hidden?: boolean;
}
```

关键行为：

- `menu.mode: "sitemap"` 时，AppShell 内部渲染 Pactor `SitemapApp` 的布局链（现状链路不变）；`"items"` 时菜单直接由 props 驱动，不依赖 sitemap，子应用出口渲染 `pages[pathname]` 或 `renderSubApp(ctx)`。
- `pathname` / `navigate` 缺省从 `next/navigation` 获取；显式传入则受控（测试、特殊宿主）。
- 路由未命中 `pages` 且未传 `renderSubApp` 时渲染内建 NotFound 视图。

### 3. 皮肤机制（参考 `starters/next-app-starter` + `@pactor-app/theme`）

不重造皮肤引擎，直接以 monorepo 已有的 `@pactor-app/theme` 为内核，壳层提供 Next 化的三个件：

**(a) 首屏防闪烁：`SkinHeadScript`**（对应 next-app-starter `app/layout.tsx` 的内联脚本）

```tsx
// 宿主根 layout
import { SkinHeadScript } from "@pactor-app/shell/client";

<html lang="zh-CN" suppressHydrationWarning>
  <head><SkinHeadScript storageKey="pactor.theme" defaultSkin="qing-hui" /></head>
```

脚本行为与 next-app-starter 完全一致：读 localStorage → 校验合法皮肤名 → 写 `data-requested-skin` / `data-pactor-skin` 属性 → 同步插入 `<link href="/themes/<skin>.css" data-pactor-skin>`；同时按 mode 存储键 + `prefers-color-scheme` 写/删 `data-pactor-theme="dark"`。

**(b) 皮肤 CSS 同步：`pactor-shell theme sync` / `theme check`**（平移 next-app-starter `scripts/sync-theme-css.mjs`）

首屏 `<link>` 需要 public URL，node_modules 里的 CSS 不能直接引用，因此把 `@pactor-app/theme/skins/*.css` 复制到宿主 `public/themes/`；`theme check` 供 CI 校验副本未漂移。宿主 build 链加入 `pactor-shell theme check`。

**(c) 运行时切换：`SkinSwitcher`**（平移 next-app-starter `ThemeGallery` 模式）

- 用 `useSyncExternalStore` 订阅 `@pactor-app/theme` 的 `subscribeTheme`（`pactor:theme-change` 事件 + 跨标签页 `storage` 同步）；
- 切换调 `applyTheme(name, { storageKey })`：懒加载皮肤 CSS chunk → 注入 `<style data-pactor-theme-style>` → 移除首屏 `<link>`（避免双份 CSS）→ 写 localStorage；
- 提供两种形态：侧栏底部紧凑入口（下拉/弹层画廊）与独立设置面板组件，前者由 `skin.renderSwitcher` 开关，后者导出供宿主放到任意页面。

**light/dark 模式**：与皮肤解耦，沿用 `data-pactor-theme="dark"` 契约（web-shell 现有 `theme.css` 的暗色块即挂在此属性下）。切换器同时提供 mode 三态（light / dark / system），缺省跟随系统。现有 `src/modules/styles/theme.css` 令牌平移进包内作为一个预置皮肤（或在首版直接保留为宿主样式，包只管切换机制——见假设 4）。

### 4. 子应用接入：Pactor DSL 模块（现状链路不变）

`PactorShellHost` 是现有 `PactorHost.tsx` 的成品化，差异仅在**模块扩展注册表改为 props 传入**（包不能 import 宿主的 `@generated/*` 别名）：

```tsx
// 宿主 app/(workspace)/layout.tsx
import { AppShell, PactorShellHost } from "@pactor-app/shell/client";
import { moduleExtensions } from "@generated/pactor/client-registry"; // 装配产物留在宿主
import "@pactor-app/shell/styles.css";

export default function WorkspaceLayout() {
  return (
    <AppShell
      brand={{ title: "InnoSpots" }}
      menu={{ mode: "sitemap" }}
      skin={{ renderSwitcher: true }}
      layout={{ variant: "side-fixed" }}
      renderSubApp={() => (
        <PactorShellHost
          extensions={moduleExtensions}
          sitemapSource="/api/runtime/bootstrap"       // 均有缺省值，与现有一致
          pageEndpoint={(id) => `/api/runtime/pages/${encodeURIComponent(id)}`}
        />
      )}
    />
  );
}
```

- Pactor DSL 模块的 tgz + `module-list.json` + Manifest V1 契约**完全不动**；
- `createHttpHooks()` 的 `{ code, data, message }` 拆包适配内建于 `PactorShellHost`，可用 `httpAdapter` prop 覆盖；
- React / Next / pactor-app 由宿主 peerDependencies 提供单例，与现有模块契约一致。

### 5. 服务端与装配（CLI + handler 工厂）

```ts
// app/api/runtime/bootstrap/route.ts —— 一行接入
export { runtimeBootstrapHandler as GET } from "@pactor-app/shell/server";

// 或需要配置时：
import { createRuntimeHandlers } from "@pactor-app/shell/server";
export const { bootstrap: GET } = createRuntimeHandlers({
  generatedDir: ".generated/pactor",   // 缺省值即现状
  // session: mySessionProvider,       // 会话扩展点，平移现有 session.ts 契约
});
```

- `createRuntimeHandlers` 返回 `bootstrap / page / fragment` 三个 handler；`createModuleDispatch()` 返回 `/api/modules/<id>/*` 分发 handler（平移 `src/server/modules/dispatch.ts`，契约不变：404 / 405 + Allow / HEAD 回退 GET / OPTIONS / 异常 500，不做隐式鉴权）。
- Runtime API 路径（`/api/runtime/*`、`/api/modules/*`）**不变**，模块侧 `target: innospots-web-shell@3` 的 DSL URL 改写不受影响。
- `assemble-modules.mjs` / `validate-modules.mjs` 平移为 `pactor-shell assemble` / `pactor-shell validate`，输入（`src/modules/module-list.json`、`src/shell/`、`.generated/pactor` 输出目录）以 CLI 参数 + 缺省值对应现状。
- `withShell(nextConfig)`：仅合并 `transpilePackages` 等必要项，宿主 config 其余字段原样透传。

### 6. web-shell 迁移路径

1. 新建 `packages/shell`，抽出外壳 UI（菜单/布局骨架）、皮肤机制、`PactorShellHost`；web-shell 以 `link:../../../packages/shell` 回接，行为不变。
2. `src/server/**` 平移进包；`app/api/runtime/*`、`app/api/modules/*` 的 route 体改为一行导出。
3. `scripts/*.mjs` 平移为包内 bin；web-shell 的 `build` 链改为 `pactor-shell assemble && pactor-shell validate && pactor-shell theme check && next build`。
4. web-shell 瘦身成最薄宿主（根 layout + workspace layout + 一行 API 接入 + `module-list.json` / `src/shell/` 业务配置），留在 `starters/apps-shell-starter` 作为接入样例。
5. 每步后用两个既有 tgz 模块（risk-analysis / risk-decision）回归：菜单合并、直达 URL 刷新、懒加载页、模块 API 分发、皮肤切换。

## 错误处理与边界

- **localStorage 不可用**（隐私模式）：皮肤/mode 仅会话内生效，忽略异常（与 `@pactor-app/theme` 现有一致）。
- **SSR / 无 document**：皮肤读写守卫 `typeof document`（沿用 theme 包做法）；`SkinHeadScript` 输出纯字符串脚本，无 hydration 依赖。
- **皮肤 CSS chunk 加载失败**：保留首屏 `<link>`，下次切换重试（平移 next-app-starter `applySkinStylesheet` 的 catch 语义）。
- **非法皮肤名**：`resolveTheme` 回退默认皮肤（theme 包既有行为）。
- **装配失败即阻断**：DSL 缺失、URL 碰撞、`globalPageId` 重复、manifest 不合法时 CLI 非零退出（现状语义不变）。
- **pages/renderSubApp 均未传**：AppShell 渲染内建 NotFound，不抛错。

## 测试与验收

- **单元测试**（vitest，跟随 monorepo 现有结构）：AppShell 菜单两种模式、皮肤切换（applyTheme 调用 / storageKey / onChange）、`createRuntimeHandlers` 对 `.generated` 索引的读取、分发器 404/405/HEAD/OPTIONS 契约。
- **CLI 测试**：assemble / validate / theme sync|check 对 fixture 模块的装配产物与失败退出码（复用 web-shell 现有两个 tgz 作为 fixture）。
- **回归验收**：web-shell 迁移后 `pnpm build && pnpm start`，核对 `/pactor-app-risk-analysis`、`/pactor-app-risk-decision`、`/pactor-app-risk-decision/integration-logs` 行为不变；皮肤切换器出现且切换持久化；`pnpm lint` 通过。

## 假设（未逐条确认，评审时可推翻）

1. 包名 `@pactor-app/shell`，放 `packages/shell/`，与 monorepo 现有包同级。
2. 子应用同时支持 Pactor DSL 模块（现状）与纯 React 组件（`pages` prop）两种形态。
3. 菜单一期只做一级菜单（`items` 无 `children` 层级），与现状固定一级菜单一致；多级菜单留给 Pactor sitemap 模式自身能力。
4. 皮肤首版只做"预置皮肤切换 + light/dark mode + 持久化"，不含在线编辑（Theme Studio 已有独立工具）；web-shell 现有晨雾奶芙令牌首版保留在宿主样式，不强制收编进 theme 包。
5. 登录/鉴权仍走 `session` 扩展点（平移占位实现），不内建真实会话。
6. `layout.variant` 首版实现 `side-fixed`（现状）与 `side`（可收起），`top` 仅预留类型，未实现时显式报错。
