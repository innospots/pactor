## Context

`packages/ui/src/ui/card.tsx`（vendored shadcn Card）硬编码 `rounded-xl`；DSL 适配器 `components/Card/index.tsx` 只暴露 `title`/`bordered`。圆角档位需静态类名映射（Tailwind v4 预编译扫描源码，动态拼接的类不会进产物）。

## Goals / Non-Goals

**Goals:**

- vendored Card 与 DSL Card 均支持 `rounded` 档位 prop，缺省 `rounded-lg`（即 `--radius` 基准值，随皮肤令牌缩放）

**Non-Goals:**

- 任意数值圆角（走既有 `className`/`style` 逃逸口）；其他组件的圆角提取（后续按需另开变更）

## Decisions

### D1: 静态档位映射，而非 style 内联

`rounded` 用 `Record<档位, 工具类>` 静态映射（rounded-none/sm/…/3xl），保证 Tailwind 预编译可见；映射置于内置类与 `className` 之间，tailwind-merge 下 `className` 仍可覆盖。档位不含 `full`（卡片全圆角非常态，需要时走 className）。

## Risks / Trade-offs

- [新增 prop 与 `bordered: false` 组合时无边框圆角仍生效] → 两者正交，无需处理
