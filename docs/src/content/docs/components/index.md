---
title: 组件参考
description: 全部 69 个 DSL 组件（@pactor-app/ui 注册的 68 个 registry 组件 + @pactor-app/markdown 注册的 Markdown）的逐组件 props 契约与 DSL 示例，按布局与页面 / 展示 / 表单 / 数据 / 导航 / 反馈与弹层 / 复合与其他七类分页
---

DSL 的 `type` 引用 Component Registry 注册名。`@pactor-app/ui`（shadcn kit）注册 68 个组件类型，`@pactor-app/markdown` 另行注册 `Markdown`；全部 69 个组件按功能分 7 个分类页逐组件展示（props 表 + 最小 YAML 示例）。业务组件注册见[自定义组件](/guides/custom-components/)。

## 通用约定

通用 props（所有组件一致）：`className`（根节点 class，与内置样式合并；触发器 + 浮层结构的组件挂在浮层内容根节点）、`style`（根节点内联样式对象，如 `{ flex: 1 }`）、`permission`、`when`、`events`。各组件小节只列特有 props。

- 事件回调传 DSL 语义值（如 `Switch.onChange` 传 boolean、`Pagination.onChange` 传页码 number、`DataTable.onSort` 传 `{ key, order }`），动作内以 `${event}` 读取；各表以「事件 `onXxx`」行列出，说明列注明 `${event}` 载荷类型；
- props 内嵌的 DSL 子树（如 Table columns 的 `cell`、Accordion items 的 `children`、DataTable columns 的 `children`）经 Renderer children 机制渲染，可继续声明任意组件与事件；
- DSL 只暴露受限的框架级 props，适配器负责映射到底层原语（Base UI / recharts 等），不透传底层库的自由组合 API。

## 组件索引

| 组件 | 分类 |
| --- | --- |
| [Page](/components/layout/#page) | 布局与页面 |
| [Layout](/components/layout/#layout) | 布局与页面 |
| [Header](/components/layout/#header) | 布局与页面 |
| [Sider](/components/layout/#sider) | 布局与页面 |
| [Content](/components/layout/#content) | 布局与页面 |
| [Footer](/components/layout/#footer) | 布局与页面 |
| [Grid](/components/layout/#grid) | 布局与页面 |
| [Flex](/components/layout/#flex) | 布局与页面 |
| [Card](/components/layout/#card) | 布局与页面 |
| [Sidebar](/components/layout/#sidebar) | 布局与页面 |
| [Separator](/components/layout/#separator) | 布局与页面 |
| [ScrollArea](/components/layout/#scrollarea) | 布局与页面 |
| [Resizable](/components/layout/#resizable) | 布局与页面 |
| [Text](/components/display/#text) | 展示 |
| [Typography](/components/display/#typography) | 展示 |
| [Badge](/components/display/#badge) | 展示 |
| [Avatar](/components/display/#avatar) | 展示 |
| [Kbd](/components/display/#kbd) | 展示 |
| [Skeleton](/components/display/#skeleton) | 展示 |
| [Spinner](/components/display/#spinner) | 展示 |
| [Empty](/components/display/#empty) | 展示 |
| [Statistic](/components/display/#statistic) | 展示 |
| [Progress](/components/display/#progress) | 展示 |
| [AspectRatio](/components/display/#aspectratio) | 展示 |
| [Carousel](/components/display/#carousel) | 展示 |
| [Item](/components/display/#item) | 展示 |
| [Form](/components/form/#form) | 表单 |
| [Input](/components/form/#input) | 表单 |
| [Select](/components/form/#select) | 表单 |
| [Textarea](/components/form/#textarea) | 表单 |
| [Checkbox](/components/form/#checkbox) | 表单 |
| [RadioGroup](/components/form/#radiogroup) | 表单 |
| [Switch](/components/form/#switch) | 表单 |
| [Slider](/components/form/#slider) | 表单 |
| [Label](/components/form/#label) | 表单 |
| [Field](/components/form/#field) | 表单 |
| [Calendar](/components/form/#calendar) | 表单 |
| [InputOTP](/components/form/#inputotp) | 表单 |
| [Combobox](/components/form/#combobox) | 表单 |
| [Table](/components/data/#table) | 数据 |
| [DataTable](/components/data/#datatable) | 数据 |
| [Chart](/components/data/#chart) | 数据 |
| [Menu](/components/navigation/#menu) | 导航 |
| [Link](/components/navigation/#link) | 导航 |
| [Breadcrumb](/components/navigation/#breadcrumb) | 导航 |
| [Pagination](/components/navigation/#pagination) | 导航 |
| [Tabs](/components/navigation/#tabs) | 导航 |
| [Menubar](/components/navigation/#menubar) | 导航 |
| [NavigationMenu](/components/navigation/#navigationmenu) | 导航 |
| [DropdownMenu](/components/navigation/#dropdownmenu) | 导航 |
| [ContextMenu](/components/navigation/#contextmenu) | 导航 |
| [Alert](/components/feedback/#alert) | 反馈与弹层 |
| [Dialog](/components/feedback/#dialog) | 反馈与弹层 |
| [AlertDialog](/components/feedback/#alertdialog) | 反馈与弹层 |
| [Drawer](/components/feedback/#drawer) | 反馈与弹层 |
| [Sheet](/components/feedback/#sheet) | 反馈与弹层 |
| [Popover](/components/feedback/#popover) | 反馈与弹层 |
| [Sonner](/components/feedback/#sonner) | 反馈与弹层 |
| [Tooltip](/components/feedback/#tooltip) | 反馈与弹层 |
| [HoverCard](/components/feedback/#hovercard) | 反馈与弹层 |
| [Button](/components/composite/#button) | 复合与其他 |
| [Accordion](/components/composite/#accordion) | 复合与其他 |
| [Collapsible](/components/composite/#collapsible) | 复合与其他 |
| [Command](/components/composite/#command) | 复合与其他 |
| [Toggle](/components/composite/#toggle) | 复合与其他 |
| [ToggleGroup](/components/composite/#togglegroup) | 复合与其他 |
| [ButtonGroup](/components/composite/#buttongroup) | 复合与其他 |
| [InputGroup](/components/composite/#inputgroup) | 复合与其他 |
| [Markdown](/components/composite/#markdown) | 复合与其他 |
