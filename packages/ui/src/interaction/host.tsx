import { Loader2, XIcon } from 'lucide-react';
import type { PageDsl } from '@pactor-app/core';
import {
  createPageRuntime,
  PageRuntimeView,
  useI18n,
  useRenderer,
  type PageRuntime,
  type RendererContextValue,
} from '@pactor-app/runtime';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

import { cn } from '../lib/utils.js';
import { Button } from '../ui/button.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog.js';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer.js';
import type {
  OverlayEntry,
  OverlayFooterConfig,
  OverlayManager,
} from './manager.js';

// props 契约类型（本地定义）
/**
 * page overlay 的页面加载函数（通常包装 @pactor-app/resource loader）：
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
 * OverlayHost：订阅 OverlayManager 堆栈逐条渲染；type 为 modal 用
 * vendored shadcn Dialog、drawer 用 vendored drawer 原语（vaul，与 DSL
 * 弹层适配器同一套 src/ui 原语，design D4）；title/width 原样应用；
 * UI 取消（X / 遮罩 / Escape）触发取消语义 close（resolve
 * `{ success: false }`）。
 *
 * 必须位于 PageRuntime 的 React Context 之内；DSL content
 * 经当前 Renderer 的 `renderChildren` 渲染，作用域注入
 * `{ params: entry.params, parent: 父作用域快照 }`；page overlay 经注入的
 * resolvePage 加载并创建共享宿主 registries 的子 PageRuntime。
 */
