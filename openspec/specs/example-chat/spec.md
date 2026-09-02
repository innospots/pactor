# Spec: example-chat

## Requirements

### Requirement: 可启动可构建

`example-chat` SHALL 为 pnpm workspace 成员（private）：`pnpm --filter example-chat dev` 在 5399 端口启动 vite dev；`pnpm --filter example-chat build` 构建成功。示例 MUST NOT 导致根级 `pnpm -r --if-present build/test/typecheck` 失败。

#### Scenario: 构建成功

- **WHEN** 执行 `pnpm --filter example-chat build`
- **THEN** vite 构建成功，无类型错误

### Requirement: 流式对话演示

示例 SHALL 提供 mock `ChatTransport`（async generator，分片延迟模拟流式节奏），经 `runChatTurn` 驱动 `ConversationStore`；按用户输入意图 SHALL 覆盖全部主要 part 类型：thinking、markdown、tool-call / tool-result、dsl、text。

#### Scenario: 流式 markdown 回复

- **WHEN** 发送普通提问
- **THEN** assistant 消息先出现 thinking part，随后 markdown 正文逐片增长，最终消息状态为 completed

#### Scenario: 工具调用

- **WHEN** 发送含「天气」的提问
- **THEN** 依次呈现 thinking、weather.query 工具调用 part（running → success）与 markdown 结论

### Requirement: AI DSL 安全渲染

示例 SHALL 以 Safe Registry 白名单渲染 LLM 下发的 dsl part，白名单组件来自 `@pactor/ui`（shadcn）；白名单外组件类型 SHALL 渲染为 ChatDenied 受控占位，不抛错、不执行。示例 MUST NOT 依赖 antd——toast/confirm 等反馈经 `@pactor/ui` 交互层（createUiBridge + ShadcnInteractionProvider）或等价手段实现。

#### Scenario: 白名单内 DSL 卡片

- **WHEN** 发送含「报表」的提问
- **THEN** dsl part 渲染为白名单组件（Flex / Card / Statistic / Alert）组成的统计卡片（shadcn 实现）

#### Scenario: 白名单外类型受控占位

- **WHEN** mock 下发含白名单外类型（如 Table）的 dsl part
- **THEN** 该节点渲染为 ChatDenied 占位，其余白名单节点正常渲染

### Requirement: capability 确认链

示例 SHALL 注册 capability 白名单（`weather.query` 低风险、`data.export` 高风险）；高风险 capability 经 `confirm` 确认后执行，取消 SHALL 以 skipped 收尾，未确认前 MUST NOT 执行。

#### Scenario: 高风险确认执行

- **WHEN** 发送含「导出」的提问并点击 DSL 卡片中的导出按钮，在确认框中选择确定
- **THEN** capability 动作执行并返回 mock 导出结果

#### Scenario: 取消不执行

- **WHEN** 点击导出按钮后在确认框中选择取消
- **THEN** capability 不执行，动作以 skipped 收尾

## ADDED Requirements

### Requirement: DSL 页面驱动

示例的聊天页面 SHALL 以 DSL 声明（`*.page.yaml` 经 vite-plugin-dsl 编译），页面 body 为一等组件 `Chat` 节点——左侧菜单、header（含内建操作组与可编辑标题）、title、greeting、suggestions、models、contexts 等均由 YAML 配置，交互经 `events.*` + DSL state 表达。宿主装配代码 SHALL 仅负责：以 `ChatServicesProvider` 注入服务（transport / safeRegistry / capabilities / 附件伪上传 / callService 服务桥）、`registerChatComponent` 注册组件、菜单注册表与路由出口装配、`createPageRuntime` 渲染。示例 MUST NOT 包含 Header / ModelSelector / PlusMenu / MentionListbox / ContextPickerModal / CapabilityChip / ContextChips 等宿主槽位组件——对应能力由包内建特性承担。

#### Scenario: YAML 声明页面

- **WHEN** 查看 examples/chat 源码
- **THEN** 存在 chat.page.yaml 以 Chat 组件声明页面（含 menu/headerActions/models/contexts/greeting/suggestions），宿主入口无聊天结构 JSX，components/ 目录无槽位组件

#### Scenario: 功能不回退

- **WHEN** 启动示例
- **THEN** 既有演示能力（mock 场景、Safe Registry、capability 确认链、附件伪上传、上下文选择与 chips、模型切换、导出、明暗切换、清空、侧栏）全部可用

### Requirement: 默认形态对齐参考布局

示例的对话页 SHALL 对齐主流 AI 对话产品默认形态（chat-default-skin 变更）：`modelPlacement: 'header'` 呈现极简头部（仅模型选择）；空态下问候语与 Composer 垂直居中成组；侧栏含品牌行（collapsible 折叠）、功能菜单（badge）、「最近」分组会话列表（dot 状态点）与 sidebarFooter 底部卡片（DSL 声明）。示例 MUST NOT 为上述布局编写私有 CSS——布局全部由 @pactor/chat 包内样式承担，示例私有样式表仍只允许承载宿主页面壳与品牌色等自有视觉。

#### Scenario: 空态居中组可见

- **WHEN** 打开对话页（空会话）
- **THEN** 问候语与 Composer 在工作区垂直居中成组，头部仅显示模型选择

#### Scenario: 侧栏参考形态

- **WHEN** 查看侧栏
- **THEN** 可见品牌行与折叠按钮、带 badge 的功能菜单、「最近」分组（含 dot 状态点）与底部卡片

#### Scenario: 折叠为图标栏

- **WHEN** 点击侧栏折叠按钮
- **THEN** 侧栏收窄为图标栏，再次点击恢复

#### Scenario: 功能不回退

- **WHEN** 发送消息并体验既有演示能力
- **THEN** 消息列表 + 钉底 Composer 布局恢复，流式回复 / 面板 / chips / 模型切换等全部可用

