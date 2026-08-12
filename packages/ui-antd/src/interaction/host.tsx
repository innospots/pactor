import { Drawer, Modal } from 'antd';
import type { PageDsl } from 'pactor-core';
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

import type { OverlayEntry, OverlayManager } from './manager.js';

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

/**
 * OverlayHost（设计文档第 45、46 节，决策 D4）：订阅 OverlayManager
 * 堆栈，逐条渲染 antd Modal / Drawer。
 *
 * 必须位于 PageRuntime 的 React Context 之内（如 PageRuntimeView 的
 * children），DSL content 经当前 Renderer 的 `renderChildren` 渲染，
 * 作用域注入 `{ params: entry.params, parent: 父作用域快照 }`；
 * UI 取消（X / 蒙层 / 取消按钮）触发取消语义 close（resolve
 * `{ success: false }`）。
 */
export function OverlayHost({ manager, resolvePage }: OverlayHostProps) {
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

/** 单个 overlay 条目 → antd Modal / Drawer */
function OverlayEntryView({
  entry,
  manager,
  renderer,
  resolvePage,
}: OverlayEntryViewProps) {
  // UI 取消（X / 蒙层 / 取消按钮）：取消语义 close
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
      <Drawer
        open
        title={entry.title}
        // antd v6 起 Drawer width 废弃，size 接受 number|string 语义等价
        size={entry.width}
        onClose={handleCancel}
      >
        {body}
      </Drawer>
    );
  }
  return (
    <Modal open title={entry.title} width={entry.width} onCancel={handleCancel}>
      {body}
    </Modal>
  );
}

/**
 * page overlay 内容：经注入的 resolvePage(pageId) 加载 PageDsl，
 * 创建子 PageRuntime（共享宿主页面的组件 / 服务 / 动作等注册表，
 * entry.params 作为子运行时 route.params 即 scope 的 params 键）
 * 渲染 body；条目关闭（组件卸载）时 destroy 子运行时。
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
          `[pactor-interaction] page overlay（pageId: "${entry.page?.pageId}"）需要 OverlayHost 注入 resolvePage`,
        ),
      );
      return;
    }
    let cancelled = false;
    let created: PageRuntime | null = null;
    void (async () => {
      try {
        const pageDsl = await resolvePage(entry.page?.pageId ?? '');
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
