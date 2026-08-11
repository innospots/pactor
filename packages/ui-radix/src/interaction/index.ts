// RadixOverlayHost / RadixInteractionProvider（Radix kit）
export { RadixOverlayHost } from './host.js';
export { RadixInteractionProvider } from './provider.js';

// props 契约类型：直接复用 pactor-ui-antd interaction 层（antd 版）的导出，保证双实现契约一致
export type {
  InteractionProviderProps,
  OverlayHostProps,
  ResolvePageFn,
} from 'pactor-ui-antd/interaction';
