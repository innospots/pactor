# Delta: chat-artifact-panel

## MODIFIED Requirements

### Requirement: ArtifactPanel 视图与内建渲染器

SHALL 导出 `ArtifactPanel` 组件：标题栏（标题 + 可选角标 + 关闭按钮）+ 内容区；内容按 `artifact.kind` 分发内建渲染器——`markdown` 经 @pactor-app/markdown 安全渲染、`code` 渲染只读代码块（language 作角标）、`text` 渲染预格式文本、`dsl` 经 Safe Registry 守卫 + renderChildren 活预览。渲染被守卫拦截或失败时 SHALL 渲染受控降级块，MUST NOT 抛错。关闭按钮点击 SHALL 触发 `onClose` 回调。

标题栏 SHALL 优先经 chat chrome DSL 渲染层以宿主组件（Text / Badge / Button / Icon 等）组合渲染（见 chat-chrome-dsl），关闭经 `chat.panelClose` 内建动作接回 `onClose` 回调；无 renderer 环境或类型缺失时回退手写标题栏。内容区内建渲染器、拖拽调宽与受控降级链 MUST 保持 chat 实现。

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
