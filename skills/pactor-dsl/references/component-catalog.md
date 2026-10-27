# Pactor 完整组件目录

> 审计基线：2026-10-27。本文是随技能分发的离线组件清单；版本漂移时再通过在线文档或 GitHub 源码复核，不要求访问本地 monorepo 或文档仓库。

## 覆盖范围

| 来源 | 数量 | 注册方式 |
| --- | ---: | --- |
| `@pactor-app/ui` 内置组件 | 124 | 默认 `createComponentRegistry()` 已注册 |
| `@pactor-app/chart` | 17 | `registerChartComponents(registry)` |
| `@pactor-app/blocks` | 11 | `registerBlockComponents(registry)` |
| `@pactor-app/chat` 展示组件 | 19 | `registerChatComponents(registry)` 或 `createChatComponentRegistry()` |
| `Chat` / `ChatShell` | 2 | `registerChatComponent(registry)` |
| Sitemap 布局保留类型 | 2 | `SitemapApp` 内置注入，仅用于布局 DSL |
| **当前运行时类型合计** | **175** | 下方逐项列出 |

在线组件文档共 141 条，对应 140 个 DSL 类型：文档中的 `Splitter` 是 `Resizable` 的用法页，不存在 `type: Splitter`。文档总览：<https://pactor.innospots.com/components/overview/>。

## 使用规则

1. 先按任务查下方类型与用途，再打开对应在线文档确认 props/events；不要根据设计文档臆造名称。
2. `@pactor-app/ui` 之外的组件必须先合并注册表并导入相应样式；否则会显示 `Unsupported`。
3. 页面里的 DSL `type` 必须大小写完全一致。`Chart` 不是类型，必须选择具体的图表类型。
4. 文档未单列但源码已注册的类型也在这里列出，不能因为文档缺页而漏用或猜名。
5. 在线文档不可访问时，本文和 [`component-contracts.md`](component-contracts.md) 是首要离线依据；需要版本复核时使用每行的 GitHub 源码链接。

## `@pactor-app/ui` 内置组件（124）

### 页面、布局与循环（17）

