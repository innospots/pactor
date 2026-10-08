---
title: 控制台外壳
slug: admin-shell
order: 1
summary: 承载导航、会话上下文与页面内容出口的应用布局容器（经典侧栏 / 顶栏导航 / 右轨补充）
sourceRef: innos-diagram/references/01-控制台外壳.md
---

# 控制台外壳（Admin Shell）

**组件类型：** 应用布局容器  
**职责：** 承载导航、会话上下文与页面内容出口；业务线框只画 **内容区** 以内部分，但须与外壳对齐。

## 布局 A — 经典侧栏（默认）

经典侧栏的 **品牌与会话区** 有两种顶栏变体：**A1 顶栏一体**、**A2 侧栏顶底分区**。二者共用同一套 **工作空间 + 用户** 点击菜单（见下表「会话菜单」）。

### 布局 A1 — 顶栏 Header（Logo + 产品名 | 工作空间 + 用户）

{{preview:01}}

顶栏横跨全宽：**左侧** Logo 与产品名称；**右侧** 当前工作空间摘要 + 用户（头像/姓名，可带 `▾`）。侧栏从顶栏下方开始，仅承载业务导航。

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ [Logo] {Product}                          {workspace}    {user} ▾        │
├──────────────┬─────────────────────────────────────────────────────────────┤
│ {一级菜单}   │ {面包屑 …}                                                  │
│ ├ {子菜单}◀ │ {页面标题}                              [{主操作}]          │
│ ├ {子菜单}   │ {页面描述一行}                                              │
│ └ {子菜单}   │ ┌─────────────────────────────────────────────────────────┐ │
│              │ │                    【页面内容区】                        │ │
│              │ └─────────────────────────────────────────────────────────┘ │
└──────────────┴─────────────────────────────────────────────────────────────┘
```

| 区域 | 说明 |
| --- | --- |
| 顶栏 Header | 左：Logo + 产品全称/简称；右：**工作空间**（如「研发空间」或「租户 / 工作空间」一行摘要）+ **用户** 触发区 |
| 侧栏 | 一级分组 + 二级页面；当前项 `◀` 或高亮；仅一级配图标 |
| 内容区 | 面包屑 → 标题行 → 描述 → 主内容 |

**适用：** 顶栏需与内容区对齐、工作空间与用户始终全局可见的运营管理台（Platform / Nexus 线框常用表述）。

#### DSL 配置

```yaml
# 提炼自 previews/01.yaml（可直接渲染预览）
dsl: "1.0"
layouts:
  admin:
    body:
      type: Layout
      props:
        className: shell-root
      children:
        - type: Header
          props:
            className: shell-header
            logo: /logo.svg
            title: Pactor Console
            locales:
              - { label: 中文, value: zh-CN }
              - { label: English, value: en-US }
            dropdown:
              label: 默认工作空间
              position: right
              items:
                - { label: 默认工作空间, value: default, selected: true }
                - { label: 平台运营, value: ops }
                - { label: 用户研究, value: research }
            user:
              name: 管理员
              items:
                - { label: 个人设置, value: settings, icon: settings }
                - { separator: true }
                - { label: 登出, value: logout, icon: log-out }
        - type: Sidebar
          props:
            className: shell-main
            collapsible: true
            content:
              type: SitemapMenu
              props:
                collapsible: true
                items:
                  - { key: home, label: 首页, icon: home }
                  - key: assets
                    label: 模型资产
                    icon: package
                    children:
                      - { key: providers, label: 供应商 }
                  - key: routing
                    label: 模型路由
                    icon: share
                    children:
                      - { key: routes, label: 路由 }
          children:
            - type: Content
              props:
                className: shell-content
              children:
                - type: Flex
                  props:
                    justify: center
                    align: center
                    style: { min-height: 240px }
                  children:
                    - type: Text
                      props: { text: 页面内容出口, type: secondary }
