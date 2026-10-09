---
title: 弹窗与确认框
slug: modal-confirm
order: 9
summary: 二次确认、轻量选择、多选添加；不承载整页复杂表单（危险确认 / 多选添加 / 信息预览）
sourceRef: innos-diagram/references/09-弹窗与确认框.md
---

# 弹窗与确认框

**组件类型：** 叠层交互  
**职责：** 二次确认、轻量选择、多选添加；不承载整页复杂表单（复杂表单用 Drawer / 整页表单）。

---

## 布局 A — 危险操作确认

{{preview:01}}

启用/禁用、安装插件、保存全量授权等须用此类确认；确认按钮文案与操作一致（「确认删除」而非「确定」）。用 `AlertDialog` 语义化封装确认/取消双按钮，`open` 受控绑定页面 state。

```text
        ┌─────────────────────────────────────┐
        │ 确认删除{对象}                  [×] │
        ├─────────────────────────────────────┤
        │ 说明影响范围（解除绑定、不可恢复…）   │
        │                                     │
        │              [取消]  [确认删除]     │
        └─────────────────────────────────────┘
```

| 要点 | 说明 |
| --- | --- |
| 触发 | 列表操作列的危险动作（删除 / 停用 / 全量授权） |
| 说明 | description 写明影响范围与不可恢复性 |
| 按钮 | 确认按钮文案与操作一致，可配 danger 语义 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
# state: { confirmOpen: true }
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
              props: { text: 访问密钥, size: large, strong: true }
            - type: Button
              props: { text: 新建密钥, variant: primary, icon: plus }
        - type: Table
          props:
            columns:
              - { title: 密钥 ID, dataIndex: keyId }
              - { title: 创建时间, dataIndex: createdAt }
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
                  props: { text: 删除, variant: link, danger: true }
                  events:
                    onClick:
                      - action: setState
                        params: { confirmOpen: true }
            dataSource:
              - { id: 1, keyId: AK-7f3e-9c21, createdAt: 2026-03-12 10:24, statusType: success, statusText: 启用中 }
              - { id: 2, keyId: AK-b8d2-4e67, createdAt: 2026-06-05 16:08, statusType: default, statusText: 已停用 }
        - type: AlertDialog
          props:
            title: 确认删除访问密钥？
            description: 删除后使用该密钥的应用将立即无法访问，此操作不可恢复。
            confirmText: 确认删除
            cancelText: 取消
            open: "${state.confirmOpen}"
          events:
            onConfirm:
              - action: setState
                params: { confirmOpen: false }
              - action: message
                params: { messageType: success, text: 访问密钥已删除 }
            onCancel:
              - action: setState
                params: { confirmOpen: false }
```

## 布局 B — 多选添加成员

{{preview:02}}

**适用：** 角色成员列表等多选添加场景。Dialog 内嵌筛选行 + 多选 Table（`rowSelection` + `selectedRowKeys` 受控选中）+ 底部已选计数与操作；宽度用 `style: { width: 640, maxWidth: 'none' }` 覆盖默认弹窗宽度。

```text
        ┌─ 添加到「{角色名}」────────────────────── [×] ┐
        │ 类型 [用户▾]  🔍 搜索…                          │
        │ ┌────────────────────────────────────────────┐ │
        │ │ □  姓名    账号      组织        状态       │ │
        │ │ ☑  …       …        …          正常       │ │
        │ └────────────────────────────────────────────┘ │
        │ 已选 N 项              [取消] [添加到角色]      │
        └────────────────────────────────────────────────┘
