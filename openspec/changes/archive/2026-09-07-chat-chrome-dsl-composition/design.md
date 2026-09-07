# Design: chat-chrome-dsl-composition

## Context

`@pactor-app/chat` 视图层（`packages/chat/src/view/`，16 个组件 + 约 1700 行私有 CSS）全部手写，与 `@pactor-app/ui` 注册表组件大量重复。两项硬约束决定了解法形状：

1. **零运行时依赖契约**：`@pactor-app/ui` 仅为 chat 的 devDependency（`AnchoredPopover.tsx:9-13`、`ChatLayout.tsx:26-29` 注释佐证）——不能直接 import ui 组件；
2. **ambient renderer 非保证**：纯 React 直连场景 `useRenderer()` 抛错（renderer-context.ts:39-45），chat 现有 `DslSlotGuard` 降级链（chat-composition.tsx:50-78）必须保留。

已核实的关键机制：

- `useRenderer()` 暴露 `context: RuntimeContext`，其中 `components`（ComponentRegistry）与 `actions`（ActionRegistry）可读写（context.ts:61-91）；
- `renderChildren` 对未注册类型渲染 `UnsupportedComponent` 占位而非抛错（renderer.tsx:195-201）——chrome 渲染前必须自行校验类型齐备性；
- chat 已有同款模式：`ChatDslNode`（PartRenderer.tsx:49-59）在 DslRenderer 上下文内经 `renderChildren(node, extraScope)` 渲染 dsl part。

## Goals / Non-Goals

**Goals:**

- chat 通用 chrome 优先以 DSL 组合 ambient registry 中的 `@pactor-app/ui` 组件渲染，消除双份实现
- 不打破零运行时依赖契约；纯 React 直连环境行为与 DOM 不变
- chrome DSL 的交互接回 chat 包内行为（复制 / 建议发送 / 打开面板等）
- 首批迁移三处验证机制：空态区、PartRenderer 非流式分支、消息操作条

**Non-Goals:**

- 不迁移 chat-domain 核心（MessageBubble / 流式渲染 / ActivityTrace / 安全降级链 / 组合层 / Composer 行为层）
- 不扩展 `@pactor-app/ui` 组件（Menu 的 badge/dot/group、closable Badge 等缺口属后续批次）
- 不改变 ChatServices / Chat props / 页面 DSL 契约
- 不迁移 ModelChip、ChatSidebarMenu、AnchoredPopover、AppShell、ArtifactPanel（后续批次）

## Decisions

### D1：chrome 经 ambient renderer 渲染，不 import ui

chrome DSL 片段为包内常量（DslNode 普通对象），经 `useRenderer().renderChildren([node])` 渲染——组件解析自宿主页面运行时 registry（真实场景即 shadcn 注册表），chat 对 ui 保持零运行时依赖。备选（直接 import ui 组件）放弃：破坏契约且锁死 shadcn 单一 kit。

### D2：双实现 + 类型齐备性校验的受控回退

每个迁移区域保留现有手写实现为 fallback，渲染决策按序：

1. 无 DslRenderer 上下文（`useRenderer` 抛错，纯 React / 测试）→ 手写实现（现有 DslSlotGuard 同款守卫）；
2. 有上下文但 `context.components` 缺该片段所需任一类型 → 手写实现 + `console.warn`（不允许 UnsupportedComponent 占位混入 chrome——renderChildren 对未知类型静默降级，renderer.tsx:195-201）；
3. 齐备 → 渲染 DSL 片段。

片段所需类型清单随片段声明（`{ node, requires: ['Empty','Button',...] }`），校验为 O(类型数) 的 `registry.has` 轮询，无渲染期开销。

### D3：交互经 `chat.*` 内建动作接回包内行为

