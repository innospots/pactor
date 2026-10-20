/**
 * 右端固定块（sidePanel）与最左图标栏共用的背景：
 * 优先 chat 皮肤专用令牌（--pactor-chat-side-panel-bg），逐级回退到
 * chat 侧栏令牌 → 页面皮肤的 sidebar / muted 语义令牌，未接入 chat
 * 皮肤时也能跟随宿主换肤。
 */
export const SIDE_PANEL_BG =
  "var(--pactor-chat-side-panel-bg, var(--pactor-chat-sidebar-bg, var(--sidebar, var(--muted))))";
