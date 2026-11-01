import CodeMirror from '@uiw/react-codemirror';
import {
  autocompletion,
  snippetCompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import type { Extension } from '@codemirror/state';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '../../lib/utils.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScriptFunctionParameter {
  name: string;
  type?: string;
  description?: string;
}

/** 自定义函数定义：联想时以 snippet 形式补全（如 SUM(${1:field})） */
export interface ScriptFunctionDef {
  name: string;
  description?: string;
  parameters?: ScriptFunctionParameter[];
}

/** 自定义变量定义：联想时直接补全变量名 */
export interface ScriptVariableDef {
  name: string;
  type?: string;
  description?: string;
}

export interface ScriptEditorProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** 语法模式，默认 python；未知值回退为纯文本 */
  language?: string;
  functions?: ScriptFunctionDef[];
  variables?: ScriptVariableDef[];
  readonly?: boolean;
  /** 编辑器高度（px），默认 160 */
  height?: number;
  /** 是否显示边框与圆角，默认 true；嵌入式场景（如 FileManager 内容区）传 false 去边框 */
  bordered?: boolean;
  /** 主题：缺省跟随 documentElement 的 data-pactor-theme（与库换肤机制一致），可显式覆盖 */
  theme?: 'light' | 'dark';
  className?: string;
}

// ─── Completion helpers（纯函数，便于单测） ─────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 函数补全 snippet：无参函数 `SUM()`，有参函数 `SUM(${1:field}, ${2:other})` */
export function buildFunctionSnippet(fn: ScriptFunctionDef): string {
  const params = fn.parameters ?? [];
  if (params.length === 0) return `${fn.name}()`;
  const inner = params.map((p, i) => `\${${i + 1}:${p.name}}`).join(', ');
  return `${fn.name}(${inner})`;
}

function buildFunctionDoc(fn: ScriptFunctionDef): string {
  const parts: string[] = [];
  if (fn.description) parts.push(`<p>${escapeHtml(fn.description)}</p>`);
  const params = fn.parameters ?? [];
  if (params.length > 0) {
    const rows = params
      .map(
        (p) =>
          `<li><b>${escapeHtml(p.name)}</b>` +
          (p.type ? ` <i>${escapeHtml(p.type)}</i>` : '') +
          (p.description ? ` — ${escapeHtml(p.description)}` : '') +
          `</li>`,
      )
      .join('');
    parts.push(`<ul>${rows}</ul>`);
  }
  return parts.join('');
}

function buildVariableDoc(variable: ScriptVariableDef): string {
  const parts: string[] = [];
  if (variable.type) parts.push(`<p><i>${escapeHtml(variable.type)}</i></p>`);
  if (variable.description) parts.push(`<p>${escapeHtml(variable.description)}</p>`);
  return parts.join('');
}

/** info 文档 HTML → DOM 节点（CodeMirror info 回调在浏览器侧惰性调用，此处不触 DOM） */
function docInfo(html: string): (() => Node) | undefined {
  if (!html) return undefined;
  return () => {
    const template = document.createElement('template');
    template.innerHTML = html;
    const container = document.createElement('div');
    container.appendChild(template.content.cloneNode(true));
    return container;
  };
}

/**
 * 构建 CodeMirror 自定义补全项：functions 以 snippet 补全（type: function），
 * variables 直接补全名称（type: variable）。空/缺省配置时返回空候选。
 */
export function buildScriptCompletions(
  functions?: ScriptFunctionDef[],
  variables?: ScriptVariableDef[],
): Completion[] {
  return [
    ...(functions ?? []).map((fn) =>
      snippetCompletion(buildFunctionSnippet(fn), {
        label: fn.name,
        type: 'function',
        info: docInfo(buildFunctionDoc(fn)),
      }),
    ),
    ...(variables ?? []).map((v) => ({
      label: v.name,
      type: 'variable',
      info: docInfo(buildVariableDoc(v)),
    })),
  ];
}

