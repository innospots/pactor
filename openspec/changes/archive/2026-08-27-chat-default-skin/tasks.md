# Tasks: chat-default-skin

## 1. 空态居中组（chat-empty-state，决策 D1）

- [x] 1.1 ChatView 空态分支：messages 为空时容器加 `pactor-chat-view--empty` 变体，EmptyState 与 Composer 渲染为同一垂直居中列的相邻子节点（列宽沿用 --pactor-chat-content-width）；有消息后恢复既有布局
- [x] 1.2 styles.css：空态居中容器（margin auto 居中 + overflow-y auto 兜底极矮视口）
- [x] 1.3 补测试：空态时 Composer 与问候组同列相邻、首条消息后恢复钉底布局

## 2. modelPlacement（chat-model-selector，决策 D2）

- [x] 2.1 ChatView/Composer 链路：`modelPlacement?: 'composer' | 'header'`（缺省 composer）；header 时 Composer 不渲染模型 chip
- [x] 2.2 ChatComposition/WorkspaceHeader：header 位置时模型 chip 渲染在头部左端（title 之前）；头部渲染条件扩展（仅 models + header 位置也渲染极简头部）
- [x] 2.3 Chat/ChatWorkspace 透传 modelPlacement（DSL 标量）
- [x] 2.4 补测试：header 位置渲染与极简头部、缺省位置不变、选中语义不受影响

## 3. 侧栏增强（chat-app-shell / chat-dsl-component，决策 D3/D4）

- [x] 3.1 AppShell：`sidebarFooter?: ReactNode` 固定底部区（未提供不渲染容器）；`collapsible?: boolean` + 内部 collapsed 状态；桌面品牌行（brand 左 + PanelLeft 折叠钮右，aria 标注）；折叠态 icon rail（移动端不渲染折叠钮、抽屉语义不变）
- [x] 3.2 ChatShell：brand 桌面展示、collapsible/sidebarFooter（DslNode/ReactNode 双型槽）透传；ChatMenuItem 增加 `dot?: boolean`（ChatSidebarMenu 渲染状态点）
- [x] 3.3 styles.css：品牌行、折叠钮、icon rail（隐藏 label/badge/group/footer/品牌文案，图标 title 兜底）、sidebarFooter 区、菜单 dot
- [x] 3.4 补测试：折叠切换与 aria、缺省无折叠钮、移动端无折叠钮、footer 槽渲染、dot 渲染

## 4. Composer 与令牌皮肤（决策 D5）

- [x] 4.1 Composer 发送/停止按钮：上箭头深色圆钮（ArrowUp / Square 保持），禁用态降透明度；停止态同一按钮元素状态切换语义不变
- [x] 4.2 默认令牌：--pactor-chat-bg 调暖白灰、新增 --pactor-chat-sidebar-bg（深一档）；侧栏菜单圆角/间距微调对齐参考图；暗色令牌不动（sidebar-bg 需补暗色值）
- [x] 4.3 补测试：发送按钮图标/类名断言（既有状态机测试不回退）

## 5. examples/chat 对齐参考形态（example-chat）

- [x] 5.1 chat.page.yaml：`modelPlacement: header`；移除 title/headerActions/editableTitle（极简头部形态）；greeting/subtitle 保留
- [x] 5.2 App.tsx 菜单数据：功能菜单项带 badge（如 录音 badge: 3）、「最近」分组会话项（group + dot）；ChatShell 传 brand + collapsible；sidebarFooter 用 DSL/ReactNode 声明底部卡片（用户卡即可，设备卡可选）
- [x] 5.3 app.css 复查：不为新布局编写私有 CSS（布局全由包内承担）
- [x] 5.4 mock-ai 等演示能力不回退

## 6. 收尾验证

- [x] 6.1 全仓 build/test/typecheck 全绿
- [x] 6.2 playwright 视觉验收：空态居中组、header 模型选择、侧栏品牌行/折叠/icon rail/dot/footer、发送按钮形态、有消息后布局恢复、暗色不回退、移动端抽屉不回退
- [x] 6.3 docs：packages/chat 文档补 modelPlacement / 空态布局 / 侧栏增强 / dot（就地增补）
