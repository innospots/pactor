# Design: add-vite-plugin

## Context

设计文档第 34 节：YAML = 开发格式，JSON = Runtime 格式，浏览器不解析 YAML；第 85 节：Vite 插件在构建期执行 Parse → Validate → Compile → Optimized JSON/JS，支持 `import page from './user-list.page.yaml'`。校验复用 pactor-schema（`validatePageDsl`）。

约束：

- 插件零 React 依赖；`vite` 为 peer（仅用 `Plugin` 类型与标准钩子）。
- YAML 解析用 `yaml` 包（成熟实现，不自研）。
- fragment 无独立 Schema 校验器（pactor-schema 只有 PageDsl 校验）——fragment 仅做结构宽松检查（存在 `dsl` 与 `body`），page 走完整校验。

## Goals / Non-Goals

**Goals:**

- `pactor()` 插件：`.page.yaml/.yml` + `.fragment.yaml/.yml` 转换、构建期校验、HMR、选项。
- 单测 + vite build 集成测试。
- 文档。

**Non-Goals:**

- DSL 的 treeshaking/压缩优化（JSON 字面量天然可被 bundler 处理）。
- 生成 TS 类型声明（`.page.yaml` 模块类型声明文件模板——留 pactor-cli 或后续；README 给出 `declare module` 片段）。
- `.yaml` 全量匹配（仅约定后缀，避免误伤普通 yaml 配置）。

## Decisions

### D1: 转换管线

`transform(code, id)`：匹配后缀 → `parseDocument`（yaml，带错误位置）→ page 类 `validatePageDsl`，失败时 `this.error()` 抛出聚合错误（每条形如 `path: message (keyword)`）→ 输出模块代码：

```ts
const page = <JSON 字面量>;
export const dslVersion = page.dsl;
export default page;
```

fragment 输出同名结构（`fragment.dsl`）。JSON.stringify 生成字面量（内容来自 YAML 解析产物，无代码注入面）。

### D2: 文件约定与选项

- 默认匹配：`/\.(page|fragment)\.(yaml|yml)$/`。
- 选项：`include?: RegExp | RegExp[]`（覆盖默认匹配）；`validate?: boolean`（默认 true）。
- `name: 'pactor'`、`enforce: 'pre'`（先于其他插件处理）。

### D3: HMR

`handleHotUpdate({ file, server, modules })`：文件匹配 DSL 后缀时返回 `modules`（使依赖模块进入热更新）；无模块时 `server.ws.send({ type: 'full-reload' })`。

### D4: 测试策略

- 单测：直接调用 `plugin.transform.call(pluginContext, code, id)`——合法 page、非法 page（缺 page.id，断言错误信息含路径）、YAML 语法错误、fragment 转换、validate:false 跳过校验、include 自定义。
- 集成测试：临时目录 fixture + `vite build` API 构建一个 import `.page.yaml` 的入口，断言产物包含 DSL 内容且无错误。
- HMR：单测断言 handleHotUpdate 行为（mock server/modules）。

## Risks / Trade-offs

- [vite 大版本钩子签名差异] → peer `>=5`，仅用稳定钩子（transform/handleHotUpdate/configResolved 不需要）。
- [JS 模块类型缺失导致业务侧 TS 报错] → README/文档提供 `declare module '*.page.yaml'` 片段；生成 d.ts 留 CLI。

## Migration Plan

无（全新包）。顺序：骨架 → transform 管线 → HMR/选项 → 测试 → 文档。

## Open Questions

- `pactor inspect/validate` 等 CLI 命令复用本插件的解析校验逻辑：pactor-cli 立项时抽取共享内部函数。
