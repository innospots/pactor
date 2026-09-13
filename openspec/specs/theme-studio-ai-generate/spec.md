# theme-studio-ai-generate Specification

## Purpose
TBD - created by archiving change add-ai-theme-generation. Update Purpose after archive.
## Requirements
### Requirement: AI 生成入口与滑层

工作室页 Header 右端 SHALL 提供「AI 生成」按钮；点击后 MUST 从右侧滑出占页面宽度 50% 的滑层，滑层内为聊天对话界面（消息气泡 + 底部输入框），消息气泡与输入框 MUST 复用 `@pactor-app/chat` 的现成零件（MessageBubble / ChatInput），皮肤令牌与工作室全局一致。滑层 SHALL 支持关闭（关闭按钮与遮罩点击），关闭不打断进行中的生成。

#### Scenario: 打开滑层

- **WHEN** 用户点击 Header 右端的「AI 生成」按钮
- **THEN** 右侧滑出占页面宽度 50% 的滑层，内部展示聊天对话界面与输入框

#### Scenario: 关闭滑层

- **WHEN** 用户点击滑层关闭按钮或遮罩
- **THEN** 滑层收起，已产生的对话内容保留（再次打开时恢复）

### Requirement: 引导问题模板

滑层开场 SHALL 只展示欢迎语，不主动提问；仅当用户输入的需求描述语义不明确（过短或过于泛化，未覆盖风格与色系）时，滑层 SHALL 针对缺失的维度展示引导问题卡片进行澄清，每个问题提供可点击的选项，用户 MUST 也可以自由输入文本作答：

- 问题一「您期望生成的主题风格是？」SHALL 提供 8 个选项：科技、生活、财经、教育、医疗、电商、文娱、政务
- 问题二「您期望的色系是？」SHALL 提供 10 个取自中国传统色的色系选项：绯红（珊瑚赫）、杏黄（半見）、明黄（梔子）、草绿（碧山）、青碧（青冥）、靛蓝（群青）、紫罗兰（齊紫）、胭脂（胭脂水）、墨灰（玄天）、月白（月白）

用户输入足够明确时 SHALL 不提任何问题，直接进入生成。

#### Scenario: 不明确时按需提问

- **WHEN** 用户输入「帮我生成一个主题」这类泛化描述
- **THEN** 滑层展示风格问题及 8 个选项；作答后若色系仍缺失，再展示色系问题及 10 个选项

#### Scenario: 描述明确时直接生成

- **WHEN** 用户输入已说明具体需求（如「深色背景、大圆角、高对比度的阅读型界面」或命中风格/色系关键词）
- **THEN** 不展示问题卡片，直接调用生成接口

### Requirement: 大模型代理接口

部署为 Cloudflare Worker 时 SHALL 提供 `POST /api/theme-generate` 接口：请求体为 `{ style: string, palette: string, freeText?: string }`；Worker SHALL 将完整皮肤令牌清单（名称 + 默认值 + 用途）注入 prompt，转发到经 `LLM_BASE_URL` / `LLM_MODEL`（vars）与 `LLM_API_KEY`（secret）配置的 OpenAI 兼容 chat completions 接口，并将模型输出原样返回。未配置 `LLM_API_KEY` 时接口 MUST 返回 501 与可读错误文案。本地开发 SHALL 经 vite proxy 访问同一接口。

#### Scenario: 正常生成

- **WHEN** 前端 POST 收集到的风格与色系答案到 `/api/theme-generate`
- **THEN** Worker 转发至配置的 OpenAI 兼容接口并返回模型生成的皮肤 CSS 文本

#### Scenario: 未配置密钥

- **WHEN** Worker 缺少 `LLM_API_KEY` 配置时收到生成请求
- **THEN** 返回 501 状态码与「未配置模型服务」的可读错误，前端在聊天内展示该提示

### Requirement: 生成结果解析与应用

前端 SHALL 从模型输出中提取 css 代码块，逐行解析 `--token: value` 声明，并 MUST 以 tokens.ts 令牌清单为白名单过滤（清单外令牌一律丢弃）：`:root` 块令牌写入亮色覆盖，`[data-pactor-theme='dark']` 块令牌写入暗色覆盖。结果卡片 SHALL 提供「应用到预览」（写入 store 覆盖层，右侧预览与下载即时生效）与「下载」两个操作。解析失败时 MUST 在聊天内给出可重试的错误提示。

#### Scenario: 应用生成结果

- **WHEN** 模型返回合法 css 块且用户点击「应用到预览」
- **THEN** 白名单内令牌写入 store 覆盖层，右侧预览实时呈现 AI 主题，下载按钮产物包含这些令牌

#### Scenario: 幻觉令牌过滤

- **WHEN** 模型输出包含 tokens.ts 清单之外的自定义属性
- **THEN** 这些声明被丢弃，不进入覆盖层与下载产物

#### Scenario: 解析失败

- **WHEN** 模型输出中不存在可解析的 css 代码块
- **THEN** 聊天内展示错误提示与「重新生成」操作，不改动当前皮肤状态

