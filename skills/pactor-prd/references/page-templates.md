# 页面 YAML 模板

常用页面模板。占位符：`{{kebab-id}}` 页面 id、`{{页面标题}}`、`{{模块名}}`、`{{resource}}` 数据接口名（单段，见 data-api.md）、`{{实体名}}` 业务实体中文名。DSL 语法细节以 `pactor-dsl` skill 与 packages/ui 当前导出为准。

**数据列表页（搜索 + 表格 + 新建/编辑）默认套用「数据列表标准模型」**；仅当新建/编辑是独立路由表单页时才用轻量变体。

## 数据列表标准模型（搜索 Form + 表格 + 抽屉新建/编辑）

从成熟实现提取的完整闭环：搜索过滤、新建/编辑共用抽屉表单（分区 + 条件显隐 + 预填）、操作列 link 按钮。**完整可拷贝的骨架文件：`template/src/server/yaml/models/data-list.yaml`**（已注册进模板 sitemap 的可运行示例，菜单「页面骨架 / 数据列表」直接预览；复制后替换页面信息、字段、接口名与文案即可）。结构照抄，字段按线框图替换：

```yaml
dsl: "1.0"
page:
  id: {{kebab-id}}
  title: {{页面标题}}
  name: {{camelName}}
state:
  # 搜索条件镜像：Form submit 后写入，驱动列表请求参数
  keyword: ""
  status: all
  editingId: ""
  # 表单条件显隐镜像（onValuesChange 写入；按线框图需要增减，可多个）
  fType: ""
dataSources:
  list:
    type: http
    autoLoad: true
    request:
      method: GET
      url: /api/d/{{resource}}
      params:
        keyword: ${state.keyword}
        status: ${state.status}
  editing:                      # 编辑预填；autoLoad: false，打开抽屉前手动 reload
    type: http
    autoLoad: false
    request:
      method: GET
      url: /api/d/{{resource}}/${state.editingId}
body:
  type: Page
  children:
    - type: Breadcrumb
      props:
        items:
          - label: {{模块名}}
          - label: {{页面标题}}
    # 标题行：左标题 + 副标题，右新建按钮
    - type: Flex
      props:
        justify: space-between
        align: center
      children:
        - type: Flex
          props:
            direction: vertical
            gap: 2
          children:
            - type: Typography
              props:
                variant: h3
                text: {{页面标题}}
            - type: Typography
              props:
                variant: muted
                text: {{页面副标题（取自线框图说明文字）}}
        - type: Button
          props:
            text: + 新建{{实体名}}
            variant: primary
          events:
            onClick:
              - action: setState           # 清空编辑态与显隐镜像
                params:
                  editingId: ""
                  fType: ""
              - action: reload             # 清空 editing 数据（${state.editingId} 为空 → 接口返回空对象）
                params:
                  dataSource: editing
              - action: overlay.open       # 锚点 &entityDrawer 在此定义，表格行内用 *entityDrawer 引用
                params:
                  overlay: &entityDrawer
                    type: drawer
                    title: "${state.editingId == '' ? '新建{{实体名}}' : '编辑{{实体名}}'}"
                    width: 720
                    content:
                      type: Form
                      props:
                        name: entityForm
                        layout: vertical
                        initialValues: ${data.editing}
                      events:
                        # 条件显隐字段镜像到 state（其他字段变化时保持原值）
                        onValuesChange:
                          - action: setState
                            params:
                              fType: "${event.type != null ? event.type : state.fType}"
                        onSubmit:
                          - action: request
                            params:
                              method: POST
                              url: /api/d/ops/{{resource}}-save
                              body:
                                id: ${state.editingId}
                                name: ${event.name}
                                # ... 其余字段照抄 event
                          - action: message
                            params:
                              messageType: success
                              text: 已保存（演示）
                          - action: overlay.close
                      children:
                        # 分区结构：标题 → 分割线 → 字段组（不用 Card）
                        - type: Flex
                          props:
                            direction: vertical
                            gap: middle
                          children:
                            - type: Text
                              props:
                                text: 基本信息
                                strong: true
                            - type: Separator
                            - type: Flex
                              props:
                                direction: vertical
                                gap: small
                              children:
                                - type: Field
                                  props:
                                    label: 名称
                                    required: true
                                  children:
                                    - type: Input
                                      props:
                                        name: name
                                        rules:
                                          - required: true
                                            message: 请输入名称
                                # 成对字段用 Grid 两列
                                - type: Grid
                                  props:
                                    columns: 2
                                    gap: 16
                                  children:
                                    - type: Field
                                      props:
                                        label: 类型
                                        required: true
                                      children:
                                        - type: Select
                                          props:
                                            name: type
                                            placeholder: 请选择类型
                                            options: ${data.list.filters.type}
                                            rules:
                                              - required: true
                                                message: 请选择类型
                                    - type: Field
                                      props:
                                        label: 排序
                                      children:
                                        - type: NumberInput
                                          props:
                                            name: sort
                                            className: w-full
                                            min: 0
                                            precision: 0
                                # 条件显隐字段：依赖镜像 state
                                - when: ${state.fType == 'XXX'}
                                  type: Field
                                  props:
                                    label: 条件字段
                                  children:
                                    - type: Input
                                      props:
                                        name: extra
                                # 编辑时禁用关键字段
                                - type: Field
                                  props:
                                    label: 编码
                                    required: true
                                  children:
                                    - type: Input
                                      props:
                                        name: code
                                        disabled: ${state.editingId != ''}
                                        rules:
                                          - required: true
                                            message: 请输入编码
                        # 底部按钮：取消关抽屉，保存触发 Form onSubmit
                        - type: Flex
                          props:
                            justify: end
                            gap: small
                            className: mt-4
                          children:
                            - type: Button
                              props:
                                text: 取消
                              events:
                                onClick:
                                  - action: overlay.close
                            - type: Button
                              props:
                                text: 保存
                                variant: primary
                                submit: true
                                htmlType: submit
              - action: reload             # overlay.open 阻塞到关闭，关闭后刷新列表
                params:
                  dataSource: list
    # 搜索栏：Form(layout: inline) + Field 包裹控件
    - type: Card
      children:
        - type: Form
          props:
            name: search
            layout: inline
          events:
            onSubmit:
              - action: setState
                params:
                  keyword: ${event.keyword}
                  status: ${event.status}
              - action: reload
                params:
                  dataSource: list
          children:
            - type: Field
              props:
                label: 编码/名称
              children:
                - type: Input
                  props:
                    name: keyword
                    placeholder: 支持模糊查询
            - type: Field
              props:
                label: 状态
              children:
                - type: Select
                  props:
                    name: status
                    placeholder: 请选择状态
                    options: ${data.list.filters.status}   # 选项由接口下发
            # 按钮也放进 Field：label 用不间断空格（U+00A0）占位，与左侧控件底部对齐
            - type: Field
              props:
                label: " "
              children:
                - type: Flex
                  props:
                    gap: small
                    align: center
                  children:
                    - type: Button
                      props:
                        text: 查询
                        submit: true
                        htmlType: submit
                    - type: Button
                      props:
                        text: 重置
                      events:
                        onClick:
                          - action: form.setValues
                            params:
                              form: search
                              values:
                                keyword: ""
                                status: all
                          - action: setState
                            params:
                              keyword: ""
                              status: all
                          - action: reload
                            params:
                              dataSource: list
        # 表格：名称列/操作列按钮统一 variant: link size: small
        - type: Table
          props:
            dataSource: ${data.list.items}
            rowKey: id
            pagination: false
            className: mt-4
            columns:
              - title: 名称
                cell:
                  type: Button
                  props:
                    text: ${row.name}
                    variant: link
                    size: small
                  events:
                    onClick: &editRow      # 行点击 = 编辑，锚点在此定义
                      - action: setState   # 写入编辑 id + 显隐镜像（取自行数据）
                        params:
                          editingId: ${row.id}
                          fType: ${row.type}
                      - action: reload
                        params:
                          dataSource: editing
                      - action: overlay.open
                        params:
                          overlay: *entityDrawer
                      - action: reload
                        params:
                          dataSource: list
              - title: 编码
                dataIndex: code
              - title: 状态
                dataIndex: status
              - title: 操作
                cell:
                  type: Button
                  props:
                    text: 编辑
                    variant: link
                    size: small
                  events:
                    onClick: *editRow      # 与名称列同一动作
        - type: Text
          props:
            text: 共 ${data.list.total} 条
            type: secondary
            className: mt-3
```

