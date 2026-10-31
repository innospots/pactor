import type { CSSProperties } from 'react';

import { MarkdownEditor } from './editor.js';

export interface MarkdownEditorDslComponentProps {
  /**
   * Markdown 内容（DSL props.value）。
   * `${state.xxx}` 等表达式由 Renderer 在 props 下发前解析；
   * 外部 value 变化经 setMarkdown 同步进编辑器（见 MarkdownEditor）。
   */
  value?: string;
  /** 占位文本 */
  placeholder?: string;
  /** 只读模式（隐藏工具栏；权限 denied 策略 readonly 注入同名字段） */
  readOnly?: boolean;
  /** 是否渲染工具栏，默认 true */
  toolbar?: boolean;
  /** 自动聚焦 */
  autoFocus?: boolean;
  /**
   * 内容变化回调（由 DSL events.onChange 绑定注入）：
   * 事件对象为新的 Markdown 字符串，action 中以 `${event}` 引用。
   */
  onChange?: (value: string) => void;
  /** 通用：根节点 class（与基础 class 并存） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * DSL 组件适配：`{ type: 'MarkdownEditor', props: { value }, events: { onChange } }`。
 * 仅做 props 透传，编辑能力全部委托给 MarkdownEditor。
 * 典型用法：value 绑定 state 表达式，onChange action 把 `${event}` 写回同一 state。
 */
export function MarkdownEditorDslComponent({
  value,
  placeholder,
  readOnly,
  toolbar,
  autoFocus,
  onChange,
  className,
  style,
}: MarkdownEditorDslComponentProps) {
  return (
    <MarkdownEditor
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      toolbar={toolbar}
      autoFocus={autoFocus}
      onChange={onChange}
      className={className}
      style={style}
    />
  );
}
