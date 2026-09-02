---
title: DSL 参考
description: 页面 DSL 的完整结构、表达式作用域、数据源、动作与内置组件属性说明
---

Pactor 页面以 YAML / JSON DSL 描述（`.page.yaml`，经 `@pactor-app/vite-plugin` 构建期校验）。本页是 DSL 的完整参考：顶层结构、表达式作用域、数据源、动作目录与内置组件属性。

DSL 的类型定义以 `@pactor-app/core` 为准（`PageDsl` / `DslNode` / `ActionConfig`）；组件 props 契约以 `@pactor-app/ui` components 层为准。

## 顶层结构（PageDsl）

```yaml
dsl: '1.0'              # 必填，DSL Specification Version
page:                   # 必填，页面元信息
  id: customer-list
  title: 客户列表
  permission: customer:view
state:                  # 可选，页面初始状态
  keyword: ''
dataSources:            # 可选，数据源集合
  customers: { type: service, service: customer.list, autoLoad: true }
lifecycle:              # 可选，生命周期动作
  onInit: { action: setState, params: { ready: true } }
body:                   # 可选，UI 树根节点（DslNode）
  type: Page
  props: { title: 客户列表 }
  children: [...]
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `dsl` | string（必填） | DSL 规范版本，如 `'1.0'` |
| `requires` | object | 能力声明：`runtime`（semver range）、`components`（组件名 → range） |
| `page` | PageMeta（必填） | 见下表 |
| `state` | object | 页面初始状态，经 `${state.x}` 引用、`setState` 动作更新 |
| `dataSources` | Record<string, DataSourceConfig> | 见[数据源](#数据源datasources) |
| `lifecycle` | object | 见[生命周期](#生命周期lifecycle) |
| `body` | DslNode | UI 树根节点 |

### page 元信息（PageMeta）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string（必填） | 页面唯一标识，与资源加载的 pageId 对应 |
| `title` | string | 页面标题（布局页签/面包屑展示） |
| `type` | string | 页面类型 / Page Pattern，如 `list`、`detail`、`form` |
| `permission` | PermissionConfig | 页面级权限（无权限时路由层渲染 403） |

## 节点（DslNode）

`body` 及组件的 `children`、`cell` 行模板、overlay `content` 均为 DslNode 树：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | string（必填） | 组件类型名，对应 Component Registry 注册名（内置 12 个见[组件目录](#组件目录)） |
| `id` | string | 节点标识（一般省略） |
| `props` | object | 组件属性，值可含 `${...}` 表达式 |
| `children` | DslNode[] | 子节点 |
| `events` | EventMap | 事件名 → 动作或动作数组（多个动作按声明顺序串行执行） |
| `permission` | PermissionConfig | 组件级权限，见下 |
| `when` | 表达式 | 条件渲染，表达式为假时不渲染该节点 |

### 权限配置（PermissionConfig）

三种等价形式，权限码数组任一命中即放行：

```yaml
permission: customer:delete                              # 单权限码
permission: [customer:delete, customer:admin]            # 数组（任一）
permission: { code: customer:delete, denied: disabled }  # 对象形式
```

`denied` 指定无权限时的处理策略，缺省 `hidden`：

| 值 | 行为 |
| --- | --- |
| `hidden` | 不渲染 |
| `disabled` | 渲染为禁用态 |
| `readonly` | 渲染为只读态 |

### 动作配置（ActionConfig）

```yaml
- id: editResult            # 可选，命名动作：结果写入 actions.editResult
  action: overlay.open      # 动作名（Action Registry 注册名）
  params: { ... }           # 参数，值可含表达式
  condition: ${state.ready} # 可选，条件为假跳过执行
  permission: customer:edit # 可选，无权限跳过执行
