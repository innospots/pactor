import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '../../../lib/utils.js';
import { Button } from '../../../ui/button.js';
import { Input } from '../../../ui/input.js';
import { Label } from '../../../ui/label.js';
import { Textarea } from '../../../ui/textarea.js';
import {
  CONTROL_SIZE_BOX,
  CONTROL_SIZE_BOX_GROW,
  type ControlSize,
} from '../../control-size.js';
import {
  conditionToStatement,
  defaultFieldConditionValue,
  FieldCondition,
  statementToCondition,
  type ConditionFieldOption,
  type FieldConditionValue,
} from '../FieldCondition/index.js';
import { SearchableSelect } from '../SearchableSelect/index.js';

// ─── 文案缺省值（原 next-intl Common 命名空间文案的中文默认值） ──────────────────

const TEXT = {
  /** 头部进入编辑态的按钮文案 */
  edit: '编辑',
  cancel: '取消',
  confirm: '确定',
  /** validation 未配置 message 时的兜底提示 */
  invalidFormat: '输入格式不正确',
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * valueMapping 条目：描述模板中一个 ${key} / {{key}} 占位符的取值方式，
 * 结构与表单项（FormFieldDefinition）一致。
 */
export interface ExpressionMappingItem {
  name?: string | null;
  label?: string | null;
  /**
   * 控件类型："select" 下拉框、"number" 数值输入、"fieldCondition" 条件组编辑器，
   * 其他值（input、nodeType、edgeType 等）回退为文本输入框
   */
  type?: string | null;
  required?: boolean | null;
  placeholder?: string | null;
  /** select 的内联候选 */
  options?: Array<{ label: string; value: string }> | null;
  /**
   * select 的候选来源：匹配页面 optionSource 中的同名条目，
   * 支持静态 { options }；远程 { request, valueField, labelField } 条目
   * 在本移植版中不支持（无 fetchApi 通道），按空候选处理。
   */
  optionSource?: string | null;
  /** 默认值 */
  default?: any;
  multiple?: boolean | null;
  /**
   * 校验规则（与 type 同级）：pattern 为正则字符串，message 为失败提示；
   * 与外层表单字段的 validation 同构，编辑态逐项校验，不通过则阻断提交
   */
  validation?: { pattern?: string | null; message?: string | null } | null;
}

export interface ExpressionEditorProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  /**
   * 表单值模板，如 "return ft.period(${a}, ${b})"。
   * 占位符支持 ${key} 与 {{key}} 两种写法；DSL props 内联书写时须用 {{key}}，
   * 因为 ${ 会被 DSL 表达式引擎提前求值（后端数据 / state 透传的模板不受此限）。
   */
  valueTemplate: string;
  /** 模板占位符到控件的映射，key 与模板中 ${key} / {{key}} 对应 */
  valueMapping?: Record<string, ExpressionMappingItem>;
  /**
   * 页面级 optionSource 集合，供 mapping 条目的 optionSource 匹配。
   * 仅静态 { options } 条目生效；远程 { request } 条目被忽略（按空候选渲染）。
   */
  optionSources?: Record<string, any>;
  /** 字段标签：渲染在头部左侧，右侧为「编辑」按钮 */
  label?: string | null;
  /** 必填标记（label 后显示 *） */
  required?: boolean;
  readonly?: boolean;
  /** 控件尺寸（默认 middle；编辑态子控件与表达式文本框统一按尺寸令牌渲染） */
  size?: ControlSize;
  /**
   * 只读展示模式：以「表单控件」形态展示（控件禁用、隐藏编辑/确定/取消按钮），
   * 供详情页等"只看不改"的场景复用同一套组件。
   */
  viewOnly?: boolean;
  className?: string;
  /**
   * 校验状态上报：编辑态存在未通过校验的草稿时为 true。
   * 模板子字段的校验无法由外层表单 rules 感知，外层需据此在提交前阻断。
   */
  onValidityChange?: (invalid: boolean) => void;
}

// ─── Pure helpers（导出供单测） ────────────────────────────────────────────────

