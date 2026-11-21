# @pactor-app/mcp-worker

Pactor MCP server 的 Cloudflare Workers 部署（Streamable HTTP，公开只读、无鉴权）。
工具实现全部来自 `@pactor-app/mcp`，本应用只做传输与绑定。

- **生产地址**：`https://pactor.innospots.com/api/mcp`（route `pactor.innospots.com/api/mcp*`，与文档站同域共存；文档站源码在独立仓库 `~/Documents/workspace/pactor-docs`，两者互不部署、仅靠路由分流）
- 传输：`WebStandardStreamableHTTPServerTransport`（无状态模式，JSON 响应），仅 `/api/mcp` 路径，不提供 SSE
- DSL 校验：注入 `@pactor-app/schema/standalone`（Ajv 构建期预编译）——workerd 禁止动态代码执行，默认 Ajv 路径在 Workers 上会降级跳过校验

## 前置条件

先构建 workspace 依赖（Worker 消费的是它们的 dist 产物）：

```bash
pnpm -F @pactor-app/schema build
pnpm -F @pactor-app/mcp build
```

## 本地开发

```bash
pnpm dev          # wrangler dev，默认 :8787；本地路径同样为 /api/mcp
```

冒烟验证：

```bash
curl -X POST http://localhost:8787/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}'
```

## 部署

```bash
pnpm deploy       # wrangler deploy → https://pactor.innospots.com/api/mcp
```

账号与 zone 固定在 `wrangler.jsonc`（`account_id` + `zone_name: innospots.com`）。
部署后接入 MCP 客户端：

```bash
claude mcp add --transport http pactor https://pactor.innospots.com/api/mcp
```