```

命名动作（`id`）结果写入 `actions.<id>` 作用域：**成功时为结果数据，失败时为 `{ ok: false, error }`**。

## 表达式与作用域

属性值、动作参数中的 `${...}` 由 `@pactor-app/expression` 求值（受控 AST，禁 eval，window/fetch 不可达，`__proto__` / `constructor` 隔离）：

- 字符串整体恰好是一个 `${...}`：**保留原始类型**（`${state.count}` → number）
- 与其他文本混合：拼接为字符串（`共 ${state.count} 条`）；`null` / `undefined` 渲染为空串
- 支持成员访问、字面量（含对象字面量 `{ name: user.name }`，常用作 `t()` 插值参数）、常见二元/逻辑/一元运算符与白名单函数调用（成员方法调用被拒绝）；详见 [@pactor-app/expression](/packages/expression/)

### 全局作用域键

| 键 | 内容 |
| --- | --- |
| `app` | bootstrap 的 `app` 字段（如 `${app.name}`） |
| `user` | bootstrap 的 `user` 字段（如 `${user.name}`） |
| `page` | 当前页面元信息 |
| `state` | 页面状态（`setState` 更新） |
| `form` | `state.form` 别名（Form 提交后写入，`${form.<field>}`） |
| `data` | 数据源结果（`${data.customers}`） |
| `route` | 路由上下文（`${route.params.id}`、`${route.query.x}`） |
| `params` | `route.params` 别名；overlay 内为 overlay 注入的 params |
| `actions` | 命名动作结果（`${actions.editResult.success}`） |
| `locale` | 当前语言代码（如 `'zh-CN'`） |
| `t` | 翻译函数（`${t('menu.home')}`、`${t('welcome', { name: 'Alice' })}`） |

### 局部作用域键（覆盖同名全局键）

| 键 | 出现的上下文 |
| --- | --- |
| `event` | 事件回调参数（Input 传 string、Form 传 values、Button onClick 无参） |
| `row` / `rowIndex` | Table 列的 `cell` 行模板 |
| `parent` | overlay 内容中访问父页面作用域快照 |

## 数据源（dataSources）

```yaml
dataSources:
  customers:
    type: service            # static | service | http
    service: customer.list   # type=service 时的服务名
    autoLoad: true           # 页面加载时自动加载
    params:                  # 调用参数，值可含表达式，加载时求值
      keyword: ${state.keyword}
```

| 字段 | 适用类型 | 说明 |
| --- | --- | --- |
| `type` | 全部 | `static` / `service` / `http`（`computed` / `resource` 已在类型中声明，当前版本未实现） |
| `value` | static | 静态数据，原样作为结果 |
| `service` | service | Service Registry 中的服务名（经 `createPactorApplication({ services })` 注入） |
| `params` | service | 调用参数（加载时对表达式求值） |
| `request` | http | `{ method?, url, params?, headers?, body? }`，经 HttpAdapter 发出 |
| `autoLoad` | 全部 | `true` 时页面初始化自动加载 |
| `pagination` | — | 分页参数映射 `{ page, pageSize }`（值可含表达式） |

结果经 `${data.<name>}` 引用。`reload` 动作：指定 `dataSource` 刷新该源，缺省刷新全部 `autoLoad` 源。

## 生命周期（lifecycle）

`onInit`（创建后）与 `onLoad`（首次加载完成）由页面运行时自动执行；`onReady` / `onShow` / `onHide` / `onDestroy` 由宿主（路由）触发。每个事件可配单个动作或动作数组：

```yaml
lifecycle:
  onInit:
    - action: setState
      params: { ready: true }
