## ADDED Requirements

### Requirement: DatePicker 组件注册与结构

`builtinComponents` 注册表 SHALL 注册 `DatePicker` 组件。组件 MUST 渲染 input 风格的 button 触发器(显示选中值或 placeholder,右端带日历图标),点击触发器 SHALL 展开 Popover 浮层,浮层内 MUST 内嵌日历(react-day-picker;`mode: 'range'` 时为左开始/右结束两个独立日历面板,见「single 与 range 选择语义」)。浮层经 Portal 挂载,颜色 MUST 只消费 shadcn 语义令牌,MUST NOT 出现字面色值。组件 SHALL 支持通用 props `className` 与 `style`(独立渲染时挂触发器根节点,Form 内挂 form-item 容器)。

#### Scenario: 点击触发器展开日历浮层

- **WHEN** DSL 为 `{ type: 'DatePicker' }` 且用户点击触发器
- **THEN** 展开含日历的 Popover 浮层

#### Scenario: 触发器显示选中值与 placeholder

- **WHEN** 未选择日期
- **THEN** 触发器显示 placeholder 文案(i18n key `pactor.datePicker.placeholder`,可被 prop 覆盖);选择后显示 ISO 日期文本

#### Scenario: 通用 props 作用于根节点

- **WHEN** DSL 为 `{ type: 'DatePicker', props: { className: 'x', style: { margin: 8 } } }`
- **THEN** 渲染结果根节点 class 包含 `x` 且内联样式含 `margin: 8`

### Requirement: single 与 range 选择语义

`mode` prop 为 `'single'`(缺省)或 `'range'`。single 模式:浮层内为单日历,onChange SHALL 传 ISO `yyyy-MM-dd` 字符串(清除时传 `undefined`)。range 模式:浮层内 MUST 并排渲染两个日历面板,每个面板顶部 SHALL 有独立的月份导航箭头(左面板箭头只改左面板月份,右面板同理)。选择语义为「任意面板两次点击」:第一次点击(任意面板)SHALL 设定开始日并清空结束日(不触发 onChange);第二次点击(任意面板,可与第一次同一面板)日期不早于开始日时 SHALL 提交 `{ start, end }`(ISO `yyyy-MM-dd`),早于开始日时 SHALL 视为新的开始日重新开始;已存在完整区间时再点击 SHALL 开始新一轮选择(设为开始日并清空结束日)。`value` prop 按 mode 接受对应形态(single 为字符串,range 为 `{ start, end }` 对象)并回显到触发器与两个面板的选中态。

#### Scenario: 单日期选择与事件值

- **WHEN** DSL 为 `{ type: 'DatePicker', events: { onChange: { action: 'setState', params: { day: '${event}' } } } }` 且用户在浮层日历中点击某日
- **THEN** `${event}` 为该日的 ISO `yyyy-MM-dd` 字符串

#### Scenario: 同一面板内两次点击完成范围选择

- **WHEN** `mode: 'range'` 且用户在左面板依次点击 10 号与 15 号
- **THEN** 点击 10 号时不触发 onChange;点击 15 号后 onChange 的 `${event}` 为 `{ start: '<10号ISO>', end: '<15号ISO>' }`

#### Scenario: 跨面板选择范围

- **WHEN** `mode: 'range'` 且用户在左面板点击开始日、在右面板点击不早于开始日的日期
- **THEN** onChange 的 `${event}` 为 `{ start: '<开始ISO>', end: '<结束ISO>' }`

#### Scenario: 第二击早于开始日时重新开始

- **WHEN** 已有点击开始日 `2026-09-10`(未提交),用户在任意面板点击 `2026-09-05`
- **THEN** 不触发 onChange,开始日改为 `2026-09-05` 并等待新的结束日

#### Scenario: 完整区间后再点击开始新一轮

- **WHEN** 已提交区间 `{ start, end }`,用户在任意面板点击某日
- **THEN** 该日成为新的开始日、结束日清空,不触发 onChange

#### Scenario: 面板月份独立导航

- **WHEN** `mode: 'range'` 浮层打开且用户点击右面板的下一月箭头
- **THEN** 仅右面板月份前移,左面板月份不变

#### Scenario: 左右面板不显示同一月份

- **WHEN** `mode: 'range'` 且提交的区间起止在同一月(或回显的 `value` 同月)
- **THEN** 左面板显示开始日所在月,右面板显示其下一月;导航时若一侧月份将与另一侧相同,另一侧 SHALL 顺延/回退以保持右面板始终晚于左面板一个月以上

#### Scenario: 今天显示边框标识

- **WHEN** 日历面板渲染的月份包含今天
- **THEN** 今天的日期按钮带边框标识(组件令牌 `--calendar-today-border`),与被选中/范围样式可叠加区分

#### Scenario: 区间中间日期呈选中过渡样式

- **WHEN** `mode: 'range'` 且开始日与结束日均已选定(含未提交的中间态)
- **THEN** 两个面板中严格位于两端之间的日期渲染选中过渡样式(组件令牌 `--calendar-range-*`,区别于端点的 `--calendar-selected-*`)

