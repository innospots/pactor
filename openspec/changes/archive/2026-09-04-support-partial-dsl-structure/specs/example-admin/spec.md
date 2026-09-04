# Delta: example-admin

## ADDED Requirements

### Requirement: 局部结构示例页面

示例 SHALL 将 `layout-demo.page.yaml` 改写为根级 `children` 形态（不含 `body` 与 `Page` 包装节点），作为"DSL 描述页面局部"的参考实现；页面渲染结果须与改写前一致（Layout/Header/Sider/Content/Footer/Menu 组合、受控闭环均正常工作）。

#### Scenario: 根级 children 页面正常渲染

- **WHEN** 访问 layout-demo 页面
- **THEN** 布局组件与交互闭环（Sider 折叠、Menu 选中切换）正常工作

#### Scenario: 通过 CLI 校验

- **WHEN** 执行 `pactor validate` 校验 layout-demo.page.yaml
- **THEN** 校验通过，无错误
