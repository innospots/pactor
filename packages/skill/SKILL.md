---
name: pactor
description: |
  Use when working with Pactor — any @pactor-app/* package or the pactor-app meta package. Especially when writing, generating, editing, or debugging Pactor DSL files (*.page.yaml: pages, state, dataSources, components, events, actions, expressions); also when bootstrapping a Pactor app (createPactorApplication, StaticDslLoader), registering custom components/actions/services, building AI chat pages (Chat, ChatShell), configuring themes/layouts/routing/resources/permissions, or using @pactor-app/vite-plugin / @pactor-app/cli (pactor validate).
version: 1.5.0
---

# pactor-app

## When to activate

Activate this skill when the user works with **Pactor** — any `@pactor-app/*` package or the `pactor-app` meta package:

- Building or extending a Pactor application
- Using `createPactorApplication`, `@pactor-app/app`, or `StaticDslLoader`
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
- Guide a user from zero to a running Server-Driven UI app
- Register custom components, actions, services, and capabilities
- Design data flow, expressions, events, and action orchestration
- Configure themes/skins, layouts, routing, resources, and permissions
- Assemble AI chat workspaces with the `Chat` DSL component
- Provide exact commands and example project pointers

## Framework in one sentence

**Pactor — Dynamic Application Runtime**: an enterprise-oriented **Server-Driven UI + AI-Native frontend runtime** where pages are YAML/JSON DSL rendered by a shared browser Runtime. Business projects install the framework via npm; ordinary pages do not need to be rebuilt or rebundled.

## Package map

| Directory | Package | What it provides |
|-----------|---------|------------------|
| `packages/core` | `@pactor-app/core` | DSL protocol types, AST, Registry interfaces |
| `packages/schema` | `@pactor-app/schema` | JSON Schema, TS types, validation rules |
| `packages/expression` | `@pactor-app/expression` | Controlled expression engine (no eval) |
| `packages/runtime` | `@pactor-app/runtime` | Renderer, RuntimeContext, State, DataSource, Action, Page Runtime |
| `packages/resource` | `@pactor-app/resource` | DSL loaders (HTTP / static), cache, versioning |
| `packages/router` | `@pactor-app/router` | Dynamic routing, Path Matcher, menu registry |
| `packages/permission` | `@pactor-app/permission` | Page/menu/component/action guards |
| `packages/ui` | `@pactor-app/ui` | Built-in default UI implementation, shadcn style (components + prebuilt stylesheet + interaction core) |
| `packages/markdown` | `@pactor-app/markdown` | Markdown + DSL Part rendering |
| `packages/chat` | `@pactor-app/chat` | AI conversation: message protocol, streaming, ChatView, `Chat`/`ChatShell` DSL components, artifact panel |
| `packages/vite-plugin` | `@pactor-app/vite-plugin` | Vite YAML modules, build-time validation, HMR |
| `packages/cli` | `@pactor-app/cli` | DSL validation, inspection, scaffolding |
| `packages/app` | `@pactor-app/app` | One-stop composition (`createPactorApplication`) |
| `packages/pactor` | `pactor-app` | Meta package — depends on all modules, re-exports `@pactor-app/app` |
| `packages/skill` | `@pactor-app/skill` | This agent skill |

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

## UI at a glance

The built-in shadcn-style UI (`@pactor-app/ui`) registers these DSL component types — reference them by `type` in pages:

- **Page & layout**: `Page`, `Layout` / `Header` / `Sider` / `Content` / `Footer`, `Grid`, `Flex`, `Card`, `Sidebar`
- **Basic**: `Button`, `Alert`, `Statistic`, `Menu`, `Link`, `Text`, `Typography`, `Icon`
- **Data**: `Table`, `Tabs`, `DataTable`, `Chart`
- **Form**: `Form`, `Input`, `Select`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Label`, `Field`, `ChatInput`, `DatePicker`
- **Display**: `Badge`, `Avatar`, `Skeleton`, `Separator`, `Kbd`, `Spinner`, `Empty`, `AspectRatio`, `Progress`, `Calendar`, `Carousel`, `Item`
- **Navigation**: `Breadcrumb`, `Pagination`, `Menubar`, `NavigationMenu`, `DropdownMenu`, `ContextMenu`
- **Overlay & feedback**: `Dialog`, `AlertDialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `HoverCard`, `Sonner`, `Accordion`, `Collapsible`
- **Composite input**: `InputOTP`, `Combobox`, `Command`, `InputGroup`, `ButtonGroup`, `Toggle`, `ToggleGroup`, `Resizable`, `ScrollArea`

Notable behaviors:

- `Icon` renders from a lucide whitelist (~100 names, kebab-case keys; PascalCase/camelCase auto-normalized); unknown names render a placeholder.
- `Sidebar` is a full app shell: brand area, `items` nav or `content` free slot, `sidebarFooter`, desktop icon-rail collapse (hover shows tooltip), mobile overlay drawer.
- `ChatInput` is the generic AI input structure (textarea + toolbar slots + header/footer slots).
- Registered layouts: `admin`, `blank`, `login`, `landing`, `chat` (resolve via the `layout` field).

Component contracts and per-component props: see the docs site (`docs/src/content/docs/components/`).

## Workflow: authoring DSL pages

When the user asks to build / generate / edit a Pactor DSL file (`*.page.yaml`):

1. Start from the page skeleton below — never invent the top-level shape.
2. Declare `state` and `dataSources` first, then compose the `body` tree from registered component `type`s only.
3. Wire interactions via `events` → standard actions; expressions `${...}` read the scope chain.
4. Validate before delivering: `npx pactor validate <file>` (from `@pactor-app/cli`; inside this monorepo: `node packages/cli/dist/cli.js validate <file>`). Note: the validator checks schema shape only, not component props semantics — use the reference for correct props.

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
  props: { title: Customer List }
  children: [...]
```

Facts that are NOT guessable and must be followed:

- Top level is `{ dsl, page, state?, dataSources?, actions?, components?, lifecycle?, body? }` — `page` is a wrapper object, `dsl: '1.0'` is mandatory.
- `Table` reads data via an **expression** (`dataSource: ${data.customers}`), not a source name; column templates use the `cell` key (not `render`) with `${row.x}` scope; pagination is `pagination: { pageSize: 5 }`.
- Form fields bind via `props.name`; the submit button uses `submit: true` (not `htmlType`); `Form onSubmit` receives all values as `${event.<field>}`.
- `navigate` takes `to`; `message` takes `text` + `messageType` (a `type` key in action `params` disables expression evaluation).
- Query linkage = `onSubmit: [setState, reload]`; the data source's `params` referencing `${state.x}` pick up new values on reload.

**Full DSL grammar, action catalog, expression/scopes tables, and copy-paste recipes: read `references/dsl-authoring.md` bundled next to this SKILL.md — read it before writing any non-trivial page.** In the monorepo, per-component props live in `docs/src/content/docs/components/` and the exhaustive DSL reference in `docs/src/content/docs/reference/dsl.md`.

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

Standard actions: `request`, `reload`, `setState`, `resetState`, `navigate`, `message`, `confirm`, `validate`, `submit`, `open`, `close`, `download`, `upload`, `sequence`, `parallel`, `if`, etc. Business can register custom actions.

Pitfall: action `params` objects with a `type` (or `action`) key are treated as nested DSL/action configs and skip expression evaluation — rename the key (e.g. use `messageType` instead of `type`).

## Workflow: theming and skins

- The built-in kit is shadcn (`@pactor-app/ui`); theming = overriding its CSS variable tokens at `:root` (`--primary` / `--muted` / `--radius` / ...), dark via `data-pactor-theme="dark"`
- Portaled overlays (Tooltip / Select / DropdownMenu popups) mount at `document.body` — token overrides must live at `:root`, not on an inner container
- Chat surfaces use a separate `--pactor-chat-*` token set (same override + dark mechanism)
- Layout and theme config usually come from bootstrap
- For business skin settings, see `examples/admin` (`skin.ts` / `SkinSettings`)
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

Pure-React hosts can use `<ChatServicesProvider>` + `<Chat>` directly; `createChatWorkspace(services)` remains as a compatibility path (same composition, same DSL props). Full assembly: `examples/chat`.

## Common commands

```bash
# install dependencies
pnpm install

# build all packages (ESM + CJS + d.ts)
pnpm build

# run all tests
pnpm test

# TypeScript check
pnpm typecheck

# start docs site
pnpm --filter pactor-docs dev

# examples
pnpm --filter example-vite-starter dev   # minimal starter
pnpm --filter example-admin dev          # shadcn admin dashboard (skin settings)
pnpm --filter example-chat dev           # AI chat (built on createPactorApplication)

# @pactor-app/cli
pnpm pactor validate src/pages/**/*.page.yaml
pnpm pactor inspect src/pages/home.page.yaml
pnpm pactor create my-app
```

> Examples reference workspace `dist` outputs. After changing package code, run `pnpm build` before examples pick up changes.

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
- **Do not** forget to import `@pactor-app/ui/styles.css` when using the default shadcn kit (`@pactor-app/chat/styles.css` additionally for chat surfaces).
- **Do not** put a `type` key in action `params` (see the events workflow pitfall).
- **Do not** expect DslNode slots (sidebar / toolbar / inspector / …) to render outside a page runtime; in pure React hosts pass ReactNode instead.

## References

- **DSL authoring reference (bundled)**: `references/dsl-authoring.md` — full page grammar, dataSources, expressions/scopes, action catalog, recipes, common mistakes. Read it before writing DSL.
- Framework design specification: `docs/src/content/docs/framework-design.md`
- Quick start: `docs/src/content/docs/guides/getting-started.md`
- @pactor-app/app docs: `docs/src/content/docs/packages/app.md`
- @pactor-app/chat docs: `docs/src/content/docs/packages/chat.md`
- Component reference: `docs/src/content/docs/components/`
- Example projects:
  - `examples/vite-starter` — minimal starter
  - `examples/admin` — shadcn admin dashboard with skin settings
  - `examples/chat` — AI chat workspace (pactor-app assembly)

## How to use this skill

This skill is maintained as `packages/skill/SKILL.md` together with `references/dsl-authoring.md`. AI agents can copy or link the whole `packages/skill` directory into their skill directory to provide contextual guidance when reading or editing Pactor projects.
