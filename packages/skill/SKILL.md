---
name: pactor
description: |
  Agent skill for rapidly building Pactor Server-Driven UI applications. Covers app bootstrapping, DSL authoring, custom components, theming, events, routing, resources, permissions, and project commands.
version: 1.0.0
---

# pactor

## When to activate

Activate this skill when the user works with **Pactor** or any `pactor-*` package:

- Building or extending a Pactor application
- Using `createPactorApplication`, `pactor-app`, or `StaticDslLoader`
- Writing YAML/JSON DSL pages, components, events, or actions
- Creating or registering custom components / actions / services
- Switching or customizing UI kits (shadcn / custom registries)
- Configuring themes, skins, layouts, or menus
- Integrating data sources, routers, resources, or permissions
- Handling form linkage, event linkage, or action orchestration
- Using `pactor-vite-plugin` or `pactor-cli`
- Mentioning packages: `pactor-core`, `pactor-runtime`, `pactor-app`, `pactor-ui`, `pactor-router`, `pactor-resource`, `pactor-permission`, `pactor-expression`, `pactor-schema`, `pactor-chat`, `pactor-markdown`

## What you can do with this skill

- Explain Pactor architecture, package boundaries, and dependency rules
- Guide a user from zero to a running Server-Driven UI app
- Register custom components, actions, services, and capabilities
- Design data flow, expressions, events, and action orchestration
- Configure themes/skins, layouts, routing, resources, and permissions
- Provide exact commands and example project pointers

## Framework in one sentence

**Pactor — Dynamic Application Runtime**: an enterprise-oriented **Server-Driven UI + AI-Native frontend runtime** where pages are YAML/JSON DSL rendered by a shared browser Runtime. Business projects install the framework via npm; ordinary pages do not need to be rebuilt or rebundled.

## Package map

| Directory | Package | What it provides |
|-----------|---------|------------------|
| `packages/core` | `pactor-core` | DSL protocol types, AST, Registry interfaces |
| `packages/schema` | `pactor-schema` | JSON Schema, TS types, validation rules |
| `packages/expression` | `pactor-expression` | Controlled expression engine (no eval) |
| `packages/runtime` | `pactor-runtime` | Renderer, RuntimeContext, State, DataSource, Action, Page Runtime |
| `packages/resource` | `pactor-resource` | DSL loaders (HTTP / static), cache, versioning |
| `packages/router` | `pactor-router` | Dynamic routing, Path Matcher, menu registry |
| `packages/permission` | `pactor-permission` | Page/menu/component/action guards |
| `packages/ui` | `pactor-ui` | shadcn UI kit — the single built-in kit (`shadcnUiKit` + prebuilt stylesheet + contracts/interaction core) |
| `packages/markdown` | `pactor-markdown` | Markdown + DSL Part rendering |
| `packages/chat` | `pactor-chat` | AI conversation, streaming, capabilities |
| `packages/vite-plugin` | `pactor-vite-plugin` | Vite YAML modules, build-time validation, HMR |
| `packages/cli` | `pactor-cli` | DSL validation, inspection, scaffolding |
| `packages/app` | `pactor-app` | One-stop composition (`createPactorApplication`) |

## Dependency rules

Dependencies are strictly one-way:

```text
core ← schema ← expression ← runtime
                              ↓
        {permission, resource, router, ui} ← app
```

- Business apps depend only on `pactor-app` + `pactor-ui` (the single built-in shadcn UI kit).
- Never import implementation details from sibling packages.
- Renderer logic must resolve components via Registry, not `if (type === 'X')` branches.

## Quick start

### Install

```bash
# shadcn UI kit (the single built-in kit)
pnpm add pactor-app pactor-ui
```

### Bootstrap with API loader

```tsx
import { createPactorApplication } from 'pactor-app';
import 'pactor-ui/styles.css'; // required

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
import { createPactorApplication } from 'pactor-app';
import { StaticDslLoader } from 'pactor-resource';
import 'pactor-ui/styles.css';
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

For YAML imports add `pactor-vite-plugin` to `vite.config.ts` and declare `*.page.yaml` modules.

## Workflow: custom component

1. Write a React component in the business project
2. Register via `components` option or `app.registerComponent`
3. Reference in DSL by `type`

```tsx
import { createPactorApplication } from 'pactor-app';
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

## Workflow: theming and skins

- The built-in UI kit is shadcn (`pactor-ui`); theming = overriding its CSS variable tokens (`--primary` / `--muted` / ...), dark via `data-pactor-theme="dark"`
- Layout and theme config usually come from bootstrap
- For business skin settings, see `examples/admin` (`skin.ts` / `SkinSettings`)
- Use `providers` and `headerExtra` slots in `pactor-app` to inject global providers and settings entry

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

## Workflow: routing, resources, permissions

- **Routing** (`pactor-router`): dynamic routes from bootstrap `menus`, supports Path Matcher, params, hidden routes
- **Resources** (`pactor-resource`): loads page/fragment DSL with HttpDslResourceLoader or StaticDslLoader, cache, versioning
- **Permissions** (`pactor-permission`): page/menu/component/action guards. Frontend permissions only control UI; backend APIs must still authorize

Bootstrap orchestration:

```text
load bootstrap → write PermissionStore → build MenuRegistry → resolve layout → assemble shared registries → render page
```

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
pnpm docs:dev

# examples
pnpm --filter example-vite-starter dev   # minimal starter
pnpm --filter example-admin dev          # shadcn admin dashboard (skin settings)
pnpm --filter example-chat dev           # AI chat example

# pactor-cli
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

- **Do not** import UI kit internals directly into business DSL pages; use registered component names.
- **Do not** write `if (type === 'Button')` branches in a Renderer; use `ComponentRegistry`.
- **Do not** inject JavaScript from the server into DSL; register actions/services/capabilities in the frontend.
- **Do not** rely on frontend permission checks for security; enforce authorization on backend APIs.
- **Do not** forget to import `pactor-ui/styles.css` when using the default shadcn kit.

## References

- Framework design specification: `docs/src/content/docs/framework-design.md`
- Quick start: `docs/src/content/docs/guides/getting-started.md`
- pactor-app docs: `docs/src/content/docs/packages/app.md`
- Example projects:
  - `examples/vite-starter` — minimal starter
  - `examples/admin` — shadcn admin dashboard with skin settings
  - `examples/chat` — AI chat

## How to use this skill

This skill is maintained as `packages/skill/SKILL.md`. AI agents can copy or link this file into their skill directory to provide contextual guidance when reading or editing Pactor projects.
