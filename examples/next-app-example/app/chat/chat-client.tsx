"use client";

import type { PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";
import type { StepsPanelItemData } from "@pactor-app/ui/components";

import { WorkspaceSwitcher } from "./workspace-switcher";

/**
 * 对话页：页面结构由 DSL 描述，根组件为 @pactor-app/ui 内置的 ChatPage
 * （四区布局：图标栏 / 展开菜单区 / 对话区 / 可拖拽产物区），数据与行为
 * 全部经 props / events 绑定；会话、消息、产物经 service 模拟服务端下发。
 *
 * 聊天框能力对齐 CreditWeaveAI/chat（@pactor-app/chat 示例）：
 * - 模型选择 chip（Composer 工具栏右端，受控闭环 model ↔ onModelChange）
 * - '@' 智能体提及 / '+' 上下文菜单弹层，选中项为输入区上方 chips
 *   （受控 contextItems ↔ onContextItemsChange，发送后清空）
 * - 附件入口（附件钮 / 粘贴 / 拖拽 → onAttachFiles；File 对象无法穿越
 *   DSL 表达式求值，经自定义动作 chat.attachFiles 读原始事件伪上传）
 * - composerFooter：工作空间切换器（自定义组件 WorkspaceSwitcher）
 * - composerBottom：「内容由 AI 生成，仅供参考」弱提示
 * - 消息操作条：copy / retry / regenerate / edit（修改并重发）/ quote（引用回复）
 * - 对话图标栏（conversationRailItems）：「执行步骤」popover 浮层（ui 内置
 *   StepsPanel 组件，绑定 chat.steps 数据源）；产物按钮 / 步骤按钮均按当前会话
 *   有无对应内容动态显隐（hideArtifactRailItem / item.hidden）——
 *   c1 产物+步骤、c2 仅产物、c3 仅步骤、c4 无右侧按钮
 */

interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  time?: string;
  agent?: { name: string };
  status?: string;
  parts: Array<Record<string, unknown>>;
  actions?: Array<{ name: string; label?: string; icon?: string }>;
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

interface AttachmentData {
  id: string;
  name: string;
  fileSize?: number;
  fileType?: string;
  status?: string;
}

interface ContextItemData {
  id: string;
  label: string;
  trigger?: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let seq = 100;
let attachmentSeq = 0;

/** 助手消息操作条（对齐 CreditWeaveAI chat.page.yaml 的 messageActions） */
const MESSAGE_ACTIONS = [
  { name: "copy", label: "复制" },
  { name: "retry", label: "重试" },
  { name: "regenerate", label: "重新生成" },
  { name: "edit", label: "修改并重发" },
  { name: "quote", label: "引用回复", icon: "quote" },
];

/** '@' 提及的 mock 智能体（迁移自 CreditWeaveAI/chat mock-data） */
const MOCK_AGENTS = [
  { id: "helper", name: "小助手", description: "通用问答与总结" },
  { id: "coder", name: "代码专家", description: "代码生成与审查" },
  { id: "translator", name: "翻译官", description: "中英互译与润色" },
];

/** '+' 菜单的上下文候选（历史会话 / 记忆 / 人设的扁平合并） */
const MOCK_CONTEXT_ENTRIES = [
  { id: "h1", name: "历史：上次的对话", description: "关于报表需求的讨论" },
  { id: "h2", name: "历史：周报整理", description: "周一例会的纪要整理" },
  { id: "h3", name: "历史：产品评审", description: "新功能评审记录" },
  { id: "m1", name: "记忆：偏好设置", description: "回答尽量简洁，先给结论" },
  { id: "m2", name: "记忆：项目背景", description: "当前在做对话页示例" },
  { id: "m3", name: "记忆：常用口径", description: "数据口径以月度报表为准" },
  { id: "p1", name: "人设：严谨分析师", description: "重数据、给依据" },
  { id: "p2", name: "人设：敏捷教练", description: "引导式提问" },
  { id: "p3", name: "人设：资深架构师", description: "关注扩展性与取舍" },
  { id: "p4", name: "人设：文案助手", description: "口吻活泼的营销文案" },
];

/** 把 File 读成附件数据（伪上传：无网络，仅元信息用于展示） */
function readAsAttachment(file: File): Promise<AttachmentData> {
  return Promise.resolve({
    id: `att-${++attachmentSeq}`,
    name: file.name,
    fileSize: file.size,
    fileType: file.type || "application/octet-stream",
    status: "done",
  });
}

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
        actions: MESSAGE_ACTIONS,
      },
    ] as ChatMessageData[],
    c2: [
      {
        id: "m21",
        role: "user",
        time: "10:12",
        parts: [
          { type: "text", content: "请创作一个完整的AI短视频：主题「城市夜跑」，时长 30 秒" },
        ],
      },
      {
        id: "m22",
        role: "assistant",
        time: "10:14",
        agent: { name: "小 P" },
        status: "completed",
        parts: [
          { type: "thinking", content: "先确定视频结构与风格基调，再拆解为可执行的生成流水线…" },
          { type: "tool-call", name: "write_script", status: "done", durationMs: 2100 },
          { type: "tool-call", name: "design_storyboard", status: "done", durationMs: 3400 },
          { type: "tool-call", name: "search_footage", status: "running" },
          {
            type: "markdown",
            content:
              "剧本与分镜已完成并放入产物区，可点击右侧 **产物** 图标预览。正在继续检索素材。\n\n**视频结构（30s）**\n\n1. 开场：城市夜景空镜（3s）\n2. 主体：跑者穿梭街景（20s）\n3. 收尾：远眺城市天际线（7s）",
          },
          { type: "artifacts", count: 2 },
        ],
        actions: MESSAGE_ACTIONS,
      },
    ] as ChatMessageData[],
    c3: [
      {
        id: "m31",
        role: "user",
        time: "昨天 16:40",
        parts: [{ type: "text", content: "workbuddy 中的连接器有什么" }],
      },
      {
        id: "m32",
        role: "assistant",
        time: "昨天 16:41",
        agent: { name: "小 P" },
        status: "completed",
        parts: [
          { type: "thinking", content: "检索连接器目录，按类别整理能力清单…" },
          { type: "tool-call", name: "list_connectors", status: "done", durationMs: 1600 },
          {
            type: "markdown",
            content:
              "workbuddy 目前内置三类连接器：\n\n- **文档类**：飞书文档、Notion、语雀\n- **数据类**：MySQL、PostgreSQL、飞书多维表格\n- **协作类**：飞书消息、邮件、Webhook\n\n检索过程可点击右侧 **执行步骤** 图标查看。",
          },
        ],
        actions: MESSAGE_ACTIONS,
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
    c2: [
      {
        id: "c2/script.md",
        title: "城市夜跑-剧本.md",
        kind: "markdown",
        content:
          "# 《城市夜跑》短视频剧本（30s）\n\n## 第一幕：开场（0-3s）\n\n城市夜景空镜，霓虹与车流，环境音渐入。\n\n## 第二幕：主体（3-23s）\n\n跑者自街角入画，穿梭于路灯与橱窗之间；脚步节奏与配乐鼓点对齐。\n\n## 第三幕：收尾（23-30s）\n\n跑者停下，远眺城市天际线，logo 淡入。\n\n> 配乐建议：120 BPM 电子乐，结尾渐弱。",
      },
      {
        id: "c2/storyboard.md",
        title: "城市夜跑-分镜表.md",
        kind: "markdown",
        content:
          "# 分镜表（8 镜）\n\n| 镜号 | 画面 | 运镜 | 时长 |\n| --- | --- | --- | --- |\n| 1 | 夜景航拍 | 推进 | 3s |\n| 2 | 街角入画 | 固定 | 3s |\n| 3 | 脚步特写 | 跟拍 | 4s |\n| 4 | 橱窗倒影 | 横移 | 4s |\n| 5 | 天桥俯拍 | 拉升 | 3s |\n| 6 | 跑者背影 | 跟拍 | 3s |\n| 7 | 停步喘息 | 固定 | 3s |\n| 8 | 天际线远景 | 渐隐 | 7s |",
      },
    ] as ArtifactData[],
  } as Record<string, ArtifactData[]>,
  // 执行步骤：c1 风险审查 / c3 连接器检索；c2、c4 等会话无步骤（图标隐藏）
  steps: {
    c1: [
      { title: "剧本结构拆解", description: "按引流 / 信任 / 转化三段拆解剧本", status: "done", duration: "1.1s" },
      { title: "话术特征比对", description: "比对 200+ 条保健品诈骗话术特征库", status: "done", duration: "2.6s" },
      { title: "风险评级与建议", description: "输出风险评级报告与修改建议", status: "done", duration: "0.9s" },
    ] as StepsPanelItemData[],
    c3: [
      { title: "需求理解", description: "确认查询范围：workbuddy 内置连接器", status: "done", duration: "0.4s" },
      { title: "连接器目录检索", description: "按文档 / 数据 / 协作三类检索连接器目录", status: "done", duration: "1.6s" },
      { title: "能力清单整理", description: "汇总各连接器的能力与接入方式", status: "done", duration: "0.7s" },
    ] as StepsPanelItemData[],
  } as Record<string, StepsPanelItemData[]>,
};

