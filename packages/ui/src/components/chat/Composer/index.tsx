import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { ChatInput } from '../../components/ChatInput/index.js';
import { Attachment, type AttachmentItemData } from '../Attachment/index.js';

export interface ComposerProps {
  /** 受控值（提供即受控） */
  value?: string;
  /** 占位提示 */
  placeholder?: string;
  /** 禁用输入与发送 */
  disabled?: boolean;
  /** 发送中（禁用发送钮，由调用方在完成后复位） */
  loading?: boolean;
  /** 最小行数，缺省 3 */
  rows?: number;
  /** 附件列表（展示在输入区上方） */
  attachments?: AttachmentItemData[];
  /** 附件移除事件，传出 id / 下标 */
  onRemoveAttachment?: (id: string | number) => void;
  /** 附件重试事件，传出 id / 下标 */
  onRetryAttachment?: (id: string | number) => void;
  /** 输入事件，传出 string 值 */
  onChange?: (value: string) => void;
  /** 发送事件（点击发送钮或 Enter），传出当前文本 */
  onSubmit?: (value: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Composer 适配器（shadcn kit）：会话输入组合件——
 * 附件区（Attachment）+ 输入区（ChatInput）；
 * 上传 / transport 由调用方负责，本组件只做呈现与事件上报。
 */
export function Composer({
  value,
  placeholder,
  disabled,
  loading,
  rows,
  attachments = [],
  onRemoveAttachment,
  onRetryAttachment,
  onChange,
  onSubmit,
  className,
  style,
}: ComposerProps) {
  return (
    <div data-slot="composer" className={cn('flex w-full flex-col gap-2', className)} style={style}>
      {attachments.length > 0 ? (
        <Attachment items={attachments} onRemove={onRemoveAttachment} onRetry={onRetryAttachment} />
      ) : null}
      <ChatInput
        value={value}
        placeholder={placeholder}
        disabled={disabled || loading}
        rows={rows}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
