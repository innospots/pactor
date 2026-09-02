# example-chat

`@pactor-app/chat` 对话示例：路由化的多页面工作台（设计决策 D7）——HashRouter + `MenuRegistry`（对话 `/chat`、我的智能体 `/agents`、系统设置 `/settings`），菜单切换 = URL 变化，刷新按 URL 还原页面；外壳为 `ChatShell`（menu 来自 registry 可见树，`onMenuSelect` → `bridge.push`，content 槽为 `DynamicDslRoute` 路由出口），三个页面各自以 `.page.yaml` 声明（@pactor-app/vite-plugin 编译），命中的 pageId 在 render 回调里建 PageRuntime 渲染，页内 runtime 注入 `createRouterAdapter(bridge)`（DSL `navigate` 动作可用）与 `route.query/params` 页面作用域。

对话页演示产出物面板（spec: chat-artifact-panel）完整链路：建议词 / 口令触发 → mock transport 产出 artifact part（markdown / code / dsl 三种 kind）→ `events.onArtifact` → `setState` 打开右侧面板（dsl kind 经 Safe Registry 白名单活预览）→ `onPanelClose` 关闭。运行时服务（transport / safeRegistry / capabilities / confirm / 附件伪上传 / callService 服务桥）由 `App.tsx` 经 `ChatServicesProvider` 在根部注入一次；`ConversationStore` 按会话 id 缓存于宿主并由 chat 页嵌套 provider 就近注入——跨页面切换 / 切换智能体会话消息不丢。

聊天页结构全部经 `chat.page.yaml` 的 `Chat` props 声明（spec: chat-builtin-features）：内建 header（可编辑标题 + 导出 / 明暗 / 清空操作组）、模型选择（受控闭环 `model` + `onModelChange`）、`@` / `+` 上下文弹层与 chips（`contexts` 的 service 引用经宿主 `callService` 解析），宿主不含任何槽位组件。明暗主题由内建 theme 操作写 `documentElement` 的 `data-pactor-theme` 切换（@pactor-app/chat 皮肤与示例外壳令牌随之响应）。移动端 <768px：侧栏变抽屉（顶栏品牌区 + 菜单按钮），产出物面板变右侧覆盖抽屉（遮罩点击关闭）。

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
| `帮我生成一份月报` | markdown kind 产出物 → 消息内产出物卡片 + 右侧面板自动打开 |
| `帮我写一段代码` | code kind 产出物（只读代码块，language 角标）→ 右侧面板 |
| `帮我生成一个统计页面` | dsl kind 产出物 → 面板内经白名单组件活预览渲染 |

## 页面与交互

- **菜单外壳**（ChatShell，React 直连）：对话 / 我的智能体 / 系统设置三项来自 `MenuRegistry` 可见树，高亮由 `useLocation` 推导（刷新即还原），点击 → `bridge.push(item.path)`。移动端点击项后经 `useSidebarDrawer()?.close()` 关闭抽屉
- **对话页**（`/chat`）：body 为无侧栏形态的 `Chat`；`conversationId` 取 `${route.query.id || 'conv-demo'}`——从智能体列表进入时每个智能体一个独立会话（store 按会话 id 缓存）。产出物面板为受控闭环：`artifact` / `panelOpen` 绑页面 state，`onArtifact` → `setState` 开面板，`onPanelClose` → `setState` 关面板
- **我的智能体**（`/agents`）：白名单组件（Page/Grid/Card/Alert/Button）声明的 mock 列表，「开始对话」→ DSL `navigate` 动作跳 `/chat?id=agent-xxx`
- **系统设置**（`/settings`）：Form/Input/Select 表单，`onSubmit` → `setState` 保存 + `message` 成功提示 + 下方卡片回显
- **对话页 header**（包内建，`headerActions` / `editableTitle` 声明）：左侧会话标题默认「新的对话」，点击进入编辑，Enter / blur 提交（Esc 取消）；右侧操作组依次为导出 Markdown（当前会话）、明暗切换、清空当前会话——默认行为在包内执行，事件经 DSL `events` 接 toast 提示
- **空状态**：空会话渲染问候语 + 起始建议，点击建议立即发送
- **活动轨迹**：流式状态头（呼吸文案 + 秒级计时）+ tool-call/tool-result 配对单行轨迹（可展开查看参数与结果），进入答案阶段自动折叠
- **消息操作**（包内建，`messageActions` 声明，spec: chat-message-actions）：操作条按数组渲染——内建 copy / retry / regenerate + edit（label 覆盖为「修改并重发」，内建编辑重发行为不变）+ 自定义「引用回复」动作（icon `quote`，点击经宿主 `callService('quoteMessage')` 派发并 toast 引用文本）；任意动作点击并行触发 `events.onMessageAction`（event 作用域含 `action` / `message`），DSL 侧接 toast 提示。hover assistant 消息复制 / 末条重新生成；hover user 消息编辑重发；error 消息重试的缺省语义不变
- **Composer 扩展**（内建于 ChatView 底部输入区）：
  - 受控附件：粘贴/拖拽/选择文件 → data URL 伪上传，图片缩略图 / 文档卡片，点击新标签页打开
  - 模型选择 chip（包内建，`models` / `model` 受控闭环）：下拉 3 个 mock 模型，选中值进 `ChatInput.model`
  - 「+」按钮（包内建，`contexts` 中 `trigger: '+'` 源）：上下文候选经宿主 `callService('contexts')` 解析，选中转为可移除的上下文 chip（如「历史：上次的对话」）
  - `@` 提及（包内建，`trigger: '@'` 源）：锚定弹层按 query 实时过滤 mock 智能体（小助手 / 代码专家 / 翻译官），点击转为 chip
  - 上下文 chips：选中追加（同 trigger 同 id 去重）、单独移除，发送后自动清空并进 `ChatInput.contexts`（mock transport 在回复开头注明当前模型与引用上下文）