interface ReplyOptions {
  model?: string;
  contexts?: ContextItemData[];
  workspace?: string;
  attachments?: AttachmentData[];
}

function buildReply(text: string, opts: ReplyOptions = {}): ChatMessageData {
  // 让模型切换 / 上下文 chips / 工作空间 / 附件的效果在回复中可感知
  // （对齐 CreditWeaveAI mock-ai 的 notes 行）
  const notes: string[] = [];
  if (opts.model) {
    notes.push(`当前模型：\`${opts.model}\``);
  }
  if (opts.contexts && opts.contexts.length > 0) {
    notes.push(`引用上下文：${opts.contexts.map((item) => item.label).join("、")}`);
  }
  if (opts.workspace) {
    notes.push(`工作空间：${opts.workspace}`);
  }
  if (opts.attachments && opts.attachments.length > 0) {
    notes.push(`附件：${opts.attachments.map((item) => item.name).join("、")}`);
  }
  const noteLine = notes.length > 0 ? `> ${notes.join(" · ")}\n\n` : "";
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
        content: `${noteLine}已收到「${text}」。\n\n我整理了一份初稿并放入右侧产物区，你可以继续补充要求，我会迭代更新。`,
      },
      { type: "artifacts", count: 1 },
    ],
    actions: MESSAGE_ACTIONS,
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
  "chat.steps": async (params: Record<string, unknown>) => {
    await delay(100);
    return [...(store.steps[String(params["conversationId"])] ?? [])];
  },
  "chat.send": async (params: Record<string, unknown>) => {
    const conversationId = String(params["conversationId"]);
    const text = String(params["text"] ?? "");
    const contexts = (params["contexts"] as ContextItemData[] | undefined) ?? [];
    const attachments =
      (params["attachments"] as AttachmentData[] | undefined) ?? [];
    const replyOptions: ReplyOptions = {
      model: params["model"] ? String(params["model"]) : undefined,
      contexts,
      workspace: params["workspace"] ? String(params["workspace"]) : undefined,
      attachments,
    };
    store.messages[conversationId] ??= [];
    store.messages[conversationId].push({
      id: `m${++seq}`,
      role: "user",
      time: "刚刚",
      parts: [{ type: "text", content: text }],
    });
    await delay(400);
    store.messages[conversationId].push(buildReply(text, replyOptions));
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
  "chat.removeAttachment": async (params: Record<string, unknown>) => {
    const id = params["id"];
    const attachments = (params["attachments"] as AttachmentData[] | undefined) ?? [];
    return attachments.filter((item) => item.id !== id);
  },
  "chat.newConversation": async () => {
    await delay(100);
    const id = `c${++seq}`;
    store.conversations.unshift({ id, title: "新任务", time: "刚刚" });
    store.messages[id] = [];
    store.artifacts[id] = [];
    store.steps[id] = [];
    return { id };
  },
  "chat.deleteConversation": async (params: Record<string, unknown>) => {
    await delay(100);
    const id = String(params["id"]);
    const activeId = String(params["activeId"] ?? "");
    store.conversations = store.conversations.filter((c) => c.id !== id);
    delete store.messages[id];
    delete store.artifacts[id];
    delete store.steps[id];
    return {
      activeId: id === activeId ? (store.conversations[0]?.id ?? "") : activeId,
    };
  },
};

