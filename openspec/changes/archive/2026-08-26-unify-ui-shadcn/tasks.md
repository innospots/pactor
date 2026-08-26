# Tasks: unify-ui-shadcn

## 1. 契约与核心迁入 pactor-ui

- [x] 1.1 迁移组件 props 契约类型：packages/ui-antd/src/components 的契约类型 → packages/ui/src/components（pactor-ui 内 type-only re-export 改本地定义）
- [x] 1.2 迁移交互核心：OverlayManager / createUiBridge / registerInteractionActions / UiBridge / InteractionProviderProps / OverlayHostProps → packages/ui/src/interaction
- [x] 1.3 迁移布局类型与 resolveLayout → packages/ui/src/layout
- [x] 1.4 pactor-ui 测试全绿（含新增"12 类型名硬编码断言"替代跨包同构断言）

## 2. 依赖方改接

- [x] 2.1 pactor-app：全部 UI 导入改自 pactor-ui；删除 antd/radix 预设相关代码与测试；package.json 依赖收敛为 pactor-ui
- [x] 2.2 pactor-chat：测试依赖 pactor-ui-antd → pactor-ui（safe-registry 测试用 shadcn 注册表）
- [x] 2.3 examples/chat：safe-registry 切 createShadcnComponentRegistry 白名单；antd message/confirm 改 pactor-ui 交互层；移除 antd 依赖与 reset.css 导入

## 3. 删除 legacy 包与示例

- [x] 3.1 删除 packages/ui-antd、packages/ui-radix、examples/admin-antd；pnpm install 收敛 lockfile
- [x] 3.2 全仓 grep 清零：`pactor-ui-antd`、`pactor-ui-radix`、`from 'antd'`（源码 + package.json + 文档代码块）
- [x] 3.3 全量验证：`pnpm -r test` / `pnpm -r --if-present build` / typecheck 全绿

## 4. 文档与收尾

- [x] 4.1 docs 站：删除 ui-antd/ui-radix 章节，UI 章节收敛为 pactor-ui + 迁移对照表；根 README、packages/ui/README 更新
- [x] 4.2 playwright 走查 examples/admin 与 examples/chat（shadcn 皮肤、DSL 卡片、capability 确认链无回归）
- [x] 4.3 `openspec validate unify-ui-shadcn` 通过
