# example-chat

`pactor-chat` 对话示例：mock AI transport 流式演示消息模型、Safe Registry 与 capability 确认链的完整链路。

## 启动

```bash
pnpm install
pnpm --filter example-chat dev   # http://localhost:5399
```

## 演示口令

| 输入 | 演示内容 |
| --- | --- |
| 任意提问 | thinking part + 流式 markdown（含代码块/列表） |
| `今天天气怎么样` | thinking → `weather.query` 工具调用（running → success）→ markdown 结论 |
| `看一下本月报表` | LLM 下发 DSL：Flex/Card/Statistic/Alert 经 Safe Registry 渲染；末尾白名单外的 `Table` 渲染为 ChatDenied 受控占位 |
| `导出客户数据` | DSL 卡片按钮触发高风险 capability（`data.export`，risk: high），经确认框确认后才执行 |

## 代码导览

- `src/main.tsx` — 组合 `ChatLayout` + `ChatView`（store / transport / safeRegistry / capabilities / confirm）
- `src/mock-ai.ts` — mock `ChatTransport`：async generator 按意图分片产出 `ChatEvent`，模拟 SSE 节奏；真实接入时替换为对接服务端的实现
- `src/safe-registry.ts` — Safe Registry 白名单（`createSafeRegistry` 包装 antd 内置组件表）
- `src/capabilities.ts` — capability 白名单：`weather.query`（低风险直执行）、`data.export`（高风险，confirm 确认链）

协议细节见文档站 `packages/chat` 页面（`pnpm docs:dev`）。
