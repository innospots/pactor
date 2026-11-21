import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  validatePageDsl as defaultValidatePageDsl,
  type DslValidationResult,
} from '@pactor-app/schema';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

import { actions, components, findAction, findComponent, suggestComponents } from './catalog.js';
import {
  getFullReference,
  getReferenceSection,
  listReferenceSections,
  REFERENCE_URI,
} from './reference.js';

export interface PactorMcpServerOptions {
  /**
   * 覆盖默认的页面 DSL 校验器。
   * 禁代码生成的运行时（如 Cloudflare Workers / workerd）注入 Ajv standalone 预编译版本。
   */
  validatePageDsl?: (document: unknown) => DslValidationResult;
}

const text = (value: string) => ({ type: 'text' as const, text: value });

function formatValidationText(result: DslValidationResult): string {
  if (result.valid && result.warnings.length === 0) return 'DSL 校验通过（valid: true）。';
  const lines = result.errors.map(
    (e) => `- [${e.keyword}] ${e.path}: ${e.message}`,
  );
  const warnings = result.warnings.map((w) => `- (warning) [${w.keyword}] ${w.path}: ${w.message}`);
  return [
    result.valid ? 'DSL 校验通过（valid: true），但有警告：' : `DSL 校验失败，共 ${result.errors.length} 个错误：`,
    ...warnings,
    ...lines,
  ].join('\n');
}

/**
 * 创建注册了全部 Pactor 工具与资源的 MCP server（不绑定传输）。
 * Node stdio（src/cli.ts）与 Cloudflare Workers（apps/mcp-worker）共用此入口。
 */
export function createPactorMcpServer(options: PactorMcpServerOptions = {}): McpServer {
  const validatePageDsl = options.validatePageDsl ?? defaultValidatePageDsl;

  const server = new McpServer({
    name: 'pactor',
    version: '1.72.0',
  });

  server.registerTool(
    'list_components',
    {
      description:
        '列出 Pactor 全部 DSL 组件类型（按分类分组）。写页面前先确认组件名；props 细节用 get_component 按需查询。',
      inputSchema: {},
    },
    async () => {
      const byCategory = new Map<string, typeof components>();
      for (const c of components) {
        const list = byCategory.get(c.category) ?? [];
        list.push(c);
        byCategory.set(c.category, list);
      }
      const lines: string[] = [];
      for (const [category, list] of byCategory) {
        lines.push(`## ${category}（${list.length}）`);
        for (const c of list) lines.push(`- ${c.name} [${c.package}] ${c.summary}`);
        lines.push('');
      }
      return {
        content: [text(lines.join('\n').trim())],
        structuredContent: {
          total: components.length,
          components: components.map(({ example: _example, ...c }) => c),
        },
      };
    },
  );

  server.registerTool(
    'get_component',
    {
      description:
        '查询单个 Pactor DSL 组件的契约：关键 props、事件/用法说明、示例 YAML 与文档链接。名称大小写不敏感。',
      inputSchema: { name: z.string().describe('组件 DSL 类型名，如 Table / Form / Button') },
    },
    async ({ name }) => {
      const entry = findComponent(name);
      if (!entry) {
        const suggestions = suggestComponents(name);
        return {
          isError: true,
          content: [
            text(
              suggestions.length > 0
                ? `未找到组件 "${name}"。相近候选：${suggestions.map((s) => s.name).join('、')}`
                : `未找到组件 "${name}"。可用 list_components 查看全部类型。`,
            ),
          ],
        };
      }
      const lines = [
        `# ${entry.name} [${entry.package} / ${entry.category}]`,
        entry.summary,
        entry.keyProps ? `\n关键 props：${entry.keyProps}` : '',
        entry.notes ? `用法 / 事件：${entry.notes}` : '',
        entry.link ? `文档：${entry.link}` : '',
        entry.example ? `\n示例：\n\`\`\`yaml\n${entry.example}\n\`\`\`` : '',
      ].filter(Boolean);
      return {
        content: [text(lines.join('\n'))],
        structuredContent: { ...entry },
      };
    },
  );

  server.registerTool(
    'validate_dsl',
    {
      description:
        '校验 Pactor 页面 DSL（YAML 或 JSON 文本），返回结构化错误（path / message / keyword）。写完 DSL 必须调用此工具自检。仅做结构级校验，不含组件 props 语义。',
      inputSchema: { dsl: z.string().describe('页面 DSL 的 YAML 或 JSON 全文') },
    },
    async ({ dsl }) => {
      let document: unknown;
      try {
        document = parseYaml(dsl);
      } catch (error) {
        return {
          isError: true,
          content: [
            text(`DSL 解析失败（既不是合法 YAML 也不是合法 JSON）：${(error as Error).message}`),
          ],
        };
      }
      const result = validatePageDsl(document);
      return {
        isError: !result.valid,
        content: [text(formatValidationText(result))],
        structuredContent: { ...result },
      };
    },
  );

  server.registerTool(
    'get_dsl_reference',
    {
      description:
        '按章节返回 Pactor DSL 语法参考（页面骨架、dataSources、表达式与作用域、事件与 action、配方、常见错误）。不带参数返回章节目录与首章。',
      inputSchema: {
        section: z
          .string()
          .optional()
          .describe('章节名或关键词，如 expressions / actions / recipes；大小写不敏感、支持子串'),
      },
    },
    async ({ section }) => {
      if (!section) {
        const catalog = listReferenceSections().map((t, i) => `${i + 1}. ${t}`).join('\n');
        const first = getReferenceSection('1.');
        return {
          content: [
            text(`# DSL 参考章节目录\n\n${catalog}\n\n---\n\n# ${first?.title}\n\n${first?.content}`),
          ],
          structuredContent: {
            sections: listReferenceSections(),
            firstSection: first,
          },
        };
      }
      const found = getReferenceSection(section);
      if (!found) {
        return {
          isError: true,
          content: [
            text(
              `未找到匹配 "${section}" 的章节。可用章节：\n${listReferenceSections().map((t) => `- ${t}`).join('\n')}`,
            ),
          ],
        };
      }
      return {
        content: [text(`# ${found.title}\n\n${found.content}`)],
        structuredContent: { ...found },
      };
    },
  );

  server.registerTool(
    'list_actions',
    {
      description:
        '列出 Pactor 标准 action 目录（setState / reload / request / navigate / message / confirm / if / sequence / parallel / overlay.open 等）及参数契约。带 name 参数返回单个 action 详情。',
      inputSchema: { name: z.string().optional().describe('action 名，如 navigate') },
    },
    async ({ name }) => {
      if (!name) {
        const lines = actions.map((a) => `- ${a.name}：${a.params} — ${a.summary}`);
        return {
          content: [text(`# 标准 action（${actions.length}）\n\n${lines.join('\n')}`)],
          structuredContent: { total: actions.length, actions: [...actions] },
        };
      }
      const entry = findAction(name);
      if (!entry) {
        return {
          isError: true,
          content: [
            text(`未找到 action "${name}"。全部 action：${actions.map((a) => a.name).join('、')}`),
          ],
        };
      }
      return {
        content: [text(`# ${entry.name}\n\n参数：${entry.params}\n说明：${entry.summary}`)],
        structuredContent: { ...entry },
      };
    },
  );

  server.registerResource(
    'dsl-authoring',
    REFERENCE_URI,
    {
      title: 'Pactor DSL Authoring Reference',
      description: '完整的 Pactor DSL 语法参考文档（Markdown）',
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'text/markdown', text: getFullReference() }],
    }),
  );

  return server;
}
