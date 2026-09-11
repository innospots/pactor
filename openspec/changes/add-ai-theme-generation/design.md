# 设计：主题工作室 AI 生成主题

## Context

theme-studio 是纯前端工具应用（pactor DSL 页面 + 模块级 store），已部署为 Cloudflare 纯静态 assets Worker（无服务端代码）。皮肤产物是一份 CSS：`:root { …亮色令牌 }` + `[data-pactor-theme='dark'] { …暗色令牌 }`，令牌清单见 `src/tokens.ts`（与 `packages/ui/src/styles.css` 双向同步、有测试约束）。聊天能力有现成的 `@pactor-app/chat`（MessageBubble / Composer / ChatInput 等可独立复用）。

约束：
- 静态托管没有后端，大模型调用必须有代理（浏览器直连第三方 API 会暴露 key 且大概率有 CORS 问题）
- 生成结果必须可叠加进现有 store overrides 机制（预览/下载链路零改动复用）
- 令牌清单是封闭集合，模型只能输出清单内的令牌名

## Goals / Non-Goals

**Goals:**
- Header 右端「AI 生成」按钮 → 右侧滑层（50% 宽）内聊天式交互
- 引导问题模板收敛模糊需求：问题一风格 8 选项、问题二色系 10 选项（取自中国传统色）
- 调用大模型生成完整皮肤 CSS，可「应用到预览」+「下载」
- Worker 代理接口 `/api/theme-generate`（OpenAI 兼容协议转发）

**Non-Goals:**
- 多轮自由对话式迭代修改（本轮只做"引导问答 → 一次生成"；后续可扩展）
- 生成结果的 diff 视图 / 版本管理
- 用户自定义大模型供应商的 UI 配置页（仅 wrangler vars/secret 配置）

## Decisions

### D1：滑层内聊天为本地轻量实现，复用 ui 的 ChatInput

滑层内容 = 本地令牌着色的轻量气泡 + 选项卡片 + `ChatInput`（ui 组件，经 `@pactor-app/ui/components` React 导出）。chat 包的 MessageBubble 依赖 ChatMessage 模型与渲染运行时，绑定 ConversationStore/流式协议，与本地引导状态机不匹配；滑层始终挂载、以 transform 显隐，关闭不打断生成、重开恢复对话。

### D2：引导流程为本地确定性状态机，不让模型自由提问

`src/ai/flow.ts`：开场仅欢迎语（idle）；用户输入后 `isVague` 判定——足够明确（命中风格/色系关键词或描述具体）直接生成；不明确则缺什么问什么（askStyle → askPalette），答齐即生成。「不确定才提问」的判定放本地：命中关键词或输入足够具体即跳过提问。理由：问题模板是固定产品需求，走模型既慢又不稳定。

选项内容：
- 风格：科技、生活、财经、教育、医疗、电商、文娱、政务
- 色系（中国传统色，china_colors.md 各节气代表色系精选 10）：绯红（珊瑚赫）、杏黄（半見）、明黄（梔子）、草绿（碧山）、青碧（青冥）、靛蓝（群青）、紫罗兰（齊紫）、胭脂（胭脂水）、墨灰（玄天）、月白（月白）

### D3：大模型代理走 Worker `main` 入口，OpenAI 兼容协议

wrangler.jsonc 从纯 assets 改为 `main: worker/index.ts` + assets 静态托管（`assets.not_found_handling` 保持 SPA）。Worker fetch：`/api/theme-generate` 以外的请求交给 assets；POST 请求体 `{ style, palette, freeText }`，Worker 拼 prompt（注入完整令牌清单 + 输出格式约束）转发到 `LLM_BASE_URL`（OpenAI 兼容 `/chat/completions`），鉴权头用 `LLM_API_KEY`（secret）。本地开发：vite server.proxy `/api` → `wrangler dev` 的本地 Worker，或直连本地 `LLM_BASE_URL`。

备选方案（否掉）：浏览器直连模型 API —— key 暴露；让用户填 key —— 内部工具，部署方统一配置更顺。

### D4：生成结果按"皮肤 CSS 文本"协议解析，而非结构化 JSON

要求模型输出且仅输出一个 ```css 代码块（含 `:root` 与 `[data-pactor-theme='dark']` 两块）。前端 `src/ai/parse.ts`：提取 css 块 → 正则逐行解析 `--token: value` → **白名单过滤**（仅 tokens.ts 清单内的令牌名保留）→ 写入 store overrides（亮色进 overrides；暗色块存入 store 新增的 darkOverrides，合成 CSS 时并入暗色段）。白名单过滤防止模型幻觉出无效令牌污染皮肤。

备选方案（否掉）：JSON 结构化输出再转 CSS —— 多一层转换，且 CSS 直出对用户可读、可直接下载。

### D5：应用与下载复用现有链路

「应用到预览」= 批量 setTokenOverride + selectPreset(null)（标记为自定义）；「下载」走现有 getComposedCss 合成（AI 暗色令牌并入）。滑层开关状态放 store（`aiDrawerOpen`），Header 按钮在 studio.page.yaml 中新增自定义组件 `AiGenerateButton`。

## Risks / Trade-offs

- [模型输出不合法 CSS / 幻觉令牌] → D4 白名单过滤 + 解析失败时在聊天内提示重试（附带原始输出折叠展示）
- [无 API key 的部署环境] → Worker 检测缺 secret 返回 501 + 明确文案；前端展示"未配置模型服务"提示，不影响工作室其它功能
- [prompt 长度（令牌全表 ~70 个）] → 仅注入令牌名 + 默认值 + 一句用途，控制在 ~2k tokens
- [暗色生成质量不稳定] → 暗色块允许模型省略；省略时前端按现有暗色兜底（`[data-pactor-theme='dark']` 默认块）正常降级

## Migration Plan

1. 本地：`pnpm dev`（vite proxy）+ `wrangler dev` 起代理验证
2. 部署：`wrangler secret put LLM_API_KEY` 后 `pnpm deploy`
3. 回滚：wrangler rollback 或去掉 main 入口退回纯 assets
