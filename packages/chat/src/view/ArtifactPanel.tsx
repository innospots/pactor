import { Icon } from '@pactor-app/ui/components';
import { Registry } from '@pactor-app/core';
import type { DslNode } from '@pactor-app/core';
import { MarkdownRenderer } from '@pactor-app/markdown';
import { DslRenderer, useRenderer } from '@pactor-app/runtime';
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { ChatArtifact } from '../artifact.js';
import { isImageArtifact, resolveArtifactFileType, resolveArtifactIconName } from '../artifact.js';
import { downloadArtifact } from '../artifact-download.js';
import { CHAT_DENIED_TYPE, guardChatDsl } from '../dsl-guard.js';
import { createChatRuntime, type ChatRuntime } from '../scope.js';
import { ChatDenied } from './PartRenderer.js';
import { setChatChromeHandlers } from './chrome/actions.js';
import { ChromeSlot } from './chrome/ChromeSlot.js';
import {
  buildPanelHeaderFragment,
  ChatPanelArtifactMenu,
  ChatPanelCloseButton,
  ChatPanelContext,
  ChatPanelDownloadButton,
  ChatPanelListButton,
  PANEL_HEADER_INTERNAL_COMPONENTS,
} from './chrome/panel-header.js';

/**
 * ArtifactPanel（spec: chat-artifact-panel，设计决策 D2/D3）：
 * 产出物预览面板 = 标题栏（标题 + kind 角标 + 关闭按钮）+ 内容区。
 *
 * 内容按 artifact.kind 分发内建渲染器：markdown 经 @pactor-app/markdown
 * 安全渲染；code 只读代码块（language 仅作角标，不引高亮依赖）；
 * text 预格式文本；dsl 经 guardChatDsl 白名单守卫 + renderChildren
 * 活预览（与消息流 dsl part 同安全级），被拦截 / 渲染失败一律降级为
 * 受控占位块（ChatDenied 同款），MUST NOT 抛错。
 *
 * 纯展示组件：关闭只触发 onClose，不单方面修改外部状态。
 */
export interface ArtifactPanelProps {
  /** 当前产出物；null 时内容区为空态（inspector 槽场景常见） */
  artifact?: ChatArtifact | null;
  /**
   * 会话内全部产出物（多产物场景）：提供后 header 左端展示目录列表
   * 切换钮，文件名处展示产物切换下拉
   */
  artifacts?: ChatArtifact[];
  /** 当前激活产出物 id（下拉高亮；缺省取 artifact.id） */
  activeArtifactId?: string;
  /** 下拉 / 目录列表点击切换回调（受控切换，面板不自改外部状态） */
  onSelectArtifact?: (artifact: ChatArtifact) => void;
  /**
   * 定位产物目录视图的请求信号（卡片区"查看所有产物"）：数值变化即
   * 切换列表视图并经 onViewRequestConsumed 消费复位（消费后普通
   * 打开回内容视图）
   */
  viewRequest?: number | null;
  /** viewRequest 消费回调（组合层复位信号） */
  onViewRequestConsumed?: () => void;
  /** 面板内容槽：提供时整体替代内建渲染器（标题栏保留） */
  inspector?: ReactNode;
  /** 关闭按钮 / 遮罩点击回调 */
  onClose?: () => void;
  /** dsl 产出物活预览的 Safe Registry；缺省时 dsl 内容渲染降级块 */
  safeRegistry?: Registry<unknown>;
  /** 注入 dsl 预览作用域 user */
  user?: Record<string, unknown>;
  /**
   * 自定义产物查看器（spec: chat-artifact-panel / 自定义预览）：
   * 按扩展名 / kind 对特定文件格式提供自定义预览，优先于内建渲染器
   */
  artifactViewers?: ArtifactViewers;
  className?: string;
}

/** dsl 预览的运行时（与 ChatView 同款组装：Safe Registry + ChatDenied 占位） */
function useArtifactRuntime(
  safeRegistry: Registry<unknown> | undefined,
  user: Record<string, unknown> | undefined,
): ChatRuntime | undefined {
  return useMemo(() => {
    if (!safeRegistry) {
      return undefined;
    }
    const components = new Registry<unknown>('ChatArtifactRegistry');
    components.register(CHAT_DENIED_TYPE, ChatDenied);
    for (const name of safeRegistry.list()) {
      components.register(name, safeRegistry.get(name));
    }
    return createChatRuntime({ safeRegistry: components, user });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeRegistry, user]);
}

