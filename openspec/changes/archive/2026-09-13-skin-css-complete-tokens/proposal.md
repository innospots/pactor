## Why

Theme Studio 生成的皮肤 CSS 只包含「预置主题 tokens ∪ 用户 overrides」，预置主题未定义的令牌整体缺失——典型如 `--sidebar` / `--sidebar-foreground` / `--sidebar-border` / `--sidebar-ring`（预置主题只定义了 sidebar-primary/accent 等部分族），`--calendar-*`、`--menu-*` 等同样缺失。生成的皮肤文件依赖内置默认值兜底，不是一份完整自洽的皮肤，用户无法从导出文件中看到/继续编辑这些令牌。

## What Changes

- `composeSkinCss` 的合并顺序改为：tokens.ts 默认值（全量令牌）→ 预置主题 tokens → 用户 overrides——导出的 `:root` 块包含全部已知令牌，预置主题与用户修改仍按原优先级胜出
- 暗色块逻辑不变（预置 darkTokens ∪ AI 暗色 overrides）

## Capabilities

### New Capabilities
（无）

### Modified Capabilities
- `theme-studio`: 「皮肤 CSS 生成与下载」的合成口径从「预置 ∪ 用户修改」修订为「默认值 ∪ 预置 ∪ 用户修改」（导出文件包含全量令牌）

## Impact

- `tools/theme-studio/src/skin.ts`（合并逻辑）;`tools/theme-studio/tests/skin.test.ts`（用例更新）
- 导出文件体积变大（全量令牌），但值与内置默认一致时不产生视觉差异
