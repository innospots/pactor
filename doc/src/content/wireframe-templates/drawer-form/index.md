---
title: 侧滑层表单
slug: drawer-form
order: 8
summary: 在列表上下文内新建/编辑复杂对象，不离开列表页（宽滑层 / 窄滑层 / 行内展开）
sourceRef: innos-diagram/references/08-侧滑层表单.md
---

# 侧滑层表单

**组件类型：** 叠层编辑  
**职责：** 在列表上下文内新建/编辑复杂对象，不离开列表页。

---

## 布局 A — 右侧宽滑层（字典类）

{{preview:01}}

```text
│ 【列表页背景，略暗或保持】                    ┌─ 编辑{type} ─────── [×] ─┐ │
│                                              │ 基本信息区块              │ │
│                                              │ 字段…                     │ │
│                                              │ ─────────────────────    │ │
│                                              │ 子列表（多值项）          │ │
│                                              │ [+ 添加项]                │ │
│                                              │ 行内展开表单…             │ │
│                                              │                           │ │
│                                              │          [取消][保存全部] │ │
│                                              └───────────────────────────┘ │
```

| 要点 | 说明 |
| --- | --- |
| 宽度 | 容纳子表 + 多语言字段；内容区滚动，底栏固定提交 |
| 保存 | 「保存全部」一次提交类型与子项草稿 |
| 关闭 | 未保存变更时确认 |

**适用：** 字典类型列表等多值项编辑场景。Drawer 无 `width` 属性（缺省约 384px），宽度用 `style: { width: 480, maxWidth: 'none' }` 覆盖。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
# state: { drawerOpen: true }  # 预览为展示效果默认打开；真实场景由列表行「编辑」置 true
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
              props: { text: 数据字典, size: large, strong: true }
            - type: Button
              props: { text: 新建字典类型, variant: primary, icon: plus }
              events:
                onClick:
                  - action: setState
                    params: { drawerOpen: true }
        - type: Table
          props:
            columns:
              - { title: 类型名称, dataIndex: name }
              - { title: 编码, dataIndex: code }
              - title: 状态
                cell:
                  type: Status
                  props:
                    status: "${row.statusType}"
                    text: "${row.statusText}"
              - title: 操作
                width: 100
                align: center
                cell:
                  type: Button
                  props: { text: 编辑, variant: link }
                  events:
                    onClick:
                      - action: setState
                        params: { drawerOpen: true }
            dataSource:
              - { id: 1, name: 用户性别, code: gender, statusType: success, statusText: 启用 }
              - { id: 2, name: 用户状态, code: user-status, statusType: success, statusText: 启用 }
              - { id: 3, name: 行业分类, code: industry, statusType: default, statusText: 停用 }
        - type: Drawer
          props:
            title: 编辑字典类型
            open: "${state.drawerOpen}"
            style: { width: 480, maxWidth: 'none' }
            okText: 保存全部
          events:
            onClose:
              - action: setState
                params: { drawerOpen: false }
            onOk:
              - action: form.submit
          children:
            - type: Form
              events:
                onSubmit:
                  - action: message
                    params: { messageType: success, text: 保存成功 }
                  - action: setState
                    params: { drawerOpen: false }
              children:
                - type: Flex
                  props: { direction: vertical, gap: 16 }
                  children:
                    - type: Flex
                      props: { direction: vertical, gap: 8, align: start }
                      children:
                        - type: Text
                          props: { text: 基本信息, strong: true }
                        - type: Container
                          props: { className: border-b border-border w-full }
                    - type: Field
                      props: { label: 类型名称, required: true }
                      children:
                        - type: Input
                          props:
                            name: name
                            value: 用户性别
                            rules:
                              - { required: true, message: 请输入类型名称 }
                    - type: Field
                      props: { label: 编码, description: 编码创建后不可修改 }
                      children:
                        - type: Input
                          props: { name: code, value: gender, disabled: true }
                    - type: Field
                      props: { label: 安全域 }
                      children:
                        - type: Select
                          props:
                            name: scope
                            value: 平台域
                            options:
                              - { label: 平台域, value: 平台域 }
                              - { label: 租户域, value: 租户域 }
                    - type: Flex
                      props: { direction: vertical, gap: 8, align: start }
                      children:
                        - type: Text
                          props: { text: 字典项, strong: true }
                        - type: Container
                          props: { className: border-b border-border w-full }
                    - type: Table
                      props:
                        pagination: false
                        columns:
                          - { title: 名称, dataIndex: name }
                          - { title: 值, dataIndex: value }
                          - { title: 排序, dataIndex: sort }
                          - title: 操作
                            width: 80
                            align: center
                            cell:
                              type: Button
                              props: { text: 删除, variant: link, danger: true }
                        dataSource:
                          - { id: 1, name: 男, value: 1, sort: 1 }
                          - { id: 2, name: 女, value: 2, sort: 2 }
                    - type: Button
                      props: { text: 添加项, variant: dashed, icon: plus }
