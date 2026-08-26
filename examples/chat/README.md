# example-chat

`pactor-chat` 对话示例：聊天页以 DSL 声明（`src/chat.page.yaml` 经 pactor-vite-plugin 编译，`createPageRuntime` 渲染），mock AI transport 流式演示消息模型、Safe Registry 与 capability 确认链的完整链路；同时作为"数据由调用方经接口注入"（设计决策 D0）与 **Chat 一等 DSL 组件**（spec: chat-dsl-component）的参考实现——页面 body 是 `Chat` 组件节点：左侧菜单、问候与建议、会话参数全部在 YAML，菜单交互经 `events.onMenuSelect` + 页面 state（setState）表达；运行时服务（transport / store / safeRegistry / capabilities / confirm / 附件伪上传 / 弹层与工具栏回调）由 `App.tsx` 经 `ChatServicesProvider` 在根部注入一次。

页面构成对标工作区会话页：宿主应用壳只有顶栏（可编辑标题 + 导出 / 明暗切换 / 清空）与弹层；`Chat` 组件自持 AppShell 侧栏（menu 数据驱动：「新建对话」+ mock 历史会话，active 高亮；移动端 <768px 侧栏变为抽屉）与工作区（消息列最大宽度 768px + Composer 工具栏）。明暗主题通过 app 根的 `data-pactor-theme="dark"` 切换（pactor-chat 皮肤随之响应）。

## 启动

```bash
pnpm install
pnpm --filter example-chat dev   # http://localhost:5399
```

## 演示口令

| 输入 | 演示内容 |
| --- | --- |
| 任意提问 | thinking part（流式展开 + 答案阶段自动折叠）+ 流式 markdown（含代码块/列表/KaTeX 公式） |
| `今天天气怎么样` | thinking → `weather.query` 工具调用（携带 args，活动轨迹单行显示参数摘要，running → success）→ markdown 结论 |
| `看一下本月报表` | LLM 下发 DSL：Flex/Card/Statistic/Alert 经 Safe Registry 渲染；末尾白名单外的 `Table` 渲染为 ChatDenied 受控占位 |
| `导出客户数据` | DSL 卡片按钮触发高风险 capability（`data.export`，risk: high），经确认框确认后才执行 |

## 页面与交互

- **侧栏**（Chat 内建菜单，`menu` 数据驱动）：「新建对话」+ mock 历史会话列表（active 高亮由页面 state `activeMenu` 驱动，点击经 `events.onMenuSelect` → `setState` 闭环切换；「新建对话」额外触发示例扩展动作 `demo.newSession` 清空会话）。移动端点击项后经 `useSidebarDrawer()?.close()` 关闭抽屉。会话切换是纯演示状态——消息在单一内存 store 中，切换历史会话只改高亮，不加载历史消息
- **顶栏**：左侧会话标题默认「新的对话」，点击进入编辑，Enter / blur 提交（Esc 取消）；右侧图标按钮依次为导出 Markdown（序列化 `store.getMessages()` 的角色与 text/markdown part 为 .md 下载）、明暗切换、清空会话（`store.clear()` + 清空上下文 chips）
- **空状态**：空会话渲染问候语 + 起始建议，点击建议立即发送（`greeting` / `subtitle` / `suggestions` props）
- **活动轨迹**：流式状态头（呼吸文案 + 秒级计时）+ tool-call/tool-result 配对单行轨迹（可展开查看参数与结果），进入答案阶段自动折叠
- **消息操作**：hover assistant 消息复制 / 末条重新生成；hover user 消息编辑重发；error 消息重试
- **Composer 扩展**（内建于 ChatView 底部输入区，数据全部经 `ChatView` 透传给内建 Composer）：
  - 受控附件：粘贴/拖拽/选择文件 → data URL 伪上传，图片缩略图 / 文档卡片，点击新标签页打开
  - `toolbarStart`：能力 chip（「对话」默认，下拉含 对话 / 深度研究 / 深度求解 / 可视化，仅演示 UI 状态）+ 已选上下文 chips 区
  - `toolbarEnd`：模型选择 chip（「demo-mock」默认，下拉 3 个 mock 模型）
  - 「+」按钮（`onPlusMenu(anchorRect)`）：示例自渲染锚定菜单（历史会话 / 记忆 / 人设），各打开 antd Modal 复选选择器，确认后把选中条目转为可移除的上下文 chip（如「历史：上次的对话」）
  - `@` 提及（`onMentionTrigger(query, anchorRect)`）：示例自渲染锚定列表，按 query 实时过滤 mock 代理（小助手 / 代码专家 / 翻译官），点击转为「@名字」chip；Escape / 外部点击 / 删掉 `@` 均收起
