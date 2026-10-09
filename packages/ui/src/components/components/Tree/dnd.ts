import type { TreeNodeData } from './index.js';

/** 拖拽落下的相对位置：目标前 / 目标后（同级排序）/ 目标内（作为子级） */
export type DropPosition = 'before' | 'after' | 'inside';

/** 拖拽放下事件载荷（Renderer 绑定 events.onDrop） */
export interface TreeDropInfo {
  dragKey: string;
  dropKey: string;
  position: DropPosition;
}

/** 深拷贝树（拖拽移动前复制，避免改动 props 传入的引用） */
export function cloneTree(nodes: TreeNodeData[]): TreeNodeData[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneTree(node.children) : undefined,
  }));
}

/** key 是否位于 rootKey 的子树内（含 rootKey 自身；用于禁止拖入自身/后代） */
export function isWithinKey(
  nodes: TreeNodeData[],
  rootKey: string,
  key: string,
): boolean {
  for (const node of nodes) {
    if (node.key === rootKey) {
      return findKey([node], key);
    }
    if (node.children && isWithinKey(node.children, rootKey, key)) {
      return true;
    }
  }
  return false;
}

function findKey(nodes: TreeNodeData[], key: string): boolean {
  for (const node of nodes) {
    if (node.key === key) return true;
    if (node.children && findKey(node.children, key)) return true;
  }
  return false;
}

/** 从树中移除 key 节点，返回 [新树, 被移除的节点]（未找到时节点为 null） */
export function removeTreeNode(
  nodes: TreeNodeData[],
  key: string,
): [TreeNodeData[], TreeNodeData | null] {
  let removed: TreeNodeData | null = null;
  const walk = (list: TreeNodeData[]): TreeNodeData[] => {
    const next: TreeNodeData[] = [];
    for (const node of list) {
      if (node.key === key) {
        removed = node;
        continue;
      }
      next.push(
        node.children ? { ...node, children: walk(node.children) } : node,
      );
    }
    return next;
  };
  return [walk(nodes), removed];
}

/** 把 node 插入 targetKey 的 before / after / inside；未找到目标时返回 false */
export function insertTreeNode(
  nodes: TreeNodeData[],
  node: TreeNodeData,
  targetKey: string,
  position: DropPosition,
): [TreeNodeData[], boolean] {
  const next: TreeNodeData[] = [];
  let inserted = false;
  for (const current of nodes) {
    if (current.key === targetKey) {
      if (position === 'before') {
        next.push(node, current);
      } else if (position === 'after') {
        next.push(current, node);
      } else {
        next.push({
          ...current,
          children: [...(current.children ?? []), node],
        });
      }
      inserted = true;
      continue;
    }
    if (current.children) {
      const [children, childInserted] = insertTreeNode(
        current.children,
        node,
        targetKey,
        position,
      );
      next.push(childInserted ? { ...current, children } : current);
      inserted = inserted || childInserted;
      continue;
    }
    next.push(current);
  }
  return [inserted ? next : nodes, inserted];
}

/**
 * 拖拽移动：把 dragKey 移到 dropKey 的 position 处。
 * 非法（同键、拖入自身后代、键不存在）返回 null；调用方传入的数组不被改动。
 */
export function moveTreeNode(
  nodes: TreeNodeData[],
  dragKey: string,
  dropKey: string,
  position: DropPosition,
): TreeNodeData[] | null {
  if (dragKey === dropKey) return null;
  if (isWithinKey(nodes, dragKey, dropKey)) return null;
  const [withoutDrag, dragNode] = removeTreeNode(cloneTree(nodes), dragKey);
  if (!dragNode) return null;
  const [next, inserted] = insertTreeNode(
    withoutDrag,
    dragNode,
    dropKey,
    position,
  );
  return inserted ? next : null;
}
