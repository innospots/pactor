# Tasks: chat-on-ui-components

## 1. ui Menu 扩展

- [x] 1.1 packages/ui/src/components/components/Menu/index.tsx：MenuItem 增加 badge / dot / group / disabled 展示字段（inline 模式；disabled 不触发 onSelect）
- [x] 1.2 ui 测试补扩展字段用例；docs 组件参考 Menu 小节补字段

## 2. 图标收敛

- [x] 2.1 新增 packages/chat/src/view/chrome/icons.ts：chat 图标名 → ui Icon 白名单集中映射（菜单 / 消息操作 / header 操作 / 面板等全量），未知名 → circle-question-mark 占位；MessageActions 片段的 CHROME_ICON_MAP 迁入统一维护

## 3. 内建动作

- [x] 3.1 chrome/actions.ts：新增 chat.menuSelect / chat.modelChange / chat.headerAction / chat.panelClose（params.key / value / action；ChromeHandlers 扩展，注册不覆盖宿主）

## 4. 四处迁移（各带 fallback）

- [x] 4.1 ChatSidebarMenu → Menu 片段：items 构建（icon 映射 / badge / dot / group / disabled）+ selectedKey + chat.menuSelect 接回 onMenuSelect 传播与 drawer close；Chat.tsx / ChatShell.tsx 接入
- [x] 4.2 ModelChip → Select 片段（chat.modelChange）；WorkspaceHeader 模型位与 ChatComposerToolbarEnd 同步切换；视觉经 className 收敛
- [x] 4.3 WorkspaceHeader：操作组 + headerExtra 片段（Tooltip/Button/Icon + chat.headerAction），标题区经内部组件 ChatHeaderTitle（editableTitle 交互保持）；header 骨架与 header/showHeader 分支不变
- [x] 4.4 ArtifactPanel 标题栏 → 片段（Text/Badge/Button + chat.panelClose）；内容区与拖拽调宽保持

## 5. 验证

- [x] 5.1 既有 chat / ui 测试全绿（fallback 零回归）
- [x] 5.2 新增 DSL 路径测试：菜单渲染/高亮/选择闭环/drawer close、模型 Select 受控闭环、header 操作组行为与并行事件、面板标题栏关闭
- [x] 5.3 根级 `pnpm -r --if-present build` / `test` / `typecheck` 全绿
- [x] 5.4 examples/chat 冒烟：侧栏菜单（badge/dot/group/高亮/切换）、模型切换（Select 形态）、header 操作、产出物面板开闭