/**
 * 自定义动作：onAttachFiles 的 File[] 无法穿越 DSL 表达式求值
 * （resolveDeep 只保留 plain object），这里从原始事件作用域取 File，
 * 伪上传后返回可序列化附件列表，交由后续 setState 写回。
 */
const chatActions = {
  "chat.attachFiles": async (
    _action: unknown,
    ctx: { scope: Record<string, unknown> },
  ) => {
    const files = (ctx.scope["event"] as File[] | undefined) ?? [];
    const state = (ctx.scope["state"] as Record<string, unknown> | undefined) ?? {};
    const current = (state["attachments"] as AttachmentData[] | undefined) ?? [];
    const added = await Promise.all(files.map(readAsAttachment));
    return { ok: true, data: [...current, ...added] };
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
    // 聊天框受控闭环状态（对齐 CreditWeaveAI chat.page.yaml）
    model: "demo-mock",
    contextItems: [] as ContextItemData[],
    attachments: [] as AttachmentData[],
    workspace: "",
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
    steps: {
      type: "service",
      service: "chat.steps",
      autoLoad: true,
      params: { conversationId: "${state.activeConversationId}" },
    },
  },
  actions: {
    // 发送消息（ChatPage onSend：Composer 提交 / Welcome prompt 选择均传出文本）；
    // 模型 / 上下文 chips / 工作空间 / 附件随参数一并下发，发送后清空 chips 与附件
    sendMessage: [
      { action: "setState", params: { sending: true } },
      {
        action: "service.call",
        params: {
          service: "chat.send",
          params: {
            conversationId: "${state.activeConversationId}",
            text: "${event}",
            model: "${state.model}",
            contexts: "${state.contextItems}",
            workspace: "${state.workspace}",
            attachments: "${state.attachments}",
          },
        },
      },
      {
        action: "setState",
        params: { sending: false, contextItems: [], attachments: [] },
      },
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
        params: {
          activeConversationId: "${actions.created.id}",
          activeArtifactId: "",
          showArtifact: false,
        },
      },
      { action: "reload" },
    ],
    // 切换会话（onSelectConversation 传出会话 id）；
    // 无产物的会话隐藏产物按钮，切换时收起产物区避免空面板残留
    selectConversation: [
      {
        action: "setState",
        params: {
          activeConversationId: "${event}",
          activeArtifactId: "",
          showArtifact: false,
        },
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
        // footerSectionTitle: "空间 (14)",
        // footerItems: [
        //   { key: "space-default", label: "默认空间", icon: "house" },
        //   { key: "space-design", label: "设计团队", icon: "users" },
        //   { key: "space-frontend", label: "前端小组", icon: "code" },
        // ],
        conversationTitle: "${data.conversation.title}",
        messages: "${data.messages}",
        sending: "${state.sending}",
        composerPlaceholder: "输入消息，Enter 发送…",
        // 模型选择 chip（Composer 工具栏右端，发送钮之前）
        models: [
          { value: "demo-mock", label: "demo-mock" },
          { value: "demo-fast", label: "demo-fast" },
          { value: "demo-pro", label: "demo-pro" },
        ],
        model: "${state.model}",
        // 上下文数据源：'@' 智能体提及 / '+' 上下文菜单
        contexts: [
          {
            trigger: "@",
            label: "智能体",
            items: MOCK_AGENTS.map((agent) => ({
              id: agent.id,
              label: agent.name,
            })),
          },
          {
            trigger: "+",
            label: "上下文",
            items: MOCK_CONTEXT_ENTRIES.map((entry) => ({
              id: entry.id,
              label: entry.name,
            })),
          },
        ],
        contextItems: "${state.contextItems}",
        // 附件入口（附件钮 / 粘贴 / 拖拽 → onAttachFiles 伪上传）
        attachments: "${state.attachments}",
        // Composer footer 槽：工作空间切换器（自定义组件）
        composerFooter: {
          type: "WorkspaceSwitcher",
          props: {
            value: "${state.workspace}",
            options: [
              { label: "默认工作空间", value: "默认工作空间" },
              { label: "设计团队空间", value: "设计团队空间" },
              { label: "前端研发空间", value: "前端研发空间" },
            ],
          },
          events: {
            onChange: [
              { action: "setState", params: { workspace: "${event}" } },
            ],
          },
        },
        // Composer 下方弱提示行
        composerBottom: {
          type: "Text",
          props: { type: "secondary", size: "small", text: "内容由 AI 生成，仅供参考" },
        },
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
        // 仅当前会话有产物时展示产物按钮（图标栏内置首项）
        hideArtifactRailItem: "${!data.artifacts || data.artifacts.length === 0}",
        // 对话图标栏附加项：执行步骤（popover 浮层，toggle 展示）；
        // 当前会话无步骤时隐藏（hidden 绑表达式动态显隐）
        conversationRailItems: [
          {
            key: "steps",
            label: "执行步骤",
            icon: "list",
            display: "popover",
            hidden: "${!data.steps || data.steps.length === 0}",
            content: {
              type: "StepsPanel",
              props: { steps: "${data.steps}" },
            },
          },
        ],
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
              showArtifact: false,
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
        onModelChange: [
          { action: "setState", params: { model: "${event}" } },
        ],
        onContextItemsChange: [
          { action: "setState", params: { contextItems: "${event}" } },
        ],
        onAttachFiles: [
          { id: "attached", action: "chat.attachFiles" },
          {
            action: "setState",
            params: { attachments: "${actions.attached}" },
          },
        ],
        onRemoveAttachment: [
          {
            id: "remaining",
            action: "service.call",
            params: {
              service: "chat.removeAttachment",
              params: {
                id: "${event}",
                attachments: "${state.attachments}",
              },
            },
          },
          {
            action: "setState",
            params: { attachments: "${actions.remaining}" },
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
  return (
    <PactorPage
      pageDsl={chatPage}
      services={chatServices}
      components={{ WorkspaceSwitcher }}
      actions={chatActions}
    />
  );
}
