## ADDED Requirements

### Requirement: Skill is discoverable and correctly triggered
The pactor skill SHALL activate when any user requests help with rapidly building pactor applications, including bootstrapping apps, authoring custom components, configuring themes, wiring events, adding routes or resources, or integrating permissions.

#### Scenario: User asks how to build a pactor app
- **WHEN** the user asks a question that mentions "pactor", "createPactorApplication", or pactor package names such as `pactor-core`, `pactor-runtime`, `pactor-app`, `pactor-router`, `pactor-resource`, `pactor-permission`, `pactor-ui-radix`, or `pactor-ui-antd`
- **THEN** the active agent loads the pactor skill and uses its guidance to answer

### Requirement: Skill provides framework overview
The pactor skill SHALL describe the framework's purpose, package responsibilities, dependency direction, and naming conventions so the user can navigate the codebase correctly.

#### Scenario: User asks about pactor architecture
- **WHEN** the user asks about the pactor framework structure or how packages relate
- **THEN** the skill explains the dependency chain `core ← schema ← expression ← runtime ← {permission, resource, router, ui-antd} ← ui-radix ← app`, the role of each package, and the convention that packages use the `pactor-` npm prefix

### Requirement: Skill documents common workflows
The pactor skill SHALL provide step-by-step guidance for the most common development workflows.

#### Scenario: User wants to bootstrap a new pactor app
- **WHEN** the user asks how to create a new pactor application
- **THEN** the skill explains `createPactorApplication`, the application shell, DSL loaders, and references `examples/vite-starter` or `examples/admin`

#### Scenario: User wants to create a custom component
- **WHEN** the user asks how to add a custom component
- **THEN** the skill explains the component registration contract, ui-kit convention, and where to place React components so the runtime can resolve them

#### Scenario: User wants to theme an app
- **WHEN** the user asks about pactor theming
- **THEN** the skill explains the theming system, provider slots, and references `examples/admin-antd` for skin settings

#### Scenario: User wants to handle events or data flow
- **WHEN** the user asks about events or data flow in pactor
- **THEN** the skill describes the event bridge, action engine, and how components publish and subscribe to events

### Requirement: Skill references common project commands
The pactor skill SHALL list the typical commands used to build, test, and develop pactor projects.

#### Scenario: User asks how to run tests or build a pactor project
- **WHEN** the user asks for build, test, typecheck, or documentation commands
- **THEN** the skill provides common commands such as `pnpm build`, `pnpm test`, `pnpm typecheck`, and example-specific filter commands when applicable

### Requirement: Skill is packaged as a pactor package
The pactor skill SHALL be delivered as a monorepo package `pactor-skill` under `packages/skill/` containing `SKILL.md` and `package.json`.

#### Scenario: Skill package is inspected
- **WHEN** a developer opens `packages/skill/`
- **THEN** they find `SKILL.md` with YAML frontmatter and markdown sections, plus `package.json` declaring the package name `pactor-skill`

### Requirement: Skill format is consistent with existing agent skills
The pactor skill `SKILL.md` SHALL use YAML frontmatter and markdown sections, matching the structure of existing agent skills.

#### Scenario: Skill file is inspected
- **WHEN** a developer opens `packages/skill/SKILL.md`
- **THEN** the file contains `name`, `description`, and `version` frontmatter followed by sections for triggers, framework overview, rapid-build workflows, and references
