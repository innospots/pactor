---
title: 仪表盘页
slug: dashboard
order: 12
summary: 聚合指标、趋势、构成与快捷入口的看板页；P1 运营看板 / P2 工作台 / P3 单列，Widget 卡片 W1–W6
sourceRef: innos-diagram/references/12-仪表盘页.md
---

# 仪表盘页

**组件类型：** 概览 / 工作台 / 运营看板  
**职责：** 在控制台外壳内聚合指标、趋势、构成与快捷入口；只读为主，少量筛选与下钻 link。

**与「卡片列表页」的区别：** 卡片列表页的 Card 是 **实体摘要**（插件、租户等），用上/中/下三层与整卡进详情；本页的 Card 是 **看板 Widget**（指标、图表、进度条），用 **W1–W6** 样式编号，不套用三层语义。

---

## 页面布局选型

| 布局 | 要点 | 典型场景 |
| --- | --- | --- |
| **P1** | 页头 + **W2 筛选条卡** + 分区标题 + 多段 Grid（指标 / 全宽图表 / 双列构成） | Nexus 运营概览 |
| **P2** | 页头 + **快捷入口 Grid（W5）** + 可选 1 行指标 | Platform / 租户「工作台」 |
| **P3** | 单列纵向堆叠 Widget，无多列指标带 | 窄屏降级、极简首页 |

线框须标注 `仪表盘 · P1` 及所用 **W*** 卡片类型。

## 布局 P1 — 运营分析看板（默认）

{{preview:01}}

| 规则 | 说明 |
| --- | --- |
| 页头 | 左：**标题** + **muted 副标题**；右：**实时摘要**（secondary、等宽数字）+ **刷新**（reload 数据源） |
| 分区 | **h4 段标题**（可带当前筛选时间范围） |
| 栅格 | 指标区常用 `columns: 4`；构成区 `columns: 2`；图表 **独占一行** 全宽 Card |
| 下钻 | Widget 内 **link 按钮** 跳列表/日志；线框注目标路由或「建设中」 |

