# Design: unified-styles-entry

## Context

四包样式现状（行数为 dist 产物）：ui（4561，全量 tailwind + 令牌值 + 桥）、chat（2555，全量含 preflight + 桥拷贝 + `.pactor-chat-*` + 内联 markdown）、blocks（1340，lean：theme+utilities layer + 桥拷贝）、chart（255，同 blocks）。桥接块（`@theme inline` 语义令牌 → 工具类映射）在 4 包各拷贝一份。消费方需按序 import 多张表（template 现状：globals → ui → blocks → chat）。`pactor-app` meta 包聚合 13 个 workspace 包但无样式出口，且不含 blocks/chart 依赖。

约束：各包 styles.css 保持独立可用（按需路径）；令牌值（:root / dark）只能定义在 ui（皮肤契约：皮肤 CSS 在后加载覆盖令牌）。

## Goals / Non-Goals

**Goals:**
- 全量场景消费方单次 `import 'pactor-app/styles.css'`。
- `@theme inline` 桥接全仓单一定义。
- 域包样式契约统一：无 preflight、cascade layer 约定一致。
- 各包分表路径行为不变。

**Non-Goals:**
- 不做 Tailwind 工具类跨包去重（单编译管线留作后续）。
- 不改令牌值、不改皮肤契约、不改 markdown 手写样式体系。
- 不新建 theme 包（ui 保持 UI 基线定位）。

## Decisions

### 聚合方式：构建期内联，非运行时 @import

`pactor-app` 新增 `scripts/build-styles.mjs`：按 **ui → blocks → chart → chat** 顺序读取各包已编译 `styles.css`，拼接写入 `pactor-app/styles.css`（每段带 banner 注释标明来源包与版本）。build = `tsup && node scripts/build-styles.mjs`，prepublish 自动带上。

选构建期内联而非 css `@import` 链：产物自包含，消费方任意 bundler / 原生 `<link>` 均可直接用，不依赖其 css @import 解析能力。

顺序依据：ui（基线：preflight + 令牌值 + 全量工具类）最先；blocks/chart（layer 包装的 theme/utilities + 各自组件类）居中；chat（语义类 + 组件工具类）最后——与 template 现行注释约定的加载序一致，级联行为与多表引用逐字节对齐。

### blocks / chart 纳入 meta 依赖

单入口要覆盖 template 的三表场景（ui + blocks + chat），meta 必须聚合 blocks/chart。meta 定位即「全家桶」——单包用户本就接受全量安装；JS 未引用部分由 tree-shaking 消化，CSS 聚合是此定位的自然延伸。blocks/chart 独立包保留，按需用户不受影响。

### 桥接单源：`@pactor-app/ui/theme-bridge.css`

ui `src/theme-bridge.css` 存放 `@theme inline` 块（现 ui/chat/blocks/chart 四份拷贝的内容），ui 的 `src/styles.css` 改为 `@import './theme-bridge.css'`（编译期相对内联，dist 产物不变）；package.json exports 增加 `./theme-bridge.css`（纯文件出口）。chat/blocks/chart 的 src 头部写 `@import '@pactor-app/ui/theme-bridge.css'`——Tailwind CLI 编译期经 node 解析内联，各包 dist 产物内容不变（桥接仍以 var() 运行时解析），但定义只剩一份。新增语义令牌时只改 ui。

### chat 对齐 lean 模式

chat `src/styles.css` 的 `@import 'tailwindcss'` 改为 `@import 'tailwindcss/theme.css' layer(theme)` + `@import 'tailwindcss/utilities.css' layer(utilities)`（与 blocks/chart 逐字对齐），移除 preflight。chat 组件本就随 ui 加载（chat 依赖 ui），preflight 由 ui 提供；独立用 chat 的场景与 blocks/chart 现状一致（头注释注明须搭配 ui styles.css 或 pactor-app/styles.css）。chat 特有的 markdown 内联与 `.pactor-chat-*` 手写层不动。

### sideEffects 对齐

blocks / chart 的 package.json `sideEffects: false` 改为 `["./styles.css"]`（CSS import 不被 tree-shake，与 ui/chat 对齐）。

### 消费方

- template `app/layout.tsx`：三张 pactor 表 → 单次 `import "pactor-app/styles.css"`（保留 globals 与皮肤脚本）。
- examples/chat、examples/admin：`ui/styles.css` + `chat/styles.css` → `pactor-app/styles.css`。
- doc / theme-studio：使用分表按需路径，本变更不动（doc 预览按包隔离验证反而依赖分表）。

## Risks / Trade-offs

- [聚合表工具类重复（约 8.7k 行未去重）] → 接受（独立可用性的代价；gzip 对重复片段压缩率高）；后续可评估单编译优化。
- [chat 去 preflight 后独立使用场景基线缺失] → 与 blocks/chart 同一契约并写明注释；chat 依赖 ui，正常链路必有 preflight。
- [桥接 import 在旧版 Tailwind CLI / 非 node 解析环境失败] → 仓内统一 Tailwind v4 CLI；编译失败即显错，CI 构建兜底。
- [meta 体积增大（blocks/chart 安装量）] → meta 定位即全量；按需用户走分表路径不经过 meta。
- [聚合产物与分表产物内容漂移（如某包忘构建）] → build-styles 脚本读取的是各包 dist 产物，聚合前校验各文件存在且非空；根 `pnpm -r build` 拓扑序保证先构建域包。

## Migration Plan

1. ui：抽 theme-bridge.css + exports（ui dist 产物内容不变，纯源结构调整）。
2. chat / blocks / chart：桥改 import；chat 改 lean；sideEffects 对齐；各自构建验证 dist 内容等价（chat 去掉 preflight 属预期 diff）。
3. pactor-app：build-styles 脚本 + exports + deps；构建验证聚合产物。
4. template / examples 改单入口；全仓 build + test + astro build + 浏览器实测（颜色/preflight/暗色切换）。

回滚：各包改动相互独立，可按包 revert。
