# 线框图区域 → pactor 组件映射表

按线框图的「区域」反查组件。只列稳定组件与常用 props 模式；**以 packages 当前导出为准**（内置组件见 `packages/ui/src/components/register.ts`，chat 展示组件见 `@pactor-app/chat` 的 `/components` 子路径，业务组件见 `@pactor-app/blocks`，图表见 `@pactor-app/chart`），新增/改名时同步本表。

| 线框图区域 | pactor 组件 | 常用模式 |
| --- | --- | --- |
| 面包屑（模块 / 页面） | `Breadcrumb` | `items: [{label, href?}]`，列表项带 href，末项纯文本 |
| 页头标题 + 副标题 | `Typography` | `variant: h3` + `variant: muted` 并排（`Flex align: baseline`） |
| 页头右侧操作（新建/导入） | `Button` | `text` + `icon`，点击 `navigate` 或 `overlay.open`；variant 只能取下文五个枚举 |
| 展开式图标操作（hover/focus 展开文字） | `ExpandingButtonGroup` | `options: [{value, label, icon, confirm?, confirmLabel?, disabled?}]`；label/icon 每项必填；`events.onSelect` 接收 value；没有受控 `value` prop |
| 托盘式高亮按钮组 | `FloatingButtonGroup` | `options: [{value, label?, icon?, disabled?}]`；`props.value: ${state.x}` 控制高亮，`events.onSelect` 接收新 value；无 confirm/confirmLabel |
| 搜索栏（关键词 + 下拉筛选 + 查询/重置） | `Form layout: inline` + `Input`/`Select` | 字段 `name` 绑定；查询按钮 `submit: true`，onSubmit 中 setState + reload；重置用 `form.setValues`。即点即生效的 ChipFilter 快筛除外 |
| 快筛行（状态/类型单选） | `ChipFilter` | `mode: single`，`value` 绑 state；`items: [{value, text, dot?}]`，text 中的计数由接口按 keyword + chip 预计算 |
| 标签多选筛选 | `ChipFilter` | `mode: multi`，value 为数组 state；item 字段与单选相同，不由组件计算计数 |
| 短选项分段切换 | `Segmented` | `options: [{label, value, icon?, disabled?}]`；value 支持 string/number，onChange 传出选中 value |
| 下拉筛选（操作人等枚举） | `Select` | `options` 可绑 `${data.xxx}`（接口下发选项，单段路径）；Form 内宽度用 controlClassName，独立用 className，见下文 |
| 日期范围筛选 | `DatePicker` | range 模式绑 state，onChange reload |
| 数据表格 | `Table` | `columns` + `dataSource: ${data.x.items}`；操作列按钮统一 `Button variant: link`；「编辑」与「新建」共用同一表单，仅以预填数据区分（initialValues / form.setValues） |
| 卡片网格（约 3-4 列） | `CardList`（`@pactor-app/blocks` 业务组件） | items 按 EntityCard 携带 `icon/logo/title/subtitle/tags/description/meta/actions/expandingActions`，均可选且可带业务扩展字段，无统一必填 key；`onItemClick` 回传 item/index，`onItemAction` 回传 key/text/item/index，`onCreateClick` 无 item |
| 状态徽标（启用/停用/告警） | `Badge` / `StatusBadge` | 颜色语义化，状态文案取自线框图；Badge 才有 `variant: outline` |
| 启停开关图标（⏻） | `StatusToggleIcon` | 卡片/行内启停，onChange 闭环动作 + reload |
| 权限控制显隐（无权限隐藏新建卡等） | 表达式 `hidden` / `if` 动作 | 绑 `${data.session.permissions}` 等，按会话裁剪 |
| 统计数字卡 | `Statistic` + `Card` | 仪表盘顶部指标行，用 `Row/Col` 响应式排布，遵守 ui-quality 的窄屏规则 |
| 录音工作区（录音列表 + 转写详情 + 播放条） | `RecordingPage`（`@pactor-app/blocks`） | 数据化 props（`groups` / `tabs` / `segments` / `summary` / `insight` / `memory` / `translation` / `player`），事件 `onSelectRecording` / `onTabChange` / `onNewRecording` 等；常作 `ChatPage` 的 `content` 槽 |
| 聊天工作页（导航 + 会话列表 + 消息流 + 产物栏） | `ChatPage`（`@pactor-app/chat/components`，模板已注册） | 数据化 props（`menuItems` / `conversations` / `messages` / `artifacts` 等），事件 `onSend` / `onMessageAction` / `onMenuSelect` 等；右侧主区域可经 `content` 槽整体替换（如 RecordingPage） |
| 趋势/占比图 | `@pactor-app/chart` 的 LineChart / PieChart 等 | 需 `registerChartComponents` 注册；图表随肤切换由库内建，无需额外处理 |
| 描述列表（详情字段） | `Descriptions` | `items` 由 detail 接口下发或静态声明 |
| 详情 Tab | `Tabs` | `items: [{key, label, children?, extra?}]`；extra 只取受控 activeKey 当前项，非受控取首项；`tabPosition: left` 不渲染 extra；单页签不得仅为 extra 当默认分区 |
| 表单（独立页 / 内嵌面板 / 弹窗抽屉） | `Form` 包裹 `Input`/`Select`/`NumberInput`/`RadioGroup`/`Checkbox`/`Textarea` 等 | 字段 `props.name` 绑定；校验用 `rules`；提交按钮 `submit: true` + `onSubmit`；回填联动用 `form.setValues` 动作。禁止散放字段 + setState 手写校验 |
| 弹窗（确认/新建） | `Dialog`（破坏性操作用 `AlertDialog`） | open 绑 state，确认后动作闭环 + `message` 反馈 |
| 抽屉（详情侧滑） | `Drawer` | 线框图标明「侧滑/抽屉」时替代路由跳转 |
| 提示条（告警/说明） | `Alert` | 密钥告警、页面说明等 |
| 空态 | `Empty` | `title` / `description` 表达无数据原因，`children` 放真实 CTA；Table/CardList 已有内置空态时不叠加 |
| 操作反馈 | `message` 动作 | `messageType: success/error/info`，不要静默 |
| 进度 | `Progress` | 配额/用量占比 |
| 图标 | `Icon` | `name` 走白名单（kebab-case），未收录的按需补充 |
| 布局容器 | `Flex` / `Grid` / `Row` / `Col` / `Card` / `Page` | 间距用 `gap: small/middle/large` 或响应式 `gutter`；`Flex.justify` 只能取下文六个枚举，避免手写 margin |

