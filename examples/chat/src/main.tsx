import "katex/dist/katex.min.css";
import "@pactor-app/ui/styles.css";
import "@pactor-app/chat/styles.css";
// 示例自有样式：仅页面壳高度链/外壳皮肤令牌/DSL 页面限宽（见 app.css 头注释）——
// 聊天页交互 UI（模型 chip/上下文弹层/侧栏参考形态）为包内建特性，样式自持
import "./app.css";

import { createChatComponentRegistry } from "@pactor-app/chat";
import { StaticDslLoader } from "@pactor-app/resource";
import { createPactorApplication } from "pactor-app";
import { createLayoutRegistry } from "@pactor-app/ui/layout";

import { ChatAppLayout } from "./ChatAppLayout";

import agentsPageDsl from "./agents.page.yaml";
import { createBootstrap } from "./bootstrap";
import chatPageDsl from "./chat.page.yaml";
import { ChatProvider } from "./ChatProvider";
import settingsPageDsl from "./settings.page.yaml";

/**
 * examples/chat 是"DSL 页面 + pactor-app 一站式装配"的参考实现
 * （spec: example-chat / example-chat-on-pactor-app）：
 *
 * - 应用经 createPactorApplication 装配：菜单（功能菜单 + 「最近」分组
 *   历史会话，含 group/dot/badge 扩展字段）与布局（type: 'chat'）由
 *   模拟 bootstrap 资源下发（见 bootstrap.ts），框架内置 BrowserRouter +
 *   DynamicDslRoute 承担路由出口，宿主无路由 / 菜单注册表 / 页面运行时
 *   装配代码；
 * - 外壳为内置 ChatLayout（ui 布局层 type: 'chat'）：品牌行 + 分组菜单
 *   由 registry/bridge 自动推导，菜单切换 = URL 变化，刷新按 URL 还原；
 *   如需自定义菜单事件（如 ?id= 会话映射），可注册薄封装覆盖
 *   （见 ChatAppLayout.tsx 备用实现）；
 * - 聊天页结构（极简头部模型选择、@/+ 上下文弹层与 chips）全部经
 *   chat.page.yaml 的 Chat props 声明（spec: chat-builtin-features /
 *   chat-default-skin），宿主零槽位组件；
 * - 聊天服务（transport / safeRegistry / capabilities / confirm /
 *   附件伪上传 / callService 服务桥）与会话 store 缓存经 providers 槽
 *   注入（见 ChatProvider.tsx）——跨页面切换对话消息不丢；
 * - navigate / message 动作用框架内建（assembly 注册，message 经应用
 *   uiBridge 出 toast），示例无需自定义动作。
 */

// 本地 DSL 开发：静态加载器直接喂入构建期 import 的页面与模拟 bootstrap
const loader = new StaticDslLoader({
  bootstrap: createBootstrap(),
  pages: {
    chat: chatPageDsl,
    agents: agentsPageDsl,
    settings: settingsPageDsl,
  },
});

const app = createPactorApplication({
  appId: "example-chat",
  loader,
  locale: "zh-CN",
  // 组件注册表：内置组件全集 + Chat / ChatShell 一等组件（便捷工厂）
  componentRegistry: createChatComponentRegistry,
  // 布局注册表：'chat' 已是内置类型（ui ChatLayout），无需自定义注册。
  // 如需自定义菜单事件（?id= 会话映射等），先注销内置再注册薄封装覆盖：
  layoutRegistry: () => {
    const registry = createLayoutRegistry();
    registry.unregister('chat');
    registry.register("chat", ChatAppLayout);
    return registry;
  },
  // 聊天服务注入：DSL 页内 Chat 经 ChatServicesProvider 就近读取；
  // 聊天服务侧 toast / confirm 由 ChatProvider 内挂的示例交互层承担
  providers: ChatProvider,
});

app.mount("#root");
