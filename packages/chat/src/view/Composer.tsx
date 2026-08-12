import { Send, Square } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Composer（参考 DeepTutor web 输入区设计）：自适应高度 textarea +
 * 图标按钮。Enter 发送、Shift+Enter 换行；空文本（纯空白）不发送；
 * 流式中发送按钮变为停止按钮。
 */
export interface ComposerProps {
  /** 发送回调；输入框在回调后清空 */
  onSend?: (text: string) => void;
  /** 流式中为 true：按钮变为停止，点击触发 onStop */
  streaming?: boolean;
  /** 停止当前 turn */
  onStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

/** 输入框高度上限（px），超出后内部滚动 */
const MAX_INPUT_HEIGHT = 200;

export function Composer({
  onSend,
  streaming = false,
  onStop,
  placeholder = '输入消息，Enter 发送，Shift+Enter 换行',
  disabled = false,
}: ComposerProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自适应高度：内容变化时按 scrollHeight 增长，封顶 MAX_INPUT_HEIGHT
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, MAX_INPUT_HEIGHT)}px`;
    }
  }, [text]);

  const send = (): void => {
    const value = text.trim();
    if (!value || disabled) {
      return;
    }
    onSend?.(value);
    setText('');
  };

  return (
    <div className="pactor-chat-composer">
      <textarea
        ref={inputRef}
        className="pactor-chat-composer__input"
        rows={1}
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            send();
          }
        }}
      />
      {streaming ? (
        <button
          type="button"
          className="pactor-chat-composer__button pactor-chat-composer__button--stop"
          title="停止生成"
          aria-label="停止生成"
          onClick={onStop}
        >
          <Square size={14} fill="currentColor" />
        </button>
      ) : (
        <button
          type="button"
          className="pactor-chat-composer__button"
          title="发送"
          aria-label="发送"
          disabled={disabled || !text.trim()}
          onClick={send}
        >
          <Send size={14} />
        </button>
      )}
    </div>
  );
}
