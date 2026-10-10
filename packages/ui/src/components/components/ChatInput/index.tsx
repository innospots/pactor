import type { DslNode } from '@pactor-app/core';
import { useI18n } from '@pactor-app/runtime';
import { useRenderer } from '@pactor-app/runtime';
import { ArrowUp } from 'lucide-react';
import {
  isValidElement,
  useRef,
  useState,
  type CSSProperties,
  type CompositionEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { cn } from '../../../lib/utils.js';
import { Button as ShadcnButton } from '../../../ui/button.js';
import { Textarea as ShadcnTextarea } from '../../../ui/textarea.js';

export interface ChatInputProps {
  /** 受控值（提供即受控：变更只经 onChange 传出，显示值取自 props） */
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  /** 最小行数（高度随内容自适应，rows 为下限；缺省 3） */
  rows?: number;
  /**
   * 隐藏内建发送钮（工具栏右端完全自定义的场景）；
   * hideSend 且左右槽均未提供时工具栏行整体零渲染
   */
  hideSend?: boolean;
  /** 工具栏左端槽（DslNode 子树经 Renderer 渲染；React 宿主可直接传元素） */
  toolbarStart?: DslNode | ReactNode;
  /** 工具栏右端槽（发送钮之前） */
  toolbarEnd?: DslNode | ReactNode;
  /** 顶部区槽（提供时渲染在 textarea 上方，与 footer 对称；附件卡片、上下文 chips 等输入上下文展示） */
  header?: DslNode | ReactNode;
  /** 底部区槽（提供时渲染，与工具栏以分隔线相隔） */
  footer?: DslNode | ReactNode;
  /**
   * 自定义输入区（提供时替换内建 textarea）：调用方自持编辑面
   * （如 contenteditable 行内提及输入区）；此时文本仍经受控
   * value 驱动（canSubmit / 发送钮禁用逻辑），Enter 发送由自定义
   * 输入区自行处理（内建 textarea 的键盘语义不生效）
   */
  field?: ReactNode;
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
 * ChatInput 适配器（shadcn kit）：AI 对话输入框的通用结构构件
 * （spec: shadcn-extended-components / ChatInput）——外层圆角容器
 * （focus-within 高亮）内依次承载自适应高度 textarea（输入区最小
 * 高度 60px）、工具栏行与可选底部区；工具栏与底部区内容完全由
 * DSL 槽位自定义；工具栏行在左右槽均未提供且 hideSend 时整体零渲染。
 *
 * 发送语义：点击发送钮或 Enter（Shift+Enter 换行；IME 合成中 Enter
 * 不发送；trim 后空白禁发且发送钮禁用）；非受控发送后自动清空，
 * 受控模式由调用方在 onSubmit 闭环里清空。
 *
 * 定位为通用结构构件：transport / 附件 / 提及等对话领域能力请使用
 * @pactor-app/chat 的 Composer。
 */
export function ChatInput({
  value,
  placeholder,
  disabled,
  rows = 3,
  hideSend,
  toolbarStart,
  toolbarEnd,
  header,
  footer,
  field,
  onChange,
  onSubmit,
  className,
  style,
}: ChatInputProps) {
  const { renderChildren } = useRenderer();
  const controlled = value !== undefined;
  const [draft, setDraft] = useState('');
  const { t } = useI18n();
  const text = controlled ? value : draft;
  const canSubmit = !disabled && text.trim() !== '';
  // 自定义输入区（field）模式：编辑面由调用方自持，此处不维护草稿
  const customField = field !== undefined && field !== null;

  // 槽位渲染：React 元素直接渲染，其余按 DslNode 走 Renderer
  const renderSlot = (slot: DslNode | ReactNode): ReactNode =>
    isValidElement(slot) || typeof slot !== 'object' || slot === null
      ? slot
      : renderChildren([slot as DslNode]);

  // IME 合成守卫（chat Composer 同语义）：合成中 Enter 不发送
  const composingRef = useRef(false);

  const handleChange = (next: string): void => {
    if (!controlled) {
      setDraft(next);
    }
    onChange?.(next);
  };

  const submit = (): void => {
    if (!canSubmit) {
      return;
    }
    onSubmit?.(text);
    if (!controlled) {
      setDraft('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !composingRef.current &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  };

  const handleComposition = (event: CompositionEvent<HTMLTextAreaElement>): void => {
    composingRef.current = event.type === 'compositionstart';
  };

  return (
    <div
      data-slot="chat-input"
      className={cn(
        'rounded-xl border border-border bg-card transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
        className,
      )}
      style={style}
    >
      {header ? (
        <div className="px-3 pt-3">{renderSlot(header)}</div>
      ) : null}
      {customField ? (
        field
      ) : (
        <ShadcnTextarea
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
          className="min-h-[60px] resize-none border-0 px-4 pt-3 pb-1 shadow-none focus-visible:border-transparent focus-visible:ring-0"
        />
      )}
      {toolbarStart || toolbarEnd || !hideSend ? (
        <div className="flex items-center gap-1 px-2 pb-2">
          {toolbarStart ? renderSlot(toolbarStart) : null}
          <span className="flex-1" />
          {toolbarEnd ? renderSlot(toolbarEnd) : null}
          {hideSend ? null : (
            <ShadcnButton
              type="button"
              size="icon"
              aria-label={t('pactor.chatInput.send')}
              disabled={!canSubmit}
              onClick={submit}
              className="size-8 rounded-full"
            >
              <ArrowUp />
            </ShadcnButton>
          )}
        </div>
      ) : null}
      {footer ? (
        <div className="border-t border-border px-3 py-2">
          {renderSlot(footer)}
        </div>
      ) : null}
    </div>
  );
}
