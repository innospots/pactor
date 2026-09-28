"use client";

import type { PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";

/**
 * 对话页：页面结构由 DSL 描述，根组件为 @pactor-app/ui 内置的 ChatPage
 * （四区布局：图标栏 / 展开菜单区 / 对话区 / 可拖拽产物区），数据与行为
 * 全部经 props / events 绑定；会话、消息、产物经 service 模拟服务端下发。
 */

interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  time?: string;
  agent?: { name: string };
  status?: string;
  parts: Array<Record<string, unknown>>;
  actions?: Array<{ name: string; label?: string }>;
}

interface ArtifactData {
  id: string;
  title: string;
  kind: "markdown" | "code" | "text";
  language?: string;
  content: string;
}

interface ConversationData {
  id: string;
  title: string;
  description?: string;
  time?: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let seq = 100;

const store = {
  conversations: [
    { id: "c1", title: "检查保健品群聊骗局剧本", time: "6分钟前" },
    { id: "c2", title: "请创作一个完整的AI短视频", time: "5小时前" },
    { id: "c3", title: "workbuddy 中的连接器有什么", time: "4天前" },
    { id: "c4", title: "我写一个灵感，你帮我设计刻", time: "4天前" },
    { id: "c5", title: "xian-gong-video 以孙悟空的", time: "4天前" },
  ] as ConversationData[],
  messages: {
    c1: [
      {
        id: "m1",
        role: "user",
        time: "15:58",
        parts: [{ type: "text", content: "帮我检查这个保健品群聊剧本有没有骗局风险" }],
      },
      {
        id: "m2",
        role: "assistant",
        time: "15:59",
        agent: { name: "小 P" },
        status: "completed",
        parts: [
          { type: "thinking", content: "先拆解剧本结构，再逐段比对常见诈骗话术特征…" },
          { type: "tool-call", name: "search_docs", status: "done", durationMs: 1200 },
          {
            type: "markdown",
            content:
              "**结论：存在高风险话术。**\n\n- 「限时免费领鸡蛋」属于典型引流钩子\n- 「专家义诊」无资质背书，建议删除\n- 群接龙付款环节缺少退款说明\n\n详细分析已生成到产物区。",
          },
          { type: "artifacts", count: 1 },
        ],
        actions: [
          { name: "copy", label: "复制" },
          { name: "retry", label: "重新生成" },
        ],
      },
    ] as ChatMessageData[],
  } as Record<string, ChatMessageData[]>,
  artifacts: {
    c1: [
      {
        id: "c1/risk-report.md",
        title: "骗局风险分析报告.md",
        kind: "markdown",
        content:
          "# 骗局风险分析报告\n\n## 总体评级：高风险\n\n| 环节 | 话术 | 风险 |\n| --- | --- | --- |\n| 引流 | 限时免费领鸡蛋 | 高 |\n| 信任 | 专家义诊背书 | 高 |\n| 转化 | 群接龙付款 | 中 |\n\n## 建议\n\n1. 删除无资质的医疗承诺\n2. 补充退款与售后说明\n3. 避免绝对化用语",
      },
      {
        id: "c1/extract.ts",
        title: "extract_dialogue.ts",
        kind: "code",
        language: "ts",
        content:
          "export function extractDialogue(script: string) {\n  return script\n    .split('\\n')\n    .filter((line) => line.includes('：'))\n    .map((line) => {\n      const [role, ...rest] = line.split('：');\n      return { role: role.trim(), text: rest.join('：').trim() };\n    });\n}\n",
      },
    ] as ArtifactData[],
  } as Record<string, ArtifactData[]>,
};

function buildReply(text: string): ChatMessageData {
  return {
    id: `m${++seq}`,
    role: "assistant",
    time: "刚刚",
    agent: { name: "小 P" },
    status: "completed",
    parts: [
      { type: "thinking", content: "理解需求 → 拆解任务 → 生成初稿…" },
      { type: "tool-call", name: "generate_artifact", status: "done", durationMs: 900 },
      {
        type: "markdown",
        content: `已收到「${text}」。\n\n我整理了一份初稿并放入右侧产物区，你可以继续补充要求，我会迭代更新。`,
      },
      { type: "artifacts", count: 1 },
    ],
    actions: [
      { name: "copy", label: "复制" },
      { name: "retry", label: "重新生成" },
    ],
  };
}

/** 模拟服务端：会话 / 消息 / 产物 store + 发送生成 */
const chatServices = {
  "chat.conversations": async () => {
    await delay(150);
    return [...store.conversations];
  },
  "chat.conversation": async (params: Record<string, unknown>) => {
    await delay(100);
    return store.conversations.find((c) => c.id === params["id"]) ?? null;
  },
  "chat.messages": async (params: Record<string, unknown>) => {
    await delay(150);
    return [...(store.messages[String(params["conversationId"])] ?? [])];
  },
  "chat.artifacts": async (params: Record<string, unknown>) => {
    await delay(100);
    // 富产物模型直接下发（id / kind / title / content），面板内建预览与目录树
    return [...(store.artifacts[String(params["conversationId"])] ?? [])];
  },
  "chat.send": async (params: Record<string, unknown>) => {
    const conversationId = String(params["conversationId"]);
    const text = String(params["text"] ?? "");
    store.messages[conversationId] ??= [];
    store.messages[conversationId].push({
      id: `m${++seq}`,
      role: "user",
      time: "刚刚",
      parts: [{ type: "text", content: text }],
    });
    await delay(400);
    store.messages[conversationId].push(buildReply(text));
    const title = `${text.slice(0, 12) || "未命名"}-方案.md`;
    store.artifacts[conversationId] ??= [];
    store.artifacts[conversationId].push({
      id: `${conversationId}/draft-${seq}.md`,
      title,
      kind: "markdown",
      content: `# ${title.replace(/\.md$/, "")}\n\n围绕「${text}」生成的初稿：\n\n- 目标与背景\n- 执行步骤\n- 风险与预案\n\n> 继续对话可迭代此文档。`,
    });
    return { ok: true };
  },
  "chat.newConversation": async () => {
    await delay(100);
    const id = `c${++seq}`;
    store.conversations.unshift({ id, title: "新任务", time: "刚刚" });
    store.messages[id] = [];
    store.artifacts[id] = [];
    return { id };
  },
  "chat.deleteConversation": async (params: Record<string, unknown>) => {
    await delay(100);
    const id = String(params["id"]);
    const activeId = String(params["activeId"] ?? "");
    store.conversations = store.conversations.filter((c) => c.id !== id);
    delete store.messages[id];
    delete store.artifacts[id];
    return {
      activeId: id === activeId ? (store.conversations[0]?.id ?? "") : activeId,
    };
  },
};

const chatPage: PageDsl = {
  dsl: "1.0",
  meta: { version: "1.0", author: "platform-team" },
  page: {
    id: "chat",
    title: "对话",
    name: "chat",
    description: "ChatPage 组件整页承载：图标栏 + 展开菜单 + 对话区 + 可拖拽产物区",
  },
  state: {
    activeConversationId: "c1",
    activeMenu: "",
    activeArtifactId: "",
    showArtifact: false,
    sending: false,
  },
  dataSources: {
    conversations: {
      type: "service",
      service: "chat.conversations",
      autoLoad: true,
    },
    conversation: {
      type: "service",
      service: "chat.conversation",
      autoLoad: true,
      params: { id: "${state.activeConversationId}" },
    },
    messages: {
      type: "service",
      service: "chat.messages",
      autoLoad: true,
      params: { conversationId: "${state.activeConversationId}" },
    },
    artifacts: {
      type: "service",
      service: "chat.artifacts",
      autoLoad: true,
      params: { conversationId: "${state.activeConversationId}" },
    },
  },
  actions: {
    // 发送消息（ChatPage onSend：Composer 提交 / Welcome prompt 选择均传出文本）
    sendMessage: [
      { action: "setState", params: { sending: true } },
      {
        action: "service.call",
        params: {
          service: "chat.send",
          params: {
            conversationId: "${state.activeConversationId}",
            text: "${event}",
          },
        },
      },
      { action: "setState", params: { sending: false } },
      { action: "reload" },
    ],
    // 新建任务：创建空会话并切换
    newConversation: [
      {
        id: "created",
        action: "service.call",
        params: { service: "chat.newConversation" },
      },
      {
        action: "setState",
        params: { activeConversationId: "${actions.created.id}", activeArtifactId: "" },
      },
      { action: "reload" },
    ],
    // 切换会话（onSelectConversation 传出会话 id）
    selectConversation: [
      {
        action: "setState",
        params: { activeConversationId: "${event}", activeArtifactId: "" },
      },
      { action: "reload" },
    ],
  },
  children: [
    {
      type: "ChatPage",
      props: {
        brand: { title: "Pactor Chat", version: "0.1.0" },
        // 图标栏与展开菜单独立定义（不传 railItems 则整栏隐藏）
        railItems: [
          { key: "new", label: "新建任务", icon: "square-pen" },
          { key: "assistant", label: "助理", icon: "brain" },
          { key: "project", label: "项目", icon: "folder" },
          { key: "connector", label: "专家·技能·连接器", icon: "zap" },
          { key: "schedule", label: "定时任务", icon: "clock" },
          { key: "library", label: "资料库", icon: "database" },
          { key: "more", label: "更多", icon: "ellipsis" },
        ],
        menuItems: [
          { key: "new", label: "新建任务", icon: "square-pen" },
          { key: "assistant", label: "助理", icon: "brain" },
          { key: "project", label: "项目", icon: "folder" },
          { key: "connector", label: "专家·技能·连接器", icon: "zap" },
          { key: "schedule", label: "定时任务", icon: "clock" },
          { key: "library", label: "资料库", icon: "database" },
          { key: "more", label: "更多", icon: "ellipsis" },
        ],
        railFooterItems: [
          { key: "settings", label: "设置", icon: "settings" },
          { key: "user", label: "个人中心", icon: "user" },
        ],
        activeMenuKey: "${state.activeMenu}",
        menuAction: { label: "发现应用", icon: "layout-grid" },
        conversationSectionTitle: "任务",
        conversations: "${data.conversations}",
        activeConversationId: "${state.activeConversationId}",
        moreLabel: "查看更多",
        footerSectionTitle: "空间 (14)",
        footerItems: [
          { key: "space-default", label: "默认空间", icon: "house" },
          { key: "space-design", label: "设计团队", icon: "users" },
          { key: "space-frontend", label: "前端小组", icon: "code" },
        ],
        conversationTitle: "${data.conversation.title}",
        messages: "${data.messages}",
        sending: "${state.sending}",
        composerPlaceholder: "输入消息，Enter 发送…",
        welcome: {
          description: "可以问答、写作、分析，也可以让我生成可在右侧预览的产物",
          prompts: [
            { title: "写一份产品周报", value: "帮我写一份产品周报" },
            { title: "生成 Markdown 文档", value: "帮我生成一份 Markdown 项目说明" },
            { title: "写一段 TypeScript 代码", value: "帮我写一段 TypeScript 工具函数" },
            { title: "分析一段文案风险", value: "帮我分析一段营销文案的合规风险" },
          ],
        },
        artifactTitle: "产物",
        artifacts: "${data.artifacts}",
        activeArtifactId: "${state.activeArtifactId}",
        artifactOpen: "${state.showArtifact}",
      },
      events: {
        onMenuSelect: [
          {
            action: "if",
            params: {
              condition: "${event == 'new'}",
              then: [{ action: "call", params: { name: "newConversation" } }],
              else: [
                { action: "setState", params: { activeMenu: "${event}" } },
                {
                  action: "message",
                  params: { messageType: "info", text: "演示菜单：${event}" },
                },
              ],
            },
          },
        ],
        onMenuAction: [
          { action: "message", params: { messageType: "info", text: "演示：发现应用" } },
        ],
        onMore: [
          { action: "message", params: { messageType: "info", text: "演示：查看更多任务" } },
        ],
        onSelectConversation: [{ action: "call", params: { name: "selectConversation" } }],
        onDeleteConversation: [
          {
            id: "removed",
            action: "service.call",
            params: {
              service: "chat.deleteConversation",
              params: {
                id: "${event}",
                activeId: "${state.activeConversationId}",
              },
            },
          },
          {
            action: "setState",
            params: {
              activeConversationId: "${actions.removed.activeId}",
              activeArtifactId: "",
            },
          },
          { action: "reload" },
        ],
        onSend: [{ action: "call", params: { name: "sendMessage" } }],
        onMessageAction: [
          {
            action: "message",
            params: { messageType: "info", text: "消息操作：${event.action}" },
          },
        ],
        onSelectArtifact: [
          { action: "setState", params: { activeArtifactId: "${event}" } },
        ],
        onArtifactOpenChange: [
          { action: "setState", params: { showArtifact: "${event}" } },
        ],
      },
    },
  ],
};

export function ChatClient() {
  return <PactorPage pageDsl={chatPage} services={chatServices} />;
}
