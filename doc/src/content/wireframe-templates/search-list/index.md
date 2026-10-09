---
title: 搜索列表页
slug: search-list
order: 2
summary: 条件查询 + 结果表格 + 分页与行内操作（S1/S2 容器 × F1/F2/F3 筛选形态）
sourceRef: innos-diagram/references/02-搜索列表页.md
---

# 搜索列表页（Filter + Table）

**组件类型：** 数据列表  
**职责：** 条件查询、结果表格、分页与行内操作。

线框先选 **筛选与表格的容器结构（S1/S2）**，再选 **筛选区形态（F1/F2/F3）**；二者可组合，须在页面说明中写明，如 `S2 + F1`、`S1 + F3`。

---

## 一、筛选区与表格区的容器结构

### 结构 S1 — 筛选与表格各自独立

{{preview:01}}

筛选区与表格区为 **两个独立区块**（上下两个 Card，或筛选条 + 表格 Card）。筛选变更后点「查询」或自动 reload，表格区单独承载 loading/空态。

```text
│ {标题}                                              [+ 新建]              │
│ {描述}                                                                     │
│ ┌─ 筛选区（独立 Card 或工具条）──────────────────────────────────────────┐ │
│ │  …筛选形态见下文 F1 / F2 / F3…                                          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ 表格区（独立 Card）───────────────────────────────────────────────────┐ │
│ │ 列1    列2    列3    状态    操作                                        │ │
│ │ …      …      …      …      [详情]                                      │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ 共 N 条                          [每页 20 ▾]  ‹ 1 2 ›                      │
```

| 说明 | |
| --- | --- |
| 适用 | 筛选区较高（多行、可展开）、或需在筛选与表格间插入 **已选条件摘要 / 批量操作条** |
| 视觉 | 两块边界清晰；表格 Card 可单独 `title`（如「查询结果」） |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  xxx: ""
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Form
          props:
            name: filter
            layout: inline
          children:
            - type: Field
              props: { label: 关键词 }
              children:
                - type: Input
                  props:
                    name: keyword
                    placeholder: 输入关键词
            - type: Field
              props: { label: 状态 }
              children:
                - type: Select
                  props:
                    name: status
                    placeholder: 选择状态
                    options:
                      - label: 全部
                        value: all
                      - label: 启用
                        value: enabled
                      - label: 停用
                        value: disabled
            - type: Field
              children:
                - type: Button
                  props:
                    text: 查询
                    variant: primary
                    submit: true
                - type: Button
                  props:
                    text: 重置
    - type: Card
      children:
        - type: Table
          props:
            dataSource:
              - id: 1
                name: 示例数据 A
                owner: 张三
                status: 启用
              - id: 2
                name: 示例数据 B
                owner: 李四
                status: 停用
              - id: 3
                name: 示例数据 C
                owner: 王五
                status: 启用
            columns:
              - title: 名称
                dataIndex: name
              - title: 负责人
                dataIndex: owner
              - title: 状态
                dataIndex: status
    - type: Pagination
      props:
        total: 128
        pageSize: 10
        align: right
        showTotal: true
        pageSizeOptions: [10, 20, 50]
```

### 结构 S2 — 筛选与表格在同一区域

{{preview:02}}

**一个 Card（或同一边框容器）** 内：上方筛选，下方表格 + 分页；共享左右边距与背景。

```text
│ {标题}                                              [+ 新建]              │
│ ┌─ 列表 Card ────────────────────────────────────────────────────────────┐ │
│ │  …筛选形态（F1/F2/F3）                                                  │ │
│ │ ─────────────────────────────────────────────────────────────────────  │ │
│ │ 列1    列2    列3    状态    操作                                        │ │
│ │ …      …      …      …      [详情]                                      │ │
│ │ 共 N 条                    [每页 20 ▾]  ‹ 1 2 ›                          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
```

| 说明 | |
| --- | --- |
| 适用 | 常规后台列表（Platform 租户列表、平台用户列表等） |
| 视觉 | 筛选与表头之间可用 **分割线**；分页在 Card 底内 |

---

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Flex
          props:
            direction: vertical
            gap: middle
          children:
            - type: Form
              props:
                layout: inline
              children:
                - type: Field
                  props: { label: 关键词 }
                  children:
                    - type: Input
                      props:
                        name: keyword
                        placeholder: 输入关键词
                - type: Field
                  props: { label: 状态 }
                  children:
                    - type: Select
                      props:
                        name: status
                        placeholder: 选择状态
                        options:
                          - label: 全部
                            value: all
                          - label: 启用
                            value: enabled
                          - label: 停用
                            value: disabled
                - type: Field
                  children:
                    - type: Button
                      props:
                        text: 查询
                        variant: primary
                        submit: true
                    - type: Button
                      props:
                        text: 重置
            - type: Separator
            - type: Table
              props:
                columns:
                  - title: 名称
                    dataIndex: name
                  - title: 负责人
                    dataIndex: owner
                  - title: 状态
                    dataIndex: status
                dataSource:
                  - id: 1
                    name: 示例数据 A
                    owner: 张三
                    status: 启用
                  - id: 2
                    name: 示例数据 B
                    owner: 李四
                    status: 停用
                  - id: 3
                    name: 示例数据 C
                    owner: 王五
                    status: 启用
            - type: Pagination
              props:
                total: 128
                pageSize: 10
                align: right
                showTotal: true
                pageSizeOptions: [10, 20, 50]
```

