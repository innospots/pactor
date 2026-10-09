---
title: 表单组件
description: 表单类 DSL 组件——Form / Input / NumberInput / Select / Textarea / Checkbox / RadioGroup / Switch / Slider / Label / Field / Calendar / DatePicker / InputOTP / Combobox / Rate / TimePicker / ColorPicker / Upload / TreeSelect / Cascader / Transfer / Mentions 的 props 契约、FieldRule 校验规则与 DSL 示例
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

Form 内声明 `name` 的 Input / NumberInput / Select 及本页其余录入组件（Textarea / Checkbox / RadioGroup / Switch / Slider / Calendar / DatePicker / InputOTP / Combobox / Rate / TimePicker / ColorPicker / Upload / TreeSelect / Cascader / Transfer / Mentions）自动成为表单项（label / rules 生效，值由 Form 托管）。

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
| `controlClassName` | string | 控件本体 class：独立渲染时与 `className` 同点合并；Form 内 `className` 挂 form-item 容器、本 prop 仍挂控件节点（Form 内精确设置控件样式，如宽度，时使用） |
| 事件 `onChange` | — | 传出 string 值 |

> **className 挂载点约定**：全部录入组件的 `className` / `style` 在 Form 内挂 `form-item` 容器（影响整项布局），独立渲染时挂控件本体；Input / NumberInput / Select 另提供 `controlClassName` 作为 Form 内直达控件本体的精确通道。

### NumberInput

数字输入框。右侧带增加/减少步进按钮（按 `step` 增减、以 `min`/`max` 钳制，到达边界或 `disabled` 时对应按钮禁用；原生步进箭头已隐藏，键盘 ArrowUp/ArrowDown 步进不受影响）。输入过程保留中间文本（如 `-` / `1.`），可解析为数字时传出经 min/max 钳制与 precision 规整后的 number，清空时传出 `undefined`。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | number | — | 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form `initialValues`） |
| `min` | number | — | 最小值（输入越界时钳制） |
| `max` | number | — | 最大值（输入越界时钳制） |
| `step` | number | `1` | 步长（原生步进按钮步距） |
| `precision` | number | — | 小数精度位数；声明后输入值按此精度四舍五入 |
| `placeholder` | string | — | 占位文案 |
| `disabled` | boolean | — | 禁用 |
| `controlClassName` | string | — | 控件本体 class（挂载规则同 Input） |
| 事件 `onChange` | — | — | 输入时触发，`${event}` 为 number（清空时为 `undefined`） |

```yaml
- type: NumberInput
  props: { name: qty, label: 数量, min: 0, max: 100, step: 1 }
```

### Select

下拉弹层默认左边缘对齐触发器（`align="start"`），最小宽度跟随触发器宽度（Base UI Positioner 暴露的 `--anchor-width`），选项更长时随内容撑宽。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `name` / `label` / `rules` / `placeholder` / `disabled` | 同 Input | — |
| `options` | `{ label, value, disabled? }[]`（value: string \| number \| boolean） | 选项列表；`disabled: true` 的选项不可选；远程任意字段名经 dataSource 的 `valueField` / `labelField` / `disabledField` 映射 |
| `value` | string \| number \| boolean | 同 Input 的初始值语义 |
| `allowClear` | boolean | 可清空 |
| `showSearch` | boolean | 选项搜索：`true` 始终展示搜索框，`false` 禁止；缺省选项数 > 10 时自动展示。按 label 包含匹配过滤（大小写不敏感），弹层关闭后搜索词自动清空 |
| `controlClassName` | string | 控件本体 class（挂载规则同 Input） |
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

AI 对话输入框的通用结构构件：外层圆角容器（focus-within 高亮）内依次承载自适应高度 textarea（输入区最小高度 60px）、工具栏行与可选底部区（footer，带上分隔线）。工具栏与底部区内容完全由槽位 DSL 自定义；内建圆形发送钮（空白或 disabled 时禁用，`hideSend` 可隐藏）；`hideSend` 且左右工具栏槽均未提供时工具栏行整体零渲染。定位为通用结构构件——transport / 附件 / 提及等对话领域能力请用 `@pactor-app/chat`。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `value` | string | — | 受控值（提供即受控：变更只经 onChange 传出） |
| `placeholder` | string | — | 占位文案 |
| `disabled` | boolean | — | 禁用 |
| `rows` | number | `3` | 最小行数（高度随内容自适应，rows 为下限） |
| `hideSend` | boolean | — | 隐藏内建发送钮；hideSend 且左右槽均未提供时工具栏行整体零渲染 |
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

