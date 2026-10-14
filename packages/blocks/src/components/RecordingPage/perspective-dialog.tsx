import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@pactor-app/ui/ui';
import { Button } from '@pactor-app/ui/components';
import { Textarea } from '@pactor-app/ui/components';

export interface RecordingPerspectiveDialogProps {
  open: boolean;
  title: string;
  hint?: string;
  /** 草稿文本（弹层打开期间的编辑内容，应用才提交） */
  value?: string;
  placeholder?: string;
  cancelLabel: string;
  confirmLabel: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * 解读身份弹层（RecordingPage AI 解读页签内建）：标题 + 说明 + 多行输入
 * （自然语言描述身份与关注点），底部取消 / 应用身份；打开期间的编辑为
 * 草稿，应用经 onConfirm 提交，取消 / X / 遮罩关闭即丢弃。
 */
export function RecordingPerspectiveDialog({
  open,
  title,
  hint,
  value,
  placeholder,
  cancelLabel,
  confirmLabel,
  onChange,
  onCancel,
  onConfirm,
}: RecordingPerspectiveDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent
        data-slot="recording-perspective-dialog"
        className="gap-4 sm:max-w-xl"
      >
        <DialogTitle>{title}</DialogTitle>
        {hint !== undefined ? <DialogDescription>{hint}</DialogDescription> : null}
        <Textarea
          value={value}
          placeholder={placeholder}
          rows={4}
          onChange={onChange}
        />
        <div className="flex items-center justify-end gap-2">
          <Button text={cancelLabel} onClick={onCancel} />
          <Button text={confirmLabel} variant="primary" onClick={onConfirm} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
