# Design: chat-message-actions

## Context

`packages/chat/src/view/MessageActions.tsx` 目前硬编码 4 个操作按钮（复制/重新生成/重试/编辑），图标直接 import lucide，可见性条件写死在组件内，从 `Chat`/`ChatComposition`/`ChatWorkspace` 到 DSL 层没有任何配置入口。项目铁令：DSL props 只承载可序列化数据，函数经 `ChatServicesProvider` 注入；默认行为总在包内执行。本设计把操作条改造为声明式数据驱动，对齐 `headerActions`（内建动作枚举 + 默认行为包内执行）与 `contexts`（`service` 字符串引用 + `callService` 派发）两套既有范式。

## Goals / Non-Goals

**Goals:**

- 调用方以可序列化 `messageActions` 数组完整描述操作条：用哪些按钮、顺序、图标、文案、可见条件。
- 内建动作默认行为与现有语义逐字保持（复制写剪贴板、重新生成走 `runRegenerateTurn`、重试等价流程、编辑进内联编辑框）。
- 自定义动作零函数进 DSL：点击经 `callService(service, { actionId, message })` 派发，并经 `ChatDslAdapter` 折算 `onMessageAction` 事件。
- 未配置 `messageActions` 的调用方渲染结果与今天完全一致。

**Non-Goals:**

- 不改内建动作的行为语义（`runRegenerateTurn` 契约、编辑重发、错误重试均不动，见既有 spec）。
- 不支持以 ReactNode 注入操作按钮（纯 React 高级用户可直接组合已导出的 `MessageBubble`/`MessageActions`）。
- 不做动作的分组、二级菜单、快捷键。
- 「重新生成仅限末条 completed assistant」这一位置性约束保留在包内，不开放配置。

## Decisions

### D1: 配置形状——内建名字符串与动作描述对象的联合数组

```ts
type BuiltinMessageAction = 'copy' | 'regenerate' | 'retry' | 'edit';

interface ChatMessageAction {
  id: string;                                       // 动作标识，服务派发与事件用
  builtin?: BuiltinMessageAction;                   // 指定则复用内建行为
  label?: string;                                   // tooltip 文案；缺省用内建默认
  icon?: string;                                    // 图标名（白名单）；缺省用内建默认
  roles?: Array<'user' | 'assistant'>;              // 可见角色；缺省用内建默认
  visibleWhen?: 'completed' | 'error' | 'always';   // 可见状态；缺省用内建默认
  service?: string;                                 // 自定义动作的派发服务名
}

messageActions?: Array<BuiltinMessageAction | ChatMessageAction>
```

- 数组项为字符串时等价于 `{ id: <name>, builtin: <name> }`。
- **语义：传了数组即严格按数组渲染**——顺序即渲染顺序，未列出的内建按钮不渲染（想隐藏 `edit` 就不列它）。缺省（undefined）时包内替换为默认数组 `['copy', 'regenerate', 'retry', 'edit']`，渲染结果与今天一致。
- 备选：「覆盖式」配置（只描述差异，内建按钮默认全在）。否决——隐藏一个按钮要显式写 `hidden: true`， DSL 表达更绕；「数组即真相」与 `headerActions` 的语义一致。

### D2: 内建默认条件下沉为各动作的默认描述

每个内建动作在包内有一份默认描述：

| 动作 | roles | visibleWhen | 附加约束 |
|---|---|---|---|
| copy | `['assistant']` | `'completed'` | — |
| regenerate | `['assistant']` | `'completed'` | 仅末条 assistant 且注入 transport（不可覆盖） |
| retry | `['assistant']` | `'error'` | 注入 transport |
| edit | `['user']` | `'completed'` | 存在 `onEditResend` 链路（ChatView 恒提供） |

- 调用方配置内建动作时给出的 `roles`/`visibleWhen`/`label`/`icon` **覆盖**默认描述对应字段，未给字段沿用默认。
- 可见性求值集中在 `MessageActions`：先按 `roles` 过滤角色，再按 `visibleWhen` 匹配消息状态（`'completed'` 含 completed/cancelled 等非流式非错误终态；`'always'` 含 streaming——用于需要流式中可见的自定义动作），再应用动作自身的附加约束。streaming 中不显示操作条的现状由默认 `visibleWhen: 'completed'` 自然保持。
- 备选：`visibleWhen` 做成表达式（`${message.status === 'error'}`）。否决——过度设计，三值枚举已覆盖现实需求，且保持求值逻辑纯包内。

### D3: 自定义动作派发——callService + onMessageAction 双通道

- 自定义动作（无 `builtin`）点击时：若配置 `service`，经 `ChatServices.callService(service, { actionId, message })` 派发；**同时**触发 `events.onMessageAction`（event 作用域含 `action`（动作 id）与 `message`（消息数据））。两者并行，与 `contexts` 的 service 语义、`headerActions` 的事件通知语义各自对齐。
- 内建动作点击时也触发 `onMessageAction` 通知（event.action 为内建名），默认行为不受影响——与 headerActions「默认行为总在包内执行 + 并行通知」完全一致。
- `ChatServices` 不新增字段，复用既有 `callService`；未注入 `callService` 且动作配置了 `service` 时 console.warn 后跳过派发（事件仍触发），不抛错。
- 备选：包内动作注册表（宿主预注册 `Record<string, handler>`）。否决——与 `contexts.service` 的 callService 模式重复造一套机制，服务注入已是项目定论。

### D4: 图标白名单映射

- 包内新增 `MESSAGE_ACTION_ICONS` 白名单（`Record<string, LucideIcon>`），内建默认图标即取自该表；自定义动作 `icon` 为字符串名，未知名渲染占位图标（同菜单 `MENU_ICONS` 的 `HelpCircle` 占位模式，不抛错）。
- 初版白名单子集：copy/check/rotate-ccw/pencil（内建所需）+ quote/thumbs-up/thumbs-down/share/bookmark（常见自定义场景），后续按需扩充。
- 备选：允许 DSL 传任意 lucide 图标名动态解析。否决——与菜单图标白名单的既定安全口径冲突（DSL 不可触达任意模块）。

### D5: 透传路径

`Chat`（DSL，`ChatDslAdapter` 折算事件）→ `ChatWorkspace` → `ChatComposition` → `ChatView` → `MessageBubble` → `MessageActions`，逐层新增可选 prop，无中间层行为变更。`ChatView` 内既有的 `regenerableMessageId`（末条判定）、`handleRegenerate`、`onEditResend` 链路保持不变，仅作为内建动作的执行体被 `MessageActions` 调用。

## Risks / Trade-offs

- [配置放宽可见性可能制造无意义组合（如对 user 消息开 regenerate）] → 内建动作的附加约束（末条限制、transport 依赖）不可覆盖；`roles`/`visibleWhen` 只放宽不破坏执行前提，执行前提不满足时按钮不渲染（沿用现有判空逻辑）。
- [数据驱动重构可能改变默认渲染细节（按钮顺序/DOM 结构）] → 默认数组与现状逐一对齐，验收含「未配置时 DOM 与行为回归」的测试与 playwright 目检。
- [`onMessageAction` 与 `callService` 双通道可能让宿主困惑该接哪个] → 文档与示例明确：React 宿主用 service，纯 DSL 用事件；examples/chat 两种各演示一个。
- [cancelled 状态消息是否显示操作条存在口径分歧] → 归入 `'completed'`（终态可见，与现状「非 streaming 即显示」一致）。

## Migration Plan

纯增量，无迁移步骤。回滚 = 移除 prop 透传与配置读取，恢复硬编码渲染。

## Open Questions

（无）
