import { Plus, X } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { cn } from '../../../lib/utils.js';
import { Button } from '../../../ui/button.js';
import { Input } from '../../../ui/input.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select.js';
import { SearchableSelect } from '../SearchableSelect/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

/** 候选字段（datasource.json 结构） */
export interface ConditionFieldOption {
  featureCode: string;
  featureName: string;
  /** DATE | STRING | NUMBER | BOOLEAN */
  fieldType: string;
  recommended?: boolean;
}

export interface FieldConditionItem {
  field: { value?: string; label?: string; dataType?: string };
  term: { value?: string; label?: string };
  value?: any;
}

export interface FieldConditionGroup {
  relation: 'AND' | 'OR';
  children: FieldConditionItem[];
}

export interface FieldConditionValue {
  relation: 'AND' | 'OR';
  children: FieldConditionGroup[];
}

export interface FieldConditionProps {
  value?: FieldConditionValue;
  onChange?: (value: FieldConditionValue) => void;
  /** 候选字段（datasource.json 结构） */
  fields?: ConditionFieldOption[];
  disabled?: boolean;
}

// ─── Operators（移植自参考项目 OPERATORS，裁剪到 DATE/STRING/NUMBER/BOOLEAN） ────

interface OperatorDef {
  value: string;
  /** 适用的 fieldType；"ALL" 表示全部 */
  valueTypes: string[] | 'ALL';
}

const OPERATORS: OperatorDef[] = [
  { value: 'EQUAL', valueTypes: ['NUMBER', 'STRING', 'DATE'] },
  { value: 'GREATER', valueTypes: ['NUMBER', 'DATE'] },
  { value: 'GREATER_EQUAL', valueTypes: ['NUMBER', 'DATE'] },
  { value: 'LESS', valueTypes: ['NUMBER', 'DATE'] },
  { value: 'LESS_EQUAL', valueTypes: ['NUMBER', 'DATE'] },
  { value: 'UNEQUAL', valueTypes: ['NUMBER', 'STRING', 'DATE'] },
  { value: 'BETWEEN', valueTypes: ['NUMBER', 'DATE'] },
  { value: 'HASVAL', valueTypes: 'ALL' },
  { value: 'NOHASVAL', valueTypes: 'ALL' },
  { value: 'TRUE', valueTypes: ['BOOLEAN'] },
  { value: 'FALSE', valueTypes: ['BOOLEAN'] },
  { value: 'IN', valueTypes: ['NUMBER', 'STRING'] },
  { value: 'NOT_IN', valueTypes: ['NUMBER', 'STRING'] },
];

/** 不需要值输入的操作符 */
const NO_VALUE_OPERATORS = ['HASVAL', 'NOHASVAL', 'TRUE', 'FALSE'];

/** 操作符展示文案（内置中文默认文案，缺省回退为操作符原值） */
const OPERATOR_LABELS: Record<string, string> = {
  EQUAL: '等于',
  GREATER: '大于',
  GREATER_EQUAL: '大于等于',
  LESS: '小于',
  LESS_EQUAL: '小于等于',
  UNEQUAL: '不等于',
  BETWEEN: '范围',
  HASVAL: '有值',
  NOHASVAL: '无值',
  TRUE: '为真',
  FALSE: '为假',
  IN: '包含',
  NOT_IN: '不包含',
};

function operatorLabel(operator: string): string {
  return OPERATOR_LABELS[operator] ?? operator;
}

/** 按字段类型获取可用操作符 */
export function getOperatorsByFieldType(fieldType?: string): OperatorDef[] {
  return OPERATORS.filter(
    (op) =>
      !fieldType || op.valueTypes === 'ALL' || op.valueTypes.includes(fieldType),
  );
}

/** 操作符是否需要值输入 */
export function isNoValueOperator(operator?: string): boolean {
  return !!operator && NO_VALUE_OPERATORS.includes(operator);
}

// ─── 条件对象 → 表达式字符串（移植参考项目 statement 模板） ─────────────────────

