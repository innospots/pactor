---
title: 聊天交互页
slug: chat-page
order: 14
summary: 多轮对话 + 工具执行 + 产物栏；四区布局（图标栏 / 菜单区 / 对话区 / 附加内容区）与消息块类型（C1/C2/C3）
sourceRef: innos-diagram/references/14-聊天交互页.md
---

# 聊天交互页（Chat）

**组件类型：** 多轮对话 + 工具执行 + 会话侧栏  
**职责：** 展示消息流、思考/工具块、富文本回复与底部输入；右侧（或浮层）承载产物、执行步骤等当前对话的附加内容。

参考文档中的占位组件已映射为 `@pactor-app/ui` chat 目录的真实组件，预览即真实渲染效果：

| 参考占位 | 真实组件 / 配置 |
| --- | --- |
| ChatHeader（Z-H） | `ChatPage` 的 `conversationTitle` / `conversationHeaderAction` |
| ChatThread（Z-L） | `MessageList` + `ChatMessage`（parts 块类型） |
| ChatComposer（Z-I） | `Composer`（ChatPage 内建，亦可独立使用） |
| SessionPanel（Z-R） | `ChatPage` 产物栏（`artifacts`）与 `conversationRailItems` 附加项 |
| 会话列表 | `ChatPage` 的 `conversations` / `conversationSectionTitle` |
| 思考块 M-thought | parts `{ type: thinking }`（Thinking 组件） |
| 工具块 M-tool | parts `{ type: tool-call }`（ToolCall 组件） |

---

## 一、页面布局选型

| 布局 | 要点 | 实现 |
| --- | --- | --- |
| **C1** | 主聊天列 + 右侧固定附加栏（产物栏 ~380px） | `ChatPage` 默认形态，`artifacts` 非空即出现产物入口 |
| **C2** | 附加内容收起到对话图标栏浮层 | `conversationRailItems` 项设 `display: popover` |
| **C3** | 窄屏：附加内容改为底部 Drawer 或「对话｜统计」Tab | 外层 `Tabs` + `MessageList` / 附加面板 |

### 布局 C1 — 完整对话工作页（默认）

{{preview:01}}

