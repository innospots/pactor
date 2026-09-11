## 1. 应用骨架（pactor 应用 + DSL）

- [x] 1.1 `pnpm-workspace.yaml` 增加 `tools/*`；创建 `tools/theme-studio`（Vite + `createPactorApplication` + `StaticDslLoader`，`private: true`，dev 端口 5710，依赖 workspace 内 `@pactor-app/app` / `@pactor-app/ui` / `@pactor-app/chat` 等）
- [x] 1.2 `src/pages/studio.page.yaml`（`/` 路由，blank 布局）：左栏自定义组件 + 右侧预览组件；`src/pages/gallery.page.yaml`（`/gallery` 路由，blank 布局，纯内置组件）
- [x] 1.3 自定义组件经 `componentRegistry` 注册（`ThemePresetList` / `TokenEditor` / `SkinPreviewFrame` / `SkinDownloadButton`），共享状态走模块级 store（选中主题 + overrides + 合成 CSS）
- [x] 1.4 iframe 通信：gallery 挂载后 `postMessage({type:'ready'})`；左栏收到 ready 后发送 `{type:'skin', css}`；gallery upsert `<style data-theme-studio>` 节点（ready/skin 握手挂载在 gallery 页自定义小组件或 app 钩子中）

## 2. 令牌元数据与编辑器

- [x] 2.1 `src/tokens.ts`：分组令牌元数据（名称/类型 color|length|font|image/说明），与 styles.css 令牌清单对齐
- [x] 2.2 `TokenEditor` 组件：分组折叠展示，color 型给原生取色器+hex 文本框，其余给文本输入；修改即写入 store overrides
- [x] 2.3 vitest：tokens.ts 清单与 `packages/ui/src/styles.css` 的 `:root` 自定义属性集合比对一致

## 3. 预置主题

- [x] 3.1 `src/presets.ts`：5 套中国传统色主题（珊瑚赫/青冥/碧山/梔子/齊紫，主色+辅色+前景配对+ring+chart 子集）+ 1-2 套对照主题（石墨灰/莫兰迪）
- [x] 3.2 `ThemePresetList` 组件：色板缩略 + 名称，点击选中应用；当前主题高亮

## 4. CSS 合成与下载

- [x] 4.1 `src/skin.ts`：`composeSkinCss(preset, overrides)` 生成 `:root` 覆盖块文本（含注释掉的 `[data-pactor-theme='dark']` 骨架）；预览 postMessage 与下载共用此函数
- [x] 4.2 `SkinDownloadButton` 组件：Blob + 临时 `a[download="pactor-theme.css"]`；vitest 覆盖 composeSkinCss（子集覆盖、overrides 优先、暗色骨架注释存在）

## 5. 组件画廊（纯 DSL 页面）

- [x] 5.1 `gallery.page.yaml`：基础（Button/Badge/Typography/Icon）+ 表单（Input/Textarea/Select/Switch/Slider/RadioGroup/Checkbox/Calendar）
- [x] 5.2 反馈（Alert 四态/Progress/Skeleton/Toast 触发钮）+ 导航（Menu/Tabs/Pagination/Breadcrumb）
- [x] 5.3 浮层（Dialog/Popover/DropdownMenu/HoverCard 可交互打开）+ 数据（Card/Statistic/Table/Chart）+ chat 系（Bubble/Message/ChatInput，经 chat 包注册后 DSL 引用）

## 6. 验证与文档

- [x] 6.1 `pnpm --filter theme-studio build` 与测试通过；全仓 `pnpm -r --if-present build`、`pnpm -r --if-present typecheck`、`pnpm test` 绿
- [x] 6.2 浏览器验收：选主题/改令牌实时生效；下载的 pactor-theme.css 挂到 examples/chat（在 ui styles 之后导入）验证生效，然后移除该临时导入
- [x] 6.3 docs `guides/theming.md` 增加「可视化皮肤工作室」一节（用法 + `pnpm --filter theme-studio dev`）；根 README 工具段落提及