单选组。Base UI RadioGroup 的 value 原生支持 string / number / boolean，`onChange` 传出选中项原始 value。点击选项 label 文本即选中对应项。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `options` | `Array<{ label: string, value: string \| number \| boolean, disabled?: boolean }>` | `[]` | 选项列表 |
| `direction` | `vertical` \| `horizontal` | `vertical` | 选项排列方向 |
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

通用表单项容器（上下结构：label 在上、控件容器在下）：`label` / `description` / `error` 为框架级 props，`error` 声明式强制展示；children 为控件 DSL 子树，包在控件容器（`[data-slot=field-control]`）内——有 label 时容器默认 `mt-2` 间距。四个节点均可独立加 `xxxClassName` / `xxxStyle` 样式（`label` / `control` / `description` / `error`，与内置样式合并）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `label` | string | — | 表单项标签 |
| `required` | boolean | — | 必填标记（label 前渲染红色 `*`；仅视觉标记，校验仍由 Form rules 承担） |
| `labelHint` | string | — | label 行右侧提示文字（右对齐小字弱化展示，如「创建后不可修改」） |
| `description` | string | — | 辅助说明文案 |
| `error` | string | — | 错误文案（声明式展示，如校验失败信息） |
| `labelClassName` / `labelStyle` | string / CSSProperties | — | label 节点样式（必填星号随 label 节点） |
| `labelHintClassName` / `labelHintStyle` | string / CSSProperties | — | label 行右侧提示节点样式 |
| `controlClassName` / `controlStyle` | string / CSSProperties | — | 控件容器样式（label 下方，即 children 包裹节点） |
| `descriptionClassName` / `descriptionStyle` | string / CSSProperties | — | 辅助说明节点样式 |
| `errorClassName` / `errorStyle` | string / CSSProperties | — | 错误节点样式 |
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

### DatePicker

日期/范围选择：input 风格触发器 + Popover 浮层内嵌日历（react-day-picker）。值契约按 `mode` 区分——single 为 ISO 日期字符串（`yyyy-MM-dd`），range 为 `{ start, end }` ISO 对象（仅起点与终点都选定后才触发 `onChange`，仅选定一端的中间态不触发）。range 模式浮层内为左右双面板，两个面板各有独立的月份导航箭头（左箭头只改左面板月份，右面板同理；两面板始终不显示同一月份——同月区间提交/回显时右面板自动顺延下一月，单侧导航越界时对侧顺延/回退以保持右面板始终晚于左面板）；选择语义为「任意面板两次点击」：第一次点击（任意面板）设定开始日并清空结束日，第二次点击（可与第一次同一面板）不早于开始日即提交 `{ start, end }`、早于开始日则视为新的开始日重新开始，已存在完整区间时再点击开始新一轮选择。默认文案（placeholder、内置预设名）使用 `pactor.datePicker.*` i18n key，可用 messages 覆盖；日历的月份/星期标题随应用 locale 切换（内置 zh-CN / en-US，未知 locale 回退英文）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `mode` | `single` \| `range` | `single` | 选择模式 |
| `value` | string（single）\| `{ start, end }`（range） | — | 受控值（ISO `yyyy-MM-dd`）；Form 内作为字段初始值 |
| `placeholder` | string | i18n 缺省（选择日期 / 选择日期范围） | 占位文案 |
| `presets` | 数组 \| `false` | range 缺省内置三项（今天/本周/本月），single 无 | 快捷预设栏；`false` 关闭 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | single 传 ISO 字符串（清除传 `undefined`）；range 传 `{ start, end }` ISO 对象 |

`presets` 数组项支持三种形态：

- `{ key: 'today' | 'thisWeek' | 'thisMonth', label? }`：内置计算与内置文案，`label` 可覆盖（「本周/本月」边界按当前 locale 计算，如 zh-CN 一周从周一开始）；
- `{ label, days: N }`：最近 N 天（含今天）；
- `{ label, range: { start, end } }`：显式 ISO 区间。

