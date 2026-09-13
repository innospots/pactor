## 1. 实现

- [x] 1.1 `packages/ui/src/ui/card.tsx`:Card 新增 `rounded` prop(静态档位映射,缺省 `'xl'`,className 仍可覆盖)
- [x] 1.2 `packages/ui/src/components/components/Card/index.tsx`:DSL 适配器暴露 `rounded` 并透传

## 2. 测试与文档

- [x] 2.1 Card 测试:`rounded: 'sm'` → 根节点含 `rounded-sm`;缺省为 `rounded-xl`(display.test.tsx 新增 2 个用例)
- [x] 2.2 `docs/src/content/docs/components/layout.md` Card 小节 props 表补 `rounded`
- [x] 2.3 `pnpm --filter @pactor-app/ui test` / `build` 全绿;`openspec validate add-card-rounded-prop --strict` 通过