chrome DSL 的 `events.onClick` 引用 `chat.*` 动作（如 `chat.sendSuggestion` / `chat.openArtifact` / `chat.copyMessage`）。chat 组件在 ambient renderer 上下文可用时（mount effect 内）向 `context.actions` 注册这些内建动作——**不覆盖宿主同名动作**（`has` 检查 + `chat.` 前缀命名空间避免冲突）；动作闭包读 chat 包内服务与回调（store / onSend / onOpenArtifact 经 React ref 桥接），行为实现零外迁。event 载荷（如建议文本）经 params 表达式求值传入。

备选（chrome 片段携带 React 回调）放弃：DSL 渲染路径不接受函数 props。

### D4：chrome 容器上的令牌映射

ui 组件消费 shadcn 语义令牌（`--primary` 等），chat 皮肤是 `--pactor-chat-*`。DSL 渲染的 chrome 子树包一个 `pactor-chat-chrome` 容器，容器样式把 `--pactor-chat-*` 映射为 shadcn 语义令牌（examples/chat app.css 的「槽位原语」块已有同款写法）；`--pactor-chat-*` 仍为唯一皮肤入口（chat-view 契约不放松）。暗色由 `[data-pactor-theme='dark']` 覆盖链自动生效。

### D5：首批迁移清单与片段归属

| 区域 | 片段（组件类型） | 交互 |
| --- | --- | --- |
| EmptyState | Empty + Typography + Button（建议组） | 建议点击 → `chat.sendSuggestion` |
| PartRenderer error / status / dsl-pending | Alert / Text | 无（重试入口在操作条，不动） |
| PartRenderer artifact 卡片 | Card + Badge + Button | 打开面板 → `chat.openArtifact` |
| MessageActions 操作条 | Button + Tooltip + Icon | 内建动作 → `chat.*`；自定义动作仍走 `callService` 派发（chat-message-actions 契约不变） |

片段集中在 `packages/chat/src/view/chrome/`（每区域一个模块，导出 `{ node, requires, fallback }`），渲染层为 `ChromeSlot` 组件（守卫 + 校验 + renderChildren）。

### D6：测试策略

现有测试（jsdom，无 DslRenderer）走 fallback 路径——DOM 断言不变、必须全绿（验证零回归）；新增测试：ambient renderer 环境（页面运行时挂 Chat）验证 DSL 路径渲染与 `chat.*` 动作闭环、类型缺失回退 + 告警、宿主同名 `chat.*` 动作不被覆盖。

## Risks / Trade-offs

- [ui 组件 markup 与 chat 私有 CSS 选择器不匹配，chrome 视觉回归] → D4 令牌映射 + 验收逐项截图比对；chat 私有 CSS 中仅服务 fallback 路径的选择器保留
- [`chat.*` 动作注册时机晚于 chrome 首次渲染（mount effect 顺序）] → chrome 渲染与动作注册同帧：注册在 ChromeSlot 首次渲染的 effect 前于 render 阶段幂等执行（registry.has 守卫），或动作缺失时事件受控失败不击穿
- [宿主 registry 非 shadcn（自定义 kit）时 chrome 外观分叉] → 类型齐备即可渲染是既定语义（与 dsl part 白名单一致）；文档注明 chrome 组合假设 ui 组件存在
- [两套实现并存期维护双份] → fallback 随纯 React 直连场景存续，属既定代价；后续批次收敛时再评估删减

## Migration Plan

包内重构，无发布物迁移：按 tasks.md 实现 → chat 包测试全绿 + 根级 build/test/typecheck 全绿 → examples/chat 冒烟（空态建议、error 重试、操作条、artifact 卡片在 DSL 页内表现）。回滚 = git revert。

## Open Questions

- ui `Empty` / `Tooltip` 的 props 契约与 chrome 片段所需字段的逐一对齐（实现期核对，缺口以组合而非扩展 ui 解决）
- 消息操作条的 hover 显现容器（显隐逻辑）是否随片段走——倾向保留 chat 容器、仅按钮组 DSL 化，实现期定稿
