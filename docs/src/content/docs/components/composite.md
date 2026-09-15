---
title: 复合与其他组件
description: 复合与其他 DSL 组件——Button / Accordion / Collapsible / Command / Toggle / ToggleGroup / ButtonGroup / InputGroup / Markdown 的 props 契约与 DSL 示例
---

不易归入单一职能的组件：交互按钮（Button）、折叠与命令面板（Accordion / Collapsible / Command）、切换与组合控件（Toggle / ToggleGroup / ButtonGroup / InputGroup），以及由 `@pactor-app/markdown` 注册的 Markdown 渲染组件。

### Button

| prop | 类型 | 说明 |
| --- | --- | --- |
| `text` | string | 按钮文本 |
| `icon` | string | 图标名（Icon 白名单，kebab-case / PascalCase 均可），渲染在文本前；`loading` 时图标位由旋转图标取代 |
| `tooltip` | string | 提示文案，hover / focus 按钮时展示 Tooltip（按钮禁用（含 loading）时 hover 不触发，focus 仍可达） |
| `variant` | `default`（默认）\| `primary` \| `dashed` \| `link` \| `text` | 变体 |
| `danger` | boolean | 危险态 |
| `size` | `small` \| `middle`（默认）\| `large` | 尺寸 |
| `loading` | boolean | 加载态（可绑 `${dataStatus.x.loading}`，loading 时禁用点击） |
| `disabled` | boolean | 禁用 |
| `submit` | boolean | 作为 Form 提交按钮 |
| 事件 `onClick` | — | 点击触发动作 |

### Accordion

手风琴折叠面板：pane 内容经 renderChildren 渲染 DSL 子树；`multiple` 切换单开 / 多开模式。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `items` | `Array<{ key: string, title: string, children?: DslNode[] }>` | `[]` | 面板列表（可含表达式解析后的数组）；`children` 为 DSL 子树 |
| `collapsible` | boolean | — | 允许收起全部面板（契约兼容字段；Base UI single 模式天然允许收起，适配器未消费该值） |
| `multiple` | boolean | `false` | 允许多个面板同时展开 |

```yaml
- type: Accordion
  props:
    items:
      - key: faq-1
        title: 如何重置密码？
        children:
          - type: Text
            props: { text: 在设置页点击「重置密码」。 }
```

### Collapsible

单项折叠容器：`title` 触发区 + children 折叠内容。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `title` | string | — | 触发区标题 |
| `open` | boolean | — | 受控开关（可绑 `${state.x}` 表达式）；缺省内部自管理 |
| children | DslNode[] | — | 折叠内容（DSL 子树，经 Renderer children 机制渲染） |

源码未定义变化事件——受控场景只读 `open`（内部不自更新），联动收起需自行维护 state。

```yaml
- type: Collapsible
  props: { title: 高级选项 }
  children:
    - type: Text
      props: { text: 折叠内容 }
```

### Command

命令面板（cmdk）：支持搜索过滤（按 value 与 label 匹配）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `groups` | `Array<{ heading?: string, items: Array<{ label: string, value: string, icon?: string, disabled?: boolean }> }>` | `[]` | 分组列表；`icon` 为图标名（Icon 白名单），渲染于文字前 |
| `placeholder` | string | — | 搜索框占位文本 |
| `emptyText` | string | i18n `pactor.command.empty` | 空结果文案 |
| 事件 `onSelect` | — | — | 选中命令项时触发，`${event}` 为选中项 `value`（string） |

```yaml
- type: Command
  props:
    placeholder: 搜索命令
    groups:
      - heading: 操作
        items:
          - { label: 创建记录, value: create }
          - { label: 删除记录, value: delete }
  events:
    onSelect:
      action: setState
      params:
        cmd: ${event}
```

### Toggle

切换按钮：`pressed` 受控（未传时为非受控）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `text` | string | — | 按钮文本 |
| `pressed` | boolean | — | 受控按下态 |
| `variant` | `default` \| `outline` | `default` | 样式变体 |
| `size` | `default` \| `sm` \| `lg` | `default` | 尺寸 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 按下态变化时触发，`${event}` 为 boolean |

```yaml
- type: Toggle
  props:
    text: 加粗
    pressed: ${state.bold}
  events:
    onChange:
      action: setState
      params:
        bold: ${event}
```

### ToggleGroup

切换按钮组：Base UI 统一以数组表达选中态，适配层按 `multiple` 收敛为单值 / 数组（DSL 语义值）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `options` | `Array<{ label: string, value: string, disabled?: boolean }>` | `[]` | 选项列表 |
| `value` | string \| string[] | — | 受控选中值：单选传 value，多选传数组 |
| `multiple` | boolean | `false` | 多选模式（缺省单选） |
| `disabled` | boolean | — | 整组禁用 |
| 事件 `onChange` | — | — | 选中变化时触发：单选 `${event}` 为选中 value（取消选中传 `undefined`），多选为值数组（string[]） |

```yaml
- type: ToggleGroup
  props:
    multiple: true
    value: ${state.aligns}
    options:
      - { label: 左, value: left }
      - { label: 中, value: center }
      - { label: 右, value: right }
  events:
    onChange:
      action: setState
      params:
        aligns: ${event}
```

### ButtonGroup

相连按钮组：children 为若干 Button。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| children | DslNode[] | — | 若干 Button（DSL 子树） |

```yaml
- type: ButtonGroup
  children:
    - type: Button
      props: { text: 左 }
    - type: Button
      props: { text: 中 }
    - type: Button
      props: { text: 右 }
```

### InputGroup

组合输入框：children 为 Input 与前后缀元素（Text / Button）；内部 Input 的边框 / 焦点环由容器样式消化。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| children | DslNode[] | — | Input 与前后缀元素（Text/Button，DSL 子树） |

```yaml
- type: InputGroup
  children:
    - type: Text
      props: { text: ¥ }
    - type: Input
      props: { name: price, placeholder: 0.00 }
```

### Markdown

安全 Markdown 渲染（禁 raw HTML、链接协议白名单，含代码高亮与 KaTeX 数学），由 @pactor-app/markdown 提供，需经 `registerMarkdownComponents(runtime.context.components)` 注册后可用（chat 场景经 Safe Registry 白名单放行）。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `content` | string | Markdown 源文本；`${data.xxx}` 等表达式由 Renderer 在下发前解析 |

```yaml
- type: Markdown
  props:
    content: '当前筛选：**${state.keyword}**'
```
