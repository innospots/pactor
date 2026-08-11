# pactor-ui-radix

[Pactor](https://github.com/426-330/pactor) 的 Radix UI kit 单元：内含 components / interaction / layout 三层 Radix 实现（与 [pactor-ui-antd](../ui-antd) 契约一致，不依赖 antd），并提供 `radixUiKit` 预设对象与三层合并样式表，一行导入完成 pactor-app 的整站 Radix 切换。主入口导出三层全部公开 API，另提供 `pactor-ui-radix/components` / `/interaction` / `/layout` 子路径入口。

## 安装

```bash
npm install pactor-ui-radix pactor-app react react-dom react-router-dom
# 或
pnpm add pactor-ui-radix pactor-app react react-dom react-router-dom
```

`react >= 18`、`react-dom >= 18` 为 peer dependency。

## 整站切换（推荐路径）

```ts
import { createPactorApplication } from 'pactor-app';
import { radixUiKit } from 'pactor-ui-radix';
import 'pactor-ui-radix/styles.css';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
  ui: radixUiKit,
});
```

`radixUiKit` 一次提供三个槽位：

| 槽位 | 值 |
| --- | --- |
| `componentRegistry` | `createRadixComponentRegistry`（components 层） |
| `layoutRegistry` | `createRadixLayoutRegistry`（layout 层） |
| `interactionKit` | `{ Provider: RadixInteractionProvider, OverlayHost: RadixOverlayHost }`（interaction 层） |

每个槽位的取值优先级为：**显式细粒度选项 > `ui` 预设 > 内置 antd 默认**。例如只覆盖布局层、其余槽位保持 Radix 预设：

```ts
createPactorApplication({
  appId: 'risk-admin',
  ui: radixUiKit,
  layoutRegistry: createMyLayoutRegistry, // 覆盖预设的布局槽位
});
```

## 样式

三层样式（组件 / 布局 / 交互）合并为单文件样式表，全部为 `.pcr-*` 语义 class：

```ts
import 'pactor-ui-radix/styles.css';
```

样式表内置 token 化主题体系：色板 / 语义 / 形状三层 CSS 变量、美观的默认亮色皮肤与内置暗色皮肤（`<html data-pactor-theme="dark">`）。换肤（覆盖变量 / 暗色切换 / class 覆盖）与完整 token 清单见主题指南 `docs/src/content/docs/guides/theming.md`。

## 聚合 re-export

三层的公开 API 均可直接从本包导入：

```ts
import {
  createRadixComponentRegistry,
  createRadixLayoutRegistry,
  RadixOverlayHost,
  // ...以及三层其余全部导出
} from 'pactor-ui-radix';
```

各层的能力、契约一致性与边界说明，见完整文档。契约类型与交互核心（OverlayManager / 交互动作 / UiBridge）复用 `pactor-ui-antd`（type-only + interaction 层运行时复用），本包不引入 antd。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
