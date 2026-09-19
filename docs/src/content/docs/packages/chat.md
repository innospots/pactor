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
- **活动轨迹**：assistant 消息顶部的流式状态头（呼吸文案 + 计时）+ 工具调用配对条目 + 思考过程折叠卡（与工具列表为独立块）；状态头统一折叠/展开全部内容，进入答案阶段自动折叠（带单向闩锁——流式期间模式回跳不反复展开折叠）；
- **消息操作条**：hover 显现，内建复制 / 重新生成 / 编辑重发 / 重试；`messageActions` 声明式配置——数组即真相，可覆盖内建字段或追加自定义动作（经服务桥派发）；assistant 终态消息底部常显时间戳（当天 HH:mm、非当天带日期）；
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

右侧预览面板承载 LLM 的结果物（报告、代码、页面片段、图片）：

- **内建渲染**：markdown / code / text / dsl 四种 kind；图片类文件（png / jpg / svg / webp 等，经 `fileType` 或 title 扩展名识别）按图片预览——content 为 URL / data URL，svg 另支持原始标记；
- **自定义查看器**：`artifactViewers`（服务注入，函数不进 DSL props）按扩展名 / kind 对特定文件格式提供自定义预览，优先于内建渲染；
- **下载**：header 右端下载钮把当前激活产物存为本地文件（文本类按 fileType / kind 补扩展名，dsl 存 JSON，svg 原始标记存 .svg，图片 URL 经 fetch 取回、失败降级新标签打开）；
- **多产物**：header 文件名处为切换下拉（文件类型图标 + 名称，点击列出全部产物）；左端目录钮切换产物目录列表视图（按产物 id 的 `/` 分段建目录树），列表视图下目录钮隐藏、文件名处显示"产物目录"，点选产物即回内容视图。产物列表缺省由组合层自动从会话消息流归集（受控 / 非受控一致），受控 DSL 侧接 `events.onSelectArtifact`（`setState artifact=${event.artifact}`）完成切换闭环；
- **消息流卡片**：assistant 消息中的 artifact part 内联渲染为产出物卡片（整卡可点击：着色图标盒 + 标题 + 元信息行「尺寸 · 类型」+ 右上箭头）；图标经 `resolveArtifactIcon` 解析（扩展名优先分桶并带着色档位——图片 image/violet、表格 table/green、数据 database/amber、代码 code/blue、脚本 terminal/blue、文档 file-text/slate，kind 兜底），与面板下拉、目录树中的同一产物图标一致；元信息行的尺寸取 `meta.size`（`formatArtifactSize` 格式化 B / KB / MB），类型标签取扩展名大写（缺省 kind 大写）；图标盒色值走 `--pactor-chat-artifact-tone-*` 令牌（暗色自动翻转，皮肤可精调）；
- **卡片区收起**：同一消息内连续的 artifact part 合为一组，多于 4 个时只展示前 4 张卡片，下方右侧「展开 / 收起」切换查看全部，其右侧「查看所有产物（n) ›」打开面板并定位产物目录视图（受控 DSL 侧接 `events.onOpenArtifactList` → `setState panelOpen=true`）；
- **布局**：桌面固定宽右栏，默认宽与对话列一致（`--pactor-chat-content-width`），左缘可拖拽调宽（夹取 `--pactor-chat-inspector-min-width` 480px ~ 页面宽 2/3）；面板背景 `--pactor-chat-inspector-bg` 略深于聊天区底色；面板调宽时聊天区左右恒保留 `--pactor-chat-content-gutter` 内间距；窄屏退化为覆盖抽屉；`artifact` / `panelOpen` 支持受控配置。

### 菜单外壳（ChatShell / AppShell）

侧栏 + 主区的应用外壳：菜单支持图标 / 角标 / 状态点 / 分组 / 禁用；桌面可折叠为 icon rail（hover 图标显示 Tooltip）；移动端侧栏变为覆盖抽屉（遮罩 / Escape / 路由变化关闭）；支持品牌区与侧栏底部固定区（如用户卡）。

### 皮肤

视图颜色全部经 `--pactor-chat-*` CSS 变量表达（默认值声明在 `:root`，经 `var(--语义令牌, <chat 默认>)` 桥接 ui 语义令牌）：覆盖变量即换肤——皮肤在 `:root` 覆盖 `--pactor-chat-*` 或 ui 语义令牌均优先于包内默认值；`<html data-pactor-theme="dark">` 启用内置暗色。侧栏宽度由 ui 皮肤令牌 `--sidebar-width` / `--sidebar-width-icon` 驱动（theme-studio 皮肤可直接覆盖）。结构布局（高度、对话列居中、面板贴右）由包内样式自持，嵌入时宿主只需给容器定高。

## Chat：一等 DSL 组件

`Chat` 是与 Button / Input 同级的 DSL 组件：`registerChatComponent(registry)` 注册一次，页面 DSL 即可声明完整聊天工作区。运行时服务（`transport` 必填、Safe Registry、附件回调、服务桥等）由宿主在根部经 `ChatServicesProvider` 注入一次。

与 pactor-app 集成时可用便捷工厂 `createChatComponentRegistry()`（含全部内置组件 + Chat / ChatShell），直接作为 `createPactorApplication` 的 `componentRegistry` 选项：

```tsx
import { createChatComponentRegistry } from '@pactor-app/chat';

createPactorApplication({
  appId: 'my-chat',
  componentRegistry: createChatComponentRegistry,
  // bootstrap layout.type: 'chat' 命中内置 ChatLayout（ui 布局层）
});
```

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
| 头部 | `title` / `headerExtra` / `header` / `showHeader` / `headerActions` / `editableTitle`（头部按内容自动渲染，无内容不渲染；产物面板打开时 header 与对话区同宽、不覆盖面板上方，面板关闭时通栏；不随对话列限宽） |
| 侧栏 | `menu` / `activeMenuKey` / `sidebar`（替代槽），事件 `onMenuSelect` |
| 空态 | `greeting` / `subtitle` / `suggestions` |
| 模型 | `models` / `model` / `modelPlacement`，事件 `onModelChange` |
| 上下文 | `contexts`，事件 `onContextsChange` |
| 消息操作 | `messageActions`，事件 `onMessageAction` |
| Composer | `toolbarStart` / `toolbarEnd` / `composerFooter` / `composerBottom` / `hideToolbar` |
| 产出物面板 | `artifact` / `panelOpen` / `inspector` / `artifacts`，事件 `onArtifact` / `onPanelClose` / `onOpenArtifact` / `onOpenArtifactList` / `onSelectArtifact` |

事件均为并行通知，内建默认行为总在包内执行。完整装配参考 `examples/chat`。

## createChatWorkspace（兼容路径）

`createChatWorkspace(services)` 以工厂闭包注入服务，返回可注册进页面运行时的 `ChatWorkspace` 组件——与 `Chat` 组件共用同一组合，行为一致，DSL props 与上表相同。

## 零 React 核心

消息模型、`ConversationStore`、Streaming 事件与 reducer、Safe Registry、capability 动作链（权限 → 确认 → 执行）均可脱离 React 使用与测试，支撑视图层的全部行为；`createManualDriver()` 供测试与手动驱动 transport。
