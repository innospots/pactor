# 页面 YAML 模板

三类常用页面模板。占位符：`{{kebab-id}}` 页面 id、`{{页面标题}}`、`{{模块名}}`、`{{resource}}` 数据接口名（单段，见 mock-data-routes.md）。DSL 语法细节以 pactor skill 与 packages/ui 当前导出为准。

## 列表页（筛选 + 表格/卡片 + 操作列）

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
      url: /api/data/{{resource}}
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
      url: /api/data/{{resource}}/${route.params.code}   # 路径参数经 route 注入
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
      url: /api/data/{{resource}}/${route.params.code}
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
        - type: Input
          props: { name: name, label: 名称, required: true }
      events:
        onSubmit:
          - action: setState
            params: { submitting: true }
          - action: http.post            # mock 阶段可指向 /api/data/{{resource}}
            params:
              url: /api/data/{{resource}}
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
        - type: Input
          props:
            name: name
            label: 名称
            rules:
              - { required: true, message: 请输入名称 }
        - type: RadioGroup
          props:
            name: type
            label: 类型
            options:
              - { label: 目录, value: DIRECTORY }
              - { label: 页面, value: PAGE }
        # 条件字段显隐依赖其他字段的实时值：经 onValuesChange 镜像到 state 后用 when
        - type: Select
          when: ${state.fType == 'PAGE'}
          props:
            name: pageEntry
            label: 页面入口
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
