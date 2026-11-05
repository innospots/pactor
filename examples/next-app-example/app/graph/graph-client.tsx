"use client";

import type { PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";
import { Graph } from "@pactor-app/graph";

/**
 * G6 关系图示例页：DSL type: Graph（@pactor-app/graph 封装 AntV G6 v5）。
 * 图数据绑定 state.graphData（真实应用由 dataSource / 服务端下发）；
 * onNodeClick 写回 state 形成联动（下方节点详情卡）。
 * 组件在客户端 mount 后才实例化 G6，SSR 仅渲染空容器，SSR 安全；无需样式表。
 */

const graphPage: PageDsl = {
  dsl: "1.0",
  page: {
    id: "graph",
    title: "关系图示例",
    name: "graph",
    description: "Graph：AntV G6 v5 关系图 / 流程图组件",
  },
  state: {
    selectedNodeId: "",
    selectedNodeLabel: "",
    selectedNodeGroup: "",
    graphData: {
      nodes: [
        { id: "order", data: { label: "提交订单", group: "交易" } },
        { id: "pay", data: { label: "在线支付", group: "交易" } },
        { id: "risk", data: { label: "风控审核", group: "风控" } },
        { id: "manual", data: { label: "人工复核", group: "风控" } },
        { id: "warehouse", data: { label: "仓库拣货", group: "履约" } },
        { id: "logistics", data: { label: "物流配送", group: "履约" } },
        { id: "receipt", data: { label: "买家签收", group: "履约" } },
      ],
      edges: [
        { source: "order", target: "pay" },
        { source: "pay", target: "risk" },
        { source: "risk", target: "warehouse" },
        { source: "risk", target: "manual" },
        { source: "manual", target: "warehouse" },
        { source: "warehouse", target: "logistics" },
        { source: "logistics", target: "receipt" },
      ],
    },
  },
  children: [
    {
      type: "Page",
      props: { title: "关系图示例" },
      children: [
        {
          type: "Alert",
          props: {
            variant: "info",
            message: "G6 关系图（Graph 组件）",
            description:
              "dagre 布局的订单履约流程。滚轮缩放、拖拽平移、拖动节点，点按节点查看详情。",
          },
        },
        {
          type: "Graph",
          props: {
            data: "${state.graphData}",
            layout: "dagre",
            layoutOptions: { rankdir: "LR", nodesep: 24, ranksep: 64 },
            nodeStyle: { size: 32, labelPlacement: "bottom", labelFill: "#333" },
            // 分组配色：color 必填（内置色板名或颜色数组）
            palette: {
              type: "group",
              field: "group",
              color: ["#5B8FF9", "#F6BD16", "#5AD8A6"],
            },
            edgeStyle: { endArrow: true, stroke: "#b7bfc9" },
            plugins: { tooltip: true, minimap: true },
            height: 420,
          },
          events: {
            onNodeClick: [
              {
                action: "setState",
                params: {
                  selectedNodeId: "${event.node.id}",
                  selectedNodeLabel: "${event.node.data.label}",
                  selectedNodeGroup: "${event.node.data.group}",
                },
              },
            ],
          },
        },
        {
          type: "Card",
          props: { title: "节点详情" },
          when: "${state.selectedNodeId != ''}",
          children: [
            {
              type: "Descriptions",
              props: {
                items: [
                  { label: "节点 ID", value: "${state.selectedNodeId}" },
                  { label: "名称", value: "${state.selectedNodeLabel}" },
                  { label: "分组", value: "${state.selectedNodeGroup}" },
                ],
              },
            },
          ],
        },
        {
          type: "Alert",
          props: { variant: "info", message: "点按上方任一节点查看详情" },
          when: "${state.selectedNodeId == ''}",
        },
      ],
    },
  ],
};

export function GraphClient() {
  return <PactorPage pageDsl={graphPage} components={{ Graph }} />;
}
