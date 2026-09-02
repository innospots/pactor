# Spec: chat-composer-extensions

Composer 增强（`@pactor/chat`）：IME 守卫、发送按钮状态、附件引用、扩展槽。

### Requirement: IME 合成守卫

Composer SHALL 跟踪输入法合成状态（compositionstart/compositionend，必要时以 keydown.isComposing 兜底）；合成进行中按 Enter MUST NOT 触发发送，仅结束合成。

#### Scenario: 中文输入不误发送

- **WHEN** IME 合成进行中按 Enter
- **THEN** 不触发 onSend，合成正常上屏

### Requirement: 发送按钮状态机

发送按钮 SHALL 呈现状态：空文本时禁用；有文本时可用；store 存在 pending/streaming 消息时变为停止按钮（视觉上有进行中指示），点击取消当前 turn。空闲/可用/停止三态 MUST 为同一按钮元素的状态切换。

#### Scenario: 输入使能发送

- **WHEN** 输入非空文本
- **THEN** 发送按钮由禁用变为可用

#### Scenario: 流式中变为停止

- **WHEN** turn 进行中
- **THEN** 按钮呈现停止态并带进行中视觉指示，点击后消息以 cancelled 收尾

### Requirement: 附件引用卡片

SHALL 定义 `ChatAttachment`（`id` / `name` / `mimeType` / `size?` / `url?`）并支持 `ChatMessage.attachments?`。Composer SHALL 以受控方式接受 `attachments` + `onAttachmentsChange`：图片类型渲染缩略图卡片，其他类型渲染图标 + 名称 + 大小卡片；每张卡片提供移除操作。Composer SHALL 内建拖拽悬停视觉态与文件粘贴/选择入口，产出 `File[]` 经 `onAttachFiles(files)` 回调交给调用方（上传与存储 MUST 由调用方实现，包内不发起网络请求）。点击附件卡片 SHALL 经 `onAttachmentClick` 通知调用方。

#### Scenario: 渲染附件卡片

- **WHEN** attachments 含一张图片与一个 PDF
- **THEN** 图片渲染为缩略图，PDF 渲染为图标 + 名称 + 大小卡片

#### Scenario: 粘贴文件交给调用方

- **WHEN** 用户粘贴一个文件
- **THEN** onAttachFiles 以该 File 被调用，包内不自行上传

#### Scenario: 移除附件

- **WHEN** 点击卡片上的移除按钮
- **THEN** onAttachmentsChange 以移除后的数组被调用

### Requirement: 工具栏与提及扩展槽

Composer SHALL 提供 `toolbarStart` / `toolbarEnd` 渲染槽（ReactNode），调用方可注入选择器 chip 等控件。Composer SHALL 提供提及与菜单触发扩展点：检测到词边界 `@` 时调用 `onMentionTrigger(query, anchorRect)`，点击 "+" 按钮时调用 `onPlusMenu(anchorRect)`；弹层内容由调用方渲染。

内建特性（chat-model-selector / chat-context-sources）与扩展槽 SHALL 共存：内建模型 chip 渲染在 `toolbarEnd` 槽位内容之前；内建上下文 chips 渲染在输入区上方、与工具栏槽互不影响。调用方 `onPlusMenu` / `onMentionTrigger` 回调提供时 MUST 优先于对应内建弹层（内建实现不启用）；回调与 contexts 配置均未提供时 MUST NOT 渲染相应入口。

#### Scenario: 注入工具栏控件

- **WHEN** 调用方传入 toolbarEnd 内容
- **THEN** 该内容渲染在 Composer 工具栏右侧（内建模型 chip 存在时位于其后）

#### Scenario: 未提供回调且无内建配置则无入口

- **WHEN** 未传 onPlusMenu 且未配置 `trigger: '+'` 的 contexts
- **THEN** 不渲染 "+" 按钮

#### Scenario: 提及触发

- **WHEN** 注入 onMentionTrigger（无论是否配置 contexts），输入 "@abc"
- **THEN** onMentionTrigger 以 query "abc" 与锚点位置被调用，内建提及弹层不出现

#### Scenario: 内建弹层兜底

- **WHEN** 未注入 onMentionTrigger 但配置了 `trigger: '@'` 的 contexts，输入 "@abc"
- **THEN** 打开内建提及弹层并按 "abc" 过滤候选