```

## 动作目录

### 运行时内置（@pactor-app/runtime，UI 无关）

| 动作 | params | 说明 |
| --- | --- | --- |
| `setState` | 任意键值 | 表达式求值后合并进 state |
| `resetState` | — | 重置 state 为初始值 |
| `reload` | `dataSource?` | 刷新数据源；缺省刷新全部 autoLoad 源 |
| `request` | `url`（必填）、`method?`、`params?`、`headers?`、`body?`、`target?` | 经 HttpAdapter 发请求；`target` 指定时结果写入 state 路径（`state.detail` 或 `detail`） |
| `sequence` | `actions` | 子动作串行，任一失败即中断 |
| `parallel` | `actions` | 子动作并行，全部完成返回；任一失败则整体失败 |
| `if` | `condition`、`then?`、`else?` | 条件分支（condition 为整体单表达式时保留布尔类型） |
| `delay` | `ms` | 等待指定毫秒 |
| `form.setValues` | `values`（必填）、`form?`（缺省 `default`） | 表单联动：写入目标表单字段值；不触发校验与 `onValuesChange`；表单未注册时受控失败 |

### 应用层注册（@pactor-app/app / 交互 kit）

| 动作 | params | 说明 |
| --- | --- | --- |
| `navigate` | `to`（必填） | 经路由桥接跳转（react-router push） |
| `message` | `text`、`type?`（success / error / warning / info，缺省 info） | 全局提示 |
| `confirm` | `title?`、`content?` | 确认弹窗；结果 data：确认 `true` / 取消 `false` |
| `overlay.open` | `overlay`（见下） | 打开弹层并等待关闭；结果 data 为 close 的 payload |
| `overlay.close` | `id?`、`payload?` | 关闭弹层（缺省栈顶）；payload 缺省为取消语义 |

### overlay.open 的 overlay 配置

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `modal` \| `drawer`（必填） | 弹层类型 |
| `title` | string | 标题 |
| `width` | number \| string | 宽度 |
| `content` | DslNode | 内联 DSL 内容（与 `page` 二选一） |
| `page` | `{ pageId }` | 动态页面引用（与 `content` 二选一） |
| `params` | object | 注入 overlay 内容作用域的 `params` 键 |

overlay 内容的表达式以 overlay 作用域求值（`${params.x}` 取注入参数，`${parent.x}` 取父页面作用域快照）；绑定 state / data 的表达式随 store 变化自动重渲染。

## 组件目录

内置 12 个组件（shadcn 实现，@pactor-app/ui）+ @pactor-app/markdown 注册的 Markdown。业务组件注册见[自定义组件](/guides/custom-components/)。

### Page

页面容器。内容区 children 纵向间距 20px。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 页面标题 |

### Grid

均分栏布局（每列 span = 24 / columns 向下取整）。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `columns` | number（默认 1） | 列数 |
| `gap` | number | 栏间距 |

### Flex

| prop | 类型 | 说明 |
| --- | --- | --- |
| `direction` | `horizontal`（默认）\| `vertical` | 主轴方向 |
| `gap` | number \| `small` \| `middle` \| `large` | 间距 |
| `justify` | `start` \| `center` \| `end` \| `space-between` \| `space-around` \| `space-evenly` | 主轴对齐 |
| `align` | `start` \| `center` \| `end` \| `baseline` \| `stretch` | 交叉轴对齐 |

### Card

| prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 卡片标题 |
| `bordered` | boolean（默认 true） | 是否有边框 |

### Button

| prop | 类型 | 说明 |
| --- | --- | --- |
| `text` | string | 按钮文本 |
| `variant` | `default`（默认）\| `primary` \| `dashed` \| `link` \| `text` | 变体 |
| `danger` | boolean | 危险态 |
| `size` | `small` \| `middle`（默认）\| `large` | 尺寸 |
| `loading` | boolean | 加载态（可绑 `${state.x}`，loading 时禁用点击） |
| `disabled` | boolean | 禁用 |
| `submit` | boolean | 作为 Form 提交按钮 |
| 事件 `onClick` | — | 点击触发动作 |

### Alert

| prop | 类型 | 说明 |
| --- | --- | --- |
| `message` | string | 主文案 |
| `description` | string | 辅助说明 |
| `variant` | `info`（默认）\| `success` \| `warning` \| `error` | 变体 |

### Statistic

| prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 指标标题 |
| `value` | number \| string | 数值（通常为表达式结果） |
| `precision` | number | 小数精度 |
| `suffix` | string | 后缀（如单位） |

### Tabs

| prop | 类型 | 说明 |
| --- | --- | --- |
| `items` | `{ key, label, children?: DslNode[] }[]` | 页签列表，pane 内容为 DSL 子树 |
| `activeKey` | string | 当前激活 key（可绑表达式） |
| 事件 `onChange` | — | 切换时传出新 key |

### Table

| prop | 类型 | 说明 |
| --- | --- | --- |
| `columns` | TableColumn[] | 列定义（见下） |
| `dataSource` | object[] | 数据行（通常 `${data.xxx}`） |
| `rowKey` | string（默认 `'id'`） | 行 key 字段 |
| `loading` | boolean | 加载态 |
| `pagination` | `false` \| `{ pageSize? }` | 分页配置 |
| 事件 `onChange` | — | 分页变化，传出 `{ current, pageSize, total }` |

TableColumn：`title`、`dataIndex`、`width`、`cell`（DslNode 行模板，作用域注入 `row` / `rowIndex`）。

### Form

| prop | 类型 | 说明 |
| --- | --- | --- |
| `name` | string（默认 `'default'`） | 表单名，`form.setValues` 联动动作按名寻址；同页多表单（如页面表单 + 抽屉表单）需显式命名避免重复注册 |
| `layout` | `vertical`（默认）\| `horizontal` \| `inline` | 表单布局 |
| `initialValues` | object | 表单初始值（字段级 `value` 优先于此处的同名字段） |
| 事件 `onSubmit` | — | 校验通过后触发，`event` 为表单 values，同时写入 `${form.<field>}` |
| 事件 `onValuesChange` | — | 字段变化，`event` 为变化字段单键对象 `{ <field>: <newValue> }` |

Form 内声明 `name` 的 Input / Select 自动成为表单项（label / rules 生效，值由 Form 托管）。

### 表单联动

选项/禁用/显隐联动直接绑 state 即可（`options: ${state.xxx}`、`disabled: ${state.x}`、`when`）；**字段值联动**（如级联清空）用 `form.setValues` 动作：

```yaml
- type: Select
  props:
    name: region
    label: 省份
    options: [{ label: 浙江, value: 浙江 }, { label: 江苏, value: 江苏 }]
  events:
    onChange:
      # 清空下级字段（event 为选中的新值）
      - action: form.setValues
        params:
          values: { city: '' }
      # 更新下级选项（计算成员访问：state.cityMap[event]）
      - action: setState
        params:
          cityOptions: ${state.cityMap[event]}
