---
title: 双栏授权配置
slug: grant-panel
order: 10
summary: 左侧资源目录仅定位，右侧展示当前资源全部可勾选项；保存提交全量替换（标准双栏 / 左树右表 / 单栏扁平表）
sourceRef: innos-diagram/references/10-双栏授权配置.md
---

# 双栏授权配置

**组件类型：** 权限编辑  
**职责：** 左侧资源目录 **仅定位**，右侧展示当前资源下全部可勾选项；保存提交 **全量替换**。

---

## 布局 A — 标准双栏（Nexus 角色权限）

{{preview:01}}

```text
│ 当前角色已选 N 项授权              🔍 搜索资源名称 / Key                    │
│ ┌────────────────────┬─────────────────────────────────────────────────────┐ │
│ │ 后台资源目录        │ {当前页面名称}                                      │ │
│ │ ▼ 模块A            │ PAGE · page:key                                     │ │
│ │   页面1  3/4 ◀     │ 本页授权：已选 3 / 4 项                             │ │
│ │   页面2  2/3       │ ☑ 访问页面 …                                        │ │
│ │ ▼ 模块B            │ ─ 操作权限 ─                                        │ │
│ │   页面3  0/2       │ ☑ action:…  ☐ action:…                              │ │
│ └────────────────────┴─────────────────────────────────────────────────────┘ │
│ 变更尚未保存                              [取消] [保存完整授权]            │
```

| 区域 | 含义 |
| --- | --- |
| 左侧 `3/4` | 当前页及其子项已选/总数；**不是**勾选控件 |
| 右侧 | 当前页全部可授权项；唯一勾选入口 |
| 顶栏 N | 角色全局已选去重计数 |

**适用：** 角色详情-权限设置（Nexus 角色管理）。

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
            - type: Text
              props: { text: 当前角色已选 12 项授权, strong: true }
            - type: Input
              props:
                name: keyword
                placeholder: 搜索资源名称 / Key
                style: { width: 280 }
        - type: Card
          props: { contentClassName: p-0 }
          children:
            - type: Flex
              props: { align: stretch }
              children:
                - type: Flex
                  props:
                    direction: vertical
                    gap: 8
                    style: { width: 280 }
                    className: border-r border-border bg-muted/50 p-4
                  children:
                    - type: Text
                      props: { text: 后台资源目录, size: small, type: secondary }
                    - type: Tree
                      props:
                        treeData:
                          - key: mod-a
                            title: 模块A
                            children:
                              - { key: page-1, title: 页面1 · 3/4 }
                              - { key: page-2, title: 页面2 · 2/3 }
                          - key: mod-b
                            title: 模块B
                            children:
                              - { key: page-3, title: 页面3 · 0/2 }
                        defaultExpandedKeys: [mod-a, mod-b]
                - type: Flex
                  props:
                    direction: vertical
                    gap: 12
                    style: { flex: 1 }
                    className: p-4
                  children:
                    - type: Flex
                      props: { gap: 8, align: baseline }
                      children:
                        - type: Text
                          props: { text: 页面1, strong: true, size: large }
                        - type: Text
                          props: { text: 'PAGE · page:dashboard', size: small, type: secondary }
                    - type: Text
                      props: { text: 本页授权：已选 3 / 4 项, size: small, type: secondary }
                    - type: Checkbox
                      props: { label: 访问页面, value: true }
                    - type: Flex
                      props: { direction: vertical, gap: 8 }
                      children:
                        - type: Text
                          props: { text: 操作权限, size: small, strong: true }
                        - type: Container
                          props: { className: border-b border-border }
                    - type: Checkbox
                      props: { label: 'action:user:create 创建用户', value: true }
                    - type: Checkbox
                      props: { label: 'action:user:edit 编辑用户', value: true }
                    - type: Checkbox
                      props: { label: 'action:user:delete 删除用户', value: false }
        - type: Flex
          props: { justify: space-between, align: center }
          children:
            - type: Text
              props: { text: 变更尚未保存, type: warning, size: small }
            - type: Flex
              props: { gap: 8 }
              children:
                - type: Button
                  props: { text: 取消 }
                - type: Button
                  props: { text: 保存完整授权, variant: primary }
