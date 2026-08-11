# Proposal: add-radix-ui-kit

## Why

pactor-components 目前的 12 个 V1 组件全部基于 antd 适配。设计文档第 14 节的核心约束是"DSL 只绑定框架协议，不绑定具体 UI Library API"——当前的单一实现没有兑现"可替换 UI 库"的架构意图。希望支持通过配置切换为 Radix UI（Primitives 是无样式底层原语）。正确做法是把 **DSL 组件契约** 与 **UI 库实现** 分离：antd 为默认实现，Radix 为可切换实现，同一份 DSL 不修改即可运行在两套 UI 之上。

## What Changes

- 新增 `pactor-components-radix` 包（`packages/components-radix`）：
  - 实现与 pactor-components **相同的 12 个 DSL 组件契约**（Page/Grid/Flex/Card/Button/Alert/Statistic/Tabs/Form/Input/Select/Table），props 类型直接复用 pactor-components 导出的契约类型。
  - Radix Primitives 实现：Select（@radix-ui/react-select）、Tabs（@radix-ui/react-tabs）、Form（@radix-ui/react-form）；Page/Grid/Flex/Card/Button/Alert/Statistic/Input/Table 无语义原语，用带语义 class 的原生元素实现。
  - 自带极简样式表 `pactor-components-radix/styles.css`（Radix Primitives 无样式）。
  - 注册入口：`createRadixComponentRegistry()` / `registerRadixComponents(registry)`，类型名与 antd 版完全一致。
- **pactor-app（扩展，向后兼容）**：新增 `componentRegistry?: () => Registry<unknown>` 配置项——缺省使用 antd 内置注册表；传入 `createRadixComponentRegistry` 即完成切换（工厂形式，避免 pactor-app 硬依赖 radix 包、不用 radix 时不进 bundle）。
- **契约一致性测试**：两个注册表的类型名集合一致；Radix 版复用关键行为场景（Button 事件、Form 提交 + form 作用域、Table cell 行模板、Tabs pane 渲染、表达式 props）。
- 文档站新增 pactor-components-radix 模块页 + UI 库切换指南。

## Capabilities

### New Capabilities

- `radix-components`: 12 个 DSL 组件的 Radix Primitives 实现、样式表、注册入口，与 antd 实现契约一致。
- `ui-kit-selection`: UI 库切换配置机制（pactor-app `componentRegistry` 工厂选项与独立使用方式）。

### Modified Capabilities

- `application-bootstrap`: 启动编排新增 `componentRegistry` 选项（缺省行为不变）。

## Impact

- **新增代码**：`packages/components-radix`；**修改**：`packages/app`（一个选项 + 测试）。
- **新依赖**（仅 radix 包）：`@radix-ui/react-select`、`@radix-ui/react-tabs`、`@radix-ui/react-form`。
- **明确边界**：本次只覆盖 components 层的 12 个组件；pactor-interaction（Modal/Drawer/message/confirm）与 pactor-layout（AdminLayout 菜单等）仍为 antd 实现——完整去 antd 化需后续对这两个包做同样的实现分离（文档注明）。
- **不修改** pactor-components（antd 版保持默认与现状）。