## 二、筛选区形态

### 筛选 F1 — Form inline 表单筛选

{{preview:03}}

一组字段 + **查询 / 重置**，必须用 **Form** 包裹（`layout: inline` 或栅格多列），禁止散列 Input + 手写校验。

```text
│ 标签A [____]  标签B [全部▾]  标签C [____]     [查询] [重置]     ← 单行靠左
│                                                    [查询] [重置] ← 或按钮靠右
```

| 维度 | 规则 |
| --- | --- |
| **Label** | **显式 label**：字段左侧或上方文案；**占位 label**：无可见 label，文案写在 `placeholder`（线框须注明哪种） |
| **按钮** | **查询**：`submit: true` 提交 Form 后生效；**重置**：清空 initial 并 reload |
| **多栏** | 2～4 列栅格；表单项 **靠左** 排列为主，**靠右** 仅放按钮组或次要筛项（线框标注对齐方式） |
| **多行** | 超过一行时按行排布；默认展示 **前 N 行**（如 1～2 行），其余 **折叠** |
| **更多** | 折叠区用 **「更多」/「展开筛选」** 链接触发展开；展开后显示完整行，可再 **「收起」** |
| **与表格** | 常配 **S2**；字段很多且筛选区很高时用 **S1** |

```text
│ 行1：字段A  字段B  字段C                    [查询] [重置]                  │
│ 行2（折叠）：字段D  字段E  …          [更多 ▾]  → 展开后显示行2+          │
```

**适用：** [角色列表](../../../nexus/prd-diagram/角色管理/01-角色列表.md)、[租户列表](../../../platform/prd-diagram/租户管理/01-租户列表.md)。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  filterExpanded: false
body:
  type: Form
  props:
    layout: inline
  children:
    - type: Field
      props: { label: 标签A }
      children:
        - type: Input
          props:
            name: fieldA
            placeholder: 请输入
    - type: Field
      props: { label: 标签B }
      children:
        - type: Select
          props:
            name: fieldB
            value: all
            options:
              - { label: 全部, value: all }
              - { label: 选项一, value: one }
              - { label: 选项二, value: two }
    - type: Field
      props: { label: 标签C }
      children:
        - type: Input
          props:
            name: fieldC
            placeholder: 请输入
    # 折叠区字段（「更多」展开后显示，可再收起）
    - type: Field
      when: "${state.filterExpanded}"
      props: { label: 标签D }
      children:
        - type: Input
          props:
            name: fieldD
            placeholder: 请输入
    - type: Field
      when: "${state.filterExpanded}"
      props: { label: 标签E }
      children:
        - type: Select
          props:
            name: fieldE
            placeholder: 请选择
            options:
              - { label: 全部, value: all }
              - { label: 启用, value: enabled }
              - { label: 停用, value: disabled }
    - type: Field
      children:
        - type: Button
          props:
            text: 查询
            variant: primary
            submit: true
        - type: Button
          props:
            text: 重置
        # 「更多 / 收起」链接触发折叠区（文档 F1 规则：展开后显示完整行，可再收起）
        - type: Button
          props:
            text: "${state.filterExpanded ? '收起' : '更多'}"
            variant: link
            icon: "${state.filterExpanded ? 'chevron-up' : 'chevron-down'}"
          events:
            onClick:
              action: setState
              params:
                filterExpanded: "${!state.filterExpanded}"