四区整页布局：**最左图标栏**（`railItems`，仅图标 + Tooltip，不传整栏隐藏）、**展开菜单区**（品牌 + 图标文字导航 + 可折叠会话列表 + 底部分组，各自独立滚动）、**中间对话区**（头部 / Welcome / MessageList / Composer）、**对话图标栏**（header 下方右缘纵向图标列：内置产物入口 + `conversationRailItems` 附加项，点击 toggle）。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: ChatPage
  props:
    brand: { title: Pactor Chat, version: v1.0 }
    # 最左图标栏（仅图标 + Tooltip）
    railItems:
      - { key: chat, label: 对话, icon: chat }
      - { key: space, label: 空间, icon: folder }
      - { key: usage, label: 用量, icon: chart }
    railFooterItems:
      - { key: settings, label: 设置, icon: settings }
      - { key: me, label: 个人中心, icon: user }
    # 展开菜单区：品牌 + 图标文字导航
    menuItems:
      - { key: chat, label: 对话, icon: message-square }
      - { key: space, label: 空间, icon: folder }
      - { key: usage, label: 用量, icon: chart }
    activeMenuKey: chat
    # 会话区（Z-H 左侧）：标题自动拼数量，点击折叠
    conversationSectionTitle: 任务
    conversations:
      - { id: c1, title: 聊天页模板设计, description: 产物栏与步骤浮层…, time: 11:02 }
      - { id: c2, title: 官网改版文案, description: 首屏 Slogan 三选一…, time: 昨天 }
      - { id: c3, title: 数据导出脚本, description: 已生成 export.py…, time: 周一 }
    activeConversationId: c1
    moreLabel: 查看更多
    footerSectionTitle: 空间 (3)
    footerItems:
      - { key: ws-main, label: 主工作区, icon: building }
      - { key: ws-lab, label: 实验室, icon: zap }
    conversationTitle: 聊天页模板设计
    # 对话图标栏附加项（header 下方右缘纵向排列）：StepsPanel 浮层
    conversationRailItems:
      - key: steps
        label: 执行步骤
        icon: list
        display: popover
        content:
          type: StepsPanel
          props:
            steps:
              - { title: 理解需求, description: 分析页面布局与区域划分, status: done, duration: 12s }
              - { title: 生成页面骨架, description: ChatPage 四区布局, status: done, duration: 38s }
              - { title: 编写消息流 DSL, status: running }
              - { title: 联调产物栏, status: pending }
    # Z-L 消息流：M-user / M-thought / M-tool / M-assistant / artifacts 段
    messages:
      - id: m1
        role: user
        time: '11:02'
        parts:
          - { type: text, content: 帮我搭一个带产物栏和执行步骤浮层的聊天页 }
      - id: m2
        role: assistant
        time: '11:03'
        agent: { name: Pactor 助手, icon: chat }
        parts:
          - type: thinking
            status: done
            content: 用户需要一个聊天工作页：左侧导航 + 会话列表，中间消息流，右侧产物栏，另有执行步骤浮层。直接用 ChatPage 四区布局即可，消息块按 thinking → tool-call → markdown 顺序组织。
          - type: tool-call
            name: Bash
            status: done
            params: { command: pnpm --filter @pactor-app/ui test }
            result: Test Files 47 passed (47) · Tests 791 passed (791)
          - type: markdown
            content: |-
              已完成聊天页搭建，要点如下：

              - **四区布局**：图标栏 / 菜单区 / 对话区 / 产物栏
              - 消息流支持 `thinking`、`tool-call`、`markdown` 等块类型
              - 产物栏内置 markdown / code / dsl 活预览

              ```bash
              pnpm --filter @pactor-app/ui build
              ```
          - { type: artifacts, count: 2 }
        actions:
          - { name: copy, label: 复制, icon: copy }
          - { name: retry, label: 重试, icon: refresh }
    # Z-I 输入区：模型 chip + @ 行内提及
    composerPlaceholder: 输入消息… @ 引用文件 / 智能体
    models:
      - { value: qwen3-max, label: qwen3-max }
      - { value: kimi-k2, label: kimi-k2 }
      - { value: doubao-pro, label: doubao-pro }
    model: qwen3-max
    contexts:
      - trigger: '@'
        label: 引用上下文
        icon: file-text
        items:
          - { id: f1, label: chat-page.yaml, icon: file-text }
          - { id: f2, label: 会话数据接口, icon: database }
          - { id: a1, label: 代码审查助手, icon: users }
    # Z-R 产物栏（默认收起，图标栏首项 toggle；富模型内建预览）
    artifactTitle: 产物
    artifacts:
      - id: a1
        kind: markdown
        title: 聊天页设计说明.md
        content: |-
          # 聊天页设计说明

          - 布局：**C1 主聊天列 + 右侧产物栏**
          - 消息块：thinking / tool-call / markdown
          - 输入区：@ 提及 + 模型切换
      - id: a2
        kind: code
        language: bash
        title: run.sh
        content: |-
          #!/usr/bin/env bash
          pnpm --filter @pactor-app/ui build
          pnpm --filter @pactor-app/ui test
  events:
    onSend:
      - action: message
        params: { messageType: success, text: "已发送：${event}" }
    onMessageAction:
      - action: message
        params: { messageType: info, text: "消息操作：${event.action}" }
```bash
              pnpm --filter @pactor-app/ui build
              ```
          - { type: artifacts, count: 2 }
        actions:
          - { name: copy, label: 复制, icon: copy }
          - { name: retry, label: 重试, icon: refresh }
    # Z-I 输入区：模型 chip + @ 行内提及
    composerPlaceholder: 输入消息… @ 引用文件 / 智能体
    models:
      - { value: qwen3-max, label: qwen3-max }
      - { value: kimi-k2, label: kimi-k2 }
      - { value: doubao-pro, label: doubao-pro }
    model: qwen3-max
    contexts:
      - trigger: '@'
        label: 引用上下文
        icon: file-text
        items:
          - { id: f1, label: chat-page.yaml, icon: file-text }
          - { id: f2, label: 会话数据接口, icon: database }
          - { id: a1, label: 代码审查助手, icon: users }
    # Z-R 产物栏（默认收起，图标栏首项 toggle；富模型内建预览）
    artifactTitle: 产物
    artifacts:
      - id: a1
        kind: markdown
        title: 聊天页设计说明.md
        content: |-
          # 聊天页设计说明

          - 布局：**C1 主聊天列 + 右侧产物栏**
          - 消息块：thinking / tool-call / markdown
          - 输入区：@ 提及 + 模型切换
      - id: a2
        kind: code
        language: bash
        title: run.sh
        content: |-
          #!/usr/bin/env bash
          pnpm --filter @pactor-app/ui build
          pnpm --filter @pactor-app/ui test
  events:
    onSend:
      - action: message
        params: { messageType: success, text: "已发送：${event}" }
    onMessageAction:
      - action: message
        params: { messageType: info, text: "消息操作：${event.action}" }
