## 1. 实现

- [x] 1.1 `tools/theme-studio/src/skin.ts`:`composeSkinCss` 合并链改为 `{ ...TOKEN_DEFAULTS, ...preset.tokens, ...overrides }`(TOKEN_DEFAULTS 从 resolve.ts 提取为共享导出,两文件同源使用);暗色块逻辑不动

## 2. 测试与验证

- [x] 2.1 更新 `tools/theme-studio/tests/skin.test.ts`:导出含预置未定义的令牌(--sidebar,取默认值)、覆盖优先级(用户 > 预置 > 默认)、暗色块不做默认值兜底;既有"导出与预览同源"等用例适配新输出
- [x] 2.2 `npx vitest run tools/theme-studio/tests/` 全绿;`openspec validate skin-css-complete-tokens --strict` 通过

## 3. sidebar 令牌族语义别名(设计决策 D2)

- [x] 3.1 `packages/ui/src/styles.css`:`:root` 的 sidebar 一族改为 var() 语义别名(card/card-foreground/primary/primary-foreground/accent/accent-foreground/border/ring);两个暗色块删除与语义令牌同值的 6 个 sidebar 覆盖,保留 `--sidebar-primary` / `--sidebar-primary-foreground`(暗色下刻意区别于 --primary)
- [x] 3.2 `tools/theme-studio/src/tokens.ts`:8 个 sidebar 令牌的 defaultValue 同步为相同别名
- [x] 3.3 复跑 `pnpm --filter @pactor-app/ui test`(skin-tokens 契约)与 theme-studio 测试,`openspec validate skin-css-complete-tokens --strict`
