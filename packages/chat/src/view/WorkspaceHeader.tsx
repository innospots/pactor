import { Download, Moon, Sun, Trash2 } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';

import { downloadMessagesAsMarkdown } from '../export-markdown.js';
import type { ConversationStore } from '../store.js';

/**
 * 内建工作区 header（spec: chat-dsl-component / Header 配置，设计决策 D4）：
 * 标题（editableTitle 时点击进入编辑，Enter / blur 提交）+ 右侧操作组
 * （按 headerActions 数组顺序渲染，位于 headerExtra 槽之前）。
 *
 * 默认行为总在包内执行，事件为并行通知（与 onSend 同款语义）：
 * - export：store.getMessages() 序列化 Markdown 并触发下载
 * - theme：读 document.documentElement 当前 data-pactor-theme 并切换
 *   （'dark' ↔ 移除），事件带新 theme
 * - clear：store.clear()
 *
 * 零渲染承诺：headerActions 缺省 / 空数组且未开 editableTitle 时，
 * 渲染 DOM 与既有内建 header 逐字节一致。
 */

/** 内建 header 操作项（按数组顺序渲染） */
export type ChatHeaderAction = 'export' | 'theme' | 'clear';

export interface WorkspaceHeaderProps {
  title?: string;
  headerExtra?: ReactNode;
  headerActions?: ChatHeaderAction[];
  editableTitle?: boolean;
  /** 会话 store（export 序列化 / clear 清空的默认行为对象） */
  store: ConversationStore;
  onExport?: () => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onClear?: () => void;
  onTitleChange?: (title: string) => void;
}

/** 读取当前主题（documentElement 的 data-pactor-theme，缺省 light） */
function readCurrentTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') {
    return 'light';
  }
  return document.documentElement.getAttribute('data-pactor-theme') === 'dark'
    ? 'dark'
    : 'light';
}

export function WorkspaceHeader({
  title,
  headerExtra,
  headerActions,
  editableTitle = false,
  store,
  onExport,
  onThemeChange,
  onClear,
  onTitleChange,
}: WorkspaceHeaderProps): ReactNode {
  const hasActions = headerActions !== undefined && headerActions.length > 0;

  // 可编辑标题（spec: 可编辑标题）：提交成功后的本地展示覆盖；
  // title prop 外部变更时丢弃覆盖（受控闭环场景以 props 为准）
  const [overrideTitle, setOverrideTitle] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const prevTitleRef = useRef(title);
  if (prevTitleRef.current !== title) {
    prevTitleRef.current = title;
    if (overrideTitle !== null) {
      setOverrideTitle(null);
    }
  }
  const displayTitle = overrideTitle ?? title;

  // 主题图标状态：初始读 documentElement，点击时按当前 DOM 值翻转
  const [theme, setTheme] = useState<'light' | 'dark'>(readCurrentTheme);

  const commitTitle = (): void => {
    setEditing(false);
    const next = draft.trim();
    // 空串或与原标题相同：不触发事件，显示回退原标题
    if (next && next !== displayTitle) {
      setOverrideTitle(next);
      onTitleChange?.(next);
    }
  };

  const handleExport = (): void => {
    downloadMessagesAsMarkdown(displayTitle ?? 'chat', store.getMessages());
    onExport?.();
  };

  const handleTheme = (): void => {
    const next = readCurrentTheme() === 'dark' ? 'light' : 'dark';
    if (next === 'dark') {
      document.documentElement.setAttribute('data-pactor-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-pactor-theme');
    }
    setTheme(next);
    onThemeChange?.(next);
  };

  const handleClear = (): void => {
    store.clear();
    onClear?.();
  };

  const actionButtons: Record<ChatHeaderAction, ReactNode> = {
    export: (
      <button
        key="export"
        type="button"
        className="pactor-chat-icon-button"
        title="导出 Markdown"
        aria-label="导出 Markdown"
        onClick={handleExport}
      >
        <Download size={15} />
      </button>
    ),
    theme: (
      <button
        key="theme"
        type="button"
        className="pactor-chat-icon-button"
        title={theme === 'dark' ? '切换为浅色' : '切换为深色'}
        aria-label="切换明暗主题"
        onClick={handleTheme}
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    ),
    clear: (
      <button
        key="clear"
        type="button"
        className="pactor-chat-icon-button"
        title="清空会话"
        aria-label="清空会话"
        onClick={handleClear}
      >
        <Trash2 size={15} />
      </button>
    ),
  };

  return (
    <header className="pactor-chat-workspace__header">
      {editableTitle ? (
        editing ? (
          <input
            className="pactor-chat-workspace__title-input"
            value={draft}
            autoFocus
            aria-label="编辑标题"
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitTitle}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                commitTitle();
              } else if (event.key === 'Escape') {
                setEditing(false);
              }
            }}
          />
        ) : (
          <button
            type="button"
            className="pactor-chat-workspace__title pactor-chat-workspace__title--editable"
            title="点击编辑标题"
            onClick={() => {
              setDraft(displayTitle ?? '');
              setEditing(true);
            }}
          >
            {displayTitle}
          </button>
        )
      ) : (
        <div className="pactor-chat-workspace__title">{title}</div>
      )}
      {hasActions ? (
        <div className="pactor-chat-workspace__header-right">
          <div className="pactor-chat-workspace__header-actions">
            {headerActions.map((action) => actionButtons[action])}
          </div>
          {headerExtra !== undefined ? (
            <div className="pactor-chat-workspace__header-extra">
              {headerExtra}
            </div>
          ) : null}
        </div>
      ) : headerExtra !== undefined ? (
        <div className="pactor-chat-workspace__header-extra">
          {headerExtra}
        </div>
      ) : null}
    </header>
  );
}
