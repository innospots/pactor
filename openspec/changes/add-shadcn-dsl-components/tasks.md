# Tasks: add-shadcn-dsl-components

## 1. 契约测试调整与基础设施

- [x] 1.1 修改 `packages/ui/tests/` 中注册表契约测试：断言从"三 kit list() 相等"改为"shadcn 注册表 ⊇ builtin 20 类型"（对齐 specs/ui-kit-shadcn-preset delta）
- [x] 1.2 在 `packages/ui/tests/components/` 建立扩展组件契约测试脚手架（渲染、事件值、className/style 通用 props 的共享断言 helpers）

## 2. 第一批：展示类 + 表单类（纯 Base UI，无新依赖）

- [x] 2.1 vendored 原语 `src/ui/`：badge、avatar、skeleton、separator、kbd、spinner、empty、aspect-ratio、progress、textarea、checkbox、radio-group、switch、slider、label、field
- [x] 2.2 展示类适配器 `src/components/`：Badge、Avatar、Skeleton、Separator、Kbd、Spinner、Empty、AspectRatio、Progress（含 Progress 表达式值场景测试）
- [x] 2.3 表单类适配器：Textarea、Checkbox、RadioGroup、Switch、Slider、Label、Field —— 接入 Form 上下文（`name` 即成表单项、registerField 校验、错误展示），事件值规范化（boolean/number/string）
- [x] 2.4 注册进 `shadcnComponents` 并从 `src/components/index.ts` 导出
- [x] 2.5 契约测试：覆盖 spec "展示类组件""表单类组件"全部场景（含 Form 内 Checkbox 收集、RadioGroup 选中）

## 3. 第二批：导航类 + 反馈弹层类

- [x] 3.1 安装依赖 `vaul`；vendored 原语：breadcrumb、pagination、menubar、navigation-menu、dropdown-menu、context-menu、alert-dialog、drawer、sheet、popover、toast（Base UI Toast 薄封装）、accordion、collapsible、tooltip、hover-card
- [x] 3.2 导航类适配器：Breadcrumb、Pagination、Menubar、NavigationMenu、DropdownMenu、ContextMenu（items 数据声明、onSelect/onChange 语义值）
- [x] 3.3 弹层类适配器：Dialog、AlertDialog、Drawer、Sheet、Popover —— 受控 `open` + `onClose`，children 经 renderChildren；与 OverlayHost 共用 `src/ui/` 原语
- [x] 3.4 Accordion/Collapsible/Tooltip/HoverCard 适配器（items 内 `children: DslNode[]` 经 renderChildren）
- [x] 3.5 Sonner：toast 挂载点组件 + 动作层调用入口（success/error/info + description）
- [x] 3.6 `src/styles.css` 补充 drawer 滑入、toast 进退场、spinner 旋转关键帧，重建预建样式
- [x] 3.7 契约测试：覆盖 spec "导航类组件""反馈与弹层类组件"全部场景（含 Accordion DSL 子树、Dialog 受控、AlertDialog 确认链路、与 OverlayHost 视觉一致性抽查）

## 4. 第三批：复合类

- [x] 4.1 安装依赖 `react-day-picker`、`date-fns`、`embla-carousel-react`、`cmdk`、`input-otp`、`react-resizable-panels`；vendored 原语：calendar、carousel、command、input-otp、resizable、scroll-area、toggle、toggle-group、button-group、input-group、item、typography、combobox
- [x] 4.2 表单向适配器：Calendar（onChange 传 ISO 字符串）、InputOTP（onChange/onComplete）、Combobox（searchable + options）
- [x] 4.3 交互向适配器：Carousel、Command、Resizable、ScrollArea、Toggle、ToggleGroup、ButtonGroup、InputGroup、Item、Typography
- [x] 4.4 注册与导出；契约测试覆盖 spec "复合类组件"全部场景（含 Carousel 轮播、Command 搜索选中、Typography 变体）

## 5. 第四批：页面级组合

- [x] 5.1 安装依赖 `recharts`；vendored/组合实现：Sidebar（brand + items + children 主内容区，复用 chart/sidebar 语义令牌）
- [x] 5.2 DataTable：在既有 Table 适配器之上封装 sortable/filterable/pagination（onSort 传 `{ key, order }`、onPageChange 传页码）
- [x] 5.3 Chart：line/bar/area/pie 四类型，data/xKey/yKeys/colors，chart-1..5 令牌配色
- [x] 5.4 契约测试覆盖 spec "页面级组合组件"全部场景

## 6. 收尾

- [x] 6.1 `src/components/index.ts` 与包主入口导出全部新增组件及 props 类型；确认 `./ui` 子路径导出新增原语
- [x] 6.2 `pnpm -F @pactor-app/ui build` 通过且 `styles.css` 含全部新组件样式；确认产物无 `antd` / `@radix-ui/` 引用
- [x] 6.3 全仓 `pnpm test` 与 `typecheck` 通过；i18n 新增文案 key 补齐（如 toast 关闭等）
- [x] 6.4 更新 docs 站组件文档与 examples（每批至少一个 DSL 示例页面）
