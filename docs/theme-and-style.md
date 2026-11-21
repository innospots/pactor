# Pactor 主题与样式规范

> 适用范围：`@pactor-app/ui`（shadcn kit）及其下游 `blocks` / `chart` / `chat` / `markdown` / `shell`，以及基于 `pactor-app/styles.css` 的业务宿主。
>
> 本文是**实现契约说明**，不是设计稿。文中所有令牌、默认值、加载顺序均以当前源码为准；改动令牌体系时请同步本文与 `packages/ui/src/styles.css`。
>
> 主要事实来源：
>
> - `packages/ui/src/styles.css` — 语义令牌、密度令牌、动效令牌、基础层
> - `packages/ui/src/theme-bridge.css` — 语义令牌 → Tailwind 工具类桥
> - `packages/chat/src/styles.css` — `--pactor-chat-*` 令牌
> - `packages/markdown/styles.css` — `--pactor-markdown-*` 令牌
> - `packages/shell/styles.css` — 壳层布局与 `--rail-*` 消费
> - `packages/theme/` — 预置皮肤包与换肤运行时（薄皮肤共用 `src/skins/_base.css`）
> - `examples/admin/src/theme.css`、`examples/admin/src/skin.ts` — 可运行参考实现

---

## 1. 设计原则

1. **令牌驱动，无硬编码**：组件颜色、圆角、阴影、字号全部经 CSS 变量解析；组件源码中不出现具体色值。换肤 = 覆盖变量，不改组件。
2. **单一样式入口**：全量场景只导入 `pactor-app/styles.css` 一次（构建产物，已按 ui → blocks → chart → chat 内联）；按需场景才引用 `@pactor-app/<pkg>/styles.css`，且保持同一相对顺序。
3. **消费方零构建配置**：样式在包构建期经 Tailwind v4 编译为预建 CSS；业务项目不需要安装或配置 Tailwind 就能得到完整视觉。
4. **后加载者胜出**：皮肤/自定义样式是普通 CSS，只要排在基础样式之后即可覆盖，无需 `!important`、无需构建期介入。
5. **结构钩子稳定**：组件根节点带 `data-slot="<name>"`，内部部件也带 `data-slot`；结构性定制优先用它，不依赖 hash 类名。
6. **明暗同源**：同一套令牌在 `:root` 与 `[data-pactor-theme='dark']` 各声明一次，组件不写暗色分支。
7. **宿主拥有主题**：Runtime 只提供令牌与结构；主题选择、皮肤仓库、持久化由宿主（`@pactor-app/shell`、`@pactor-app/theme` 或自研设置面板）决定。

---

## 2. 样式产物与加载顺序

| 包 | 样式文件 | 内容 |
| --- | --- | --- |
| `@pactor-app/ui` | `styles.css` | preflight + `:root` 全部语义令牌 + 组件工具类 + 基础层 |
| `@pactor-app/blocks` | `styles.css` | 仅 blocks 用到的工具类（无全局基线，依赖 ui） |
| `@pactor-app/chart` | `styles.css` | 仅 chart 工具类（同上） |
| `@pactor-app/chat` | `styles.css` | `--pactor-chat-*` 令牌 + chat 结构样式 |
| `@pactor-app/markdown` | `styles.css` | `.pactor-markdown` 作用域排版 |
| `@pactor-app/shell` | `styles.css` | 壳层（AppShell / 左侧图标栏）；**不在聚合产物内**，用 shell 时需单独引入 |
| `@pactor-app/grid-layout` | `styles.css` | 拖拽栅格布局；按需单独引入 |
| `pactor-app` | `styles.css` | 聚合产物：ui → blocks → chart → chat 顺序内联（markdown 经 chat 内联，shell / grid-layout 不含） |

推荐挂载（顺序是契约的一部分）：

```tsx
// Next.js：src/app/layout.tsx
import './globals.css';            // 宿主自己的重置/页面样式（可省）
import 'pactor-app/styles.css';    // 基础样式，必须在前
import '@pactor-app/shell/styles.css'; // 仅用 AppShell 时需要（聚合产物不含）
import './styles/theme.css';       // 品牌令牌覆盖层，必须在后
import './styles/pages.css';       // 页面级结构样式，最后
```

Vite 同理，在入口 `main.tsx` 顶部按同一顺序 import。

> **常见错误**：把令牌写进 `globals.css` 而它又在 `pactor-app/styles.css` 之前导入，会被包内 `:root` 覆盖；或者只建了 `theme.css` 却忘记在 layout 挂载。

---

## 3. 令牌总览

全部令牌按域分为 10 组：

| 组 | 前缀 / 名称 | 数量级 | 主要用途 |
| --- | --- | --- | --- |
| A 核心语义色 | `--background`、`--primary` … | 22 | 全站表面、文字、品牌、状态 |
| B 图表 | `--chart-1..5` | 5 | 图表系列调色板 |
| C 侧栏 | `--sidebar*` | 8 | AdminLayout / ChatShell 侧栏 |
| D 组件级 | `--switch-*`、`--menu-*`、`--calendar-*` … | 30 | 单个组件的部件态，默认回退语义令牌 |
| E 尺寸/密度 | `--pactor-control-*`、`--pactor-*-padding` … | 20 | 控件高度、字号、表格行高、面板间距 |
| F 布局/间距/形状 | `--flex-gap*`、`--grid-gap`、`--sidebar-width*`、`--radius`、`--*-shadow` | 13 | Flex/Grid 默认间距、侧栏宽度、圆角与阴影 |
| G 字体/字号 | `--font-sans`、`--font-mono`、`--text-*` | 10 | 字体族与字号标尺 |
| H Chat | `--pactor-chat-*` | ~43 | 对话工作区专用 |
| I Markdown | `--pactor-markdown-*` | 8 | 富文本排版 |
| J 动效 | `--ease-*`、`--duration-*` | 5 | 过渡曲线与时长 |

**覆盖优先级**（从高到低）：

```text
documentElement 内联变量（applyGlobalSizeValues）
  > 皮肤/自定义 CSS 中同选择器后加载的声明
  > [data-pactor-size] 档位块
  > :root 默认值
```

---

## 4. 颜色体系

### 4.1 语义分层

| 层 | 令牌 | 语义 |
| --- | --- | --- |
| 表面 | `--background` | 页面底色 |
|  | `--card` / `--card-foreground` | 卡片、面板容器 |
|  | `--popover` / `--popover-foreground` | 下拉、弹层、Dialog 内容面 |
|  | `--muted` | 弱化底色：表头、代码块、占位、hover 底 |
|  | `--accent` / `--accent-foreground` | 选中/悬浮高亮底（比 muted 更强调） |
| 文字 | `--foreground` | 主文本 |
|  | `--muted-foreground` | 次级文本、说明、轴标签 |
|  | `--*-foreground` | 跟随各自底色配对的文本色 |
| 品牌 | `--primary` / `--primary-foreground` | 主按钮、选中态、链接、焦点强调 |
|  | `--secondary` / `--secondary-foreground` | 次级按钮、次级标签 |
| 状态 | `--destructive` / `--destructive-foreground` | 危险、删除、错误 |
|  | `--success` | 成功（Alert / Status） |
|  | `--warning` | 警告 |
|  | `--info` | 信息 |
| 描边 | `--border` | 分割线、卡片描边 |
|  | `--input` | 表单控件描边（比 border 深一档，保证可辨识） |
|  | `--ring` | 焦点环、选中描边；习惯与 primary 同色 |
| 数据 | `--chart-1` … `--chart-5` | 图表系列调色板，按序循环 |
| 侧栏 | `--sidebar*` | 默认是 card/primary/accent/border/ring 的别名 |

### 4.2 默认调色板（中性主题）

亮色（`packages/ui/src/styles.css:41`）：

