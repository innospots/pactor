---
title: "@pactor/cli"
description: Pactor 命令行工具——本地 DSL 开发工具链（validate / inspect / lint / schema / build / create）
---

`@pactor/cli`（bin `pactor`）是本地 DSL 开发工具链：校验 DSL 文件、输出结构摘要、静态检查、导出 JSON Schema、编译为 Runtime Envelope JSON、从模板生成业务工程。零 React 依赖，要求 Node.js >= 18。

```bash
pnpm add -g @pactor/cli
```

## 退出码

| 退出码 | 语义 |
| --- | --- |
| `0` | 成功（lint 仅 warning 也算成功） |
| `1` | 校验或 lint 失败（lint 存在 error；build 校验失败中止） |
| `2` | 用法错误（缺参数、文件/路径不存在、目标目录非空等） |

## pactor validate

逐文件解析并校验：page 走完整 Schema 校验（@pactor/schema `validatePageDsl`），fragment 宽松检查（存在 `dsl` 与 `body`）。与 @pactor/vite-plugin 构建期校验同语义。

```bash
pactor validate src/pages/home.page.yaml src/fragments/card.fragment.yaml
```

- 全部通过：输出汇总，退出码 0
- 任一失败：输出 `<file>: path: message (keyword)` 明细，退出码 1
- 无参数或文件不存在：退出码 2

## pactor inspect

输出单个 DSL 文件的结构摘要：page id/title/type、状态键、dataSources（type/service）、组件类型计数（递归 body）、事件动作清单、permission 引用、表达式清单（收集的 `${...}`）。

```bash
pactor inspect src/pages/home.page.yaml
```

## pactor lint

对文件/目录（递归 `.page/.fragment.yaml/.yml`）执行 Schema 校验 + 静态检查规则，输出按文件分组分级；有 error 退出码 1，仅 warning 退出码 0。

```bash
pactor lint src
```

规则集：

| 规则 | 级别 | 说明 |
| --- | --- | --- |
| `expression-syntax` | error | 用 @pactor/expression `parseExpression` 解析 DSL 中所有 `${...}` 模板与整体表达式 |
| `component-naming` | warning | 组件 `type` 应为 PascalCase |
| `permission-format` | warning | 权限码应为 `resource:action` 形态（两段均非空） |

Schema 校验失败计为 `schema` 规则 error。

## pactor schema

输出 Page DSL JSON Schema：`page-dsl` / `dsl-node` / `action-config` 三份 Schema 以 `$id` 为键聚合，保持 `$ref` 一致性。缺省写 stdout，`-o <file>` 写文件。

```bash
pactor schema -o schema.json
```

## pactor build

递归编译 `<src>` 下 DSL 文件为 Runtime Envelope JSON，写入 `<out>/<id>.json`（id 取 `page.id` / `fragment.id`）。任一文件校验失败即报告明细并以退出码 1 中止，不产生半成品输出。

```bash
pactor build src/pages -o dist/runtime
```

产物形态（对应 @pactor/resource 的 `DslResourceEnvelope`）：

```json
{
  "id": "home",
  "resourceType": "page",
  "version": 1,
  "dslVersion": "1.0",
  "schema": { "dsl": "1.0", "page": { "id": "home" } }
}
```

## pactor create

从内置模板生成业务工程：

```bash
pactor create my-app        # 模板参数 -t app（当前唯一模板，可省略）
```

生成的工程包含：

- `package.json`（vite / react / @pactor/app / @pactor/ui / @pactor/vite-plugin 依赖；版本为 `^0.1.0` 等语义化占位，发布后按实际版本对齐）
- `vite.config.ts`（react + `pactor()` 插件）
- `index.html`、`tsconfig.json`、`README.md`
- `src/main.tsx`（`createPactorApplication` + `StaticDslLoader` + `import '@pactor/ui/styles.css'`，默认 UI kit 为 shadcn）
- `src/pages/home.page.yaml`（示例 Page DSL）

模板中的 `__APP_NAME__` 占位替换为目标目录名。目标目录已存在且非空时报错（退出码 2），不覆盖任何内容；已存在的空目录允许生成。

:::note
`preview` 命令暂未实现；watch 模式与交互式 create 问答同样不在当前版本范围内。
:::
