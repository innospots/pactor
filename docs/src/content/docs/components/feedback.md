---
title: 反馈与弹层组件
description: 反馈与弹层类 DSL 组件——Alert / Dialog / AlertDialog / Drawer / Sheet / Popover / Sonner / Tooltip / HoverCard / Message / Notification / Popconfirm / Result / LoadingOverlay / Watermark / Tour 的 props 契约与 DSL 示例
---

消息反馈与弹层组件。Dialog / AlertDialog / Drawer / Sheet 在 DSL 内联声明时与交互层 OverlayHost 渲染的 overlay 视觉一致（同一套 vendored 原语）。

### Alert

| prop | 类型 | 说明 |
| --- | --- | --- |
| `message` | string | 主文案 |
| `description` | string | 辅助说明 |
| `variant` | `info`（默认）\| `success` \| `warning` \| `error` | 变体 |
| `showIcon` | boolean | 为 true 时按 variant 显示默认图标（success ✓ / info ℹ / warning ⚠ / error ✕） |
| `icon` | string | 自定义图标名（[Icon 白名单](./display.mdx#icon)，提供时隐含 `showIcon`） |

### Dialog

模态对话框。受控用法：`open` 绑表达式 + `onClose` 回写；非受控用法：声明 `trigger` DSL 子树作触发元素，开关内部自管理。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `title` | string | — | 对话框标题 |
| `description` | string | — | 辅助说明 |
| `open` | boolean | — | 受控开关（可绑 `${state.x}` 表达式）；缺省时由 `trigger` 自管理 |
| `trigger` | DslNode | — | 触发元素（DSL 子树，非受控用法下点击打开） |
| children | DslNode[] | — | 内容（DSL 子树，经 Renderer children 机制渲染） |
| 事件 `onClose` | — | — | 关闭时触发（X / 遮罩 / Escape 任一途径），无载荷 |

`className` / `style` 挂在弹层内容根节点。

```yaml
- type: Dialog
  props:
    title: 编辑客户
    open: ${state.dialogOpen}
    trigger:
      type: Button
      props: { text: 打开 }
  events:
    onClose:
      action: setState
      params:
        dialogOpen: false
  children:
    - type: Text
      props: { text: 对话框内容 }
```

### AlertDialog

确认 / 取消语义化对话框：点击确认先执行 `onConfirm` 再关闭（关闭由原语完成），取消同理执行 `onCancel`。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `title` | string | — | 标题 |
| `description` | string | — | 说明内容 |
| `confirmText` | string | i18n `pactor.alertDialog.confirm` | 确认按钮文案（与 InteractionProvider confirm 一致） |
| `cancelText` | string | i18n `pactor.alertDialog.cancel` | 取消按钮文案 |
| `open` | boolean | — | 受控开关（可绑表达式）；缺省时由 `trigger` 自管理 |
| `trigger` | DslNode | — | 触发元素（DSL 子树，非受控用法下点击打开） |
| 事件 `onConfirm` | — | — | 点击确认按钮触发，且弹层关闭；无载荷 |
| 事件 `onCancel` | — | — | 点击取消按钮触发，且弹层关闭；无载荷 |

`className` / `style` 挂在弹层内容根节点。

```yaml
- type: AlertDialog
  props:
    title: 确认删除？
    description: 删除后不可恢复
    trigger:
      type: Button
      props: { text: 删除, danger: true }
  events:
    onConfirm:
      action: setState
      params:
        deleted: true
```

### Drawer

抽屉（vaul 原语）：受控 `open` + 四方向滑出。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `title` | string | — | 抽屉标题 |
| `open` | boolean | `false` | 受控开关（可绑 `${state.x}` 表达式） |
| `placement` | `left` \| `right` \| `top` \| `bottom` | `right` | 滑出方向 |
| `draggable` | boolean | `false` | 允许按住面板拖拽关闭（遮罩 / Escape 关闭不受影响） |
| `closable` | boolean | `true` | 右上角展示关闭图标（点击关闭并触发 `onClose`） |
| `footer` | DslNode \| `false` | 默认按钮组 | 底部操作栏：`false` 不展示；DslNode 自定义内容；缺省为 [取消, 确定]，右对齐、固定于抽屉底部（内容区独立滚动） |
| `cancelText` | string | `取消` | 默认 footer「取消」按钮文案（触发 `onClose`） |
| `okText` | string | `确定` | 默认 footer「确定」按钮文案（触发 `onOk`） |
| children | DslNode[] | — | 内容（DSL 子树，经 Renderer children 机制渲染） |
| 事件 `onClose` | — | — | 关闭时触发（关闭图标 / 遮罩 / Escape / 拖拽关闭 / 默认 footer「取消」），无载荷 |
| 事件 `onOk` | — | — | 默认 footer「确定」按钮触发，无载荷 |

`className` / `style` 挂在抽屉内容根节点。关闭链路（关闭图标 / 遮罩 / Escape / 默认「取消」）在未 wiring `onClose` 时也会默认关闭抽屉（内部回退标记，`open` 复置 true 时复位）；wiring `onClose` 回写 state 是推荐做法。

```yaml
- type: Drawer
  props:
    title: 详情
    open: ${state.drawerOpen}
    placement: right
  events:
    onClose:
      action: setState
      params:
        drawerOpen: false
    onOk:                        # 默认 footer「确定」
      action: setState
      params:
        drawerOpen: false
  children:
    - type: Text
      props: { text: 抽屉内容 }

# 表单抽屉：okText 改文案 + onOk 经 form.submit 桥接触发表单校验与提交
- type: Drawer
  props:
    title: 编辑
    open: ${state.editOpen}
    okText: 保存
  events:
    onClose: [{ action: setState, params: { editOpen: false } }]
    onOk: [{ action: form.submit }]            # 触发下方 Form 的校验 + onSubmit
  children:
    - type: Form
      children:
        # ...Field...

# 自定义 footer：DslNode 子树（容器右对齐，内容声明 w-full 可自行控制对齐）
- type: Drawer
  props:
    title: 编辑
    open: ${state.editOpen}
    footer:
      type: Flex
      props: { gap: 8 }
      children:
        - type: Button
          props: { text: 取消 }
        - type: Button
          props: { text: 保存, variant: primary }
  children:
    - type: Text
      props: { text: 抽屉内容 }
```

### Sheet

侧边滑入面板（dialog 同源原语）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `title` | string | — | 面板标题 |
| `open` | boolean | `false` | 受控开关（可绑 `${state.x}` 表达式） |
| `side` | `left` \| `right` \| `top` \| `bottom` | `right` | 滑出方向 |
| children | DslNode[] | — | 内容（DSL 子树，经 Renderer children 机制渲染） |
| 事件 `onClose` | — | — | 关闭时触发（X / 遮罩 / Escape 任一途径），无载荷 |

`className` / `style` 挂在面板内容根节点。

```yaml
- type: Sheet
  props:
    title: 筛选
    open: ${state.sheetOpen}
    side: left
  events:
    onClose:
      action: setState
      params:
        sheetOpen: false
  children:
    - type: Text
      props: { text: 面板内容 }
```

### Popover

点击浮层：children 为触发元素（span 包装接入 Base UI Trigger），`content` 支持 DSL 子树或纯文本。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `content` | DslNode \| string | — | 浮层内容：DSL 子树（对象，渲染层求值）或纯文本 |
| children | DslNode[] | — | 触发元素（DSL 子树，经 Renderer children 机制渲染） |

`className` / `style` 挂在浮层内容根节点。

```yaml
- type: Popover
  props:
    content:
      type: Text
      props: { text: 浮层富内容 }
  children:
    - type: Button
      props: { text: 打开浮层 }
```

### Sonner

全局 toast 挂载点：渲染 Toaster 容器；mount 时向运行时动作注册表注册 `toast` 动作（动作经本组件注册，需页面内声明一个 Sonner 后方可使用）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| — | — | — | 无组件特有 props（仅通用 `className` / `style`，挂在挂载点容器） |

`toast` 动作参数：`message`（string）、`description?`（string）、`variant?`（`success` \| `error` \| `info`）。

```yaml
- type: Sonner
- type: Button
  props: { text: 保存 }
  events:
    onClick:
      action: toast
      params:
        message: 已保存
        variant: success
```

### Tooltip

悬浮提示：children 为触发元素，悬浮显示 `content` 纯文本提示浮层。浮层缺省位于触发元素上方，空间不足时自动翻转朝向，尖角始终贴边指向触发元素。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `content` | string | — | 提示文案（纯文本） |
| `side` | 'top' \| 'right' \| 'bottom' \| 'left' | 'top' | 浮层朝向（如图标栏 hover 时用 `right` 展示在图标右侧） |
| children | DslNode[] | — | 触发元素（DSL 子树，经 Renderer children 机制渲染） |

`className` / `style` 挂在提示浮层根节点（非触发元素）。

:::note
浮层经 Portal 挂载到 `document.body`，气泡配色（`--primary` / `--primary-foreground`）在挂载点解析——换肤令牌需覆盖在 `:root`（见[主题与换肤](../../guides/theming/)），只覆盖在某个内层容器上浮层读不到。
:::

```yaml
- type: Tooltip
  props: { content: 删除该记录 }
  children:
    - type: Button
      props: { text: 删除, danger: true }
```

### HoverCard

悬浮卡片：children 为触发元素，悬浮显示 `content` 富内容卡片（支持 DSL 子树）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `content` | DslNode \| string | — | 悬浮卡片内容：DSL 子树（对象，渲染层求值）或纯文本 |
| children | DslNode[] | — | 触发元素（DSL 子树，经 Renderer children 机制渲染） |

`className` / `style` 挂在卡片浮层根节点（非触发元素）。

```yaml
- type: HoverCard
  props:
    content:
      type: Text
      props: { text: 最近登录：${data.user.lastLogin} }
  children:
    - type: Avatar
      props: { fallback: 张 }
```

### Message

声明式全局短反馈触发器：`content` 变为非空字符串时（含首次挂载）发一条全局 toast；自身只渲染隐藏标记节点，不产生可见 UI。与 `toast` 动作同一体系——页面需声明一个 [Sonner](#sonner) 挂载点方可正常弹出。触发只看 `content` 引用变化：`variant` / `duration` 变化不会重发。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `content` | string | — | 反馈文案：变为非空字符串时发一条全局短 toast |
| `variant` | `info`（默认）\| `success` \| `error` \| `warning` | `info` | 语义类型 |
| `duration` | number | — | 自动关闭时长（ms） |

```yaml
- type: Sonner
- type: Message
  props: { content: ${state.notice}, variant: success, duration: 3000 }
```

### Notification

声明式全局富通知触发器：`title` 变为非空字符串时（含首次挂载）发一条 title + description 的富通知 toast；自身只渲染隐藏标记节点。与 `toast` 动作同一体系——页面需声明一个 [Sonner](#sonner) 挂载点方可正常弹出。触发只看 `title` 引用变化：`description` / `variant` / `duration` 变化不会重发。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `title` | string | — | 通知标题：变为非空字符串时发一条富通知 toast |
| `description` | string | — | 通知正文 |
| `variant` | `info`（默认）\| `success` \| `error` \| `warning` | `info` | 语义类型 |
| `duration` | number | — | 自动关闭时长（ms） |

```yaml
- type: Sonner
- type: Notification
  props:
    title: ${state.noticeTitle}
    description: ${state.noticeDetail}
    variant: info
```

### Popconfirm

轻量确认框（基于 Popover）：children 为触发元素，点击后在其就近位置弹出确认卡片（标题/说明 + 取消/确定按钮组）；点击确认或取消后浮层自动关闭并触发对应事件。确认/取消文案缺省走 i18n（zh-CN 为「确定」「取消」）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `title` | string | — | 确认框标题 |
| `description` | string | — | 辅助说明文案 |
| `confirmText` | string | i18n 缺省（「确定」） | 确认按钮文案 |
| `cancelText` | string | i18n 缺省（「取消」） | 取消按钮文案 |
| `danger` | boolean | — | 确认按钮使用危险色 |
| children | DslNode[] | — | 触发元素（DSL 子树，经 Renderer children 机制渲染） |
| 事件 `onConfirm` | — | — | 点击确认按钮触发，且浮层关闭；无载荷 |
| 事件 `onCancel` | — | — | 点击取消按钮触发，且浮层关闭；无载荷 |

`className` / `style` 挂在浮层内容根节点。

```yaml
- type: Popconfirm
  props:
    title: 确认删除该记录？
    description: 删除后不可恢复
    danger: true
  events:
    onConfirm:
      action: message
      params: { messageType: success, text: 已删除 }
  children:
    - type: Button
      props: { text: 删除, danger: true }
```

### Result

结果页：居中大图标（`404` / `403` / `500` 渲染状态码大字，其余四态渲染语义图标）+ 标题 + 副标题 + 操作区。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `status` | `success` \| `error` \| `info` \| `warning` \| `404` \| `403` \| `500` | `info` | 状态 |
| `title` | string | — | 标题 |
| `subTitle` | string | — | 副标题 |
| children | DslNode[] | — | 操作区（DSL 子树，经 Renderer children 机制渲染） |

```yaml
- type: Result
  props:
    status: success
    title: 提交成功
    subTitle: 审核结果将在 1-3 个工作日内通知
  children:
    - type: Button
      props: { text: 返回列表, variant: primary }
```

### LoadingOverlay

局部加载遮罩：容器相对定位包 children，`loading` 时覆盖半透明层（居中 Spinner + 可选文案）；`loading: false` 时只渲染 children。无 children 时退化为独立 Spinner。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `loading` | boolean | `false` | 是否处于加载态（显示覆盖层，可绑 `${state.x}` 表达式） |
| `text` | string | — | 加载提示文案 |
| children | DslNode[] | — | 被覆盖区块（DSL 子树，经 Renderer children 机制渲染） |

```yaml
- type: LoadingOverlay
  props: { loading: ${data.loading}, text: 加载中 }
  children:
    - type: List
      props:
        items: ${data.records}
```

### Watermark

水印：容器包 children，水印为铺满容器、不拦截指针事件的平铺文本背景层；多行 `content` 纵向排列。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `content` | string \| string[] | — | 水印文本：字符串或字符串数组（多行纵向排列） |
| `rotate` | number | `-22` | 旋转角度 |
| `gap` | `[number, number]` | `[100, 100]` | 平铺间距 [水平, 垂直]（px） |
| `opacity` | number | `0.15` | 文本透明度（0~1） |
| children | DslNode[] | — | 被覆盖内容（DSL 子树，经 Renderer children 机制渲染） |

```yaml
- type: Watermark
  props: { content: [内部资料, ${data.user.name}] }
  children:
    - type: Text
      props: { text: 页面正文内容 }
```

### Tour

分步引导：`open` 时渲染半透明遮罩 + 当前步骤卡片；卡片按 `steps[].target`（CSS selector）定位在目标元素附近，选择器无匹配时居中兜底不抛错。「下一步」/「上一步」触发 `onChange`，末步「完成」与右上角关闭触发 `onClose`。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `open` | boolean | `false` | 是否开启引导（可绑 `${state.x}` 表达式） |
| `steps` | `Array<{ target?, title?, content? }>` | `[]` | 步骤列表；`target` 为 CSS selector |
| `current` | number | — | 受控步骤序号（缺省内部从 0 开始） |
| 事件 `onChange` | — | — | 步骤切换时触发，`${event}` 为目标序号 |
| 事件 `onClose` | — | — | 完成（末步）与关闭时触发；无载荷 |

`className` / `style` 挂在步骤卡片。

```yaml
- type: Tour
  props:
    open: ${state.tourOpen}
    steps:
      - { target: '#create-btn', title: 第一步, content: 点击这里创建第一条记录 }
      - { title: 完成, content: 更多功能请在设置中探索 }
  events:
    onClose:
      action: setState
      params:
        tourOpen: false
```
