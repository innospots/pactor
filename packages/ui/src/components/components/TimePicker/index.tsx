import { useI18n } from '@pactor-app/runtime';
import { Clock } from 'lucide-react';
import { useEffect, useId, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover.js';
import { CLEARABLE_GROUP, CLEARABLE_ICON_HIDE, ClearHoverButton } from '../../clearable.js';
import { CONTROL_SIZE_BOX, type ControlSize } from '../../control-size.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

export interface TimePickerProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（时间字符串，如 "13:45:00"）；Form 内作为字段初始值 */
  value?: string;
  /** 输出格式：'HH:mm:ss'（缺省，含秒列）或 'HH:mm'（无秒列、值无秒） */
  format?: 'HH:mm:ss' | 'HH:mm';
  placeholder?: string;
  disabled?: boolean;
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸） */
  size?: ControlSize;
  /** hover 清除（缺省开启，传 false 关闭）：有值时悬停触发器，时钟图标替换为 ×，点击清空（传出 undefined） */
  allowClear?: boolean;
  /** 时间变化事件，传出按 format 格式化的时间字符串；清除时传出 undefined */
  onChange?: (value: string | undefined) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为触发器） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** 时间字符串 → { hour, minute, second }（非法输入返回 undefined） */
function parseTime(value: unknown): TimeParts | undefined {
  if (typeof value !== 'string') return undefined;
  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(value.trim());
  if (!match) return undefined;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] === undefined ? 0 : Number(match[3]);
  if (hour > 23 || minute > 59 || second > 59) return undefined;
  return { hour, minute, second };
}

function nowParts(): TimeParts {
  const now = new Date();
  return { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };
}

/**
 * TimePicker 适配器（shadcn kit）：input 风格触发器 + 受控 Popover，
 * 弹层内为时/分（/秒）列滚动列表，点选更新待选值，「确定」提交、
 * 「此刻」取当前时间。`format: 'HH:mm'` 时无秒列、值无秒。
 * onChange 传出时间字符串（DSL 语义值）；Form 内声明 `name` 自动成为表单项。
 */
export function TimePicker({
  name,
  label,
  rules,
  value,
  format = 'HH:mm:ss',
  placeholder,
  disabled,
  size = 'middle',
  allowClear,
  onChange,
  className,
  style,
}: TimePickerProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const [open, setOpen] = useState(false);
  const withSeconds = format !== 'HH:mm';

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

  const current = inForm && form && name ? form.values[name] : innerValue;
  const displayText = typeof current === 'string' ? current : '';
  // hover 清除：有值且未禁用时，悬停把触发器右侧时钟图标替换为 ×
  const showClear = allowClear !== false && disabled !== true && displayText !== '';
  const handleClear = () => {
    if (inForm && form && name) {
      form.setValue(name, undefined);
    } else {
      setInnerValue(undefined);
    }
    onChange?.(undefined);
  };

  // 弹层内待选值（打开时以当前值或此刻初始化）
  const [pending, setPending] = useState<TimeParts>(() => nowParts());
  const openPanel = (next: boolean) => {
    if (next) {
      setPending(parseTime(current) ?? nowParts());
    }
    setOpen(next);
  };

  const formatParts = (parts: TimeParts) =>
    withSeconds
      ? `${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`
      : `${pad(parts.hour)}:${pad(parts.minute)}`;

  const commit = (next: string) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    } else {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  const renderColumn = (
    slot: string,
    max: number,
    active: number,
    onPick: (n: number) => void,
  ) => (
    <div
      data-slot={slot}
      className="max-h-40 w-14 overflow-y-auto rounded-md border border-border"
    >
      {Array.from({ length: max + 1 }, (_, n) => (
        <button
          key={n}
          type="button"
          className={cn(
            'flex w-full cursor-pointer items-center justify-center px-2 py-1 text-sm hover:bg-accent',
            n === active && 'bg-primary text-primary-foreground hover:bg-primary',
          )}
          onClick={() => onPick(n)}
        >
          {pad(n)}
        </button>
      ))}
    </div>
  );

  const control = (
    <Popover open={open} onOpenChange={openPanel}>
      <PopoverTrigger
        id={controlId}
        type="button"
        disabled={disabled}
        data-slot="timepicker-trigger"
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
          {displayText === ''
            ? (placeholder ?? t('pactor.timePicker.placeholder'))
            : displayText}
        </span>
        {showClear ? (
          <ClearHoverButton label={t('pactor.control.clear')} onClear={handleClear} />
        ) : null}
        <Clock
          className={cn('size-4 shrink-0 opacity-50', showClear && CLEARABLE_ICON_HIDE)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div data-slot="timepicker-panel" className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            {renderColumn('timepicker-hour-column', 23, pending.hour, (n) =>
              setPending((prev) => ({ ...prev, hour: n })),
            )}
            {renderColumn('timepicker-minute-column', 59, pending.minute, (n) =>
              setPending((prev) => ({ ...prev, minute: n })),
            )}
            {withSeconds
              ? renderColumn('timepicker-second-column', 59, pending.second, (n) =>
                  setPending((prev) => ({ ...prev, second: n })),
                )
              : null}
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
            <button
              type="button"
              className="cursor-pointer rounded-md px-2 py-1 text-sm text-primary hover:bg-accent"
              onClick={() => setPending(nowParts())}
            >
              {t('pactor.timePicker.now')}
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                commit(formatParts(pending));
                setOpen(false);
              }}
            >
              {t('pactor.alertDialog.confirm')}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        rules={rules}
        htmlFor={controlId}
        error={form.errors[name]}
        className={className}
        style={style}
      >
        {control}
      </FieldShell>
    );
  }

  return control;
}