要点：

- **新建/编辑共用同一抽屉**：YAML 锚点 `&entityDrawer` 在「新建」按钮的 `overlay.open` 中定义（必须先出现），表格行内 `*entityDrawer` 引用；`title` 用 `${state.editingId == '' ? ... }` 三元切换；唯一区别是编辑以 `initialValues: ${data.editing}` 预填
- **抽屉宽度 720**（`overlay.open type: drawer` 的 `width` 生效）；抽屉内分区**不用 Card**：`Text(strong) 标题 → Separator → 字段组`，多个分区重复此结构
- **搜索栏按钮对齐**：查询/重置放进 `Field`，其 `label` 用不间断空格 U+00A0（直接敲 `" "` 普通空格可能被压缩），与左侧控件基线对齐
- **Form 不能嵌套**（渲染原生 `<form>`，submit 冒泡）：抽屉内只用一个 Form；主从多值（如字典项）的子项编辑在**同一 Form** 内做「子 Table + 行下展开表单」，`onSubmit` 用 `if` 动作按 state 分流提交目标（子项保存走独立 ops 接口 + `reload editing`）；表达式不支持数组方法/箭头函数，子项草稿必须走服务端接口不能前端拼
- **编辑预填链路**：`setState(editingId + 显隐镜像)` → `reload editing` → `overlay.open`；镜像值取自行数据（`${row.type}`），不要等 editing 接口
- **overlay.open 阻塞到关闭**，关闭后 `reload list`；新建按钮同理（先重置 state 再 reload editing 清空）
- **条件显隐**：`onValuesChange` 把字段值镜像到 state（`"${event.x != null ? event.x : state.x}"` 保持其他字段变化时原值），再用 `when` 控制显隐；编辑时关键字段 `disabled: ${state.editingId != ''}`
- 空 `editingId` 时后端 detail 接口须返回空对象而非 404（转发层本身对 404 也回退空对象，但真实后端仍建议遵守该约定）