| DSL type | 用途 | 文档 / 源码 |
| --- | --- | --- |
| `AspectRatio` | 保持媒体或预览画布比例 | [在线文档](https://pactor.innospots.com/components/layout/aspect-ratio/) |
| `Col` | 栅格列（24 分栏 span / offset / 响应式断点） | [在线文档](https://pactor.innospots.com/components/layout/col/) |
| `Container` | 限制内容宽度并建立页面留白 | [在线文档](https://pactor.innospots.com/components/layout/container/) |
| `Content` | 布局主内容区域 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Content/index.tsx) |
| `Flex` | 沿主轴和交叉轴排列对象 | [在线文档](https://pactor.innospots.com/components/layout/flex/) |
| `Footer` | 布局底部区域 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Footer/index.tsx) |
| `For` | 数据驱动循环渲染，注入 `${row}` / `${rowIndex}` 行作用域 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/For/index.tsx) |
| `Grid` | 按响应式行列排列内容 | [在线文档](https://pactor.innospots.com/components/layout/grid/) |
| `Header` | 布局头部区域 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Header/index.tsx) |
| `Layout` | 组织页面级头部、侧栏和内容区 | [在线文档](https://pactor.innospots.com/components/layout/layout/) |
| `Page` | 页面内容容器；页面标题、内边距和纵向内容节奏 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Page/index.tsx) |
| `Resizable` | 调整单个区域或对象尺寸 | [在线文档](https://pactor.innospots.com/components/layout/resizable/) |
| `Row` | 栅格行容器（gutter / 对齐 / 换行） | [在线文档](https://pactor.innospots.com/components/layout/row/) |
| `ScrollArea` | 建立受控滚动区域 | [在线文档](https://pactor.innospots.com/components/layout/scroll-area/) |
| `Sidebar` | 完整应用侧栏外壳：品牌、导航/自由内容、footer、折叠和移动抽屉 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Sidebar/index.tsx) |
| `Sider` | 布局侧栏区域 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Sider/index.tsx) |
| `Space` | 为一组相邻元素提供一致间距 | [在线文档](https://pactor.innospots.com/components/layout/space/) |

### 导航（14）

| DSL type | 用途 | 文档 / 源码 |
| --- | --- | --- |
| `Affix` | 在滚动时固定关键导航或操作 | [在线文档](https://pactor.innospots.com/components/navigation/affix/) |
| `Anchor` | 在长页面章节间定位 | [在线文档](https://pactor.innospots.com/components/navigation/anchor/) |
| `BackTop` | 返回长页面顶部 | [在线文档](https://pactor.innospots.com/components/navigation/back-top/) |
| `Breadcrumb` | 表示当前位置与上级路径 | [在线文档](https://pactor.innospots.com/components/navigation/breadcrumb/) |
| `Command` | 命令面板与可搜索命令列表 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Command/index.tsx) |
| `ContextMenu` | 右键上下文菜单 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/ContextMenu/index.tsx) |
| `DropdownMenu` | 从临时操作或导航菜单中选择 | [在线文档](https://pactor.innospots.com/components/navigation/dropdown-menu/) |
| `Menu` | 在模块或功能之间导航 | [在线文档](https://pactor.innospots.com/components/navigation/menu/) |
| `Menubar` | 横向菜单栏 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Menubar/index.tsx) |
| `NavigationMenu` | 提供顶部、底部或全局导航 | [在线文档](https://pactor.innospots.com/components/navigation/navigation-menu/) |
| `Pagination` | 在多页数据之间切换 | [在线文档](https://pactor.innospots.com/components/navigation/pagination/) |
| `Steps` | 表示流程阶段与当前进度 | [在线文档](https://pactor.innospots.com/components/navigation/steps/) |
| `Tabs` | 在同层内容视图间切换 | [在线文档](https://pactor.innospots.com/components/navigation/tabs/) |
| `UserMenu` | 集中承载账户身份、主题 / 在线状态切换与退出入口 | [在线文档](https://pactor.innospots.com/components/navigation/user-menu/) |

### 通用与操作（20）

| DSL type | 用途 | 文档 / 源码 |
| --- | --- | --- |
| `ActionButton` | 工具栏中的紧凑图标操作 | [在线文档](https://pactor.innospots.com/components/general/action-button/) |
| `Avatar` | 表示用户、组织或对象身份 | [在线文档](https://pactor.innospots.com/components/general/avatar/) |
| `Badge` | 表示数量、提醒或附着状态 | [在线文档](https://pactor.innospots.com/components/general/badge/) |
| `Button` | 触发即时操作 | [在线文档](https://pactor.innospots.com/components/general/button/) |
| `ButtonGroup` | 将关联按钮组合为相连表面 | [在线文档](https://pactor.innospots.com/components/general/button-group/) |
| `ConfirmMorph` | 危险操作的按钮内二次确认 | [在线文档](https://pactor.innospots.com/components/general/confirm-morph/) |
| `CopyButton` | 复制值到剪贴板并即时确认 | [在线文档](https://pactor.innospots.com/components/general/copy-button/) |
| `ExpandingButtonGroup` | 紧凑图标组内悬停展开操作名 | [在线文档](https://pactor.innospots.com/components/general/expanding-button-group/) |
| `FloatingButtonGroup` | 托盘内切换并列视图或模式 | [在线文档](https://pactor.innospots.com/components/general/floating-button-group/) |
| `Icon` | 传达操作、状态或对象含义 | [在线文档](https://pactor.innospots.com/components/general/icon/) |
| `IconMorph` | 两个语义图标间的形变切换 | [在线文档](https://pactor.innospots.com/components/general/icon-morph/) |
| `Kbd` | 键盘按键展示 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Kbd/index.tsx) |
| `Link` | 跳转页面、位置或外部资源 | [在线文档](https://pactor.innospots.com/components/general/link/) |
| `Separator` | 分隔内容分组 | [在线文档](https://pactor.innospots.com/components/general/separator/) |
| `SplitButton` | 主操作与备选操作合并为一个入口 | [在线文档](https://pactor.innospots.com/components/general/split-button/) |
| `Status` | 表达运行、审核或业务状态 | [在线文档](https://pactor.innospots.com/components/general/status/) |
| `Tag` | 标记分类、属性或可移除条件 | [在线文档](https://pactor.innospots.com/components/general/tag/) |
| `Text` | 轻量文本节点；适合行内说明和表达式文本 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Text/index.tsx) |
| `Tooltip` | 补充短说明或不可见标签 | [在线文档](https://pactor.innospots.com/components/general/tooltip/) |
| `Typography` | 组织标题、正文和辅助文本 | [在线文档](https://pactor.innospots.com/components/general/typography/) |

### 数据录入与表单（28）

| DSL type | 用途 | 文档 / 源码 |
| --- | --- | --- |
| `Cascader` | 按层级逐步完成选择 | [在线文档](https://pactor.innospots.com/components/data-entry/cascader/) |
| `ChatInput` | 通用 AI 输入结构：文本域、工具栏与头尾插槽 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/ChatInput/index.tsx) |
| `Checkbox` | 独立确认或多项选择 | [在线文档](https://pactor.innospots.com/components/data-entry/checkbox/) |
| `ChipFilter` | 单选/多选 chip 快筛控件 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/ChipFilter/index.tsx) |
| `ChipNode` | 可组合 chip 节点 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/ChipNode/index.tsx) |
| `ColorPicker` | 选择或输入颜色 | [在线文档](https://pactor.innospots.com/components/data-entry/color-picker/) |
| `Combobox` | 输入并匹配建议值 | [在线文档](https://pactor.innospots.com/components/data-entry/combobox/) |
| `DatePicker` | 选择日期、区间或周期 | [在线文档](https://pactor.innospots.com/components/data-entry/date-picker/) |
| `Field` | Form 表单项容器；统一 label、必填标记、说明和错误 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Field/index.tsx) |
| `Form` | 组织字段、校验和提交过程 | [在线文档](https://pactor.innospots.com/components/data-entry/form/) |
| `Input` | 输入单行文本 | [在线文档](https://pactor.innospots.com/components/data-entry/input/) |
| `InputGroup` | 输入框与前缀/后缀/按钮组合容器 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/InputGroup/index.tsx) |
| `InputOTP` | 一次性验证码输入 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/InputOTP/index.tsx) |
| `Label` | 独立标签节点 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Label/index.tsx) |
| `Mentions` | 输入并引用用户或对象 | [在线文档](https://pactor.innospots.com/components/data-entry/mentions/) |
| `NumberInput` | 输入受约束的数值 | [在线文档](https://pactor.innospots.com/components/data-entry/number-input/) |
| `RadioGroup` | 从互斥选项中选择一项 | [在线文档](https://pactor.innospots.com/components/data-entry/radio-group/) |
| `Rate` | 输入评分 | [在线文档](https://pactor.innospots.com/components/data-entry/rate/) |
| `Select` | 从候选项中选择一个或多个值 | [在线文档](https://pactor.innospots.com/components/data-entry/select/) |
| `Slider` | 在连续或分段范围内选值 | [在线文档](https://pactor.innospots.com/components/data-entry/slider/) |
| `Switch` | 即时切换二元状态 | [在线文档](https://pactor.innospots.com/components/data-entry/switch/) |
| `Textarea` | 输入多行长文本 | [在线文档](https://pactor.innospots.com/components/data-entry/textarea/) |
| `TimePicker` | 选择时间或时间范围 | [在线文档](https://pactor.innospots.com/components/data-entry/time-picker/) |
| `Toggle` | 单按钮切换 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Toggle/index.tsx) |
| `ToggleGroup` | 互斥或组合切换按钮组 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/ToggleGroup/index.tsx) |
| `Transfer` | 在两个集合之间移动条目 | [在线文档](https://pactor.innospots.com/components/data-entry/transfer/) |
| `TreeSelect` | 从层级候选项中选择 | [在线文档](https://pactor.innospots.com/components/data-entry/tree-select/) |
| `Upload` | 选择并上传文件 | [在线文档](https://pactor.innospots.com/components/data-entry/upload/) |

### 数据展示（16）

| DSL type | 用途 | 文档 / 源码 |
| --- | --- | --- |
| `Accordion` | 折叠和展开分组内容 | [在线文档](https://pactor.innospots.com/components/data-display/accordion/) |
| `Calendar` | 按日期组织事件或状态 | [在线文档](https://pactor.innospots.com/components/data-display/calendar/) |
| `Card` | 承载一个独立主题或对象摘要 | [在线文档](https://pactor.innospots.com/components/data-display/card/) |
| `Carousel` | 在有限区域轮播内容 | [在线文档](https://pactor.innospots.com/components/data-display/carousel/) |
| `Collapsible` | 单一分组折叠/展开 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Collapsible/index.tsx) |
| `Descriptions` | 展示对象的标签—值属性 | [在线文档](https://pactor.innospots.com/components/data-display/descriptions/) |
| `Empty` | 表示暂无内容并提供下一步 | [在线文档](https://pactor.innospots.com/components/data-display/empty/) |
| `Image` | 展示图片及基础预览能力 | [在线文档](https://pactor.innospots.com/components/data-display/image/) |
| `Item` | 通用列表项/内容行容器 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Item/index.tsx) |
| `List` | 纵向展示同类对象集合 | [在线文档](https://pactor.innospots.com/components/data-display/list/) |
| `QRCode` | 将内容编码为二维码 | [在线文档](https://pactor.innospots.com/components/data-display/qrcode/) |
| `Segmented` | 在少量互斥视图或模式间切换 | [在线文档](https://pactor.innospots.com/components/data-display/segmented/) |
| `Statistic` | 突出显示单个指标 | [在线文档](https://pactor.innospots.com/components/data-display/statistic/) |
| `Table` | 按行列展示和操作结构化数据 | [在线文档](https://pactor.innospots.com/components/data-display/table/) |
| `Timeline` | 按时间顺序展示事件 | [在线文档](https://pactor.innospots.com/components/data-display/timeline/) |
| `Tree` | 展示和操作层级数据 | [在线文档](https://pactor.innospots.com/components/data-display/tree/) |

### 反馈与浮层（18）

| DSL type | 用途 | 文档 / 源码 |
| --- | --- | --- |
| `Alert` | 在内容上下文中持续显示提示 | [在线文档](https://pactor.innospots.com/components/feedback/alert/) |
| `AlertDialog` | 破坏性操作确认对话框 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/AlertDialog/index.tsx) |
| `Dialog` | 阻断当前流程以确认或完成任务 | [在线文档](https://pactor.innospots.com/components/feedback/dialog/) |
| `Drawer` | 在保留页面上下文时展示扩展任务 | [在线文档](https://pactor.innospots.com/components/feedback/drawer/) |
| `HoverCard` | 悬停预览卡片 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/HoverCard/index.tsx) |
| `LoadingOverlay` | 在页面或区块上覆盖统一加载状态 | [在线文档](https://pactor.innospots.com/components/feedback/loading-overlay/) |
| `Message` | 全局短时反馈操作结果 | [在线文档](https://pactor.innospots.com/components/feedback/message/) |
| `Notification` | 显示信息更丰富的全局通知 | [在线文档](https://pactor.innospots.com/components/feedback/notification/) |
| `Popconfirm` | 就近确认轻量危险操作 | [在线文档](https://pactor.innospots.com/components/feedback/popconfirm/) |
| `Popover` | 在触发对象附近展示补充内容 | [在线文档](https://pactor.innospots.com/components/feedback/popover/) |
| `Progress` | 展示任务完成程度 | [在线文档](https://pactor.innospots.com/components/feedback/progress/) |
| `Result` | 汇总任务最终结果和后续操作 | [在线文档](https://pactor.innospots.com/components/feedback/result/) |
| `Sheet` | 从屏幕边缘滑出的面板 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Sheet/index.tsx) |
| `Skeleton` | 在结构已知时展示加载占位 | [在线文档](https://pactor.innospots.com/components/feedback/skeleton/) |
| `Sonner` | 全局轻提示宿主/触发器 | [源码](https://github.com/innospots/pactor/blob/main/packages/ui/src/components/components/Sonner/index.tsx) |
| `Spinner` | 表示局部区域正在处理 | [在线文档](https://pactor.innospots.com/components/feedback/spinner/) |
| `Tour` | 分步骤引导用户认识界面 | [在线文档](https://pactor.innospots.com/components/feedback/tour/) |
| `Watermark` | 在内容表面添加来源或安全标识 | [在线文档](https://pactor.innospots.com/components/feedback/watermark/) |

### 媒体与内容（11）

| DSL type | 用途 | 文档 / 源码 |
| --- | --- | --- |
| `Audio` | 播放音频内容 | [在线文档](https://pactor.innospots.com/components/media/audio/) |
| `CodeBlock` | 展示带语法高亮的代码 | [在线文档](https://pactor.innospots.com/components/media/code-block/) |
| `DiffViewer` | 比较文本或代码差异 | [在线文档](https://pactor.innospots.com/components/media/diff-viewer/) |
| `DocumentPreview` | 阅读分页文档 | [在线文档](https://pactor.innospots.com/components/media/document-preview/) |
| `FilePreview` | 预览常见文件及其元信息 | [在线文档](https://pactor.innospots.com/components/media/file-preview/) |
| `Gallery` | 浏览多张图片或媒体资源 | [在线文档](https://pactor.innospots.com/components/media/gallery/) |
| `ImageViewer` | 放大、缩放和切换单张图片 | [在线文档](https://pactor.innospots.com/components/media/image-viewer/) |
| `JSONViewer` | 折叠、检查和复制结构化数据 | [在线文档](https://pactor.innospots.com/components/media/json-viewer/) |
| `Markdown` | 渲染 Markdown 内容 | [在线文档](https://pactor.innospots.com/components/media/markdown/) |
| `RichText` | 渲染富文本内容 | [在线文档](https://pactor.innospots.com/components/media/rich-text/) |
| `Video` | 播放视频内容 | [在线文档](https://pactor.innospots.com/components/media/video/) |

文档别名：`Splitter` → 使用 DSL 类型 `Resizable`（[Splitter 说明](https://pactor.innospots.com/components/layout/splitter/)，[Resizable 文档](https://pactor.innospots.com/components/layout/resizable/)）。

## `@pactor-app/chart`（17）

```tsx
import { registerChartComponents } from '@pactor-app/chart';
import '@pactor-app/chart/styles.css';
registerChartComponents(registry);
```

| DSL type | 用途 | 在线文档 |
| --- | --- | --- |
| `MetricCard` | 单值与变化 | [指标卡](https://pactor.innospots.com/components/charts/metric-card/) |
| `LineChart` | 连续趋势 | [折线图](https://pactor.innospots.com/components/charts/line-chart/) |
| `ColumnChart` | 离散比较 | [柱状图](https://pactor.innospots.com/components/charts/column-chart/) |
| `BarChart` | 长分类名称的横向比较 | [条形图](https://pactor.innospots.com/components/charts/bar-chart/) |
| `AreaChart` | 趋势与累计规模 | [面积图](https://pactor.innospots.com/components/charts/area-chart/) |
| `PieChart` | 少量类别构成 | [饼图](https://pactor.innospots.com/components/charts/pie-chart/) |
| `DonutChart` | 构成与中心指标 | [环形图](https://pactor.innospots.com/components/charts/donut-chart/) |
| `ScatterChart` | 两变量关系与分布 | [散点图](https://pactor.innospots.com/components/charts/scatter-chart/) |
| `BubbleChart` | 三变量关系 | [气泡图](https://pactor.innospots.com/components/charts/bubble-chart/) |
| `RadarChart` | 多维能力对比 | [雷达图](https://pactor.innospots.com/components/charts/radar-chart/) |
| `FunnelChart` | 流程阶段转化 | [漏斗图](https://pactor.innospots.com/components/charts/funnel-chart/) |
| `GaugeChart` | 单指标区间状态 | [仪表盘](https://pactor.innospots.com/components/charts/gauge-chart/) |
| `Heatmap` | 二维密度与强弱 | [热力图](https://pactor.innospots.com/components/charts/heatmap/) |
| `TreeChart` | 层级结构 | [树图](https://pactor.innospots.com/components/charts/tree-chart/) |
| `SankeyChart` | 节点之间的流向与规模 | [桑基图](https://pactor.innospots.com/components/charts/sankey-chart/) |
| `MapChart` | 地理分布与区域比较 | [地图](https://pactor.innospots.com/components/charts/map-chart/) |
| `ComposedChart` | 多种度量或表达目标组合 | [组合图](https://pactor.innospots.com/components/charts/composed-chart/) |

图表交互统一通过 `events.onSelect` 接收 ECharts 点击数据；图表颜色应使用项目主题令牌。

## `@pactor-app/blocks`（11）

```tsx
import { registerBlockComponents } from '@pactor-app/blocks';
import '@pactor-app/blocks/styles.css';
registerBlockComponents(registry);
```

| DSL type | 用途 | 在线文档 |
| --- | --- | --- |
| `HeroSection` | 落地页 Hero 区块：公告条 + 大字标题 + 双 CTA + 媒体区 / 客户标记（三变体） | [HeroSection](https://pactor.innospots.com/components/blocks/hero-section/) |
| `Login` | 登录整页：品牌区 + 认证表单 + 辅助入口 | [Login](https://pactor.innospots.com/components/blocks/login/) |
| `EntityCard` | 三层结构实体摘要卡：图标/标题/标签、描述与操作按钮 | [EntityCard](https://pactor.innospots.com/components/blocks/entity-card/) |
| `CardList` | 网格展示实体摘要卡片，附带新建占位与结果计数 | [CardList](https://pactor.innospots.com/components/blocks/card-list/) |
| `RecordingPage` | 录音 / 会议记录工作区：左侧记录列表 + 右侧转写、纪要、AI 解读、知识记忆与翻译详情 | [RecordingPage](https://pactor.innospots.com/components/blocks/recording-page/) |
| `ExpressionEditor` | 按模板占位符结构化编辑表达式，支持表达式文本与控件值双向解析 | [ExpressionEditor](https://pactor.innospots.com/components/blocks/expression-editor/) |
| `FieldCondition` | 以字段+操作符+值行式编辑 AND/OR 条件组 | [FieldCondition](https://pactor.innospots.com/components/blocks/field-condition/) |
| `RuleConfig` | 评分规则配置：权重与带操作符/取值/评分的条件列表 | [RuleConfig](https://pactor.innospots.com/components/blocks/rule-config/) |
| `RuleExpression` | 自由文本与特征字段 chip 混排的规则表达式输入 | [RuleExpression](https://pactor.innospots.com/components/blocks/rule-expression/) |
| `ScriptEditor` | Ace 脚本编辑器：语法高亮与自定义函数/变量联想 | [ScriptEditor](https://pactor.innospots.com/components/blocks/script-editor/) |
| `SiteFooter` | 站点页脚：品牌区 + 多列链接组 + 底部版权栏 | [SiteFooter](https://pactor.innospots.com/components/blocks/site-footer/) |

## `@pactor-app/chat`（21）

完整活动区优先 `ChatPage`；嵌入式单对话使用 `Chat`；菜单驱动的多页面活动区使用 `ChatShell`。所有路径都需要宿主提供 `ChatServicesProvider`，至少注入 `transport`。

| DSL type | 用途 | 文档 / 源码 |
| --- | --- | --- |
| `ChatMessage` | 展示用户、助手或系统消息 | [在线文档](https://pactor.innospots.com/components/ai-chat/chat-message/) |
| `MessageList` | 组织连续消息流和滚动定位 | [在线文档](https://pactor.innospots.com/components/ai-chat/message-list/) |
| `ConversationList` | 浏览、搜索和管理历史会话 | [在线文档](https://pactor.innospots.com/components/ai-chat/conversation-list/) |
| `Composer` | 输入提示词、附件和发送操作 | [在线文档](https://pactor.innospots.com/components/ai-chat/composer/) |
| `Prompt` | 展示可复用提示词或任务入口 | [在线文档](https://pactor.innospots.com/components/ai-chat/prompt/) |
| `Suggestion` | 提供追问、补全或下一步建议 | [在线文档](https://pactor.innospots.com/components/ai-chat/suggestion/) |
| `Attachment` | 展示、上传和管理会话附件 | [在线文档](https://pactor.innospots.com/components/ai-chat/attachment/) |
| `Citation` | 标识回答中的来源与引用范围 | [在线文档](https://pactor.innospots.com/components/ai-chat/citation/) |
| `Thinking` | 表达推理或处理中状态 | [在线文档](https://pactor.innospots.com/components/ai-chat/thinking/) |
| `ToolCall` | 展示工具调用、参数、进度和结果 | [在线文档](https://pactor.innospots.com/components/ai-chat/tool-call/) |
| `AgentStatus` | 表示智能体的运行和等待状态 | [在线文档](https://pactor.innospots.com/components/ai-chat/agent-status/) |
| `StreamingText` | 渐进展示生成中的文本 | [在线文档](https://pactor.innospots.com/components/ai-chat/streaming-text/) |
| `Welcome` | 展示会话空状态、能力和起始任务 | [在线文档](https://pactor.innospots.com/components/ai-chat/welcome/) |
| `Sender` | 表示消息发送方和角色信息 | [在线文档](https://pactor.innospots.com/components/ai-chat/sender/) |
| `Bubble` | 提供基础对话气泡容器 | [在线文档](https://pactor.innospots.com/components/ai-chat/bubble/) |
| `ArtifactPanel` | 产物预览面板：markdown/code/text/dsl/图片预览与下载 | [源码](https://github.com/innospots/pactor/blob/main/packages/chat/src/components/ArtifactPanel/index.tsx) |
| `ChatPage` | 完整聊天工作页：菜单、会话、消息、输入、产物和附加面板 | [源码](https://github.com/innospots/pactor/blob/main/packages/chat/src/components/ChatPage/index.tsx) |
| `StepsPanel` | 纵向执行步骤/时间线面板 | [源码](https://github.com/innospots/pactor/blob/main/packages/chat/src/components/StepsPanel/index.tsx) |
| `WorkspaceSwitcher` | 工作空间切换器，常用于聊天 Composer footer | [源码](https://github.com/innospots/pactor/blob/main/packages/chat/src/components/WorkspaceSwitcher/index.tsx) |
| `Chat` | 嵌入页面的 AI 会话一等组件 | [源码](https://github.com/innospots/pactor/blob/main/packages/chat/src/view/Chat.tsx) |
| `ChatShell` | 菜单驱动的聊天应用外壳 | [源码](https://github.com/innospots/pactor/blob/main/packages/chat/src/view/ChatShell.tsx) |

## Sitemap 布局保留类型（2）

这两个类型只在 `SitemapApp` 的 layout DSL 中可用，普通页面不能用它们替代页面内容：

| DSL type | 用途 | 源码 |
| --- | --- | --- |
| `PageOutlet` | 布局中的当前路由页面出口 | [源码](https://github.com/innospots/pactor/blob/main/packages/app/src/sitemap/SitemapApp.tsx) |
| `SitemapMenu` | 带 selectedKey / activeMenu 高亮的 sitemap 菜单 | [源码](https://github.com/innospots/pactor/blob/main/packages/app/src/sitemap/SitemapApp.tsx) |

## 高频组件 DSL 契约

| DSL type | 关键契约 |
| --- | --- |
| `Page` | `title?`、`children`；页面内容纵向节奏；常规页面通常以它为 body 根 |
| `Breadcrumb` | `items: [{ label, href? }]`；末项不给 href，自动渲染为当前页 |
| `Flex` | `direction`、`gap`、`wrap`、`justify`、`align`；两端布局用 `justify: space-between` |
| `Row` / `Col` | `gutter`、24 分栏 `span`、`offset`、`xs/sm/md/lg/xl/xxl`；窄屏成对字段常 `span: 24`、桌面 `md: 12` |
| `Card` | `title`、`extra`（DslNode[]）、`loading`、`bordered`、`hoverable`；可作为区块容器和加载骨架 |
| `Form` | `name`、`layout`、`initialValues`；`events.onSubmit` 收到全部值，`onValuesChange` 只收到变化字段 |
| `Field` | 显式增强壳：`label`、`required`、`labelHint`、`description`、`error`；普通 Form 控件声明 `name` 已自动获得壳，仅在需要这些增强或分组内容时手写 |
| `Input` / `Select` 等 | 常规写法把 `name`、`label`、`rules`、`value`、`disabled` 放在控件；显式 `Field` 已有 label 时，内层控件不要再写 label |
| `Select` | `options`、`showSearch`、`allowClear`、`value`、`controlClassName`；Form 内宽度用 `controlClassName` |
| `Table` | `dataSource: ${data.x}`、`columns`、`cell`、`rowKey`、`loading`、`pagination`、`emptyText`；事件 `onChange` / `onSelectChange` / `onRowDrop` |
| `Tabs` | `items: [{ key, label, children?, extra? }]`；受控 `activeKey` + `onChange`；`tabPosition: left` 不渲染 extra |
| `Descriptions` | `items: [{ label, value }]`、`column`（默认 3）、`bordered` |
| `Button` | `text`、`icon`、`variant: default/primary/dashed/link/text`、`danger`、`size`、`loading`、`disabled`、`submit` |
| `Empty` | `title`、`description`、`children` CTA；集合成功返回空时才显示 |
| `Alert` | `message`、`description`、`variant: info/success/warning/error`、`showIcon`；用于保留布局的错误/提示 |
| `Dialog` | `open`、`title`、`description`、`trigger`、`onClose`；内容放 children |
| `Drawer` | `open`、`title`、`placement`、`footer`、`cancelText/okText`；`onClose` / `onOk`，表单 footer 用 `form.submit` |
| 图表 | 具体类型 + `registerChartComponents`；DSL 点击事件为 `onSelect` |
| `ChatPage` / `Chat` | 需要 chat transport；受控面板常用 `panelOpen`、`artifact` + `onArtifact` / `onPanelClose` |

## 更新与校验

1. 消费项目中的单页用 `npx pactor validate <file...>`，整个 DSL 目录用 `npx pactor lint <directory>` 递归校验。
2. 使用组件前先在本清单确认精确 DSL `type`；未找到时不要猜名。
3. 组件 props / events 以 [`component-contracts.md`](component-contracts.md) 为离线基线；版本不一致时打开该行的在线文档或 GitHub 源码核对。
4. 新增或升级组件包后，复核三个注册层：默认 UI registry、`@pactor-app/blocks` / `@pactor-app/chart` / `@pactor-app/chat` 合并注册、`SitemapApp` 布局保留类型。
