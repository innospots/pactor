# pactor-ui-antd

[Pactor](https://github.com/426-330/pactor) 的 antd UI kit 单元：内含 components（12 个 V1 DSL 组件的 antd 适配层）、interaction（Overlay 堆栈管理 + 交互动作 + antd 渲染层）、layout（AdminLayout 等应用外壳）三层实现，并导出 `antdUiKit` 预设对象（与 `pactor-ui-radix` 的 `radixUiKit` 对称）。主入口导出三层全部公开 API，另提供 `pactor-ui-antd/components` / `/interaction` / `/layout` 子路径入口。

## 安装

```bash
pnpm add pactor-ui-antd
```

## 用法

```tsx
import { createPactorApplication } from 'pactor-app';
import { antdUiKit } from 'pactor-ui-antd';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
  ui: antdUiKit,
}).mount('#root');
```

不传 `ui` 时 pactor-app 的内置默认即 antd 实现，两者行为一致。预设对象的价值在于显式表达与局部覆盖：

```tsx
createPactorApplication({
  appId: 'risk-admin',
  ui: antdUiKit,
  // 显式细粒度选项优先于预设：仅布局换自研，其余保持 antd
  layoutRegistry: createMyLayoutRegistry,
});
```

## 说明

- 三层实现均在本包内（`src/components` / `src/interaction` / `src/layout`）。
- antd v5+ 为 CSS-in-JS，**无需导入样式表**；如需全局 reset 样式可自行 `import 'antd/dist/reset.css'`。
- 切换 Radix 见 [pactor-ui-radix](https://github.com/426-330/pactor/tree/main/packages/ui-radix)。

## License

[MIT](../../LICENSE)
