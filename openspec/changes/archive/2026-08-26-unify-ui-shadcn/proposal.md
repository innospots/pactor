# Proposal: unify-ui-shadcn

## Why

仓库现有三套 UI kit（antd / radix / shadcn），契约类型与交互核心由 `pactor-ui-antd` 承载并被另两套复用，维护成本高。决策：只保留 shadcn（`pactor-ui`）作为唯一 UI 组件库与默认实现，移除 antd 与 radix 两个 kit，契约与交互核心随之归位到 `pactor-ui`。

注：shadcn 组件构建于 `@radix-ui/react-*` 原语之上——"移除 radix-ui"指移除 `pactor-ui-radix` kit 包；`pactor-ui` 内部作为 shadcn 组成部分的 Radix 原语保留。

## What Changes

- **删除 `packages/ui-antd`（`pactor-ui-antd`）与 `packages/ui-radix`（`pactor-ui-radix`）** 两个包及 `examples/admin-antd` 示例。
- **契约与核心归位**（**BREAKING**，仅导入路径变化）：12 组件 props 契约类型、`OverlayManager` / `createUiBridge` / `registerInteractionActions` 交互核心、`resolveLayout` 与布局类型从 `pactor-ui-antd` 迁入 `pactor-ui`（代码物理移动，符号名与语义不变）；`pactor-app`、`pactor-chat`（测试）等依赖方改从 `pactor-ui` 导入。
- **examples/chat**：Safe Registry 白名单由 antd 组件切换为 `createShadcnComponentRegistry()`；示例中的 antd message/confirm 反馈改用 `pactor-ui` 交互层（createUiBridge + ShadcnInteractionProvider）。
- **UI kit 选择机制简化**：`createPactorApplication` 的 `componentRegistry` / `layoutRegistry` / `interactionKit` 覆盖点保留（业务自定义需要），内置实现只有 shadcn 一套；`antdUiKit` / `radixUiKit` 预设删除。
- **样式导入**：消费方统一 `import 'pactor-ui/styles.css'`。

## Capabilities

### New Capabilities
（无）

### Modified Capabilities
- `ui-package-structure`: ui-* 单元从三个收敛为一个（`pactor-ui`）；契约/交互核心归位 pactor-ui；依赖方改接。
- `ui-kit-selection`: 缺省实现即唯一内置实现（shadcn）；antd/radix 注册表入口删除，覆盖点保留。
- `shell-ui-kit-selection`: 同上（layoutRegistry / interactionKit）。
- `ui-kit-preset`: 预设规范从 radix 改为 shadcn（`shadcnUiKit` 为唯一内置预设）。
- `example-chat`: Safe Registry 与反馈组件从 antd 切换到 pactor-ui。
- `chat-safe-registry` / `chat-view` / `chat-message-model`：检查并更新对 antd 的字面引用（规范本身不要求 antd，仅措辞与示例来源变化）。
- **移除的 spec**：`ui-kit-antd-preset`、`radix-components`、`radix-theme`、`radix-interaction`、`radix-layout`、`example-admin-antd` 整个 spec 目录随实现删除。

## Impact

- **代码**：删除 packages/ui-antd、packages/ui-radix、examples/admin-antd；pactor-ui 迁入契约与交互核心；pactor-app / pactor-chat / examples/chat / docs 改接。
- **API BREAKING**：`pactor-ui-antd` / `pactor-ui-radix` 两个包及其全部导入路径不复存在；等价符号从 `pactor-ui` 导出。
- **依赖**：全仓不再依赖 antd（runtime/dev 均移除，pactor-chat 测试改用 pactor-ui）。
