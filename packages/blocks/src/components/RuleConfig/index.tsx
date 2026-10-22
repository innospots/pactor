import { useI18n } from '@pactor-app/runtime';
import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '../../lib/utils.js';
import { Badge } from '@pactor-app/ui/ui';
import { Button } from '@pactor-app/ui/ui';
import { Input } from '@pactor-app/ui/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pactor-app/ui/ui';
import {
  CONTROL_SIZE_BOX,
  CONTROL_SIZE_BOX_GROW,
  CONTROL_SIZE_SELECT_ATTR,
  CONTROL_SIZE_TRIGGER_TEXT,
  NumberInput,
  type ControlSize,
} from '@pactor-app/ui/components';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConditionOpt =
  | 'GREATER'
  | 'GREATER_EQUAL'
  | 'LESS_EQUAL'
  | 'LESS'
  | 'EQUAL'
  | 'IN'
  | 'NOT_IN'
  | 'UNEQUAL'
  | 'LIKE'
  | 'NULL'
  | 'HASVAL'
  | 'NOTNULL'
  | 'BETWEEN';

export interface Condition {
  key: number;
  opt: ConditionOpt;
  value?: string | number | (string | number | undefined)[];
  score?: number;
}

export interface RuleConfigValue {
  score?: number;
  ruleConditions: Condition[];
}

/**
 * 表单项必填校验：值至少包含权重（score）及一组条件。
 * 对象值对 react-hook-form 的 required 恒为真值，需用 validate 显式校验。
 */
export function isRuleConfigComplete(
  value: RuleConfigValue | null | undefined,
): boolean {
  return (
    value != null &&
    value.score != null &&
    Array.isArray(value.ruleConditions) &&
    value.ruleConditions.length > 0
  );
}

const isBlank = (v: unknown) => v == null || String(v).trim() === '';

/**
 * 条件取值是否为空：BETWEEN 需两个端点、IN/NOT_IN 需至少一项，其余需非空。
 */
function isValueMissing(condition: Condition): boolean {
  const { opt, value } = condition;
  if (NO_VALUE_OPT.includes(opt)) return false;
  if (opt === 'BETWEEN') {
    const [a, b] = normalizeBetweenValue(value);
    return isBlank(a) || isBlank(b);
  }
  if (Array.isArray(value)) return value.length === 0 || value.every(isBlank);
  return isBlank(value);
}

export interface ConditionIssue {
  /** 缺少取值 */
  missingValue: boolean;
  /** 缺少评分 */
  missingScore: boolean;
}

/**
 * 单条条件的完整性问题：只要选了操作符，就必须填写取值与评分
 * （无值操作符 NULL/HASVAL/NOTNULL 不要求取值）。完整时返回 null。
 */
export function getConditionIssue(
  condition: Condition,
): ConditionIssue | null {
  const missingValue = isValueMissing(condition);
  const missingScore = condition.score == null || Number.isNaN(condition.score);
  if (!missingValue && !missingScore) return null;
  return { missingValue, missingScore };
}

/** 提取所有不完整的条件（供表单提交前校验与行内提示） */
export function getIncompleteConditions(
  value: RuleConfigValue | null | undefined,
): Condition[] {
  const list = value?.ruleConditions;
  if (!Array.isArray(list)) return [];
  return list.filter((c) => getConditionIssue(c) != null);
}

const OPERATOR_VALUES: ConditionOpt[] = [
  'GREATER',
  'GREATER_EQUAL',
  'LESS_EQUAL',
  'LESS',
  'EQUAL',
  'IN',
  'NOT_IN',
  'UNEQUAL',
  'LIKE',
  'NULL',
  'HASVAL',
  'NOTNULL',
  'BETWEEN',
];

const NUMERIC_OPT: ConditionOpt[] = [
  'GREATER',
  'LESS',
  'LESS_EQUAL',
  'GREATER_EQUAL',
  'UNEQUAL',
];
const NO_VALUE_OPT: ConditionOpt[] = ['NULL', 'HASVAL', 'NOTNULL'];
const MULTI_VALUE_OPT: ConditionOpt[] = ['IN', 'NOT_IN'];

