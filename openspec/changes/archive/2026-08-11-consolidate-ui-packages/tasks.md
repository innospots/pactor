# Tasks: consolidate-ui-packages

## 1. pactor-ui-antd 整合

- [x] 1.1 packages/components/src → ui-antd/src/components、interaction/src → src/interaction、layout/src → src/layout；测试随迁至 ui-antd/tests/<layer>/ 并更新导入
- [x] 1.2 tsup 多入口 + exports 四入口（`.`/`./components`/`./interaction`/`./layout`）；排查并处理 `export *` 符号冲突
- [x] 1.3 主入口 export * 三层 + antdUiKit；package.json 依赖合并（antd peer 等）；ui-antd build/test/typecheck 通过

## 2. pactor-ui-radix 整合

- [x] 2.1 三个 radix 包 src/tests 迁入 ui-radix（同构结构）；契约类型与 OverlayManager 等引用改指 `pactor-ui-antd`（type-only + 交互核心运行时依赖）
- [x] 2.2 styles.css 合并为单文件（拼接三包样式）；exports 四入口 + `./styles.css`
- [x] 2.3 主入口 export * 三层 + radixUiKit；无 `from 'antd'` 引用；ui-radix build/test/typecheck 通过

## 3. 依赖方改接与旧包删除

- [x] 3.1 pactor-app：deps 三个 antd 包 → pactor-ui-antd；devDeps radix 三包 → pactor-ui-radix；src/tests import 更新；测试全过
- [x] 3.2 pactor-chat：devDeps/测试 import 改 pactor-ui-antd；测试全过
- [x] 3.3 删除六个旧包目录；根 package.json 清理；`pnpm install` 无残留引用

## 4. 文档同步

- [x] 4.1 删除六个旧模块页；重写 ui-antd.md / ui-radix.md（按 components/interaction/layout 三节组织，保留切换 recipe 与边界说明）
- [x] 4.2 侧边栏移除旧条目；getting-started 模块概览表收敛为两个 ui-* 行；README 工程结构更新
- [x] 4.3 设计文档 framework-design.md 第 6/7 节包结构清单同步为 ui-* 命名

## 5. 验收

- [x] 5.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过（测试用例数不减少）
- [x] 5.2 `pnpm docs:build` 通过；重启 docs dev server 并验证新页面可访问
