# Design: add-example-chat

## 定位

示例的目标是**演示 pactor-chat 的协议与视图能力**，不是再做一个 pactor-app 应用。因此工程不经 `createPactorApplication`，直接组合 `ConversationStore` + `ChatTransport` + `ChatView` + `ChatLayout`——与 `docs/packages/chat` 文档的组合方式一致，保持最小接入面。

## 工程骨架

沿用 example-admin 的脚手架约定（Vite 8 + @vitejs/plugin-react + TS，strictPort）：

```text
examples/chat/
  index.html
  package.json        example-chat（private）
  vite.config.ts      端口 5399 strictPort
  tsconfig.json
  src/
    main.tsx          挂载 ChatLayout + ChatView
    app.css           html/body/#root 全高 + 引入 antd reset
    mock-ai.ts        mock ChatTransport（async generator，分片延迟）
    capabilities.ts   capability 白名单（weather.query / data.export）
    safe-registry.ts  Safe Registry（白名单组件子集）
```

依赖：`pactor-chat`、`pactor-ui-antd`（内置组件表来源）、`antd ^6`、`react / react-dom ^19`；devDeps 同其他示例（vite、plugin-react、typescript、@types/*）。不用 pactor-vite-plugin（本示例无 YAML 页面）。

## mock AI transport（mock-ai.ts）

`ChatTransport.send` 的 async generator 实现，按输入文本匹配意图，用 `sleep(ms)` 模拟流式节奏：

| 意图口令 | 事件序列 |
| --- | --- |
| 含「天气」 | thinking.delta → tool.start(weather.query) → tool.result(success) → markdown 结论 |
| 含「报表 / 统计 / 卡片」 | thinking.delta → dsl.start → dsl.complete（Flex + Statistic×3 + Alert）→ text 收尾 |
| 含「导出」 | dsl.complete（Alert + Button，按钮 `onClick` 触发 `capability` 动作 `data.export`，risk: high） |
| 其他 | thinking.delta + markdown 分片回复（含代码块/列表，演示 markdown part） |

所有事件经 `runChatTurn` 归一到 assistant 占位消息；无需 `message.start`（reducer 乱序宽容），结尾显式发 `message.end`。

## 安全边界演示

- **Safe Registry**：`createSafeRegistry(createBuiltinComponentRegistry(), ['Flex','Card','Statistic','Alert','Button'])`——白名单外的 DSL 类型（可在 mock 中注入一个 `Table` 演示）渲染为 ChatDenied 占位。
- **capability 链**（`capabilities.ts`）：
  - `weather.query`：risk 缺省（低），直接返回 mock 天气数据；
  - `data.export`：`risk: 'high'`，经 `confirm`（`window.confirm` 包装为 Promise）确认后返回 mock 结果，取消则 skipped。

## 验证

1. `pnpm --filter example-chat typecheck` 与 `build` 通过；
2. dev server 启动后 Playwright 走查：发送「天气」看到 thinking + 工具调用 + 结论；发送「报表」看到 DSL 统计卡片；发送「导出」点击按钮出现确认框；普通提问看到流式 markdown。

## 非目标

- 不接真实 LLM / SSE 服务端（mock 即协议演示）；
- 不做会话历史侧栏、多会话管理（V1 ChatLayout 本就无侧栏）。
