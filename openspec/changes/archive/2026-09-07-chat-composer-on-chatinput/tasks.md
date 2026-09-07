# Tasks: chat-composer-on-chatinput

## 1. ChatInput header 槽

- [x] 1.1 packages/ui/src/components/components/ChatInput/index.tsx：新增 `header?: DslNode` 槽（renderChildren 渲染在 textarea 上方）；未提供不渲染
- [x] 1.2 chat-input.test.tsx 补 header 槽用例（渲染位置 / 未提供不渲染）；docs form.md 的 ChatInput 小节补 header 行

## 2. chat 内建动作与桥接

- [x] 2.1 chrome/actions.ts：ChromeHandlers 增加 composerChange / composerSubmit；新增 `chat.composerChange` / `chat.composerSubmit` 内建动作（params.value ← ${event}）
- [x] 2.2 ChatView 注入扩展：composerChange → Composer 侧 setText + mention 检测入口、composerSubmit → 发送路径（经 refs 桥接，与 sendSuggestion 同款）

## 3. composer 片段与内部组件

- [x] 3.1 新增 chrome/composer.tsx：buildComposerFragment（ChatInput + hideSend + 三个内部组件槽 + requires 清单）与 ComposerBridgeContext（registry 组件取 Composer props/状态/回调的桥）
- [x] 3.2 内部组件 ChatComposerHeader（附件卡片行 + 上下文 chips 行）、ChatComposerToolbarStart（chat toolbarStart 槽 + 内建 + 钮 / 附件钮）、ChatComposerToolbarEnd（模型 chip + chat toolbarEnd 槽 + 发送/停止状态机钮）；ambient 可用时注册（has 检查不覆盖）

## 4. Composer 呈现层重构

- [x] 4.1 Composer.tsx：保留全部状态与逻辑；呈现层 DSL 路径（ChromeSlot + 外包 pactor-chat-composer 容器承接冒泡 onChange mention 检测 / onPaste / onDragOver / onDrop）与 fallback（现有 markup 原样）二选一
- [x] 4.2 styles.css：`.pactor-chat-composer .pactor-chat-chrome` 内输入高度 200px 上限与最小高度收敛；DSL 路径容器边框/圆角让位 ChatInput，拖放态修饰保留

## 5. 验证

- [x] 5.1 既有 chat / ui 测试全绿（fallback 零回归）
- [x] 5.2 新增 DSL 路径测试（packages/chat/tests/composer-dsl.test.tsx）：受控桥接（输入回写 / Enter 发送清空）、mention 冒泡检测、附件粘贴 / 拖放冒泡、发送/停止状态机、模型 chip 与槽位位置
- [x] 5.3 根级 `pnpm -r --if-present build` / `test` / `typecheck` 全绿
- [x] 5.4 examples/chat 冒烟：发送 / 停止、@ 提及与 + 菜单、附件粘贴 / 选择 / 移除、chips 移除、模型切换、流式回复全链路