## 登录页（Login 业务组件）

登录页一律用 DSL `type: Login` 业务组件，禁止手写 Card+Form+自定义 CSS。**样板即模板工程的 `template/src/server/yaml/common/login.yaml`**（可直接运行预览），核心结构：

```yaml
body:
  type: Login
  props:
    layout: split            # split(默认) / centered / brand-card / overlap / backdrop
    authVariant: card        # 认证区容器：plain 裸表单 / card 常规卡片 / float 大悬浮卡片
    brand:                   # 品牌区（文案取自 PRD；illustration 缺省内置插画，传 "" 隐藏）
      name: {{产品名}}
      title: {{品牌主标题}}
      description: {{品牌说明}}
    title: 登录
    subtitle: {{副标题}}
    submitText: 登 录
    # registerLink / forgotLink / footer 按需添加（href 跳转或 onRegisterClick/onForgotClick 事件）
  events:
    onSubmit:                # values 经 ${event.username} / ${event.password} 读取
      - id: loginResult
        action: request
        params:
          method: POST
          url: {{登录接口地址}}
          body: { username: ${event.username}, password: ${event.password} }
      - action: if
        params:
          condition: ${actions.loginResult == null || actions.loginResult.token == null}
          then:
            - action: message
              params: { messageType: error, text: 用户名或密码错误 }
      - action: if
        params:
          condition: ${actions.loginResult != null && actions.loginResult.token != null}
          then:
            - action: app.reload
              params: { to: / }
```

要点：

- **布局是产品决策**：原型未明确布局时必须向用户提问（5 种 `layout` + `brandSide`/`brandRatio`/`authVariant` 等修饰），用户不答默认 `split` + `card`；原型可判定则不提问
- 页面布局（sitemap `layouts`）用纯 PageOutlet 外壳（模板为 `login` 布局），组件自带整页渐变、背景装饰与品牌面板，不要再套自定义背景容器
- 可配置项权威定义见 `openspec/specs/ui-login-component` 与组件源码（`packages/ui/src/components/business/Login/`）；未配置的可选元素不渲染
- 校验失败由组件内部 Form rules 就地提示；登录失败/成功分支在 DSL 动作链用 `if` + `message` 实现

## 列表页（轻量变体：新建/编辑跳独立表单页）

