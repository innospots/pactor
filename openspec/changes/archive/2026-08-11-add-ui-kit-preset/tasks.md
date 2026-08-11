# Tasks: add-ui-kit-preset

## 1. pactor-ui-radix 聚合包（spec: ui-kit-preset）

- [x] 1.1 包骨架：`packages/ui-radix`（dependencies 三个 radix 包 workspace:*，peerDeps `react >=18`，devDeps react 测试栈）、tsconfig、tsup、LICENSE、README；`pnpm install`
- [x] 1.2 `src/index.ts`：`export *` 三个套件包 + `radixUiKit` 预设对象
- [x] 1.3 `styles.css`：@import 三个套件样式表；exports `./styles.css` + sideEffects 标注
- [x] 1.4 测试：关键符号可导入、radixUiKit 形状、样式入口

## 2. pactor-app ui 选项（spec: ui-kit-preset）

- [x] 2.1 `UiKit` 类型（字段类型复用既有选项类型）+ options 增加 `ui?: UiKit`
- [x] 2.2 优先级合并：显式选项 > ui 预设 > antd 默认（每槽位独立），组合层使用合并结果
- [x] 2.3 测试：ui 预设整站生效（无 `.ant-*`）、显式覆盖、不传 ui 不变

## 3. 验收与文档

- [x] 3.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 3.2 文档站新增 `packages/ui-radix.md`（推荐切换路径：`ui: radixUiKit` + 一行样式导入；细粒度选项作为进阶覆盖）；components-radix.md 切换指南更新为以预设为推荐；侧边栏与快速开始模块表同步；`pnpm docs:build` 通过