/** 操作符展示文案 key（缺省回退为操作符原值） */
const OPERATOR_LABEL_KEYS: Record<string, string> = {
  GREATER: 'pactor.operator.greater',
  GREATER_EQUAL: 'pactor.operator.greaterEqual',
  LESS_EQUAL: 'pactor.operator.lessEqual',
  LESS: 'pactor.operator.less',
  EQUAL: 'pactor.operator.equal',
  IN: 'pactor.operator.contains',
  NOT_IN: 'pactor.operator.notContains',
  UNEQUAL: 'pactor.operator.unequal',
  LIKE: 'pactor.operator.like',
  NULL: 'pactor.operator.empty',
  HASVAL: 'pactor.operator.hasValue',
  NOTNULL: 'pactor.operator.notEmpty',
  BETWEEN: 'pactor.operator.between',
};

let _key = 0;
const nextKey = () => ++_key;

const defaultCondition = (): Condition => ({ key: nextKey(), opt: 'EQUAL' });

/**
 * 归一化 BETWEEN 的条件值为二元组：兼容后端的逗号分隔字符串（"3,5"）、
 * 数组（[3, 5]，导入通道）与单值；空值/缺省为 [undefined, undefined]。
 */
export function normalizeBetweenValue(
  value: Condition['value'],
): [string | number | undefined, string | number | undefined] {
  if (Array.isArray(value)) return [value[0], value[1]];
  if (typeof value === 'string' && value.includes(',')) {
    const [a, b] = value.split(',');
    return [a?.trim(), b?.trim()];
  }
  if (value == null || value === '') return [undefined, undefined];
  return [value, undefined];
}

