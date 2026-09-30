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
        status: ${state.statusChip}
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
    # 筛选区：ChipFilter 快筛（一族一个 state），变化即 setState + reload
    - type: Card
      children:
        - type: Flex
          props: { align: center, gap: small }
          children:
            - type: Text
              props: { text: 状态, strong: true }
            - type: ChipFilter
              props:
                mode: single
                value: ${state.statusChip}
                items: ${data.list.filters.status}   # 选项也可由接口下发
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

- 搜索框、快筛、标签多选各自绑定一个 state，onChange 闭环 `setState` + `reload dataSource`
- 「新建」按钮 → `router.push` 到新增页；操作列「编辑/删除」→ 跳转或弹窗 + 确认
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
- 新增/编辑共用一页时按 `${route.params.code}` 是否存在区分（`if` 动作分支）
- 取消按钮 → `router.back` 或返回列表页

## 通用约定

- 页面 id kebab-case，与 sitemap.yaml 注册一致；文件按模块分目录存放 `src/server/yaml/<模块>/{{kebab-id}}.yaml`（见 project-structure.md）
- 表达式：`${state.x}` / `${data.x}` / `${route.params.x}` / `${event}`；支持 `.length`、比较、`&&`/`||`、三元
- 任何「点击后请求并刷新」的交互都是同一闭环：`setState`（可选）→ http/service 调用 → `reload dataSource` / `router.push`
