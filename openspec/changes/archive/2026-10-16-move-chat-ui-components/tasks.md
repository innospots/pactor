# Tasks: move-chat-ui-components

## 1. packages/chat 接入迁移组件

- [x] 1.1 迁移 `packages/ui/src/components/chat/` 整目录（18 组件）至 `packages/chat/src/components/`，保持子目录结构；内部对 ui 的相对 import 改为包级 import（`@pactor-app/ui/ui` 原语 / `@pactor-app/ui/components` 组件 / cn 工具），对 core/runtime 的 import 不变
- [x] 1.2 新增 `packages/chat/src/components/index.ts` 汇总导出 18 组件；实现 `registerChatComponents(registry)`（同名不覆盖）并导出
- [x] 1.3 chat 根入口组合层（ChatComposer/ChatArtifactPanel/MessageBubble/EmptyState 等）对 ui chat 组件的 import 改为包内相对路径；根入口导出面符号不变
- [x] 1.4 package.json exports 新增 `./components` 子路径（types/import/require）；tsup 添加 `src/components/index.ts` 入口

## 2. 样式分发

- [x] 2.1 chat 构建对齐 ui：`build = tsup && tailwindcss -i src/styles.css -o styles.css`；现有 `styles.css` 迁入 `src/styles.css` 并加 `@import "tailwindcss"` 头；package.json 加 tailwindcss devDependency
- [x] 2.2 ui `src/styles.css` 的 `--pactor-chat-rail-*` 令牌迁入 chat `src/styles.css`；编译产物 grep 确认含迁移组件工具类与 rail 令牌

## 3. packages/ui 移除 chat 层

- [x] 3.1 删除 `packages/ui/src/components/chat/` 与 `src/components/index.ts` 对应导出
- [x] 3.2 `src/components/register.ts` 移除 chat 组件 import 与 `builtinComponents` 注册
- [x] 3.3 确认 packages/ui 无对 `@pactor-app/chat` 的依赖（grep 验证）；ui build 产物 styles.css 不再含 chat 组件专属工具类（重新编译自动收窄）

## 4. 测试迁移

- [x] 4.1 `packages/ui/tests/components/` 的 `ai-chat-components.test.tsx`、`chat-page.test.tsx`、`artifact-panel.test.tsx` 迁入 `packages/chat/tests/`（import 改包内路径）；chat-input.test.tsx 留 ui
- [x] 4.2 新增 `registerChatComponents` 注册/不覆盖测试（对齐 chat-dsl-component delta）
- [x] 4.3 `pnpm --filter @pactor-app/chat test` 与 `pnpm --filter @pactor-app/ui test` 全绿

## 5. 消费方更新

- [x] 5.1 `doc/src/components/previews/basic-e.tsx` 改从 `@pactor-app/chat/components` 导入；doc package.json 加 `@pactor-app/chat` 依赖
- [x] 5.2 doc DSL 预览注册处（DslPreview 等创建 registry 的位置）调用 `registerChatComponents`，ChatPage 模板预览正常
- [x] 5.3 `doc/src/assets-data/details/ai-chat-details.ts` 包归属文案更新；`docs/src/content/docs/packages/chat.md` 补 `/components` 与 `registerChatComponents` 说明

## 6. 全仓验证

- [x] 6.1 chat / ui typecheck + build + test 全绿；全仓 typecheck（doc 预存失败除外）
- [x] 6.2 doc astro build 通过（351 页基线）；浏览器实测 chat 组件详情页、chat-page 模板预览（含 05 录音页）、examples/chat 对话流程无回归
- [x] 6.3 `openspec validate move-chat-ui-components --strict` 通过
