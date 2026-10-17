---
title: 主题与换肤
description: "@pactor-app/ui（shadcn kit）的 token 化主题体系——CSS 皮肤文件换肤、完整令牌清单、运行时切换、内置暗色皮肤、data-slot 结构覆盖"
---

`@pactor-app/ui/styles.css`（shadcn kit 预建样式表）采用 **shadcn 语义令牌 + Tailwind 工具类**结构：语义变量（`--background` / `--foreground` / `--primary` / `--muted` / `--border` / `--ring` / `--radius` 等）定义在 `:root`，经 `@theme inline` 桥接为 `bg-primary` / `text-muted-foreground` 等工具类——**工具类运行时读 `var()`，覆盖变量即换肤，无需重新构建**。组件的全部颜色、阴影、圆角均经令牌解析，不存在硬编码颜色，因此一个普通 CSS 文件即可完整接管视觉。

```ts
import '@pactor-app/ui/styles.css';
```

## 方式一：CSS 皮肤文件（推荐）

皮肤就是一个普通 CSS 文件：在本样式表**之后**加载，覆盖你要改的令牌即可，不需要重新声明全部 token。

```css
/* your-theme.css —— 在 @pactor-app/ui/styles.css 之后加载 */
:root {
  --primary: oklch(0.55 0.2 260);          /* 主按钮、激活态 */
  --primary-foreground: oklch(0.985 0 0);  /* 主色上的文字 */
  --ring: oklch(0.55 0.2 260);             /* 焦点环 */
  --radius: 0.75rem;                       /* 全站圆角基准 */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* 可选：同文件内给出暗色值 */
[data-pactor-theme='dark'] {
  --primary: oklch(0.7 0.18 260);
  --primary-foreground: oklch(0.145 0 0);
}
```

```ts
import '@pactor-app/ui/styles.css';
import './your-theme.css';
```

也可以用 `<link>` 托管加载——只要保证它在 `pactor-ui/styles.css` 之后：

```html
<link rel="stylesheet" href="/skins/brand-a.css" />
```

:::caution[背景/前景必须成对覆盖]
每个背景类令牌都有配对的 `-foreground` 令牌。覆盖背景色时**必须**同步覆盖其前景色，并保证对比度达到 WCAG AA（正文 4.5:1）。例如改了 `--primary` 就要改 `--primary-foreground`；改了 `--card` 就要改 `--card-foreground`。
:::

## 页面背景：纯色、渐变、图片

页面背景颜色由 `--background` 承接；渐变与图片由 `--background-image`（默认 `none`）承接，自动应用到页面底层：

```css
:root {
  /* 纯色（默认形态） */
  --background: oklch(0.98 0.01 95);

  /* 渐变 */
  --background-image: linear-gradient(135deg, oklch(0.96 0.03 260), oklch(0.94 0.05 200));

  /* 或图片 */
  --background-image: url('/bg.png');
}
```

卡片、弹层等浮层仍使用不透明的 `--card` / `--popover`，与页面背景天然隔离，渐变/图片背景不会影响浮层可读性。

## 运行时切换皮肤

令牌经 `var()` 运行时解析，替换皮肤样式表节点即可即时切换，无需刷新页面：

```ts
function applySkin(href: string) {
  const next = document.createElement('link');
  next.rel = 'stylesheet';
  next.href = href;
  next.onload = () => {
    // 新皮肤加载完成后再移除旧的，避免无样式闪烁
    document.querySelectorAll('link[data-pactor-skin]').forEach((el) => el.remove());
    next.dataset.pactorSkin = '';
  };
  document.head.append(next);
}
```

## 可视化皮肤工作室

仓库内置皮肤工作室工具（`tools/theme-studio`，不发布 npm），可视化完成「选预置主题 → 微调令牌 → 实时预览全部组件 → 下载皮肤 CSS」的完整流程：

```bash
pnpm --filter theme-studio dev   # http://localhost:5710
```

- **预置主题**：含依据中国传统色生成的 5 套主题（珊瑚赫·红 / 青冥·蓝 / 碧山·绿 / 梔子·黄 / 齊紫·紫）与石墨灰、莫兰迪对照主题，每套只覆盖语义令牌子集，组件级令牌经默认 `var()` 回退自动跟随
- **令牌编辑器**：按分组列出全部可覆盖令牌（语义令牌 + 组件级令牌），颜色类给原生取色器 + 文本输入，尺寸 / 字体 / 背景图给文本输入；单项修改实时叠加在所选主题之上
- **实时预览**：右侧 iframe 加载内置组件画廊（`/gallery`，覆盖基础 / 表单 / 反馈 / 导航 / 浮层 / 数据 / chat 系组件），皮肤经 postMessage 注入 `<style>` 节点，与宿主真实加载方式（在 `pactor-ui/styles.css` 之后级联覆盖）完全一致
- **下载**：合成后的 `pactor-theme.css`（`:root` 覆盖块 + 注释掉的暗色骨架），在你的系统中于 `@pactor-app/ui/styles.css` 之后加载即生效

