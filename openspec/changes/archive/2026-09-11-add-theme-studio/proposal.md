## Why

`add-theme-skin-css` 已落地皮肤令牌契约（语义令牌 + `--<component>-*` 组件级令牌，CSS 文件覆盖即换肤），但令牌数量多、散落在文档表格里，皮肤作者手写 CSS 试错成本高：看不到实时效果、不知道每个令牌管哪里、配色缺乏起点。需要一个可视化的皮肤工作室：选预置主题 → 微调令牌 → 实时预览全部组件 → 下载皮肤 CSS。

## What Changes

- 仓库根目录新增 **`tools/theme-studio`** 皮肤工作室应用（Vite + `createPactorApplication` + DSL 页面，纳入 pnpm workspace），布局为左栏（预置主题 + 令牌编辑器）+ 右侧 iframe 预览。
- 工作室页面用 **DSL 结构**（`*.page.yaml` + `StaticDslLoader`）开发；预置主题列表、令牌编辑器、预览 iframe、下载按钮实现为**自定义组件**，经 `componentRegistry` 注册后在 DSL 中引用（与 examples/admin 的 SkinSettings 同一模式）。
- 内置**组件画廊页**（iframe 加载的 `/gallery` 路由）：同样为 DSL 页面，按分组陈列 `@pactor-app/ui` 全部内置组件，作为皮肤效果的验收面。
- **预置主题**：内置多套风格主题（含依据[中国传统色](https://github.com/raydian/spec-color/blob/main/china_colors.md)生成的若干套，如 珊瑚赫·红 / 青冥·蓝 / 碧山·绿 / 梔子·黄 / 齊紫·紫 等），点击即应用到预览。
- **令牌编辑器**：按分组列出全部可覆盖令牌（语义令牌 + 组件级令牌），颜色类用取色器、尺寸/字体/背景图用文本输入；单项修改实时应用到预览，与所选预置主题叠加。
- **下载皮肤文件**：把"预置主题 + 用户修改"合成最终 CSS（`:root` 块，含可选暗色块），经 Blob 下载为 `theme.css`，用户在自己的系统中于 `pactor-ui/styles.css` 之后加载即可。
- 文档：docs 指南补一节链到工作室；README 提及。

## Capabilities

### New Capabilities

- `theme-studio`: 皮肤工作室应用——工具布局（左栏主题/令牌编辑 + 右侧 iframe 预览）、预置主题（含中国传统色系列）的选择与应用、单项令牌编辑与实时预览、皮肤 CSS 生成与下载、组件画廊页。

### Modified Capabilities

<!-- 无：纯新增工具，不改变 ui 包令牌契约本身 -->

## Impact

- **代码**：新增 `tools/theme-studio/`（独立 Vite 应用，不发布 npm）；`pnpm-workspace.yaml` 增加 `tools/*` glob。
- **依赖**：复用 workspace 内 `@pactor-app/ui`（画廊渲染与工作室 UI 自身）；无新增外部运行时依赖（取色用原生 `<input type="color">`）。
- **兼容性**：零影响现有包；纯增量。
