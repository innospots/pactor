## MODIFIED Requirements

### Requirement: 皮肤 CSS 生成与下载

工作室 SHALL 将"tokens.ts 令牌默认值 ∪ 预置主题令牌 ∪ 用户修改"（后者优先）合成为一份皮肤 CSS 文本：`:root` 亮色覆盖块 MUST 包含 tokens.ts 登记的全部令牌（预置主题未定义的令牌以默认值出现在导出中，如 `--sidebar` 基座族）；预置主题含 `darkTokens` 时 MUST 同时生成 `[data-pactor-theme='dark']` 暗色覆盖块（暗色块不做默认值兜底，未提供的暗色令牌回退内置暗色皮肤），否则附带注释掉的暗色骨架引导。预览与下载 SHALL 使用同一份合成文本；点击下载 SHALL 经 Blob 生成 `pactor-theme.css` 文件下载，该文件在宿主系统中于 `@pactor-app/ui/styles.css` 之后加载即生效。

#### Scenario: 下载文件可用

- **WHEN** 用户选择主题、修改若干令牌后点击下载
- **THEN** 得到 `pactor-theme.css`，内容为 `:root` 令牌覆盖块（含全部已知令牌）；主题含暗色令牌组时同时含 `[data-pactor-theme='dark']` 块，且与当前预览效果一致

#### Scenario: 导出包含预置主题未定义的令牌

- **WHEN** 所选预置主题未定义 `--sidebar`（基座族）且用户未修改它
- **THEN** 导出 CSS 的 `:root` 块仍包含 `--sidebar`，值为 tokens.ts 登记的默认值

#### Scenario: 覆盖优先级不变

- **WHEN** 同一令牌同时存在于默认值、预置主题与用户修改中
- **THEN** 导出值依次由用户修改 > 预置主题 > 默认值决定

#### Scenario: 导出与预览同源

- **WHEN** 对比下载文件内容与发送给 iframe 的 CSS 文本
- **THEN** 两者完全相同