| 令牌 | 默认值 |
| --- | --- |
| `--background` | `oklch(1 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` |
| `--card` / `--popover` | `oklch(1 0 0)` |
| `--card-foreground` / `--popover-foreground` | `oklch(0.145 0 0)` |
| `--primary` | `oklch(0.205 0 0)` |
| `--primary-foreground` | `oklch(0.985 0 0)` |
| `--secondary` / `--muted` / `--accent` | `oklch(0.97 0 0)` |
| `--secondary-foreground` / `--accent-foreground` | `oklch(0.205 0 0)` |
| `--muted-foreground` | `oklch(0.556 0 0)` |
| `--destructive` | `oklch(0.577 0.245 27.325)` |
| `--destructive-foreground` | `oklch(0.985 0 0)` |
| `--success` | `oklch(0.696 0.17 162.48)` |
| `--warning` | `oklch(0.769 0.188 70.08)` |
| `--info` | `oklch(0.623 0.214 259.815)` |
| `--border` | `oklch(0.922 0 0)` |
| `--input` | `oklch(0.85 0 0)` |
| `--ring` | `oklch(0.556 0 0)` |
| `--chart-1` | `oklch(0.646 0.222 41.116)` |
| `--chart-2` | `oklch(0.6 0.118 184.704)` |
| `--chart-3` | `oklch(0.398 0.07 227.392)` |
| `--chart-4` | `oklch(0.828 0.189 84.429)` |
| `--chart-5` | `oklch(0.769 0.188 70.08)` |

暗色（`packages/ui/src/styles.css:217`）：

| 令牌 | 默认值 |
| --- | --- |
| `--background` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.985 0 0)` |
| `--card` / `--popover` | `oklch(0.205 0 0)` |
| `--card-foreground` / `--popover-foreground` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.922 0 0)` |
| `--primary-foreground` | `oklch(0.205 0 0)` |
| `--secondary` / `--muted` / `--accent` | `oklch(0.269 0 0)` |
| `--secondary-foreground` / `--accent-foreground` | `oklch(0.985 0 0)` |
| `--muted-foreground` | `oklch(0.708 0 0)` |
| `--destructive` | `oklch(0.704 0.191 22.216)` |
| `--border` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(1 0 0 / 25%)` |
| `--ring` | `oklch(0.708 0 0)` |
| `--chart-1` … `--chart-5` | 蓝 / 绿 / 黄 / 紫 / 红（sat 0.24~0.27，L 0.49~0.77） |

暗色 `--border` / `--input` 用**半透明白**，让描边叠在任意深底上都自然；不要写成不透明灰。

### 4.3 派生关系（只改上游即可联动）

```text
--primary ──┬─→ --pactor-chat-primary（chat 主色，二者同值、不互相计算）
            ├─→ --pactor-chat-user-bubble-bg / -border（color-mix 7% / 35%）
            ├─→ --bubble-background / --bubble-hover-background（相对色，降低 L、缩 C）
            ├─→ --calendar-*（选中态默认引用 primary）
            └─→ --primary-foreground（必须人工配对，不能自动推导）

--card    ──→ --sidebar（= card）
--accent  ──→ --sidebar-accent / --menu-hover-background
--border  ──→ --sidebar-border / --pactor-markdown-border
--ring    ──→ --sidebar-ring

--radius  ──→ --radius-sm(0.6×) / md(0.8×) / lg(1×) / xl(1.4×) / 2xl(1.8×) / 3xl(2.2×) / 4xl(2.6×)
             └─→ --pagination-active-radius（chat 有一套独立阶梯，不被 --radius 驱动）

--chart-1..5 ──→ echarts 系列色（运行时读取计算值，换肤自动重绘）
```

**结论**：只改 `--primary` 时，气泡、日历、侧栏主色（亮色走别名）会自动跟随；但 `--primary-foreground`、`--ring` 不会自动重算配对关系，暗色的 `--sidebar-primary` 也是独立值，需要一起给。

### 4.4 配色规范

1. **60 / 30 / 10**：60% 表面（`background` / `card`），30% 弱化层（`muted` / `accent` / `secondary`），10% 品牌与状态（`primary` / 状态色）。主色不做大面积背景。
2. **文本只用两级**：正文 `foreground`，次要 `muted-foreground`。不要用 `opacity` 或 `color-mix` 临时调浅文字，否则暗色下对比度失控。
3. **状态色只表意**：`success/warning/info/destructive` 不用于装饰性图标或分类标签；分类请用 `accent` + 文本。
4. **描边分工**：容器用 `border`，可交互控件用 `input`，焦点用 `ring`。三者混用会出现"输入框比卡片还淡"的问题。
5. **暗色不是取反**：提高 `primary` 的 L（约 0.7~0.8）、降低 C（约 0.1~0.15），避免荧光；表面之间只拉开 4%~8% 的 L。
6. **对比度**：正文 ≥ 4.5:1，大字（≥ 18.66px 粗体 / 24px）≥ 3:1；暗色同样要求，不以"看得见"为准。
7. **图表**：`--chart-1..5` 按顺序取色，最多 5 个系列后循环；新增语义系列请复制一档同明度的色相，不要直接复用状态色。
8. **禁止写死色值**：YAML / 自定义组件 / 页面 CSS 中都应引用令牌（`var(--primary)`），否则暗色与换肤必然破。

---

## 5. 主题（明暗与皮肤）

### 5.1 明暗三态

| `data-pactor-theme` | 行为 |
| --- | --- |
| `light` | 强制亮色，覆盖系统偏好 |
| `dark` | 强制暗色 |
| 不设置 | 跟随 `prefers-color-scheme` |

属性可挂在 `<html>`（常规）或任意容器（局部暗色区块）。`color-scheme` 随之切换，浏览器原生控件自动适配。

宿主负责把用户选择解析成显式属性，并持久化（shell 默认键 `pactor.mode`）：

```ts
const media = window.matchMedia('(prefers-color-scheme: dark)');
const apply = () =>
  document.documentElement.dataset.pactorTheme = media.matches ? 'dark' : 'light';
apply();
media.addEventListener('change', apply);
```

> 一旦你的皮肤文件使用 `:root:not([data-pactor-theme='dark'])` 声明亮色令牌（推荐写法，见 §9.2），就必须**显式**写入 `light` 或 `dark`：该选择器优先级高于基础样式的系统暗色媒体查询，只依赖 `prefers-color-scheme` 会让皮肤永远停在亮色。

### 5.2 皮肤（`data-pactor-skin`）

具名皮肤是"另一份 `:root` 令牌文件 + 运行时选择"，与明暗正交：

- 预置 14 套：`zhu-cao`、`jin-yun`、`qiu-xiang`、`bi-shan`、`tian-shui`、`qing-ming`、`qing-hui`、`ning-ye`、`lian-hong`、`li-ke`、`wan-yan`、`yue-po`、`jin-yu`、`portal`；默认 `qing-hui`。
- 每套皮肤都必须提供**亮/暗两组块**：`:root:not([data-pactor-theme='dark'])` 与 `[data-pactor-theme='dark']`。
- 皮肤不定义 `--pactor-control-*`（密度契约与皮肤解耦）。
- `kind: 'tokens'` 只覆盖令牌；`kind: 'full'`（`portal`）额外包含 `body`、标题层级与 `[data-slot]` 结构规则。

```ts
import 'pactor-app/styles.css';
import '@pactor-app/theme/skins/qing-hui.css';   // 首屏固定一套，避免闪烁

