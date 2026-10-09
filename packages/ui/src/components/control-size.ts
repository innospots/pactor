/**
 * 表单控件统一尺寸令牌：small / middle / large，默认 middle（= 现行 h-9 尺寸）。
 * 所有盒式表单控件（Input / Select / DatePicker / SearchableSelect / 业务组件
 * 内嵌控件等）共用同一映射，保证同一 size 下高度、内边距、字号一致。
 *
 * 使用方式：把控件尺寸类合并到控件 className 末位（cn/tailwind-merge 会覆盖
 * vendored 基类中的 h-9 / px-3 / text-sm）；vendored SelectTrigger 的高度走
 * data-size 属性（属性选择器优先级高于普通类），用 CONTROL_SIZE_SELECT_ATTR
 * 换算后传 size prop，文本/内边距用 CONTROL_SIZE_TRIGGER_TEXT。
 */
export type ControlSize = 'small' | 'middle' | 'large';

/** 单行盒式控件：高度 + 水平内边距 + 字号 */
export const CONTROL_SIZE_BOX: Record<ControlSize, string> = {
  small: 'h-8 px-2.5 text-xs',
  middle: 'h-9 px-3 text-sm',
  large: 'h-10 px-4 text-base',
};

/**
 * 高度随内容增长的盒式控件（多选 chips / contentEditable / 标签输入）：min-height 版。
 * py 须保证「行高 + 纵向 padding + 2px 边框」不超过 min-height（middle：20+12+2=34≤36），
 * 否则控件会被内容撑得比定高的 h-* 控件高，同行混排时大小不一。
 */
export const CONTROL_SIZE_BOX_GROW: Record<ControlSize, string> = {
  small: 'min-h-8 px-2.5 py-1 text-xs',
  middle: 'min-h-9 px-3 py-1.5 text-sm',
  large: 'min-h-10 px-4 py-1.5 text-base',
};

/** 多行文本控件（Textarea / Mentions）：内边距 + 字号（高度由行数/内容决定） */
export const CONTROL_SIZE_AREA: Record<ControlSize, string> = {
  small: 'px-2.5 py-1.5 text-xs',
  middle: 'px-3 py-2 text-sm',
  large: 'px-4 py-2.5 text-base',
};

/** vendored SelectTrigger 的 size 属性值（高度由 data-size 变体承载） */
export const CONTROL_SIZE_SELECT_ATTR = {
  small: 'sm',
  middle: 'default',
  large: 'lg',
} as const;

/** vendored SelectTrigger 的文本/内边距类（高度走 size 属性，这里不含 h-*） */
export const CONTROL_SIZE_TRIGGER_TEXT: Record<ControlSize, string> = {
  small: 'px-2.5 text-xs',
  middle: 'px-3 text-sm',
  large: 'px-4 text-base',
};
