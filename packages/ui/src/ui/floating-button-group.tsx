import * as React from 'react';

import { cn } from '../lib/utils.js';

export interface FloatingButtonGroupOption {
  /** 语义化值，点击后经 onSelect 抛出 */
  value: string;
  /** 可选文字 */
  label?: React.ReactNode;
  /** 可选图标节点 */
  icon?: React.ReactNode;
  /** 单项禁用 */
  disabled?: boolean;
}

export interface FloatingButtonGroupProps {
  /** 选项列表 */
  options: FloatingButtonGroupOption[];
  /** 受控当前项：提供时共享高亮块恒定位于该项 */
  value?: string;
  /** 点击选项回调，携带 option.value */
  onSelect?: (value: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: React.CSSProperties;
}

interface HighlightBox {
  x: number;
  width: number;
}

/**
 * FloatingButtonGroup 托盘式按钮组：扩展按钮组件，交互设计参考
 * arc-library（https://github.com/kuratlielia/arc-library），Tailwind 实现。
 * 托盘容器内渲染独立按钮，共享高亮块绝对定位，经 ref 测量目标按钮
 * offsetLeft/offsetWidth，以 transform/width 过渡在 hover 与 focus-visible
 * 的按钮间滑动；离开组后淡出（受控 value 提供时高亮恒定位于该项）。
 * jsdom 等无布局环境下测量为 0 时跳过更新（防御，不抛错）。
 */
function FloatingButtonGroup({
  options,
  value,
  onSelect,
  className,
  style,
}: FloatingButtonGroupProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRefs = React.useRef(new Map<string, HTMLButtonElement>());
  // 指针/键盘目标：hover 或 :focus-visible 聚焦的选项值
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [box, setBox] = React.useState<HighlightBox | null>(null);
  const [visible, setVisible] = React.useState(false);

  // 高亮目标：受控 value 恒定优先，否则跟随 hover/focus
  const target = value ?? hovered;

  React.useLayoutEffect(() => {
    if (!target) {
      setVisible(false);
      return;
    }
    const el = buttonRefs.current.get(target);
    // 0 尺寸测量防御（jsdom / 未挂载）：不更新位置，仅隐藏
    if (!el || el.offsetWidth === 0) {
      setVisible(false);
      return;
    }
    setBox({ x: el.offsetLeft, width: el.offsetWidth });
    setVisible(true);
  }, [target]);

  return (
    <div
      ref={containerRef}
      role="group"
      data-slot="floating-button-group"
      className={cn(
        'relative inline-flex w-fit items-center gap-1 rounded-full bg-muted p-1',
        className,
      )}
      style={style}
      onMouseLeave={() => setHovered(null)}
    >
      <span
        data-slot="floating-button-group-highlight"
        aria-hidden="true"
        className={cn(
          'absolute inset-y-1 left-0 rounded-full bg-card shadow-sm transition-[transform,width,opacity] duration-200 ease-out motion-reduce:transition-none',
          visible ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          width: box?.width ?? 0,
          transform: `translateX(${box?.x ?? 0}px)`,
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          ref={(el) => {
            if (el) buttonRefs.current.set(option.value, el);
            else buttonRefs.current.delete(option.value);
          }}
          data-slot="floating-button-group-item"
          data-value={option.value}
          data-active={value === option.value ? '' : undefined}
          disabled={option.disabled}
          className={cn(
            'relative z-10 inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-sm font-medium whitespace-nowrap outline-none transition-[transform,color] duration-150 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:transform-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
            target === option.value
              ? 'text-foreground'
              : 'text-muted-foreground',
          )}
          onMouseEnter={() => setHovered(option.value)}
          onFocus={(event) => {
            if (event.currentTarget.matches(':focus-visible')) {
              setHovered(option.value);
            }
          }}
          onBlur={() => setHovered(null)}
          onClick={() => onSelect?.(option.value)}
        >
          {option.icon}
          {option.label ? <span>{option.label}</span> : null}
        </button>
      ))}
    </div>
  );
}

export { FloatingButtonGroup };
