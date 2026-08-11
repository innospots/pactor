# Design: add-radix-ui-kit

## Context

设计文档第 14 节：DSL 不直接暴露 UI Library API——业务 DSL → Framework Component → UI Library Adapter → UI Library。pactor-components 已实现 antd 适配层并导出全部 props 契约类型。Radix Primitives 是无样式原语：Select/Tabs/Form 有对应原语，其余组件（Page/Grid/Flex/Card/Button/Alert/Statistic/Input/Table）用带语义 class 的原生元素实现。

约束：

- **契约一致**：Radix 版与 antd 版 DSL props 类型、类型名、事件值语义（onChange 传 value 等）完全一致——同一份 DSL 切换 UI 库零修改。
- **pactor-app 不硬依赖 radix 包**：切换配置为工厂注入，tree-shaking 友好。
- **不改 pactor-components**（antd 默认实现保持现状）。

## Goals / Non-Goals

**Goals:**

- 12 个组件的 Radix 实现 + 极简样式表 + 注册入口。
- pactor-app `componentRegistry` 工厂选项。
- 契约一致性测试（类型名集合、关键行为场景）。
- 文档。

**Non-Goals:**

- interaction（Modal/Drawer/message/confirm）与 layout（AdminLayout）的 Radix 化——本次只做 components 层，文档明确边界。
- 完整主题体系（暗色、密度）——样式表只保证可用与可覆盖。
- Radix Themes（ styled 组件库）——用户指定的是 Primitives。

## Decisions

### D1: 契约复用

`pactor-components-radix` dependencies 包含 `pactor-components`（workspace:*），**仅 import 其 props 类型与 Form 上下文类型**（`import type {...}`，不产生运行时依赖）；运行时依赖为 pactor-core / pactor-runtime + 三个 radix 包。12 个组件逐一实现相同 props 接口。Form 协同（Form Context + name 自动包装 + 提交写 state.form）语义对齐 antd 版，但实现用 Radix Form 或受控状态自行组织（Radix Form 的校验模型与 antd 不同——required 用原生/原语校验，错误文案经 Radix Form.Message 展示）。

### D2: 逐组件实现策略

| 组件 | 实现 |
| --- | --- |
| Button | 原生 button + variant/size/danger/loading/disabled 映射 class |
| Input | 原生 input/textarea 受控；Form 内用 Radix Form.Field/Control |
| Select | @radix-ui/react-select（options/onChange value） |
| Tabs | @radix-ui/react-tabs（items pane 经 renderChildren） |
| Form | @radix-ui/react-form（Context 下发、submit → onSubmit(values) + state.form、rules.required → 校验） |
| Table | 原生 table（columns/dataSource/rowKey/loading/简化分页、cell 经 renderChildren） |
| Page/Card/Alert/Statistic/Grid/Flex | 语义 class 原生元素 |

### D3: 样式表

`styles.css` 提供 `.pcr-*` 前缀语义 class 的极简可用样式（布局、变体配色、表格边框、表单错误态）；包 exports 暴露 `./styles.css`；文档说明引入方式与可覆盖性。测试不依赖样式计算，只断言 class 与结构。

### D4: 切换配置

- 独立使用：`createRadixComponentRegistry()` 替代 `createBuiltinComponentRegistry()`。
- pactor-app：`createPactorApplication({ componentRegistry: createRadixComponentRegistry, ... })`——options 增加 `componentRegistry?: () => Registry<unknown>`；缺省 `createBuiltinComponentRegistry`。业务 components 注册在工厂产物之上叠加。
- 文档给出完整切换 recipe（安装 radix 包 + 引入 styles.css + 配置项）。

### D5: 契约一致性测试

- 类型名集合断言：两个 registry 的 list() 相等。
- 行为场景复用：Radix 版实现 builtin-components / form-container / table-component 三个 spec 的关键 scenario（Button variant/onClick、Alert 变体、Grid 两列、Tabs pane、Form 提交 + form 作用域 + required 拦截、Table 行列/cell row、表达式 props）。
- 不强求像素级一致；断言结构、class、行为与作用域语义。

## Risks / Trade-offs

- [Radix Form 与 antd Form 校验模型差异导致 form 语义不完全对齐] → 对齐到 spec 级（required + message、提交拦截、values 收集、form 作用域）；高级校验（pattern 等）文档注明差异。
- [无样式原语的 Table/分页等需要自绘] → 极简实现 + 语义 class；企业级表格仍建议 antd kit。
- [两套实现未来 drift] → 契约测试锁定类型名与关键行为；新增组件需双实现（贡献指南注明）。
- [interaction/layout 仍 antd] → 文档明确：切换 UI kit 后 Overlay/AdminLayout 仍是 antd 外观；完整 Radix 化另立项。

## Migration Plan

无（全新包 + app 向后兼容选项）。顺序：包骨架与样式表 → 简单组件（Button/Input/Page/Card/Alert/Statistic/Grid/Flex）→ Tabs/Select/Form → Table → 注册入口与契约测试 → app 选项 → 文档。

## Open Questions

- interaction/layout 的 Radix 实现包（pactor-interaction-radix 等）是否立项：待用户对本次组件层切换的实际体验反馈。