```text
│ {模块} / 仪表盘                                                          │
│ 仪表盘  Nexus Console — 系统管理概览          实时 12 RPM · 3k TPM  [↻] │
│ ┌─ W2 筛选条卡 ─────────────────────────────────────────────────────────┐ │
│ │ 分析时间范围  [ 2026-09-22 — 2026-09-28 ▼ ]  （预设：近7天…）        │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
│ 核心概览 · {start} — {end}                                               │
│ ┌─ W1 ─────┐ ┌─ W1 ─────┐ ┌─ W1 ─────┐ ┌─ W1 ─────┐   Grid·4·gap16   │
│ │ 请求量    │ │ 成功率    │ │ 平均响应  │ │ 计费金额  │                   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘                   │
│ ┌─ W3 趋势分析 ─────────────────────────────────────────────────────────┐ │
│ │ 观察流量…                    [请求|Token|费用|延迟]  ToggleGroup      │ │
│ │ ┌──────────────────────────────────────────────────────────────────┐ │ │
│ │ │                     AreaChart 占位区 h≈320                        │ │ │
│ │ └──────────────────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
│ ┌─ W4 用量·模型 ──────────────┐ ┌─ W4 用量·客户端 ──────────────┐      │
│ │ 说明 muted + Progress 行…    │ │ 同上                           │      │
│ └──────────────────────────────┘ └──────────────────────────────┘      │
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16 }
      children:
        - type: Flex
          props: { justify: space-between, align: center }
          children:
            - type: Flex
              props: { direction: vertical, gap: 4, align: start }
              children:
                - type: Text
                  props: { text: 仪表盘, size: large, strong: true }
                - type: Text
                  props:
                    text: Nexus Console — 系统管理概览
                    size: small
                    type: secondary
            - type: Flex
              props: { gap: 8, align: center }
              children:
                - type: Text
                  props: { text: 实时 12 RPM · 3k TPM, size: small, type: secondary }
                - type: Button
                  props: { text: 刷新, icon: refresh, size: small }
        - type: Card
          children:
            - type: Flex
              props: { align: center, gap: 8 }
              children:
                - type: Text
                  props: { text: 分析时间范围, className: shrink-0 }
                - type: DatePicker
                  props: { mode: range, placeholder: 选择起止日期 }
        - type: Text
          props: { text: 核心概览 · 2026-09-22 — 2026-09-28, strong: true }
        - type: Grid
          props: { columns: 4, gap: 16 }
          children:
            - type: Card
              children:
                - type: Flex
                  props: { direction: vertical, gap: 8 }
                  children:
                    - type: Flex
                      props: { justify: space-between, align: center }
                      children:
                        - type: Text
                          props: { text: 请求量, size: small, type: secondary }
                        - type: Icon
                          props: { name: chart-column, size: sm }
                    - type: Statistic
                      props: { value: '1,234,567' }
                    - type: Text
                      props: { text: 12 位活跃客户端 · 98M Token, size: small, type: secondary }
            - type: Card
              children:
                - type: Flex
                  props: { direction: vertical, gap: 8 }
                  children:
                    - type: Flex
                      props: { justify: space-between, align: center }
                      children:
                        - type: Text
                          props: { text: 成功率, size: small, type: secondary }
                        - type: Icon
                          props: { name: circle-check, size: sm }
                    - type: Statistic
                      props: { value: 99.92, suffix: '%' }
                    - type: Text
                      props: { text: 较上期 +2.1% ↑, size: small, type: secondary }
            - type: Card
              children: [ ... ]  # W1·平均响应（186ms）
            - type: Card
              children: [ ... ]  # W1·计费金额（328.50 元）
        - type: Card
          props: { title: 趋势分析 }
          children:
            - type: Flex
              props: { direction: vertical, gap: 8 }
              children:
                - type: Flex
                  props: { justify: space-between, align: center }
                  children:
                    - type: Text
                      props: { text: 观察流量与消费趋势, size: small, type: secondary }
                    - type: Segmented
                      props:
                        value: req
                        options:
                          - { label: 请求, value: req }
                          - { label: Token, value: token }
                          - { label: 费用, value: cost }
                          - { label: 延迟, value: latency }
                - type: AreaChart
                  props:
                    xKey: date
                    yKeys: [requests, tokens]
                    height: 320
                    data: [ ... ]
        - type: Grid
          props: { columns: 2, gap: 16 }
          children:
            - type: Card
              props: { title: 用量构成 · 模型 }
              children:
                - type: Flex
                  props: { direction: vertical, gap: 8, align: start }
                  children:
                    - type: Text
                      props:
                        text: 按请求量分布，识别主要模型流量来源
                        size: small
                        type: secondary
                        className: w-full
                    - type: Flex
                      props: { align: center, gap: 8, className: w-full }
                      children:
                        - type: Text
                          props: { text: gpt-4o, size: small, style: { width: 110 } }
                        - type: Progress
                          props: { value: 42, style: { flex: 1 } }
                        - type: Text
                          props: { text: 42%, size: small, style: { width: 40 } }
                    - type: Flex
                      props: { align: center, gap: 8, className: w-full }
                      children: [ ... ]  # claude-3 · 28%
                    - type: Flex
                      props: { align: center, gap: 8, className: w-full }
                      children: [ ... ]  # doubao-pro · 18%
                    - type: Flex
                      props: { align: center, gap: 8, className: w-full }
                      children: [ ... ]  # 其他 · 12%
                    - type: Button
                      props: { text: 查看全部 →, variant: link }
            - type: Card
              props: { title: 用量构成 · 客户端 }
              children: [ ... ]  # 同上结构，按客户端分布
```

## 布局 P2 — 工作台 / 欢迎页

{{preview:02}}

无全局时间筛选时可 **省略 W2**；指标行可选 0–1 行 W1。

