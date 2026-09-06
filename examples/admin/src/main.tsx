import { createPactorApplication } from "@pactor-app/app";
import {
  ChatServicesProvider,
  createSafeRegistry,
  registerChatComponent,
  type ChatServices,
} from "@pactor-app/chat";
// Chat 一等组件（AI 工作区页）的皮肤样式表
import "@pactor-app/chat/styles.css";
import { StaticDslLoader } from "@pactor-app/resource";
// 默认 UI kit 为 shadcn（@pactor-app/ui），样式表导入为必需步骤
import "@pactor-app/ui/styles.css";
import { createShadcnComponentRegistry } from "@pactor-app/ui/components";
import type { ReactNode } from "react";
// 示例皮肤：换肤契约参考实现（须在 @pactor-app/ui/styles.css 之后导入）
import "./theme.css";
// 皮肤 store：模块加载即把持久化的皮肤应用到 DOM（data-pactor-theme 等），
// 须在首屏渲染前执行
import "./skin";

import { readSession } from "./auth";
import { createBootstrap } from "./bootstrap";
import { createMockAiTransport } from "./mock-ai";
import { demoServices } from "./services";
import { SkinSettings } from "./SkinSettings";
import aiWorkspacePage from "./pages/ai-workspace.page.yaml";
import customerEditPage from "./pages/customer-edit.page.yaml";
import customerListPage from "./pages/customer-list.page.yaml";
import customerDetailPage from "./pages/customer-detail.page.yaml";
import layoutDemoPage from "./pages/layout-demo.page.yaml";
import extendedComponentsPage from "./pages/extended-components.page.yaml";
import dashboardPage from "./pages/dashboard.page.yaml";
import loginPage from "./pages/login.page.yaml";

// 路由守卫（应用外壳职责，在 DSL 之外）：未登录访问业务页 → /login；
// 已登录访问 /login → /。整页跳转，bootstrap 随之按会话重新生成
const session = readSession();
if (!session && window.location.pathname !== "/login") {
  window.location.replace("/login");
} else if (session && window.location.pathname === "/login") {
  window.location.replace("/");
}

// 本地 DSL 开发：静态加载器直接喂入构建期 import 的页面与模拟 bootstrap
// （bootstrap 按当前会话返回 login 或 admin 布局形态）
const loader = new StaticDslLoader({
  bootstrap: createBootstrap(),
  pages: {
    login: loginPage,
    dashboard: dashboardPage,
    "customer-list": customerListPage,
    "customer-detail": customerDetailPage,
    "layout-demo": layoutDemoPage,
    "extended-components": extendedComponentsPage,
    "customer-edit": customerEditPage,
    "ai-workspace": aiWorkspacePage,
  },
});

// AI 工作区页的聊天服务（spec: chat-artifact-panel，设计决策 D5）：
// transport 为本地 mock（见 mock-ai.ts）；safeRegistry 限定 dsl 产出物
// 活预览的白名单组件
const chatServices: ChatServices = {
  transport: createMockAiTransport(),
  safeRegistry: createSafeRegistry(createShadcnComponentRegistry(), [
    "Flex",
    "Card",
    "Statistic",
    "Alert",
    "Button",
  ]),
};

/** providers 槽（Router 之内、InteractionKit 之外）：向 DSL 页内 Chat 注入聊天服务 */
function ChatProvider({ children }: { children?: ReactNode }) {
  return (
    <ChatServicesProvider value={chatServices}>{children}</ChatServicesProvider>
  );
}

createPactorApplication({
  appId: "example-admin",
  loader,
  services: demoServices,
  locale: "zh-CN",
  messages: {
    "zh-CN": {
      "menu.dashboard": "工作台",
      "menu.customers": "客户管理",
    },
    "en-US": {
      "menu.dashboard": "Dashboard",
      "menu.customers": "Customers",
    },
  },
  // 皮肤设置：头部右侧入口（主色预设 / 暗黑 / 圆角），
  // 皮肤应用走 DOM 属性与 CSS 变量（见 skin.ts），即时生效无需刷新
  headerExtra: <SkinSettings />,
  // Chat 一等组件注册（AI 工作区页）：shadcn 注册表之上叠加 Chat / ChatShell
  // （registerChatComponent 不覆盖已有同名类型）
  componentRegistry: () => {
    const registry = createShadcnComponentRegistry();
    registerChatComponent(registry);
    return registry;
  },
  // 聊天服务注入：DSL 页内 Chat 经 ChatServicesProvider 就近读取
  providers: ChatProvider,
  actions: {
    // 整页重载：登录/登出后需要重新加载 bootstrap（布局与菜单随会话变化），
    // react-router 的 navigate 不会触发 bootstrap 重取，故示例扩展此动作
    "app.reload": (action) => {
      const to = action.params?.["to"];
      window.location.assign(typeof to === "string" && to !== "" ? to : "/");
      return { ok: true };
    },
    // 框架暂无内置"调用服务"动作（request 仅走 HTTP 出口），
    // 示例经 options.actions 扩展 service.call：写操作经 ServiceRegistry 调用，
    // params.params 由动作引擎完成表达式求值后传入
    "service.call": async (action, ctx) => {
      const name = action.params?.["service"];
      if (typeof name !== "string" || name === "") {
        return {
          ok: false,
          error: new Error("[example-admin] service.call 缺少 params.service"),
        };
      }
      const handler = ctx.context.services.get(name);
      if (!handler) {
        return {
          ok: false,
          error: new Error(`[example-admin] service 未注册: ${name}`),
        };
      }
      try {
        const callParams = action.params?.["params"];
        const data = await handler(
          typeof callParams === "object" && callParams !== null
            ? (callParams as Record<string, unknown>)
            : {},
        );
        return { ok: true, data };
      } catch (cause) {
        return {
          ok: false,
          error: cause instanceof Error ? cause : new Error(String(cause)),
        };
      }
    },
  },
}).mount("#root");
