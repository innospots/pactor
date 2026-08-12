import { isValidElement, type ReactNode } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';

/**
 * 代码语法高亮（技术选型参考 DeepTutor web：react-syntax-highlighter）。
 *
 * 使用 Prism **Light** 构建按需注册常用语言，避免全量语言包拖大体积；
 * 未注册语言的代码块由调用方降级为普通 `<pre><code>`。
 */

const LANGUAGES: Record<string, unknown> = {
  bash,
  css,
  javascript,
  js: javascript,
  json,
  jsx,
  markdown,
  md: markdown,
  python,
  py: python,
  tsx,
  typescript,
  ts: typescript,
  yaml,
  yml: yaml,
};

let registered = false;

/** 幂等注册内置语言表（模块加载时由 MarkdownRenderer 触发一次） */
export function registerCodeLanguages(): void {
  if (registered) {
    return;
  }
  registered = true;
  for (const [name, language] of Object.entries(LANGUAGES)) {
    // registerLanguage 同名重复调用会告警，registered 门挡保证只注册一次
    SyntaxHighlighter.registerLanguage(name, language);
  }
}

/** 语言是否已注册（未注册时调用方应降级渲染） */
export function isCodeLanguageRegistered(language: string): boolean {
  return language.toLowerCase() in LANGUAGES;
}

export interface CodeBlockProps {
  language: string;
  children: string;
}

/** fenced 代码块高亮渲染（Prism Light + one-light 主题） */
export function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language.toLowerCase()}
      style={oneLight}
      customStyle={{ margin: 0, background: 'transparent', fontSize: '0.85em' }}
      codeTagProps={{ className: `language-${language.toLowerCase()}` }}
    >
      {children.replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
}

/** react-markdown `pre` 覆盖所需的最小组件 props 形状 */
interface MarkdownCodeElementProps {
  className?: string;
  children?: ReactNode;
}

/**
 * 从 `<pre>` 的唯一 `<code>` 子节点提取语言与源码；
 * 非"单 code 子节点"结构或缺少 language class 时返回 null（调用方原样渲染）。
 */
export function extractFencedCode(
  preChildren: ReactNode,
): { language: string; code: string } | null {
  if (!isValidElement<MarkdownCodeElementProps>(preChildren)) {
    return null;
  }
  const { className, children } = preChildren.props;
  const match = /language-([\w-]+)/.exec(className ?? '');
  if (!match) {
    return null;
  }
  return { language: match[1]!, code: String(children ?? '') };
}
