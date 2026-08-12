import type { DslNode } from 'pactor-core';

/**
 * Overlay 打开配置（设计文档第 45 节，决策 D1）。
 *
 * 统一 `overlay.open`：modal / drawer 共用同一配置结构；
 * `content` 为内联 DSL 子树，`page` 为动态页面引用，二者取其一。
 */
export interface OverlayConfig {
  /** 弹层类型 */
  type: 'modal' | 'drawer';
  /** 标题（antd Modal title / Drawer title） */
  title?: string;
  /** 宽度（antd Modal width / Drawer size，v6 起 Drawer width 废弃） */
  width?: number | string;
  /** 内联 DSL 内容，经 pactor-runtime Renderer 渲染 */
  content?: DslNode;
  /** 动态页面：经 OverlayHost 注入的 resolvePage(pageId) 加载渲染 */
  page?: { pageId: string };
  /** 传入 overlay 内容作用域的 `params` 键 */
  params?: Record<string, unknown>;
}

/** 堆栈条目：配置 + 生成的 id */
export interface OverlayEntry extends OverlayConfig {
  id: string;
}

/** 堆栈变化监听器：open / close 时以最新堆栈快照回调 */
export type OverlayListener = (stack: readonly OverlayEntry[]) => void;

/**
 * 取消语义 payload：UI 取消（X / 蒙层 / 取消按钮）或不携带 payload
 * 的 close 以此值 resolve open 返回的 Promise。
 */
export const OVERLAY_CANCEL_PAYLOAD = { success: false } as const;

interface PendingEntry {
  entry: OverlayEntry;
  parentScope?: Record<string, unknown>;
  resolve: (payload: unknown) => void;
}

/**
 * OverlayManager（设计文档第 44–46 节，决策 D1）：零 React 的
 * Overlay 堆栈状态与 Promise 模型，可纯 Node 测试。
 *
 * - `open` 生成 id、入栈、通知订阅者，返回 Promise；
 *   `close` 时以 payload resolve（缺省 payload 为取消语义
 *   `{ success: false }`）
 * - 嵌套即堆栈：连续 open 依次压栈，`close()` 缺省关闭栈顶
 * - `parentScope` 为打开时刻父页面作用域的浅快照（只读约定），
 *   供 overlay 内容以 `parent` 键访问
 */
export class OverlayManager {
  private readonly pending: PendingEntry[] = [];
  private readonly listeners = new Set<OverlayListener>();
  private counter = 0;
  /** 缓存的堆栈快照：变化时才更换引用，供 useSyncExternalStore 使用 */
  private snapshot: readonly OverlayEntry[] = Object.freeze([]);

  /**
   * 打开 overlay：入栈、通知，返回 Promise——close 时以 payload
   * resolve；取消关闭（无 payload）resolve `{ success: false }`。
   * `options.parentScope` 记录打开时刻的父作用域浅快照。
   */
  open(
    config: OverlayConfig,
    options: { parentScope?: Record<string, unknown> } = {},
  ): Promise<unknown> {
    if (!config || (config.type !== 'modal' && config.type !== 'drawer')) {
      return Promise.reject(
        new Error(
          '[pactor-interaction] overlay.open 需要 type 为 "modal" 或 "drawer" 的配置',
        ),
      );
    }
    this.counter += 1;
    const entry: OverlayEntry = { ...config, id: `overlay-${this.counter}` };
    return new Promise((resolve) => {
      this.pending.push({
        entry,
        parentScope: options.parentScope ? { ...options.parentScope } : undefined,
        resolve,
      });
      this.commit();
    });
  }

  /**
   * 关闭 overlay 并以 payload resolve 对应的 open Promise：
   * - `close(id, payload)`：关闭指定条目，原样 resolve payload
   *   （payload 缺省为取消语义 `{ success: false }`）
   * - `close(payload)`：关闭栈顶，原样 resolve payload
   * - `close()`：关闭栈顶，取消语义
   * 未命中任何条目时为受控 no-op，不抛错。
   */
  close(idOrPayload?: string | unknown, payload?: unknown): void {
    let index: number;
    let resolvedPayload: unknown;
    if (typeof idOrPayload === 'string') {
      index = this.pending.findIndex((p) => p.entry.id === idOrPayload);
      if (index === -1) {
        return;
      }
      resolvedPayload = payload;
    } else {
      index = this.pending.length - 1;
      if (index === -1) {
        return;
      }
      resolvedPayload = idOrPayload === undefined ? payload : idOrPayload;
    }
    const [target] = this.pending.splice(index, 1);
    this.commit();
    target?.resolve(
      resolvedPayload === undefined ? OVERLAY_CANCEL_PAYLOAD : resolvedPayload,
    );
  }

  /** 当前堆栈快照（打开顺序，栈顶在末尾）；引用在堆栈不变时保持稳定 */
  stack(): readonly OverlayEntry[] {
    return this.snapshot;
  }

  /** 打开时记录的父作用域浅快照（只读约定）；未知 id 返回 undefined */
  parentScopeOf(id: string): Record<string, unknown> | undefined {
    return this.pending.find((p) => p.entry.id === id)?.parentScope;
  }

  /** 订阅堆栈变化（open / close 时通知），返回退订函数 */
  subscribe(listener: OverlayListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** 重建快照并通知订阅者 */
  private commit(): void {
    this.snapshot = Object.freeze(this.pending.map((p) => p.entry));
    for (const listener of [...this.listeners]) {
      listener(this.snapshot);
    }
  }
}
