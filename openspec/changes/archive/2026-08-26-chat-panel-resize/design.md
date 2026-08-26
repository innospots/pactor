# Design: chat-panel-resize

## Context

面板宽度 `width: var(--pactor-chat-inspector-width)`（320px）固定于 CSS。需要拖拽手柄实时调宽。

## Decisions

### D1：拖拽在 ArtifactPanel 内部自持，无新 props

手柄（面板左缘 6px 热区，`role="separator"` + `aria-orientation="vertical"` + aria-label）pointerdown 记录起点与当前宽度，document 级 pointermove/pointerup 跟踪；宽度 = 起始宽 + (起点X − 当前X)（向左拖变宽），夹取 [240, 容器宽×0.7]（容器 = 父级 inspector-host；getBoundingClientRect 宽为 0 时——如 jsdom——回退 window.innerWidth）；结果存内部 state，inline `style.width` 覆盖令牌缺省。拖拽期间 body `user-select: none` 防选文本。

**备选**：受控 `panelWidth` prop + onPanelResize 事件 —— 否决：用户只要求可拖，受控化是过度设计；后续有需求再加（与受控优先模式兼容）。拖拽逻辑放 ChatComposition —— 否决：面板自述其尺寸，组合层无感知。

### D2：窄屏禁拖

<768px 覆盖抽屉形态下手柄 `display: none`（同 AppShell 断点，CSS 媒体查询表达）。

## Risks / Trade-offs

- [拖拽后窄屏覆盖抽屉保留拖拽宽度] → 可接受（用户显式选择的宽度）。
- [jsdom 无布局] → 测试 mock/回退 window.innerWidth 路径覆盖。
