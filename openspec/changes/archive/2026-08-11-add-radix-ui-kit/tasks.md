# Tasks: add-radix-ui-kit

## 1. 包骨架

- [x] 1.1 创建 `packages/components-radix`：dependencies `pactor-core`/`pactor-runtime` workspace:* + `pactor-components`（workspace:*，仅类型）+ `@radix-ui/react-select`/`@radix-ui/react-tabs`/`@radix-ui/react-form`，peerDeps `react >=18`，devDeps react 测试栈；tsconfig（jsx）、tsup、LICENSE、README、tests/setup.ts；`pnpm install` 成功

## 2. 展示与布局组件（spec: radix-components）

- [x] 2.1 样式表 styles.css（`.pcr-*` 语义 class）与 exports `./styles.css`
- [x] 2.2 Button / Input（独立受控形态）/ Page / Card / Alert / Statistic / Grid / Flex

## 3. 表单组件（Radix Form）

- [x] 3.1 Form：Context 下发、submit Button（`submit: true`）触发、values 收集、onSubmit + state.form 写入
- [x] 3.2 Input/Select 的 Form 内自动包装（label/rules.required + message 展示、校验失败阻止提交）
- [x] 3.3 Select：@radix-ui/react-select，options/onChange value

## 4. Tabs 与 Table

- [x] 4.1 Tabs：@radix-ui/react-tabs，items pane 经 renderChildren
- [x] 4.2 Table：原生 table + columns/dataSource/rowKey/loading/简化分页/空态 + cell 行模板（row/rowIndex）

## 5. 注册入口与契约一致性

- [x] 5.1 `createRadixComponentRegistry()` / `registerRadixComponents(registry)`
- [x] 5.2 契约一致性测试：类型名集合相等 + 关键行为场景（Button 事件、Alert 变体、Grid 两列、Tabs pane、Form 提交与 required、Table cell row、表达式 props）

## 6. pactor-app 切换选项（spec: ui-kit-selection）

- [x] 6.1 options 增加 `componentRegistry?: () => Registry<unknown>`，缺省 antd；业务 components 叠加
- [x] 6.2 测试：缺省 antd、切换 Radix、业务组件叠加

## 7. 验收与文档

- [x] 7.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 7.2 文档站新增 `packages/components-radix.md`（含切换 recipe：安装/样式引入/componentRegistry 配置）与「UI 库切换」说明，侧边栏与快速开始模块表同步，`pnpm docs:build` 通过
