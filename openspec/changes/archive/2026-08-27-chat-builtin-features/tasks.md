# Tasks: chat-builtin-features

## 1. transport 契约扩展（chat-streaming）

- [x] 1.1 `packages/chat/src/transport.ts`：`ChatInput` 增加 `model?: string` 与 `contexts?: ChatContextItem[]`；`ChatContextItem = { id: string; label: string; trigger?: '@' | '+'; data?: unknown }` 定义在 model.ts 并导出
- [x] 1.2 补测试：runChatTurn 透传 model/contexts 给 transport.send（spy 断言 input 字段）

## 2. 服务桥（chat-context-sources 依赖）

- [x] 2.1 `packages/chat/src/chat-workspace.tsx`（ChatServices 同型）：`ChatServices` 增加 `callService?: (name: string, params?: Record<string, unknown>) => Promise<unknown>`，index.ts 导出类型
- [x] 2.2 补测试：ChatServicesProvider 透传 callService

## 3. 内建锚定弹层（设计决策 D3）

- [x] 3.1 `packages/chat/src/view/AnchoredPopover.tsx`（内部组件不导出）：anchorRect 定位（上方优先、不足翻转）、Escape / 外部点击关闭、焦点管理；样式进 `packages/chat/styles.css`，只用语义令牌
- [x] 3.2 补测试：定位翻转、Escape 关闭、外部点击关闭

## 4. 内建模型选择（chat-model-selector）

- [x] 4.1 ChatView/Composer 链路：`models` / `model` / `onModelChange` props 透传；Composer 工具栏右端渲染内建模型 chip（AnchoredPopover 列表，选中标记），位于 toolbarEnd 槽内容之前；models 缺省不渲染
- [x] 4.2 受控规则（决策 D5）：model + onModelChange 受控；仅 models 非受控缺省 models[0]
- [x] 4.3 发送时 model 进 ChatInput；未配置 models 时为 undefined
- [x] 4.4 补测试：受控/非受控、chip 渲染条件、发送携带 model

## 5. 内建上下文弹层与 chips（chat-context-sources）

- [x] 5.1 contexts 配置解析：静态 items 直用；service 引用经 callService 解析，会话级缓存，未注入 callService 时弹层内联错误提示
- [x] 5.2 内建提及弹层：复用 Composer 既有 @ 检测，按 query 过滤；内建 + 菜单弹层（trigger '+' source 存在才渲染入口）；onPlusMenu/onMentionTrigger 提供时优先（内建不启用）
- [x] 5.3 chips 状态：选中追加（同 source 同 id 去重）、单独移除、onContextsChange 通知、发送后清空；chips 渲染在输入区上方
- [x] 5.4 发送时 chips 进 ChatInput.contexts（不进 text）
- [x] 5.5 补测试：静态/service 源、去重、清空、回调优先级、ChatInput 载荷

## 6. 内建 header 操作组（chat-dsl-component / Header 配置）

- [x] 6.1 ChatComposition 内建 header：`headerActions` 按序渲染 export/theme/clear 图标按钮（headerExtra 槽之前）；`editableTitle` 标题编辑（Enter/blur 提交）
- [x] 6.2 默认行为：export 序列化 store 消息为 Markdown 并下载（参考 examples/chat/src/export-markdown.ts 逻辑下沉）；theme 切换 documentElement 的 data-pactor-theme；clear 调 store.clear()
- [x] 6.3 并行事件：onExport / onThemeChange(event.theme) / onClear / onTitleChange(event.title)；ChatDslAdapter 折算进 event 作用域
- [x] 6.4 补测试：各操作默认行为 + 事件触发、缺省不渲染

## 7. DSL 组件接线（chat-dsl-component）

- [x] 7.1 Chat/ChatWorkspace props 扩展：models/model/contexts/headerActions/editableTitle + onModelChange/onContextsChange/onExport/onThemeChange/onClear/onTitleChange，经 ChatComposition 透传到 Composer/header
- [x] 7.2 ChatDslAdapter 折算新事件（event.model / event.contexts / event.title / event.theme）
- [x] 7.3 补测试：DSL 适配层事件对象形态

## 8. examples/chat 瘦身（example-chat）

- [x] 8.1 删除 components/ 下 Header / ModelSelector / PlusMenu / MentionListbox / ContextPickerModal / CapabilityChip / ContextChips 与 App.tsx 中相关状态（弹层/chips/title/theme 管理）
- [x] 8.2 chat.page.yaml 增配：`headerActions: [export, theme, clear]`、`editableTitle: true`、`models`、`contexts`（@ 智能体 + + 上下文，service 引用）；events 接 onModelChange/onContextsChange/onClear 等（message toast）
- [x] 8.3 App.tsx 注入 `callService`（桥到本地 mock 数据函数表）；export-markdown.ts 等被下沉逻辑删除；mock-ai transport 消费 input.model/contexts（演示选中模型影响回复）
- [x] 8.4 app.css 复查：仅保留页面壳/品牌视觉；功能截图走查（天气/报表/导出/面板/模型切换/chips）

## 9. 收尾验证

- [x] 9.1 全仓 `pnpm -r --if-present build && pnpm -r --if-present test && pnpm -r --if-present typecheck` 全绿
- [x] 9.2 playwright 视觉验收：对话页（含 chips、模型 chip、内建 header 操作）、@弹层、+菜单、明暗切换、面板开闭与拖拽
- [x] 9.3 文档：docs 相关页（packages/chat、guides/custom-components 如涉及）同步新 props/事件
