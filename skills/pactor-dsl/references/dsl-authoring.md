# Pactor DSL Authoring Reference

Read this before writing or editing any Pactor DSL file (`*.page.yaml`). It defines the complete page grammar, data sources, expressions, events/actions, and battle-tested recipes. Everything here matches `@pactor-app/schema` (validation) and `@pactor-app/runtime` (execution).

A DSL file is data, never code: no functions, no arbitrary JavaScript — only declared state, data sources, component trees, events, and actions.

Pair this reference with:

- `references/page-blueprints.md` for complete page structures and the R1–R13 delivery checklist.
- `references/component-contracts.md` for exact high-frequency props, events, slots, form behavior, overlays, blocks, charts, and chat.
- `references/component-catalog.md` for every registered DSL type, package registration, purpose, and online documentation link.
- `references/page-catalog-and-layout.md` when adding routes, menus, or global layouts.
- `references/examples/index.md` for complete page baselines, data contracts, host registration, and route/layout mapping.
- `references/examples/search-list.page.yaml` for the production search/list baseline covering filters, server pagination, table cells, async states, permissions, retry, confirm, and feedback.

## 1. Page skeleton (PageDsl)

Every page file has this top-level shape. Only `dsl`, `page`, and a UI root (`body` or root-level `children`) matter for simple pages; everything else is optional.

```yaml
dsl: '1.0'                    # REQUIRED. DSL spec version, currently always '1.0'
page:                         # REQUIRED. Page meta
  id: customer-list           # REQUIRED. Globally unique; menus and overlays address pages by it
  title: Customer List         # shown in layout tab / breadcrumb / browser title
  # name: customerList        # programmatic name (optional)
  # description: ...          # read by tooling, not the runtime
  # type: list                # page pattern hint (list / detail / form ...)
  # permission: customer:view # page-level guard; denied users get a 403 page
meta:                         # optional free-form metadata, runtime ignores it
  version: '1.0'
state:                        # optional, reactive page state (initial values)
  keyword: ''
  pageSize: 20
dataSources:                  # optional, named data sources → ${data.<name>}
  customers:
    type: service
    service: customer.list
    autoLoad: true
actions:                      # optional, reusable named actions (invoked via `call`)
  deleteRow: [...]
components:                   # optional, reusable named subtrees (referenced via `component:`)
  searchForm: { type: Form, children: [...] }
lifecycle:                    # optional, page lifecycle hooks
  onInit:
    - action: setState
      params: { ready: true }
body:                         # UI tree root — a single DslNode (conventionally `type: Page`)
  type: Page
  props: { title: Customer List }
  children: [...]
# children: [...]             # alternative root: node array, used when `body` is absent
                              # (describes a page fragment without a Page wrapper)
```

Rules:

- `body` wins over root-level `children` when both exist.
- Top-level `actions` = behavior reuse (called with `{ action: call, params: { name } }`, inherits caller scope incl. `row`/`event`). Top-level `components` = structure reuse (referenced with `component: <key>`; the referencing node's `props`/`events` override the subtree root's).
- `lifecycle`: `onInit` (runtime created) and `onLoad` (first autoLoad finished) fire automatically; `onReady`/`onShow`/`onHide`/`onDestroy` are fired by the host router.

## 2. DslNode (the UI tree node)

`body`, every `children` array, Table column `cell` templates, Tabs `items[].children`, and overlay `content` are all the same DslNode tree:

```yaml
- type: Button                      # component type from the Component Registry (or `component: <key>` to reference a named subtree — the two are mutually exclusive)
  id: submitBtn                     # optional node id, usually omitted
  props:                            # component props; any value may contain ${...} expressions
    text: Save
    className: my-btn               # universal prop: root class, merged with built-in styles
    style: { marginLeft: 8 }        # universal prop: root inline style object
  children: []                      # DslNode array (or a dynamic source ref, advanced)
  events:                           # event name → single action OR action array (serial, a failure does NOT stop the rest — wrap in `sequence` for fail-stop)
    onClick:
      - action: setState
        params: { saved: true }
  permission: customer:edit         # node-level guard (see §7)
  when: ${state.mode != 'readonly'} # conditional render; false → node and subtree skipped
```

