---
title: 树形主从配置页
slug: tree-master-detail
order: 4
summary: 左侧层级结构选择与排序，右侧属性表单；结构变更与属性保存可分期提交（等分 / 3:7 / 树表格）
sourceRef: innos-diagram/references/04-树形主从配置页.md
---

# 树形主从配置页（Tree + Form）

**组件类型：** 主从编辑  
**职责：** 左侧层级结构选择与排序，右侧属性表单；结构变更与属性保存可分期提交。

---

## 布局 A — 左右等分（标准）

{{preview:01}}

```text
│ {标题}                                    [预览] [+ 新建节点]              │
│ {描述}                                                                     │
│ ┌──────────────────────────┬───────────────────────────────────────────────┐ │
│ │ 树面板                    │ 属性表单                                      │ │
│ │ 🔍 搜索                   │ 名称 * [________________________]           │ │
│ │ ⠿ 节点A  [目录]           │ 类型   ●目录 ○页面 ○外链                     │ │
│ │   ⠿ 子节点 ◀              │ …                                            │ │
│ │ [＋同级][＋子级][删除]     │                        [取消] [保存]          │ │
│ │ 拖动排序提示              │                                              │ │
│ └──────────────────────────┴───────────────────────────────────────────────┘ │
│ 结构未保存提示                          [撤销调整] [保存结构]                │
```

| 区域 | 规则 |
| --- | --- |
| 树 | 搜索、展开收起、选中高亮；拖动调整层级/顺序 |
| 表单 | 选中节点或新建时同一套字段；**Form** 校验 |
| 底栏 | 结构批量保存与属性保存分离（若产品要求） |

**适用：** [自定义导航配置](../../../nexus/prd-diagram/菜单管理/01-自定义导航配置.md)。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  tree:
    - key: home
      title: 首页
    - key: system
      title: 系统管理
      children:
        - key: menu
          title: 菜单管理
        - key: role
          title: 角色管理
        - key: user
          title: 用户管理
    - key: help
      title: 帮助中心
      children:
        - key: doc
          title: 使用文档
        - key: changelog
          title: 更新日志
body:
  type: Page
  children:
    # 页面工具栏：标题 + 预览 / 新建节点
    - type: Flex
      props:
        justify: space-between
        align: center
      children:
        - type: Text
          props:
            text: 自定义导航配置
            strong: true
            size: large
        - type: Flex
          props:
            gap: 8
          children:
            - type: Button
              props:
                text: 预览
            - type: Button
              props:
                text: 新建节点
                variant: primary
                icon: plus
    # 单卡主从：左右等分（树面板 | 属性表单）
    - type: Card
      children:
        # 负边距撑满卡片（Card 内边距 16px），两列通高等宽
        - type: Flex
          props:
            align: stretch
            className: overflow-hidden rounded-lg
            style: { margin: -16 }
          children:
            - type: Flex
              props:
                direction: vertical
                gap: small
                className: flex-1 p-4
              children:
                - type: Text
                  props:
                    text: 导航结构
                    strong: true
                - type: Input
                  props:
                    name: keyword
                    placeholder: 搜索节点
                - type: Tree
                  props:
                    treeData: ${state.tree}
                    defaultExpandedKeys: [system]
                    defaultSelectedKeys: [menu]
                    # 拖拽调整层级/顺序：hover 行左侧 grip 手柄拖拽生效；
                    # 组件内部即时更新，持久化经 events.onDrop 同步
                    draggable: true
                    # 行级操作（外部传入）：op 绑定静态编辑（同级后插/追加子级/删除子树，组件内部即时改树）
                    nodeActionDisplay: dropdown
                    nodeActions:
                      - { value: addSibling, icon: plus, label: 同级, op: addSibling }
                      - { value: addChild, icon: plus, label: 子级, op: addChild }
                      - { value: delete, icon: trash, label: 删除, danger: true, op: delete, separatorBefore: true }
                - type: Text
                  props:
                    text: 拖动节点可调整层级与顺序
                    type: secondary
                    size: small
            - type: Flex
              props:
                direction: vertical
                gap: small
                className: flex-1 p-4
              children:
                  - type: Text
                    props:
                      text: 节点属性
                      strong: true
                  - type: Form
                  props:
                    layout: vertical
                  children:
                    # Form 内控件必须放 Field 内（label / required 归 Field）
                    - type: Field
                      props: { label: 名称, required: true }
                      children:
                        - type: Input
                          props:
                            name: name
                            value: 菜单管理
                    - type: Field
                      props: { label: 类型 }
                      children:
                        - type: RadioGroup
                          props:
                            name: type
                            direction: horizontal
                            value: page
                            options:
                              - { label: 目录, value: catalog }
                              - { label: 页面, value: page }
                              - { label: 外链, value: link }
                    - type: Field
                      props: { label: 路由路径 }
                      children:
                        - type: Input
                          props:
                            name: path
                            value: /system/menu
                    - type: Field
                      children:
                        - type: Switch
                          props:
                            name: visible
                            label: 显示
                            value: true
                    - type: Field
                      children:
                        - type: Flex
                          props:
                            justify: end
                            gap: 8
                          children:
                            - type: Button
                              props:
                                text: 取消
                            - type: Button
                              props:
                                text: 保存
                                variant: primary
                                submit: true
    # 底栏：结构批量保存与属性保存分离
    - type: Flex
      props:
        justify: space-between
        align: center
      children:
        - type: Text
          props:
            text: 结构有未保存的修改
            type: warning
            size: small
        - type: Flex
          props:
            gap: 8
          children:
            - type: Button
              props:
                text: 撤销调整
            - type: Button
              props:
                text: 保存结构
                variant: primary