import { applyTheme, readStoredTheme } from '@pactor-app/theme';
await applyTheme(readStoredTheme() ?? 'qing-hui'); // 用户切换
```

`applyTheme` 会懒加载 CSS、设置 `data-pactor-skin` / `data-requested-skin`、写 `localStorage['pactor.theme']`，并派发 `pactor:theme-change` / `pactor:skin-change`（图表据此重绘）。

首屏防闪烁直接使用 shell 提供的内联脚本：

```tsx
// <head>
import { SkinHeadScript } from '@pactor-app/shell/client';
<head><SkinHeadScript defaultSkin="qing-hui" /></head>
```

它同步恢复 `<link data-pactor-skin>` 与 `data-pactor-theme`，避免水合前闪白；配套设置面板：`SkinGallery`（主题画廊）与 `SkinSwitcher`（下拉切换），或自研。

### 5.3 主题名与 Bootstrap

`ApplicationDsl.application.theme.name` 只是把"应用默认主题"告知宿主；Runtime 不解释具体值。真正生效的是宿主注入的 CSS 与 DOM 属性，因此换肤不需要重新拉取页面 DSL。

### 5.4 新增一套预置皮肤（`@pactor-app/theme`）

1. 新建 `packages/theme/src/skins/<name>.css`。薄皮肤首行 `@import './_base.css';` 复用中性底，再覆盖差异令牌；也可以像 `qing-hui` 一样写全量令牌。
2. 同时提供 `:root:not([data-pactor-theme='dark'])` 与 `[data-pactor-theme='dark']` 两块，各自声明 `color-scheme`，并设置 `--theme-source: <种子色>`。
3. 不要定义任何 `--pactor-control-*` 令牌（密度契约）。
4. 在 `packages/theme/themes.json` 注册 `name` / `label` / `labelEn` / `family` / `familyEn` / `color` / `source` / `sourceEn` / `kind`。
5. 在 `packages/theme/src/loaders.ts` 加一行字面量动态导入（保证打包器静态切分）：
   ```ts
   'my-theme': () => import('../skins/my-theme.css').then((m) => m.default),
   ```
6. 运行 `pnpm --filter @pactor-app/theme build:skins`，提交生成的 `skins/<name>.css`，再跑 `test` 与 `test:dist`。

---

## 6. 字体与字号

### 6.1 字体族

| 令牌 | 默认 | 作用域 |
| --- | --- | --- |
| `--font-sans` | `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, …` | `body` 全局，子元素继承 |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, …` | 行内代码、`Kbd`、代码块 |
| `--pactor-chat-font-display` | `'Songti SC', 'Noto Serif SC', Georgia, serif` | Chat 空状态问候、chat 标题 |

改字体只需重定义 `--font-sans`（和需要时的 `--font-mono`）：

```css
:root {
  --font-sans: 'MiSans', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Menlo, monospace;
}
```

配合 `next/font`：

```tsx
const sans = MiSans({ subsets: ['latin'], variable: '--font-misans' });
<html className={sans.variable}>
```

```css
:root { --font-sans: var(--font-misans), 'PingFang SC', sans-serif; }
```

> 字体文件通过 `@font-face` 或 `next/font` 提供；令牌只负责"用哪一族"。

### 6.2 字号层级

两套标尺并存，各管一段：

**① 文本标尺（Tailwind，预编译为 `font-size: var(--text-*)`）**

| 类 | 令牌 | 默认 | 典型用途 |
| --- | --- | --- | --- |
| `text-xs` | `--text-xs` | 12px | 徽标、辅助注释 |
| `text-sm` | `--text-sm` | 14px | 表格正文、表单、说明 |
| `text-base` | `--text-base` | 16px | 默认正文 |
| `text-lg` | `--text-lg` | 18px | 卡片标题 |
| `text-xl` | `--text-xl` | 20px | 区块标题 |
| `text-2xl` | `--text-2xl` | 24px | 页面标题 |
| `text-3xl` | `--text-3xl` | 30px | 大标题 |
| `text-4xl` | `--text-4xl` | 36px | 首屏标题 |

每个字号都带 `--text-*--line-height` 配对变量；覆盖字号时要同时给出行高比例，否则行距错乱。

**② 控件标尺（密度令牌）**

| 令牌 | default | compact | comfortable |
| --- | --- | --- | --- |
| `--pactor-control-text-sm` | 12px | 12px | 13px |
| `--pactor-control-text-md` | 14px | 13px | 15px |
| `--pactor-control-text-lg` | 16px | 14px | 17px |

DSL `Text` 的 `size`、按钮/输入框/表格/菜单文本都读这套；`Text size: small/large` 直接映射 `--pactor-control-text-sm/lg`。

**③ 整体缩放**：`html { font-size: 15px }` 会让全部 rem 尺寸（文字 + 间距）等比缩小；只想改文字时用 ①/②。

---

## 7. 尺寸、间距与形状

### 7.1 全局密度

`<html data-pactor-size="compact | comfortable">`，不设置 = default。

| 令牌 | default | compact | comfortable |
| --- | --- | --- | --- |
| `--pactor-control-height-xs` | 1.5rem | 1.25rem | 1.75rem |
| `--pactor-control-height-sm` | 2rem | 1.75rem | 2.25rem |
| `--pactor-control-height-md` | 2.25rem | 2rem | 2.5rem |
| `--pactor-control-height-lg` | 2.5rem | 2.25rem | 3rem |
| `--pactor-control-box` | 1rem | 0.875rem | 1.125rem |
| `--pactor-menu-item-padding-y` | 0.375rem | 0.25rem | 0.5rem |
| `--pactor-menu-nav-padding-y` | 0.5rem | 0.375rem | 0.625rem |
| `--pactor-table-head-height` | 2.5rem | 2rem | 3rem |
| `--pactor-table-cell-padding-y` | 0.5rem | 0.25rem | 0.75rem |
| `--pactor-calendar-day-size` | 2rem | 1.75rem | 2.25rem |
| `--pactor-switch-track-w/h` | 2rem / 1.15rem | 1.75rem / 1rem | 2.25rem / 1.25rem |
| `--pactor-slider-track-size` | 0.375rem | 0.25rem | 0.5rem |
| `--pactor-kbd-size` | 1.25rem | 1.125rem | 1.375rem |
| `--pactor-panel-padding` | 1.5rem | 1.25rem | 1.75rem |
| `--pactor-card-padding` | 1rem | 0.75rem | 1.25rem |
| `--pactor-alert-padding-y` | 0.75rem | 0.5rem | 1rem |

> 源码以 rem 声明，表中按 16px 根字号换算；`html { font-size }` 变化时同比缩放。

令牌覆盖范围：

| 令牌组 | 覆盖组件 |
| --- | --- |
| `--pactor-control-height-xs/sm/md/lg` | Button、Input、Select、Tabs、表单控件族 |
| `--pactor-control-text-sm/md/lg` | 控件文本、菜单项、表格、DSL `Text` small/large |
| `--pactor-control-box` | Checkbox、Radio、Switch / Slider 拇指、Alert 图标、弹层关闭钮 |
| `--pactor-menu-item-padding-y`、`--pactor-menu-nav-padding-y` | Dropdown / Context / Menubar 菜单项、DSL `Menu`、AdminLayout 导航行 |
| `--pactor-table-head-height`、`--pactor-table-cell-padding-y` | Table、DatePicker 面板 |
| `--pactor-switch-track-w/h`、`--pactor-slider-track-size`、`--pactor-kbd-size` | Switch、Slider、Kbd |
| `--pactor-panel-padding`、`--pactor-card-padding`、`--pactor-alert-padding-y` | Dialog、AlertDialog、Empty、Card、Alert、Drawer、Sheet、Popover、HoverCard |

运行时 API：

```ts
import { applyGlobalSize, applyGlobalSizeValues } from '@pactor-app/ui';

applyGlobalSize('compact');                       // compact | default | comfortable
applyGlobalSizeValues({                           // 三档之外的自定义数值
  heightMd: '40px',
  textMd: '15px',
  panelPadding: '28px',
  cardPadding: '20px',
});
```

`applyGlobalSizeValues` 写入 `documentElement` 内联变量，参数即完整覆盖集（未给出的键会被清除），传 `null` 恢复档位。DSL 侧 `UserMenu` 设 `showSize: true` 即可暴露三档切换（持久化 `pactor.size`）。

### 7.2 间距令牌

| 令牌 | 默认 | 用途 |
| --- | --- | --- |
| `--spacing` | 0.25rem | Tailwind 间距基准（4px 栅格） |
| `--flex-gap` | 12px | `Flex` 未指定 gap 时的默认值 |
| `--flex-gap-sm/md/lg` | 8 / 16 / 24px | 以基准按 0.67 / 1.33 / 2 派生，`gap: small/middle/large` 读它 |
| `--grid-gap` | 16px | `Grid` 默认间距 |
| `--pactor-panel-padding` | 1.5rem | Dialog / Drawer / Sheet / Popover / Empty |
| `--pactor-card-padding` | 1rem | Card / Alert 横向 / Drawer 头尾 |
| `--pactor-alert-padding-y` | 0.75rem | Alert 纵向内边距 |
| `--pactor-menu-item-padding-y` | 0.375rem | Dropdown / Context / Menubar 菜单项 |
| `--pactor-menu-nav-padding-y` | 0.5rem | DSL Menu / AdminLayout 导航行 |
| `--pactor-table-head-height` | 2.5rem | 表头行高 |
| `--pactor-table-cell-padding-y` | 0.5rem | 单元格纵向内边距 |