/**
 * dsl 活预览的受控降级守卫（chat-composition DslSlotGuard 同款模式）：
 * renderChildren 求值 / 组件渲染抛错时降级为占位块，不击穿面板。
 */
class ArtifactDslGuard extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override componentDidCatch(error: unknown): void {
    console.warn('[@pactor-app/chat] DSL 产出物渲染失败，已降级展示', error);
  }

  override render(): ReactNode {
    return this.state.failed ? (
      <div className="pactor-chat-denied">DSL 产出物渲染失败，已降级展示</div>
    ) : (
      this.props.children
    );
  }
}

/** 在 DslRenderer 上下文内经 renderChildren 渲染守卫后的 dsl 产出物 */
function ArtifactDslNode({ node }: { node: DslNode }): ReactNode {
  const { renderChildren } = useRenderer();
  return <>{renderChildren([node])}</>;
}

/** dsl 产出物内容：守卫 + 活预览；不可用 / 失败均受控降级 */
function ArtifactDslContent({
  content,
  runtime,
}: {
  content: unknown;
  runtime: ChatRuntime | undefined;
}): ReactNode {
  const node =
    typeof content === 'object' &&
    content !== null &&
    !Array.isArray(content) &&
    typeof (content as { type?: unknown }).type === 'string'
      ? (content as DslNode)
      : undefined;
  if (!node || !runtime) {
    return (
      <div className="pactor-chat-denied">
        {node
          ? 'DSL 预览不可用（未注入 Safe Registry）'
          : 'DSL 产出物内容无效'}
      </div>
    );
  }
  const guarded = guardChatDsl(node, runtime.context.components);
  return (
    <DslRenderer context={runtime.context} engine={runtime.engine}>
      <ArtifactDslGuard>
        <ArtifactDslNode node={guarded} />
      </ArtifactDslGuard>
    </DslRenderer>
  );
}

/** 产物图标（扩展名优先，kind 兜底）：tabs / 目录列表共用 */
function ArtifactKindIcon({ artifact }: { artifact: ChatArtifact }) {
  return <Icon name={resolveArtifactIconName(artifact)} size={13} />;
}

/**
 * 产物目录树（纯函数）：按 id 的 '/' 分段建目录层级——
 * id 形如 `reports/q3/月报` 时产出 reports → q3 两级目录；
 * 无 '/' 分段的产物平铺在根层。目录先于文件、各自按名称排序。
 */
export interface ArtifactTreeNode {
  /** 段名（目录名或产物标题） */
  name: string;
  /** 完整路径（目录为 id 前缀，文件为产物 id） */
  path: string;
  artifact?: ChatArtifact;
  children: ArtifactTreeNode[];
}

export function buildArtifactTree(artifacts: ChatArtifact[]): ArtifactTreeNode[] {
  const root: ArtifactTreeNode = { name: '', path: '', children: [] };
  for (const artifact of artifacts) {
    const segments = artifact.id.split('/').filter(Boolean);
    let node = root;
    // 末段是文件本身，前面的段是目录
    for (let i = 0; i < segments.length - 1; i++) {
      const path = segments.slice(0, i + 1).join('/');
      let child = node.children.find(
        (item) => item.path === path && item.artifact === undefined,
      );
      if (!child) {
        child = { name: segments[i]!, path, children: [] };
        node.children.push(child);
      }
      node = child;
    }
    node.children.push({
      name: artifact.title,
      path: artifact.id,
      artifact,
      children: [],
    });
  }
  const sortLevel = (nodes: ArtifactTreeNode[]): void => {
    nodes.sort((a, b) => {
      const dirDelta = Number(b.artifact === undefined) - Number(a.artifact === undefined);
      return dirDelta !== 0 ? dirDelta : a.name.localeCompare(b.name);
    });
    for (const item of nodes) {
      sortLevel(item.children);
    }
  };
  sortLevel(root.children);
  return root.children;
}

