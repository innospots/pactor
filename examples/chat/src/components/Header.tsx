import { Download, Moon, Sun, Trash2 } from 'lucide-react';
import { useState } from 'react';

/**
 * 应用顶栏（对应参考页 workspace 顶栏）：左侧可编辑会话标题
 * （点击进入编辑，Enter / blur 提交），右侧安静的图标按钮：
 * 导出 Markdown、明暗切换、清空会话。
 */
export function Header({
  title,
  onTitleChange,
  theme,
  onToggleTheme,
  onExport,
  onClear,
}: {
  title: string;
  onTitleChange: (title: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExport: () => void;
  onClear: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const commit = (): void => {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== title) {
      onTitleChange(next);
    } else {
      setDraft(title);
    }
  };

  return (
    <header className="demo-header">
      <div className="demo-header__title">
        {editing ? (
          <input
            className="demo-header__title-input"
            value={draft}
            autoFocus
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                commit();
              } else if (event.key === 'Escape') {
                setDraft(title);
                setEditing(false);
              }
            }}
          />
        ) : (
          <button
            type="button"
            className="demo-header__title-text"
            title="点击编辑标题"
            onClick={() => {
              setDraft(title);
              setEditing(true);
            }}
          >
            {title}
          </button>
        )}
      </div>
      <div className="demo-header__actions">
        <button
          type="button"
          className="demo-icon-button"
          title="导出 Markdown"
          aria-label="导出 Markdown"
          onClick={onExport}
        >
          <Download size={16} />
        </button>
        <button
          type="button"
          className="demo-icon-button"
          title={theme === 'dark' ? '切换为浅色' : '切换为深色'}
          aria-label="切换明暗主题"
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          type="button"
          className="demo-icon-button"
          title="清空会话"
          aria-label="清空会话"
          onClick={onClear}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </header>
  );
}
