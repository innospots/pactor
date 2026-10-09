---
title: 卡片列表页
slug: card-list
order: 3
summary: 以卡片展示实体摘要，支持筛选与生命周期操作（上/中/下层结构与响应式列数）
sourceRef: innos-diagram/references/03-卡片列表页.md
---

# 卡片列表页（Filter + Card Grid）

**组件类型：** 卡片化列表  
**职责：** 以卡片展示实体摘要，支持筛选与生命周期操作。

**看板指标/图表卡**（非实体列表）→ [12-仪表盘页](./12-仪表盘页.md) **W1–W6**，勿与本文件「上/中/下」混用。

页面先选 **列表容器布局（L1/L2/L3）**，单张卡片统一用 **上 / 中 / 下三层** 结构（§二）；网格列数见 **§三**。

---

## 一、列表页容器布局

### L1 — 响应式网格（默认）

{{preview:01}}

筛选区 + **卡片网格** + 结果计数（分页可选，卡片列表常仅展示总数）。

```text
│ {标题}                                              [刷新]                  │
│ 筛选…（F1/F2/F3，见 02-搜索列表页）                                         │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│ │  卡片        │  │  卡片        │  │  卡片        │   ← 列数见 §三      │
│ └──────────────┘  └──────────────┘  └──────────────┘                       │
│ 共 N 个                                                                    │
```

**适用：** [插件列表](../../../nexus/prd-diagram/插件管理/01-插件列表.md)。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  plugins:
    - id: 1
      icon: users
      title: 用户管理
      subtitle: v0.1.0
      description: 管理插件安装状态与运行生命周期，支持启停与依赖检查。
      tags:
        - { text: 已安装, color: success }
      actions:
        - { text: 停用 }
    - id: 2
      icon: database
      title: 数据同步
      subtitle: v2.3.1
      description: 定时将外部数据源同步至平台，支持增量与全量两种模式。
      tags:
        - { text: 已安装, color: success }
      actions:
        - { text: 停用 }
    - id: 3
      icon: file-text
      title: 审计日志
      subtitle: v1.8.0
      description: 记录平台关键操作与登录行为，提供检索与导出能力。
      tags:
        - { text: 未安装 }
      actions:
        - { text: 安装, variant: primary }
    - id: 4
      icon: bell
      title: 消息通知
      subtitle: v3.0.2
      description: 站内信、邮件与 Webhook 多渠道通知，支持模板配置。
      tags:
        - { text: 已安装, color: success }
      actions:
        - { text: 停用 }
    - id: 5
      icon: chart
      title: 报表中心
      subtitle: v0.9.5
      description: 预置常用运营报表，支持自定义指标与订阅推送。
      tags:
        - { text: 未安装 }
      actions:
        - { text: 安装, variant: primary }
    - id: 6
      icon: folder
      title: 文件存储
      subtitle: v1.2.4
      description: 对接对象存储服务，提供统一的上传、预览与权限管理。
      tags:
        - { text: 已安装, color: success }
      actions:
        - { text: 停用 }
body:
  type: Page
  children:
    # 页面工具栏：标题 + 刷新
    - type: Flex
      props:
        justify: space-between
        align: center
      children:
        - type: Text
          props:
            text: 插件列表
            strong: true
            size: large
        - type: Button
          props:
            text: 刷新
            icon: refresh
            variant: text
    # 筛选区（F1 形态，见「搜索列表页」模板）
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
                placeholder: 输入插件名称
        - type: Field
          props: { label: 状态 }
          children:
            - type: Select
              props:
                name: status
                value: all
                options:
                  - { label: 全部, value: all }
                  - { label: 已安装, value: installed }
                  - { label: 未安装, value: notInstalled }
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
    # 卡片网格 + 结果计数：CardList 业务组件一次完成
    - type: CardList
      props:
        items: ${state.plugins}
        columns: 3
        showCount: true
      events:
        onItemAction:
          - action: message
            params:
              messageType: info
              text: 已触发「${event.text}」：${event.item.title}
