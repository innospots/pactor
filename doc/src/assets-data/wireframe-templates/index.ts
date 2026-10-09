/**
 * 线框模板内容加载器（markdown 驱动）。
 * 内容目录：doc/src/content/wireframe-templates/<slug>/——
 *   index.md        模板文档（frontmatter + 正文；正文中 {{preview:NN}} 指令
 *                   标记预览插入位置）
 *   previews/NN.yaml 提炼后的可渲染 DSL（人工提炼、示例数据内联，
 *                   入库后构建期只读取、不做推导）
 * 放入符合约定的目录即自动产生菜单与页面，无需修改导航。
 *
 * 展示规则：
 * - 正文按 ## 章节分组渲染，章节内保持文档顺序；
 * - ```text 等 ASCII 线框围栏块一律不展示；
 * - ```yaml 围栏块在原位渲染为「DSL 结构 / yaml 结构」Tab（与其布局预览同组）；
 * - {{preview:NN}} 处插入 iframe 运行态预览（加载落盘的提炼 DSL）。
 *
 * 构建期与 validate 脚本的工作目录均为 doc/，用 process.cwd() 定位
 * （import.meta.url 在 prerender 打包后会指向 dist）。
 */
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { renderMarkdown } from '../../lib/markdown.ts';

const CONTENT_DIR = resolve(process.cwd(), 'src/content/wireframe-templates');

/** 单个 yaml 结构块（从正文 ```yaml 围栏块提取，原位展示） */
export interface WireframeYamlBlock {
  /** 所属布局/套标题（代码块前最近的 ###/## 标题） */
  title: string;
  /** yaml 原文 */
  yaml: string;
  /** 构建期解析出的结构 JSON（解析失败为 null，前端回退纯文本） */
  structureJson: string | null;
}

/** 落盘的可渲染预览 */
export interface WireframePreview {
  /** 文件名（不含扩展名，如 "01"），与正文 {{preview:NN}} 指令对应 */
  name: string;
  /** 所属结构章节标题 */
  title: string;
  /** 初始 state */
  state: Record<string, unknown>;
  /** 可直接渲染的 DSL 节点 */
  node: unknown;
  /** iframe 高度（px，缺省 560）；内容较少的示例用更小值 */
  height?: number;
  /** 内容在预览视口居中展示（内容较少的示例用，缺省 false） */
  center?: boolean;
}

/** 详情页正文流内容块：说明 HTML / 运行态预览（iframe）/ 结构 Tab */
export type FlowBlock =
  | { kind: 'html'; html: string }
  | { kind: 'preview'; preview: WireframePreview }
  | { kind: 'structure'; block: WireframeYamlBlock };

/** 按 ## 章节分组的正文流 */
export interface TemplateFlowSection {
  /** ## 章节标题；首个 ## 之前的导言归入「概述」 */
  title: string;
  blocks: FlowBlock[];
}

export interface WireframeTemplate {
  slug: string;
  title: string;
  order: number;
  summary: string;
  sourceRef: string;
  /** 完整 markdown 源码（含 frontmatter），用于「复制此页」 */
  rawSource: string;
  /** 详情页章节流（按 ## 分组，章节内保持文档顺序） */
  sections: TemplateFlowSection[];
  /** 全部落盘预览（独立预览页路由用） */
  previews: WireframePreview[];
  /** 结构模式数量（### 级标题数） */
  patternCount: number;
}

interface Frontmatter {
  title?: string;
  slug?: string;
  order?: number;
  summary?: string;
  sourceRef?: string;
}

/** 极简 frontmatter 解析：仅支持 key: value 单行标量 */
function parseFrontmatter(raw: string, file: string): { fm: Frontmatter; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) {
    throw new Error(`线框模板 ${file} 缺少 frontmatter（--- 包裹的头部）`);
  }
  const fm: Frontmatter = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    const v = value.trim();
    if (key === 'order') fm.order = Number(v);
    else (fm as Record<string, unknown>)[key] = v;
  }
  return { fm, body: raw.slice(m[0].length) };
}

/** 读取 previews/*.yaml（落盘的提炼结果，直接可用，构建期不做任何清洗/增强） */
function loadPreviews(dir: string): Map<string, WireframePreview> {
  const previewsDir = resolve(dir, 'previews');
  const map = new Map<string, WireframePreview>();
  let files: string[] = [];
  try {
    files = readdirSync(previewsDir).filter((f) => f.endsWith('.yaml'));
  } catch {
    return map;
  }
  for (const file of files.sort()) {
    const doc = parseYaml(readFileSync(resolve(previewsDir, file), 'utf8')) as Record<
      string,
      unknown
    >;
    const name = file.replace(/\.yaml$/, '');
    map.set(name, {
      name,
      title: typeof doc?.title === 'string' ? doc.title : name,
      state:
        doc?.state && typeof doc.state === 'object' && !Array.isArray(doc.state)
          ? (doc.state as Record<string, unknown>)
          : {},
      node: doc?.body ?? null,
      height: typeof doc?.height === 'number' ? doc.height : undefined,
      center: doc?.center === true,
    });
  }
  return map;
}

