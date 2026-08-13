## Why

Developers using the pactor framework need a reusable, agent-agnostic skill to build Server-Driven UI applications quickly. Currently, framework conventions, package boundaries, and recommended workflows are scattered across README.md, `docs/src/content/docs/`, and `MEMORY.md`. A dedicated `pactor-skill` package will centralize this knowledge as an activation-triggered assistant that any AI agent can use to help users rapidly construct pactor applications, reducing ramp-up time and preventing common anti-patterns.

## What Changes

- Create a new package `pactor-skill` under `packages/skill/` containing `SKILL.md` and supporting package metadata.
- The skill will define clear activation triggers focused on rapidly building pactor applications (bootstrapping apps, creating custom components, wiring DSL/runtime/theming/router/permission/resource).
- Provide structured, action-oriented guidance covering:
  - Framework architecture and package responsibilities (`pactor-core`, `pactor-runtime`, `pactor-app`, `pactor-ui-radix`, `pactor-ui-antd`, etc.).
  - Dependency direction and zero-leak rules (`core ← schema ← expression ← runtime ← … ← app`).
  - Rapid-build workflows: scaffolding an app, authoring a custom component, wiring events, theming, adding routes/resources, and integrating permissions.
  - Typical project commands and how to extend a pactor application.
- No framework source code or runtime behavior changes; this is a user-facing developer-experience artifact.

## Capabilities

### New Capabilities

- `pactor-skill`: Agent-agnostic skill package for rapidly building pactor applications.

### Modified Capabilities

- None.

## Impact

- New package directory `packages/skill/` containing `SKILL.md`, `package.json`, and optional `README.md`.
- The skill is designed for general use by any AI agent assisting users who build pactor applications, not only maintainers of this repository.
- Optional references from `docs/src/content/docs/` or `MEMORY.md` once the skill is live.
- No impact on existing packages, APIs, examples, or tests.