```

### L2 — 单列宽卡片

{{preview:02}}

网格 `columns: 1`，卡片 **中/下层** 可横向平铺更多信息（见 §二「平铺」）。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  plugins:
    - id: 1
      icon: users
      title: 用户管理
      subtitle: v0.1.0
      description: 管理插件安装状态与运行生命周期，支持启停、依赖检查与灰度发布，覆盖平台全部业务空间。
      meta: 平台组 · 更新于 2026-09-28
      tags:
        - { text: 已安装, color: success }
      actions:
        - { text: 配置, variant: link }
        - { text: 停用 }
    - id: 2
      icon: database
      title: 数据同步
      subtitle: v2.3.1
      description: 定时将外部数据源同步至平台，支持增量与全量两种模式，失败自动重试并推送告警。
      meta: 数据组 · 更新于 2026-09-20
      tags:
        - { text: 未安装 }
      actions:
        - { text: 配置, variant: link }
        - { text: 安装, variant: primary }
body:
  type: Page
  children:
    # 单列宽卡片：columns: 1，meta 与描述在中层平铺
    - type: CardList
      props:
        items: ${state.plugins}
        columns: 1
        showCount: true
      events:
        onItemAction:
          - action: message
            params:
              messageType: info
              text: 已触发「${event.text}」：${event.item.title}
```

### L3 — 网格 + 末尾占位卡

{{preview:03}}

首格为 **虚线新建卡**（`+ 新建{实体}`）；无新建能力则不画。

---

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  plugins:
    - id: 1
      icon: users
      title: 用户管理
      subtitle: v0.1.0
      description: 管理插件安装状态与运行生命周期，支持启停与依赖检查。
      tags:
        - { text: 已安装, color: success }
      actions:
        - { text: 停用 }
    - id: 2
      icon: database
      title: 数据同步
      subtitle: v2.3.1
      description: 定时将外部数据源同步至平台，支持增量与全量两种模式。
      tags:
        - { text: 未安装 }
      actions:
        - { text: 安装, variant: primary }
body:
  type: Page
  children:
    # createText 渲染首格「新建」占位卡（虚线、内容居中），占 1 格参与网格流
    - type: CardList
      props:
        items: ${state.plugins}
        columns: 3
        createText: 新建插件
        showCount: true
      events:
        onCreateClick:
          - action: message
            params: { messageType: info, text: 打开新建插件弹层 }
        onItemAction:
          - action: message
            params:
              messageType: info
              text: 已触发「${event.text}」：${event.item.title}
```

## 二、单卡结构 — 上 / 中 / 下三层

每张卡片纵向分为 **上层 · 中层 · 下层**，层与层之间可用分割线或间距区分。**下层可单独设置背景色**（如操作条、状态条、浅色底栏）。

```text
┌─ Card ──────────────────────────────────────┐
│ ┌─ 上层 ─────────────────────────────────┐  │  ← 对齐：居左 | 居中 | 居右 | 平铺
│ │  [Logo]  {标题}  v1.0        [Tag][Tag] │  │
│ └────────────────────────────────────────┘  │
│ ┌─ 中层 ─────────────────────────────────┐  │
│ │  {描述说明文字，可多行截断…}             │  │
│ └────────────────────────────────────────┘  │
│ ┌─ 下层（背景 #f5f5f5 等，可单独设色）───┐  │
│ │                    [主操作]  [次要]     │  │  ← 常居右；亦可为平铺按钮组
│ └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 2.1 层内对齐（每层独立配置）

| 对齐 | 线框表达 | 典型用途 |
| --- | --- | --- |
| **居左** | 元素靠左起始排列 | Logo + 标题 + 标签（插件名、版本） |
| **居中** | 组内整体水平居中 | 空状态小卡、占位新建卡 |
| **居右** | 元素靠右 | 单颗主按钮、状态角标 |
| **平铺** | `justify: space-between` 或等宽拉满一行 | 左标题 + 右标签；左描述 + 右操作 |

```text
居左：  [Logo] 标题  Tag
居中：        [Logo]
              标题
居右：                    Tag  Tag
平铺：  标题 ····················  [停用]
```

每层 alignment **互不影响**；线框在层旁注 `上层·居左` `下层·居右·底栏背景`。

### 2.2 层内元素与 inline 排列

同一层内多个元素按 **inline（横向）** 排列，换行时 `flex-wrap`（线框多行则画出第二行）。允许的元素类型：

