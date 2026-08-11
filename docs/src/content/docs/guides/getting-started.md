---
title: 快速开始
description: 环境要求、安装、构建与测试，以及一个端到端的最小示例
---

Pactor 是一套基于 YAML/JSON DSL 的 Server-Driven UI 前端运行时框架。本页介绍如何在 Monorepo 中开发、pactor-app 一站式用法，以及基础模块的最小使用示例。

## 环境要求

- Node.js >= 18
- pnpm >= 9

## 安装与常用命令

```bash
pnpm install        # 安装依赖
pnpm build          # 构建全部包（ESM + CJS + d.ts）
pnpm test           # 运行全部测试（含跨包冒烟测试）
pnpm typecheck      # 全部包 TypeScript 检查
```

启动本文档站：

```bash
pnpm docs:dev
```

## 模块概览

| 包 | 目录 | 职责 | 运行时依赖 |
| --- | --- | --- | --- |
| `pactor-core` | `packages/core` | DSL 协议类型 + 通用 Registry | 无 |
| `pactor-schema` | `packages/schema` | JSON Schema + Ajv 校验器 | `ajv` |
| `pactor-expression` | `packages/expression` | 受控表达式引擎 | 无 |
| `pactor-runtime` | `packages/runtime` | Runtime 引擎（上下文 / 状态 / 数据源 / 动作 / 渲染） | `react`（peer） |
| `pactor-permission` | `packages/permission` | 权限（PermissionStore / 权限适配器 / Menu & Page 守卫 / 表达式函数） | 无 |
| `pactor-resource` | `packages/resource` | DSL 资源加载（Envelope / HTTP & Static Loader / 缓存与 ETag） | 无 |
| `pactor-router` | `packages/router` | 路由（MenuRegistry / PathMatcher / 导航桥接 / React Router 绑定） | `react`、`react-router-dom`（peer，仅 react 子入口） |
| `pactor-ui-antd` | `packages/ui-antd` | antd UI kit（components + interaction + layout 三层 + `antdUiKit` 预设） | `react`、`react-dom`、`antd`（peer） |
| `pactor-ui-radix` | `packages/ui-radix` | Radix UI kit（三层 Radix 实现 + `radixUiKit` 预设 + 合并样式表，与 antd 版契约一致） | `@radix-ui/react-*`、`pactor-ui-antd`、`react`（peer） |
| `pactor-markdown` | `packages/markdown` | Markdown（安全渲染器 / 协议白名单 / DSL Markdown 组件） | `react-markdown`、`remark-gfm`、`react`（peer） |
| `pactor-chat` | `packages/chat` | Chat（消息模型 / Streaming reducer / Safe Registry / capability 动作 / ChatView 与 chat 布局） | `react`、`antd`（peer） |
| `pactor-app` | `packages/app` | 一站式组合层（createPactorApplication：启动编排 / 共享注册表 / 动态路由 / mount） | `react`、`react-dom`、`react-router-dom`、`antd`（peer） |
| `pactor-vite-plugin` | `packages/vite-plugin` | Vite 插件（`.page.yaml` / `.fragment.yaml` 构建期转换 / Schema 校验 / HMR） | `yaml`，`vite`（peer） |
| `pactor-cli` | `packages/cli` | 命令行工具（validate / inspect / lint / schema / build / create） | `yaml` |

依赖方向严格单向：`pactor-core` ← `pactor-schema` ← `pactor-expression` ← `pactor-runtime` ← `pactor-ui-antd`；`pactor-permission` 仅依赖 `pactor-core`，结构化兼容 `pactor-runtime` 的适配接口（不产生运行时依赖）；`pactor-resource` 仅依赖 `pactor-core`；`pactor-router` 依赖 `pactor-core` 与 `pactor-permission`，结构化兼容 `pactor-runtime` 的 RouterAdapter；`pactor-ui-antd` 组合 runtime / router / permission；`pactor-ui-radix` 复用 `pactor-ui-antd` 的契约类型与交互核心（type-only + interaction 层运行时复用）；`pactor-app` 站在全部模块之上做一站式组装。

## 一站式用法（pactor-app）

业务工程优先使用 `pactor-app`：一个调用完成启动编排、动态路由、布局与页面运行时组装。**默认 UI kit 为 Radix**（pactor-ui-radix），其无内建样式，样式表导入为必需步骤：

```tsx
import { createPactorApplication } from 'pactor-app';
import 'pactor-ui-radix/styles.css'; // 默认 Radix UI kit 的样式（必需）

createPactorApplication({
  appId: 'risk-admin',

  api: {
    baseURL: '/api/runtime',
  },
}).mount('#root');
```

如需 antd 实现，显式传入 `ui: antdUiKit`（见 [pactor-ui-antd](/packages/ui-antd/)）。

服务端按 Envelope 协议提供 `{baseURL}/bootstrap`（app / user / permissions / menus / layout）与 `{baseURL}/pages/{id}`（Page DSL）端点即可；本地与测试环境可注入 `StaticDslLoader` 替代 `api`。详见 [pactor-app](/packages/app/)。

## 最小示例

校验一份 Page DSL，并求值其中的表达式：

```ts
import { validatePageDsl, DSL_VERSION } from 'pactor-schema';
import { resolveTemplate } from 'pactor-expression';

const pageDsl = {
  dsl: '1.0',
  page: { id: 'customer-list', title: '客户管理', type: 'list' },
  state: { keyword: '' },
  dataSources: {
    customers: {
      type: 'service',
      service: 'customer.list',
      autoLoad: true,
      params: { keyword: '${state.keyword}' },
    },
  },
  body: { type: 'Page', children: [] },
};

// 1. Schema 校验
const result = validatePageDsl(pageDsl);
console.assert(result.valid, result.errors);

// 2. 表达式求值（组装作用域后解析 dataSource 参数）
const scope = { state: { keyword: '张三' } };
const keyword = resolveTemplate(
  pageDsl.dataSources.customers.params.keyword,
  scope,
);
console.log(keyword); // "张三"
```

## 下一步

- [pactor-core](/packages/core/)：DSL 协议类型与 Registry
- [pactor-schema](/packages/schema/)：Schema 校验细节
- [pactor-expression](/packages/expression/)：表达式语法与安全约束
- [pactor-runtime](/packages/runtime/)：Runtime 引擎与 React Renderer
- [pactor-ui-antd](/packages/ui-antd/)：antd UI kit（内置组件 / 交互 / 布局三层 + `antdUiKit` 预设）
- [pactor-ui-radix](/packages/ui-radix/)：Radix UI kit（与 antd 版契约一致，含整站切换 recipe）
- [pactor-permission](/packages/permission/)：权限存储、适配器与守卫
- [pactor-resource](/packages/resource/)：DSL 资源加载、缓存与版本控制
- [pactor-router](/packages/router/)：菜单注册、路径匹配、导航桥接与动态路由
- [pactor-markdown](/packages/markdown/)：安全 Markdown 渲染与 DSL Markdown 组件
- [pactor-chat](/packages/chat/)：AI Message Rendering Protocol 与 Chat Runtime
- [pactor-app](/packages/app/)：一站式组合层（createPactorApplication）
- [框架设计规范](/framework-design/)：完整架构设计
