# Spec Delta: example-chat

## MODIFIED Requirements

### Requirement: DSL 页面驱动

示例的聊天页面 SHALL 以 DSL 声明（`*.page.yaml` 经 vite-plugin-dsl 编译），页面 body 为一等组件 `Chat` 节点——左侧菜单、header（含内建操作组与可编辑标题）、title、greeting、suggestions、models、contexts 等均由 YAML 配置，交互经 `events.*` + DSL state 表达。宿主装配代码 SHALL 仅负责：以 `ChatServicesProvider` 注入服务（transport / safeRegistry / capabilities / 附件伪上传 / callService 服务桥）、`registerChatComponent` 注册组件、菜单注册表与路由出口装配、`createPageRuntime` 渲染。示例 MUST NOT 包含 Header / ModelSelector / PlusMenu / MentionListbox / ContextPickerModal / CapabilityChip / ContextChips 等宿主槽位组件——对应能力由包内建特性承担。

#### Scenario: YAML 声明页面

- **WHEN** 查看 examples/chat 源码
- **THEN** 存在 chat.page.yaml 以 Chat 组件声明页面（含 menu/headerActions/models/contexts/greeting/suggestions），宿主入口无聊天结构 JSX，components/ 目录无槽位组件

#### Scenario: 功能不回退

- **WHEN** 启动示例
- **THEN** 既有演示能力（mock 场景、Safe Registry、capability 确认链、附件伪上传、上下文选择与 chips、模型切换、导出、明暗切换、清空、侧栏）全部可用

## REMOVED Requirements

### Requirement: 自定义槽位 UI 经 kit 原语构建

**Reason**: 槽位自定义 UI（顶栏、模型选择器、上下文选择器、提及列表、"+"菜单）全部下沉为包内建特性（chat-model-selector / chat-context-sources / chat-dsl-component 内建 header 操作组），示例不再包含宿主槽位组件，该要求的约束对象不复存在。包内建 UI 的视觉完整性由 chat 组件样式自持契约（chat-self-contained-styles）承接。

**Migration**: 参考历史实现的宿主应迁移到内建 props：`models` / `contexts` / `headerActions` / `editableTitle`；确需自定义弹层的场景仍可注入 `onPlusMenu` / `onMentionTrigger` 回调与 toolbar 槽（优先级高于内建实现）。
