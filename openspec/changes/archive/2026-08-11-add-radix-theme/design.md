# Design: add-radix-theme

## Context

pactor-ui-radix 样式表为 147 条硬编码 `.pcr-*` 规则，无 token、无暗色。用户参考 Radix Colors 定制工具（主色 `#3C47DD`）。Radix Colors 是 12 级刻度系统（1=背景、2=次背景、3-5=UI 背景态、6-8=边框、9-10=实体色、11-12=文本），light/dark 成对。

约束（硬）：

- **所有 `.pcr-*` class 名与组件 DOM 结构不变**——packages/ui-radix 92 个测试与 app 的 `.pcr-*` 断言必须原样通过。
- 纯 CSS 变更（无运行时代码）；样式表保持单文件。

## Goals / Non-Goals

**Goals:**

- token 层 + 默认 light 皮肤（美观、全状态反馈）+ 内置 dark 皮肤。
- 三档换肤契约（变量覆盖 / dark 属性 / class 覆盖）。
- 与 Radix Colors 定制工具的配合文档。
- playwright 截图视觉验证。

**Non-Goals:**

- 独立 pactor-theme 包（多主题注册、运行时切换 UI——后续按需立项）。
- antd kit 的主题（antd 自带主题体系）。
- 每个组件的精致视觉微调迭代（一次性到位，后续按反馈调）。

## Decisions

### D1: token 命名与结构

三层变量（语义 token 引用色板 token，组件只引用语义 token）：

```css
:root {
  /* 色板（Radix Colors 12 级刻度，accent = #3C47DD 系） */
  --pcr-accent-1..12: …;   /* 由 #3C47DD 衍生的 light 刻度 */
  --pcr-slate-1..12: …;    /* 中性刻度 */
  --pcr-green-9 / --pcr-amber-9 / --pcr-red-9 / --pcr-blue-9: …; /* 语义实体色 */

  /* 语义 token（组件只引用这层） */
  --pcr-bg / --pcr-bg-subtle / --pcr-bg-muted;
  --pcr-fg / --pcr-fg-muted / --pcr-fg-subtle;
  --pcr-border / --pcr-border-strong;
  --pcr-accent / --pcr-accent-hover / --pcr-accent-active / --pcr-accent-fg / --pcr-accent-subtle / --pcr-accent-text / --pcr-accent-border;
  --pcr-success / --pcr-warning / --pcr-error / --pcr-info（各含 -subtle / -text 变体）;
  --pcr-focus-ring;

  /* 形状与质感 */
  --pcr-radius-sm(6) / --pcr-radius-md(8) / --pcr-radius-lg(12);
  --pcr-shadow-sm / --pcr-shadow-md / --pcr-shadow-lg;
  --pcr-font-family（系统字体栈）;
}

[data-pactor-theme='dark'] { /* 全套 token 的暗色值 */ }
```

属性名用 `data-pactor-theme`（避免与宿主可能的 `data-theme` 冲突）。色板值手工按 Radix Colors 刻度语义编排（accent 从 #3C47DD 展开 hover/active/subtle 等），dark 用对应的暗色刻度。

### D2: 组件规则重写要点

每条 `.pcr-*` 规则改为 `var(--pcr-*)` 取值，并补齐状态反馈：

- Button：hover/active/disabled/focus-visible（focus ring 用 `--pcr-focus-ring` + outline/盒阴影）；variant 全系（primary/default/dashed/text/link + danger）。
- 表单：input focus 边框+环、错误态（error token）、label 层次。
- Table：表头背景、行条纹/悬停、边框 token；分页器态。
- Card/Page/Alert/Statistic：阴影、语义色变体（Alert 四态 subtle bg + text）。
- Modal/Drawer：overlay 透明度过渡、`[data-state]` 开合动画（fade/slide-in）。
- Tabs：`[data-state='active']` 指示条过渡。
- 菜单（Accordion）：`[data-state]` 展开箭头旋转、item hover/active（accent-subtle + accent-text）。
- Toast：四态语义色 + 进入动画。
- 排版：统一 font-family/字号阶梯/行高；滚动条细化（webkit，可选）。

### D3: 换肤契约与文档

主题指南页（docs/src/content/docs/guides/theming.md）：

1. **覆盖变量**（推荐）：`:root { --pcr-accent: #…; }` 在 pactor 样式表后导入；给出"只改主色"最小示例与"完整 token 清单"表。
2. **暗色**：`<html data-pactor-theme="dark">`；演示 DSL/宿主如何切换（宿主一行 JS）。
3. **Radix Colors 工具配合**：radix-ui.com/colors/custom 生成自定义主色 light/dark 刻度 → 映射到 `--pcr-accent-1..12`（或直接映射语义 token）。
4. class 覆盖（兼容旧方式）。

### D4: 测试与验证

- 新增 `tests/theme.test.ts`：样式表含 `:root` token 定义（抽样子断言 `--pcr-accent:` 等）、含 `[data-pactor-theme='dark']` 块且其内覆盖同名 token、全部组件规则不直接出现硬编码 hex（grep `#` 仅允许出现在 token 定义区）——允许注释中的说明除外，断言实现细节留给实现者（合理即可）。
- 既有 92 个 ui-radix 测试 + app/ui-* 相关测试零回归。
- 视觉验证：启动 examples/admin dev server，playwright 截图 dashboard 与 customer-list（light + dark 各一张），主代理读图确认观感。

## Risks / Trade-offs

- [美观度是主观的] → 以 Radix Colors 刻度 + 现代 admin 常见质感（柔和阴影、8px 圆角、清晰焦点态）为基准；截图验证兜底。
- [token 重构引入视觉回归（漏改某条规则）] → 既有 class 断言测试 + 截图对比；grep 检查无残留硬编码色值。
- [单文件变大（~600+ 行）] → 分节注释组织；后续可按层拆分构建。

## Migration Plan

样式表重写 + 测试 + 文档 + 截图验证。用户已导入样式表的路径不变；直接覆盖过 `.pcr-*` 的用户样式因优先级规则大概率仍生效（兼容性说明写入文档）。

## Open Questions

- 多主题预设（蓝/绿/紫）与运行时切换器：归入未来 pactor-theme 包评估。
