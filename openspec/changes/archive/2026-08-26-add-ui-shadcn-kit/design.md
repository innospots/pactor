# Design: add-ui-shadcn-kit

## Context

pactor 的 UI kit 是槽位架构：`createPactorApplication({ ui?, componentRegistry?, layoutRegistry?, interactionKit? })`，三级回退（显式细粒度 > ui 预设 > 内建默认），当前内建默认为 `pactor-ui-radix`。kit 契约固定：12 个 DSL 组件类型（props 契约类型由 `pactor-ui-antd/components` 拥有，radix 侧 type-only 复用）、4 个布局名（admin/blank/login/landing）、交互对（Provider 注入 UiBridge / OverlayHost 渲染 overlay 栈）、`./styles.css` 导出。renderer 按 `registry.get(node.type)` 解析，kit 即注册表工厂。

shadcn/ui 不是 npm 依赖型库，而是"vendored 源码"模式：组件源码复制进项目，基于 Radix Primitives + Tailwind + cva。

## Goals / Non-Goals

**Goals:**
- `packages/ui`（`pactor-ui`）：shadcn 风格实现 12 组件契约 + 4 布局 + 交互对，`shadcnUiKit` 预设。
- 成为 `createPactorApplication` 三槽位默认。
- 消费契约不变：`import 'pactor-ui/styles.css'` 即可，消费方无需 Tailwind。

**Non-Goals:**
- 不删除/改动 ui-antd、ui-radix。
- 不做 shadcn 全量组件（V1 仅契约所需 + 布局/交互底层件）。
- 不引入消费侧 Tailwind 配置要求。

## Decisions

### D1: shadcn 落地 = vendored 源码 + 构建期 Tailwind 预编译
组件源码置于 `packages/ui/src/ui/`（button/input/select/tabs/dialog/card/form/table 等 shadcn 件），其上写 DSL 适配层（`src/components/*`）。Tailwind v4 仅在包构建期运行：入口 `src/styles.css`（`@import 'tailwindcss'` + 主题令牌）→ 预建产物 `styles.css`（package root，exports/sideEffects 同 ui-radix 约定）。消费方零 Tailwind 配置。

**替代方案**：消费方各自跑 Tailwind 扫描。否决——把构建复杂度推给所有消费方，违背 kit 即插即用契约。

**替代方案**：运行时 CDN/内联样式。否决——不可缓存、不可主题化。

### D2: 工具链三件套按 shadcn 标准
`clsx` + `tailwind-merge` 合成 `cn()`；`class-variance-authority` 管 variant；图标 `lucide-react`。Radix Primitives 按组件需要引入（dialog/popover/select/tabs/form/accordion 等，参考 ui-radix 的依赖清单）。

### D3: 契约复用而非重定义
props 类型 type-only re-export 自 `pactor-ui-antd/components`（与 ui-radix 相同先例）；OverlayManager/createUiBridge/registerInteractionActions 运行时复用 `pactor-ui-antd/interaction`。契约测试断言 `createShadcnComponentRegistry().list()` 与 antd/radix 注册表相等。

### D4: 主题令牌桥接
shadcn 语义变量（`--background/--foreground/--card/--primary/--secondary/--muted/--accent/--destructive/--border/--input/--ring` + radius）定义在 `:root`，暗色挂 `[data-pactor-theme='dark']`（仓库既有约定，不用 shadcn 默认的 `.dark` class），保证 admin 示例的 theme.css 皮肤机制与明暗切换方式跨 kit 一致。

### D5: 默认切换最小侵入
`packages/app/src/application.ts` 三处 fallback 由 radix 改为 shadcn；`pactor-app` 运行时依赖从 pactor-ui-radix 改 pactor-ui（radix 降为 devDep 供测试）。antd/radix 经显式 `ui:` 预设继续可用，行为不变。

## Risks / Trade-offs

- [与 pactor-ui-radix 定位重叠：同为 Radix 系，视觉差异主要靠 Tailwind 主题] → 接受。shadcn 的价值在社区熟悉度与组件生态可增量 vendor；ui-radix 保留为零 Tailwind 的轻量备选。文档中说明三者选型建议。
- [Tailwind 预建 CSS 与宿主样式冲突（全局 utility/reset）] → 预建产物限定 preflight 关闭或 scoped（`@layer` + 仅组件用到的 utilities）；测试 admin 示例无回归。
- [三套 kit 维护成本] → 契约测试保证三注册表同构；props 类型单一来源（ui-antd）。
- [Tailwind v4 与 tsup 构建链整合] → styles 构建用独立 script（tailwind CLI）而非塞进 tsup，build 串联两步。

## Migration Plan

1. 新增包并达标（契约测试全绿）。
2. application.ts 切默认 + 示例/模板样式导入改 `pactor-ui/styles.css`。
3. 既有消费方不受影响（显式指定 kit 的行为不变；未指定的从 Radix 视觉变为 shadcn 视觉——语义 API 不变）。

## Open Questions

- Tailwind 版本：v4（CSS-first config）为当前主版本，采用；若仓库 Node/vite 链有兼容问题再退 v3。
- preflight（Tailwind reset）是否开启：倾向关闭或以 `.pcr-*` 作用域限定，避免影响宿主全局样式——实现时以 admin 示例无视觉回归为准。
