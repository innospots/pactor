import { cn } from '../../../lib/utils.js';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '../../../ui/dialog.js';
import { Button } from '../../components/Button/index.js';
import type { RecordingLanguageOption } from './types.js';

export interface RecordingLanguageDialogProps {
  open: boolean;
  title: string;
  sourceTitle: string;
  targetTitle: string;
  sourceLanguages: RecordingLanguageOption[];
  targetLanguages: RecordingLanguageOption[];
  /** 草稿选中（弹层打开期间的选择，确定才提交） */
  source?: string;
  target?: string;
  cancelLabel: string;
  confirmLabel: string;
  onSelectSource: (key: string) => void;
  onSelectTarget: (key: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

function LanguageOptionItem({
  option,
  selected,
  onSelect,
}: {
  option: RecordingLanguageOption;
  selected: boolean;
  onSelect: (key: string) => void;
}) {
  return (
    <button
      type="button"
      data-slot="recording-language-option"
      aria-pressed={selected}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-sm',
        selected ? 'bg-primary/10' : 'hover:bg-muted',
      )}
      onClick={() => onSelect(option.key)}
    >
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
          selected ? 'border-primary' : 'border-input',
        )}
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
      </span>
      <span className={cn(selected && 'font-medium')}>{option.label}</span>
    </button>
  );
}

/**
 * 翻译语种选择弹层（RecordingPage 翻译页签内建）：左列「原文语言识别」、
 * 右列「译文语言选择」单选列表（选中行主色淡化底 + 主色单选点），底部
 * 取消 / 确定；打开期间的选择为草稿，确定经 onConfirm 提交，取消 /
 * X / 遮罩关闭即丢弃。
 */
export function RecordingLanguageDialog({
  open,
  title,
  sourceTitle,
  targetTitle,
  sourceLanguages,
  targetLanguages,
  source,
  target,
  cancelLabel,
  confirmLabel,
  onSelectSource,
  onSelectTarget,
  onCancel,
  onConfirm,
}: RecordingLanguageDialogProps) {
  const renderColumn = (
    columnTitle: string,
    options: RecordingLanguageOption[],
    value: string | undefined,
    onSelect: (key: string) => void,
  ) => (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-sm font-medium">{columnTitle}</span>
      <div className="flex flex-col divide-y divide-border">
        {options.map((option) => (
          <LanguageOptionItem
            key={option.key}
            option={option}
            selected={option.key === value}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent
        data-slot="recording-language-dialog"
        className="gap-6 sm:max-w-xl"
      >
        <DialogTitle>{title}</DialogTitle>
        <div className="grid grid-cols-2 gap-6">
          {renderColumn(sourceTitle, sourceLanguages, source, onSelectSource)}
          {renderColumn(targetTitle, targetLanguages, target, onSelectTarget)}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button text={cancelLabel} onClick={onCancel} />
          <Button text={confirmLabel} variant="primary" onClick={onConfirm} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
