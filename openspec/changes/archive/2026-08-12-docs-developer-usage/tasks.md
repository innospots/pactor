# Tasks: docs-developer-usage

## 1. 快速开始重写

- [x] 1.1 重写 `guides/getting-started`：安装组合表 / 最小接入四步 / createPactorApplication 参数表（对照 packages/app/src/application.ts）/ UI kit 切换 / 框架开发附录

## 2. 新指南

- [x] 2.1 新增 `guides/data-flow`：加载链路 + 四条数据通路 + 重渲染模型 + 两个端到端走查
- [x] 2.2 新增 `guides/custom-components`：Renderer 契约 / 容器组件 / 注册路径 / 完整示例

## 3. 既有内容补齐

- [x] 3.1 `reference/dsl` 补 Markdown 组件小节 + 组件目录链向自定义组件指南
- [x] 3.2 sidebar 注册新页面；index.mdx 行动点/导航同步

## 4. 验收

- [x] 4.1 重启 docs dev server，浏览器抽查新页面（侧栏 / 代码块 / 表格渲染）
- [x] 4.2 `pnpm docs:build` 通过；MEMORY.md 同步
