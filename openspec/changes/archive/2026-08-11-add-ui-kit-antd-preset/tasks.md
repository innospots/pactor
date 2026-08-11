# Tasks: add-ui-kit-antd-preset

## 1. pactor-ui-antd 聚合包（spec: ui-kit-antd-preset）

- [x] 1.1 包骨架：`packages/ui-antd`（dependencies 三个 antd 套件包 workspace:*，peerDeps `react >=18`/`antd >=5`，devDeps react 测试栈 + pactor-app 仅类型断言）、tsconfig、tsup、LICENSE、README；`pnpm install`
- [x] 1.2 `src/index.ts`：`export *` 三个套件包 + `antdUiKit` 预设对象（UiKit 编译期兼容断言）
- [x] 1.3 测试：关键符号可导入、antdUiKit 形状、UiKit 兼容

## 2. pactor-app 对称测试

- [x] 2.1 devDep 加 pactor-ui-antd；测试 `ui: antdUiKit` 渲染 antd 元素（`.ant-*` 存在、`.pcr-*` 不存在）

## 3. 验收与文档

- [x] 3.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 3.2 文档站新增 `packages/ui-antd.md`（对称用法、无样式表说明）；ui-radix.md 补充对称提及；侧边栏与快速开始模块表同步；`pnpm docs:build` 通过