Component types come from the registry. Check `references/component-catalog.md` before using a type; never infer a component name from a design document. Unknown types render an "Unsupported" placeholder. In particular, `Chart` is not a type (use `LineChart` / `PieChart` / …), and the docs label `Splitter` maps to DSL type `Resizable`.

## 3. state

Reactive page state. Declare initial values under `state:`, read via `${state.x}`, update ONLY via actions (`setState` shallow-merges; `resetState` restores declared initials). Any update re-renders everything that references it — you never touch components directly.

Controlled-loop pattern (the fundamental interaction idiom):

```yaml
- type: Input
  props:
    value: ${state.keyword}          # state → UI
  events:
    onChange:
      - action: setState             # UI → state (event carries the new string)
        params: { keyword: ${event} }
```

`Form` submit also writes values to `state.form`, readable as `${form.<field>}`.

## 4. dataSources

Named loading configs; results read via `${data.<name>}`, load status via `${dataStatus.<name>}` (`{ loading: boolean, error?: Error }`).

Three implemented types (`computed`/`resource` are declared in the protocol but NOT implemented):

```yaml
dataSources:
  # static — value returned as-is (enums, demo data)
  statusOptions:
    type: static
    value:
      - { label: Enabled, value: active }
      - { label: Disabled, value: inactive }

  # service — calls a host-registered service function; params support expressions, evaluated at each load
  customers:
    type: service
    service: customer.list
    autoLoad: true                   # load on page init; otherwise only loads on `reload`
    params:
      keyword: ${state.keyword}      # picks up the NEW value when reloaded

  # http — request via the host's HttpAdapter (auth token / baseURL handled by host)
  detail:
    type: http
    autoLoad: true
    request:
      method: GET                    # optional, default GET
      url: /api/customers/${state.currentId}
      params: { verbose: true }      # query params
      # headers: {}   # body: {...} for POST/PUT
```

Other fields: `pagination: { page, pageSize }` (values may be expressions), and option mapping `valueField` / `labelField` / `disabledField` (normalize array items to `{ label, value, disabled }` for direct binding to `Select options`).

Refresh: the `reload` action — `params: { dataSource: customers }` refreshes one source; omitting `dataSource` refreshes all autoLoad sources. Query linkage idiom:

```yaml
events:
  onSubmit:
    - action: setState
      params: { keyword: ${event.keyword} }
    - action: reload                 # data source params reference state → re-fetches with new value
      params: { dataSource: customers }
```

## 5. Expressions and scopes

`${...}` is evaluated by a controlled AST engine — NO eval, NO globals (`window`/`fetch`/`localStorage` unreachable), no method calls on data.

Two evaluation forms:

```yaml
count: ${state.count}              # whole string is one expression → original type kept (number)
title: Total ${state.count} items   # mixed with text → string concatenation (null/undefined → '')
```

Syntax: member access `${state.user.name}`, index `${data.list[0].name}`, computed member `${state.cityMap[state.region]}`, literals (string/number/boolean/null/array/object `${{ name: user.name }}`), ternary `cond ? a : b`, logic `&& || !`, comparison `== != === !== < <= > >=`, arithmetic `+ - * / %`, whitelisted functions `${t('menu.home')}`, `${permission('customer:edit')}`.

Scope chain (inner shadows outer): `global → app → page → overlay → form → component → row → event`.

Global scope keys:

