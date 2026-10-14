import { useEffect, useRef, useState } from 'react';
import type { Ace } from 'ace-builds';

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

/**
 * 构建 ace 自定义 completer：functions 以 snippet 补全，variables 直接补全名称。
 * 空/缺省配置时返回空候选，不影响 ace 默认补全。
 */
export function buildScriptCompletions(
  functions?: ScriptFunctionDef[],
  variables?: ScriptVariableDef[],
): Ace.Completer {
  return {
    getCompletions(_editor, _session, _position, _prefix, callback) {
      const completions: Ace.Completion[] = [
        ...(functions ?? []).map((fn) => ({
          caption: fn.name,
          snippet: buildFunctionSnippet(fn),
          meta: 'function',
          docHTML: buildFunctionDoc(fn),
        })),
        ...(variables ?? []).map((v) => ({
          caption: v.name,
          value: v.name,
          meta: 'variable',
          docHTML: buildVariableDoc(v),
        })),
      ];
      callback(null, completions);
    },
  };
}

// ─── Editor ───────────────────────────────────────────────────────────────────

/**
 * 内置语法模式加载器：按需扩展，未列出的语言回退为纯文本。
 * mode 声明了 snippetFileId 时，language_tools 会调用 ace.config.loadModule
 * 加载对应 snippets 模块；未打包进 bundle 时 ace 会回退为按 URL 请求
 * <basePath>/snippets/*.js（打包器环境下 basePath 通常探测不到该目录 → 404），
 * 因此这里把 snippets 模块一并 import，提前注册到 ace 模块表。
 */
const MODE_LOADERS: Record<string, () => Promise<unknown>> = {
  python: () =>
    Promise.all([
      import('ace-builds/src-noconflict/mode-python'),
      import('ace-builds/src-noconflict/snippets/python'),
    ]),
};

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
  className,
}: ScriptEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Ace.Editor | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [isEmpty, setIsEmpty] = useState(!value);

  // 挂载编辑器（仅执行一次）；ace 依赖 window，动态 import 规避 SSR
  useEffect(() => {
    let disposed = false;

    (async () => {
      const ace = await import('ace-builds');
      await Promise.all([
        import('ace-builds/src-noconflict/theme-textmate'),
        import('ace-builds/src-noconflict/ext-language_tools'),
        MODE_LOADERS[language]?.() ?? Promise.resolve(),
      ]);
      if (disposed || !containerRef.current) return;

      const editor = ace.edit(containerRef.current, {
        value: value ?? '',
        theme: 'ace/theme/textmate',
        mode: MODE_LOADERS[language] ? `ace/mode/${language}` : 'ace/mode/text',
        showPrintMargin: false,
        highlightActiveLine: true,
        tabSize: 4,
        useSoftTabs: true,
        readOnly: readonly ?? false,
        enableBasicAutocompletion: [buildScriptCompletions(functions, variables)],
        enableLiveAutocompletion: true,
        enableSnippets: true,
      });
      // 关闭语法检查 worker，避免按 URL 加载 worker-*.js 产生 404
      editor.session.setUseWorker(false);

      editor.on('change', () => {
        const current = editor.getValue();
        setIsEmpty(current === '');
        onChangeRef.current?.(current);
      });

      editorRef.current = editor;
    })().catch(() => {
      // ace 加载失败时保留空容器，不阻断表单其余字段
    });

    return () => {
      disposed = true;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 外部值变化时同步到编辑器（仅当与编辑器内容不一致，避免光标跳动）
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const next = value ?? '';
    if (editor.getValue() !== next) {
      editor.setValue(next, -1);
      setIsEmpty(next === '');
    }
  }, [value]);

  // functions / variables 变化时更新联想（不重建编辑器）
  useEffect(() => {
    editorRef.current?.setOptions({
      enableBasicAutocompletion: [buildScriptCompletions(functions, variables)],
    });
  }, [functions, variables]);

  // 只读状态跟随 prop
  useEffect(() => {
    editorRef.current?.setReadOnly(readonly ?? false);
  }, [readonly]);

  return (
    <div
      className={cn(
        'relative w-full rounded-md border bg-background overflow-hidden',
        readonly && 'bg-muted',
        className,
      )}
    >
      <div ref={containerRef} id={id} style={{ height }} className="w-full" />
      {isEmpty && placeholder && (
        <div className="absolute top-0 left-0 px-3 py-2 text-sm text-muted-foreground pointer-events-none z-10">
          {placeholder}
        </div>
      )}
    </div>
  );
}