```
### 布局 A2 — 侧栏顶 Logo + 底栏工作空间与用户

{{preview:02}}

**无全宽顶栏**（或内容区顶栏仅放面包屑/标题）。**侧栏顶部**：Logo + 产品名称；**侧栏底部**固定：工作空间 + 用户触发区。主内容区纵向占满剩余高度。

```text
┌──────────────┬─────────────────────────────────────────────────────────────┐
│ [Logo]       │ {面包屑 …}                                                  │
│ {Product}    │ {页面标题}                              [{主操作}]          │
│──────────────│ {页面描述一行}                                              │
│ {一级菜单}   │ ┌─────────────────────────────────────────────────────────┐ │
│ ├ {子菜单}◀ │ │                    【页面内容区】                        │ │
│ └ {子菜单}   │ └─────────────────────────────────────────────────────────┘ │
│              │                                                             │
│──────────────│                                                             │
│ {workspace}  │                                                             │
│ {user} ▾     │                                                             │
└──────────────┴─────────────────────────────────────────────────────────────┘
```

| 区域 | 说明 |
| --- | --- |
| 侧栏顶 | Logo + 产品名称；可含折叠侧栏按钮（`≡`） |
| 侧栏中 | 业务菜单（同 A1） |
| 侧栏底 | **工作空间** + **用户**；与菜单区用分隔线区分；窄屏收起侧栏时底栏随抽屉或迁至顶栏 |
| 内容区 | 无重复品牌条时，标题行从面包屑开始 |

**适用：** 强调侧栏为「应用壳」、内容区尽量干净；工作空间切换与账号操作贴近导航上下文。

#### DSL 配置

```yaml
# 提炼自 previews/02.yaml（可直接渲染预览）
dsl: "1.0"
layouts:
  admin:
    body:
      type: Layout
      props:
        className: shell-root
      children:
        - type: Sidebar
          props:
            className: shell-main
            brand:
              logo: /logo.svg
              title: Pactor Console
            collapsible: true
            content:
              type: SitemapMenu
              props:
                collapsible: true
                items:
                  - { key: home, label: 首页, icon: home }
                  - key: assets
                    label: 模型资产
                    icon: package
                    children:
                      - { key: providers, label: 供应商 }
                  - key: routing
                    label: 模型路由
                    icon: share
                    children:
                      - { key: routes, label: 路由 }
            sidebarFooter:
              type: DropdownMenu
              props:
                side: top
                items:
                  - label: 切换空间
                    value: switch-workspace
                    icon: building-2
                    trailing: 默认工作空间
                    children:
                      - { label: 默认工作空间, value: default, selected: true }
                      - { label: 平台运营, value: ops }
                      - { label: 用户研究, value: research }
                  - { label: 个人设置, value: settings, icon: settings }
                  - { separator: true }
                  - { label: 登出, value: logout, icon: log-out }
              children:
                - type: Flex
                  props:
                    align: center
                    gap: 8
                    style: { padding: 6px 8px, border-radius: 6px, cursor: pointer, width: "100%" }
                  children:
                    - type: Avatar
                      props: { fallback: 管 }
                    - type: Text
                      props: { text: 管理员, style: { flex: 1 } }
                    - type: Icon
                      props: { name: chevrons-up-down, size: 14 }
          children:
            - type: Content
              props:
                className: shell-content
              children:
                - type: Flex
                  props:
                    justify: between
                    align: center
                    style: { padding: 12px 16px }
                  children:
                    - type: Text
                      props: { text: 供应商, type: title }
                    - type: Button
                      props: { text: + 新建, variant: primary }
                - type: Flex
                  props:
                    justify: center
                    align: center
                    style: { min-height: 200px }
                  children:
                    - type: Text
                      props: { text: 页面内容出口, type: secondary }
```
### 会话菜单（A1 / A2 共用）

点击 **工作空间区域** 或 **用户区域**（或合并为一个触发区 `{workspace} · {user} ▾`）展开下拉/弹出菜单，**至少包含**：

| 菜单项 | 行为 |
| --- | --- |
| 切换空间 | 打开工作空间/租户切换器（列表或搜索）；切换后刷新侧栏与数据范围 |
| 个人设置 | 进入个人资料、改密、偏好等（路由或设置页） |
| 登出 | 结束会话并跳转登录页；须二次确认（若产品策略要求） |

```text
点击 {user} ▾ 或工作空间区
        ┌─────────────────────┐
        │ 切换空间            │
        │ 个人设置            │
        │ ─────────────────   │
        │ 登出                │
        └─────────────────────┘
