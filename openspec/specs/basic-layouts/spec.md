# Spec: basic-layouts

Blank / Login / Landing 布局与 LayoutRegistry（`pactor-ui-antd` layout 层）。

### Requirement: BlankLayout

SHALL 直接渲染 children（无外壳元素），用于无壳页面与嵌入场景。

#### Scenario: 渲染出口

- **WHEN** 渲染 `<BlankLayout>内容</BlankLayout>`
- **THEN** 内容直接出现在渲染结果中

### Requirement: LoginLayout

SHALL 支持 `variant: 'center' | 'split'`（默认 center）与 `brand`（title/logo/description）：center 为居中卡片式品牌区 + children 表单出口；split 为左品牌区右表单区。MUST NOT 包含认证逻辑。

#### Scenario: center 变体

- **WHEN** 以 variant center、brand.title 为"智能决策运营平台"渲染
- **THEN** 出现品牌标题与 children

#### Scenario: split 变体

- **WHEN** 以 variant split 渲染
- **THEN** 品牌区与表单区并列呈现

### Requirement: LandingLayout

SHALL 提供可选 `navbar` 与 `footer` 插槽，children 为主内容区。

#### Scenario: 插槽渲染

- **WHEN** 传入 navbar 与 footer 节点
- **THEN** 两者分别出现在内容区上下方

### Requirement: LayoutRegistry

SHALL 提供 `createLayoutRegistry()` 预注册 admin / blank / login / landing 四种布局组件，及 `resolveLayout(registry, type)`：命中返回组件，未命中 MUST 返回 BlankLayout 并告警（不抛错）。业务可注册自定义布局类型。

#### Scenario: 预注册类型可解析

- **WHEN** resolveLayout 四种预注册类型
- **THEN** 各自返回对应组件

#### Scenario: 未知类型回退

- **WHEN** resolveLayout('unknown')
- **THEN** 返回 BlankLayout，不抛错

#### Scenario: 注册自定义布局

- **WHEN** 注册 'workspace' 自定义组件后 resolveLayout('workspace')
- **THEN** 返回该组件
