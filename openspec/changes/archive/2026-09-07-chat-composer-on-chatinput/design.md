# Design: chat-composer-on-chatinput

## Context

`ChatInput`（`@pactor-app/ui`）结构：容器 > textarea + 工具栏行（toolbarStart / spacer / toolbarEnd / 发送钮）+ 可选 footer。chat 的 Composer（471 行）结构：容器（拖放区）> 附件行 + chips 行 +（textarea + 行内发送/停止钮）+ 工具栏 + 隐藏 file input + 提及/+ 弹层。chat-chrome-dsl-composition 已建立 chrome DSL 渲染层（ChromeSlot / chat.* 内建动作 / 受控回退），EmptyState、MessageActions、PartRenderer 已迁移。

Composer 是其中最复杂的区域：行为面（mention 检测需 caret、附件粘贴/拖拽、发送/停止状态机、弹层锚点）远超此前迁移的弱交互区域。关键观察：**这些行为不必进入 ChatInput 契约**——React 事件沿 DOM 冒泡，chat 在 ChromeSlot 输出外包一层容器即可承接 textarea 的 change（含 selectionStart）/ paste / drop；槽位内容经 ambient registry 注册的 chat 内部组件供给（与 chat.* 动作同款的 ambient 注入技巧）。

## Goals / Non-Goals

**Goals:**

- Composer 呈现层在 DSL 环境经 ChatInput 组合渲染，视觉对齐参考形态（发送钮入工具栏右端、+/附件钮左端）
- 全部行为契约不变（IME / Enter / 空白禁发 / 清空 / 提及 / 附件 / 模型 chip / 槽位 / 停止钮）
- 无 renderer 环境 DOM 与行为零变化（现有 markup 为 fallback）

**Non-Goals:**

- 不扩展 ChatInput 行为（不加 onPaste/onDrop/caret props；仅加 header 槽）
- 不迁移 ModelChip / AnchoredPopover / ContextSourceList 本身（后续批次）
- 不改变 Composer props 与 ChatServices 契约

## Decisions

### D1：ChatInput 增加 header 顶部槽

`header?: DslNode`（渲染在 textarea 上方，与 footer 对称）——chat 的附件卡片与上下文 chips 承载处（spec 要求渲染在输入区上方）。纯新增可选槽，既有契约不变。

### D2：Composer = 行为壳 + ChromeSlot

Composer 保留全部状态与逻辑（text / dragOver / mentionState / plusAnchor / 弹层 / file input / 自适应高度仅 fallback 路径），呈现层二选一：

- DSL 路径：chrome 片段 `{ type: 'ChatInput', props: { value: <当前 text 烘焙>, placeholder, disabled, hideSend: true, header: { type: 'ChatComposerHeader' }, toolbarStart: { type: 'ChatComposerToolbarStart' }, toolbarEnd: { type: 'ChatComposerToolbarEnd' } }, events: { onChange: [chat.composerChange], onSubmit: [chat.composerSubmit] } }`，外包 `pactor-chat-composer` 容器（拖放 / 冒泡事件承接）；
- fallback：现有手写 markup 原样。

### D3：槽位内容经 ambient registry 的 chat 内部组件供给

Composer 在 ambient renderer 可用时向 `context.components` 注册三个内部组件（`has` 检查不覆盖宿主，与 ensureChatChromeActions 同款）：

- `ChatComposerHeader`：附件卡片行 + 上下文 chips 行（现有 markup 平移）；
- `ChatComposerToolbarStart`：chat 的 `toolbarStart` 槽 + 内建 + 钮 / 附件钮（对齐参考形态左端）；
- `ChatComposerToolbarEnd`：内建模型 chip + chat 的 `toolbarEnd` 槽 + 发送/停止状态机钮（同一元素切换语义保留）。

组件经 React context（Composer 自建 `ComposerBridgeContext`）拿到 Composer 的 props/状态/回调——registry 组件是无 props 渲染，桥接数据不走 DSL params（避免把 File/回调烘焙进片段）。

### D4：非受控 ChatInput + 冒泡同步 + 提交动作

DSL 路径的 ChatInput 以**非受控**渲染（不烘焙 value 进片段）——用户文本可能含 `${`，受控烘焙会被动作引擎 resolveDeep 当表达式求值（文本损毁），且受控值经异步动作引擎回写有时序陷阱（连续击键值回退丢字）。改为：

- 草稿由 ChatInput 自持；发送后其自行清空（与 Composer 现状语义一致）；
- 包裹容器的冒泡 `onChange`（同步）同步 chat 侧 text 状态（发送钮禁用态）与 mention 检测；
- `onSubmit` 经 `chat.composerSubmit` 内建动作（params.value ← `${event}`）→ Composer send（trim 语义与现状一致；离散事件，异步无害）。

### D5：行为冒泡承接

DSL 路径的外包容器（`pactor-chat-composer` div）承接：`onChange`（冒泡自 ChatInput textarea，event.target 即 textarea——mention 检测读 selectionStart 与 getBoundingClientRect）、`onPaste`（附件）、`onDragOver/onDragLeave/onDrop`（拖拽附件）。ChatInput 契约零扩展。fallback 路径维持现有元素级绑定。

### D6：视觉差异收敛

- 发送/停止钮从 textarea 行内移至工具栏右端、+/附件钮移至工具栏左端——即参考形态，既定变化；
- 200px 输入高度上限：chat styles.css 在 `.pactor-chat-composer .pactor-chat-chrome [data-slot='chat-input'] textarea` 覆盖 `max-height` + 单列最小高度（ChatInput rows=3 缺省偏高的收敛）；
- ChatInput 容器样式（rounded-xl border focus-within ring）与 `pactor-chat-composer` 皮肤在 DSL 路径下并存：composer 容器在 DSL 路径只保留拖放态修饰，边框/圆角让位 ChatInput（经 chrome 令牌映射着色）。

## Risks / Trade-offs

- [冒泡 onChange 与 ChatInput 自身 onChange 双触发 mention 检测] → mention 检测只在容器冒泡层做一次；chat.composerChange 只负责 setText
- [registry 内部组件与宿主同名冲突] → `has` 检查跳过 + `ChatComposer*` 命名空间；冲突时回退手写呈现（组件缺失视同类型不齐备——requires 清单含三个内部组件名，注册先于渲染校验）
- [ChatInput 无 200px 上限 / rows=3 的视觉差] → D6 CSS 覆盖；fallback 路径视觉不变
- [发送钮位置变化影响既有测试（按 title/aria-label 查询）] → 测试在 jsdom 无 renderer 走 fallback，选择器不变；DSL 路径按钮保留相同 aria-label（发送/停止生成），冒烟按名可查

## Migration Plan

包内重构：ChatInput header 槽 → chat chrome 片段与内部组件 → Composer 重构 → 测试 → 根级验证 + examples/chat 冒烟（发送/停止、@提及、+菜单、附件粘贴/拖放/选择、chips、模型切换）。回滚 = git revert。

## Open Questions

- header 槽在 ChatInput 中是否带分隔线/内边距——初版与 footer 对称（padding，无 border；视觉由 chat 侧既有类承担），实现期对照截图定稿
