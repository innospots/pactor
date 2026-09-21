import { useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Checkbox as ShadcnCheckbox } from '../../../ui/checkbox.js';
import { Icon } from '../Icon/index.js';

/** 树节点；`children` 为子节点数组 */
export interface TreeNodeData {
  key: string;
  title: string;
  children?: TreeNodeData[];
  disabled?: boolean;
}

export interface TreeProps {
  /** 树数据（可含表达式解析后的数组） */
  treeData?: TreeNodeData[];
  /** 非受控初始展开 keys */
  defaultExpandedKeys?: string[];
  /** 受控展开 keys */
  expandedKeys?: string[];
  /** 受控选中 keys */
  selectedKeys?: string[];
  /** 非受控初始选中 keys */
  defaultSelectedKeys?: string[];
  /** 节点前显示勾选框 */
  checkable?: boolean;
  /** 受控勾选 keys */
  checkedKeys?: string[];
  /** 非受控初始勾选 keys */
  defaultCheckedKeys?: string[];
  /** 整树禁用 */
  disabled?: boolean;
  /** 选中事件，传出选中 keys 数组 */
  onSelect?: (keys: string[]) => void;
  /** 展开事件，传出展开 keys 数组 */
  onExpand?: (keys: string[]) => void;
  /** 勾选事件，传出勾选 keys 数组 */
  onCheck?: (keys: string[]) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function someDescendantChecked(node: TreeNodeData, checked: Set<string>): boolean {
  return (node.children ?? []).some(
    (child) => checked.has(child.key) || someDescendantChecked(child, checked),
  );
}

/**
 * Tree 适配器（shadcn kit）：自实现树（chevron 展开 + 缩进 + 可选勾选框）；
 * expanded / selected / checked 均支持受控（对应 props 传入即受控）与非受控
 * （default\*Keys 初始化内部状态）；勾选为独立勾选，父节点按子孙勾选状态显示半选。
 */
export function Tree({
  treeData = [],
  defaultExpandedKeys,
  expandedKeys,
  selectedKeys,
  defaultSelectedKeys,
  checkable,
  checkedKeys,
  defaultCheckedKeys,
  disabled,
  onSelect,
  onExpand,
  onCheck,
  className,
  style,
}: TreeProps) {
  const [innerExpanded, setInnerExpanded] = useState<string[]>(defaultExpandedKeys ?? []);
  const [innerSelected, setInnerSelected] = useState<string[]>(defaultSelectedKeys ?? []);
  const [innerChecked, setInnerChecked] = useState<string[]>(defaultCheckedKeys ?? []);

  const expanded = expandedKeys !== undefined ? expandedKeys : innerExpanded;
  const selected = selectedKeys !== undefined ? selectedKeys : innerSelected;
  const checked = checkedKeys !== undefined ? checkedKeys : innerChecked;
  const expandedSet = new Set(expanded);
  const checkedSet = new Set(checked);

  const toggleExpand = (key: string) => {
    const next = expandedSet.has(key)
      ? expanded.filter((k) => k !== key)
      : [...expanded, key];
    if (expandedKeys === undefined) setInnerExpanded(next);
    onExpand?.(next);
  };

  const handleSelect = (node: TreeNodeData) => {
    if (disabled || node.disabled) return;
    const next = [node.key];
    if (selectedKeys === undefined) setInnerSelected(next);
    onSelect?.(next);
  };

  const handleCheck = (node: TreeNodeData, nextChecked: boolean) => {
    if (disabled || node.disabled) return;
    const next = nextChecked
      ? [...checked, node.key]
      : checked.filter((k) => k !== node.key);
    if (checkedKeys === undefined) setInnerChecked(next);
    onCheck?.(next);
  };

  const renderNodes = (nodes: TreeNodeData[], depth: number) =>
    nodes.map((node) => {
      const children = node.children ?? [];
      const hasChildren = children.length > 0;
      const isExpanded = expandedSet.has(node.key);
      const isDisabled = disabled === true || node.disabled === true;
      const indeterminate =
        checkable === true &&
        hasChildren &&
        !checkedSet.has(node.key) &&
        someDescendantChecked(node, checkedSet);

      return (
        <div key={node.key} data-slot="tree-node" data-key={node.key} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={selected.includes(node.key)}>
          <div
            className={cn(
              'flex items-center gap-1 rounded-md py-1 pr-2 text-sm',
              !isDisabled && 'cursor-pointer hover:bg-accent',
              isDisabled && 'cursor-not-allowed opacity-50',
              selected.includes(node.key) && 'bg-accent font-medium',
            )}
            style={{ paddingLeft: `${depth * 16 + 4}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                data-slot="tree-switcher"
                aria-label={isExpanded ? '收起' : '展开'}
                disabled={isDisabled}
                onClick={() => toggleExpand(node.key)}
                className="flex size-5 shrink-0 items-center justify-center"
              >
                <Icon
                  name="chevron-right"
                  size="sm"
                  className={cn('transition-transform', isExpanded && 'rotate-90')}
                />
              </button>
            ) : (
              <span className="size-5 shrink-0" />
            )}
            {checkable ? (
              <ShadcnCheckbox
                checked={checkedSet.has(node.key)}
                indeterminate={indeterminate}
                disabled={isDisabled}
                onCheckedChange={(next) => handleCheck(node, next === true)}
              />
            ) : null}
            <span
              data-slot="tree-node-title"
              className="min-w-0 flex-1 truncate"
              onClick={() => handleSelect(node)}
            >
              {node.title}
            </span>
          </div>
          {hasChildren && isExpanded ? renderNodes(children, depth + 1) : null}
        </div>
      );
    });

  return (
    <div
      data-slot="tree"
      role="tree"
      className={cn('w-full', className)}
      style={style}
    >
      {renderNodes(treeData, 0)}
    </div>
  );
}
