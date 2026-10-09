---
title: 详情页 — Tab 分栏
slug: detail-tabs
order: 5
summary: 同一实体下多个子视图（基本信息 / 权限 / 成员等），共享上下文与实体 id（页内 Tab / 锚点滚动 / 左侧竖 Tab）
sourceRef: innos-diagram/references/05-详情页-Tab分栏.md
---

# 详情页 — Tab 分栏

**组件类型：** 多态详情  
**职责：** 同一实体下多个子视图（基本信息 / 权限 / 成员等），共享上下文与实体 id。

---

## 布局 A — 页内 Tab + 独立路由（推荐）

{{preview:01}}

```text
│ {列表模块} / {实体名称}                                                    │
│ ← 返回列表                                                                 │
│ {编码} · {归属摘要}                                                        │
│ [基本信息]  [权限设置 N]  [成员列表 M]                                     │
│ ─────────────────────────────────────────────────────────────────────────  │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ 当前 Tab 内容（表单 / 双栏 / 表格）                                     │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
```

| 要点 | 说明 |
| --- | --- |
| URL | Tab 同步 query 或 path 段（如 `/roles/:id/permissions`） |
| 切换 | 不用 Drawer 替代整页 Tab |
| 未保存 | 切换 Tab 或离开页时提示 |

**适用：** 角色详情、应用详情等子视图需要独立 URL 的场景。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Breadcrumb
          props:
            items:
              - { label: 角色管理, href: /roles }
              - { label: 超级管理员 }
        - type: Button
          props:
            text: 返回列表
            icon: arrow-left
            variant: link
            size: small
            className: -ml-3
        - type: Flex
          props: { direction: vertical, gap: 4, align: start }
          children:
            - type: Flex
              props: { align: center, gap: 8 }
              children:
                - type: Text
                  props: { text: 超级管理员, size: large, strong: true }
                - type: Status
                  props: { status: success, text: 启用 }
            - type: Text
              props:
                text: ROLE_ADMIN · 系统内置 · 创建于 2026-01-15
                type: secondary
                size: small
        - type: Tabs
          props:
            variant: line
            className: w-full
            items:
              - key: info
                label: 基本信息
                children:
                  - type: Flex
                    props: { direction: vertical, className: px-2 py-4 }
                    children:
                      - type: Descriptions
                        props:
                          column: 3
                          items:
                            - { label: 角色编码, value: ROLE_ADMIN }
                            - { label: 角色名称, value: 超级管理员 }
                            - { label: 状态, value: 启用 }
                            - { label: 归属, value: 系统内置 }
                            - { label: 创建时间, value: 2026-01-15 10:24 }
                            - { label: 最近修改, value: 2026-09-28 16:03 }
                            - { label: 备注, value: 拥有全部菜单与操作权限，不可删除 }
              - key: permissions
                label: 权限设置 8
                children:
                  - type: Flex
                    props: { direction: vertical, className: px-2 py-4 }
                    children:
                      - type: Table
                        props:
                          pagination: false
                          columns:
                            - { title: 权限点, dataIndex: name }
                            - { title: 描述, dataIndex: description }
                            - title: 状态
                              cell:
                                type: Status
                                props:
                                  status: ${row.statusType}
                                  text: ${row.statusText}
                          dataSource:
                            - { id: 1, name: user:view, description: 查看用户列表与详情, statusType: success, statusText: 已授权 }
                            - { id: 2, name: user:edit, description: 新建、编辑、禁用用户, statusType: success, statusText: 已授权 }
                            - { id: 3, name: role:assign, description: 为用户分配角色, statusType: success, statusText: 已授权 }
                            - { id: 4, name: audit:export, description: 导出审计日志, statusType: default, statusText: 未授权 }
              - key: members
                label: 成员列表 23
                children:
                  - type: Flex
                    props: { direction: vertical, className: px-2 py-4 }
                    children:
                      - type: Table
                        props:
                          pagination: false
                          columns:
                            - { title: 成员, dataIndex: name }
                            - { title: 部门, dataIndex: dept }
                            - { title: 加入时间, dataIndex: joinedAt }
                            - title: 操作
                              width: 120
                              align: center
                              cell:
                                type: Button
                                props: { text: 移除, variant: link, danger: true }
                          dataSource:
                            - { id: 1, name: 张三, dept: 平台研发部, joinedAt: 2026-02-01 }
                            - { id: 2, name: 李四, dept: 平台研发部, joinedAt: 2026-03-18 }
                            - { id: 3, name: 王五, dept: 信息安全部, joinedAt: 2026-06-09 }
