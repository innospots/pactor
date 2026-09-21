import { useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

export interface JSONViewerProps {
  /** 结构化数据（可含表达式解析后的对象 / 数组） */
  data?: unknown;
  /** 默认展开深度（0 全部折叠，1 展开根节点），默认 1 */
  expandedDepth?: number;
  /** 是否在根部显示复制按钮（复制格式化 JSON），默认 true */
  copyable?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function summarize(value: unknown): string {
  if (Array.isArray(value)) return `[…] ${value.length} 项`;
  return `{…} ${Object.keys(value as Record<string, unknown>).length} 键`;
}

function PrimitiveValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return <span data-slot="json-value" data-type="null" className="text-muted-foreground">null</span>;
  }
  if (typeof value === 'string') {
    return (
      <span data-slot="json-value" data-type="string" className="text-success">
        &quot;{value}&quot;
      </span>
    );
  }
  if (typeof value === 'number') {
    return (
      <span data-slot="json-value" data-type="number" className="text-info">
        {String(value)}
      </span>
    );
  }
  if (typeof value === 'boolean') {
    return (
      <span data-slot="json-value" data-type="boolean" className="text-warning">
        {String(value)}
      </span>
    );
  }
  return <span data-slot="json-value">{String(value)}</span>;
}

interface JsonNodeProps {
  keyName?: string;
  value: unknown;
  depth: number;
  expandedDepth: number;
}

function JsonNode({ keyName, value, depth, expandedDepth }: JsonNodeProps): ReactNode {
  const [expanded, setExpanded] = useState(depth < expandedDepth);
  const composite = isObject(value) || Array.isArray(value);

  if (!composite) {
    return (
      <div data-slot="json-leaf" className="flex gap-1.5">
        {keyName !== undefined ? <span className="shrink-0 text-foreground">{keyName}:</span> : null}
        <PrimitiveValue value={value} />
      </div>
    );
  }

  const entries: [string, unknown][] = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as [string, unknown])
    : Object.entries(value);

  return (
    <div data-slot="json-node">
      <button
        type="button"
        data-slot="json-toggle"
        aria-expanded={expanded}
        className="flex items-center gap-1 text-left hover:bg-accent/50 rounded-sm"
        onClick={() => setExpanded((value_) => !value_)}
      >
        <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size="sm" />
        {keyName !== undefined ? <span className="text-foreground">{keyName}:</span> : null}
        {!expanded ? (
          <span className="text-muted-foreground">{summarize(value)}</span>
        ) : (
          <span className="text-muted-foreground">{Array.isArray(value) ? '[' : '{'}</span>
        )}
      </button>
      {expanded ? (
        <div className="ml-4 border-l border-border pl-2">
          {entries.map(([key, item]) => (
            <JsonNode key={key} keyName={key} value={item} depth={depth + 1} expandedDepth={expandedDepth} />
          ))}
        </div>
      ) : null}
      {expanded ? <span className="ml-1 text-muted-foreground">{Array.isArray(value) ? ']' : '}'}</span> : null}
    </div>
  );
}

/**
 * JSONViewer 适配器（shadcn kit）：结构化数据的折叠检查与复制——
 * 对象 / 数组节点可折叠（带条目摘要），叶子值按类型着色
 * （string → success / number → info / boolean → warning / null → muted）。
 */
export function JSONViewer({ data, expandedDepth = 1, copyable = true, className, style }: JSONViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用时静默忽略
    }
  };

  return (
    <div
      data-slot="json-viewer"
      className={cn('relative w-full rounded-md border border-border bg-muted p-3 font-mono text-xs leading-5', className)}
      style={style}
    >
      {copyable ? (
        <button
          type="button"
          data-slot="json-viewer-copy"
          aria-label="复制 JSON"
          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md bg-background/80 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
        >
          <Icon name={copied ? 'check' : 'copy'} size="sm" />
        </button>
      ) : null}
      <JsonNode value={data} depth={0} expandedDepth={expandedDepth} />
    </div>
  );
}
