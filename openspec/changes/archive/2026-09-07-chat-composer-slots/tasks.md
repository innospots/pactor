# Tasks: chat-composer-slots

## 1. Composer footer 槽

- [x] 1.1 Composer 新增 composerFooter prop：fallback 渲染 `.pactor-chat-composer__footer` 区（border-t 分隔，styles.css 补样式）；ComposerBridge 增加 composerFooter
- [x] 1.2 chrome/composer.tsx：片段增加 footer 槽（`{ type: 'ChatComposerFooter' }`，requires 同步）+ ChatComposerFooter 内部组件；仅在提供时携带 footer 槽节点（零渲染承诺）

## 2. 链路接线

- [x] 2.1 ChatView / ChatComposition：toolbarStart props 槽接入（现状仅服务槽）与 composerFooter 透传；合并语义（服务槽在先）
- [x] 2.2 Chat props 新增 toolbarStart / toolbarEnd / composerFooter（DslNode | ReactNode，resolveSlot）；ChatServices 增加 composerFooter
- [x] 2.3 createChatWorkspace：ChatWorkspace props 增加 toolbarStart / composerFooter（DslNode，经 DslNodeSlot）

## 3. 验证

- [x] 3.1 新增测试：fallback footer 渲染/未提供不渲染、DSL 声明三槽渲染、服务槽与 props 槽合并顺序
- [x] 3.2 既有 chat 测试全绿（零回归）
- [x] 3.3 根级 `pnpm -r --if-present build` / `test` / `typecheck` 全绿
- [x] 3.4 examples/chat 冒烟：既有输入框行为无回归
