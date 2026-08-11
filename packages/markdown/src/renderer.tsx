import type { Components } from 'react-markdown';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * MarkdownRenderer（设计决策 D1/D2）。
 *
 * 安全边界（切勿放松）：
 * - 不启用 rehype-raw——Markdown 文本中的原始 HTML 不进入渲染，
 *   由 react-markdown 的 AST 渲染天然忽略，script / 事件属性无从下手。
 * - 链接 href 与图片 src 经协议白名单兜底（见 `isSafeUrl`）。
 */

/** 链接 / 图片允许的 URL 协议；其余（javascript:、data: 等）一律拒绝 */
const LINK_PROTOCOL_WHITELIST = new Set(['http:', 'https:', 'mailto:']);
const IMAGE_PROTOCOL_WHITELIST = new Set(['http:', 'https:']);

/** 提取 URL 协议（如 `https:`）；无协议（相对路径 / 锚点）返回 null */
function extractProtocol(url: string): string | null {
  const match = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(url.trim());
  return match ? `${match[1]!.toLowerCase()}:` : null;
}

/**
 * 协议白名单检查：相对路径（无协议）放行；
 * 带协议的 URL 必须在白名单内，否则拒绝。
 * 空串同样拒绝——react-markdown 默认 urlTransform 会把
 * javascript: 等危险协议置为空串，空串即视为已被拒绝。
 */
export function isSafeUrl(url: string | undefined, kind: 'link' | 'image'): boolean {
  if (typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  const protocol = extractProtocol(url);
  if (protocol === null) {
    return true;
  }
  const whitelist = kind === 'link' ? LINK_PROTOCOL_WHITELIST : IMAGE_PROTOCOL_WHITELIST;
  return whitelist.has(protocol);
}

/**
 * 安全链接组件：
 * - 协议白名单外的 href（javascript: 等）渲染为纯文本，不产出 a 元素
 * - http(s) 外链带 `target="_blank" rel="noreferrer"`
 * - mailto: 与相对路径渲染为普通 a
 */
const SafeLink: NonNullable<Components['a']> = ({ href, children }) => {
  if (!isSafeUrl(href, 'link')) {
    return <>{children}</>;
  }
  const protocol = extractProtocol(href!);
  if (protocol === 'http:' || protocol === 'https:') {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return <a href={href}>{children}</a>;
};

/** 安全图片组件：协议白名单外的 src（javascript: 等）不渲染 */
const SafeImage: NonNullable<Components['img']> = ({ src, alt }) => {
  if (!isSafeUrl(src, 'image')) {
    return null;
  }
  return <img src={src} alt={alt ?? ''} />;
};

/** react-markdown 组件覆盖表：仅替换 a / img，其余沿用默认 AST 渲染 */
const markdownComponents: Components = {
  a: SafeLink,
  img: SafeImage,
};

export interface MarkdownRendererProps {
  /** Markdown 源文本（DSL 场景下表达式已由 Renderer 解析后传入） */
  content?: string;
  /** 附加 className，与基础 class `pactor-markdown` 并存 */
  className?: string;
}

/**
 * Markdown 渲染器：标题 / 列表 / 表格（GFM）/ 代码块 / 引用 / 链接 / 图片。
 * 容器带基础 class `pactor-markdown`，样式由宿主主题决定（设计决策 D2）。
 * remark-gfm 提供表格 / 删除线 / 任务列表；代码块渲染为
 * `<pre><code class="language-xxx">`，供后续语法高亮扩展。
 */
export function MarkdownRenderer({ content = '', className }: MarkdownRendererProps) {
  const containerClass = className ? `pactor-markdown ${className}` : 'pactor-markdown';
  return (
    <div className={containerClass}>
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </Markdown>
    </div>
  );
}
