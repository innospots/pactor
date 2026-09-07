# Tasks: chat-icon-convergence

## 1. ui Icon 白名单补齐

- [x] 1.1 packages/ui/src/components/components/Icon/index.tsx：ICONS 增加 chevrons-up-down / file-text / panel-left / panel-right-open / square / x / history / rotate-ccw / quote / help-circle + 别名键 chat（MessageSquare）/ share（Share2）
- [x] 1.2 ui 测试补新名与别名用例；docs 组件参考 Icon 小节（若列白名单）同步

## 2. 依赖调整

- [x] 2.1 packages/chat/package.json：@pactor-app/ui 从 devDependencies 移入 dependencies；lucide-react 从 dependencies 移除（替换完成后验证无直接引用再提交此项）；pnpm install
- [x] 2.2 AnchoredPopover.tsx / ChatLayout.tsx 的零依赖注释更新为新取向（chat 依赖 ui kit）

## 3. chat 图标替换

- [x] 3.1 17 处直接 lucide 引用替换为 ui Icon（Composer / ChatView / WorkspaceHeader / ModelChip / ArtifactPanel / PartRenderer / AppShell / ActivityTrace / MessageBubble / context-sources / AnchoredPopover 等，按 grep 清单逐个核对）
- [x] 3.2 删除 MENU_ICONS / MESSAGE_ACTION_ICONS 映射表：图标名直传 ui Icon（未知名 ui 占位）；icon 缺失不渲染的分支保留
- [x] 3.3 删除 chrome/icons.ts：menu.tsx / message-actions.tsx 片段的 toUiIconName 调用改为直接传名

## 4. 验证

- [x] 4.1 chat / ui 既有测试全绿（占位形态变化涉及的断言同步调整）
- [x] 4.2 根级 `pnpm -r --if-present build` / `test` / `typecheck` 全绿
- [x] 4.3 examples/chat 冒烟：侧栏菜单图标、操作条图标、发送/停止/附件/+、header 操作、模型 chip、面板图标无缺失无占位异常
