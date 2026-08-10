# Tasks: add-components-module

## 1. 包骨架

- [x] 1.1 创建 `packages/components`：package.json（`pactor-components`，dependencies `pactor-core`/`pactor-runtime` workspace:*，peerDependencies `react >=18`/`antd >=5`，devDependencies 加 antd 与 react 测试栈）、tsconfig（jsx）、tsup 配置、LICENSE、README
- [x] 1.2 vitest jsdom 环境 + `tests/setup.ts`（matchMedia 等 antd 所需 polyfill）
- [x] 1.3 `pnpm install` 成功

## 2. 展示与布局组件（spec: builtin-components）

- [x] 2.1 Button：`text`/`variant`/`danger`/`size`/`loading`/`disabled`，onClick 事件
- [x] 2.2 Page：`title` + children 内容区
- [x] 2.3 Card：`title`/`bordered` + children
- [x] 2.4 Alert：`message`/`description`/`variant`
- [x] 2.5 Statistic：`title`/`value`/`precision`/`suffix`
- [x] 2.6 Grid：`columns`/`gap` 均分栏渲染 children
- [x] 2.7 Flex：`direction`/`gap`/`justify`/`align`
- [x] 2.8 Tabs：`items`（key/label/children DslNode[]）pane 经 renderChildren 渲染

## 3. 表单组件（spec: form-container）

- [x] 3.1 Form：React Context 下发 form 实例；`submit: true` Button 触发提交；onFinish → onSubmit(values) + 写入 state `form` 路径
- [x] 3.2 Input：Form 内且有 `name` 时自动包装 Form.Item（label/rules），否则独立受控渲染；onChange 传 string
- [x] 3.3 Select：`options` prop，同样的 Form.Item 自动包装逻辑；onChange 传 value
- [x] 3.4 rules 映射：至少支持 required + message，校验失败阻止提交

## 4. Table 组件（spec: table-component）

- [x] 4.1 columns/dataSource/rowKey/loading/pagination 映射，空数据渲染空态
- [x] 4.2 `cell` 行模板：经 renderChildren 注入 `{ row, rowIndex }` 渲染
- [x] 4.3 分页与加载态测试

## 5. 注册入口与端到端

- [x] 5.1 `registerBuiltinComponents(registry)` 与 `createBuiltinComponentRegistry()`，12 个类型名全部可解析
- [x] 5.2 端到端测试：PageRuntime + 内置组件渲染完整 PageDsl（Form 提交 → setState → Table cell 按钮 → state 更新）

## 6. 验收与文档

- [x] 6.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 6.2 文档站新增 `packages/components.md` 模块页，侧边栏与快速开始模块表同步更新，`pnpm docs:build` 通过