规范：优先用组件 props（`gap: small/middle/large`、`padding` 档位），少写散落的 margin；页面级布局间距用 4px 的整数倍。

### 7.3 圆角

只改 `--radius`（默认 `0.625rem`），其余按比例派生：

| 工具类 | 计算 | 默认结果 |
| --- | --- | --- |
| `rounded-sm` | `calc(var(--radius) * 0.6)` | 6px |
| `rounded-md` | `calc(var(--radius) * 0.8)` | 8px |
| `rounded-lg` | `var(--radius)` | 10px |
| `rounded-xl` | `× 1.4` | 14px |
| `rounded-2xl` | `× 1.8` | 18px |
| `rounded-3xl` | `× 2.2` | 22px |
| `rounded-4xl` | `× 2.6` | 26px |

Chat 另有一套独立阶梯：`--pactor-chat-radius-sm/md/lg/xl = 6 / 8 / 16 / 26px`，不随 `--radius` 变化，需要成套改。

### 7.4 阴影、遮罩与背景

| 令牌 | 默认 | 说明 |
| --- | --- | --- |
| `--card-shadow` | `none` | Card 静止态阴影；皮肤可给 `0 4px 16px …` |
| `--shadow-color` | `oklch(0 0 0 / 10%)` | 阴影基色，供派生阴影引用 |
| `--overlay-background` | `oklch(0 0 0 / 50%)` | Dialog / Drawer 遮罩 |
| `--login-panel-shadow` | 两层投影 | 仅 blocks `Login` 浮层卡默认开启 |
| `--background-image` | `none` | 页面背景图/渐变，可写 `linear-gradient(...)` |

### 7.5 动效

| 令牌 | 默认 |
| --- | --- |
| `--ease-ui-out` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| `--ease-ui-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` |
| `--duration-ui-fast` | 150ms |
| `--duration-ui-base` | 200ms |
| `--duration-ui-slow` | 320ms |

`--ease-*` 会生成 `ease-*` 工具类；时长用 `duration-(--duration-ui-base)`。系统开启"减弱动效"时，pactor 组件（`[data-slot]` 子树）的动画与过渡被压到 0.001ms，必要动效可加 `data-motion="essential"` 豁免。

---

## 8. 完整语义令牌清单

### A. 核心语义色（22）

`--background`、`--foreground`、`--card`、`--card-foreground`、`--popover`、`--popover-foreground`、`--primary`、`--primary-foreground`、`--secondary`、`--secondary-foreground`、`--muted`、`--muted-foreground`、`--accent`、`--accent-foreground`、`--destructive`、`--destructive-foreground`、`--success`、`--warning`、`--info`、`--border`、`--input`、`--ring`。

> `--input` 与 `--ring` 常被漏掉，但它们是表单与焦点态的关键。

### B. 图表（5）

`--chart-1` … `--chart-5`。图表同时读 `--foreground`（主文本）、`--muted-foreground`（轴标签）、`--border`（网格）、`--card`（tooltip 底）、`--success/warning/destructive/info`（语义系列）。

### C. 侧栏（8）

| 令牌 | 默认指向 |
| --- | --- |
| `--sidebar` | `var(--card)` |
| `--sidebar-foreground` | `var(--card-foreground)` |
| `--sidebar-primary` | `var(--primary)`（暗色为独立蓝色） |
| `--sidebar-primary-foreground` | `var(--primary-foreground)` |
| `--sidebar-accent` | `var(--accent)` |
| `--sidebar-accent-foreground` | `var(--accent-foreground)` |
| `--sidebar-border` | `var(--border)` |
| `--sidebar-ring` | `var(--ring)` |

### D. 组件级（30）

| 令牌 | 默认 |
| --- | --- |
| `--input-background` | `var(--card)` |
| `--input-foreground` | `var(--card-foreground)` |
| `--switch-track` | `var(--input)` |
| `--switch-track-checked` | `var(--primary)` |
| `--switch-thumb` | `var(--card)` |
| `--slider-track` | `var(--muted)` |
| `--slider-range` | `var(--primary)` |
| `--slider-thumb` | `var(--card)` |
| `--radio-border` | `var(--input)` |
| `--radio-checked` | `var(--primary)` |
| `--progress-track` | `var(--muted)` |
| `--progress-indicator` | `var(--primary)` |
| `--pagination-active-background` | `var(--card)` |
| `--pagination-active-border` | `var(--border)` |
| `--pagination-active-radius` | `calc(var(--radius) * 0.8)` |
| `--menu-hover-background` | `var(--accent)` |
| `--menu-hover-foreground` | `var(--accent-foreground)` |
| `--menu-active-background` | `var(--accent)` |
| `--menu-active-foreground` | `var(--accent-foreground)` |
| `--bubble-background` | `oklch(from var(--primary) 0.93 calc(c * 0.4) h)` |
| `--bubble-hover-background` | `oklch(from var(--primary) 0.88 calc(c * 0.5) h)` |
| `--calendar-day-hover-background` / `-foreground` | `accent` / `accent-foreground` |
| `--calendar-selected-background` / `-foreground` | `primary` / `primary-foreground` |
| `--calendar-today-background` / `-foreground` / `-border` | `accent` / `accent-foreground` / `primary` |
| `--calendar-range-background` / `-foreground` | `accent` / `accent-foreground` |

命名规则：`--<component>-<part>-<state>`，默认值必须经 `var()` 回退到语义令牌，保证"只换语义令牌时组件仍合理"。

### E. 尺寸/密度（20）

`--pactor-control-height-xs/sm/md/lg`、`--pactor-control-text-sm/md/lg`、`--pactor-control-box`、`--pactor-menu-item-padding-y`、`--pactor-menu-nav-padding-y`、`--pactor-table-head-height`、`--pactor-table-cell-padding-y`、`--pactor-calendar-day-size`、`--pactor-switch-track-w/h`、`--pactor-slider-track-size`、`--pactor-kbd-size`、`--pactor-panel-padding`、`--pactor-card-padding`、`--pactor-alert-padding-y`。

### F. 布局/间距/形状（13）

`--radius`、`--sidebar-width`（16rem）、`--sidebar-width-icon`（3rem）、`--flex-gap`、`--flex-gap-sm/md/lg`、`--grid-gap`、`--background-image`、`--card-shadow`、`--shadow-color`、`--overlay-background`、`--login-panel-shadow`。

### G. 字体/字号（10）

`--font-sans`、`--font-mono`、`--text-xs`、`--text-sm`、`--text-base`、`--text-lg`、`--text-xl`、`--text-2xl`、`--text-3xl`、`--text-4xl`。每个 `--text-*` 都有配套的 `--text-*--line-height`，覆盖字号时需成对修改。

### H. Chat（约 43）

**颜色/表面**：`--pactor-chat-bg`、`--pactor-chat-sidebar-bg`、`--pactor-chat-side-panel-bg`、`--pactor-chat-fg`、`--pactor-chat-muted`、`--pactor-chat-muted-fg`、`--pactor-chat-card`、`--pactor-chat-border`、`--pactor-chat-primary`、`--pactor-chat-primary-fg`、`--pactor-chat-danger`、`--pactor-chat-danger-bg`、`--pactor-chat-success`、`--pactor-chat-user-bubble-bg`、`--pactor-chat-user-bubble-border`、`--pactor-chat-code-bg`、`--pactor-chat-inspector-bg`。

**产出物 tone（8）**：`--pactor-chat-artifact-tone-{green,blue,amber,violet}-{fg,bg}`（唯一一组写死色值的 chat 令牌，可在皮肤中覆盖）。

**圆角/阴影**：`--pactor-chat-radius`、`--pactor-chat-radius-sm/md/lg/xl`、`--pactor-chat-shadow-sm`、`--pactor-chat-shadow-composer`。

**字体/几何**：`--pactor-chat-font-display`、`--pactor-chat-shell-topbar-height`、`--pactor-chat-shell-scrim`、`--pactor-chat-inspector-width/min-width/max-width`、`--pactor-chat-content-width`、`--pactor-chat-content-gutter`、`--pactor-chat-header-height`、`--pactor-chat-rail-width`、`--pactor-chat-rail-popover-width`。

