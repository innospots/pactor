# Spec: unified-styles-entry

## Purpose

全量场景单一样式入口（`pactor-app/styles.css`）、语义令牌桥单源与域包样式契约。

## ADDED Requirements

### Requirement: 单一样式入口

meta 包 `pactor-app` SHALL 提供 `./styles.css` 出口：构建期将 `@pactor-app/ui`、`@pactor-app/blocks`、`@pactor-app/chart`、`@pactor-app/chat` 的已编译样式表按 ui → blocks → chart → chat 顺序内联为单张自包含样式表（不依赖消费方 bundler 的 css @import 解析）；`pactor-app` SHALL 声明 blocks、chart 依赖并将 `./styles.css` 标记为 sideEffects。全量场景消费方 SHALL 仅需 `import 'pactor-app/styles.css'` 一次；各域包 `./styles.css` 出口 SHALL 继续可用（按需路径）。

#### Scenario: 单次引入

- **WHEN** 宿主仅 `import 'pactor-app/styles.css'`，渲染 ui 组件、blocks 组件、chart 组件与 chat 组件
- **THEN** 各组件视觉完整（preflight、令牌、工具类、域类均在场）

#### Scenario: 产物自包含

- **WHEN** 检索 `pactor-app` 发布的 styles.css
- **THEN** 四个域包的编译产物均已内联（含来源 banner），无未解析的 `@import '@pactor-app/*'`

#### Scenario: 分表路径保留

- **WHEN** 宿主按需仅引入 `@pactor-app/ui/styles.css` 与 `@pactor-app/chat/styles.css`
- **THEN** ui 与 chat 组件视觉完整，与聚合路径一致

### Requirement: 语义令牌桥单源

`@theme inline` 语义令牌 → 工具类桥接 SHALL 全仓单一定义于 `@pactor-app/ui/theme-bridge.css`（ui exports 提供该文件出口）；chat / blocks / chart 的样式源 SHALL 经 `@import '@pactor-app/ui/theme-bridge.css'` 引用，MUST NOT 保留桥接块拷贝。桥接映射运行时经 `var()` 解析，令牌值本体 SHALL 仅由 ui 的 styles.css `:root`（及暗色覆盖）定义。

#### Scenario: 无桥接拷贝

- **WHEN** 检索 chat / blocks / chart 的 `src/styles.css` 中的 `@theme inline` 块
- **THEN** 无匹配；头部为 `@import '@pactor-app/ui/theme-bridge.css'`

#### Scenario: 编译产物等价

- **WHEN** 各域包执行 build:styles
- **THEN** 产物内联桥接映射且工具类（bg-background 等）可用，运行时随宿主皮肤/暗色切换

### Requirement: 域包样式契约

chat / blocks / chart 的样式表 MUST NOT 包含 preflight（Tailwind base 层）；preflight SHALL 仅由 ui 的 styles.css 提供。域包的 Tailwind 引入 SHALL 采用 `@import 'tailwindcss/theme.css' layer(theme)` 与 `@import 'tailwindcss/utilities.css' layer(utilities)` 形式。域包 package.json SHALL 将 `./styles.css` 标记为 sideEffects。

#### Scenario: preflight 唯一

- **WHEN** 检索 chat / blocks / chart 编译产物中的 preflight 规则（如 `*,::before,::after` 盒模型基线）
- **THEN** 无匹配；preflight 仅存在于 ui 与聚合产物中（经 ui 段）

#### Scenario: sideEffects 标记

- **WHEN** 查看各域包 package.json 的 sideEffects 字段
- **THEN** 均包含 `./styles.css`