```

## 布局 B — 窄树 + 宽表单（3:7）

{{preview:02}}

左侧仅显示标题与类型徽章，右侧容纳长表单、外链 URL、页面入口选择器。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
state:
  tree:
    - key: home
      title: 首页
    - key: system
      title: 系统管理
      children:
        - key: menu
          title: 菜单管理
        - key: role
          title: 角色管理
        - key: user
          title: 用户管理
    - key: help
      title: 帮助中心
      children:
        - key: doc
          title: 使用文档
        - key: changelog
          title: 更新日志
body:
  type: Page
  children:
    - type: Flex
      props:
        justify: space-between
        align: center
      children:
        - type: Text
          props:
            text: 自定义导航配置
            strong: true
            size: large
        - type: Button
          props:
            text: 新建节点
            variant: primary
            icon: plus
    # 窄树（3）+ 宽表单（7）：左侧仅搜索与节点标题，右侧容纳长表单
    - type: Flex
      props:
        gap: middle
        align: start
      children:
        - type: Card
          props:
            title: 导航结构
            style: { flex: 3 }
          children:
            - type: Flex
              props:
                direction: vertical
                gap: small
              children:
                - type: Input
                  props:
                    name: keyword
                    placeholder: 搜索节点
                - type: Tree
                  props:
                    treeData: ${state.tree}
                    defaultExpandedKeys: [system, help]
                    defaultSelectedKeys: [changelog]
        - type: Card
          props:
            title: 节点属性
            style: { flex: 7 }
          children:
            - type: Form
              props:
                layout: vertical
              children:
                # Form 内控件必须放 Field 内（label / required 归 Field）
                - type: Field
                  props: { label: 名称, required: true }
                  children:
                    - type: Input
                      props:
                        name: name
                        value: 更新日志
                - type: Field
                  props: { label: 类型 }
                  children:
                    - type: RadioGroup
                      props:
                        name: type
                        direction: horizontal
                        value: link
                        options:
                          - { label: 目录, value: catalog }
                          - { label: 页面, value: page }
                          - { label: 外链, value: link }
                - type: Field
                  props: { label: 外链 URL }
                  children:
                    - type: Input
                      props:
                        name: url
                        value: https://example.com/changelog
                        placeholder: https://
                - type: Field
                  props: { label: 页面入口 }
                  children:
                    - type: Select
                      props:
                        name: entry
                        placeholder: 选择已发布页面（类型为页面时必填）
                        options:
                          - { label: 帮助中心 / 使用文档, value: doc }
                          - { label: 帮助中心 / 常见问题, value: faq }
                - type: Field
                  props: { label: 打开方式 }
                  children:
                    - type: RadioGroup
                      props:
                        name: target
                        direction: horizontal
                        value: blank
                        options:
                          - { label: 当前页, value: self }
                          - { label: 新窗口, value: blank }
                - type: Field
                  props: { label: 排序 }
                  children:
                    - type: NumberInput
                      props:
                        name: sort
                        value: 20
                - type: Field
                  children:
                    - type: Switch
                      props:
                        name: visible
                        label: 显示
                        value: true
                - type: Field
                  children:
                    - type: Flex
                      props:
                        justify: end
                        gap: 8
                      children:
                        - type: Button
                          props:
                            text: 取消
                        - type: Button
                          props:
                            text: 保存
                            variant: primary
                            submit: true
```

## 布局 C — 树表格（树形数据 + 拖拽排序）

{{preview:03}}

行数据携带 `children` 时 Table 自动渲染为树表格：首列展开箭头 + 层级缩进，排序按层递归；开启 `rowDraggable` 后首列出现拖拽手柄，可在同级内拖拽排序（跨层级拖动自动拦截），适合菜单 / 类目等层级维护场景。

```text
│ │ ⠿ 名称          类型    排序  显示  操作                              │ │
│ │ ▾ 系统管理      目录    20    显示  [编辑]                            │ │
│ │    菜单管理     页面    10    显示  [编辑]                            │ │
```

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
            # 行数据含 children 自动树形；默认全部展开，拖拽手柄列同级内排序
            rowDraggable: true
            defaultExpandAllRows: true
            columns:
              - title: 名称
                dataIndex: name
              - title: 类型
                dataIndex: type
              - title: 排序
                dataIndex: sort
                align: right
                sorter: true
              - title: 显示
                cell:
                  type: Status
                  props:
                    status: ${row.visibleType}
                    text: ${row.visibleText}
              - title: 操作
                width: 120
                align: center
                cell:
                  type: Button
                  props:
                    text: 编辑
                    variant: link
            dataSource:
              - { id: 1, name: 首页, type: 页面, sort: 10, visibleType: success, visibleText: 显示 }
              - id: 2
                name: 系统管理
                type: 目录
                sort: 20
                visibleType: success
                visibleText: 显示
                children:
                  - { id: 21, name: 菜单管理, type: 页面, sort: 10, visibleType: success, visibleText: 显示 }
                  - { id: 22, name: 角色管理, type: 页面, sort: 20, visibleType: default, visibleText: 隐藏 }
                  - { id: 23, name: 用户管理, type: 页面, sort: 30, visibleType: success, visibleText: 显示 }
              - id: 3
                name: 帮助中心
                type: 目录
                sort: 30
                visibleType: success
                visibleText: 显示
                children:
                  - { id: 31, name: 使用文档, type: 外链, sort: 10, visibleType: success, visibleText: 显示 }
```

## 状态与异常

| 状态 | 说明 |
| --- | --- |
| 空树 | 「尚未配置」+ 新建入口 |
| 未保存离开 | 提示保存/放弃/继续编辑 |
| 删除含子节点 | 阻止或要求先处理子节点 |
