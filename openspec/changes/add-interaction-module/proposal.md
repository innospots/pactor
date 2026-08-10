# Proposal: add-interaction-module

## Why

设计文档第 44–49 节：弹层不是几个 UI 组件，而是独立的 Interaction Runtime——统一处理打开/关闭/参数/返回值/嵌套/Promise。V1 Action 清单（第 98 节）中的 `overlay.open` / `overlay.close` / `confirm` / `message` 目前都没有实现载体。本变更落地 `pactor-interaction`：Overlay 管理器（UI 无关）+ antd 渲染层 + 动作注册。同时补齐支撑第 48 节"动作结果作用域"（`${actions.editResult.success}`）所需的 core/runtime 小幅扩展。

## What Changes

- **pactor-core（扩展，向后兼容）**：`ActionConfig` 增加可选 `id` 字段（命名动作，供结果引用）。
- **pactor-runtime（扩展，向后兼容）**：Action 引擎记录命名动作的结果，表达式作用域增加 `actions`（`actions.<id>` = 该动作的返回数据）；buildScope 同步。
- **新增 `pactor-interaction` 包**（`packages/interaction`）：
  - `OverlayManager`（零 React）：overlay 堆栈、`open(config)` 返回 Promise（close 时以其 payload resolve）、`close(id?, payload)`、嵌套、订阅；条目含 `type`（modal/drawer）/ `title` / `width` / `content`(DslNode) / `page`({ pageId }) / `params`。
  - **React 渲染层**：`<OverlayHost>` 以 antd Modal/Drawer 渲染堆栈；`content` 经 pactor-runtime Renderer 渲染，作用域注入 `params` 与 `parent`（打开时父作用域快照，只读，第 49 节）；`page` 类型经注入的 `resolvePage(pageId)` 加载 DSL 后以子运行时渲染。
  - **动作注册** `registerInteractionActions(actions, manager, ui)`：`overlay.open`（resolve 值为 close payload，供 `actions.<id>` 引用）、`overlay.close`、`confirm`（antd Modal.confirm，resolve boolean）、`message`（antd message，经 `<InteractionProvider>` 捕获的 API 实例，避免 antd 静态函数）。
- 单元测试（manager 纯 Node）+ 组件测试（jsdom + antd + runtime 端到端：DSL 按钮 → overlay.open → 渲染 → close 携带 payload → if 动作读取 `actions.<id>`）。
- 文档站新增 pactor-interaction 模块页。

## Capabilities

### New Capabilities

- `overlay-manager`: Overlay 堆栈状态、open/close Promise 模型、params/parent 作用域、嵌套与订阅。
- `overlay-host`: antd Modal/Drawer 渲染、DSL content 渲染、page overlay 动态加载、InteractionProvider。
- `overlay-actions`: overlay.open/close、confirm、message 动作；命名动作结果作用域。

### Modified Capabilities

- `dsl-core-protocol`: `ActionConfig` 增加可选 `id`（向后兼容拓宽）。
- `action-engine`: 命名动作结果记录与 `actions` 作用域（新增行为，不影响未命名动作）。

## Impact

- **新增代码**：`packages/interaction`；**修改**：`packages/core`（类型拓宽）、`packages/runtime`（引擎结果记录 + 作用域 + 测试）。
- **依赖**：dependencies `pactor-core` / `pactor-runtime`；peerDependencies `react >=18`、`antd >=5`。
- **V1 范围裁剪**：overlay 类型仅 modal / drawer / confirm（form-modal/form-drawer 由"drawer/modal + Form DSL"组合表达；`form.open` 语法糖、popover/dropdown 等其余类型留待后续）。
- **后续模块**：pactor-layout、pactor-app（组合 OverlayHost 与 Provider）。
