# Design: add-chat-artifact-panel

## Context

目标页面形态（参考图）：左菜单（品牌区/搜索/菜单项）+ header（标题 + 状态徽章）+ 中间工作区 + 右侧 Inspector 面板。映射到现状：

| 参考图区域 | 现状 | 结论 |
| --- | --- | --- |
| 左侧菜单（品牌/搜索/菜单项/收起） | `Chat` DSL 组件：`menu` 数据驱动内建侧栏 + `activeMenuKey` + `events.onMenuSelect`；`sidebar: DslNode` 槽可整体自定义（品牌区、搜索框） | ⚠️ 会话导航已有；**切换到非对话页**需新机制（D6） |
| header（标题 + 徽章/按钮） | `title` / `headerExtra: DslNode` / `header: DslNode` 三层配置 | ✅ 已有，零改动 |
| 中间 Chat 区（调大模型） | `ChatTransport` 接口注入（调用方实现 SSE/mock）；`ChatView` 流式渲染 | ✅ 已有，零改动 |
| 右侧产出物预览（可关闭/隐藏） | **无** | ❌ 本变更主体 |
| `createPactorApplication` 集成 | Chat 为一等 DSL 组件；app 经 `componentRegistry` + `providers` 槽注入即可，理论可行未被示例验证 | ⚠️ 需示例验证 |

约束（全仓既有约定）：不引用 Next.js 等框架栈；功能与数据一律以接口输出/由调用方注入；DSL 可表达的必须是标量/数组/普通对象，组件实例经白名单或 DslNode 槽；LLM 产出 DSL 必须过 Safe Registry 守卫。

## Goals / Non-Goals

**Goals:**

- 产出物的框架级模型、状态与预览面板（可关闭/隐藏）；
- DSL 全链路可配：面板开关经受控 props + 已有 setState 闭环，LLM 产出经 artifact part + onArtifact 事件联动；
- `dsl` 类产出物活预览（server-driven 理念的闭环：LLM 产出页面片段 → 面板即时渲染）；
- ChatShell 外壳组件：菜单可切换到非对话 DSL 页面（设置/列表等），对话状态跨页面切换存活；
- 不配置面板时零渲染、零行为变化（向后兼容）。

**Non-Goals:**

- 不做面板拖拽调宽/ dock 布局系统（固定宽度 + 开关即可）；
- 不做产出物版本历史/多产出物 Tab（store 只持当前一个，多产出物由业务层自行管理后注入）；
- 不做真实 LLM 接入（transport 由调用方实现，示例用 mock）；
- 不改动 pactor-runtime / pactor-app 本体。

## Decisions

### D1：产出物模型与 ArtifactStore

```ts
interface ChatArtifact {
  id: string;
  kind: 'markdown' | 'code' | 'text' | 'dsl';
  title: string;
  content: string;          // dsl kind 时为 DslNode JSON 字符串？——见下
  language?: string;        // code kind
  meta?: Record<string, unknown>;
}
```

`dsl` kind 的 content 直接为 `DslNode` 普通对象（DSL/JSON 双可表达），不包字符串。`ArtifactStore`：`get()/subscribe()/open(artifact)/update(patch)/close()`，与 ConversationStore 同模式（ref 自持或 `services.artifactStore` 注入）。**备选**：纯受控无 store —— 否决，纯 React 直连场景（createChatWorkspace）需要自持状态才好用；store 与受控 props 并存（受控优先）。

### D2：面板 = ChatComposition 的可选右栏，受控优先

`Chat` 新增 props：
- `artifact?: ChatArtifact`（受控内容，DSL 可绑 `${state.artifact}`）
- `panelOpen?: boolean`（受控开关，DSL 可绑 `${state.panelOpen}`；未传时由内部 store 状态决定）
- `onPanelClose?: () => void`（DSL 侧 events.onPanelClose → 通常 setState panelOpen=false）
- `inspector?: DslNode | ReactNode`（面板内容槽，提供时整体替代内建渲染器）

布局：workspace 与面板 flex 同行（桌面 ≥768px），面板固定宽（约 320px，CSS 变量可调）；移动端（<768px）面板为右侧覆盖抽屉（复用 AppShell 抽屉的 CSS 媒体查询思路，不引新断点体系）。**备选**：独立 `ArtifactPanel` DSL 组件由页面自行用 Flex 拼装 —— 否决：开关动画/移动端覆盖/与 Chat 的联动事件都要业务重写，违背"工作区组件"定位；独立面板组件仍导出供纯 React 场景用。

### D3：内建渲染器按 kind 分发

- `markdown` → `MarkdownRenderer`（pactor-markdown，已是 pactor-chat 依赖）；
- `code` → 只读代码块（等宽 + 滚动，不引高亮新依赖；`language` 仅作角标）；
- `text` → 预格式文本；
- `dsl` → `guardChatDsl` 白名单守卫 + `renderChildren` 活预览（与消息流内 dsl part 同安全级）；渲染失败/被守卫拦截 → 受控降级块（ChatDenied 同款），不抛错。

### D4：artifact 消息 part + onArtifact 事件（LLM → 面板联动）

