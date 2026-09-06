"use client";

import type { DslNode, PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";

/**
 * 工作台示例页：Layout（Header + Sider(Menu) + Content）完整布局，
 * Header 演示结构区域 props（品牌区 logo+标题 / 横向菜单 / 通用下拉 /
 * 国际化切换 / 用户区，各区域事件传出 ${event} 语义值）；
 * Content 中左右结构——左侧 Table 列表（service dataSource 数据 + service 引用下发表头区），
 * 右侧详情（http 引用下发，flex: 1 自适应宽度）。
 * 点击行内「查看」→ setState + reload 驱动右侧详情刷新。
 */

const CUSTOMERS = [
  {
    id: "1",
    name: "云栖科技",
    contact: "张明",
    level: "A",
    phone: "138****0001",
  },
  {
    id: "2",
    name: "远山生物",
    contact: "李华",
    level: "B",
    phone: "138****0002",
  },
  {
    id: "3",
    name: "恒星能源",
    contact: "王强",
    level: "A",
    phone: "138****0003",
  },
  {
    id: "4",
    name: "绿洲农业",
    contact: "赵敏",
    level: "C",
    phone: "138****0004",
  },
];

const dashboardPage: PageDsl = {
  dsl: "1.0",
  meta: {
    version: "1.0",
    author: "platform-team",
  },
  page: {
    id: "dashboard",
    title: "工作台",
    name: "dashboard",
    description: "Layout + Sider Menu + Table 列表 + 详情联动 + 双通道动态引用",
  },
  state: {
    selectedId: "1",
    siderCollapsed: false,
  },
  dataSources: {
    customers: {
      type: "service",
      service: "customer.list",
      autoLoad: true,
    },
    detail: {
      type: "service",
      service: "customer.detail",
      autoLoad: true,
      params: { id: "${state.selectedId}" },
    },
    menus: {
      type: "static",
      autoLoad: true,
      value: [
        { key: "customers", label: "客户管理" },
        { key: "orders", label: "订单管理" },
        { key: "reports", label: "报表统计" },
      ],
    },
  },
  components: {
    // 命名组件为 http 动态引用：经 Next.js Route Handler 下发详情面板结构
    detailPanel: {
      source: { type: "http", request: { url: "/api/dsl/detail-panel" } },
      placeholder: {
        type: "Alert",
        props: { message: "详情面板加载中…", variant: "info" },
      },
    },
  },
  children: [{
    type: "Layout",
    children: [
      // Header：结构区域示例（品牌区 logo+标题 / 横向菜单（含子菜单） /
      // 右侧通用下拉 / 国际化切换 / 用户区），各区域事件见下方 events
      {
        type: "Header",
        props: {
          logo: "/next.svg",
          title: "Pactor 工作台",
          menu: [
            { key: "home", label: "首页" },
            {
              key: "products",
              label: "产品",
              children: [
                { key: "product-a", label: "产品 A" },
                { key: "product-b", label: "产品 B" },
              ],
            },
            { key: "docs", label: "文档" },
          ],
          dropdown: {
            label: "切换团队",
            position: "right",
            items: [
              { label: "云栖团队", value: "yunqi" },
              { label: "远山团队", value: "yuanshan" },
            ],
          },
          locales: [
            { label: "中文", value: "zh-CN" },
            { label: "English", value: "en-US" },
          ],
          user: {
            name: "管理员",
            items: [
              { label: "个人中心", value: "profile" },
              { label: "退出登录", value: "logout" },
            ],
          },
        },
        events: {
          // 注意：message 动作的类型用 `messageType`（params 带 `type` 键会被
          // 动作引擎 isOpaque 约定视作内嵌 DSL 节点，跳过 `${event}` 求值）
          onMenuSelect: [
            { action: "setState", params: { headerMenu: "${event}" } },
            {
              action: "message",
              params: { messageType: "info", text: "菜单：${event}" },
            },
          ],
          onDropdownSelect: [
            { action: "setState", params: { team: "${event}" } },
            {
              action: "message",
              params: { messageType: "info", text: "团队：${event}" },
            },
          ],
          onUserSelect: [
            {
              action: "if",
              params: {
                condition: "${event == 'logout'}",
                then: [
                  {
                    action: "message",
                    params: { messageType: "success", text: "已退出登录，正在跳转…" },
                  },
                  { action: "navigate", params: { to: "/login" } },
                ],
              },
            },
            {
              action: "if",
              params: {
                condition: "${event == 'profile'}",
                then: [
                  {
                    action: "message",
                    params: { messageType: "info", text: "打开个人中心（演示）" },
                  },
                ],
              },
            },
          ],
          onLocaleChange: [
            { action: "setState", params: { locale: "${event}" } },
            {
              action: "message",
              params: {
                messageType: "info",
                text: "语言切换为 ${event}（演示：应用层桥接后整页生效）",
              },
            },
          ],
        },
      },
      // 中间区域：Sider + Content（横向）
      {
        type: "Layout",
        props: { vertical: false },
        children: [
          // Sider 含 Menu
          {
            type: "Sider",
            props: {
              collapsible: true,
              collapsed: "${state.siderCollapsed}",
            },
            events: {
              onCollapse: [
                { action: "setState", params: { siderCollapsed: "${event}" } },
              ],
            },
            children: [
              {
                type: "Menu",
                props: { items: "${data.menus}", selectedKey: "customers" },
              },
            ],
          },
          // Content：左右分栏
          {
            type: "Content",
            children: [
              {
                type: "Flex",
                props: { gap: 16, align: "start", style: { padding: 16 } },
                children: [
                  // 左侧列表：service 引用下发表头区 + 内联 Table（混排演示）
                  {
                    type: "Card",
                    props: { style: { width: 520, flexShrink: 0 } },
                    children: [
                      // 引用元素：表头说明区由 service 远端下发
                      {
                        source: { type: "service", service: "dsl.listHeader" },
                        placeholder: {
                          type: "Alert",
                          props: { message: "列表头加载中…", variant: "info" },
                        },
                      },
                      {
                        type: "Table",
                        props: {
                          dataSource: "${data.customers}",
                          loading: "${dataStatus.customers.loading}",
                          pagination: false,
                          columns: [
                            { title: "客户名称", dataIndex: "name" },
                            { title: "联系人", dataIndex: "contact" },
                            { title: "等级", dataIndex: "level", width: 60 },
                            {
                              title: "操作",
                              cell: {
                                type: "Button",
                                props: {
                                  text: "查看",
                                  variant: "link",
                                  size: "small",
                                },
                                events: {
                                  onClick: [
                                    {
                                      action: "setState",
                                      params: { selectedId: "${row.id}" },
                                    },
                                    {
                                      action: "reload",
                                      params: { dataSource: "detail" },
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                  // 右侧详情：http 动态引用（component 引用 components.detailPanel），flex: 1 自适应
                  {
                    component: "detailPanel",
                    props: { style: { flex: 1 } },
                  },
                ],
              },
            ],
          }
        ],
      },
      // Footer
      {
        type: "Footer",
        children: [
          {
            type: "Text",
            props: { text: "Pactor Admin Demo © 2026", type: "secondary" },
          },
        ],
      },
    ],
  }],
};

/** 模拟服务端下发 */
const remoteServices = {
  "customer.list": async () => {
    await new Promise((r) => setTimeout(r, 300));
    return CUSTOMERS;
  },
  "customer.detail": async (params: Record<string, unknown>) => {
    await new Promise((r) => setTimeout(r, 300));
    return CUSTOMERS.find((c) => c.id === params["id"]) ?? null;
  },
  // 表头说明区：service DslSourceRef 返回 DslNode[]
  "dsl.listHeader": async () => {
    await new Promise((r) => setTimeout(r, 400));
    return [
      {
        type: "Alert",
        props: {
          message:
            "本说明区由 dsl.listHeader 服务下发；点击行内「查看」联动右侧详情",
          variant: "info",
        },
      },
    ] satisfies DslNode[];
  },
};

export function DashboardClient() {
  return <PactorPage pageDsl={dashboardPage} services={remoteServices} />;
}
