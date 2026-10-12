import { useState } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '../../../ui/dialog.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../ui/popover.js';
import { Button } from '../../components/Button/index.js';
import { Icon } from '../../components/Icon/index.js';
import type { RecordingShareOption } from './types.js';

export interface RecordingShareProps {
  /** 「分享」按钮文案 */
  shareLabel: string;
  options: RecordingShareOption[];
  /** 已提交选中 key 列表（受控 / 非受控已由 RecordingPage 解析） */
  selectedKeys: string[];
  popoverTitle: string;
  cancelLabel: string;
  confirmLabel: string;
  dialogTitle: string;
  link?: string;
  copyLinkLabel: string;
  /** 复制成功后的短暂按钮文案，缺省「已复制」（由 RecordingPage 传入） */
  copiedLabel: string;
  mailLabel: string;
  systemLabel: string;
  onShare?: () => void;
  /** Popover「确定」提交选中列表 */
  onSelectionCommit: (keys: string[]) => void;
  onShareConfirm?: (keys: string[]) => void;
  onShareChannel?: (channel: string) => void;
}

/** 写剪贴板：Clipboard API 优先，不可用（非安全上下文 / 测试环境）时退化 execCommand */
function copyText(text: string): void {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand?.('copy');
    textarea.remove();
  } catch {
    // 剪贴板不可用时静默：渠道事件仍正常传出
  }
}

/**
 * 分享交互（RecordingPage 头部「分享」按钮）：点击按钮下方弹出
 * 「选择分享内容」Popover（圆形复选列表，禁用项锁定勾选；打开期间的
 * 勾选为草稿，取消丢弃），确定提交 onSelectionCommit / onShareConfirm
 * 并打开「分享会议内容」对话框（链接 + 复制链接（真实写剪贴板，成功后
 * 按钮短暂变为已复制）/ 邮件 / 系统分享，渠道点击经 onShareChannel 传出）。
 */
export function RecordingShare({
  shareLabel,
  options,
  selectedKeys,
  popoverTitle,
  cancelLabel,
  confirmLabel,
  dialogTitle,
  link,
  copyLinkLabel,
  copiedLabel,
  mailLabel,
  systemLabel,
  onShare,
  onSelectionCommit,
  onShareConfirm,
  onShareChannel,
}: RecordingShareProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftKeys, setDraftKeys] = useState<string[]>(selectedKeys);
  const [copied, setCopied] = useState(false);

  const copyLink = (): void => {
    if (link !== undefined) {
      copyText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
    onShareChannel?.('copyLink');
  };

  const openPopover = (next: boolean): void => {
    if (next) {
      setDraftKeys(selectedKeys);
      onShare?.();
    }
    setPopoverOpen(next);
  };
  const toggleOption = (option: RecordingShareOption): void => {
    if (option.disabled === true) return;
    setDraftKeys((prev) =>
      prev.includes(option.key)
        ? prev.filter((key) => key !== option.key)
        : [...prev, option.key],
    );
  };
  const confirm = (): void => {
    // 按选项顺序输出，与勾选先后无关
    const next = options
      .filter((option) => draftKeys.includes(option.key))
      .map((option) => option.key);
    onSelectionCommit(next);
    onShareConfirm?.(next);
    setPopoverOpen(false);
    setDialogOpen(true);
  };

  const trigger = <Button text={shareLabel} size="small" />;

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={openPopover}>
        <PopoverTrigger
          nativeButton={false}
          render={<span data-slot="recording-share-trigger" className="inline-flex" />}
        >
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-64 p-0"
          data-slot="recording-share-popover"
        >
          <div className="px-4 pt-4 pb-2 text-sm font-semibold">{popoverTitle}</div>
          <div className="flex flex-col px-2 pb-2">
            {options.map((option) => {
              const checked = draftKeys.includes(option.key);
              const disabled = option.disabled === true;
              return (
                <button
                  key={option.key}
                  type="button"
                  data-slot="recording-share-option"
                  aria-pressed={checked}
                  disabled={disabled}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm',
                    disabled
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:bg-muted',
                  )}
                  onClick={() => toggleOption(option)}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                      checked ? 'bg-primary text-primary-foreground' : 'border border-input',
                    )}
                  >
                    {checked ? <Icon name="check" size={12} /> : null}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
            <Button text={cancelLabel} variant="text" onClick={() => setPopoverOpen(false)} />
            <Button text={confirmLabel} variant="primary" onClick={confirm} />
          </div>
        </PopoverContent>
      </Popover>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-slot="recording-share-dialog" className="gap-4 sm:max-w-xl">
          <DialogTitle>{dialogTitle}</DialogTitle>
          {link !== undefined ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
              <span className="min-w-0 flex-1 truncate text-sm">{link}</span>
              <Button
                text={copied ? copiedLabel : copyLinkLabel}
                variant="link"
                size="small"
                onClick={copyLink}
              />
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <Button
              text={mailLabel}
              icon="mail"
              className="h-12"
              onClick={() => onShareChannel?.('mail')}
            />
            <Button
              text={systemLabel}
              icon="share"
              className="h-12"
              onClick={() => onShareChannel?.('system')}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
