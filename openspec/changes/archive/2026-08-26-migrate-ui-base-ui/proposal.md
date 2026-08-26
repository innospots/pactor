# migrate-ui-base-ui

## Why

shadcn 自 2026-07 起把默认原语层从 Radix UI 切换为 [Base UI](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)（原 Radix 团队的新原语库，API 更现代、维护更活跃），Radix 虽仍受支持但上游新组件/修复将优先落在 Base UI 版。pactor-ui vendored 的 9 个组件全部基于 `@radix-ui/react-*`（9 个依赖包），继续使用意味着与官方默认轨道渐行渐远。用户决策：移除 radix-ui，替换为 Base UI。

## What Changes

- 依赖替换：新增 `@base-ui/react`，移除全部 9 个 `@radix-ui/react-*` 依赖（accordion/dialog/form/label/popover/select/separator/slot/tabs）。
- 重新 vendor 组件层（`packages/ui/src/ui/`）：button（Slot→render 模式）、accordion、dialog、popover、select、tabs、separator、label，以 shadcn 官方 Base UI 版组件源码为准（`https://ui.shadcn.com/docs/components/base/*`）。
- Form 适配层改造：`@radix-ui/react-form`（Root/Field/Control/Label）→ Base UI 的 Field/Form 或等价自管实现，保持 `Form`/`Input`/`Select` 三个 DSL 适配组件的契约语义不变（受控 values、rules 校验、form 作用域写入、onValuesChange 首参语义等）。
- 适配点同步：admin 布局（Accordion/Popover 用法）、交互层 OverlayHost（Dialog）、样式层（accordion 动画变量、弹层 enter/exit 数据属性差异）。
- 已知 radix 特定坑位清理：react-remove-scroll 的 body 滚动锁行为（MEMORY 坑 #7）、Radix Select 受控切换空串回调的规避代码——按 Base UI 行为重新验证。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `ui-kit-shadcn-preset`: "pactor-ui 包结构"需求中的"Radix Primitives"表述改为 Base UI；组件契约/布局/交互层语义不变。
- `ui-package-structure`: 若需求中点名 Radix 依赖则同步修改。

## Impact

- `packages/ui`：9 个 vendored 组件重写、3 个 Form 相关适配组件、package.json 依赖、styles.css（动画变量）、全部组件/布局/交互测试适配。
- 间接：examples（视觉与交互回归验证）、MEMORY.md（radix 坑位记录清理）、docs（packages/ui.md 等提及 Radix 处）。
- 无 DSL 契约变化：12 组件类型名与 props 契约不变，业务 DSL 零迁移。
- **行为差异风险**：弹层/选择器的焦点与键盘细节由 Base UI 接管，需三示例截图 + 交互回归验证。
