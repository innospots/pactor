# 主题与样式移植指南

目标：生成项目与原产品**看起来是同一个产品**——令牌、深浅色、自定义 CSS、换肤能力全部对齐。样式不一致是验收不通过项，不是优化项。

## 1. 提取原产品设计令牌

从原产品代码（globals.css / tailwind 配置 / 主题文件）提取语义令牌，逐项写入生成项目的 `app/theme.css`：

- 必查令牌：`--background` `--foreground` `--card` `--primary` `--secondary` `--muted` `--accent` `--border` `--destructive` 及各自 `-foreground`，`--radius`
- **深浅色两份**：`:root:not([data-pactor-theme='dark'])` 与 `[data-pactor-theme='dark']` 都要覆盖，漏一份验收必挂
- 原产品用的字体、阴影、侧栏宽度等也一并记录并移植

提取方法：浏览器 DevTools 读取原产品 computed 值，或直接抄其 css 变量定义；禁止凭感觉调色。

## 2. 页面级自定义 CSS 完整移植

原产品的页面级样式（典型：登录页渐变背景 + 磨砂卡片）必须**原样复制**并在 `app/layout.tsx` 挂载（在 `@pactor-app/ui/styles.css` 之后导入，后加载者胜出）。

常见教训：页面级 CSS「文件已复制」但没在 layout.tsx 挂载，样式静默丢失。**挂载后必须浏览器打开对应页面目检**，不以文件存在为完成标准。

## 3. 换肤能力对齐

原产品支持多套皮肤时：

- 每套皮肤一个 CSS 文件（如 `public/skins/<key>.css`），内容是同名语义令牌的覆盖（含深色变体）
- 皮肤经 `<link rel="stylesheet" data-pactor-skin>` 在 ui styles 之后加载；首屏用 layout.tsx 内联脚本同步注入避免闪烁，运行时换肤「新 link 加载完成再移除旧 link」
- 换肤入口（ThemeSwitcher 之类）放在与原产品一致的位置（如侧栏底部/用户菜单）
- 皮肤数量、名称、缺省皮肤与原产品一致
- 图表组件随肤切换是库内建能力（`useChartTheme` 监听皮肤 link 变化），无需额外处理；验收时确认图表颜色随换肤变化

## 4. DSL 侧样式红线

- 组件自定义一律 `className` + 语义令牌：`bg-(--muted)`、`text-(--muted-foreground)`、`border-(--border)`
- **禁止写死色值**（`#xxx`、`rgb(...)`）——深浅色与换肤会破
- 间距优先组件 props（`gap: small/middle/large`），避免散落的 margin 工具类

## 5. 样式验收（并入 acceptance-checklist）

- 与原产品同页面并排对比：背景、卡片、主色按钮、文字层级无明显色差
- 深浅色各切一次：无白边、无死色、无对比度异常
- 每套皮肤切一次：全站（含图表）随肤变化