```

### 筛选 F2 — 筛选按钮 + 弹层筛选（Popover / Dropdown Panel）

{{preview:04}}

列表区 **默认可不展示** 完整表单项（或仅保留 **单行快捷项**：如关键词）。点击 **「筛选」** 打开 **弹层**，层内为完整 Form（字段 + 查询/重置）。

**不是** 在筛选条位置 **内联展开、撑高布局**（无手风琴、无把表格顶下去的展开区）。筛选层为 **浮层**，`position` 脱离文档流，**叠在** 表格或工具条之上；关闭后页面高度与排版 **不变**。

**线框分两层画**：① **文档流**（工具条 + 表格 Card，弹层 **不画进** 表格框内）；② **浮层示意**（单独标注锚点与弹层，表示叠在页面上方）。

```text
（1）文档流 — 列表区域不含弹层内容
│ 关键词 [________]                    [筛选 ▾] [+ 新建]    ← 锚点按钮在此行
│ ┌─ 表格 Card ────────────────────────────────────────────────────────────┐ │
│ │ 列1      列2      状态    操作                                          │ │
│ │ …        …        …      [详情]                                        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ 共 N 条 · 分页                                                             │
```

```text
（2）浮层示意 — 仅画锚点 + 弹层 Form，不画表格 Card（表格在（1）中已表达，此处不再出现）

      关键词 [____]              [筛选 ▾] ← 锚点（可与（1）工具条同一行）
                                    │
                                    ▼
                            ┌─────────────────┐
                            │ 字段A [____]     │
                            │ 字段B [全部 ▾]   │
                            │ 字段C …          │
                            │      [查询][重置]│
                            └─────────────────┘
                              ↑ 筛选表单弹层（覆盖层，非表格子区域）
```

```text
关系说明（文字旁注即可，不必再画表格）：

  · 打开/关闭弹层时，（1）中表格 Card 的 **高度、行数、边框** 均不变。
  · 弹层 **覆盖** 在页面之上，可挡住表头或工具条的一部分；**不撑开、不嵌入** 列表区域。
  · 实现语义：表格区域 = 底层；筛选弹层 = 独立 overlay，与表格 DOM/线框 **兄弟关系**，非父子。
```

| 维度 | 规则 |
| --- | --- |
| **呈现** | **Popover / Dropdown / 浮层 Panel**；锚点为「筛选」按钮；z-index 高于表格；**线框上弹层与表格分图**，禁止把弹层画在表格 Card 线框内部 |
| **禁止** | 筛选区下方 **插入一行** 展开表单从而 **增加** 筛选 Card 高度；禁止 **推开** 表头 |
| **单行表单** | **可选**：工具条仅关键词 +「筛选」；**无** 单行时仅按钮 + 主操作 |
| **关闭** | 再点「筛选」、点 `×`、查询提交后收起、点击弹层外（若产品允许 dismiss）；Esc 收起 |
| **遮罩** | 默认 **无全屏遮罩**（与列表 D-浮层类似，主区仍可操作）；若字段极多可用轻遮罩仅挡表格区，线框须注明 |
| **已选摘要** | 弹层外工具条展示 Chip：「状态=启用 · 清除」 |
| **与结构** | **S1/S2** 均可；弹层与 S1/S2 无关，均 **不占用** 筛选/表格容器的额外行高 |

**适用：** 审计日志、条件字段 >6、不愿占用常驻筛选高度的列表。

**与 F1 区分：** F1 字段始终占位在页面流内；F2 字段 **仅在弹层内**，未打开时不占垂直空间（除按钮一行）。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Flex
          props:
            direction: vertical
            gap: middle
          children:
            # 工具条：左侧关键词快捷项，右侧「筛选」弹层锚点 + 主操作
            - type: Flex
              props:
                justify: space-between
                gap: 8
              children:
                - type: Input
                  props:
                    name: keyword
                    placeholder: 输入关键词
                    style: { width: 260 }
                - type: Flex
                  props:
                    gap: 8
                  children:
                    - type: Popover
                      props:
                        align: end
                        style: { width: 300 }
                        # 浮层内为完整 Form（字段 + 查询/重置），独立于文档流
                        content:
                          type: Form
                          props:
                            layout: vertical
                          children:
                            - type: Field
                              props: { label: 状态 }
                              children:
                                - type: Select
                                  props:
                                    name: status
                                    value: all
                                    options:
                                      - { label: 全部, value: all }
                                      - { label: 启用, value: enabled }
                                      - { label: 停用, value: disabled }
                            - type: Field
                              props: { label: 负责人 }
                              children:
                                - type: Input
                                  props:
                                    name: owner
                                    placeholder: 请输入
                            - type: Field
                              props: { label: 类型 }
                              children:
                                - type: Select
                                  props:
                                    name: category
                                    placeholder: 请选择
                                    options:
                                      - { label: 全部, value: all }
                                      - { label: 登录, value: login }
                                      - { label: 创建, value: create }
                                      - { label: 更新, value: update }
                            - type: Field
                              children:
                                - type: Flex
                                  props:
                                    justify: end
                                    gap: 8
                                  children:
                                    - type: Button
                                      props:
                                        text: 重置
                                    - type: Button
                                      props:
                                        text: 查询
                                        variant: primary
                                        submit: true
                      children:
                        - type: Button
                          props:
                            text: 筛选
                            icon: funnel
                    - type: Button
                      props:
                        text: 新建
                        variant: primary
                        icon: plus
            - type: Separator
            # 表格区：弹层打开/关闭均不改变其高度与排版
            - type: Table
              props:
                columns:
                  - title: 名称
                    dataIndex: name
                  - title: 负责人
                    dataIndex: owner
                  - title: 状态
                    dataIndex: status
                dataSource:
                  - id: 1
                    name: 示例数据 A
                    owner: 张三
                    status: 启用
                  - id: 2
                    name: 示例数据 B
                    owner: 李四
                    status: 停用
                  - id: 3
                    name: 示例数据 C
                    owner: 王五
                    status: 启用
            - type: Pagination
              props:
                total: 128
                pageSize: 10
                align: right
                showTotal: true
                pageSizeOptions: [10, 20, 50]
```