```

- 无可用工作空间时：「切换空间」置灰并说明原因。  
- 无个人设置权限：隐藏或置灰「个人设置」。  
- 语言、换肤、主题等 **非会话核心** 能力可放在顶栏图标区（A1）或「个人设置」内，不与上述三项混列为必选。

**布局 A 总述：** Nexus、Platform 运营管理台、多数 B2B 后台；线框中须标明采用 **A1** 或 **A2**，避免顶栏与侧栏底重复摆放工作空间/用户。

## 布局 B — 可折叠侧栏（A 的收起态）

**布局 B** 是 **布局 A** 在侧栏 **收起为图标轨** 时的形态；品牌与会话区仍与 A 一一对应：

| A（展开） | B（收起） |
| --- | --- |
| **A1** 顶栏 Logo + 产品名，右为工作空间 + 用户 | **B1** 同上顶栏；左侧仅为窄图标轨 |
| **A2** 侧栏顶 Logo + 产品名，底为工作空间 + 用户 | **B2** 图标轨顶保留 Logo（或产品图标），底为工作空间 + 用户 |

会话菜单与 **A1/A2 共用**（切换空间 · 个人设置 · 登出）。侧栏交互：**点击 `≡` / 折叠钮** 在 A↔B 间切换；图标轨上 **悬停或点击** 可展开浮层子菜单（显示分组名与二级项）。

### 收起导航轨结构（Icon Rail 分区）

收起态左侧为 **固定宽度竖轨**（常见 56–72px），与主内容区同色或略区分（如浅底 + 细分割线）。纵向分为 **三区**，中间弹性留白，避免图标贴满全高：

```text
┌────┬──────────────────────────────────────────────────────────┐
│    │                                                          │
│ ┌┐ │                                                          │
│ │🏠││  ← 轨顶区：展开钮 / Logo / 首页（当前页可圆角底高亮）     │
│ └┘ │                                                          │
│  🕐 │  ← 轨中区：一级导航图标（仅图标，Tooltip 显示文案）      │
│  ☰ │                                                          │
│  ▦ │                                                          │
│  ◎ │                                                          │
│  … │  ← 溢出：「更多」收纳低频入口或次要分组                   │
│    │                                                          │
│    │         （弹性空白 — 把底区钉在视口下方）                  │
│    │                                                          │
│ ┌┐ │                                                          │
│ │↓││  ← 轨底区（可选）：独立强调操作（更新/下载/新建全局…）    │
│ └┘ │                                                          │
│ YY │  ← 轨底区：用户头像（或空间图标）；点击 → 会话菜单         │
└────┴──────────────────────────────────────────────────────────┘
```

| 分区 | 内容 | 规则 |
| --- | --- | --- |
| **轨顶** | `≡` 展开、产品 Logo、或 **首页/控制台** 图标 | 与 A2 配对时 Logo 放轨顶；与 B1 配对时轨顶可为 `≡` + 首页，品牌仅在顶栏 |
| **轨中** | 各一级菜单项 **一个图标一行**；顺序与 A 侧栏一致 | **当前项**：圆角矩形底或左侧色条 + 图标加深；悬停显示 Tooltip |
| **轨中·溢出** | `…` 更多 | 点击弹出菜单列出超出轨高的入口或「设置 / 帮助」等 |
| **轨底** | 可选 **1 个强调圆形按钮** + **用户头像**（可含姓名缩写） | 头像点击展开 **切换空间 · 个人设置 · 登出**；工作空间可在菜单内切换，轨上仅头像亦可 |
| **主内容** | 右侧铺满剩余宽度 | 无侧栏内嵌标题时，页面自带面包屑/标题（见 02 搜索列表页等） |

**与参考图一致的起草要点**（插件管理等列表页可全宽展示卡片网格）：

- 收起轨 **不重复** 产品长标题（B1 在顶栏展示；B2 在轨顶用 Logo 或图标代替）。  
- 导航图标 **outline / 单色**，选中态用 **浅底圆角块** 包裹（如首页高亮）。  
- 底区与轨中 **分隔**（留白或细线），头像始终 **贴底**，保证拇指区可点。  
- 从 A 展开切到 B 收起：**图标顺序不变**，仅隐藏文案与分组标题。

### 布局 B1 — 对应 A1（顶栏不变 + 左图标轨）

{{preview:03}}

顶栏与 **A1** 相同：**左** Logo + 产品名称，**右** 工作空间 + 用户 `▾`。业务导航收成左侧竖条，仅图标；当前项高亮或左侧色条。

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ [Logo] {Product}                          {workspace}    {user} ▾        │
├──┬─────────────────────────────────────────────────────────────────────────┤
│≡ │ {面包屑 …}                                                              │
│┌┐│ {页面标题}                              [{主操作}]                      │
││🏠│ ┌─────────────────────────────────────────────────────────────────────┐ │
│└┘│ │              【页面内容区 — 较 A1 更宽】                             │ │
│🕐│ └─────────────────────────────────────────────────────────────────────┘ │
│… │                                                                         │
│  │                                                                         │
│↓ │  ← 轨底强调钮（可选）；会话在顶栏，轨底可不放头像                        │
└──┴─────────────────────────────────────────────────────────────────────────┘
```

