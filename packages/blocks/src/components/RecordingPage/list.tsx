import { useState } from 'react';

import { cn } from '../../lib/utils.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@pactor-app/ui/ui';
import { Button } from '@pactor-app/ui/components';
import { Empty } from '@pactor-app/ui/components';
import { Icon } from '@pactor-app/ui/components';
import { Text } from '@pactor-app/ui/components';
import type { RecordingFilterItem, RecordingGroup, RecordingItem } from './types.js';

export interface RecordingListProps {
  listTitle: string;
  selectLabel?: string;
  /** 多选模式标题右侧操作文案（缺省「完成」，由 RecordingPage 传入） */
  selectDoneLabel?: string;
  /** 多选模式全选文案（缺省「全选」） */
  selectAllLabel?: string;
  /** 多选模式已选计数文案（{count} 占位） */
  selectedCountText?: string;
  /** 多选模式底部删除按钮文案（缺省「删除」） */
  deleteLabel?: string;
  /** 删除二次确认弹层标题 / 正文（{count} 占位）/ 按钮文案 */
  deleteConfirmTitle?: string;
  deleteConfirmText?: string;
  deleteCancelLabel?: string;
  deleteConfirmLabel?: string;
  /** 是否处于多选模式 */
  selecting?: boolean;
  /** 多选模式选中录音 id 列表（已解析受控 / 非受控） */
  selectedRecordingIds?: string[];
  onEnterSelectMode?: () => void;
  onExitSelectMode?: () => void;
  onToggleRecordingSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  onDeleteSelected?: () => void;
  filters: RecordingFilterItem[];
  /** 当前选中过滤 key（已解析受控 / 非受控） */
  activeFilter?: string;
  onFilterChange: (key: string) => void;
  processingText?: string;
  processingHint?: string;
  onProcessingClick?: () => void;
  newRecordingLabel?: string | null;
  onNewRecording?: () => void;
  groups: RecordingGroup[];
  /** 当前选中录音 id（已解析受控 / 非受控） */
  activeRecordingId?: string;
  onSelectRecording: (id: string) => void;
  listWidth: number;
  emptyText: string;
}

/**
 * 录音记录列表（RecordingPage 左列）：浅色（bg-muted）圆角块容器
 * （无右边框、四周留白），内为标题行 / 过滤 pills / 处理状态横幅 /
 * 新建录音钮（均固定不滚动）；仅分组数据列表区域滚动（波形图标 +
 * 标题 + 状态标 + 日期时长，选中白底高亮）。
 * 点「选择」进入多选模式：标题右侧变为「完成」，过滤 / 横幅 / 新建钮
 * 收起，条目左侧波形图标换成圆形复选框（绿色对勾 / 空圈，点击整行
 * 切换），顶部出现「已选 N 条 + 全选」，底部固定红色「删除」按钮（点击
 * 弹 AlertDialog 二次确认，确认才触发 onDeleteSelected）。
 */
