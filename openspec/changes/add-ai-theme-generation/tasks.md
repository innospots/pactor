# 任务：AI 生成主题

## 1. Worker 代理接口

- [x] 1.1 新增 `tools/theme-studio/worker/index.ts`：fetch 入口，`/api/theme-generate` 之外的请求交给 assets；POST `/api/theme-generate` 校验请求体 `{ style, palette, freeText? }`，从 `LLM_API_KEY` 缺失时返回 501 可读错误
- [x] 1.2 prompt 拼装：注入 tokens.ts 令牌清单（名称+默认值+用途）与输出格式约束（仅输出一个含 `:root` 与 `[data-pactor-theme='dark']` 的 css 代码块），转发至 `LLM_BASE_URL` + `LLM_MODEL` 的 OpenAI 兼容 chat completions，原样返回文本
- [x] 1.3 wrangler.jsonc 增加 `main: "worker/index.ts"` 与 vars（LLM_BASE_URL / LLM_MODEL），保留 assets SPA 配置；vite.config 增加 `/api` dev 代理
- [x] 1.4 Worker 单测（vitest）：请求转发、缺 key 501、非 api 路径放行

## 2. AI 滑层与引导流程

- [x] 2.1 store 增加 `aiDrawerOpen` 开关与 `darkOverrides`（AI 暗色令牌）状态
- [x] 2.2 新增 `src/ai/flow.ts` 状态机：greeting → askStyle → askPalette → confirm → generating → result/error；关键词命中跳过提问；选项内容按 spec（风格 8 项 / 色系 10 项）
- [x] 2.3 新增 `src/components/AiThemeDrawer.tsx`：右侧 50% 宽滑层，消息列表复用 chat 包 MessageBubble，选项卡片为可点按钮组，底部 ChatInput（toolbar 含「重新生成」）
- [x] 2.4 新增 `src/components/AiGenerateButton.tsx` 并在 studio.page.yaml Header 右端引用、main.tsx 注册
- [x] 2.5 flow 状态机单测：选项作答推进、自由输入跳过、confirm 汇总

## 3. 生成结果解析与应用

- [x] 3.1 新增 `src/ai/parse.ts`：提取 css 代码块 → 解析 `--token: value` → tokens.ts 白名单过滤 → 拆分亮/暗两块
- [x] 3.2 「应用到预览」：亮色令牌批量 setTokenOverride、暗色写入 darkOverrides、preset 置为自定义；skin.ts 合成时并入暗色段
- [x] 3.3 结果卡片操作：应用到预览 / 下载 / 重新生成；解析失败聊天内提示且不改动当前皮肤
- [x] 3.4 parse 单测：合法输出、幻觉令牌过滤、无 css 块、仅亮色块降级

## 4. 验证与部署

- [x] 4.1 `pnpm typecheck` + `pnpm test` 全绿
- [x] 4.2 浏览器实测：按钮 → 滑层 → 引导问答 →（mock 接口）生成 → 应用预览 → 下载
- [x] 4.3 `wrangler secret put LLM_API_KEY`（由用户操作）后 `pnpm deploy`，线上验证滑层与生成链路
