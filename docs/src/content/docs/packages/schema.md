---
title: "@pactor-app/schema"
description: DSL 版本常量、JSON Schema 与基于 Ajv 的结构化校验器
---

`@pactor-app/schema` 提供 DSL 版本常量、Page DSL 与 DslNode 的 JSON Schema，以及输出结构化错误的校验器。用于 DSL 发布前校验、服务端/CLI 复用 Schema、以及 Runtime 加载前检查。

```bash
pnpm add @pactor-app/schema
```

## DSL 版本

```ts
import { DSL_VERSION } from '@pactor-app/schema';

DSL_VERSION; // "1.0"
```

DSL 文档根节点必须携带 `dsl` 字段声明其遵循的规范版本，Runtime 加载前据此做能力校验（capability validation）。

## 校验 Page DSL

```ts
import { validatePageDsl } from '@pactor-app/schema';

const result = validatePageDsl(pageDsl);

if (!result.valid) {
  for (const error of result.errors) {
    console.error(`${error.path}: ${error.message} (${error.keyword})`);
  }
}
```

`validatePageDsl` 返回：

```ts
interface DslValidationResult {
  valid: boolean;
  errors: DslValidationError[];
}

interface DslValidationError {
  path: string;    // 字段路径，如 "/page/id"、"/body/children/0/type"
  message: string; // 人类可读描述
  keyword: string; // Ajv 错误关键字，如 "required"、"type"、"enum"
}
```

特点：

- **结构化错误**：不暴露 Ajv 原始错误对象；`required` 错误的路径精确到缺失的字段。
- **多错误聚合**：`allErrors` 模式，一次返回全部错误。
- **递归校验**：`body` 及任意深度的 `children` 均按 DslNode Schema 校验。

## 校验范围

Schema 覆盖 Page DSL 标准根结构：

| 字段 | 约束 |
| --- | --- |
| `dsl` | 必填，非空字符串（DSL Specification Version） |
| `requires` | 可选；`runtime` / `components` 均为 semver range 字符串 |
| `page` | 必填；`page.id` 必填，支持 `title` / `type` / `permission` |
| `state` | 可选，任意对象 |
| `dataSources` | 可选；`type` 限定为 `http` / `service` / `static` / `computed` / `resource` |
| `lifecycle` | 可选；仅允许 `onInit` / `onLoad` / `onReady` / `onShow` / `onHide` / `onDestroy` |
| `body` | 可选，DslNode 递归结构 |

DslNode 层校验：`type` 必填、`children` 递归、`events` 为 Action 配置或其数组、`permission` / `when` 格式。

:::note
组件存在性、Action 存在性等需要 Registry 上下文的校验不在本包范围内，由上层（CLI / Runtime）结合 Registry 完成。
:::

## 直接使用 JSON Schema

如需在校验器之外复用 Schema（例如服务端校验、生成表单），可直接导入：

```ts
import {
  pageDslSchema,
  dslNodeSchema,
  actionConfigSchema,
  PAGE_DSL_SCHEMA_ID,
  DSL_NODE_SCHEMA_ID,
  ACTION_CONFIG_SCHEMA_ID,
} from '@pactor-app/schema';
```

Schema 之间通过 `$id` / `$ref` 关联，使用时需将全部 Schema 注册到同一个 Ajv 实例。
