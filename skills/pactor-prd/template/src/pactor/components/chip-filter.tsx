"use client";

/**
 * 快筛 Chip 组（列表页共享的自定义组件）：Chip 列表整体作为单一组件，
 * 选项（value / 文案 / 计数 / 色点）由接口返回，页面 DSL 不再逐枚硬编码 ChipNode。
 * 选项文案含计数，由接口侧预计算（表达式引擎不支持数组方法与函数调用）。
 *
 * 兼容各列表页的两种交互（Provider / Model / Route / Client / ClientTemplate）：
 * - mode="single"：单选，value 为字符串。点击已选项回到 allValue（默认 'all'），
 *   与「状态 / 类型」单选快筛的 toggle 语义一致；
 * - mode="multi"：多选，value 为已选值数组。选项中含 value === allValue 的
 *   「全部」项时，点击它清空选择、仅在无选择时高亮（标签 / 厂商快筛语义）；
 *   不含「全部」项时纯切换、不选即全部（Provider 类型快筛语义）。
 *
 * DSL 用法（${event} = 新值，single 为字符串 / multi 为数组）：
 *   {
 *     type: "ChipFilter",
 *     props: {
 *       mode: single,
 *       value: "${state.statusChip}",
 *       items: "${data.providers.filters.status}",
 *     },
 *     events: { onChange: [setState, reload] },
 *   }
 */
import { ChipNode } from "./chip-node";

export interface ChipFilterItem {
  /** 提交值（'all' 为约定的「全部」项，可用 allValue 改写） */
  value: string;
  /** 展示文案（含计数，接口预计算） */
  text: string;
  /** 可选状态色点 */
  dot?: string;
}

export function ChipFilter({
  items,
  mode = "single",
  value,
  allValue = "all",
  onChange,
}: {
  items?: ChipFilterItem[];
  mode?: "single" | "multi";
  value?: string | string[];
  allValue?: string;
  onChange?: (value: string | string[]) => void;
}) {
  if (!Array.isArray(items)) return null;
  const selectedValues = Array.isArray(value) ? value : [];
  return (
    <>
      {items.map((item) => {
        const selected =
          mode === "multi"
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
              if (mode === "multi") {
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
                onChange?.(
                  selected && item.value !== allValue ? allValue : item.value,
                );
              }
            }}
          />
        );
      })}
    </>
  );
}
