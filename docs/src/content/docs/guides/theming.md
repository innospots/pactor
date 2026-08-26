---
title: 主题与换肤
description: pactor-ui（shadcn kit）的 token 化主题体系——覆盖 CSS 变量换肤、内置暗色皮肤、data-slot 结构覆盖
---

`pactor-ui/styles.css`（shadcn kit 预建样式表）采用 **shadcn 语义令牌 + Tailwind 工具类**结构：语义变量（`--background` / `--foreground` / `--primary` / `--muted` / `--border` / `--ring` / `--radius` 等）定义在 `:root`，经 `@theme inline` 桥接为 `bg-primary` / `text-muted-foreground` 等工具类——**工具类运行时读 `var()`，覆盖变量即换肤，无需重新构建**。

```ts
import 'pactor-ui/styles.css';
```

## 方式一：覆盖 CSS 变量（推荐）

在本样式表**之后**注入你自己的变量声明，即可整体换肤。不需要重新声明全部 token，只覆盖你要改的。

只改主色的最小示例：

```css
/* your-theme.css —— 在 pactor-ui/styles.css 之后导入 */
:root {
  --primary: oklch(0.55 0.2 260);          /* 主按钮、激活态 */
  --primary-foreground: oklch(0.985 0 0);  /* 主色上的文字 */
  --ring: oklch(0.55 0.2 260);             /* 焦点环 */
  --radius: 0.75rem;                       /* 全站圆角基准 */
}
```

```ts
import 'pactor-ui/styles.css';
import './your-theme.css';
```

也可以只覆盖形状 token（`--radius`）或语义色（`--success` / `--warning` / `--info` / `--destructive`），粒度任选。

## 方式二：内置暗色皮肤

样式表内置完整的暗色 token 覆盖，挂在 `<html>` 或任意容器上生效：

```html
<html data-pactor-theme="dark">
```

宿主应用一行 JS 即可切换：

```ts
document.documentElement.setAttribute('data-pactor-theme', 'dark');
// 还原亮色
document.documentElement.removeAttribute('data-pactor-theme');
```

注意属性名是 `data-pactor-theme`（不是 `data-theme`），避免与宿主自己的主题属性冲突。暗色皮肤可以与方式一叠加：在 `[data-pactor-theme='dark']` 选择器下覆盖同名变量即可定制暗色值。

## 方式三：data-slot 结构覆盖

组件根/部位带有稳定的 `data-slot` 钩子（如 `[data-slot=admin-layout]` / `[data-slot=button]` / `[data-slot=card]` / `[data-slot=toast]`）。DSL 不支持自定义 className，结构性美化用这些钩子定位：

```css
/* 指标卡左侧加主色强调条 */
[data-slot='card']:has([data-slot='statistic']) {
  border-left: 3px solid var(--primary);
}
```

推荐优先用方式一（变量覆盖），结构覆盖留给变量表达不了的调整。

`examples/admin/src/theme.css` 是以上三种方式的可运行参考实现：token 覆盖（light + dark）、结构性美化（欢迎横幅渐变、指标卡 accent 强调条）、主色预设切换，可直接对照源码阅读。

## 完整 token 清单

### 语义 token（`:root`，暗色同名覆盖）

| token | 说明 |
| --- | --- |
| `--background` / `--foreground` | 页面背景 / 主文字 |
| `--card` / `--card-foreground` | 卡片表面 / 卡片文字 |
| `--popover` / `--popover-foreground` | 浮起表面（弹层、下拉、Toast）/ 其上文字 |
| `--primary` / `--primary-foreground` | 主色实体 / 主色上的文字 |
| `--secondary` / `--secondary-foreground` | 次级表面 / 其上文字 |
| `--muted` / `--muted-foreground` | 弱背景（表头、悬浮态）/ 次级文字 |
| `--accent` / `--accent-foreground` | 强调底（选中、悬浮）/ 其上文字 |
| `--destructive` / `--destructive-foreground` | 危险语义（error / danger）/ 其上文字 |
| `--success` / `--warning` / `--info` | Alert 四态补充语义色（非 shadcn 默认令牌） |
| `--border` / `--input` | 常规边框 / 输入控件边框 |
| `--ring` | 焦点环颜色 |

### 形状 token

| token | 默认值 | 说明 |
| --- | --- | --- |
| `--radius` | `0.625rem` | 圆角基准；`rounded-sm/md/lg/xl` 由其加减派生 |

## 工具类桥接（`@theme inline`）

语义令牌经 `@theme inline` 映射为 Tailwind 颜色工具类（`bg-background` / `text-foreground` / `bg-card` / `bg-popover` / `bg-primary` / `text-primary-foreground` / `bg-secondary` / `bg-muted` / `text-muted-foreground` / `bg-accent` / `bg-destructive` / `border-border` / `border-input` / `ring-ring` 等）与圆角阶梯（`rounded-sm` … `rounded-xl`）。业务自写的扩展组件也可以直接使用这些工具类，自动跟随皮肤。

:::note[preflight 关闭]
预建样式表只含 theme + utilities 两层与令牌定义，**不注入全局 reset**——宿主页面的全局样式零影响。代价是组件内的边框类都显式带颜色（`border-border` / `border-input`），自定义扩展时请同样显式指定边框色。
:::