/** 目录列表视图：目录（可折叠）+ 产物行（kind 图标 + 名称），点击查看内容 */
function ArtifactListView({
  nodes,
  activeId,
  onSelect,
}: {
  nodes: ArtifactTreeNode[];
  activeId?: string;
  onSelect?: (artifact: ChatArtifact) => void;
}) {
  return (
    <ul className="pactor-chat-inspector__list">
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
  onSelect?: (artifact: ChatArtifact) => void;
}) {
  const [open, setOpen] = useState(true);
  if (node.artifact) {
    return (
      <li>
        <button
          type="button"
          className="pactor-chat-inspector__list-item"
          data-active={node.artifact.id === activeId}
          onClick={() => onSelect?.(node.artifact!)}
        >
          <ArtifactKindIcon artifact={node.artifact} />
          <span className="pactor-chat-inspector__list-item-title">
            {node.artifact.title}
          </span>
          <span className="pactor-chat-inspector__kind">
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
        className="pactor-chat-inspector__list-folder"
        aria-expanded={open}
        data-open={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="pactor-chat-trace__chevron">
          <Icon name="chevron-right" size={12} />
        </span>
        <Icon name="folder" size={13} />
        <span>{node.name}</span>
      </button>
      {open && (
        <div className="pactor-chat-inspector__list-children">
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

/**
 * 自定义产物查看器（spec: chat-artifact-panel / 自定义预览）：
 * 键为扩展名（小写不带点，如 'png' / 'md'）或 kind
 * （'markdown' / 'code' / 'text' / 'dsl'）；扩展名键优先于 kind 键，
 * 均优先于内建渲染器。查看器抛错不经守卫——宿主代码自负。
 */
export type ArtifactViewer = (artifact: ChatArtifact) => ReactNode;

export type ArtifactViewers = Record<string, ArtifactViewer>;

/** 图片类产物：content 为 URL / data URL；svg 另支持原始标记
 * （data URL + <img> 呈现，标记内脚本不执行） */
function ArtifactImageContent({ artifact }: { artifact: ChatArtifact }) {
  const raw = String(artifact.content).trim();
  const src =
    raw.startsWith('<svg') || raw.startsWith('<?xml')
      ? `data:image/svg+xml;utf8,${encodeURIComponent(raw)}`
      : raw;
  return (
    <div className="pactor-chat-inspector__image">
      <img src={src} alt={artifact.title} />
    </div>
  );
}

/** 内容分发：自定义查看器（扩展名 → kind）→ 内建图片 → 内建 kind */
function ArtifactContent({
  artifact,
  runtime,
  viewers,
}: {
  artifact: ChatArtifact;
  runtime: ChatRuntime | undefined;
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
      return <MarkdownRenderer content={String(artifact.content)} />;

    case 'code':
      return (
        <div className="pactor-chat-inspector__code">
          {artifact.language ? (
            <span className="pactor-chat-inspector__code-lang">
              {artifact.language}
            </span>
          ) : null}
          <pre>
            <code>{String(artifact.content)}</code>
          </pre>
        </div>
      );

    case 'text':
      return (
        <pre className="pactor-chat-inspector__text">
          {String(artifact.content)}
        </pre>
      );

    case 'dsl':
      return <ArtifactDslContent content={artifact.content} runtime={runtime} />;

    default:
      return null;
  }
}

export function ArtifactPanel({
  artifact,
  artifacts,
  activeArtifactId,
  onSelectArtifact,
  viewRequest,
  onViewRequestConsumed,
  inspector,
  onClose,
  safeRegistry,
  user,
  artifactViewers,
  className,
}: ArtifactPanelProps): ReactNode {
  const runtime = useArtifactRuntime(safeRegistry, user);

  // 产物目录列表视图：header 左端切换钮在 内容 / 列表 间切换；
  // 激活产物变化（新产物打开 / 下拉切换）自动回内容视图
  const [view, setView] = useState<'content' | 'list'>('content');
  const activeId = activeArtifactId ?? artifact?.id;
  useEffect(() => {
    setView('content');
  }, [activeId]);
  // "查看所有产物"定位产物目录视图：信号到达即切列表并消费复位
  // （声明在 activeId 复位之后——同一次打开（激活首项 + 信号）
  // 两个 effect 同提交触发时列表视图胜出）
  useEffect(() => {
    if (viewRequest != null) {
      setView('list');
      onViewRequestConsumed?.();
    }
    // onViewRequestConsumed 由组合层内联提供，随渲染恒新，不入依赖
  }, [viewRequest]);
  const showListButton = artifacts !== undefined && artifacts.length > 0;
  // 有产物清单时 header 文件名处渲染切换下拉（单产物亦可经下拉进列表语义）
  const showMenu = artifacts !== undefined && artifacts.length > 0;
  const toggleListRef = useRef(() => {});
  toggleListRef.current = () =>
    setView((value) => (value === 'list' ? 'content' : 'list'));

  // DSL 路径的关闭 / 列表切换 / 下载桥接（spec: chat-on-ui-components）：
  // chat.panelClose / panelToggleList / panelDownload 内建动作 → 回调
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const artifactRef = useRef(artifact);
  artifactRef.current = artifact;
  useEffect(() => {
    setChatChromeHandlers({
      panelClose: () => closeRef.current?.(),
      panelToggleList: () => toggleListRef.current(),
      panelDownload: () => {
        const current = artifactRef.current;
        if (current) {
          void downloadArtifact(current);
        }
      },
    });
  }, []);

  // 拖拽调宽（spec: chat-artifact-panel / 面板布局与响应式）：
  // 面板左缘手柄 pointer 拖拽实时改宽，结果存内部 state（inline width
  // 覆盖 --pactor-chat-inspector-width 缺省），不向外部受控；窄屏抽屉
  // 形态手柄由 CSS 隐藏
  const panelRef = useRef<HTMLElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  const handleResizeStart = (event: React.PointerEvent): void => {
    event.preventDefault();
    const panel = panelRef.current;
    if (!panel) {
      return;
    }
    const startWidth = panel.getBoundingClientRect().width;
    const startX = event.clientX;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    const onMove = (moveEvent: PointerEvent): void => {
      // 向左拖（clientX 减小）→ 变宽；夹取 [min-width 令牌 480px,
      // min(max-width 令牌 600px, host 宽 2/3)]。
      // host 宽每次移动重测（拖拽中窗口 / 侧栏尺寸可能变化）；CSS 侧另有
      // max-width 硬兜底（inline width 不能覆盖 max-width）
      const hostRect = panel.parentElement?.getBoundingClientRect();
      const hostWidth =
        hostRect !== undefined && hostRect.width > 0
          ? hostRect.width
          : window.innerWidth;
      const maxWidth = Math.min(600, (hostWidth * 2) / 3);
      const next = startWidth + (startX - moveEvent.clientX);
      setWidth(Math.round(Math.min(Math.max(next, 480), maxWidth)));
    };
    const onUp = (): void => {
      document.body.style.userSelect = prevUserSelect;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  return (
    <ChatPanelContext.Provider
      value={{
        artifacts: artifacts ?? [],
        activeId,
        view,
        onSelectArtifact,
      }}
    >
      <aside
        ref={panelRef}
        className={`pactor-chat-inspector${className ? ` ${className}` : ''}`}
        data-kind={artifact?.kind}
        style={width !== null ? { width: `${width}px` } : undefined}
      >
        <div
          className="pactor-chat-inspector__resize"
          role="separator"
          aria-orientation="vertical"
          aria-label="拖动调整面板宽度"
          onPointerDown={handleResizeStart}
        />
        <div className="pactor-chat-inspector__header">
          <ChromeSlot
            fragment={buildPanelHeaderFragment({
              title:
                view === 'list'
                  ? '产物目录'
                  : (artifact?.title ?? '产出物'),
              kind: artifact?.kind ?? 'text',
              showListButton,
              showDownload: artifact != null,
              showMenu,
              view,
            })}
            components={PANEL_HEADER_INTERNAL_COMPONENTS}
            fallback={
              <>
                {showListButton ? <ChatPanelListButton /> : null}
                {showMenu ? (
                  <ChatPanelArtifactMenu />
                ) : (
                  <span className="pactor-chat-inspector__title">
                    {view === 'list'
                      ? '产物目录'
                      : (artifact?.title ?? '产出物')}
                  </span>
                )}
                {view !== 'list' && artifact ? (
                  <span className="pactor-chat-inspector__kind">
                    {artifact.kind}
                  </span>
                ) : null}
                {artifact ? <ChatPanelDownloadButton /> : null}
                <ChatPanelCloseButton />
              </>
            }
          />
        </div>
        <div className="pactor-chat-inspector__body">
          {view === 'list' && artifacts !== undefined ? (
            <ArtifactListView
              nodes={buildArtifactTree(artifacts)}
              activeId={activeId}
              onSelect={onSelectArtifact}
            />
          ) : inspector !== undefined && inspector !== null ? (
            inspector
          ) : artifact ? (
            <ArtifactContent
              artifact={artifact}
              runtime={runtime}
              viewers={artifactViewers}
            />
          ) : null}
        </div>
      </aside>
    </ChatPanelContext.Provider>
  );
}