Chat 颜色令牌默认写成 `var(--语义令牌, <兜底色>)`：覆盖核心语义令牌时 chat 自动跟随；要精调再直接覆盖 `--pactor-chat-*`。

### I. Markdown（8）

`--pactor-markdown-fg`、`--pactor-markdown-muted-fg`、`--pactor-markdown-border`、`--pactor-markdown-muted-bg`、`--pactor-markdown-code-bg`、`--pactor-markdown-link`、`--pactor-markdown-quote-border`、`--pactor-markdown-radius`。全部在 `.pactor-markdown` 作用域内，默认引用同名语义令牌。

### J. 动效（5）

`--ease-ui-out`、`--ease-ui-in-out`、`--duration-ui-fast`、`--duration-ui-base`、`--duration-ui-slow`。

### 皮肤/壳层专用（补充）

| 令牌 | 定义方 | 用途 |
| --- | --- | --- |
| `--theme-source` | 皮肤文件 | 皮肤种子色，供 `color-mix` / `oklch(from …)` 派生整套色阶 |
| `--rail-background` / `--rail-foreground` | 宿主可选 | `@pactor-app/shell` 左侧图标栏底色与前景；不设时用该包兜底值 |

---

## 9. 如何自定义

### 9.1 决策路径

```text
要改整体品牌色 / 字体 / 圆角 / 密度？
  → 新建 theme.css，在 pactor-app/styles.css 之后导入（§9.2 / §9.3）

只改某类控件尺寸或字重？
  → 覆盖密度令牌，或 applyGlobalSizeValues（§7.1）

只改单个页面 / 单个组件？
  → DSL props：className / style / Text size / Typography variant（§9.4）

要做结构性改造（横幅、强调条、特殊卡片）？
  → theme.css 里用 [data-slot='…'] 选择器（§9.4）

要多套主题、用户可切？
  → @pactor-app/theme + SkinHeadScript + SkinGallery（§5.2 / §9.6）

要换整个 UI 实现？
  → componentRegistry / layoutRegistry 槽位替换（超出本文范围）
```

### 9.2 品牌主题模板

```css
/* src/styles/theme.css —— 必须在 pactor-app/styles.css 之后加载 */

@font-face {
  font-family: 'MiSans';
  src: url('/fonts/MiSans-Regular.woff2') format('woff2');
  font-display: swap;
}

/* ---------- 亮色 ---------- */
:root:not([data-pactor-theme='dark']) {
  color-scheme: light;

  --font-sans: 'MiSans', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;

  --background: oklch(0.995 0.002 250);
  --foreground: oklch(0.18 0.012 255);
  --card: oklch(1 0 0);
  --card-foreground: var(--foreground);
  --popover: oklch(1 0 0);
  --popover-foreground: var(--foreground);

  --primary: oklch(0.55 0.16 255);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.965 0.008 255);
  --secondary-foreground: oklch(0.24 0.012 255);
  --muted: oklch(0.965 0.006 255);
  --muted-foreground: oklch(0.52 0.02 255);
  --accent: oklch(0.95 0.02 255);
  --accent-foreground: oklch(0.24 0.012 255);

  --destructive: oklch(0.58 0.22 27);
  --destructive-foreground: oklch(0.985 0 0);
  --success: oklch(0.64 0.15 160);
  --warning: oklch(0.75 0.16 70);
  --info: oklch(0.62 0.19 260);

  --border: oklch(0.915 0.006 255);
  --input: oklch(0.86 0.006 255);
  --ring: var(--primary);

  --chart-1: oklch(0.62 0.18 255);
  --chart-2: oklch(0.66 0.14 175);
  --chart-3: oklch(0.58 0.16 305);
  --chart-4: oklch(0.74 0.15 75);
  --chart-5: oklch(0.66 0.18 25);

  --radius: 8px;
  --sidebar-width: 15.5rem;
  --background-image: none;
  --card-shadow: 0 1px 2px oklch(0 0 0 / 6%);
  --shadow-color: oklch(0.2 0.02 255 / 10%);
}

/* ---------- 暗色 ---------- */
[data-pactor-theme='dark'] {
  color-scheme: dark;

  --font-sans: 'MiSans', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;

  --background: oklch(0.155 0.012 255);
  --foreground: oklch(0.955 0.006 255);
  --card: oklch(0.205 0.012 255);
  --card-foreground: var(--foreground);
  --popover: oklch(0.215 0.012 255);
  --popover-foreground: var(--foreground);

  --primary: oklch(0.74 0.13 255);
  --primary-foreground: oklch(0.16 0.012 255);
  --secondary: oklch(0.27 0.012 255);
  --secondary-foreground: var(--foreground);
  --muted: oklch(0.265 0.01 255);
  --muted-foreground: oklch(0.72 0.015 255);
  --accent: oklch(0.3 0.015 255);
  --accent-foreground: var(--foreground);

  --destructive: oklch(0.7 0.19 22);
  --destructive-foreground: oklch(0.16 0.012 255);
  --success: oklch(0.72 0.14 162);
  --warning: oklch(0.79 0.15 72);
  --info: oklch(0.74 0.14 258);

  --border: oklch(1 0 0 / 12%);
  --input: oklch(1 0 0 / 26%);
  --ring: var(--primary);

  --chart-1: oklch(0.7 0.16 255);
  --chart-2: oklch(0.74 0.13 175);
  --chart-3: oklch(0.72 0.15 305);
  --chart-4: oklch(0.8 0.14 75);
  --chart-5: oklch(0.74 0.16 25);

  --card-shadow: none;
  --shadow-color: oklch(0 0 0 / 40%);
  --overlay-background: oklch(0 0 0 / 60%);
}
```

### 9.3 颜色体系：该改哪些

按投入从低到高选一档：

**① 最低必改集（4 个，另 1 个可选）——只换品牌主色**

| 令牌 | 原因 |
| --- | --- |
| `--primary` | 按钮、选中、链接、图表联动 |
| `--primary-foreground` | 与 primary 配对，不会自动推导 |
| `--ring` | 焦点环，漏改会残留旧色 |
| `--chart-1` | 主系列色，通常与品牌色同相 |
| `--pactor-chat-primary` | 可选；默认桥接 primary，通常无需 |

**② 标准换肤集（17 个）——换一整套中性色 + 品牌色**

`--background`、`--foreground`、`--card`、`--card-foreground`、`--popover`、`--popover-foreground`、`--primary`、`--primary-foreground`、`--secondary`、`--secondary-foreground`、`--muted`、`--muted-foreground`、`--accent`、`--accent-foreground`、`--border`、`--input`、`--ring`。

**③ 完整品牌集（27 个）——含状态色与图表**

在 ② 基础上加 `--destructive(-foreground)`、`--success`、`--warning`、`--info`、`--chart-1..5`。

**不需要改的**（随上游自动跟随）：

- `--sidebar*`（别名到 card/primary/accent/border/ring）——除非侧栏要独立配色
- `--bubble-*`、`--calendar-*`、`--switch-*`、`--slider-*`、`--progress-*`、`--pagination-*`、`--menu-*`——默认引用语义令牌
- `--input-background` / `--input-foreground`——默认 `var(--card)`

**必须成对提供**：亮色与暗色各一份同名令牌。只写亮色时，暗色会退回包内默认灰，表现为"切暗色变回未换肤"。

**暗色调整原则**：表面 L 提 4%~6%，品牌色 L 提到 0.7~0.8、C 降到 0.1~0.15，`border/input` 改半透明白。不要直接复制亮色值。

### 9.4 组件级与页面级样式

**① DSL props（首选）**

```yaml
- type: Text
  props:
    text: 本月营收
    type: secondary          # default | secondary | success | warning | danger
    size: small              # small(12) / middle(继承) / large(16)
    strong: true

- type: Typography
  props: { variant: h2, text: 客户概览 }   # h1~h4 / p / lead / muted / small

- type: Card
  props:
    className: brand-highlight-card
    style: { borderRadius: 16 }
```

`className` / `style` 是**组件 props**，不是节点字段；以 `skills/pactor-dsl/references/component-contracts.md` 列出的支持范围为准（`Page`、`Card`、`Flex`、`Text`、`Typography` 等布局与展示组件均支持）。

**② 自定义类（写在 theme.css 或 page.css）**

