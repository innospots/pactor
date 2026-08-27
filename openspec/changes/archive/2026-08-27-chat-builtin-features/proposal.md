# Proposal: chat-builtin-features

## Why

examples/chat 的 App.tsx（443 行）暴露了一个系统性问题：搭建一套可用的对话系统，宿主需要手写 Header、ModelSelector、PlusMenu、MentionListbox、ContextPickerModal 等一大批"通用 but 未下沉"的组件。这些组件里真正的业务内容只有数据（模型列表、上下文候选项），交互骨架（锚定弹层、chip、导出、清空、主题切换）全部通用。框架不把它们做进包，"仅传 DSL 即生成对话系统"的目标就无法达成——DSL 能配页面结构，却配不了一个能用的聊天工作区。

## What Changes

- **内建 header 操作组**：Chat/ChatWorkspace 头部支持可编辑标题与内建操作（导出 Markdown、明暗切换、清空会话），以 DSL 可表达的开关配置（`headerActions`）；各操作触发对应事件（`events.onExport` 等），缺省行为包内实现，事件回调可拦截/扩展
- **内建模型选择器**：新增受控 props `models`（`[{value, label}]`）/ `model` 与事件 `onModelChange`；提供时 Composer 工具栏右端渲染内建模型 chip（Popover 列表），选中值进入 `ChatInput.model` 传给 transport；现有 `toolbarEnd` 槽位共存（内建在前，槽位在后）
- **内建上下文弹层与数据源**：新增 `contexts` 配置（`[{ trigger: '@' | '+', source }]`，`source` 为静态数组或 `{ service: 'name', params? }` 声明式服务引用）；提供时包内渲染内建 +菜单 / @提及弹层（锚定、列表、选中成 chip），选中结果进入受控 chips 状态并经 `onContextsChange` 通知；chips 内容随发送进入 `ChatInput.contexts`；现有 `onPlusMenu` / `onMentionTrigger` 回调保留——提供时优先（覆盖内建弹层），不破坏现有宿主自定义路径
- **examples/chat 瘦身**：删除 Header / ModelSelector / PlusMenu / MentionListbox / ContextPickerModal / CapabilityChip / ContextChips 等组件与相关宿主状态，改为 DSL props + 服务注入；宿主代码收敛为 transport / safeRegistry / capabilities / 数据源 service

无 BREAKING 变更：所有新增 props 缺省不渲染对应 UI，现有 React 槽位与回调路径原样保留。

## Capabilities

### New Capabilities

- `chat-model-selector`: Chat 内建模型选择——models/model 受控 props、onModelChange 事件、选中值进入 ChatInput、内建 Popover chip 与工具栏槽位共存规则
- `chat-context-sources`: Chat 内建上下文弹层——contexts 声明式配置（静态数组 / service 引用）、内建 +/@ 锚定弹层、chips 受控状态与 onContextsChange 事件、选中内容进入 ChatInput、与 onPlusMenu/onMentionTrigger 回调的优先级规则

### Modified Capabilities

- `chat-dsl-component`: DSL 安全 props 扩展（models / model / contexts / headerActions），Header 配置需求扩展内建操作组，新增 onModelChange / onContextsChange / onExport 等事件绑定
- `chat-composer-extensions`: 工具栏与提及扩展槽需求扩展——内建模型 chip 与内建 +/@ 弹层的渲染条件、与调用方回调/槽位的共存与覆盖规则
- `chat-streaming`: ChatInput 扩展可选 `model` 与 `contexts` 字段（transport 输入契约）
- `example-chat`: 示例改为消费内建特性，删除宿主槽位组件，验证瘦身后的装配形态

## Impact

- `packages/chat`：Composer（内建模型 chip / 内建弹层入口）、ChatComposition / Chat / ChatWorkspace（新 props 与事件透传）、transport（ChatInput 字段扩展）、内建 header 操作组实现（导出复用 markdown 序列化）、styles.css（内建弹层/chip 样式，组件样式自持契约不变）
- `examples/chat`：App.tsx 与组件目录大幅删减；chat.page.yaml 增配 models / contexts / headerActions
- 依赖：无新增运行时依赖——内建弹层在 chat 包内自实现锚定弹层（保持 chat 对 pactor-ui 的零运行时依赖契约，见 ChatLayout 注释）；contexts 的 service 引用经注入的服务桥解析
