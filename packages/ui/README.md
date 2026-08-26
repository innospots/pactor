# pactor-ui

[Pactor](https://github.com/426-330/pactor) 的**唯一内置 UI kit**（shadcn 风格）：内含 components / interaction / layout 三层（vendored shadcn/ui 组件源码——Base UI 原语（`@base-ui/react`，shadcn 官方默认原语层）+ cva + tailwind-merge + lucide-react；12 组件 props 契约类型、交互核心 `OverlayManager` / `createUiBridge` / `registerInteractionActions` / `UiBridge`、布局类型与 `resolveLayout` 均为本包自有），并提供 `shadcnUiKit` 预设对象与预建样式表。**这是 pactor-app 的内置默认（也是唯一内置）UI kit**。主入口导出三层全部公开 API 与预设，另提供子路径入口：`pactor-ui/components`（DSL 组件适配层）/ `/interaction` / `/layout` / `/ui`（vendored shadcn 原语组件——宿主自写 React UI 用，如槽位内容与自定义组件）。

## 安装

```bash
npm install pactor-ui pactor-app react react-dom react-router-dom
# 或
pnpm add pactor-ui pactor-app react react-dom react-router-dom
```

`react >= 18`、`react-dom >= 18` 为 peer dependency。消费方**无需安装或配置 Tailwind**——样式在包构建期编译为预建 `styles.css` 随包发布。

## 默认路径（推荐）

不传任何 UI 选项时，`createPactorApplication` 的组件注册表、外壳布局与交互层全部使用本包实现；只需导入预建样式表：

```ts
import { createPactorApplication } from 'pactor-app';
import 'pactor-ui/styles.css';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
}).mount('#root');
```

## 预设对象 shadcnUiKit

显式表达或局部覆盖场景使用 `shadcnUiKit`，一次提供三个槽位：

| 槽位 | 值 |
| --- | --- |
| `componentRegistry` | `createShadcnComponentRegistry`（components 层） |
| `layoutRegistry` | `createShadcnLayoutRegistry`（layout 层） |
| `interactionKit` | `{ Provider: ShadcnInteractionProvider, OverlayHost: ShadcnOverlayHost }`（interaction 层） |

```ts
import { shadcnUiKit } from 'pactor-ui';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
  ui: shadcnUiKit, // 与不传 ui 的默认行为一致
});
```

每个槽位的取值优先级为：**显式细粒度选项 > `ui` 预设 > 内置 shadcn 默认**。例如只覆盖布局层、其余槽位保持 shadcn 预设：

```ts
createPactorApplication({
  appId: 'risk-admin',
  ui: shadcnUiKit,
  layoutRegistry: createMyLayoutRegistry, // 覆盖预设的布局槽位
});
```

## 样式与主题

三层样式经 Tailwind v4 在**包构建期**预编译为单文件样式表（组件 class 为 Tailwind 工具类 + `data-slot` 结构钩子）：

```ts
import 'pactor-ui/styles.css';
```

主题契约为 shadcn 语义令牌：`--background` / `--foreground` / `--card` / `--popover` / `--primary` / `--secondary` / `--muted` / `--accent` / `--destructive` / `--border` / `--input` / `--ring` / `--radius`（另补充 `--success` / `--warning` / `--info` 供 Alert 四态），定义在 `:root`，组件工具类经 `var()` 运行时读取。换肤即覆盖变量；内置暗色皮肤经 `<html data-pactor-theme="dark">`（或任意容器）切换，与全仓约定一致。

**preflight 开启（shadcn 官方基线）**：样式表为完整 `tailwindcss`（含 preflight）+ `tw-animate-css` 动画层 + 官方 base layer 的预编译产物，与 [shadcn 官方主题脚手架](https://ui.shadcn.com/docs/theming)一致——导入 `styles.css` 即接受 shadcn 基线全局样式（box-sizing / 边距归零 / 元素字体继承等），宿主的自定义皮肤 CSS 须在其后导入。令牌组含 chart-1..5 与 sidebar 系列；radius 派生为基于 `--radius` 的乘法比例（0.6/0.8/1/1.4/1.8/2.2/2.6）。

## 独立使用（不经 pactor-app）

以 `createShadcnComponentRegistry()` 创建组件注册表，与 pactor-runtime 直接组合：

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { createShadcnComponentRegistry } from 'pactor-ui/components';
import 'pactor-ui/styles.css';

const runtime = createPageRuntime(pageDsl, {
  components: createShadcnComponentRegistry(),
});

await runtime.initialized;
<PageRuntimeView runtime={runtime} />;
```

布局层（`createShadcnLayoutRegistry` / `registerShadcnLayouts`）与交互层（`ShadcnInteractionProvider` / `ShadcnOverlayHost`）同样可独立组合；交互核心（`OverlayManager` / `createUiBridge` / `registerInteractionActions`）由本包 `pactor-ui/interaction` 导出。

## 聚合 re-export

三层的公开 API 与预设均可直接从本包导入：

```ts
import {
  createShadcnComponentRegistry,
  createShadcnLayoutRegistry,
  ShadcnInteractionProvider,
  ShadcnOverlayHost,
  shadcnUiKit,
  // ...以及三层其余全部导出
} from 'pactor-ui';
```

契约类型（props / layout / interaction）与交互核心均为本包自有定义（自 0.x 的 `unify-ui-shadcn` 变更起；旧 `pactor-ui-antd` / `pactor-ui-radix` 包已删除，等价符号的迁移对照见 docs 的 pactor-ui 章节）。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