| 区域 | 说明 |
| --- | --- |
| 顶栏 | 与 A1 完全一致；**不在**图标轨重复工作空间/用户 |
| 图标轨 | 一级菜单图标；`≡` 固定于轨顶或顶栏左缘；展开浮层显示完整菜单文案 |
| 内容区 | 同 A1 |

#### DSL 配置

```yaml
# 提炼自 previews/03.yaml（可直接渲染预览）
dsl: "1.0"
layouts:
  admin:
    body:
      type: Layout
      props:
        className: shell-root
      children:
        - type: Header
          props:
            className: shell-header
            logo: /logo.svg
            title: Pactor Console
            locales:
              - { label: 中文, value: zh-CN }
              - { label: English, value: en-US }
            dropdown:
              label: 默认工作空间
              position: right
              items:
                - { label: 默认工作空间, value: default, selected: true }
                - { label: 平台运营, value: ops }
                - { label: 用户研究, value: research }
            user:
              name: 管理员
              items:
                - { label: 个人设置, value: settings, icon: settings }
                - { separator: true }
                - { label: 登出, value: logout, icon: log-out }
        - type: Sidebar
          props:
            className: shell-main
            collapsible: true
            defaultCollapsed: true
            content:
              type: SitemapMenu
              props:
                collapsible: true
                items:
                  - { key: home, label: 首页, icon: home }
                  - key: assets
                    label: 模型资产
                    icon: package
                    children:
                      - { key: providers, label: 供应商 }
                  - key: routing
                    label: 模型路由
                    icon: share
                    children:
                      - { key: routes, label: 路由 }
          children:
            - type: Content
              props:
                className: shell-content
              children:
                - type: Flex
                  props:
                    justify: center
                    align: center
                    style: { min-height: 240px }
                  children:
                    - type: Text
                      props: { text: 页面内容出口, type: secondary }
```
### 布局 B2 — 对应 A2（轨顶 Logo + 轨底会话区）

{{preview:04}}

无全宽顶栏（与 **A2** 一致）。**图标轨顶部**：Logo 或产品图标（可省略产品全称，展开 A2 时恢复完整品牌行）。**图标轨底部**：工作空间 + 用户 `▾`（与 A2 底栏一致，收起时可用图标 + Tooltip）。

```text
┌────┬────────────────────────────────────────────────────────────────────────┐
│ ≡  │ {面包屑 …}                                                             │
│┌──┐│ {页面标题}                              [{主操作}]                     │
││◇││ ┌────────────────────────────────────────────────────────────────────┐ │
│└──┘│ │         【页面内容区 — 如插件管理卡片网格】                          │ │
│ 🕐 │ └────────────────────────────────────────────────────────────────────┘ │
│ ☰  │                                                                        │
│ ▦  │                                                                        │
│ …  │                                                                        │
│    │                                                                        │
│ ┌┐ │                                                                        │
│ │↓││  ← 可选全局操作（更新/下载等）                                         │
│ └┘ │                                                                        │
│ YY │  ← 头像点击 → 切换空间 · 个人设置 · 登出                               │
└────┴────────────────────────────────────────────────────────────────────────┘
 ↑ 典型 B2：无顶栏；轨顶 Logo/`≡`；轨底头像承载会话（与参考图一致）
```

| 区域 | 说明 |
| --- | --- |
| 轨顶 | Logo；`≡` 展开恢复 **A2** 完整侧栏（含产品名称与菜单文案） |
| 轨中 | 业务菜单图标 + 浮层 |
| 轨底 | **工作空间 + 用户**；窄轨时可仅显示头像/空间图标，点击仍弹出完整会话菜单 |
| 内容区 | 同 A2 |

#### DSL 配置

