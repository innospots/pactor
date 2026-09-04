---
title: DSL 参考
description: 页面 DSL 的完整参考——顶层字段逐一详解、state 与 data 用法、表达式与作用域、权限、动作目录、内置组件属性
---

Pactor 页面以 YAML / JSON DSL 描述（`.page.yaml`，经 `@pactor-app/vite-plugin` 构建期校验，`pactor validate` 命令行校验）。本页是 DSL 的完整参考，逐一解释每个属性的含义，复杂属性附完整示例。

DSL 的类型定义以 `@pactor-app/core` 为准（`PageDsl` / `DslNode` / `ActionConfig`）；组件 props 契约以 `@pactor-app/ui` components 层为准。

## 顶层结构（PageDsl）

一份页面 DSL 的完整骨架（所有可选字段都标出，实际页面只需 `dsl` + `page` + `body`）：

```yaml
dsl: '1.0'                    # 必填，DSL 规范版本
requires:                     # 可选，能力声明
  runtime: '>=0.1.0'
page:                         # 必填，页面元信息
  id: customer-list
  title: 客户列表
  name: customerList
  description: 客户列表页
  type: list
  permission: customer:view
meta:                         # 可选，扩展元数据（Runtime 不消费）
  version: '1.0'
  author: platform-team
state:                        # 可选，页面初始状态
  keyword: ''
dataSources:                  # 可选，数据源集合
  customers:
    type: service
    service: customer.list
    autoLoad: true
actions:                      # 可选，页面级命名动作（call 引用）
  refresh:
    - action: reload
components:                   # 可选，页面级命名组件（component 引用）
  searchForm:
    type: Form
    children: [...]
lifecycle:                    # 可选，生命周期动作
  onInit:
    - action: setState
      params: { ready: true }
body:                         # 可选，UI 树根节点（DslNode）
  type: Page
  props: { title: 客户列表 }
  children: [...]
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `dsl` | string | 是 | DSL 规范版本，见下 |
| `requires` | RequiresConfig | 否 | 能力声明，见下 |
| `page` | PageMeta | 是 | 页面元信息，见下 |
| `meta` | Record<string, unknown> | 否 | 页面扩展元数据，见下 |
| `state` | Record<string, unknown> | 否 | 页面初始状态，见 [state 详解](#state页面状态) |
| `dataSources` | Record<string, DataSourceConfig> | 否 | 数据源集合，见 [dataSources 详解](#datasources数据源) |
| `actions` | Record<string, ActionConfig \| ActionConfig[]> | 否 | 命名动作复用，见 [actions 详解](#actions页面级命名动作) |
| `components` | Record<string, DslNode> | 否 | 命名组件子树，见 [components 详解](#components页面级命名组件) |
| `lifecycle` | LifecycleConfig | 否 | 生命周期动作，见 [lifecycle 详解](#lifecycle生命周期) |
| `body` | DslNode | 否 | UI 树根节点，见 [节点结构](#节点dslnode) |

### dsl（规范版本）

DSL Specification Version——这份文档遵循哪版 DSL 规范。当前版本恒为 `'1.0'`（`@pactor-app/schema` 的 `DSL_VERSION` 常量）。**必填**，缺失时校验拒绝（错误定位 `/dsl`）。

它的作用是版本协商：未来规范升级到 `2.0` 时，Runtime 加载前可据它做能力校验与兼容处理。注意与 `meta.version` 区分——后者是**文档自身**的业务版本号，框架不消费。

### requires（能力声明）

声明这份 DSL 对运行环境的要求，供宿主在加载前检查：

```yaml
requires:
  runtime: '>=0.1.0'          # Runtime 版本范围（semver range）
  components:                 # 组件 API 版本要求：组件名 → semver range
    Table: '>=1.0'
```

两个字段都可省略。当前版本仅做声明与校验透传，不做强制阻断。

### page（页面元信息）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string（必填） | 页面唯一标识，与资源加载的 pageId 一一对应（菜单的 `pageId`、overlay 的 `page.pageId` 都按它寻址） |
| `title` | string | 页面展示标题：布局页签、面包屑、浏览器标题 |
| `name` | string | 页面标识名称（程序引用用途，区别于给人看的 `title`） |
| `description` | string | 页面描述（工具链 / 文档生成读取） |
| `type` | string | 页面类型 / Page Pattern，如 `list`、`detail`、`form`，供布局或工具链分流 |
| `permission` | PermissionConfig | 页面级权限：无权限时路由层渲染 403 页，见[权限](#权限permissionconfig) |

```yaml
page:
  id: customer-list            # 必须全局唯一
  title: 客户列表
  permission: customer:view    # 无 customer:view 权限的用户访问得到 403
