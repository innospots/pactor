/**
 * examples/chat 的 mock 数据层：`@` 提及的智能体与 "+" 菜单的上下文
 * 候选。全部为演示用静态数据，经 App.tsx 的 callService 服务桥解析给
 * 包内建上下文弹层（spec: chat-context-sources，无网络）。
 */

/** `@` 提及的 mock 智能体 */
export const MOCK_AGENTS: { id: string; name: string; description: string }[] = [
  { id: 'helper', name: '小助手', description: '通用问答与总结' },
  { id: 'coder', name: '代码专家', description: '代码生成与审查' },
  { id: 'translator', name: '翻译官', description: '中英互译与润色' },
];

/** "+" 菜单的上下文候选（历史会话 / 记忆 / 人设的扁平合并） */
export const MOCK_CONTEXT_ENTRIES: { id: string; name: string; description: string }[] = [
  { id: 'h1', name: '历史：上次的对话', description: '关于报表需求的讨论' },
  { id: 'h2', name: '历史：周报整理', description: '周一例会的纪要整理' },
  { id: 'h3', name: '历史：产品评审', description: '新功能评审记录' },
  { id: 'm1', name: '记忆：偏好设置', description: '回答尽量简洁，先给结论' },
  { id: 'm2', name: '记忆：项目背景', description: '当前在做 @pactor/chat 示例' },
  { id: 'm3', name: '记忆：常用口径', description: '数据口径以月度报表为准' },
  { id: 'p1', name: '人设：严谨分析师', description: '重数据、给依据' },
  { id: 'p2', name: '人设：敏捷教练', description: '引导式提问' },
  { id: 'p3', name: '人设：资深架构师', description: '关注扩展性与取舍' },
  { id: 'p4', name: '人设：文案助手', description: '口吻活泼的营销文案' },
];

/** 智能体列表页（src/agents.page.yaml）的条目为 MOCK_AGENTS 的静态展开 */