| Key | Content | Example |
| --- | --- | --- |
| `app` / `user` | bootstrap app / user info | `${user.name}` |
| `page` | current page meta | `${page.title}` |
| `state` | page state | `${state.keyword}` |
| `form` | alias of `state.form` (written on Form submit) | `${form.keyword}` |
| `data` / `dataStatus` | data source results / `{ loading, error }` | `${data.customers}`, `${dataStatus.list.loading}` |
| `route` | routing context | `${route.params.id}`, `${route.query.tab}` |
| `params` | alias of `route.params`; inside an overlay, the overlay-injected params | `${params.id}` |
| `actions` | results of named actions (by `id`) | `${actions.editResult.success}` |
| `locale` / `t` | current locale / translate fn | `${t('menu.home')}` |

Local scope keys (only where produced): `event` (event payload), `row` / `rowIndex` (Table `cell` templates and `For` item templates), `parent` (parent page snapshot inside overlays).

## 6. Events and actions

ActionConfig fields: `action` (required, registry name), `id` (named action — result written to `actions.<id>`: success → result data; failure → `{ ok: false, error }`), `params` (expressions evaluated before execution), `condition` (falsy → skipped), `permission`.

Event payloads (`${event}`):

| Event | Payload |
| --- | --- |
| Button `onClick` | none |
| Input / Select / Switch `onChange` | the new value (`${event}`) |
| Tabs `onChange` | new active key |
| Table `onChange` | `{ current, pageSize, total, field?, order? }` |
| Table `onSelectChange` | selected row keys array (`rowSelection: true`) |
| Table `onRowDrop` | `{ dragKey, dropKey, position: 'before' \| 'after' }` (`rowDraggable: true`) |
| Form `onSubmit` | all values (`${event.name}`) |
| Form `onValuesChange` | ONLY the changed field `{ <field>: newValue }` |

Action catalog:

| Action | Params | Notes |
| --- | --- | --- |
| `setState` / `resetState` | any key-values / — | shallow merge / restore initial |
| `reload` | `dataSource?` | omit → all autoLoad sources |
| `request` | `url` (req), `method?`, `params?`, `headers?`, `body?`, `target?` | `target` writes response to a state path |
| `service.call` | `service`, `params?` | call a host-registered service |
| `navigate` | `to` (required) | route push; path supports interpolation: `/customers/${row.id}/edit` |
| `message` | `text`, `messageType?` (success/error/warning/info) | NEVER use a `type` key in params — see §9 |
| `confirm` | `title?`, `content?` | result: true/false (cancel is NOT a failure — name it and branch with `if`) |
| `if` | `condition`, `then?`, `else?` | branches are action(s), evaluated on execution |
| `sequence` / `parallel` | `actions` | serial fail-stop / parallel all-settle |
| `call` | `name` | run a top-level named action, inherits caller scope |
| `delay` | `ms` | wait |
| `form.setValues` | `values` (req), `form?` (default `default`) | write field values; does NOT trigger validation or onValuesChange |
| `form.submit` | `form?` (default `default`) | trigger the form's native submit — runs validation and `onSubmit`; for submit buttons outside the `<form>` DOM (e.g. Drawer `footer` slot) |
| `overlay.open` / `overlay.close` | see below | open overlay and await close; close `payload` becomes open's result |

`overlay.open` params: `{ overlay: { type: modal|drawer, title?, width?, content: <DslNode> | page: { pageId }, params? } }`. Overlay content evaluates in overlay scope: `${params.x}` = injected params, `${parent.x}` = parent page snapshot, `${state}`/`${data}` still live.

Multiple forms on one page: every `Form` registers under `props.name` (default `default`) — name additional forms explicitly (e.g. a drawer edit form `name: edit`) and address them with `form.setValues`'s `form` param.

## 7. Permission

```yaml
permission: customer:delete                              # single code
permission: [customer:delete, customer:admin]            # any match passes
permission: { code: customer:delete, denied: disabled }  # hidden (default) | disabled | readonly
```

Applies at page / menu / component / action levels. In expressions: `${!permission('customer:edit')}`. Frontend permissions only shape UI — the backend must still authorize.

