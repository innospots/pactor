import { useMemo, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

export interface DiffViewerProps {
  /** 旧文本（按行比较） */
  oldText?: string;
  /** 新文本（按行比较） */
  newText?: string;
  /** 左右分栏视图，默认 false（统一视图） */
  split?: boolean;
  /** 分栏视图的左右栏标题 */
  oldTitle?: string;
  newTitle?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

type DiffOpType = 'same' | 'add' | 'del';

interface DiffOp {
  type: DiffOpType;
  text: string;
}

/** LCS 行级 diff：返回按序操作流（same / del / add） */
export function diffLines(oldText: string, newText: string): DiffOp[] {
  const a = oldText === '' ? [] : oldText.split('\n');
  const b = newText === '' ? [] : newText.split('\n');
  const m = a.length;
  const n = b.length;

  // dp[i][j] = a[i:] 与 b[j:] 的最长公共子序列长度
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      ops.push({ type: 'same', text: a[i] });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'del', text: a[i] });
      i += 1;
    } else {
      ops.push({ type: 'add', text: b[j] });
      j += 1;
    }
  }
  while (i < m) {
    ops.push({ type: 'del', text: a[i] });
    i += 1;
  }
  while (j < n) {
    ops.push({ type: 'add', text: b[j] });
    j += 1;
  }
  return ops;
}

const rowClass: Record<DiffOpType, string> = {
  same: '',
  add: 'bg-success/10',
  del: 'bg-destructive/10',
};

const signMap: Record<DiffOpType, string> = { same: ' ', add: '+', del: '-' };

const signClass: Record<DiffOpType, string> = {
  same: 'text-muted-foreground',
  add: 'text-success',
  del: 'text-destructive',
};

function UnifiedView({ ops }: { ops: DiffOp[] }) {
  return (
    <div data-slot="diff-viewer-unified">
      {ops.map((op, index) => (
        <div key={index} data-slot="diff-row" data-type={op.type} className={cn('flex', rowClass[op.type])}>
          <span className={cn('w-6 shrink-0 text-center select-none', signClass[op.type])}>
            {signMap[op.type]}
          </span>
          <span className="flex-1 whitespace-pre-wrap break-all">{op.text || ' '}</span>
        </div>
      ))}
    </div>
  );
}

function SplitView({ ops }: { ops: DiffOp[] }) {
  // 对齐两行面板：del 只占左栏、add 只占右栏、same 两栏同行
  const rows = ops.map((op, index) => (
    <div key={index} className="flex">
      <div
        data-slot="diff-cell"
        data-type={op.type === 'add' ? 'empty' : op.type}
        className={cn(
          'w-1/2 whitespace-pre-wrap break-all border-r border-border px-2',
          op.type === 'del' && rowClass.del,
          op.type === 'add' && 'bg-muted',
        )}
      >
        {op.type === 'add' ? '' : op.text || ' '}
      </div>
      <div
        data-slot="diff-cell"
        data-type={op.type === 'del' ? 'empty' : op.type}
        className={cn(
          'w-1/2 whitespace-pre-wrap break-all px-2',
          op.type === 'add' && rowClass.add,
          op.type === 'del' && 'bg-muted',
        )}
      >
        {op.type === 'del' ? '' : op.text || ' '}
      </div>
    </div>
  ));
  return <div data-slot="diff-viewer-split">{rows}</div>;
}

/**
 * DiffViewer 适配器（shadcn kit）：文本 / 代码行级差异对比（LCS 算法）；
 * 统一视图（+/- 行）与左右分栏视图（split）。
 */
export function DiffViewer({ oldText = '', newText = '', split, oldTitle, newTitle, className, style }: DiffViewerProps) {
  const ops = useMemo(() => diffLines(oldText, newText), [oldText, newText]);

  return (
    <div
      data-slot="diff-viewer"
      className={cn('w-full overflow-hidden rounded-md border border-border font-mono text-xs', className)}
      style={style}
    >
      {split && (oldTitle || newTitle) ? (
        <div data-slot="diff-viewer-header" className="flex border-b border-border bg-muted font-sans">
          <div className="w-1/2 border-r border-border px-2 py-1.5 font-medium">{oldTitle ?? ''}</div>
          <div className="w-1/2 px-2 py-1.5 font-medium">{newTitle ?? ''}</div>
        </div>
      ) : null}
      <div className="overflow-x-auto py-1">
        {split ? <SplitView ops={ops} /> : <UnifiedView ops={ops} />}
      </div>
    </div>
  );
}