```css
.brand-highlight-card {
  border-color: color-mix(in oklab, var(--primary) 35%, var(--border));
  background: color-mix(in oklab, var(--primary) 6%, var(--card));
}
```

注意：预建 `styles.css` 只包含组件自身用到的工具类。业务 YAML 里的 Tailwind 工具类（如 `bg-(--muted)`）只有在宿主项目自己也接入了 Tailwind 时才会生成；否则请用 `style` 或自定义类名。

**③ 结构选择器（不改组件、不改 YAML）**

`data-slot` 是稳定结构钩子，适合"全局某类卡片统一加装饰"：

```css
/* 带指标数字的卡片加左侧强调条 */
[data-slot='card']:has([data-slot='statistic']) {
  border-left: 3px solid var(--primary);
}

/* 内容区首个 Alert 作为欢迎横幅 */
[data-slot='page-content'] > [data-slot='alert']:first-child {
  border-color: transparent;
  background: linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 75%, var(--foreground)));
  color: var(--primary-foreground);
}
```

**④ 页面级样式**：页面专属 CSS 单独成文件，导入顺序放在 `theme.css` 之后；不要为了一个页面去改全局令牌。

**⑤ 自定义组件**：React 组件照常写，样式用语义令牌（`var(--card)` / `var(--muted-foreground)`），再经 `components: { MyCard }` 注册；不要在组件里写死品牌色。

### 9.5 DSL 样式红线

- 不写死颜色（`#1677ff`、`rgb(...)`）——换肤与暗色必破。
- 不用 `opacity` 做次级文字，用 `--muted-foreground`。
- 不用内联 `fontSize` 绕过字号体系；优先 `Text size` / `Typography variant` / 密度令牌。
- 不靠 `!important` 抢层级；把覆盖文件放在正确顺序即可。
- 不复制组件的 Tailwind 类名去"仿制"组件；用 `data-slot` 或 props。

### 9.6 运行时换肤与设置入口

```ts
import { applyTheme, applyCustomTheme, subscribeTheme } from '@pactor-app/theme';

// 内置皮肤（懒加载 + 持久化 + 事件）
await applyTheme('qing-ming');

// 任意品牌 CSS（同步注入，默认不持久化）
applyCustomTheme('brand-2026', `
  :root:not([data-pactor-theme='dark']) { --primary: oklch(0.52 0.13 180); }
  [data-pactor-theme='dark'] { --primary: oklch(0.78 0.11 180); }
`);

// 跨标签页同步
subscribeTheme((name, detail) => {
  if (detail.source === 'storage') void applyTheme(name);
});
```

现成入口：

| 入口 | 说明 |
| --- | --- |
| `SkinHeadScript` | 根 layout `<head>` 内联防闪烁脚本（皮肤 link + 明暗属性） |
| `SkinGallery` | 完整主题设置页（外观模式 + 皮肤卡片网格），也可作 DSL `type: SkinGallery` |
| `SkinSwitcher` | 下拉式皮肤切换，可放进侧栏/用户菜单 |
| `UserMenu` + `showSize/showTheme` | 用户菜单内联切换明暗与密度 |
| `applyGlobalSizeValues` | 三档之外的自定义尺寸 |

持久化键约定：`pactor.theme`（皮肤）、`pactor.mode`（明暗）、`pactor.size`（密度）、`pactor.locale`（语言）。

---

## 10. 主题皮肤设置最佳实践

### 10.1 可定制边界：六层，按稳定性从高到低

| 层 | 能改什么 | 手段 | 稳定性 |
| --- | --- | --- | --- |
| 1 设计令牌 | 全站颜色、字体、字号、圆角、间距、阴影、动效、侧栏、Chat、Markdown、图表 | 覆盖 CSS 变量（`:root` / `[data-pactor-theme='dark']`） | **契约级**，跨版本稳定 |
| 2 结构样式 | 某个组件的内部布局、装饰、追加伪元素 | `[data-slot='…']` 选择器 | 半稳定：结构可能随大版本调整 |
| 3 组件外观 | 单个组件的变体、尺寸、语义色、局部样式 | DSL props：`variant` / `size` / `type` / `className` / `style` | 稳定，但仅限声明了这些 props 的组件 |
| 4 外壳与布局 | 导航、头部、侧栏、主题设置入口、全局 Provider | `layoutRegistry`、`headerExtra`、`providers`、自定义组件 | 稳定（公开 API） |
| 5 页面样式 | 单页专属排版与装饰 | 独立 page.css + 作用域类名 | 稳定，但只影响该页 |
| 6 替换实现 | 整套组件/布局换成自研 | `componentRegistry` / `layoutRegistry` 槽位 | 需跟进包版本，成本最高 |

**不可改**：包内源码、预建 `styles.css`（构建产物）、组件内部的 Tailwind 工具类名（可能随构建变化）、DSL 节点级 `className`（不是节点字段）。

### 10.2 想改什么 → 改哪个令牌

| 想改的效果 | 令牌 | 备注 |
| --- | --- | --- |
| 页面底色 / 卡片 / 弹层 | `--background`、`--card`、`--popover`（各带 `-foreground`） | 三个表面拉开层次，别都设成纯白 |
| 正文 / 次要文字 | `--foreground`、`--muted-foreground` | 不要用 opacity 造次级文字 |
| 主色 / 次级按钮 | `--primary`、`--secondary`（各带 `-foreground`） | 主色只做强调 |
| 选中 / hover 底色 | `--accent`、`--accent-foreground` | 比 `--muted` 更强调；菜单 hover 引用它 |
| 弱化底色 | `--muted`、`--muted-foreground` | 表头、代码块、占位 |
| 成功 / 警告 / 信息 / 危险 | `--success`、`--warning`、`--info`、`--destructive`（+ `-foreground`） | 只表达语义，不做装饰 |
| 分割线 / 输入框描边 / 焦点环 | `--border`、`--input`、`--ring` | 三者分工不同，不要合并 |
| 图表系列 | `--chart-1..5` | 按顺序取色，最多 5 个系列 |
| 侧栏 | `--sidebar*`、`--sidebar-width`、`--sidebar-width-icon` | 默认别名到 card/primary/accent/border/ring |
| 壳层图标栏 | `--rail-background`、`--rail-foreground` | 仅 `@pactor-app/shell` |
| 圆角 | `--radius` | 按比例派生（sm 0.6× ~ 4xl 2.6×），改一个即可 |
| 卡片 / 浮层阴影 | `--card-shadow`、`--shadow-color` | 弹层阴影用 `shadow-color` 加透明度 |
| 遮罩 | `--overlay-background` | Dialog / Drawer |
| 页面背景图 / 渐变 | `--background-image` | 作用在 `body` |
| 登录卡阴影 | `--login-panel-shadow` | blocks `Login`，可只在 `[data-slot='login']` 内覆盖 |
| 字体族 | `--font-sans`、`--font-mono`、`--pactor-chat-font-display` | 前两个全局，最后一个是 Chat 展示字体 |
| 文本字号 | `--text-xs` … `--text-4xl`（含 `--text-*--line-height`） | 成对改字号与行高 |
| 控件字号 | `--pactor-control-text-sm/md/lg` | 随密度档位 |
| 控件高度 | `--pactor-control-height-xs/sm/md/lg` | 优先用 `data-pactor-size` |
| 布局间距 | `--flex-gap`、`--flex-gap-sm/md/lg`、`--grid-gap` | Flex/Grid 默认值 |
| 面板 / 卡片 / 表格内边距 | `--pactor-panel-padding`、`--pactor-card-padding`、`--pactor-table-*` | 面板类组件共用 |
| 菜单行高 / 导航行距 | `--pactor-menu-item-padding-y`、`--pactor-menu-nav-padding-y` | Dropdown 与侧栏导航 |
| 开关 / 滑块 / 单选 / 进度 | `--switch-*`、`--slider-*`、`--radio-*`、`--progress-*` | 默认引用 primary/muted，精调才覆盖 |
| 日历 / 气泡 / 分页 | `--calendar-*`、`--bubble-*`、`--pagination-*` | 同上 |
| Chat 工作区 | `--pactor-chat-*` | 默认桥接语义令牌，精调再覆盖 |
| Markdown 排版 | `--pactor-markdown-*` | 作用域 `.pactor-markdown` |
| 过渡曲线 / 时长 | `--ease-ui-*`、`--duration-ui-*` | 不要逐组件写 transition |

