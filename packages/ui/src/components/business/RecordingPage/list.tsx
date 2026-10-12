import { cn } from '../../../lib/utils.js';
import { Button } from '../../components/Button/index.js';
import { Empty } from '../../components/Empty/index.js';
import { Icon } from '../../components/Icon/index.js';
import { Text } from '../../components/Text/index.js';
import type { RecordingFilterItem, RecordingGroup, RecordingItem } from './types.js';

export interface RecordingListProps {
  listTitle: string;
  selectLabel?: string;
  onSelectClick?: () => void;
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
 * 录音记录列表（RecordingPage 左列）：标题行 / 过滤 pills / 处理状态横幅 /
 * 新建录音钮 / 分组条目（波形图标 + 标题 + 状态标 + 日期时长，选中底色高亮）。
 */
export function RecordingList({
  listTitle,
  selectLabel,
  onSelectClick,
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
  const renderRecordingItem = (item: RecordingItem) => {
    const active = item.id === activeRecordingId;
    return (
      <button
        key={item.id}
        type="button"
        data-slot="recording-item"
        data-active={active || undefined}
        className={cn(
          'flex w-full cursor-pointer items-start gap-2 rounded-lg p-2 text-left',
          active ? 'bg-accent' : undefined,
        )}
        onClick={() => onSelectRecording(item.id)}
      >
        <Icon name={item.icon ?? 'audio-lines'} size={18} className="mt-0.5 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <Text
              text={item.title}
              size="small"
              strong={active}
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
      className="scrollbar-subtle flex h-full min-h-0 shrink-0 flex-col gap-3 overflow-y-auto border-r border-border p-4"
      style={{ width: listWidth }}
    >
      <div className="flex items-center justify-between">
        <Text text={listTitle} strong size="large" />
        {selectLabel !== undefined ? (
          <Button text={selectLabel} variant="link" size="small" onClick={() => onSelectClick?.()} />
        ) : null}
      </div>
      {filters.length > 0 ? (
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
                  active ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
                onClick={() => onFilterChange(filter.key)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      ) : null}
      {processingText !== undefined ? (
        <button
          type="button"
          data-slot="recording-page-processing"
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-muted p-3 text-left"
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
      {newRecordingLabel !== null && newRecordingLabel !== undefined ? (
        <Button
          text={newRecordingLabel}
          icon="mic"
          variant="primary"
          className="w-full"
          onClick={() => onNewRecording?.()}
        />
      ) : null}
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
  );
}
