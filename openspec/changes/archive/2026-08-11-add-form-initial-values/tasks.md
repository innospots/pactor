# Tasks: add-form-initial-values

## 1. pactor-ui-radix（components 层）

- [x] 1.1 Form：`initialValues` prop 初始化上下文 values；字段挂载合并字段级 `value`（字段级优先，已有值不覆盖）
- [x] 1.2 Input/Select Form 分支以合并后初始值渲染
- [x] 1.3 测试：字段级初始值、initialValues 回填、字段级优先、初始值参与提交与 required 校验

## 2. pactor-ui-antd（components 层）

- [x] 2.1 Form：`initialValues` 透传 antd Form；字段 Form.Item `initialValue: props.value`
- [x] 2.2 测试：与 radix kit 相同的四个场景

## 3. 示例更新（examples/admin）

- [x] 3.1 customer-list：overlay params 补 phone/level；抽屉表单字段加 `value: ${params.name}` 等；更新占位文案
- [x] 3.2 `pnpm --filter example-admin build` 通过

## 4. 验收

- [x] 4.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 4.2 playwright 验证：点击编辑 → 抽屉回填云栖科技数据（截图）
