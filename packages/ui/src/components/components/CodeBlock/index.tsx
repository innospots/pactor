import { useI18n } from '@pactor-app/runtime';
import { useState, type CSSProperties } from 'react';

import { CodeBlock as HighlightedCodeBlock, registerCodeLanguages } from '@pactor-app/markdown';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

// Prism Light 语言表注册（幂等，模块加载触发一次）
registerCodeLanguages();

export interface CodeBlockProps {
  /** 代码内容 */
  code?: string;
  /** 语言（Prism 已注册表：bash/css/js/jsx/ts/tsx/json/md/python/yaml 等；未注册语言降级为纯文本） */
  language?: string;
  /** 是否显示复制按钮，默认 true */
  copyable?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * CodeBlock 适配器（shadcn kit）：语法高亮代码块（复用
 * @pactor-app/markdown 的 Prism Light 高亮器）+ 可选复制按钮。
 */
export function CodeBlock({ code = '', language = 'text', copyable = true, className, style }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用（非安全上下文等）时静默忽略
    }
  };

  return (
    <div
      data-slot="code-block"
      className={cn('relative w-full overflow-hidden rounded-md border border-border bg-muted', className)}
      style={style}
    >
      {copyable ? (
        <button
          type="button"
          data-slot="code-block-copy"
          aria-label={t('pactor.codeBlock.copy')}
          className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-md bg-background/80 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
        >
          <Icon name={copied ? 'check' : 'copy'} size="sm" />
        </button>
      ) : null}
      <div data-slot="code-block-body" className="overflow-x-auto p-3 text-sm [&_pre]:bg-transparent">
        <HighlightedCodeBlock language={language}>{code}</HighlightedCodeBlock>
      </div>
    </div>
  );
}
