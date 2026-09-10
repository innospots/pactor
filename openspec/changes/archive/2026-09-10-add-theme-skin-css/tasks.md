## 1. 令牌契约补全（styles.css）

- [x] 1.1 在 `packages/ui/src/styles.css` 的 `:root` 补全新令牌：`--font-sans`、`--background-image`（默认 `none`）、`--card-shadow`（默认 `none`）、`--shadow-color`，暗色块与跟随系统媒体查询块同步补对应值
- [x] 1.2 定义组件级令牌（默认值 `var(--语义令牌, fallback)` 回退）：`--switch-track/thumb`、`--slider-track/range/thumb`、`--radio-border/checked`、`--progress-track/indicator`、`--pagination-active-background/border/radius`、`--menu-hover-background`、`--menu-active-background`、`--calendar-*`（按 calendar 组件现状定粒度）
- [x] 1.3 body/页面底层容器应用 `background-color: var(--background); background-image: var(--background-image);`，body 字体改读 `--font-sans`

## 2. 组件硬编码清理与令牌接入

- [x] 2.1 全量检索 `packages/ui/src`（ui/、components/、layout/）中的硬编码颜色（oklch/rgba/十六进制）与 Tailwind 静态色类（`bg-gray-*`、`text-white` 等），列出清单
- [x] 2.2 将硬编码颜色迁移到语义令牌或组件级令牌，默认值保持现状视觉
- [x] 2.3 Switch/Slider/Radio/Progress/Pagination 组件改读各自 `--*` 组件级令牌
- [x] 2.4 Menu/Combobox/Command/ContextMenu 的 hover 与选中背景统一改读 `--menu-hover/active-background`
- [x] 2.5 Card 阴影改读 `--card-shadow`；弹层阴影色改读 `--shadow-color`
- [x] 2.6 核实 Chart 组件色板读取 `--chart-1..5`（有硬编码则迁移）；Calendar 颜色改读 `--calendar-*`

## 3. 验证

- [x] 3.1 新增测试：加载覆盖令牌的皮肤样式后组件计算样式随之变化（jsdom 令牌解析或 DOM 断言）、皮肤未覆盖时暗色回退不破损
- [x] 3.2 `pnpm --filter @pactor-app/ui build` 通过；全仓 `pnpm -r --if-present build`、`pnpm -r --if-present typecheck`、`pnpm test` 绿
- [x] 3.3 视觉抽查：examples/chat 或 examples/admin 加载一个示例皮肤 CSS，验证主色/圆角/菜单 hover/渐变背景生效且默认（无皮肤）视觉不回归

## 4. 文档

- [x] 4.1 docs 新增《皮肤定制》指南：完整令牌清单表（作用元素/默认值/分组）、示例皮肤文件（light + dark 双块写法）、`<link>` 加载与运行时切换（新表 load 后移除旧表）示例、背景/前景成对覆盖与 WCAG AA 对比度要求
- [x] 4.2 `packages/ui` README 与 llms.txt 补充皮肤令牌契约说明并链接文档
