## Context

packages/ui 已有全部所需底层:vendored shadcn `Calendar`(`src/ui/calendar.tsx`,react-day-picker v10,原生支持 `mode="range"`,但 DSL 适配层只暴露了 single)、vendored `Popover`(`src/ui/popover.tsx`,@base-ui/react)、date-fns、lucide-react。框架 i18n 体系就绪:`useI18n()` 返回 `{ locale, t }`,内置文案表在 `packages/runtime/src/context/i18n-context.ts`(`pactor.*` 命名空间,zh-CN/en-US 双表);但日历的月份/星期标题(DayPicker 的 `locale` prop)目前无任何组件接入。Form 集成、通用 props、注册链路在 Select/Calendar/Combobox 上有完全同构的模板可照抄。

## Goals / Non-Goals

**Goals:**

- 一个 DSL 组件 `DatePicker`,覆盖「input 触发器 + Popover + Calendar」形态,`mode: single | range`
- range 模式带快捷预设(内置今天/本周/本月 + 自定义最近 N 天/显式区间),预设栏在浮层左侧
- 值契约:single → ISO `yyyy-MM-dd` 字符串;range → `{ start, end }` ISO 对象(仅当两端都选定才触发 onChange)
- 全部默认文案走 `pactor.datePicker.*` i18n key;DayPicker 日历本体按 `useI18n().locale` 映射 date-fns locale
- Form 集成(`name`/`label`/`rules`)、通用 props(className/style)与既有表单组件完全一致

**Non-Goals:**

- 时间选择(时分秒)与 datetime 值
- 多日历面板并排(range 双月视图)——react-day-picker 的 `numberOfMonths` 不暴露
- 修改既有 `Calendar` DSL 组件的契约(它保持 single;range 能力只经 DatePicker 暴露)
- 触发器内手动键盘输入日期(点击选择-only)

## Decisions

### D1: 单组件 + `mode` prop,而非拆 `DatePicker`/`DateRangePicker` 两个 type

与 `Calendar` 的 `mode` prop 惯例一致;两者共享 90% 实现(触发器、Popover、presets、Form 集成),拆开会复制整套适配层。代价是 props 类型需要按 mode 区分值形态——经 TS union(`DatePickerSingleProps | DatePickerRangeProps`)在适配器内收窄。

### D2: range 值用 `{ start, end }` 对象而非 `[start, end]` 元组

DSL 表达式消费值时 `${event.start}` 比 `${event[0]}` 可读,且与 Form values 的对象语义一致(框架首个对象值先例,需写进 shadcn-extended-components spec 的值契约)。两端未齐时不触发 onChange(未提交的一端只更新对应面板的选中显示)。

### D2b: range 双面板 + 「任意面板两次点击」语义

range 模式并排渲染两个 `mode="single"` 日历,各自受控 `month`/`onMonthChange`(导航箭头只改自己一侧)。选择语义不用「左只能 start、右只能 end」的固定分工(它导致无法在单一面板内选范围),而是经典的双击区间:第一次点击(任意面板)设开始日并清空结束日;第二次点击 ≥ 开始日即提交 `{ start, end }`,早于开始日则重新开始;已有完整区间时再点击开始新一轮。不用 `disabled` matcher 做面板约束(第二次点击重定向已覆盖非法区间)。「今天」预设是定位型:清空范围、面板定位到当前月、选中今天为开始日,不提交——其余预设仍直接提交完整区间。

### D3: presets 三种声明形态,缺省值按 mode 区分

- `{ key: 'today' | 'thisWeek' | 'thisMonth', label? }`:内置计算 + 内置 i18n 文案,label 可覆盖
- `{ label, days: N }`:最近 N 天(含今天)
- `{ label, range: { start, end } }`:显式 ISO 区间

`presets === undefined` 时:range 模式缺省为内置三项(today/thisWeek/thisMonth),single 模式无预设栏;`presets: false` 显式关闭。预设点击=直接选定并触发 onChange(跳过中间态),且不自动关浮层(用户可再微调)——范围预设点击后即完整选择,行为确定。

「本周」的起始日由 date-fns locale 决定(`startOfWeek(date, { locale })`,zh-CN 周一/en-US 周日),与日历显示的星期序一致。

### D4: 日历 locale 首次接入,映射表内置 zh-CN/en-US,未知 locale 回退 en-US

`useI18n().locale` → date-fns locale 对象的映射函数放在 DatePicker 适配器内(不改动 vendored `ui/calendar.tsx` 原语,locale 经 props 透传给 DayPicker)。框架 i18n 当前只有 zh-CN/en-US 双表,回退 en-US 与 i18n 文案回退语义平行。后续其他 locale 由业务 messages + 映射表扩展解决,本期不做开放注册。

### D5: 触发器为 button 元素,input 风格样式

参照 `ui/combobox.tsx` 的触发器(`border bg-transparent` + 右端 lucide 图标);选中值显示 ISO 文本(single: `yyyy-MM-dd`;range: `start ~ end`),未选中显示 placeholder(i18n key `pactor.datePicker.placeholder` / `.placeholderRange`,可被 prop 覆盖)。颜色只用语义 token 类,MUST NOT 出现字面色值。

### D6: i18n key 只加默认表,不改 Form/Select 既有 key

新增 `pactor.datePicker.placeholder`、`pactor.datePicker.placeholderRange`、`pactor.datePicker.today`、`pactor.datePicker.thisWeek`、`pactor.datePicker.thisMonth`(zh-CN:选择日期/选择日期范围/今天/本周/本月;en-US 对应英文),写进 `i18n-context.ts` 两组默认表——业务的 messages 覆盖机制自动生效,无需组件侧特殊处理。

## Risks / Trade-offs

- [对象值是 DSL 字段值的首个先例,后续组件可能效仿出不一致形态] → 在 spec 中固化为「范围类值一律 `{ start, end }`」约定
- [DayPicker 传 locale 后 zh-CN 下星期标题变中文,可能改变既有 Calendar 组件的视觉快照] → locale 只在 DatePicker 适配器传入,不动 vendored 原语与 Calendar 适配器,既有 Calendar 行为不变
- [预设点击不关浮层,用户可能疑惑是否已生效] → 触发器文本即时更新 + 日历选中态高亮即反馈;开关行为在文档注明
- [jsdom 测试中「本周/本月」依赖当前日期,断言需动态计算] → 测试用 date-fns 同样函数计算期望值,不断言硬编码日期
