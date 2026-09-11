/**
 * AI 生成引导流程（spec: theme-studio-ai-generate / 引导问题模板）：
 * 本地确定性状态机——不让模型自由提问。用户点选选项或自由输入都记为
 * 答案；首条输入已覆盖风格/色系时跳过对应提问。
 */

/** 问题一选项：主题风格（8 项） */
export const STYLE_OPTIONS = [
  '科技',
  '生活',
  '财经',
  '教育',
  '医疗',
  '电商',
  '文娱',
  '政务',
] as const;

/** 问题二选项：中国传统色色系（10 项，取自 china_colors.md 代表色） */
export const PALETTE_OPTIONS = [
  { label: '绯红', ref: '珊瑚赫' },
  { label: '杏黄', ref: '半見' },
  { label: '明黄', ref: '梔子' },
  { label: '草绿', ref: '碧山' },
  { label: '青碧', ref: '青冥' },
  { label: '靛蓝', ref: '群青' },
  { label: '紫罗兰', ref: '齊紫' },
  { label: '胭脂', ref: '胭脂水' },
  { label: '墨灰', ref: '玄天' },
  { label: '月白', ref: '月白' },
] as const;

export const QUESTION_STYLE = '您期望生成的主题风格是？';
export const QUESTION_PALETTE = '您期望的色系是？';

export interface AiAnswers {
  style?: string;
  palette?: string;
  freeText?: string;
}

export type FlowStep = 'askStyle' | 'askPalette' | 'confirm';

/** 从自由文本中识别已覆盖的答案（命中选项关键词即视为已回答） */
export function detectAnswers(text: string): Partial<AiAnswers> {
  const found: Partial<AiAnswers> = {};
  const style = STYLE_OPTIONS.find((s) => text.includes(s));
  if (style) {
    found.style = style;
  }
  const palette = PALETTE_OPTIONS.find(
    (p) => text.includes(p.label) || text.includes(p.ref),
  );
  if (palette) {
    found.palette = `${palette.label}（${palette.ref}）`;
  }
  return found;
}

/**
 * 给定当前答案，决定下一个提问步骤；全部覆盖则进入 confirm。
 */
export function nextStep(answers: AiAnswers): FlowStep {
  if (!answers.style) {
    return 'askStyle';
  }
  if (!answers.palette) {
    return 'askPalette';
  }
  return 'confirm';
}

/** 用户作答后的答案合并：选项值直接采用；自由输入按当前问题归位 */
export function applyAnswer(
  answers: AiAnswers,
  step: 'askStyle' | 'askPalette',
  input: string,
): AiAnswers {
  const trimmed = input.trim();
  if (!trimmed) {
    return answers;
  }
  if (step === 'askStyle') {
    return { ...answers, style: trimmed };
  }
  return { ...answers, palette: trimmed };
}

/** 泛化/无效描述的兜底模式（如「帮我生成一个主题」「好看点」） */
const GENERIC_RE =
  /^(请|帮我|给我|麻烦|我要|我想)?(生成|做|弄|来|设计)?一?(个|款|套|份)?(好看|漂亮|不错|简洁|大气)?的?(主题|皮肤|颜色|配色|样式)?(吧|呀|哈|啊|呢|~|!|！|。|…)*$/;

/**
 * 需求是否不明确（需要澄清提问）：未命中任何风格/色系关键词，
 * 且输入过短或只是泛化描述。问题模板仅用于澄清，不作开场白。
 */
export function isVague(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    return true;
  }
  const detected = detectAnswers(trimmed);
  if (detected.style || detected.palette) {
    return false;
  }
  return trimmed.length <= 10 || GENERIC_RE.test(trimmed);
}
