## Context

`composeSkinCss(preset, overrides, darkOverrides)` 目前只合并预置主题 tokens 与用户 overrides；预置主题（presets.ts）是令牌子集（如只定义 `--sidebar-primary`/`--sidebar-accent`，不含 `--sidebar` 基座族），导致导出 CSS 缺令牌。`resolve.ts` 已有 `TOKEN_DEFAULTS`（由 tokens.ts 元数据 flatMap 出的全量默认值表），预览取色本就以它为兜底——导出与之一致即可。

## Goals / Non-Goals

**Goals:**

- 导出的皮肤 CSS 的 `:root` 块包含 tokens.ts 登记的全部令牌（默认值 → 预置 → 用户修改三层合并，后者优先）
- 预览与下载仍共用同一份合成文本（现有契约不变）

**Non-Goals:**

- 暗色块不引入默认值兜底（暗色仍按预置 darkTokens ∪ AI 暗色 overrides，未提供的回退内置暗色皮肤——现有语义保留）
- 不改 presets.ts 的令牌子集现状

## Decisions

### D1: 默认值作为合并底层，而非要求预置主题补全令牌

`TOKEN_DEFAULTS` 前移到合并链底层：`{ ...TOKEN_DEFAULTS, ...preset.tokens, ...overrides }`。默认值即内置 styles.css 的同值（含 var() 引用），钉进导出文件不改变视觉。备选方案「要求每个预置主题补全全部令牌」维护成本高且 presets 仍在演进，不采用。`TOKEN_DEFAULTS` 从 resolve.ts 提取共享（skin.ts 与 resolve.ts 同源使用）。

### D2: sidebar 令牌族默认值为语义别名，暗色仅保留 intentional 差异项

导出生成完整了，但 `--sidebar` 基座族的字面默认值（中性灰）与主题色不搭。将 styles.css `:root` 的 sidebar 一族改为语义别名（`--sidebar: var(--card)`、primary/accent/border/ring 对应同名语义令牌），与 `--calendar-*` 一族的别名约定一致：任何改 card/primary/accent/border/ring 的主题自动得到匹配的侧栏。亮色默认外观仅 `--sidebar` 从 oklch(0.985) 变为 --card 的纯白（肉眼不可分辨），其余七个别名与原字面值完全相等。暗色块中 6 个与语义令牌同值的覆盖删除（自动适配），`--sidebar-primary` / `--sidebar-primary-foreground` 在暗色下刻意不等于 `--primary`（蓝色强调 vs 浅灰），保留显式覆盖。tokens.ts 的 defaultValue 同步为相同别名（生成/预览/导出同源）。

## Risks / Trade-offs

- [导出文件从"差量覆盖"变为全量清单，用户难分辨哪些是主题特色] → themeComment 已标注来源主题；默认值与内置一致，后续可考虑注释分组，本期不做
- [亮色 `--sidebar` 从 oklch(0.985) 变为纯白（--card）是肉眼级微小差异] → 与主题自适应的收益相比可接受；如需绝对不变可再引入 `--sidebar` 独立基色，但会破坏别名一致性，不采用
