/**
 * 组件目录数据（任务 4.1）。
 * 来源：product-design/ui/component-design.md §3 分类与完整组件目录 + §11 组件覆盖矩阵
 * （首版验收清单，合计 137 个：通用 10 / 布局 9 / 导航 10 / 数据录入 19 / 数据展示 15 /
 * 反馈 14 / 图表 17 / 媒体与内容 11 / AI 与会话 15 / 业务组件 17）。
 * 区块分类口径更新：设计稿 17 个规划条目尚无实现，blocks.ts 只收录
 * @pactor-app/blocks 包 9 个真实实现（加上布局批 Row / Col，当前合计 130）。
 * 统计口径：文档未逐组件标注成熟度与废弃项，全部按 stable 录入，不臆造实验态；
 * 清单本身为已确认目录，integration 统一 'integrated'。
 * tokenRefs 本期全部留空：tokens 数据尚未接入，引用会触发构建期校验失败；
 * 待样式 Token 接入后按分类为代表性组件（每分类 1-2 个）回填。
 */
import type { ComponentEntry } from '../types.ts';
import { aiChatComponents } from './ai-chat.ts';
import { blocksComponents } from './blocks.ts';
import { chartComponents } from './charts.ts';
import { dataDisplayComponents } from './data-display.ts';
import { dataEntryComponents } from './data-entry.ts';
import { feedbackComponents } from './feedback.ts';
import { generalComponents } from './general.ts';
import { layoutComponents } from './layout.ts';
import { mediaComponents } from './media.ts';
import { navigationComponents } from './navigation.ts';

export { aiChatComponents } from './ai-chat.ts';
export { blocksComponents } from './blocks.ts';
export { chartComponents } from './charts.ts';
export { dataDisplayComponents } from './data-display.ts';
export { dataEntryComponents } from './data-entry.ts';
export { feedbackComponents } from './feedback.ts';
export { generalComponents } from './general.ts';
export { layoutComponents } from './layout.ts';
export { mediaComponents } from './media.ts';
export { navigationComponents } from './navigation.ts';

/** 组件条目全集（137 个，按二级分类顺序汇总） */
export const components: ComponentEntry[] = [
  ...generalComponents,
  ...layoutComponents,
  ...navigationComponents,
  ...dataEntryComponents,
  ...dataDisplayComponents,
  ...feedbackComponents,
  ...chartComponents,
  ...mediaComponents,
  ...aiChatComponents,
  ...blocksComponents,
];