```yaml
# 提炼自 previews/04.yaml（可直接渲染预览）
dsl: "1.0"
layouts:
  admin:
    body:
      type: Layout
      props:
        className: shell-root
      children:
        - type: Sidebar
          props:
            className: shell-main
            brand:
              logo: /logo.svg
              title: Pactor Console
            collapsible: true
            defaultCollapsed: true
            content:
              type: SitemapMenu
              props:
                collapsible: true
                items:
                  - { key: home, label: 首页, icon: home }
                  - key: assets
                    label: 模型资产
                    icon: package
                    children:
                      - { key: providers, label: 供应商 }
                  - key: routing
                    label: 模型路由
                    icon: share
                    children:
                      - { key: routes, label: 路由 }
            sidebarFooter:
              type: DropdownMenu
              props:
                side: top
                items:
                  - label: 切换空间
                    value: switch-workspace
                    icon: building-2
                    trailing: 默认工作空间
                    children:
                      - { label: 默认工作空间, value: default, selected: true }
                      - { label: 平台运营, value: ops }
                      - { label: 用户研究, value: research }
                  - { label: 个人设置, value: settings, icon: settings }
                  - { separator: true }
                  - { label: 登出, value: logout, icon: log-out }
              children:
                - type: Flex
                  props:
                    align: center
                    gap: 8
                    style: { padding: 6px 8px, border-radius: 6px, cursor: pointer, width: "100%" }
                  children:
                    - type: Avatar
                      props: { fallback: 管 }
                    - type: Text
                      props: { text: 管理员, style: { flex: 1 } }
                    - type: Icon
                      props: { name: chevrons-up-down, size: 14 }
          children:
            - type: Content
              props:
                className: shell-content
              children:
                - type: Flex
                  props:
                    justify: center
                    align: center
                    style: { min-height: 240px }
                  children:
                    - type: Text
                      props: { text: 页面内容出口, type: secondary }
```
### 布局 B 通用规则

1. **A/B 配对**：线框须注明「A1↔B1」或「A2↔B2」，勿混用顶栏与侧栏底的会话布局。  
2. **展开浮层**：收起态点击某图标，浮层展示该分组下二级菜单；点击空白或 Esc 关闭。  
3. **适用场景**：宽表格、双栏授权、详情长表单；与 A 相比仅导航形态不同，业务页面 DSL 不变。  
4. **窄屏**：B1/B2 均可退化为 **抽屉侧栏**；会话菜单优先保留在顶栏（B1）或抽屉底（B2）。

## 布局 C — 顶栏主导航（无持久侧栏）

{{preview:05}}

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Logo   [模块A] [模块B] [模块C◀]                    {workspace}  {user} ▾  │
├────────────────────────────────────────────────────────────────────────────┤
│ {面包屑}   {标题}                                    [{主操作}]            │
│ 【页面内容区】                                                              │
└────────────────────────────────────────────────────────────────────────────┘
```

模块较少（≤5）或营销型控制台；子页面仍用面包屑表达层级。

#### DSL 配置

```yaml
# 提炼自 previews/05.yaml（可直接渲染预览）
dsl: "1.0"
layouts:
  admin:
    body:
      type: Layout
      props:
        className: shell-root
      children:
        - type: Header
          props:
            className: shell-header
            logo: /logo.svg
            title: Pactor Console
            menu:
              - { key: home, label: 首页 }
              - { key: providers, label: 供应商 }
              - { key: routes, label: 路由 }
            locales:
              - { label: 中文, value: zh-CN }
              - { label: English, value: en-US }
            dropdown:
              label: 默认工作空间
              position: right
              items:
                - { label: 默认工作空间, value: default, selected: true }
                - { label: 平台运营, value: ops }
                - { label: 用户研究, value: research }
            user:
              name: 管理员
              items:
                - { label: 个人设置, value: settings, icon: settings }
                - { separator: true }
                - { label: 登出, value: logout, icon: log-out }
        - type: Content
          props:
            className: shell-content
          children:
            - type: Flex
              props:
                justify: center
                align: center
                style: { min-height: 240px }
              children:
                - type: Text
                  props: { text: 页面内容出口, type: secondary }
