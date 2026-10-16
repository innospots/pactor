# Proposal: unified-styles-entry

## Why

`ui` / `chat` / `blocks` / `chart` 各自维护公共样式表，消费方需按顺序手动 import 多张 CSS（globals → ui → blocks → chat…），漏引即组件裸奔、顺序错即级联异常（本次 template 更新就是实例）。同时各包的样式基建存在重复与漂移：`@theme inline` 语义令牌桥在 4 个包各拷贝一份；chat 含 preflight 与 ui 双份；blocks/chart 已是 lean 模式而 chat 未对齐。用户期望：**只引用一次 CSS**。

## What Changes

- meta 包 `pactor-app` 新增 `./styles.css` 聚合出口：构建期将 ui → blocks → chart → chat 的编译产物内联为单张样式表（markdown 已由 chat 内联），消费方 `import 'pactor-app/styles.css'` 一次完成；`pactor-app` 新增 `@pactor-app/blocks`、`@pactor-app/chart` 依赖，sideEffects 标记 `./styles.css`。
- 语义令牌桥单源化：ui 新增 `./theme-bridge.css` 出口（`@theme inline` 桥接块的唯一定义），chat / blocks / chart 的 `src/styles.css` 改为 `@import` 该文件，删除 3 份拷贝。
- chat 对齐 blocks/chart 的 lean 模式：`@import 'tailwindcss/theme.css' layer(theme)` + `utilities.css layer(utilities)`，移除 preflight（preflight 由 ui 唯一提供）；聚合后 ui 的 preflight 天然覆盖全链路。
- blocks / chart 的 package.json `sideEffects` 补 `./styles.css` 标记（与 ui/chat 对齐，防 CSS 被 tree-shake）。
- 各域包 styles.css 保持独立发布（按需引用路径不变）；聚合表为「全量单入口」路径。
- 消费方更新：pactor-prd template、examples/chat、examples/admin 改为单次 `import 'pactor-app/styles.css'`（按需场景可继续分表引用）。

## Capabilities

### New Capabilities

- `unified-styles-entry`: meta 包聚合样式出口契约（单入口、内联顺序、与分表路径并存）、语义令牌桥单源契约、域包样式契约（无 preflight、layer 约定、令牌值仅 ui 定义）。

### Modified Capabilities

- `ui-package-structure`: 「主子路径入口」需求补充 `./theme-bridge.css` 样式片段出口。

## Impact

- **代码**：`packages/ui`（theme-bridge.css 抽出、exports）、`packages/chat`（src/styles.css 改 lean + 桥 import）、`packages/blocks`、`packages/chart`（桥 import、sideEffects）、`packages/pactor`（聚合构建脚本、exports、deps）；template / examples 的样式 import。
- **API**：新增 `pactor-app/styles.css` 与 `@pactor-app/ui/theme-bridge.css` 两个出口（纯新增，无破坏）。
- **依赖**：`pactor-app` 新增 blocks、chart workspace 依赖；域包构建期依赖 ui 的 theme-bridge.css（Tailwind CLI 内联，无运行时依赖）。
- **构建**：各包 build 命令不变；`pactor-app` build 增加聚合步骤。
- **已知取舍**：聚合表内 Tailwind 工具类仍按包重复（各包独立可用的固有代价，gzip 对重复片段友好）；方案二（单编译去重）留作后续可选优化。
