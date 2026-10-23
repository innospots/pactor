# @pactor-app/module-pack

把 Pactor 应用工程打包为 Shell（如 innospots-web-shell）可装配的 npm 模块（Manifest V1）。

- 可编程 API：`buildModule` / `validateModule` / `initModule`；
- CLI 薄封装：`pactor module init|build|validate|pack`（见 `@pactor-app/cli`）。

## 用法

```bash
pactor module init      # 一次性：生成 pactor.module.json、module/client.ts，注入 package.json
pactor module build     # 每次发布：构建 dist-module/（Manifest V1 + DSL + client + assets）
pactor module validate  # 校验产物契约
pactor module pack      # build + npm pack 生成 tgz
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
`/modules/<id>/<version>/`、`/api/...` 与 http 外链不动、绝对 API 地址告警并降相对）→
esbuild 打包 client entry（react / next / pactor-app / @pactor-app/* external，
alias 自动取 tsconfig paths）→ 可选 Tailwind 预编译 → Manifest V1 + assets（sha256 清单）。

## target profile

底座契约显式化，避免把 Shell 的临时缺陷写死：

- `innospots-web-shell@1`：`forceInlinePages: true`（兼容 lazy 端点未修复的旧 Shell）；
- `innospots-web-shell@2`（默认）：lazy 端点已返回 PageResource 信封，`lazy: true` 保留。

未知 profile 报错并列出可用值；`basePath: "/"` 被 `forbidRootBasePath` 拒绝。

## 配置（pactor.module.json）

```jsonc
{
  "id": "risk",                       // 必填，模块 id（globalPageId 前缀）
  "name": "AI Risk Mesh",
  "basePath": "/risk",                // 默认 /<id>；禁止 "/"
  "yamlRoot": "src/server/yaml",      // 默认值
  "clientEntry": "module/client.ts",  // 默认值；不存在时按纯 DSL 模块跳过 bundle
  "actions": [],                      // init 自动发现 src/pactor/*-actions.ts
  "publicDir": "public",              // 默认值
  "target": "innospots-web-shell@2",  // 默认值
  "demo": { "public": false },        // 演示模式：pages/menus 标 public
  "tailwind": { "enabled": false },   // 可选 Tailwind 预编译
  "rewrite": { "absoluteApiToRelative": true }  // 绝对 API 地址降为相对路径
}
```