点击预设即完成选择并触发 `onChange`，浮层保持打开（可继续微调）。例外：「今天」是定位型预设——range 模式点击「今天」清空当前范围选择、面板定位到当前月并选中今天作为开始日（等待结束日），不触发 `onChange`；single 模式点击「今天」选中今天并触发 `onChange`。

```yaml
- type: DatePicker
  props:
    name: period
    label: 统计周期
    mode: range
    presets:
      - { key: today }
      - { key: thisWeek, label: 本周至今 }
      - { label: 最近30天, days: 30 }
      - { label: Q3, range: { start: '2026-07-01', end: '2026-09-30' } }
  events:
    onChange:
      action: setState
      params:
        period: ${event}
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

### Rate

星形评分：`count` 颗星的点击选择；`allowHalf` 时每星分左/右两个点击区，左半得 x.5、右半得整数。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | number | — | 受控值（独立渲染时生效）；Form 内作为字段初始值 |
| `count` | number | `5` | 星总数 |
| `allowHalf` | boolean | — | 允许半星 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 评分变化时触发，`${event}` 为 number |

```yaml
- type: Rate
  props: { name: score, label: 服务评分, allowHalf: true }
  events:
    onChange:
      action: setState
      params:
        score: ${event}
```

### TimePicker

时间选择：input 风格触发器 + Popover 浮层内的时/分（/秒）列滚动列表；点选后「确定」提交、「此刻」取当前时间，`format: HH:mm` 时无秒列、值无秒。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | string | — | 受控值（时间字符串，如 `"13:45:00"`）；Form 内作为字段初始值 |
| `format` | `HH:mm:ss` \| `HH:mm` | `HH:mm:ss` | 输出格式 |
| `placeholder` | string | — | 占位文案 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 提交时触发，`${event}` 为按 `format` 格式化的时间字符串 |

```yaml
- type: TimePicker
  props: { name: startTime, label: 开始时间, format: HH:mm }
```

### ColorPicker

颜色选择：触发器显示色块 + 当前 hex 值；Popover 浮层为 Sketch 风格取色面板——饱和度/明度二维面板（点选或拖拽）、色相滑杆、透明度滑杆、当前色预览、hex 文本输入（Enter 提交并校验格式，3/4 位 hex 自动展开）、R/G/B/A 通道输入（Enter 或失焦提交）与预设色板。拖拽过程实时提交。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | string | — | 受控值（hex 颜色，支持 3/4/6/8 位，如 `#1677ff`、`#1677ffcc`）；Form 内作为字段初始值 |
| `presets` | string[] | — | 预设色板（hex 数组） |
| `placeholder` | string | — | 占位文案 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 颜色变化时触发，`${event}` 为 hex 字符串（透明度小于 1 时为 8 位 hex，如 `#1677ffcc`） |

```yaml
- type: ColorPicker
  props:
    name: themeColor
    label: 主题色
    presets: ['#1677ff', '#52c41a', '#faad14', '#f5222d']
```

### Upload

文件选择。纯 UI 组件：只负责文件选择、按 `accept` / `maxSize` / `maxCount` 校验、列表展示与移除，**不发起任何网络上传请求**——不合规文件不进列表并提示忽略数量；实际上传动作在 `onChange` 事件中接动作层完成。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `value` | `Array<{ name, size, type }>` | — | 受控值（文件元数据数组）；Form 内作为字段初始值 |
| `multiple` | boolean | — | 允许多选（缺省单选，重复选择覆盖） |
| `accept` | string | — | 接受的文件类型（同原生 input accept：扩展名 / MIME / `image/*` 等，逗号分隔） |
| `maxSize` | number | — | 单文件大小上限（字节），超出不进列表 |
| `maxCount` | number | — | 文件总数上限，超出不进列表 |
| `drag` | boolean | — | 拖拽区形态（点击或拖入文件选择）；缺省为按钮形态 |
| `tip` | string | — | 选择区下方的辅助说明文案 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 文件列表变化时触发，`${event}` 为可序列化元数据数组 `Array<{ name, size, type }>` |

```yaml
- type: Upload
  props:
    name: attachments
    label: 附件
    multiple: true
    accept: '.png,.jpg,.pdf'
    maxCount: 5
    tip: 支持 png / jpg / pdf，最多 5 个
  events:
    onChange:
      action: setState
      params:
        attachments: ${event}
```