```
## 右侧图标导航轨（布局 A / B 的补充，非独立壳层）

在 **A1、A2、B1、B2** 任一形态上，**可选叠加** 视口 **最右缘** 的一列 **图标按钮轨（Right Icon Rail）**。左栏仍是业务菜单（A/B），右轨承载 **工具、会话、终端、上下文** 等辅助能力，**不得**与左侧重复同一套业务模块入口。

线框组合写法示例：`A1 + 右轨(D-浮层)`、`B2 + 右轨(D-分栏)`。

### 右轨本体结构

固定贴右、宽约 **48–56px**，**纵向一排图标按钮**（自上而下）；无文案，Tooltip / `aria-label` 必填。当前激活项：描边高亮或浅色底（如终端图标选中）。

```text
… 【主壳层：A1/A2/B1/B2 的内容区】 … ┌──┐
                                      │↻ │
                                      │⑂ │
                                      │▤ │
                                      │⤴ │
                                      │>_│◀ 激活
                                      │💾│
                                      │🌐│
                                      │⚙ │
                                      └──┘
                                        ↑ 右轨（始终在最上层 z-index 不低于内容）
```

| 规则 | 说明 |
| --- | --- |
| 与左栏分工 | 左：租户/用户/插件等业务页；右：会话用量、终端、技能/MCP、设置等 **辅助面板**（全页聊天侧栏结构见 [14-聊天交互页](./14-聊天交互页.md) **Z-R**） |
| 互斥 | 右轨同一时刻 **只展开一个** 面板（点另一图标切换；再点同一图标或关闭钮收起） |
| 顶栏 | 环境（Local）、布局切换等可留在 **主壳顶栏**，不必塞进右轨 |

### 展开形态 D-浮层 — 悬浮侧滑层（不挤压主内容）

{{preview:06}}

点击右轨图标，在 **右轨左侧** 弹出 **圆角卡片面板**（阴影），**不改变** 主内容区布局宽度；再次点击同一图标、点面板 `×` 或 Esc **收起**。

**无遮罩**：不铺半透明蒙层，**不** 禁用主区；列表滚动、按钮点击等 **照常可用**（仅浮层卡片自身矩形范围内的点击由面板消费）。主区 **不置灰**。

浮层 **右缘贴齐右轨左缘**（`right: iconRailWidth`，中间 **不留空档** 或仅 **0–8px** 视觉间隙）；自右向左展开，像从图标轨「长出」的卡片，**不要** 浮在页面正中或远离右轨。

```text
┌──────────────────────────────────────────────────┬────────────────┬────┐
│  【主内容区 — 全宽可交互，无蒙层】                  │┌──────────────┐│ ↻ │
│  表格 / 表单 / 按钮 仍可操作                      ││ 会话     [⚙] ││ … │
│  （浮层仅盖住靠右一条带，左侧主区不受影响）        ││ 用量 · Kimi… ││ ⚙ │◀
│                                                  ││ 上下文来源   ││    │
│                                                  │└──────────────┘│    │
└──────────────────────────────────────────────────┴────────────────┴────┘
 ↑──────────── Main：pointer-events 正常 ──────────↑↑ 浮层贴轨 ────↑ Rail
```

```text
侧视锚点（实现/线框标注用）：

  ………… Main …………|[ Float Panel ]|Rail|
                  ↑                 ↑
            浮层右边 = 右轨左边     固定窄列
