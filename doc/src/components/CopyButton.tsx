/**
 * 复制按钮（React 岛）：点击将 text 经 buildCopyText 加工后写入剪贴板
 * （末尾附来源注释：构建版本 + Git 提交号）。成功/失败均有明确反馈。
 */
import { useEffect, useRef, useState } from 'react';
import { buildCopyText, copyText, type CommentStyle } from '../lib/clipboard';

type CopyState = 'idle' | 'copied' | 'failed';

export default function CopyButton({
  text,
  label = '复制',
  commentStyle = 'auto',
  small = true,
}: {
  /** 要复制的原始内容（实际剪贴板内容会追加来源注释） */
  text: string;
  /** 按钮文案 */
  label?: string;
  /** 注释风格；auto 按内容自适应 # 或 // */
  commentStyle?: CommentStyle;
  /** 使用 btn small 尺寸（默认 true） */
  small?: boolean;
}) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onClick = async () => {
    if (timer.current) clearTimeout(timer.current);
    const ok = await copyText(buildCopyText(text, undefined, commentStyle));
    setState(ok ? 'copied' : 'failed');
    timer.current = setTimeout(() => setState('idle'), ok ? 1600 : 2400);
  };

  const cls =
    state === 'copied' ? 'btn copied' : state === 'failed' ? 'btn failed' : 'btn';
  return (
    <button
      type="button"
      className={small ? `${cls} small` : cls}
      onClick={onClick}
      data-copy-state={state}
    >
      {state === 'copied' ? '已复制 ✓' : state === 'failed' ? '复制失败' : label}
    </button>
  );
}
