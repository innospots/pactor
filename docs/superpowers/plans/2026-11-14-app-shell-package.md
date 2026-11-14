# App Shell 容器组件包（`@pactor-app/shell`）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `starters/apps-shell-starter/web-shell` 产品化为 Next.js 专用容器组件包 `@pactor-app/shell`（一级菜单 / 皮肤设置 / 布局外壳 + Runtime DSL API handler 工厂 + 装配 CLI），子应用经 props 传入，web-shell 瘦身为最薄宿主示范。

**Architecture:** 单包三出口：`./client`（AppShell / PactorShellHost / SkinSwitcher / SkinHeadScript，带 `"use client"` banner）、`./server`（装配索引读取、运行时 DSL 服务、模块 API 分发器）+ `./server/routes`（Next handler 工厂）、`./next`（withShell）、bin `pactor-shell`（assemble / validate / theme sync|check）。皮肤引擎复用 `@pactor-app/theme`，首屏防闪烁与切换语义照搬 `starters/next-app-starter`。

**Tech Stack:** TypeScript + tsup（ESM/CJS 双出）、React 19、Next 16 App Router、vitest 3 + @testing-library/react + jsdom、yaml。

**Spec:** `docs/superpowers/specs/2026-11-14-app-shell-package-design.md`

## Global Constraints

- 新包目录 `packages/shell`，包名 `@pactor-app/shell`，版本 `1.69.0`（与 monorepo 其他包对齐），`publishConfig.access: "public"`，license MIT。
- 只在 Next.js App Router 使用；遵循 Next 16 契约（route `params` 为 `Promise`）。web-shell 的 `AGENTS.md` 提示：写 web-shell 内代码前先读 `node_modules/next/dist/docs/` 相关指南。
- React / ReactDOM / Next / `pactor-app` 由宿主经 peerDependencies 提供单例；包内一律 `import ... from "pactor-app"` / `"next/navigation"`，不安装副本到 dependencies。
- Runtime API 路径不变：`/api/runtime/bootstrap`、`/api/runtime/pages/{globalPageId}`、`/api/runtime/fragments/{fragmentId}`、`/api/modules/{moduleId}/*`。
- Pactor DSL 模块契约（tgz + `module-list.json` + Manifest V1 + `target: innospots-web-shell@3`）不变。
- 皮肤内核一律走 `@pactor-app/theme`（`applyTheme` / `subscribeTheme` / `data-pactor-skin` / `data-pactor-theme="dark"`），不自造切换引擎。
- 测试：vitest，测试文件放 `packages/shell/tests/`，从源码用 `.js` 后缀相对路径导入（如 `../src/server/registry.js`）；DOM/组件测试文件首行写 `// @vitest-environment jsdom`。
- 代码风格对齐 monorepo：ESM、`type: "module"`、TS strict（含 `noUnusedLocals` / `noUnusedParameters`）、注释用中文且只写非显然信息。
- 每个 Task 结束单独 commit（`git add` 只加本任务文件）。

---

### Task 1: 包脚手架 + withShell

**Files:**
- Create: `packages/shell/package.json`
- Create: `packages/shell/tsconfig.json`
- Create: `packages/shell/tsup.config.ts`
- Create: `packages/shell/src/next.ts`
- Create: `packages/shell/src/client/index.ts`（占位，后续任务追加导出）
- Create: `packages/shell/src/server/index.ts`（占位）
- Create: `packages/shell/src/bin/cli.ts`（占位，Task 14 重写）
- Test: `packages/shell/tests/next.test.ts`

**Interfaces:**
- Produces: `withShell(config: NextConfig, options?: WithShellOptions): NextConfig`；`WithShellOptions = { transpilePackages?: string[] }`。Task 15 的 web-shell `next.config.ts` 消费它。
- Produces: 包出口 `./client` / `./server` / `./server/routes` / `./next` / `./styles.css` 与 bin `pactor-shell`，后续所有任务在此骨架上追加。

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/next.test.ts`：

```ts
import { describe, expect, it } from 'vitest';

import { withShell } from '../src/next.js';

describe('withShell', () => {
  it('合并并去重 transpilePackages', () => {
    const config = withShell(
      { transpilePackages: ['risk-analysis'] },
      { transpilePackages: ['risk-analysis', 'risk-decision'] },
    );
    expect(config.transpilePackages).toEqual(['risk-analysis', 'risk-decision']);
  });

  it('无既有配置时产出空数组', () => {
    expect(withShell({}).transpilePackages).toEqual([]);
  });

  it('其余字段原样透传', () => {
    expect(withShell({ reactStrictMode: true }).reactStrictMode).toBe(true);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/next.test.ts`
Expected: FAIL（`../src/next.js` 不存在；若包尚未 install 则先报错找不到 vitest，属预期，Step 3 建包后再验）

- [ ] **Step 3: 写包骨架与实现**

`packages/shell/package.json`：

```json
{
  "name": "@pactor-app/shell",
  "version": "1.69.0",
  "description": "Pactor App Shell：Next.js (App Router) 专用容器组件包 —— 一级菜单 / 皮肤设置 / 布局外壳、Runtime DSL API handler 工厂与构建期模块装配 CLI",
  "keywords": ["pactor", "app-shell", "nextjs", "skin", "theme"],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/innospots/pactor.git",
    "directory": "packages/shell"
  },
  "homepage": "https://github.com/innospots/pactor/tree/main/packages/shell",
  "bugs": "https://github.com/innospots/pactor/issues",
  "type": "module",
  "exports": {
    ".": {
      "import": { "types": "./dist/client/index.d.ts", "default": "./dist/client/index.js" },
      "require": { "types": "./dist/client/index.d.cts", "default": "./dist/client/index.cjs" }
    },
    "./client": {
      "import": { "types": "./dist/client/index.d.ts", "default": "./dist/client/index.js" },
      "require": { "types": "./dist/client/index.d.cts", "default": "./dist/client/index.cjs" }
    },
    "./server": {
      "import": { "types": "./dist/server/index.d.ts", "default": "./dist/server/index.js" },
      "require": { "types": "./dist/server/index.d.cts", "default": "./dist/server/index.cjs" }
    },
    "./server/routes": {
      "import": { "types": "./dist/server/routes.d.ts", "default": "./dist/server/routes.js" },
      "require": { "types": "./dist/server/routes.d.cts", "default": "./dist/server/routes.cjs" }
    },
    "./next": {
      "import": { "types": "./dist/next.d.ts", "default": "./dist/next.js" },
      "require": { "types": "./dist/next.d.cts", "default": "./dist/next.cjs" }
    },
    "./styles.css": "./styles.css"
  },
  "bin": { "pactor-shell": "./dist/bin/cli.js" },
  "sideEffects": ["./styles.css"],
  "engines": { "node": ">=20" },
  "files": ["dist", "styles.css"],
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "publishConfig": { "access": "public" },
  "dependencies": {
    "@pactor-app/core": "workspace:*",
    "@pactor-app/runtime": "workspace:*",
    "@pactor-app/theme": "workspace:*",
    "yaml": "^2.9.1"
  },
  "peerDependencies": {
    "next": ">=15",
    "pactor-app": ">=1.55.0",
    "react": ">=18",
    "react-dom": ">=18"
  },
  "devDependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^20.19.43",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "jsdom": "^30.0.1",
    "next": "16.3.5",
    "pactor-app": "workspace:*",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "vitest": "^3.2.4"
  }
}
```

`packages/shell/tsconfig.json`：

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "noEmit": true
  },
  "include": ["src", "tests", "tsup.config.ts"]
}
```

`packages/shell/tsup.config.ts`（两段构建串行：client 段带 `"use client"` banner 且负责 clean；node 段不再 clean，避免清掉 client 产物）：

```ts
import { defineConfig } from 'tsup';

const shared = {
  format: ['esm', 'cjs'] as ('esm' | 'cjs')[],
  target: 'es2020' as const,
  dts: true,
};

export default defineConfig([
  {
    ...shared,
    clean: true,
    entry: { 'client/index': 'src/client/index.ts' },
    banner: { js: '"use client";' },
  },
  {
    ...shared,
    clean: false,
    entry: {
      'server/index': 'src/server/index.ts',
      'server/routes': 'src/server/routes.ts',
      next: 'src/next.ts',
      'bin/cli': 'src/bin/cli.ts',
    },
  },
]);
```

`packages/shell/src/next.ts`：

```ts
import type { NextConfig } from 'next';

export interface WithShellOptions {
  /** 需要参与编译的 UI 模块包名（如 risk-analysis），去重合并进 transpilePackages */
  transpilePackages?: string[];
}

/** 合并 shell 约定的 next.config 项；其余字段原样透传。 */
export function withShell(
  config: NextConfig,
  options: WithShellOptions = {},
): NextConfig {
  const transpilePackages = [
    ...new Set([
      ...(config.transpilePackages ?? []),
      ...(options.transpilePackages ?? []),
    ]),
  ];
  return { ...config, transpilePackages };
}
```

占位文件（后续任务会扩充/重写，先保证 tsup 入口存在）：

`packages/shell/src/client/index.ts`：`export {};`
`packages/shell/src/server/index.ts`：`export {};`
`packages/shell/src/server/routes.ts`：`export {};`
`packages/shell/src/bin/cli.ts`：

```ts
#!/usr/bin/env node
// pactor-shell CLI 入口；子命令在 Task 14 注册。
console.error('[pactor-shell] 未知命令，可用：assemble | validate | theme sync | theme check');
process.exit(1);
```

- [ ] **Step 4: 安装依赖并跑测试确认通过**

Run: `pnpm install && pnpm --filter @pactor-app/shell test`
Expected: 3 个测试 PASS

- [ ] **Step 5: 验证构建与指令**

Run: `pnpm --filter @pactor-app/shell build && head -2 dist/client/index.js && head -1 dist/bin/cli.js`
预期（在 `packages/shell` 目录下）：`dist/client/index.js` 首行含 `"use client";`；`dist/bin/cli.js` 首行是 `#!/usr/bin/env node`。

- [ ] **Step 6: typecheck + commit**

Run: `pnpm --filter @pactor-app/shell typecheck`
Expected: 无错误

```bash
git add packages/shell && git commit -m "feat(shell): scaffold @pactor-app/shell package with withShell"
```

---

### Task 2: 服务端契约类型 + 装配索引读取

**Files:**
- Create: `packages/shell/src/server/types.ts`
- Create: `packages/shell/src/server/registry.ts`
- Modify: `packages/shell/src/server/index.ts`
- Test: `packages/shell/tests/server-registry.test.ts`

**Interfaces:**
- Produces（后续任务全部依赖）：
  - 类型：`ModuleListEntry` / `ModuleListFile` / `ModuleManifestV1` / `AssemblyRoute` / `AssemblyModule` / `AssemblyFile` / `PageIndexEntry` / `PagesIndexFile` / `MenusIndexFile` / `FragmentsIndexFile` / `SitemapMetaFile` / `ModuleApiMethod` / `ModuleApiContext` / `ModuleApiHandler` / `ModuleApiHandlers` / `ModuleServerRegistryEntry` / `ModuleServerRegistry` / `ServersIndexFile`
  - `interface ShellGeneratedOptions { generatedDir?: string }`
  - `resolveGeneratedDir(options?: ShellGeneratedOptions): string`（缺省 `<process.cwd()>/.generated/pactor`）
  - `getAssembly / getPagesIndex / getMenusIndex / getSitemapMeta / getFragmentsIndex(options?: ShellGeneratedOptions)`
  - `getAssemblySummary(options?): { modules: AssemblyModule[]; routeCount: number }`

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/server-registry.test.ts`：

```ts
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  getAssembly,
  getAssemblySummary,
  getFragmentsIndex,
  getMenusIndex,
  getPagesIndex,
  getSitemapMeta,
} from '../src/server/registry.js';

function fixtureDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'shell-registry-'));
  writeFileSync(
    join(dir, 'assembly.json'),
    JSON.stringify({
      generatedAt: '2026-11-14T00:00:00.000Z',
      modules: [
        { id: 'm1', name: 'M1', package: 'm1', version: '0.1.0', basePath: '/m1' },
      ],
      routes: [
        {
          publicPath: '/m1',
          moduleId: 'm1',
          pageId: 'home',
          globalPageId: 'm1:home',
          pattern: '/m1',
          paramNames: [],
        },
      ],
    }),
  );
  writeFileSync(
    join(dir, 'pages.json'),
    JSON.stringify({
      pages: [
        {
          globalPageId: 'm1:home',
          moduleId: 'm1',
          pageId: 'home',
          path: '/m1',
          title: '首页',
          version: 1,
          public: true,
          dslRef: 'dsl/m1/home.yaml',
        },
      ],
    }),
  );
  writeFileSync(join(dir, 'menus.json'), JSON.stringify({ menus: [{ id: 'home', type: 'page', pageId: 'm1:home' }] }));
  writeFileSync(
    join(dir, 'sitemap-meta.json'),
    JSON.stringify({ layout: 'shell', dslVersion: '1.0', app: { name: 'Fixture' }, auth: { loginPath: '/login' }, layouts: {} }),
  );
  writeFileSync(join(dir, 'fragments.json'), JSON.stringify({ fragments: {} }));
  return dir;
}

describe('registry', () => {
  it('按 generatedDir 读取装配索引', () => {
    const generatedDir = fixtureDir();
    expect(getAssembly({ generatedDir }).modules[0]?.id).toBe('m1');
    expect(getPagesIndex({ generatedDir }).pages[0]?.globalPageId).toBe('m1:home');
    expect(getMenusIndex({ generatedDir }).menus).toHaveLength(1);
    expect(getSitemapMeta({ generatedDir }).layout).toBe('shell');
    expect(getFragmentsIndex({ generatedDir }).fragments).toEqual({});
  });

  it('getAssemblySummary 返回模块清单与路由数', () => {
    const generatedDir = fixtureDir();
    const summary = getAssemblySummary({ generatedDir });
    expect(summary.modules).toHaveLength(1);
    expect(summary.routeCount).toBe(1);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/server-registry.test.ts`
Expected: FAIL（`../src/server/registry.js` 不存在）

- [ ] **Step 3: 写 types.ts 与 registry.ts**

`packages/shell/src/server/types.ts`（平移合并 web-shell `src/modules/types.ts` 与 `src/server/modules/types.ts`，`ModuleListEntry` 补上 README 已约定但原类型缺失的 `menuMode` / `access`）：

```ts
/** module-list.json 条目（宿主业务配置，装配器输入）。 */
export type ModuleListEntry = {
  package: string;
  enabled: boolean;
  /** 可选；Shell 侧 URL 前缀，覆盖模块 manifest 中的默认 basePath */
  basePath?: string;
  /** 可选；merge（默认，原样并入导航）或 hidden（只注册隐藏路由并移除菜单级 layout） */
  menuMode?: 'merge' | 'hidden';
  /** 可选；设为 public 时，模块内未声明 public 的页面默认公开 */
  access?: 'public';
};

export type ModuleListFile = {
  modules: ModuleListEntry[];
};

export type ModuleManifestV1 = {
  schemaVersion: '1';
  id: string;
  name: string;
  version: string;
  pactorVersionRange: string;
  basePath: string;
  sitemap: string;
  dslRoot: string;
  assetsRoot: string;
  styles?: string[];
  clientEntry?: string;
  /** 模块服务端 bundle（相对 dist-module），存在时需同时声明 apiPrefixes */
  serverEntry?: string;
  /** 模块 API 逻辑前缀（原始 /api/...），打包期已把 DSL URL 改写为 /api/modules/<id>/... */
  apiPrefixes?: string[];
  dependencies?: string[];
};

export type AssemblyRoute = {
  publicPath: string;
  moduleId: string;
  pageId: string;
  globalPageId: string;
  pattern: string;
  paramNames: string[];
};

export type AssemblyModule = {
  id: string;
  name: string;
  package: string;
  version: string;
  basePath: string;
};

export type AssemblyFile = {
  generatedAt: string;
  modules: AssemblyModule[];
  routes: AssemblyRoute[];
};

export type PageIndexEntry = {
  globalPageId: string;
  moduleId: string;
  pageId: string;
  path: string;
  title: string;
  version: number;
  public?: boolean;
  permission?: string;
  lazy?: boolean;
  dslRef?: string;
};

export type PagesIndexFile = {
  pages: PageIndexEntry[];
};

export type MenusIndexFile = {
  menus: unknown[];
};

export type FragmentsIndexFile = {
  fragments: Record<string, unknown>;
};

export type SitemapMetaFile = {
  layout: string;
  dslVersion: string;
  app: { name: string };
  auth: { loginPath: string };
  layouts: Record<string, unknown>;
};

/* ---- 模块服务端 API 契约 ---- */

export type ModuleApiMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export interface ModuleApiContext {
  moduleId: string;
  /** 逻辑 URL：原始 /api/... 路径 + query（不是 /api/modules/... 挂载 URL） */
  url: URL;
  /** :param 段解析结果 */
  params: Record<string, string>;
}

export type ModuleApiHandler = (
  request: Request,
  context: ModuleApiContext,
) => Response | Promise<Response>;

export type ModuleApiHandlers = Record<
  string,
  Partial<Record<ModuleApiMethod, ModuleApiHandler>>
>;

export type ModuleServerRegistryEntry = {
  moduleId: string;
  package: string;
  prefixes: string[];
  handlers: ModuleApiHandlers;
};

export type ModuleServerRegistry = Record<string, ModuleServerRegistryEntry>;

/** .generated/pactor/servers.json 的结构（供构建期校验读取） */
export type ServersIndexFile = {
  modules: {
    moduleId: string;
    package: string;
    prefixes: string[];
  }[];
};
```

`packages/shell/src/server/registry.ts`：

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type {
  AssemblyFile,
  AssemblyModule,
  FragmentsIndexFile,
  MenusIndexFile,
  PagesIndexFile,
  SitemapMetaFile,
} from './types.js';

/** 装配产物目录定位；缺省 <process.cwd()>/.generated/pactor（在宿主工程根运行）。 */
export interface ShellGeneratedOptions {
  generatedDir?: string;
}

export function resolveGeneratedDir(options?: ShellGeneratedOptions): string {
  return options?.generatedDir ?? join(process.cwd(), '.generated/pactor');
}

function readGeneratedJson<T>(file: string, options?: ShellGeneratedOptions): T {
  return JSON.parse(
    readFileSync(join(resolveGeneratedDir(options), file), 'utf8'),
  ) as T;
}

export function getAssembly(options?: ShellGeneratedOptions): AssemblyFile {
  return readGeneratedJson<AssemblyFile>('assembly.json', options);
}

export function getPagesIndex(options?: ShellGeneratedOptions): PagesIndexFile {
  return readGeneratedJson<PagesIndexFile>('pages.json', options);
}

export function getMenusIndex(options?: ShellGeneratedOptions): MenusIndexFile {
  return readGeneratedJson<MenusIndexFile>('menus.json', options);
}

export function getSitemapMeta(
  options?: ShellGeneratedOptions,
): SitemapMetaFile {
  return readGeneratedJson<SitemapMetaFile>('sitemap-meta.json', options);
}

export function getFragmentsIndex(
  options?: ShellGeneratedOptions,
): FragmentsIndexFile {
  return readGeneratedJson<FragmentsIndexFile>('fragments.json', options);
}

export function getAssemblySummary(options?: ShellGeneratedOptions): {
  modules: AssemblyModule[];
  routeCount: number;
} {
  const assembly = getAssembly(options);
  return { modules: assembly.modules, routeCount: assembly.routes.length };
}
```

`packages/shell/src/server/index.ts` 改为：

```ts
export * from './types.js';
export * from './registry.js';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/server-registry.test.ts`
Expected: 2 个测试 PASS

- [ ] **Step 5: typecheck + commit**

Run: `cd packages/shell && pnpm typecheck`

```bash
git add packages/shell && git commit -m "feat(shell): add server contract types and generated-index registry"
```

---

### Task 3: 运行时 DSL 服务（bootstrap / pages / fragments / 路由解析 / 会话占位）

**Files:**
- Create: `packages/shell/src/server/session.ts`
- Create: `packages/shell/src/server/assembly-io.ts`
- Create: `packages/shell/src/server/visibility.ts`
- Create: `packages/shell/src/server/bootstrap.ts`
- Create: `packages/shell/src/server/pages.ts`
- Create: `packages/shell/src/server/fragments.ts`
- Create: `packages/shell/src/server/route-resolver.ts`
- Modify: `packages/shell/src/server/index.ts`
- Test: `packages/shell/tests/server-runtime.test.ts`

**Interfaces:**
- Consumes: Task 2 的 `ShellGeneratedOptions` / registry 读取函数 / 类型。
- Produces：
  - `ShellUser = { id: string; username: string; name?: string; permissions: string[] }`
  - `ShellCookieStore = { get(name: string): { value: string } | undefined }`
  - `defaultResolveSessionUser(store: ShellCookieStore): ShellUser | null`（恒匿名占位）
  - `readGeneratedDsl(relativePath: string, options?: ShellGeneratedOptions): PageDsl`
  - `canSeePage(entry: PageIndexEntry, user: ShellUser | null): boolean`
  - `filterVisibleMenus(menus: unknown[], user: ShellUser | null, pages: PageIndexEntry[]): unknown[]`
  - `buildRuntimeBootstrap(user: ShellUser | null, options?: ShellGeneratedOptions): SitemapResource`
  - `getRuntimePage(globalPageId: string, user: ShellUser | null, options?): RuntimePageResult`（`kind: 'ok' | 'not_found' | 'unauthorized' | 'forbidden'`）
  - `getRuntimeFragmentDsl(fragmentId: string, user: ShellUser | null, options?): unknown | null`
  - `resolvePublicPath(pathname: string, options?): ResolvedRoute | null`（`ResolvedRoute = { globalPageId; moduleId; pageId; params }`）

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/server-runtime.test.ts`：

```ts
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildRuntimeBootstrap } from '../src/server/bootstrap.js';
import { getRuntimeFragmentDsl } from '../src/server/fragments.js';
import { getRuntimePage } from '../src/server/pages.js';
import { resolvePublicPath } from '../src/server/route-resolver.js';
import type { ShellUser } from '../src/server/session.js';

const ADMIN: ShellUser = {
  id: 'u1',
  username: 'admin',
  permissions: ['risk:view'],
};

function fixtureDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'shell-runtime-'));
  mkdirSync(join(dir, 'dsl/m1'), { recursive: true });
  writeFileSync(
    join(dir, 'dsl/m1/home.yaml'),
    'dsl: "1.0"\npage: { id: home, title: 首页 }\nbody: { type: Text, props: { content: hello } }\n',
  );
  writeFileSync(
    join(dir, 'dsl/m1/log-detail.yaml'),
    'dsl: "1.0"\npage: { id: log-detail, title: 日志 }\nbody: { type: Text, props: { content: logs } }\n',
  );
  writeFileSync(
    join(dir, 'assembly.json'),
    JSON.stringify({
      generatedAt: 'x',
      modules: [],
      routes: [
        { publicPath: '/m1', moduleId: 'm1', pageId: 'home', globalPageId: 'm1:home', pattern: '/m1', paramNames: [] },
        { publicPath: '/m1/logs/:id', moduleId: 'm1', pageId: 'log-detail', globalPageId: 'm1:log-detail', pattern: '/m1/logs/:id', paramNames: ['id'] },
      ],
    }),
  );
  writeFileSync(
    join(dir, 'pages.json'),
    JSON.stringify({
      pages: [
        { globalPageId: 'm1:home', moduleId: 'm1', pageId: 'home', path: '/m1', title: '首页', version: 1, public: true, dslRef: 'dsl/m1/home.yaml' },
        { globalPageId: 'm1:log-detail', moduleId: 'm1', pageId: 'log-detail', path: '/m1/logs/:id', title: '日志', version: 1, permission: 'risk:view', lazy: true, dslRef: 'dsl/m1/log-detail.yaml' },
      ],
    }),
  );
  writeFileSync(
    join(dir, 'menus.json'),
    JSON.stringify({
      menus: [
        { id: 'home', type: 'page', pageId: 'm1:home', title: '首页', public: true },
        { id: 'logs', type: 'page', pageId: 'm1:log-detail', title: '日志' },
      ],
    }),
  );
  writeFileSync(
    join(dir, 'sitemap-meta.json'),
    JSON.stringify({ layout: 'shell', dslVersion: '1.0', app: { name: 'Fixture' }, auth: { loginPath: '/login' }, layouts: {} }),
  );
  writeFileSync(join(dir, 'fragments.json'), JSON.stringify({ fragments: {} }));
  return dir;
}

