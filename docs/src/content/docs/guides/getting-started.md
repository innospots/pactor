---
title: 快速开始
description: 环境要求、安装、构建与测试，以及一个端到端的最小示例
---

Pactor 是一套基于 YAML/JSON DSL 的 Server-Driven UI 前端运行时框架。本页介绍如何在 Monorepo 中开发，以及三个基础模块的最小使用示例。

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
| `pactor-components` | `packages/components` | 内置组件（12 个 V1 组件的 antd 适配层） | `react`、`antd`（peer） |

依赖方向严格单向：`pactor-core` ← `pactor-schema` ← `pactor-expression` ← `pactor-runtime` ← `pactor-components`；`pactor-permission` 仅依赖 `pactor-core`，结构化兼容 `pactor-runtime` 的适配接口（不产生运行时依赖）。

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
- [pactor-permission](/packages/permission/)：权限存储、适配器与守卫
- [框架设计规范](/framework-design/)：完整架构设计