## 8. Recipes (copy-paste starting points)

A production-complete page is more than a component tree. Before copying a recipe, read `references/page-blueprints.md` and preserve the applicable page header, breadcrumb, permission, loading, empty, error, disabled, and responsive regions. Use [`examples/search-list.page.yaml`](examples/search-list.page.yaml) for the production list baseline, or the closest page type in [`examples/index.md`](examples/index.md).

### 8.1 Query form + data table (the most common page)

```yaml
dsl: '1.0'
page: { id: customer-list, title: Customer List, permission: customer:view }

state:
  keyword: ''

dataSources:
  customers:
    type: service                 # or http with request: { url: /api/customers, params: {...} }
    service: customer.list
    autoLoad: true
    params:
      keyword: ${state.keyword}

body:
  type: Page
  props: { title: Customer List }
  children:
    - type: Card
      props: { title: Search }
      children:
        - type: Form
          props: { layout: inline }
          events:
            onSubmit:
              - action: setState
                params: { keyword: ${event.keyword} }
              - action: reload
                params: { dataSource: customers }
          children:
            - type: Input                    # name 让控件自动成为 Form 字段
              props:
                name: keyword
                label: Keyword
                placeholder: Name / owner
            - type: Select
              props:
                name: status
                label: Status
                options:
                  - { label: Enabled, value: active }
                  - { label: Disabled, value: inactive }
            - type: Button                   # inline Form 中与字段自动同基线
              props: { text: Search, variant: primary, submit: true }   # submit: true, NOT htmlType
    - type: Card
      props: { title: Customer Data }
      children:
        - type: Table
          props:
            dataSource: ${data.customers}         # EXPRESSION, not the source name
            loading: ${dataStatus.customers.loading}
            pagination: { pageSize: 10 }
            columns:
              - { title: Name, dataIndex: name }
              - { title: Phone, dataIndex: phone }
              - title: Actions                     # column template key is `cell`
                cell:
                  type: Button
                  props: { text: Edit, variant: primary, size: small }
                  events:
                    onClick:
                      - action: navigate
                        params:
                          to: /customers/${row.id}/edit   # param name is `to`
```

Use an explicit `Field` only for extra structure, for example:

```yaml
- type: Field
  props:
    label: Owner
    description: The owner receives review notifications.
  children:
    - type: Select
      props:
        name: owner
        rules: [{ required: true, message: Select an owner }]
        options: ${data.owners}
```

### 8.2 Drawer edit (overlay.open named action + close payload)

```yaml
events:
  onClick:
    - id: editResult                       # named: suspends until overlay closes
      action: overlay.open
      params:
        overlay:
          type: drawer
          title: Edit Customer
          width: 420
          params: { id: ${row.id}, name: ${row.name} }   # injected into overlay scope
          content:
            type: Form
            props: { name: edit }          # explicit name — page query form already owns `default`
            events:
              onSubmit:
                - id: updateResult
                  action: service.call
                  params:
                    service: customer.update
                    params: { id: ${params.id}, name: ${event.name} }
                - action: if
                  params:
                    condition: ${actions.updateResult.id}
                    then:
                      - action: overlay.close
                        params: { payload: { success: true } }   # success semantics
                    else:
                      - action: message
                        params: { messageType: error, text: Save failed, please retry }
            children:
              - type: Field
                props: { label: Name, required: true }
                children:
                  - type: Input
                    props:
                      name: name
                      value: ${params.name}    # field-level initial value (row data backfill)
                      rules:
                        - { required: true, message: Please enter a name }
              - type: Field
                children:
                  - type: Button
                    props: { text: Save, variant: primary, submit: true }
    - action: if                           # runs after the drawer closes; cancel (X / mask / Esc) skips
      params:
        condition: ${actions.editResult.success}
        then:
          - action: reload
            params: { dataSource: customers }
          - action: message
            params: { messageType: success, text: Customer updated }
```