```yaml
dsl: "1.0"
page:
  id: {{kebab-id}}
  title: {{页面标题}}
  name: {{camelName}}
  description: {{模块名}} / {{页面标题}}
state:
  keyword: ""
  status: ""
  statusChip: all
dataSources:
  list:
    type: http
    autoLoad: true
    request:
      method: GET
      url: /api/d/{{resource}}
      params:
        keyword: ${state.keyword}
        status: ${state.status}
body:
  type: Page
  children:
    - type: Breadcrumb
      props:
        items:
          - label: {{模块名}}
          - label: {{页面标题}}
    - type: Flex
      props: { align: baseline, gap: middle }
      children:
        - type: Typography
          props: { variant: h3, text: {{页面标题}} }
        - type: Typography
          props: { variant: muted, text: 页面副标题（取自线框图说明文字） }
    # 搜索栏：Form(layout: inline) 包裹，字段 name 绑定；查询 submit: true，重置 form.setValues
    - type: Card
      children:
        - type: Form
          props: { name: filter, layout: inline }
          children:
            - type: Input
              props: { name: keyword, placeholder: 搜索关键词 }
            - type: Select
              props:
                name: status
                placeholder: 状态
                options: ${data.list.filters.status}   # 选项也可由接口下发
                allowClear: true
            - type: Button
              props: { text: 查询, variant: primary, submit: true }
            - type: Button
              props: { text: 重置 }
              events:
                onClick:
                  - action: form.setValues
                    params: { form: filter, values: { keyword: "", status: "" } }
                  - action: setState
                    params: { keyword: "", status: "" }
                  - action: reload
                    params: { dataSource: list }
          events:
            onSubmit:
              - action: setState
                params:
                  keyword: ${event.keyword}
                  status: ${event.status}
              - action: reload
                params: { dataSource: list }
    # 即点即生效的快筛行（ChipFilter）不是表单，可独立于 Form 之外绑 state
    - type: Flex
      props: { align: center, gap: small }
      children:
        - type: Text
          props: { text: 状态, strong: true }
        - type: ChipFilter
          props:
            mode: single
            value: ${state.statusChip}
            items: ${data.list.filters.status}
          events:
            onChange:
              - action: setState
                params: { statusChip: ${event} }
              - action: reload
                params: { dataSource: list }
    # 列表主体：表格（或卡片网格，见 component-mapping.md）
    - type: Table
      props:
        columns: ${data.list.columns}
        dataSource: ${data.list.items}
      events:
        onRowClick:
          - action: router.push
            params: { path: "/{{resource}}/${event.code}" }
```

要点：

- 搜索栏（关键词 + 下拉筛选 + 查询/重置）走 `Form layout: inline`：字段 `name` 绑定，查询按钮 `submit: true`，`onSubmit` 中 `setState` + `reload`；重置 = `form.setValues` 清空 + `setState` 复位 + `reload`
- 即点即生效的筛选（ChipFilter 快筛行）没有提交语义，不是表单，仍可独立绑 state、onChange 即 reload
- 表格操作列按钮样式统一 `Button variant: link`（编辑/删除/详情等），不混用 text/default 或 TextLink
- 「新建」→ `router.push` 到表单页（或弹窗表单）；操作列「编辑」与「新建」指向**同一个表单**（同一路由页或同一弹窗），唯一区别是编辑以行数据预填：路由页用 `initialValues: ${data.detail}`，弹窗/内嵌面板用 `form.setValues` 写入行数据
- 空态、加载态不手写，组件内置；但线框图有空态文案时用 props 覆盖

## 详情页（面包屑 + 描述列表 + Tab/分区）

```yaml
dsl: "1.0"
page:
  id: {{kebab-id}}
  title: {{页面标题}}
  name: {{camelName}}
dataSources:
  detail:
    type: http
    autoLoad: true
    request:
      method: GET
      url: /api/d/{{resource}}/${route.params.code}   # 路径参数经 route 注入
body:
  type: Page
  children:
    - type: Breadcrumb
      props:
        items:
          - label: {{模块名}}
          - { label: {{列表页标题}}, href: /{{resource}} }
          - label: ${data.detail.name}
    - type: Descriptions
      props:
        title: 基本信息
        items: ${data.detail.fields}
    # 线框图为 Tab 时用 Tabs；为纵向分区时用多个 Card + Descriptions 顺序排布
    - type: Tabs
      props:
        items:
          - { key: overview, label: 概览 }
          - { key: changes, label: 变更记录 }
      children: []   # 各 Tab 内容按线框图分区填充
```

要点：

- 路径参数（`/projects/:code`）经 `${route.params.code}` 拼进 url
- 头部操作（启用/停用、编辑、删除）按线框图摆放在标题行右侧，点击后确认弹窗 + 操作成功 message + reload

## 表单页（新增/编辑：校验 + 提交闭环）

