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
| 独立主体区（如录音） | `ChatPage` 的 `content` 槽（整体替换右侧主区域，含 header） |
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

````yaml
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
````

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

## 六、录音页模板 — content 槽整体替换（含 header）

{{preview:05}}

菜单新增独立主体入口（如「录音」）时，无需拆开 ChatPage 自己拼外壳：给 `content` 槽传 DslNode / React 元素，右侧主区域（对话 header / Welcome / MessageList / Composer / 对话图标栏 / 产物分栏）整体替换为调用方内容，最左图标栏与展开菜单区保留；菜单点击经 `onMenuSelect` → `setState` 闭环，`when` 互斥的多个 ChatPage 分别承载聊天、录音与思维导图主体。

录音主体由业务组件 `RecordingPage` 承载：左列录音记录列表（筛选 / 分组 / 处理状态 / 多选删除），右列转写详情（`transcript` / `summary` / `ai` / `knowledge` / `translation` 页签内建渲染，其余页签可传 `content` 槽），底部播放条；数据与行为全部经 props / events 进出。

#### DSL 配置

```yaml
# 与上方预览同源的真实 DSL（previews/05.yaml 全文）
# 菜单新增「录音」项，点击后右侧主区域（含对话 header）整体替换为
# content 槽内容——业务组件 RecordingPage（录音记录列表 + 转写详情 + 播放条）；
# 「对话」切回聊天主体。默认定位到「录音」页（state.menu 初值 recording）。
# 详细纪要 tab 点「查看思维导图」经 onMindmapAction 切入思维导图页
# （state.view=mindmap，第三个 ChatPage 分支），左上角返回键切回。
title: 录音页模板 — content 槽替换右侧主体（含 header）
height: 640
state: { menu: recording, view: recording, recTab: transcript, langSource: 自动判断, langTarget: English }
body:
  type: Flex
  children:
    # 对话主体：常规 ChatPage 四区布局
    - type: ChatPage
      when: "${state.menu !== 'recording'}"
      props:
        brand: { title: Pactor Chat, version: v1.0 }
        railItems:
          - { key: chat, label: 对话, icon: chat }
          - { key: space, label: 空间, icon: folder }
          - { key: recording, label: 录音, icon: music }
        railFooterItems:
          - { key: settings, label: 设置, icon: settings }
        # 菜单新增「录音」项；activeMenuKey 受控绑 state.menu
        menuItems:
          - { key: chat, label: 对话, icon: message-square }
          - { key: space, label: 空间, icon: folder }
          - { key: recording, label: 录音, icon: music }
        activeMenuKey: ${state.menu}
        conversationSectionTitle: 任务
        conversations:
          - { id: c1, title: 聊天页模板设计, description: 产物栏与步骤浮层…, time: 11:02 }
          - { id: c2, title: 官网改版文案, description: 首屏 Slogan 三选一…, time: 昨天 }
        activeConversationId: c1
        conversationTitle: 聊天页模板设计
        messages:
          - id: m1
            role: user
            time: '11:02'
            parts:
              - { type: text, content: 帮我搭一个带产物栏的聊天页 }
          - id: m2
            role: assistant
            time: '11:03'
            agent: { name: Pactor 助手, icon: chat }
            parts:
              - type: markdown
                content: |-
                  已完成聊天页搭建：

                  - **四区布局**：图标栏 / 菜单区 / 对话区 / 产物栏
                  - 菜单点击「录音」可切换到录音主体（`content` 槽）
        composerPlaceholder: 输入消息… @ 引用文件 / 智能体
        models:
          - { value: qwen3-max, label: qwen3-max }
          - { value: kimi-k2, label: kimi-k2 }
        model: qwen3-max
      events:
        onMenuSelect:
          - action: setState
            params: { menu: "${event}" }
        onSend:
          - action: message
            params: { messageType: success, text: "已发送：${event}" }
    # 录音主体：同一 ChatPage 外壳（图标栏 / 菜单区保留），右侧主区域
    # 由 content 槽整体接管——RecordingPage 业务组件承载录音工作区
    - type: ChatPage
      when: "${state.menu === 'recording' && state.view !== 'mindmap'}"
      props:
        brand: { title: Pactor Chat, version: v1.0 }
        railItems:
          - { key: chat, label: 对话, icon: chat }
          - { key: space, label: 空间, icon: folder }
          - { key: recording, label: 录音, icon: music }
        railFooterItems:
          - { key: settings, label: 设置, icon: settings }
        menuItems:
          - { key: chat, label: 对话, icon: message-square }
          - { key: space, label: 空间, icon: folder }
          - { key: recording, label: 录音, icon: music }
        activeMenuKey: ${state.menu}
        conversationSectionTitle: 任务
        conversations:
          - { id: c1, title: 聊天页模板设计, description: 产物栏与步骤浮层…, time: 11:02 }
          - { id: c2, title: 官网改版文案, description: 首屏 Slogan 三选一…, time: 昨天 }
        activeConversationId: c1
        # 主体内容槽：RecordingPage（左：录音记录列表；右：转写详情 + 播放条）
        content:
          type: RecordingPage
          props:
            selectLabel: 选择
            filters:
              - { key: all, label: 全部 }
              - { key: meeting, label: 会议 }
              - { key: device, label: 来自设备 }
              - { key: unsorted, label: 未整理 }
            processingText: 3 条录音处理中
            processingHint: 另有 3 条处理失败
            defaultActiveRecordingId: r1
            groups:
              - label: 今天
                items:
                  - { id: r1, title: Q3 产品定价策略评审会议, time: 07 月 28 日 14:02, duration: '42:18', status: 纪要已生成, statusType: success }
                  - { id: r2, title: 总部走廊临时产品讨论记录, time: 07 月 28 日 11:20, duration: '06:42', status: 上传失败 ↻, statusType: danger }
              - label: 昨天
                items:
                  - { id: r3, title: 华东区域重点制造业客户深度访谈, time: 07 月 27 日 15:00, duration: '28:05', status: 转写中 }
              - label: 本周
                items:
                  - { id: r4, title: 固件 2.3 灰度范围与断连问题…, time: 07 月 25 日 10:30, duration: '36:12', status: 纪要生成中 }
              - label: 上周
                items:
                  - { id: r5, title: 桌面端主导航与录音工作区设…, time: 07 月 21 日 16:10, duration: '51:09', status: 纪要已生成, statusType: success }
              - label: 本月
                items:
                  - { id: r6, title: 企业级 AI 产品采购决策研究阅读…, time: 07 月 12 日 22:18, duration: '18:31', status: 未整理 }
              - { label: 更早, items: [] }
            # 右列详情头部
            title: Q3 产品定价策略评审会议
            meta: 07 月 28 日 14:02 · 42:18
            editLabel: 编辑
            shareLabel: 分享
            # 「分享」Popover 复选内容（详细纪要锁定勾选）+ 确定后的分享对话框
            shareOptions:
              - { key: summary, label: 详细纪要, disabled: true }
              - { key: audio, label: 录音 }
              - { key: insight, label: AI 解读 }
              - { key: transcript, label: 原文转写 · 含发言人 }
            defaultShareSelectedKeys: [summary, audio, insight]
            shareLink: https://hojo.app/share/q3-product-review
            # 页签：transcript / summary / ai / knowledge / translation 页签
            # 分别内建渲染 segments / summary / insight / memory / translation；
            # activeTabKey 受控绑 state.recTab（思维导图页返回后保持原页签）
            activeTabKey: ${state.recTab}
            tabs:
              - { key: transcript, label: 原文转写 }
              - { key: summary, label: 详细纪要 }
              - { key: ai, label: AI 解读 }
              - { key: knowledge, label: 知识记忆 }
              - { key: translation, label: 翻译 }
            # 详细纪要：思维导图 / 会议概况 / 主要议题 / 评审结论 / 后续 / 相关材料 / 待办
            summary:
              mindmapActionLabel: 查看思维导图
              mindmap:
                center: Q3 产品评审
                left: [定价试点]
                right: [交付准备, 资源缺口]
              overview: 本次评审围绕 Q3 产品路线图 v3 的两处关键调整展开。团队讨论定价试点、企业版交付和资源缺口，确认首轮试点收窄至制造与医疗，企业版交付顺延至 9 月 28 日。财务口径本周补齐，结论下周回写路线图。
              topics:
                - { title: 定价试点范围, content: 上一版方案同时覆盖五个行业，销售准备、合规周期与客户用量差异过大。会议决定先收窄至制造和医疗，在财务统一席位、用量包与超量提醒口径后，再由销售启动定向邀请。 }
                - { title: 交付排期与取舍, content: 原排期没有覆盖安全合规复核和灰度支持。团队接受企业版顺延两周至 9 月 28 日，由王悦本周锁定人力方案，并在 9 月 22 日完成交付前复核。 }
              conclusions:
                - { item: 定价试点, conclusion: 首轮仅覆盖制造、医疗, owner: 李珂 }
                - { item: 企业版交付, conclusion: 顺延至 9 月 28 日, owner: 王悦 }
                - { item: 资源缺口, conclusion: 财务评审后回补结论, owner: 王原 }
              followUpTitle: 资源缺口与后续
              followUp: 销售材料、试点报价和企业版支持人力仍依赖同一财务结论。结论回补前，第二批客户暂不进入承诺名单。
              materials:
                - { id: m1, title: 上周评审纪要：定价试点未决项, meta: 7 月 21 日 · 文档 }
                - { id: m2, title: Q3 路线图 v3.pdf, meta: 今天 09:10 · PDF }
                - { id: m3, title: 竞品 A 定价调整公告, meta: 7 月 24 日 · 网页 }
              todos:
                - { id: t1, title: 对齐财务定价口径, owner: 李珂 · 本周, done: true }
                - { id: t2, title: 形成企业版人力方案, owner: 王悦 · 下周, done: true }
                - { id: t3, title: 更新试点客户邀请名单, owner: 王原 · 周五 }
              actions:
                - { key: copy, icon: copy }
                - { key: share, icon: share-2 }
                - { key: like, icon: thumbs-up }
                - { key: dislike, icon: thumbs-down }
            # 知识记忆：分组卡片（组标题自动拼接计数）
            memory:
              groups:
                - label: 客观事实
                  items:
                    - { title: 企业版交付日期, content: 企业版交付从 9 月 14 日顺延至 9 月 28 日，增加两周安全合规与灰度支持时间。 }
                    - { title: 首轮试点行业, content: 首轮只覆盖制造与医疗，不再同时推进五个行业。 }
                    - { title: 试点客户数量, content: 首批客户控制在二十家，并按行业和设备批次记录反馈。 }
                    - { title: 固件灰度范围, content: 固件 2.3 已修复断连问题，下周开始面向高断连设备批次灰度。 }
                - label: 决策
                  items:
                    - { title: 采用双轨定价, content: 席位费与用量包并行，试点期间只提醒超额，不自动扣费。 }
                    - { title: 更新路线图 v3, content: 路线图写入试点范围收窄与交付顺延，并在下周补齐财务口径。 }
                    - { title: 补齐财务口径, content: 财务本周给出席位费与用量包的统一口径，结论下周回写路线图。 }
                - label: 核心观点
                  items:
                    - { title: 可比性比覆盖面更重要, content: 减少行业数量可以降低合规周期和用量差异对结论的干扰。 }
                    - { title: 预算必须可预测, content: 制造业客户更关心年度预算上限，过大的用量波动会阻碍采购审批。 }
                    - { title: 交付完整性优先, content: 安全合规、审计日志和离线同步应在企业版交付前完成，而不是交付后补齐。 }
                    - { title: 试点先验证购买意愿, content: 本轮不追求收入规模，重点记录购买意愿和所有反对原因。 }
              actions:
                - { key: copy, icon: copy }
                - { key: share, icon: share-2 }
                - { key: like, icon: thumbs-up }
                - { key: dislike, icon: thumbs-down }
            # AI 解读：视角横幅（「修改」打开内建解读身份弹层）/ 基础信息 /
            # 章节速览 / 观点分析 / 操作条
            insight:
              perspectiveTitle: AI 判断你负责产品战略与关键业务决策
              perspectiveActionLabel: 修改
              perspectiveHint: 本页会从决策者视角解读会议，优先关注战略意图、交付风险和下一步行动。
              defaultPerspectiveInput: 我是产品负责人，关注产品战略、团队目标和关键业务决策。
              basics: 产品团队季度评审会。核心是用范围收窄换取口径一致：牺牲试点覆盖面，换取数据可比性与交付确定性。
              chapters:
                - { time: '00:05', title: 定点价格, content: 团队先把讨论拉回到首批客户真正会比较的价格锚点。席位费负责预算可预测性，用量包覆盖波动需求；试点阶段暂不自动收取超额费用，而是先记录触发频率和客户反应，为正式定价保留足够证据。 }
                - { time: '08:16', title: 交付边界, content: 企业版交付不仅是功能完成，还需要补齐数据保留周期、管理员审计日志和离线录音同步。团队接受顺延两周，以换取完整的安全合规复核和更可控的灰度支持。 }
                - { time: '21:05', title: 执行与收口, content: 固件修复进入小范围灰度后，名单会优先覆盖历史断连率最高的设备批次。会议最后把财务口径、支持人力和试点名单分别落实到负责人，避免结论停留在讨论层面。 }
              viewpoints:
                - { speaker: 李珂, label: 数据优先, content: 数据可比性优先于推进速度，也说明上一轮样本口径不足以支持定价判断。 }
                - { speaker: 王悦, label: 交付优先, content: 接受顺延，但要求先锁定人力，把风险从排期转移到资源保障。 }
                - { speaker: 王原, label: 协调与收口, content: 把双方诉求转成带负责人与期限的行动项，确保下一次评审可以直接核对结果。 }
              actions:
                - { key: copy, icon: copy }
                - { key: share, icon: share-2 }
                - { key: like, icon: thumbs-up }
                - { key: dislike, icon: thumbs-down }
            segments:
              - speaker: 王原
                avatarText: 王
                time: 00:42
                content: 定价试点先按席位费加用量包的双轨方式推进，首批客户仍控制在二十家，但不再只看是否愿意付费。我们需要把行业、席位数、预计月用量、采购决策链和超量提醒的触发频率一起记录，先确认这套口径能否让销售、财务和客户在同一张表上讨论；如果客户的异议来自预算不确定性，就不要急着靠折扣解决，而要先把席位费与用量包各自承担的价值讲清楚。
              - speaker: 发言人 1
                avatarText: '?'
                time: 02:18
                content: 制造业客户更关注全年预算能否提前锁定，而不是单次报价看起来是否足够低。如果用量包的浮动过大，采购部门会把它理解为不可预测的成本，审批往往会在财务复核阶段停下来；所以我们需要给试点客户一个清楚的上限、接近上限时的提醒，以及一段时间内不自动扣费的承诺，同时把不同工厂和设备批次的使用模式分开记录，避免把高频团队的波动误当成所有客户都会遇到的问题。
              - speaker: 发言人 2
                avatarText: '?'
                time: 04:06
                marked: true
                content: 是否可以给试点客户设置一个与席位规模对应的用量上限，同时保留超出部分的提醒，但在这一轮先不自动扣费？这样我们既能看到真实的超量频率，也不会因为一笔意外费用破坏刚建立的信任。提醒里还应该说明当前用量、预计月底用量和可选的下一步，让销售能在客户提出疑问时直接回到同一套解释，而不是每个人都临时给出不同承诺。
              - speaker: 发言人 3
                avatarText: '?'
                time: 06:31
                content: 销售侧需要一页非常明确的价格对比，否则客户会把席位费和时长包理解成重复收费，尤其是当他们同时拥有多个部门和不同设备时。那一页不应该只列价格，还要解释每个部分解决的是什么问题、什么情况下会收到提醒、试点…
            # 修改发言人弹层的人员选项（点说话人右侧铅笔打开）
            speakers:
              - { name: 王原, role: 产品负责人 · Hojo, tag: 参会人 }
              - { name: 李珂, role: 产品设计 · Hojo, tag: 参会人 }
              - { name: 王悦, role: 交付负责人 · Acme, tag: 自动识别 }
              - { name: 陈致远, role: 客户成功 · Acme, tag: 用户创建 }
            # 翻译：语言选择器（点击打开内建语种弹层）+ 双语对照段落；
            # 弹层确定经 onLanguageChange 回写 state，chip 与译文列标题跟随更新
            translation:
              languageLabel: "${state.langSource} → ${state.langTarget}"
              targetLabel: "译文 · ${state.langTarget}"
              sourceLanguages:
                - { key: auto, label: 自动判断 }
                - { key: zh, label: 中文 }
                - { key: en, label: 英语 }
                - { key: ja, label: 日语 }
                - { key: fr, label: 法语 }
                - { key: es, label: 西班牙语 }
              targetLanguages:
                - { key: zh, label: 中文 }
                - { key: en, label: English }
                - { key: ja, label: 日本語 }
              defaultSourceLanguage: auto
              defaultTargetLanguage: en
              segments:
                - speaker: 王原
                  avatarText: 王
                  source: 从平台现状来看，企业入驻、成员邀请和产品注册流程已经基本完整，应用端也已经覆盖。下一步需要确认的是，首批试点客户能否在统一价格口径下顺利完成采购审批。
                  target: The platform now covers company onboarding, member invitations, product registration, and the app experience. The next question is whether the first pilot customers can complete procurement under one clear pricing model.
                - speaker: 李珂
                  avatarText: 李
                  source: 企业版交付前还需要完成安全合规评审，并补齐数据保留周期、管理员审计日志和离线录音同步。我们宁可多留两周，也不要把这些问题推到客户正式使用之后。
                  target: Before the enterprise release, we still need to finish the security review and document data retention, admin audit logs, and offline recording sync. It is better to take two more weeks than leave these gaps for customers to discover after rollout.
              actions:
                - { key: copy, icon: copy }
                - { key: share, icon: share-2 }
                - { key: like, icon: thumbs-up }
                - { key: dislike, icon: thumbs-down }
            # 底部播放条
            player: { currentTime: '14:22', totalTime: '42:18', progress: 34 }
          events:
            # 列表「选择」进入多选模式：勾选经 onRecordingSelectionChange 传出
            # 完整选中列表，「删除」经 onDeleteRecordings 传出选中 id 列表
            onRecordingSelectionChange:
              - action: setState
                params: { selRecordings: "${event}" }
            onDeleteRecordings:
              - action: message
                params: { messageType: success, text: "删除录音：${event}" }
            onSelectRecording:
              - action: message
                params: { messageType: info, text: "选中录音：${event}" }
            onSpeakerChange:
              - action: message
                params: { messageType: success, text: "第 ${event.index} 段发言人：${event.previous} → ${event.name}" }
            onNewRecording:
              - action: message
                params: { messageType: success, text: 开始新录音 }
            # 点「分享」仅打开内建 Popover（不绑 onShare）；
            # 「确定」经 onShareConfirm 传出选中内容 key 列表并打开分享对话框
            onShareConfirm:
              - action: message
                params: { messageType: success, text: "分享内容：${event}" }
            onShareChannel:
              - action: message
                params: { messageType: info, text: "分享渠道：${event}" }
            # 点击「查看思维导图」：切换到思维导图页（state.view）
            onMindmapAction:
              - action: setState
                params: { view: mindmap }
            onTabChange:
              - action: setState
                params: { recTab: "${event}" }
            onSummaryAction:
              - action: message
                params: { messageType: info, text: "纪要操作：${event}" }
            onMaterialClick:
              - action: message
                params: { messageType: info, text: "打开材料：${event}" }
            # 待办事项：点击在组件内切换选中态（对勾 ↔ 空圈），
            # 变更后经 onTodoSelectionChange 传出完整选中 id 列表
            onTodoSelectionChange:
              - action: message
                params: { messageType: info, text: "已选待办：${event}" }
            # 点击「修改」仅打开内建弹层（不绑 onPerspectiveEdit）；
            # 确认「应用身份」才经 onPerspectiveApply 调用外部事件
            onPerspectiveApply:
              - action: message
                params: { messageType: success, text: "已应用解读身份：${event}" }
            onInsightAction:
              - action: message
                params: { messageType: info, text: "解读操作：${event}" }
            onMemoryAction:
              - action: message
                params: { messageType: info, text: "记忆操作：${event}" }
            # 点击语言选择器仅打开内建弹层（不绑 onLanguageClick）；
            # 选完语言点「确定」才经 onLanguageChange 抛出事件
            onLanguageChange:
              - action: setState
                params: { langSource: "${event.sourceLabel}", langTarget: "${event.targetLabel}" }
            onTranslationAction:
              - action: message
                params: { messageType: info, text: "翻译操作：${event}" }
      events:
        onMenuSelect:
          - action: setState
            params: { menu: "${event}" }
    # 思维导图页：详细纪要 tab 点「查看思维导图」经 onMindmapAction 切入
    # （state.view=mindmap），同一 ChatPage 外壳下替换右侧主体；
    # 左上角返回键切回录音页（state.view=recording），页签保持原选中
    - type: ChatPage
      when: "${state.menu === 'recording' && state.view === 'mindmap'}"
      props:
        brand: { title: Pactor Chat, version: v1.0 }
        railItems:
          - { key: chat, label: 对话, icon: chat }
          - { key: space, label: 空间, icon: folder }
          - { key: recording, label: 录音, icon: music }
        railFooterItems:
          - { key: settings, label: 设置, icon: settings }
        menuItems:
          - { key: chat, label: 对话, icon: message-square }
          - { key: space, label: 空间, icon: folder }
          - { key: recording, label: 录音, icon: music }
        activeMenuKey: ${state.menu}
        conversationSectionTitle: 任务
        conversations:
          - { id: c1, title: 聊天页模板设计, description: 产物栏与步骤浮层…, time: 11:02 }
          - { id: c2, title: 官网改版文案, description: 首屏 Slogan 三选一…, time: 昨天 }
        activeConversationId: c1
        content:
          type: Flex
          props: { direction: vertical, className: h-full w-full p-6 }
          children:
            # 头部：返回键 + 标题
            - type: Flex
              props: { align: center, gap: small }
              children:
                - type: Button
                  props: { icon: arrow-left, variant: text }
                  events:
                    onClick:
                      - action: setState
                        params: { view: recording }
                - { type: Text, props: { text: 思维导图, strong: true, size: large } }
            # 中部：中心节点 + 竖线 + 分组列
            - type: Flex
              props: { justify: center, align: center, className: min-h-0 flex-1 }
              children:
                - type: Flex
                  props: { align: center, gap: large }
                  children:
                    - type: Flex
                      props:
                        direction: vertical
                        gap: small
                        className: rounded-xl bg-primary px-6 py-6
                      children:
                        - { type: Text, props: { text: Q3 产品评审, strong: true, size: large, className: text-primary-foreground } }
                        - { type: Text, props: { text: 路线图 v3, size: small, className: text-primary-foreground } }
                    - { type: Flex, props: { className: w-px bg-border, style: { alignSelf: stretch } } }
                    - type: Flex
                      props: { direction: vertical, gap: large }
                      children:
                        - type: Flex
                          props: { align: start, gap: middle }
                          children:
                            - { type: Text, props: { text: 定价试点, size: small, className: rounded-full bg-muted px-2.5 py-1 } }
                            - type: Flex
                              props: { direction: vertical, gap: small }
                              children:
                                - { type: Text, props: { text: 收窄至制造 / 医疗两行业, strong: true } }
                                - { type: Text, props: { text: 财务口径先行 · 李珂, strong: true } }
                                - { type: Text, props: { text: 口径负责人：李珂 · 本周, size: small, type: secondary } }
                        - type: Flex
                          props: { align: start, gap: middle }
                          children:
                            - { type: Text, props: { text: 交付排期, size: small, className: rounded-full bg-muted px-2.5 py-1 } }
                            - type: Flex
                              props: { direction: vertical, gap: small }
                              children:
                                - { type: Text, props: { text: 企业版顺延两周 → 9/28, strong: true } }
                                - { type: Text, props: { text: 人力方案锁定 · 王悦 · 下周, size: small, type: secondary } }
                        - type: Flex
                          props: { align: start, gap: middle }
                          children:
                            - { type: Text, props: { text: 资源缺口, size: small, className: rounded-full bg-warning/10 px-2.5 py-1 text-warning } }
                            - type: Flex
                              props: { direction: vertical, gap: small }
                              children:
                                - { type: Text, props: { text: 依赖财务口径确认 · 风险, strong: true } }
                                - { type: Text, props: { text: 下周回补结论, size: small, type: secondary } }
                        - type: Flex
                          props: { align: start, gap: middle }
                          children:
                            - { type: Text, props: { text: 行动项, size: small, className: rounded-full bg-muted px-2.5 py-1 } }
                            - type: Flex
                              props: { direction: vertical, gap: small }
                              children:
                                - { type: Text, props: { text: 对齐财务口径 · 李珂, strong: true } }
                                - { type: Text, props: { text: 人力方案落纸面 · 王悦, strong: true } }
                                - { type: Text, props: { text: 结论同步全组 · 王原 · 今天, strong: true } }
            # 底部右侧操作
            - type: Flex
              props: { justify: end, gap: middle }
              children:
                - type: Button
                  props: { text: 保存为图片, icon: image }
                  events:
                    onClick:
                      - action: message
                        params: { messageType: success, text: 已保存为图片 }
                - type: Button
                  props: { text: 分享, icon: share-2, variant: primary }
                  events:
                    onClick:
                      - action: message
                        params: { messageType: info, text: 分享思维导图 }
      events:
        onMenuSelect:
          - action: setState
            params: { menu: "${event}" }
```

