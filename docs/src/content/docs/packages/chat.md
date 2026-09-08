---
title: "@pactor-app/chat"
description: AI 对话工作区——消息协议与流式渲染、Composer、模型选择、上下文弹层、产出物面板、菜单外壳，以及一等 DSL 组件 Chat
---

`@pactor-app/chat` 提供完整的 AI 对话能力：消息模型与流式协议、React 视图族（消息列表 / Composer / 产出物面板 / 菜单外壳），以及可在页面 DSL 中直接声明的一等组件 `Chat`。包内不发起网络请求——数据与服务端协议全部由调用方注入。

```bash
pnpm add @pactor-app/chat @pactor-app/runtime @pactor-app/markdown react
```

`react >= 18` 为 peer dependency；样式表 `@pactor-app/chat/styles.css` 使用前必须引入。

## 快速开始

```tsx
import { createComponentRegistry } from '@pactor-app/ui/components';
import {
  ChatView,
  ConversationStore,
  createSafeRegistry,
} from '@pactor-app/chat';

const store = new ConversationStore();
// LLM 生成的 DSL 只渲染白名单内的组件
const safeRegistry = createSafeRegistry(createComponentRegistry(), [
  'Statistic',
  'Card',
]);

// transport 由业务按服务端协议实现（SSE / WebSocket）
<ChatView store={store} transport={transport} safeRegistry={safeRegistry} />;
```

## 功能一览

### 消息渲染

- **富内容 part**：文本 / markdown（安全渲染）/ DSL（LLM 下发的界面片段，Safe Registry 白名单渲染）/ 思考过程（折叠卡）/ 工具调用与结果（配对的活动轨迹）/ 错误 / 状态提示；
- **活动轨迹**：assistant 消息顶部的流式状态头（呼吸文案 + 计时）+ 工具调用配对条目，进入答案阶段自动折叠；
- **消息操作条**：hover 显现，内建复制 / 重新生成 / 编辑重发 / 重试；`messageActions` 声明式配置——数组即真相，可覆盖内建字段或追加自定义动作（经服务桥派发）；
- **空态与建议**：空会话渲染问候语 + 副标题 + 起始建议（点击即发送），问候组与输入框垂直居中；首条消息进入后恢复消息列表 + 钉底输入框。

### 流式交互

- 发送即驱动一轮对话：user 消息 + assistant 占位 + 流式增量渲染（打字机平滑揭示）；
- 流式中发送按钮变为停止按钮，点击中断当前回复；
- 消息区贴底自动跟随，上翻释放、回底恢复，释放期间显示"回到底部"浮动按钮。

### Composer 输入框

- 自适应高度（上限 200px）、Enter 发送 / Shift+Enter 换行 / IME 合成中不发送；
- **附件**：粘贴 / 拖拽 / 文件选择交给调用方处理（包内不上传），附件卡片展示与移除；
- **上下文**：`@` 提及与 `+` 入口弹层（静态列表或服务桥动态数据源），选中项成为输入区上方的 chips，发送时随消息结构化传递；
- **模型选择**：`models` 配置即启用，chip 可放在工具栏右端或工作区头部（`modelPlacement`），选中值随发送进入 transport；
- **槽位与开关**：`toolbarStart` / `toolbarEnd`（工具栏左右槽）、`composerFooter`（工具栏下方 footer 区）、`composerBottom`（输入框之外正下方，典型放免责声明）、`hideToolbar`（隐藏默认工具栏行，Enter 发送保留）。

### 产出物面板（Inspector）

右侧预览面板承载 LLM 的结果物（报告、代码、页面片段）：markdown / code / text / dsl 四种内建渲染；消息流内产出物卡片可"在面板中打开"；桌面固定宽右栏（左缘可拖拽调宽），窄屏退化为覆盖抽屉；`artifact` / `panelOpen` 支持受控配置。

### 菜单外壳（ChatShell / AppShell）

