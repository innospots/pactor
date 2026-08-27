# Spec Delta: chat-composer-extensions

## MODIFIED Requirements

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
