# Design: polish-example-admin

## Context

示例页面 DSL 信息架构单薄（平铺 Alert + 三张 Statistic 卡 + 一个 Tabs 卡），默认皮肤细节（数值层级、间距节奏、卡片质感）有提升空间。DSL 不支持自定义 className——视觉增强途径：① DSL 结构组合（嵌套 Card/Grid/Flex）；② 示例 theme.css 用结构选择器与 token 覆盖；③ 皮肤默认值微调。

约束（硬）：class 名与 DOM 结构不变；既有测试零回归；功能演示点（spec example-admin 各 scenario）保留。

## Goals / Non-Goals

**Goals:**

- 三个页面视觉层次显著提升（截图评审为准）。
- theme.css 成为换肤契约的可运行参考。
- 皮肤微调不过度设计。

**Non-Goals:**

- 不改组件实现；不新增组件类型（如图标系统）；不动 token 命名契约。

## Decisions

### D1: 皮肤微调（styles.css，仅值调整）

- Statistic：数值 28px/700、标题 13px muted、suffix 弱化。
- Page：标题区与内容区间距节奏（标题 20-22px + 描述/间距 20px 档）。
- Card：shadow-sm 常驻 + hover shadow-md 过渡（仅内容区直层卡片）。
- Table：行高与斑马纹对比微调。
- 数值微调集中在既有 token/规则上，不新增 class。

### D2: 页面重设计

- dashboard：
  - 顶部欢迎横幅 Card（Alert 承载文案），示例 theme.css 将其样式化为品牌渐变横幅（结构选择器：内容区第一个 Alert）。
  - 指标行：4 张指标卡（Grid columns 4），theme.css 给含 Statistic 的卡加左侧 accent 强调条（`.pcr-card:has(.pcr-statistic)`）。
  - 双栏区（Grid columns 2）：公告/待办 Tabs 卡 + 快捷操作卡（按钮组，navigate 到客户列表）。
- customer-list：页面说明 Alert（info）+ 查询 Card + 数据 Card 的层次与间距。
- customer-edit：返回按钮 + 表单卡层次。

### D3: 示例 theme.css

`examples/admin/src/theme.css`（在 `pactor-ui-radix/styles.css` 后导入）：
- 少量 token 覆盖示例（如内容区背景微调）。
- 结构性美化（欢迎横幅、指标卡强调条）。
- 注释说明每段的对应换肤契约条款（指向主题指南）。

### D4: 验证

playwright 截图 dashboard/customer-list/customer-edit（light + dark 至少 dashboard 与 list），主代理读图评审；不满意则迭代一轮。功能演示点由构建期校验 + 既有单测保证。

## Risks / Trade-offs

- [`:has()` 兼容性] → 现代浏览器均支持；仅用于示例美化，不进框架皮肤。
- [微调破坏暗色对比] → dark 截图同步评审。

## Migration Plan

无。一次性迭代 + 截图评审。

## Open Questions

无。