### 筛选 F3 — 标签筛选（Chip / 标签行）

{{preview:05}}

按 **标签点击** 切换条件；支持 **多组标签**、每组 **多行** 换行排列（如状态一行、归属一行）。

```text
│ 状态：  (●)全部  ( )启用  ( )禁用                                          │
│ 归属：  (●)全部  ( )平台  ( )租户  ( )工作空间                             │
│ 类型：  ( )登录  ( )创建  ( )更新  …（第三行可换行）                        │
│ 【表格】                                                                   │
```

| 维度 | 规则 |
| --- | --- |
| **交互** | 即点即生效 **或** 多选后点「应用」；线框须写明；与 F1 组合时标签改 state 后 `reload` |
| **多行** | 每组标签独占一行或 `flex-wrap` 多行；组标题（状态/归属）左对齐 |
| **与 F1** | 可并存：上 F3 快筛，下 F1 细筛；或 F3 单独 + 关键词 |
| **DSL** | 对应 ChipFilter；无提交语义的快筛 **不用** Form 包整行 |

**适用：** 带枚举快筛的列表；可与 [插件列表](../../../nexus/prd-diagram/插件管理/01-插件列表.md) 安装状态筛选类似（若同时有 F1 关键词则标注组合）。

---

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  statusChip: all
  scopeChip: all
  typeChips: []
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Flex
          props:
            direction: vertical
            gap: middle
          children:
            # 状态：单选快筛（点已选项回「全部」；dot 为状态色点）
            - type: Flex
              props:
                align: center
                gap: small
                style: { flexWrap: wrap }
              children:
                - type: Text
                  props:
                    text: 状态
                    strong: true
                    className: w-10
                - type: ChipFilter
                  props:
                    mode: single
                    value: ${state.statusChip}
                    items:
                      - { value: all, text: 全部 6 }
                      - { value: enabled, text: 启用 4, dot: '#22c55e' }
                      - { value: disabled, text: 停用 2, dot: '#f59e0b' }
                  events:
                    onChange:
                      - action: setState
                        params:
                          statusChip: ${event}
            # 归属：单选快筛
            - type: Flex
              props:
                align: center
                gap: small
                style: { flexWrap: wrap }
              children:
                - type: Text
                  props:
                    text: 归属
                    strong: true
                    className: w-10
                - type: ChipFilter
                  props:
                    mode: single
                    value: ${state.scopeChip}
                    items:
                      - { value: all, text: 全部 }
                      - { value: platform, text: 平台 }
                      - { value: tenant, text: 租户 }
                      - { value: workspace, text: 工作空间 }
                  events:
                    onChange:
                      - action: setState
                        params:
                          scopeChip: ${event}
            # 类型：多选快筛（value 为数组；「全部」项清空选择）
            - type: Flex
              props:
                align: center
                gap: small
                style: { flexWrap: wrap }
              children:
                - type: Text
                  props:
                    text: 类型
                    strong: true
                    className: w-10
                - type: ChipFilter
                  props:
                    mode: multi
                    value: ${state.typeChips}
                    items:
                      - { value: all, text: 全部 }
                      - { value: login, text: 登录 }
                      - { value: create, text: 创建 }
                      - { value: update, text: 更新 }
                      - { value: delete, text: 删除 }
                      - { value: export, text: 导出 }
                  events:
                    onChange:
                      - action: setState
                        params:
                          typeChips: ${event}
            - type: Separator
            - type: Table
              props:
                columns:
                  - title: 名称
                    dataIndex: name
                  - title: 负责人
                    dataIndex: owner
                  - title: 状态
                    dataIndex: status
                dataSource:
                  - id: 1
                    name: 示例数据 A
                    owner: 张三
                    status: 启用
                  - id: 2
                    name: 示例数据 B
                    owner: 李四
                    status: 停用
                  - id: 3
                    name: 示例数据 C
                    owner: 王五
                    status: 启用
            - type: Pagination
              props:
                total: 128
                pageSize: 10
                align: right
                showTotal: true
                pageSizeOptions: [10, 20, 50]