```

### 布局 C2 — 图标栏浮层

`conversationRailItems` 项 `display: popover`（缺省）时，附加内容在图标列旁悬浮弹框展示（如预览 01 的「执行步骤」）；`display: panel` 则与产物栏同形态（右侧固定宽栏）。产物入口为图标栏内置首项，`hideArtifactRailItem: true` 可隐藏。

### 布局 C3 — 窄屏降级

窄屏去掉固定附加栏，用 `Tabs` 组织「对话｜统计」，或将附加面板放进 `Drawer placement: bottom`。

---

## 二、空会话 — Welcome 起始任务

{{preview:02}}

`messages` 为空时对话区展示 `welcome`（标题 / 说明 / 起始任务卡），prompts 选择即发送（走同一个 `onSend` 事件）。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: ChatPage
  props:
    brand: { title: Pactor Chat }
    menuItems:
      - { key: chat, label: 对话, icon: message-square }
      - { key: space, label: 空间, icon: folder }
    activeMenuKey: chat
    conversationSectionTitle: 任务
    conversations: []
    # messages 为空时展示 Welcome；prompts 选择即发送（onSend）
    welcome:
      title: 有什么可以帮你？
      description: 可以从下面的任务开始，或直接输入你的问题
      prompts:
        - { title: 写一个落地页, description: 生成响应式落地页 DSL, icon: square-pen, value: 帮我写一个产品落地页 }
        - { title: 解释这段代码, description: 粘贴代码获取逐行讲解, icon: code, value: 帮我解释一段代码 }
        - { title: 分析销售数据, description: 上传表格生成图表报告, icon: chart, value: 帮我分析一份销售数据表 }
    composerPlaceholder: 输入消息… @ 引用文件 / 智能体
    models:
      - { value: qwen3-max, label: qwen3-max }
      - { value: kimi-k2, label: kimi-k2 }
    model: qwen3-max
  events:
    onSend:
      - action: message
        params: { messageType: success, text: "已发送：${event}" }
```

---

## 三、区域 Z-L — 消息流（MessageList）

{{preview:03}}

按时间序渲染消息块；`autoScroll` 自动滚底（可关）。消息块经 `parts` 有序组合：

| 类型 | parts 写法 | 说明 |
| --- | --- | --- |
| **M-user** | `{ type: text }` | 右对齐气泡；纯文本 / 附件引用 |
| **M-thought** | `{ type: thinking, content, status }` | 思考块；`status: thinking` 进行中、`done` 可折叠 |
| **M-tool** | `{ type: tool-call, name, params, status, result }` | 工具名标题 + 参数/结果；`error` 状态配 `{ type: error }` 摘要 |
| **M-assistant** | `{ type: markdown, content }` | Markdown 正文（列表 / 链接 / 代码块） |
| **产物段** | `{ type: artifacts, count }` | 「已生成 n 个产物」，`onOpenArtifacts` 点击打开产物栏 |
| **system** | role=system + text | 居中弱提示（无气泡、无底色） |

| 规则 | 说明 |
| --- | --- |
| 流式 | 消息 `status: streaming` 末尾渲染光标；完成后出现操作行 |
| 操作行 | `actions: [{ name, label, icon }]`，completed / error 时展示，点击经 `onAction` / `onMessageAction` 传出 |
| 身份 | `agent: { name, icon }` 在 assistant 消息顶部展示 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: MessageList
  props:
    className: p-4
    messages:
      # system：居中弱提示（无气泡、无底色）
      - id: s1
        role: system
        parts:
          - { type: text, content: 已切换到模型 kimi-k2 · 上下文 46.5% }
      # M-user：右对齐气泡，纯文本 / 附件引用
      - id: u1
        role: user
        time: '11:20'
        parts:
          - { type: text, content: 把上周的工单数据整理成周报，要点加粗 }
      # M-assistant：thinking + tool-call + markdown + 产物段 + 操作行
      - id: a1
        role: assistant
        time: '11:21'
        agent: { name: Pactor 助手, icon: chat }
        parts:
          - type: thinking
            status: done
            content: 用户需要一份工单周报。先拉取上周工单列表，再按状态聚合成 Markdown 周报，关键指标加粗呈现。
          - type: tool-call
            name: Bash
            status: done
            params: { command: pactor report --week last --format md }
            result: 已汇总 128 条工单（已完成 96 / 进行中 24 / 阻塞 8）
          - type: markdown
            content: |-
              ## 工单周报（第 39 周）

              - **完成率 75%**，环比 +6%
              - **阻塞 8 条**，集中在支付网关联调
              - 下周重点：阻塞清理与回归验证
          - { type: artifacts, count: 3 }
        actions:
          - { name: copy, label: 复制, icon: copy }
          - { name: retry, label: 重试, icon: refresh }
      # M-tool 失败：error 状态 + 结果摘要
      - id: a2
        role: assistant
        time: '11:24'
        parts:
          - type: tool-call
            name: Bash
            status: error
            params: { command: pnpm deploy --prod }
            result: ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL · deploy 需要先登录
          - { type: error, message: 部署失败：缺少生产环境凭证，请先执行 pactor login }
      # 流式生成：status=streaming 末尾渲染光标
      - id: a3
        role: assistant
        status: streaming
        parts:
          - type: thinking
            status: thinking
            content: 正在整理部署失败的重试方案…
          - type: markdown
            content: 部署失败通常有两类原因，一是**凭证缺失**，二是…
  events:
    onAction:
      - action: message
        params: { messageType: info, text: "消息操作：${event.action}" }
    onOpenArtifacts:
      - action: message
        params: { messageType: info, text: 打开产物栏 }
