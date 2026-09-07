---
title: 反馈与弹层组件
description: 反馈与弹层类 DSL 组件——Alert / Dialog / AlertDialog / Drawer / Sheet / Popover / Sonner / Tooltip / HoverCard 的 props 契约与 DSL 示例
---

消息反馈与弹层组件。Dialog / AlertDialog / Drawer / Sheet 在 DSL 内联声明时与交互层 OverlayHost 渲染的 overlay 视觉一致（同一套 vendored 原语）。

### Alert

| prop | 类型 | 说明 |
| --- | --- | --- |
| `message` | string | 主文案 |
| `description` | string | 辅助说明 |
| `variant` | `info`（默认）\| `success` \| `warning` \| `error` | 变体 |

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
| children | DslNode[] | — | 内容（DSL 子树，经 Renderer children 机制渲染） |
| 事件 `onClose` | — | — | 关闭时触发（遮罩 / Escape / 拖拽关闭），无载荷 |

`className` / `style` 挂在抽屉内容根节点。

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
