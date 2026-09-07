import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import { ArrowUp } from 'lucide-react';
import {
  useRef,
  useState,
  type CSSProperties,
  type CompositionEvent,
  type KeyboardEvent,
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
  /** 隐藏内建发送钮（工具栏右端完全自定义的场景） */
  hideSend?: boolean;
  /** 工具栏左端槽（DslNode 子树，经 Renderer children 机制渲染） */
  toolbarStart?: DslNode;
  /** 工具栏右端槽（发送钮之前） */
  toolbarEnd?: DslNode;
  /** 顶部区槽（提供时渲染在 textarea 上方，与 footer 对称；附件卡片、上下文 chips 等输入上下文展示） */
  header?: DslNode;
  /** 底部区槽（提供时渲染，与工具栏以分隔线相隔） */
  footer?: DslNode;
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
 * （focus-within 高亮）内依次承载自适应高度 textarea、工具栏行与
 * 可选底部区；工具栏与底部区内容完全由 DSL 槽位自定义。
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
  onChange,
  onSubmit,
  className,
  style,
}: ChatInputProps) {
  const { renderChildren } = useRenderer();
  const controlled = value !== undefined;
  const [draft, setDraft] = useState('');
  const text = controlled ? value : draft;
  const canSubmit = !disabled && text.trim() !== '';

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
        'rounded-xl border border-border bg-background transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
        className,
      )}
      style={style}
    >
      {header ? (
        <div className="px-3 pt-3">{renderChildren([header])}</div>
      ) : null}
      <ShadcnTextarea
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleComposition}
        onCompositionEnd={handleComposition}
        className="resize-none border-0 px-4 pt-3 pb-1 shadow-none focus-visible:border-transparent focus-visible:ring-0"
      />
      <div className="flex items-center gap-1 px-2 pb-2">
        {toolbarStart ? renderChildren([toolbarStart]) : null}
        <span className="flex-1" />
        {toolbarEnd ? renderChildren([toolbarEnd]) : null}
        {hideSend ? null : (
          <ShadcnButton
            type="button"
            size="icon"
            aria-label="发送"
            disabled={!canSubmit}
            onClick={submit}
            className="size-8 rounded-full"
          >
            <ArrowUp />
          </ShadcnButton>
        )}
      </div>
      {footer ? (
        <div className="border-t border-border px-3 py-2">
          {renderChildren([footer])}
        </div>
      ) : null}
    </div>
  );
}
