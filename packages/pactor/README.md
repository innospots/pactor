# pactor-app

[Pactor](https://github.com/426-330/pactor) 的聚合安装包（meta package）：一次安装完整的 Server-Driven UI + AI-Native 运行时栈，入口转发 `@pactor-app/app` 的一站式 API（`createPactorApplication`）。

## 安装

```bash
npm install pactor-app
# 或
pnpm add pactor-app
```

安装后会一并带入全部 `@pactor-app/*` 模块（core / schema / expression / runtime / resource / permission / router / ui / markdown / chat / app / cli / vite-plugin）。

## 示例

```tsx
import { createPactorApplication } from 'pactor-app';
import '@pactor-app/ui/styles.css';

const app = createPactorApplication({
  appId: 'my-app',
  api: { baseUrl: '/api/dsl' },
});

app.mount('#root');
```

## 按需安装

只需要单个模块时，可以不装本包，直接安装对应模块：

```bash
npm install @pactor-app/core         # DSL 协议类型与 Registry（零依赖、React 无关）
npm install @pactor-app/vite-plugin  # Vite 插件：.page.yaml 编译 + HMR
npm install @pactor-app/cli          # DSL 工具链（validate / inspect / lint / build / create）
```

各模块说明见 [packages 文档](https://github.com/426-330/pactor/tree/main/packages)。
