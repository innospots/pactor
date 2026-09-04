# Delta: basic-layouts

## ADDED Requirements

### Requirement: 外壳布局与布局组件的选用规则

文档 SHALL 区分两类布局能力并给出选用规则：外壳布局（LayoutRegistry，应用级，由 bootstrap `layout.type` 解析，负责菜单/品牌/多页签等应用壳）与布局组件（Layout/Header/Sider/Content，页面级，DSL `body` 中自由组合）。页面需要完全自控布局时，外壳 MUST 使用 `blank` 类型。

#### Scenario: 选用指引

- **WHEN** 页面 DSL 的 body 以 Layout 组件起手声明自己的 Sider/Header/Content
- **THEN** 该页面对应菜单项的 bootstrap 布局为 blank，页面不被 admin 外壳包裹