describe('buildRuntimeBootstrap', () => {
  it('匿名用户只见 public 页面与菜单；非 lazy 页内联 pageDsl', () => {
    const sitemap = buildRuntimeBootstrap(null, { generatedDir: fixtureDir() });
    expect(sitemap.resourceType).toBe('sitemap');
    expect(sitemap.pages).toHaveLength(1);
    expect(sitemap.pages?.[0]?.id).toBe('m1:home');
    expect(sitemap.pages?.[0]?.pageDsl).toMatchObject({ page: { id: 'home' } });
    expect(sitemap.menus).toHaveLength(1);
    expect(sitemap.user).toBeUndefined();
  });

  it('登录用户带权限时可见 permission 页面（lazy 页不内联 DSL）', () => {
    const sitemap = buildRuntimeBootstrap(ADMIN, { generatedDir: fixtureDir() });
    expect(sitemap.pages).toHaveLength(2);
    const lazy = sitemap.pages?.find((p) => p.id === 'm1:log-detail');
    expect(lazy?.pageDsl).toBeUndefined();
    expect(sitemap.user).toMatchObject({ id: 'u1', username: 'admin' });
    expect(sitemap.permissions).toEqual(['risk:view']);
  });
});

describe('getRuntimePage', () => {
  it('页面不存在 → not_found', () => {
    expect(getRuntimePage('m1:nope', null, { generatedDir: fixtureDir() }).kind).toBe('not_found');
  });

  it('匿名访问 permission 页 → unauthorized；登录无权限 → forbidden；有权限 → ok', () => {
    const generatedDir = fixtureDir();
    expect(getRuntimePage('m1:log-detail', null, { generatedDir }).kind).toBe('unauthorized');
    expect(
      getRuntimePage('m1:log-detail', { id: 'u2', username: 'u2', permissions: [] }, { generatedDir }).kind,
    ).toBe('forbidden');
    const ok = getRuntimePage('m1:log-detail', ADMIN, { generatedDir });
    expect(ok.kind).toBe('ok');
    if (ok.kind === 'ok') {
      expect(ok.resource.resourceType).toBe('page');
      expect(ok.resource.id).toBe('m1:log-detail');
    }
  });
});

describe('getRuntimeFragmentDsl', () => {
  it('未命中返回 null', () => {
    expect(getRuntimeFragmentDsl('f1', null, { generatedDir: fixtureDir() })).toBeNull();
  });
});

describe('resolvePublicPath', () => {
  it('精确匹配与 :param 模式匹配', () => {
    const generatedDir = fixtureDir();
    expect(resolvePublicPath('/m1', { generatedDir })?.globalPageId).toBe('m1:home');
    const resolved = resolvePublicPath('/m1/logs/42', { generatedDir });
    expect(resolved?.globalPageId).toBe('m1:log-detail');
    expect(resolved?.params).toEqual({ id: '42' });
    expect(resolvePublicPath('/nope', { generatedDir })).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/server-runtime.test.ts`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 写实现（平移 web-shell 对应文件，registry 静态 import 改为按 options 读取）**

`packages/shell/src/server/session.ts`：

```ts
/** 会话用户（bootstrap / 页面可见性判定使用）。 */
export type ShellUser = {
  id: string;
  username: string;
  name?: string;
  permissions: string[];
};

/** Next cookies() 的最小结构契约（避免深引用 next 内部类型）。 */
export interface ShellCookieStore {
  get(name: string): { value: string } | undefined;
}

/**
 * 缺省会话解析：恒匿名。接入统一登录后由宿主经
 * createRuntimeHandlers({ resolveUser }) 注入真实实现。
 */
export function defaultResolveSessionUser(
  _store: ShellCookieStore,
): ShellUser | null {
  return null;
}
```

`packages/shell/src/server/assembly-io.ts`：

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { PageDsl } from '@pactor-app/core';
import { parseDocument } from 'yaml';

import { resolveGeneratedDir, type ShellGeneratedOptions } from './registry.js';

export function readGeneratedDsl(
  relativePath: string,
  options?: ShellGeneratedOptions,
): PageDsl {
  const abs = join(resolveGeneratedDir(options), relativePath);
  const doc = parseDocument(readFileSync(abs, 'utf8'));
  if (doc.errors.length > 0) {
    throw new Error(
      `${relativePath} 解析失败：${doc.errors.map((e) => e.message.split('\n')[0]).join('；')}`,
    );
  }
  return doc.toJS() as PageDsl;
}
```

`packages/shell/src/server/visibility.ts`（与 web-shell 逐行一致，仅 import 路径变化）：

```ts
import type { ShellUser } from './session.js';
import type { PageIndexEntry } from './types.js';

export function canSeePage(entry: PageIndexEntry, user: ShellUser | null): boolean {
  if (entry.public) return true;
  if (!user) return false;
  if (entry.permission) {
    return user.permissions.includes(entry.permission);
  }
  return true;
}

/**
 * 菜单按页面可见性过滤（与 canSeePage 同语义）：
 * - 菜单自身 public → 可见；
 * - 菜单声明 permission → 需登录且具备权限；
 * - 菜单挂 pageId → 跟随目标页面的可见性；
 * - 分组 → 至少一个可见子项才保留（children 递归过滤）；
 * - 其余（外链等）→ 仅登录后可见。
 */
export function filterVisibleMenus(
  menus: unknown[],
  user: ShellUser | null,
  pages: PageIndexEntry[],
): unknown[] {
  const pagesById = new Map(pages.map((p) => [p.globalPageId, p]));

  const visit = (menu: unknown): unknown | null => {
    if (menu === null || typeof menu !== 'object' || Array.isArray(menu)) return menu;
    const item = menu as Record<string, unknown>;
    const children = Array.isArray(item.children)
      ? item.children.map(visit).filter((child) => child !== null)
      : undefined;

    let visible: boolean;
    if (item.public === true) {
      visible = true;
    } else if (typeof item.permission === 'string') {
      visible = user !== null && user.permissions.includes(item.permission);
    } else if (typeof item.pageId === 'string') {
      const page = pagesById.get(item.pageId);
      visible = page !== undefined && canSeePage(page, user);
    } else if (children !== undefined) {
      visible = children.length > 0;
    } else {
      visible = user !== null;
    }

    if (!visible) return null;
    return children !== undefined ? { ...item, children } : item;
  };

  return menus.map(visit).filter((menu) => menu !== null);
}
```

`packages/shell/src/server/bootstrap.ts`（平移；`id` 由 `innospots-web-shell` 改为 `pactor-app-shell`）：

```ts
import type { LayoutDsl, SitemapResource } from 'pactor-app';

import { readGeneratedDsl } from './assembly-io.js';
import {
  getMenusIndex,
  getPagesIndex,
  getSitemapMeta,
  type ShellGeneratedOptions,
} from './registry.js';
import type { ShellUser } from './session.js';
import { canSeePage, filterVisibleMenus } from './visibility.js';

export function buildRuntimeBootstrap(
  user: ShellUser | null,
  options?: ShellGeneratedOptions,
): SitemapResource {
  const meta = getSitemapMeta(options);
  const { pages } = getPagesIndex(options);
  const { menus } = getMenusIndex(options);

  const visiblePages = pages.filter((p) => canSeePage(p, user));

  const sitemapPages: SitemapResource['pages'] = visiblePages.map((p) => {
    const base = {
      id: p.globalPageId,
      path: p.path,
      title: p.title,
      version: p.version,
    };
    if (p.lazy) return base;
    if (!p.dslRef) return base;
    return { ...base, pageDsl: readGeneratedDsl(p.dslRef, options) };
  });

  const layouts = meta.layouts as Record<string, LayoutDsl>;
  const filteredMenus = filterVisibleMenus(
    menus,
    user,
    pages,
  ) as SitemapResource['menus'];

  return {
    id: 'pactor-app-shell',
    resourceType: 'sitemap',
    version: 1,
    dslVersion: meta.dslVersion,
    app: meta.app,
    layout: meta.layout,
    auth: meta.auth,
    layouts,
    updatedAt: new Date().toISOString(),
    ...(user
      ? {
          user: {
            id: user.id,
            username: user.username,
            name: user.name ?? user.username,
          },
          permissions: user.permissions,
        }
      : {}),
    pages: sitemapPages,
    menus: filteredMenus,
  };
}
```

`packages/shell/src/server/pages.ts`：

```ts
import { readGeneratedDsl } from './assembly-io.js';
import { getPagesIndex, type ShellGeneratedOptions } from './registry.js';
import type { ShellUser } from './session.js';
import { canSeePage } from './visibility.js';

export interface RuntimePageResource {
  id: string;
  resourceType: 'page';
  version: number;
  dslVersion: string;
  schema: unknown;
}

/**
 * 页面获取结果（区分语义，供路由层映射 HTTP 状态码）：
 * not_found 页面不存在 → 404；unauthorized 匿名访问非 public → 401；
 * forbidden 已登录但无权限 → 403。
 */
export type RuntimePageResult =
  | { kind: 'ok'; resource: RuntimePageResource }
  | { kind: 'not_found' }
  | { kind: 'unauthorized' }
  | { kind: 'forbidden' };

export function getRuntimePage(
  globalPageId: string,
  user: ShellUser | null,
  options?: ShellGeneratedOptions,
): RuntimePageResult {
  const entry = getPagesIndex(options).pages.find(
    (p) => p.globalPageId === globalPageId,
  );
  if (!entry || !entry.dslRef) return { kind: 'not_found' };
  if (!canSeePage(entry, user)) {
    return { kind: user ? 'forbidden' : 'unauthorized' };
  }
  const pageDsl = readGeneratedDsl(entry.dslRef, options);
  return {
    kind: 'ok',
    resource: {
      id: globalPageId,
      resourceType: 'page',
      version: entry.version,
      dslVersion: typeof pageDsl.dsl === 'string' ? pageDsl.dsl : '1.0',
      schema: pageDsl,
    },
  };
}
```

`packages/shell/src/server/fragments.ts`：

```ts
import { getFragmentsIndex, type ShellGeneratedOptions } from './registry.js';
import type { ShellUser } from './session.js';

export function getRuntimeFragmentDsl(
  fragmentId: string,
  _user: ShellUser | null,
  options?: ShellGeneratedOptions,
): unknown | null {
  return getFragmentsIndex(options).fragments[fragmentId] ?? null;
}
```

`packages/shell/src/server/route-resolver.ts`（平移 web-shell `src/modules/route-resolver.ts`，数据源改为按 options 读取）：

```ts
import { getAssembly, type ShellGeneratedOptions } from './registry.js';
import type { AssemblyRoute } from './types.js';

export type ResolvedRoute = {
  globalPageId: string;
  moduleId: string;
  pageId: string;
  params: Record<string, string>;
};

function normalizePath(path: string): string {
  if (!path.startsWith('/')) return `/${path}`;
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

function matchPattern(
  route: AssemblyRoute,
  publicPath: string,
): Record<string, string> | null {
  if (route.paramNames.length === 0) {
    return route.publicPath === publicPath ? {} : null;
  }
  const patternParts = route.pattern.split('/').filter(Boolean);
  const pathParts = publicPath.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const segment = patternParts[i]!;
    const value = pathParts[i]!;
    if (segment.startsWith(':')) {
      params[segment.slice(1)] = value;
      continue;
    }
    if (segment !== value) return null;
  }
  return params;
}

export function resolvePublicPath(
  pathname: string,
  options?: ShellGeneratedOptions,
): ResolvedRoute | null {
  const publicPath = normalizePath(pathname);
  const { routes } = getAssembly(options);

  const exact = routes.find(
    (r) => r.paramNames.length === 0 && r.publicPath === publicPath,
  );
  if (exact) {
    return {
      globalPageId: exact.globalPageId,
      moduleId: exact.moduleId,
      pageId: exact.pageId,
      params: {},
    };
  }

  for (const route of routes) {
    if (route.paramNames.length === 0) continue;
    const params = matchPattern(route, publicPath);
    if (params) {
      return {
        globalPageId: route.globalPageId,
        moduleId: route.moduleId,
        pageId: route.pageId,
        params,
      };
    }
  }
  return null;
}
```

`packages/shell/src/server/index.ts` 改为：

```ts
export * from './types.js';
export * from './session.js';
export * from './registry.js';
export * from './assembly-io.js';
export * from './visibility.js';
export * from './bootstrap.js';
export * from './pages.js';
export * from './fragments.js';
export * from './route-resolver.js';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/server-runtime.test.ts`
Expected: 6 个测试 PASS

- [ ] **Step 5: typecheck + commit**

Run: `cd packages/shell && pnpm typecheck`

```bash
git add packages/shell && git commit -m "feat(shell): port runtime DSL services (bootstrap/pages/fragments/route-resolver)"
```

---

### Task 4: 模块 API 分发器

**Files:**
- Create: `packages/shell/src/server/module-dispatch.ts`
- Modify: `packages/shell/src/server/index.ts`（追加一行导出）
- Test: `packages/shell/tests/module-dispatch.test.ts`

**Interfaces:**
- Consumes: Task 2 的 `ModuleApiHandler` / `ModuleApiHandlers` / `ModuleApiMethod` / `ModuleApiContext` / `ModuleServerRegistry`。
- Produces:
  - `ModuleApiRouteContext = { params: Promise<{ moduleId: string; path?: string[] }> }`
  - `ModuleApiDispatch = (request: Request, context: ModuleApiRouteContext) => Promise<Response>`
  - `createModuleDispatcher(servers: ModuleServerRegistry): ModuleApiDispatch`（分发契约不变：未命中 404；方法不支持 405 + `Allow`；`HEAD` 回退 GET；`OPTIONS` 返回 204 + `Allow`；handler 异常 500；逻辑路径必须落在 `prefixes` 内）

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/module-dispatch.test.ts`：

```ts
import { describe, expect, it } from 'vitest';

import {
  createModuleDispatcher,
  type ModuleApiRouteContext,
} from '../src/server/module-dispatch.js';

const dispatcher = createModuleDispatcher({
  'mod-a': {
    moduleId: 'mod-a',
    package: 'mod-a',
    prefixes: ['/api/mod-a'],
    handlers: {
      '/api/mod-a/items': {
        GET: (_request, ctx) =>
          Response.json({ ok: true, q: ctx.url.searchParams.get('q') }),
      },
      '/api/mod-a/items/:id': {
        GET: (_request, ctx) => Response.json({ id: ctx.params.id }),
      },
      '/api/mod-a/submit': { POST: () => new Response(null, { status: 201 }) },
      '/api/mod-a/boom': {
        GET: () => {
          throw new Error('explode');
        },
      },
    },
  },
});

function ctx(moduleId: string): ModuleApiRouteContext {
  return { params: Promise.resolve({ moduleId }) };
}

function req(path: string, method = 'GET'): Request {
  return new Request(`http://localhost:9020${path}`, { method });
}

describe('createModuleDispatcher', () => {
  it('命中 handler 并透传 query', async () => {
    const res = await dispatcher(req('/api/modules/mod-a/mod-a/items?q=x'), ctx('mod-a'));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true, q: 'x' });
  });

  it(':param 模式匹配并解码参数', async () => {
    const res = await dispatcher(req('/api/modules/mod-a/mod-a/items/42'), ctx('mod-a'));
    await expect(res.json()).resolves.toEqual({ id: '42' });
  });

  it('未知模块 / 前缀外路径 / 未注册路径 → 404', async () => {
    expect((await dispatcher(req('/api/modules/nope/items'), ctx('nope'))).status).toBe(404);
    expect((await dispatcher(req('/api/modules/mod-a/other'), ctx('mod-a'))).status).toBe(404);
    expect((await dispatcher(req('/api/modules/mod-a'), ctx('mod-a'))).status).toBe(404);
  });

  it('route params 与 URL 还原的 moduleId 不一致 → 404', async () => {
    expect((await dispatcher(req('/api/modules/mod-a/items'), ctx('mod-b'))).status).toBe(404);
  });

  it('路径命中但方法不支持 → 405 + Allow', async () => {
    const res = await dispatcher(req('/api/modules/mod-a/mod-a/items', 'POST'), ctx('mod-a'));
    expect(res.status).toBe(405);
    expect(res.headers.get('allow')).toBe('GET, HEAD, OPTIONS');
  });

  it('HEAD 无 handler 时回退 GET；OPTIONS 返回 204 + Allow', async () => {
    const head = await dispatcher(req('/api/modules/mod-a/mod-a/items', 'HEAD'), ctx('mod-a'));
    expect(head.status).toBe(200);
    const options = await dispatcher(req('/api/modules/mod-a/mod-a/submit', 'OPTIONS'), ctx('mod-a'));
    expect(options.status).toBe(204);
    expect(options.headers.get('allow')).toBe('POST, OPTIONS');
  });

  it('handler 抛错 → 500', async () => {
    const res = await dispatcher(req('/api/modules/mod-a/mod-a/boom'), ctx('mod-a'));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'internal_error' });
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/module-dispatch.test.ts`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 写 module-dispatch.ts（平移 web-shell `src/server/modules/dispatch.ts`，`moduleServers` 静态 import 改为参数）**

`packages/shell/src/server/module-dispatch.ts`：

```ts
import type {
  ModuleApiContext,
  ModuleApiHandler,
  ModuleApiHandlers,
  ModuleApiMethod,
  ModuleServerRegistry,
  ModuleServerRegistryEntry,
} from './types.js';

const MOUNT_PREFIX = '/api/modules/';

/** Next 16 的 catch-all params 是 Promise；path 仅用于类型，实际路径从原始 URL 还原 */
export type ModuleApiRouteContext = {
  params: Promise<{ moduleId: string; path?: string[] }>;
};

export type ModuleApiDispatch = (
  request: Request,
  context: ModuleApiRouteContext,
) => Promise<Response>;

type ParsedRequest = {
  moduleId: string;
  /** 原始 /api/... 逻辑路径（保留百分号编码） */
  logicalPath: string;
  search: string;
};

type HandlerMatch = {
  handlers: Partial<Record<ModuleApiMethod, ModuleApiHandler>>;
  params: Record<string, string>;
};

function notFound(): Response {
  return jsonError(404, 'not_found');
}

function jsonError(
  status: number,
  error: string,
  headers?: Record<string, string>,
): Response {
  return Response.json(
    { error },
    {
      status,
      headers: { 'cache-control': 'no-store', ...headers },
    },
  );
}

/**
 * 用原始 pathname 还原模块 id 与逻辑路径。
 * 不使用 route params.path：Next 会先解码，%2F 等编码会产生路径歧义。
 */
function parseRequest(requestUrl: string): ParsedRequest | null {
  let url: URL;
  try {
    url = new URL(requestUrl);
  } catch {
    return null;
  }

  const pathname = url.pathname;
  if (!pathname.startsWith(MOUNT_PREFIX)) return null;

  const rest = pathname.slice(MOUNT_PREFIX.length);
  if (!rest) return null;

  const slash = rest.indexOf('/');
  const rawModuleId = slash === -1 ? rest : rest.slice(0, slash);
  const rawRest = slash === -1 ? '' : rest.slice(slash);

  let moduleId: string;
  try {
    moduleId = decodeURIComponent(rawModuleId);
  } catch {
    return null;
  }
  if (!moduleId) return null;

  return {
    moduleId,
    logicalPath: rawRest ? `/api${rawRest}` : '/api',
    search: url.search,
  };
}

function isWithinPrefixes(path: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

function matchHandler(
  handlers: ModuleApiHandlers,
  logicalPath: string,
): HandlerMatch | null {
  const exact = handlers[logicalPath];
  if (exact) return { handlers: exact, params: {} };

  const pathSegments = logicalPath.split('/');
  for (const [pattern, methodMap] of Object.entries(handlers)) {
    if (!pattern.includes(':')) continue;

    const patternSegments = pattern.split('/');
    if (patternSegments.length !== pathSegments.length) continue;

    const params: Record<string, string> = {};
    let matched = true;
    for (let i = 0; i < patternSegments.length; i += 1) {
      const expected = patternSegments[i]!;
      const actual = pathSegments[i]!;
      if (expected.startsWith(':')) {
        if (!actual) {
          matched = false;
          break;
        }
        try {
          params[expected.slice(1)] = decodeURIComponent(actual);
        } catch {
          matched = false;
          break;
        }
        continue;
      }
      if (expected !== actual) {
        matched = false;
        break;
      }
    }

    if (matched) return { handlers: methodMap, params };
  }

  return null;
}

/** 稳定顺序的 Allow；GET 存在时补 HEAD，OPTIONS 始终可用 */
function allowedMethods(
  handlers: Partial<Record<ModuleApiMethod, ModuleApiHandler>>,
): string[] {
  const available = new Set<string>(Object.keys(handlers));
  if (available.has('GET')) available.add('HEAD');
  available.add('OPTIONS');
  return ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].filter(
    (method) => available.has(method),
  );
}

/**
 * 通用模块 API 分发器工厂。
 *
 * 公开 URL：/api/modules/<moduleId>/<原 /api 之后的路径>
 * - 逻辑路径必须落在模块声明的 apiPrefixes 内；
 * - 先精确匹配 handlers 键，再匹配 :param 模式；
 * - 路径命中但方法不支持 → 405 + Allow；HEAD 无 handler 时回退 GET；
 * - OPTIONS 由分发器计算 Allow（不依赖 Next 按 route 文件导出生成）。
 *
 * 鉴权保持现状：不做隐式校验，原样传递 request；模块可读 cookie/header。
 *
 * @param servers 装配生成的模块 server 注册表（宿主从
 *   `@generated/pactor/server-registry` 导入后传入）
 */
export function createModuleDispatcher(
  servers: ModuleServerRegistry,
): ModuleApiDispatch {
  function entryFor(moduleId: string): ModuleServerRegistryEntry | null {
    if (!Object.prototype.hasOwnProperty.call(servers, moduleId)) {
      return null;
    }
    return servers[moduleId] ?? null;
  }

  return async function dispatchModuleApi(request, context): Promise<Response> {
    const parsed = parseRequest(request.url);
    if (!parsed) return notFound();

    const routeParams = await context.params;
    if (routeParams.moduleId !== parsed.moduleId) return notFound();

    const entry = entryFor(parsed.moduleId);
    if (!entry) return notFound();

    const { logicalPath } = parsed;
    if (!isWithinPrefixes(logicalPath, entry.prefixes)) return notFound();

    const match = matchHandler(entry.handlers, logicalPath);
    if (!match) return notFound();

    const method = request.method.toUpperCase();
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          Allow: allowedMethods(match.handlers).join(', '),
          'cache-control': 'no-store',
        },
      });
    }

    let handler =
      method in match.handlers
        ? match.handlers[method as ModuleApiMethod]
        : undefined;
    if (!handler && method === 'HEAD') handler = match.handlers.GET;

    if (!handler) {
      return jsonError(405, 'method_not_allowed', {
        Allow: allowedMethods(match.handlers).join(', '),
      });
    }

    const logicalUrl = new URL(logicalPath, 'http://module.local');
    logicalUrl.search = parsed.search;

    const apiContext: ModuleApiContext = {
      moduleId: entry.moduleId,
      url: logicalUrl,
      params: match.params,
    };

    try {
      return await handler(request, apiContext);
    } catch (error) {
      console.error(
        `[module-api] ${entry.moduleId} ${method} ${logicalPath} 执行失败`,
        error,
      );
      return jsonError(500, 'internal_error');
    }
  };
}
```

`packages/shell/src/server/index.ts` 末尾追加：

```ts
export * from './module-dispatch.js';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/module-dispatch.test.ts`
Expected: 7 个测试 PASS

- [ ] **Step 5: typecheck + commit**

Run: `cd packages/shell && pnpm typecheck`

```bash
git add packages/shell && git commit -m "feat(shell): port module API dispatcher as createModuleDispatcher factory"
```

---

### Task 5: Next 路由 handler 工厂（`./server/routes`）

**Files:**
- Create: `packages/shell/src/server/routes.ts`（覆盖 Task 1 占位）
- Test: `packages/shell/tests/server-routes.test.ts`

**Interfaces:**
- Consumes: Task 3 的 `buildRuntimeBootstrap` / `getRuntimePage` / `getRuntimeFragmentDsl` / `defaultResolveSessionUser` / `ShellCookieStore` / `ShellUser`。
- Produces（Task 15 的 web-shell route 文件消费）：
  - `ShellRuntimeConfig extends ShellGeneratedOptions { resolveUser?: (store: ShellCookieStore) => ShellUser | null }`
  - `createRuntimeHandlers(config?: ShellRuntimeConfig): { bootstrap; page; fragment }`，三个均为 Next route handler 形态
  - 预置单例：`runtimeBootstrapHandler` / `runtimePageHandler` / `runtimeFragmentHandler`（默认配置）
  - 注意：本文件 import `next/headers`，**不**进 `./server` 桶出口，只经 `./server/routes` 子路径导出，避免 CLI 等非 Next 环境误载。

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/server-routes.test.ts`：