- type: Select
  props:
    name: city
    label: 城市
    options: ${state.cityOptions}
```

完整可运行示例见 `examples/admin/src/pages/customer-list.page.yaml` 的编辑抽屉（含打开时初始化级联选项的写法）。

### Input

| prop | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | 字段名（Form 内声明即成为表单项） |
| `label` | string | 表单项标签 |
| `rules` | FieldRule[] | 校验规则（见下） |
| `value` | string | 独立渲染时为受控值；Form 内为字段初始值（优先于 `initialValues`） |
| `type` | `text`（默认）\| `password` | `password` 掩码输入 |
| `placeholder` | string | 占位文案 |
| `disabled` | boolean | 禁用 |
| 事件 `onChange` | — | 传出 string 值 |

### Select

| prop | 类型 | 说明 |
| --- | --- | --- |
| `name` / `label` / `rules` / `placeholder` / `disabled` | 同 Input | — |
| `options` | `{ label, value }[]`（value: string \| number \| boolean） | 选项列表 |
| `value` | string \| number \| boolean | 同 Input 的初始值语义 |
| `allowClear` | boolean | 可清空 |
| 事件 `onChange` | — | 传出选中 value |

### 校验规则（FieldRule）

当前支持必填校验：

```yaml
rules:
  - required: true
    message: 请输入客户名称
```

校验失败阻止 Form 提交并在字段下方展示 `message`。

### Markdown

安全 Markdown 渲染（禁 raw HTML、链接协议白名单，含代码高亮与 KaTeX 数学），由 @pactor-app/markdown 提供，需经 `registerMarkdownComponents(runtime.context.components)` 注册后可用（chat 场景经 Safe Registry 白名单放行）。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `content` | string | Markdown 源文本；`${data.xxx}` 等表达式由 Renderer 在下发前解析 |

```yaml
- type: Markdown
  props:
    content: '当前筛选：**${state.keyword}**'
```

## 完整示例

参考示例工程页面（双 kit 共用同一份 DSL）：

- 登录页：`examples/admin/src/pages/login.page.yaml`（Form 校验、`type: password`、命名动作 + `if` 分支、loading 绑定）
- 列表页：`examples/admin/src/pages/customer-list.page.yaml`（service 数据源、cell 行模板、overlay.open 抽屉、权限禁用）
- 工作台：`examples/admin/src/pages/dashboard.page.yaml`（static 数据源、Grid/Statistic、navigate）

## 聊天页完整示例（@pactor-app/chat）

以下为 `examples/chat/src/chat.page.yaml` 的完整内容（注释中的内部 spec 引用已略去）——一个完整 AI 对话页的 DSL 声明。`Chat` 不是内置组件，需由 `registerChatComponent(registry)` 注册（见 [@pactor-app/chat](../packages/chat.md)）；`transport` / `safeRegistry` / `callService` 服务桥等函数与实例无法从 DSL 产生，由宿主经 `ChatServicesProvider` 注入（见 `examples/chat/src/App.tsx`）。

```yaml
dsl: '1.0'
page:
  id: chat
  title: 对话

# 页面级 state：产出物面板闭环——
# artifact part 就绪 → events.onArtifact → setState 写入 artifact 并打开面板；
# 面板关闭按钮 / 窄屏遮罩 → events.onPanelClose → setState 关闭。
# artifact / panelOpen 为受控 props（任一提供即全受控）。
# model 为内建模型选择的受控闭环状态（初值为 models[0]）。
state:
  panelOpen: false
  artifact: null
  model: demo-mock