```

| 项 | 说明 |
| --- | --- |
| 适用 | 轻量信息（会话、用量、上下文来源）、只读或短操作 |
| 定位 | **贴右轨展开**；`anchor: right` 相对壳层或视口，**禁止** 与右轨之间出现大块留白 |
| 尺寸 | 宽度固定（如 320–420px）或 `min(420px, calc(100vw - rail - 左栏))`；高度 `top` 与内容区对齐或距顶栏下沿 8px，底部可留边距；内部滚动 |
| 层级 | 浮层叠在 Main 之上，但 **无全屏遮罩层**；右轨图标 **高于** 浮层（保证始终可点切换） |
| 交互 | 主区除与浮层重叠的像素外均可操作；**禁止** `modal` 式锁滚动/锁焦点（除非浮层内嵌表单需短暂聚焦） |
| 收起 | 再点同一图标、面板 `×`、Esc；**不** 提供「点主区空白收起」（避免误关且主区本就可点） |

#### DSL 配置

```yaml
# 提炼自 previews/06.yaml（可直接渲染预览）
dsl: "1.0"
layouts:
  admin:
    body:
      type: Layout
      props:
        className: shell-root
      children:
        - type: Header
          props:
            className: shell-header
            logo: /logo.svg
            title: Pactor Console
            locales:
              - { label: 中文, value: zh-CN }
              - { label: English, value: en-US }
            dropdown:
              label: 默认工作空间
              position: right
              items:
                - { label: 默认工作空间, value: default, selected: true }
                - { label: 平台运营, value: ops }
                - { label: 用户研究, value: research }
            user:
              name: 管理员
              items:
                - { label: 个人设置, value: settings, icon: settings }
                - { separator: true }
                - { label: 登出, value: logout, icon: log-out }
        - type: Flex
          props:
            style: { flex: 1, min-height: 0, position: relative }
          children:
            - type: Sidebar
              props:
                className: shell-main
                collapsible: true
                content:
                  type: SitemapMenu
                  props:
                    collapsible: true
                    items:
                      - { key: home, label: 首页, icon: home }
                      - key: assets
                        label: 模型资产
                        icon: package
                        children:
                          - { key: providers, label: 供应商 }
                      - key: routing
                        label: 模型路由
                        icon: share
                        children:
                          - { key: routes, label: 路由 }
              children:
                - type: Content
                  props:
                    className: shell-content
                    style: { position: relative }
                  children:
                    - type: Flex
                      props:
                        justify: center
                        align: center
                        style: { min-height: 240px }
                      children:
                        - type: Text
                          props: { text: 页面内容出口, type: secondary }
            - type: Card
              props:
                style:
                  position: absolute
                  right: 48px
                  top: 0
                  bottom: 0
                  width: 260px
                  border-radius: 0
                  box-shadow: -8px 0 24px rgba(0,0,0,0.08)
                  z-index: 10
              children:
                - type: Flex
                  props: { direction: vertical, gap: 4 }
                  children:
                    - type: Text
                      props: { text: 上下文面板, type: title }
                    - type: Text
                      props:
                        text: 浮层形态：悬浮于内容之上，不改变主内容宽度
                        type: secondary
            - type: Menu
              props:
                collapsed: true
                style:
                  width: 48px
                  padding: 8px 0
                  border-left: 1px solid var(--border)
                items:
                  - { key: context, icon: message-square, label: 上下文 }
                  - { key: docs, icon: file-text, label: 文档 }
                  - { key: settings, icon: settings, label: 设置 }
```
### 展开形态 D-分栏 — 挤压主内容 + 可拖拽调宽

{{preview:07}}

点击右轨图标，在 **右轨左侧** 插入 **固定列扩展区**（如终端、日志流），**主内容区宽度按比例变窄**。视觉上为 **三列**：`主内容 | 扩展区 | 右轨图标`，其中 **仅一列可拖拽分隔条**，夹在 **主内容** 与 **扩展区** 之间；**扩展区与右轨** 之间 **无** 第二条分割条（右轨为固定窄列贴边）。

```text
┌────────────────────────────┬┬─────────────────────┬────┐
│                            ││ 终端          [⤢][×]│ >_ │
│   【主内容区 — 变窄】       ││ ─ Tab · 输出区 ──── │    │
│                            ││                     │    │
│                            ││ Invalid working…    │    │
└────────────────────────────┴┴─────────────────────┴────┘
 ↑──────── Main ────────────↑↑↑──── Extension ────↑ Rail
                            ║  ← 唯一 Splitter（拖拽调 Main ↔ Extension 宽度）
                            ║     右轨不参与拖拽，宽度恒定
```

```text
列语义（自左向右，共 3 栏，1 条分割条）：

  [ Main 页面 Outlet ]  |  [ Extension Panel ]  |  [ Icon Rail ]
         可缩小          ║      可扩大/收起            固定 ~56px
                    仅此一处拖拽