```text
│ 工作台                                                                   │
│ 上午好，{用户}                                                           │
│ ┌─ W5 ──┐ ┌─ W5 ──┐ ┌─ W5 ──┐ ┌─ W5 ──┐   Grid·maxColumns 4          │
│ │ [图标] │ │ [图标] │ │ [图标] │ │ [图标] │                               │
│ │ 租户管理│ │ 用户   │ │ 邀请   │ │ 文档   │                               │
│ └────────┘ └────────┘ └────────┘ └────────┘                               │
│ ┌─ W6 待办摘要 ─────────────────────────────────────────────────────────┐ │
│ │ 注册审批 3 条待处理                              [查看全部 →]          │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16 }
      children:
        - type: Text
          props: { text: 上午好，管理员, size: large, strong: true }
        - type: Grid
          props: { columns: 4, gap: 16 }
          children:
            - type: Card
              props: { hoverable: true, contentClassName: flex flex-col items-center justify-center gap-2 }
              children:
                - type: Icon
                  props: { name: building, size: lg }
                - type: Text
                  props: { text: 租户管理 }
            - type: Card
              props: { hoverable: true, contentClassName: flex flex-col items-center justify-center gap-2 }
              children:
                - type: Icon
                  props: { name: user, size: lg }
                - type: Text
                  props: { text: 用户管理 }
            - type: Card
              props: { hoverable: true, contentClassName: flex flex-col items-center justify-center gap-2 }
              children: [ ... ]  # 邀请成员（Icon plus）
            - type: Card
              props: { hoverable: true, contentClassName: flex flex-col items-center justify-center gap-2 }
              children: [ ... ]  # 帮助文档（Icon file-text）
        - type: Card
          props: { title: 待办摘要 }
          children:
            - type: Flex
              props: { direction: vertical, gap: 8 }
              children:
                - type: Flex
                  props: { justify: end }
                  children:
                    - type: Button
                      props: { text: 查看全部 →, variant: link }
                - type: Table
                  props:
                    pagination: false
                    columns:
                      - { title: 事项, dataIndex: item }
                      - { title: 提交人, dataIndex: submitter }
                      - { title: 时间, dataIndex: time }
                      - title: 状态
                        width: 100
                        align: center
                        cell:
                          type: Status
                          props:
                            status: "${row.statusType}"
                            text: "${row.statusText}"
                    dataSource: [ ... ]
```

## 布局 P3 — 单列堆叠

{{preview:03}}

P1 在窄屏或极简产品时的降级形态：**指标 Grid 降为 1 列**、W3/W4 **纵向排列**，逻辑顺序与 P1 相同。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库；与 P1 同节点顺序，Grid 降为 1 列）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16 }
      children:
        - type: Flex   # 页头：左标题/副标题，右实时摘要 + 刷新（同 P1）
          props: { justify: space-between, align: center }
          children: [ ... ]
        - type: Card   # W2 筛选条（同 P1）
          children: [ ... ]
        - type: Text
          props: { text: 核心概览 · 2026-09-22 — 2026-09-28, strong: true }
        - type: Grid
          props: { columns: 1, gap: 16 }
          children:
            - type: Card
              children: [ ... ]  # W1·请求量
            - type: Card
              children: [ ... ]  # W1·成功率
        - type: Card   # W3 趋势（AreaChart height: 280，同 P1 结构）
          props: { title: 趋势分析 }
          children: [ ... ]
        - type: Card   # W4 用量构成 · 模型（同 P1 结构）
          props: { title: 用量构成 · 模型 }
          children: [ ... ]
```

## 看板卡片样式（W1–W6）

Widget Card 统一外框为 **Card 组件**：白底、圆角、内边距；无「下层底栏背景」约定，除非 W5 刻意区分。

### W1 — 指标卡（Statistic）

**用途：** KPI 单值 + 辅助说明或下钻 link。

```text
┌─ Card · stat-card ─────────────────────┐
│ 请求量                          [图标] │  ← 上排：平铺 space-between
│ 1,234,567                              │  ← Statistic value·strong·tabular
│ 12 位活跃客户端 · 98M Token            │  ← muted 一行 或 link「N 个失败 →」
└────────────────────────────────────────┘
```

| 元素 | 规则 |
| --- | --- |
| **title** | Statistic 标题，短文案 |
| **value** | 主数字；可有 **suffix**（`%`、`ms`、货币符号） |
| **icon** | 右上装饰图标；不单独可点 |
| **脚注** | muted 说明 **或** link 下钻（错误率、可靠性等） |
| **对比** | 可选第二行：`较上期 +12%`（涨跌色须 **不仅靠颜色**，带 ↑↓ 或文案） |

线框标注：`W1·指标`、是否含 link 脚注。

### W2 — 筛选 / 工具条卡

**用途：** 页级或段级筛选，**不占图表区**。

```text
┌─ Card（可无 title）────────────────────────────────────────────────────┐
│ 分析时间范围  [ DatePicker range · 280px ]   预设：今天 | 近7天 | …    │
└────────────────────────────────────────────────────────────────────────┘
```

- 控件：DatePicker range、Select、Segmented 等；变更触发 **reload** 关联 `dataSource`。
- 筛选字段多时可引用「搜索列表页」的 **F1 内联** 形态，但仍包在 **单张 W2 Card** 内。
- 线框 **不要** 把表格画进 W2；浮层筛选见搜索列表页 **F2**。

### W3 — 图表卡

**用途：** 单图或单表可视化容器。

```text
┌─ Card · title: 趋势分析 ───────────────────────────────────────────────┐
│ 副标题 muted                                    [ToggleGroup 指标切换] │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  Line / Area / Bar 占位（标注类型与高度，如 h=320）                 │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

