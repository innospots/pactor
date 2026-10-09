import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '../../../ui/badge.js';
import { Button } from '../../../ui/button.js';
import { Input } from '../../../ui/input.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select.js';

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
  value?: string | number | (string | number)[];
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

/** 操作符展示文案（内置中文默认文案，缺省回退为操作符原值） */
const OPERATOR_LABELS: Record<string, string> = {
  GREATER: '大于',
  GREATER_EQUAL: '大于等于',
  LESS_EQUAL: '小于等于',
  LESS: '小于',
  EQUAL: '等于',
  IN: '包含',
  NOT_IN: '不包含',
  UNEQUAL: '不等于',
  LIKE: '类似',
  NULL: '为空',
  HASVAL: '有值',
  NOTNULL: '不为空',
  BETWEEN: '范围',
};

function operatorLabel(operator: string): string {
  return OPERATOR_LABELS[operator] ?? operator;
}

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
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RuleConfig({ value, onChange, disabled }: RuleConfigProps) {
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

  // 权重输入框用本地文本态：输入过程中允许清空重输（不回弹默认值），
  // 失焦时若为空/非法再回退默认值 1 并提交
  const [scoreText, setScoreText] = useState(String(initScore));
  const lastScoreRef = useRef(value?.score);

  // 外部值变化（表单 reset / 回显）时同步到输入框；自身提交的受控回环跳过
  useEffect(() => {
    if (value?.score === lastScoreRef.current) return;
    lastScoreRef.current = value?.score;
    setScoreText(value?.score == null ? '' : String(value.score));
  }, [value?.score]);

  const commitScore = useCallback(
    (score: number) => {
      lastScoreRef.current = score;
      onChange?.({ score, ruleConditions: conditions });
    },
    [onChange, conditions],
  );

  // 权重取值约束：1-1000 的整数
  const normalizeScore = (n: number) =>
    Math.min(1000, Math.max(1, Math.round(n)));

  const handleScoreTextChange = (text: string) => {
    setScoreText(text);
    if (text === '') return; // 允许清空，失焦时再补默认值
    const n = Number(text);
    if (Number.isFinite(n) && n >= 1 && n <= 1000 && Number.isInteger(n)) {
      commitScore(n);
    }
  };

  const handleScoreBlur = () => {
    const n = scoreText.trim() === '' ? NaN : Number(scoreText);
    const next = Number.isFinite(n) ? normalizeScore(n) : 1;
    setScoreText(String(next));
    if (next !== lastScoreRef.current) commitScore(next);
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
          <span className="text-muted-foreground">权重</span>
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
              评分: {condition.score ?? '-'}
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
        <span className="text-sm shrink-0">权重</span>
        <Input
          type="number"
          className="w-48"
          min={1}
          max={1000}
          step={1}
          value={scoreText}
          disabled={disabled}
          placeholder="请输入权重"
          onChange={(e) => handleScoreTextChange(e.target.value)}
          onBlur={handleScoreBlur}
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
          className="h-auto p-0 text-sm"
          onClick={handleAdd}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          添加条件
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
  onOptChange,
  onValueChange,
  onScoreChange,
  onDelete,
}: ConditionRowProps) {
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
        <SelectTrigger className="w-36 shrink-0">
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
            onChange={onValueChange}
          />
        </div>
      )}

      {/* Score input */}
      <Input
        type="number"
        className={
          'w-24 shrink-0' + (missingScore ? ' border-destructive' : '')
        }
        placeholder="评分"
        value={score ?? ''}
        disabled={disabled}
        aria-invalid={missingScore || undefined}
        onChange={(e) =>
          onScoreChange(
            e.target.value === '' ? undefined : e.target.valueAsNumber,
          )
        }
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
            missingValue ? '请填写取值' : null,
            missingScore ? '请填写评分' : null,
          ]
            .filter(Boolean)
            .join('；')}
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
  onChange: (val: Condition['value']) => void;
}

function ValueInput({ opt, value, disabled, onChange }: ValueInputProps) {
  if (NO_VALUE_OPT.includes(opt)) {
    return null;
  }

  if (opt === 'BETWEEN') {
    // 后端值为逗号字符串（"3,5"）、导入通道为数组，统一归一化后展示
    const [v1, v2] = normalizeBetweenValue(value);
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          className="flex-1"
          value={v1 ?? ''}
          disabled={disabled}
          onChange={(e) => onChange([e.target.valueAsNumber, v2 as number])}
        />
        <span className="text-muted-foreground text-sm shrink-0">~</span>
        <Input
          type="number"
          className="flex-1"
          value={v2 ?? ''}
          disabled={disabled}
          onChange={(e) => onChange([v1 as number, e.target.valueAsNumber])}
        />
      </div>
    );
  }

  if (MULTI_VALUE_OPT.includes(opt)) {
    return (
      <TagInput
        value={(value as string[]) ?? []}
        disabled={disabled}
        onChange={(tags) => onChange(tags)}
      />
    );
  }

  if (NUMERIC_OPT.includes(opt)) {
    return (
      <Input
        type="number"
        value={(value as number) ?? ''}
        disabled={disabled}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    );
  }

  return (
    <Input
      type="text"
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
  onChange,
}: {
  value: string[];
  disabled?: boolean;
  onChange: (tags: string[]) => void;
}) {
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
    <div className="flex flex-wrap items-center gap-1 min-h-9 rounded-md border bg-transparent px-3 py-1 text-sm">
      {value.map((tag) => (
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
          placeholder="输入后按 Enter"
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
