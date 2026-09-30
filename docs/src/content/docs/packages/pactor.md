---
title: pactor-app（meta）
description: Pactor 聚合安装包——一次安装全部 @pactor-app/* 模块，入口转发 @pactor-app/app 的一站式 API
---

`pactor-app` 是聚合安装包（meta package）：`npm install pactor-app` 一次带入全部 `@pactor-app/*` 模块（`@pactor-app/skills` 除外），入口直接转发 `@pactor-app/app` 的一站式 API，适合想快速拿到完整框架的使用者。

```bash
pnpm add pactor-app
```

## 使用

```tsx
import { createPactorApplication } from 'pactor-app';
import '@pactor-app/ui/styles.css'; // shadcn kit 预建样式（必需）

createPactorApplication({
  appId: 'my-app',
  api: { baseURL: '/api/dsl' },
}).mount('#root');
```

更细粒度的 API 仍从对应模块导入（meta 包已把它们全部装好）：

```ts
import { StaticDslLoader } from '@pactor-app/resource';
import type { DslNode } from '@pactor-app/core';
```

## 与按需安装的关系

| 方式 | 适用 |
| --- | --- |
| `pnpm add pactor-app` | 完整应用，一次装齐（含 CLI 与 Vite 插件） |
| `pnpm add @pactor-app/app @pactor-app/ui` | 只装应用运行时与 UI 包 |
| `pnpm add @pactor-app/core` 等单模块 | 只要某一个能力（如校验、表达式、Vite 插件） |

两种方式可混用：meta 包只是依赖聚合，与各模块版本统一发布，不存在功能差异。

## 包含的模块

`@pactor-app/app`、`@pactor-app/chat`、`@pactor-app/cli`、`@pactor-app/core`、`@pactor-app/expression`、`@pactor-app/markdown`、`@pactor-app/permission`、`@pactor-app/resource`、`@pactor-app/router`、`@pactor-app/runtime`、`@pactor-app/schema`、`@pactor-app/ui`、`@pactor-app/vite-plugin`（版本随 meta 包统一）。