### 8.2.1 Controlled overlay nodes (state + `open` expression)

Alternative to `overlay.open`: declare `Drawer` / `Dialog` / `AlertDialog` as ordinary DSL nodes with `open: ${state.x}` and drive them with `setState`. Use this when the overlay is a fixed part of the page tree (templates, statically known content). Key wiring:

```yaml
state: { drawerOpen: false }
body:
  type: Page
  children:
    - type: Button                            # open
      props: { text: 新建, variant: primary }
      events:
        onClick:
          - action: setState
            params: { drawerOpen: true }
    - type: Drawer
      props:
        title: 编辑
        open: "${state.drawerOpen}"
        style: { width: 480, maxWidth: 'none' }
        okText: 保存                          # 默认 footer [取消, 保存]
      events:
        onClose:                              # 关闭图标 / mask / Esc / 默认「取消」
          - action: setState
            params: { drawerOpen: false }
        onOk:                                 # 默认「保存」→ form.submit 桥接校验 + onSubmit
          - action: form.submit
      children:
        - type: Form
          events:
            onSubmit:
              - action: message
                params: { messageType: success, text: 保存成功 }
              - action: setState
                params: { drawerOpen: false }
          children:
            - type: Field
              props: { label: 名称, required: true }
              children:
                - type: Input
                  props:
                    name: name
                    rules:
                      - { required: true, message: 请输入名称 }
```

Rules of thumb:

- `Drawer` 默认带右上角关闭图标（`closable: false` 关闭）与默认 footer（[取消 → onClose, 确定 → onOk]，右对齐、固定底部）；关闭链路在未 wiring `onClose` 时也会默认自闭合，wiring `onClose` 回写 state 是推荐做法。
- 表单抽屉优先用 `okText` + `events.onOk: form.submit`（最简）；需要非按钮组布局时才给 `footer` 传 DslNode 或 `false`。
- A `submit: true` button only submits the enclosing `<form>`; from the `footer` slot (outside the `<form>` DOM) use the `form.submit` action instead — it runs the same validation + `onSubmit` chain.
- `AlertDialog` in controlled mode never self-closes: wire BOTH `events.onConfirm` and `events.onCancel` to `setState x=false`.
- `${form.x}` is written to state only on successful submit; for per-step data in a wizard, submit at each step (or read Form values only after submit).

### 8.3 Server-side pagination

Table's own `pagination` paginates the data already bound to it (client-side). For a server-paginated API, turn it off and pair the table with a standalone `Pagination` component driving state + reload:

```yaml
state: { page: 1, pageSize: 10 }
dataSources:
  customers:
    type: http
    autoLoad: true
    request:
      method: GET
      url: /api/customers
      params:
        keyword: ${state.keyword}
        page: ${state.page}
        pageSize: ${state.pageSize}
# in the table card, after the Table node:
- type: Table
  props:
    dataSource: ${data.customers.list}     # bind the page slice; path depends on your API shape
    pagination: false
    columns: [...]
- type: Pagination
  props:
    total: ${data.customers.total}         # total count from the response
    page: ${state.page}                    # controlled current page
    pageSize: ${state.pageSize}
  events:
    onChange:                              # event = target page number
      - action: setState
        params: { page: ${event} }
      - action: reload
        params: { dataSource: customers }
```

Table also supports `rowKey` (row key field, default `'id'`); Table `onChange` (`{ current, pageSize, total }`) exists for its built-in client-side pager.

### 8.3.1 Table extras: tree data, row drag, sticky header

```yaml
- type: Table
  props:
    dataSource: ${data.menus}            # rows containing a `children` array render as a tree table automatically
    childrenColumnName: children         # default; set another field name, or false to disable tree mode
    indentSize: 16                       # px per tree level (default 16); expand toggles render in the first column
    defaultExpandAllRows: true           # start fully expanded (default: all collapsed, toggle via the row arrow)
    rowDraggable: true                   # grip handle column; drag to reorder within the same parent level
    scrollY: 400                         # px; body scrolls vertically with the header stuck on top
  events:
    onRowDrop:                           # reorder already applied internally; use this to persist
      - action: request
        params:
          url: /api/menus/reorder
          method: POST
          body: ${event}                 # { dragKey, dropKey, position }
```

