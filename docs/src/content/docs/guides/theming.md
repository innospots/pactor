---
title: 主题与换肤
description: pactor-ui-radix 的 token 化主题体系——覆盖 CSS 变量换肤、内置暗色皮肤、class 覆盖兼容，以及与 Radix Colors 定制工具的配合
---

`pactor-ui-radix/styles.css` 采用 token 三层结构：**色板 token**（Radix Colors 12 级刻度，accent 由品牌主色 `#3C47DD` 展开）→ **语义 token**（背景 / 前景 / 边框 / accent 各态 / 四语义色 / 焦点环）→ **形状 token**（圆角 / 阴影 / 字体）。所有组件规则只引用语义 token，因此换肤不需要改任何组件样式——覆盖变量即可。

```ts
import 'pactor-ui-radix/styles.css';
```

## 方式一：覆盖 CSS 变量（推荐）

在本样式表**之后**注入你自己的变量声明，即可整体换肤。不需要重新声明全部 token，只覆盖你要改的。

只改主色的最小示例：

```css
/* your-theme.css —— 在 pactor-ui-radix/styles.css 之后导入 */
:root {
  --pcr-accent: #0e7a3d;        /* 实体色：主按钮背景、激活指示 */
  --pcr-accent-hover: #0c6b36;  /* hover 态 */
  --pcr-accent-active: #0a5c2f; /* 按下态 */
  --pcr-accent-text: #0d7a40;   /* 链接 / 激活文字 */
  --pcr-accent-subtle: #dcf2e4; /* 菜单激活底、选中高亮底 */
  --pcr-accent-border: #6fbf92; /* hover 边框 */
  --pcr-focus-ring: rgb(14 122 61 / 0.35);
}
```

```ts
import 'pactor-ui-radix/styles.css';
import './your-theme.css';
```

也可以只覆盖形状 token（如全站圆角、阴影）或语义色，粒度任选。

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

## 方式三：覆盖 `.pcr-*` class（兼容旧方式）

所有组件规则都是 `.pcr-*` 语义 class 且优先级普通，直接写 class 覆盖仍然有效：

```css
.pcr-card {
  border-radius: 16px;
}
```

这与旧版硬编码样式表的覆盖方式完全兼容。推荐优先用方式一（变量覆盖），class 覆盖留给变量表达不了的结构性调整。

`examples/admin/src/theme.css` 是以上三种方式的可运行参考实现：token 覆盖（light + dark）、结构性美化（欢迎横幅渐变、指标卡 accent 强调条），可直接对照源码阅读。

## 完整 token 清单

### 色板 token

| token | 说明 |
| --- | --- |
| `--pcr-accent-1` … `--pcr-accent-12` | accent 12 级刻度（9=实体主色 `#3C47DD`，10=hover 实体，11=文本，12=高对比文本） |
| `--pcr-slate-1` … `--pcr-slate-12` | 中性刻度（对齐 Radix Colors slate） |
| `--pcr-green-3` / `--pcr-green-9` / `--pcr-green-11` | success 三级（subtle 底 / 实体 / 文本） |
| `--pcr-amber-3` / `--pcr-amber-9` / `--pcr-amber-11` | warning 三级 |
| `--pcr-red-3` / `--pcr-red-9` / `--pcr-red-11` | error 三级 |
| `--pcr-blue-3` / `--pcr-blue-9` / `--pcr-blue-11` | info 三级 |

### 语义 token

| token | 说明 |
| --- | --- |
| `--pcr-bg` / `--pcr-bg-subtle` / `--pcr-bg-muted` | 页面背景 / 次背景（表头、条纹）/ 弱背景（禁用态、页签条） |
| `--pcr-bg-elevated` | 浮起表面（卡片、弹层、下拉） |
| `--pcr-fg` / `--pcr-fg-muted` / `--pcr-fg-subtle` | 主文字 / 次级文字 / 占位与禁用文字 |
| `--pcr-border-subtle` / `--pcr-border` / `--pcr-border-strong` | 分隔线 / 常规边框 / 强边框 |
| `--pcr-accent` / `--pcr-accent-hover` / `--pcr-accent-active` | 主色实体三态 |
| `--pcr-accent-fg` | 主色实体上的文字色（默认白） |
| `--pcr-accent-subtle` / `--pcr-accent-text` / `--pcr-accent-border` | 主色浅底 / 主色文字 / 主色边框 |
| `--pcr-success` / `--pcr-success-subtle` / `--pcr-success-text` | success 语义三件套 |
| `--pcr-warning` / `--pcr-warning-subtle` / `--pcr-warning-text` | warning 语义三件套 |
| `--pcr-error` / `--pcr-error-subtle` / `--pcr-error-text` | error 语义三件套 |
| `--pcr-info` / `--pcr-info-subtle` / `--pcr-info-text` | info 语义三件套 |
| `--pcr-focus-ring` | 焦点环颜色（focus-visible 盒阴影用） |
| `--pcr-mask` | 弹层遮罩色 |
| `--pcr-header-bg` / `--pcr-header-fg` | AdminLayout 头部背景 / 文字 |

### 形状 token

| token | 默认值 | 说明 |
| --- | --- | --- |
| `--pcr-radius-sm` | `6px` | 控件圆角（按钮、输入框） |
| `--pcr-radius-md` | `8px` | 面板圆角（卡片、Alert、Toast） |
| `--pcr-radius-lg` | `12px` | 弹层圆角（Modal、Drawer、Confirm） |
| `--pcr-shadow-sm` / `--pcr-shadow-md` / `--pcr-shadow-lg` | 柔和三档 | 卡片 / 下拉与 Toast / 弹层 |
| `--pcr-font-family` | 系统字体栈 | 全站字体 |
| `--pcr-font-size-xs` … `--pcr-font-size-2xl` | `12px` … `24px` | 字号阶梯 |
| `--pcr-line-height` | `1.5715` | 基础行高 |

以上全部 token 在 `[data-pactor-theme='dark']` 块中均有同名暗色值。

## 与 Radix Colors 定制工具配合

[radix-ui.com/colors/custom](https://radix-ui.com/colors/custom) 可以基于任意主色生成符合 Radix 12 级刻度语义的 light/dark 色板。配合步骤：

1. 在工具中输入你的品牌主色，生成 light 与 dark 两组 12 级刻度；
2. 把生成的刻度逐条映射到 `--pcr-accent-1` … `--pcr-accent-12`（light 写到 `:root`，dark 写到 `[data-pactor-theme='dark']`）；
3. 语义 token 默认已从刻度取值（`--pcr-accent` 用第 9 级、`-hover` 第 10 级、`-text` 第 11 级、`-subtle` 第 3 级、`-border` 第 7 级），通常无需再改；如生成的刻度语义不同，再单独覆盖这几个语义 token 即可。

```css
:root {
  --pcr-accent-1: …;  /* 工具生成的 light 刻度第 1 级 */
  /* … */
  --pcr-accent-12: …;
}

[data-pactor-theme='dark'] {
  --pcr-accent-1: …;  /* 工具生成的 dark 刻度第 1 级 */
  /* … */
  --pcr-accent-12: …;
}
```

中性色与语义色同理：换 slate 刻度改 `--pcr-slate-*`，换语义色改 `--pcr-green-*` / `--pcr-amber-*` / `--pcr-red-*` / `--pcr-blue-*`。
