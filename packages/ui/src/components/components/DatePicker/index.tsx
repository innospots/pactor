import { useI18n } from '@pactor-app/runtime';
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useId, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Calendar as ShadcnCalendar } from '../../../ui/calendar.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover.js';
import { CLEARABLE_GROUP, CLEARABLE_ICON_HIDE, ClearHoverButton } from '../../clearable.js';
import { CONTROL_SIZE_BOX, type ControlSize } from '../../control-size.js';
import { formItemClass, useFormContext } from '../Form/context.js';
import type { FieldRule } from '../Input/index.js';

/** range 模式值（ISO yyyy-MM-dd 对） */
export interface DateRangeValue {
  start: string;
  end: string;
}

/** 内置预设 key（计算与文案由框架提供，label 可覆盖） */
export type DatePickerPresetKey = 'today' | 'thisWeek' | 'thisMonth';

/**
 * presets 数组项的三种形态：
 * - `{ key, label? }`：内置项（today / thisWeek / thisMonth），label 覆盖内置 i18n 文案
 * - `{ label, days: N }`：最近 N 天（含今天）
 * - `{ label, range: { start, end } }`：显式 ISO 区间
 */
export type DatePickerPreset =
  | { key: DatePickerPresetKey; label?: string }
  | { label: string; days: number }
  | { label: string; range: DateRangeValue };

interface DatePickerCommonProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 占位文案（缺省取 i18n key，按 mode 区分 single/range） */
  placeholder?: string;
  disabled?: boolean;
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸） */
  size?: ControlSize;
  /** hover 清除（缺省开启，传 false 关闭）：有值时悬停触发器，日历图标替换为 ×，点击清空当前值 */
  allowClear?: boolean;
  /**
   * 快捷预设栏：未提供时 range 模式缺省为内置三项（今天/本周/本月），
   * single 模式不渲染；`false` 显式关闭
   */
  presets?: DatePickerPreset[] | false;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为触发器） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

export interface DatePickerSingleProps extends DatePickerCommonProps {
  /** 选择模式（缺省 single） */
  mode?: 'single';
  /** 受控值（ISO 日期字符串 yyyy-MM-dd）；Form 内作为字段初始值 */
  value?: string;
  /** 选中日期事件，传出 ISO 日期字符串（yyyy-MM-dd），清除传 undefined */
  onChange?: (value: string | undefined) => void;
}

export interface DatePickerRangeProps extends DatePickerCommonProps {
  mode: 'range';
  /** 受控值（{ start, end } ISO 对）；Form 内作为字段初始值 */
  value?: DateRangeValue;
  /** 范围选定事件，仅两端齐备时触发，传出 { start, end } ISO 对象 */
  onChange?: (value: DateRangeValue | undefined) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

/** useI18n().locale → date-fns locale（内置 zh-CN/en-US，未知回退 en-US） */
function toDateFnsLocale(locale: string) {
  switch (locale) {
    case 'zh-CN':
      return zhCN;
    case 'en-US':
      return enUS;
    default:
      return enUS;
  }
}

/** ISO 字符串 → Date（非法输入返回 undefined） */
function parseDate(value: unknown): Date | undefined {
  if (typeof value !== 'string' || value === '') return undefined;
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
}

/** { start, end } ISO 对象 → Date 对（任一端非法返回 undefined） */
function parseRange(value: unknown): { from: Date; to: Date } | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const { start, end } = value as Partial<DateRangeValue>;
  const from = parseDate(start);
  const to = parseDate(end);
  return from && to ? { from, to } : undefined;
}

/** range 端点的选中态样式（与 vendored calendar 的 selected 类一致，经 modifiers 施加） */
const RANGE_ENDPOINT_CLASSES =
  '[&>button]:bg-(--calendar-selected-background) [&>button]:text-(--calendar-selected-foreground) [&>button]:hover:bg-(--calendar-selected-background) [&>button]:hover:text-(--calendar-selected-foreground)';
