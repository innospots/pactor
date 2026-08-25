# example-chat

`pactor-chat` 对话示例：mock AI transport 流式演示消息模型、Safe Registry 与 capability 确认链的完整链路；同时作为"数据由调用方经接口注入"（设计决策 D0）的参考实现——空状态建议、活动轨迹、消息操作、附件与 Composer 扩展槽的数据全部由示例代码注入。

## 启动

```bash
pnpm install
pnpm --filter example-chat dev   # http://localhost:5399
```

## 演示口令

| 输入 | 演示内容 |
| --- | --- |
| 任意提问 | thinking part（流式展开 + 答案阶段自动折叠）+ 流式 markdown（含代码块/列表） |
| `今天天气怎么样` | thinking → `weather.query` 工具调用（携带 args，活动轨迹单行显示参数摘要，running → success）→ markdown 结论 |
| `看一下本月报表` | LLM 下发 DSL：Flex/Card/Statistic/Alert 经 Safe Registry 渲染；末尾白名单外的 `Table` 渲染为 ChatDenied 受控占位 |
| `导出客户数据` | DSL 卡片按钮触发高风险 capability（`data.export`，risk: high），经确认框确认后才执行 |

## 新能力速览

- **空状态**：空会话渲染问候语 + 起始建议，点击建议立即发送（`greeting` / `subtitle` / `suggestions` props）
- **活动轨迹**：流式状态头（呼吸文案 + 秒级计时）+ tool-call/tool-result 配对单行轨迹（可展开查看参数与结果），进入答案阶段自动折叠
- **消息操作**：hover assistant 消息复制 / 末条重新生成；hover user 消息编辑重发；error 消息重试
- **Composer 扩展**（内建于 ChatView 底部输入区）：受控附件（粘贴/拖拽/选择文件 → data URL 伪上传，图片缩略图 / 文档卡片，点击新标签页打开）、`toolbarEnd` 模型 chip、`@` 提及与 `+` 菜单触发回调——全部经 `ChatView` 透传给内建 Composer
- **发送按钮状态机**：空文本禁用 → 可发送 → 流式中变为停止按钮（点击取消当前 turn）

## 代码导览

- `src/main.tsx` — 组合 `ChatLayout` + `ChatView`（store / transport / safeRegistry / capabilities / confirm / greeting / suggestions）；附件受控、工具栏槽与 `@` / `+` 触发回调直接传给 `ChatView`（透传内建 Composer），粘贴/拖拽/选择的 File 读为 data URL 伪上传回写 `attachments`；引入 `pactor-chat/styles.css` 皮肤与 `katex/dist/katex.min.css`（公式渲染）
- `src/mock-ai.ts` — mock `ChatTransport`：async generator 按意图分片产出 `ChatEvent`（`tool.start` 携带 `args`），模拟 SSE 节奏；真实接入时替换为对接服务端的实现
- `src/safe-registry.ts` — Safe Registry 白名单（`createSafeRegistry` 包装 antd 内置组件表）
- `src/capabilities.ts` — capability 白名单：`weather.query`（低风险直执行）、`data.export`（高风险，confirm 确认链）

协议细节见文档站 `packages/chat` 页面（`pnpm docs:dev`）。
