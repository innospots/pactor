# Spec: chat-artifact-panel

产出物预览面板（`pactor-chat`）：ChatArtifact 模型与 ArtifactStore、ArtifactPanel 视图与内建渲染器、artifact 消息 part、面板布局与响应式。

### Requirement: 产出物模型与 ArtifactStore

`pactor-chat` SHALL 定义 `ChatArtifact` 类型：`{ id: string; kind: 'markdown' | 'code' | 'text' | 'dsl'; title: string; content: string | DslNode; language?: string; meta?: Record<string, unknown> }`（`dsl` kind 的 content 为 DslNode 普通对象，其余为字符串）。SHALL 导出 `ArtifactStore`：`get()` / `subscribe()` / `open(artifact)` / `update(patch)` / `close()`，语义与 ConversationStore 同模式（可注入、可自持）。

#### Scenario: store 开合与订阅

- **WHEN** 调用 open(artifact) 后订阅者收到通知且 get() 返回该 artifact，随后调用 close()
- **THEN** get() 返回 null，订阅者再次收到通知

#### Scenario: 部分更新

- **WHEN** open 后调用 update({ title: '新标题' })
- **THEN** get() 返回的 artifact title 已更新且其余字段不变

### Requirement: ArtifactPanel 视图与内建渲染器

SHALL 导出 `ArtifactPanel` 组件：标题栏（标题 + 可选角标 + 关闭按钮）+ 内容区；内容按 `artifact.kind` 分发内建渲染器——`markdown` 经 pactor-markdown 安全渲染、`code` 渲染只读代码块（language 作角标）、`text` 渲染预格式文本、`dsl` 经 Safe Registry 守卫 + renderChildren 活预览。渲染被守卫拦截或失败时 SHALL 渲染受控降级块，MUST NOT 抛错。关闭按钮点击 SHALL 触发 `onClose` 回调。

#### Scenario: markdown 产出物渲染

- **WHEN** artifact kind 为 markdown 且 content 含标题语法
- **THEN** 面板内容区渲染对应 HTML，原始 HTML 不注入

#### Scenario: dsl 产出物活预览

- **WHEN** artifact kind 为 dsl 且 content 为白名单组件的 DslNode
- **THEN** 面板内经 renderChildren 渲染该节点

#### Scenario: dsl 产出物被守卫拦截

- **WHEN** artifact kind 为 dsl 且 content 含非白名单组件类型
- **THEN** 渲染受控降级块，不抛错

#### Scenario: 关闭回调

- **WHEN** 点击面板关闭按钮
- **THEN** 触发 onClose，面板本身不单方面修改外部状态

### Requirement: artifact 消息 part

`ChatPart` 联合 SHALL 新增 `{ id?: string; type: 'artifact'; artifact: ChatArtifact; status?: PartStatus }`。PartRenderer SHALL 将消息流内的 artifact part 内联渲染为"产出物卡片"（标题 + kind 角标 + 打开按钮）；点击打开按钮 SHALL 触发面板打开路径（store.open 或宿主回调）。

#### Scenario: 消息流内产出物卡片

- **WHEN** assistant 消息含 artifact part
- **THEN** 消息区渲染产出物卡片而非原始 JSON

#### Scenario: 卡片打开面板

- **WHEN** 点击产出物卡片的打开按钮
- **THEN** 面板以该 artifact 打开

### Requirement: 面板布局与响应式

提供面板时（打开态）SHALL 在工作区右侧以固定宽栏渲染（宽度经 CSS 变量 `--pactor-chat-inspector-width` 可调，缺省约 320px）；窄屏（<768px，与 AppShell 断点一致）SHALL 退化为右侧覆盖抽屉（遮罩点击关闭）。面板关闭/未配置时 MUST NOT 渲染面板 DOM。

#### Scenario: 桌面并排

- **WHEN** 桌面视口打开面板
- **THEN** 对话区与面板在 flex 行内并排，对话区宽度自适应收缩

#### Scenario: 窄屏覆盖

- **WHEN** 窄屏视口打开面板并点击遮罩
- **THEN** 面板关闭

#### Scenario: 缺省不渲染

- **WHEN** 未配置 artifact 且面板未打开
- **THEN** DOM 中不存在面板节点
