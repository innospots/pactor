import { useEffect, useRef, useState, type MouseEvent } from "react";

import { cn } from "../../lib/utils.js";
import type { MessageListItem } from "../MessageList/index.js";

/** 导航块最多展示数量（默认保留最近提问，窗口随浏览位置左移） */
const MAX_VISIBLE = 10;
/** 浮层展示文案最多字数（超出补 ...；完整正文经 title 在 hover 时展示） */
const MAX_LABEL_CHARS = 10;

/** 提取提问正文 */
function questionText(message: MessageListItem): string {
  const text = (message.parts ?? [])
    .map((part) =>
      part.type === "text" || part.type === "markdown" ? part.content : "",
    )
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return text || "提问";
}

/** 截断到 MAX_LABEL_CHARS 个字符（超出补 ...） */
function truncatedLabel(text: string): string {
  const chars = Array.from(text);
  return chars.length > MAX_LABEL_CHARS
    ? `${chars.slice(0, MAX_LABEL_CHARS).join("")}...`
    : chars.join("");
}

export interface QuestionNavProps {
  /** 对话消息（仅取 role=user 的提问；少于两条时整栏隐藏） */
  messages?: MessageListItem[];
}

/**
 * 提问导航：导航块（默认 6×2，当前浏览的提问 12×2）全部位于浮层内，
 * 默认仅展示块列；hover 时浮层从中心向四周展开——背景 / 边框 / 阴影
 * 渐显、缩放回正、行距由 gap-1 放大到 gap-2，并在块左侧渐显全部提问
 * 文字（每条最多 10 字 + ...；hover 某条时浏览器 title 展示完整正文，
 * 且该条文字变 primary；默认灰色，当前浏览的提问 primary 加粗）。
 * 当前浏览位置的提问块加长并高亮（随消息列表滚动更新）。位于右端
 * aside 容器最左侧（sidePanel / 对话图标栏之前），整体垂直居中。
 */
export function QuestionNav({ messages = [] }: QuestionNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const questions = messages.filter((message) => message.role === "user");
  const questionKey = questions
    .map((message, index) => message.id ?? `#${index}`)
    .join("|");

  // 滚动联动：消息列表底部对齐最后一条；否则取视口顶部最后一条提问
  useEffect(() => {
    const nav = navRef.current;
    const conversation = nav?.closest('[data-slot="chat-page-conversation"]');
    const list = conversation?.querySelector<HTMLElement>(
      '[data-slot="message-list"]',
    );
    if (!list) return;

    const update = () => {
      const nodes = Array.from(
        list.querySelectorAll<HTMLElement>(
          '[data-slot="chat-message"][data-role="user"]',
        ),
      );
      if (nodes.length === 0) {
        setActiveIndex(null);
        return;
      }
      const atBottom =
        list.scrollTop + list.clientHeight >= list.scrollHeight - 2;
      let next = atBottom ? nodes.length - 1 : 0;
      if (!atBottom) {
        const threshold = list.getBoundingClientRect().top + 24;
        for (let i = 0; i < nodes.length; i += 1) {
          if (nodes[i].getBoundingClientRect().top <= threshold) next = i;
          else break;
        }
      }
      setActiveIndex((prev) => (prev === next ? prev : next));
    };

    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      list.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [questionKey]);

  // 只有一条提问时不展示
  if (questions.length <= 1) {
    return null;
  }
  // 最多展示 10 个：默认保留最近提问；当前浏览的提问更早时，
  // 窗口左移到包含该提问（保证高亮块始终在列内）
  const recentStart = Math.max(0, questions.length - MAX_VISIBLE);
  const start =
    activeIndex !== null && activeIndex < recentStart
      ? Math.max(0, activeIndex - Math.floor(MAX_VISIBLE / 2))
      : recentStart;
  const visible = questions.slice(start, start + MAX_VISIBLE);
  const offset = start;

  const jumpTo = (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
    const conversation = event.currentTarget.closest(
      '[data-slot="chat-page-conversation"]',
    );
    const target = conversation
      ?.querySelectorAll(
        '[data-slot="message-list"] [data-slot="chat-message"][data-role="user"]',
      )
      .item(index) as HTMLElement | null;
    // jsdom 未实现 scrollIntoView，可选调用兼容测试环境
    target?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      ref={navRef}
      data-slot="chat-page-question-nav"
      aria-label="提问导航"
      className="group relative flex w-7 shrink-0 flex-col self-center"
    >
      {/* 浮层：导航块与提问文字都在其中。默认透明、仅露出块列；
          hover / focus 时背景与边框渐显，文字向左展开（块位置不变） */}
      <div
        data-slot="chat-page-question-nav-popover"
        className="pointer-events-none absolute top-1/2 right-2 z-10 flex -translate-y-1/2 flex-col gap-1 rounded-lg px-4 py-3 transition-[gap] duration-200 ease-out group-hover:pointer-events-auto group-hover:gap-2 group-focus-within:pointer-events-auto group-focus-within:gap-2"
      >
        {/* 浮层背景：从中心向四周缩放展开并渐显（不缩放块，保证块尺寸精确） */}
        <div
          data-slot="chat-page-question-nav-popover-bg"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-lg border border-transparent bg-transparent opacity-0 shadow-none transition-[background-color,border-color,box-shadow,opacity,scale] duration-200 ease-out group-hover:scale-100 group-hover:border-border group-hover:bg-popover group-hover:opacity-100 group-hover:shadow-md group-focus-within:scale-100 group-focus-within:border-border group-focus-within:bg-popover group-focus-within:opacity-100 group-focus-within:shadow-md"
        />
        {visible.map((message, index) => {
          const text = questionText(message);
          const label = truncatedLabel(text);
          const itemIndex = offset + index;
          const active = activeIndex === itemIndex;
          return (
            <button
              key={message.id ?? itemIndex}
              type="button"
              data-slot="chat-page-question-nav-label"
              title={text}
              aria-label={`跳转到提问：${text}`}
              aria-current={active ? "true" : undefined}
              className="group/item pointer-events-auto flex cursor-pointer items-center justify-end gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
              onClick={jumpTo(itemIndex)}
            >
              <span
                className={cn(
                  "max-w-0 overflow-hidden text-right text-xs leading-none whitespace-nowrap opacity-0 transition-[max-width,opacity,color] duration-200 ease-out group-hover:max-w-60 group-hover:opacity-100 group-focus-within:max-w-60 group-focus-within:opacity-100",
                  active
                    ? "font-semibold text-primary"
                    : "text-muted-foreground group-hover/item:text-primary group-focus-within/item:text-primary",
                )}
              >
                {label}
              </span>
              {/* 固定 12px 槽位、右对齐：块加长时标签位置不跳动 */}
              <span className="flex w-3 shrink-0 justify-end">
                <span
                  data-slot="chat-page-question-nav-item"
                  aria-hidden="true"
                  className={cn(
                    "h-[2px] rounded-full transition-[width,background-color] duration-200",
                    active
                      ? "w-3 bg-primary"
                      : "w-1.5 bg-muted-foreground/30",
                  )}
                />
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
