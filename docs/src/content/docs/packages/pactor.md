---
title: pactor（meta）
description: Pactor 聚合安装包——一次安装全部 @pactor/* 模块，入口转发 @pactor/app 的一站式 API
---

`pactor` 是聚合安装包（meta package）：`npm install pactor` 一次带入全部 `@pactor/*` 模块（`@pactor/skill` 除外），入口直接转发 `@pactor/app` 的一站式 API，适合想快速拿到完整框架的使用者。

```bash
pnpm add pactor
```

## 使用

```tsx
import { createPactorApplication } from 'pactor';
import '@pactor/ui/styles.css'; // shadcn kit 预建样式（必需）

createPactorApplication({
  appId: 'my-app',
  api: { baseURL: '/api/dsl' },
}).mount('#root');
```

更细粒度的 API 仍从对应模块导入（meta 包已把它们全部装好）：

```ts
import { StaticDslLoader } from '@pactor/resource';
import type { DslNode } from '@pactor/core';
```

## 与按需安装的关系

| 方式 | 适用 |
| --- | --- |
| `pnpm add pactor` | 完整应用，一次装齐（含 CLI 与 Vite 插件） |
| `pnpm add @pactor/app @pactor/ui` | 只装应用运行时与 UI kit |
| `pnpm add @pactor/core` 等单模块 | 只要某一个能力（如校验、表达式、Vite 插件） |

两种方式可混用：meta 包只是依赖聚合，与各模块版本统一发布，不存在功能差异。

## 包含的模块

`@pactor/app`、`@pactor/chat`、`@pactor/cli`、`@pactor/core`、`@pactor/expression`、`@pactor/markdown`、`@pactor/permission`、`@pactor/resource`、`@pactor/router`、`@pactor/runtime`、`@pactor/schema`、`@pactor/ui`、`@pactor/vite-plugin`（版本随 meta 包统一）。