```

### meta（扩展元数据）

自由键值对（`Record<string, unknown>`），**Runtime 完全不消费**。用于记录文档自身的管理信息或业务标记，供宿主、工具链（CLI inspect / lint）读取：

```yaml
meta:
  version: '1.0'        # 文档自身的版本（与 dsl 规范版本无关）
  author: platform-team
  tags: [demo, admin]
  reviewStatus: approved
```

## state（页面状态）

`state` 是页面的**响应式状态**：DSL 里声明初始值，表达式里读取，动作里更新，任何更新自动驱动引用它的 UI 重渲染。

### 声明与初始值

```yaml
state:
  keyword: ''              # 字符串
  pageSize: 20             # 数字
  advanced: false          # 布尔
  selectedRow: null        # 空值（常作"未选中"标记）
  cityMap:                 # 嵌套对象
    浙江: [杭州, 宁波]
  list: []                 # 数组
```

### 读取：表达式 `${state.x}`

任意 props、`when`、动作参数中经 `${state.<路径>}` 读取，支持嵌套路径与计算成员访问：

```yaml
props:
  title: 共 ${state.total} 条            # 插值拼接
  disabled: ${state.advanced == false}   # 整体为单个表达式时保留原始类型（布尔）
  options: ${state.cityMap[state.region]} # 计算成员访问
```

### 更新：`setState` / `resetState` 动作

```yaml
# 对象形式：求值后浅合并进 state（只更新列出的键）
- action: setState
  params:
    keyword: ${event}              # event 为 Input onChange 的值
    page: 1

# 重置为初始值（回到 DSL 声明的 state）
- action: resetState
```

`setState` 是**浅合并**：`params: { user: {...} }` 会整体替换 `state.user`，不会深合并嵌套对象。

### 受控闭环模式（最常用的范式）

「props 绑 state、事件回写 state」是 DSL 交互的基本闭环，所有联动都由此构成：

```yaml
- type: Input
  props:
    value: ${state.keyword}        # 绑定：state → UI
  events:
    onChange:
      - action: setState           # 回写：UI → state
        params: { keyword: ${event} }
- type: Alert
  props: { message: 当前输入：${state.keyword} }   # 任何引用处自动更新
```

### Form 与 state 的关系

Form 提交时自动把表单值写入 `state.form` 路径，因此 `${form.<field>}` 与 `${state.form.<field>}` 都可用（`form` 是 `state.form` 的作用域别名）：

```yaml
- type: Form
  events:
    onSubmit:
      - action: reload
        params: { dataSource: list }
# 提交后：${form.keyword} / ${state.form.keyword} 均可读取
```

## dataSources（数据源）

`dataSources` 声明页面的**命名数据源**：一份加载配置（静态值 / 服务调用 / HTTP 请求），结果经 `${data.<name>}` 引用，加载状态经 `${dataStatus.<name>}` 引用。

### 三种类型

**static：静态数据**，`value` 原样作为结果（适合枚举、演示数据）：

```yaml
dataSources:
  statusOptions:
    type: static
    value:
      - { label: 启用, value: active }
      - { label: 停用, value: inactive }
```

**service：服务调用**，调用宿主注入的服务函数（`createPactorApplication({ services })` 注册），`params` 支持表达式、**加载时求值**：

```yaml
dataSources:
  customers:
    type: service
    service: customer.list       # Service Registry 中的服务名
    autoLoad: true
    params:
      keyword: ${state.keyword}  # 每次加载时取当时的 state
```

**http：HTTP 请求**，经宿主注入的 HttpAdapter 发出（鉴权令牌、baseURL 由宿主统一处理）：

```yaml
dataSources:
  detail:
    type: http
    request:
      method: GET                # 可省略，缺省 GET
      url: /api/customers/${state.currentId}
      params: { verbose: true }  # query 参数
      headers: {}                # 额外请求头
      # body: {...}              # POST/PUT 时的请求体
