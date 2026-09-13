## MODIFIED Requirements

### Requirement: 内置组件默认文案国际化

内置组件（Table、Form、Select、DatePicker 等）的默认提示文案 SHALL 使用 i18n key 并允许业务覆盖。内置 key 的命名空间 MUST 以 `pactor.` 开头并保持稳定；未覆盖时回退到内置默认中文文案。DatePicker 的默认文案 SHALL 使用 `pactor.datePicker.*` 一组 key（placeholder / placeholderRange / today / thisWeek / thisMonth）；日期选择类组件的日历本体（月份/星期标题）SHALL 按当前 locale 切换（经 date-fns locale 映射，未知 locale 回退 en-US）。

#### Scenario: 覆盖 Table 空状态文案

- **WHEN** messages 提供 `pactor.table.empty` 为 `'No data'`
- **THEN** Table 组件在无数据时显示 `'No data'`

#### Scenario: 覆盖 Form 必填提示

- **WHEN** messages 提供 `pactor.form.required` 为 `'This field is required'`
- **THEN** 表单校验失败时显示该文案

#### Scenario: 覆盖 DatePicker 预设文案

- **WHEN** messages 提供 `pactor.datePicker.today` 为 `'Today!'` 且渲染 DatePicker 的缺省预设
- **THEN** 预设栏第一项显示 `'Today!'`

#### Scenario: 日历按 locale 切换

- **WHEN** 应用 locale 为 `en-US` 且打开 DatePicker 浮层
- **THEN** 日历的月份与星期标题显示为英文