```

## 布局 B — 左树右表（目录更深）

{{preview:02}}

模块 → 页面 → 子页面三级目录树；右侧仍只展示 **当前选中页** 的授权项，以表格承载（授权项 / Key / 类型 / 已授权勾选）。

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
            - type: Text
              props: { text: 当前角色已选 12 项授权, strong: true }
            - type: Input
              props:
                name: keyword
                placeholder: 搜索资源名称 / Key
                style: { width: 280 }
        - type: Flex
          props: { gap: 16, align: start }
          children:
            - type: Card
              props: { style: { width: 280 } }
              children:
                - type: Tree
                  props:
                    treeData:
                      - key: content
                        title: 内容平台
                        children:
                          - key: help
                            title: 帮助中心
                            children:
                              - { key: help-doc, title: 使用文档 }
                              - { key: help-changelog, title: 更新日志 }
                          - key: console
                            title: 控制台
                            children:
                              - { key: console-overview, title: 概览 }
                    defaultExpandedKeys: [content, help, console]
            - type: Card
              props: { style: { flex: 1 } }
              children:
                - type: Flex
                  props: { direction: vertical, gap: 12 }
                  children:
                    - type: Text
                      props: { text: 使用文档, strong: true }
                    - type: Table
                      props:
                        pagination: false
                        columns:
                          - { title: 授权项, dataIndex: name }
                          - { title: Key, dataIndex: actionKey }
                          - { title: 类型, dataIndex: kind }
                          - title: 已授权
                            align: center
                            width: 80
                            cell:
                              type: Checkbox
                              props: { value: '${row.granted}' }
                        dataSource:
                          - { id: 1, name: 访问页面, actionKey: 'page:help:doc', kind: 页面, granted: true }
                          - { id: 2, name: 新建文档, actionKey: 'action:doc:create', kind: 操作, granted: true }
                          - { id: 3, name: 编辑文档, actionKey: 'action:doc:edit', kind: 操作, granted: false }
                          - { id: 4, name: 删除文档, actionKey: 'action:doc:delete', kind: 操作, granted: false }
        - type: Flex
          props: { justify: space-between, align: center }
          children:
            - type: Text
              props: { text: 变更尚未保存, type: warning, size: small }
            - type: Flex
              props: { gap: 8 }
              children:
                - type: Button
                  props: { text: 取消 }
                - type: Button
                  props: { text: 保存完整授权, variant: primary }
```

## 布局 C — 单栏搜索 + 扁平表（简化原型）

{{preview:03}}

无完整目录 API 时的降级方案：扁平 Table + 筛选；保存仍全量替换。须在「实现衔接」标明与目标交互差距（无目录定位、无已选计数）。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16 }
      children:
        - type: Input
          props:
            name: keyword
            placeholder: 搜索资源名称 / Key
        - type: Table
          props:
            pagination: false
            columns:
              - { title: 资源名称, dataIndex: name }
              - { title: Key, dataIndex: actionKey }
              - { title: 所属模块, dataIndex: module }
              - title: 已授权
                align: center
                width: 80
                cell:
                  type: Checkbox
                  props: { value: '${row.granted}' }
            dataSource:
              - { id: 1, name: 访问页面, actionKey: 'page:help:doc', module: 帮助中心, granted: true }
              - { id: 2, name: 访问页面, actionKey: 'page:help:changelog', module: 帮助中心, granted: false }
              - { id: 3, name: 新建文档, actionKey: 'action:doc:create', module: 帮助中心, granted: true }
              - { id: 4, name: 编辑文档, actionKey: 'action:doc:edit', module: 帮助中心, granted: false }
              - { id: 5, name: 删除文档, actionKey: 'action:doc:delete', module: 帮助中心, granted: false }
        - type: Flex
          props: { justify: space-between, align: center }
          children:
            - type: Text
              props: { text: 变更尚未保存, type: warning, size: small }
            - type: Flex
              props: { gap: 8 }
              children:
                - type: Button
                  props: { text: 取消 }
                - type: Button
                  props: { text: 保存完整授权, variant: primary }
```

## 保存交互

1. 点击「保存完整授权」前提示：**覆盖该角色现有全部授权**，展示新增/移除数量。  
2. 无变更时禁用保存。  
3. 只读：无权限或内置角色时复选框与保存禁用。
