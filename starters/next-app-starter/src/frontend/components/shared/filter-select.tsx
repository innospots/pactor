"use client";

import {
  Select,
  useFormContext,
  type SelectOption,
  type SelectProps,
} from "@pactor-app/ui/components";
import { useEffect, useMemo } from "react";

/** 与列表筛选 DSL 约定：提交前将 `__ALL__` 映射为 `""` */
export const FILTER_ALL_VALUE = "__ALL__";

function hasAllOption(options: SelectOption[]): boolean {
  return options.some(
    (option) => option.value === "" || option.value === null || option.value === undefined,
  );
}

function mapOptions(options: SelectOption[]): SelectOption[] {
  return options.map((option) => {
    if (
      option.value === "" ||
      option.value === null ||
      option.value === undefined
    ) {
      return { ...option, value: FILTER_ALL_VALUE };
    }
    return option;
  });
}

function isEmptyFilterValue(value: unknown): boolean {
  return value === "" || value === null || value === undefined;
}

/**
 * 列表筛选用 Select：支持「全部」等空值选项的默认展示（底层 Select 会将 `""` 当作未选）。
 */
export function FilterSelect({
  options = [],
  name,
  allowClear,
  onChange,
  ...rest
}: SelectProps) {
  const form = useFormContext();
  const mappedOptions = useMemo(() => mapOptions(options), [options]);
  const supportsAll = hasAllOption(options);

  useEffect(() => {
    if (!supportsAll || form?.inForm !== true || typeof name !== "string") {
      return;
    }
    const fieldName = name;
    const current = form.values[fieldName];
    if (isEmptyFilterValue(current)) {
      form.setValue(fieldName, FILTER_ALL_VALUE);
    }
  }, [form, name, supportsAll]);

  return (
    <Select
      {...rest}
      name={name}
      options={mappedOptions}
      allowClear={allowClear ?? false}
      onChange={(next) => {
        if (next === undefined || next === null) {
          if (supportsAll && form?.inForm === true && typeof name === "string") {
            form.setValue(name, FILTER_ALL_VALUE);
          }
          onChange?.("");
          return;
        }
        const apiValue = next === FILTER_ALL_VALUE ? "" : next;
        onChange?.(apiValue);
      }}
    />
  );
}