```

| 项 | 说明 |
| --- | --- |
| 适用 | 终端、调试台、长列表工具等需 **持续占用横向空间** 的能力 |
| 分隔条 | 拖拽改变「主内容 \| 扩展区」比例；双击分隔条可恢复默认比例 |
| 关闭 | 面板头 `×` 或再点右轨同一图标 → 扩展区收起，主内容 **恢复全宽** |
| 与 D-浮层 | **同一产品内按入口约定一种**；或会话类用浮层、终端类用分栏（线框须标注） |

#### DSL 配置

```yaml
# 提炼自 previews/07.yaml（可直接渲染预览）
dsl: "1.0"
layouts:
  admin:
    body:
      type: Layout
      props:
        className: shell-root
      children:
        - type: Header
          props:
            className: shell-header
            logo: /logo.svg
            title: Pactor Console
            locales:
              - { label: 中文, value: zh-CN }
              - { label: English, value: en-US }
            dropdown:
              label: 默认工作空间
              position: right
              items:
                - { label: 默认工作空间, value: default, selected: true }
                - { label: 平台运营, value: ops }
                - { label: 用户研究, value: research }
            user:
              name: 管理员
              items:
                - { label: 个人设置, value: settings, icon: settings }
                - { separator: true }
                - { label: 登出, value: logout, icon: log-out }
        - type: Sidebar
          props:
            className: shell-main
            collapsible: true
            content:
              type: SitemapMenu
              props:
                collapsible: true
                items:
                  - { key: home, label: 首页, icon: home }
                  - key: assets
                    label: 模型资产
                    icon: package
                    children:
                      - { key: providers, label: 供应商 }
                  - key: routing
                    label: 模型路由
                    icon: share
                    children:
                      - { key: routes, label: 路由 }
          children:
            - type: Resizable
              props:
                direction: horizontal
                style: { height: "100%" }
                panels:
                  # 主内容区（被右栏挤压，宽度随拖拽变化）
                  - children:
                      - type: Content
                        props:
                          className: shell-content
                        children:
                          - type: Flex
                            props:
                              justify: center
                              align: center
                              style: { min-height: 240px }
                            children:
                              - type: Text
                                props: { text: 页面内容出口（宽度被右栏挤压）, type: secondary }
                  # 扩展面板（拖拽手柄调宽）
                  - defaultSize: 25
                    minSizePx: 200
                    maxSizePx: 420
                    children:
                      - type: Flex
                        props:
                          direction: vertical
                          gap: 8
                          style: { padding: 12px, border-left: 1px solid var(--border), height: "100%" }
                        children:
                          - type: Text
                            props: { text: 扩展面板, type: title }
                          - type: Text
                            props:
                              text: 分栏形态：占据文档流，主内容等比收窄；分栏线可拖拽调宽
                              type: secondary
```
### 右轨 + A/B 组合示意

```text
A1/B1 + 右轨：
┌───────────────────────────────────────────────────────┬──┐
│ [Logo] {Product}              {workspace}  {user} ▾   │  │ 顶栏贯穿（右轨不抢顶栏）
├──┬────────────────────────────────────────────────────┤↻│
│左│  主内容 / 或 主内容+扩展区(D-分栏) / 或 +浮层(D-浮层) │⚙│
│栏│                                                    └──┘
└──┘

A2/B2 + 右轨：左壳为侧栏或图标轨，右缘再叠一排右轨图标（同上两种展开）。
```

### 右轨交互要点

1. 窄屏：右轨可改为 **底部工具条** 或收入 **更多**；D-分栏改为全屏抽屉，D-浮层仍为底 sheet。  
2. 图标统一线型/填色规范；角标不挡点击热区。  
3. 无权限入口隐藏或置灰 + Tooltip。  
4. 线框须标明 **D-浮层** 或 **D-分栏**，以及组合基底 **A1/A2/B1/B2**。

## 结构说明

```text
AdminShell
├─ BrandSessionChrome（布局 A1：TopBar；A2：SideNav 顶+底）
│  └─ SessionMenu（切换空间 · 个人设置 · 登出）
├─ SideNav（A 展开 / B 左图标轨；A1↔B1、A2↔B2）
├─ RightIconRail（可选，叠在 A/B 上；非独立布局）
│  ├─ PanelFloat（D-浮层：叠在 Main 上）
│  └─ PanelSplit（D-分栏：与 Main 并排 + Splitter）
├─ TopNav（仅布局 C）
└─ Main
   ├─ Breadcrumb
   ├─ PageHeader（title + description + actions）
   └─ PageBody（Outlet）
```

## 响应与状态

| 断点 | 行为 |
| --- | --- |
| 窄屏 | 侧栏/左轨抽屉化；**右轨**改底部工具条或抽屉；D-分栏改全屏 |
| 未登录 | 不展示本外壳，跳转登录布局（见 11） |
| 无菜单权限 | 侧栏项隐藏或置灰；内容区可展示无权限说明 |
