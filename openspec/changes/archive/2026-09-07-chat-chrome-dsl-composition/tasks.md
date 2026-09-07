# Tasks: chat-chrome-dsl-composition

## 1. chrome DSL 渲染层

- [x] 1.1 新增 packages/chat/src/view/chrome/ChromeSlot.tsx：渲染决策（无 renderer → fallback；registry 类型齐备性校验（缺 → warn + fallback）；齐备 → renderChildren 渲染片段），复用 DslSlotGuard 同款守卫
- [x] 1.2 新增 packages/chat/src/view/chrome/actions.ts：`chat.*` 内建动作注册（context.actions，has 检查不覆盖宿主同名；行为闭包经 React ref 桥接 store / onSend / onOpenArtifact 等）
- [x] 1.3 chrome 容器样式：styles.css 新增 `.pactor-chat-chrome` 令牌映射块（--pactor-chat-* → shadcn 语义令牌，含暗色覆盖链）

## 2. 空态区迁移

- [x] 2.1 新增 chrome/empty-state 片段（Empty + Typography + Button 建议组 + requires 清单），建议点击 → chat.sendSuggestion
- [x] 2.2 EmptyState.tsx 接入 ChromeSlot（DSL 优先），现有实现转为 fallback；行为契约（居中组、空数组不渲染、溢出滚动）不变

## 3. PartRenderer 非流式分支迁移

- [x] 3.1 新增 chrome/feedback 片段：error 警示条（Alert）、status 弱提示（Text）、dsl-pending 占位
- [x] 3.2 新增 chrome/artifact-card 片段（Card + Badge + Button），打开 → chat.openArtifact 触发同一 onOpenArtifact 回调
- [x] 3.3 PartRenderer.tsx 对应分支接入 ChromeSlot，现有实现转为 fallback；text/markdown/thinking/dsl 分支不动

## 4. 消息操作条迁移

- [x] 4.1 新增 chrome/message-actions 片段（Button + Tooltip + Icon 按钮组），内建动作接 chat.*（复制 / 重试 / 重新生成 / 编辑），自定义动作仍走 callService 派发
- [x] 4.2 MessageActions.tsx 接入 ChromeSlot（hover 显现容器与可见性求值保留包内），现有按钮实现转为 fallback

## 5. 验证

- [x] 5.1 现有 chat 包测试全绿（jsdom 无 renderer → 全走 fallback，DOM 断言不变，验证零回归）
- [x] 5.2 新增测试：ambient renderer 环境 DSL 路径渲染 + chat.* 动作闭环、类型缺失回退 + warn、宿主同名动作不被覆盖
- [x] 5.3 根级 `pnpm -r --if-present build` / `test` / `typecheck` 全绿
- [x] 5.4 examples/chat 冒烟（DSL 页内）：空态建议发送、error 重试、操作条复制/引用回复、artifact 卡片打开面板，视觉与交互不回退
