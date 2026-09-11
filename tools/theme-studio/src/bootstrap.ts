import type { BootstrapResource } from "@pactor-app/resource";

/**
 * 模拟 bootstrap（无后端工具应用）：blank 外壳（页面完全自控结构），
 * 菜单仅承载路由映射——工作室页 `/` 与画廊页 `/gallery`
 * （gallery 经 iframe 加载，菜单中隐藏）。
 */
export function createBootstrap(): Partial<BootstrapResource> &
  Record<string, unknown> {
  return {
    app: { name: "Pactor 主题配置" },
    permissions: [],
    menus: [
      {
        id: "studio",
        type: "page",
        title: "主题配置",
        path: "/",
        pageId: "studio",
      },
      {
        id: "gallery",
        type: "page",
        title: "组件画廊",
        path: "/gallery",
        pageId: "gallery",
        hidden: true,
      },
    ],
    layout: { type: "blank" },
    pageVersions: { studio: 1, gallery: 1 },
  };
}
