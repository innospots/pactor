"use client";

import type { PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";
import { GridLayout } from "@pactor-app/grid-layout";

/**
 * 可拖拽仪表盘示例页：DSL type: GridLayout（@pactor-app/grid-layout 封装
 * react-grid-layout v2）。格子经 child 的 props.gridId 与 layout 项的 i 关联；
 * onLayoutChange 写回 state.dashboardLayout 形成受控闭环（真实应用在此追加
 * request action 即可把布局持久化到服务端）。
 * 组件在客户端 mount 并完成宽度测量后才初始化 RGL，SSR 仅渲染空容器，SSR 安全。
 * 样式表在 app/layout.tsx 全局引入（@pactor-app/grid-layout/styles.css）。
 */

const gridDashboardPage: PageDsl = {
  dsl: "1.0",
  page: {
    id: "grid-dashboard",
    title: "可拖拽仪表盘",
    name: "grid-dashboard",
    description: "GridLayout：react-grid-layout 可拖拽 / 可缩放栅格容器",
  },
  state: {
    dashboardLayout: [
      { i: "kpi-orders", x: 0, y: 0, w: 4, h: 2 },
      { i: "kpi-users", x: 4, y: 0, w: 4, h: 2 },
      { i: "kpi-revenue", x: 8, y: 0, w: 4, h: 2 },
      { i: "intro-card", x: 0, y: 2, w: 12, h: 3 },
    ],
  },
  children: [
    {
      type: "Page",
      props: { title: "可拖拽仪表盘" },
      children: [
        {
          type: "Alert",
          props: {
            variant: "info",
            message: "拖拽卡片移动位置，拖拽右下角调整大小",
            description:
              "布局变化经 onLayoutChange 写回 state.dashboardLayout ——真实应用里追加 request action 即可持久化到服务端。",
          },
        },
        {
          type: "GridLayout",
          props: {
            cols: 12,
            rowHeight: 72,
            layout: "${state.dashboardLayout}",
          },
          events: {
            onLayoutChange: [
              {
                action: "setState",
                params: { dashboardLayout: "${event.layout}" },
              },
            ],
          },
          children: [
            {
              type: "Card",
              props: { gridId: "kpi-orders", title: "订单数" },
              children: [
                { type: "Statistic", props: { value: 1286, suffix: "单" } },
              ],
            },
            {
              type: "Card",
              props: { gridId: "kpi-users", title: "活跃用户" },
              children: [
                { type: "Statistic", props: { value: 8432 } },
              ],
            },
            {
              type: "Card",
              props: { gridId: "kpi-revenue", title: "本月收入" },
              children: [
                {
                  type: "Statistic",
                  props: { value: 92300.5, precision: 2, suffix: "元" },
                },
              ],
            },
            {
              type: "Card",
              props: { gridId: "intro-card", title: "说明" },
              children: [
                {
                  type: "Text",
                  props: {
                    text: "GridLayout 由 @pactor-app/grid-layout 注册（react-grid-layout v2）。格子的 i 与 child 的 gridId 对应；未声明布局的 child 自动整行追加。",
                  },
                },
                {
                  type: "Text",
                  props: {
                    type: "secondary",
                    text: "SSR：服务端仅渲染空容器，客户端完成宽度测量后挂载栅格。",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export function GridDashboardClient() {
  return (
    <PactorPage
      pageDsl={gridDashboardPage}
      components={{ GridLayout: { component: GridLayout, withScope: true } }}
    />
  );
}