```

## 三、组合示例（线框标注用）

| 标注 | 含义 |
| --- | --- |
| `S2 + F1` | 单 Card：内联表单 + 表格（最常见） |
| `S1 + F1` | 筛选 Card（多行+更多）+ 表格 Card |
| `S2 + F2` | 单 Card：筛选按钮层 + 表格 |
| `S2 + F3` | 单 Card：多行标签 + 表格 |
| `S2 + F3 + F1` | 标签快筛 + 内联关键词/次要字段 + 表格 |

---

## 四、表格与分页

列表 **表格区** 自上而下：**表格工具栏（可选）→ 表头 → 表体 → 分页脚**。与 **页面级工具栏**（标题旁「新建」）区分见下。

### 4.1 工具栏分区（两层）

{{preview:06}}

| 层级 | 位置 | 典型按钮 | 线框是否必画 |
| --- | --- | --- | --- |
| **页面工具栏** | 页面标题行右侧，与 `[+ 新建]` 同级 | 新建、导出、刷新整页 | 有则画在标题行 |
| **表格工具栏** | 表格 Card **内**、表头 **上方**（S2）或表格 Card 顶（S1 仅表格块） | 批量删除、批量启用、已选 N 项、列设置、刷新列表 | **可选**；有批量能力时必画 |

```text
（页面级 — 在筛选区之上或并列）
│ {标题}                              [导出] [+ 新建]        ← 页面工具栏

（表格级 — 在表头之上，仍在表格 Card 内）
│ ┌─ 表格 Card ─────────────────────────────────────────────────────────────┐ │
│ │ ☐ 已选 2 项   [批量启用] [批量删除]              [刷新] [列设置]        │ │ ← 表格工具栏（可选）
│ │ ─────────────────────────────────────────────────────────────────────  │ │
│ │ 列1 ⇅     列2        列3        状态      操作                          │ │ ← 表头
│ │ …         …          …          …         [详情] [编辑]                 │ │
│ │ ─────────────────────────────────────────────────────────────────────  │ │
│ │ 共 128 条              [每页 20 ▾]  ‹ 1 2 3 … ›                         │ │ ← 分页脚
│ └────────────────────────────────────────────────────────────────────────┘ │
```

| 表格工具栏规则 | |
| --- | --- |
| 批量操作 | 依赖行多选 Checkbox 列；未选中时批量按钮 **禁用** 或隐藏 |
| 与筛选 | **查询/重置** 属于筛选 F1/F2，**不** 放在表格工具栏（避免与「刷新列表」混淆） |
| 权限 | 无权限按钮隐藏或置灰 + Tooltip |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  selectedKeys: [1]
  tableLoading: false
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Flex
          props:
            direction: vertical
            gap: middle
          children:
            # 表格工具栏：左侧已选摘要 + 批量操作；右侧列表级操作
            - type: Flex
              props:
                justify: space-between
                align: center
              children:
                - type: Flex
                  props:
                    align: center
                    gap: small
                  children:
                    - type: Text
                      props:
                        text: 已选 ${state.selectedKeys.length} 项
                        type: secondary
                    - type: Button
                      props:
                        text: 批量启用
                    - type: Button
                      props:
                        text: 批量删除
                - type: Flex
                  props:
                    gap: small
                  children:
                    # 刷新：loading 态演示（setState → delay → setState）
                    - type: Button
                      props:
                        text: 刷新
                        icon: refresh
                        variant: text
                      events:
                        onClick:
                          - action: setState
                            params: { tableLoading: true }
                          - action: delay
                            params: { ms: 800 }
                          - action: setState
                            params: { tableLoading: false }
                    - type: Button
                      props:
                        text: 列设置
                        icon: settings
                        variant: text
            - type: Separator
            - type: Table
              props:
                rowSelection: true
                selectedRowKeys: ${state.selectedKeys}
                selectionDisabledField: selectDisabled
                loading: ${state.tableLoading}
                columns:
                  - title: 名称
                    dataIndex: name
                  - title: 负责人
                    dataIndex: owner
                  - title: 状态
                    dataIndex: status
                  # 操作列固定最右：一律 Button variant: link，主操作在左；居中
                  - title: 操作
                    width: 200
                    align: center
                    fixed: right
                    cell:
                      type: Flex
                      props:
                        align: center
                        justify: center
                        gap: 4
                      children:
                        - type: Button
                          props:
                            text: 详情
                            variant: link
                        # 无编辑权限的行禁用「编辑」（行数据 editable: false）
                        - type: Button
                          props:
                            text: 编辑
                            variant: link
                            disabled: ${!row.editable}
                        - type: DropdownMenu
                          props:
                            align: end
                            items:
                              - label: 停用
                                value: disable
                              - separator: true
                              - label: 删除
                                value: delete
                                icon: trash
                                danger: true
                          children:
                            - type: Button
                              props:
                                icon: ellipsis
                                variant: text
                dataSource:
                  - id: 1
                    name: 示例数据 A
                    owner: 张三
                    status: 启用
                    editable: true
                  # 无选择权限（Checkbox 禁用）+ 无编辑权限（隐藏「编辑」）
                  - id: 2
                    name: 示例数据 B
                    owner: 李四
                    status: 停用
                    selectDisabled: true
                    editable: false
                  - id: 3
                    name: 示例数据 C
                    owner: 王五
                    status: 启用
                    editable: true
              events:
                onSelectChange:
                  - action: setState
                    params:
                      selectedKeys: ${event}
            - type: Pagination
              props:
                total: 128
                pageSize: 10
                align: right
                showTotal: true
                pageSizeOptions: [10, 20, 50]
```