- 标题用 Card `title`；副说明用 muted 一行。
- 工具栏与副标题 **同一行** `justify: space-between`：Segmented / ToggleGroup / [导出]。
- 图区固定最小高度；加载用骨架块，不闪 0 轴。
- 空数据：图区内 Empty +「调整时间范围」。

### W4 — 构成卡（Progress 行）

**用途：** Top N 占比、模型/客户端/租户分布。

```text
┌─ Card · title: 用量构成 · 模型 ────────────────────────────────────────┐
│ 按请求量分布，识别主要模型流量来源                    muted 说明        │
│ gpt-4o      ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  42%      │
│ claude-3    ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  28%      │
│ …（固定 N 行，常用 4）                                                  │
│ [查看全部 → 模型用量]                                    link·左对齐    │
└────────────────────────────────────────────────────────────────────────┘
```

| 列宽（线框语义） | 名称 ~110px · Progress flex · 百分比右对齐 ~40px |
| --- | --- |
| **行数** | 线框写明 **Top 4** 或「动态 N≤5」 |
| **底链** | 单条 link「查看全部 → {列表页}」 |

### W5 — 快捷入口卡

**用途：** 导航到高频模块；**非**实体列表卡。

```text
┌─ Card · clickable ─────────┐
│        [ 图标 48 ]         │  ← 居中
│        租户管理             │  ← 标题·居中
│        可选副文案 muted     │
└────────────────────────────┘
```

| 规则 | 说明 |
| --- | --- |
| 点击 | 整卡 → 路由；**无**右上停用钮 |
| 网格 | 列数同卡片列表页栅格约定（常用 2–4） |
| 样式 | 可 `hover` 描边/阴影；与 W1 **勿混排同一 Grid 行**（入口与指标分区） |

### W6 — 列表摘要卡

**用途：** 看板内嵌 **精简表格** 或待办列表（≤5 行）。

```text
┌─ Card · title: 最近失败调用 ───────────────────────────── [查看全部] ─┐
│ 时间          客户端        模型           状态                        │
│ 10:01:02      app-a         gpt-4o         [失败]                      │
│ …                                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

- 无分页或仅「查看更多」；完整列表仍用搜索列表页。
- 操作列若有，用 link；危险操作仍走二次确认。

## 响应式栅格

| 区域 | 宽屏 | 中屏 | 窄屏 |
| --- | --- | --- | --- |
| **W1 指标带** | 4 列 | 2 列 | 1 列 |
| **W4 构成** | 2 列并排 | 1 列堆叠 | 1 列 |
| **W5 快捷** | 4 列 | 2 列 | 1–2 列 |

段内 `gap` 建议 **16**；W1 同行 **等高**（stretch），脚注行不足时仍保留最小高度或统一 `min-height`（线框可注）。

## 状态与异常

| 粒度 | 表现 |
| --- | --- |
| **整页** | 数据源失败：页顶 **I-error·条带** + [重试]（见「信息与文本卡片」）；保留 W2 可改条件 |
| **单 Widget** | Card 内 Skeleton / Spin；**不**拖死整页 |
| **部分字段** | Statistic 显示 `—` + tooltip 说明 |
| **无权限** | 替换为 Empty「无查看权限」或隐藏该 Widget（PRD 须写清） |

## 交互要点

1. **刷新：** 页头刷新与 W2 变更均 `reload` 同一 dashboard 数据源（或分段数据源，须在 PRD 标明）。
2. **时间范围：** 写入页状态 `range`；段标题可展示 `start — end`。
3. **图表切换：** ToggleGroup 只切 **展示指标**，不必重复请求（或注明每次 reload）。
4. **下钻 link：** 携带筛选参数（时间、失败态）跳转列表/日志。
5. 线框必标：**P1/P2/P3**、各 Card 的 **W1–W6**、指标 Grid **列数 / maxColumns**、图表 **类型与高度**。

## 不宜画进仪表盘的结构

| 场景 | 应使用的参考 |
| --- | --- |
| 插件/实体卡片网格 | 卡片列表页 L1 + 上中下 |
| 全屏筛选 + 大表 | 搜索列表页 S1/S2 |
| 编辑配置表单 | 表单页 / 抽屉表单 |
| 登录后首屏纯表单 | 登录/注册页 |
| 公告 / 帮助 / 活动说明 Card | 信息与文本卡片 T-markdown / T-html |
| 配额、演示环境等提示 | 信息与文本卡片 I-warning / I-info |