```ts
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => undefined }),
}));

import { createRuntimeHandlers } from '../src/server/routes.js';

function fixtureDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'shell-routes-'));
  mkdirSync(join(dir, 'dsl/m1'), { recursive: true });
  writeFileSync(
    join(dir, 'dsl/m1/home.yaml'),
    'dsl: "1.0"\npage: { id: home, title: 首页 }\nbody: { type: Text, props: { content: hello } }\n',
  );
  writeFileSync(
    join(dir, 'assembly.json'),
    JSON.stringify({ generatedAt: 'x', modules: [], routes: [] }),
  );
  writeFileSync(
    join(dir, 'pages.json'),
    JSON.stringify({
      pages: [
        { globalPageId: 'm1:home', moduleId: 'm1', pageId: 'home', path: '/m1', title: '首页', version: 1, public: true, dslRef: 'dsl/m1/home.yaml' },
      ],
    }),
  );
  writeFileSync(join(dir, 'menus.json'), JSON.stringify({ menus: [] }));
  writeFileSync(
    join(dir, 'sitemap-meta.json'),
    JSON.stringify({ layout: 'shell', dslVersion: '1.0', app: { name: 'Fixture' }, auth: { loginPath: '/login' }, layouts: {} }),
  );
  writeFileSync(join(dir, 'fragments.json'), JSON.stringify({ fragments: {} }));
  return dir;
}

describe('createRuntimeHandlers', () => {
  it('bootstrap 返回合并 sitemap（no-store）', async () => {
    const handlers = createRuntimeHandlers({ generatedDir: fixtureDir() });
    const res = await handlers.bootstrap();
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    const body = await res.json();
    expect(body.resourceType).toBe('sitemap');
    expect(body.pages).toHaveLength(1);
  });

  it('page 命中返回 PageResource 信封；未命中 404', async () => {
    const handlers = createRuntimeHandlers({ generatedDir: fixtureDir() });
    const ok = await handlers.page(new Request('http://x/api/runtime/pages/m1%3Ahome'), {
      params: Promise.resolve({ pageId: 'm1:home' }),
    });
    expect(ok.status).toBe(200);
    await expect(ok.json()).resolves.toMatchObject({ id: 'm1:home', resourceType: 'page' });

    const missing = await handlers.page(new Request('http://x/api/runtime/pages/m1%3Anope'), {
      params: Promise.resolve({ pageId: 'm1:nope' }),
    });
    expect(missing.status).toBe(404);
  });

  it('fragment 未命中 404', async () => {
    const handlers = createRuntimeHandlers({ generatedDir: fixtureDir() });
    const res = await handlers.fragment(new Request('http://x/api/runtime/fragments/f1'), {
      params: Promise.resolve({ fragmentId: 'f1' }),
    });
    expect(res.status).toBe(404);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/server-routes.test.ts`
Expected: FAIL（routes.ts 只有占位 `export {}`）

- [ ] **Step 3: 写 routes.ts**

`packages/shell/src/server/routes.ts`：

```ts
import { cookies } from 'next/headers';

import { buildRuntimeBootstrap } from './bootstrap.js';
import { getRuntimeFragmentDsl } from './fragments.js';
import { getRuntimePage } from './pages.js';
import type { ShellGeneratedOptions } from './registry.js';
import {
  defaultResolveSessionUser,
  type ShellCookieStore,
  type ShellUser,
} from './session.js';

export interface ShellRuntimeConfig extends ShellGeneratedOptions {
  /** 会话解析扩展点；缺省恒匿名（defaultResolveSessionUser） */
  resolveUser?: (store: ShellCookieStore) => ShellUser | null;
}

type PageRouteContext = { params: Promise<{ pageId: string }> };
type FragmentRouteContext = { params: Promise<{ fragmentId: string }> };

export interface RuntimeRouteHandlers {
  bootstrap: () => Promise<Response>;
  page: (request: Request, context: PageRouteContext) => Promise<Response>;
  fragment: (
    request: Request,
    context: FragmentRouteContext,
  ) => Promise<Response>;
}

const STATUS_BY_KIND = {
  not_found: 404,
  unauthorized: 401,
  forbidden: 403,
} as const;

/** Runtime DSL API 的 Next route handler 工厂（路径约定见 README：/api/runtime/*）。 */
export function createRuntimeHandlers(
  config: ShellRuntimeConfig = {},
): RuntimeRouteHandlers {
  const resolveUser = config.resolveUser ?? defaultResolveSessionUser;

  return {
    async bootstrap() {
      const store = await cookies();
      const body = buildRuntimeBootstrap(resolveUser(store), config);
      return Response.json(body, {
        headers: { 'cache-control': 'no-store' },
      });
    },

    async page(_request, context) {
      const { pageId } = await context.params;
      const store = await cookies();
      const result = getRuntimePage(pageId, resolveUser(store), config);
      if (result.kind !== 'ok') {
        return Response.json(
          { error: result.kind },
          { status: STATUS_BY_KIND[result.kind] },
        );
      }
      return Response.json(result.resource, {
        headers: { 'cache-control': 'no-store' },
      });
    },

    async fragment(_request, context) {
      const { fragmentId } = await context.params;
      const store = await cookies();
      const fragment = getRuntimeFragmentDsl(fragmentId, resolveUser(store), config);
      if (!fragment) {
        return Response.json({ error: 'not_found' }, { status: 404 });
      }
      return Response.json(fragment, {
        headers: { 'cache-control': 'no-store' },
      });
    },
  };
}

/** 默认配置的就绪 handler：宿主 route 文件可一行 re-export（生成目录为缺省 .generated/pactor）。 */
const defaultHandlers = createRuntimeHandlers();

export const runtimeBootstrapHandler = defaultHandlers.bootstrap;
export const runtimePageHandler = defaultHandlers.page;
export const runtimeFragmentHandler = defaultHandlers.fragment;
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/server-routes.test.ts`
Expected: 3 个测试 PASS

- [ ] **Step 5: typecheck + 构建 + commit**

Run: `cd packages/shell && pnpm typecheck && pnpm build`
Expected: 无错误；`dist/server/routes.js` 存在

```bash
git add packages/shell && git commit -m "feat(shell): add createRuntimeHandlers route factory (./server/routes)"
```

---

### Task 6: 客户端扩展注册合并（register-extensions）

**Files:**
- Create: `packages/shell/src/client/register-extensions.ts`
- Modify: `packages/shell/src/client/index.ts`
- Test: `packages/shell/tests/register-extensions.test.ts`

**Interfaces:**
- Produces（Task 10 的 PactorShellHost、Task 12 装配生成的 client-registry 类型引用消费）：
  - `ModuleExtensionBundle = { components?: Record<string, ComponentType<unknown>>; actions?: Record<string, ActionHandler> }`（`ActionHandler` 来自 `@pactor-app/runtime`）
  - `mergeModuleComponents(extensions: Record<string, ModuleExtensionBundle>): Record<string, ComponentType<unknown>>`
  - `mergeModuleActions(extensions: Record<string, ModuleExtensionBundle>): Record<string, ActionHandler>`
  - 合并规则（与 web-shell 现状一致）：每个键同时注册原名与 `{moduleId}/{原名}`；重名时先注册者占短名并 `console.warn`。

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/register-extensions.test.ts`：

```ts
import type { ComponentType } from 'react';

import { describe, expect, it, vi } from 'vitest';

import {
  mergeModuleActions,
  mergeModuleComponents,
} from '../src/client/register-extensions.js';

const A: ComponentType<unknown> = () => null;
const B: ComponentType<unknown> = () => null;