### 10.3 覆盖顺序：先语义，后组件，最后结构

```text
① 语义令牌（22 + chart + sidebar）     ← 90% 的皮肤只需要这一层
② 字号/圆角/间距（密度走 data-pactor-size） ← 品牌版式差异
③ 组件级令牌（switch/slider/calendar…） ← 语义层表达不了时
④ [data-slot] 结构样式                  ← 结构性品牌化（横幅、强调条）
⑤ 替换组件/布局实现                     ← 最后手段
```

每上升一层，升级兼容成本增加一档。能停在 ① 就不要写 ③/④。

### 10.4 皮肤文件标准结构

```css
/**
 * 皮肤：brand-2026（品牌蓝）
 * 种子色：#2F6BFF
 * 适用：SaaS 控制台；亮/暗双模式
 * 加载：pactor-app/styles.css 之后
 */

:root { --theme-source: #2f6bff; }

/* 亮色 */
:root:not([data-pactor-theme='dark']) {
  color-scheme: light;
  --background: color-mix(in srgb, var(--theme-source) 3%, #fff);
  --foreground: color-mix(in srgb, var(--theme-source) 12%, #16191d);
  --card: #fff;
  --card-foreground: var(--foreground);
  --popover: #fff;
  --popover-foreground: var(--foreground);
  --primary: oklch(from var(--theme-source) 0.52 0.16 h);
  --primary-foreground: #fff;
  --secondary: color-mix(in srgb, var(--theme-source) 7%, #fff);
  --secondary-foreground: var(--foreground);
  --muted: color-mix(in srgb, var(--theme-source) 5%, #fff);
  --muted-foreground: color-mix(in srgb, var(--foreground) 55%, #fff);
  --accent: color-mix(in srgb, var(--theme-source) 11%, #fff);
  --accent-foreground: var(--foreground);
  --border: color-mix(in srgb, var(--theme-source) 14%, #e8ebef);
  --input: color-mix(in srgb, var(--theme-source) 22%, #dfe3e9);
  --ring: var(--primary);
  --chart-1: var(--primary);
  --chart-2: oklch(from var(--theme-source) 0.62 0.14 200);
  --chart-3: oklch(from var(--theme-source) 0.58 0.15 310);
  --chart-4: oklch(from var(--theme-source) 0.72 0.14 80);
  --chart-5: oklch(from var(--theme-source) 0.62 0.17 25);
  --card-shadow: 0 1px 2px oklch(0 0 0 / 6%);
}

/* 暗色 */
[data-pactor-theme='dark'] {
  color-scheme: dark;
  --background: color-mix(in srgb, var(--theme-source) 6%, #0f1216);
  --foreground: #e9edf2;
  --card: color-mix(in srgb, var(--theme-source) 6%, #171b20);
  --card-foreground: var(--foreground);
  --popover: color-mix(in srgb, var(--theme-source) 6%, #1a1f24);
  --popover-foreground: var(--foreground);
  --primary: oklch(from var(--theme-source) 0.76 0.12 h);
  --primary-foreground: #10141a;
  --secondary: color-mix(in srgb, var(--theme-source) 14%, #1c2127);
  --secondary-foreground: var(--foreground);
  --muted: color-mix(in srgb, var(--theme-source) 9%, #20252b);
  --muted-foreground: #a7b0ba;
  --accent: color-mix(in srgb, var(--theme-source) 18%, #22282f);
  --accent-foreground: var(--foreground);
  --border: oklch(1 0 0 / 12%);
  --input: oklch(1 0 0 / 26%);
  --ring: var(--primary);
  --chart-1: var(--primary);
  --chart-2: oklch(from var(--theme-source) 0.72 0.13 200);
  --chart-3: oklch(from var(--theme-source) 0.7 0.14 310);
  --chart-4: oklch(from var(--theme-source) 0.8 0.13 80);
  --chart-5: oklch(from var(--theme-source) 0.72 0.15 25);
  --card-shadow: none;
  --shadow-color: oklch(0 0 0 / 40%);
}
```

约定：

- 文件头写清**皮肤名 / 种子色 / 适用场景**，方便后来人维护。
- 薄皮肤可以 `@import './_base.css'` 复用中性底，只写差异令牌（官方 13 套薄皮肤源文件约 1.7KB）。
- 只覆盖需要的令牌，其余继承基础样式；不要整份复制 `:root`。
- 亮/暗两块都写，且都声明 `color-scheme`。

### 10.5 单一种子色派生（官方皮肤做法）

官方皮肤的整套色阶来自一个种子色，避免维护十几组散色：

| 用途 | 配方 | 说明 |
| --- | --- | --- |
| 表面（background/card/muted/accent） | `color-mix(in srgb, var(--theme-source) 3%~18%, #fff)` | 种子占比越低越接近中性白，越高越"带品牌味" |
| 文字（foreground） | `color-mix(in srgb, var(--theme-source) 12%~15%, #16191d)` | 种子少量混入近黑，保留品牌色相但可读 |
| 主色（primary） | 亮 `L=0.40~0.52`，暗 `L=0.76~0.78`；`C` 暗色乘 0.65 | 暗色必须提亮、降饱和 |
| 描边（border/input） | `color-mix(种子 14%~22%, 中性灰)` | 比纯灰更有品牌感，但不抢视线 |
| 图表 | `--chart-1: var(--primary)`，其余同明度、换色相 | 保证系列色明度一致 |

浏览器要求：`color-mix()` 与相对色 `oklch(from …)` 需要 Chrome 119+ / Safari 16.4+ / Firefox 128+。要兼容更老的浏览器，把派生结果预先算成字面值写死。

### 10.6 场景配方

**A. 只换品牌主色（最小改动）**

```css
:root:not([data-pactor-theme='dark']) {
  --primary: oklch(0.52 0.16 255);
  --ring: var(--primary);
  --chart-1: var(--primary);
}
[data-pactor-theme='dark'] {
  --primary: oklch(0.76 0.12 255);
  --ring: var(--primary);
  --chart-1: var(--primary);
}
```

**B. 白标 / 多租户**

- 每租户一份 CSS（或 `applyCustomTheme(tenantId, css, { persist: false })`）。
- 自定义皮肤不会被 `readStoredTheme` 识别，租户→皮肤的映射由宿主自己存（数据库 / 租户配置），首屏用 `SkinHeadScript` 同款内联脚本按租户写 `<link>`。
- 不要用一个巨型 CSS 里堆 `[data-tenant='x']` 选择器：体积与缓存都不划算，按租户拆文件更好。

**C. 纯暗色产品**

```html
<html data-pactor-theme="dark">
```

仍然建议提供亮色块：打印、嵌入第三方、部分用户强制浅色时不会变成"默认灰"。

**D. 高密度数据后台**

```html
<html data-pactor-size="compact">
```

需要更细的数值再用 `applyGlobalSizeValues({ textMd: '13px', heightMd: '32px' })`。不要用皮肤在 `:root` 写 `--pactor-control-*`：皮肤晚于基础样式加载、且 `:root` 与 `[data-pactor-size]` 同优先级，会把三档预设一起压掉。

**E. 品牌字体**

```css
@font-face { font-family: 'MiSans'; src: url('/fonts/MiSans.woff2') format('woff2'); font-display: swap; }
:root { --font-sans: 'MiSans', 'PingFang SC', sans-serif; }
```

中文字体务必带系统回退；只加载用到的字重，避免首屏阻塞。

**F. 品牌登录页 / 落地页**

```css
[data-slot='login'] {
  --login-panel-shadow: 0 24px 60px -20px oklch(0 0 0 / 30%);
  background-image: radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%);
}
```

登录块的分栏比例用 `brandRatio` prop（内部写成 `--login-grid`），最小高度可用 `--login-min-h` 覆盖（如嵌入定高预览框时设 `100%`）。

**G. Chat 独立配色**

```css
:root {
  --pactor-chat-bg: var(--background);
  --pactor-chat-sidebar-bg: color-mix(in srgb, var(--card) 92%, var(--primary));
  --pactor-chat-user-bubble-bg: color-mix(in oklab, var(--primary) 10%, var(--background));
  --pactor-chat-content-width: 860px;
}
```