```

`computed` / `resource` 类型已在协议中声明，当前版本未实现。

### 完整字段表

| 字段 | 适用类型 | 说明 |
| --- | --- | --- |
| `type` | 全部（必填） | `static` / `service` / `http` |
| `value` | static | 静态数据，原样作为结果 |
| `service` | service | Service Registry 中的服务名 |
| `params` | service | 调用参数，值可含表达式，**加载时**对当时作用域求值 |
| `request` | http | `{ method?, url, params?, headers?, body? }` |
| `autoLoad` | 全部 | `true` 时页面初始化即加载；缺省不自动加载（等 `reload` 触发） |
| `pagination` | — | 分页参数映射 `{ page, pageSize }`，值可含表达式 |
| `valueField` / `labelField` | 全部 | 选项字段映射，见下 |
| `disabledField` | 全部 | 选项禁用标记字段，见下 |

### 加载时机与刷新

- `autoLoad: true`：页面运行时初始化后自动加载（不阻塞首屏渲染）
- 手动刷新：`reload` 动作——指定 `dataSource` 刷新该源，缺省刷新全部 `autoLoad` 源

```yaml
# 查询表单提交：setState 更新关键词 → reload 重新加载（params 拿到新值）
events:
  onSubmit:
    - action: setState
      params: { keyword: ${event.keyword} }
    - action: reload
      params: { dataSource: customers }
```

### 读取结果：`data` 与 `dataStatus`

```yaml
props:
  dataSource: ${data.customers}              # 数据本体（未加载时为 undefined）
  loading: ${dataStatus.customers.loading}   # 加载中标记
when: ${dataStatus.detail.error == null}     # 错误判定（error 为 Error 对象）
```

`dataStatus.<name>` 的结构是 `{ loading: boolean, error?: Error }`——加载中 `loading: true`；失败后 `error` 为该错误（保留旧数据）。列表 loading、详情加载态切换、错误提示都靠它。

### 选项字段映射（valueField / labelField / disabledField）

后端返回的字段名任意时，声明映射即可直接绑 Select——加载结果为数组时，每项**归一化出** `{ label, value, disabled }` 键（原字段经展开保留）：

```yaml
dataSources:
  statusOptions:
    type: http
    request: { method: GET, url: /api/status-options }
    autoLoad: true
    valueField: code        # 后端字段 → value（缺省 'value'）
    labelField: name        # 后端字段 → label（缺省 'label'）
    disabledField: off      # 该字段为真值 → 归一化 disabled: true

body:
  type: Select
  props:
    name: status
    options: ${data.statusOptions}   # [{ code, name, off, label, value, disabled }]
```

未声明任何映射字段、或加载结果不是数组时，数据原样返回不做处理。静态写死 `{ label, value }` 数组的场景不需要这三个字段。

### 完整示例：master-detail 页

左侧列表点击 → 调用接口 → 右侧展示详情（含加载态）：

```yaml
state:
  currentId: null

dataSources:
  list:
    type: service
    service: customer.list
    autoLoad: true
  detail:
    type: service
    service: customer.detail
    params:
      id: ${state.currentId}    # 点击后 reload 时取新值

body:
  type: Flex
  props: { gap: 16 }
  children:
    - type: Table               # 左：单列可点列表
      props:
        dataSource: ${data.list}
        loading: ${dataStatus.list.loading}
        columns:
          - title: 客户
            cell:
              type: Button
              props: { text: ${row.name}, variant: link }
              events:
                onClick:
                  - action: setState
                    params: { currentId: ${row.id} }
                  - action: reload
                    params: { dataSource: detail }
    - type: Alert               # 右：空态
      props: { message: 请选择左侧客户, variant: info }
      when: ${state.currentId == null}
    - type: Card                # 右：详情（loading 时换提示）
      when: ${state.currentId != null}
      props: { style: { flex: 1 } }
      children:
        - type: Alert
          props: { message: 详情加载中…, variant: info }
          when: ${dataStatus.detail.loading}
        - type: Statistic
          props: { title: 名称, value: ${data.detail.name} }
          when: ${!dataStatus.detail.loading}
```

可运行版本见 `examples/admin/src/pages/customer-detail.page.yaml`。

## actions（页面级命名动作）

顶层 `actions` 定义**可复用的命名动作**，body 中任意事件里用 `call` 动作按名引用。解决的是「同一段动作编排被多处使用」的复制粘贴问题（如工具栏按钮和每行操作里的「删除」）。

```yaml
actions:
  # 动作名 → 单个动作或动作数组
  deleteRow:
    - id: cfm                          # 命名 confirm，结果写入 actions.cfm
      action: confirm
      params:
        title: 确认删除
        content: 删除「${row.name}」后不可恢复
    - action: if                       # 取消时 actions.cfm 为 false，整段跳过
      params:
        condition: ${actions.cfm}
        then:
          - action: request
            params: { method: DELETE, url: /api/items/${row.id} }
          - action: message
            params: { type: success, text: 删除成功 }
          - action: reload
            params: { dataSource: list }

