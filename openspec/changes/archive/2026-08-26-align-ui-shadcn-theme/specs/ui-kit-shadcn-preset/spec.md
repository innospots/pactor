# Delta: ui-kit-shadcn-preset

## MODIFIED Requirements

### Requirement: 预建样式与主题

Tailwind SHALL 仅在包构建期运行：入口样式（完整 `@import 'tailwindcss'`，含 preflight）编译为预建 `styles.css` 随包发布，消费方 MUST NOT 需要自身 Tailwind 配置。主题 SHALL 对齐 shadcn 官方默认主题脚手架：语义令牌（`--background/--foreground/--card/--popover/--primary/--secondary/--muted/--accent/--destructive/--border/--input/--ring` 及 `-foreground` 配对，另含 `chart-1..5` 与 `sidebar` 系列）定义于 `:root`，暗色覆盖 SHALL 经 `[data-pactor-theme='dark']` 属性切换（全仓约定，不用官方 `.dark` class）；radius 派生 SHALL 为基于 `--radius` 的乘法比例（sm 0.6 / md 0.8 / lg 基准 / xl 1.4 / 2xl 1.8 / 3xl 2.2 / 4xl 2.6）；`@theme inline` SHALL 将全部语义令牌桥接为 Tailwind 工具类。样式表 SHALL 含官方 base layer（`* { border-border outline-ring/50 }`、`body { bg-background text-foreground }`）与动画层（tw-animate-css 及 accordion 关键帧），使弹层/折叠组件具备进退场动画。preflight SHALL 开启（与 shadcn 官方应用基线一致）；导入 `styles.css` 即接受该基线全局样式。

#### Scenario: 零配置消费

- **WHEN** 消费方仅 `import 'pactor-ui/styles.css'` 后渲染 DSL 页面
- **THEN** 组件样式完整（含 preflight 基线：原生 button 无 UA 默认边框、字体为 sans 系统栈）

#### Scenario: 暗色切换

- **WHEN** 根元素设置 `data-pactor-theme="dark"`
- **THEN** 组件呈现暗色皮肤

#### Scenario: 弹层进退场动画

- **WHEN** 打开 Dialog 或 Select 弹层
- **THEN** `animate-in` / `fade-in-0` / `zoom-in-95` 等动画工具类在预建样式表中有对应定义