```

## 布局 B — 锚点 Tab（单页滚动）

{{preview:02}}

子页内容较短、不需独立 URL 时：内容区分 Card 纵向排列，右侧 **Anchor** scroll-spy 高亮当前区块，点击平滑滚动定位；Card 经 `id` 属性挂锚点。

```text
│ {实体摘要}                                                  │
│ ┌─ 基本信息 ────────────────┐  │ 基本信息                    │
│ └───────────────────────────┘  │ 权限设置                    │
│ ┌─ 权限设置 ────────────────┐  │ 成员列表                    │
│ └───────────────────────────┘                              │
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Breadcrumb
          props:
            items:
              - { label: 角色管理, href: /roles }
              - { label: 超级管理员 }
        - type: Flex
          props: { gap: 24, align: start }
          children:
            - type: Flex
              props: { direction: vertical, gap: 16, style: { flex: 1, minWidth: 0 } }
              children:
                - type: Card
                  props: { id: section-info, title: 基本信息 }
                  children:
                    - type: Descriptions
                      props:
                        column: 3
                        items:
                          - { label: 角色编码, value: ROLE_ADMIN }
                          - { label: 角色名称, value: 超级管理员 }
                          - { label: 状态, value: 启用 }
                - type: Card
                  props: { id: section-permissions, title: 权限设置 }
                  children:
                    - type: Table
                      props:
                        pagination: false
                        columns:
                          - { title: 权限点, dataIndex: name }
                          - { title: 描述, dataIndex: description }
                        dataSource:
                          - { id: 1, name: user:view, description: 查看用户列表与详情 }
                          - { id: 2, name: user:edit, description: 新建、编辑、禁用用户 }
            - type: Anchor
              props:
                className: sticky top-4 shrink-0
                items:
                  - { href: '#section-info', title: 基本信息 }
                  - { href: '#section-permissions', title: 权限设置 }
                  - { href: '#section-members', title: 成员列表 }
```

## 布局 C — 左侧竖 Tab

{{preview:03}}

```text
│ ┌ Tab ─┬──────────────────────────────────────────────┐ │
│ │基本  │  表单内容                                     │ │
│ │权限  │                                               │ │
│ │成员  │                                               │ │
│ └──────┴──────────────────────────────────────────────┘ │
```

子 Tab ≥4 或左侧需放实体摘要时用 C；`Tabs` 设 `tabPosition: left` 即竖排页签（键盘方向键同步切换为上下）。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库；表格数据有删减）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Breadcrumb
          props:
            items:
              - { label: 角色管理, href: /roles }
              - { label: 超级管理员 }
        - type: Card
          props: { className: w-full }
          children:
            - type: Tabs
              props:
                tabPosition: left
                items:
                  - key: info
                    label: 基本信息
                    children:
                      - type: Flex
                        props: { direction: vertical, className: px-2 py-4 }
                        children:
                          - type: Form
                            children:
                              - type: Field
                                props: { label: 角色名称, required: true }
                                children:
                                  - type: Input
                                    props: { name: name, value: 超级管理员 }
                              - type: Field
                                props: { label: 状态 }
                                children:
                                  - type: Switch
                                    props: { name: enabled, value: true }
                              - type: Field
                                children:
                                  - type: Button
                                    props: { text: 保存, variant: primary, submit: true }
                  - key: permissions
                    label: 权限设置
                    children:
                      - type: Flex
                        props: { direction: vertical, className: px-2 py-4 }
                        children:
                          - type: Table
                            props:
                              pagination: false
                              columns:
                                - { title: 权限点, dataIndex: name }
                                - { title: 描述, dataIndex: description }
                              dataSource:
                                - { id: 1, name: user:view, description: 查看用户列表与详情 }
                  - key: members
                    label: 成员列表
                    children: [ ... ]
                  - key: logs
                    label: 操作日志
                    children: [ ... ]
```

## 结构说明

```text
EntityDetail
├─ Breadcrumb / BackLink
├─ EntitySummary（名称、编码、状态）
├─ TabNav（与 routes 一一对应）
└─ TabPanel（每 Tab 一种组件结构：Descriptions / Form / Table…）
```

| 状态 | 说明 |
| --- | --- |
| 加载中 | 摘要与首个 Tab 内容骨架屏 |
| 实体不存在 | Result 404 + 返回列表入口 |
| Tab 内编辑未保存 | 切换 Tab 或离开页时二次确认 |
