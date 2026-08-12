# Proposal: docs-developer-usage

## Why

文档站现有内容偏"框架内部视角"（包清单、协议设计），缺少面向**框架使用者**的系统内容：如何安装与调用、数据在框架里怎么流、如何开发自定义组件。DSL 参考虽全但组件目录缺 Markdown 组件，快速开始偏 monorepo 开发而非 npm 使用。

## What Changes

- **重写 `guides/getting-started`**：面向使用者的安装（npm 包组合）与最小接入（createPactorApplication 参数一览、UI kit 切换、vite 插件 / CLI 在工程中的位置）；monorepo 开发内容降级为附录。
- **新增 `guides/data-flow`**（数据流）：bootstrap → loader → PageRuntime 的加载链路；state / data / actions / params 四条数据通路与重渲染订阅模型；表单提交与 overlay 的数据流走查。
- **新增 `guides/custom-components`**（自定义组件开发）：Renderer 契约（props 已求值、events 绑定、children / dslChildren 与 renderChildren、withScope、permission 注入、when）、注册路径（componentRegistry 工厂 / ui kit 槽位 / chat Safe Registry）、完整示例。
- **`reference/dsl` 补 Markdown 组件**小节，组件目录链接到自定义组件指南。
- sidebar 与首页（index.mdx）行动点同步。

## Capabilities

### New Capabilities

- `docs-site`: 文档站开发者内容结构——面向使用者的快速开始、数据流指南、自定义组件指南、DSL 参考完整性。

### Modified Capabilities

（无）

## Impact

- 仅文档：`docs/src/content/docs/**` 与 `docs/astro.config.mjs`；不动任何包代码。
- 新增页面需重启 docs dev server（Astro 不热收录新页面）。