const OPERATOR_STATEMENTS: Record<string, string> = {
  EQUAL: '${field} == ${value}',
  GREATER: '${field} > ${value}',
  GREATER_EQUAL: '${field} >= ${value}',
  LESS: '${field} < ${value}',
  LESS_EQUAL: '${field} <= ${value}',
  UNEQUAL: '${field} != ${value}',
  BETWEEN: '${field} BETWEEN ${v1} AND ${v2}',
  HASVAL: '${field} HASVAL',
  NOHASVAL: '${field} NOHASVAL',
  TRUE: '${field} == TRUE',
  FALSE: '${field} == FALSE',
  IN: '${field} IN (${value})',
  NOT_IN: '${field} NOT IN (${value})',
};

/** 值格式化：STRING 加单引号；IN/NOT_IN 逗号拆分逐项格式化 */
function formatConditionValue(item: FieldConditionItem): string {
  const isString = item.field.dataType === 'STRING';
  const quote = (v: any) => (isString ? `'${v}'` : String(v));
  if (item.term.value === 'IN' || item.term.value === 'NOT_IN') {
    return String(item.value ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map(quote)
      .join(', ');
  }
  return quote(item.value ?? '');
}

/** 单条条件 → 表达式片段；字段或操作符缺失时返回 null */
export function itemToStatement(item: FieldConditionItem): string | null {
  const fieldCode = item.field?.value;
  const termValue = item.term?.value;
  const statement = termValue ? OPERATOR_STATEMENTS[termValue] : undefined;
  if (!fieldCode || !statement) return null;

  if (termValue === 'BETWEEN') {
    const arr: any[] = Array.isArray(item.value) ? item.value : [];
    const isString = item.field.dataType === 'STRING';
    const quote = (v: any) => (isString ? `'${v ?? ''}'` : String(v ?? ''));
    return statement
      .replace('${field}', fieldCode)
      .replace('${v1}', quote(arr[0]))
      .replace('${v2}', quote(arr[1]));
  }

  let result = statement.replace('${field}', fieldCode);
  if (!isNoValueOperator(termValue)) {
    result = result.replace('${value}', formatConditionValue(item));
  }
  return result;
}

/**
 * 条件树 → 表达式字符串：组内按组 relation 连接，组间按根 relation 连接；
 * 组内多于一条条件时加括号。无条件时返回空串。
 */
export function conditionToStatement(value?: FieldConditionValue): string {
  if (!value?.children?.length) return '';
  const groupParts = value.children
    .map((group) => {
      const joiner = group.relation === 'AND' ? ' && ' : ' || ';
      const parts = group.children
        .map(itemToStatement)
        .filter((s): s is string => !!s);
      if (!parts.length) return '';
      const joined = parts.join(joiner);
      return parts.length > 1 ? `(${joined})` : joined;
    })
    .filter(Boolean);
  return groupParts.join(value.relation === 'AND' ? ' && ' : ' || ');
}

// ─── 表达式字符串 → 条件对象（conditionToStatement 的逆解析） ─────────────────────

/** 按顶层连接符拆分（忽略括号与引号内的部分），joiner 为 "||" 或 "&&" */
function splitByJoiner(expr: string, joiner: '||' | '&&'): string[] {
  const parts: string[] = [];
  const token = ` ${joiner} `;
  let depth = 0;
  let quote: string | null = null;
  let current = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth === 0 && expr.startsWith(token, i)) {
      parts.push(current);
      current = '';
      i += token.length - 1;
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts.map((s) => s.trim()).filter(Boolean);
}

/** 字符串是否被一对包裹整体的外层括号包住 */
function isWrappedByOuterParens(s: string): boolean {
  if (!s.startsWith('(') || !s.endsWith(')')) return false;
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }
    if (ch === '(') depth++;
    if (ch === ')') {
      depth--;
      if (depth === 0 && i < s.length - 1) return false;
    }
  }
  return depth === 0;
}