```yaml
dsl: "1.0"
page:
  id: {{kebab-id}}
  title: {{页面标题}}
  name: {{camelName}}
state:
  submitting: false
dataSources:
  detail:   # 编辑页预填；新增页删除本数据源
    type: http
    autoLoad: true
    request:
      method: GET
      url: /api/d/{{resource}}/${route.params.code}
body:
  type: Page
  children:
    - type: Breadcrumb
      props:
        items:
          - label: {{模块名}}
          - { label: {{列表页标题}}, href: /{{resource}} }
          - label: {{页面标题}}
    - type: Form
      props:
        initialValues: ${data.detail}   # 新增页省略
      children:
        # 字段按线框图分区；required / 校验规则照抄线框图字段说明
        # 字段一律用 Field 包裹：label / 必填星号(required) / 行右提示(labelHint) 由 Field 渲染，
        # 校验仍在控件的 rules 上；不要把 label/required 直接挂在 Input/Select 上
        - type: Field
          props: { label: 名称, required: true }
          children:
            - type: Input
              props:
                name: name
                rules:
                  - { required: true, message: 请输入名称 }
      events:
        onSubmit:
          - action: setState
            params: { submitting: true }
          - action: http.post            # 指向 /api/d/{{resource}}（无后端时转发层返回 { ok: true }）
            params:
              url: /api/d/{{resource}}
              body: ${event}
          - action: message
            params: { messageType: success, text: 保存成功 }
          - action: router.push
            params: { path: /{{resource}} }
```

要点：

- 提交中禁用按钮（`submitting` state），失败分支 `messageType: error` 提示
- 新增/编辑**共用同一表单**（同一路由页或同一弹窗），按 `${route.params.code}` 是否存在区分（`if` 动作分支）；编辑仅比新建多一步预填：`initialValues: ${data.detail}`
- 取消按钮 → `router.back` 或返回列表页

## 内嵌表单面板（列表/树旁的编辑表单、弹窗/抽屉表单）

凡「字段 + 校验 + 提交」结构（如树右侧的配置面板、行编辑弹窗）一律 `Form` 包裹，不要散放 `Input` + `setState` 攒草稿：

```yaml
- type: Card
  props: { title: {{面板标题}} }
  children:
    - type: Form
      props:
        name: edit            # 多表单共存时命名，form.setValues 按名寻址
      children:
        - type: Field
          props: { label: 名称, required: true }
          children:
            - type: Input
              props:
                name: name
                rules:
                  - { required: true, message: 请输入名称 }
        - type: Field
          props: { label: 类型 }
          children:
            - type: RadioGroup
              props:
                name: type
                options:
                  - { label: 目录, value: DIRECTORY }
                  - { label: 页面, value: PAGE }
        # 条件字段显隐依赖其他字段的实时值：经 onValuesChange 镜像到 state 后用 when
        - type: Field
          when: ${state.fType == 'PAGE'}
          props: { label: 页面入口, required: true }
          children:
            - type: Select
              props:
                name: pageEntry
                options: ${data.pages}
                rules:
                  - { required: true, message: 页面入口必选 }
        - type: Flex
          props: { justify: end, gap: middle }
          children:
            - type: Button
              props: { text: 取消 }
              events:
                onClick:
                  - action: form.setValues    # 重置为初始/空值
                    params: { form: edit, values: { name: "", type: DIRECTORY } }
            - type: Button
              props: { text: 保存, variant: primary, submit: true }
      events:
        onValuesChange:         # event 为本次变化的字段集；镜像到 state 供 when 条件显隐（其他字段变化时保持原值）
          - action: setState
            params: { fType: "${event.type != null ? event.type : state.fType}" }
        onSubmit:               # 仅在校验通过后触发，values 经 ${event.<field>} 读取
          - action: message
            params: { messageType: success, text: 已保存 }
          - action: reload
            params: { dataSource: list }
```

要点：

- 点击列表行 / 树节点回填表单：`onClick` 里用 `form.setValues` 动作（`params: { form: <表单名>, values: {...} }`），不要把字段 `value` 绑到 `${state.x}` 再用 setState 同步
- 校验交给字段 `rules`，提交按钮 `submit: true`；校验失败由 Form 就地展示错误，不再写 `if` + `message` 手工校验链
- 提交参数是整表 values：`${event}` 或 `${event.<field>}`；提交成功后 values 也可经 `${form.<field>}` 读取

## 通用约定

- 页面 id kebab-case，与 sitemap.yaml 注册一致；文件按模块分目录存放 `src/server/yaml/<模块>/{{kebab-id}}.yaml`（见 project-structure.md）
- 表达式：`${state.x}` / `${data.x}` / `${route.params.x}` / `${event}`；支持 `.length`、比较、`&&`/`||`、三元
- 任何「点击后请求并刷新」的交互都是同一闭环：`setState`（可选）→ http/service 调用 → `reload dataSource` / `router.push`