```

## 布局 B — 窄滑层（轻量编辑）

{{preview:02}}

仅 4～6 个字段；从列表行「编辑」打开，保存后刷新行。宽度收窄至 360px：`style: { width: 360, maxWidth: 'none' }`。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
# state: { drawerOpen: true }  # 预览为展示效果默认打开；真实场景由列表行「编辑」置 true
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
              props: { text: 成员管理, size: large, strong: true }
            - type: Button
              props: { text: 新建成员, variant: primary, icon: plus }
              events:
                onClick:
                  - action: setState
                    params: { drawerOpen: true }
        - type: Table
          props:
            columns:
              - { title: 姓名, dataIndex: name }
              - { title: 邮箱, dataIndex: email }
              - { title: 角色, dataIndex: role }
              - title: 操作
                width: 100
                align: center
                cell:
                  type: Button
                  props: { text: 编辑, variant: link }
                  events:
                    onClick:
                      - action: setState
                        params: { drawerOpen: true }
            dataSource:
              - { id: 1, name: 张三, email: zhangsan@example.com, role: 管理员 }
              - { id: 2, name: 李四, email: lisi@example.com, role: 成员 }
        - type: Drawer
          props:
            title: 编辑成员
            open: "${state.drawerOpen}"
            style: { width: 360, maxWidth: 'none' }
            okText: 保存
          events:
            onClose:
              - action: setState
                params: { drawerOpen: false }
            onOk:
              - action: form.submit
          children:
            - type: Form
              events:
                onSubmit:
                  - action: message
                    params: { messageType: success, text: 保存成功 }
                  - action: setState
                    params: { drawerOpen: false }
              children:
                - type: Field
                  props: { label: 姓名, required: true }
                  children:
                    - type: Input
                      props:
                        name: name
                        value: 张三
                        rules:
                          - { required: true, message: 请输入姓名 }
                - type: Field
                  props: { label: 邮箱 }
                  children:
                    - type: Input
                      props: { name: email, placeholder: 请输入邮箱 }
                - type: Field
                  props: { label: 角色 }
                  children:
                    - type: Select
                      props:
                        name: role
                        value: 管理员
                        options:
                          - { label: 管理员, value: 管理员 }
                          - { label: 成员, value: 成员 }
                - type: Field
                  props: { label: 状态 }
                  children:
                    - type: Switch
                      props: { name: enabled, value: true }
```

## 布局 C — 行内展开（非滑层变体）

{{preview:03}}

在表格行下展开 Form 编辑字典项；与滑层二选一，**同一产品内不混用**两种多值编辑模式。

> DSL 的 `Table` 暂无 `expandable` 能力，上方预览用「表格 + 紧随其后高亮容器」静态模拟展开态；真实场景行内展开与滑层二选一、同一产品不混用。

```text
│ 项名称   值    状态   [编辑]                                               │
│ ┌─ 展开编辑区 ──────────────────────────────────────────────────────────┐ │
│ │ Form：值、多语言名称、排序、状态  [取消本项][完成]                       │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Card
      props: { title: 字典项 · 用户性别, className: w-full }
      children:
        - type: Flex
          props: { direction: vertical, gap: 0 }
          children:
            - type: Table
              props:
                pagination: false
                columns:
                  - { title: 项名称, dataIndex: name }
                  - { title: 值, dataIndex: value }
                  - title: 状态
                    cell:
                      type: Status
                      props:
                        status: "${row.statusType}"
                        text: "${row.statusText}"
                  - title: 操作
                    width: 100
                    align: center
                    cell:
                      type: Button
                      props: { text: 编辑, variant: link }
                dataSource:
                  - { id: 1, name: 简体中文, value: zh-CN, statusType: success, statusText: 启用 }
            - type: Flex
              props:
                direction: vertical
                gap: 12
                className: border border-border rounded-md bg-muted/50 p-4
              children:
                - type: Form
                  events:
                    onSubmit:
                      - action: message
                        params: { messageType: success, text: 已保存 }
                  children:
                    - type: Grid
                      props: { columns: 2, gap: 16 }
                      children:
                        - type: Field
                          props: { label: 值, required: true }
                          children:
                            - type: Input
                              props:
                                name: value
                                value: zh-CN
                                rules:
                                  - { required: true, message: 请输入值 }
                        - type: Field
                          props: { label: 多语言名称 }
                          children:
                            - type: Input
                              props: { name: label, value: 简体中文 }
                        - type: Field
                          props: { label: 排序 }
                          children:
                            - type: NumberInput
                              props: { name: sort, value: 1 }
                        - type: Field
                          props: { label: 状态 }
                          children:
                            - type: Switch
                              props: { name: enabled, value: true }
                    - type: Flex
                      props: { justify: end, gap: 8 }
                      children:
                        - type: Button
                          props: { text: 取消本项, variant: link }
                          events:
                            onClick:
                              - action: message
                                params: { messageType: info, text: 已取消修改 }
                        - type: Button
                          props: { text: 完成, variant: primary, submit: true }
```

## 状态

- 校验失败：保持展开并聚焦错误字段。
- 加密单值：不回显明文；留空表示保留原值。
