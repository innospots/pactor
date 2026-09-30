# 线框图区域 → pactor 组件映射表

按线框图的「区域」反查组件。只列稳定组件与常用 props 模式；**以 packages/ui 当前导出（`packages/ui/src/components/`）为准**，新增/改名时同步本表。

| 线框图区域 | pactor 组件 | 常用模式 |
| --- | --- | --- |
| 面包屑（模块 / 页面） | `Breadcrumb` | `items: [{label, href?}]`，列表项带 href，末项纯文本 |
| 页头标题 + 副标题 | `Typography` | `variant: h3` + `variant: muted` 并排（`Flex align: baseline`） |
| 页头右侧操作（新建/导入） | `Button` | `text` + `icon`，点击 `router.push` 或弹 `Dialog` |
| 搜索框 | `Input` | 绑定 state 关键词，`onChange`/`onEnter` 后 `reload dataSource` |
| 快筛行（状态/类型单选） | `ChipFilter` | `mode: single`，`value` 绑 state，`items` 可经接口下发 |
| 标签多选筛选 | `ChipFilter` | `mode: multi`，value 为数组 state |
| 下拉筛选（操作人等枚举） | `Select` | `options` 可绑 `${data.xxx}`（接口下发选项，单段路径） |
| 日期范围筛选 | `DatePicker` | range 模式绑 state，onChange reload |
| 数据表格 | `Table` | `columns` + `dataSource: ${data.x.items}`；操作列用 Button/TextLink |
| 卡片网格（约 3-4 列） | `Grid` + `Card` | `columns: 3, gap: 16`；「添加卡」用 `Card` 虚线边框自定义样式 |
| 状态徽标（启用/停用/告警） | `Badge` / `StatusBadge` | 颜色语义化，状态文案取自线框图 |
| 启停开关图标（⏻） | `StatusToggleIcon` | 卡片/行内启停，onChange 闭环动作 + reload |
| 权限控制显隐（无权限隐藏新建卡等） | 表达式 `hidden` / `if` 动作 | 绑 `${data.session.permissions}` 等，按会话裁剪 |
| 统计数字卡 | `Statistic` + `Card` | 仪表盘顶部指标行，`Grid` 排布 |
| 趋势/占比图 | `chart/` 下 AreaChart 等 | 图表随肤切换由库内建，无需额外处理 |
| 描述列表（详情字段） | `Descriptions` | `items` 由 detail 接口下发或静态声明 |
| 详情 Tab | `Tabs` | `items: [{key, label}]`；线框图为纵向分区时改用多个 `Card` 顺序排布 |
| 表单字段（输入/选择/开关） | `Form` + `Field`/`Input`/`Select`/`NumberInput`/`RadioGroup`/`Checkbox`/`Textarea` | `name`/`label`/`required`；校验规则照抄线框图字段说明 |
| 弹窗（确认/新建） | `Dialog`（破坏性操作用 `AlertDialog`） | open 绑 state，确认后动作闭环 + `message` 反馈 |
| 抽屉（详情侧滑） | `Drawer` | 线框图标明「侧滑/抽屉」时替代路由跳转 |
| 提示条（告警/说明） | `Alert` | 密钥告警、页面说明等 |
| 空态 | `Empty` | 线框图有空态文案时显式配置，否则用组件缺省 |
| 操作反馈 | `message` 动作 | `messageType: success/error/info`，不要静默 |
| 进度 | `Progress` | 配额/用量占比 |
| 图标 | `Icon` | `name` 走白名单（kebab-case），未收录的按需补充 |
| 布局容器 | `Flex` / `Grid` / `Card` / `Page` | 间距用 `gap: small/middle/large`，避免手写 margin |

## 映射原则

1. **先区域后组件**：从线框图区域结构出发逐区翻译，不要先想「用什么组件炫酷」
2. **能内置不定制**：筛选、空态、加载、分页优先用组件内建能力；线框图有明确要求才自定义
3. **自定义样式走 className + 语义令牌**：如 `bg-(--muted)`、`text-(--muted-foreground)`，禁止写死色值（深浅色会破）
4. **线框图没有的不要加**：不臆造按钮、列、Tab；有疑问登记到页面清单的待确认项，不要自行发挥
5. **线框图有但组件没有的**：优先组合现有组件逼近；差距大时在目标项目注册业务组件（`components/` 目录），并在验收清单标注