```

---

## 四、区域 Z-I — 输入区（Composer）

{{preview:04}}

附件区 + 多行输入 + 工具栏（模型 chip / 发送钮）；Enter 发送、Shift+Enter 换行。

| 能力 | 配置 | 说明 |
| --- | --- | --- |
| **行内提及** | `contexts: [{ trigger, label, icon, items }]` | 输入触发符（`@` / `#` 等）在光标处弹菜单，输入过滤 / ↑↓ 选择 / 回车选中；选中替换为行内提及块（图标 + 文字、浅色背景、圆角），退格整体删除 |
| **模型切换** | `models` + `model` | 工具栏右端 chip，弹层选择经 `onModelChange` 传出 |
| **附件** | `attachments` + `onAttachFiles` | 输入区上方展示上传中（进度）/ 完成 / 失败；粘贴 / 拖拽文件可传 |
| **发送** | `onSubmit` / ChatPage `onSend` | 传出当前文本（提及块序列化为 trigger+label） |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Composer
  props:
    className: p-4
    placeholder: 输入消息… @ 引用文件 / 智能体，Enter 发送、Shift+Enter 换行
    rows: 3
    # 附件区（输入区上方）：上传中（进度）/ 完成 / 失败
    attachments:
      - { id: f1, name: 工单数据.xlsx, fileSize: 245760, fileType: xlsx, status: done }
      - { id: f2, name: 架构图.png, fileSize: 1048576, fileType: png, status: uploading, progress: 62 }
      - { id: f3, name: 旧报表.pdf, fileSize: 524288, fileType: pdf, status: error }
    # 模型 chip（工具栏右端、发送钮之前）
    models:
      - { value: qwen3-max, label: qwen3-max }
      - { value: kimi-k2, label: kimi-k2 }
      - { value: doubao-pro, label: doubao-pro }
    model: kimi-k2
    # 行内提及：输入触发符在光标处弹菜单，选中替换为行内提及块（退格整体删除）
    contexts:
      - trigger: '@'
        label: 引用上下文
        icon: file-text
        items:
          - { id: f1, label: 工单数据.xlsx, icon: file-text }
          - { id: f2, label: 会话数据接口, icon: database }
          - { id: a1, label: 周报助手, icon: users }
      - trigger: '#'
        label: 代码片段
        icon: code
        items:
          - { id: s1, label: curl 调用模板, icon: terminal }
          - { id: s2, label: yaml 页面骨架, icon: code }
  events:
    onSubmit:
      - action: message
        params: { messageType: success, text: "已发送：${event}" }
    onModelChange:
      - action: message
        params: { messageType: info, text: "切换模型：${event}" }
    onRemoveAttachment:
      - action: message
        params: { messageType: info, text: "移除附件：${event}" }
```

---

## 五、区域 Z-R — 附加内容（产物栏 / 图标栏）

| 区块 | 配置 | 说明 |
| --- | --- | --- |
| **产物栏** | `artifacts: [{ id, kind, title, content, language? }]` | 富模型内建预览：`markdown` / `code`（角标 + 高亮）/ `text` / `dsl` 活预览 / 图片（按扩展名）；含目录树与下载。`defaultArtifactOpen` 默认 false 不展示 |
| **图标栏附加项** | `conversationRailItems: [{ key, label, icon, display, content }]` | 点击 toggle；`content` 为 DslNode（如 `StepsPanel` 执行步骤时间线） |
| **激活态** | `activeConversationRailKey` + `onConversationRailChange` | 受控闭环；`null` 为全部收起 |

产物计数段（`{ type: artifacts, count }`）与产物栏联动：消息内点击「已生成 n 个产物」经 `onOpenArtifacts` 打开产物栏。

---

## 六、交互要点

1. 发送闭环：`onSend` 传出文本 → 调用方追加消息并置 `sending`，完成后复位（禁用发送钮防重发）。
2. 工具失败：`tool-call` `status: error` + `{ type: error }` 一行摘要；助手块底可配「重试」操作项。
3. 无会话：`welcome` + prompts（见 §二）；无产物时产物入口自动隐藏。
4. 窄屏：**C3**——图标栏保留，菜单区与附加栏收起，输入区工具栏收为 `…`。