#### Scenario: range 初始值回显

- **WHEN** `mode: 'range'` 且 `value` 为 `{ start: '2026-09-25', end: '2026-10-05' }`
- **THEN** 触发器显示 `2026-09-25 ~ 2026-10-05`,打开浮层后左面板(9 月)选中 09-25、右面板(10 月)选中 10-05;若 value 起止同月,右面板顺延显示下一月,两个端点的选中态都在左面板回显

### Requirement: presets 快捷选择

`presets` prop 控制浮层内的快捷选择栏。数组项 MUST 支持三种形态:`{ key: 'today' | 'thisWeek' | 'thisMonth', label? }`(内置计算与内置 i18n 文案,label 可覆盖)、`{ label, days: N }`(最近 N 天,含今天)、`{ label, range: { start, end } }`(显式 ISO 区间)。`presets` 未提供且 `mode: 'range'` 时 SHALL 缺省渲染内置三项(今天/本周/本月);`mode: 'single'` 时缺省不渲染预设栏;`presets: false` MUST 关闭预设栏。除「今天」外,点击预设 SHALL 直接完成选择并触发 onChange(与手工选完的载荷形态一致),且 MUST NOT 自动关闭浮层。「本周/本月」的边界 MUST 经 date-fns 按当前 locale 计算(`startOfWeek` 的起始日由 locale 决定)。

「今天」是定位型预设:range 模式点击「今天」SHALL 清空当前范围选择、将面板月份定位到当前月并选中今天(作为新的开始日,等待结束日),MUST NOT 触发 onChange;single 模式点击「今天」SHALL 选中今天并触发 onChange(单日值)。

#### Scenario: range 缺省预设

- **WHEN** `mode: 'range'` 且未声明 `presets`
- **THEN** 浮层左侧渲染「今天/本周/本月」三个快捷项(按当前 locale 显示文案)

#### Scenario: 最近 N 天预设

- **WHEN** presets 含 `{ label: '最近7天', days: 7 }` 且用户点击该项
- **THEN** onChange 的 `${event}` 为 `{ start: '<6天前ISO>', end: '<今天ISO>' }`

#### Scenario: 显式区间预设与 label 覆盖

- **WHEN** presets 含 `{ key: 'thisMonth', label: '本月至今' }` 与 `{ label: 'Q3', range: { start: '2026-07-01', end: '2026-09-30' } }`
- **THEN** 预设栏显示「本月至今」「Q3」;点击「Q3」后 `${event}` 为 `{ start: '2026-07-01', end: '2026-09-30' }`

#### Scenario: 关闭预设栏

- **WHEN** `mode: 'range'` 且 `presets: false`
- **THEN** 浮层内不渲染预设栏

#### Scenario: 「今天」清空范围并定位

- **WHEN** `mode: 'range'` 已存在完整区间,用户点击预设「今天」
- **THEN** 不触发 onChange;范围选择清空,左面板定位到当前月,今天呈开始日选中态(等待结束日),其余日期无选中或过渡样式

### Requirement: Form 集成

`DatePicker` MUST 与 Input/Select 一致地集成 Form:声明 `name` 且在 Form 内时,按 form-item 结构渲染(label 关联、校验错误位),注册 `rules` 校验,初始值经字段级 `value` 回填(仅首次注册写入,优先于 Form 的 `initialValues`);Form 内组件值完全受控于 Form context。提交时 single 值以字符串、range 值以 `{ start, end }` 对象进入 values。

#### Scenario: Form 提交收集 range 值

- **WHEN** Form 内 DatePicker 配置 `{ name: 'period', mode: 'range' }` 且用户选定范围后提交
- **THEN** onSubmit 的 `values.period` 为 `{ start: '<起点ISO>', end: '<终点ISO>' }`

#### Scenario: 必填校验

- **WHEN** 配置 `{ name: 'day', rules: [{ required: true, message: '请选择日期' }] }` 且未选择直接提交
- **THEN** 校验失败并显示「请选择日期」

### Requirement: 国际化

组件全部默认文案(placeholder、内置预设名)SHALL 使用 `pactor.datePicker.*` i18n key 并允许业务经 messages 覆盖。日历本体的月份/星期标题 SHALL 经 `useI18n().locale` 映射为 date-fns locale 传入 DayPicker;映射表内置 `zh-CN`/`en-US`,未知 locale MUST 回退 `en-US`。

#### Scenario: 英文 locale 下的文案与日历

- **WHEN** 应用 locale 为 `en-US` 且渲染 `mode: 'range'` 的 DatePicker
- **THEN** placeholder 显示英文文案,预设栏显示 `Today / This Week / This Month`,日历月份与星期标题为英文

#### Scenario: messages 覆盖预设文案

- **WHEN** messages 提供 `pactor.datePicker.today` 为 `'Today!'` 且渲染缺省预设
- **THEN** 预设栏第一项显示 `'Today!'`
