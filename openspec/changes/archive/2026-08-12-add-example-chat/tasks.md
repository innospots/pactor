# Tasks: add-example-chat

## 1. 工程骨架

- [x] 1.1 创建 `examples/chat`：package.json（`example-chat`，deps 含 pactor-chat / pactor-ui-antd / antd ^6 / react ^19）、vite.config.ts（5399 strictPort）、tsconfig.json、index.html

## 2. 源码

- [x] 2.1 `src/mock-ai.ts`：mock ChatTransport，覆盖 thinking / markdown / tool / dsl 四类意图（天气、报表、导出、默认），分片延迟
- [x] 2.2 `src/safe-registry.ts` + `src/capabilities.ts`：Safe Registry 白名单（Flex/Card/Statistic/Alert/Button）+ capability 注册表（weather.query、data.export high risk）
- [x] 2.3 `src/main.tsx` + `src/app.css`：ChatLayout + ChatView 组合挂载，antd reset 与全高样式
- [x] 2.4 编写 README.md（启动方式、意图口令、代码导览）

## 3. 验收

- [x] 3.1 `pnpm install` 后 `pnpm --filter example-chat typecheck` 与 `build` 通过
- [x] 3.2 浏览器验证：天气（thinking+工具调用）、报表（DSL 卡片）、导出（确认框）、普通提问（流式 markdown）四条链路
- [x] 3.3 根 README 工程结构补登 example-chat 与 example-admin-antd；同步 MEMORY.md
