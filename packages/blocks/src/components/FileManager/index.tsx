import { useI18n } from '@pactor-app/runtime';
import { useMemo, useRef, useState, type CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import {
  AlertDialog as ShadcnAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  CopyButton,
} from '@pactor-app/ui/ui';
import { Icon, Panel, Tree, type TreeNodeData } from '@pactor-app/ui/components';
import { ScriptEditor } from '../ScriptEditor/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

/** 文件树节点；`type` 缺省时按有无 children 推断目录/文件 */
export interface FileManagerNode {
  key: string;
  title: string;
  /** 目录 / 文件；缺省：有 children 为目录，否则为文件 */
  type?: 'directory' | 'file';
  children?: FileManagerNode[];
  /** 文件内容（file 节点，内容区展示/编辑的文本） */
  content?: string;
  /** 语法模式（缺省按扩展名推断，未知回退纯文本） */
  language?: string;
  /** 内容 header 展示路径（缺省按树层级拼接 title，如 src/index.ts） */
  path?: string;
}

/** 选中文件事件载荷（Renderer 绑定 events.onSelect，${event} 读取） */
export interface FileManagerSelectInfo {
  key: string;
  path: string;
}

/** 编辑内容变化事件载荷（Renderer 绑定 events.onChange，${event} 读取） */
export interface FileManagerChangeInfo {
  key: string;
  content: string;
}

export interface FileManagerProps {
  /** Panel header 标题 */
  title?: string;
  /** 左侧目录树上方标题 */
  treeTitle?: string;
  /** 目录及文件树数据 */
  files?: FileManagerNode[];
  /** Panel 边框，默认 true */
  bordered?: boolean;
  /** 全局只读：隐藏编辑按钮，内容仅可查看 / 复制，默认 false */
  readonly?: boolean;
  /** 编辑器高度（px），默认 480 */
  editorHeight?: number;
  /** 受控选中文件 key（配 events.onSelect 回写） */
  selectedKey?: string;
  /** 非受控初始选中文件 key */
  defaultSelectedKey?: string;
  /** 非受控初始展开目录 keys（缺省全部目录展开） */
  defaultExpandedKeys?: string[];
  /** 选中文件事件，传出 { key, path } */
  onSelect?: (info: FileManagerSelectInfo) => void;
  /** 编辑模式下内容变化事件，传出 { key, content } */
  onChange?: (info: FileManagerChangeInfo) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

// ─── Helpers（纯函数，便于单测） ────────────────────────────────────────────────

function isDirectory(node: FileManagerNode): boolean {
  return node.type ? node.type === 'directory' : (node.children?.length ?? 0) > 0;
}

/** 全部目录 key（缺省展开态） */
export function collectDirectoryKeys(nodes: FileManagerNode[]): string[] {
  const keys: string[] = [];
  const walk = (list: FileManagerNode[]) => {
    for (const node of list) {
      if (isDirectory(node)) {
        keys.push(node.key);
        walk(node.children ?? []);
      }
    }
  };
  walk(nodes);
  return keys;
}

/** 按 key 查找节点，返回节点与展示路径（path 字段优先，否则按层级拼接 title） */
export function findFileNode(
  nodes: FileManagerNode[],
  key: string,
): { node: FileManagerNode; path: string } | null {
  const walk = (
    list: FileManagerNode[],
    ancestors: string[],
  ): { node: FileManagerNode; path: string } | null => {
    for (const node of list) {
      const path = node.path ?? [...ancestors, node.title].join('/');
      if (node.key === key) return { node, path };
      const hit = walk(node.children ?? [], [...ancestors, node.title]);
      if (hit) return hit;
    }
    return null;
  };
  return walk(nodes, []);
}

/** 扩展名 → 语法模式（ScriptEditor 内置 javascript/json/python/sql，其余纯文本） */
export function guessLanguage(title: string): string {
  const ext = title.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    ts: 'javascript',
    tsx: 'javascript',
    json: 'json',
    py: 'python',
    sql: 'sql',
  };
  return map[ext] ?? 'text';
}

/** 草稿脏检查：编辑态且草稿与原文不同（切换文件时据此拦截确认） */
export function isDraftDirty(
  editing: boolean,
  draft: string | undefined,
  original: string,
): boolean {
  return editing && draft !== undefined && draft !== original;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * FileManager 文件管理器（区块组件）：Panel 容器内左树右内容——
 * header 左侧标题；内容区左侧目录/文件树（上方可设 treeTitle，目录 folder /
 * 文件 file-text 图标，键盘可达：roving tabindex + 方向键 + Enter 选中），右侧为
 * 选中文件的内容视图：内容 header（左：文件图标 + 路径，文件名加重；右：编辑切换 +
 * 复制按钮）+ ScriptEditor（默认只读，点编辑进入编辑模式；readonly 全局
 * 只读时隐藏编辑按钮）。点击目录标题展开/收起，点击文件选中展示。
 * 草稿守卫：编辑中且有未保存修改时切换文件，弹确认框（放弃修改 / 继续编辑）。
 */
export function FileManager({
  title,
  treeTitle,
  files = [],
  bordered = true,
  readonly = false,
  editorHeight = 480,
  selectedKey,
  defaultSelectedKey,
  defaultExpandedKeys,
  onSelect,
  onChange,
  className,
  style,
}: FileManagerProps) {
  const { t } = useI18n();
  const [innerSelected, setInnerSelected] = useState<string | undefined>(
    defaultSelectedKey,
  );
  const [expanded, setExpanded] = useState<string[]>(
    () => defaultExpandedKeys ?? collectDirectoryKeys(files),
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string | undefined>(undefined);
  // 草稿守卫：脏草稿时点击其他文件 → 暂存目标并弹确认框
  const [pendingSwitch, setPendingSwitch] = useState<{
    key: string;
    path: string;
  } | null>(null);
  // 复制失败反馈：按钮短暂展示失败文案（剪贴板不可用 / 非安全上下文）
  const [copyFailed, setCopyFailed] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = selectedKey !== undefined ? selectedKey : innerSelected;
  const current = selected ? findFileNode(files, selected) : null;
  const currentFile = current && !isDirectory(current.node) ? current : null;

  const treeData = useMemo<TreeNodeData[]>(() => {
    const convert = (nodes: FileManagerNode[]): TreeNodeData[] =>
      nodes.map((node) => ({
        key: node.key,
        title: node.title,
        icon: isDirectory(node) ? 'folder' : 'file-text',
        children: node.children ? convert(node.children) : undefined,
      }));
    return convert(files);
  }, [files]);

  /** 切换选中文件：重置编辑态与草稿 */
  const selectFile = (key: string, path: string) => {
    if (selectedKey === undefined) setInnerSelected(key);
    setEditing(false);
    setDraft(undefined);
    onSelect?.({ key, path });
  };

  const dirty = isDraftDirty(editing, draft, currentFile?.node.content ?? '');

  const handleTreeSelect = (keys: string[]) => {
    const key = keys[0];
    if (!key) return;
    const hit = findFileNode(files, key);
    if (!hit) return;
    if (isDirectory(hit.node)) {
      // 目录标题点击 = 展开/收起
      setExpanded((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
      );
      return;
    }
    // 脏草稿时切换到其他文件需确认（守卫 P0：草稿静默丢失）
    if (dirty && key !== currentFile?.node.key) {
      setPendingSwitch({ key, path: hit.path });
      return;
    }
    selectFile(key, hit.path);
  };

  const displayContent = draft ?? currentFile?.node.content ?? '';
  const language = currentFile
    ? (currentFile.node.language ?? guessLanguage(currentFile.node.title))
    : 'text';
  // 路径拆分：目录前缀弱化，文件名加重（当前文件的「主角」地位）
  const pathText = currentFile?.path ?? '';
  const slashIndex = pathText.lastIndexOf('/');
  const pathPrefix = slashIndex >= 0 ? `${pathText.slice(0, slashIndex + 1)}` : '';
  const fileName = slashIndex >= 0 ? pathText.slice(slashIndex + 1) : pathText;

  return (
    <Panel
      title={title}
      bordered={bordered}
      className={className}
      style={style}
      contentClassName="p-0"
    >
      <div data-slot="file-manager" className="flex min-h-0">
        <div data-slot="file-manager-nav" className="w-60 shrink-0 border-r">
          {treeTitle ? (
            <div
              data-slot="file-manager-nav-title"
              className="flex min-h-12 items-center border-b px-3 text-sm font-medium"
            >
              {treeTitle}
            </div>
          ) : null}
          <Tree
            className="p-2"
            treeData={treeData}
            selectedKeys={currentFile ? [currentFile.node.key] : []}
            expandedKeys={expanded}
            onSelect={handleTreeSelect}
            onExpand={setExpanded}
          />
        </div>
        <div data-slot="file-manager-view" className="flex min-w-0 flex-1 flex-col">
          {currentFile ? (
            <>
              <div
                data-slot="file-manager-view-header"
                className="flex min-h-12 items-center justify-between gap-2 border-b px-4 py-1.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Icon name="file-text" size="sm" className="shrink-0 text-muted-foreground" />
                  <span
                    data-slot="file-manager-view-path"
                    title={pathText}
                    className="truncate text-sm"
                  >
                    {pathPrefix ? (
                      <span className="text-muted-foreground">{pathPrefix}</span>
                    ) : null}
                    <span className="font-medium text-foreground">{fileName}</span>
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {readonly ? null : (
                    <Button
                      type="button"
                      variant={editing ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        if (!editing) setDraft(currentFile.node.content ?? '');
                        setEditing(!editing);
                      }}
                    >
                      <Icon name={editing ? 'check' : 'pencil'} size="sm" />
                      {editing ? t('pactor.fileManager.finish') : t('pactor.fileManager.edit')}
                      {dirty ? (
                        <span
                          data-slot="file-manager-dirty-dot"
                          aria-hidden="true"
                          className="size-1.5 rounded-full bg-current"
                        />
                      ) : null}
                    </Button>
                  )}
                  <CopyButton
                    value={displayContent}
                    ariaLabel={t('pactor.fileManager.copy')}
                    label={copyFailed ? t('pactor.fileManager.copyFailed') : undefined}
                    onError={() => {
                      setCopyFailed(true);
                      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
                      copyTimerRef.current = setTimeout(() => setCopyFailed(false), 1500);
                    }}
                  />
                </div>
              </div>
              <div data-slot="file-manager-editor">
                <ScriptEditor
                  value={displayContent}
                  language={language}
                  readonly={readonly || !editing}
                  height={editorHeight}
                  bordered={false}
                  onChange={(content) => {
                    setDraft(content);
                    onChange?.({ key: currentFile.node.key, content });
                  }}
                />
              </div>
            </>
          ) : (
            <div
              data-slot="file-manager-empty"
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-2 py-16',
                'text-sm text-muted-foreground',
              )}
            >
              <Icon name="inbox" size="lg" className="text-muted-foreground" />
              {t('pactor.fileManager.empty')}
            </div>
          )}
        </div>
      </div>
      <ShadcnAlertDialog
        open={pendingSwitch !== null}
        onOpenChange={(next) => {
          if (!next) setPendingSwitch(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pactor.fileManager.discardTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pactor.fileManager.discardDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingSwitch(null)}>
              {t('pactor.fileManager.discardCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const target = pendingSwitch;
                setPendingSwitch(null);
                if (target) selectFile(target.key, target.path);
              }}
            >
              {t('pactor.fileManager.discardConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </ShadcnAlertDialog>
    </Panel>
  );
}
