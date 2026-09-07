# Delta: chat-view

## ADDED Requirements

### Requirement: 图标统一经 ui Icon

chat 视图（含 fallback 与 bespoke 路径）的图标 SHALL 一律经 `@pactor-app/ui` 的 `Icon` 组件渲染（白名单名称 + `normalizeIconName` 归一化），MUST NOT 直接依赖 lucide-react；ui Icon 白名单 SHALL 覆盖 chat 全部既有图标与契约图标名（含 menu.icon / messageActions[].icon 的既有取值，未知名由 ui Icon 渲染占位图标，不抛错）。

#### Scenario: 直接引用替换

- **WHEN** 查看 packages/chat 源码
- **THEN** 无 `from 'lucide-react'` 引用，图标均经 ui Icon（名称形式）渲染

#### Scenario: 契约图标名直通

- **WHEN** menu 项 icon 为 `chat` / `history`、消息操作 icon 为 `share` / `quote` / `rotate-ccw`
- **THEN** 均按既有语义渲染对应图标（未知名渲染占位，不抛错）
