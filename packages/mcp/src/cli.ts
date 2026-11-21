#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createPactorMcpServer } from './server.js';

// stdio 协议占用 stdout；任何日志必须走 stderr
async function main(): Promise<void> {
  const server = createPactorMcpServer();
  await server.connect(new StdioServerTransport());
  console.error('[pactor-mcp] stdio server ready');
}

main().catch((error: unknown) => {
  console.error('[pactor-mcp] fatal:', error);
  process.exit(1);
});