body:
  type: Button
  props: { text: 删除 }
  events:
    onClick: { action: call, params: { name: deleteRow } }   # 引用
```

**语义要点**：

- **继承调用方作用域**：定义体里的 `${row}` / `${event}` 取的是 `call` 触发处的局部作用域，和内联写法完全一致——所以行内按钮（row 作用域）和工具栏按钮可以共用一份定义
- 子动作串行执行，任一失败即中断（同 `sequence`）
- 命名动作可以互相 `call` 组合；直接或间接循环引用按深度上限（20 层）受控失败，不会爆栈
- `call` 未找到名称或缺 `name` 参数时返回受控失败（不抛出）

与 `components`（结构复用）配合使用：行为复用走 `actions` + `call`，结构复用走 `components` + `component` 引用节点。

## components（页面级命名组件）

顶层 `components` 定义**可复用的命名 UI 子树**，body 中用 `component` 字段按 key 引用。防止 DSL 嵌套过深：把深层表单、操作列等抽平到顶层定义。

```yaml
components:
  searchForm:                        # 命名子树定义（一个 DslNode）
    type: Form
    props: { layout: inline }
    children:
      - type: Input
        props: { name: keyword, label: 关键词 }
      - type: Button
        props: { text: 查询, variant: primary, submit: true }
  rowActions:
    type: Flex
    props: { gap: 8 }
    children:
      - type: Button
        props: { text: 编辑, size: small }
        events:
          onClick: { action: call, params: { name: editRow } }

body:
  type: Page
  children:
    - component: searchForm          # 引用：渲染 searchForm 子树
    - type: Table
      props:
        dataSource: ${data.list}
        columns:
          - { title: 名称, dataIndex: name }
          - title: 操作
            cell:
              component: rowActions  # 行模板内引用，${row} 逐行求值
```

**语义要点**：

- **以引用处作用域渲染**（与 `call` 一致）：Table 行模板里引用，`${row.id}` 逐行正确求值
- **引用处覆盖**：引用节点的 `props` / `events` 覆盖子树根节点同名字段；`when` / `permission` 引用处优先。常用于布局微调：

```yaml
- component: detailPanel
  props:
    style: { flex: 1 }               # 覆盖 detailPanel 根节点的 style
```

- 未定义的 key 渲染 Unsupported 占位（不抛错）；直接/间接循环引用（a → b → a）不渲染并 `console.warn`
- 引用节点是 `DslNode` 的第二种形态（`component` 与 `type` 二选一）；跨页面复用的远程片段（`resource` 加载）见设计文档第 50 节，当前版本未实现

## lifecycle（生命周期）

页面级业务语义生命周期，每个事件可配单个动作或动作数组：

```yaml
lifecycle:
  onInit:                            # 页面运行时创建后（自动）
    - action: setState
      params: { ready: true }
  onLoad:                            # 首次数据加载完成后（自动）
    - action: message
      params: { type: info, text: 数据已加载 }
  onShow: []                         # 宿主（路由）触发：页面进入可视
  onHide: []                         # 宿主触发：页面离开可视
  onDestroy: []                      # 宿主触发：页面销毁前
