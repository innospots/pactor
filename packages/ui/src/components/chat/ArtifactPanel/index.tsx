import type { Registry } from '@pactor-app/core';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { Button } from '../../components/Button/index.js';
import { CodeBlock } from '../../components/CodeBlock/index.js';
import { DropdownMenu } from '../../components/DropdownMenu/index.js';
import { Icon } from '../../components/Icon/index.js';
import { Markdown } from '../../components/Markdown/index.js';
import {
  buildArtifactTree,
  isImageArtifact,
  resolveArtifactFileType,
  resolveArtifactIconName,
  type ArtifactTreeNode,
  type ChatPageArtifact,
} from './artifact.js';
import { downloadArtifact } from './download.js';
import {
  ArtifactDslContent,
  useArtifactPreviewRuntime,
} from './dsl-preview.js';

/**
 * 自定义产物查看器：键为扩展名（小写不带点，如 'png' / 'md'）或 kind
 * （'markdown' / 'code' / 'text' / 'dsl'）；扩展名键优先于 kind 键，
 * 均优先于内建渲染器。查看器抛错不经守卫——宿主代码自负。
 */
export type ArtifactViewer = (artifact: ChatPageArtifact) => ReactNode;

export type ArtifactViewers = Record<string, ArtifactViewer>;

