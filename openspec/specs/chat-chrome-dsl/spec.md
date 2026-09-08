# chat-chrome-dsl Specification

## Purpose

chat chrome DSL 渲染层（`@pactor-app/chat`）：通用 chrome 区域以包内 DSL 片段经 ambient 页面运行时渲染宿主组件的机制——类型齐备校验、`chat.*` 内建动作接入、受控回退与令牌映射。

## Requirements
### Requirement: chrome DSL 渲染层

`@pactor-app/chat` 的通用 chrome 区域（非 chat-domain 核心呈现）SHALL 优先以包内 DSL 片段（DslNode 普通对象）表达，经 ambient 页面运行时 renderer（`useRenderer().renderChildren`）渲染宿主组件注册表中的组件；chat 包 MUST NOT 新增对 `@pactor-app/ui` 的运行时依赖。每个 chrome 片段 SHALL 随片段声明所需组件类型清单（`requires`）；渲染前 SHALL 校验 ambient registry 齐备性，缺任一类型时 MUST NOT 渲染 DSL 片段（不允许 UnsupportedComponent 占位混入 chrome）。

#### Scenario: DSL 环境渲染 chrome

- **WHEN** Chat 在页面运行时（DslRenderer 上下文）内渲染且宿主 registry 具备片段所需全部组件类型
- **THEN** chrome 区域经 renderChildren 以宿主组件渲染，而非 chat 手写实现

#### Scenario: 类型缺失受控回退

- **WHEN** ambient registry 缺片段所需任一组件类型
- **THEN** 回退 chat 手写实现并 console.warn，页面其余部分不受影响

#### Scenario: 无 renderer 环境回退

- **WHEN** Chat 在纯 React 直连（无 DslRenderer 上下文）环境渲染
- **THEN** chrome 区域使用 chat 手写实现，行为与 DOM 契约不变，不抛错

### Requirement: chat 内建动作接入

chrome DSL 片段的交互事件 SHALL 经 `chat.` 前缀的内建动作（如 `chat.sendSuggestion` / `chat.openArtifact` / `chat.copyMessage`）接回 chat 包内行为；ambient renderer 可用时 chat SHALL 向页面运行时 `context.actions` 注册这些动作，且 MUST NOT 覆盖宿主已注册的同名动作；行为实现（store 操作、onSend / onOpenArtifact 等回调）MUST 保留在 chat 包内。

#### Scenario: 内建动作闭环

- **WHEN** 用户点击 DSL 渲染的 chrome 交互元素（如起始建议按钮）
- **THEN** 对应 `chat.*` 动作执行，行为与手写实现路径一致（如触发与 Composer 发送一致的流程）

#### Scenario: 不覆盖宿主动作

- **WHEN** 宿主 action registry 已注册同名 `chat.*` 动作
- **THEN** chat 不覆盖，宿主实现优先

### Requirement: chrome 令牌映射

DSL 渲染的 chrome 子树 SHALL 包裹在 `pactor-chat-chrome` 容器内，容器样式 SHALL 把 `--pactor-chat-*` 皮肤令牌映射为宿主 UI 语义令牌（shadcn 的 `--primary` 等），`--pactor-chat-*` 保持为 chat 皮肤的唯一配置入口；暗色主题经 `[data-pactor-theme='dark']` 覆盖链生效。

#### Scenario: 皮肤令牌传导

- **WHEN** 宿主覆盖 `--pactor-chat-primary` 等皮肤令牌
- **THEN** DSL 渲染的 chrome（Button 等 ui 组件）呈现对应色彩，无需额外配置