/**
 * 自定义联想源：光标前词元匹配 functions/variables 候选；
 * 空词且非显式触发（Ctrl-Space）时不弹窗。
 */
export function buildCompletionSource(
  options: Completion[],
): (context: CompletionContext) => CompletionResult | null {
  return (context) => {
    const word = context.matchBefore(/[\w$]*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;
    return { from: word.from, options };
  };
}

// ─── Language modes ───────────────────────────────────────────────────────────

/** 内置语法模式：未列出的语言回退为纯文本（不注册语言扩展） */
const LANGUAGE_EXTENSIONS: Record<string, () => Extension> = {
  javascript: () => javascript({ jsx: true, typescript: true }),
  json: () => json(),
  python: () => python(),
  sql: () => sql(),
};

// ─── Editor ───────────────────────────────────────────────────────────────────

/** 读取并跟随 pactor 主题（documentElement 的 data-pactor-theme，缺省 light） */
function usePactorTheme(): 'light' | 'dark' {
  const read = (): 'light' | 'dark' =>
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-pactor-theme') === 'dark'
      ? 'dark'
      : 'light';
  const [theme, setTheme] = useState<'light' | 'dark'>(read);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-pactor-theme'],
    });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/**
 * 脚本编辑器（CodeMirror 6，经 @uiw/react-codemirror）：
 * value/onChange 受控（react-codemirror 内部同步外部值且保持光标）；
 * language 决定语法高亮（javascript/json/python/sql，其余纯文本）；
 * functions/variables 注册自定义联想（snippet + 文档浮层，覆盖语言默认联想）；
 * readonly 时内容只读（保留聚焦/选中/复制，经 readOnly 而非 editable=false）；
 * theme 缺省跟随 data-pactor-theme 切换 CM 明暗主题；placeholder 走 CM 原生正文内渲染。
 */
export function ScriptEditor({
  id,
  value,
  onChange,
  placeholder,
  language = 'python',
  functions,
  variables,
  readonly,
  height = 160,
  bordered = true,
  theme,
  className,
}: ScriptEditorProps) {
  const extensions = useMemo<Extension[]>(() => {
    const exts: Extension[] = [];
    const lang = LANGUAGE_EXTENSIONS[language]?.();
    if (lang) exts.push(lang);
    const options = buildScriptCompletions(functions, variables);
    if (options.length > 0) {
      // override 替换语言默认联想（与原 ace 版 enableBasicAutocompletion 行为一致）
      exts.push(autocompletion({ override: [buildCompletionSource(options)] }));
    }
    return exts;
  }, [language, functions, variables]);

  const pactorTheme = usePactorTheme();
  const resolvedTheme = theme ?? pactorTheme;

  return (
    <div
      data-slot="script-editor"
      data-language={language}
      data-readonly={readonly || undefined}
      data-theme={resolvedTheme}
      className={cn(
        'relative w-full overflow-hidden bg-background text-sm',
        bordered && 'rounded-md border',
        // CM 焦点 outline 与外层容器边框视觉冲突，去掉编辑器内建 outline
        '[&_.cm-editor]:outline-none [&_.cm-editor]:bg-transparent',
        readonly && 'bg-muted',
        className,
      )}
    >
      <CodeMirror
        id={id}
        value={value ?? ''}
        onChange={(next) => onChange?.(next)}
        placeholder={placeholder}
        extensions={extensions}
        theme={resolvedTheme}
        // 只读用 readOnly 而非 editable=false：保留聚焦/选中/键盘滚动（editable=false
        // 会把 contenteditable 置 false，键盘用户无法滚读长内容）
        readOnly={readonly}
        height={`${height}px`}
        basicSetup={{
          foldGutter: false,
          highlightActiveLine: !readonly,
          highlightActiveLineGutter: !readonly,
        }}
      />
    </div>
  );
}
