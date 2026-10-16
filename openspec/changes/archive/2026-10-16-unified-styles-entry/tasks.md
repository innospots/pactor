# Tasks: unified-styles-entry

## 1. ui：桥接单源

- [x] 1.1 抽出 `packages/ui/src/theme-bridge.css`（现 `src/styles.css` 中 `@theme inline` 块原样迁移）；`src/styles.css` 改为 `@import './theme-bridge.css'`；package.json exports 增加 `./theme-bridge.css`
- [x] 1.2 `pnpm --filter @pactor-app/ui build` 后 diff 校验 dist styles.css 与改动前等价（仅源结构调整，产物不变）

## 2. 域包对齐

- [x] 2.1 chat `src/styles.css`：删除 `@theme inline` 拷贝改为 `@import '@pactor-app/ui/theme-bridge.css'`；`@import 'tailwindcss'` 改为 `theme.css layer(theme)` + `utilities.css layer(utilities)`（去除 preflight，对齐 blocks/chart）；markdown 内联与 `.pactor-chat-*` 层不动
- [x] 2.2 blocks / chart `src/styles.css`：桥拷贝改为 `@import '@pactor-app/ui/theme-bridge.css'`
- [x] 2.3 blocks / chart package.json `sideEffects` 改为 `["./styles.css"]`
- [x] 2.4 各包 build:styles 验证：产物内联桥接、chat 产物无 preflight、工具类可用；chat/ui/blocks/chart 测试不回归

## 3. pactor-app 聚合出口

- [x] 3.1 新增 `packages/pactor/scripts/build-styles.mjs`：按 ui → blocks → chart → chat 顺序读取各包已编译 styles.css（校验存在非空），带来源 banner 拼接输出 `styles.css`；build 改为 `tsup && node scripts/build-styles.mjs`
- [x] 3.2 package.json：exports 增加 `./styles.css`、sideEffects 改为 `["./styles.css"]`、dependencies 增加 `@pactor-app/blocks` 与 `@pactor-app/chart`
- [x] 3.3 构建验证：聚合产物自包含（无未解析 `@import '@pactor-app/*'`）、四段齐全、preflight 仅一段（ui 段）

## 4. 消费方改单入口

- [x] 4.1 template `app/layout.tsx`：三张 pactor 表 → `import "pactor-app/styles.css"`（注释同步）；template 本地验证（install + tsc + build:dev）
- [x] 4.2 examples/chat、examples/admin：`ui/styles.css` + `chat/styles.css` → `pactor-app/styles.css`；各自 typecheck + build 通过

## 5. 全仓验证

- [x] 5.1 拓扑序 `pnpm -r build`（域包先于 pactor-app）通过；chat/ui/blocks/chart/pactor 测试与 typecheck 通过
- [x] 5.2 doc astro build 通过；浏览器实测 doc（chat 详情页 + 模板预览）与 examples/chat 对话流无视觉回归（颜色/preflight/暗色切换抽查）
- [x] 5.3 `openspec validate unified-styles-entry --strict` 通过