## 关键 props 契约

### Tabs.extra：当前项扩展区

- `TabItem` 的必填字段是 `key` / `label`；`children` 是该页签内容 DSL 子树，`extra` 是页签栏右端 DSL 子树，二者不能混放。
- `tabPosition: top`（缺省）时，extra 渲染在页签栏右端。**受控** `activeKey` 时取 key 匹配的当前项；切换后必须经 `onChange → setState` 回写，extra 才跟随到新的当前项。
- **非受控**（未传 activeKey）时内容默认激活首项，extra 固定取首项；用户切到其他页签也不会改取其他 extra。需要 extra 跟随切换时必须改成受控模式。
- `tabPosition: left` 为左侧竖排，右端槽位不存在，所有 extra 都不渲染。需要操作按钮时把它放进对应页签的 `children`，不要切换成竖排后仍断言右端 extra 可见。
- 单页签 top Tabs 虽会恒渲染首项 extra，但按 `ui-quality.md` 不得借此把单页签 Tabs 作为默认分区容器；只有标题和操作区时使用 Card / Flex。受控示例见 `page-templates.md`「详情页」。

### ExpandingButtonGroup 与 FloatingButtonGroup

| 契约 | ExpandingButtonGroup | FloatingButtonGroup |
| --- | --- | --- |
| options 必填字段 | 每项 `value` / `label` / `icon` | 每项 `value`；`label` / `icon` 均可选 |
| 选中事件 | `events.onSelect`，`${event}` 为选项 value | `events.onSelect`，`${event}` 为选项 value |
| 当前值 | **没有** `props.value`，不写受控选中态 | `props.value: ${state.x}` 控制共享高亮块；onSelect 后回写同一 state |
| 二次确认 | 选项可写 `confirm: true` 与 `confirmLabel`；首次点击进入确认态，再次点击才 onSelect | 无 `confirm` / `confirmLabel`，不得照搬 Expanding 的确认配置 |

