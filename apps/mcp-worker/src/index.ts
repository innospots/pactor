import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createPactorMcpServer } from '@pactor-app/mcp';
import { validatePageDslStandalone } from '@pactor-app/schema/standalone';

/**
 * Pactor MCP server（Cloudflare Workers 部署，Streamable HTTP）。
 *
 * 无状态模型：每请求创建独立的 server + transport，不做会话管理。
 * 工具实现全部来自 @pactor-app/mcp，此处只做传输与绑定；
 * workerd 禁止动态代码执行，DSL 校验注入构建期预编译的 Ajv standalone 校验器。
 */
async function handleMcp(request: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    // 无会话：无状态模式（JSON 响应，不开 SSE 流）
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  const server = createPactorMcpServer({ validatePageDsl: validatePageDslStandalone });
  await server.connect(transport);
  try {
    return await transport.handleRequest(request);
  } finally {
    await transport.close();
  }
}

export default {
  fetch(request: Request): Response | Promise<Response> {
    const url = new URL(request.url);
    // 仅提供 Streamable HTTP；不提供旧版 SSE
    if (url.pathname === '/api/mcp') {
      return handleMcp(request);
    }
    return new Response('Not found', { status: 404 });
  },
};
