# @pactor-app/module-pack

把 Pactor 应用工程打包为 Shell（如 innospots-web-shell）可装配的 npm 模块（Manifest V1）。

- 可编程 API：`buildModule` / `validateModule` / `initModule` / `bumpPackageVersion`；
- CLI 薄封装：`pactor module init|build|validate|pack|publish`（见 `@pactor-app/cli`）。

## 用法

```bash
pactor module init      # 一次性：生成 pactor.module.json、module/client.ts，注入 package.json
pactor module build     # 每次发布：构建 dist-module/（Manifest V1 + DSL + client + server + assets）
pactor module validate  # 校验产物契约
pactor module pack      # 递增版本号（默认 patch，--bump/--no-bump 控制）+ build + npm pack 生成 tgz
pactor module publish   # pack 全流程 + npm publish 发布（--registry/--tag/--access/--otp/--dry-run）
```

```ts
import { buildModule } from '@pactor-app/module-pack';

const result = buildModule({ dir: process.cwd() });
console.log(result.stats, result.warnings);
```

## 转换链路

收集 `yamlRoot`（页面 / 布局 / 片段）→ `$include` 递归展开（循环引用检测）→
sitemap 转换（布局字符串内联、菜单去 `path`、`lazy` 按 target profile 开关、
demo `public` 标记）→ URL 重写（导航 `to` 加 `basePath` 前缀、资源 URL 重写为
`/modules/<id>/<version>/`、http 外链不动、绝对 API 地址告警并降相对；
配置了 `apiPrefixes` 时命中前缀的 `/api/...` 改写为
`/api/modules/<id>/...`）→
esbuild 打包 client entry（react / next / pactor-app / @pactor-app/* external，
alias 自动取 tsconfig paths）→ 可选 Tailwind 预编译 → 可选 server entry 打包
（`server/index.mjs`，Node ESM，框架依赖 external）→ Manifest V1 + assets（sha256 清单）。

## target profile

底座契约显式化，避免把 Shell 的临时缺陷写死：

- `innospots-web-shell@1`：`forceInlinePages: true`（兼容 lazy 端点未修复的旧 Shell）；
- `innospots-web-shell@2`：lazy 端点已返回 PageResource 信封，`lazy: true` 保留；
- `innospots-web-shell@3`（默认）：在 @2 基础上支持 `/api/modules/<moduleId>/*`
  通用模块 API 分发（`moduleServerApi: true`）。未使用 server entry 的模块产物与 @2 一致。

未知 profile 报错并列出可用值；`basePath: "/"` 被 `forbidRootBasePath` 拒绝。

## 模块服务端 API（server entry）

模块可把自己的业务 API 一起打进 tgz，由 Shell 统一承接，无需在宿主工程复制路由。

```jsonc
{
  "serverEntry": "module/server.ts",     // 与 apiPrefixes 必须成对出现
  "apiPrefixes": ["/api/risk-analysis"]  // 命中前缀的 DSL URL 自动 namespacing
}
```

`module/server.ts` 导出逻辑路径到方法的处理函数映射：

```ts
export const handlers = {
  "/api/risk-analysis/data-value": {
    GET: (request, context) =>
      Response.json({ code: 0, data: { ok: true }, message: "ok" }),
  },
};
```

- 路径键使用模块逻辑路径（原始 `/api/...`），支持 `:param` 段；handler 只依赖
  Web 标准 `Request` / `Response`，`context.url` 是逻辑 URL（含 query）。
- 公开 URL 为 `/api/modules/<moduleId>/<原 /api 之后的路径>`。
- 产物 `server/index.mjs`（使用 `.mjs` 是因为模块包通常没有 `"type": "module"`）；
  manifest 同步输出可选的 `serverEntry` / `apiPrefixes`。
- `package.json` 需声明 `"exports": { "./server": "./dist-module/server/index.mjs" }`
  （`pactor module init` 检测到 `module/server.ts` 时会自动注入）。
- 使用 server entry 的模块必须把 `target` 设为 `innospots-web-shell@3`。
- 前缀不能是 `/api`、不能含尾斜杠/query/hash/通配/`:param`；`/api/modules` 与
  `/api/runtime` 为保留前缀；同一模块内前缀不得重复或互相包含。

## 配置（pactor.module.json）

```jsonc
{
  "id": "risk",                       // 必填，模块 id（globalPageId 前缀）
  "name": "AI Risk Mesh",
  "basePath": "/risk",                // 默认 /<id>；禁止 "/"
  "yamlRoot": "src/server/yaml",      // 默认值
  "clientEntry": "module/client.ts",  // 默认值；不存在时按纯 DSL 模块跳过 bundle
  "serverEntry": "module/server.ts",  // 可选；与 apiPrefixes 成对配置
  "apiPrefixes": ["/api/risk-analysis"], // 可选；模块 API 逻辑前缀
  "actions": [],                      // init 自动发现 src/pactor/*-actions.ts
  "publicDir": "public",              // 默认值
  "target": "innospots-web-shell@3",  // 默认值；server entry 需要 @3
  "access": { "default": "public" },  // 访问默认值：public 时给未声明 public/permission 的页面/菜单补 public
  "tailwind": { "enabled": false },   // 可选 Tailwind 预编译
  "rewrite": { "absoluteApiToRelative": true }  // 绝对 API 地址降为相对路径
}
```