/** 区间中间日期的过渡样式（组件令牌 --calendar-range-*） */
const IN_RANGE_CLASSES =
  '[&>button]:bg-(--calendar-range-background) [&>button]:text-(--calendar-range-foreground) [&>button]:rounded-none';

/**
 * DatePicker 适配器（shadcn kit）：input 风格触发器 + 受控 Popover 内嵌
 * vendored Calendar（react-day-picker）。`mode: 'single' | 'range'`；
 * 值契约：single 为 ISO 字符串（yyyy-MM-dd），range 为 `{ start, end }`
 * ISO 对象（仅两端齐备才触发 onChange）。range 为左右双面板（两个
 * `mode="single"` 日历，各自受控月份与导航箭头），选择语义为
 * 「任意面板两次点击」：首击设开始日并清空结束日，第二击不早于开始日
 * 即提交、早于则重新开始，已有完整区间再点击开始新一轮。
 * presets 快捷选择（除定位型「今天」外点击即完成选择、触发 onChange、
 * 不关浮层）；默认文案走 `pactor.datePicker.*` i18n key，日历本体按
 * useI18n().locale 映射 date-fns locale。Form 内声明 `name` 自动成为表单项。
 */
export function DatePicker(props: DatePickerProps) {
  const {
    name,
    label,
    rules,
    placeholder,
    disabled,
    size = 'middle',
    allowClear,
    presets,
    className,
    style,
  } = props;
  const mode = props.mode ?? 'single';
  const isRange = mode === 'range';
  const value = props.value;
  const onChange = props.onChange as
    | ((value: string | DateRangeValue | undefined) => void)
    | undefined;

  const form = useFormContext();
  const { locale, t } = useI18n();
  const dfLocale = toDateFnsLocale(locale);
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  // 独立渲染：内部选中态（外部 value 变化时同步镜像）
  const [innerValue, setInnerValue] = useState(value);
  useEffect(() => {
    if (!inForm) setInnerValue(value);
  }, [inForm, value]);

  // range 双面板：pendingStart 为未提交的开始日（设定即清空结束日显示）；
  // 两侧各自受控月份（缺省 今天月 / 下月）
  const [pendingStart, setPendingStart] = useState<Date | undefined>();
  const [startMonth, setStartMonth] = useState<Date>(() =>
    startOfMonth(new Date()),
  );
  const [endMonth, setEndMonth] = useState<Date>(() =>
    startOfMonth(addMonths(new Date(), 1)),
  );

  const current = inForm && form && name ? form.values[name] : innerValue;

  // 面板月份归一化：任何时候保证 startMonth < endMonth（右面板至少晚一个月）。
  // 提交/回显定位走 setPanelMonths（右 = max(end 月, start 月 + 1)）；
  // 单侧导航越界时对侧顺延/回退。
  const setPanelMonths = (start: Date, end: Date) => {
    const s = startOfMonth(start);
    const e = startOfMonth(end);
    setStartMonth(s);
    setEndMonth(isBefore(e, addMonths(s, 1)) ? addMonths(s, 1) : e);
  };

  const handleStartMonthChange = (month: Date) => {
    const s = startOfMonth(month);
    setStartMonth(s);
    setEndMonth((prev) => (isBefore(s, prev) ? prev : addMonths(s, 1)));
  };

  const handleEndMonthChange = (month: Date) => {
    const e = startOfMonth(month);
    setEndMonth(e);
    setStartMonth((prev) => (isBefore(prev, e) ? prev : subMonths(e, 1)));
  };

  // 已提交值变化（用户选齐两端 / 预设 / 外部初始值）时重置 pending 与两侧月份
  useEffect(() => {
    if (!isRange) return;
    const parsed = parseRange(current);
    setPendingStart(undefined);
    setPanelMonths(
      parsed?.from ?? new Date(),
      parsed?.to ?? addMonths(new Date(), 1),
    );
  }, [isRange, current]);

  const commit = (next: string | DateRangeValue | undefined) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    } else {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  const commitRange = (from: Date, to: Date) => {
    commit({ start: format(from, 'yyyy-MM-dd'), end: format(to, 'yyyy-MM-dd') });
  };

  const handleSingleSelect = (date: Date | undefined) => {
    commit(date ? format(date, 'yyyy-MM-dd') : undefined);
  };

  const parsedRange = isRange ? parseRange(current) : undefined;
  // 显示用选中模型：pending 期间开始日取 pending、结束日视为清空
  const rangeStart = pendingStart ?? parsedRange?.from;
  const rangeEnd = pendingStart !== undefined ? undefined : parsedRange?.to;

  // 「任意面板两次点击」：两个面板共用此处理（design D2b）
  const handleRangeDaySelect = (date: Date | undefined) => {
    if (!date) return;
    const day = startOfDay(date);
    if (pendingStart) {
      if (isBefore(day, pendingStart)) {
        // 第二击早于开始日：视为新的开始日重新开始
        setPendingStart(day);
      } else {
        commitRange(pendingStart, day);
      }
    } else {
      // 无选择或已有完整区间：开始新一轮（设开始日、清结束日）
      setPendingStart(day);
    }
  };

  // 预设栏：range 缺省内置三项，single 缺省无，false 关闭
  const presetList =
    presets === false
      ? []
      : (presets ??
        (isRange
          ? ([{ key: 'today' }, { key: 'thisWeek' }, { key: 'thisMonth' }] as const)
          : []));

  const resolvePreset = (
    preset: DatePickerPreset,
  ): { label: string; from: Date; to: Date } => {
    const now = new Date();
    if ('key' in preset) {
      const key = preset.key;
      const label = preset.label ?? t(`pactor.datePicker.${key}`);
      if (key === 'today') return { label, from: now, to: now };
      if (key === 'thisWeek') {
        return {
          label,
          from: startOfWeek(now, { locale: dfLocale }),
          to: endOfWeek(now, { locale: dfLocale }),
        };
      }
      return { label, from: startOfMonth(now), to: endOfMonth(now) };
    }
    if ('days' in preset) {
      return { label: preset.label, from: subDays(now, preset.days - 1), to: now };
    }
    return {
      label: preset.label,
      from: parseDate(preset.range.start) ?? now,
      to: parseDate(preset.range.end) ?? now,
    };
  };

  // 预设点击：「今天」为定位型——range 清空范围选择、定位当前月、
  // 今天作为新的开始日（等结束日），不触发 onChange；single 选中今天并
  // 触发 onChange。其余预设直接提交完整区间。
  const handlePresetClick = (preset: DatePickerPreset, from: Date, to: Date) => {
    if ('key' in preset && preset.key === 'today') {
      const today = startOfDay(new Date());
      if (isRange) {
        setPendingStart(today);
        setPanelMonths(today, addMonths(today, 1));
      } else {
        commit(format(today, 'yyyy-MM-dd'));
      }
      return;
    }
    commitRange(from, to);
  };

  const singleDate = isRange ? undefined : parseDate(current);

  // 区间选中态经 modifiers 施加（开始日/结束日端点 + 严格位于两端之间的
  // 过渡样式）；结束日清空（pending 期间）时无端点与中间样式。
  // inRange 仅在 end 严格晚于 start（按日历日）时构造：同日区间（start==end）
  // 的 { after, before } 会被 DayPicker 当作开放区间匹配几乎所有日期。
  const hasInnerRange =
    isRange &&
    rangeStart !== undefined &&
    rangeEnd !== undefined &&
    isBefore(startOfDay(rangeStart), startOfDay(rangeEnd));
  // 只传 modifiers / modifiersClassNames，不传 classNames，避免整体覆盖 vendored 样式
  const rangeModifiers = isRange
    ? {
        ...(rangeStart ? { rangeStart } : {}),
        ...(rangeEnd ? { rangeEnd } : {}),
        ...(hasInnerRange
          ? { inRange: { after: rangeStart, before: rangeEnd } }
          : {}),
      }
    : undefined;
  const rangeModifierClassNames = rangeModifiers
    ? {
        ...(rangeStart ? { rangeStart: RANGE_ENDPOINT_CLASSES } : {}),
        ...(rangeEnd ? { rangeEnd: RANGE_ENDPOINT_CLASSES } : {}),
        ...(hasInnerRange ? { inRange: IN_RANGE_CLASSES } : {}),
      }
    : undefined;

  const displayText = isRange
    ? typeof current === 'object' && current !== null
      ? `${(current as DateRangeValue).start} ~ ${(current as DateRangeValue).end}`
      : ''
    : typeof current === 'string'
      ? current
      : '';
  // hover 清除：有值且未禁用时，悬停把触发器右侧日历图标替换为 ×
  const showClear = allowClear !== false && disabled !== true && displayText !== '';
  const placeholderText =
    placeholder ??
    t(isRange ? 'pactor.datePicker.placeholderRange' : 'pactor.datePicker.placeholder');

  const calendar = isRange ? (
    <div className="flex">
      <div
        data-slot="datepicker-start-panel"
        className="border-r border-border"
      >
        <ShadcnCalendar
          mode="single"
          month={startMonth}
          onMonthChange={handleStartMonthChange}
          onSelect={handleRangeDaySelect}
          modifiers={rangeModifiers}
          modifiersClassNames={rangeModifierClassNames}
          locale={dfLocale}
          // 双面板不渲染邻月补齐格：邻月在对侧面板完整可见，
          // 且选中态 modifier 按日期匹配，会重复高亮到补齐格上
          showOutsideDays={false}
        />
      </div>
      <div data-slot="datepicker-end-panel">
        <ShadcnCalendar
          mode="single"
          month={endMonth}
          onMonthChange={handleEndMonthChange}
          onSelect={handleRangeDaySelect}
          modifiers={rangeModifiers}
          modifiersClassNames={rangeModifierClassNames}
          locale={dfLocale}
          showOutsideDays={false}
        />
      </div>
    </div>
  ) : (
    <ShadcnCalendar
      mode="single"
      selected={singleDate}
      onSelect={handleSingleSelect}
      locale={dfLocale}
    />
  );

  const control = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={controlId}
        type="button"
        disabled={disabled}
        data-slot="datepicker-trigger"
        className={cn(
          'flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-(--input-background) px-3 py-1 text-sm text-(--input-foreground) shadow-xs transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          CONTROL_SIZE_BOX[size],
          CLEARABLE_GROUP,
          displayText === '' && 'text-muted-foreground',
          !inForm && className,
        )}
        style={inForm ? undefined : style}
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {displayText === '' ? placeholderText : displayText}
        </span>
        {showClear ? (
          <ClearHoverButton
            label={t('pactor.control.clear')}
            onClear={() => commit(undefined)}
          />
        ) : null}
        <CalendarIcon
          className={cn('size-4 shrink-0 opacity-50', showClear && CLEARABLE_ICON_HIDE)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {presetList.length > 0 ? (
          <div className="flex">
            <div
              data-slot="datepicker-presets"
              className="flex flex-col gap-1 border-r border-border p-3"
            >
              {presetList.map((preset, index) => {
                const resolved = resolvePreset(preset);
                return (
                  <button
                    key={`${resolved.label}-${index}`}
                    type="button"
                    className="cursor-pointer rounded-md px-3 py-1.5 text-left text-sm whitespace-nowrap hover:bg-accent hover:text-accent-foreground"
                    onClick={() =>
                      handlePresetClick(preset, resolved.from, resolved.to)
                    }
                  >
                    {resolved.label}
                  </button>
                );
              })}
            </div>
            {calendar}
          </div>
        ) : (
          calendar
        )}
      </PopoverContent>
    </Popover>
  );

  if (inForm && form && name) {
    const error = form.errors[name];
    return (
      <div
        data-slot="form-item"
        className={cn(formItemClass(form.layout), className)}
        style={style}
      >
        {label ? (
          <label
            htmlFor={controlId}
            className="shrink-0 text-sm leading-none font-medium whitespace-nowrap"
          >
            {label}
          </label>
        ) : null}
        {control}
        {error ? (
          <div data-slot="form-error" className="text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </div>
    );
  }

  return control;
}
