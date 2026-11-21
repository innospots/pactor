# @pactor-app/mcp

Pactor MCP server：把 Pactor DSL 的组件目录、结构校验、语法参考与 action 目录暴露给任何 MCP 兼容的 AI agent（Claude Code / Cursor / Kimi Code / Codex …），让 agent 按需查询并在写完 DSL 后立即自检。

## 能力

**工具（5 个）**

| 工具 | 说明 |
| --- | --- |
| `list_components` | 全部 DSL 组件类型（含 `@pactor-app/ui` / `chart` / `blocks` / `chat`），按分类分组 |
| `get_component` | 单个组件的关键 props、事件/用法、示例 YAML 与文档链接（名称大小写不敏感，未命中给出相近候选） |
| `validate_dsl` | 校验页面 DSL（YAML/JSON），返回结构化错误（path / message / keyword）；结构级，与 `pactor validate` 同级 |
| `get_dsl_reference` | 按章节返回 DSL 语法参考（页面骨架、dataSources、表达式、action、配方、常见错误） |
| `list_actions` | 标准 action 目录与参数契约；`name` 过滤返回单个详情 |

**资源（1 个）**：`pactor://reference/dsl-authoring` — 完整 DSL 参考文档（Markdown）

目录数据由 `skills/pactor-dsl/references/` 的权威文档在构建期生成（`scripts/sync.mjs`），并有防漂移测试保证与 `packages/ui` / `packages/runtime` 的实际注册项一致。

## 使用

### 方式一：本地 stdio（随客户端生命周期启停）

```bash
claude mcp add pactor -- npx @pactor-app/mcp
```

其他客户端等价配置：

```json
{
  "mcpServers": {
    "pactor": {
      "command": "npx",
      "args": ["@pactor-app/mcp"]
    }
  }
}
```

### 方式二：远程（Cloudflare Workers，免安装）

```bash
claude mcp add --transport http pactor https://pactor.innospots.com/api/mcp
```

远程实例与本包共用同一套工具实现（见 `apps/mcp-worker`），公开只读、无需鉴权。

## 库入口

```ts
import { createPactorMcpServer } from '@pactor-app/mcp';

// 可注入校验器：禁代码生成的运行时（workerd）传 Ajv standalone 版本
const server = createPactorMcpServer({
  validatePageDsl: validatePageDslStandalone, // from '@pactor-app/schema/standalone'
});
```

## 开发

```bash
pnpm build        # sync 目录数据 + tsup
pnpm test         # sync + tsup + vitest（漂移检测 / 工具级 / stdio 协议冒烟）
pnpm typecheck
```