function unquote(v: string): string {
  const t = v.trim();
  if (
    t.length >= 2 &&
    ((t.startsWith("'") && t.endsWith("'")) ||
      (t.startsWith('"') && t.endsWith('"')))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

const COMPARE_OPERATOR_MAP: Record<string, string> = {
  '==': 'EQUAL',
  '!=': 'UNEQUAL',
  '>': 'GREATER',
  '>=': 'GREATER_EQUAL',
  '<': 'LESS',
  '<=': 'LESS_EQUAL',
};

/** 解析单条条件片段，无法识别时返回 null */
function parseAtom(
  atom: string,
  fields?: ConditionFieldOption[],
): FieldConditionItem | null {
  const s = atom.trim();
  if (!s) return null;
  const fieldInfo = (code: string) => {
    const f = fields?.find((x) => x.featureCode === code);
    return { value: code, label: f?.featureName, dataType: f?.fieldType };
  };

  // BETWEEN：x BETWEEN v1 AND v2
  let m = s.match(/^([\w.]+)\s+BETWEEN\s+(.+?)\s+AND\s+(.+)$/i);
  if (m) {
    return {
      field: fieldInfo(m[1]),
      term: { value: 'BETWEEN' },
      value: [unquote(m[2]), unquote(m[3])],
    };
  }

  // IN / NOT IN：x IN (v1, v2)
  m = s.match(/^([\w.]+)\s+(NOT\s+IN|IN)\s*\((.*)\)\s*$/i);
  if (m) {
    const vals = m[3]
      .split(',')
      .map((v) => unquote(v))
      .filter((v) => v !== '');
    return {
      field: fieldInfo(m[1]),
      term: { value: m[2].toUpperCase().replace(/\s+/g, '_') },
      value: vals.join(', '),
    };
  }

  // 比较：x == v / x != v / x > v ...
  m = s.match(/^([\w.]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
  if (m) {
    const raw = m[3].trim();
    const val = unquote(raw);
    // 布尔字面量：x == TRUE / x == FALSE → TRUE/FALSE 操作符（无值）
    if (m[2] === '==' && raw === val && (val === 'TRUE' || val === 'FALSE')) {
      return { field: fieldInfo(m[1]), term: { value: val }, value: undefined };
    }
    return {
      field: fieldInfo(m[1]),
      term: { value: COMPARE_OPERATOR_MAP[m[2]] },
      value: val,
    };
  }

  // 无值：x HASVAL / x NOHASVAL
  m = s.match(/^([\w.]+)\s+(HASVAL|NOHASVAL)\s*$/i);
  if (m) {
    return {
      field: fieldInfo(m[1]),
      term: { value: m[2].toUpperCase() },
      value: undefined,
    };
  }

  return null;
}

/**
 * 表达式字符串 → 条件对象（conditionToStatement 的逆解析）。
 * 单层结构：只产出一个分组——顶层 || 连接的单条条件组成 OR 组，
 * 其余按 && 拆分组成 AND 组（支持生成器格式的外层括号）。
 * 支持简单 AI 生成格式（如 actionType == 'REGISTER'）。
 * fields 用于还原字段的 label 与 dataType（STRING 引号依赖 fieldType）。
 * 单层无法表示（如 (a && b) || c）或无法解析时返回 null。
 */
export function statementToCondition(
  statement: string,
  fields?: ConditionFieldOption[],
): FieldConditionValue | null {
  const trimmed = statement?.trim();
  if (!trimmed) return null;

  const stripOuterParens = (s: string) => {
    const t = s.trim();
    return isWrappedByOuterParens(t) ? t.slice(1, -1).trim() : t;
  };
  const toGroup = (
    relation: 'AND' | 'OR',
    parts: string[],
  ): FieldConditionValue | null => {
    // 单层结构：每个片段都必须是单条条件，仍含顶层连接符则无法表示
    if (
      parts.some(
        (s) =>
          splitByJoiner(s, '&&').length > 1 || splitByJoiner(s, '||').length > 1,
      )
    ) {
      return null;
    }
    const items = parts.map((s) => parseAtom(s, fields));
    if (items.length === 0 || items.some((it) => !it)) return null;
    return {
      relation,
      children: [{ relation, children: items as FieldConditionItem[] }],
    };
  };

  // 顶层 ||：每条都必须是单条条件，组成单个 OR 组
  const orParts = splitByJoiner(trimmed, '||');
  if (orParts.length > 1) {
    return toGroup('OR', orParts.map(stripOuterParens));
  }

  // 单组：去掉外层括号后，优先 ||（生成器格式的 OR 组），否则 &&
  const inner = stripOuterParens(trimmed);
  const innerOr = splitByJoiner(inner, '||');
  if (innerOr.length > 1) return toGroup('OR', innerOr);
  return toGroup('AND', splitByJoiner(inner, '&&'));
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultItem = (): FieldConditionItem => ({ field: {}, term: {} });

const defaultGroup = (): FieldConditionGroup => ({
  relation: 'AND',
  children: [defaultItem()],
});

export function defaultFieldConditionValue(): FieldConditionValue {
  return { relation: 'OR', children: [defaultGroup()] };
}

const toggleRelation = (r: 'AND' | 'OR') => (r === 'AND' ? 'OR' : 'AND');

// ─── Component ────────────────────────────────────────────────────────────────

export function FieldCondition({
  value,
  onChange,
  fields = [],
  disabled,
}: FieldConditionProps) {
  const data: FieldConditionValue = useMemo(
    () =>
      value?.children?.length
        ? value
        : defaultFieldConditionValue(),
    [value],
  );
  // 单层结构：只渲染第一个分组
  const group = data.children[0];

  const updateGroup = useCallback(
    (nextGroup: FieldConditionGroup) =>
      onChange?.({ ...data, children: [nextGroup] }),
    [data, onChange],
  );

  const updateItem = (itemIndex: number, patch: Partial<FieldConditionItem>) => {
    updateGroup({
      ...group,
      children: group.children.map((item, ii) =>
        ii === itemIndex ? { ...item, ...patch } : item,
      ),
    });
  };

  const fieldOptions = fields.map((f) => ({
    value: f.featureCode,
    label: f.featureName,
  }));

  return (
    <div className="w-full">
      <div className="flex gap-2">
        {/* relation 切换（垂直居中于条件行区域，不含「添加条件」按钮） */}
        <RelationButton
          relation={group.relation}
          visible={group.children.length > 1}
          disabled={disabled}
          onToggle={() =>
            updateGroup({ ...group, relation: toggleRelation(group.relation) })
          }
        />

        <div className="flex-1 space-y-2">
          {group.children.map((item, itemIndex) => (
            <ConditionRow
              key={itemIndex}
              item={item}
              fields={fieldOptions}
              rawFields={fields}
              disabled={disabled}
              fieldPlaceholder="选择字段"
              operatorLabel={operatorLabel}
              inputPlaceholder="请输入值"
              showDelete={group.children.length > 1}
              onChange={(patch) => updateItem(itemIndex, patch)}
              onDelete={() =>
                updateGroup({
                  ...group,
                  children: group.children.filter((_, ii) => ii !== itemIndex),
                })
              }
            />
          ))}
        </div>
      </div>

      {!disabled && (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto p-0 ml-10 mt-1 text-sm"
          onClick={() =>
            updateGroup({ ...group, children: [...group.children, defaultItem()] })
          }
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          添加条件
        </Button>
      )}
    </div>
  );
}

// ─── Relation toggle ──────────────────────────────────────────────────────────

function RelationButton({
  relation,
  visible = true,
  disabled,
  onToggle,
}: {
  relation: 'AND' | 'OR';
  visible?: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  if (!visible) return <div className="w-8 shrink-0" />;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'w-8 shrink-0 self-center rounded px-1 py-0.5 text-xs font-medium',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        // 语义色走皮肤令牌（AND=信息蓝 / OR=警示橙），随宿主主题明暗自适应
        relation === 'AND'
          ? 'bg-info/10 text-info'
          : 'bg-warning/10 text-warning',
      )}
    >
      {relation === 'AND' ? '且' : '或'}
    </button>
  );
}

// ─── Single condition row ─────────────────────────────────────────────────────

interface ConditionRowProps {
  item: FieldConditionItem;
  fields: Array<{ label: string; value: string }>;
  rawFields: ConditionFieldOption[];
  disabled?: boolean;
  fieldPlaceholder: string;
  operatorLabel: (op: string) => string;
  inputPlaceholder: string;
  showDelete: boolean;
  onChange: (patch: Partial<FieldConditionItem>) => void;
  onDelete: () => void;
}

function ConditionRow({
  item,
  fields,
  rawFields,
  disabled,
  fieldPlaceholder,
  operatorLabel,
  inputPlaceholder,
  showDelete,
  onChange,
  onDelete,
}: ConditionRowProps) {
  const dataType = item.field.dataType;
  const termValue = item.term.value;
  const operators = getOperatorsByFieldType(dataType);

  return (
    <div className="flex items-center gap-2">
      {/* 字段选择 */}
      <SearchableSelect
        value={item.field.value || undefined}
        onChange={(v) => {
          const raw = rawFields.find((f) => f.featureCode === v);
          // 字段变更：重置操作符与值
          onChange({
            field: raw
              ? { value: raw.featureCode, label: raw.featureName, dataType: raw.fieldType }
              : { value: v as string },
            term: {},
            value: undefined,
          });
        }}
        options={fields}
        placeholder={fieldPlaceholder}
        disabled={disabled}
        fullOptionText
        className="w-36 h-8 min-h-8 px-2 text-xs"
      />

      {/* 操作符选择 */}
      <Select<string>
        items={operators.map((op) => ({
          value: op.value,
          label: operatorLabel(op.value),
        }))}
        value={termValue ?? null}
        disabled={disabled || !dataType}
        onValueChange={(v) => {
          // Base UI Select 清除时为 null；本控件不可清除，仅作类型收窄
          if (v == null) return;
          // 值语义变化（BETWEEN/无值）时重置 value
          const resetValue =
            v === 'BETWEEN' || isNoValueOperator(v) || isNoValueOperator(termValue);
          onChange({
            term: { value: v, label: operatorLabel(v) },
            value: resetValue ? undefined : item.value,
          });
        }}
      >
        <SelectTrigger className="w-24 h-8 shrink-0 text-xs">
          <SelectValue placeholder="请选择" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {operatorLabel(op.value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 值输入：按 fieldType + 操作符 */}
      {dataType && termValue && !isNoValueOperator(termValue) && (
        <ConditionValueInput
          dataType={dataType}
          termValue={termValue}
          value={item.value}
          disabled={disabled}
          placeholder={inputPlaceholder}
          onChange={(v) => onChange({ value: v })}
        />
      )}

      {/* 删除条件 */}
      {showDelete && !disabled && (
        <button
          type="button"
          aria-label="delete-condition"
          className="text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ─── Value input ──────────────────────────────────────────────────────────────

function ConditionValueInput({
  dataType,
  termValue,
  value,
  disabled,
  placeholder,
  onChange,
}: {
  dataType: string;
  termValue: string;
  value: any;
  disabled?: boolean;
  placeholder: string;
  onChange: (value: any) => void;
}) {
  const inputType = dataType === 'NUMBER' ? 'number' : dataType === 'DATE' ? 'date' : 'text';

  if (termValue === 'BETWEEN') {
    const arr: any[] = Array.isArray(value) ? value : [];
    return (
      <div className="flex items-center gap-1">
        <Input
          type={inputType}
          className="w-28 h-8 px-2 text-xs"
          value={arr[0] ?? ''}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="between-min"
          onChange={(e) => onChange([e.target.value, arr[1] ?? ''])}
        />
        <span className="text-xs text-muted-foreground">~</span>
        <Input
          type={inputType}
          className="w-28 h-8 px-2 text-xs"
          value={arr[1] ?? ''}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="between-max"
          onChange={(e) => onChange([arr[0] ?? '', e.target.value])}
        />
      </div>
    );
  }

  return (
    <Input
      type={inputType}
      className="w-36 h-8 px-2 text-xs"
      value={value ?? ''}
      disabled={disabled}
      placeholder={placeholder}
      aria-label="condition-value"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
