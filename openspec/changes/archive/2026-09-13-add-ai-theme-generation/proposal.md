# 提案：主题工作室 AI 生成主题

## Why

主题工作室（tools/theme-studio）目前只能基于 11 套预置主题做令牌微调，用户想要"完全不同风格"的皮肤时，必须手写大量令牌值，门槛高。借助大模型，用户用自然语言描述需求即可生成整套皮肤 CSS，再通过引导式问题（风格、色系）收敛模糊需求，显著降低皮肤创作成本。

## What Changes

- 工作室页 Header 右端新增「AI 生成」按钮，点击后从右侧滑出占页面宽度 50% 的滑层（Drawer），滑层内为 Chat 聊天对话（复用 @pactor-app/chat 的 Chat 组件与 ChatInput）
- 聊天开场由 AI 主动发送引导问题卡片（问题模板）：
  - 问题一「您期望生成的主题风格是？」：科技、生活、财经、教育、医疗、电商、文娱、政务 8 个选项
  - 问题二「您期望的色系是？」：从中国传统色（china_colors.md）精选 10 个色系选项（绯红、杏黄、明黄、草绿、青碧、靛蓝、紫罗兰、胭脂、墨灰、月白）
  - 用户可点选选项，也可直接自由输入
- 收集到足够信息（或用户直接描述清楚）后，调用大模型接口生成完整皮肤 CSS（`:root` 亮 + `[data-pactor-theme='dark']` 暗两块令牌），返回后一键「应用到预览」（写入 store overrides 实时生效）与「下载」
- theme-studio 从纯静态 assets Worker 改为「静态 assets + Worker 入口」：`POST /api/theme-generate` 代理转发到 OpenAI 兼容接口（base URL / model 经 wrangler vars 配置，API key 经 secret 配置），本地 dev 用 Vite proxy + 环境变量走同一协议

## Capabilities

### New Capabilities

- `theme-studio-ai-generate`：AI 生成主题端到端能力——AI 生成入口与滑层布局、引导问题模板（风格/色系选项）、大模型代理接口协议、生成结果的解析/应用/下载

### Modified Capabilities

- `theme-studio`：工作室页布局新增「AI 生成」入口；预览皮肤来源新增「AI 生成结果」（叠加为 store overrides）

## Impact

- `tools/theme-studio`：新增滑层与 AI 聊天组件、引导问题流程、生成 CSS 解析逻辑；wrangler.jsonc 增加 `main` Worker 入口与 LLM 相关 vars/secret；vite.config 增加 dev 代理
- 新依赖：无前端新依赖（复用 @pactor-app/chat、ui Drawer/Sheet）；Worker 端用原生 fetch
- 部署：`pnpm deploy` 前需 `wrangler secret put LLM_API_KEY`；缺失配置时接口返回明确错误，前端降级提示
