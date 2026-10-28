---
name: pactor-dsl
description: |
  Use for Pactor DSL and runtime wiring inside an existing app (skill id pactor-dsl). Triggers: write/edit *.page.yaml, add N pages with module folders and sitemap/menus, state, dataSources, events, actions, expressions, custom components/actions/services, themes, permissions, Chat/ChatShell, vite-plugin, pactor validate. NOT for empty-repo scaffold (use pactor-project) or full PRD-to-repo generation (use pactor-prd).
metadata:
  version: 2.3.0
---

# Pactor DSL

## When to activate

Activate when the user works with **Pactor DSL or runtime APIs** in a project that already exists:

- Adding or changing **one or many** YAML pages and their **directory + sitemap/menu** relationships
- Using `createPactorApplication`, `@pactor-app/app`, or `StaticDslLoader` **inside an existing codebase** (new repo → **`pactor-project`** first)
- Writing YAML/JSON DSL pages, components, events, or actions
- Creating or registering custom components / actions / services
- Building AI chat pages (`Chat`, `ChatShell`, `ChatServicesProvider`)
- Configuring themes, skins, layouts, menus, or sidebars
- Integrating data sources, routers, resources, or permissions
- Handling form linkage, event linkage, or action orchestration
- Using `@pactor-app/vite-plugin` or `@pactor-app/cli`
- Mentioning packages: `@pactor-app/core`, `@pactor-app/runtime`, `@pactor-app/app`, `@pactor-app/ui`, `@pactor-app/router`, `@pactor-app/resource`, `@pactor-app/permission`, `@pactor-app/expression`, `@pactor-app/schema`, `@pactor-app/chat`, `@pactor-app/markdown`

## What you can do with this skill

- Explain Pactor architecture, package boundaries, and dependency rules
- **Batch-create pages** from a page inventory: file paths (`yaml/<module>/<id>.yaml` vs `yaml/pages/*.page.yaml`), `sitemap.yaml` `pages`/`menus`, or `StaticDslLoader.pages` — see `references/page-catalog-and-layout.md`
- **Build complete page structures** for list, detail, form, dashboard, card-list, tree master-detail, login, register, chat, navigation, and overlay workflows — see `references/page-blueprints.md`
- **Choose components without omissions** from the source-audited catalog of 175 DSL types, with per-component online documentation links — see `references/component-catalog.md`
- **Copy complete, schema-valid page baselines** for search/list, detail, edit, login, register, chat, dialog, drawer, navigation, dashboard, card list, and tree master-detail — see `references/examples/index.md`
- **Check exact high-frequency component props, events, slots, and interaction rules without source access or scripts** — see `references/component-contracts.md`
- Register custom components, actions, services, and capabilities
- Design data flow, expressions, events, and action orchestration
- Configure themes/skins, layouts, routing, resources, and permissions
- Assemble AI chat workspaces with the `Chat` DSL component
- Provide exact commands and example project pointers

## Internationalization

When adding multilingual YAML or a language selector, read [references/internationalization.md](references/internationalization.md). Prefer the field shorthand `'$i18n{key:default}'`; establish the locale bundles, server localization and switching flow described there. Verify the target host supports author-time localization.

## Framework in one sentence

**Pactor — Dynamic Application Runtime**: an enterprise-oriented **Server-Driven UI + AI-Native frontend runtime** where pages are YAML/JSON DSL rendered by a shared browser Runtime. Business projects install the framework via npm; ordinary pages do not need to be rebuilt or rebundled.

## Package map

The skill is self-contained. Use this table for package responsibility; use the GitHub link only when the installed version differs from the bundled references.

