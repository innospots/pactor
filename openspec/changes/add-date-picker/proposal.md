## Why

DSL 表单目前只有裸 `Calendar`(内联日历,当前仅支持单日期),缺少业务中最常见的"输入框 + 弹层选日期"形态,且完全没有范围选择与快捷预设能力。列表筛选、报表查询等高频场景需要 DatePicker(单日期/范围 + 今天/本周/本月等快捷项),且框架已有 i18n 体系,新组件的文案与日历本身都应接入国际化。

## What Changes

- 新增 DSL 组件 `DatePicker`(@pactor-app/ui):input 风格触发器,点击展开 Popover,内嵌 Calendar(react-day-picker,复用现有 vendored 原语)
- `mode: 'single' | 'range'` 控制单日期/范围选择;value/onChange 契约:single 为 ISO `yyyy-MM-dd` 字符串(或 `undefined`),range 为 `{ start, end }` ISO 对
- `presets` 快捷选择:range 模式缺省内置「今天/本周/本月」;支持 `{ key, label? }`(内置项,label 可覆盖)、`{ label, days: N }`(最近 N 天)、`{ label, range: { start, end } }`(显式区间);`presets: false` 关闭预设栏
- 新增内置 i18n key `pactor.datePicker.*`(placeholder / today / thisWeek / thisMonth,zh-CN + en-US 双表);日历的月份/星期标题经 `useI18n().locale` 映射 date-fns locale 接入国际化(框架内首个日历 locale 接入)
- Form 集成(与 Select/Calendar 同构):`name`/`label`/`rules`,Form 内受控、提交时 range 值以 `{ start, end }` 进入 values;支持通用 props(className/style)
- 文档与清单同步:组件文档(form.md/index.md)、i18n 指南 key 表、agent skill 组件清单

## Capabilities

### New Capabilities
- `date-picker`: DatePicker DSL 组件的完整契约——触发器与 Popover 结构、single/range 选择语义与值契约、presets 快捷选择、Form 集成、通用 props、国际化行为

### Modified Capabilities
- `shadcn-extended-components`: 扩展组件注册清单新增 `DatePicker`;表单字段值契约补充 range 对象值(`{ start, end }`)先例
- `i18n`: 内置组件文案表新增 `pactor.datePicker.*` 一组 key;日历组件的月份/星期标题首次纳入 locale 切换范围

## Impact

- `packages/ui`:新增 `src/components/components/DatePicker/index.tsx`;修改 `src/components/register.ts`、`src/components/index.ts`;测试新增 `tests/components/date-picker.test.tsx` 并更新 `register.test.ts`、`common-props.test.tsx`
- `packages/runtime`:`src/context/i18n-context.ts` 内置文案表新增 `pactor.datePicker.*`(zh-CN / en-US)
- 零新增 npm 依赖(react-day-picker、date-fns、@base-ui/react、lucide-react 均已在 packages/ui 依赖中)
- 文档:`docs/src/content/docs/components/form.md`、`docs/src/content/docs/components/index.md`、`docs/src/content/docs/guides/i18n.md`
- Agent skill:`packages/skill/SKILL.md` 组件清单
