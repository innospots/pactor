# Spec: docs-site

## Requirements

### Requirement: 面向使用者的快速开始

文档站 SHALL 提供面向框架使用者的快速开始：按场景的 npm 安装组合、最小可运行接入步骤（vite 插件 → 模块声明 → 页面 YAML → createPactorApplication 挂载）、createPactorApplication 参数说明（与 packages/app 源码签名一致）。

#### Scenario: 使用者照做可运行

- **WHEN** 使用者按快速开始步骤操作
- **THEN** 得到与 example-vite-starter 等效的可运行应用

### Requirement: 数据流指南

文档站 SHALL 提供数据流专篇：bootstrap/loader/页面 DSL/数据源的加载链路，state、data、actions、params、event、row 各作用域键的产生与消费方，以及重渲染订阅模型。

#### Scenario: 覆盖四条数据通路

- **WHEN** 阅读数据流指南
- **THEN** 能回答"这个表达式里的 `${data.x}` 从哪来、什么时候更新、更新后谁重渲染"

### Requirement: 自定义组件指南

文档站 SHALL 提供自定义组件开发指南：Renderer 契约（props 已求值、events 绑定、children 与 withScope/dslChildren、permission 注入）、注册路径（componentRegistry / ui kit 槽位 / chat Safe Registry）与完整可运行示例。

#### Scenario: 开发者注册业务组件

- **WHEN** 开发者按指南实现并注册一个业务组件
- **THEN** DSL 中 `type` 命中该组件，props/事件/权限行为与内置组件一致

### Requirement: DSL 参考完整性

`reference/dsl` 组件目录 SHALL 覆盖全部可经 DSL 使用的组件（含 @pactor-app/markdown 注册的 Markdown），并指向自定义组件指南。

#### Scenario: Markdown 组件可查

- **WHEN** 查阅 DSL 参考组件目录
- **THEN** Markdown 组件的 props 与注册方式有明确说明
