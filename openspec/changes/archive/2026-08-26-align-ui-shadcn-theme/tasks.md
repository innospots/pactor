# Tasks: align-ui-shadcn-theme

## 1. 样式表对齐官方主题

- [x] 1.1 packages/ui 新增依赖 `tw-animate-css`
- [x] 1.2 重写 `packages/ui/src/styles.css`：完整 `@import 'tailwindcss'`（含 preflight）+ `tw-animate-css`；`@theme inline` 补 chart-1..5 / sidebar 系列桥接；radius 派生改乘法比例（0.6/0.8/1/1.4/1.8/2.2/2.6）；`:root` 与 `[data-pactor-theme='dark']` 补齐 chart / sidebar 令牌值；补 `@keyframes accordion-down/up`；补官方 `@layer base`（`* { border-border outline-ring/50 }`、`body { bg-background text-foreground }`）
- [x] 1.3 更新 button.tsx / badge.tsx 中"无 preflight"注释
- [x] 1.4 反转 `tests/components/register.test.ts` 的 preflight 断言（不含 → 含）并补动画/令牌断言
- [x] 1.5 `pnpm --filter pactor-ui build` 重建预建样式，测试通过

## 2. 布局间距修复

- [x] 2.1 ShadcnLoginLayout 内容区补间距（Alert 与表单字段挤压）
- [x] 2.2 截图回归发现的同类挤压一并修复（不扩大范围）

## 3. 回归验证

- [x] 3.1 example-admin 截图回归（登录页 + 工作台 + dark）
- [x] 3.2 example-chat 截图回归（确认 pactor-chat 自有皮肤无破坏）
- [x] 3.3 example-vite-starter 截图回归
- [x] 3.4 全量测试 + typecheck

## 4. 文档与归档

- [x] 4.1 更新 packages/ui/README.md、docs/guides/theming.md、docs/packages/ui.md、framework-design.md 中"preflight 关闭"表述
- [x] 4.2 spec 同步到 openspec/specs/ui-kit-shadcn-preset，归档 change
