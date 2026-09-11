import type { BootstrapResource } from "@pactor-app/resource";

/**
 * 模拟 bootstrap（无后端工具应用）：blank 外壳（页面完全自控结构），
 * 菜单仅承载路由映射——工作室页 `/`、画廊页 `/gallery` 与示例页 `/demo`
 * （gallery / demo 经 iframe 加载，菜单中隐藏）。
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
      {
        id: "demo",
        type: "page",
        title: "示例页面",
        path: "/demo",
        pageId: "demo",
        hidden: true,
      },
    ],
    layout: { type: "blank" },
    pageVersions: { studio: 1, gallery: 1, demo: 1 },
  };
}