- **发送按钮状态机**：空文本禁用 → 可发送 → 流式中变为停止按钮（点击取消当前 turn）

## 代码导览

- `src/chat.page.yaml` — 对话页 DSL：无侧栏形态 `Chat` 节点（greeting / suggestions / conversationId 取路由 query）+ 内建 header（`title` / `editableTitle` / `headerActions: [export, theme, clear]`）+ 内建模型选择（`models` + 受控 `model` ↔ `onModelChange`）+ 内建上下文源（`contexts`：`@` 智能体 / `+` 上下文，service 引用）+ 消息操作条（`messageActions`：内建 edit 覆盖 label + 自定义 quote 动作 service 派发，`events.onMessageAction` 接 toast）+ 产出物面板受控闭环（`onArtifact` / `onPanelClose` → setState）
- `src/agents.page.yaml` — 智能体列表页 DSL：mock 卡片列表，点击经 `navigate` 动作跳 `/chat?id=xxx`
- `src/settings.page.yaml` — 设置表单页 DSL：Form 提交 → setState 保存回显 + message 提示
- `src/main.tsx` — 入口：引入 `@pactor-app/ui/styles.css`（shadcn 交互层样式）、`@pactor-app/chat/styles.css` 皮肤、`katex/dist/katex.min.css`（公式渲染）与 `app.css`，渲染 `App`
- `src/App.tsx` — 宿主装配：`HashRouter` + `MenuRegistry`（三页菜单）+ 根部 `ChatServicesProvider` 注入全部运行时服务（transport / safeRegistry / capabilities / confirm / 附件伪上传 / `callService` 服务桥，useMemo 保持稳定引用；store 由 chat 页嵌套 provider 按会话注入）+ `ChatShell` 外壳（menu 映射自 registry 可见树，`onMenuSelect` → `bridge.push`）+ `DynamicDslRoute` 出口按 pageId 建 PageRuntime（组件注册表 = shadcn 全集 + `registerChatComponent`；动作注册表扩展 `navigate`（委托 router adapter）与 `message`（toast）；注入 `route.params/query`）。聊天页结构与弹层全部为包内建特性，宿主零槽位组件
- `vite.config.ts` — 接入 `pactor()` 插件（`*.page.yaml` 编译为 JS 模块）
- `src/dsl-modules.d.ts` — `*.page.yaml` 模块类型声明
- `src/mock-data.ts` — mock 数据：`@` 智能体与 `+` 上下文候选（纯静态，经 `callService` 服务桥提供给包内建弹层）
- `src/attachments.ts` — `readAsAttachment`：File 读为 data URL 伪上传
- `src/mock-ai.ts` — mock `ChatTransport`：async generator 按意图分片产出 `ChatEvent`（`tool.start` 携带 `args`；artifact 事件产出 markdown / code / dsl 三种 kind 产出物），模拟 SSE 节奏；回复开头注明 `input.model` / `input.contexts`（演示内建模型选择与上下文 chips 的输入载荷）；真实接入时替换为对接服务端的实现
- `src/safe-registry.ts` — Safe Registry 白名单（`createSafeRegistry` 包装 @pactor-app/ui 的 `createShadcnComponentRegistry`）
- `src/capabilities.ts` — capability 白名单：`weather.query`（低风险直执行）、`data.export`（高风险，confirm 确认链）

协议细节见文档站 `packages/chat` 页面（`pnpm docs:dev`）。