body:
  type: Chat
  props:
    # 模型 chip 渲染在工作区头部左端：
    # 仅配置 models 也渲染极简头部
    modelPlacement: header
    greeting: 你好，我是 Pactor Chat 示例
    subtitle: 数据全部由调用方经接口注入；点击下方建议立即开始
    conversationId: ${route.query.id || 'conv-demo'}
    params:
      agentId: ${route.query.id || ''}
    artifact: ${state.artifact}
    panelOpen: ${state.panelOpen}
    # 内建模型选择：受控闭环
    # model: ${state.model} + events.onModelChange → setState
    models:
      - { value: demo-mock, label: demo-mock }
      - { value: demo-fast, label: demo-fast }
      - { value: demo-pro, label: demo-pro }
    model: ${state.model}
    # 内建上下文数据源：@ 智能体 / + 上下文，
    # service 引用经宿主 callService 服务桥解析
    contexts:
      - { trigger: '@', label: 智能体, service: agents }
      - { trigger: '+', label: 上下文, service: contexts }
    # 消息操作条：数组即真相——
    # 内建 copy / retry / regenerate + edit 覆盖 label（内建行为不变）
    # + 自定义 quote 动作（service 派发，宿主 callService 注册 quoteMessage）
    messageActions:
      - copy
      - retry
      - regenerate
      - { id: edit, builtin: edit, label: 修改并重发 }
      - { id: quote, label: 引用回复, icon: quote, service: quoteMessage }
    suggestions:
      - { label: 今天天气怎么样, prompt: 今天天气怎么样 }
      - { label: 看一下本月报表, prompt: 看一下本月报表 }
      - { label: 生成一份月报, prompt: 帮我生成一份月报 }
      - { label: 写一段代码, prompt: 帮我写一段代码 }
      - { label: 生成统计页面, prompt: 帮我生成一个统计页面 }
      - { label: 导出客户数据, prompt: 导出客户数据 }
  events:
    # artifact part 就绪：event.artifact 为产出物对象，setState 开面板
    onArtifact:
      - action: setState
        params:
          artifact: ${event.artifact}
          panelOpen: true
    # 面板关闭按钮 / 窄屏遮罩点击
    onPanelClose:
      - action: setState
        params:
          panelOpen: false
    # 消息流产出物卡片"在面板中打开"：受控场景的重开面板入口
    onOpenArtifact:
      - action: setState
        params:
          artifact: ${event.artifact}
          panelOpen: true
    # 模型切换：受控闭环（event.model 回写 state.model）
    onModelChange:
      - action: setState
        params:
          model: ${event.model}
    # 消息操作条点击通知：event.action 为
    # 动作 id（内建动作为内建名），event.message 为对应消息数据；
    # 与 service 派发并行（自定义 quote 动作同时经 quoteMessage 服务处理）
    onMessageAction:
      # 注意：params 勿带 type 键——带 type/action 键的对象会被动作引擎
      # 视作内嵌 DslNode/ActionConfig 而跳过表达式求值（engine resolveDeep
      # 的 isOpaque 约定）；message 动作缺省即 info
      - action: message
        params:
          text: 触发消息操作：${event.action}
```

要点说明：

- **受控闭环是本页的主线**：模型选择（`model: ${state.model}` ↔ `onModelChange` → setState）、产出物面板（`artifact` / `panelOpen` ↔ `onArtifact` / `onPanelClose` / `onOpenArtifact` → setState）都是"props 绑 state、事件回写 state"的标准闭环；`Chat` 本身不擅自开面板、不擅自改模型。
- **`conversationId` 取路由 query**（`${route.query.id || 'conv-demo'}`）：智能体列表页与侧栏「最近」分组经 `navigate` 动作跳 `/chat?id=xxx` 进入独立会话，刷新后按 URL 还原——路由化多页装配由宿主 `App.tsx`（HashRouter + MenuRegistry + DynamicDslRoute）承担，DSL 只消费 `route.query`。
- **service 引用是 DSL 与宿主函数的边界**：`contexts[].service`（`agents` / `contexts`）与 `messageActions[].service`（`quoteMessage`）都是字符串引用，运行时经 `ChatServices.callService(name, params)` 派发到宿主注册的服务——函数不进 DSL，符合"DSL 只承载可序列化数据"的约束。
- **`messageActions` 数组即真相**：渲染顺序与内容严格按数组，未列出的内建动作不出现；内建项（字符串或 `{ builtin }`）保留包内默认行为，可覆盖 `label` / `icon` / `roles` / `visibleWhen`；自定义项（无 `builtin`）点击经 service 派发并并行触发 `onMessageAction` 事件（内建动作点击同样通知）。
- **两个易踩的坑**：① DSL `message` 动作的 `params` 勿带 `type` 键（触发动作引擎 isOpaque 约定，跳过 `${...}` 求值，缺省即 info）；② `events.onMessageAction` 的 `event.message` 是完整消息对象（含 parts 数组），toast 类动作只取 `event.action` 即可。