Tree tables sort recursively per level and paginate by top-level rows. Sortable columns (`sorter: true`), `rowSelection`, fixed columns (`fixed: right` on the action column) all compose with the above.

### 8.4 Confirm then act

```yaml
events:
  onClick:
    - id: cfm
      action: confirm
      params: { title: Confirm deletion, content: This cannot be undone }
    - action: if
      params:
        condition: ${actions.cfm}
        then:
          - action: request
            params: { method: DELETE, url: /api/customers/${row.id} }
          - action: reload
            params: { dataSource: customers }
```

### 8.5 Select cascade (option linkage + field clearing)

```yaml
state:
  cityMap: { Zhejiang: [{ label: Hangzhou, value: Hangzhou }], Jiangsu: [{ label: Nanjing, value: Nanjing }] }
  cityOptions: []
# explicit Fields used to group controls that share a description:
- type: Field
  props: { label: Province }
  children:
    - type: Select
      props: { name: region, options: [{ label: Zhejiang, value: Zhejiang }, { label: Jiangsu, value: Jiangsu }] }
      events:
        onChange:
          - action: form.setValues             # clear the child field first
            params: { values: { city: '' } }   # add `form: edit` when targeting a named form
          - action: setState                   # then update child options (computed member access)
            params: { cityOptions: ${state.cityMap[event]} }
- type: Field
  props: { label: City }
  children:
    - type: Select
      props:
        name: city
        options: ${state.cityOptions}
        disabled: ${state.cityOptions.length === 0}
```

### 8.6 Card list page (`CardList` / `EntityCard` — @pactor-app/blocks business components)

`CardList` renders a grid of `EntityCard` summary cards in one node — no `For` + nested `Flex`/`Text`/`Tag` scaffolding. Business components live in `@pactor-app/blocks` and are **not** in the builtin registry: merge them with `registerBlockComponents`. Item fields mirror `EntityCard` props; extra business fields ride along and come back in event payloads.

```yaml
state:
  plugins:
    - id: 1
      icon: users                      # Icon whitelist name (or `logo` image URL)
      title: 用户管理
      subtitle: v0.1.0                 # auxiliary line under the title
      description: 管理插件安装状态与运行生命周期，支持启停与依赖检查。
      tags: [{ text: 已安装, color: success }]   # Tag colors: default/success/warning/error/info
      actions: [{ text: 停用 }]        # footer buttons, right-aligned, muted bar
body:
  - type: CardList
    props:
      items: ${state.plugins}
      columns: 3                       # grid columns, default 3; 1 = single wide rows
      gap: 16                          # default 16
      showCount: true                  # footer "共 N 个" count line
      # createText: 新建插件           # dashed "create" placeholder card in the first cell
      # hoverable: true                # whole-card pointer + hover highlight
    events:
      onCreateClick: { action: message, params: { messageType: info, text: open create dialog } }
      onItemClick: { action: message, params: { messageType: info, text: "进入详情：${event.item.title}" } }
      onItemAction:                    # ${event} = { key, text, item, index }
        - action: confirm
          id: opConfirm
          params: { title: "确认${event.text}「${event.item.title}」？" }
        - action: if
          params:
            condition: ${actions.opConfirm}
            then: [{ action: message, params: { messageType: success, text: done } }]
```

- `EntityCard` standalone: `icon`/`logo`, `title`, `subtitle`, `tags[]`, `description` (two-line clamp), `meta` (right side of the middle row), `actions[]` (`{ text, key?, variant?, danger? }`), `footerBackground` (muted footer bar, default `true`), `hoverable`. Events `onClick` (whole card) and `onAction` (`{ key, text, index }`) — footer button clicks never trigger the card click.
- Empty `items` renders an `Empty` state (`emptyText` overrides the default).

