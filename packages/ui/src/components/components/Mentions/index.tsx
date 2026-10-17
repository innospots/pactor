import { useI18n } from '@pactor-app/runtime';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';

import { cn } from '../../../lib/utils.js';
import { Textarea as ShadcnTextarea } from '../../../ui/textarea.js';
import { CONTROL_SIZE_AREA, type ControlSize } from '../../control-size.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

/** Mentions 候选项 */
export interface MentionOption {
  label: string;
  value: string;
}

export interface MentionsProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 候选列表 */
  options?: MentionOption[];
  /** 触发字符，缺省 '@' */
  trigger?: string;
  /** 文本域行数 */
  rows?: number;
  placeholder?: string;
  /** 受控值（完整字符串）；Form 内作为字段初始值 */
  value?: string;
  disabled?: boolean;
  /** 控件尺寸（默认 middle；影响内边距与字号，高度仍由行数/内容决定） */
  size?: ControlSize;
  /** 输入变化事件，传出完整字符串 */
  onChange?: (value: string) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件包裹节点） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

interface MentionState {
  /** 触发字符在文本中的下标 */
  start: number;
  /** 光标下标 */
  caret: number;
  /** 触发字符后的查询串 */
  query: string;
}

/** 从光标前文本提取进行中的提及上下文（查询串含空白则视为已结束） */
function detectMention(
  text: string,
  caret: number,
  trigger: string,
): MentionState | undefined {
  const before = text.slice(0, caret);
  const start = before.lastIndexOf(trigger);
  if (start < 0) return undefined;
  const query = before.slice(start + trigger.length);
  if (/\s/.test(query)) return undefined;
  return { start, caret, query };
}

/**
 * Mentions 适配器（shadcn kit）：textarea 输入 trigger 字符后弹候选浮层
 * （按 trigger 后的查询串过滤 label / value），点击或 Enter 选中后在
 * 光标处插入 `trigger + value + 空格`；↑/↓ 移动高亮，Esc 关闭。
 * onChange 传出完整字符串（DSL 语义值）；Form 内声明 `name` 自动成为表单项。
 */
export function Mentions({
  name,
  label,
  rules,
  options = [],
  trigger = '@',
  rows,
  placeholder,
  value,
  disabled,
  size = 'middle',
  onChange,
  className,
  style,
}: MentionsProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  // 独立渲染：内部选中态（外部 value 变化时同步镜像）
  const [innerValue, setInnerValue] = useState(value ?? '');
  useEffect(() => {
    if (!inForm) setInnerValue(value ?? '');
  }, [inForm, value]);

  const fieldValue = inForm && form && name ? form.values[name] : undefined;
  const currentValue =
    typeof fieldValue === 'string' ? fieldValue : inForm ? '' : innerValue;

  const [mention, setMention] = useState<MentionState | undefined>();
  const [highlight, setHighlight] = useState(0);

  const filtered = mention
    ? options.filter(
        (option) =>
          option.label.includes(mention.query) ||
          option.value.includes(mention.query),
      )
    : [];
  const open = mention !== undefined && filtered.length > 0;

  const commit = (next: string) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    } else {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    commit(next);
    setMention(detectMention(next, event.target.selectionStart ?? next.length, trigger));
    setHighlight(0);
  };

  const pick = (option: MentionOption) => {
    if (!mention) return;
    const inserted = `${trigger}${option.value} `;
    const next =
      currentValue.slice(0, mention.start) +
      inserted +
      currentValue.slice(mention.caret);
    commit(next);
    setMention(undefined);
    setHighlight(0);
    const caret = mention.start + inserted.length;
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(caret, caret);
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!open) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlight((prev) => (prev + 1) % filtered.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      pick(filtered[Math.min(highlight, filtered.length - 1)]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setMention(undefined);
    }
  };

  const control = (
    <div
      className={cn('relative', !inForm && className)}
      style={inForm ? undefined : style}
    >
      <ShadcnTextarea
        ref={textareaRef}
        id={controlId}
        data-slot="mentions"
        value={currentValue}
        rows={rows}
        placeholder={placeholder ?? t('pactor.input.placeholder')}
        disabled={disabled}
        className={CONTROL_SIZE_AREA[size]}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setMention(undefined)}
      />
      {open ? (
        <div
          data-slot="mentions-popup"
          className="absolute z-50 mt-1 flex max-h-48 w-56 flex-col gap-0.5 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {filtered.map((option, index) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'cursor-pointer rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent',
                index === highlight && 'bg-accent',
              )}
              onMouseDown={(event) => {
                // 先于 textarea blur 完成选中
                event.preventDefault();
                pick(option);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
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
