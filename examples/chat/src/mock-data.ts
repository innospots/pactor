/**
 * examples/chat 的 mock 数据层：能力 / 模型 / 提及代理 / "+" 菜单的
 * 选择器条目。全部为演示用静态数据，选择结果仅是 UI 状态（无网络）。
 */

/** 能力 chip 的可选项（对应参考页 composer 左侧能力胶囊） */
export interface MockCapability {
  value: string;
  label: string;
  description: string;
}

export const MOCK_CAPABILITIES: MockCapability[] = [
  { value: 'chat', label: '对话', description: '通用对话（默认）' },
  { value: 'deep-research', label: '深度研究', description: '多轮检索与引用（mock）' },
  { value: 'deep-solve', label: '深度求解', description: '分步推理求解（mock）' },
  { value: 'visualize', label: '可视化', description: '图表与卡片生成（mock）' },
];

/** 模型选择器的可选项（对应参考页右下模型 chip） */
export const MOCK_MODELS: { value: string; label: string }[] = [
  { value: 'demo-mock', label: 'demo-mock' },
  { value: 'demo-fast', label: 'demo-fast' },
  { value: 'demo-pro', label: 'demo-pro' },
];

/** `@` 提及的 mock 代理 */
export const MOCK_AGENTS: { id: string; name: string; description: string }[] = [
  { id: 'helper', name: '小助手', description: '通用问答与总结' },
  { id: 'coder', name: '代码专家', description: '代码生成与审查' },
  { id: 'translator', name: '翻译官', description: '中英互译与润色' },
];

/** "+" 菜单的三类上下文选择器 */
export type PickerKind = 'history' | 'memory' | 'persona';

export interface MockPickerEntry {
  id: string;
  /** 选中后作为上下文 chip 展示的名称 */
  name: string;
  description: string;
}

export const PICKER_TITLES: Record<PickerKind, string> = {
  history: '历史会话',
  memory: '记忆',
  persona: '人设',
};

/** chip 文案前缀（如「历史：上次的对话」） */
export const PICKER_CHIP_PREFIX: Record<PickerKind, string> = {
  history: '历史',
  memory: '记忆',
  persona: '人设',
};

export const MOCK_PICKER_ENTRIES: Record<PickerKind, MockPickerEntry[]> = {
  history: [
    { id: 'h1', name: '上次的对话', description: '关于报表需求的讨论' },
    { id: 'h2', name: '周报整理', description: '周一例会的纪要整理' },
    { id: 'h3', name: '产品评审', description: '新功能评审记录' },
  ],
  memory: [
    { id: 'm1', name: '偏好设置', description: '回答尽量简洁，先给结论' },
    { id: 'm2', name: '项目背景', description: '当前在做 pactor-chat 示例' },
    { id: 'm3', name: '常用口径', description: '数据口径以月度报表为准' },
  ],
  persona: [
    { id: 'p1', name: '严谨分析师', description: '重数据、给依据' },
    { id: 'p2', name: '敏捷教练', description: '引导式提问' },
    { id: 'p3', name: '资深架构师', description: '关注扩展性与取舍' },
    { id: 'p4', name: '文案助手', description: '口吻活泼的营销文案' },
  ],
};

/** 侧栏历史会话已随路由化重构移除：菜单为页面导航（见 App.tsx DEMO_MENUS），
 * 智能体列表见 src/agents.page.yaml（mock 条目即上方 MOCK_AGENTS 的静态展开） */
