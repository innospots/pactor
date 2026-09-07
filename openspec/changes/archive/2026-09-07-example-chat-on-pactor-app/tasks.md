# Tasks: example-chat-on-pactor-app

## 1. 依赖与骨架

- [x] 1.1 调整 examples/chat/package.json：新增 `pactor-app`（workspace:*）依赖；移除 `react-router-dom`、`@pactor-app/router`、`@pactor-app/runtime` 直接依赖；保留 `@pactor-app/chat` / `@pactor-app/core` / `@pactor-app/ui`
- [x] 1.2 pnpm install 并确认 examples/chat 可解析 `pactor-app` 入口

## 2. bootstrap 与布局

- [x] 2.1 新增 examples/chat/src/bootstrap.ts：返回模拟 bootstrap 资源（app 名称、DEMO_MENUS 平移——功能菜单 + 「最近」分组历史会话（含 group / dot / badge 扩展字段）、`layout: { type: 'chat' }`、pageVersions），对齐 examples/admin 的 bootstrap 模式
- [x] 2.2 新增 examples/chat/src/ChatAppLayout.tsx：自定义 chat 外壳布局——模块级 MenuRegistry（与 bootstrap menus 同源）取可见树映射 ChatMenuItem（group / dot / badge 透传），ChatShell 渲染品牌行 / collapsible / 分组菜单 / sidebarFooter 用户卡；useReactRouterBridge + useLocation 推导 activeMenuKey（含 ?id= 历史会话高亮修正）；onMenuSelect → bridge.push（/chat?id=\<key\> 约定）
- [x] 2.3 验证 MenuRegistry 保留 group / dot 扩展字段（实现检查点；不成立则按 design Risks 回退方案评估）

## 3. 服务与会话缓存

- [x] 3.1 新增 examples/chat/src/ChatProvider.tsx（providers 槽）：模块级稳定服务（transport / safeRegistry / capabilities / callService / confirm / 附件伪上传与点击回调，平移自现 App.tsx chatServices）；useLocation 读 query.id，模块级 Map 缓存 ConversationStore，嵌套 ChatServicesProvider 就近注入当前会话 store
- [x] 3.2 保留并复用现有模块：mock-ai / mock-data / safe-registry / capabilities / attachments / ui-bridge（不改动）

## 4. 入口改造

- [x] 4.1 重写 examples/chat/src/main.tsx：`createPactorApplication`（from `pactor-app`）——StaticDslLoader（bootstrap + 三页 DSL 静态导入）、componentRegistry（shadcn 注册表 + registerChatComponent）、layoutRegistry（注册 chat 布局）、providers（ChatProvider）、actions（message 动作转发 ui-bridge showMessage；核对框架内建动作覆盖范围，内建可用则优先内建）；保留三份样式表导入与 app.css
- [x] 4.2 删除 examples/chat/src/App.tsx（HashRouter / Shell / DslPage / 手写装配整体移除）
- [x] 4.3 检查 app.css：移除仅为手写壳存在的样式（如 .demo-app / .demo-main），保留页面壳高度链与品牌色等自有视觉

## 5. 验证

- [x] 5.1 `pnpm --filter example-chat build` 与 `pnpm --filter example-chat typecheck` 通过
- [x] 5.2 根级 `pnpm -r --if-present build` / `test` / `typecheck` 全绿
- [x] 5.3 手动验收（5399 端口）：流式对话、工具调用、DSL 卡片白名单 / ChatDenied、capability 确认链、附件伪上传、上下文 chips、模型切换、导出、明暗切换、清空、侧栏折叠、「最近」会话切换（URL /chat?id=\<key\>、高亮正确、消息不丢）、settings 保存 toast、agents 页跳转会话
- [x] 5.4 更新 examples/chat/README.md：装配范式说明（createPactorApplication + bootstrap）、URL 方案变化（hash → history）
