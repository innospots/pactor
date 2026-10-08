import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { ChipNode } from '../ChipNode/index.js';

/** 快筛选项；文案含计数时由数据侧预计算（表达式引擎不支持数组方法与函数调用） */
export interface ChipFilterItem {
  /** 提交值（'all' 为约定的「全部」项，可用 allValue 改写） */
  value: string;
  /** 展示文案（含计数，数据侧预计算） */
  text: string;
  /** 可选状态色点（CSS 颜色值） */
  dot?: string;
}

export interface ChipFilterProps {
  /** 选项列表（可经接口下发，表达式解析后的数组） */
  items?: ChipFilterItem[];
  /** single：单选（value 为字符串）；multi：多选（value 为已选值数组） */
  mode?: 'single' | 'multi';
  /** 当前值（single 为字符串，multi 为数组） */
  value?: string | string[];
  /** 「全部」项的约定值（缺省 'all'） */
  allValue?: string;
  /** 选中变化事件（single 传出字符串，multi 传出数组） */
  onChange?: (value: string | string[]) => void;
  /** 通用：根节点 class */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * 快筛 Chip 组（F3 标签筛选）：选项（value / 文案 / 计数 / 色点）整体下发，
 * 页面 DSL 不再逐枚硬编码 ChipNode。
 *
 * 两种交互：
 * - mode="single"：单选。点击已选项回到 allValue（toggle 语义）；
 * - mode="multi"：多选。选项中含 value === allValue 的「全部」项时，
 *   点击它清空选择、仅在无选择时高亮；不含「全部」项时纯切换、不选即全部。
 *
 * DSL 用法（${event} = 新值，single 为字符串 / multi 为数组）：
 *   { type: 'ChipFilter', props: { mode: 'single', value: '${state.status}', items: [...] },
 *     events: { onChange: [setState, reload] } }
 */
export function ChipFilter({
  items,
  mode = 'single',
  value,
  allValue = 'all',
  onChange,
  className,
  style,
}: ChipFilterProps) {
  if (!Array.isArray(items)) return null;
  const selectedValues = Array.isArray(value) ? value : [];
  return (
    <div
      data-slot="chip-filter"
      className={cn('inline-flex flex-wrap items-center gap-(--flex-gap-sm)', className)}
      style={style}
    >
      {items.map((item) => {
        const selected =
          mode === 'multi'
            ? item.value === allValue
              ? selectedValues.length === 0
              : selectedValues.includes(item.value)
            : (value ?? allValue) === item.value;
        return (
          <ChipNode
            key={item.value}
            text={item.text}
            dot={item.dot}
            selected={selected}
            onClick={() => {
              if (mode === 'multi') {
                if (item.value === allValue) {
                  onChange?.([]);
                } else {
                  onChange?.(
                    selected
                      ? selectedValues.filter((v) => v !== item.value)
                      : [...selectedValues, item.value],
                  );
                }
              } else {
                onChange?.(selected && item.value !== allValue ? allValue : item.value);
              }
            }}
          />
        );
      })}
    </div>
  );
}
