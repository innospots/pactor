# Design: move-chat-ui-components

## Context

chat-view-reuse-ui-components 完成后：`packages/chat` 视图层（ChatComposer / ChatArtifactPanel / MessageBubble / EmptyState）已是组合 `@pactor-app/ui` chat 展示组件的薄层；18 个展示组件在 `packages/ui/src/components/chat/`，经 `@pactor-app/ui` 与 `/components` 导出并注册进 `builtinComponents`。约束：依赖方向保持 `@pactor-app/ui` →（无）← `@pactor-app/chat` 单向。`@pactor-app/chat` 根入口已导出 `Composer`/`ArtifactPanel`/`buildArtifactTree` 等符号（当前指向 ui 的再导出/包装）。

## Goals / Non-Goals

**Goals:**
- 18 个 chat 展示组件迁入 `packages/chat/src/components/`，经 `@pactor-app/chat/components` 子路径导出。
- DSL 注册随组件迁移：`registerChatComponents(registry)`（同名不覆盖）。
- 样式可独立分发：`@pactor-app/chat/styles.css` 含迁移组件的 Tailwind 工具类与 `--pactor-chat-rail-*` 令牌。
- `@pactor-app/chat` 根入口导出面不变；ui 不残留 chat 组件。

**Non-Goals:**
- 不改动组件 props 契约与视觉（纯迁移）。
- 不动 ui 通用组件（ChatInput / Attachment 依赖的 FilePreview 之外的 components 层等留 ui；chat 组件经 `@pactor-app/ui` 引用）。
- 不合并 chat 根入口的组合层 `Composer`/`ArtifactPanel` 与子路径纯组件的命名差异（两根出口各司其职）。
- 不改 theme-studio / examples（不引用这 18 个组件）。

## Decisions

### 落位与导出：`src/components/` + 子路径出口

组件迁入 `packages/chat/src/components/`（保持原子目录结构），新增 `src/components/index.ts` 汇总导出 18 组件 + `registerChatComponents`；package.json exports 新增 `./components`（types/import/require），tsup 添加入口。chat 根入口的 `Composer`/`ArtifactPanel` 等组合层符号改指包内 wrapper（wrapper 内部 import 从 `@pactor-app/ui/components` 改为相对路径 `./../components/...`）。

替代方案（从根入口导出全部 18 个）被否：与根入口组合层符号 `Composer`/`ArtifactPanel` 同名冲突。

### 组件内部 import 改接

迁移组件对 ui 内部的相对 import（`../../../ui/resizable`、`../../components/Button`、`lib/utils` 的 cn 等）改为包级 import：`@pactor-app/ui/ui`（原语）/ `@pactor-app/ui/components`（Icon/Menu/Button 等）/ cn 以 ui 既有导出为准（若无导出则在 chat 内补等价工具）。对 `@pactor-app/core` / `@pactor-app/runtime` 的引用不变（chat 已有这两个依赖）。

### DSL 注册迁移

ui `register.ts` 删除 chat 组件 import 与 `builtinComponents` 注册；chat 新增 `registerChatComponents(registry)` 注册同一组 18 个类型名（ChatPage/Bubble/ChatMessage/Composer/...），同名不覆盖。注意与 `registerChatComponent`（`Chat` 类型）并存、互不影响。doc 的 DSL 预览注册处（DslPreview 等）显式调用。

### 样式：chat 构建加 Tailwind 编译

ui 的 chat 组件样式全部为 Tailwind 工具类内联（无 `.pactor-chat-*` 类，ui styles.css 仅有 `--pactor-chat-rail-*` 两个令牌被 ChatPage 引用）。迁移后这些工具类不再被 ui 的 tailwind 扫描覆盖，故 chat 构建对齐 ui：`build = tsup && tailwindcss -i src/styles.css -o styles.css`；现有手写 `styles.css`（`.pactor-chat-*` 语义类 + `--pactor-chat-*` 令牌）迁入 `src/styles.css` 并加 `@import "tailwindcss"` 头与 `--pactor-chat-rail-*` 令牌；chat 新增 tailwindcss devDependency。消费方继续 `import '@pactor-app/chat/styles.css'` 即可同时获得语义类与工具类。

### 测试迁移

`packages/ui/tests/components/` 的 `ai-chat-components.test.tsx`、`chat-page.test.tsx`、`artifact-panel.test.tsx`（ui 侧产物面板测试）迁入 `packages/chat/tests/`，import 改指 `@pactor-app/ui` → 包内相对路径；chat-input.test.tsx 留 ui（ChatInput 不动）。

### 消费方更新

- `doc/src/components/previews/basic-e.tsx`：改从 `@pactor-app/chat/components` 导入；doc package.json 加 `@pactor-app/chat` 依赖。
- doc DSL 预览注册（`DslPreview.tsx` 等创建 registry 处）：加 `registerChatComponents`（ChatPage 模板依赖）。
- `doc/src/assets-data/details/ai-chat-details.ts`：包归属文案更新。
- `docs/src/content/docs/packages/chat.md`：补 `/components` 子路径与 `registerChatComponents` 说明。

## Risks / Trade-offs

- [下游按 `@pactor-app/ui` 导入 chat 组件编译失败] → BREAKING 已在 proposal 标明；仓内唯一消费点（doc）同步更新；发布 major bump + CHANGELOG。
- [DSL 页面 `type: ChatPage` 因未注册渲染失败] → doc 所有 registry 创建处统一加 registerChatComponents；chat-dsl-component spec 场景兜底。
- [Tailwind 工具类缺失导致视觉回归] → chat 编译产物 grep 抽查类名（如 `size-8`、`rounded-xl`）；doc 详情页与模板页浏览器实测。
- [ui/chat 样式表重复携带 Tailwind 工具类，体积膨胀] → 接受（两包独立分发、独立可用的代价）；后续可评估共享基础层。
- [迁移组件对 ui 内部路径的深 import 遗漏] → typecheck + build 兜底；grep `packages/chat/src/components` 内残留 `../../../ui/` 相对路径。

## Migration Plan

1. chat：迁目录、改 import、components 子路径、registerChatComponents、Tailwind 构建。
2. ui：删目录与导出、register.ts、令牌迁出。
3. 测试迁移。
4. doc/docs 消费方更新。
5. 全仓 build + test + astro build + 浏览器实测。

回滚：单变更提交，revert 恢复。
