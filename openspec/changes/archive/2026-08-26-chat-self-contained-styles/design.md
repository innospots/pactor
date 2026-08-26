# Design: chat-self-contained-styles

## Context

现状问题（实测：不引 app.css 即错乱）：

1. `.pactor-chat-shell { height: 100dvh }`、`.pactor-chat-layout { height: 100vh }` 硬编码视口高——嵌入在顶栏之下（或任何非视口容器）时溢出，调用端必须写覆盖规则；
2. 对话列限宽居中（768px）、面板打开时"对话列居中 + 面板贴右"的布局逻辑写在 examples/chat/app.css——属组件结构职责；
3. examples/admin 靠 `.ai-workspace-chat` 定高规则兜底。

组件契约目标：**`import 'pactor-chat/styles.css'` 后组件即完整可用**；调用端只写自有 UI 的样式与（可选的）令牌覆盖。

## Goals / Non-Goals

**Goals:**

- shell/layout/workspace 高度语义改为"填满父容器"，嵌入任意定高容器即正确；
- 对话列居中、面板贴右等结构布局下沉为包内缺省；
- app.css 瘦身为纯演示 UI 样式；视觉不回归（截图对比）。

**Non-Goals:**

- 不改任何组件 props/事件契约；
- 不为 content 槽内的宿主 DSL 页面（agents/settings 等）定义布局——那是页面职责，包只提供 content 区容器缺省；
- 不做 CSS 作用域隔离（沿用类名前缀约定）。

## Decisions

### D1：高度 = 填满父容器（`height: 100%`）

`.pactor-chat-shell` / `.pactor-chat-layout`：`100dvh`/`100vh` → `height: 100%`（保留 flex 结构与 min-height: 0 链）。父级无定高时百分比退化为内容高度（不塌缩为 0、不溢出），standalone 顶层挂载的宿主容器定高（`height: 100vh` 或 flex 链）属宿主职责——写入嵌入契约文档。**备选**：保留 100dvh 由调用端覆盖 —— 否决，正是当前痛点；`min-height: 100dvh` 之类双写 —— 否决，嵌入场景仍强制视口高。

### D2：对话列限宽居中下沉，令牌化

shell content 区缺省 `display: flex; flex-direction: column; padding`；其内 `.pactor-chat-workspace` 缺省 `width: 100%; max-width: var(--pactor-chat-content-width, 768px); margin-inline: auto`（无 shell 包裹时 workspace 单独使用同规则）。令牌 `--pactor-chat-content-width` 可调（如 admin 场景想更宽）或置 `none` 关闭。

### D3：面板打开的布局下沉

`.pactor-chat-inspector-host` 缺省全宽（`flex: 1; width: 100%`）；host 内 workspace `flex: 0 1 auto; margin-inline: auto`（剩余空间居中，窄窗可收缩）；shell content 区 `:has(> .pactor-chat-inspector-host)` 时右/上/下 padding 归零——面板贴视口右缘，`border-left` 作分隔线。即上一轮 app.css 的修复原样下沉为缺省。

### D4：示例瘦身与 admin 定高归属

app.css 删除全部 `.demo-main .pactor-chat-*` 结构规则（保留 demo 顶栏/chip/弹层/modal/picker 等自有 UI）；admin 的 `.ai-workspace-chat` 定高规则保留——admin 内容区是"页面容器"而非"组件容器"，给嵌入式工作区定高是宿主布局职责，注释更新为嵌入契约的示例。

## Risks / Trade-offs

- [standalone 直挂（无定高容器）场景从满视口变为内容高] → 文档嵌入契约明确容器定高要求；两示例均有定高容器，回归可控。
- [既有用户若已写了覆盖规则，缺省变化可能叠加] → 包未发布、无外部用户；本仓示例逐一截图验证。
- [`:has` 选择器兼容性] → 目标浏览器（现代 Chrome/Edge/Safari 15.4+）均支持；不命中时仅表现为面板留有页面 padding，无功能损失。

## Migration Plan

改 styles.css → 瘦身 app.css → 两示例截图回归（对话页含面板开合、agents/settings、窄屏、admin AI 工作区页）→ 全量测试 → 文档/spec 同步归档。
