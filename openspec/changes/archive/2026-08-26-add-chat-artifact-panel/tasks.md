# Tasks: add-chat-artifact-panel

## 1. 模型与状态

- [x] 1.1 `packages/chat/src/artifact.ts`：`ChatArtifact` 类型 + `ArtifactStore`（get/subscribe/open/update/close）+ 单测
- [x] 1.2 `model.ts`：`ChatPart` 联合新增 `artifact` part；reducer/store 对该 part 的支持 + 单测

## 2. 面板视图

- [x] 2.1 `view/ArtifactPanel.tsx`：标题栏 + 关闭按钮 + kind 分发内建渲染器（markdown/code/text/dsl-活预览经 guardChatDsl + renderChildren，拦截降级不抛错）+ 单测
- [x] 2.2 styles.css：桌面固定宽右栏（`--pactor-chat-inspector-width`）+ 窄屏覆盖抽屉（遮罩关闭）+ 产出物卡片样式

## 3. 组件集成

- [x] 3.1 PartRenderer：artifact part 内联"产出物卡片"（标题 + 角标 + 打开按钮）
- [x] 3.2 ChatComposition / Chat / createChatWorkspace：`artifact` / `panelOpen` / `onPanelClose` / `inspector` 槽 / `events.onArtifact`（part 就绪触发）；受控优先、内部 store 兜底；未配置零渲染
- [x] 3.3 `view/ChatShell.tsx`：AppShell + 内建菜单侧栏（复用 ChatMenuItem/图标白名单/onMenuSelect）+ `content` 槽（DslNode 经 renderChildren / ReactNode 原样）+ `sidebar` 替代槽；React 组件与 DSL 注册双导出（不覆盖已有同名类型）+ 单测
- [x] 3.4 index.ts 导出更新

## 4. 示例与集成验证

- [x] 4.1 examples/chat 路由化重构：引入 react-router-dom（HashRouter）+ pactor-router（MenuRegistry / DynamicDslRoute / useReactRouterBridge / createRouterAdapter）；App.tsx = HashRouter + ChatServicesProvider + ChatShell（menu 来自 registry，onMenuSelect → bridge.push，content = DynamicDslRoute 出口）；拆三个 page.yaml——`chat`（对话 + artifact 完整链路：建议词 → mock transport 输出 artifact part → onArtifact setState 开面板 → 可关闭，含 dsl kind 活预览）、`agents`（列表 mock，点击项 → DSL navigate 动作跳 /chat 并切 conversationId）、`settings`（表单 DSL，setState 保存回显）；页内 runtime 注入 router adapter 使 navigate 动作可用；**刷新按 URL 还原页面**、对话消息跨页切换不丢（共享 services.store）
- [x] 4.2 examples/admin：新增"AI 工作区"菜单页（createPactorApplication + componentRegistry 注册 Chat + providers 注入 ChatServicesProvider），验证 app 集成路径
- [x] 4.3 截图回归（chat 三页面 + 面板开合 + 刷新还原 / admin 新页面 / 窄屏移动端各一）

## 5. 收尾

- [x] 5.1 全量测试 + typecheck
- [x] 5.2 文档更新（docs chat 相关页 / framework-design 如有提及）
- [x] 5.3 spec 同步与归档