export interface ArtifactPanelProps {
  /** 当前产物；空时内容区展示 emptyText 空态 */
  artifact?: ChatPageArtifact | null;
  /** 会话内全部产物：提供后 header 左端展示目录列表切换钮，标题处展示产物切换下拉 */
  artifacts?: ChatPageArtifact[];
  /** 当前激活产物 id（下拉高亮；缺省取 artifact.id） */
  activeArtifactId?: string;
  /** 下拉 / 目录列表点击切换事件，传出产物 id（受控切换，面板不自改外部状态） */
  onSelectArtifact?: (id: string) => void;
  /** 标题兜底（无当前产物时展示，如「产物」） */
  title?: string;
  /** 无产物空态文案 */
  emptyText?: string;
  /** 关闭按钮事件 */
  onClose?: () => void;
  /** 下载事件；缺省内部走浏览器下载（downloadArtifact） */
  onDownload?: (artifact: ChatPageArtifact) => void;
  /** dsl 产物活预览的 Safe Registry；缺省时 dsl 内容渲染降级块 */
  safeRegistry?: Registry<unknown>;
  /** 注入 dsl 预览作用域 user */
  user?: Record<string, unknown>;
  /** 自定义产物查看器（扩展名 / kind → 预览），优先于内建渲染器 */
  artifactViewers?: ArtifactViewers;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** 产物图标（扩展名优先，kind 兜底）：切换下拉 / 目录列表共用 */
function ArtifactKindIcon({ artifact }: { artifact: ChatPageArtifact }) {
  return <Icon name={resolveArtifactIconName(artifact)} size={13} />;
}

/** 目录列表视图：目录（可折叠）+ 产物行（kind 图标 + 名称），点击经 onSelect 传出产物 id */
function ArtifactListView({
  nodes,
  activeId,
  onSelect,
}: {
  nodes: ArtifactTreeNode[];
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <ul data-slot="artifact-panel-list" className="flex flex-col gap-0.5">
      {nodes.map((node) => (
        <ArtifactTreeRow
          key={node.path}
          node={node}
          activeId={activeId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function ArtifactTreeRow({
  node,
  activeId,
  onSelect,
}: {
  node: ArtifactTreeNode;
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  if (node.artifact) {
    return (
      <li>
        <button
          type="button"
          data-slot="artifact-panel-list-item"
          data-active={node.artifact.id === activeId}
          className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent data-[active=true]:bg-accent"
          onClick={() => onSelect?.(node.artifact!.id)}
        >
          <ArtifactKindIcon artifact={node.artifact} />
          <span className="min-w-0 flex-1 truncate">{node.artifact.title}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {node.artifact.kind}
          </span>
        </button>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        data-slot="artifact-panel-list-folder"
        aria-expanded={open}
        data-open={open}
        className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="inline-flex transition-transform data-[open=true]:rotate-90" data-open={open}>
          <Icon name="chevron-right" size={12} />
        </span>
        <Icon name="folder" size={13} />
        <span className="min-w-0 flex-1 truncate">{node.name}</span>
      </button>
      {open && (
        <div className="pl-4">
          <ArtifactListView
            nodes={node.children}
            activeId={activeId}
            onSelect={onSelect}
          />
        </div>
      )}
    </li>
  );
}

/** 图片类产物：content 为 URL / data URL；svg 另支持原始标记
 * （data URL + <img> 呈现，标记内脚本不执行） */
function ArtifactImageContent({ artifact }: { artifact: ChatPageArtifact }) {
  const raw = String(artifact.content).trim();
  const src =
    raw.startsWith('<svg') || raw.startsWith('<?xml')
      ? `data:image/svg+xml;utf8,${encodeURIComponent(raw)}`
      : raw;
  return (
    <div data-slot="artifact-panel-image" className="flex justify-center">
      <img src={src} alt={artifact.title} className="max-w-full rounded-md" />
    </div>
  );
}

/** 内容分发：自定义查看器（扩展名 → kind）→ 内建图片 → 内建 kind */
function ArtifactContent({
  artifact,
  runtime,
  viewers,
}: {
  artifact: ChatPageArtifact;
  runtime: ReturnType<typeof useArtifactPreviewRuntime>;
  viewers?: ArtifactViewers;
}): ReactNode {
  const ext = resolveArtifactFileType(artifact);
  const custom =
    (ext ? viewers?.[ext] : undefined) ?? viewers?.[artifact.kind];
  if (custom) {
    return <>{custom(artifact)}</>;
  }
  if (isImageArtifact(artifact)) {
    return <ArtifactImageContent artifact={artifact} />;
  }
  switch (artifact.kind) {
    case 'markdown':
      return <Markdown content={String(artifact.content)} />;

    case 'code':
      return (
        <CodeBlock
          code={String(artifact.content)}
          language={artifact.language}
        />
      );

    case 'text':
      return (
        <pre
          data-slot="artifact-panel-text"
          className="text-sm break-words whitespace-pre-wrap"
        >
          {String(artifact.content)}
        </pre>
      );

    case 'dsl':
      return <ArtifactDslContent content={artifact.content} runtime={runtime} />;

    default:
      return null;
  }
}

/**
 * ArtifactPanel 产物预览面板（shadcn kit；功能移植自 @pactor-app/chat
 * 的 ArtifactPanel）：标题栏（目录列表切换钮 + 标题 / 产物切换下拉 +
 * kind 角标 + 下载钮 + 关闭钮）+ 内容区。
 *
 * 内容按 artifact.kind 分发内建渲染器：markdown 安全渲染；code 经
 * CodeBlock；text 预格式文本；dsl 经白名单守卫 + 活预览，被拦截 /
 * 渲染失败一律降级为受控占位块，MUST NOT 抛错。图片类产物（扩展名
 * 识别）走内建 <img> 预览。数据与行为全部经 props / events 进出，
 * 面板不持有业务状态（列表 / 内容视图与目录折叠为内部展示状态）。
 */
export function ArtifactPanel({
  artifact,
  artifacts,
  activeArtifactId,
  onSelectArtifact,
  title = '产物',
  emptyText = '暂无产物',
  onClose,
  onDownload,
  safeRegistry,
  user,
  artifactViewers,
  className,
  style,
}: ArtifactPanelProps) {
  const runtime = useArtifactPreviewRuntime(safeRegistry, user);

  // 产物目录列表视图：header 左端切换钮在 内容 / 列表 间切换；
  // 激活产物变化（新产物打开 / 下拉切换）自动回内容视图
  const [view, setView] = useState<'content' | 'list'>('content');
  const activeId = activeArtifactId ?? artifact?.id;
  useEffect(() => {
    setView('content');
  }, [activeId]);
  const hasArtifacts = artifacts !== undefined && artifacts.length > 0;

  const headerTitle =
    view === 'list' ? '产物目录' : (artifact?.title ?? title);

  return (
    <aside
      data-slot="artifact-panel"
      data-kind={artifact?.kind}
      className={cn('flex h-full min-w-0 flex-col', className)}
      style={style}
    >
      <div className="flex shrink-0 items-center gap-1 border-b border-border px-2 py-2.5">
        {hasArtifacts ? (
          <Button
            icon="list"
            variant="text"
            tooltip={view === 'list' ? '返回内容' : '产物目录'}
            onClick={() => setView((value) => (value === 'list' ? 'content' : 'list'))}
          />
        ) : null}
        {hasArtifacts ? (
          <DropdownMenu
            items={artifacts.map((item) => ({
              label: item.title,
              value: item.id,
              icon: resolveArtifactIconName(item),
            }))}
            onSelect={(id) => onSelectArtifact?.(id)}
          >
            <span
              data-slot="artifact-panel-menu-trigger"
              className="flex min-w-0 cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-sm font-medium hover:bg-accent"
            >
              {view !== 'list' && artifact ? (
                <ArtifactKindIcon artifact={artifact} />
              ) : null}
              <span className="truncate">{headerTitle}</span>
              <Icon name="chevron-down" size={12} />
            </span>
          </DropdownMenu>
        ) : (
          <span className="min-w-0 flex-1 truncate px-1.5 text-sm font-medium">
            {headerTitle}
          </span>
        )}
        {view !== 'list' && artifact ? (
          <span className="shrink-0 rounded-md bg-accent px-1.5 py-0.5 text-xs text-muted-foreground">
            {artifact.kind}
          </span>
        ) : null}
        <span className="flex-1" />
        {artifact ? (
          <Button
            icon="download"
            variant="text"
            tooltip="下载产物"
            onClick={() =>
              onDownload ? onDownload(artifact) : void downloadArtifact(artifact)
            }
          />
        ) : null}
        <Button
          icon="x"
          variant="text"
          tooltip="收起产物区"
          onClick={() => onClose?.()}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        {view === 'list' && artifacts !== undefined ? (
          <ArtifactListView
            nodes={buildArtifactTree(artifacts)}
            activeId={activeId}
            onSelect={onSelectArtifact}
          />
        ) : artifact ? (
          <ArtifactContent
            artifact={artifact}
            runtime={runtime}
            viewers={artifactViewers}
          />
        ) : (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        )}
      </div>
    </aside>
  );
}