/** 条件值转为 NumberInput 的数值；数组 / 空值 / 非法值返回 undefined */
function toNumberValue(value: Condition['value']): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value !== 'string' || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** 展示状态下条件值的可读文本：BETWEEN 用 ~ 连接，IN/NOT_IN 逗号连接 */
function formatConditionValue(condition: Condition): string {
  const { opt, value } = condition;
  if (value == null) return '-';
  if (opt === 'BETWEEN') {
    const [a, b] = normalizeBetweenValue(value);
    return `${a ?? '-'} ~ ${b ?? '-'}`;
  }
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface RuleConfigProps {
  value?: RuleConfigValue;
  onChange?: (value: RuleConfigValue) => void;
  disabled?: boolean;
  /** 控件尺寸（默认 middle；权重/取值/评分输入与操作符下拉统一按尺寸令牌渲染） */
  size?: ControlSize;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RuleConfig({ value, onChange, disabled, size = 'middle' }: RuleConfigProps) {
  const { t } = useI18n();
  const operatorLabel = (op: string): string => {
    const key = OPERATOR_LABEL_KEYS[op];
    return key ? t(key) : op;
  };
  const rawConditions = value?.ruleConditions;
  // 后端数据的条件没有 key（或 key 重复），统一补齐唯一 key；
  // 否则按 key 匹配更新时所有条件都会命中（undefined === undefined），
  // 导致编辑一条条件时其他条件也被改掉
  const conditions = useMemo(() => {
    if (!rawConditions?.length) return [defaultCondition()];
    const seen = new Set<number>();
    return rawConditions.map((c) => {
      if (c.key != null && !seen.has(c.key)) {
        seen.add(c.key);
        return c;
      }
      const key = nextKey();
      seen.add(key);
      return { ...c, key };
    });
  }, [rawConditions]);
  const initScore = value?.score ?? 1;

  // 权重输入框用本地数值态：输入过程中允许清空重输（不回弹默认值），
  // 失焦时若为空再回退默认值 1 并提交
  const [score, setScore] = useState<number | undefined>(initScore);
  const lastScoreRef = useRef(value?.score);

  // 外部值变化（表单 reset / 回显）时同步到输入框；自身提交的受控回环跳过
  useEffect(() => {
    if (value?.score === lastScoreRef.current) return;
    lastScoreRef.current = value?.score;
    setScore(value?.score);
  }, [value?.score]);

  const commitScore = useCallback(
    (next: number) => {
      lastScoreRef.current = next;
      onChange?.({ score: next, ruleConditions: conditions });
    },
    [onChange, conditions],
  );

  const handleWeightChange = (next: number | undefined) => {
    setScore(next);
    // 清空时只更新本地态，失焦再回退默认值；NumberInput 已按 min/max 钳制并取整
    if (next != null && next !== lastScoreRef.current) {
      commitScore(next);
    }
  };

  const handleWeightBlur = () => {
    if (score == null) {
      setScore(1);
      commitScore(1);
    }
  };

  const update = useCallback(
    (next: Condition[], nextScore?: number) =>
      onChange?.({
        score: nextScore ?? initScore,
        ruleConditions: next,
      }),
    [onChange, initScore],
  );

  const handleOptChange = (key: number, opt: ConditionOpt) => {
    update(
      conditions.map((c) =>
        c.key === key
          ? { ...c, opt, value: opt === 'BETWEEN' ? [] : undefined }
          : c,
      ),
    );
  };

  const handleValueChange = (key: number, val: Condition['value']) => {
    update(conditions.map((c) => (c.key === key ? { ...c, value: val } : c)));
  };

  const handleScoreChange = (key: number, score: number | undefined) => {
    update(
      conditions.map((c) => (c.key === key ? { ...c, score } : c)),
    );
  };

  const handleAdd = () => update([...conditions, defaultCondition()]);

  const handleDelete = (key: number) =>
    update(conditions.filter((c) => c.key !== key));

  // 展示状态：只读文本展示权重与条件，不渲染表单控件
  if (disabled) {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 pb-2 border-b">
          <span className="text-muted-foreground">
            {t('pactor.ruleConfig.weight')}
          </span>
          <span className="font-medium">{initScore}</span>
        </div>
        {conditions.map((condition) => (
          <div key={condition.key} className="flex items-center gap-2">
            <span>{operatorLabel(condition.opt)}</span>
            {!NO_VALUE_OPT.includes(condition.opt) && (
              <span className="font-medium">
                {formatConditionValue(condition)}
              </span>
            )}
            <span className="text-muted-foreground">
              {t('pactor.ruleConfig.scoreValue', {
                score: condition.score ?? '-',
              })}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Weight */}
      <div className="flex items-center gap-1 pb-2 border-b gap-2">
        <span className="text-sm shrink-0">{t('pactor.ruleConfig.weight')}</span>
        <NumberInput
          className="w-48"
          size={size}
          min={1}
          max={1000}
          step={1}
          precision={0}
          value={score}
          disabled={disabled}
          placeholder={t('pactor.ruleConfig.weightPlaceholder')}
          onChange={handleWeightChange}
          onBlur={handleWeightBlur}
        />
      </div>

      {/* Condition rows */}
      {conditions.map((condition) => (
        <ConditionRow
          key={condition.key}
          condition={condition}
          issue={getConditionIssue(condition)}
          showDelete={conditions.length > 1}
          disabled={disabled}
          size={size}
          onOptChange={(opt) => handleOptChange(condition.key, opt)}
          onValueChange={(val) => handleValueChange(condition.key, val)}
          onScoreChange={(score) => handleScoreChange(condition.key, score)}
          onDelete={() => handleDelete(condition.key)}
        />
      ))}
      {!disabled && (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto p-0 text-sm mt-1"
          onClick={handleAdd}
        >
          <Plus className="h-3.5 w-3.5" />
          {t('pactor.condition.add')}
        </Button>
      )}
    </div>
  );
}

// ─── Single condition row ─────────────────────────────────────────────────────

interface ConditionRowProps {
  condition: Condition;
  issue?: ConditionIssue | null;
  showDelete: boolean;
  disabled?: boolean;
  size: ControlSize;
  onOptChange: (opt: ConditionOpt) => void;
  onValueChange: (val: Condition['value']) => void;
  onScoreChange: (score: number | undefined) => void;
  onDelete: () => void;
}

function ConditionRow({
  condition,
  issue,
  showDelete,
  disabled,
  size,
  onOptChange,
  onValueChange,
  onScoreChange,
  onDelete,
}: ConditionRowProps) {
  const { t } = useI18n();
  const operatorLabel = (op: string): string => {
    const key = OPERATOR_LABEL_KEYS[op];
    return key ? t(key) : op;
  };
  const { opt, value, score } = condition;
  const missingValue = !disabled && !!issue?.missingValue;
  const missingScore = !disabled && !!issue?.missingScore;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
      {/* Operator select */}
      <Select<string>
        items={OPERATOR_VALUES.map((op) => ({
          value: op,
          label: operatorLabel(op),
        }))}
        value={opt}
        onValueChange={(v) => onOptChange(v as ConditionOpt)}
        disabled={disabled}
      >
        <SelectTrigger
          size={CONTROL_SIZE_SELECT_ATTR[size]}
          className={cn('w-36 shrink-0', CONTROL_SIZE_TRIGGER_TEXT[size])}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPERATOR_VALUES.map((op) => (
            <SelectItem key={op} value={op}>
              {operatorLabel(op)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value input — varies by opt */}
      {!NO_VALUE_OPT.includes(opt) && (
        <div
          className={
            'w-[30%]' + (missingValue ? ' [&_input]:border-destructive' : '')
          }
        >
          <ValueInput
            opt={opt}
            value={value}
            disabled={disabled}
            size={size}
            onChange={onValueChange}
          />
        </div>
      )}

      {/* Score input */}
      <NumberInput
        className="w-24 shrink-0"
        controlClassName={missingScore ? 'border-destructive' : undefined}
        size={size}
        value={score}
        disabled={disabled}
        placeholder={t('pactor.ruleConfig.score')}
        aria-invalid={missingScore || undefined}
        onChange={onScoreChange}
      />

      {/* Delete button */}
      {showDelete && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      </div>

      {/* Inline hints：选了操作符后必须填取值与评分 */}
      {!disabled && issue && (
        <p className="text-xs text-destructive">
          {[
            missingValue ? t('pactor.ruleConfig.valueRequired') : null,
            missingScore ? t('pactor.ruleConfig.scoreRequired') : null,
          ]
            .filter(Boolean)
            .join(t('pactor.ruleConfig.issueSeparator'))}
        </p>
      )}
    </div>
  );
}

// ─── Value input switcher ────────────────────────────────────────────────────

interface ValueInputProps {
  opt: ConditionOpt;
  value: Condition['value'];
  disabled?: boolean;
  size: ControlSize;
  onChange: (val: Condition['value']) => void;
}

function ValueInput({ opt, value, disabled, size, onChange }: ValueInputProps) {
  if (NO_VALUE_OPT.includes(opt)) {
    return null;
  }

  if (opt === 'BETWEEN') {
    // 后端值为逗号字符串（"3,5"）、导入通道为数组，统一归一化后展示
    const [v1, v2] = normalizeBetweenValue(value);
    return (
      <div className="flex items-center gap-2">
        <NumberInput
          className="flex-1"
          size={size}
          value={toNumberValue(v1)}
          disabled={disabled}
          onChange={(next) => onChange([next, v2])}
        />
        <span className="text-muted-foreground text-sm shrink-0">~</span>
        <NumberInput
          className="flex-1"
          size={size}
          value={toNumberValue(v2)}
          disabled={disabled}
          onChange={(next) => onChange([v1, next])}
        />
      </div>
    );
  }

  if (MULTI_VALUE_OPT.includes(opt)) {
    return (
      <TagInput
        value={(value as string[]) ?? []}
        disabled={disabled}
        size={size}
        onChange={(tags) => onChange(tags)}
      />
    );
  }

  if (NUMERIC_OPT.includes(opt)) {
    return (
      <NumberInput
        size={size}
        value={toNumberValue(value)}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }

  return (
    <Input
      type="text"
      className={CONTROL_SIZE_BOX[size]}
      value={(value as string) ?? ''}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// ─── Tag input (for IN / NOT_IN) ──────────────────────────────────────────────

function TagInput({
  value,
  disabled,
  size,
  onChange,
}: {
  value: string[];
  disabled?: boolean;
  size: ControlSize;
  onChange: (tags: string[]) => void;
}) {
  const { t } = useI18n();
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 min-h-9 rounded-md border bg-transparent px-3 py-1 text-sm',
        CONTROL_SIZE_BOX_GROW[size],
      )}
    >      {value.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
          {tag}
          {!disabled && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          )}
        </Badge>
      ))}
      {!disabled && (
        <input
          className="flex-1 min-w-16 bg-transparent outline-none placeholder:text-muted-foreground"
          value={input}
          placeholder={t('pactor.ruleConfig.tagPlaceholder')}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
        />
      )}
    </div>
  );
}