| 元素 | 说明 | 线框示例 |
| --- | --- | --- |
| **Logo** | 图标/插件图；方或圆 | `[图标]` `[Logo]` |
| **Tag** | 状态/分类标签，可多个 | `[已安装]` `[●在运行]` |
| **标题** | 主标题，通常一项 | `{名称}` **加粗** |
| **文字** | 辅助短文案（版本号、编码） | `v2.0.1` `ADMIN` |
| **描述说明** | 多行说明，常放 **中层** 独占或占满宽 | 灰色小字段落 |
| **表单项** | 卡片内极少用；若有开关/下拉，须 **Form** 包裹并注字段名 | `启用 [开关]` |
| **按钮** | 见 §2.6；与整卡点击进详情 **并存** 时须阻止冒泡 | `[停用]` `(⋮)` `···` |

**禁止** 在无 Form 时用裸 Input 攒筛选（卡片内表单项仅用于 **单卡快捷操作**，非列表筛选项）。

### 2.3 文字样式（按元素单独定义）

线框或规格表可为每个元素注明样式 token，例如：

| 元素 | 常用样式 |
| --- | --- |
| 标题 | `strong` / `text-base` |
| 文字（版本） | `secondary` / `text-sm` `tabular-nums` |
| 描述 | `muted` / 最多 2 行 `ellipsis` |
| Tag 内文字 | 随标签色，不单改字号除非线框标明 |
| 错误摘要 | `destructive` 或 `warning`，单行截断 |

示例标注：`{名称}`**title** · `v1.0`**caption** · `{描述}`**muted-2lines**

### 2.4 三层内容分工（推荐，可 override）

| 层 | 常见内容 | 对齐示例 |
| --- | --- | --- |
| **上层** | Logo、标题、版本文字、Tag | 居左 或 平铺（左信息右 Tag） |
| **中层** | 描述说明、错误摘要、次要文字 | 居左，全宽 |
| **下层** | 主/次按钮、链接操作；或仅 Tag 条 | 居右 或 平铺；**可设底栏背景色** |

**下层背景：** 线框用 `░` 或旁注 `bg: var(--muted)`；与上层、中层背景 contrast 清晰。

### 2.6 卡片内按钮

卡片内可放 **按钮**（非整卡唯一的交互方式）。线框须标明 **形态** 与 **锚定区域**（常用 **右上**、**右下**）。

| 形态 | 线框表达 | 说明 |
| --- | --- | --- |
| **文字按钮** | `[停用]` `[启用]` 或 link 样式「查看」 | 对应 `Button variant: link` 或 default；危险操作用 `danger` |
| **长方形按钮** | `[  停用  ]` 标准 padding、圆角矩形 | 主操作常用；默认 / primary |
| **圆形按钮** | `( ⋮ )` `( ⚙ )` `⊕` 仅图标 | `shape: circle`；须 Tooltip / `aria-label` |

| 锚定区域 | 说明 |
| --- | --- |
| **右上** | 落在上层或卡片 **绝对定位右上角**；常与 Tag 并列或替代「更多」；适合次要操作、圆形更多钮 |
| **右下** | 落在 **下层** 或卡片 **右下角**；适合主操作长方形按钮、文字「安装」 |
| **层内居右** | 非绝对定位时，用该层 **居右 / 平铺** 把按钮组靠右（与「右下」视觉接近） |

```text
右上（上层·平铺）                    右下（下层·居右）
┌──────────────────────────┐        ┌──────────────────────────┐
│ [Logo] 标题      (⋮)   │        │ 描述…                    │
│ Tag Tag                  │        │▓▓▓▓▓▓▓▓▓▓▓▓ [ 停用 ] ▓▓│
│ 描述…                    │        └──────────────────────────┘
└──────────────────────────┘
```

| 规则 | |
| --- | --- |
| 数量 | 单卡主操作 **1 个** 为宜；次要收入圆形 `⋯` 或右上文字 link |
| 确认 | 安装/停用/删除等仍须 **二次确认** |
| 与整卡点击 | 按钮点击 **不触发** 进详情（实现：`stopPropagation`）；线框用旁注「按钮独立事件」 |

### 2.7 整卡点击进入详情

整张卡片（除按钮、表单项、链接外）可作为 **一个大点击区** 进入详情页。

