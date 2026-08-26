import { Download, Moon, Sun, Trash2 } from 'lucide-react';
import { Button, Input } from 'pactor-ui/ui';
import { useState } from 'react';

/**
 * 应用顶栏（对应参考页 workspace 顶栏）：左侧可编辑会话标题
 * （点击进入编辑，Enter / blur 提交），右侧安静的图标按钮：
 * 导出 Markdown、明暗切换、清空会话。
 * 视觉经 `pactor-ui/ui` 原语（Button/Input）与语义令牌表达。
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
    <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-background/60 px-4 py-2">
      <div className="min-w-0">
        {editing ? (
          <Input
            className="h-8 w-52 font-semibold"
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
          <Button
            variant="ghost"
            size="sm"
            className="px-2 text-sm font-semibold"
            title="点击编辑标题"
            onClick={() => {
              setDraft(title);
              setEditing(true);
            }}
          >
            {title}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          title="导出 Markdown"
          aria-label="导出 Markdown"
          onClick={onExport}
        >
          <Download size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title={theme === 'dark' ? '切换为浅色' : '切换为深色'}
          aria-label="切换明暗主题"
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="清空会话"
          aria-label="清空会话"
          onClick={onClear}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </header>
  );
}