| 要点 | 说明 |
| --- | --- |
| **替换范围** | `content` 提供时右侧主区域整体替换（含 header），左侧图标栏 / 展开菜单区不受影响 |
| **内容形态** | React 元素直接渲染；DslNode 经 Renderer 渲染（同 `composerFooter` 等槽位） |
| **菜单切换** | `activeMenuKey` 受控绑 `${state.menu}`，`onMenuSelect` → `setState`；两个 ChatPage 用 `when` 互斥 |
| **RecordingPage** | 录音工作区业务组件：`groups` / `tabs` / `segments` / `player` 数据化 props，事件经 `onSelectRecording` / `onTabChange` / `onNewRecording` 等传出；「选择」进入多选模式，勾选经 `onRecordingSelectionChange`、删除二次确认后经 `onDeleteRecordings` 传出 |

---

## 七、交互要点

1. 发送闭环：`onSend` 传出文本 → 调用方追加消息并置 `sending`，完成后复位（禁用发送钮防重发）。
2. 工具失败：`tool-call` `status: error` + `{ type: error }` 一行摘要；助手块底可配「重试」操作项。
3. 无会话：`welcome` + prompts（见 §二）；无产物时产物入口自动隐藏。
4. 窄屏：**C3**——图标栏保留，菜单区与附加栏收起，输入区工具栏收为 `…`。
