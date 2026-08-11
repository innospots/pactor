# Tasks: add-markdown-module

## 1. 包骨架

- [x] 1.1 创建 `packages/markdown`：dependencies `pactor-core` workspace:* + `react-markdown` + `remark-gfm`，peerDeps `react >=18`，devDeps react 测试栈；tsconfig（jsx）、tsup、LICENSE、README、tests/setup.ts；`pnpm install` 成功

## 2. MarkdownRenderer（spec: markdown-renderer）

- [x] 2.1 基础渲染：标题/列表/表格（remark-gfm）/代码块/引用/链接/图片，容器 `pactor-markdown` class
- [x] 2.2 HTML 注入拒绝：不启用 raw HTML，测试锁定 script/onerror 场景
- [x] 2.3 链接/图片协议白名单（http/https/mailto/相对路径），外链 target/rel 安全属性

## 3. DSL 适配

- [x] 3.1 `MarkdownDslComponent`（props.content）与 `registerMarkdownComponents(registry)`
- [x] 3.2 PageRuntime 端到端测试：DSL Markdown 节点渲染

## 4. 验收与文档

- [x] 4.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 4.2 文档站新增 `packages/markdown.md`，侧边栏与快速开始模块表同步，`pnpm docs:build` 通过