export function RecordingList({
  listTitle,
  selectLabel,
  selectDoneLabel,
  selectAllLabel,
  selectedCountText,
  deleteLabel,
  deleteConfirmTitle,
  deleteConfirmText,
  deleteCancelLabel,
  deleteConfirmLabel,
  selecting = false,
  selectedRecordingIds = [],
  onEnterSelectMode,
  onExitSelectMode,
  onToggleRecordingSelect,
  onToggleSelectAll,
  onDeleteSelected,
  filters,
  activeFilter,
  onFilterChange,
  processingText,
  processingHint,
  onProcessingClick,
  newRecordingLabel,
  onNewRecording,
  groups,
  activeRecordingId,
  onSelectRecording,
  listWidth,
  emptyText,
}: RecordingListProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const renderRecordingItem = (item: RecordingItem) => {
    const active = !selecting && item.id === activeRecordingId;
    const checked = selecting && selectedRecordingIds.includes(item.id);
    return (
      <button
        key={item.id}
        type="button"
        data-slot="recording-item"
        data-active={active || undefined}
        aria-pressed={selecting ? checked : undefined}
        className={cn(
          'flex w-full cursor-pointer items-start gap-2 rounded-lg p-2 text-left',
          active ? 'bg-background shadow-sm' : undefined,
        )}
        onClick={() =>
          selecting ? onToggleRecordingSelect?.(item.id) : onSelectRecording(item.id)
        }
      >
        {selecting ? (
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
              checked ? 'bg-success text-background' : 'border border-border bg-background',
            )}
          >
            {checked ? <Icon name="check" size={12} /> : null}
          </span>
        ) : (
          <Icon name={item.icon ?? 'audio-lines'} size={18} className="mt-0.5 shrink-0" />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <Text
              text={item.title}
              size="small"
              strong={active || checked}
              className="min-w-0 truncate"
            />
            {item.status !== undefined ? (
              <Text
                text={item.status}
                size="small"
                type={item.statusType ?? 'secondary'}
                className="shrink-0"
              />
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-2">
            <Text text={item.time} size="small" type="secondary" />
            <Text text={item.duration} size="small" type="secondary" />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      data-slot="recording-page-list"
      className="m-3 flex min-h-0 shrink-0 flex-col gap-3 rounded-xl bg-muted p-4"
      style={{ width: listWidth }}
    >
      <div className="flex items-center justify-between">
        <Text text={listTitle} strong size="large" />
        {selecting ? (
          <Button
            text={selectDoneLabel ?? '完成'}
            variant="link"
            size="small"
            onClick={() => onExitSelectMode?.()}
          />
        ) : selectLabel !== undefined ? (
          <Button text={selectLabel} variant="link" size="small" onClick={() => onEnterSelectMode?.()} />
        ) : null}
      </div>
      {selecting ? (
        <div
          data-slot="recording-page-selection-bar"
          className="flex items-center justify-between"
        >
          <Text
            text={(selectedCountText ?? '已选 {count} 条').replace(
              '{count}',
              String(selectedRecordingIds.length),
            )}
            size="small"
            type="secondary"
          />
          <Button
            text={selectAllLabel ?? '全选'}
            variant="link"
            size="small"
            onClick={() => onToggleSelectAll?.()}
          />
        </div>
      ) : null}
      {!selecting && filters.length > 0 ? (
        <div data-slot="recording-page-filters" className="flex gap-2">
          {filters.map((filter) => {
            const active = filter.key === activeFilter;
            return (
              <button
                key={filter.key}
                type="button"
                data-active={active || undefined}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1 text-xs',
                  active ? 'bg-primary text-primary-foreground' : 'bg-background',
                )}
                onClick={() => onFilterChange(filter.key)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      ) : null}
      {!selecting && processingText !== undefined ? (
        <button
          type="button"
          data-slot="recording-page-processing"
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-background p-3 text-left"
          onClick={() => onProcessingClick?.()}
        >
          <Icon name="audio-lines" size={18} />
          <div className="flex flex-1 flex-col">
            <Text text={processingText} size="small" strong />
            {processingHint !== undefined ? (
              <Text text={processingHint} size="small" type="secondary" />
            ) : null}
          </div>
          <Icon name="chevron-right" size={16} className="text-muted-foreground" />
        </button>
      ) : null}
      {!selecting && newRecordingLabel !== null && newRecordingLabel !== undefined ? (
        <Button
          text={newRecordingLabel}
          icon="mic"
          variant="primary"
          className="w-full"
          onClick={() => onNewRecording?.()}
        />
      ) : null}
      {/* 仅分组数据列表区域滚动，头部（标题 / 过滤 / 横幅 / 新建钮）固定 */}
      <div
        data-slot="recording-page-groups"
        className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
      >
        {groups.length === 0 ? (
          <Empty title={emptyText} />
        ) : (
          groups.map((group, groupIndex) => (
            <div key={group.key ?? group.label ?? groupIndex} className="flex flex-col gap-1">
              <Text text={group.label} size="small" type="secondary" className="px-1" />
              {group.items.map(renderRecordingItem)}
            </div>
          ))
        )}
      </div>
      {selecting ? (
        <>
          <Button
            text={deleteLabel ?? '删除'}
            variant="primary"
            danger
            className="w-full shrink-0"
            onClick={() => setDeleteConfirmOpen(true)}
          />
          <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <AlertDialogContent data-slot="recording-delete-confirm">
              <AlertDialogHeader>
                <AlertDialogTitle>{deleteConfirmTitle ?? '删除录音'}</AlertDialogTitle>
                <AlertDialogDescription>
                  {(
                    deleteConfirmText ??
                    '确定删除选中的 {count} 条录音吗？删除后不可恢复。'
                  ).replace('{count}', String(selectedRecordingIds.length))}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{deleteCancelLabel ?? '取消'}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => onDeleteSelected?.()}
                >
                  {deleteConfirmLabel ?? '删除'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : null}
    </div>
  );
}
