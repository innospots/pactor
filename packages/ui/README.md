# @pactor-app/ui

[Pactor](https://github.com/innospots/pactor) 的**内置默认 UI 实现**（shadcn 风格）：内含 components / interaction / layout 三层（vendored shadcn/ui 组件源码——Base UI 原语（`@base-ui/react`，shadcn 官方默认原语层）+ cva + tailwind-merge + lucide-react；12 组件 props 契约类型、交互核心 `OverlayManager` / `createUiBridge` / `registerInteractionActions` / `UiBridge`、布局类型与 `resolveLayout` 均为本包自有），并提供预建样式表。**这是 @pactor-app/app 的内置默认 UI 实现**。主入口导出三层全部公开 API，另提供子路径入口：`@pactor-app/ui/components`（DSL 组件适配层）/ `/interaction` / `/layout` / `/ui`（vendored shadcn 原语组件——宿主自写 React UI 用，如槽位内容与自定义组件）。

## 安装

```bash
npm install @pactor-app/ui @pactor-app/app react react-dom react-router-dom
# 或
pnpm add @pactor-app/ui @pactor-app/app react react-dom react-router-dom
```

`react >= 18`、`react-dom >= 18` 为 peer dependency。消费方**无需安装或配置 Tailwind**——样式在包构建期编译为预建 `styles.css` 随包发布。

## 默认路径（推荐）

不传任何 UI 选项时，`createPactorApplication` 的组件注册表、外壳布局与交互层全部使用本包实现；只需导入预建样式表：

```ts
import { createPactorApplication } from '@pactor-app/app';
import '@pactor-app/ui/styles.css';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
}).mount('#root');
```

## 自定义覆盖点

业务可用 `createPactorApplication` 的细粒度选项逐槽位覆盖默认实现：

| 槽位 | 默认值 |
| --- | --- |
| `componentRegistry` | `createComponentRegistry`（components 层） |
| `layoutRegistry` | `createLayoutRegistry`（layout 层） |
| `interactionKit` | `{ Provider: InteractionProvider, OverlayHost: OverlayHost }`（interaction 层） |

各槽位独立合并，显式传入的选项优先于内置默认。例如只覆盖布局层、其余槽位保持内置默认：

```ts
import { createLayoutRegistry } from '@pactor-app/ui/layout';

createPactorApplication({
  appId: 'risk-admin',
  layoutRegistry: () => {
    const registry = createLayoutRegistry();
    registry.register('my-layout', MyLayout);
    return registry;
  },
});
```

## 样式与主题

三层样式经 Tailwind v4 在**包构建期**预编译为单文件样式表（组件 class 为 Tailwind 工具类 + `data-slot` 结构钩子）：

```ts
import '@pactor-app/ui/styles.css';
```

主题契约为 shadcn 语义令牌：`--background` / `--foreground` / `--card` / `--popover` / `--primary` / `--secondary` / `--muted` / `--accent` / `--destructive` / `--border` / `--input` / `--ring` / `--radius`（另补充 `--success` / `--warning` / `--info` 供 Alert 四态），定义在 `:root`，组件工具类经 `var()` 运行时读取。换肤即覆盖变量；内置暗色皮肤经 `<html data-pactor-theme="dark">`（或任意容器）切换，与全仓约定一致。

**皮肤令牌契约（CSS 皮肤文件）**：组件全部颜色/阴影/圆角经令牌解析（无硬编码颜色），宿主在 `styles.css` 之后加载一个普通 CSS 文件即可完整换肤，运行时替换样式表节点即切换皮肤，无需重建。语义令牌之上还有组件级令牌（命名 `--<component>-<part>-<state>`，默认值经 `var()` 回退到语义令牌）覆盖 Switch/Slider/Radio/Progress/Pagination/Menu 系 hover 与选中/Bubble/Calendar/卡片阴影/弹层阴影色/模态遮罩；页面背景经 `--background`（纯色）+ `--background-image`（渐变/图片，默认 `none`）承接，字体族经 `--font-sans`。令牌可用 theme-studio（`pnpm --filter theme-studio dev`）可视化编辑并导出皮肤 CSS。

**全局密度（尺寸档位）**：除颜色外，控件尺寸同样是皮肤契约。`<html data-pactor-size="compact | comfortable">` 切换整页密度（不设置 = default 档，即内置现行尺寸，默认视觉零变化）；属性也可挂在任意容器上经变量继承局部生效。令牌族：

| 分组 | 令牌 | 覆盖组件 |
| --- | --- | --- |
| 控件高度 | `--pactor-control-height-xs/sm/md/lg` | Button / Input / Select / Tabs / 表单控件族等 |
| 控件字号 | `--pactor-control-text-sm/md/lg` | 控件文本、菜单项、表格、DSL Text small/large |
| 控件盒 | `--pactor-control-box` | Checkbox / Radio / Switch / Slider 拇指、Alert 图标、弹层关闭钮 |
| 菜单 / 导航 | `--pactor-menu-item-padding-y`、`--pactor-menu-nav-padding-y` | Dropdown/Context/Menubar 菜单项；DSL Menu 与 AdminLayout 导航行 |
| 表格 / 日历 | `--pactor-table-head-height`、`--pactor-table-cell-padding-y`、`--pactor-calendar-day-size` | Table / DatePicker 面板 |
| 轨道几何 | `--pactor-switch-track-w/h`、`--pactor-slider-track-size`、`--pactor-kbd-size` | Switch / Slider / Kbd |
| 面板间距 | `--pactor-panel-padding`、`--pactor-card-padding`、`--pactor-alert-padding-y` | Dialog / AlertDialog / Empty / Card / Alert / Drawer / Sheet / Popover / HoverCard |

切换入口：DSL `UserMenu` 设 `showSize: true`（受控 `size` / `onSizeChange`，非受控持久化 `pactor.size`）；自定义组件用包根导出的 `applyGlobalSize(size)` / `readGlobalSize()`（写/读同一属性即可）。三档之外自定义数值用 `applyGlobalSizeValues({ heightMd: '40px', panelPadding: '28px', ... })`——写入 documentElement 内联变量，优先级 **内联自定义值 > 档位预设 > `:root` default**；参数即完整覆盖集（未给出的键会移除既有覆盖），传 `null` 清除全部。皮肤 CSS 直接覆盖令牌即可改基准值：

```css
:root { --pactor-control-height-md: 2.5rem; }            /* 改 default 档基准 */
[data-pactor-size='compact'] { --pactor-panel-padding: 1rem; }  /* 按档覆盖 */
```

需要首屏防闪烁的宿主可在 HTML 头部内联脚本提前写 `data-pactor-size`（与暗色主题同一手法）。完整演示见 `examples/admin`（SkinSettings 面板：密度三档 + 控件高度 / 面板间距滑杆）。

**preflight 开启（shadcn 官方基线）**：样式表为完整 `tailwindcss`（含 preflight）+ `tw-animate-css` 动画层 + 官方 base layer 的预编译产物，与 [shadcn 官方主题脚手架](https://ui.shadcn.com/docs/theming)一致——导入 `styles.css` 即接受 shadcn 基线全局样式（box-sizing / 边距归零 / 元素字体继承等），宿主的自定义皮肤 CSS 须在其后导入。令牌组含 chart-1..5 与 sidebar 系列；radius 派生为基于 `--radius` 的乘法比例（0.6/0.8/1/1.4/1.8/2.2/2.6）。

## 独立使用（不经 @pactor-app/app）

以 `createComponentRegistry()` 创建组件注册表，与 @pactor-app/runtime 直接组合：

```tsx
import { createPageRuntime, PageRuntimeView } from '@pactor-app/runtime';
import { createComponentRegistry } from '@pactor-app/ui/components';
import '@pactor-app/ui/styles.css';

const runtime = createPageRuntime(pageDsl, {
  components: createComponentRegistry(),
});

await runtime.initialized;
<PageRuntimeView runtime={runtime} />;
```

布局层（`createLayoutRegistry` / `registerBuiltinLayouts`）预注册五种内置布局：admin / blank / login / landing / chat；与交互层（`InteractionProvider` / `OverlayHost`）同样可独立组合。交互核心（`OverlayManager` / `createUiBridge` / `registerInteractionActions`）由本包 `@pactor-app/ui/interaction` 导出。

## 聚合 re-export

三层的公开 API 均可直接从本包导入：

```ts
import {
  createComponentRegistry,
  createLayoutRegistry,
  InteractionProvider,
  OverlayHost,
  // ...以及三层其余全部导出
} from '@pactor-app/ui';
```

契约类型（props / layout / interaction）与交互核心均为本包自有定义。

## 文档

完整文档见 <https://github.com/innospots/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
