---
title: 表单组件
description: 表单类 DSL 组件——Form / Input / Select / Textarea / Checkbox / RadioGroup / Switch / Slider / Label / Field / Calendar / InputOTP / Combobox 的 props 契约、FieldRule 校验规则与 DSL 示例
---

Form 容器与录入控件。全部录入组件可在 `Form` 内按 `name` 参与值收集与校验（`label` / `rules` 生效，值为字段初始值，优先于 Form 的 `initialValues`），也可独立使用（`value` 为受控值）。

### Form

| prop | 类型 | 说明 |
| --- | --- | --- |
| `name` | string（默认 `'default'`） | 表单名，`form.setValues` 联动动作按名寻址；同页多表单（如页面表单 + 抽屉表单）需显式命名避免重复注册 |
| `layout` | `vertical`（默认）\| `horizontal` \| `inline` | 表单布局 |
| `initialValues` | object | 表单初始值（字段级 `value` 优先于此处的同名字段） |
| 事件 `onSubmit` | — | 校验通过后触发，`event` 为表单 values，同时写入 `${form.<field>}` |
| 事件 `onValuesChange` | — | 字段变化，`event` 为变化字段单键对象 `{ <field>: <newValue> }` |

Form 内声明 `name` 的 Input / Select 及本页其余录入组件（Textarea / Checkbox / RadioGroup / Switch / Slider / Calendar / InputOTP / Combobox）自动成为表单项（label / rules 生效，值由 Form 托管）。

### Input

