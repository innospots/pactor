# Tasks: add-ui-shadcn-kit

## 1. 包脚手架与构建链

- [x] 1.1 创建 `packages/ui`（npm `pactor-ui`）：package.json（主子路径 exports + `./styles.css` + sideEffects）、tsup 配置、tsconfig；新增依赖 tailwindcss（dev，v4）、class-variance-authority、clsx、tailwind-merge、lucide-react 及所需 @radix-ui/react-*；类型 type-only + 交互核心运行时依赖 `pactor-ui-antd`
- [x] 1.2 Tailwind 构建链：`src/styles.css`（@import tailwindcss + shadcn 语义令牌，`:root` + `[data-pactor-theme='dark']`，preflight 关闭或作用域限定）→ 构建脚本产出预建 `styles.css` 到包根；`pnpm build` 串联 tsup + tailwind

## 2. shadcn 基础组件与 DSL 适配层

- [x] 2.1 vendor shadcn 基础件到 `src/ui/`（button/input/select/tabs/dialog/card/form/table/textarea/badge 等契约所需件）+ `cn()` 工具
- [x] 2.2 `src/components/`：12 个 DSL 组件适配器（Page/Grid/Flex/Card/Button/Alert/Statistic/Tabs/Table/Form/Input/Select），props 契约类型 type-only 复用 `pactor-ui-antd/components`，事件值语义对齐（Input→string、Select→value、Form→values+form 作用域、Table cell 经 renderChildren 带 row/rowIndex）
- [x] 2.3 契约测试（TDD）：`createShadcnComponentRegistry().list()` 与 antd/radix 相等；各组件渲染与事件语义测试（参照 packages/ui-radix/tests/components 结构）

## 3. 布局与交互层

- [x] 3.1 `src/layout/`：admin/blank/login/landing 四布局 + `createShadcnLayoutRegistry()` / `registerShadcnLayouts()`，props 类型复用 `pactor-ui-antd/layout`
- [x] 3.2 `src/interaction/`：`ShadcnInteractionProvider` / `ShadcnOverlayHost`（运行时复用 pactor-ui-antd/interaction 的 OverlayManager 核心），toast/modal/drawer 用 shadcn 件实现
- [x] 3.3 测试：布局注册与 blank 回退、overlay 打开/取消 `{ success: false }`、message 动作链路（参照 ui-radix interaction/layout 测试）

## 4. 预设与默认切换

- [x] 4.1 导出 `shadcnUiKit` 预设（三槽位）；确认与 pactor-app `UiKit` 类型兼容
- [x] 4.2 `packages/app/src/application.ts`：componentRegistry / layoutRegistry / interactionKit 三处缺省回退由 radix 改为 shadcn；package.json 依赖改接（pactor-ui 运行时，pactor-ui-radix 降 devDep）；pactor-app 测试更新并保持全绿
- [x] 4.3 examples/admin、examples/vite-starter、packages/cli 模板：默认样式导入改为 `pactor-ui/styles.css`；example-admin-antd 保持不变

## 5. 验证与文档

- [x] 5.1 全量验证：`pnpm -r test` / `pnpm -r build` / 各包 typecheck 全绿；`openspec validate add-ui-shadcn-kit` 通过
- [x] 5.2 playwright 走查 examples/admin（默认 shadcn 皮肤 light/dark、表单/表格/弹层）与 examples/admin-antd（antd 皮肤无回归）
- [x] 5.3 文档：packages/ui/README.md、docs 站 UI kit 章节（三 kit 选型建议 + 默认变更说明）、根 README 相关引用
