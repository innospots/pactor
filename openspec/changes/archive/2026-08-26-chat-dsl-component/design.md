# Design: chat-dsl-component

## Context

现状（chat-dsl-page 已落地）：`createChatWorkspace(services)` 工厂返回 ChatWorkspace，支持标量 props 与 `sidebar?`/`toolbarEnd?` DslNode 槽（经 `useRenderer().renderChildren`）。pactor DSL 组件模型：renderer 把 `events` 映射为函数 props（handler 进 `event` 作用域），内嵌 DslNode prop 不提前求值。目标是 Chat 成为一等 DSL 组件：服务注入与组件声明解耦（一次注入、处处可用），区域（菜单/header）由 DSL 数据与槽配置。

## Goals / Non-Goals

**Goals:**
- `registerChatComponent(registry)` 注册 `Chat` 类型；`{ type: 'Chat', props, events }` 即可用。
- `ChatServicesProvider` 一次注入服务；Chat 经 context 消费。
- DSL 配置：左侧菜单（数据 + activeKey + onMenuSelect）、header（title + headerExtra/整槽）、greeting/suggestions 等。
- examples/chat 升级为 Chat 组件声明。

**Non-Goals:**
- 菜单路由/会话持久化；消息内 dsl part 运行时；多 Chat 实例并存的状态隔离（context 就近原则已够）。

## Decisions

### D1: 服务注入用 React Context，而非工厂闭包
`ChatServicesProvider` 携带 `ChatServices`（transport 必填，其余可选，与 ChatWorkspaceServices 同型）。`Chat` 经 `useChatServices()` 读取；缺失时渲染受控「未配置聊天服务」提示（不抛错，符合受控降级惯例）。`createChatWorkspace` 保留：内部实现改为 `(props) => <ChatServicesProvider value={services}><Chat {...props} /></ChatServicesProvider>`，逻辑单一来源。

**替代方案**：继续工厂闭包。否决——每个使用点都要先造组件，不像 Button/Input；context 是 React 惯用的"环境依赖"注入方式，且与 DSL 的声明式语义匹配（服务是环境，不是配置）。

### D2: 菜单 = 数据 props + DSL state 绑定 + events
`menu: ChatMenuItem[]`（`key/label/icon?/badge?/disabled?/children?`）驱动内建侧栏；`activeMenuKey` 为受控 prop，DSL 侧写 `${state.activeMenu}`；`events.onMenuSelect` 由 renderer 绑成函数 prop，event 作用域注入 `key` 与被选中 `item`，典型用法调 `setState` 动作更新 activeMenuKey。图标用字符串名（映射到 lucide 图标子集，白名单式，避免 DSL 携带组件）。内建侧栏含「新建对话」类首项由调用方以 menu 数据表达，组件不内建业务项。

**替代方案**：菜单也用 DslNode 槽。否决——菜单是高频结构化数据，数据驱动（含 badge/disabled/分组）比自由节点更符合"配置"语义；自由场景仍有 `sidebar` 槽兜底。

### D3: Header 三层配置
`title`（标量，默认无）→ `headerExtra?: DslNode`（标题右侧槽，renderChildren 渲染）→ `header?: DslNode`（整体替换）。都不给时渲染仅含标题的内建 header；`showHeader: false` 可关闭。

### D4: 事件语义
renderer 的 events 机制直接把 `events.onSend` / `events.onMenuSelect` 绑为函数 props。Chat 组件签名含 `onSend?(text)` / `onMenuSelect?(key, item)`；DSL 侧 event 作用域：`onSend` → `event.text`；`onMenuSelect` → `event.key` / `event.item`。

### D5: 与 ChatWorkspace 的关系
组合逻辑（AppShell + header + ChatView + 附件状态 + store 自持）提炼为内部 `ChatComposition`，`Chat` 与 `createChatWorkspace` 都基于它。`Chat` 额外承担：context 读取、菜单渲染、DslNode 槽渲染、events 适配。

## Risks / Trade-offs

- [context 缺失时的静默降级被误当 bug] → 渲染明显的中文提示块 + console.warn。
- [菜单 icon 字符串映射表膨胀] → V1 内置小集合（chat/plus/history/settings/star 等 ~8 个），未知名渲染占位圆点。
- [`Chat` 类型名与宿主既有组件冲突] → registerChatComponent 不覆盖已注册类型（沿用 registerChatLayout 的语义）。
- [DslNode 槽在纯 React（无页面运行时）下不可用] → 文档注明：纯 React 场景用 ChatServicesProvider + Chat 的 ReactNode 版本 props（slots 同时接受 ReactNode——实现上 `sidebar/header` 检测 DslNode 还是 ReactNode 分别处理）。

## Migration Plan

纯增量：createChatWorkspace 行为不变（内部换实现）。examples/chat 切换 YAML 到 Chat 组件，宿主装配代码减少。

## Open Questions

- 菜单项 children（二级菜单）V1 是否渲染为分组还是缩进列表？倾向：单层 + `group` 字段分组标题，嵌套留后续。
