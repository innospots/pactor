/**
 * 通用异常状态的 kind → 图标/标题/提示 映射。
 * Astro 版（ExceptionState.astro）与 React 版（EmptyResults.tsx）共用，
 * 保证服务端渲染与交互岛内的零结果态视觉一致。
 */

export type ExceptionKind =
  | 'loading'
  | 'empty'
  | 'no-results'
  | 'missing'
  | 'broken-ref'
  | 'copy-fail'
  | 'link-broken';

export interface ExceptionStateDef {
  icon: string;
  title: string;
  hint: string;
}

export const EXCEPTION_STATES: Record<ExceptionKind, ExceptionStateDef> = {
  loading: {
    icon: '⏳',
    title: '加载中',
    hint: '内容正在加载，请稍候…',
  },
  empty: {
    icon: '▢',
    title: '暂无资产',
    hint: '本板块资产尚未接入；接入后将在构建期自动出现在此处。',
  },
  'no-results': {
    icon: '⌕',
    title: '没有匹配的结果',
    hint: '当前搜索或筛选条件没有命中任何条目，请调整条件或清除筛选。',
  },
  missing: {
    icon: '⚠',
    title: '资源缺失',
    hint: '该资源未在构建数据中登记，可能已移除或尚未接入，请反馈维护者。',
  },
  'broken-ref': {
    icon: '🔗',
    title: '引用断裂',
    hint: '关联资产的引用在构建数据中不存在；构建期校验通常会阻断此情况，若线上因缓存出现，请反馈维护者重建。',
  },
  'copy-fail': {
    icon: '✕',
    title: '复制失败',
    hint: '剪贴板不可用或写入失败，请手动选择内容复制。',
  },
  'link-broken': {
    icon: '🚫',
    title: '外链失效',
    hint: '该外部链接当前不可用，已禁用跳转；可用性恢复后将重新开放。',
  },
};
