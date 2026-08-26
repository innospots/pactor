// manager：OverlayManager（零 React）
export { OverlayManager, OVERLAY_CANCEL_PAYLOAD } from './manager.js';
export type {
  OverlayConfig,
  OverlayEntry,
  OverlayListener,
} from './manager.js';

// actions：UiBridge 与交互动作注册
export { createUiBridge, registerInteractionActions } from './actions.js';
export type { UiBridge, UiMessage, UiModal } from './actions.js';

// React 渲染层（shadcn kit）：InteractionProvider / OverlayHost
export { ShadcnInteractionProvider } from './provider.js';
export type { InteractionProviderProps } from './provider.js';
export { ShadcnOverlayHost } from './host.js';
export type { OverlayHostProps, ResolvePageFn } from './host.js';
