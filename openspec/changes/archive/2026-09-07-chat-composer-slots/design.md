# Design: chat-composer-slots

## Context

现状槽位链：`ChatServices.toolbarStart/toolbarEnd`（ReactNode，服务级）→ ChatComposition（`toolbarEnd` prop 与服务槽合并：服务槽在先）→ ChatView → Composer（ReactNode 槽，fallback 与 DSL 桥 `ChatComposerToolbarStart/End` 均已承载）。缺口：`Chat` 组件 props 无工具栏槽；footer 区域全链路不存在。既有双型槽范式：`sidebar` / `headerExtra` / `inspector`（`DslNode | ReactNode`，`resolveSlot` 解析——DslNode 经 DslNodeSlot、ReactNode 原样）。

## Goals / Non-Goals

**Goals:**

- `Chat` 可声明 toolbarStart / toolbarEnd / composerFooter（双型槽）；ChatServices 可注入 composerFooter
- footer 区域在 fallback 与 DSL 双路径结构一致（ChatInput 形态：工具栏下方、border-t 分隔）；未提供不渲染

**Non-Goals:**

- 不改变既有 toolbar 槽的合并语义与内建 chip 位置规则
- 不扩展 ChatInput（footer 槽已存在）

## Decisions

### D1：槽位命名与合并语义

`toolbarStart` / `toolbarEnd` / `composerFooter`（Chat props，DslNode | ReactNode；ChatServices 同名，ReactNode）。合并：toolbarStart 服务槽与 props 槽并存（服务槽在先，与 toolbarEnd 现有规则对齐——现 toolbarStart 仅有服务槽，props 槽追加在后）；composerFooter 同理（服务槽在先）。与 sidebar 的"替代"语义不同，工具栏槽为"附加"（沿用现状）。

### D2：Composer composerFooter

- fallback：工具栏之后渲染 `<div className="pactor-chat-composer__footer">`（border-t + 内边距，结构对齐 ChatInput footer）；
- DSL 路径：片段增加 `footer: { type: 'ChatComposerFooter' }`（requires 同步），内部组件经 ComposerBridgeContext 取 `composerFooter` 渲染——与 header 槽的 ChatComposerHeader 同构。

### D3：链路接线

`Chat`（resolveSlot 三槽）→ ChatComposition（合并服务槽）→ ChatView（透传）→ Composer（composerFooter prop + bridge.composerFooter）→ 片段（footer 槽）/ fallback（footer 区）。`createChatWorkspace`：ChatWorkspace props 增加 `toolbarStart` / `composerFooter`（DslNode，toolbarEnd 已有），经 DslNodeSlot 注入。

### D4：零渲染承诺

三槽均未提供时 DOM 与现状逐字节一致（fallback 不渲染 footer 容器；DSL 路径 ChatComposerFooter 返回 null 且 ChatInput footer 槽缺省不渲染——片段仅在 composerFooter 提供时携带 footer 槽节点）。

## Risks / Trade-offs

- [toolbarStart 新增 props 槽改变"仅服务槽"现状的合并顺序] → 服务槽在先、props 槽在后，与 toolbarEnd 既有规则一致；文档注明
- [fallback 与 DSL 路径 footer 视觉分叉] → 共用 `.pactor-chat-composer__footer` 类（fallback）与 ChatInput footer 结构（DSL，border-t 经 chrome 令牌着色）；冒烟对照

## Migration Plan

纯增量槽位：实现 → 双路径测试 → 根级验证 + examples 冒烟（示例在 chat.page.yaml 声明 toolbarStart/composerFooter 验证或单测覆盖即可，示例不改）。回滚 = git revert。

## Open Questions

（无）