```

| 要点 | 说明 |
| --- | --- |
| 筛选 | 类型 Select + 关键词 Input，轻量 inline，不整 Form |
| 多选 | Table `rowSelection` 开启勾选列，`selectedRowKeys` 受控 |
| 底部 | 左侧已选计数，右侧 [取消] + [添加到角色] 主操作 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
# state: { addOpen: true }
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
              props: { text: 成员列表, size: large, strong: true }
            - type: Button
              props: { text: 添加成员, variant: primary, icon: plus }
              events:
                onClick:
                  - action: setState
                    params: { addOpen: true }
        - type: Table
          props:
            columns:
              - { title: 姓名, dataIndex: name }
              - { title: 账号, dataIndex: account }
              - { title: 组织, dataIndex: org }
              - { title: 加入时间, dataIndex: joinedAt }
            dataSource:
              - { id: 1, name: 张三, account: zhangsan, org: 平台研发部, joinedAt: 2026-02-01 }
              - { id: 2, name: 李四, account: lisi, org: 平台研发部, joinedAt: 2026-03-18 }
        - type: Dialog
          props:
            title: 添加到「超级管理员」
            open: "${state.addOpen}"
            style: { width: 640, maxWidth: 'none' }
          events:
            onClose:
              - action: setState
                params: { addOpen: false }
          children:
            - type: Flex
              props: { direction: vertical, gap: 12 }
              children:
                - type: Flex
                  props: { gap: 8 }
                  children:
                    - type: Select
                      props:
                        placeholder: 类型
                        style: { width: 120 }
                        options:
                          - { label: 用户, value: user }
                          - { label: 用户组, value: group }
                    - type: Input
                      props:
                        placeholder: 搜索姓名或账号
                        style: { flex: 1 }
                - type: Table
                  props:
                    rowSelection: true
                    selectedRowKeys: [2]
                    pagination: false
                    columns:
                      - { title: 姓名, dataIndex: name }
                      - { title: 账号, dataIndex: account }
                      - { title: 组织, dataIndex: org }
                      - title: 状态
                        cell:
                          type: Status
                          props:
                            status: "${row.statusType}"
                            text: "${row.statusText}"
                    dataSource:
                      - { id: 1, name: 张三, account: zhangsan, org: 平台研发部, statusType: success, statusText: 正常 }
                      - { id: 2, name: 李四, account: lisi, org: 信息安全部, statusType: success, statusText: 正常 }
                      - { id: 3, name: 王五, account: wangwu, org: 平台研发部, statusType: default, statusText: 停用 }
                - type: Flex
                  props: { justify: space-between, align: center }
                  children:
                    - type: Text
                      props: { text: 已选 1 项, size: small, type: secondary }
                    - type: Flex
                      props: { gap: 8 }
                      children:
                        - type: Button
                          props: { text: 取消 }
                          events:
                            onClick:
                              - action: setState
                                params: { addOpen: false }
                        - type: Button
                          props: { text: 添加到角色, variant: primary }
                          events:
                            onClick:
                              - action: setState
                                params: { addOpen: false }
                              - action: message
                                params: { messageType: success, text: 已添加 1 名成员 }
```

## 布局 C — 信息预览

{{preview:03}}

「预览导航」等只读预览；底部仅 [关闭]。Dialog children 放只读结构（此处为 Icon + 名称 + 路径的菜单项列表），不挂表单与提交动作。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
# state: { previewOpen: true }
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
              props: { text: 自定义导航, size: large, strong: true }
            - type: Button
              props: { text: 新增菜单, variant: primary, icon: plus }
        - type: Table
          props:
            columns:
              - { title: 名称, dataIndex: name }
              - { title: 路径, dataIndex: path }
              - title: 操作
                width: 100
                align: center
                cell:
                  type: Button
                  props: { text: 预览, variant: link }
                  events:
                    onClick:
                      - action: setState
                        params: { previewOpen: true }
            dataSource:
              - { id: 1, name: 数据总览, path: /dashboard }
              - { id: 2, name: 资源管理, path: /resources }
        - type: Dialog
          props:
            title: 预览导航
            open: "${state.previewOpen}"
            style: { width: 560, maxWidth: 'none' }
          events:
            onClose:
              - action: setState
                params: { previewOpen: false }
          children:
            - type: Flex
              props: { direction: vertical, gap: 12 }
              children:
                - type: Flex
                  props: { direction: vertical, gap: 8 }
                  children:
                    - type: Flex
                      props: { align: center, gap: 8 }
                      children:
                        - type: Icon
                          props: { name: file-text }
                        - type: Text
                          props: { text: 数据总览 }
                        - type: Text
                          props: { text: /dashboard, size: small, type: secondary }
                    - type: Flex
                      props: { align: center, gap: 8 }
                      children:
                        - type: Icon
                          props: { name: file-text }
                        - type: Text
                          props: { text: 资源管理 }
                        - type: Text
                          props: { text: /resources, size: small, type: secondary }
                    - type: Flex
                      props: { align: center, gap: 8 }
                      children:
                        - type: Icon
                          props: { name: file-text }
                        - type: Text
                          props: { text: 审计日志 }
                        - type: Text
                          props: { text: /audit, size: small, type: secondary }
                - type: Flex
                  props: { justify: end }
                  children:
                    - type: Button
                      props: { text: 关闭, variant: primary }
                      events:
                        onClick:
                          - action: setState
                            params: { previewOpen: false }
```

## 结构说明

```text
Modal
├─ Title + Close
├─ Body（Table | Text | 简短 Form）
└─ Footer（取消 + 主操作）
```

## 规则

1. 弹窗内若含字段 + 提交，仍用 **Form**（如 B 中若有筛选 Form inline）。
2. 提交中：主按钮 loading，防重复点击。
3. 成功：关闭弹窗 + 刷新父列表 + Toast。