```text
┌─ Card（可点击 · hover 阴影/描边）────────────────────┐
│  … 上层 / 中层内容 …                    [右上按钮]   │  ← 按钮不触发导航
│  … 描述 …                                            │
│▓ 下层 …                              [右下 主操作 ] ▓│
└──────────────────────────────────────────────────────┘
     ↑ 点击空白、标题、描述、Logo 等区域 → 详情路由
```

| 项 | 规则 |
| --- | --- |
| **范围** | 卡片根节点 `navigate` / `href`；**排除** 按钮、Switch、下拉、内嵌链接 |
| **线框** | 旁注 **「整卡可点 → 详情」**；**不设** 单独「详情」文字按钮（与插件线框一致时） |
| **光标** | 可点区域 `pointer`；按钮上为 `default` |
| **与 L3** | 新建占位卡 **不** 整卡进详情，仅点「+」或卡内 CTA |
| **无障碍** | 整卡可点时卡片根加可读名称（如插件名）；按钮保留独立 label |

### 2.8 插件列表示例（上中下 + 平铺）

{{preview:04}}

```text
┌─────────────────────────────────┐
│ 上层·平铺                        │
│ [Logo] 用户管理  v0.1.0    [Tag]│  ← 左：Logo+标题+文字  右：Tag
│─────────────────────────────────│
│ 中层·居左                        │
│ 管理插件安装状态与运行生命周期。  │  ← 描述·muted
│─────────────────────────────────│
│▓▓ 下层·居右·浅底 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ [停用] ▓│
└─────────────────────────────────┘
```

整卡可点进详情（§2.7）；右下长方形 **[停用]** 独立点击，须 **二次确认**。

---

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: EntityCard
  props:
    icon: users
    title: 用户管理
    subtitle: v0.1.0
    description: 管理插件安装状态与运行生命周期。
    hoverable: true
    style: { width: 380 }
    tags:
      - { text: 已安装, color: success }
    actions:
      - { text: 停用 }
  events:
    # 整卡可点进详情；「停用」独立点击 + 二次确认（不触发整卡点击）
    onClick:
      - action: message
        params: { messageType: info, text: 进入「用户管理」详情 }
    onAction:
      - action: confirm
        id: disableConfirm
        params:
          title: 确认停用「用户管理」？
          content: 停用后依赖该插件的功能将不可用。
      - action: if
        params:
          condition: ${actions.disableConfirm}
          then:
            - action: message
              params: { messageType: success, text: 已停用「用户管理」 }
```

## 三、响应式网格

列表容器使用 **Grid**，列数随断点变化；须定义 **最大列数** `maxColumns`。

| 参数 | 说明 |
| --- | --- |
| **maxColumns** | 宽屏上限，如 `4`；不超过时均分宽度 |
| **columns 断点** | 例：`xs:1 · sm:2 · lg:3 · xl:4`；线框注「最大 4 列」 |
| **gap** | 卡片间距，如 `16px` |
| **卡片等高** | 默认 **stretch** 同行等高；下层底栏对齐；若不要等高须注明 |

```text
maxColumns = 4

│ 视口宽 ────────────────────────────────────────────────►                │
│  窄屏          中屏              宽屏              超宽                  │
│  ┌────┐       ┌────┬────┐       ┌──┬──┬──┐       ┌─┬─┬─┬─┐              │
│  │ 1  │       │ 1  │ 2  │       │1 │2 │3 │       │1│2│3│4│              │
│  └────┘       └────┴────┘       └──┴──┴──┘       └─┴─┴─┴─┘              │
│  1 列          2 列               3 列              4 列（封顶）        │
```

| 规则 | |
| --- | --- |
| 列数 | `min(maxColumns, floor(容器宽 / minCardWidth))` 语义；线框写清 **maxColumns** 与各断点列数即可 |
| 占位卡 | L3 新建卡占 **1 格**，参与网格流 |
| 筛选无结果 | 空状态占满网格区域，不渲染卡片 |

---

## 四、交互要点

1. 安装/启用/停用/重试：**二次确认**；说明对导航或依赖的影响。  
2. 筛选无结果：空状态 + 清除筛选（筛选形态见 02）。  
3. 窄屏：**maxColumns 降为 1**；状态 Tag 保留文案，不仅靠颜色。  
4. 线框单卡须标：**各层对齐**、**下层是否设色**、**元素样式**、**按钮形态与右上/右下**、**是否整卡进详情**；列表须标 **maxColumns** 与 **L1/L2/L3**。