/**
 * 取国际化文案：label / placeholder 在 DSL 中是 I18nObject（{zh-CN, en-US}）对象，
 * 直接把它交给 React 渲染会报 "Objects are not valid as a React child"，
 * 这里按当前语言取值，缺失时回退中文、英文，最后取任意一个值。
 * 本移植版无 i18n 运行时，locale 缺省按中文（zh）取值。
 */
export function resolveI18nText(value: any, locale?: string): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    const lang = (locale || "zh").toLowerCase();
    const candidates = lang.startsWith("zh")
      ? ["zh-CN", "zh_CN", "zh", "en-US", "en_US", "en"]
      : ["en-US", "en_US", "en", "zh-CN", "zh_CN", "zh"];
    for (const key of candidates) {
      if (value[key]) return String(value[key]);
    }
    const first = Object.values(value).find((v) => v);
    return first ? String(first) : "";
  }
  return String(value);
}

export type TemplateSegment =
  | { type: "text"; text: string }
  | { type: "field"; key: string; config: ExpressionMappingItem };

/**
 * 模板占位符：支持 `${key}` 与 `{{key}}` 两种写法。
 * 后端下发的既有模板数据用 `${key}`；DSL props 内联书写时用 `{{key}}`——
 * `${` 会被 DSL 表达式引擎提前求值（无转义机制），`{{` 不冲突。
 */
const PLACEHOLDER_RE = /\$\{(\w+)\}|\{\{(\w+)\}\}/g;

/**
 * 将模板按 ${key} / {{key}} 切分为文本/字段片段。
 * 未在 valueMapping 中定义的占位符保留为字面量文本片段。
 */
export function parseTemplateSegments(
  template: string,
  mapping?: Record<string, ExpressionMappingItem>,
): TemplateSegment[] {
  const segments: TemplateSegment[] = [];
  const re = new RegExp(PLACEHOLDER_RE.source, 'g');
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(template)) !== null) {
    const key = match[1] ?? match[2];
    const config = mapping?.[key];
    if (!config) continue; // 未 mapped 的占位符整体视为文本
    if (match.index > lastIndex) {
      segments.push({ type: "text", text: template.slice(lastIndex, match.index) });
    }
    segments.push({ type: "field", key, config });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < template.length) {
    segments.push({ type: "text", text: template.slice(lastIndex) });
  }
  return segments;
}

/** 按控件类型转换输入值：number → 数值（空串保持空串，非数值保留原串） */
export function coerceMappingValue(raw: any, type?: string | null): any {
  if (type !== "number") return raw ?? "";
  if (raw === "" || raw === undefined || raw === null) return "";
  const num = Number(raw);
  return Number.isFinite(num) ? num : raw;
}

/**
 * 用 values 填充模板：mapped 占位符替换为对应值（缺省为空串），
 * 未 mapped 的占位符保留字面量 ${key} / {{key}}。
 */
export function composeExpression(
  template: string,
  values: Record<string, any>,
  mapping?: Record<string, ExpressionMappingItem>,
): string {
  return template.replace(
    new RegExp(PLACEHOLDER_RE.source, 'g'),
    (raw, dollarKey, braceKey) => {
      const key = dollarKey ?? braceKey;
      return mapping?.[key] ? String(values[key] ?? "") : raw;
    },
  );
}

/** 从 mapping 的 default 构建初始 values（按类型转换） */
export function buildDefaultValues(
  mapping?: Record<string, ExpressionMappingItem>,
): Record<string, any> {
  const values: Record<string, any> = {};
  for (const [key, config] of Object.entries(mapping ?? {})) {
    values[key] = coerceMappingValue(config.default ?? "", config.type);
  }
  return values;
}

/**
 * 按 mapping 条目的 validation 校验单个值：
 * 显式配置 required 的条目留空即拦截（opt-in）；其余情况空值跳过，pattern 不匹配时返回提示文案，通过返回 null。
 */
