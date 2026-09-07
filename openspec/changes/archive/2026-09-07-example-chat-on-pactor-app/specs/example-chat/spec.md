# Delta: example-chat

## MODIFIED Requirements

### Requirement: DSL 页面驱动

示例的聊天页面 SHALL 以 DSL 声明（`*.page.yaml` 经 vite-plugin-dsl 编译），页面 body 为一等组件 `Chat` 节点——左侧菜单、header（含内建操作组与可编辑标题）、title、greeting、suggestions、models、contexts 等均由 YAML 配置，交互经 `events.*` + DSL state 表达。示例应用 SHALL 以 `createPactorApplication`（`pactor-app` 一站式 API）装配：菜单与布局由 bootstrap 资源下发（本地 mock 经 `StaticDslLoader` 喂入），宿主装配代码 SHALL 仅负责：提供 loader（bootstrap + 页面 DSL 静态导入）、`services`、`providers`（经 `ChatServicesProvider` 注入 transport / safeRegistry / capabilities / 附件伪上传 / callService 服务桥 / 按会话缓存的 store）、`componentRegistry`（含 `registerChatComponent`）、`layoutRegistry`（chat 外壳布局）与必要的 `actions`。宿主 MUST NOT 包含手写路由（HashRouter / Routes）、菜单注册表装配、路由出口（DynamicDslRoute）或逐页 `createPageRuntime` 调用，也 MUST NOT 包含 Header / ModelSelector / PlusMenu / MentionListbox / ContextPickerModal / CapabilityChip / ContextChips 等槽位组件——对应能力由框架与包内建特性承担。

#### Scenario: YAML 声明页面

- **WHEN** 查看 examples/chat 源码
- **THEN** 存在 chat.page.yaml 以 Chat 组件声明页面（含 menu/headerActions/models/contexts/greeting/suggestions），宿主入口为 createPactorApplication 调用，无路由 / 菜单注册表 / 页面运行时装配代码，无聊天结构槽位组件

#### Scenario: 功能不回退

- **WHEN** 启动示例
- **THEN** 既有演示能力（mock 场景、Safe Registry、capability 确认链、附件伪上传、上下文选择与 chips、模型切换、导出、明暗切换、清空、侧栏）全部可用

## ADDED Requirements

### Requirement: bootstrap 下发菜单与 chat 布局

示例的菜单（功能菜单：对话 / 我的智能体 / 系统设置，含 badge 演示；「最近」分组历史会话，含 group / dot 扩展字段）与布局（`layout.type: 'chat'`）SHALL 由模拟 bootstrap 资源下发，对齐 examples/admin 的 bootstrap 模式。示例 SHALL 经 `layoutRegistry` 选项注册 chat 外壳布局：以 ChatShell 渲染品牌行（collapsible 折叠）、功能菜单、「最近」分组与 sidebarFooter 用户卡；菜单点击经应用导航桥跳转（历史会话 `/chat?id=<key>` 约定），高亮由当前 URL 推导（含 `?id=` 命中历史会话项的修正）。

#### Scenario: 菜单来自 bootstrap

- **WHEN** 启动示例并查看侧栏
- **THEN** 菜单树与分组（含 badge / dot）与 bootstrap 资源一致，宿主代码中无菜单数据之外的菜单装配逻辑

#### Scenario: 菜单导航

- **WHEN** 点击「最近」分组的历史会话项
- **THEN** URL 变为 /chat?id=\<key\>，聊天页切换到对应会话，且该菜单项高亮

### Requirement: 会话切换不丢消息

示例 SHALL 按会话 id 缓存 `ConversationStore`（宿主 Map 缓存，经 providers 槽按当前 `route.query.id` 就近注入）；在「最近」历史会话与默认会话间切换、或切换到其他页面再返回后，既有消息 MUST NOT 丢失。

#### Scenario: 历史会话往返

- **WHEN** 在会话 A 发送消息收到回复，切换到会话 B 再切回会话 A
- **THEN** 会话 A 的消息列表完整保留
