# Tasks: change-default-ui-kit

## 1. pactor-app 默认翻转

- [x] 1.1 application.ts：三槽位默认改为 Radix（componentRegistry/layoutRegistry/interactionKit），import 改 pactor-ui-radix 子路径，JSDoc 同步（缺省 Radix；`ui: antdUiKit` 切回 antd）
- [x] 1.2 package.json：dependencies 增加 `pactor-ui-radix`，保留 `pactor-ui-antd`；devDependencies 去重；`pnpm install`

## 2. 测试翻转

- [x] 2.1 缺省断言改为 Radix（`.pcr-*` 存在、无 `.ant-*`；按钮文本查询按 Radix 精确文本）
- [x] 2.2 显式 antd 路径（ui: antdUiKit）测试保持通过

## 3. 文档

- [x] 3.1 app.md / ui-radix.md：默认即 Radix + 样式导入为必需步骤；切回 antd 的方式
- [x] 3.2 ui-antd.md 定位改为显式选择；getting-started 默认说明更新

## 4. 验收

- [x] 4.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 4.2 `pnpm docs:build` 通过；重启 docs dev server 验证