## 9. Common mistakes (observed — do not do these)

| Wrong | Right |
| --- | --- |
| Flat top level `{ id, title, body }` | `{ dsl: '1.0', page: { id, title }, body }` |
| Missing `dsl: '1.0'` | Always first line, required |
| `dataSource: customers` (source name) | `dataSource: ${data.customers}` (expression) |
| Column template key `render` | `cell` |
| `pagination: true` | `pagination: { pageSize: 10 }` |
| `htmlType: submit` | `submit: true` |
| Duplicate label on explicit `Field` and inner `Input` | The control owns `name` / `rules`; put `label` on either the control (automatic field shell) or the explicit `Field`, never both |
| Relying on `Field required: true` for validation | It is a visual `*` marker only — declare `rules: [{ required: true, message: ... }]` on the CONTROL (`Input`/`Select`/…); Form validates control rules on submit |
| `style` / `className` as node-level keys (sibling of `props:`) | They are component props — always nest them inside `props: { className: ..., style: ... }`; node-level keys are silently ignored |
| `children` nested inside `props:` | `children` is a NODE-level key (sibling of `props:`); nested under `props:` it is silently dropped |
| `navigate` param `path` / `url` | `to` |
| `message` param `type: success` | `messageType: success` — a `type` (or `action`) key inside action `params` makes the engine treat params as a nested DSL/action config and SKIP expression evaluation |
| Reading full form values in `onValuesChange` | It only carries the changed field; use `onSubmit` or `${form.x}` |
| Expecting actions to re-render UI | Only the state/data changes they produce do |
| Inventing component `type` names or props | Use registry names (SKILL.md list) and documented props |
| `type: Chart` | Use a concrete registered chart, e.g. `LineChart`, `ColumnChart`, `PieChart` |
| `type: Splitter` | Use `Resizable`; `Splitter` is only the documentation label |

## 10. Validate before delivering

```bash
# 单文件
npx pactor validate src/server/yaml/pages/home.page.yaml

# 递归校验 DSL 目录（包含表达式静态检查）
npx pactor lint src/server/yaml
```

The command must run in the consumer project with `@pactor-app/cli` installed. It checks schema shape (top-level keys, node structure, action configs) but does NOT validate component props. Correctness of props comes from the bundled component catalog/contracts and the online docs.

## 11. Version-drift lookup

- Exhaustive DSL reference: <https://pactor.innospots.com/docs/reference/dsl/> (named actions/components, dynamic source refs, lifecycle details)
- Online component catalog: <https://pactor.innospots.com/components/overview/> (141 documentation entries; complete type mapping in `references/component-catalog.md`)
- Online page templates: <https://pactor.innospots.com/templates/overview/>
- Source repository: <https://github.com/innospots/pactor>
- Page DSL schema source: <https://github.com/innospots/pactor/blob/main/packages/schema/src/schemas/page-dsl.ts>
- DSL node and action schema source: <https://github.com/innospots/pactor/blob/main/packages/schema/src/schemas/dsl-node.ts>
- UI component adapters: <https://github.com/innospots/pactor/tree/main/packages/ui/src/components/components>
- Chart adapters: <https://github.com/innospots/pactor/tree/main/packages/chart/src/components>
- Blocks: <https://github.com/innospots/pactor/tree/main/packages/blocks/src/components>
- Chat DSL component: <https://github.com/innospots/pactor/blob/main/packages/chat/src/view/Chat.tsx>
- Events & form linkage deep-dive: <https://pactor.innospots.com/docs/guides/events/>
- Data flow deep-dive: <https://pactor.innospots.com/docs/guides/data-flow/>

Use these links only when the installed package version appears newer than the bundled references. The bundled files remain the primary offline source for page authoring.
