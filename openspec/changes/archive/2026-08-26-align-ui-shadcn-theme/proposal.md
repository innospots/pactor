# align-ui-shadcn-theme

## Why

pactor-ui 的预建样式表为"宿主零影响"关闭了 Tailwind preflight，但 shadcn/ui 官方主题（[theming 文档](https://ui.shadcn.com/docs/theming)）假设完整 `tailwindcss`（含 preflight）环境。实测（浏览器 computed style）菜单按钮泄漏 UA 默认样式 `border: 2px outset black`、全局字体退化为 Arial、标题渲染为衬线体，弹层/手风琴无进退场动画——整体视觉与 shadcn 官方效果差距明显，用户反馈"样式太丑"。

## What Changes

- **开启 preflight**（**BREAKING**，对宿主全局样式而言）：`src/styles.css` 改为完整 `@import 'tailwindcss'`，与官方主题脚手架一致；不再承诺"全局零影响"，改为承诺"与 shadcn 官方应用一致的基线样式"。
- 补齐官方 `@layer base`：`* { border-border outline-ring/50 }`、`body { bg-background text-foreground }`。
- 主题令牌对齐官方默认 neutral 主题：radius 派生改为乘法比例（sm 0.6 / md 0.8 / lg 基准 / xl 1.4 / 2xl 1.8 / 3xl 2.2 / 4xl 2.6），新增 `chart-1..5` 与 `sidebar` 系列令牌（light + dark）。
- 引入 `tw-animate-css`（官方推荐动画层）+ accordion 关键帧，恢复 Dialog/Select/Popover 的 `animate-in/out`、`fade/zoom` 过渡与 Accordion 展开动画。
- ShadcnLoginLayout 等内容区布局补间距（Alert 与表单字段挤压）。
- 同步更新包内测试断言、README、`docs/guides/theming`、`docs/packages/ui`、framework-design 中"preflight 关闭"的表述。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `ui-kit-shadcn-preset`: "Tailwind preflight MUST NOT 影响宿主全局样式（关闭或作用域限定）"条款反转为开启 preflight、对齐官方基线；补充动画层与完整令牌组要求。

## Impact

- `packages/ui`：`src/styles.css` 重写、新增依赖 `tw-animate-css`、LoginLayout 间距、`tests/components/register.test.ts` 断言反转、README。
- 三个示例（admin / chat / vite-starter）全局基线样式变化，需截图回归。
- 文档：`docs/src/content/docs/guides/theming.md`、`docs/src/content/docs/packages/ui.md`、`framework-design.md`。
- 主 spec：`openspec/specs/ui-kit-shadcn-preset/spec.md`。
