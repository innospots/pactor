import { useEffect, useState } from 'react';
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
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
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

/**
 * 当前是否深色模式：优先读宿主的 data-pactor-theme 三态属性
 *（'dark' 强制暗 / 'light' 强制亮），缺省跟随系统 prefers-color-scheme。
 */
function resolveDarkMode(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  const theme = document.documentElement.getAttribute('data-pactor-theme');
  if (theme === 'dark') {
    return true;
  }
  if (theme === 'light') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/** 订阅深色模式变化（data-pactor-theme 属性变更 + 系统主题切换） */
function useDarkMode(): boolean {
  const [dark, setDark] = useState(resolveDarkMode);
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const update = () => setDark(resolveDarkMode());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-pactor-theme'],
    });
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    media?.addEventListener?.('change', update);
    return () => {
      observer.disconnect();
      media?.removeEventListener?.('change', update);
    };
  }, []);
  return dark;
}

/** fenced 代码块高亮渲染（Prism Light + one-light / one-dark 随深浅模式切换） */
export function CodeBlock({ language, children }: CodeBlockProps) {
  const dark = useDarkMode();
  return (
    <SyntaxHighlighter
      language={language.toLowerCase()}
      style={dark ? oneDark : oneLight}
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
