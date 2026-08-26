# Design: unify-ui-shadcn

## Context

三套 kit（antd/radix/shadcn）并存，契约类型（12 组件 props）与交互核心（OverlayManager/createUiBridge/registerInteractionActions/UiBridge/布局类型与 resolveLayout）由 `pactor-ui-antd` 承载，radix 与 shadcn 两侧 type-only/运行时复用。决策收敛为单一 kit `pactor-ui`（shadcn）。`pactor-ui` 内部使用 `@radix-ui/react-*` 原语是 shadcn 的固有构成，保留。

## Goals / Non-Goals

**Goals:**
- 删除 packages/ui-antd、packages/ui-radix、examples/admin-antd。
- 契约类型与交互核心迁入 pactor-ui（符号名与语义不变，仅导入路径变化）。
- 全部依赖方（pactor-app、pactor-chat、examples、docs、CLI 模板）改接 pactor-ui；全仓无 antd 依赖。

**Non-Goals:**
- 不改动 pactor-ui 的组件行为与样式。
- 不删除 UiKit 覆盖机制（componentRegistry/layoutRegistry/interactionKit/ui 选项保留，供业务自定义）。

## Decisions

### D1: 契约与核心物理迁移到 pactor-ui
将 `pactor-ui-antd` 的以下部分移入 `pactor-ui`：组件 props 契约类型（components/types）、交互核心（interaction：OverlayManager/createUiBridge/registerInteractionActions/UiBridge/InteractionProviderProps/OverlayHostProps）、布局类型与 `resolveLayout`（layout）。pactor-ui 内现有 type-only re-export 改为本地定义。符号名、语义、子路径出口（/components /interaction /layout）全部不变。

**替代方案**：契约抽到 pactor-core / 新建 contracts 包。否决——契约与唯一实现同住一个包最简单；pactor-core 保持零 React。

### D2: pactor-app 直读 pactor-ui
application.ts / app-shell.tsx 的全部 UI 导入改自 pactor-ui 子路径；`antdUiKit`/`radixUiKit` 相关代码与测试删除；默认回退逻辑不变（已是 shadcn）。UiKit 覆盖点保留。

### D3: examples/chat 切换
safe-registry 白名单改自 `createShadcnComponentRegistry()`；antd message/confirm 反馈改用 pactor-ui 交互层（`createUiBridge` + `ShadcnInteractionProvider`，宿主根部挂 Provider）；`import 'antd/dist/reset.css'` 与 antd 依赖移除。

### D4: 删除与清理
`pnpm remove` 后物理删除三包目录；pnpm-workspace/lock 自动收敛；docs 站删除 antd/radix kit 章节、保留迁移说明（符号→pactor-ui 对照）；根 README 与 MEMORY.md 相关描述更新。

## Risks / Trade-offs

- [机械迁移遗漏导入路径] → 全仓 grep `pactor-ui-antd|pactor-ui-radix|from 'antd'` 清零作为验收；全量 test/build/typecheck。
- [删除 admin-antd 丢失"双 kit 同 DSL"验证场景] → pactor-ui 契约测试已内置三表同构断言的退化版（单表自足 + 12 类型名硬编码断言）；迁移测试断言中补齐。
- [下游已有使用方 BREAKING] → 0.x 阶段，README/文档给出导入路径迁移对照表。

## Migration Plan

1. 迁移契约/核心进 pactor-ui，依赖方改接，全绿。
2. 删除三包与 antd 依赖，全绿 + grep 清零。
3. 文档与 spec 同步。