export function validateMappingValue(
  value: any,
  config: ExpressionMappingItem,
  fallbackMessage: string,
): string | null {
  const isEmpty = value === "" || value === undefined || value === null;
  // 必填校验优先：模板子字段是整句 expression 的一部分，外层表单无法替它判空，需在此拦截
  if (config.required && isEmpty) {
    return config.validation?.message ?? fallbackMessage;
  }
  const pattern = config.validation?.pattern;
  if (!pattern) return null;
  if (isEmpty) return null;
  if (typeof value === "number" && Number.isNaN(value)) return null;
  return new RegExp(pattern).test(String(value))
    ? null
    : (config.validation?.message ?? fallbackMessage);
}

/** 估算文本宽度（ch）：CJK 字符按 2 计，其余按 1 计 */
export function textWidthCh(text: string): number {
  return [...text].reduce((n, ch) => n + (ch.charCodeAt(0) > 255 ? 2 : 1), 0);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 反向解析：将已组合好的表达式字符串按模板拆回各 mapping 值。
 * 文本片段按字面量匹配（含未 mapped 的字面量 ${key} / {{key}}），field 片段非贪婪捕获；
 * 不匹配模板时返回 null。
 */
export function parseExpressionValues(
  template: string,
  value: string,
  mapping?: Record<string, ExpressionMappingItem>,
): Record<string, any> | null {
  if (!value) return null;
  const segments = parseTemplateSegments(template, mapping);
  const keys: string[] = [];
  const pattern = segments
    .map((seg) => {
      if (seg.type === "text") return escapeRegExp(seg.text);
      keys.push(seg.key);
      return "(.*?)";
    })
    .join("");
  const match = value.match(new RegExp(`^${pattern}$`));
  if (!match) return null;
  const values: Record<string, any> = {};
  keys.forEach((key, i) => {
    values[key] = coerceMappingValue(match[i + 1], mapping?.[key]?.type);
  });
  return values;
}

/**
 * 解析 mapping 条目的 select 候选：
 * 内联 options 优先，其次 optionSource 同名条目的静态 options。
 * optionSource 为远程 request 条目时返回 null（本移植版无 fetchApi 通道，
 * 调用方按空候选渲染）。
 */
export function resolveMappingOptions(
  config: ExpressionMappingItem,
  optionSources?: Record<string, any>,
  locale?: string,
): Array<{ label: string; value: string }> | null {
  const raw = config.options?.length
    ? config.options
    : config.optionSource
      ? optionSources?.[config.optionSource]?.options
      : null;
  if (!raw?.length) return null;
  // 选项文案可能是 I18nObject（如经 props 等无类型载体透传，后端 i18n 序列化器不处理），
  // 渲染前统一按当前语言取值，避免 React 渲染对象报错
  return raw.map((opt: any) => ({
    ...opt,
    label: resolveI18nText(opt?.label, locale),
    value: opt?.value,
  }));
}

// ─── MappingSelect：select 控件 ────────────────────────────────────────────────

function MappingSelect({
  config,
  optionSources,
  value,
  onChange,
  disabled,
  size,
  fallbackLabel,
  className,
  viewOnly,
}: {
  config: ExpressionMappingItem;
  optionSources?: Record<string, any>;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  size: ControlSize;
  fallbackLabel: string;
  className?: string;
  /** 只读展示：候选缺失时用原值兜底展示，避免显示为 placeholder */
  viewOnly?: boolean;
}) {
  const options = resolveMappingOptions(config, optionSources) ?? [];
  // 只读展示且当前值不在候选中（如 optionSource 为远程条目、候选为空）时，
  // 把原值作为单项兜底，否则 SearchableSelect 会退回 placeholder，看不到真实取值
  const displayOptions = useMemo(() => {
    if (!viewOnly || value === undefined || value === null || value === "") {
      return options;
    }
    return options.some((opt) => String(opt.value) === String(value))
      ? options
      : [...options, { label: String(value), value: String(value) }];
  }, [options, value, viewOnly]);

  return (
    <SearchableSelect
      value={value === "" ? undefined : value}
      onChange={(v) => onChange(v as string)}
      options={displayOptions}
      placeholder={fallbackLabel}
      disabled={disabled}
      size={size}
      // 选项列表限制最大高度并始终展示滚动条；超过 10 条时启用搜索
      showSearch={options.length > 10}
      fullOptionText
      listClassName="max-h-60 overflow-y-scroll"
      className={className}
    />
  );
}

// ─── MappingFieldCondition：fieldCondition 类型控件，输出表达式字符串 ─────────────

/**
 * 解析 mapping 条目的候选字段：内联 options 优先，其次 optionSource 同名条目的静态 options。
 * 远程 { request, valueField, labelField } 条目在本移植版中不支持（无 fetchApi 通道），
 * 按空候选渲染。
 */
function useMappingFieldOptions(
  config: ExpressionMappingItem,
  optionSources?: Record<string, any>,
): { fields: ConditionFieldOption[]; loading: boolean } {
  const entry = config.optionSource
    ? optionSources?.[config.optionSource]
    : null;

  return useMemo(() => {
    const opts: any[] = config.options?.length
      ? config.options
      : (entry?.options ?? []);
    return {
      loading: false,
      fields: opts.map((o: any) => ({
        featureCode: o.value,
        featureName: o.label,
        fieldType: o.fieldType,
      })) as ConditionFieldOption[],
    };
  }, [entry, config.options]);
}

/**
 * fieldCondition 类型的 mapping 控件：渲染条件组编辑器，
 * 变更时把条件对象转成表达式字符串写入模板占位符。
 * 已有字符串值经 statementToCondition 反向解析回填；
 * 无法解析时保持空条件组，不触碰该控件则草稿保留原字符串。
 */
function MappingFieldCondition({
  config,
  optionSources,
  value,
  onChange,
  disabled,
  size,
}: {
  config: ExpressionMappingItem;
  optionSources?: Record<string, any>;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  size: ControlSize;
}) {
  const { fields } = useMappingFieldOptions(config, optionSources);
  const [condition, setCondition] = useState<FieldConditionValue>(
    () =>
      (value ? statementToCondition(value, fields) : null) ??
      defaultFieldConditionValue(),
  );
  // 用户编辑后不再被外部值覆盖
  const touchedRef = useRef(false);

  // 外部字符串值变化时（尚未编辑）重新解析回填
  useEffect(() => {
    if (touchedRef.current || !value) return;
    const parsed = statementToCondition(value, fields);
    if (parsed) setCondition(parsed);
  }, [fields, value]);

  return (
    <FieldCondition
      value={condition}
      fields={fields}
      disabled={disabled}
      size={size}
      onChange={(next) => {
        touchedRef.current = true;
        setCondition(next);
        onChange(conditionToStatement(next));
      }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ExpressionEditor({
  id,
  value,
  onChange,
  valueTemplate,
  valueMapping,
  optionSources,
  label,
  required,
  readonly,
  viewOnly,
  size = 'middle',
  className,
  onValidityChange,
}: ExpressionEditorProps) {
  // label / placeholder 在 DSL 中是 I18nObject，渲染前统一按语言取值（缺省中文）
  const labelOf = (seg: { key: string; config: ExpressionMappingItem }) =>
    resolveI18nText(seg.config.label) || seg.key;
  const hintOf = (seg: { key: string; config: ExpressionMappingItem }) =>
    resolveI18nText(seg.config.placeholder) || labelOf(seg);
  const segments = useMemo(
    () => parseTemplateSegments(valueTemplate, valueMapping),
    [valueTemplate, valueMapping],
  );
  // 编辑态表单项：按模板中 ${} 出现顺序，同 key 去重
  const fieldSegments = useMemo(() => {
    const seen = new Set<string>();
    return segments.filter((seg): seg is Extract<TemplateSegment, { type: "field" }> => {
      if (seg.type !== "field" || seen.has(seg.key)) return false;
      seen.add(seg.key);
      return true;
    });
  }, [segments]);

  const [values, setValues] = useState<Record<string, any>>(
    () =>
      // 外部已有值（编辑回显/AI 填充）时优先反向解析回控件
      (value ? parseExpressionValues(valueTemplate, value, valueMapping) : null) ??
      buildDefaultValues(valueMapping),
  );
  const composed = composeExpression(valueTemplate, values, valueMapping);
  // 两步编辑：display 为可直接编辑的表达式文本框；edit 显示表单（草稿态，确定才提交）
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, any>>(values);
  // 编辑态逐项 validation 校验的失败提示（key → message）
  const [draftErrors, setDraftErrors] = useState<Record<string, string>>({});
  // display 文本框内容（表达式原文，可与 values 组合值不一致：用户输入未解析完成时）
  const [text, setText] = useState(composed);
  // 只读展示模式直接展示解析结果（values），编辑态展示草稿
  const formValues = viewOnly ? values : draft;
  // 记录组件自身 emit 的值，避免受控回写时被外部同步 effect 覆盖
  const lastEmittedRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const onValidityChangeRef = useRef(onValidityChange);
  onValidityChangeRef.current = onValidityChange;

  // 编辑态存在未通过校验的草稿时上报 invalid，供外层表单在提交前阻断
  useEffect(() => {
    onValidityChangeRef.current?.(editing && Object.keys(draftErrors).length > 0);
  }, [editing, draftErrors]);

  // 挂载时若组合值与外部值不一致则 emit 一次（未触碰也提交默认值）；
  // 外部值可解析回控件时组合值恒等于外部值，不会 emit
  useEffect(() => {
    // 只读展示模式：不回写外部表单
    if (viewOnly) return;
    const initial = composeExpression(valueTemplate, values, valueMapping);
    if (initial !== (value ?? "")) {
      lastEmittedRef.current = initial;
      onChangeRef.current?.(initial);
    }
    // 仅挂载时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 外部值变化（如 AI 填充）时反向解析到控件；解析失败保持现状不覆盖
  useEffect(() => {
    if (!value) return;
    const composed = composeExpression(valueTemplate, valuesRef.current, valueMapping);
    if (value === composed) return;
    const parsed = parseExpressionValues(valueTemplate, value, valueMapping);
    if (parsed) setValues(parsed);
  }, [value, valueTemplate, valueMapping]);

  // 外部值被重置为空（如表单 reset）时回退到默认值
  useEffect(() => {
    if (value !== undefined && value !== "") return;
    const defaults = buildDefaultValues(valueMapping);
    setValues((prev) => {
      const same = Object.keys(defaults).every((k) => prev[k] === defaults[k]);
      return same ? prev : defaults;
    });
  }, [value, valueMapping]);

  // 外部值同步到 display 文本框：自身 emit 的受控回环跳过；
  // 空值（重置）时展示默认组合值，与回退后的 values 保持一致
  useEffect(() => {
    if (value === undefined || value === lastEmittedRef.current) return;
    setText(value === "" ? composed : value);
  }, [value, composed]);

  const enterEdit = () => {
    setDraft(valuesRef.current);
    setDraftErrors({});
    setEditing(true);
  };

  // 确定：逐项 validation 校验草稿，任一不通过则阻断提交；通过则 emit 组合值并切回 display
  const handleConfirm = () => {
    const nextErrors: Record<string, string> = {};
    for (const seg of fieldSegments) {
      const message = validateMappingValue(draft[seg.key], seg.config, TEXT.invalidFormat);
      if (message) nextErrors[seg.key] = message;
    }
    setDraftErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const next = composeExpression(valueTemplate, draft, valueMapping);
    setValues(draft);
    lastEmittedRef.current = next;
    setText(next);
    onChangeRef.current?.(next);
    setEditing(false);
  };

  // 取消：丢弃草稿，切回 display 文本框
  const handleCancel = () => {
    setDraftErrors({});
    setEditing(false);
  };

  // display 文本框直接编辑：实时 emit 原文；可按模板反向解析时
  // 同步映射回 values，点击「编辑」时表单控件即显示解析后的值
  const handleTextChange = (raw: string) => {
    setText(raw);
    lastEmittedRef.current = raw;
    const parsed = parseExpressionValues(valueTemplate, raw, valueMapping);
    if (parsed) setValues(parsed);
    onChangeRef.current?.(raw);
  };

  const handleDraftChange = (key: string, raw: any) => {
    const config = valueMapping?.[key];
    const next = coerceMappingValue(raw, config?.type);
    setDraft((prev) => ({
      ...prev,
      [key]: next,
    }));
    // 输入时即时校验（与外层表单 mode onChange 行为一致）
    if (config?.validation?.pattern) {
      const message = validateMappingValue(next, config, TEXT.invalidFormat);
      setDraftErrors((prev) => {
        if (!message && !prev[key]) return prev;
        const updated = { ...prev };
        if (message) updated[key] = message;
        else delete updated[key];
        return updated;
      });
    }
  };

  if (!valueTemplate) return null;

  return (
    <div id={id} className={cn("w-full space-y-2", className)}>
      {!viewOnly && (
        <div className="flex items-center justify-between">
          {label ? (
            <Label>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          ) : (
            <span />
          )}
          {!readonly && !editing && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={enterEdit}
            >
              {TEXT.edit}
            </Button>
          )}
        </div>
      )}

      {editing || viewOnly ? (
        <div className="flex flex-col gap-3 rounded-md border bg-background px-3 py-3">
          {fieldSegments.map((seg) =>
            seg.config.type === "fieldCondition" ? (
              // fieldCondition：label 在上，组件在下（块级布局）
              <div key={seg.key} className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground">
                  {labelOf(seg)}
                </span>
                <MappingFieldCondition
                  config={seg.config}
                  optionSources={optionSources}
                  disabled={viewOnly}
                  size={size}
                  value={
                    formValues[seg.key] === "" ||
                    formValues[seg.key] === undefined
                      ? undefined
                      : String(formValues[seg.key])
                  }
                  onChange={(v) => handleDraftChange(seg.key, v)}
                />
                {draftErrors[seg.key] && (
                  <p className="text-xs text-destructive">
                    {draftErrors[seg.key]}
                  </p>
                )}
              </div>
            ) : (
            <div key={seg.key} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm text-muted-foreground truncate">
                {labelOf(seg)}
              </span>
              <div className="flex-1">
                {seg.config.type === "select" ? (
                  <MappingSelect
                    config={seg.config}
                    optionSources={optionSources}
                    disabled={viewOnly}
                    viewOnly={viewOnly}
                    size={size}
                    value={
                      formValues[seg.key] === ""
                        ? undefined
                        : String(formValues[seg.key])
                    }
                    onChange={(v) => handleDraftChange(seg.key, v)}
                    fallbackLabel={hintOf(seg)}
                  />
                ) : (
                  <Input
                    type={seg.config.type === "number" ? "number" : "text"}
                    value={formValues[seg.key] ?? ""}
                    onChange={(e) => handleDraftChange(seg.key, e.target.value)}
                    disabled={viewOnly}
                    placeholder={hintOf(seg)}
                    aria-label={labelOf(seg)}
                    className={cn(CONTROL_SIZE_BOX[size], "w-full font-mono")}
                  />
                )}
                {draftErrors[seg.key] && (
                  <p className="mt-1 text-xs text-destructive">
                    {draftErrors[seg.key]}
                  </p>
                )}
              </div>
            </div>
          ))}
          {!viewOnly && (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                {TEXT.cancel}
              </Button>
              <Button type="button" size="sm" onClick={handleConfirm}>
                {TEXT.confirm}
              </Button>
            </div>
          )}
        </div>
      ) : (
        // display：可直接编辑的表达式文本框；内容实时 emit，
        // 能按模板解析时会映射回「编辑」表单的控件
        <Textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          readOnly={readonly}
          rows={1}
          className={cn(
            CONTROL_SIZE_BOX_GROW[size],
            "w-full resize-none break-all bg-muted/30 font-mono [field-sizing:content]",
          )}
        />
      )}
    </div>
  );
}
