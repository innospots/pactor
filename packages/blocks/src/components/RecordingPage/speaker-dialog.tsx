import { cn } from '../../../lib/utils.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../../ui/dialog.js';
import { Avatar } from '../../components/Avatar/index.js';
import { Button } from '../../components/Button/index.js';
import { Input } from '../../components/Input/index.js';
import type { RecordingSpeaker } from './types.js';

export interface RecordingSpeakerDialogProps {
  open: boolean;
  title: string;
  hint?: string;
  speakers: RecordingSpeaker[];
  /** 草稿：选中的人员下标（-1 表示未选中） */
  selectedIndex: number;
  /** 草稿：自由输入的姓名（优先于列表选中） */
  customName: string;
  inputPlaceholder: string;
  applyLabel: string;
  onSelect: (index: number) => void;
  onInputName: (name: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * 修改发言人弹层（RecordingPage 原文转写页签内建）：标题 + 说明 + 人员
 * 选项单选列表（头像 + 姓名 + 角色 · 组织 + 来源标签，选中行主色淡化底）+
 * 自由输入姓名（非空时优先于列表选中），底部「应用姓名」；打开期间的
 * 选择为草稿，应用经 onConfirm 提交，X / 遮罩关闭即丢弃。
 */
export function RecordingSpeakerDialog({
  open,
  title,
  hint,
  speakers,
  selectedIndex,
  customName,
  inputPlaceholder,
  applyLabel,
  onSelect,
  onInputName,
  onCancel,
  onConfirm,
}: RecordingSpeakerDialogProps) {
  const canApply = customName.trim() !== '' || selectedIndex >= 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent
        data-slot="recording-speaker-dialog"
        className="gap-4 sm:max-w-xl"
      >
        <DialogTitle>{title}</DialogTitle>
        {hint !== undefined ? <DialogDescription>{hint}</DialogDescription> : null}
        {speakers.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {speakers.map((speaker, index) => {
              const selected = index === selectedIndex;
              return (
                <button
                  key={`${speaker.name}-${index}`}
                  type="button"
                  data-slot="recording-speaker-option"
                  aria-pressed={selected}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left',
                    selected ? 'bg-primary/10' : 'hover:bg-muted',
                  )}
                  onClick={() => onSelect(index)}
                >
                  <Avatar fallback={speaker.avatarText ?? speaker.name.charAt(0)} />
                  <span className="flex min-w-0 flex-1 items-baseline gap-2">
                    <span className="text-sm font-medium">{speaker.name}</span>
                    {speaker.role !== undefined ? (
                      <span className="truncate text-sm text-muted-foreground">
                        {speaker.role}
                      </span>
                    ) : null}
                  </span>
                  {speaker.tag !== undefined ? (
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {speaker.tag}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
        <Input
          value={customName}
          placeholder={inputPlaceholder}
          onChange={onInputName}
        />
        <div className="flex items-center justify-end">
          <Button
            text={applyLabel}
            variant="primary"
            disabled={!canApply}
            onClick={onConfirm}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
