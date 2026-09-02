---
title: "@pactor-app/core"
description: DSL 核心协议类型与通用 Registry —— 零依赖、与 React 无关
---

`@pactor-app/core` 是框架的契约基座：DSL 协议类型（TypeScript）与通用 `Registry<T>` 实现。零运行时依赖，不依赖 React，可在浏览器、Node、构建工具中等任意环境使用。

```bash
pnpm add @pactor-app/core
```

## DSL 节点类型

`DslNode` 是 UI DSL 树的基础节点：

```ts
import type { ActionConfig, DslNode } from '@pactor-app/core';

const node: DslNode = {
  id: 'save-btn',
  type: 'Button',               // 对应 Component Registry 中的注册名
  props: { text: '保存' },
  events: {
    // 单个 Action 或 Action 数组
    onClick: { action: 'submit', params: { id: '${row.id}' } },
  },
  permission: 'customer:edit',  // 或权限码数组
  when: "${state.status == 'ACTIVE'}", // 条件渲染表达式
  children: [{ type: 'Icon', props: { name: 'save' } }],
};
```

相关类型：

| 类型 | 说明 |
| --- | --- |
| `ActionConfig` | 动作配置：`action`（注册名）、`params`、`condition`、`permission` |
| `ConditionConfig` | 条件：表达式字符串，或 `{ expression }` 对象形式 |
| `PermissionConfig` | 权限：权限码字符串或字符串数组 |
| `EventMap` | 事件映射：事件名 → 单个或多个 `ActionConfig` |

## DSL 文档结构类型

```ts
import type { PageDsl, FragmentDsl, ApplicationDsl } from '@pactor-app/core';

const page: PageDsl = {
  dsl: '1.0',                    // DSL Specification Version，必填
  requires: { runtime: '>=1.0.0' },
  page: { id: 'customer-list', title: '客户管理', type: 'list' },
  state: { keyword: '' },
  dataSources: {
    customers: {
      type: 'service',           // http | service | static | computed | resource
      service: 'customer.list',
      autoLoad: true,
      params: { keyword: '${state.keyword}' },
    },
  },
  lifecycle: { onInit: [], onLoad: [] },
  body: { type: 'Page', children: [] },
};
```

| 类型 | 说明 |
| --- | --- |
| `PageDsl` | Page DSL 根结构：`dsl` / `requires` / `page` / `state` / `dataSources` / `lifecycle` / `body` |
| `FragmentDsl` | 可复用 UI 片段 |
| `ApplicationDsl` | 应用级 DSL：布局、主题、导航模式 |
| `DataSourceConfig` | 数据源配置（http / service / static / computed / resource） |
| `RequiresConfig` | 能力声明：`runtime` 与 `components` 的版本范围 |
| `LifecycleConfig` | 生命周期：`onInit` / `onLoad` / `onReady` / `onShow` / `onHide` / `onDestroy` |

## Registry

所有动态能力（Component / Action / Service / Capability / Expression Function）都通过 Registry 管理：

```ts
import { Registry } from '@pactor-app/core';

const components = new Registry<ComponentRenderer>('ComponentRegistry');

components.register('Button', ButtonRenderer);
components.get('Button');       // ButtonRenderer
components.get('Missing');      // undefined（不抛错）
components.has('Button');       // true
components.list();              // ['Button']
components.unregister('Button'); // true

components.register('Button', Other);
// Error: [ComponentRegistry] duplicate registration: "Button"
```

行为约定：

- 重复注册同名条目**抛出错误**（信息中包含名称与 Registry 标签）。
- 获取未注册条目返回 `undefined`，不抛错。

## Runtime Scope

运行时作用域层级常量，自外向内排列：

```ts
import { RUNTIME_SCOPES, type RuntimeScope } from '@pactor-app/core';

RUNTIME_SCOPES;
// ['global', 'app', 'page', 'overlay', 'form', 'component', 'row', 'event']
```
