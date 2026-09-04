"use client";

import type { DslNode, PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";

/**
 * 动态 DSL 引用演示（DslSourceRef）：
 * - children 数组混排：内联节点与引用元素（service / http）任意交错
 * - 命名组件 components 的值也可为引用（http 通道经 Next.js Route Handler）
 * - 每个引用元素独立解析（独立 placeholder / 失败降级 / 缓存）
 */
const remoteDemoPage: PageDsl = {
  dsl: "1.0",
  page: {
    id: "remote-demo",
    title: "动态引用演示",
    description: "children 混排内联节点与动态引用",
  },
  components: {
    // 命名组件为 http 动态引用：component 引用处首次渲染时惰性加载
    remoteBadge: {
      source: { type: "http", request: { url: "/api/dsl/badge" } },
      placeholder: { type: "Alert", props: { message: "徽标加载中…", variant: "info" } },
    },
  },
  body: {
    type: "Page",
    props: { title: "动态 DSL 引用（children 混排演示）" },
    children: [
      // 内联节点（同步渲染）
      { type: "Alert", props: { message: "内联节点：同步渲染，无需等待", variant: "info" } },
      // 引用元素（service 通道，600ms 后落地）
      {
        source: { type: "service", service: "dsl.cardBody" },
        placeholder: { type: "Alert", props: { message: "卡片内容加载中…", variant: "info" } },
      },
      // 命名组件引用（http 通道，900ms 后落地）
      { component: "remoteBadge" },
      // 引用元素（service 通道，1200ms 后落地）
      {
        source: { type: "service", service: "dsl.notice" },
        placeholder: { type: "Alert", props: { message: "通知加载中…", variant: "info" } },
      },
    ],
  },
};

/** 模拟服务端下发（service 形态；http 形态见 app/api/dsl/badge/route.ts） */
const remoteServices = {
  "dsl.cardBody": async () => {
    await new Promise((r) => setTimeout(r, 600));
    return [
      {
        type: "Card",
        props: { title: "远端卡片" },
        children: [
          { type: "Alert", props: { message: "本卡片由 dsl.cardBody 服务下发", variant: "success" } },
          { type: "Statistic", props: { title: "加载耗时", value: 600, suffix: "ms" } },
        ],
      },
    ] satisfies DslNode[];
  },
  "dsl.notice": async () => {
    await new Promise((r) => setTimeout(r, 1200));
    return [
      { type: "Alert", props: { message: "本通知由 dsl.notice 服务下发", variant: "warning" } },
    ] satisfies DslNode[];
  },
};

export function RemoteDemoClient() {
  return <PactorPage pageDsl={remoteDemoPage} services={remoteServices} />;
}
