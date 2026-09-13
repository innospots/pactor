# theme-studio 变更：新增 AI 生成入口

## ADDED Requirements

### Requirement: AI 生成入口

主题工作室 SHALL 在工作室页 Header 右端提供「AI 生成」入口按钮，点击后打开 AI 生成滑层（见 theme-studio-ai-generate 能力）；工作室的预览皮肤来源 SHALL 在「预置主题 + 手动令牌覆盖」之外支持「AI 生成结果」，AI 结果 MUST 以与手动覆盖相同的 store 覆盖层机制叠加到预览与下载产物中。

#### Scenario: 入口可见

- **WHEN** 打开主题工作室首页
- **THEN** Header 右端可见「AI 生成」按钮，点击后打开 AI 生成滑层

#### Scenario: AI 结果叠加

- **WHEN** 用户在 AI 滑层中将生成结果应用到预览
- **THEN** 右侧预览与「下载皮肤 CSS」产物与手动修改令牌走同一覆盖层与合成逻辑