侧栏 + 主区的应用外壳：菜单支持图标 / 角标 / 状态点 / 分组 / 禁用；桌面可折叠为 icon rail（hover 图标显示 Tooltip）；移动端侧栏变为覆盖抽屉（遮罩 / Escape / 路由变化关闭）；支持品牌区与侧栏底部固定区（如用户卡）。

### 皮肤

视图颜色全部经 `--pactor-chat-*` CSS 变量表达：覆盖变量即换肤，`<html data-pactor-theme="dark">` 启用内置暗色。结构布局（高度、对话列居中、面板贴右）由包内样式自持，嵌入时宿主只需给容器定高。

## Chat：一等 DSL 组件

`Chat` 是与 Button / Input 同级的 DSL 组件：`registerChatComponent(registry)` 注册一次，页面 DSL 即可声明完整聊天工作区。运行时服务（`transport` 必填、Safe Registry、附件回调、服务桥等）由宿主在根部经 `ChatServicesProvider` 注入一次。

```yaml
dsl: '1.0'
page: { id: chat, title: 聊天页 }
state: { activeMenu: new, model: demo }
body:
  type: Chat
  props:
    title: 助手工作区
    headerActions: [export, theme, clear]   # 头部操作：导出 / 明暗 / 清空
    greeting: 你好
    activeMenuKey: ${state.activeMenu}
    menu:
      - { key: new, label: 新建对话, icon: plus }
      - { key: s1, label: 本月报表分析, icon: history, group: 历史会话 }
    models:
      - { value: demo, label: demo-mock }
      - { value: pro, label: demo-pro }
    model: ${state.model}
    contexts:
      - { trigger: '@', label: 智能体, service: agents }
      - { trigger: '+', label: 上下文, items: [{ id: c1, label: 本月报表 }] }
    composerFooter:            # 输入框 footer 槽（工具栏下方）
      type: DropdownMenu
      props:
        items: [{ label: 默认工作空间, value: 默认工作空间, icon: folder }]
      children:
        - type: Button
          props: { text: 选择工作空间, variant: text, size: small }
    messageActions: [copy, regenerate, edit]
  events:
    onMenuSelect:              # event.key / event.item
      - action: setState
        params: { activeMenu: ${event.key} }
    onModelChange:             # event.model
      - action: setState
        params: { model: ${event.model} }
```

主要配置（全部为 DSL 可表达的数据）：

| 分组 | props / 事件 |
| --- | --- |
| 头部 | `title` / `headerExtra` / `header` / `showHeader` / `headerActions` / `editableTitle`（头部按内容自动渲染，无内容不渲染） |
| 侧栏 | `menu` / `activeMenuKey` / `sidebar`（替代槽），事件 `onMenuSelect` |
| 空态 | `greeting` / `subtitle` / `suggestions` |
| 模型 | `models` / `model` / `modelPlacement`，事件 `onModelChange` |
| 上下文 | `contexts`，事件 `onContextsChange` |
| 消息操作 | `messageActions`，事件 `onMessageAction` |
| Composer | `toolbarStart` / `toolbarEnd` / `composerFooter` / `composerBottom` / `hideToolbar` |
| 产出物面板 | `artifact` / `panelOpen` / `inspector`，事件 `onArtifact` / `onPanelClose` / `onOpenArtifact` |

事件均为并行通知，内建默认行为总在包内执行。完整装配参考 `examples/chat`。

## createChatWorkspace（兼容路径）

`createChatWorkspace(services)` 以工厂闭包注入服务，返回可注册进页面运行时的 `ChatWorkspace` 组件——与 `Chat` 组件共用同一组合，行为一致，DSL props 与上表相同。

## 零 React 核心

消息模型、`ConversationStore`、Streaming 事件与 reducer、Safe Registry、capability 动作链（权限 → 确认 → 执行）均可脱离 React 使用与测试，支撑视图层的全部行为；`createManualDriver()` 供测试与手动驱动 transport。
