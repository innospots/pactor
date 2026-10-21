import { startOfDay } from 'date-fns';

import { cn } from '../lib/utils.js';

/** 时/分/秒三元组（TimePicker 与 DatePicker 时间列共用） */
export interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** 时间字符串 → { hour, minute, second }（非法输入返回 undefined） */
export function parseTime(value: unknown): TimeParts | undefined {
  if (typeof value !== 'string') return undefined;
  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(value.trim());
  if (!match) return undefined;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] === undefined ? 0 : Number(match[3]);
  if (hour > 23 || minute > 59 || second > 59) return undefined;
  return { hour, minute, second };
}

export function nowParts(): TimeParts {
  const now = new Date();
  return { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };
}

/** Date → 时/分/秒（丢失日期部分） */
export function timeOfDate(date: Date): TimeParts {
  return { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
}

/** 日期 + 时/分/秒 → 新的 Date（毫秒归零，日期取当天零点） */
export function withTime(date: Date, parts: TimeParts): Date {
  const next = startOfDay(date);
  next.setHours(parts.hour, parts.minute, parts.second, 0);
  return next;
}

/** 时/分/秒 → 时间字符串；withSeconds=false 时省略秒 */
export function formatTimeParts(parts: TimeParts, withSeconds: boolean): string {
  return withSeconds
    ? `${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`
    : `${pad(parts.hour)}:${pad(parts.minute)}`;
}

/** 缺省起点时间 00:00:00 */
export function defaultStartTime(): TimeParts {
  return { hour: 0, minute: 0, second: 0 };
}

/** 缺省终点时间 23:59:59（'HH:mm' 时为 23:59） */
export function defaultEndTime(withSeconds: boolean): TimeParts {
  return withSeconds
    ? { hour: 23, minute: 59, second: 59 }
    : { hour: 23, minute: 59, second: 0 };
}

export interface TimeColumnsProps {
  /** data-slot 前缀：列分别为 `${slotPrefix}-hour-column` / `-minute-column` / `-second-column` */
  slotPrefix: string;
  value: TimeParts;
  onChange: (parts: TimeParts) => void;
  /** 是否渲染秒列 */
  withSeconds: boolean;
  /** 是否填满容器高度（DatePicker 浮层内时间区）：列取消 max-h-40，改为 h-full */
  fillHeight?: boolean;
}

/** 时/分（/秒）三列滚动列表（TimePicker 与 DatePicker 共用） */
export function TimeColumns({
  slotPrefix,
  value,
  onChange,
  withSeconds,
  fillHeight = false,
}: TimeColumnsProps) {
  const renderColumn = (
    slot: string,
    max: number,
    active: number,
    onPick: (n: number) => void,
  ) => (
    <div
      data-slot={slot}
      className={cn(
        'w-14 overflow-y-auto rounded-md border border-border',
        fillHeight ? 'h-full' : 'max-h-40',
      )}
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

  return (
    <div
      className={cn(
        'flex gap-2',
        fillHeight ? 'h-full items-stretch' : 'items-start',
      )}
    >
      {renderColumn(`${slotPrefix}-hour-column`, 23, value.hour, (n) =>
        onChange({ ...value, hour: n }),
      )}
      {renderColumn(`${slotPrefix}-minute-column`, 59, value.minute, (n) =>
        onChange({ ...value, minute: n }),
      )}
      {withSeconds
        ? renderColumn(`${slotPrefix}-second-column`, 59, value.second, (n) =>
            onChange({ ...value, second: n }),
          )
        : null}
    </div>
  );
}
