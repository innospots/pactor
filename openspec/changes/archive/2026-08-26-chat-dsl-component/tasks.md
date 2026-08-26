# Tasks: chat-dsl-component

## 1. 服务 Context 与组合提炼

- [x] 1.1 新增 `ChatServicesProvider` / `useChatServices()`（`ChatServices` 与 ChatWorkspaceServices 同型）；无 provider 时 Chat 渲染受控提示 + console.warn
- [x] 1.2 提炼 ChatWorkspace 组合逻辑为内部 `ChatComposition`；`createChatWorkspace` 改为 provider + Chat 的薄封装（行为不变，既有测试保持绿）
- [x] 1.3 测试（TDD）：provider 注入读取、缺失受控降级不抛错、createChatWorkspace 回归

## 2. Chat DSL 组件

- [x] 2.1 新增 `src/view/Chat.tsx`：`Chat` 组件（标量 props + menu/activeMenuKey/header 三层配置/sidebar 槽/showHeader + onSend/onMenuSelect props），内建侧栏渲染（图标名映射 lucide 子集 + 占位、group 分组、disabled）
- [x] 2.2 `registerChatComponent(registry)`：注册 `Chat` 类型，不覆盖已有注册
- [x] 2.3 events 适配：onSend（event.text）、onMenuSelect（event.key/event.item，disabled 不触发）
- [x] 2.4 测试（TDD）：注册/不覆盖、菜单渲染与高亮、icon 占位、onMenuSelect setState 链路、header 三层、onSend、sidebar 槽覆盖、createPageRuntime 集成
- [x] 2.5 `src/index.ts` 导出 `Chat` / `ChatProps` / `ChatMenuItem` / `ChatServices` / `ChatServicesProvider` / `useChatServices` / `registerChatComponent`

## 3. 示例升级

- [x] 3.1 examples/chat：`chat.page.yaml` 改为 Chat 组件声明（menu/header/greeting/suggestions 入 YAML，onMenuSelect + state 演示菜单交互）；宿主入口简化为 ChatServicesProvider + registerChatComponent + createPageRuntime；既有演示能力全部保留
- [x] 3.2 验证：packages/chat 与 example-chat test/typecheck/build 全绿；root `pnpm -r test` / `pnpm -r --if-present build` 全绿；playwright 截图确认（菜单高亮切换、header 槽、问候建议、对话、暗色）

## 4. 文档与收尾

- [x] 4.1 packages/chat/README.md + docs 站 chat 章节：Chat 组件用法（注册、provider、menu/header 配置、events）
- [x] 4.2 `openspec validate chat-dsl-component` 通过；tasks 全部勾选