## 方式二：内置暗色皮肤

样式表内置完整的暗色 token 覆盖，挂在 `<html>` 或任意容器上生效；三态语义：`'light'` 强制亮色 / `'dark'` 强制暗色 / **不设置 = 跟随系统** `prefers-color-scheme`。

```html
<html data-pactor-theme="dark">
```

```ts
document.documentElement.setAttribute('data-pactor-theme', 'dark');
// 还原亮色
document.documentElement.removeAttribute('data-pactor-theme');
```

注意属性名是 `data-pactor-theme`（不是 `data-theme`），避免与宿主自己的主题属性冲突。皮肤文件可以为暗色单独给值（`[data-pactor-theme='dark']` 选择器块，见方式一示例）；皮肤未提供暗色值时，组件回退到内置暗色令牌，不会出现未着色的破损状态。

:::note[皮肤亮色令牌优先于"跟随系统暗色"兜底]
内置系统暗色兜底选择器经 `:where()` 降为与 `:root` 默认块同优先级，恒低于皮肤文件的亮色块 `:root:not([data-pactor-theme='dark'])`——加载皮肤后，系统深色偏好不会把皮肤压成内置暗色。皮肤需要暗色变体时，在皮肤文件中提供 `[data-pactor-theme='dark']` 块（宿主显式设置属性时生效）；如需跟随系统，可在皮肤文件中自行附带 `@media (prefers-color-scheme: dark)` 块。Theme Studio 生成的皮肤在亮/暗块中分别声明 `color-scheme: light / dark`，原生滚动条与表单控件随皮肤明暗翻转；手写皮肤请同样声明，否则系统深色偏好下亮色皮肤的滚动条会呈现浏览器默认深色。
:::

## 方式三：data-slot 结构覆盖

组件根/部位带有稳定的 `data-slot` 钩子（如 `[data-slot=admin-layout]` / `[data-slot=button]` / `[data-slot=card]` / `[data-slot=toast]`）。DSL 不支持自定义 className，结构性美化用这些钩子定位：

```css
/* 指标卡左侧加主色强调条 */
[data-slot='card']:has([data-slot='statistic']) {
  border-left: 3px solid var(--primary);
}
```

推荐优先用方式一（变量覆盖），结构覆盖留给变量表达不了的调整。

`examples/admin/src/theme.css` 是以上方式的可运行参考实现：token 覆盖（light + dark）、结构性美化（欢迎横幅渐变、指标卡 accent 强调条）、主色预设切换，可直接对照源码阅读。

## 完整 token 清单

### 语义 token（`:root`，暗色同名覆盖）

| token | 说明 |
| --- | --- |
| `--background` / `--foreground` | 页面背景（纯色）/ 主文字 |
| `--background-image` | 页面背景渐变或图片（默认 `none`），与 `--background` 叠加应用 |
| `--font-sans` | 全局字体族（body 及继承） |
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
| `--chart-1` … `--chart-5` | 图表色板（按序循环取色） |
| `--sidebar` 系列（`-foreground` / `-primary` / `-primary-foreground` / `-accent` / `-accent-foreground` / `-border` / `-ring`） | 侧栏表面与其上元素 |
| `--sidebar-width` / `--sidebar-width-icon` | 侧栏展开宽度（默认 `16rem`）/ 折叠后 icon rail 宽度（默认 `3rem`）；Theme Studio 生成的皮肤可覆盖 |

> 图表（echarts）组件在渲染期读取上述 token 的具体颜色值，并自动跟随换肤：
> 明暗切换（`data-pactor-theme`）、皮肤 CSS 热替换（`<style>` 注入或皮肤 `<link>` 增删）
> 都会触发图表以新色板重建，无需重新挂载；经 CSSStyleSheet API 等非 DOM 途径换肤时，
> 可 dispatch `window` 事件 `pactor:skin-change` 强制刷新。

### 形状与阴影 token