| Package | What it provides | Source |
|---------|------------------|--------|
| `@pactor-app/core` | DSL protocol types, AST, Registry interfaces | [GitHub](https://github.com/innospots/pactor/tree/main/packages/core) |
| `@pactor-app/schema` | JSON Schema, TypeScript types, validation rules | [GitHub](https://github.com/innospots/pactor/tree/main/packages/schema) |
| `@pactor-app/expression` | Controlled expression engine (no eval) | [GitHub](https://github.com/innospots/pactor/tree/main/packages/expression) |
| `@pactor-app/runtime` | Renderer, RuntimeContext, state, data sources, actions, page runtime | [GitHub](https://github.com/innospots/pactor/tree/main/packages/runtime) |
| `@pactor-app/resource` | DSL loaders (HTTP / static), cache, versioning | [GitHub](https://github.com/innospots/pactor/tree/main/packages/resource) |
| `@pactor-app/router` | Dynamic routing, path matcher, menu registry | [GitHub](https://github.com/innospots/pactor/tree/main/packages/router) |
| `@pactor-app/permission` | Page/menu/component/action guards | [GitHub](https://github.com/innospots/pactor/tree/main/packages/permission) |
| `@pactor-app/ui` | Built-in default shadcn-style UI components, stylesheet, interaction core | [GitHub](https://github.com/innospots/pactor/tree/main/packages/ui) |
| `@pactor-app/blocks` | Composite blocks such as Login, CardList, EntityCard, RecordingPage, SiteFooter; merge with `registerBlockComponents` | [GitHub](https://github.com/innospots/pactor/tree/main/packages/blocks) |
| `@pactor-app/chart` | ECharts-based chart components and `MetricCard`; merge with `registerChartComponents` | [GitHub](https://github.com/innospots/pactor/tree/main/packages/chart) |
| `@pactor-app/markdown` | Markdown and DSL Part rendering | [GitHub](https://github.com/innospots/pactor/tree/main/packages/markdown) |
| `@pactor-app/chat` | AI message protocol, transport, ChatView, Chat/ChatShell, artifacts | [GitHub](https://github.com/innospots/pactor/tree/main/packages/chat) |
| `@pactor-app/vite-plugin` | Vite YAML modules, build-time validation, HMR | [GitHub](https://github.com/innospots/pactor/tree/main/packages/vite-plugin) |
| `@pactor-app/cli` | DSL validation, inspection, scaffolding | [GitHub](https://github.com/innospots/pactor/tree/main/packages/cli) |
| `@pactor-app/app` | One-stop composition through `createPactorApplication` | [GitHub](https://github.com/innospots/pactor/tree/main/packages/app) |
| `pactor-app` | Meta package that depends on all modules and re-exports the app entry | [GitHub](https://github.com/innospots/pactor/tree/main/packages/pactor) |

## Dependency rules

Dependencies are strictly one-way:

```text
core ← schema ← expression ← runtime
                              ↓
        {permission, resource, router, ui} ← app
```

- Business apps depend only on `@pactor-app/app` + `@pactor-app/ui`, or install the `pactor-app` meta package to get every module at once.
- Never import implementation details from sibling packages.
- Renderer logic must resolve components via Registry, not `if (type === 'X')` branches.

## Quick start

### Install

```bash
# meta package: installs every module at once
pnpm add pactor-app

# or install only what you need (shadcn-style built-in UI)
pnpm add @pactor-app/app @pactor-app/ui
```

### Bootstrap with API loader

```tsx
import { createPactorApplication } from '@pactor-app/app';
import '@pactor-app/ui/styles.css'; // required

createPactorApplication({
  appId: 'my-app',
  api: { baseURL: '/api/runtime' },
}).mount('#root');
```

Server must provide the Envelope endpoints:

- `{baseURL}/bootstrap` — app, user, permissions, menus, layout
- `{baseURL}/pages/{id}` — page DSL

### Bootstrap locally with StaticDslLoader

```tsx
import { createPactorApplication } from '@pactor-app/app';
import { StaticDslLoader } from '@pactor-app/resource';
import '@pactor-app/ui/styles.css';
import homePage from './pages/home.page.yaml';

const loader = new StaticDslLoader({
  bootstrap: {
    app: { name: 'My App' },
    menus: [{ id: 'home', type: 'page', title: 'Home', path: '/', pageId: 'home' }],
    layout: { type: 'admin' },
  },
  pages: { home: homePage },
});

createPactorApplication({ appId: 'my-app', loader }).mount('#root');
```

For YAML imports add `@pactor-app/vite-plugin` to `vite.config.ts` and declare `*.page.yaml` modules.

## Component catalog and registration

**Before choosing a component, read `references/component-catalog.md`.** It is audited against the current package registries and the Pactor docs navigation: 141 online component detail entries map to 140 documented DSL types, and the current runtime registers **175 types**. Each catalog row states the exact DSL `type`, its purpose, and an online documentation or source link.

| Source | Count | Availability |
| --- | ---: | --- |
| `@pactor-app/ui` builtins | 124 | Available by default from `createComponentRegistry()` in `createPactorApplication` |
| `@pactor-app/chart` | 17 | Call `registerChartComponents(registry)`; import `@pactor-app/chart/styles.css` |
| `@pactor-app/blocks` | 11 | Call `registerBlockComponents(registry)`; import `@pactor-app/blocks/styles.css` |
| `@pactor-app/chat` display components | 19 | Call `registerChatComponents(registry)` or use `createChatComponentRegistry()` |
| `Chat` / `ChatShell` | 2 | Registered by `registerChatComponent(registry)` |
| Sitemap layout types | 2 | `PageOutlet` / `SitemapMenu` are supplied automatically inside `SitemapApp` layout DSL |

High-frequency selection map:

| Need | Preferred components |
| --- | --- |
| Page shell and responsive layout | `Page`, `Flex`, `Grid`, `Row` + `Col`, `Space`, `Container`, `Card` |
| Page context and actions | `Breadcrumb`, `Typography`, `Text`, `Button`, `DropdownMenu` |
| Search and data entry | `Form` + `Input` / `Select` / `DatePicker` / `NumberInput` / `Combobox`; add `Field` for descriptions or grouped controls |
| Structured results | `Table`, `Pagination`, `Descriptions`, `Tree`, `List`, `CardList` |
| Status and feedback | `Alert`, `Badge`, `Status`, `Empty`, `Skeleton`, `Progress`, `Message`, `Dialog`, `Drawer` |
| Charts | `MetricCard`, `LineChart`, `ColumnChart`, `BarChart`, `AreaChart`, `PieChart`, `DonutChart`, … |
| AI conversation | `ChatPage` for a full workspace, `Chat` for embedded chat, `ChatShell` for menu-driven shell |
| Auth and marketing | `Login`, `HeroSection`, `SiteFooter` from `@pactor-app/blocks` |

### Complete page baselines

Read [`references/examples/index.md`](references/examples/index.md) for data contracts, host registration, route/layout mapping, and per-example documentation links. The YAML files live beside that index and are complete Page DSL documents.

| Page task | Bundled baseline | Online guide |
| --- | --- | --- |
| Search + filter + server pagination | [`search-list.page.yaml`](references/examples/search-list.page.yaml) | [Search list template](https://pactor.innospots.com/templates/search-list/) |
| Basic list + client pagination | [`customer-list.page.yaml`](references/examples/customer-list.page.yaml) | [Table](https://pactor.innospots.com/components/data-display/table/) |
| Record detail | [`record-detail.page.yaml`](references/examples/record-detail.page.yaml) | [Tab detail](https://pactor.innospots.com/templates/detail-tabs/) |
| Standalone create/edit form | [`record-edit.page.yaml`](references/examples/record-edit.page.yaml) | [Form page](https://pactor.innospots.com/templates/form-page/) |
| Dialog form | [`dialog-form.page.yaml`](references/examples/dialog-form.page.yaml) | [Dialog](https://pactor.innospots.com/components/feedback/dialog/) |
| Drawer form | [`drawer-form.page.yaml`](references/examples/drawer-form.page.yaml) | [Drawer form template](https://pactor.innospots.com/templates/drawer-form/) |
| Login | [`login.page.yaml`](references/examples/login.page.yaml) | [Login](https://pactor.innospots.com/components/blocks/login/) |
| Register | [`register.page.yaml`](references/examples/register.page.yaml) | [Form](https://pactor.innospots.com/components/data-entry/form/) |
| AI chat | [`chat.page.yaml`](references/examples/chat.page.yaml) | [Chat page template](https://pactor.innospots.com/templates/chat-page/) |
| Top navigation + section menu | [`navigation.page.yaml`](references/examples/navigation.page.yaml) | [NavigationMenu](https://pactor.innospots.com/components/navigation/navigation-menu/) |
| Dashboard | [`dashboard.page.yaml`](references/examples/dashboard.page.yaml) | [Dashboard template](https://pactor.innospots.com/templates/dashboard/) |
| Card list | [`card-list.page.yaml`](references/examples/card-list.page.yaml) | [Card list template](https://pactor.innospots.com/templates/card-list/) |
| Tree master-detail | [`tree-master-detail.page.yaml`](references/examples/tree-master-detail.page.yaml) | [Tree master-detail](https://pactor.innospots.com/templates/tree-master-detail/) |

Critical catalog facts:

- `Chart` is **not** a registered component. Use a concrete type such as `LineChart` or `PieChart`.
- The docs label `Splitter` maps to DSL type `Resizable`; there is no `type: Splitter`.
- `@pactor-app/blocks` and `@pactor-app/chart` are not in the default registry. A page using them renders “Unsupported” until the package registry is merged.
- `Icon` accepts a whitelist name (usually kebab-case); unknown icons render a placeholder.
- `Sidebar` is a complete app shell; `Layout` / `Header` / `Sider` / `Content` / `Footer` are lower-level composition primitives.
- Global layouts are resolved from bootstrap/sitemap keys `admin`, `blank`, `login`, `landing`, `chat`. Regular pages must not recreate the active global shell.

Component prop/event details:

- [Pactor component overview](https://pactor.innospots.com/components/overview/)
- [Complete bundled catalog](references/component-catalog.md) — exact types, purposes, links, and high-frequency contracts
- [Bundled component contracts](references/component-contracts.md) — props, events, slots, form behavior, overlays, charts, blocks, and chat
- [General components](https://pactor.innospots.com/components/general/) · [Layout](https://pactor.innospots.com/components/layout/) · [Navigation](https://pactor.innospots.com/components/navigation/) · [Data entry](https://pactor.innospots.com/components/data-entry/) · [Data display](https://pactor.innospots.com/components/data-display/) · [Feedback](https://pactor.innospots.com/components/feedback/) · [Charts](https://pactor.innospots.com/components/charts/) · [Media](https://pactor.innospots.com/components/media/) · [AI chat](https://pactor.innospots.com/components/ai-chat/) · [Blocks](https://pactor.innospots.com/components/blocks/)

## Workflow: add or edit pages (single or many)

When the user asks for **N pages** or a **module tree**:

1. Read `references/page-catalog-and-layout.md` — pick layout **A** (flat `pages/*.page.yaml`) or **B** (`<module>/<id>.yaml`) to match the project; output a **page inventory table** with at least: id, page type, path, file, layout, menu group, hidden/activeMenu, permission, primary data source.
2. Read `references/page-blueprints.md` for the selected page types, `references/examples/index.md` for a matching complete baseline, and `references/component-catalog.md` plus `references/component-contracts.md` before choosing components.
3. Create **one YAML file per row**; register all ids in the host's sitemap resource (SitemapApp) or `StaticDslLoader` + `bootstrap.menus`. Create/update the global layout DSL with `PageOutlet`; a page file is not a substitute for a missing layout.
4. Per file: use the skeleton below — never invent the top-level shape; declare `state` / `dataSources` / `actions`, then `body`; wire `events` → actions and render loading / empty / error / disabled states. Start from the closest baseline in the table above; for a production-complete search/list page, use [`search-list.page.yaml`](references/examples/search-list.page.yaml) and remove irrelevant business fields.
5. Validate in the consumer project: run `npx pactor lint <project-dsl-directory>` for all pages (recursive), or `npx pactor validate <file...>` for explicit files (`@pactor-app/cli`). Then run the page-completeness checklist in `references/page-blueprints.md`; schema validation alone does not prove layout, props, routing, or behavior.

When editing a **single** existing page, skip step 1 unless menus/paths change.

## Workflow: authoring DSL pages (single-file skeleton)

```yaml
dsl: '1.0'                      # required, DSL spec version
page:                           # required
  id: customer-list             # globally unique
  title: Customer List
  permission: customer:view     # optional page guard
state:                          # optional, reactive initial state
  keyword: ''
dataSources:                    # optional, named data sources
  customers:
    type: service               # static | service | http
    service: customer.list
    autoLoad: true
    params:
      keyword: ${state.keyword} # expressions, evaluated at load time
body:                           # UI tree root (DslNode)
  type: Page
  children:
    - type: Breadcrumb          # page context; last item has no href
      props:
        items:
          - { label: 首页, href: / }
          - { label: 客户管理 }
    - type: Flex                # title + primary action row
      props: { justify: space-between, align: center }
      children: [...]
    - type: Card                # main content region
      props: { title: 客户列表 }
      children: [...]
```

Facts that are NOT guessable and must be followed:

- Top level is `{ dsl, page, state?, dataSources?, actions?, components?, lifecycle?, body? }` — `page` is a wrapper object, `dsl: '1.0'` is mandatory.
- `Table` reads data via an **expression** (`dataSource: ${data.customers}`), not a source name; column templates use the `cell` key (not `render`) with `${row.x}` scope; pagination is `pagination: { pageSize: 5 }`.
- **Inside `Form`, a control with `name` automatically gets the field shell** (`Input`/`NumberInput`/`Select`/`Textarea`/`RadioGroup`/`Checkbox`/`Switch`/`Slider`/`DatePicker` …): put `label` and `rules` on the control; the shell handles label, required marker and error. Use an explicit `Field` only when you need `description`, `labelHint`, declarative `error`, a custom control container, or to group mixed content. When an explicit `Field` owns the label, omit `label` on the inner control to avoid a duplicate label. Query/reset buttons can be direct `Form` children in inline layout; put them in one `Field` or `Flex` only when grouping them visually. The submit button uses `submit: true` (not `htmlType`); `Form onSubmit` receives all values as `${event.<field>}`.

```yaml
- type: Form
  props: { layout: inline }
  children:
    - type: Field
      props: { label: 关键词, description: 支持名称或负责人 }
      children:
        - type: Input
          props: { name: keyword, placeholder: 输入关键词 }
    - type: Select
      props:
        name: status
        label: 状态
        options:
          - { label: 启用, value: enabled }
          - { label: 停用, value: disabled }
    - type: Button          # inline Form 内的裸按钮与控件自动同基线
      props: { text: 查询, variant: primary, submit: true }
    - type: Button
      props: { text: 重置 }
```
- `navigate` takes `to`; `message` takes `text` + `messageType` (a `type` key in action `params` disables expression evaluation).
- Query linkage = `onSubmit: [setState, reload]`; the data source's `params` referencing `${state.x}` pick up new values on reload.
- A complete non-trivial page also covers the four runtime states: `loading` from `${dataStatus.x.loading}`, `empty` only after a successful load with no rows, `error` from `${dataStatus.x.error}`, and `disabled` from permission/business conditions.

**Full DSL grammar, action catalog, expression/scopes tables, and copy-paste recipes: read `references/dsl-authoring.md`.** Page count, folders, sitemap, and layout registration: **`references/page-catalog-and-layout.md`**. Page structure and acceptance: **`references/page-blueprints.md`**. Component props and links: **`references/component-catalog.md`** + [Pactor docs](https://pactor.innospots.com/components/overview/).

## Workflow: custom component

1. Write a React component in the business project
2. Register via `components` option or `app.registerComponent`
3. Reference in DSL by `type`

```tsx
import { createPactorApplication } from '@pactor-app/app';
import { RiskScore } from './components/RiskScore';

createPactorApplication({
  appId: 'risk-admin',
  api: { baseURL: '/api/runtime' },
  components: { RiskScore },
});
```

```yaml
body:
  type: RiskScore
  props:
    score: "${row.riskScore}"
```

Custom components receive RuntimeContext (state, data, permissions, routing, services, actions).

## Workflow: events and data flow

Expressions access runtime scopes:

```yaml
text: "${state.user.name}"
visible: "${state.status == 'ACTIVE'}"
disabled: "${!permission('customer:edit')}"
```

Scope chain:

```text
global → app → page → overlay → form → component → row → event
```

Action orchestration:

```yaml
events:
  onSubmit:
    - action: setState
      params: { keyword: "${event.keyword}" }
    - action: reload
      params: { dataSource: todos }
```

Standard actions: `setState`, `resetState`, `reload`, `request`, `service.call`, `navigate`, `message`, `confirm`, `sequence`, `parallel`, `if`, `call`, `delay`, `form.setValues`, `form.submit`, `overlay.open`, `overlay.close`. Exact params and event payloads are in `references/dsl-authoring.md`; business apps can register additional actions.

Pitfall: action `params` objects with a `type` (or `action`) key are treated as nested DSL/action configs and skip expression evaluation — rename the key (e.g. use `messageType` instead of `type`).

## Workflow: theming and skins

- The built-in kit is shadcn (`@pactor-app/ui`); theming = overriding its CSS variable tokens at `:root` (`--primary` / `--muted` / `--radius` / ...), dark via `data-pactor-theme="dark"`
- Portaled overlays (Tooltip / Select / DropdownMenu popups) mount at `document.body` — token overrides must live at `:root`, not on an inner container
- Chat surfaces use a separate `--pactor-chat-*` token set (same override + dark mechanism)
- Layout and theme config usually come from bootstrap
- Theme/skin editors are host UI; DSL pages should bind the resulting theme values and use semantic token classes rather than hard-coded colors.
- Use `providers` and `headerExtra` slots in `@pactor-app/app` to inject global providers and settings entry

## Workflow: routing, resources, permissions

- **Routing** (`@pactor-app/router`): dynamic routes from bootstrap `menus`, supports Path Matcher, params, hidden routes
- **Resources** (`@pactor-app/resource`): loads page/fragment DSL with HttpDslResourceLoader or StaticDslLoader, cache, versioning
- **Permissions** (`@pactor-app/permission`): page/menu/component/action guards. Frontend permissions only control UI; backend APIs must still authorize

Bootstrap orchestration:

```text
load bootstrap → write PermissionStore → build MenuRegistry → resolve layout → assemble shared registries → render page
```

## Workflow: AI chat workspace

`@pactor-app/chat` provides a complete conversation workspace, and `Chat` is a first-class DSL component (registered alongside `ChatShell` by `registerChatComponent(registry)`). Runtime services are injected once by the host via `ChatServicesProvider` (`transport` required; `callService(name, params)` service bridge resolves dynamic data sources).

With pactor-app, use the convenience factory `createChatComponentRegistry()` (built-in components + Chat/ChatShell) as the `componentRegistry` option; bootstrap `layout.type: 'chat'` resolves to the built-in ChatLayout (sidebar + menu shell) without custom registration.

```yaml
body:
  type: Chat
  props:
    greeting: Hello
    menu:
      - { key: new, label: New Chat, icon: plus }
    models:                    # built-in model selector (controlled: model + onModelChange)
      - { value: demo, label: demo-mock }
    model: ${state.model}
    contexts:                  # @ mention / + context popovers; service refs resolve via callService
      - { trigger: '@', label: Agents, service: agents }
    composerFooter:            # composer footer slot (below the toolbar, with divider)
      type: DropdownMenu
      props:
        items: [{ label: Default Workspace, value: Default Workspace, icon: folder }]
      children:
        - type: Button
          props: { text: Select Workspace, variant: text, size: small }
    messageActions: [copy, regenerate, edit]
  events:
    onModelChange:
      - action: setState
        params: { model: ${event.model} }
```

Feature checklist (all DSL-declarable props):

- **Composer**: attachments (paste / drag / file pick handled by the host), `toolbarStart` / `toolbarEnd` / `composerFooter` / `composerBottom` slots, `hideToolbar` (hide the default toolbar row, Enter still sends)
- **Model selector**: `models` + `modelPlacement: composer | header`
- **Contexts**: `@` / `+` anchored popovers, selected items become chips and travel with the message (structured, never concatenated into text)
- **Message actions**: `messageActions` — the array is the truth (built-ins not listed do not appear); custom actions dispatch via the service bridge
- **Artifact panel**: `artifact` / `panelOpen` controlled props, `inspector` slot, `onArtifact` / `onPanelClose` / `onOpenArtifact` events; markdown / code / text / dsl built-in renderers
- **Header**: auto-rendered only when it has content; `title` / `headerActions: [export, theme, clear]` / `editableTitle`
- **Shell**: `menu` sidebar (icons / badge / dot / group / disabled), `sidebar` replacement slot; `ChatShell` for menu-driven multi-page shells (brand, collapsible icon rail, sidebarFooter)

Pure-React hosts can use `<ChatServicesProvider>` + `<Chat>` directly; `createChatWorkspace(services)` remains as a compatibility path with the same composition and DSL props. See [`chat.page.yaml`](references/examples/chat.page.yaml) and [`examples/index.md`](references/examples/index.md) for the complete host wiring checklist.

## Common commands

```bash
# consumer project dependencies
pnpm add pactor-app

# validate explicit page files, or lint a DSL directory recursively
npx pactor validate src/server/yaml/pages/home.page.yaml
npx pactor lint src/server/yaml
npx pactor inspect src/pages/home.page.yaml

# scaffold only when creating a new repository
npx pactor create my-app
```

## Design principles

1. **DSL is a protocol**, not just a config file: it describes app, page, state, data sources, components, events, actions, and lifecycle
2. **Dynamic DSL, static capabilities**: the server can deliver pages/menus/permissions, but components, actions, services, and capabilities must be defined by the frontend Runtime registries. Never inject arbitrary JavaScript through DSL
3. **Runtime is the core**: DSL → Parser/Validator → Runtime Context → expression/permission/data-source → Component Registry → React Renderer
4. **Allow React escape hatch**: 70%–80% ordinary pages use pure DSL; complex pages can be written directly in React
5. **Frontend permissions only control UI**: hiding menus, buttons, or intercepting actions does not replace backend authorization
6. **No eval in expressions**: use a controlled AST; disallow access to `window`, `document`, `localStorage`, `fetch`, `eval`, and other globals

## Common pitfalls

- **Do not** import UI package internals directly into business DSL pages; use registered component names.
- **Do not** write `if (type === 'Button')` branches in a Renderer; use `ComponentRegistry`.
- **Do not** inject JavaScript from the server into DSL; register actions/services/capabilities in the frontend.
- **Do not** rely on frontend permission checks for security; enforce authorization on backend APIs.
- **Do not** expect `@pactor-app/blocks` / `@pactor-app/chart` components to be in the builtin registry; merge them explicitly (`registerBlockComponents` / `registerChartComponents` into the existing `ComponentRegistry`).
- **Do not** forget to import `@pactor-app/ui/styles.css` when using the default shadcn kit (`@pactor-app/chat/styles.css` / `@pactor-app/blocks/styles.css` / `@pactor-app/chart/styles.css` additionally for chat / blocks / chart surfaces).
- **Do not** use `Chart` or `Splitter` as DSL types; use concrete chart types and `Resizable`.
- **Do not** put a `type` key in action `params` (see the events workflow pitfall).
- **Do not** put `label` on both an explicit `Field` and its inner form control; choose one owner to avoid duplicate labels.
- **Do not** deliver a page that is only a static component tree: it needs route/menu registration, a real layout, data wiring, interaction closure, states, permissions, and responsive behavior.
- **Do not** expect DslNode slots (sidebar / toolbar / inspector / …) to render outside a page runtime; in pure React hosts pass ReactNode instead.

## References (bundled — works from npm install)

- **Page inventory & directories**: `references/page-catalog-and-layout.md`
- **Page blueprints & completeness checklist**: `references/page-blueprints.md`
- **Complete component catalog & docs links**: `references/component-catalog.md`
- **High-frequency component props, events, slots, and constraints**: `references/component-contracts.md`
- **DSL grammar & recipes**: `references/dsl-authoring.md`
- **Complete page examples, data contracts & host wiring**: `references/examples/index.md`
- **Search/list baseline**: `references/examples/search-list.page.yaml`
- **Detail / edit baselines**: `references/examples/record-detail.page.yaml`, `references/examples/record-edit.page.yaml`
- **Dialog / Drawer baselines**: `references/examples/dialog-form.page.yaml`, `references/examples/drawer-form.page.yaml`
- **Auth / chat baselines**: `references/examples/login.page.yaml`, `references/examples/register.page.yaml`, `references/examples/chat.page.yaml`
- **Navigation / dashboard / card / tree baselines**: `references/examples/navigation.page.yaml`, `references/examples/dashboard.page.yaml`, `references/examples/card-list.page.yaml`, `references/examples/tree-master-detail.page.yaml`
- **New repository**: use the separate `pactor-project` skill when it is available.
- **PRD full-site generation**: use the separate `pactor-prd` skill when it is available.

Online lookup only: [component overview](https://pactor.innospots.com/components/overview/) · [page templates](https://pactor.innospots.com/templates/overview/) · [theme overview](https://pactor.innospots.com/themes/overview/) · [source repository](https://github.com/innospots/pactor). Bundled references remain the primary offline source.

## How to use this skill

This skill is self-contained: `SKILL.md` plus the complete `references/` set. AI agents can copy the whole directory into their skill directory and use it offline. The GitHub repository and documentation site are fallback sources for version changes, not prerequisites for authoring pages.