| prop | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | 字段名（Form 内声明即成为表单项） |
| `label` | string | 表单项标签 |
| `rules` | FieldRule[] | 校验规则（见本页末尾[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | string | 独立渲染时为受控值；Form 内为字段初始值（优先于 `initialValues`） |
| `type` | `text`（默认）\| `password` | `password` 掩码输入 |
| `placeholder` | string | 占位文案 |
| `disabled` | boolean | 禁用 |
| 事件 `onChange` | — | 传出 string 值 |

### Select

| prop | 类型 | 说明 |
| --- | --- | --- |
| `name` / `label` / `rules` / `placeholder` / `disabled` | 同 Input | — |
| `options` | `{ label, value, disabled? }[]`（value: string \| number \| boolean） | 选项列表；`disabled: true` 的选项不可选；远程任意字段名经 dataSource 的 `valueField` / `labelField` / `disabledField` 映射 |
| `value` | string \| number \| boolean | 同 Input 的初始值语义 |
| `allowClear` | boolean | 可清空 |
| 事件 `onChange` | — | 传出选中 value |

### Textarea

多行文本输入。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | string | — | 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form `initialValues`） |
| `placeholder` | string | — | 占位文案 |
| `rows` | number | — | 行数（缺省由内容自适应） |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 输入时触发，`${event}` 为 string 值 |

```yaml
- type: Textarea
  props: { name: remark, label: 备注, rows: 4, placeholder: 请输入备注 }
```

### ChatInput

AI 对话输入框的通用结构构件：外层圆角容器（focus-within 高亮）内依次承载自适应高度 textarea、工具栏行与可选底部区（footer，带上分隔线）。工具栏与底部区内容完全由槽位 DSL 自定义；内建圆形发送钮（空白或 disabled 时禁用，`hideSend` 可隐藏）。定位为通用结构构件——transport / 附件 / 提及等对话领域能力请用 `@pactor-app/chat`。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `value` | string | — | 受控值（提供即受控：变更只经 onChange 传出） |
| `placeholder` | string | — | 占位文案 |
| `disabled` | boolean | — | 禁用 |
| `rows` | number | `3` | 最小行数（高度随内容自适应，rows 为下限） |
| `hideSend` | boolean | — | 隐藏内建发送钮 |
| `header` | DslNode | — | 顶部区槽（提供时渲染在 textarea 上方；附件卡片、上下文 chips 等输入上下文展示） |
| `toolbarStart` | DslNode | — | 工具栏左端槽 |
| `toolbarEnd` | DslNode | — | 工具栏右端槽（发送钮之前） |
| `footer` | DslNode | — | 底部区槽（提供时渲染，与工具栏以分隔线相隔） |
| 事件 `onChange` | — | — | 输入时触发，`${event}` 为 string 值 |
| 事件 `onSubmit` | — | — | 发送时触发（点击发送钮或 Enter；Shift+Enter 换行；IME 合成中 Enter 不发送；空白不发送），`${event}` 为当前文本；非受控发送后自动清空 |

```yaml
- type: ChatInput
  props:
    placeholder: 今天帮你做些什么？@ 引用对话文件，/ 调用技能与指令
    value: ${state.draft}
    toolbarStart:
      type: Button
      props: { variant: text, size: small }
      children: [{ type: Icon, props: { name: plus, size: sm } }]
      events:
        onClick: [{ action: message, params: { text: 打开附件面板 } }]
    toolbarEnd:
      type: Button
      props: { text: Hy4 preview, variant: text, size: small }
    footer:
      type: Flex
      props: { gap: small }
      children:
        - { type: Button, props: { text: 选择工作空间, variant: text, size: small } }
        - { type: Button, props: { text: 默认权限, variant: text, size: small } }
  events:
    onChange: [{ action: setState, params: { draft: ${event} } }]
    onSubmit:
      - { action: setState, params: { lastSent: ${event}, draft: '' } }
      - { action: message, params: { messageType: success, text: 已发送 } }
```

### Checkbox

勾选框，`label` 渲染在勾选框旁并与之关联。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 勾选框旁的标签文本 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | boolean | — | 受控值（独立渲染时生效）；Form 内作为字段初始值 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 勾选变化时触发，`${event}` 为 boolean |

```yaml
- type: Checkbox
  props: { name: agree, label: 同意协议 }
```

### RadioGroup

单选组。Base UI RadioGroup 的 value 原生支持 string / number / boolean，`onChange` 传出选中项原始 value。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `options` | `Array<{ label: string, value: string \| number \| boolean, disabled?: boolean }>` | `[]` | 选项列表 |
| `value` | string \| number \| boolean | — | 受控值（独立渲染时生效）；Form 内作为字段初始值 |
| `disabled` | boolean | — | 整组禁用 |
| 事件 `onChange` | — | — | 选中变化时触发，`${event}` 为选中项的 value（保留原始类型） |

```yaml
- type: RadioGroup
  props:
    name: size
    label: 规格
    options:
      - { label: 大, value: l }
      - { label: 小, value: s }
```

### Switch

开关。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 开关旁的标签文本 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | boolean | — | 受控值（独立渲染时生效）；Form 内作为字段初始值 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 开关变化时触发，`${event}` 为 boolean |

```yaml
- type: Switch
  props: { name: enabled, label: 启用通知 }
```

### Slider

滑块（单值形态）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | number | — | 受控值（独立渲染时生效）；Form 内作为字段初始值 |
| `min` | number | `0` | 最小值 |
| `max` | number | `100` | 最大值 |
| `step` | number | `1` | 步长 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 拖动变化时触发，`${event}` 为 number |

```yaml
- type: Slider
  props: { name: volume, label: 音量, min: 0, max: 100, step: 5 }
```

### Label

独立使用的表单标签。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `text` | string | — | 标签文本 |
| `htmlFor` | string | — | 关联控件 id（label htmlFor） |

```yaml
- type: Label
  props: { text: 客户名称 }
```

### Field

通用表单项容器：`label` / `description` / `error` 为框架级 props，`error` 声明式强制展示；children 为控件 DSL 子树。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `label` | string | — | 表单项标签 |
| `description` | string | — | 辅助说明文案 |
| `error` | string | — | 错误文案（声明式展示，如校验失败信息） |
| children | DslNode[] | — | 控件 DSL 子树（经 Renderer children 机制渲染） |

```yaml
- type: Field
  props: { label: 金额, description: 单位：元 }
  children:
    - type: Input
      props: { name: amount }
```

### Calendar

日期选择（react-day-picker）。DSL 值为 ISO 日期字符串（`yyyy-MM-dd`），`onChange` 同样传出 ISO 字符串（非 Date 对象）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `mode` | `single` | `single` | 选择模式（当前仅支持 single） |
| `value` | string | — | 受控值（ISO 日期字符串 `yyyy-MM-dd`）；Form 内作为字段初始值 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 选中日期时触发，`${event}` 为 ISO 日期字符串（`yyyy-MM-dd`），清除时传 `undefined` |

```yaml
- type: Calendar
  props: { name: birthday, label: 生日 }
  events:
    onChange:
      action: setState
      params:
        birthday: ${event}
```

### InputOTP

一次性验证码输入。独立渲染时内部维护输入态（`value` prop 作为初始值 / 受控镜像）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `length` | number | `6` | OTP 位数 |
| `value` | string | — | 受控值（独立渲染时生效）；Form 内作为字段初始值 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 输入时触发，`${event}` 为当前字符串 |
| 事件 `onComplete` | — | — | 输入满 `length` 位时触发，`${event}` 为完整 OTP 字符串 |

```yaml
- type: InputOTP
  props: { name: code, length: 6 }
  events:
    onComplete:
      action: setState
      params:
        otp: ${event}
```

### Combobox

可搜索下拉选择（Popover + Command 组合）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `options` | `Array<{ label: string, value: string \| number, disabled?: boolean }>` | `[]` | 选项列表（支持表达式解析后的数组） |
| `value` | string \| number | — | 受控值（独立渲染时生效）；Form 内作为字段初始值 |
| `placeholder` | string | — | 占位文案（兼作搜索框占位） |
| `searchable` | boolean | `true` | 是否可搜索过滤 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 选中变化时触发，`${event}` 为选中项的原始 value（string \| number \| undefined） |

```yaml
- type: Combobox
  props:
    name: city
    label: 城市
    placeholder: 选择城市
    options:
      - { label: 北京, value: bj }
      - { label: 上海, value: sh }
```

### 校验规则（FieldRule）

当前支持必填校验：

```yaml
rules:
  - required: true
    message: 请输入客户名称
```

校验失败阻止 Form 提交并在字段下方展示 `message`。
