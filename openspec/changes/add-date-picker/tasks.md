## 1. i18n 内置文案

- [x] 1.1 在 `packages/runtime/src/context/i18n-context.ts` 的 zh-CN 与 en-US 默认表新增 `pactor.datePicker.placeholder` / `placeholderRange` / `today` / `thisWeek` / `thisMonth`

## 2. DatePicker 组件实现

- [x] 2.1 新建 `packages/ui/src/components/components/DatePicker/index.tsx`:props 类型(single/range union)、触发器(input 风格 button + lucide 日历图标)、受控 Popover + Calendar(`mode="single"/"range"`)、placeholder 与选中值回显
- [x] 2.2 实现 presets:三种形态解析(key 内置项 / days 最近 N 天 / 显式 range)、缺省规则(range 缺省内置三项、single 无、false 关闭)、点击预设即完成选择并触发 onChange 且不关浮层;本周/本月经 date-fns 按 locale 计算
- [x] 2.3 接入日历 locale:`useI18n().locale` → date-fns locale 映射(zh-CN/en-US,未知回退 en-US)传给 DayPicker
- [x] 2.4 Form 集成:`name`/`label`/`rules`、form-item 包装、registerField/unregisterField、初始值回填、Form 内受控;通用 props className/style
- [x] 2.5 注册与导出:`register.ts` 的 `builtinComponents` 加 `DatePicker`;`src/components/index.ts` 导出组件与 props 类型

## 3. 测试

- [x] 3.1 新建 `packages/ui/tests/components/date-picker.test.tsx`:展开浮层、single 选择事件值、range 两端齐备才触发、range 初始值回显、缺省/自定义/关闭预设、预设点击载荷、Form 提交收集与必填校验、en-US locale 文案与日历标题、messages 覆盖
- [x] 3.2 更新 `tests/components/register.test.ts` 的 `EXTENDED_TYPES` 清单加入 `DatePicker`
- [x] 3.3 更新 `tests/components/common-props.test.tsx` 加入 DatePicker 通用 props 用例

## 4. 文档与清单

- [x] 4.1 `docs/src/content/docs/components/form.md` 新增 DatePicker 小节(props 表 + presets 形态 + YAML 示例),更新页首枚举
- [x] 4.2 `docs/src/content/docs/components/index.md` 索引与计数加入 DatePicker
- [x] 4.3 `docs/src/content/docs/guides/i18n.md` 内置 key 表加入 `pactor.datePicker.*`
- [x] 4.4 `packages/skill/SKILL.md` 组件清单 Form 行加入 `DatePicker`;`packages/ui/llms.txt` 同步

## 5. 验证与归档准备

- [x] 5.1 `pnpm --filter @pactor-app/ui test`、`pnpm --filter @pactor-app/runtime test`、`pnpm --filter @pactor-app/ui build`、根 `pnpm typecheck` 全绿
- [x] 5.2 `openspec validate add-date-picker --strict` 通过

## 6. range 双面板改造(设计修订 D2b)

- [x] 6.1 改造 `DatePicker/index.tsx` range 模式:并排两个 `mode="single"` 日历(左 start / 右 end),各自受控 month;`disabled` matcher 约束(左禁 after end、右禁 before start);任一端点击且另一端已选即提交;初始月份 start 月 / end 月(缺省今天 / 下月);移除单日历 range + `min={1}` 方案
- [x] 6.2 更新 `tests/components/date-picker.test.tsx` 的 range 用例(左右面板分别点击、月份独立导航、禁用约束),保持其余用例绿色
- [x] 6.3 更新 `docs/src/content/docs/components/form.md` 的 DatePicker 小节(range 双面板说明)
- [x] 6.4 复跑 `pnpm --filter @pactor-app/ui test` 与 `pnpm -r --filter "./packages/*" build`,`openspec validate add-date-picker --strict` 通过
- [x] 6.5 区间中间日期选中过渡样式:两个面板经 DayPicker `modifiers`/`modifiersClassNames`(严格 between start/end,含未提交中间态)渲染过渡样式;`styles.css` 新增 `--calendar-range-*` 令牌(命名与 `--calendar-selected-*` 一族一致),测试断言中间日带修饰 class
- [x] 6.6 复跑 ui 测试/构建与 `openspec validate add-date-picker --strict`

## 7. range 交互修订(任意面板两次点击 + 今天定位 + hover 修复)

- [x] 7.1 range 选择语义改为「任意面板两次点击」(首击设 start 清 end、第二击 ≥start 提交 / <start 重新开始、完整区间后再点击开始新一轮);移除左右面板固定分工与 `disabled` matcher 约束
- [x] 7.2 「今天」预设改定位型:range 模式清空范围、左面板定位当前月、选中今天为开始日、不触发 onChange;single 模式选中今天并触发 onChange
- [x] 7.3 修复 vendored `ui/calendar.tsx` hover bug:selected(及 today)日 hover 时文字色被 hover-foreground 覆盖导致与背景同色;selected 类补 `[&>button]:hover:text-(--calendar-selected-foreground)`
- [x] 7.4 更新 range/preset 相关测试用例(同面板两次点击、第二击早于开始日、完整区间后重选、今天定位不提交、selected hover 类存在),复跑 ui 测试/构建与 openspec validate
- [x] 7.5 同步 `docs/src/content/docs/components/form.md` DatePicker 小节(同面板可选范围、今天为定位型预设)
- [x] 7.6 左右面板不显示同一月份:月份同步/导航时强制右面板月份 ≥ 左面板月份+1(同月值回显或单侧导航越界时对侧顺延/回退),补测试并复跑验证
- [x] 7.7 今天的日期显示边框:vendored `ui/calendar.tsx` 的 today 类补边框(`--calendar-today-border` 令牌,styles.css/:root 按既有别名约定给值),theming.md 令牌表同步,补测试并复跑验证
- [x] 7.8 修复 range 模式点击「今天」后全部日期呈选中样式的 bug:同日区间(start==end)的 `inRange: { after, before }` 被 DayPicker 当开放区间匹配几乎所有日期;inRange 仅在 end 严格晚于 start(按日历日)时构造,补回归测试