只改 `--pactor-chat-*`，不要动 `.pactor-chat-*` 结构类。

### 10.7 切换、持久化与首屏

推荐链路（shell 已内建，自研照抄）：

```text
<html data-requested-skin> + <head> 内联脚本
   → 同步插入 <link rel="stylesheet" data-pactor-skin="x" href="/themes/x.css">
   → 同步恢复 data-pactor-theme（light/dark）
   → 首屏无闪烁
运行时切换
   → applyTheme(next) 懒加载 CSS
   → 复用唯一 <style data-pactor-theme-style>
   → 写 data-pactor-skin + localStorage
   → 派发 pactor:theme-change / pactor:skin-change（图表重绘）
```

要点：

- **持久化键统一**：`pactor.theme` / `pactor.mode` / `pactor.size` / `pactor.locale`。
- **显式明暗**：皮肤用 `:root:not([data-pactor-theme='dark'])` 后，宿主必须写 `light` 或 `dark`，不能只依赖系统偏好。
- **只替换一个样式节点**：不要"先删后插"，会闪白；`applyTheme` 已处理并发切换。
- **跨标签页**：监听 `storage` 与 `pactor:theme-change`，第二标签页跟随。
- **先加载后切换**：新皮肤 CSS `load` 完成再移除旧节点；或像 `applyTheme` 一样复用节点写内容。
- **设置入口位置**：用户菜单（`showTheme` / `showSize`）放轻量开关；完整皮肤画廊放独立"外观设置"页（`SkinGallery`）。

### 10.8 可访问性

- 正文对比度 ≥ 4.5:1，大字 ≥ 3:1；换肤后必须重新量，不能凭肉眼。
- 焦点环不能省：`--ring` 要与非同色背景有可见差异；暗色下不要用半透明主色当焦点环。
- 状态不只靠颜色：`success/warning/destructive` 同时配图标或文案。
- 图表系列色要色盲可辨：避免只靠红/绿区分，保证明度差。
- 支持 200% 字号缩放：不要给容器写死高度（用 `min-height`）。
- 尊重 `prefers-reduced-motion`：pactor 组件已内建降级，自研动画要自己处理。
- 表单错误态用 `--destructive` 描边 + 文案，不只变红。

### 10.9 性能

- 皮肤只写差异令牌；薄皮肤构建后约 8KB，`portal` 这类 full 皮肤约 36KB，按需懒加载。
- 不要在皮肤里写大段结构样式与动画；结构样式留给 10.3 的第 ④ 层（`data-slot`）。
- 字体用 woff2 + `font-display: swap`，首屏只加载实际字重。
- 避免给大面积元素加 `filter` / 多层 `box-shadow`；阴影用 `--shadow-color` 统一控制。
- 运行时只改 CSS 变量或属性，不要用 JS 逐节点写内联样式（`applyGlobalSizeValues` 除外，它是刻意的全局覆盖）。
- 令牌统一定义在 `:root`，避免在深层容器重复声明导致样式重算范围扩大。

### 10.10 升级兼容

- 语义令牌是**稳定契约**；组件级令牌次之；`data-slot` 是半稳定；内部工具类名不是契约。
- 不复制包内组件源码来"改一点样式"，否则失去后续修复。
- `@pactor-app/theme` 的皮肤与 `@pactor-app/ui` 版本同步升级；升级后跑 `pnpm --filter @pactor-app/theme check:skins`。
- 主题相关改动加回归：亮/暗 × 至少两套皮肤 × 三档密度。
- 自研皮肤用独立文件与版本号，跟随品牌 CI 发布，不混进业务代码。

### 10.11 验收矩阵

| 维度 | 取值 | 必查 |
| --- | --- | --- |
| 明暗 | light / dark / 跟随系统 | 无死色、无白块、对比度 |
| 皮肤 | 默认 + 每个已注册皮肤 | 全站（含图表、Chat、Markdown）随肤 |
| 密度 | default / compact / comfortable | 表格、表单、面板无溢出 |
| 页面 | 登录、列表、详情、表单、Dashboard、Chat | 弹层、焦点、空态、错误态 |
| 首屏 | 刷新 / 直接访问深链 | 无主题闪烁 |
| 多标签 | 两个标签切换皮肤 | 同步跟随 |
| 缩放 | 90% / 125% / 200% | 文字不截断、布局不塌 |

### 10.12 反模式（补充）

| 反模式 | 后果 |
| --- | --- |
| 把令牌写在页面容器而非 `:root` | portal 弹层（Select/Tooltip/Dialog）读不到 |
| 皮肤里定义 `--pactor-control-*` | 密度三档失效，与官方契约冲突 |
| 用 `[data-tenant]` 堆一套巨型 CSS | 体积大、缓存差、难维护 |
| 只给亮色块 | 暗色退回默认灰 |
| 依赖 `:root` 的系统暗色媒体查询 | 加载皮肤后永远亮色 |
| 直接改 `.pactor-chat-*` 结构类 | 升级易碎；应改 `--pactor-chat-*` 令牌 |
| 用 `!important` 覆盖令牌 | 皮肤/暗色互相打架 |
| 一个皮肤里写动画与大段布局 | 首屏变慢，且难以复用 |

---

## 11. 验收清单

- [ ] 亮/暗各切一次：无白块、无死色、无对比度异常
- [ ] 每个已注册皮肤切一次：全站（含图表、Chat、Markdown）随肤变化
- [ ] 三档密度各切一次：表格行高、表单高度、面板间距同步变化，无溢出
- [ ] 焦点态：Tab 走一遍表单，焦点环颜色与主色一致
- [ ] 弹层：Tooltip / Select / Dropdown / Dialog 在暗色下背景与描边正常（令牌必须定义在 `:root`）
- [ ] 图表：系列色、轴标签、tooltip 底随皮肤/暗色变化
- [ ] 首屏：刷新无主题闪烁（有皮肤时检查 `<link data-pactor-skin>` 是否在 `<head>` 同步插入）
- [ ] 自定义字体：中英文回退正常，无 FOIT/布局跳动
- [ ] 浏览器缩放 90%~125%：字号不溢出、按钮文字不换行截断

---

## 12. 反模式

| 反模式 | 后果 | 正确做法 |
| --- | --- | --- |
| 直接改 `packages/ui/styles.css` | 升级即丢失；破坏包契约 | 新建 theme.css 覆盖 |
| 只写亮色令牌 | 切暗色退回默认灰 | 两套块都写 |
| 在容器上写 `:root` 级令牌 | portal 弹层读不到 | 令牌统一挂 `:root` |
| 用 `#hex` 写组件样式 | 暗色/换肤失效 | `var(--semantic)` |
| 只改 `--primary` | 焦点环、侧栏主色残留 | 同步 `--ring`、`--sidebar-primary`（或确认别名已覆盖） |
| 手改聚合 `pactor-app/styles.css` | 构建产物被覆盖 | 改源包后 `pnpm build:styles` |
| 用 `!important` 抢层级 | 皮肤/暗色互相打架 | 调整导入顺序，或用 `data-slot` 提高选择器精度 |

---

## 13. 参考实现

| 主题 | 位置 |
| --- | --- |
| 令牌与基础层 | `packages/ui/src/styles.css` |
| 语义令牌 → 工具类桥 | `packages/ui/src/theme-bridge.css` |
| 示例皮肤（覆盖 + 结构定制） | `examples/admin/src/theme.css` |
| 皮肤设置面板 | `examples/admin/src/SkinSettings.tsx`、`examples/admin/src/skin.ts` |
| 预置皮肤 | `packages/theme/src/skins/*.css`、`packages/theme/themes.json` |
| 换肤运行时 | `packages/theme/src/index.ts`、`applyTheme` / `applyCustomTheme` |
| 首屏防闪烁 | `packages/shell/src/skin/SkinHeadScript.tsx` |
| 主题画廊/切换器 | `packages/shell/src/client/SkinGallery.tsx`、`SkinSwitcher.tsx` |
| 图表主题解析 | `packages/chart/src/components/lib/theme.ts` |
| Chat 令牌 | `packages/chat/src/styles.css` |
| Markdown 令牌 | `packages/markdown/styles.css` |

本地可视化调令牌：`pnpm --filter theme-studio dev`（导出的 CSS 即皮肤文件）。