export function OverlayHost({ manager, resolvePage }: OverlayHostProps) {
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
      {stack
        // owner 归属过滤：共享 OverlayManager 的多运行时（布局嵌套链）
        // 各自的宿主只渲染本运行时（或其子运行时）打开的条目；
        // 无 owner 的条目（程序直开）所有宿主可见
        .filter(
          (entry) =>
            entry.owner === undefined || entry.owner === renderer.context,
        )
        .map((entry) => (
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

/** 单个 overlay 条目 → shadcn Dialog（modal）/ vendored Drawer（drawer） */
function OverlayEntryView({
  entry,
  manager,
  renderer,
  resolvePage,
}: OverlayEntryViewProps) {
  const { t } = useI18n();
  // page overlay 的子运行时句柄（footer 确认键桥接表单提交用）
  const childRuntimeRef = useRef<PageRuntime | null>(null);
  // UI 取消（X / 遮罩 / Escape）：取消语义 close
  const handleCancel = () => manager.close(entry.id);

  // footer 确认：桥接 overlay 内容里命名表单的 requestSubmit（校验通过后
  // 走表单自身 onSubmit 链）；未命中表单时以 { success: true } 关闭
  const handleConfirm = () => {
    const footer = entry.footer ?? {};
    const forms = entry.page
      ? childRuntimeRef.current?.context.forms
      : renderer.context.forms;
    const handle = forms?.get(footer.confirmForm ?? 'default');
    if (handle?.submit) {
      handle.submit();
      return;
    }
    manager.close(entry.id, { success: true });
  };

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
        onRuntime={(runtime) => {
          childRuntimeRef.current = runtime;
        }}
      />
    );
  }

  const footer = entry.footer ? (
    <OverlayFooter
      footer={entry.footer}
      slot={entry.type === 'drawer' ? 'drawer-footer' : 'overlay-modal-footer'}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  ) : null;

  if (entry.type === 'drawer') {
    return (
      <ShadcnDrawerView entry={entry} onCancel={handleCancel} footer={footer}>
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
          <DialogClose
            render={
              <button
                type="button"
                data-slot="overlay-modal-close"
                aria-label={t('pactor.overlay.close')}
                className="absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <XIcon className="size-4" />
              </button>
            }
          />
        </DialogHeader>
        <div data-slot="overlay-modal-body">{body}</div>
        {footer}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Overlay 底部按钮区（modal / drawer 共用）：取消 / 确认缺省都展示，
 * 可分别隐藏；确认支持禁用 / loading。取消 = 取消语义关闭；确认 =
 * 桥接命名表单提交（未命中表单时以 { success: true } 关闭）。
 */
function OverlayFooter({
  footer,
  slot,
  onCancel,
  onConfirm,
}: {
  footer: OverlayFooterConfig;
  slot: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useI18n();
  if (footer.hideCancel && footer.hideConfirm) {
    return null;
  }
  const confirmBusy = footer.confirmLoading === true;
  return (
    <div
      data-slot={slot}
      className={cn(
        'flex items-center justify-end gap-2',
        slot === 'drawer-footer' && 'border-t border-border px-6 py-4',
      )}
    >
      {footer.hideCancel ? null : (
        <Button
          variant="outline"
          disabled={confirmBusy}
          onClick={onCancel}
          data-slot="overlay-cancel"
        >
          {footer.cancelText ?? t('pactor.overlay.cancel')}
        </Button>
      )}
      {footer.hideConfirm ? null : (
        <Button
          disabled={footer.confirmDisabled === true || confirmBusy}
          onClick={onConfirm}
          data-slot="overlay-confirm"
        >
          {confirmBusy ? <Loader2 className="animate-spin" /> : null}
          {footer.confirmText ?? t('pactor.overlay.confirm')}
        </Button>
      )}
    </div>
  );
}

/**
 * Drawer overlay：vendored drawer 原语（vaul，与 DSL Drawer 适配器同一套
 * src/ui 原语，design D4）——固定右侧面板 + 遮罩；Escape / 遮罩点击由
 * vaul 触发 onOpenChange(false)，统一走取消语义 close；拖拽关闭缺省禁止
 * （handleOnly，与 DSL Drawer 适配器缺省一致）。
 */
function ShadcnDrawerView({
  entry,
  onCancel,
  footer,
  children,
}: {
  entry: OverlayEntry;
  onCancel: () => void;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  const { t } = useI18n();
  // 显式 width 时同步内联 maxWidth：DrawerContent 自带的
  // data-[vaul-drawer-direction=right]:sm:max-w-sm（384px）在 CSS 源序上
  // 优先于 sm:max-w-none，仅靠 class 无法解除上限，内联样式才可确定生效
  const panelStyle =
    entry.width === undefined
      ? undefined
      : { width: toCssWidth(entry.width), maxWidth: toCssWidth(entry.width) };

  return (
    <Drawer
      direction="right"
      // modal={false}：vaul modal 会给 body 挂 pointer-events:none，抽屉内
      // Select/DatePicker 等 portal 弹层（挂在 body 下）随之不可点击；
      // 非 modal 时遮罩仍覆盖全屏，点击关闭改由遮罩 onClick 承担
      modal={false}
      // 缺省禁止拖拽关闭（与 DSL Drawer 适配器一致）：handleOnly 下仅
      // vaul Handle 可拖，本面板无 Handle，即不可拖拽关闭
      handleOnly
      open
      onOpenChange={(open: boolean) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DrawerContent
        data-slot="drawer-panel"
        // 显式 width 时解除默认 sm:max-w-sm 上限，与 modal width 语义一致
        className={cn(entry.width !== undefined && 'sm:max-w-none')}
        style={panelStyle}
        // onPointerDown 而非 onClick：避免弹层（Select 等）选项点击在
        // 弹层关闭动画后穿透到遮罩造成误关
        overlayProps={{ onPointerDown: onCancel }}
      >
        <DrawerHeader
          data-slot="drawer-header"
          className="flex flex-row items-center justify-between border-b border-border px-6 py-4"
        >
          <DrawerTitle className="text-lg">{entry.title ?? ''}</DrawerTitle>
          <DrawerClose asChild>
            <button
              type="button"
              data-slot="drawer-close"
              aria-label={t('pactor.overlay.close')}
              className="cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <XIcon className="size-4" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <div data-slot="drawer-body" className="flex-1 overflow-auto p-6">
          {children}
        </div>
        {footer}
      </DrawerContent>
    </Drawer>
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
  onRuntime,
}: {
  entry: OverlayEntry;
  renderer: RendererContextValue;
  resolvePage?: ResolvePageFn;
  /** 子运行时就绪/销毁回调（footer 确认键桥接表单提交用） */
  onRuntime?: (runtime: PageRuntime | null) => void;
}) {
  const [child, setChild] = useState<PageRuntime | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!resolvePage) {
      setError(
        new Error(
          `[@pactor-app/ui] page overlay（pageId: "${entry.page?.pageId}"）需要 OverlayHost 注入 resolvePage`,
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
        // 指回宿主运行时：子运行时内的 overlay.open 归属沿链上溯，
        // 嵌套弹层仍渲染在宿主运行时的 OverlayHost
        created.context.parentRuntime = host;
        setChild(created);
        onRuntime?.(created);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause : new Error(String(cause)));
        }
      }
    })();
    return () => {
      cancelled = true;
      onRuntime?.(null);
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