function toStructureJson(yamlSrc: string): string | null {
  try {
    const doc = parseYaml(yamlSrc);
    if (doc === null || doc === undefined) return null;
    return JSON.stringify(doc, null, 2);
  } catch {
    return null;
  }
}

/**
 * 正文 → 章节流。```text 等线框围栏块丢弃；```yaml 围栏块转为结构块原位展示；
 * {{preview:NN}} 指令处插入预览块；其余按 markdown 渲染为说明 HTML。
 */
function toFlowSections(
  body: string,
  previews: Map<string, WireframePreview>,
): TemplateFlowSection[] {
  const sections: TemplateFlowSection[] = [];
  let current: TemplateFlowSection = { title: '概述', blocks: [] };
  let prose: string[] = [];
  let inFence: 'yaml' | 'drop' | null = null;
  let fenceLen = 0;
  let buf: string[] = [];
  let lastH2 = '';
  let lastH3 = '';
  const flushProse = () => {
    const html = renderMarkdown(prose.join('\n'));
    if (html.trim()) current.blocks.push({ kind: 'html', html });
    prose = [];
  };
  const pushSection = () => {
    flushProse();
    if (current.blocks.length > 0) sections.push(current);
  };
  for (const line of body.split('\n')) {
    // CommonMark 围栏规则：开围栏 ≥3 个反引号，闭围栏反引号数须 ≥ 开围栏。
    // 这样 DSL 块内可嵌 Markdown 代码围栏（如 Markdown content 里的 ```bash）
    if (inFence) {
      const close = line.trim().match(/^(`{3,})\s*$/);
      if (close && close[1].length >= fenceLen) {
        if (inFence === 'yaml') {
          flushProse();
          const yaml = buf.join('\n');
          current.blocks.push({
            kind: 'structure',
            block: {
              title: lastH3 || lastH2,
              yaml,
              structureJson: toStructureJson(yaml),
            },
          });
        }
        inFence = null;
        buf = [];
        continue;
      }
      buf.push(line);
      continue;
    }
    const fence = line.trim().match(/^(`{3,})(\w*)\s*$/);
    if (fence) {
      inFence = fence[2] === 'yaml' ? 'yaml' : 'drop';
      fenceLen = fence[1].length;
      buf = [];
      continue;
    }
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      pushSection();
      current = { title: h2[1].trim(), blocks: [] };
      lastH2 = current.title;
      lastH3 = '';
      continue;
    }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) lastH3 = h3[1].trim();
    const directive = line.trim().match(/^\{\{preview:([\w-]+)\}\}$/);
    if (directive) {
      const preview = previews.get(directive[1]);
      if (preview) {
        flushProse();
        current.blocks.push({ kind: 'preview', preview });
      }
      continue;
    }
    prose.push(line);
  }
  pushSection();
  return sections;
}

function loadAll(): WireframeTemplate[] {
  const dirs = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const templates = dirs.map((dir) => {
    const file = resolve(CONTENT_DIR, dir, 'index.md');
    const raw = readFileSync(file, 'utf8');
    const { fm, body } = parseFrontmatter(raw, `${dir}/index.md`);
    if (!fm.title) {
      throw new Error(`线框模板 ${dir}/index.md 的 frontmatter 缺少必填字段 title`);
    }
    const slug = fm.slug || dir;
    const previews = loadPreviews(resolve(CONTENT_DIR, dir));
    return {
      slug,
      title: fm.title,
      order: fm.order ?? Number.MAX_SAFE_INTEGER,
      summary: fm.summary ?? '',
      sourceRef: fm.sourceRef ?? '',
      rawSource: raw,
      sections: toFlowSections(body.replace(/^\s*#\s+.+\n?/, ''), previews),
      previews: [...previews.values()],
      patternCount: (body.match(/^###\s/gm) ?? []).length,
    } satisfies WireframeTemplate;
  });
  return templates.sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
}

/** 全部线框模板（构建期收集，按 order 排序） */
export const wireframeTemplates: WireframeTemplate[] = loadAll();

export function findWireframeTemplate(slug: string): WireframeTemplate | undefined {
  return wireframeTemplates.find((t) => t.slug === slug);
}

/** 预览页静态路径与节点查询 */
export function findWireframePreview(
  slug: string,
  name: string,
): { template: WireframeTemplate; preview: WireframePreview } | undefined {
  const template = findWireframeTemplate(slug);
  const preview = template?.previews.find((p) => p.name === name);
  return template && preview ? { template, preview } : undefined;
}
