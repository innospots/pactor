import * as Dialog from '@radix-ui/react-dialog';
import type { PageDsl } from 'pactor-core';
import type {
  OverlayEntry,
  OverlayHostProps,
  OverlayManager,
  ResolvePageFn,
} from 'pactor-ui-antd/interaction';
import {
  createPageRuntime,
  PageRuntimeView,
  useRenderer,
  type PageRuntime,
  type RendererContextValue,
} from 'pactor-runtime';
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

// props 契约类型直接复用 pactor-ui-antd interaction 层（antd 版）的导出
export type { OverlayHostProps, ResolvePageFn } from 'pactor-ui-antd/interaction';

/** 把 OverlayConfig.width（number | string）转为 CSS width 值 */
function toCssWidth(width: number | string | undefined): string | undefined {
  if (width === undefined) {
    return undefined;
  }
  return typeof width === 'number' ? `${width}px` : width;
}

/**
 * RadixOverlayHost：与 pactor-interaction 的 OverlayHost（antd 版）契约一致——
 * 订阅同一 OverlayManager 堆栈逐条渲染；type 为 modal 用 Radix Dialog、
 * drawer 用自绘固定右侧面板 + 遮罩（Radix 无 drawer 原语）；title/width
 * 原样应用；UI 取消（X / 遮罩 / Escape）触发取消语义 close（resolve
 * `{ success: false }`）。
 *
 * 与 antd 版相同：必须位于 PageRuntime 的 React Context 之内；DSL content
 * 经当前 Renderer 的 `renderChildren` 渲染，作用域注入
 * `{ params: entry.params, parent: 父作用域快照 }`；page overlay 经注入的
 * resolvePage 加载并创建共享宿主 registries 的子 PageRuntime。
 */
export function RadixOverlayHost({ manager, resolvePage }: OverlayHostProps) {
  const renderer = useRenderer();
  const stack = useSyncExternalStore(
    (onChange) => manager.subscribe(onChange),
    () => manager.stack(),
  );

  return (
    <>
      {stack.map((entry) => (
        <OverlayEntryView
          key={entry.id}
          entry={entry}
          manager={manager}
          renderer={renderer}
          resolvePage={resolvePage}
        />
      ))}
    </>
  );
}

interface OverlayEntryViewProps {
  entry: OverlayEntry;
  manager: OverlayManager;
  renderer: RendererContextValue;
  resolvePage?: ResolvePageFn;
}

/** 单个 overlay 条目 → Radix Dialog（modal）/ 自绘面板（drawer） */
function OverlayEntryView({
  entry,
  manager,
  renderer,
  resolvePage,
}: OverlayEntryViewProps) {
  // UI 取消（X / 遮罩 / Escape）：取消语义 close
  const handleCancel = () => manager.close(entry.id);

  let body: ReactNode = null;
  if (entry.content) {
    // 当前 Renderer 渲染 DSL content，作用域注入 params 与 parent
    body = renderer.renderChildren([entry.content], {
      params: entry.params ?? {},
      parent: manager.parentScopeOf(entry.id),
    });
  } else if (entry.page) {
    body = (
      <PageOverlayBody
        entry={entry}
        renderer={renderer}
        resolvePage={resolvePage}
      />
    );
  }

  if (entry.type === 'drawer') {
    return (
      <RadixDrawerView entry={entry} onCancel={handleCancel}>
        {body}
      </RadixDrawerView>
    );
  }
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="pcr-modal-overlay" />
        <Dialog.Content
          className="pcr-modal-content"
          style={
            entry.width === undefined
              ? undefined
              : { width: toCssWidth(entry.width) }
          }
        >
          <div className="pcr-modal-header">
            <Dialog.Title className="pcr-modal-title">
              {entry.title ?? ''}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="pcr-modal-close"
                aria-label="关闭"
              >
                ×
              </button>
            </Dialog.Close>
          </div>
          <div className="pcr-modal-body">{body}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * 自绘 Drawer（Radix 无 drawer 原语）：固定右侧面板 + 遮罩；
 * Escape / 遮罩点击 / X 均触发取消语义。
 */
function RadixDrawerView({
  entry,
  onCancel,
  children,
}: {
  entry: OverlayEntry;
  onCancel: () => void;
  children?: ReactNode;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  const panelStyle =
    entry.width === undefined ? undefined : { width: toCssWidth(entry.width) };

  return (
    <div className="pcr-drawer-root">
      <div
        className="pcr-drawer-mask"
        data-testid="pcr-drawer-mask"
        onClick={onCancel}
      />
      <div
        className="pcr-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label={entry.title}
        style={panelStyle}
      >
        <div className="pcr-drawer-header">
          <span className="pcr-drawer-title">{entry.title ?? ''}</span>
          <button
            type="button"
            className="pcr-drawer-close"
            aria-label="关闭"
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <div className="pcr-drawer-body">{children}</div>
      </div>
    </div>
  );
}

/**
 * page overlay 内容（复刻 pactor-interaction host 的非 antd 逻辑）：
 * 经注入的 resolvePage(pageId) 加载 PageDsl，创建子 PageRuntime（共享
 * 宿主页面的组件 / 服务 / 动作等注册表，entry.params 作为子运行时
 * route.params 即 scope 的 params 键）渲染 body；条目关闭（组件卸载）
 * 时 destroy 子运行时；未注入 resolvePage 渲染受控错误提示。
 */
function PageOverlayBody({
  entry,
  renderer,
  resolvePage,
}: {
  entry: OverlayEntry;
  renderer: RendererContextValue;
  resolvePage?: ResolvePageFn;
}) {
  const [child, setChild] = useState<PageRuntime | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!resolvePage) {
      setError(
        new Error(
          `[pactor-interaction-radix] page overlay（pageId: "${entry.page?.pageId}"）需要 RadixOverlayHost 注入 resolvePage`,
        ),
      );
      return;
    }
    let cancelled = false;
    let created: PageRuntime | null = null;
    void (async () => {
      try {
        const pageDsl: PageDsl = await resolvePage(entry.page?.pageId ?? '');
        if (cancelled) {
          return;
        }
        const host = renderer.context;
        created = createPageRuntime(pageDsl, {
          app: host.app,
          user: host.user,
          components: host.components,
          services: host.services,
          actions: host.actions,
          permission: host.permission,
          capabilities: host.capabilities,
          http: host.http,
          route: { params: entry.params ?? {} },
        });
        setChild(created);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause : new Error(String(cause)));
        }
      }
    })();
    return () => {
      cancelled = true;
      void created?.destroy();
    };
    // 每个条目（id 唯一）只加载一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id]);

  if (error) {
    // 受控错误提示，不抛未捕获异常
    return <div role="alert">{error.message}</div>;
  }
  if (!child) {
    return null;
  }
  return <PageRuntimeView runtime={child} />;
}
