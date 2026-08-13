## 1. Prepare skill package

- [x] 1.1 Create `packages/skill/` directory.
- [x] 1.2 Add `package.json` declaring the package name `pactor-skill`, version `1.0.0`, and appropriate metadata.
- [x] 1.3 Write `SKILL.md` with YAML frontmatter (`name: pactor`, `description`, `version: 1.0.0`) and an overview section focused on rapid application development.

## 2. Write framework overview section

- [x] 2.1 Document pactor's purpose as a Server-Driven UI / AI-Native frontend runtime.
- [x] 2.2 List each `packages/*` responsibility and the `pactor-*` npm naming convention.
- [x] 2.3 Explain the strict dependency direction `core ← schema ← expression ← runtime ← {permission, resource, router, ui-antd} ← ui-radix ← app`.

## 3. Document rapid-build workflows

- [x] 3.1 Add "Bootstrap an application" workflow referencing `createPactorApplication` and `examples/vite-starter` / `examples/admin`.
- [x] 3.2 Add "Create a custom component" workflow covering ui-kit registration and runtime resolution.
- [x] 3.3 Add "Theming and skin settings" workflow referencing `examples/admin-antd` and provider slots.
- [x] 3.4 Add "Events and data flow" workflow covering the event bridge and action engine.
- [x] 3.5 Add "Routes, resources, and permissions" workflow with package pointers.

## 4. Add common project commands

- [x] 4.1 List typical build/test/typecheck/docs commands for pactor projects (`pnpm build`, `pnpm test`, `pnpm typecheck`, `pnpm docs:dev`).
- [x] 4.2 Mention that exact commands depend on the project's package manager and workspace setup.

## 5. Finalize and verify

- [x] 5.1 Review `SKILL.md` against `docs/src/content/docs/SKILL.md` for consistent structure and tone.
- [x] 5.2 Ensure activation triggers explicitly mention pactor-specific terms to avoid false activation.
- [x] 5.3 Confirm the skill is agent-agnostic and does not reference Kimi Code-specific mechanisms.
- [x] 5.4 Confirm the skill's primary goal is rapid pactor application development.
- [x] 5.5 Confirm `packages/skill/` follows monorepo conventions (package name, no unintended dependencies).
- [x] 5.6 Confirm no framework source code or tests were modified.
