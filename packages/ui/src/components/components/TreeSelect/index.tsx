import { ChevronRight } from 'lucide-react';
import { useEffect, useId, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Input as ShadcnInput } from '../../../ui/input.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover.js';
import { CONTROL_SIZE_BOX, type ControlSize } from '../../control-size.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

/** TreeSelect 树节点（嵌套） */
export interface TreeSelectOption {
  label: string;
  value: string | number;
  children?: TreeSelectOption[];
}

export interface TreeSelectProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 嵌套选项树 */
  options?: TreeSelectOption[];
  /** 受控值（选中节点 value）；Form 内作为字段初始值 */
  value?: string | number;
  placeholder?: string;
  /** 弹层顶部显示过滤输入（按 label 过滤，命中节点的祖先保留展开） */
  searchable?: boolean;
  disabled?: boolean;
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸） */
  size?: ControlSize;
  /** 选中变化事件，传出选中节点 value */
  onChange?: (value: string | number) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为触发器） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/** 在树中查找节点与其祖先 value 链（未命中返回 undefined） */
function findPath(
  options: TreeSelectOption[],
  target: unknown,
  trail: Array<string | number> = [],
): { node: TreeSelectOption; path: Array<string | number> } | undefined {
  for (const option of options) {
    const path = [...trail, option.value];
    if (option.value === target) return { node: option, path };
    if (option.children) {
      const hit = findPath(option.children, target, path);
      if (hit) return hit;
    }
  }
  return undefined;
}

/** 节点或其任一后代 label 命中查询串 */
function matchQuery(option: TreeSelectOption, query: string): boolean {
  if (option.label.includes(query)) return true;
  return (option.children ?? []).some((child) => matchQuery(child, query));
}

/**
 * TreeSelect 适配器（shadcn kit）：触发器 + 受控 Popover 内联树
 * （自实现，可展开/收起）；searchable 时顶部过滤输入按 label 过滤，
 * 命中节点的祖先保留展开。单选，onChange 传出选中节点 value
 * （DSL 语义值）；Form 内声明 `name` 自动成为表单项。
 */
export function TreeSelect({
  name,
  label,
  rules,
  options = [],
  value,
  placeholder,
  searchable,
  disabled,
  size = 'middle',
  onChange,
  className,
  style,
}: TreeSelectProps) {
  const form = useFormContext();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string | number>>(new Set());

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
  const selected = findPath(options, current);

  const openPanel = (next: boolean) => {
    if (next) {
      setQuery('');
      // 打开时展开到当前选中节点
      setExpanded(new Set(selected ? selected.path.slice(0, -1) : []));
    }
    setOpen(next);
  };

  const toggleExpanded = (nodeValue: string | number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(nodeValue)) next.delete(nodeValue);
      else next.add(nodeValue);
      return next;
    });
  };

  const handleSelect = (option: TreeSelectOption) => {
    if (inForm && form && name) {
      form.setValue(name, option.value);
    } else {
      setInnerValue(option.value);
    }
    onChange?.(option.value);
    setOpen(false);
  };

  const searching = query.trim() !== '';

  const renderNodes = (nodes: TreeSelectOption[], depth: number) =>
    nodes.map((option) => {
      if (searching && !matchQuery(option, query.trim())) return null;
      const hasChildren = (option.children?.length ?? 0) > 0;
      // 搜索时命中节点的祖先保留展开
      const isExpanded = searching || expanded.has(option.value);
      return (
        <div key={String(option.value)} data-slot="treeselect-node">
          <div
            className="flex items-center gap-1"
            style={{ paddingLeft: depth * 16 }}
          >
            {hasChildren ? (
              <button
                type="button"
                aria-label={`${isExpanded ? '收起' : '展开'} ${option.label}`}
                className="flex size-5 shrink-0 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
                onClick={() => toggleExpanded(option.value)}
              >
                <ChevronRight
                  className={cn(
                    'size-4 transition-transform',
                    isExpanded && 'rotate-90',
                  )}
                />
              </button>
            ) : (
              <span className="size-5 shrink-0" />
            )}
            <button
              type="button"
              className={cn(
                'min-w-0 flex-1 cursor-pointer truncate rounded-md px-2 py-1 text-left text-sm hover:bg-accent',
                option.value === current && 'bg-accent font-medium',
              )}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          </div>
          {hasChildren && isExpanded
            ? renderNodes(option.children ?? [], depth + 1)
            : null}
        </div>
      );
    });

  const control = (
    <Popover open={open} onOpenChange={openPanel}>
      <PopoverTrigger
        id={controlId}
        type="button"
        disabled={disabled}
        data-slot="treeselect-trigger"
        className={cn(
          'flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          CONTROL_SIZE_BOX[size],
          !selected && 'text-muted-foreground',
          !inForm && className,
        )}
        style={inForm ? undefined : style}
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {selected ? selected.node.label : (placeholder ?? '请选择')}
        </span>
        <ChevronRight className="size-4 shrink-0 rotate-90 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        {searchable ? (
          <div className="pb-2">
            <ShadcnInput
              aria-label="搜索"
              placeholder="搜索"
              className="h-8"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        ) : null}
        <div
          data-slot="treeselect-tree"
          className="flex max-h-64 flex-col gap-0.5 overflow-y-auto"
        >
          {renderNodes(options, 0)}
        </div>
      </PopoverContent>
    </Popover>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
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
