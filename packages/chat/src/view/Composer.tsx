import { Button, Input } from 'antd';
import { useState } from 'react';

/**
 * Composer（设计决策 D6）：受控输入 + 发送。
 * Enter 发送、Shift+Enter 换行；空文本（纯空白）不发送。
 */
export interface ComposerProps {
  /** 发送回调；输入框在回调后清空 */
  onSend?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Composer({
  onSend,
  placeholder = '输入消息，Enter 发送，Shift+Enter 换行',
  disabled = false,
}: ComposerProps) {
  const [text, setText] = useState('');

  const send = (): void => {
    const value = text.trim();
    if (!value || disabled) {
      return;
    }
    onSend?.(value);
    setText('');
  };

  return (
    <div
      className="pactor-chat-composer"
      style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}
    >
      <Input.TextArea
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        autoSize={{ minRows: 1, maxRows: 6 }}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            send();
          }
        }}
      />
      <Button
        type="primary"
        disabled={disabled || !text.trim()}
        onClick={send}
      >
        发送
      </Button>
    </div>
  );
}