- **发送按钮状态机**：空文本禁用 → 可发送 → 流式中变为停止按钮（点击取消当前 turn）

## 代码导览

- `src/chat.page.yaml` — DSL 页面声明：body 为一等组件 `Chat` 节点，menu / activeMenuKey / greeting / subtitle / suggestions / conversationId 与 `events.onMenuSelect`（setState 切换菜单高亮 + `demo.newSession` 清空会话）全部在这里（经 pactor-vite-plugin 构建期编译 + 校验）
- `src/main.tsx` — 入口：引入 antd reset、`pactor-chat/styles.css` 皮肤、`katex/dist/katex.min.css`（公式渲染）与 `app.css`，渲染 `App`
- `src/App.tsx` — 宿主装配：`ChatServicesProvider` 注入全部运行时服务（store / transport / safeRegistry / capabilities / confirm / 附件伪上传 / 工具栏槽 / 弹层回调，useMemo 保持稳定引用）+ `registerChatComponent` 注册 Chat 类型 + `createPageRuntime(chatPageDsl)` 渲染；`demo.newSession` 示例扩展动作经 `options.actions` 注册。宿主壳只剩顶栏 Header（可编辑标题 / 导出 / 明暗切换 / 清空）与全部弹层（「+」菜单、picker Modal、`@` 提及）——侧栏已由 Chat 经 menu 配置自持。工具栏槽内的动态 chips 经 `DemoHostContext` 读取最新状态
- `vite.config.ts` — 接入 `pactor()` 插件（`*.page.yaml` 编译为 JS 模块）
- `src/dsl-modules.d.ts` — `*.page.yaml` 模块类型声明
- `src/components/Header.tsx` — 宿主顶栏：可编辑会话标题 + 导出 / 明暗 / 清空图标按钮（Chat 设 `showHeader: false`，header 由宿主壳承担）
- `src/components/AnchoredPopup.tsx` — 锚定弹层小组件（fixed 定位于 anchorRect 上方，Escape / 外部 mousedown 关闭），能力 chip、"+" 菜单、模型选择器与 `@` 提及共用
- `src/components/CapabilityChip.tsx` — toolbarStart 能力 chip + 下拉弹层
- `src/components/ModelSelector.tsx` — toolbarEnd 模型选择 chip + 下拉弹层
- `src/components/ContextChips.tsx` — 已选上下文 chips（可移除）
- `src/components/PlusMenu.tsx` — "+" 锚定菜单（历史会话 / 记忆 / 人设入口）
- `src/components/ContextPickerModal.tsx` — 上下文选择器（antd Modal + 复选列表，演示 picker 扩展模式）
- `src/components/MentionListbox.tsx` — `@` 提及锚定列表（按 query 过滤）
- `src/mock-data.ts` — mock 数据：能力 / 模型 / 代理 / picker 条目（纯静态，无网络；侧栏历史会话已迁移为 chat.page.yaml 的 menu 配置）
- `src/attachments.ts` — `readAsAttachment`：File 读为 data URL 伪上传
- `src/export-markdown.ts` — 会话导出 Markdown（`serializeMessages` + Blob 下载）
- `src/mock-ai.ts` — mock `ChatTransport`：async generator 按意图分片产出 `ChatEvent`（`tool.start` 携带 `args`），模拟 SSE 节奏；真实接入时替换为对接服务端的实现
- `src/safe-registry.ts` — Safe Registry 白名单（`createSafeRegistry` 包装 antd 内置组件表）
- `src/capabilities.ts` — capability 白名单：`weather.query`（低风险直执行）、`data.export`（高风险，confirm 确认链）

协议细节见文档站 `packages/chat` 页面（`pnpm docs:dev`）。
