# Spec Delta: example-chat

## ADDED Requirements

### Requirement: 默认形态对齐参考布局

示例的对话页 SHALL 对齐主流 AI 对话产品默认形态（chat-default-skin 变更）：`modelPlacement: 'header'` 呈现极简头部（仅模型选择）；空态下问候语与 Composer 垂直居中成组；侧栏含品牌行（collapsible 折叠）、功能菜单（badge）、「最近」分组会话列表（dot 状态点）与 sidebarFooter 底部卡片（DSL 声明）。示例 MUST NOT 为上述布局编写私有 CSS——布局全部由 pactor-chat 包内样式承担，示例私有样式表仍只允许承载宿主页面壳与品牌色等自有视觉。

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
