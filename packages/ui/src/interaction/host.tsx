import { XIcon } from 'lucide-react';
import type { PageDsl } from 'pactor-core';
import {
  createPageRuntime,
  PageRuntimeView,
  useRenderer,
  type PageRuntime,
  type RendererContextValue,
} from 'pactor-runtime';
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';

import { cn } from '../lib/utils.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog.js';
import type { OverlayEntry, OverlayManager } from './manager.js';

// props 契约类型（本地定义）
/**
 * page overlay 的页面加载函数（通常包装 pactor-resource loader）：
 * pageId → PageDsl（可异步）。
 */
export type ResolvePageFn = (pageId: string) => PageDsl | Promise<PageDsl>;

export interface OverlayHostProps {
  manager: OverlayManager;
  /** page 类型 overlay 的页面加载函数；未注入时 page overlay 渲染受控错误提示 */
  resolvePage?: ResolvePageFn;
}

/** 把 OverlayConfig.width（number | string）转为 CSS width 值 */
function toCssWidth(width: number | string | undefined): string | undefined {
  if (width === undefined) {
    return undefined;
  }
  return typeof width === 'number' ? `${width}px` : width;
}

/**
 * ShadcnOverlayHost：与 pactor-interaction 的 OverlayHost（antd 版）契约一致——
 * 订阅同一 OverlayManager 堆栈逐条渲染；type 为 modal 用 vendored shadcn
 * Dialog、drawer 用自绘固定右侧面板 + 遮罩（无 drawer 原语）；title/width
 * 原样应用；UI 取消（X / 遮罩 / Escape）触发取消语义 close（resolve
 * `{ success: false }`）。
 *
 * 与 antd 版相同：必须位于 PageRuntime 的 React Context 之内；DSL content
 * 经当前 Renderer 的 `renderChildren` 渲染，作用域注入
 * `{ params: entry.params, parent: 父作用域快照 }`；page overlay 经注入的
 * resolvePage 加载并创建共享宿主 registries 的子 PageRuntime。
 */
export function ShadcnOverlayHost({ manager, resolvePage }: OverlayHostProps) {
  const renderer = useRenderer();
  const stack = useSyncExternalStore(
    (onChange) => manager.subscribe(onChange),
    () => manager.stack(),
  );
  // 订阅 state / data 变化：overlay 内容里绑定 store 的表达式
  //（如 options: ${state.xxx}）随之重渲染（表单联动等场景）
  useSyncExternalStore(
    (onChange) => {
      const offState = renderer.context.state.subscribe(onChange);
      const offData = renderer.context.data.subscribe(onChange);
      return () => {
        offState();
        offData();
      };
    },
    () =>
      `${renderer.context.state.getVersion()}:${renderer.context.data.getVersion()}`,
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

/** 单个 overlay 条目 → shadcn Dialog（modal）/ 自绘面板（drawer） */
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
      <ShadcnDrawerView entry={entry} onCancel={handleCancel}>
        {body}
      </ShadcnDrawerView>
    );
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
    >
      <DialogContent
        data-slot="overlay-modal"
        // 显式 width 时解除默认 sm:max-w-lg 上限，与 antd 版 width 语义一致
        className={cn(entry.width !== undefined && 'sm:max-w-none')}
        style={
          entry.width === undefined
            ? undefined
            : { width: toCssWidth(entry.width) }
        }
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{entry.title ?? ''}</DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              data-slot="overlay-modal-close"
              aria-label="关闭"
              className="absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <XIcon className="size-4" />
            </button>
          </DialogClose>
        </DialogHeader>
        <div data-slot="overlay-modal-body">{body}</div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 自绘 Drawer（无 drawer/sheet 原语）：固定右侧面板 + 遮罩；
 * Escape / 遮罩点击 / X 均触发取消语义。
 */
function ShadcnDrawerView({
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
    <div data-slot="drawer-root">
      <div
        data-slot="drawer-mask"
        data-testid="drawer-mask"
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onCancel}
      />
      <div
        data-slot="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label={entry.title}
        style={panelStyle}
        className="fixed inset-y-0 right-0 z-50 flex w-96 max-w-full flex-col border-l border-border bg-background shadow-lg"
      >
        <div
          data-slot="drawer-header"
          className="flex items-center justify-between border-b border-border px-6 py-4"
        >
          <span className="text-lg font-semibold">{entry.title ?? ''}</span>
          <button
            type="button"
            data-slot="drawer-close"
            aria-label="关闭"
            className="cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            onClick={onCancel}
          >
            <XIcon className="size-4" />
          </button>
        </div>
        <div data-slot="drawer-body" className="flex-1 overflow-auto p-6">
          {children}
        </div>
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
          `[pactor-ui] page overlay（pageId: "${entry.page?.pageId}"）需要 ShadcnOverlayHost 注入 resolvePage`,
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
