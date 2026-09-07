# Tasks: ui-chat-input-component

## 1. 组件实现

- [x] 1.1 新增 packages/ui/src/components/components/ChatInput/index.tsx：两层嵌套结构（容器 > textarea + toolbar 行 + 可选 footer 区）、props（value / placeholder / disabled / rows / hideSend + className/style）、槽位（toolbarStart / toolbarEnd / footer 经 renderChildren）、内建发送钮（lucide ArrowUp 圆形，空白/disabled 禁用）
- [x] 1.2 发送交互：Enter 发送 / Shift+Enter 换行 / IME 守卫 / 空白禁发；非受控发送后清空；受控 onChange 传 string
- [x] 1.3 自适应高度（JS scrollHeight，rows 为下限）与结构样式（Tailwind 工具类 + 语义令牌，零字面色值）
- [x] 1.4 packages/ui/src/components/register.ts 注册 ChatInput

## 2. 测试

- [x] 2.1 新增 packages/ui/tests/components/chat-input.test.tsx：注册、placeholder、受控 value/onChange、Enter / Shift+Enter / IME / 空白禁发、非受控发送后清空、三槽位渲染、hideSend
- [x] 2.2 `pnpm --filter @pactor-ui build`（tsup + build:styles）通过，结构工具类进入预编译 styles.css

## 3. 文档

- [x] 3.1 docs/src/content/docs/components/form.md 新增 ChatInput 小节（props 表 + 受控闭环与槽位的最小 YAML 示例；注明与 @pactor-app/chat Composer 的定位差异）
- [x] 3.2 组件总数计数同步（docs/src/content/docs/components/index.md 及相关计数处）

## 4. 验证

- [x] 4.1 根级 `pnpm -r --if-present build` / `test` / `typecheck` 全绿