### 4.2 表头与排序

{{preview:07}}

```text
│ │ 角色名称 ⇅    编码        归属范围 ⇵    成员数    状态      操作          │ │
│ │            （不可排）              （不可排）  （不可排）  （无排序）   │ │
```

| 项 | 规则 |
| --- | --- |
| **可排序列** | 列标题旁 `⇅`（未排序）/ `↑` `↓`（当前序）；点击切换 asc → desc → 取消（若产品支持三态） |
| **不可排序** | 操作列、纯展示统计、枚举标签等 **禁止** 排序图标；线框在列旁注「不可排」 |
| **默认序** | 线框注明默认排序列与方向（如「创建时间 ↓」） |
| **与查询** | 排序变更 **立即** reload 或随「查询」一并提交，须在页面「实现衔接」写明 |
| **多列排序** | 若不支持，线框只标一个主排序列 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Table
          props:
            columns:
              # 可排序列：sorter: true（表头自动带 ⇅ 图标）
              - title: 角色名称
                dataIndex: name
                sorter: true
              - title: 编码
                dataIndex: code
              - title: 归属范围
                dataIndex: scope
                sorter: true
              - title: 成员数
                dataIndex: members
                align: right
                sorter: true
              - title: 状态
                dataIndex: status
              # 默认序：创建时间降序（初始即按此排序，表头显示 ↓）
              - title: 创建时间
                dataIndex: createdAt
                sorter: true
                defaultSortOrder: descend
            dataSource:
              - id: 1
                name: 平台管理员
                code: platform-admin
                scope: 平台
                members: 3
                status: 启用
                createdAt: 2026-09-12
              - id: 2
                name: 租户管理员
                code: tenant-admin
                scope: 租户
                members: 12
                status: 启用
                createdAt: 2026-09-08
              - id: 3
                name: 审计只读
                code: audit-readonly
                scope: 工作空间
                members: 5
                status: 停用
                createdAt: 2026-08-30
```

### 4.3 表体与列类型

{{preview:08}}

```text
│ │ ☐  张三       zhangsan    平台        3        ●启用    [详情] [编辑] [⋯] │ │
```

| 列类型 | 线框表达 |
| --- | --- |
| 多选列 | 首列 `☐` / `☑`；表头为全选 Checkbox |
| 数据列 | 左对齐文本；数字 **右对齐**（线框可注 `tabular-nums`） |
| 状态列 | 圆点/标签文案（启用、禁用） |
| 链接列 | 主字段用 **link** 样式，点击进详情（与操作列「详情」可二选一，勿重复） |

行点击：线框注明 **整行可点** 或 **仅名称列/详情按钮** 进详情。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Table
          props:
            # 行多选（非受控，组件内部管理选中态）
            rowSelection: true
            columns:
              # 链接列：主字段用 link 样式按钮，点击进详情（与操作列「详情」二选一）
              - title: 名称
                cell:
                  type: Button
                  props:
                    text: ${row.name}
                    variant: link
              - title: 负责人
                dataIndex: owner
              # 数字列右对齐
              - title: 成员数
                dataIndex: members
                align: right
              # 状态列：Status 状态点 + 文案（●启用 / ○停用）
              - title: 状态
                cell:
                  type: Status
                  props:
                    status: ${row.statusType}
                    text: ${row.status}
            dataSource:
              - id: 1
                name: 示例数据 A
                owner: 张三
                members: 3
                status: 启用
                statusType: success
              - id: 2
                name: 示例数据 B
                owner: 李四
                members: 12
                status: 停用
                statusType: default
              - id: 3
                name: 示例数据 C
                owner: 王五
                members: 5
                status: 启用
                statusType: success
```