EntityCard 的 `expandingActions` 复用 ExpandingButtonGroupOption，经 `onExpandingAction` 抛出 value；不要把 Floating 的受控 value 写到该数组或 ExpandingButtonGroup 上。

### Flex.justify 与 Button/Badge.variant

- `Flex.justify` 精确枚举：`start`、`center`、`end`、`space-between`、`space-around`、`space-evenly`。`between` 非法，源码没有对应 class 映射；两端布局写 `justify: space-between`。
- `Button.variant` 精确枚举：`default`、`primary`、`dashed`、`link`、`text`。Button 没有 `outline`；普通边框按钮写 `variant: default`，不要用 shadcn 内部映射名替换 DSL 契约。
- `Badge.variant` 才可取 `default`、`secondary`、`destructive`、`outline`。

### Select 宽度：wrapper 与 trigger

Select 的 trigger 已内置 `w-full`，实际宽度由控件包裹节点决定；不同渲染上下文要控制不同节点：

- **Form 内**：`className` 挂 form-item wrapper，`controlClassName` 挂 Select 控件包裹节点。固定控件为 10rem 时写 `controlClassName: w-40`，控件包裹限定 10rem，内置 trigger 随后铺满；不需要为了修 trigger 再改 form-item wrapper。
- **独立渲染**：`className` 直接挂控件包裹节点，写 `className: w-40` 即可；trigger 随该包裹节点固定为 10rem。`controlClassName` 与 className 同点合并，只在需要追加控件类时使用。
- Grid / Row 内需要填满整列时，Form 内写 `controlClassName: w-full`。trigger 已是 `w-full`，无需再添加任何 trigger 宽度选择器。

```yaml
# Form 内：搜索状态下拉固定为 10rem
- type: Select
  props:
    name: status
    controlClassName: w-40
    options: ${data.list.filters.status}
```

```yaml
# Form 外：独立 Select 固定为 12rem
- type: Select
  props:
    className: w-48
    options:
      - { label: 启用, value: ENABLED }
      - { label: 停用, value: DISABLED }
```

### Empty：title / description + children CTA

`children` 是操作区 DSL 子树，CTA 必须接到真实动作；下面示例要求 `/orders/new` 已在 sitemap 注册。Table / CardList 已显示内置空态时，不再叠加本结构。

```yaml
- type: Empty
  props:
    title: 暂无订单
    description: 创建第一个订单后，可在这里查看进度。
  children:
    - type: Button
      props: { text: 新建订单, variant: primary }
      events:
        onClick:
          - action: navigate
            params: { to: /orders/new }
```

## 映射原则

1. **先区域后组件**：从线框图区域结构出发逐区翻译，不要先想「用什么组件炫酷」
2. **布局尺寸默认以模板为准**：线框图的 ASCII 排版只是示意——列数、卡片尺寸、间距、对齐默认沿用生成工程内 `src/server/yaml/` 既有页面（`models/` 骨架与参考模块）的同类写法（如卡片网格列数、筛选区纵向堆叠、页头 h3+muted），不为还原线框图而发明新排版；确需变体时按 `ui-quality.md` 在 UI 计划写明 PRD 依据和结构影响
3. **能内置不定制**：筛选、空态、加载、分页优先用组件内建能力；线框图有明确要求才自定义
4. **自定义样式走 className + 语义令牌**：如 `bg-(--muted)`、`text-(--muted-foreground)`，禁止写死色值（深浅色会破）
5. **线框图没有的不要加**：不臆造按钮、列、Tab；有疑问登记到页面清单的待确认项，不要自行发挥
6. **线框图有但组件没有的**：优先组合现有组件逼近；差距大时在目标项目注册业务组件（`components/` 目录），并在验收清单标注