| token | 默认值 | 说明 |
| --- | --- | --- |
| `--radius` | `0.625rem` | 圆角基准；`rounded-sm/md/lg/xl/2xl/3xl/4xl` 由其乘法派生（0.6/0.8/1/1.4/1.8/2.2/2.6） |
| `--card-shadow` | `none` | 卡片阴影（Card 默认不显示阴影） |
| `--shadow-color` | `oklch(0 0 0 / 10%)` | 弹层（Dialog/Sheet/Popover/DropdownMenu/Select/Toast 等）阴影颜色 |
| `--overlay-background` | `oklch(0 0 0 / 50%)` | 模态遮罩（Dialog/Sheet/Drawer/AlertDialog 背景幕布） |

### 布局间距 token

| token | 默认值 | 说明 |
| --- | --- | --- |
| `--flex-gap` | `12px` | Flex 未指定 gap 时的默认间距，也是命名档位的计算基准 |
| `--flex-gap-sm` / `-md` / `-lg` | `×0.67` / `×1.33` / `×2` | Flex `gap="small"/"middle"/"large"` 命名档位，默认按 `--flex-gap` 比例派生（基准 12px 时即 8/16/24px），可单独覆盖 |
| `--grid-gap` | `16px` | Grid 未指定 gap 时的默认栏间距 |

### 组件级 token（`--<component>-<part>-<state>`，默认值回退到语义令牌）

组件级令牌的默认值经 `var(--语义令牌)` 引用语义令牌——**只覆盖语义令牌时这些组件也有合理视觉**；需要精细控制时再单独覆盖。

| token | 默认值 | 说明 |
| --- | --- | --- |
| `--input-background` / `--input-foreground` | `--card` / `--card-foreground` | Input、Textarea、Select 等输入控件表面 / 其上文字 |
| `--switch-track` / `--switch-track-checked` | `--input` / `--primary` | Switch 轨道（未选中 / 选中） |
| `--switch-thumb` | `--card` | Switch 滑块 |
| `--slider-track` / `--slider-range` | `--muted` / `--primary` | Slider 轨道 / 已选进度 |
| `--slider-thumb` | `--card` | Slider 滑块 |
| `--radio-border` / `--radio-checked` | `--input` / `--primary` | Radio 圆圈边框（默认）/ 选中（边框与圆点） |
| `--progress-track` / `--progress-indicator` | `--muted` / `--primary` | Progress 背景 / 进度条 |
| `--pagination-active-background` / `-border` / `-radius` | `--card` / `--border` / `calc(var(--radius) * 0.8)` | Pagination 当前页背景 / 边框 / 圆角 |
| `--menu-hover-background` / `-foreground` | `--accent` / `--accent-foreground` | 菜单项 hover（Menu/DropdownMenu/ContextMenu/Menubar/NavigationMenu/Select/Combobox 列表共用） |
| `--menu-active-background` / `-foreground` | `--accent` / `--accent-foreground` | 菜单项选中/展开（同上，含 Command 选中项） |
| `--bubble-background` / `--bubble-hover-background` | 由 `--primary` 派生（暗色另有一套派生值） | Bubble `tinted` 变体背景 / 其 hover |
| `--calendar-day-hover-background` / `-foreground` | `--accent` / `--accent-foreground` | Calendar 日期 hover |
| `--calendar-selected-background` / `-foreground` | `--primary` / `--primary-foreground` | Calendar 选中日 |
| `--calendar-today-background` / `-foreground` | `--accent` / `--accent-foreground` | Calendar 今日 |
| `--calendar-today-border` | `--primary` | Calendar 今日边框标识 |
| `--calendar-range-background` / `-foreground` | `--accent` / `--accent-foreground` | DatePicker range 区间中间日期 |

## 工具类桥接（`@theme inline`）

语义令牌经 `@theme inline` 映射为 Tailwind 颜色工具类（`bg-background` / `text-foreground` / `bg-card` / `bg-popover` / `bg-primary` / `text-primary-foreground` / `bg-secondary` / `bg-muted` / `text-muted-foreground` / `bg-accent` / `bg-destructive` / `border-border` / `border-input` / `ring-ring` 等）与圆角阶梯（`rounded-sm` … `rounded-xl`）。业务自写的扩展组件也可以直接使用这些工具类，自动跟随皮肤；组件级令牌（`--<component>-…`）不进 `@theme`，组件样式直接 `var()` 读取，自定义扩展组件可用 `bg-(--…)` 任意值语法引用。

:::note[preflight 开启（shadcn 官方基线）]
预建样式表与 [shadcn 官方主题脚手架](https://ui.shadcn.com/docs/theming)一致：完整 `tailwindcss`（含 preflight）+ `tw-animate-css` 动画层 + 官方 base layer（`* { border-border outline-ring/50 }`、`body { bg-background text-foreground }`）。导入 `@pactor-app/ui/styles.css` 即接受该基线全局样式；宿主自定义皮肤 CSS 须在其后导入。
:::
