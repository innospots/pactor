import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  CreateLink,
  headingsPlugin,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';

/** 工具栏自定义渲染：拿到默认工具栏内容，可包裹 / 替换 */
export type MarkdownEditorToolbarRender = (defaultContents: ReactNode) => ReactNode;

export interface MarkdownEditorProps {
  /** Markdown 源文本（受控） */
  value?: string;
  /** 内容变化回调（编辑器内部每次变更后触发） */
  onChange?: (value: string) => void;
  /** 失焦回调 */
  onBlur?: (event: FocusEvent) => void;
  /** 占位文本 */
  placeholder?: ReactNode;
  /** 只读模式（隐藏工具栏） */
  readOnly?: boolean;
  /** 自动聚焦 */
  autoFocus?: boolean;
  /** 附加 className，与基础 class `pactor-markdown-editor` 并存 */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 主题：缺省跟随 documentElement 的 data-pactor-theme（与库换肤机制一致），可显式覆盖 */
  theme?: 'light' | 'dark';
  /** 是否渲染工具栏，默认 true（readOnly 时强制隐藏） */
  toolbar?: boolean;
  /** 自定义工具栏内容：参数为默认工具栏节点 */
  renderToolbar?: MarkdownEditorToolbarRender;
  /**
   * 追加的 MDXEditor 插件（插在默认插件集之后）。
   * 默认插件集：headings / lists / quote / thematicBreak / link(+dialog) /
   * table / codeBlock(+codeMirror) / markdownShortcut，以及工具栏。
   */
  plugins?: MDXEditorProps['plugins'];
  /** 透传给底层 MDXEditor 的其余 props（会被上述显式 props 覆盖） */
  editorProps?: Omit<
    MDXEditorProps,
    'markdown' | 'onChange' | 'onBlur' | 'readOnly' | 'autoFocus' | 'placeholder' | 'plugins'
  >;
}

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

const defaultToolbarContents = (
  <>
    <UndoRedo />
    <Separator />
    <BoldItalicUnderlineToggles />
    <CodeToggle />
    <Separator />
    <ListsToggle />
    <Separator />
    <BlockTypeSelect />
    <Separator />
    <CreateLink />
    <InsertTable />
    <InsertThematicBreak />
    <InsertCodeBlock />
  </>
);

/**
 * Markdown 富文本编辑器：基于 @mdxeditor/editor（Lexical 内核）封装，
 * 受控 `value` / `onChange`，默认带 GFM 常用插件与工具栏。
 *
 * 样式：使用方需引入 `@mdxeditor/editor/style.css`（编辑器自身样式），
 * 容器外观令牌化样式见包根 `styles.css`
 * （`import '@pactor-app/markdown/styles.css'`），可被宿主主题覆盖。
 *
 * 注意：编辑器体积较大且依赖浏览器 DOM API，SSR 场景请动态导入
 * （如 next/dynamic 的 `ssr: false`）。
 */
export const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
  function MarkdownEditor(
    {
      value = '',
      onChange,
      onBlur,
      placeholder,
      readOnly = false,
      autoFocus,
      className,
      style,
      theme,
      toolbar = true,
      renderToolbar,
      plugins,
      editorProps,
    },
    ref,
  ) {
    const showToolbar = toolbar && !readOnly;
    const containerClass = className
      ? `pactor-markdown-editor ${className}`
      : 'pactor-markdown-editor';

    const pactorTheme = usePactorTheme();
    const resolvedTheme = theme ?? pactorTheme;
    /** 每个编辑器实例的稳定 class：用于定位其编辑根节点与 portal 弹层 */
    const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const instanceClass = `pactor-markdown-editor-instance-${instanceId}`;
    /**
     * MDXEditor 的 className 会同时下发到编辑根节点与 portal 的
     * `.mdxeditor-popup-container`（下拉 / 链接弹层）。这里只放稳定 class：
     * className 变化会触发 MDXEditor 重建 portal 容器，打开中的 Radix 下拉
     * 会丢失挂载点；因此明暗 class 改由 effect 原地切换，弹层节点在主题
     * 切换时保持不变。编辑器根节点 / 弹层可能晚于本组件挂载（Lexical
     * 初始化、portal 创建），用 MutationObserver 在节点出现时补上主题 class。
     */
    const mdxEditorClassName = [
      'pactor-markdown-editor-root',
      instanceClass,
      editorProps?.className,
    ]
      .filter(Boolean)
      .join(' ');

    useEffect(() => {
      if (typeof document === 'undefined') return;
      const selector = `.${instanceClass}`;
      const applyTheme = () => {
        document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
          element.classList.toggle('dark', resolvedTheme === 'dark');
          element.classList.toggle('light', resolvedTheme === 'light');
        });
      };
      applyTheme();
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (
              node instanceof Element &&
              (node.matches(selector) || node.querySelector(selector))
            ) {
              applyTheme();
              return;
            }
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }, [instanceClass, resolvedTheme]);

    /**
     * 受控同步：MDXEditor 的 markdown prop 仅作挂载初始值，
     * 外部 value 变化（DSL state 回写、父组件重设）经 setMarkdown 同步；
     * lastEmitted 记录最近一次由编辑器自身发出的值，用户输入回流时不重复导入，
     * 避免光标跳动。
     */
    const innerRef = useRef<MDXEditorMethods>(null);
    useImperativeHandle(ref, () => innerRef.current!, []);
    const lastEmittedRef = useRef(value);
    useEffect(() => {
      if (value !== lastEmittedRef.current) {
        lastEmittedRef.current = value;
        innerRef.current?.setMarkdown(value);
      }
    }, [value]);
    const handleChange = (next: string) => {
      lastEmittedRef.current = next;
      onChange?.(next);
    };

    return (
      <div className={containerClass} style={style} data-theme={resolvedTheme}>
        <MDXEditor
          ref={innerRef}
          markdown={value}
          onChange={handleChange}
          onBlur={onBlur}
          readOnly={readOnly}
          autoFocus={autoFocus}
          placeholder={placeholder}
          contentEditableClassName="pactor-markdown-editor-content"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            tablePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                '': 'Plain text',
                js: 'JavaScript',
                ts: 'TypeScript',
                tsx: 'TSX',
                css: 'CSS',
                html: 'HTML',
                json: 'JSON',
                yaml: 'YAML',
                bash: 'Bash',
                python: 'Python',
                go: 'Go',
                rust: 'Rust',
                sql: 'SQL',
              },
            }),
            markdownShortcutPlugin(),
            ...(showToolbar
              ? [
                  toolbarPlugin({
                    toolbarClassName: 'pactor-markdown-editor-toolbar',
                    toolbarContents: () =>
                      renderToolbar ? renderToolbar(defaultToolbarContents) : defaultToolbarContents,
                  }),
                ]
              : []),
            ...(plugins ?? []),
          ]}
          {...editorProps}
          className={mdxEditorClassName}
        />
      </div>
    );
  },
);
