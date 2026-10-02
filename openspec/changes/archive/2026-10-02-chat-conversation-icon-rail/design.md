# chat-conversation-icon-rail 设计

## Context

ChatPage（`packages/ui/src/components/chat/ChatPage/index.tsx`）对话区 header 右侧目前有一个「缺省产物区开关」：未配置 `conversationHeaderAction` 时固定渲染 `panel-right-open/close` 图标按钮（index.tsx:310-318）。产物区经 `artifactOpen`（受控/非受控）+ 右侧 `PanelGroup` 分栏展示（index.tsx:501-513）。组件已有「图标栏」概念但仅用于最左全局导航（`railItems`，chat-page-rail）。对话级附加信息（产物、执行步骤等）除产物区外没有扩展入口。

参考截图：右侧纵向图标列（宽度约 40px），点击图标在其左侧浮出圆角弹层（会话信息：用量 / 上下文来源），弹层不占布局空间。

## Goals / Non-Goals

**Goals:**

- header 只保留标题；图标类入口收敛到 header 下方的对话图标栏（conversation rail）
- 图标栏项可配置，点击 toggle 展示对应附加内容，支持 panel / popover 两种形态
- 产物区能力（预览 / 目录树 / 下载 / 受控开关）原样保留，入口迁为图标栏内置项
- 纯 React props 可用；DSL 槽位（DslNode）与现有 composerFooter 等槽位同款渲染路径

**Non-Goals:**

- 不改动 ArtifactPanel 内部实现与产物数据模型
- 不实现附加内容本身（执行步骤视图等由宿主提供内容，本变更只给容器与交互）
- 不改 `@pactor-app/chat` DSL Chat 组件的 props 映射（需要时后续单独变更）

## Decisions

### D1：header 缺省图标移除，而非换位保留

`conversationHeaderAction` 未配置时 header 右侧渲染为空（现状是渲染缺省产物开关）。产物入口迁到图标栏内置项，能力不丢失。理由：用户明确要求 header 不再默认展示图标；保留一个「默认产物钮」违背初衷。

### D2：图标栏位于对话区右缘、header 下方

布局：`__main` 主区域内改为 `header + (conversation body | rail)` 的横向 flex——rail 是 header 下方、对话区最右的窄列（宽经令牌 `--pactor-chat-rail-width` 缺省 40px），图标自上而下。不复用最左 `chat-page-rail`（那是全局导航，语义不同）。备选：rail 通栏全高贴右缘（截图样式）——否决，用户明确说「在 Header 的下方」。

### D3：附加内容统一抽象 `ConversationRailItem`，产物为首内置项

```ts
interface ConversationRailItem {
  key: string;
  icon?: string;
  label?: string;            // tooltip
  display?: 'panel' | 'popover';  // 缺省 popover
  content?: DslNode | ReactNode;  // popover 弹层 / panel 侧栏内容（产物项缺省为内建 ArtifactPanel）
}
```

- 新 prop `conversationRailItems?: ConversationRailItem[]`：附加自定义项（如执行步骤）。
- 内置 artifact 项：缺省渲染在图标栏首位（`key: 'artifact'`，图标 `panel-right-open/close` 随开关态切换），点击走现有 `open`/`setOpen` 状态机与受控闭环（`artifactOpen` + `onArtifactOpenChange` 语义不变）；新 prop `hideArtifactRailItem?: boolean` 可隐藏。理由：产物是当前唯一对话附加内容，默认保留入口避免功能回退；显式可关。

备选：artifact 项也走 `conversationRailItems` 显式声明——否决，会让所有现有宿主丢失产物入口（破坏性更大）。

### D4：panel / popover 两形态共用同一 active 状态机

- 非受控：`activeRailKey`（`string | null`）内部维护；受控：`activeConversationRailKey` + `onConversationRailChange`（与组件既有受控模式一致）。点击同 key → 收起（null）；点击异 key → 切换。
- artifact 项的 active 状态独立沿用 `open`（不进 `activeRailKey`），保持 `artifactOpen` 受控契约不变。
- **panel 形态**：渲染进现有右侧分栏位（PanelGroup 第二栏），与产物面板互斥——同一时刻至多一个 panel；panel 项 active 时若产物区开着，以 active 项内容为准（产物区视为被切换走，`setOpen(false)`）。
- **popover 形态**：绝对定位浮层（rail 左侧、header 下缘之下，`right: rail宽度 + 8px`），宽令牌 `--pactor-chat-rail-popover-width` 缺省 320px；Esc / 点击外部 / 再次点击图标关闭。不占布局空间，不与 panel 互斥，但同一时刻至多一个 popover。

备选：popover 用 ui 的 Popover 原语——评估后选绝对定位自绘：需要相对 rail 列定位且切换时不卸载内容动画简单，Popover 原语的 trigger 受控模型反而绕。

### D5：内容渲染走既有槽位路径

`content` 为 React 元素直接渲染，普通对象按 DslNode 经 `useRenderer().renderChildren`（复用 index.tsx:250-253 的 `renderSlot`），与 composerFooter / composerBottom 一致。

## Risks / Trade-offs

- [宿主依赖 header 缺省产物开关（现状行为）] → BREAKING 已在 proposal 标注；产物入口默认仍在图标栏，用户可发现性不丢失；版本按 minor 发布并在 changelog 说明
- [panel 项与产物区互斥的状态同步（受控 artifactOpen 宿主）] → 切换 panel 项时经 `onArtifactOpenChange(false)` 通知宿主闭环，避免受控态撕裂
- [popover 在窄屏 / 对话区过窄时溢出] → popover 宽度令牌 + `max-width: calc(100% - 2rem)` 约束；窄屏（<768px）popover 与 panel 行为同桌面（对话区本就铺满）
- [图标栏为空时的 DOM] → `conversationRailItems` 为空且 `hideArtifactRailItem` 时整栏不渲染（不残留 40px 空列）

## Open Questions

- 图标栏是否需要底部附加区（如设置钮，仿 railFooterItems）？——本期不做，需要时加 `conversationRailFooterItems`
- popover 内容高度策略（内容自适应 vs 固定高滚动）？——实现时按截图取内容自适应 + `max-height` 滚动