`ChatPart` 联合新增 `{ id?, type: 'artifact', artifact: ChatArtifact, status? }`。PartRenderer 内联渲染为"产出物卡片"（标题 + 类型角标 + "在面板中打开"按钮，点击即 open）。`Chat` 新增 `events.onArtifact`：artifact part 到达（status ready）时触发，event 作用域含 `artifact`——DSL 侧典型接法：`setState artifact=${event.artifact}, panelOpen=true`。是否自动开面板由 DSL/业务决定（框架不擅自抢焦点），消息内卡片按钮是纯 React 场景的开面板入口。

### D6：ChatShell——菜单外壳与内容区解耦（菜单切换非对话页）

`Chat` 把侧栏与 ChatView 绑定为一体，菜单只能做会话导航。新增 `ChatShell` 组件（同时导出 React 组件与 DSL 注册，已存在同名类型时 MUST NOT 覆盖）：

- props：`menu` / `activeMenuKey` / `events.onMenuSelect`（复用 Chat 同款 ChatMenuItem 与图标白名单）、`brand?`（移动端品牌区）、`sidebar?: DslNode | ReactNode`（替代内建菜单侧栏）、`content: DslNode | ReactNode`（主区内容槽——DSL 场景经 renderChildren，纯 React 场景可传路由出口等元素）；
- 结构 = AppShell + 内建菜单侧栏 + 内容槽；**不含任何聊天逻辑、不含路由逻辑**——菜单点击只发事件，导航还是状态切换由宿主/DSL 决定；
- 嵌入内容区的 `Chat` 不传 `menu`（无侧栏形态）；会话状态经 `services.store`（共享 ConversationStore）在页面切换间存活。

**备选**：(a) 每个页面 YAML 各自重复侧栏配置 —— 否决：菜单数据重复且页面间无共享外壳；(b) 给 Chat 加 `pages/panels` 内容切换 prop —— 否决：Chat 膨胀为应用框架，职责越界；(c) ChatShell 内置路由感知 —— 否决：路由是应用层关切，外壳保持无状态展示组件。

### D7：examples/chat 路由化（菜单切换 = URL 变化，刷新还原页面）

示例从"单页 state 切换"升级为真实路由，全部用既有件，不改框架：

- 依赖 `react-router-dom`（pactor-router/react 的 peer，HashRouter 形态——静态示例刷新直连任意路径的稳妥选择，与全仓"路由建议 hash 避让"约定一致）；
- App.tsx：`HashRouter` + `MenuRegistry`（对话 `/chat`、我的智能体 `/agents`、系统设置 `/settings`，各带 pageId）+ `ChatServicesProvider`；`useReactRouterBridge()` 取 bridge；`useLocation` 算 `activeMenuKey`；
- 外壳：`ChatShell`（menu 来自 registry 可见树；`onMenuSelect` → `bridge.push(item.path)`；`content` 传 `<DynamicDslRoute registry render={...}/>` 路由出口，ReactNode 形态槽）；
- 页面：`chat/agents/settings` 三个独立 page.yaml，render 回调里各自建 PageRuntime，runtime context 注入 `createRouterAdapter(bridge)`——**页内 DSL 的 `navigate` 动作可用**（智能体列表点击 → `navigate /chat?id=xx` 或 setState + navigate 组合）；
- 刷新还原：HashRouter 直接读 `location.hash`，DynamicDslRoute 按路径匹配 pageId 渲染对应页面，菜单高亮由 location 推导——无需任何持久化 hack。

**备选**：examples/chat 整体改用 createPactorApplication —— 否决：pactor-app 内置布局无 chat 外壳（需自定义布局注册），且 app 集成路径已由 admin 示例任务 4.2 验证，chat 示例保持"chat 包独立 showcase"定位。

### D5：createPactorApplication 集成路径（验证而非新机制）

app 场景：`options.componentRegistry` 上调 `registerChatComponent` + `options.providers` 包一层 `ChatServicesProvider`（providers 槽为既有机制）。admin 示例加一个 "AI 工作区" 菜单页验证，DSL 页面 body 即 `{ type: 'Chat', props: { menu, artifact: '${state.artifact}', ... } }`。若验证中发现 app 侧缺口（如 providers 顺序），再评估是否升格为框架改动——预期不需要。

## Risks / Trade-offs

- [受控 props 与内部 store 双轨导致状态来源混乱] → 明确优先级：受控 props 任一提供即全受控（同 React 惯例），文档写清；内部 store 仅纯 React 场景默认。
- [dsl 产出物活预览的安全面] → 与消息流 dsl part 同级：Safe Registry 白名单守卫先行，未知类型降级为 ChatDenied，不执行任何远程代码。
- [移动端右面板遮挡对话] → <768px 覆盖式抽屉 + 遮罩点击关闭，缺省关闭。
- [面板固定宽不适配所有产出物] → 宽度经 CSS 变量 `--pactor-chat-inspector-width` 暴露，宿主皮肤可调。

## Migration Plan

纯新增，无迁移。既有 Chat 用法不配置面板时行为不变。
