import { useI18n } from "@pactor-app/runtime";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
} from "react";

import { cn } from "../../../lib/utils.js";
import { Checkbox as ShadcnCheckbox } from "../../../ui/checkbox.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu.js";
import { Icon } from "../Icon/index.js";
import {
  cloneTree,
  insertTreeNode,
  isWithinKey,
  moveTreeNode,
  removeTreeNode,
  type DropPosition,
  type TreeDropInfo,
} from "./dnd.js";

/** 树节点行级操作可绑定的静态编辑操作（Tree 执行内部即时改树） */
export type TreeNodeActionOp = "addSibling" | "addChild" | "delete";

/** 树节点行级操作（右端图标按钮 / ⋯ 下拉菜单项），由外部传入 */
export interface TreeNodeAction {
  /** 动作标识（onNodeAction 传出） */
  value: string;
  /** 图标名（Icon 白名单，kebab-case / PascalCase 均可） */
  icon?: string;
  /** 文案：inline 时为 aria-label/title，dropdown 时为菜单项文字 */
  label?: string;
  /** 危险样式（dropdown 菜单项标红） */
  danger?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /**
   * 绑定的静态编辑操作：addSibling 在目标后插入「新节点」、addChild 追加
   * 子级「新节点」并展开、delete 连带子树删除；组件内部即时改树，
   * onNodeAction 仍按本动作的 value 传出（新增时带 newKey）
   */
  op?: TreeNodeActionOp;
  /** dropdown 展示时在本项前渲染分隔线 */
  separatorBefore?: boolean;
}

/** 行级操作点击事件载荷（Renderer 绑定 events.onNodeAction） */
export interface TreeNodeActionInfo {
  /** 动作标识（外部传入的 TreeNodeAction.value） */
  value: string;
  /** 所在节点 key */
  key: string;
  /** op 为 addSibling / addChild 时生成的新节点 key */
  newKey?: string;
}

