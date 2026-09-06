import type { CSSProperties } from 'react';

import {
  ToggleGroup as ShadcnToggleGroup,
  ToggleGroupItem,
} from '../../../ui/toggle-group.js';

/** ToggleGroup 选项 */
export interface ToggleGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  /** 选项列表 */
  options?: ToggleGroupOption[];
  /** 受控选中值：单选传 value，多选传数组 */
  value?: string | string[];
  /** 多选模式（缺省单选） */
  multiple?: boolean;
  disabled?: boolean;
  /** 选中变化事件：单选传出选中 value（取消选中传 undefined），多选传出值数组 */
  onChange?: (value: string | string[] | undefined) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * ToggleGroup 适配器（shadcn kit）：基于 vendored ToggleGroup（Base UI）；
 * Base UI 统一以数组表达选中态，适配层按 multiple 收敛为
 * 单值/数组（DSL 语义值）。
 */
export function ToggleGroup({
  options = [],
  value,
  multiple,
  disabled,
  onChange,
  className,
  style,
}: ToggleGroupProps) {
  const groupValue =
    value === undefined ? undefined : Array.isArray(value) ? value : [value];

  const handleChange = (next: string[]) => {
    if (multiple) {
      onChange?.(next);
    } else {
      // 单选：传出最新按下项；全部取消时传 undefined
      const previous = groupValue ?? [];
      const added = next.find((item) => !previous.includes(item));
      onChange?.(added ?? undefined);
    }
  };

  return (
    <ShadcnToggleGroup
      value={groupValue}
      multiple={multiple}
      disabled={disabled}
      onValueChange={(next) => handleChange(next as string[])}
      className={className}
      style={style}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ShadcnToggleGroup>
  );
}