describe('mergeModuleComponents', () => {
  it('注册原名与命名空间键', () => {
    const merged = mergeModuleComponents({ m1: { components: { Panel: A } } });
    expect(merged.Panel).toBe(A);
    expect(merged['m1/Panel']).toBe(A);
  });

  it('重名时先注册者占短名并告警，后续模块只保留命名空间键', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const merged = mergeModuleComponents({
      m1: { components: { Panel: A } },
      m2: { components: { Panel: B } },
    });
    expect(merged.Panel).toBe(A);
    expect(merged['m2/Panel']).toBe(B);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});

describe('mergeModuleActions', () => {
  it('合并动作并带命名空间键', () => {
    const act = () => ({ ok: true });
    const merged = mergeModuleActions({ m1: { actions: { refresh: act } } });
    expect(merged.refresh).toBe(act);
    expect(merged['m1/refresh']).toBe(act);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/register-extensions.test.ts`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 写实现（逐行平移 web-shell `src/runtime/register-extensions.ts`）**

`packages/shell/src/client/register-extensions.ts`：

```ts
import type { ComponentType } from 'react';

import type { ActionHandler } from '@pactor-app/runtime';

export type ModuleExtensionBundle = {
  components?: Record<string, ComponentType<unknown>>;
  actions?: Record<string, ActionHandler>;
};

function mergeExtensionRecord<T>(
  extensions: Record<string, ModuleExtensionBundle>,
  pick: (bundle: ModuleExtensionBundle) => Record<string, T> | undefined,
  label: string,
): Record<string, T> {
  const merged: Record<string, T> = {};
  for (const [moduleId, bundle] of Object.entries(extensions)) {
    for (const [key, value] of Object.entries(pick(bundle) ?? {})) {
      const namespacedKey = `${moduleId}/${key}`;
      if (merged[namespacedKey] || merged[key]) {
        console.warn(
          `[shell] ${label}注册冲突：${key}（模块 ${moduleId}），已使用命名空间键 ${namespacedKey}`,
        );
      }
      merged[namespacedKey] = value;
      merged[key] ??= value;
    }
  }
  return merged;
}

export function mergeModuleComponents(
  extensions: Record<string, ModuleExtensionBundle>,
): Record<string, ComponentType<unknown>> {
  return mergeExtensionRecord(
    extensions,
    (b) => b.components as Record<string, ComponentType<unknown>>,
    '组件',
  );
}

export function mergeModuleActions(
  extensions: Record<string, ModuleExtensionBundle>,
): Record<string, ActionHandler> {
  return mergeExtensionRecord(extensions, (b) => b.actions, '动作');
}
```

`packages/shell/src/client/index.ts` 改为：

```ts
export { mergeModuleActions, mergeModuleComponents } from './register-extensions.js';
export type { ModuleExtensionBundle } from './register-extensions.js';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/register-extensions.test.ts`
Expected: 3 个测试 PASS

- [ ] **Step 5: typecheck + commit**

```bash
cd packages/shell && pnpm typecheck
git add packages/shell && git commit -m "feat(shell): port module extension merge (components/actions namespacing)"
```

---

### Task 7: 皮肤运行时 helpers（client/skin.ts）

**Files:**
- Create: `packages/shell/src/client/skin.ts`
- Modify: `packages/shell/src/client/index.ts`（追加 `export * from './skin.js';`）
- Test: `packages/shell/tests/skin.test.ts`

**Interfaces:**
- Consumes: `@pactor-app/theme` 的 `applyTheme` / `isThemeName` / `THEME_ATTR`（`data-pactor-skin`）/ `THEME_REQUESTED_ATTR`（`data-requested-skin`）/ `THEME_STYLE_ATTR`（`data-pactor-theme-style`）/ `ThemeName`。
- Produces（Task 9 SkinSwitcher、Task 11 AppShell 消费）：
  - `SHELL_SKIN_STORAGE_KEY = 'pactor.theme'`、`SHELL_MODE_STORAGE_KEY = 'pactor.mode'`、`SHELL_PREFERENCES_EVENT = 'pactor-shell:preferences-change'`
  - `ShellMode = 'light' | 'dark' | 'system'`
  - `resolveShellSkin(value: string | null | undefined, defaultSkin?: ThemeName): ThemeName | null`（非法/空 → defaultSkin ?? null；null 表示「宿主基础皮肤」）
  - `readStoredShellSkin(storageKey?): string | null`
  - `selectShellSkin(skin: ThemeName, storageKey?): void`（写 localStorage + 派发偏好事件）
  - `clearShellSkin(storageKey?): void`（移除存储 + 注入的 `<style>` / 首屏 `<link data-pactor-skin>` + html 属性，回到宿主基础皮肤）
  - `applyShellSkin(skin: ThemeName, storageKey?): Promise<void>`（写 `data-requested-skin` → `applyTheme(persist:false)` → 成功后移除首屏 link；失败保留 link 供下次重试）
  - `readShellMode(modeStorageKey?): ShellMode`（非法/空 → 'system'）
  - `applyShellMode(mode: ShellMode, systemDark: boolean): void`（写/删 `data-pactor-theme="dark"`）
  - `selectShellMode(mode: ShellMode, modeStorageKey?): void`

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/skin.test.ts`：

```ts
// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const applyThemeMock = vi.hoisted(() =>
  vi.fn<(name: string, options?: { storageKey?: string; persist?: boolean }) => Promise<string>>(
    async (name) => name as never,
  ),
);

vi.mock('@pactor-app/theme', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@pactor-app/theme')>();
  return { ...actual, applyTheme: applyThemeMock };
});

import {
  applyShellMode,
  applyShellSkin,
  clearShellSkin,
  readShellMode,
  readStoredShellSkin,
  resolveShellSkin,
  selectShellMode,
  selectShellSkin,
  SHELL_MODE_STORAGE_KEY,
  SHELL_PREFERENCES_EVENT,
  SHELL_SKIN_STORAGE_KEY,
} from '../src/client/skin.js';

beforeEach(() => {
  localStorage.clear();
  applyThemeMock.mockClear();
  document.documentElement.removeAttribute('data-pactor-skin');
  document.documentElement.removeAttribute('data-requested-skin');
  document.documentElement.removeAttribute('data-pactor-theme');
  document.head.innerHTML = '';
});

describe('resolveShellSkin / readStoredShellSkin', () => {
  it('合法皮肤名原样返回；非法值回退 defaultSkin 或 null', () => {
    expect(resolveShellSkin('qing-hui')).toBe('qing-hui');
    expect(resolveShellSkin('nope', 'qing-ming')).toBe('qing-ming');
    expect(resolveShellSkin(null)).toBeNull();
  });

  it('readStoredShellSkin 读 localStorage，缺省键 pactor.theme', () => {
    localStorage.setItem(SHELL_SKIN_STORAGE_KEY, 'tian-shui');
    expect(readStoredShellSkin()).toBe('tian-shui');
  });
});

describe('selectShellSkin / clearShellSkin', () => {
  it('selectShellSkin 写存储并派发偏好事件', () => {
    const seen: string[] = [];
    window.addEventListener(SHELL_PREFERENCES_EVENT, () => seen.push('x'));
    selectShellSkin('qing-hui');
    expect(localStorage.getItem(SHELL_SKIN_STORAGE_KEY)).toBe('qing-hui');
    expect(seen).toHaveLength(1);
  });

  it('clearShellSkin 清除存储、注入 style、首屏 link 与 html 属性', () => {
    localStorage.setItem(SHELL_SKIN_STORAGE_KEY, 'qing-hui');
    const style = document.createElement('style');
    style.setAttribute('data-pactor-theme-style', 'qing-hui');
    document.head.appendChild(style);
    const link = document.createElement('link');
    link.setAttribute('data-pactor-skin', 'qing-hui');
    document.head.appendChild(link);
    document.documentElement.setAttribute('data-pactor-skin', 'qing-hui');
    document.documentElement.setAttribute('data-requested-skin', 'qing-hui');

    clearShellSkin();

    expect(localStorage.getItem(SHELL_SKIN_STORAGE_KEY)).toBeNull();
    expect(document.querySelector('style[data-pactor-theme-style]')).toBeNull();
    expect(document.querySelector('link[data-pactor-skin]')).toBeNull();
    expect(document.documentElement.getAttribute('data-pactor-skin')).toBeNull();
    expect(document.documentElement.getAttribute('data-requested-skin')).toBeNull();
  });
});

describe('applyShellSkin', () => {
  it('写 data-requested-skin，applyTheme 成功后移除首屏 link', async () => {
    const link = document.createElement('link');
    link.setAttribute('data-pactor-skin', 'qing-hui');
    document.head.appendChild(link);

    await applyShellSkin('qing-hui');

    expect(document.documentElement.getAttribute('data-requested-skin')).toBe('qing-hui');
    expect(applyThemeMock).toHaveBeenCalledWith(
      'qing-hui',
      expect.objectContaining({ persist: false, storageKey: SHELL_SKIN_STORAGE_KEY }),
    );
    expect(document.querySelector('link[data-pactor-skin]')).toBeNull();
  });

  it('applyTheme 失败时保留首屏 link', async () => {
    applyThemeMock.mockRejectedValueOnce(new Error('chunk fail'));
    const link = document.createElement('link');
    link.setAttribute('data-pactor-skin', 'qing-hui');
    document.head.appendChild(link);

    await applyShellSkin('qing-hui');

    expect(document.querySelector('link[data-pactor-skin]')).not.toBeNull();
  });
});

describe('mode', () => {
  it('readShellMode 非法值回退 system', () => {
    expect(readShellMode()).toBe('system');
    localStorage.setItem(SHELL_MODE_STORAGE_KEY, 'dark');
    expect(readShellMode()).toBe('dark');
    localStorage.setItem(SHELL_MODE_STORAGE_KEY, 'weird');
    expect(readShellMode()).toBe('system');
  });

  it('applyShellMode 按 mode 与系统偏好写/删 dark 属性', () => {
    applyShellMode('dark', false);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBe('dark');
    applyShellMode('light', true);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBeNull();
    applyShellMode('system', true);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBe('dark');
    applyShellMode('system', false);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBeNull();
  });

  it('selectShellMode 写存储并派发偏好事件', () => {
    let fired = 0;
    window.addEventListener(SHELL_PREFERENCES_EVENT, () => {
      fired += 1;
    });
    selectShellMode('dark');
    expect(localStorage.getItem(SHELL_MODE_STORAGE_KEY)).toBe('dark');
    expect(fired).toBe(1);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/skin.test.ts`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 写实现**

`packages/shell/src/client/skin.ts`：

```ts
import {
  applyTheme,
  isThemeName,
  THEME_ATTR,
  THEME_REQUESTED_ATTR,
  THEME_STYLE_ATTR,
  type ThemeName,
} from '@pactor-app/theme';

export const SHELL_SKIN_STORAGE_KEY = 'pactor.theme';
export const SHELL_MODE_STORAGE_KEY = 'pactor.mode';
export const SHELL_PREFERENCES_EVENT = 'pactor-shell:preferences-change';

export type ShellMode = 'light' | 'dark' | 'system';

/**
 * 解析持久化皮肤：合法内置皮肤名原样返回；非法/空值回退 defaultSkin，
 * 未提供 defaultSkin 时返回 null（表示「宿主基础皮肤」，不注入任何皮肤样式）。
 */
export function resolveShellSkin(
  value: string | null | undefined,
  defaultSkin?: ThemeName,
): ThemeName | null {
  if (isThemeName(value)) return value;
  return defaultSkin ?? null;
}

export function readStoredShellSkin(
  storageKey: string = SHELL_SKIN_STORAGE_KEY,
): string | null {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function dispatchPreferencesChange(): void {
  window.dispatchEvent(new Event(SHELL_PREFERENCES_EVENT));
}

/** 选择皮肤：写存储 + 派发偏好事件；实际样式应用由监听方（SkinSwitcher effect）执行。 */
export function selectShellSkin(
  skin: ThemeName,
  storageKey: string = SHELL_SKIN_STORAGE_KEY,
): void {
  try {
    localStorage.setItem(storageKey, skin);
  } catch {
    // 隐私模式 / 存储被禁用：换肤仍生效，只是不持久化
  }
  dispatchPreferencesChange();
}

/** 清除皮肤覆盖，回到宿主基础皮肤（移除注入的 <style>、首屏 <link> 与 html 属性）。 */
export function clearShellSkin(
  storageKey: string = SHELL_SKIN_STORAGE_KEY,
): void {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // 同上：忽略存储异常
  }
  document.querySelector(`style[${THEME_STYLE_ATTR}]`)?.remove();
  document.querySelectorAll(`link[${THEME_ATTR}]`).forEach((link) => link.remove());
  document.documentElement.removeAttribute(THEME_ATTR);
  document.documentElement.removeAttribute(THEME_REQUESTED_ATTR);
  dispatchPreferencesChange();
}

/**
 * 应用皮肤：先写 data-requested-skin（首屏脚本与运行时共用的「目标皮肤」标记），
 * 运行时由主题包懒加载 CSS 注入 <style>；成功后移除首屏 <link data-pactor-skin>，
 * 避免同一皮肤的双份 CSS。加载失败保留首屏 link，下一次切换会重试。
 */
export async function applyShellSkin(
  skin: ThemeName,
  storageKey: string = SHELL_SKIN_STORAGE_KEY,
): Promise<void> {
  document.documentElement.setAttribute(THEME_REQUESTED_ATTR, skin);
  try {
    await applyTheme(skin, { storageKey, persist: false });
    document
      .querySelectorAll(`link[${THEME_ATTR}]`)
      .forEach((link) => link.remove());
  } catch {
    // 主题 chunk 加载失败：保留首屏 link
  }
}

export function readShellMode(
  modeStorageKey: string = SHELL_MODE_STORAGE_KEY,
): ShellMode {
  try {
    const mode = localStorage.getItem(modeStorageKey);
    return mode === 'light' || mode === 'dark' ? mode : 'system';
  } catch {
    return 'system';
  }
}

/** 应用外观模式：dark 或 system+系统深色 → <html data-pactor-theme="dark">。 */
export function applyShellMode(mode: ShellMode, systemDark: boolean): void {
  const dark = mode === 'dark' || (mode === 'system' && systemDark);
  if (dark) {
    document.documentElement.setAttribute('data-pactor-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-pactor-theme');
  }
}

export function selectShellMode(
  mode: ShellMode,
  modeStorageKey: string = SHELL_MODE_STORAGE_KEY,
): void {
  try {
    localStorage.setItem(modeStorageKey, mode);
  } catch {
    // 忽略存储异常
  }
  dispatchPreferencesChange();
}
```

`packages/shell/src/client/index.ts` 末尾追加：

```ts
export * from './skin.js';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/skin.test.ts`
Expected: 9 个测试 PASS

- [ ] **Step 5: typecheck + commit**

```bash
cd packages/shell && pnpm typecheck
git add packages/shell && git commit -m "feat(shell): add skin runtime helpers over @pactor-app/theme"
```

---

### Task 8: SkinHeadScript（首屏防闪烁内联脚本）

**Files:**
- Create: `packages/shell/src/skin/SkinHeadScript.tsx`
- Modify: `packages/shell/src/client/index.ts`（追加导出）
- Test: `packages/shell/tests/skin-head-script.test.ts`

**Interfaces:**
- Consumes: `@pactor-app/theme` 的 `THEME_NAMES`。
- Produces（Task 15 的 web-shell 根 layout 消费）：
  - `SkinHeadScript(props: SkinHeadScriptProps): JSX.Element`（服务端可渲染的 `<script>`，无 hooks，可放根 layout `<head>`）
  - `SkinHeadScriptProps = { storageKey?: string; defaultSkin?: string; modeStorageKey?: string; themesPath?: string; allowedSkins?: string[] }`
  - 缺省：`storageKey: 'pactor.theme'`、`modeStorageKey: 'pactor.mode'`、`themesPath: '/themes'`（即 `pactor-shell theme sync` 的输出）、`allowedSkins` 为主题包全部预置；**`defaultSkin` 不传时不注入首屏 `<link>`**（保留宿主基础皮肤，避免覆盖宿主默认外观）。
  - 脚本行为（照搬 next-app-starter 根 layout 内联脚本语义）：读 localStorage → 校验 allowedSkins → 命中则写 `data-requested-skin` / `data-pactor-skin` 并同步插入 `<link rel="stylesheet" href="<themesPath>/<skin>.css" data-pactor-skin>`；再按 modeStorageKey + `prefers-color-scheme` 写/删 `data-pactor-theme="dark"` 并监听系统变化。

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/skin-head-script.test.ts`：

```ts
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { describe, expect, it } from 'vitest';

import { SkinHeadScript } from '../src/skin/SkinHeadScript.js';

function scriptHtml(props?: Parameters<typeof SkinHeadScript>[0]): string {
  return renderToStaticMarkup(createElement(SkinHeadScript, props));
}

describe('SkinHeadScript', () => {
  it('包含存储键、皮肤名单与 themes 路径', () => {
    const html = scriptHtml();
    expect(html).toContain('localStorage.getItem("pactor.theme")');
    expect(html).toContain('"qing-hui"');
    expect(html).toContain('"/themes"');
    expect(html).toContain('data-pactor-skin');
    expect(html).toContain('prefers-color-scheme: dark');
    expect(html).toContain('localStorage.getItem("pactor.mode")');
  });

  it('不传 defaultSkin 时缺省不注入首屏 link（skin 落回 null）', () => {
    expect(scriptHtml()).toContain('skin=null');
  });

  it('传 defaultSkin 时作为无存储值的首屏缺省', () => {
    expect(scriptHtml({ defaultSkin: 'qing-ming' })).toContain('skin="qing-ming"');
  });

  it('自定义 storageKey / modeStorageKey / themesPath / allowedSkins', () => {
    const html = scriptHtml({
      storageKey: 'mc-skin',
      modeStorageKey: 'mc-mode',
      themesPath: '/skins',
      allowedSkins: ['qing-hui'],
    });
    expect(html).toContain('localStorage.getItem("mc-skin")');
    expect(html).toContain('localStorage.getItem("mc-mode")');
    expect(html).toContain('"/skins"');
    expect(html).toContain('["qing-hui"]');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/skin-head-script.test.ts`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 写实现**

`packages/shell/src/skin/SkinHeadScript.tsx`：

```tsx
import { THEME_NAMES } from '@pactor-app/theme';

export interface SkinHeadScriptProps {
  /** 皮肤持久化键，缺省 pactor.theme */
  storageKey?: string;
  /** 无持久化值时的缺省皮肤；不传则不注入首屏 <link>（保留宿主基础皮肤） */
  defaultSkin?: string;
  /** light/dark 模式持久化键，缺省 pactor.mode */
  modeStorageKey?: string;
  /** 皮肤 CSS 的 public 目录，缺省 /themes（pactor-shell theme sync 的输出） */
  themesPath?: string;
  /** 允许的皮肤名单，缺省主题包全部预置 */
  allowedSkins?: string[];
}

/**
 * 首屏防闪烁内联脚本（宿主放根 layout <head>，如
 * `<head><SkinHeadScript /></head>`）。语义与 next-app-starter 根 layout 的
 * 内联脚本一致：同步恢复持久化皮肤 <link> 与 light/dark 模式属性，避免
 * 水合前闪烁；根 <html> 需配 suppressHydrationWarning。
 */
export function SkinHeadScript({
  storageKey = 'pactor.theme',
  defaultSkin,
  modeStorageKey = 'pactor.mode',
  themesPath = '/themes',
  allowedSkins,
}: SkinHeadScriptProps) {
  const js = `(function(){var root=document.documentElement;var allowed=${JSON.stringify(allowedSkins ?? [...THEME_NAMES])};var skin=null;try{skin=localStorage.getItem(${JSON.stringify(storageKey)})}catch(e){}if(allowed.indexOf(skin)<0){skin=${defaultSkin === undefined ? 'null' : JSON.stringify(defaultSkin)}}if(skin){root.setAttribute("data-requested-skin",skin);root.setAttribute("data-pactor-skin",skin);var link=document.createElement("link");link.rel="stylesheet";link.href=${JSON.stringify(themesPath)}+"/"+skin+".css";link.setAttribute("data-pactor-skin",skin);document.head.appendChild(link)}var m=window.matchMedia("(prefers-color-scheme: dark)");function apply(){var mode;try{mode=localStorage.getItem(${JSON.stringify(modeStorageKey)})}catch(e){}var dark=mode?mode==="dark":m.matches;if(dark){root.setAttribute("data-pactor-theme","dark")}else{root.removeAttribute("data-pactor-theme")}}apply();m.addEventListener("change",apply)})()`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
```

`packages/shell/src/client/index.ts` 末尾追加：

```ts
export { SkinHeadScript } from '../skin/SkinHeadScript.js';
export type { SkinHeadScriptProps } from '../skin/SkinHeadScript.js';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/skin-head-script.test.ts`
Expected: 4 个测试 PASS

- [ ] **Step 5: typecheck + commit**

```bash
cd packages/shell && pnpm typecheck
git add packages/shell && git commit -m "feat(shell): add SkinHeadScript first-paint inline script"
```

---

### Task 9: SkinSwitcher 组件（皮肤画廊 + 外观模式）

**Files:**
- Create: `packages/shell/src/client/SkinSwitcher.tsx`
- Modify: `packages/shell/src/client/index.ts`（追加导出）
- Test: `packages/shell/tests/skin-switcher.test.tsx`

**Interfaces:**
- Consumes: Task 7 的 skin helpers；`@pactor-app/theme` 的 `THEMES` / `themeText` / `ThemeName`。
- Produces（Task 10 PactorShellHost 自动注册为 DSL 组件、Task 11 AppShell 内嵌）：
  - `SkinSwitcher(props: SkinSwitcherProps): JSX.Element`
  - `SkinSwitcherProps = { skins?: ThemeName[]; defaultSkin?: ThemeName; allowDefault?: boolean; storageKey?: string; modeStorageKey?: string; locale?: string; onChange?: (skin: ThemeName | null) => void }`
  - 行为：触发按钮（调色板图标 + 当前皮肤名）→ 弹层（外观模式三态段控 + 皮肤画廊卡片）；选中即生效并持久化；`allowDefault` 时画廊首卡为「默认皮肤」（调 `clearShellSkin` 回宿主基础皮肤）；挂载或皮肤变化时 effect 调 `applyShellSkin`（替换首屏 link 为运行时 style）；跨标签页经 storage 事件同步。

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/skin-switcher.test.tsx`：

```tsx
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const applyThemeMock = vi.hoisted(() =>
  vi.fn<(name: string, options?: { storageKey?: string; persist?: boolean }) => Promise<string>>(
    async (name) => name as never,
  ),
);

vi.mock('@pactor-app/theme', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@pactor-app/theme')>();
  return { ...actual, applyTheme: applyThemeMock };
});

import { SkinSwitcher } from '../src/client/SkinSwitcher.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(cleanup);

beforeAll(() => {
  // jsdom 无 matchMedia，补最小实现
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

beforeEach(() => {
  localStorage.clear();
  applyThemeMock.mockClear();
  document.documentElement.removeAttribute('data-pactor-skin');
  document.documentElement.removeAttribute('data-requested-skin');
  document.documentElement.removeAttribute('data-pactor-theme');
  document.head.innerHTML = '';
});

describe('SkinSwitcher', () => {
  it('无持久化且无 defaultSkin 时触发按钮显示「默认皮肤」', () => {
    render(<SkinSwitcher allowDefault />);
    expect(screen.getByRole('button', { name: /默认皮肤/ })).toBeTruthy();
  });

  it('选择皮肤：写 localStorage、调 applyTheme（persist:false）、上报 onChange', async () => {
    const onChange = vi.fn();
    render(<SkinSwitcher skins={['qing-hui', 'qing-ming']} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /皮肤/ }));
    fireEvent.click(screen.getByRole('button', { name: /青灰冷调/ }));

    expect(localStorage.getItem('pactor.theme')).toBe('qing-hui');
    expect(onChange).toHaveBeenCalledWith('qing-hui');
    await waitFor(() =>
      expect(applyThemeMock).toHaveBeenCalledWith(
        'qing-hui',
        expect.objectContaining({ persist: false }),
      ),
    );
  });

  it('点「默认皮肤」卡片清除覆盖并上报 null', async () => {
    localStorage.setItem('pactor.theme', 'qing-hui');
    const onChange = vi.fn();
    render(<SkinSwitcher skins={['qing-hui']} allowDefault onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /皮肤/ }));
    fireEvent.click(screen.getByRole('button', { name: /^默认皮肤$/ }));

    await waitFor(() => expect(localStorage.getItem('pactor.theme')).toBeNull());
    expect(onChange).toHaveBeenCalledWith(null);
    expect(document.documentElement.getAttribute('data-pactor-skin')).toBeNull();
  });

  it('外观模式段控：选深色写存储并置 data-pactor-theme', async () => {
    render(<SkinSwitcher skins={['qing-hui']} />);
    fireEvent.click(screen.getByRole('button', { name: /皮肤/ }));
    fireEvent.click(screen.getByRole('button', { name: '深色' }));

    await waitFor(() => expect(localStorage.getItem('pactor.mode')).toBe('dark'));
    await waitFor(() =>
      expect(document.documentElement.getAttribute('data-pactor-theme')).toBe('dark'),
    );
  });
});
```

注意：测试断言「青灰冷调」是 `@pactor-app/theme` 的 `themes.json` 中 `qing-hui` 的 `label`（已核对）；若主题包文案调整，同步改断言。

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/skin-switcher.test.tsx`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 写实现**

`packages/shell/src/client/SkinSwitcher.tsx`：

```tsx
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { THEMES, themeText, type ThemeName } from '@pactor-app/theme';

import {
  applyShellMode,
  applyShellSkin,
  clearShellSkin,
  readShellMode,
  readStoredShellSkin,
  resolveShellSkin,
  selectShellMode,
  selectShellSkin,
  SHELL_MODE_STORAGE_KEY,
  SHELL_PREFERENCES_EVENT,
  SHELL_SKIN_STORAGE_KEY,
  type ShellMode,
} from './skin.js';

export interface SkinSwitcherProps {
  /** 可选皮肤名单，缺省主题包全部预置 */
  skins?: ThemeName[];
  /** 无持久化值时的缺省皮肤（应与 SkinHeadScript 的 defaultSkin 一致） */
  defaultSkin?: ThemeName;
  /** 画廊首卡提供「默认皮肤」（清除覆盖，回到宿主基础皮肤），缺省 false */
  allowDefault?: boolean;
  /** 皮肤持久化键，缺省 pactor.theme */
  storageKey?: string;
  /** 外观模式持久化键，缺省 pactor.mode */
  modeStorageKey?: string;
  /** 皮肤名文案语言，缺省 zh-CN */
  locale?: string;
  onChange?: (skin: ThemeName | null) => void;
}

const MODE_OPTIONS: { value: ShellMode; label: string }[] = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'system', label: '跟随系统' },
];

function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  window.addEventListener(SHELL_PREFERENCES_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(SHELL_PREFERENCES_EVENT, onChange);
  };
}

function subscribeSystemDark(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

/**
 * 皮肤切换器：侧栏/头部紧凑入口 + 弹层画廊。同时可作为 Pactor DSL 组件
 * 使用（PactorShellHost 自动注册为 `SkinSwitcher`，布局 YAML 以
 * `type: SkinSwitcher` 引用，DSL props 与本组件 props 同名）。
 */
export function SkinSwitcher({
  skins,
  defaultSkin,
  allowDefault = false,
  storageKey = SHELL_SKIN_STORAGE_KEY,
  modeStorageKey = SHELL_MODE_STORAGE_KEY,
  locale = 'zh-CN',
  onChange,
}: SkinSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const stored = useSyncExternalStore(
    subscribe,
    () => readStoredShellSkin(storageKey),
    () => null,
  );
  const mode = useSyncExternalStore(
    subscribe,
    () => readShellMode(modeStorageKey),
    () => 'system' as ShellMode,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false,
  );

  const selected = resolveShellSkin(stored, defaultSkin);
  const list = THEMES.filter((t) => skins === undefined || skins.includes(t.name));

  // 皮肤落地：运行时 <style> 替换首屏 <link>（宿主基础皮肤 selected=null 时不动）
  useEffect(() => {
    if (selected !== null) void applyShellSkin(selected, storageKey);
  }, [selected, storageKey]);

  // 外观模式落地：data-pactor-theme="dark"
  useEffect(() => {
    applyShellMode(mode, systemDark);
  }, [mode, systemDark]);

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const keyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keyboard);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', keyboard);
    };
  }, [open]);

  const currentLabel =
    selected === null
      ? '默认皮肤'
      : themeText(THEMES.find((t) => t.name === selected)!, locale).label;

  const pick = (name: ThemeName | null) => {
    if (name === null) {
      clearShellSkin(storageKey);
      onChange?.(null);
    } else {
      selectShellSkin(name, storageKey);
      onChange?.(name);
    }
  };

  return (
    <div ref={ref} className="pactor-shell-skin">
      <button
        type="button"
        className="pactor-shell-skin-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`皮肤设置：${currentLabel}`}
        onClick={() => setOpen(!open)}
      >
        <PaletteIcon />
        <span className="pactor-shell-skin-label">{currentLabel}</span>
      </button>
      {open && (
        <div className="pactor-shell-skin-popover" role="dialog" aria-label="皮肤设置">
          <div className="pactor-shell-skin-section">
            <div className="pactor-shell-skin-heading">外观模式</div>
            <div className="pactor-shell-mode" role="group" aria-label="外观模式">
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={mode === option.value}
                  onClick={() => selectShellMode(option.value, modeStorageKey)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pactor-shell-skin-section">
            <div className="pactor-shell-skin-heading">皮肤</div>
            <div className="pactor-shell-theme-grid">
              {allowDefault && (
                <button
                  type="button"
                  className={`pactor-shell-theme-card${selected === null ? ' is-selected' : ''}`}
                  aria-pressed={selected === null}
                  aria-label="默认皮肤"
                  onClick={() => pick(null)}
                >
                  <div className="pactor-shell-theme-preview">
                    <div className="pactor-shell-theme-preview-window">
                      <span />
                      <div><i /><i /><i /></div>
                    </div>
                    {selected === null && (
                      <span className="pactor-shell-theme-selected"><CheckIcon /> 已应用</span>
                    )}
                  </div>
                  <div className="pactor-shell-theme-card-body">
                    <div><strong>默认皮肤</strong><p>宿主基础皮肤</p></div>
                  </div>
                </button>
              )}
              {list.map((theme) => {
                const text = themeText(theme, locale);
                const active = selected === theme.name;
                return (
                  <button
                    key={theme.name}
                    type="button"
                    className={`pactor-shell-theme-card${active ? ' is-selected' : ''}`}
                    aria-pressed={active}
                    aria-label={text.label}
                    onClick={() => pick(theme.name)}
                  >
                    <div
                      className="pactor-shell-theme-preview"
                      style={{ backgroundColor: theme.color }}
                    >
                      <div className="pactor-shell-theme-preview-window">
                        <span style={{ backgroundColor: theme.color }} />
                        <div><i /><i /><i /></div>
                      </div>
                      {active && (
                        <span className="pactor-shell-theme-selected"><CheckIcon /> 已应用</span>
                      )}
                    </div>
                    <div className="pactor-shell-theme-card-body">
                      <div>
                        <strong>{text.label}</strong>
                        <p>{text.family} · {text.source}</p>
                      </div>
                      <span className="pactor-shell-theme-hex">{theme.color}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

`packages/shell/src/client/index.ts` 末尾追加：

```ts
export { SkinSwitcher } from './SkinSwitcher.js';
export type { SkinSwitcherProps } from './SkinSwitcher.js';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/skin-switcher.test.tsx`
Expected: 4 个测试 PASS

- [ ] **Step 5: typecheck + commit**

```bash
cd packages/shell && pnpm typecheck
git add packages/shell && git commit -m "feat(shell): add SkinSwitcher (theme gallery + appearance mode)"
```

---

### Task 10: PactorShellHost（Pactor DSL 子应用宿主）

**Files:**
- Create: `packages/shell/src/client/PactorShellHost.tsx`
- Modify: `packages/shell/src/client/index.ts`（追加导出）
- Test: `packages/shell/tests/pactor-shell-host.test.tsx`

**Interfaces:**
- Consumes: Task 6 `mergeModuleComponents` / `mergeModuleActions` / `ModuleExtensionBundle`；Task 9 `SkinSwitcher`；`pactor-app` 的 `SitemapApp` / `createHttpHooks` / `PactorHttpHooks`。
- Produces（Task 11 与 Task 15 消费）：
  - `PactorShellHost(props: PactorShellHostProps): JSX.Element`
  - `PactorShellHostProps = { extensions: Record<string, ModuleExtensionBundle>; sitemapSource?: string; pageEndpoint?: (pageId: string) => string; httpAdapter?: PactorHttpHooks; components?: Record<string, unknown>; actions?: Record<string, ActionHandler>; skinSwitcher?: boolean }`
  - 缺省：`sitemapSource: '/api/runtime/bootstrap'`；`pageEndpoint: (id) => '/api/runtime/pages/' + encodeURIComponent(id)`；`httpAdapter: createHttpHooks()`；`skinSwitcher: true`（向 DSL 注册 `SkinSwitcher` 组件，布局 YAML 可 `type: SkinSwitcher` 引用）。
  - 路由：缺省走 `next/navigation` 的 `usePathname` / `useSearchParams` / `useRouter`（`router.push`）。

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/pactor-shell-host.test.tsx`：

```tsx
// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import type { ComponentType } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

const captured = vi.hoisted(() => ({ props: null as Record<string, unknown> | null }));
const pushMock = vi.hoisted(() => vi.fn());

vi.mock('pactor-app', () => ({
  SitemapApp: (props: Record<string, unknown>) => {
    captured.props = props;
    return null;
  },
  createHttpHooks: () => ({ tag: 'default-http' }),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/pactor-app-risk-analysis',
  useSearchParams: () => new URLSearchParams('tab=a'),
  useRouter: () => ({ push: pushMock }),
}));

import { PactorShellHost } from '../src/client/PactorShellHost.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(cleanup);

const Panel: ComponentType = () => null;

describe('PactorShellHost', () => {
  it('默认端点、模块扩展合并与 SkinSwitcher 注册', () => {
    render(<PactorShellHost extensions={{ m1: { components: { Panel } } }} />);
    const props = captured.props!;
    expect(props.sources).toEqual(['/api/runtime/bootstrap']);
    expect((props.pageEndpoint as (id: string) => string)('m1:home')).toBe(
      '/api/runtime/pages/m1%3Ahome',
    );
    expect(props.pathname).toBe('/pactor-app-risk-analysis');
    expect(props.query).toEqual({ tab: 'a' });
    const components = props.components as Record<string, unknown>;
    expect(components.Panel).toBe(Panel);
    expect(components['m1/Panel']).toBe(Panel);
    expect(components.SkinSwitcher).toBeTypeOf('function');
    expect(props.httpAdapter).toEqual({ tag: 'default-http' });
  });

  it('skinSwitcher=false 时不注册 DSL 皮肤组件', () => {
    render(<PactorShellHost extensions={{}} skinSwitcher={false} />);
    const components = captured.props!.components as Record<string, unknown>;
    expect('SkinSwitcher' in components).toBe(false);
  });

  it('navigate 走宿主 router.push；端点可覆盖', () => {
    render(
      <PactorShellHost
        extensions={{}}
        sitemapSource="/api/custom/sitemap"
        pageEndpoint={(id) => `/api/custom/${id}`}
      />,
    );
    const props = captured.props!;
    expect(props.sources).toEqual(['/api/custom/sitemap']);
    expect((props.pageEndpoint as (id: string) => string)('m1:home')).toBe('/api/custom/m1:home');
    (props.navigate as (to: string) => void)('/m1');
    expect(pushMock).toHaveBeenCalledWith('/m1');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/pactor-shell-host.test.tsx`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 写实现**

`packages/shell/src/client/PactorShellHost.tsx`（平移 web-shell `src/runtime/PactorHost.tsx`；模块扩展注册表与端点改为 props，`SkinSwitcher` 自动注册进 DSL 组件表）：

```tsx
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

import { createHttpHooks, SitemapApp } from 'pactor-app';
import type { PactorHttpHooks } from 'pactor-app';
import type { ActionHandler } from '@pactor-app/runtime';

import {
  mergeModuleActions,
  mergeModuleComponents,
  type ModuleExtensionBundle,
} from './register-extensions.js';
import { SkinSwitcher } from './SkinSwitcher.js';

export interface PactorShellHostProps {
  /** 装配生成的模块扩展注册表（宿主从 @generated/pactor/client-registry 导入 moduleExtensions） */
  extensions: Record<string, ModuleExtensionBundle>;
  /** sitemap 源，缺省 /api/runtime/bootstrap */
  sitemapSource?: string;
  /** 懒加载页面端点，缺省 /api/runtime/pages/{globalPageId}（encodeURIComponent 编码） */
  pageEndpoint?: (pageId: string) => string;
  /** HTTP 钩子覆盖；缺省 createHttpHooks()（拆 { code, data, message } 包裹协议） */
  httpAdapter?: PactorHttpHooks;
  /** 追加宿主自定义组件（在模块组件之后合并，同名宿主优先） */
  components?: Record<string, unknown>;
  /** 追加宿主自定义动作（在模块动作之后合并，同名宿主优先） */
  actions?: Record<string, ActionHandler>;
  /** 是否向 DSL 注册 SkinSwitcher 组件（布局 YAML 可以 type: SkinSwitcher 引用），缺省 true */
  skinSwitcher?: boolean;
}

/** 模块级缺省实例：引用稳定，避免 SitemapApp 页面工厂随渲染重建 */
const defaultHttpAdapter = createHttpHooks();
const defaultPageEndpoint = (pageId: string) =>
  `/api/runtime/pages/${encodeURIComponent(pageId)}`;

function PactorShellHostInner(props: PactorShellHostProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const components = useMemo(
    () => ({
      ...(props.skinSwitcher === false ? {} : { SkinSwitcher }),
      ...mergeModuleComponents(props.extensions),
      ...props.components,
    }),
    [props.extensions, props.components, props.skinSwitcher],
  );
  const actions = useMemo(
    () => ({ ...mergeModuleActions(props.extensions), ...props.actions }),
    [props.extensions, props.actions],
  );

  return (
    <SitemapApp
      sources={[props.sitemapSource ?? '/api/runtime/bootstrap']}
      baseUrl=""
      pathname={pathname}
      query={Object.fromEntries(searchParams.entries())}
      navigate={(to: string) => {
        router.push(to);
      }}
      components={components}
      actions={actions}
      httpAdapter={props.httpAdapter ?? defaultHttpAdapter}
      pageEndpoint={props.pageEndpoint ?? defaultPageEndpoint}
    />
  );
}

export function PactorShellHost(props: PactorShellHostProps) {
  return (
    <Suspense fallback={null}>
      <PactorShellHostInner {...props} />
    </Suspense>
  );
}
```

`packages/shell/src/client/index.ts` 末尾追加：

```ts
export { PactorShellHost } from './PactorShellHost.js';
export type { PactorShellHostProps } from './PactorShellHost.js';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/pactor-shell-host.test.tsx`
Expected: 3 个测试 PASS

- [ ] **Step 5: typecheck + commit**

```bash
cd packages/shell && pnpm typecheck
git add packages/shell && git commit -m "feat(shell): add PactorShellHost (SitemapApp host with prop-driven extensions)"
```

---

### Task 11: AppShell 组件 + 外壳样式

**Files:**
- Create: `packages/shell/src/client/AppShell.tsx`
- Create: `packages/shell/styles.css`
- Modify: `packages/shell/src/client/index.ts`（追加导出）
- Test: `packages/shell/tests/app-shell.test.tsx`

**Interfaces:**
- Consumes: Task 9 `SkinSwitcher` / `SkinSwitcherProps`；Task 7 `SHELL_SKIN_STORAGE_KEY` / `SHELL_MODE_STORAGE_KEY`。
- Produces（Task 15 消费）：
  - `AppShell(props: AppShellProps): JSX.Element`
  - `ShellMenuItem = { id: string; title: string; icon?: ReactNode; path: string; order?: number; hidden?: boolean }`（注意：icon 为 ReactNode，与 spec 草案的 string 不同——items 模式面向非 Pactor 宿主，图标由宿主直接渲染；sitemap 模式的菜单图标走 Pactor 既有管线）
  - `SubAppContext = { pathname: string }`
  - `AppShellProps`（逐字段与 spec §2 一致）：
    ```ts
    interface AppShellProps {
      brand?: { title: string; logo?: ReactNode };
      menu?:
        | { mode: 'items'; items: ShellMenuItem[]; activeKey?: string; onSelect?: (item: ShellMenuItem) => void }
        | { mode: 'sitemap' };
      skin?: {
        presets?: ThemeName[];
        default?: ThemeName;
        storageKey?: string;
        modeStorageKey?: string;
        renderSwitcher?: boolean;   // 缺省 true（items 模式渲染在侧栏底部）
        allowDefault?: boolean;
        onChange?: (skin: ThemeName | null) => void;
      };
      layout?: {
        variant?: 'side-fixed' | 'side' | 'top';  // 缺省 side-fixed；top 未实现，显式抛错
        sidebarWidth?: number;
        contentClassName?: string;
        contentStyle?: CSSProperties;
      };
      pages?: Record<string, ComponentType<SubAppContext>>;
      renderSubApp?: (ctx: SubAppContext) => ReactNode;
      headerExtra?: ReactNode;
      sidebarFooter?: ReactNode;
      footer?: ReactNode;
      pathname?: string;   // 缺省 usePathname()
      navigate?: (to: string) => void;  // 缺省 router.push
    }
    ```
  - 行为契约：
    - `menu.mode: 'sitemap'`：不渲染自有 chrome，直接渲染 `renderSubApp({ pathname })`（宿主在其中放 `<PactorShellHost>`，菜单/布局由 Pactor DSL 布局链承担，皮肤入口由 DSL `type: SkinSwitcher` 提供）；未传 renderSubApp → 内建 NotFound。
    - `menu.mode: 'items'`：渲染自有侧栏（brand、按 order 升序的菜单、SkinSwitcher、sidebarFooter）+ 主区（headerExtra / 内容 / footer）；内容按 `pages[pathname]` 精确匹配渲染，未命中再回落 `renderSubApp`，最后 NotFound。
    - activeKey 缺省派生：先精确匹配 `path === pathname`，再取最长前缀匹配（`pathname === path` 或 `pathname.startsWith(path + '/')`）；菜单项点击：先调 `onSelect(item)` 再 `navigate(item.path)`。
    - `layout.variant: 'side'` 提供折叠按钮（切换 `data-collapsed`，CSS 收窄为图标轨）；`'side-fixed'` 无折叠按钮；`'top'` 抛 `Error('[app-shell] layout.variant "top" 尚未实现')`。

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/app-shell.test.tsx`：

```tsx
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const nav = vi.hoisted(() => ({ pathname: '/dashboard', push: vi.fn() }));

vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ push: nav.push }),
}));

// SkinSwitcher 挂 @pactor-app/theme 运行时，本测试不关心皮肤，整体替身
vi.mock('../src/client/SkinSwitcher.js', () => ({
  SkinSwitcher: () => <div data-testid="skin-switcher" />,
}));

import { AppShell, type SubAppContext } from '../src/client/AppShell.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(cleanup);

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

function Page({ pathname }: SubAppContext) {
  return <div>page:{pathname}</div>;
}

describe('AppShell items 模式', () => {
  it('渲染品牌、按 order 排序的菜单、过滤 hidden，并派生高亮', () => {
    render(
      <AppShell
        brand={{ title: 'InnoSpots' }}
        menu={{
          mode: 'items',
          items: [
            { id: 'settings', title: '设置', path: '/settings', order: 2 },
            { id: 'dash', title: '看板', path: '/dashboard', order: 1 },
            { id: 'ghost', title: '隐藏', path: '/ghost', hidden: true },
          ],
        }}
        pages={{ '/dashboard': Page }}
      />,
    );
    expect(screen.getByText('InnoSpots')).toBeTruthy();
    expect(screen.queryByText('隐藏')).toBeNull();
    const buttons = screen.getAllByRole('button').filter((b) => ['看板', '设置'].includes(b.textContent ?? ''));
    expect(buttons.map((b) => b.textContent)).toEqual(['看板', '设置']);
    expect(buttons[0]!.className).toContain('is-active');
    expect(screen.getByText('page:/dashboard')).toBeTruthy();
  });

  it('点击菜单先 onSelect 再 navigate', () => {
    const onSelect = vi.fn();
    render(
      <AppShell
        menu={{ mode: 'items', items: [{ id: 'dash', title: '看板', path: '/dashboard' }], onSelect }}
        pages={{ '/dashboard': Page }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '看板' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'dash' }));
    expect(nav.push).toHaveBeenCalledWith('/dashboard');
  });

  it('skin.renderSwitcher 缺省渲染切换器，false 关闭；插槽渲染', () => {
    const { unmount } = render(
      <AppShell
        menu={{ mode: 'items', items: [] }}
        skin={{}}
        headerExtra={<div>hdr</div>}
        footer={<div>ftr</div>}
        pages={{}}
      />,
    );
    expect(screen.getByTestId('skin-switcher')).toBeTruthy();
    expect(screen.getByText('hdr')).toBeTruthy();
    expect(screen.getByText('ftr')).toBeTruthy();
    unmount();
    render(<AppShell menu={{ mode: 'items', items: [] }} skin={{ renderSwitcher: false }} pages={{}} />);
    expect(screen.queryByTestId('skin-switcher')).toBeNull();
  });

  it('未命中 pages 且无 renderSubApp → NotFound', () => {
    render(<AppShell menu={{ mode: 'items', items: [] }} pages={{}} />);
    expect(screen.getByText(/未找到页面/)).toBeTruthy();
  });

  it('layout.variant "top" 显式抛错', () => {
    expect(() =>
      render(<AppShell menu={{ mode: 'items', items: [] }} layout={{ variant: 'top' }} pages={{}} />),
    ).toThrow(/top.*尚未实现/);
  });

  it('layout.variant "side" 折叠按钮切换 data-collapsed', () => {
    const { container } = render(
      <AppShell menu={{ mode: 'items', items: [] }} layout={{ variant: 'side' }} pages={{}} />,
    );
    const sidebar = container.querySelector('.pactor-shell-sidebar')!;
    expect(sidebar.getAttribute('data-collapsed')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '收起菜单' }));
    expect(sidebar.getAttribute('data-collapsed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '展开菜单' }));
    expect(sidebar.getAttribute('data-collapsed')).toBeNull();
  });
});

describe('AppShell sitemap 模式', () => {
  it('不渲染自有 chrome，直接渲染 renderSubApp', () => {
    render(
      <AppShell
        menu={{ mode: 'sitemap' }}
        brand={{ title: '不应出现' }}
        renderSubApp={({ pathname }) => <div>sub:{pathname}</div>}
      />,
    );
    expect(screen.getByText('sub:/dashboard')).toBeTruthy();
    expect(screen.queryByText('不应出现')).toBeNull();
    expect(document.querySelector('.pactor-shell-sidebar')).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/app-shell.test.tsx`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 写实现**

`packages/shell/src/client/AppShell.tsx`：

```tsx
import { usePathname, useRouter } from 'next/navigation';
import {
  useState,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from 'react';

import type { ThemeName } from '@pactor-app/theme';

import { SkinSwitcher } from './SkinSwitcher.js';

export interface ShellMenuItem {
  id: string;
  title: string;
  /** 图标（ReactNode，由宿主渲染；sitemap 模式的菜单图标走 Pactor 管线） */
  icon?: ReactNode;
  path: string;
  order?: number;
  hidden?: boolean;
}

export interface SubAppContext {
  pathname: string;
}

export interface AppShellProps {
  /** 品牌区 */
  brand?: { title: string; logo?: ReactNode };
  /** 一级菜单：items 直传；sitemap 交给 Pactor sitemap 合并（菜单/布局由 DSL 承担） */
  menu?:
    | {
        mode: 'items';
        items: ShellMenuItem[];
        /** 受控高亮；缺省按 pathname 派生（精确 → 最长前缀） */
        activeKey?: string;
        onSelect?: (item: ShellMenuItem) => void;
      }
    | { mode: 'sitemap' };
  /** 皮肤设置 */
  skin?: {
    /** 可选皮肤名单，缺省主题包全部预置 */
    presets?: ThemeName[];
    /** 无持久化值时的缺省皮肤（应与 SkinHeadScript 的 defaultSkin 一致） */
    default?: ThemeName;
    storageKey?: string;
    modeStorageKey?: string;
    /** items 模式：侧栏底部渲染切换器，缺省 true */
    renderSwitcher?: boolean;
    /** 画廊首卡提供「默认皮肤」（回宿主基础皮肤），缺省 false */
    allowDefault?: boolean;
    onChange?: (skin: ThemeName | null) => void;
  };
  /** 布局样式 */
  layout?: {
    /** side-fixed（缺省，固定侧栏）/ side（可折叠）/ top（未实现，显式抛错） */
    variant?: 'side-fixed' | 'side' | 'top';
    sidebarWidth?: number;
    contentClassName?: string;
    contentStyle?: CSSProperties;
  };
  /** 子应用接入（参数传入，可混用）：path → 纯 React 子应用 */
  pages?: Record<string, ComponentType<SubAppContext>>;
  /** 子应用接入：自定义渲染（如 <PactorShellHost />） */
  renderSubApp?: (ctx: SubAppContext) => ReactNode;
  /** 插槽 */
  headerExtra?: ReactNode;
  sidebarFooter?: ReactNode;
  footer?: ReactNode;
  /** 路由对接：缺省自动使用 next/navigation，一般不用传 */
  pathname?: string;
  navigate?: (to: string) => void;
}

function ShellNotFound({ pathname }: { pathname: string }) {
  return (
    <div className="pactor-shell-notfound">
      <strong>未找到页面</strong>
      <p>{pathname}</p>
    </div>
  );
}

/** 高亮派生：精确匹配优先，否则取最长前缀匹配的菜单项 */
function deriveActiveKey(items: ShellMenuItem[], pathname: string): string | undefined {
  const exact = items.find((item) => item.path === pathname);
  if (exact) return exact.id;
  let best: ShellMenuItem | undefined;
  for (const item of items) {
    if (item.path !== '/' && pathname.startsWith(`${item.path}/`)) {
      if (best === undefined || item.path.length > best.path.length) best = item;
    }
  }
  return best?.id;
}

export function AppShell(props: AppShellProps) {
  const detectedPathname = usePathname();
  const router = useRouter();
  const pathname = props.pathname ?? detectedPathname;
  const navigate = props.navigate ?? ((to: string) => router.push(to));

  const variant = props.layout?.variant ?? 'side-fixed';
  if (variant === 'top') {
    throw new Error('[app-shell] layout.variant "top" 尚未实现');
  }

  const [collapsed, setCollapsed] = useState(false);

  // sitemap 模式：菜单/布局由 Pactor DSL 布局链承担，外壳只提供子应用出口
  if (props.menu?.mode === 'sitemap') {
    return (
      <div className="pactor-shell-root">
        {props.renderSubApp?.({ pathname }) ?? <ShellNotFound pathname={pathname} />}
      </div>
    );
  }

  const menu = props.menu;
  const items = (menu?.mode === 'items' ? menu.items : [])
    .filter((item) => !item.hidden)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const activeKey =
    menu?.mode === 'items' && menu.activeKey !== undefined
      ? menu.activeKey
      : deriveActiveKey(items, pathname);

  const handleSelect = (item: ShellMenuItem) => {
    if (menu?.mode !== 'items') return;
    menu.onSelect?.(item);
    navigate(item.path);
  };

  const Page = props.pages?.[pathname];
  const outlet = Page ? (
    <Page pathname={pathname} />
  ) : (
    props.renderSubApp?.({ pathname }) ?? <ShellNotFound pathname={pathname} />
  );

  const skin = props.skin;

  return (
    <div className="pactor-shell-root">
      <aside
        className="pactor-shell-sidebar"
        data-collapsed={collapsed || undefined}
        style={
          props.layout?.sidebarWidth !== undefined && !collapsed
            ? { width: props.layout.sidebarWidth, flexBasis: props.layout.sidebarWidth }
            : undefined
        }
      >
        {props.brand && (
          <div className="pactor-shell-brand">
            {props.brand.logo}
            <span className="pactor-shell-menu-label">{props.brand.title}</span>
          </div>
        )}
        <nav className="pactor-shell-menu" aria-label="一级菜单">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`pactor-shell-menu-item${item.id === activeKey ? ' is-active' : ''}`}
              onClick={() => handleSelect(item)}
            >
              {item.icon}
              <span className="pactor-shell-menu-label">{item.title}</span>
            </button>
          ))}
        </nav>
        <div className="pactor-shell-sidebar-footer">
          {skin !== undefined && skin.renderSwitcher !== false && (
            <SkinSwitcher
              skins={skin.presets}
              defaultSkin={skin.default}
              allowDefault={skin.allowDefault}
              storageKey={skin.storageKey}
              modeStorageKey={skin.modeStorageKey}
              onChange={skin.onChange}
            />
          )}
          {props.sidebarFooter}
        </div>
        {variant === 'side' && (
          <button
            type="button"
            className="pactor-shell-collapse"
            aria-label={collapsed ? '展开菜单' : '收起菜单'}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '»' : '«'}
          </button>
        )}
      </aside>
      <div className="pactor-shell-main">
        {props.headerExtra !== undefined && props.headerExtra !== null && (
          <header className="pactor-shell-header">{props.headerExtra}</header>
        )}
        <div
          className={`pactor-shell-content${props.layout?.contentClassName ? ` ${props.layout.contentClassName}` : ''}`}
          style={props.layout?.contentStyle}
        >
          {outlet}
        </div>
        {props.footer !== undefined && props.footer !== null && (
          <footer className="pactor-shell-footer">{props.footer}</footer>
        )}
      </div>
    </div>
  );
}
```

`packages/shell/styles.css`（纯 CSS，消费方零构建配置；全部读皮肤令牌并带回退值）：

```css
/* @pactor-app/shell 外壳样式：AppShell chrome（items 模式）+ SkinSwitcher。
   令牌优先读皮肤变量（--background/--card/--accent/--menu-* 等），缺省有回退值，
   未加载任何皮肤时也可独立工作。 */

.pactor-shell-root {
  display: flex;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: var(--background, #f8f9fa);
  color: var(--foreground, #171717);
}

.pactor-shell-sidebar {
  position: relative;
  display: flex;
  width: var(--sidebar-width, 16rem);
  flex: none;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--sidebar-border, var(--border, #e5e7eb));
  background: var(--sidebar, var(--card, #fff));
  color: var(--sidebar-foreground, var(--card-foreground, inherit));
}

.pactor-shell-sidebar[data-collapsed] {
  width: 3.5rem;
  flex-basis: 3.5rem;
}

.pactor-shell-sidebar[data-collapsed] .pactor-shell-menu-label,
.pactor-shell-sidebar[data-collapsed] .pactor-shell-skin-label {
  display: none;
}

.pactor-shell-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-size: 15px;
  font-weight: 650;
}

.pactor-shell-menu {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  padding: 8px 12px;
  overflow-y: auto;
}

.pactor-shell-menu-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 0;
  border-radius: var(--radius, 10px);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: var(--pactor-control-text-md, 14px);
  text-align: left;
}

.pactor-shell-menu-item:hover {
  background: var(--menu-hover-background, var(--accent, #f1f5f9));
  color: var(--menu-hover-foreground, var(--accent-foreground, inherit));
}

.pactor-shell-menu-item.is-active {
  background: var(--menu-active-background, var(--accent, #e2e8f0));
  color: var(--menu-active-foreground, var(--accent-foreground, inherit));
  font-weight: 600;
}

.pactor-shell-menu-item:focus-visible,
.pactor-shell-collapse:focus-visible,
.pactor-shell-skin-trigger:focus-visible {
  outline: 2px solid var(--ring, #94a3b8);
  outline-offset: 2px;
}

.pactor-shell-sidebar-footer {
  display: grid;
  gap: 4px;
  padding: 8px 12px;
  border-top: 1px solid var(--sidebar-border, var(--border, #e5e7eb));
}

.pactor-shell-collapse {
  position: absolute;
  top: 14px;
  right: -12px;
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 50%;
  background: var(--card, #fff);
  color: var(--muted-foreground, #6b7280);
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
}

.pactor-shell-main {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  flex-direction: column;
}

.pactor-shell-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border, #e5e7eb);
  background: var(--card, #fff);
}

.pactor-shell-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.pactor-shell-footer {
  padding: 8px 20px;
  border-top: 1px solid var(--border, #e5e7eb);
  color: var(--muted-foreground, #6b7280);
  font-size: 12px;
}

.pactor-shell-notfound {
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--muted-foreground, #6b7280);
}

/* ---- SkinSwitcher ---- */

.pactor-shell-skin {
  position: relative;
}

.pactor-shell-skin-trigger {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 0;
  border-radius: var(--radius, 10px);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  text-align: left;
}

.pactor-shell-skin-trigger:hover {
  background: var(--menu-hover-background, var(--accent, #f1f5f9));
}

.pactor-shell-skin-trigger > svg {
  flex: none;
  color: var(--muted-foreground, #6b7280);
}

.pactor-shell-skin-popover {
  position: absolute;
  z-index: 100;
  bottom: calc(100% + 8px);
  left: 0;
  width: min(560px, calc(100vw - 48px));
  max-height: calc(100dvh - 24px);
  overflow-y: auto;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 14px;
  background: var(--popover, var(--card, #fff));
  color: var(--popover-foreground, var(--card-foreground, inherit));
  box-shadow: 0 12px 40px rgb(0 0 0 / 20%);
}

.pactor-shell-skin-section {
  padding: 14px 16px;
}

.pactor-shell-skin-section + .pactor-shell-skin-section {
  border-top: 1px solid var(--border, #e5e7eb);
}

.pactor-shell-skin-heading {
  margin-bottom: 10px;
  color: var(--muted-foreground, #6b7280);
  font-size: 12px;
  font-weight: 600;
}

.pactor-shell-mode {
  display: flex;
  gap: 2px;
  padding: 3px;
  border-radius: 8px;
  background: var(--muted, #f1f5f9);
}

.pactor-shell-mode button {
  display: grid;
  min-width: 0;
  height: 28px;
  flex: 1;
  place-items: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted-foreground, #6b7280);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
}

.pactor-shell-mode button[aria-pressed='true'] {
  background: var(--card, #fff);
  color: var(--foreground, #171717);
  box-shadow: 0 1px 4px rgb(0 0 0 / 13%);
}

/* 皮肤画廊（移植自 next-app-starter theme-grid/theme-card，前缀改为 pactor-shell-） */

.pactor-shell-theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 180px), 1fr));
  gap: 12px;
}

.pactor-shell-theme-card {
  display: block;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  background: var(--card, #fff);
  color: var(--card-foreground, inherit);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.pactor-shell-theme-card:hover {
  box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
  transform: translateY(-2px);
}

.pactor-shell-theme-card.is-selected {
  border-color: var(--primary, #536b7f);
  box-shadow: 0 0 0 1px var(--primary, #536b7f);
}

.pactor-shell-theme-preview {
  position: relative;
  height: 96px;
  padding: 20px 24px 0;
  overflow: hidden;
}

.pactor-shell-theme-preview-window {
  display: flex;
  height: 86px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  background: #fff;
  box-shadow: 0 8px 24px rgb(0 0 0 / 13%);
}

.pactor-shell-theme-preview-window > span {
  width: 24%;
  opacity: 0.85;
}

.pactor-shell-theme-preview-window > div {
  flex: 1;
  padding: 13px 10px;
}

.pactor-shell-theme-preview-window i {
  display: block;
  width: 78%;
  height: 6px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: #e8eaed;
}

.pactor-shell-theme-preview-window i:nth-child(2) {
  width: 55%;
}

.pactor-shell-theme-preview-window i:nth-child(3) {
  width: 90%;
  height: 22px;
  background: #f2f3f5;
}

.pactor-shell-theme-selected {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 20px;
  background: #fff;
  color: #25282b;
  font-size: 11px;
  font-weight: 600;
}

.pactor-shell-theme-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px;
}

.pactor-shell-theme-card-body strong {
  font-size: 13px;
  font-weight: 650;
}

.pactor-shell-theme-card-body p {
  margin: 4px 0 0;
  color: var(--muted-foreground, #6b7280);
  font-size: 11px;
}

.pactor-shell-theme-hex {
  margin: 0;
  color: var(--muted-foreground, #6b7280);
  font-family: monospace;
  font-size: 11px;
}

@media (prefers-reduced-motion: reduce) {
  .pactor-shell-theme-card {
    transition: none;
  }
}
```

`packages/shell/src/client/index.ts` 末尾追加：

```ts
export { AppShell } from './AppShell.js';
export type { AppShellProps, ShellMenuItem, SubAppContext } from './AppShell.js';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/app-shell.test.tsx`
Expected: 7 个测试 PASS

- [ ] **Step 5: typecheck + 构建 + commit**

Run: `cd packages/shell && pnpm typecheck && pnpm build`
Expected: 无错误；`dist/client/index.js` 首行 `"use client";`，包根 `styles.css` 经 `exports["./styles.css"]` 可引用

```bash
git add packages/shell && git commit -m "feat(shell): add AppShell container component and shell styles"
```

---

### Task 12: 装配库函数（assemble）

**Files:**
- Create: `packages/shell/src/assemble/assemble.ts`（移植 `starters/apps-shell-starter/web-shell/scripts/assemble-modules.mjs`）
- Test: `packages/shell/tests/helpers.ts`、`packages/shell/tests/assemble.test.ts`

**Interfaces:**
- Consumes: Task 2 的类型（`ModuleListFile` / `ModuleManifestV1` / `AssemblyRoute` / `AssemblyModule` / `PageIndexEntry` / `SitemapMetaFile`）。
- Produces（Task 14 CLI 与 Task 15 消费）：
  ```ts
  interface AssembleOptions {
    rootDir?: string;          // 宿主工程根，缺省 process.cwd()
    moduleListPath?: string;   // 缺省 <rootDir>/src/modules/module-list.json
    shellSiteDir?: string;     // 缺省 <rootDir>/src/shell
    generatedDir?: string;     // 缺省 <rootDir>/.generated/pactor
    publicModulesDir?: string; // 缺省 <rootDir>/public/modules
  }
  interface AssembleSummary { modules: number; routes: number; serverApis: number; generatedDir: string }
  function assembleModules(options?: AssembleOptions): AssembleSummary
  ```
  - 生成的 `client-registry.ts` 类型 import 为 `@pactor-app/shell/client`；`server-registry.ts` 为 `@pactor-app/shell/server`（与原 `@/runtime/register-extensions` / `@/server/modules/types` 不同，这是本次平移的唯一语义变化）。
  - 失败即抛错（DSL 缺失 / URL 碰撞 / manifest 不合法等原语义不变），不 `process.exit`（退出码由 CLI 负责）。

- [ ] **Step 1: 写测试 fixture 助手与失败测试**

`packages/shell/tests/helpers.ts`：

```ts
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** 最小宿主工程：一个启用的 UI 模块 fixture-mod + Shell 自带站点。 */
export function createFixtureHost(): string {
  const root = mkdtempSync(join(tmpdir(), 'shell-assemble-'));

  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: 'fixture-host', version: '0.0.0', type: 'module' }),
  );

  mkdirSync(join(root, 'src/modules'), { recursive: true });
  writeFileSync(
    join(root, 'src/modules/module-list.json'),
    JSON.stringify({ modules: [{ package: 'fixture-mod', enabled: true }] }),
  );

  mkdirSync(join(root, 'src/shell/layouts'), { recursive: true });
  writeFileSync(
    join(root, 'src/shell/sitemap.yaml'),
    [
      'id: shell',
      'resourceType: sitemap',
      'version: 1',
      'dslVersion: "1.0"',
      'app: { name: FixtureShell }',
      'auth: { loginPath: /login }',
      'layout: shell',
      'menus:',
      '  - { id: home, type: page, pageId: "fixture:home", path: /fixture, title: 首页, order: 1, public: true }',
      'layouts:',
      '  shell: layouts/shell.layout.yaml',
      '',
    ].join('\n'),
  );
  writeFileSync(
    join(root, 'src/shell/layouts/shell.layout.yaml'),
    ['dsl: "1.0"', 'body:', '  type: Layout', '  children:', '    - type: PageOutlet', ''].join('\n'),
  );

  const pkg = join(root, 'node_modules/fixture-mod');
  mkdirSync(join(pkg, 'dist-module/dsl'), { recursive: true });
  mkdirSync(join(pkg, 'dist-module/assets'), { recursive: true });
  mkdirSync(join(pkg, 'dist-module/client'), { recursive: true });
  writeFileSync(
    join(pkg, 'package.json'),
    JSON.stringify({
      name: 'fixture-mod',
      version: '0.1.0',
      type: 'module',
      exports: {
        './manifest': './dist-module/manifest.json',
        './client': './dist-module/client/index.js',
      },
    }),
  );
  writeFileSync(
    join(pkg, 'dist-module/manifest.json'),
    JSON.stringify({
      schemaVersion: '1',
      id: 'fixture',
      name: 'Fixture',
      version: '0.1.0',
      pactorVersionRange: '>=1.55.0',
      basePath: '/fixture',
      sitemap: 'dsl/sitemap.yaml',
      dslRoot: 'dsl',
      assetsRoot: 'assets',
      clientEntry: './client/index.js',
    }),
  );
  writeFileSync(
    join(pkg, 'dist-module/dsl/sitemap.yaml'),
    [
      'id: fixture',
      'resourceType: sitemap',
      'version: 1',
      'dslVersion: "1.0"',
      'pages:',
      '  - { id: home, path: /, title: 首页, public: true }',
      'menus: []',
      '',
    ].join('\n'),
  );
  writeFileSync(
    join(pkg, 'dist-module/dsl/home.yaml'),
    'dsl: "1.0"\npage: { id: home, title: 首页 }\nbody: { type: Text, props: { content: hello } }\n',
  );
  writeFileSync(join(pkg, 'dist-module/assets/logo.txt'), 'fixture');
  writeFileSync(join(pkg, 'dist-module/client/index.js'), 'export const extensions = {};\n');

  return root;
}
```

`packages/shell/tests/assemble.test.ts`：

```ts
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { assembleModules } from '../src/assemble/assemble.js';

import { createFixtureHost } from './helpers.js';

describe('assembleModules', () => {
  it('装配 fixture 模块：索引、DSL 复制、静态资源、注册表', () => {
    const rootDir = createFixtureHost();
    const summary = assembleModules({ rootDir });

    expect(summary).toMatchObject({ modules: 1, routes: 1, serverApis: 0 });

    const generated = join(rootDir, '.generated/pactor');
    const pages = JSON.parse(readFileSync(join(generated, 'pages.json'), 'utf8'));
    expect(pages.pages).toHaveLength(1);
    expect(pages.pages[0]).toMatchObject({
      globalPageId: 'fixture:home',
      path: '/fixture',
      public: true,
      dslRef: 'dsl/fixture/home.yaml',
    });

    // DSL 落盘与静态资源版本化
    expect(existsSync(join(generated, 'dsl/fixture/home.yaml'))).toBe(true);
    expect(existsSync(join(rootDir, 'public/modules/fixture/0.1.0/logo.txt'))).toBe(true);

    // Shell 自带站点提供默认布局与固定菜单（pageId 已是全局 id，不再加前缀）
    const meta = JSON.parse(readFileSync(join(generated, 'sitemap-meta.json'), 'utf8'));
    expect(meta.layout).toBe('shell');
    expect(meta.layouts.shell.body.type).toBe('Layout');
    const menus = JSON.parse(readFileSync(join(generated, 'menus.json'), 'utf8'));
    expect(menus.menus[0]).toMatchObject({ id: 'home', pageId: 'fixture:home' });

    // 注册表引用包内类型出口
    const clientRegistry = readFileSync(join(generated, 'client-registry.ts'), 'utf8');
    expect(clientRegistry).toContain('from "fixture-mod/client"');
    expect(clientRegistry).toContain('@pactor-app/shell/client');
    const serverRegistry = readFileSync(join(generated, 'server-registry.ts'), 'utf8');
    expect(serverRegistry).toContain('@pactor-app/shell/server');
    expect(serverRegistry).toContain('moduleServers');
    expect(existsSync(join(generated, 'module-styles.ts'))).toBe(true);
    expect(JSON.parse(readFileSync(join(generated, 'servers.json'), 'utf8')).modules).toEqual([]);
  });

  it('页面 DSL 缺失时抛错（失败即阻断）', () => {
    const rootDir = createFixtureHost();
    // 追加一个无 DSL 文件的页面
    const sitemapPath = join(rootDir, 'node_modules/fixture-mod/dist-module/dsl/sitemap.yaml');
    const content = readFileSync(sitemapPath, 'utf8');
    writeFileSync(sitemapPath, content.replace('menus: []', '  - { id: missing, path: /missing, title: 缺失 }\nmenus: []'));

    expect(() => assembleModules({ rootDir })).toThrow(/缺少 DSL 文件/);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/assemble.test.ts`
Expected: FAIL（`../src/assemble/assemble.js` 不存在）

- [ ] **Step 3: 移植 assemble-modules.mjs → assemble.ts**

把 `starters/apps-shell-starter/web-shell/scripts/assemble-modules.mjs` 全文复制为 `packages/shell/src/assemble/assemble.ts`，然后按以下清单改造（逻辑逐行保留，只动路径来源、类型与出口）：

**3a. 文件头替换**：删除 shebang 与原注释头，替换为：

```ts
/**
 * 构建期装配：读取 module-list.json → 解析各 UI npm 包 Manifest →
 * 合并路由/菜单/页面索引 → 复制静态资源 → 生成 .generated/pactor/*
 * （移植自 web-shell scripts/assemble-modules.mjs，路径改为参数化。）
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, normalize, relative, resolve } from 'node:path';

import { parseDocument } from 'yaml';

import type {
  AssemblyModule,
  AssemblyRoute,
  ModuleListEntry,
  ModuleListFile,
  ModuleManifestV1,
  PageIndexEntry,
  SitemapMetaFile,
} from '../server/types.js';

const require = createRequire(import.meta.url);
```

（删除原文件的 `fileURLToPath` import、`__dirname` / `ROOT` / `GENERATED` / `MODULE_LIST` / `PUBLIC_MODULES` / `BASE_SITE_DIR` 常量。）

**3b. 配置解析**：在 import 之后加入：

```ts
export interface AssembleOptions {
  /** 宿主工程根，缺省 process.cwd() */
  rootDir?: string;
  /** 缺省 <rootDir>/src/modules/module-list.json */
  moduleListPath?: string;
  /** Shell 自带站点目录，缺省 <rootDir>/src/shell */
  shellSiteDir?: string;
  /** 装配产物目录，缺省 <rootDir>/.generated/pactor */
  generatedDir?: string;
  /** 模块静态资源输出，缺省 <rootDir>/public/modules */
  publicModulesDir?: string;
}

export interface AssembleSummary {
  modules: number;
  routes: number;
  serverApis: number;
  generatedDir: string;
}

interface AssembleConfig {
  rootDir: string;
  moduleListPath: string;
  shellSiteDir: string;
  generatedDir: string;
  publicModulesDir: string;
}

/** 单进程 CLI 语义：配置在 assembleModules() 入口解析，helper 经模块级 cfg 读取。 */
let cfg: AssembleConfig;

function resolveConfig(options: AssembleOptions): AssembleConfig {
  const rootDir = options.rootDir ?? process.cwd();
  return {
    rootDir,
    moduleListPath: options.moduleListPath ?? join(rootDir, 'src/modules/module-list.json'),
    shellSiteDir: options.shellSiteDir ?? join(rootDir, 'src/shell'),
    generatedDir: options.generatedDir ?? join(rootDir, '.generated/pactor'),
    publicModulesDir: options.publicModulesDir ?? join(rootDir, 'public/modules'),
  };
}
```

**3c. 常量引用替换**（全文精确替换，可用编辑器全局替换）：

| 原引用 | 替换为 |
| --- | --- |
| `GENERATED` | `cfg.generatedDir` |
| `MODULE_LIST` | `cfg.moduleListPath` |
| `PUBLIC_MODULES` | `cfg.publicModulesDir` |
| `BASE_SITE_DIR` | `cfg.shellSiteDir` |
| `{ paths: [ROOT] }` | `{ paths: [cfg.rootDir] }` |
| `relative(ROOT, GENERATED)` | （删除，见 3g 返回值） |

**3d. 类型签名**（逻辑不变，只加注解；内部结构性类型别名如下，放在 `resolveConfig` 之后）：

```ts
type SiteMenuItem = Record<string, any> & { children?: SiteMenuItem[] };
type SitePage = Record<string, any> & { id: string; path: string };
type SiteSitemap = {
  auth?: { loginPath?: string };
  layout?: string;
  dslVersion?: string;
  app?: { name: string };
  pages?: SitePage[];
  menus?: SiteMenuItem[];
  layouts?: Record<string, unknown>;
};
interface ModuleServerMeta {
  moduleId: string;
  package: string;
  prefixes: string[];
}
interface RegistryModule {
  module: AssemblyModule;
  clientSpecifier: string;
  clientEntry?: string;
  styles?: string[];
}
interface AssembledModule {
  module: AssemblyModule;
  routes: AssemblyRoute[];
  pages: PageIndexEntry[];
  menus: SiteMenuItem[];
  sitemapMeta: SitemapMetaFile;
  layouts: Record<string, unknown>;
  dslCopies: { from: string; to: string; rel: string }[];
  clientEntry?: string;
  styles?: string[];
  server: ModuleServerMeta | null;
}
```

各函数签名改为：

```ts
function readJson(path: string): any
function writeJson(path: string, data: unknown): void
function loadYamlFile(path: string): any
function normalizeBasePath(basePath: string): string
function joinPublicPath(basePath: string, modulePath: string): string
function pathPattern(modulePath: string): { pattern: string; paramNames: string[] }
function resolveManifestPath(packageName: string): string | null
function resolveServerPath(packageName: string): string | null
function validateApiPrefixes(prefixes: unknown, moduleId: string): asserts prefixes is string[]
function resolveModuleServer(packageName: string, manifest: ModuleManifestV1, manifestDir: string, moduleId: string): ModuleServerMeta | null
function packageRootFromManifest(manifestPath: string): string
function assertInsideRoot(root: string, target: string): void
function namespaceMenus(menus: SiteMenuItem[] | undefined, moduleId: string): SiteMenuItem[]
function applyPublicAccess(items: SiteMenuItem[], entry: ModuleListEntry): SiteMenuItem[]
function transformModuleMenus(menus: SiteMenuItem[] | undefined, moduleId: string, entry: ModuleListEntry): SiteMenuItem[]
function buildSitemapMeta(site: SiteSitemap, basePath: string, layouts: Record<string, unknown>): SitemapMetaFile
function resolveSiteLayouts(site: SiteSitemap, manifestDir: string): Record<string, unknown>
function findPageDslFile(dslRoot: string, pageId: string): string | null
function assembleModule(entry: ModuleListEntry, manifest: ModuleManifestV1, manifestDir: string): AssembledModule
function assembleBaseSite(): AssembledModule | null
function generateClientRegistry(registryModules: RegistryModule[]): void
function generateModuleStyles(registryModules: RegistryModule[]): void
function generateServerRegistry(serverModules: ModuleServerMeta[]): void
```

注意点：
- `resolveModuleServer` 内 `manifest.serverEntry` / `manifest.apiPrefixes` 直接来自 `ModuleManifestV1` 类型；`validateApiPrefixes` 改为断言签名后，`apiPrefixes` 局部变量保持 `string[] | undefined` 推断即可。
- `assembleBaseSite` 中的字面值 manifest 需 `as ModuleManifestV1`（缺 `assetsRoot`）；entry 参数补 `enabled: true`：
  ```ts
  return assembleModule(
    { package: '@innospots/shell-site', enabled: true, basePath: '/' },
    manifest,
    cfg.shellSiteDir,
  );
  ```
- `assembleModule` 的 `entry` 参数现在是 `ModuleListEntry`：`entry.basePath` / `entry.menuMode` / `entry.access` 均为可选，逻辑与原 JS 一致（`entry.basePath ?? manifest.basePath`）。
- `assembleModule` 返回对象中 `module` 字段：`package: entry.package` 保持。
- `pages.push({...})` 对象字面量与 `PageIndexEntry` 对齐；`public: page.public ?? (entry.access === 'public' ? true : undefined)` 保留。

**3e. `generateClientRegistry` 的类型 import 行**改为（这是平移的关键语义变化）：

```ts
  const body = `${imports.join('\n')}

import type { ModuleExtensionBundle } from "@pactor-app/shell/client";

export const moduleExtensions: Record<string, ModuleExtensionBundle> = {
${entries.join('\n')}
};
`;
  writeFileSync(join(cfg.generatedDir, 'client-registry.ts'), body, 'utf8');
```

**3f. `generateServerRegistry` 的类型 import**改为：

```ts
  const typeImport =
    entries.length > 0
      ? `import type {
  ModuleApiHandlers,
  ModuleServerRegistry,
} from "@pactor-app/shell/server";`
      : `import type { ModuleServerRegistry } from "@pactor-app/shell/server";`;
```

**3g. `main()` → `assembleModules()`**：把原 `main()` 函数体重命名为导出函数并参数化：

```ts
export function assembleModules(options: AssembleOptions = {}): AssembleSummary {
  cfg = resolveConfig(options);
  rmSync(cfg.generatedDir, { recursive: true, force: true });
  mkdirSync(cfg.generatedDir, { recursive: true });
  mkdirSync(cfg.publicModulesDir, { recursive: true });

  const list = readJson(cfg.moduleListPath) as ModuleListFile;
  const enabled = (list.modules ?? []).filter((m) => m.enabled);

  // ……原 main() 其余逻辑逐行保留（常量引用按 3c 已替换）……

  return {
    modules: assemblyModules.length,
    routes: allRoutes.length,
    serverApis: serverModules.length,
    generatedDir: relative(cfg.rootDir, cfg.generatedDir),
  };
}
```

删除文件末尾的 `main();` 调用与 `console.log('[assemble] ...')`（日志由 CLI 打印）。

**3h. 内部数组类型**：`const assemblyModules: AssemblyModule[] = []`、`const allRoutes: AssemblyRoute[] = []`、`const allPages: PageIndexEntry[] = []`、`const allMenus: SiteMenuItem[] = []`、`const registryModules: RegistryModule[] = []`、`const serverModules: ModuleServerMeta[] = []`、`const moduleLayouts: Record<string, unknown> = {}`、`let sitemapMeta: SitemapMetaFile | null = null`、`let baseLayouts: Record<string, unknown> = {}`。

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/assemble.test.ts`
Expected: 2 个测试 PASS

- [ ] **Step 5: typecheck + commit**

Run: `cd packages/shell && pnpm typecheck`

```bash
git add packages/shell && git commit -m "feat(shell): port assemble-modules as assembleModules library function"
```

---

### Task 13: 校验库函数（validate）

**Files:**
- Create: `packages/shell/src/assemble/validate.ts`（移植 `starters/apps-shell-starter/web-shell/scripts/validate-modules.mjs`）
- Test: `packages/shell/tests/validate.test.ts`

**Interfaces:**
- Produces（Task 14 CLI 与 Task 15 消费）：
  ```ts
  interface ValidateOptions { rootDir?: string; generatedDir?: string }
  interface ValidateSummary { routes: number; pages: number; menus: number; serverApis: number }
  function validateModules(options?: ValidateOptions): ValidateSummary
  ```
  缺省：`rootDir: process.cwd()`，`generatedDir: <rootDir>/.generated/pactor`。校验失败抛错（路由 URL 冲突 / globalPageId 重复 / 菜单 pageId 悬空 / apiPrefixes 非法 / DSL 残留未改写 URL），不 `process.exit`。

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/validate.test.ts`：

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { assembleModules } from '../src/assemble/assemble.js';
import { validateModules } from '../src/assemble/validate.js';

import { createFixtureHost } from './helpers.js';

function assembledHost(): string {
  const rootDir = createFixtureHost();
  assembleModules({ rootDir });
  return rootDir;
}

describe('validateModules', () => {
  it('合法装配通过并返回计数', () => {
    const rootDir = assembledHost();
    expect(validateModules({ rootDir })).toEqual({
      routes: 1,
      pages: 1,
      menus: 1,
      serverApis: 0,
    });
  });

  it('路由 URL 冲突抛错', () => {
    const rootDir = assembledHost();
    const assemblyPath = join(rootDir, '.generated/pactor/assembly.json');
    const assembly = JSON.parse(readFileSync(assemblyPath, 'utf8'));
    assembly.routes.push({ ...assembly.routes[0], globalPageId: 'other:home' });
    writeFileSync(assemblyPath, JSON.stringify(assembly));

    expect(() => validateModules({ rootDir })).toThrow(/路由 URL 冲突/);
  });

  it('菜单引用不存在的 pageId 抛错', () => {
    const rootDir = assembledHost();
    const menusPath = join(rootDir, '.generated/pactor/menus.json');
    writeFileSync(
      menusPath,
      JSON.stringify({ menus: [{ id: 'ghost', type: 'page', pageId: 'fixture:nope' }] }),
    );

    expect(() => validateModules({ rootDir })).toThrow(/引用了不存在的页面/);
  });

  it('globalPageId 重复抛错', () => {
    const rootDir = assembledHost();
    const pagesPath = join(rootDir, '.generated/pactor/pages.json');
    const pages = JSON.parse(readFileSync(pagesPath, 'utf8'));
    pages.pages.push({ ...pages.pages[0] });
    writeFileSync(pagesPath, JSON.stringify(pages));

    expect(() => validateModules({ rootDir })).toThrow(/globalPageId 重复/);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/validate.test.ts`
Expected: FAIL（`../src/assemble/validate.js` 不存在）

- [ ] **Step 3: 移植 validate-modules.mjs → validate.ts**

复制原文件后按以下清单改造：

**3a. 文件头**：

```ts
/**
 * 装配产物校验：路由 URL / globalPageId 唯一性、菜单 pageId 引用、
 * 模块 API 前缀与 DSL 残留（移植自 web-shell scripts/validate-modules.mjs）。
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { parseDocument } from 'yaml';

import type { ServersIndexFile } from '../server/types.js';

const require = createRequire(import.meta.url);

export interface ValidateOptions {
  rootDir?: string;
  generatedDir?: string;
}

export interface ValidateSummary {
  routes: number;
  pages: number;
  menus: number;
  serverApis: number;
}

interface ValidateConfig {
  rootDir: string;
  generatedDir: string;
}

let cfg: ValidateConfig;

function resolveConfig(options: ValidateOptions): ValidateConfig {
  const rootDir = options.rootDir ?? process.cwd();
  return {
    rootDir,
    generatedDir: options.generatedDir ?? join(rootDir, '.generated/pactor'),
  };
}
```

（删除原 `fileURLToPath` / `__dirname` / `ROOT` / `GENERATED`。）

**3b. 常量引用替换**：

| 原引用 | 替换为 |
| --- | --- |
| `GENERATED` | `cfg.generatedDir` |
| `{ paths: [ROOT] }` | `{ paths: [cfg.rootDir] }` |

**3c. 类型签名**：

```ts
function readJson(path: string): any
function matchesPrefix(value: string, prefix: string): boolean
function collectStrings(value: unknown, visit: (value: string) => void): void
function listYamlFiles(dir: string): string[]
function validateModuleServers(): number
export function validateModules(options?: ValidateOptions): ValidateSummary
```

`validateModuleServers` 内 `readJson(serversPath).modules` 标注为 `ServersIndexFile['modules']`；`main()` 改为：

```ts
export function validateModules(options: ValidateOptions = {}): ValidateSummary {
  cfg = resolveConfig(options);

  // ……原 main() 逻辑逐行保留……

  const serverCount = validateModuleServers();

  return {
    routes: routes.length,
    pages: pages.length,
    menus: menus.length,
    serverApis: serverCount,
  };
}
```

删除末尾 `main();` 与 `console.log('[validate] ...')`。

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/validate.test.ts`
Expected: 4 个测试 PASS

- [ ] **Step 5: typecheck + commit**

```bash
cd packages/shell && pnpm typecheck
git add packages/shell && git commit -m "feat(shell): port validate-modules as validateModules library function"
```

---

### Task 14: 皮肤 CSS 同步 + CLI（`pactor-shell`）

**Files:**
- Create: `packages/shell/src/skin/sync-themes.ts`（移植 `starters/next-app-starter/scripts/sync-theme-css.mjs`）
- Overwrite: `packages/shell/src/bin/cli.ts`（替换 Task 1 占位）
- Test: `packages/shell/tests/sync-themes.test.ts`

**Interfaces:**
- Consumes: Task 12 `assembleModules`、Task 13 `validateModules`。
- Produces：
  ```ts
  interface SyncThemesOptions {
    appRoot?: string;    // 宿主工程根，缺省 process.cwd()
    outputDir?: string;  // 缺省 <appRoot>/public/themes
    checkOnly?: boolean;
  }
  interface SyncThemesResult { synced: number; stale: string[] }
  function syncThemes(options?: SyncThemesOptions): SyncThemesResult
  ```
  - 主题包定位：`createRequire(import.meta.url).resolve('@pactor-app/theme/themes.json')`（`@pactor-app/theme` 是 shell 的 dependencies，pnpm 下从包内解析不受宿主依赖清单影响）。
  - `checkOnly: true` 且存在漂移 → 抛错（信息含过期文件清单）；否则写盘并清理孤儿文件。
  - CLI：`pactor-shell assemble | validate | theme sync | theme check`，缺省 `rootDir/appRoot = process.cwd()`；成功打印与原脚本一致的摘要行；失败 `console.error` + `process.exit(1)`。

- [ ] **Step 1: 写失败测试**

`packages/shell/tests/sync-themes.test.ts`：

```ts
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { syncThemes } from '../src/skin/sync-themes.js';

describe('syncThemes', () => {
  it('同步主题包全部皮肤到 public/themes', () => {
    const appRoot = mkdtempSync(join(tmpdir(), 'shell-themes-'));
    const result = syncThemes({ appRoot });
    expect(result.synced).toBeGreaterThanOrEqual(14);
    const css = readFileSync(join(appRoot, 'public/themes/qing-hui.css'), 'utf8');
    expect(css).toContain('--background');
  });

  it('checkOnly：同步后通过；篡改后抛错并列出过期文件', () => {
    const appRoot = mkdtempSync(join(tmpdir(), 'shell-themes-'));
    syncThemes({ appRoot });
    expect(() => syncThemes({ appRoot, checkOnly: true })).not.toThrow();

    writeFileSync(join(appRoot, 'public/themes/qing-hui.css'), '/* tampered */');
    expect(() => syncThemes({ appRoot, checkOnly: true })).toThrow(/qing-hui\.css/);
  });

  it('孤儿文件在同步时清理', () => {
    const appRoot = mkdtempSync(join(tmpdir(), 'shell-themes-'));
    syncThemes({ appRoot });
    writeFileSync(join(appRoot, 'public/themes/ghost.css'), '/* orphan */');
    const result = syncThemes({ appRoot });
    expect(result.synced).toBeGreaterThanOrEqual(14);
    expect(() => readFileSync(join(appRoot, 'public/themes/ghost.css'), 'utf8')).toThrow();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/shell && pnpm vitest run tests/sync-themes.test.ts`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 写实现**

`packages/shell/src/skin/sync-themes.ts`（移植 next-app-starter `scripts/sync-theme-css.mjs`，参数化 + 返回结果）：

```ts
/**
 * 将 @pactor-app/theme 的预置皮肤同步到宿主 public/themes。
 *
 * 首屏防闪烁需要 <head> 中同步插入 <link href="/themes/<name>.css">；
 * node_modules 里的 CSS 不能直接作为 public URL，因此保留这份生成副本。
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

export interface SyncThemesOptions {
  /** 宿主工程根，缺省 process.cwd() */
  appRoot?: string;
  /** 缺省 <appRoot>/public/themes */
  outputDir?: string;
  checkOnly?: boolean;
}

export interface SyncThemesResult {
  synced: number;
  /** checkOnly 时的过期/孤儿文件清单 */
  stale: string[];
}

interface ThemeManifestEntry {
  name: string;
}

function fail(message: string): never {
  throw new Error(`[theme-css] ${message}`);
}

export function syncThemes(options: SyncThemesOptions = {}): SyncThemesResult {
  const appRoot = options.appRoot ?? process.cwd();
  const outputDir = options.outputDir ?? join(appRoot, 'public', 'themes');
  const checkOnly = options.checkOnly === true;

  // @pactor-app/theme 是本包的依赖：从包内解析，不要求宿主直接依赖它
  const require = createRequire(import.meta.url);
  const manifestPath = require.resolve('@pactor-app/theme/themes.json');
  const packageRoot = dirname(manifestPath);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    themes?: ThemeManifestEntry[];
  };
  if (!Array.isArray(manifest.themes)) {
    fail('themes.json must contain a themes array');
  }

  const expected = new Map<string, string>();
  for (const theme of manifest.themes) {
    if (!theme || !/^[a-z0-9-]+$/.test(theme.name)) {
      fail(`invalid theme name: ${JSON.stringify(theme?.name)}`);
    }
    const source = join(packageRoot, 'skins', `${theme.name}.css`);
    if (!existsSync(source)) {
      fail(`missing ${source}; run "pnpm --filter @pactor-app/theme build" first`);
    }
    expected.set(`${theme.name}.css`, readFileSync(source, 'utf8'));
  }

  if (!checkOnly) mkdirSync(outputDir, { recursive: true });
  const current = existsSync(outputDir)
    ? readdirSync(outputDir).filter((file) => file.endsWith('.css'))
    : [];

  const stale: string[] = [];
  for (const [file, content] of expected) {
    const target = join(outputDir, file);
    if (checkOnly) {
      if (!existsSync(target) || readFileSync(target, 'utf8') !== content) {
        stale.push(file);
      }
    } else {
      writeFileSync(target, content);
    }
  }
  for (const file of current) {
    if (expected.has(file)) continue;
    if (checkOnly) stale.push(`${file} (orphan)`);
    else rmSync(join(outputDir, file));
  }

  if (checkOnly && stale.length > 0) {
    fail(`public/themes is stale; run "pactor-shell theme sync" and commit: ${stale.join(', ')}`);
  }

  return { synced: expected.size, stale };
}
```

`packages/shell/src/bin/cli.ts`（覆盖占位）：

```ts
#!/usr/bin/env node
/**
 * pactor-shell CLI：宿主构建链入口。
 *   pactor-shell assemble    装配 UI 模块 → .generated/pactor 与 public/modules
 *   pactor-shell validate    校验装配产物（失败非零退出）
 *   pactor-shell theme sync  同步 @pactor-app/theme 预置皮肤 → public/themes
 *   pactor-shell theme check 校验 public/themes 与主题包一致（CI 用）
 */
import { assembleModules } from '../assemble/assemble.js';
import { validateModules } from '../assemble/validate.js';
import { syncThemes } from '../skin/sync-themes.js';

const [command, sub] = process.argv.slice(2);

function fail(message: string): never {
  console.error(`[pactor-shell] ${message}`);
  process.exit(1);
}

try {
  if (command === 'assemble') {
    const summary = assembleModules({ rootDir: process.cwd() });
    console.log(
      `[assemble] 完成：${summary.modules} 个模块，${summary.routes} 条路由，${summary.serverApis} 个模块 API → ${summary.generatedDir}`,
    );
  } else if (command === 'validate') {
    const summary = validateModules({ rootDir: process.cwd() });
    console.log(
      `[validate] 通过：${summary.routes} 条路由，${summary.pages} 个页面，${summary.menus} 个顶层菜单，${summary.serverApis} 个模块 API`,
    );
  } else if (command === 'theme' && (sub === 'sync' || sub === 'check')) {
    const result = syncThemes({ appRoot: process.cwd(), checkOnly: sub === 'check' });
    console.log(
      `[theme-css] ${sub === 'check' ? 'verified' : 'synced'} ${result.synced} skins → public/themes`,
    );
  } else {
    fail(
      `未知命令：${[command, sub].filter(Boolean).join(' ') || '(空)'}，可用：assemble | validate | theme sync | theme check`,
    );
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/shell && pnpm vitest run tests/sync-themes.test.ts`
Expected: 3 个测试 PASS

- [ ] **Step 5: 全量验证 + CLI 冒烟 + commit**

Run: `cd packages/shell && pnpm typecheck && pnpm test && pnpm build`
Expected: 全部测试 PASS；构建成功

CLI 冒烟（验证 shebang 与退出码）：

```bash
cd packages/shell
head -1 dist/bin/cli.js                      # 预期 #!/usr/bin/env node
node dist/bin/cli.js; echo "exit=$?"         # 预期打印用法错误，exit=1
node dist/bin/cli.js theme check; echo "exit=$?"   # 预期 public/themes is stale，exit=1
node dist/bin/cli.js theme sync && node dist/bin/cli.js theme check
# 预期 sync 后 check 通过；注意这会在 packages/shell 下生成 public/themes/，验证后删除：
rm -rf public/themes
git status --short                            # 确认 public/themes 已删除、无其他杂物
```

```bash
git add packages/shell && git commit -m "feat(shell): add theme sync and pactor-shell CLI (assemble/validate/theme)"
```

---

### Task 15: web-shell 迁移为最薄宿主 + 端到端回归

**Files:**
- Modify: `starters/apps-shell-starter/web-shell/package.json`
- Modify: `starters/apps-shell-starter/web-shell/next.config.ts`
- Modify: `starters/apps-shell-starter/web-shell/app/layout.tsx`
- Modify: `starters/apps-shell-starter/web-shell/app/(workspace)/layout.tsx`
- Modify: `starters/apps-shell-starter/web-shell/app/page.tsx`
- Modify: `starters/apps-shell-starter/web-shell/app/(workspace)/[...slug]/page.tsx`
- Modify: `starters/apps-shell-starter/web-shell/app/api/runtime/bootstrap/route.ts`
- Modify: `starters/apps-shell-starter/web-shell/app/api/runtime/pages/[pageId]/route.ts`
- Modify: `starters/apps-shell-starter/web-shell/app/api/runtime/fragments/[fragmentId]/route.ts`
- Modify: `starters/apps-shell-starter/web-shell/app/api/modules/[moduleId]/[[...path]]/route.ts`
- Modify: `starters/apps-shell-starter/web-shell/src/types/pactor-modules.d.ts`
- Modify: `starters/apps-shell-starter/web-shell/src/shell/layouts/shell.layout.yaml`
- Modify: `starters/apps-shell-starter/web-shell/README.md`（工程结构、脚本表、皮肤段落）
- Create: `starters/apps-shell-starter/web-shell/src/components/WorkspaceShell.tsx`
- Delete: `starters/apps-shell-starter/web-shell/src/runtime/`（整目录）、`src/server/`（整目录）、`src/modules/registry.ts`、`src/modules/route-resolver.ts`、`src/modules/types.ts`、`scripts/assemble-modules.mjs`、`scripts/validate-modules.mjs`

**Interfaces:**
- Consumes: 全部前序任务（`@pactor-app/shell` 的 `./client` / `./server` / `./server/routes` / `./next` 出口与 `pactor-shell` CLI）。
- Produces: 瘦身后可直接拷贝的宿主示范；行为与迁移前一致 + 新增皮肤切换能力。

注意：web-shell 的 `AGENTS.md` 提示「This is NOT the Next.js you know」——改动 `app/` 前如有疑问先查 `starters/apps-shell-starter/web-shell/node_modules/next/dist/docs/`。

- [ ] **Step 1: 安装依赖、改 package.json**

先确保 shell 包已构建：

```bash
pnpm --filter @pactor-app/shell build
```

`starters/apps-shell-starter/web-shell/package.json`：
- `dependencies` 增加一行（保持字母序，放 `"react-dom"` 之后 `"risk-analysis"` 之前……实际按现有顺序插在 `"pactor-app"` 之后即可）：

```json
    "@pactor-app/shell": "link:../../../packages/shell",
```

- `scripts` 改为：

```json
  "scripts": {
    "dev": "next dev -p 9020",
    "assemble:modules": "pactor-shell assemble",
    "validate:modules": "pactor-shell validate",
    "theme:sync": "pactor-shell theme sync",
    "smoke:module-api": "node scripts/smoke-module-api.mjs",
    "build": "npm run assemble:modules && npm run validate:modules && npm run theme:sync && next build",
    "start": "next start -p 9020",
    "lint": "eslint"
  },
```

Run: `cd starters/apps-shell-starter/web-shell && pnpm install`
Expected: 安装成功，`node_modules/.bin/pactor-shell` 存在（`ls node_modules/.bin/pactor-shell`）

- [ ] **Step 2: 删除已入包的实现**

```bash
cd starters/apps-shell-starter/web-shell
git rm -r src/runtime src/server scripts/assemble-modules.mjs scripts/validate-modules.mjs
git rm src/modules/registry.ts src/modules/route-resolver.ts src/modules/types.ts
```

- [ ] **Step 3: 改类型兜底与 next.config**

`src/types/pactor-modules.d.ts` 整文件替换为：

```ts
/**
 * UI 模块 client 入口的通配类型声明。
 * 模块包发布的是构建产物（dist-module/client/index.js），不含 .d.ts；
 * 装配器生成的 client-registry.ts 以 "<pkg>/client" 形式引入各模块，此处统一兜底。
 */
declare module "*/client" {
  export const extensions: import("@pactor-app/shell/client").ModuleExtensionBundle;
}

/**
 * 模块 server 入口（dist-module/server/index.mjs）的通配类型声明。
 * 模块包不发布 .d.ts，装配器生成的 server-registry.ts 以 "<pkg>/server"
 * 引入 handlers，此处统一兜底。
 */
declare module "*/server" {
  export const handlers: import("@pactor-app/shell/server").ModuleApiHandlers;
}
```

`next.config.ts` 整文件替换为：

```ts
import type { NextConfig } from "next";

import { withShell } from "@pactor-app/shell/next";

const nextConfig: NextConfig = withShell({
  /** 容器部署时可改为 standalone，并确认 .generated 与 public/modules 进入镜像 */
  // output: "standalone",
  // 接入 UI 模块后按需登记，如：transpilePackages: ["@your-scope/ui-module"]
  transpilePackages: [],
});

export default nextConfig;
```

- [ ] **Step 4: 改根 layout（SkinHeadScript 首屏防闪烁）**

`app/layout.tsx` 整文件替换为：

```tsx
import type { Metadata } from "next";

import { SkinHeadScript } from "@pactor-app/shell/client";

import "./globals.css";
// 聚合样式入口（ui → blocks → chart → chat）：风险分析 / 风险决策页面
// 使用 chart 组件，必须引入聚合样式而不是仅 ui 分表。
import "pactor-app/styles.css";

export const metadata: Metadata = {
  title: "InnoSpots Web Shell",
  description: "统一 Pactor 模块化 Web 入口",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="h-full antialiased">
      <head>
        {/*
          首屏防闪烁：恢复持久化皮肤 <link> 与 light/dark 属性。
          不传 defaultSkin —— 无持久化选择时保留宿主基础皮肤（晨雾奶芙 theme.css）。
        */}
        <SkinHeadScript />
      </head>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: 新建 WorkspaceShell（client 装配层）**

server component 不能把 `renderSubApp` 函数传给 client 组件，因此装配收进一个 client 文件。创建 `src/components/WorkspaceShell.tsx`：

```tsx
"use client";

import { AppShell, PactorShellHost } from "@pactor-app/shell/client";

import { moduleExtensions } from "@generated/pactor/client-registry";

/**
 * 工作区外壳：sitemap 模式（菜单/布局由 Pactor DSL 布局链承担），
 * 子应用为 Pactor DSL 模块（PactorShellHost）；皮肤入口经 DSL 布局的
 * `type: SkinSwitcher`（src/shell/layouts/shell.layout.yaml 的 sidebarFooter）。
 */
export function WorkspaceShell() {
  return (
    <AppShell
      menu={{ mode: "sitemap" }}
      layout={{ variant: "side-fixed" }}
      renderSubApp={() => <PactorShellHost extensions={moduleExtensions} />}
    />
  );
}
```

- [ ] **Step 6: 改 workspace layout 与 catch-all page、首页**

`app/(workspace)/layout.tsx` 整文件替换为：

```tsx
// 模块自带样式：装配器按各模块 manifest 的 styles 生成 import。
import "@generated/pactor/module-styles";

// 皮肤 / 主题令牌由 Shell 统一提供（晨雾奶芙）：皮肤系统的默认基底，
// 用户选择预置皮肤后由 @pactor-app/theme 注入的样式覆盖。
import "@/modules/styles/theme.css";

// AppShell 外壳与 SkinSwitcher 样式。
import "@pactor-app/shell/styles.css";

import { WorkspaceShell } from "@/components/WorkspaceShell";

/**
 * 工作区 layout 挂载 WorkspaceShell（AppShell + PactorShellHost，跨导航常驻）。
 * 具体 URL 是否合法由 [...slug] page 在服务端用装配路由表校验。
 */
export default function WorkspaceLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <WorkspaceShell />
      {children}
    </>
  );
}
```

`app/(workspace)/[...slug]/page.tsx`：把

```ts
import { resolvePublicPath } from "@/modules/route-resolver";
```

改为

```ts
import { resolvePublicPath } from "@pactor-app/shell/server";
```

其余不动。

`app/page.tsx`：把

```ts
import { getAssemblySummary } from "@/modules/registry";
```

改为

```ts
import { getAssemblySummary } from "@pactor-app/shell/server";
```

其余不动。

- [ ] **Step 7: API 路由改为一行接入**

`app/api/runtime/bootstrap/route.ts` 整文件替换为：

```ts
export { runtimeBootstrapHandler as GET } from "@pactor-app/shell/server/routes";
```

`app/api/runtime/pages/[pageId]/route.ts` 整文件替换为：

```ts
export { runtimePageHandler as GET } from "@pactor-app/shell/server/routes";
```

`app/api/runtime/fragments/[fragmentId]/route.ts` 整文件替换为：

```ts
export { runtimeFragmentHandler as GET } from "@pactor-app/shell/server/routes";
```

`app/api/modules/[moduleId]/[[...path]]/route.ts` 整文件替换为：

```ts
import {
  createModuleDispatcher,
  type ModuleApiRouteContext,
} from "@pactor-app/shell/server";

import { moduleServers } from "@generated/pactor/server-registry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 模块 API 统一分发入口。
 *
 * 模块 tgz 自带 server/index.mjs，装配器生成 server-registry 后由此处按
 * moduleId + 逻辑路径分发；不需要在 Shell 逐模块复制业务路由。
 *
 * 不导出 HEAD：Next 会把 HEAD 自动映射到 GET 并去掉响应体。
 */
const dispatch = createModuleDispatcher(moduleServers);

export function GET(request: Request, context: ModuleApiRouteContext) {
  return dispatch(request, context);
}

export function POST(request: Request, context: ModuleApiRouteContext) {
  return dispatch(request, context);
}

export function PUT(request: Request, context: ModuleApiRouteContext) {
  return dispatch(request, context);
}

export function PATCH(request: Request, context: ModuleApiRouteContext) {
  return dispatch(request, context);
}

export function DELETE(request: Request, context: ModuleApiRouteContext) {
  return dispatch(request, context);
}

export function OPTIONS(request: Request, context: ModuleApiRouteContext) {
  return dispatch(request, context);
}
```

- [ ] **Step 8: 布局 DSL 挂皮肤切换器**

`src/shell/layouts/shell.layout.yaml` 整文件替换为：

```yaml
# Shell 默认页面布局。
# 最左侧为固定的一级菜单：Sidebar 关闭折叠（collapsible: false），
# Menu 不开启 collapsible 且菜单项没有 children，因此既不能收起，
# 也不能展开子菜单。侧栏底部固定区（sidebarFooter）挂皮肤切换器——
# SkinSwitcher 由 @pactor-app/shell 的 PactorShellHost 注册为 DSL 组件。
# 右侧 Content 内的 PageOutlet 是页面出口：将来安装的三方应用命中
# 自己的路由后，由同一布局在这里渲染。
dsl: "1.0"
body:
  type: Layout
  props: { className: "h-dvh overflow-hidden bg-zinc-50" }
  children:
    - type: Sidebar
      props:
        className: "flex-1"
        style: { minHeight: 0 }
        brand: { title: InnoSpots }
        collapsible: false
        sidebarFooter:
          type: SkinSwitcher
          props: { allowDefault: true }
        content:
          type: SitemapMenu
          props:
            items: ${data.session.menus}
          events:
            onSelect:
              - action: navigate
                params: { to: "${event}" }
      children:
        - type: Content
          props:
            className: "overflow-y-auto"
            style: { background: "var(--background)" }
          children:
            - type: PageOutlet
```

- [ ] **Step 9: 构建（装配 → 校验 → theme sync → next build）**

```bash
cd starters/apps-shell-starter/web-shell && pnpm build
```

Expected: `pactor-shell assemble` 输出「2 个模块，4 条路由，1 个模块 API」（route 数以装配实际为准，但模块数 2、模块 API 1 不变）；validate 通过；theme sync 生成 `public/themes/`（14 个皮肤 CSS）；`next build` 成功。

若 `next build` 报类型错误，常见原因：`packages/shell` 未构建（先跑 Step 1 的 build）或 `@generated/pactor/*.ts` 残留旧装配（重新 `pnpm assemble:modules`）。

- [ ] **Step 10: 运行时回归**

```bash
cd starters/apps-shell-starter/web-shell && pnpm start &
sleep 3

# 既有行为不变
curl -s http://localhost:9020/api/runtime/bootstrap | head -c 400
# 预期：JSON 含 "resourceType":"sitemap"、"风险分析"、"风险决策"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9020/pactor-app-risk-analysis        # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9020/pactor-app-risk-decision         # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9020/pactor-app-risk-decision/integration-logs  # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9020/nope-not-exists                  # 404
curl -s "http://localhost:9020/api/runtime/pages/pactor-app-risk-decision%3Arisk-decision" | head -c 200
# 预期：PageResource 信封（"resourceType":"page"）

# 模块 API 冒烟（既有脚本）
node scripts/smoke-module-api.mjs

# 皮肤 CSS 已同步
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9020/themes/qing-hui.css              # 200

kill %1
```

浏览器手工验收（一条）：打开 `http://localhost:9020/pactor-app-risk-analysis`，左侧两个固定一级菜单不变；侧栏底部出现皮肤入口，点开选「青灰冷调」，页面令牌色变、刷新后保持；选「默认皮肤」回到晨雾奶芙；外观模式切「深色」整站变暗。

- [ ] **Step 11: lint + 清理 + commit**

```bash
cd starters/apps-shell-starter/web-shell && pnpm lint
git status --short
git check-ignore .generated/pactor public/themes || true   # 看哪些产物未被忽略
```

确认 git status 里没有意外产物（如 `.next`）。`.generated/pactor/*`（装配产物，import 路径已变）与 `public/themes/`（若未被 gitignore）纳入提交；被忽略则跳过。然后：

```bash
git add -A starters/apps-shell-starter/web-shell
git commit -m "refactor(web-shell): migrate to @pactor-app/shell package (host becomes thin shell)"
```

- [ ] **Step 12: 更新 web-shell README**

`starters/apps-shell-starter/web-shell/README.md` 三处更新：

1. 「工程结构」小节的目录树整段替换为：

````text
web-shell/
├── app/
│   ├── layout.tsx                 # 根 Layout、全局样式、SkinHeadScript 首屏防闪烁
│   ├── page.tsx                   # Shell 首页（装配状态概览）
│   ├── globals.css
│   ├── (workspace)/
│   │   ├── layout.tsx             # 挂载 WorkspaceShell（AppShell + PactorShellHost）
│   │   └── [...slug]/page.tsx     # 必选 catch-all；按路由表校验，非法路径 404
│   ├── api/runtime/
│   │   ├── bootstrap/route.ts     # re-export @pactor-app/shell/server/routes
│   │   ├── pages/[pageId]/route.ts
│   │   └── fragments/[fragmentId]/route.ts
│   └── api/modules/[moduleId]/[[...path]]/route.ts
│                                   # createModuleDispatcher(moduleServers) 分发
├── src/
│   ├── shell/                     # Shell 自带默认站点（构建期最先装配）
│   │   ├── sitemap.yaml           # 默认布局 + 两个固定一级菜单（指向模块页面）
│   │   └── layouts/
│   │       └── shell.layout.yaml  # 左侧不可展开菜单 + 右侧 PageOutlet + 侧栏底部 SkinSwitcher
│   ├── components/
│   │   └── WorkspaceShell.tsx     # AppShell + PactorShellHost 装配（client）
│   ├── modules/
│   │   ├── module-list.json       # 启用哪些 UI 包、菜单接入模式、访问级别
│   │   └── styles/theme.css       # Shell 基础皮肤（晨雾奶芙，皮肤系统的默认基底）
│   └── types/pactor-modules.d.ts  # 模块 client/server 入口的通配类型声明
├── .generated/pactor/             # pactor-shell assemble 生成（勿手改，可提交占位或 CI 生成）
├── public/
│   ├── modules/                   # 模块静态资源：<moduleId>/<version>/
│   └── themes/                    # pactor-shell theme sync 生成的预置皮肤 CSS
├── scripts/
│   └── smoke-module-api.mjs       # /api/modules/* 运行时冒烟
├── next.config.ts                 # withShell(...)
└── package.json
````

2. 「使用说明」的脚本表替换为：

```markdown
| 脚本 | 作用 |
| --- | --- |
| `pnpm assemble:modules` | `pactor-shell assemble`：装配，写入 `.generated` 与 `public/modules` |
| `pnpm validate:modules` | `pactor-shell validate`：校验重复 URL / `globalPageId` / 菜单 `pageId` 引用 / 模块 API 前缀与 DSL 残留 |
| `pnpm theme:sync` | `pactor-shell theme sync`：同步 `@pactor-app/theme` 预置皮肤到 `public/themes`（`pactor-shell theme check` 供 CI 校验漂移） |
| `pnpm smoke:module-api` | 对已启动的 Shell 冒烟 `/api/modules/*`（GET/HEAD/OPTIONS/405/404） |
| `pnpm build` | 完整发布构建（装配 → 校验 → theme sync → `next build`） |
| `pnpm lint` | ESLint |
```

3. 「皮肤 / 主题」相关段落（「模块消费与 UI」表中「皮肤 / 主题」行）：把「主题切换 / 持久化仍未实现，深色变量当前无入口」改为现状描述：

```markdown
| 皮肤 / 主题 | 基础皮肤 `src/modules/styles/theme.css`（晨雾奶芙）；预置皮肤切换、light/dark 模式与持久化由 `@pactor-app/shell` 提供（SkinHeadScript 首屏恢复 + 侧栏底部 SkinSwitcher，DSL 组件名 `SkinSwitcher`） | 默认皮肤即宿主基础皮肤；`public/themes` 由 `pactor-shell theme sync` 生成 |
```

同时把 README 开头「**当前接入**」段落末尾补一句：「外壳能力（菜单 / 皮肤 / 布局、Runtime API、装配 CLI）来自 `@pactor-app/shell` 包（`packages/shell`），本工程为最薄宿主示范。」

commit：

```bash
git add starters/apps-shell-starter/web-shell/README.md
git commit -m "docs(web-shell): update README for @pactor-app/shell migration"
```

---

## 收尾自检（执行完所有任务后）

- `pnpm --filter @pactor-app/shell test` 全绿（registry / runtime / dispatch / routes / register-extensions / skin / skin-head-script / skin-switcher / pactor-shell-host / app-shell / assemble / validate / sync-themes / next 共 14 个测试文件）。
- `pnpm --filter @pactor-app/shell typecheck && pnpm --filter @pactor-app/shell build` 通过。
- web-shell `pnpm build && pnpm start` 回归清单（Task 15 Step 10）全部符合预期。
- `git status` 干净，无 `.next` / `public/themes` 误提交（未被 ignore 时 `public/themes` 属有意提交）。
