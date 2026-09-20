/**
 * 可检查对象（data-inspect）序列化助手。
 * 中间内容区的卡片 / Token 行 / 色板等元素通过 toInspectAttrs 内联
 * 检查数据，右侧 Inspector 岛以事件委托统一读取（design D6），
 * 避免每卡片一个岛的水合成本。数据量小，直接内联属性即可。
 */
import type { ChangeFlag, Integration, Maturity } from '../assets-data/types.ts';

/** 可检查对象的最小描述 */
export interface InspectEntry {
  /** 稳定规范 ID（data-inspect 的主键） */
  id: string;
  name: string;
  /** 看板副标题（对象类型，如「组件实例」「Token」） */
  type?: string;
  maturity?: Maturity;
  change?: ChangeFlag;
  integration?: Integration;
  /** 简单键值属性（属性看板态展示） */
  props?: Record<string, string>;
  description?: string;
}

/** 生成 Astro 元素可展开的 data-inspect-* 属性集合 */
export function toInspectAttrs(entry: InspectEntry): Record<string, string> {
  return {
    'data-inspect': entry.id,
    'data-inspect-name': entry.name,
    ...(entry.type !== undefined ? { 'data-inspect-type': entry.type } : {}),
    ...(entry.maturity !== undefined
      ? { 'data-inspect-maturity': entry.maturity }
      : {}),
    ...(entry.change !== undefined ? { 'data-inspect-change': entry.change } : {}),
    ...(entry.integration !== undefined
      ? { 'data-inspect-integration': entry.integration }
      : {}),
    ...(entry.props && Object.keys(entry.props).length > 0
      ? { 'data-inspect-props': JSON.stringify(entry.props) }
      : {}),
    ...(entry.description !== undefined
      ? { 'data-inspect-desc': entry.description }
      : {}),
  };
}