/** 树节点；`children` 为子节点数组，`actions` 为该节点的行级操作 */
export interface TreeNodeData {
  key: string;
  title: string;
  children?: TreeNodeData[];
  disabled?: boolean;
  /** 行级操作（优先于 Tree 级 nodeActions） */
  actions?: TreeNodeAction[];
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
  /**
   * 可拖拽调整节点位置：hover 行时左侧显示拖拽手柄（grip），**仅拖动手柄生效**；
   * 拖到目标上/下边缘为同级排序（before/after），拖到目标中部为移入作为子级（inside）；
   * 组件内部即时更新，持久化经 events.onDrop 同步（如 setState / service.call）
   */
  draggable?: boolean;
  /** 全树统一的行级操作（节点数据 actions 字段优先；hover 行时右端显示） */
  nodeActions?: TreeNodeAction[];
  /** 行级操作展示方式：inline 平铺图标按钮（适合 1-2 个）| dropdown 收进 ⋯ 菜单，默认 inline */
  nodeActionDisplay?: "inline" | "dropdown";
  /** 选中事件，传出选中 keys 数组 */
  onSelect?: (keys: string[]) => void;
  /** 展开事件，传出展开 keys 数组 */
  onExpand?: (keys: string[]) => void;
  /** 勾选事件，传出勾选 keys 数组 */
  onCheck?: (keys: string[]) => void;
  /** 拖拽放下事件，传出 { dragKey, dropKey, position } */
  onDrop?: (info: TreeDropInfo) => void;
  /** 行级操作点击事件，传出 { value, key } */
  onNodeAction?: (info: TreeNodeActionInfo) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function someDescendantChecked(
  node: TreeNodeData,
  checked: Set<string>,
): boolean {
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
  draggable,
  nodeActions,
  nodeActionDisplay = "inline",
  onSelect,
  onExpand,
  onCheck,
  onDrop,
  onNodeAction,
  className,
  style,
}: TreeProps) {
  const [innerExpanded, setInnerExpanded] = useState<string[]>(
    defaultExpandedKeys ?? [],
  );
  const [innerSelected, setInnerSelected] = useState<string[]>(
    defaultSelectedKeys ?? [],
  );
  const [innerChecked, setInnerChecked] = useState<string[]>(
    defaultCheckedKeys ?? [],
  );

  // 拖拽：内部维护树副本即时更新；props 内容变化（如 onDrop 后服务端回写）时重新同步，
  // 以 JSON 签名对比避免父级重渲染产生的新引用覆盖本地拖拽结果
  const [innerData, setInnerData] = useState<TreeNodeData[]>(treeData);
  const { t } = useI18n();
  const lastPropJsonRef = useRef(JSON.stringify(treeData));
  useEffect(() => {
    const json = JSON.stringify(treeData);
    if (json !== lastPropJsonRef.current) {
      lastPropJsonRef.current = json;
      setInnerData(treeData);
    }
  }, [treeData]);
  // 声明了 op 的行级操作需要内部树副本执行静态改树
  const hasOpActions =
    (nodeActions ?? []).some((a) => a.op) ||
    treeData.some(function walk(node): boolean {
      return (
        (node.actions ?? []).some((a) => a.op) ||
        (node.children ?? []).some(walk)
      );
    });
  const data = draggable || hasOpActions ? innerData : treeData;

  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    key: string;
    position: DropPosition;
  } | null>(null);

  const clearDrag = () => {
    setDragKey(null);
    setDropTarget(null);
  };

  /** 按指针在行内的纵向位置判定落下方式：上/下 30% 边缘为同级排序，中部为移入 */
  const resolvePosition = (event: DragEvent<HTMLElement>): DropPosition => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.height <= 0) return "inside";
    const ratio = (event.clientY - rect.top) / rect.height;
    if (ratio < 0.3) return "before";
    if (ratio > 0.7) return "after";
    return "inside";
  };

  const canDropOnNode = (fromKey: string, targetKey: string) =>
    fromKey !== targetKey && !isWithinKey(data, fromKey, targetKey);

  const handleDragOver = (
    event: DragEvent<HTMLElement>,
    node: TreeNodeData,
  ) => {
    if (dragKey === null || !canDropOnNode(dragKey, node.key)) {
      if (dropTarget) setDropTarget(null);
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const position = resolvePosition(event);
    if (dropTarget?.key !== node.key || dropTarget.position !== position) {
      setDropTarget({ key: node.key, position });
    }
  };

  const handleDrop = (event: DragEvent<HTMLElement>, node: TreeNodeData) => {
    event.preventDefault();
    const key = dragKey;
    clearDrag();
    if (key === null || !canDropOnNode(key, node.key)) return;
    const position = resolvePosition(event);
    const next = moveTreeNode(data, key, node.key, position);
    if (!next) return;
    lastPropJsonRef.current = JSON.stringify(next);
    setInnerData(next);
    onDrop?.({ dragKey: key, dropKey: node.key, position });
  };

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

  const newKeySeqRef = useRef(0);

  const applyTreeChange = (next: TreeNodeData[]) => {
    lastPropJsonRef.current = JSON.stringify(next);
    setInnerData(next);
  };

  /** op 静态编辑：内部即时改树（新增「新节点」/ 删除连带子树） */
  const applyEditOp = (
    node: TreeNodeData,
    op: TreeNodeActionOp,
    value: string,
  ): TreeNodeActionInfo | null => {
    if (op === "addSibling" || op === "addChild") {
      const newKey = `node-${Date.now()}-${++newKeySeqRef.current}`;
      const [next, inserted] = insertTreeNode(
        cloneTree(data),
        { key: newKey, title: t("pactor.tree.newNode") },
        node.key,
        op === "addSibling" ? "after" : "inside",
      );
      if (!inserted) return null;
      applyTreeChange(next);
      // 新增子级后自动展开父节点（非受控展开时）
      if (op === "addChild" && expandedKeys === undefined) {
        setInnerExpanded((prev) =>
          prev.includes(node.key) ? prev : [...prev, node.key],
        );
      }
      return { value, key: node.key, newKey };
    }
    const [next, removed] = removeTreeNode(cloneTree(data), node.key);
    if (!removed) return null;
    applyTreeChange(next);
    // 清理选中/勾选态中的被删节点
    if (selectedKeys === undefined) {
      setInnerSelected((prev) => prev.filter((k) => k !== node.key));
    }
    if (checkedKeys === undefined) {
      setInnerChecked((prev) => prev.filter((k) => k !== node.key));
    }
    return { value, key: node.key };
  };

  const handleNodeAction = (node: TreeNodeData, action: TreeNodeAction) => {
    if (isActionDisabled(action)) return;
    if (action.op) {
      const info = applyEditOp(node, action.op, action.value);
      if (info) onNodeAction?.(info);
      return;
    }
    onNodeAction?.({ value: action.value, key: node.key });
  };

  const isActionDisabled = (action: TreeNodeAction) =>
    disabled === true || action.disabled === true;

  /** 行级操作区（右端）：节点 actions（优先于 Tree 级 nodeActions），由外部传入；hover 行时显示 */
  const renderNodeActions = (node: TreeNodeData) => {
    const actions = node.actions ?? nodeActions;
    if (!actions || actions.length === 0) return null;
    if (nodeActionDisplay === "dropdown") {
      return (
        <span
          data-slot="tree-node-actions"
          className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100"
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={t("pactor.tree.nodeActions")}
              className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
            >
              <Icon name="ellipsis" size="sm" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action) => (
                <Fragment key={action.value}>
                  {action.separatorBefore ? <DropdownMenuSeparator /> : null}
                  <DropdownMenuItem
                    disabled={isActionDisabled(action)}
                    variant={action.danger ? "destructive" : "default"}
                    onClick={() => handleNodeAction(node, action)}
                  >
                    {action.icon ? <Icon name={action.icon} size="sm" /> : null}
                    {action.label ?? action.value}
                  </DropdownMenuItem>
                </Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      );
    }
    return (
      <span
        data-slot="tree-node-actions"
        className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
      >
        {actions.map((action) => (
          <button
            key={action.value}
            type="button"
            data-slot="tree-node-action"
            data-value={action.value}
            title={action.label}
            aria-label={action.label ?? action.value}
            disabled={isActionDisabled(action)}
            className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            onClick={(event) => {
              event.stopPropagation();
              handleNodeAction(node, action);
            }}
          >
            {action.icon ? <Icon name={action.icon} size="sm" /> : action.label}
          </button>
        ))}
      </span>
    );
  };

  const renderNodes = (nodes: TreeNodeData[], depth: number) =>
    nodes.map((node) => {
      const children = node.children ?? [];
      const hasChildren = children.length > 0;
      const isExpanded = expandedSet.has(node.key);
      const isDisabled = disabled === true || node.disabled === true;
      const canDrag = draggable === true && !isDisabled;
      const dropPosition =
        dropTarget?.key === node.key ? dropTarget.position : null;
      const indeterminate =
        checkable === true &&
        hasChildren &&
        !checkedSet.has(node.key) &&
        someDescendantChecked(node, checkedSet);

      return (
        <div
          key={node.key}
          data-slot="tree-node"
          data-key={node.key}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={selected.includes(node.key)}
        >
          <div
            className={cn(
              "group flex items-center gap-1 rounded-md py-1 pr-2 text-sm my-[2px]",
              !isDisabled && "cursor-pointer hover:bg-accent",
              isDisabled && "cursor-not-allowed opacity-50",
              selected.includes(node.key) && "bg-accent font-medium",
              dragKey === node.key && "opacity-40",
              dropPosition === "inside" &&
                "bg-primary/10 ring-1 ring-primary/40",
              // 落点指示线（inset shadow）会跟随元素圆角，before/after 时去圆角保证线条笔直
              (dropPosition === "before" || dropPosition === "after") &&
                "rounded-none",
            )}
            style={{
              paddingLeft: `${depth * 16 + 4}px`,
              ...(dropPosition === "before"
                ? { boxShadow: "inset 0 2px 0 0 var(--primary)" }
                : dropPosition === "after"
                  ? { boxShadow: "inset 0 -2px 0 0 var(--primary)" }
                  : {}),
            }}
            draggable={false}
            onDragOver={
              draggable ? (event) => handleDragOver(event, node) : undefined
            }
            onDrop={draggable ? (event) => handleDrop(event, node) : undefined}
          >
            {canDrag ? (
              <span
                data-slot="tree-drag-handle"
                role="button"
                aria-label={t("pactor.tree.dragToReorder")}
                title={t("pactor.tree.dragToReorder")}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", node.key);
                  setDragKey(node.key);
                }}
                onDragEnd={clearDrag}
                className="flex size-4 shrink-0 cursor-move items-center justify-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Icon name="grip-vertical" size="sm" />
              </span>
            ) : null}
            {hasChildren ? (
              <button
                type="button"
                data-slot="tree-switcher"
                aria-label={isExpanded ? t("pactor.tree.collapse") : t("pactor.tree.expand")}
                disabled={isDisabled}
                onClick={() => toggleExpand(node.key)}
                className="flex size-5 shrink-0 items-center justify-center"
              >
                <Icon
                  name="chevron-right"
                  size="sm"
                  className={cn(
                    "transition-transform",
                    isExpanded && "rotate-90",
                  )}
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
            {renderNodeActions(node)}
          </div>
          {hasChildren && isExpanded ? renderNodes(children, depth + 1) : null}
        </div>
      );
    });

  return (
    <div
      data-slot="tree"
      role="tree"
      className={cn("w-full", className)}
      style={style}
    >
      {renderNodes(data, 0)}
    </div>
  );
}
