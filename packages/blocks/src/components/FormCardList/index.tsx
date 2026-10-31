import type { DslChildren } from '@pactor-app/core';
import { useI18n, useRenderer } from '@pactor-app/runtime';
import { Plus, Trash2 } from 'lucide-react';
import { useId, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../lib/utils.js';
import { Button } from '@pactor-app/ui/ui';
import { Input } from '@pactor-app/ui/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pactor-app/ui/ui';
import { Switch } from '@pactor-app/ui/ui';
import { Textarea } from '@pactor-app/ui/ui';
import { Card, Form } from '@pactor-app/ui/components';

// ─── Types ────────────────────────────────────────────────────────────────────

/** 表单项控件类型（fields 固定表单模式） */
export type FormCardListFieldType = 'input' | 'number' | 'textarea' | 'select' | 'switch';

/** 列表项表单字段定义（fields 模式：每个卡片内按序渲染） */
export interface FormCardListField {
  /** 字段名：读写列表项对象的该 key */
  name: string;
  /** 字段标签（缺省只渲染控件） */
  label?: string;
  /** 控件类型，默认 input */
  type?: FormCardListFieldType;
  /** 输入占位 */
  placeholder?: string;
  /** select 选项 */
  options?: Array<{ label: string; value: string | number | boolean }>;
}

/** 列表项数据（字段名 → 值；可携带额外业务字段原样保留） */
export type FormCardListItem = Record<string, unknown>;

/**
 * 列表项模板作用域（DSL children / itemBody 模板内可用）：
 * - `row`：当前列表项数据
 * - `rowIndex`：当前下标（从 0 开始）
 * - `updateItem(patch)`：纯函数，返回 patch 合并进当前项后的整份新数组，
 *   供子控件事件回写，如 `setState items: '${updateItem({ name: event })}'`
 */
export type FormCardListItemScope = {
  row: FormCardListItem;
  rowIndex: number;
  updateItem: (patch: FormCardListItem) => FormCardListItem[];
};

export interface FormCardListProps {
  /** 列表数据（受控） */
  value?: FormCardListItem[];
  /** 增/删/改后回调整份列表 */
  onChange?: (value: FormCardListItem[]) => void;
  /**
   * 列表项内容（三选一，优先级从高到低）：
   * 1. DSL children（节点 children，以 withScope 注册后作为 dslChildren 传入）
   * 2. itemBody：props 形式的 DSL 子树
   * 3. fields：固定表单字段定义（本 prop 下方的 fields 模式）
   * 模板逐项渲染，作用域见 FormCardListItemScope（${row.xxx} 读值）。
   * React 直用时也可用 renderItem。
   */
  itemBody?: DslChildren;
  /** React 直用的列表项渲染函数（DSL 场景请用 children / itemBody） */
  renderItem?: (item: FormCardListItem, index: number) => ReactNode;
  /** fields 模式：固定表单字段定义（未提供模板时生效） */
  fields?: FormCardListField[];
  /**
   * 列表项表单模式（仅模板模式生效）：每项模板包一层 ui Form——
   * Input / Select 等声明 name 自动成为表单项（label / rules 生效），
   * 模板内可用 Grid / Row / Col 等布局组件排布复杂表单；
   * 字段变更经 Form onValuesChange 自动合并回当前列表项（row 同步），
   * 声明 name 的字段无需再手写 updateItem 回写。
   */
  itemForm?: boolean;
  /** itemForm 模式的表单布局，默认 vertical */
  formLayout?: 'horizontal' | 'vertical' | 'inline';
  /**
   * itemForm 模式的表单名前缀：每项按 `${formName}-${index}` 注册，
   * 供 form.setValues 联动动作按名寻址；缺省自动生成（保证页面内唯一）。
   */
  formName?: string;
  /** 列表项唯一键字段（React key）；缺省按下标 */
  keyField?: string;
  /**
   * 序号文字模板，`{index}` 为从 1 开始的序号占位（如 '成员 {index}'）。
   * 缺省走 i18n pactor.formCardList.item（「第 {{index}} 项」/「Item {{index}}」）。
   * 注意用 {index} 而非 ${index}（避免与 DSL 表达式语法冲突）。
   */
  itemLabel?: string;
  /** 底部添加按钮文案（缺省 i18n pactor.formCardList.add） */
  addText?: string;
  /** 新增列表项的初始值（浅拷贝；缺省 {}） */
  defaultItem?: FormCardListItem;
  /** 最少列表项数（达到后隐藏删除按钮），默认 0 */
  minItems?: number;
  /** 最多列表项数（达到后隐藏添加按钮） */
  maxItems?: number;
  /** 禁用：隐藏增删入口，fields 模式控件只读（模板模式自行处理 disabled） */
  disabled?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** withScope 注入：原始 DSL children（列表项模板），不对外声明 */
  dslChildren?: DslChildren;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * FormCardList 表单卡片列表（区块组件）：每个列表项一张 Card，
 * 卡内第一行为序号（itemLabel 可自定义文字，{index} 占位）+ 右端删除按钮，
 * 其后为列表项内容——DSL children / itemBody 模板（逐项渲染，作用域
 * { row, rowIndex, updateItem }）或 fields 固定表单；底部「添加」按钮追加列表项。
 * value/onChange 受控：DSL 用 props.value + events.onChange 读写 ${event}。
 */
export function FormCardList({
  value,
  onChange,
  itemBody,
  renderItem,
  fields = [],
  itemForm,
  formLayout,
  formName,
  keyField,
  itemLabel,
  addText,
  defaultItem,
  minItems = 0,
  maxItems,
  disabled,
  className,
  style,
  dslChildren,
}: FormCardListProps) {
  const { t } = useI18n();
  // itemForm 模式每项 Form 名必须唯一（Registry 重名抛错）：
  // formName 前缀缺省时用 useId 兜底，保证同页多个 FormCardList 不冲突
  const formIdBase = useId().replace(/[^a-zA-Z0-9]/g, '');
  const items = value ?? [];
  const canDelete = !disabled && items.length > minItems;
  const canAdd = !disabled && (maxItems == null || items.length < maxItems);

  const resolveItemLabel = (index: number): string => {
    if (itemLabel != null) return itemLabel.replace(/\{index\}/g, String(index + 1));
    return t('pactor.formCardList.item', { index: index + 1 });
  };

  const keyOf = (item: FormCardListItem, index: number) => {
    const key = keyField ? item[keyField] : undefined;
    return key === undefined || key === null ? index : String(key);
  };

  const updateItem = (index: number, patch: FormCardListItem) => {
    onChange?.(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index: number) => {
    onChange?.(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange?.([...items, { ...(defaultItem ?? {}) }]);
  };

  /** 列表项模板作用域（updateItem 为纯函数：返回合并后的新数组，由 DSL setState 回写） */
  const itemScope = (item: FormCardListItem, index: number): FormCardListItemScope => ({
    row: item,
    rowIndex: index,
    updateItem: (patch) =>
      items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
  });

  const useTemplate = dslChildren != null || itemBody != null;

  return (
    <div data-slot="form-card-list" className={cn('flex flex-col gap-3', className)} style={style}>
      {items.map((item, index) => (
        <Card key={keyOf(item, index)} contentClassName="flex flex-col gap-3">
          {/* 第一行：序号 + 右端删除按钮 */}
          <div data-slot="form-card-list-item-header" className="flex items-center justify-between">
            <span className="text-sm font-medium">{resolveItemLabel(index)}</span>
            {canDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                aria-label="delete-item"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* 列表项内容：DSL 模板 > renderItem > fields 固定表单 */}
          {useTemplate ? (
            <DslItemBody
              template={(dslChildren ?? itemBody)!}
              scope={itemScope(item, index)}
              itemForm={itemForm}
              formLayout={formLayout}
              formName={`${formName ?? `form-card-list-${formIdBase}`}-${index}`}
              initialValues={item}
              onPatch={(patch) => updateItem(index, patch)}
            />
          ) : renderItem ? (
            renderItem(item, index)
          ) : (
            fields.map((field) => (
              <div key={field.name} data-slot="form-card-list-field" className="flex flex-col gap-1.5">
                {field.label != null && (
                  <span className="text-sm text-muted-foreground">{field.label}</span>
                )}
                <FieldControl
                  field={field}
                  value={item[field.name]}
                  disabled={disabled}
                  onChange={(v) => updateItem(index, { [field.name]: v })}
                />
              </div>
            ))
          )}
        </Card>
      ))}

      {canAdd && (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={addItem}
        >
          <Plus className="h-4 w-4" />
          {addText ?? t('pactor.formCardList.add')}
        </Button>
      )}
    </div>
  );
}

// ─── DSL item template ────────────────────────────────────────────────────────

/**
 * 列表项 DSL 模板渲染：独立子组件内调用 useRenderer（与 Card 的 ExtraSlot
 * 同理），FormCardList 作纯 React 组件使用（fields / renderItem 模式）时
 * 不依赖 Renderer 上下文。
 * itemForm 模式包一层 ui Form：声明 name 的控件成为表单项（label / rules
 * 生效），模板内可用 Grid / Row / Col 排布复杂布局；字段变更经
 * onValuesChange 合并回当前列表项（onPatch → 整份列表 onChange）。
 */
function DslItemBody({
  template,
  scope,
  itemForm,
  formLayout,
  formName,
  initialValues,
  onPatch,
}: {
  template: DslChildren;
  scope: FormCardListItemScope;
  itemForm?: boolean;
  formLayout?: 'horizontal' | 'vertical' | 'inline';
  formName: string;
  initialValues: FormCardListItem;
  onPatch: (patch: FormCardListItem) => void;
}) {
  const { renderChildren } = useRenderer();
  const body = renderChildren(template, scope);
  if (!itemForm) {
    return (
      <div data-slot="form-card-list-item-body" className="flex flex-col gap-3">
        {body}
      </div>
    );
  }
  return (
    <Form
      name={formName}
      layout={formLayout}
      initialValues={initialValues}
      className="flex flex-col gap-3"
      onValuesChange={(changed) => onPatch(changed)}
    >
      {body}
    </Form>
  );
}

// ─── Field control（fields 模式） ─────────────────────────────────────────────

function FieldControl({
  field,
  value,
  disabled,
  onChange,
}: {
  field: FormCardListField;
  value: unknown;
  disabled?: boolean;
  onChange: (value: unknown) => void;
}) {
  switch (field.type ?? 'input') {
    case 'number':
      return (
        <Input
          type="number"
          value={value == null ? '' : String(value)}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'textarea':
      return (
        <Textarea
          value={value == null ? '' : String(value)}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'select':
      return (
        <Select<string | number | boolean>
          items={field.options ?? []}
          value={(value as string | number | boolean) ?? null}
          disabled={disabled}
          onValueChange={(v) => onChange(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={String(opt.value)} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'switch':
      return (
        <Switch
          checked={Boolean(value)}
          disabled={disabled}
          onCheckedChange={(checked) => onChange(checked)}
        />
      );
    default:
      return (
        <Input
          value={value == null ? '' : String(value)}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