```

| 事件 | 触发方 | 时机 |
| --- | --- | --- |
| `onInit` | 页面运行时自动 | 创建后（与 autoLoad 数据加载并行，不互相阻塞） |
| `onLoad` | 页面运行时自动 | 首次 autoLoad 加载完成后 |
| `onReady` / `onShow` / `onHide` / `onDestroy` | 宿主（路由层） | 页面就绪 / 进入 / 离开 / 销毁 |

## 节点（DslNode）

`body`、组件的 `children`、Table 的 `cell` 行模板、Tabs 的 `items[].children`、overlay 的 `content`，都是同一棵 DslNode 树：

```yaml
- type: Button                     # 必填，组件类型名
  id: submitBtn                    # 可选，节点标识（一般省略）
  props:                           # 组件属性，值可含 ${...} 表达式
    text: 保存
    className: my-btn              # 通用 props：所有组件可用
    style: { marginLeft: 8 }       # 通用 props：根节点内联样式
  children: []                     # 子节点
  events:                          # 事件名 → 动作或动作数组
    onClick:
      - action: setState
        params: { saved: true }
  permission: customer:edit        # 组件级权限
  when: ${state.mode != 'readonly'}  # 条件渲染
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | string | 组件类型名，对应 Component Registry 注册名（内置组件见[组件目录](#组件目录)，业务可扩展）；与 `component` 二选一 |
| `component` | string | 引用节点：页面级命名组件（顶层 `components`）的 key，渲染该子树；与 `type` 二选一 |
| `id` | string | 节点标识（React key 等用途，一般省略） |
| `props` | object | 组件属性，值可含 `${...}` 表达式 |
| `children` | DslNode[] | 子节点数组 |
| `events` | EventMap | 事件名 → 动作或动作数组（数组按声明顺序**串行执行，失败不中断**——需要失败即停用 `sequence` 包裹） |
| `permission` | PermissionConfig | 组件级权限，见[权限](#权限permissionconfig) |
| `when` | 表达式 | 条件渲染：表达式为假时不渲染该节点（子树一并跳过） |

**通用 props**（所有组件一致）：`className`（根节点 class，与内置样式合并）、`style`（根节点内联样式对象，如 `{ flex: 1 }`）。Input / Select 在 Form 内时挂载到 `form-item` 容器，独立渲染时挂控件本身。

## 表达式与作用域

属性值、动作参数中的 `${...}` 由 `@pactor-app/expression` 求值——受控 AST 解析器，**禁 eval、禁全局访问**（`window` / `fetch` / `localStorage` 不可达，`__proto__` / `constructor` 隔离，成员方法调用被拒绝）。

### 两种求值形态

```yaml
props:
  count: ${state.count}              # 字符串整体恰好是一个 ${...}：保留原始类型（number）
  title: 共 ${state.count} 条        # 与其他文本混合：拼接为字符串
  note: ${state.remark}              # null / undefined 在拼接中渲染为空串
```

### 支持的语法

- 成员访问：`${state.user.name}`、`${data.list[0].name}`、计算成员 `${state.cityMap[state.region]}`
- 字面量：字符串 / 数字 / 布尔 / `null` / 数组 / 对象字面量（`${{ name: user.name }}`，常用作 `t()` 插值参数）
- 运算符：三元 `cond ? a : b`；逻辑 `&&` `||` `!`；比较 `==` `!=` `===` `!==` `<` `<=` `>` `>=`；算术 `+` `-` `*` `/` `%`
- 白名单函数调用：`${t('menu.home')}`、`${permission('customer:edit')}`（宿主可注入更多）

### 作用域链

表达式解析沿作用域链查找，内层覆盖外层同名键：

```text
global → app → page → overlay → form → component → row → event
```

### 全局作用域键

| 键 | 内容 | 示例 |
| --- | --- | --- |
| `app` | bootstrap 的 `app` 字段 | `${app.name}` |
| `user` | bootstrap 的 `user` 字段 | `${user.name}` |
| `page` | 当前页面元信息 | `${page.title}` |
| `state` | 页面状态（`setState` 更新） | `${state.keyword}` |
| `form` | `state.form` 别名（Form 提交后写入） | `${form.keyword}` |
| `data` | 各数据源的结果数据 | `${data.customers}` |
| `dataStatus` | 各数据源的 `{ loading, error }` | `${dataStatus.detail.loading}` |
| `route` | 路由上下文 | `${route.params.id}`、`${route.query.tab}` |
| `params` | `route.params` 别名；overlay 内为 overlay 注入的 params | `${params.id}` |
| `actions` | 命名动作（`id`）的执行结果 | `${actions.editResult}` |
| `locale` | 当前语言代码 | `${locale}` → `'zh-CN'` |
| `t` | 翻译函数 | `${t('menu.home')}`、`${t('welcome', { name: 'Alice' })}` |

### 局部作用域键

| 键 | 出现的上下文 |
| --- | --- |
| `event` | 事件回调参数（Input 传 string、Form 传 values、Table 分页传 pagination 信息、Button onClick 无参） |
| `row` / `rowIndex` | Table 列的 `cell` 行模板（当前行记录 / 页内序号） |
| `parent` | overlay 内容中访问父页面作用域快照（只读约定） |

### 命名动作结果（actions 键）

动作声明 `id` 后，执行结果写入 `actions.<id>` 作用域：**成功时为结果数据，失败时为 `{ ok: false, error }`**。这是分支判断的基础：

```yaml
- id: saveResult
  action: request
  params: { method: POST, url: /api/save, body: ${form} }
- action: if
  params:
    condition: ${actions.saveResult != null && actions.saveResult.ok == false}
    then:
      - action: message
        params: { type: error, text: 保存失败 }
```

注意 `actions` 键是页面级共享记录：同一页面所有事件分发读写同一份，后写入的立即可见。

## 权限（PermissionConfig）

权限码控制页面、菜单、组件、动作四个层级的可见性与可执行性。权限码来自 bootstrap 下发的 `permissions`（或宿主注入的 PermissionAdapter）。

### 三种声明形式

```yaml
permission: customer:delete                              # 单权限码
permission: [customer:delete, customer:admin]            # 数组：任一命中即放行
permission: { code: customer:delete, denied: disabled }  # 对象形式：指定无权限策略
```

`denied` 指定无权限时的处理策略，缺省 `hidden`：

| 值 | 行为 |
| --- | --- |
| `hidden` | 不渲染（缺省） |
| `disabled` | 渲染但注入 `disabled`（置灰不可点） |
| `readonly` | 渲染但注入 `readOnly`（只读） |

### 四个层级

```yaml
# 1. 页面级：无权限时路由层渲染 403 页
page:
  id: settings
  permission: system:admin

# 2. 菜单级：bootstrap 菜单项的 permission，无权限的菜单被过滤不出现
#    （由 @pactor-app/permission 的 MenuRegistry 处理，非页面 DSL 字段）

# 3. 组件级：Renderer 在渲染任何组件类型之前统一检查，所有组件（含业务自定义）都支持
- type: Button
  props: { text: 删除 }
  permission: { code: customer:delete, denied: disabled }

# 4. 动作级：无权限时动作不执行（受控失败），绕过 UI 直接触发事件也拦得住
- action: request
  params: { method: DELETE, url: /api/items }
  permission: customer:delete
```

### 表达式中的权限

`permission(code)` 表达式函数用于显隐联动等逻辑判断：

```yaml
when: ${!permission('customer:edit')}     # 无编辑权限时显示只读提示
props:
  disabled: ${!permission('customer:edit')}
```

**安全提醒**：前端权限只控制 UI 呈现与动作放行，对应的后端接口仍必须做鉴权——隐藏按钮不等于接口安全。

## 动作目录

动作是 DSL 的行为单元：事件触发、生命周期、编排动作的子项都是 `ActionConfig`。每个动作可带 `id`（命名结果）、`condition`（条件执行）、`permission`（执行权限）：

```yaml
- id: editResult            # 可选，命名动作：结果写入 actions.editResult
  action: overlay.open      # 动作名（Action Registry 注册名）
  params: { ... }           # 参数，值可含表达式
  condition: ${state.ready} # 可选，条件为假跳过执行（结果记为 skipped）
  permission: customer:edit # 可选，无权限不执行（受控失败）
```

### 运行时内置（@pactor-app/runtime，UI 无关）

| 动作 | params | 说明 |
| --- | --- | --- |
| `setState` | 任意键值 | 表达式求值后浅合并进 state |
| `resetState` | — | 重置 state 为 DSL 声明的初始值 |
| `reload` | `dataSource?` | 刷新数据源；缺省刷新全部 autoLoad 源 |
| `request` | `url`（必填）、`method?`、`params?`、`headers?`、`body?`、`target?` | 经 HttpAdapter 发请求；`target` 指定时结果写入 state 路径（`state.detail` 或 `detail`） |
| `sequence` | `actions` | 子动作串行，任一失败即中断 |
| `parallel` | `actions` | 子动作并行，全部完成返回；任一失败则整体失败 |
| `if` | `condition`、`then?`、`else?` | 条件分支（condition 为整体单表达式时保留布尔类型） |
| `call` | `name`（必填） | 执行顶层 `actions` 中的命名动作，继承调用方作用域；嵌套超 20 层（循环引用）受控失败 |
| `delay` | `ms` | 等待指定毫秒 |
| `form.setValues` | `values`（必填）、`form?`（缺省 `default`） | 表单联动：写入目标表单字段值；不触发校验与 `onValuesChange`；表单未注册时受控失败 |

**request 示例**（调用接口并写回 state）：

```yaml
- id: saveResult
  action: request
  params:
    method: POST
    url: /api/customers
    body: ${form}                  # Form 提交后的表单值
    target: detail                 # 响应写入 state.detail
```

**sequence / parallel 示例**（编排）：

```yaml
# 串行：任一失败即中断（事件数组失败不中断，需要中断语义必须用它）
- action: sequence
  params:
    actions:
      - action: request
        params: { method: DELETE, url: /api/items/${row.id} }
      - action: message
        params: { type: success, text: 已删除 }   # request 失败时不会执行

# 并行：两个独立请求同时发出，全部完成才返回
- action: parallel
  params:
    actions:
      - action: request
        params: { url: /api/profile }
      - action: request
        params: { url: /api/settings }
```

**if 示例**（条件分支，then / else 均为动作或动作数组，执行时才求值）：

```yaml
- id: cfm
  action: confirm
  params: { title: 确认提交 }
- action: if
  params:
    condition: ${actions.cfm}
    then:
      - action: request
        params: { method: POST, url: /api/submit }
    else:
      - action: message
        params: { type: info, text: 已取消 }
```

**form.setValues 示例**（表单字段值联动，如级联清空）：

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
```

### 应用层注册（@pactor-app/app / 交互 kit）

| 动作 | params | 说明 |
| --- | --- | --- |
| `navigate` | `to`（必填） | 经路由桥接跳转（react-router push） |
| `message` | `text`、`type?`（success / error / warning / info，缺省 info） | 全局提示 |
| `confirm` | `title?`、`content?` | 确认弹窗；结果 data：确认 `true` / 取消 `false`（取消**不是**失败，需命名后经 `if` 分支判断） |
| `overlay.open` | `overlay`（见下） | 打开弹层并等待关闭；结果 data 为 close 的 payload |
| `overlay.close` | `id?`、`payload?` | 关闭弹层（缺省栈顶）；payload 缺省为取消语义 |

**confirm + 请求 + 成功/失败提示**（完整链路）：

```yaml
events:
  onClick:
    - id: cfm
      action: confirm
      params:
        title: 确认删除
        content: 此操作不可恢复
    - action: if
      params:
        condition: ${actions.cfm}
        then:
          - id: del
            action: sequence
            params:
              actions:
                - action: request
                  params: { method: DELETE, url: /api/items/${row.id} }
                - action: message
                  params: { type: success, text: 删除成功 }
          - action: if
            params:
              condition: ${actions.del != null && actions.del.ok == false}
              then:
                - action: message
                  params: { type: error, text: 删除失败，请稍后重试 }
```

**navigate 示例**：

```yaml
- action: navigate
  params:
    to: /customers/${row.id}/edit    # 路径支持表达式插值
```

### overlay.open 的 overlay 配置

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `modal` \| `drawer`（必填） | 弹层类型 |
| `title` | string | 标题 |
| `width` | number \| string | 宽度 |
| `content` | DslNode | 内联 DSL 内容（与 `page` 二选一） |
| `page` | `{ pageId }` | 动态页面引用（与 `content` 二选一） |
| `params` | object | 注入 overlay 内容作用域的 `params` 键 |

overlay 内容的表达式以 overlay 作用域求值（`${params.x}` 取注入参数，`${parent.x}` 取父页面作用域快照）；绑定 state / data 的表达式随 store 变化自动重渲染。关闭时 `overlay.close` 的 payload 作为 `overlay.open` 的结果 data 返回（命名后 `${actions.xxx}` 读取）：

```yaml
- id: editResult
  action: overlay.open
  params:
    overlay:
      type: drawer
      title: 编辑客户
      width: 420
      params: { id: ${row.id} }        # overlay 内 ${params.id} 可读
      content:
        type: Form
        children: [...]
- action: if                          # 提交关闭（payload.success）后才刷新
  params:
    condition: ${actions.editResult.success}
    then:
      - action: reload
```

## 组件目录

内置组件（shadcn 实现，@pactor-app/ui）+ @pactor-app/markdown 注册的 Markdown。业务组件注册见[自定义组件](/guides/custom-components/)。

通用 props（所有组件一致）：`className`（根节点 class，与内置样式合并）、`style`（根节点内联样式对象，如 `{ flex: 1 }`）、`permission`、`when`、`events`。下表只列各组件特有 props。

### Page

页面容器。内容区 children 纵向间距 20px。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 页面标题 |

### Grid

均分栏布局（CSS grid，列宽 `minmax(0, 1fr)`）。

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
| `loading` | boolean | 加载态（可绑 `${dataStatus.x.loading}`，loading 时禁用点击） |
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
| `loading` | boolean | 加载态（可绑 `${dataStatus.x.loading}`） |
| `pagination` | `false` \| `{ pageSize? }` | 分页配置 |
| 事件 `onChange` | — | 分页变化，传出 `{ current, pageSize, total }` |

TableColumn：`title`、`dataIndex`、`width`、`cell`（DslNode 行模板，作用域注入 `row` / `rowIndex`——行内按钮的显隐禁用与动作参数都经 `${row.xxx}` 表达，见 [state 与表达式](#表达式与作用域)）。

### Form

| prop | 类型 | 说明 |
| --- | --- | --- |
| `name` | string（默认 `'default'`） | 表单名，`form.setValues` 联动动作按名寻址；同页多表单（如页面表单 + 抽屉表单）需显式命名避免重复注册 |
| `layout` | `vertical`（默认）\| `horizontal` \| `inline` | 表单布局 |
| `initialValues` | object | 表单初始值（字段级 `value` 优先于此处的同名字段） |
| 事件 `onSubmit` | — | 校验通过后触发，`event` 为表单 values，同时写入 `${form.<field>}` |
| 事件 `onValuesChange` | — | 字段变化，`event` 为变化字段单键对象 `{ <field>: <newValue> }` |

Form 内声明 `name` 的 Input / Select 自动成为表单项（label / rules 生效，值由 Form 托管）。

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
| `options` | `{ label, value, disabled? }[]`（value: string \| number \| boolean） | 选项列表；`disabled: true` 的选项不可选；远程任意字段名经 dataSource 的 `valueField` / `labelField` / `disabledField` 映射 |
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

### Layout / Header / Sider / Content / Footer

页面级布局组件（spec: layout-components），可在 `body` 中自由组合页面结构。**与外壳布局的关系**：应用级外壳（菜单/品牌/页签）继续由 bootstrap `layout.type` 承担；页面需要完全自控结构时外壳用 `blank`，body 以 `Layout` 起手组合——两者混用（admin 外壳里再套 Layout+Sider）通常意味着设计问题。

`Layout`：flex 容器；直接子节点含 `Sider` 时横向、否则纵向（`component` 引用的 Sider 子树同样计入推导），`direction` 显式覆盖。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `direction` | `horizontal` \| `vertical` | 主轴方向（缺省按子节点推导） |

`Header`：顶部区域（横向 flex、垂直居中、下边框）。`Content`：主内容区（`flex: 1`）。`Footer`：底部区域（居中弱化文本）。三者均为纯语义容器，无特有 props。

`Sider`：侧边区域，折叠为受控闭环。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `width` | number（默认 200） | 展开宽度 |
| `collapsible` | boolean | 渲染底部折叠触发器 |
| `collapsed` | boolean | 受控折叠态（绑 `${state.x}`） |
| `collapsedWidth` | number（默认 64） | 折叠后宽度 |
| 事件 `onCollapse` | — | 折叠触发器点击，传出 boolean |

### Menu

导航菜单（哑渲染：items 经表达式注入，不读外壳层 MenuRegistry）。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `items` | `{ key, label, icon?, children? }[]` | 菜单树（如 `${data.menus}`；`icon` 为预留字段，当前不渲染） |
| `mode` | `inline`（默认）\| `horizontal` | inline 用于 Sider，horizontal 用于 Header |
| `selectedKey` | string | 受控选中项 |
| 事件 `onSelect` | — | 点选传出 key（典型接 `navigate` 或 `setState`） |

自由组合示例（见 `examples/admin/src/pages/layout-demo.page.yaml`）：

```yaml
body:
  type: Layout                   # 含 Sider 子节点 → 自动横向
  children:
    - type: Sider
      props:
        collapsible: true
        collapsed: ${state.siderCollapsed}
      events:
        onCollapse:
          - action: setState
            params: { siderCollapsed: ${event} }
      children:
        - type: Menu
          props:
            items: ${data.menus}
            selectedKey: ${state.currentMenu}
          events:
            onSelect:
              - action: setState
                params: { currentMenu: ${event} }
    - type: Layout               # 无 Sider → 纵向
      children:
        - type: Header
          children: [...]
        - type: Content
          children: [...]
        - type: Footer
          children: [...]
```


### Link

原生锚点链接（嵌入模式的主要跳转方式，见[两种使用形态](/guides/getting-started/#两种使用形态)）。

| prop | 类型 | 说明 |
| --- | --- | --- |
| `href` | string | 链接地址（可含表达式插值，如 `/items/${row.id}`） |
| `text` | string | 链接文本（也可用 children） |
| `target` | `_self`（默认）\| `_blank` \| `_parent` \| `_top` | 打开方式；`_blank` 自动带 `rel="noreferrer"` |

## 完整示例

参考示例工程页面：

- 登录页：`examples/admin/src/pages/login.page.yaml`（Form 校验、`type: password`、命名动作 + `if` 分支、loading 绑定）
- 列表页：`examples/admin/src/pages/customer-list.page.yaml`（service 数据源、cell 行模板、overlay.open 抽屉、权限禁用）
- master-detail 页：`examples/admin/src/pages/customer-detail.page.yaml`（点击列表项 → reload 详情、`dataStatus` loading 态切换、`components` + `component` 引用、`meta` / `page.name` / `page.description`）
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