### TreeSelect

树形选择：触发器 + Popover 浮层内联树（可展开/收起），单选；`searchable` 时浮层顶部提供过滤输入（按 label 过滤，命中节点的祖先保留展开）。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `options` | `Array<{ label, value, children? }>`（value: string \| number） | `[]` | 嵌套选项树 |
| `value` | string \| number | — | 受控值（选中节点 value）；Form 内作为字段初始值 |
| `placeholder` | string | — | 占位文案 |
| `searchable` | boolean | — | 浮层顶部显示过滤输入 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 选中变化时触发，`${event}` 为选中节点 value |

```yaml
- type: TreeSelect
  props:
    name: dept
    label: 部门
    searchable: true
    options:
      - label: 研发中心
        value: rd
        children:
          - { label: 前端组, value: rd-fe }
          - { label: 后端组, value: rd-be }
      - { label: 设计中心, value: design }
```

### Cascader

级联选择：触发器 + Popover 浮层多列逐级下钻（点含 children 的节点开下一列，点叶子完成选择）；触发器文本用 ` / ` 连接路径各级 label。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `options` | `Array<{ label, value, children? }>`（value: string \| number） | `[]` | 嵌套选项 |
| `value` | `Array<string \| number>` | — | 受控值（路径 value 数组）；Form 内作为字段初始值 |
| `placeholder` | string | — | 占位文案 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 选中叶子时触发，`${event}` 为路径 value 数组（如 `['zhejiang', 'hangzhou']`） |

```yaml
- type: Cascader
  props:
    name: region
    label: 地区
    options:
      - label: 浙江
        value: zhejiang
        children:
          - { label: 杭州, value: hangzhou }
          - { label: 宁波, value: ningbo }
      - label: 江苏
        value: jiangsu
        children:
          - { label: 南京, value: nanjing }
```

### Transfer

穿梭框：左右两列 checkbox 列表 + 中间左右移动按钮；列头 checkbox 全选该列可用项，`disabled: true` 的选项不可勾选/移动。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `options` | `Array<{ label, value, disabled? }>`（value: string \| number） | `[]` | 全部选项（左列 = 未进目标侧的项，右列 = 目标侧的项） |
| `value` | `Array<string \| number>` | — | 受控值（目标侧 value 数组）；Form 内作为字段初始值 |
| `titles` | `[string, string]` | `['列表 1', '列表 2']` | 左右两列标题 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 移动变化时触发，`${event}` 为目标侧 value 数组 |

```yaml
- type: Transfer
  props:
    name: members
    label: 项目成员
    titles: [全部成员, 已选成员]
    options:
      - { label: 张三, value: u1 }
      - { label: 李四, value: u2 }
      - { label: 王五, value: u3, disabled: true }
```

### Mentions

提及输入：textarea 输入 `trigger` 字符后弹候选浮层（按触发字符后的查询串过滤 label / value），点击或 Enter 选中后在光标处插入 `trigger + value + 空格`；↑/↓ 移动高亮，Esc 关闭。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `name` | string | — | 字段名；在 Form 内声明 name 即自动成为表单项 |
| `label` | string | — | 表单项标签 |
| `rules` | FieldRule[] | — | 校验规则（见[校验规则（FieldRule）](#校验规则fieldrule)） |
| `options` | `Array<{ label: string, value: string }>` | `[]` | 候选列表 |
| `trigger` | string | `'@'` | 触发字符 |
| `rows` | number | — | 文本域行数 |
| `placeholder` | string | — | 占位文案 |
| `value` | string | — | 受控值（完整字符串）；Form 内作为字段初始值 |
| `disabled` | boolean | — | 禁用 |
| 事件 `onChange` | — | — | 输入变化时触发，`${event}` 为完整字符串 |

```yaml
- type: Mentions
  props:
    name: comment
    label: 评论
    placeholder: 输入 @ 提及成员
    options:
      - { label: 张三, value: zhangsan }
      - { label: 李四, value: lisi }
```

### 校验规则（FieldRule）

当前支持必填校验：

```yaml
rules:
  - required: true
    message: 请输入客户名称
```

校验失败阻止 Form 提交并在字段下方展示 `message`。