### 4.4 操作列（固定右侧）

{{preview:09}}

操作列 **固定在最右**，不换行到多行按钮堆叠（窄屏可收进 `⋯` 更多菜单）。

```text
│ │ …    …    …    …    [详情] [编辑] [停用]     │  ← 常规：link 按钮横排
│ │ …    …    …    …    [详情]              [⋯] │  ← 次要操作进「更多」
```

| 规则 | 说明 |
| --- | --- |
| **样式** | 一律 `Button variant: link`；主操作在左（详情/编辑） |
| **编辑 vs 新建** | 「编辑」与「新建」共用同一表单页/路由，编辑预填行数据 |
| **危险操作** | 删除、停用等可在操作列或 `⋯` 内，须 **二次确认** |
| **内置/只读行** | 线框注明隐藏或禁用哪些操作（如内置角色无删除） |
| **列宽** | 操作列标题为「操作」；按钮文案以线框图为准，不写「查看」与「详情」混用（择一） |
| **无操作** | 纯只读列表可 **无操作列**，名称列 link 即可 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Flex
          props:
            direction: vertical
            gap: middle
          children:
            - type: Table
              props:
                columns:
                  - title: 名称
                    dataIndex: name
                    width: 340
                  - title: 负责人
                    dataIndex: owner
                    width: 340
                  - title: 状态
                    dataIndex: status
                    width: 340
                  # 操作列固定最右（sticky）：一律 Button variant: link，主操作在左；居中
                  - title: 操作
                    width: 200
                    align: center
                    fixed: right
                    cell:
                      type: Flex
                      props:
                        align: center
                        justify: center
                        gap: 4
                      children:
                        - type: Button
                          props:
                            text: 详情
                            variant: link
                        - type: Button
                          props:
                            text: 编辑
                            variant: link
                        # 次要操作收进 ⋯ 更多菜单（危险项 danger 标红）
                        - type: DropdownMenu
                          props:
                            align: end
                            items:
                              - label: 停用
                                value: disable
                              - separator: true
                              - label: 删除
                                value: delete
                                icon: trash
                                danger: true
                          children:
                            - type: Button
                              props:
                                icon: ellipsis
                                variant: text
                dataSource:
                  - id: 1
                    name: 示例数据 A
                    owner: 张三
                    status: 启用
                  - id: 2
                    name: 示例数据 B
                    owner: 李四
                    status: 停用
                  - id: 3
                    name: 示例数据 C
                    owner: 王五
                    status: 启用
            - type: Pagination
              props:
                total: 128
                pageSize: 10
                align: right
                showTotal: true
                pageSizeOptions: [10, 20, 50]
```

### 4.5 分页脚

```text
│ │ 共 128 条记录                    每页 [20 ▾] 条    ‹  1  2  3 … 10  ›    │ │
```

| 项 | 规则 |
| --- | --- |
| **左侧** | 总条数文案（「共 N 条」/「共 N 条记录」与产品统一） |
| **右侧** | 每页条数 Select + 页码 Prev/Next；跳转输入框 **可选** |
| **条件保留** | 翻页、改 pageSize 不丢筛选/排序；返回列表恢复页码（若产品要求） |
| **空表** | 总条数 0，分页器禁用或隐藏 |

### 4.6 表格区完整线框模板（S2 + 含可选块）

{{preview:10}}

```text
│ ┌─ 表格 Card ─────────────────────────────────────────────────────────────┐ │
│ │ [表格工具栏]  已选 n 项  [批量…]                    [刷新] [列设置]     │ │  ← 可选，无则删此行
│ │ ┌────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ ☐  列A⇅    列B      列C      状态      操作                         │ │ │
│ │ ├────────────────────────────────────────────────────────────────────┤ │ │
│ │ │ ☐  …       …       …       ●启用     [详情] [编辑]                 │ │ │
│ │ │ ☐  …       …       …       ○禁用     [详情] [编辑]                 │ │ │
│ │ └────────────────────────────────────────────────────────────────────┘ │ │
│ │ 共 N 条                         [每页 20 ▾]   ‹ 1 2 ›                   │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  selectedKeys: [1, 2]
  tableLoading: false
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Flex
          props:
            direction: vertical
            gap: middle
          children:
            # 表格工具栏（可选块）：已选摘要 + 批量操作 | 刷新 / 列设置
            - type: Flex
              props:
                justify: space-between
                align: center
              children:
                - type: Flex
                  props:
                    align: center
                    gap: small
                  children:
                    - type: Text
                      props:
                        text: 已选 ${state.selectedKeys.length} 项
                        type: secondary
                    - type: Button
                      props:
                        text: 批量启用
                    - type: Button
                      props:
                        text: 批量删除
                - type: Flex
                  props:
                    gap: small
                  children:
                    # 刷新：loading 态演示（setState → delay → setState）
                    - type: Button
                      props:
                        text: 刷新
                        icon: refresh
                        variant: text
                      events:
                        onClick:
                          - action: setState
                            params: { tableLoading: true }
                          - action: delay
                            params: { ms: 800 }
                          - action: setState
                            params: { tableLoading: false }
                    - type: Button
                      props:
                        text: 列设置
                        icon: settings
                        variant: text
            - type: Separator
            - type: Table
              props:
                rowSelection: true
                selectedRowKeys: ${state.selectedKeys}
                loading: ${state.tableLoading}
                columns:
                  # 链接列 + 可排序（sorter 列表头带 ⇅）
                  - title: 名称
                    width: 280
                    sorter: true
                    cell:
                      type: Button
                      props:
                        text: ${row.name}
                        variant: link
                  - title: 负责人
                    dataIndex: owner
                    width: 200
                  - title: 成员数
                    dataIndex: members
                    align: right
                    width: 140
                    sorter: true
                  - title: 状态
                    width: 160
                    cell:
                      type: Status
                      props:
                        status: ${row.statusType}
                        text: ${row.status}
                  # 默认序：创建时间降序
                  - title: 创建时间
                    dataIndex: createdAt
                    width: 200
                    sorter: true
                    defaultSortOrder: descend
                  - title: 操作
                    width: 200
                    align: center
                    fixed: right
                    cell:
                      type: Flex
                      props:
                        align: center
                        justify: center
                        gap: 4
                      children:
                        - type: Button
                          props:
                            text: 详情
                            variant: link
                        - type: Button
                          props:
                            text: 编辑
                            variant: link
                        - type: DropdownMenu
                          props:
                            align: end
                            items:
                              - label: 停用
                                value: disable
                              - separator: true
                              - label: 删除
                                value: delete
                                icon: trash
                                danger: true
                          children:
                            - type: Button
                              props:
                                icon: ellipsis
                                variant: text
                dataSource:
                  - id: 1
                    name: 平台管理员
                    owner: 张三
                    members: 3
                    status: 启用
                    statusType: success
                    createdAt: 2026-09-12
                  - id: 2
                    name: 租户管理员
                    owner: 李四
                    members: 12
                    status: 启用
                    statusType: success
                    createdAt: 2026-09-08
                  - id: 3
                    name: 审计只读
                    owner: 王五
                    members: 5
                    status: 停用
                    statusType: default
                    createdAt: 2026-08-30
              events:
                onSelectChange:
                  - action: setState
                    params:
                      selectedKeys: ${event}
            # 分页脚：左侧总条数 + 右侧每页条数与页码
            - type: Pagination
              props:
                total: 128
                pageSize: 10
                align: right
                showTotal: true
                pageSizeOptions: [10, 20, 50]
```

## 五、状态与异常

{{preview:11}}

| 状态 | 展示 |
| --- | --- |
| 加载 | 表格骨架或 loading（筛选区保持可编辑或禁用，须注明） |
| 空数据 | 文案 + 具备权限时显示「新建」 |
| 无搜索结果 | 提示清除条件 / 展开更多筛选项 |
| 失败 | 保留筛选值 + 重试 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Card
      children:
        - type: Flex
          props:
            direction: vertical
            gap: middle
          children:
            # 工具栏保留：搜索与主操作不受空态影响
            - type: Flex
              props:
                justify: space-between
                gap: 8
              children:
                - type: Input
                  props:
                    name: keyword
                    placeholder: 输入关键词
                    style: { width: 260 }
                - type: Button
                  props:
                    text: 新建
                    variant: primary
                    icon: plus
            - type: Separator
            - type: Table
              props:
                # 空态文案由外部传入（缺省为 i18n「暂无数据」）
                emptyText: 暂无符合条件的角色
                columns:
                  - title: 名称
                    dataIndex: name
                  - title: 负责人
                    dataIndex: owner
                  - title: 状态
                    dataIndex: status
                  - title: 操作
                    width: 200
                    align: center
                    fixed: right
                dataSource: []
```
