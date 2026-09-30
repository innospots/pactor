# @pactor-app/skill

Agent skill for rapidly building [Pactor](https://github.com/426-330/pactor) Server-Driven UI applications.

## Contents

- `SKILL.md` — The skill definition consumed by AI agents.
- `references/dsl-authoring.md` — Full DSL grammar, action catalog, expression/scope tables, and page recipes. `SKILL.md` directs agents to read it before writing `*.page.yaml` files.

## Purpose

This package centralizes framework guidance so that any AI agent can assist users in bootstrapping Pactor apps, generating DSL page files, authoring custom components, wiring events, theming, and integrating routes/resources/permissions without scattering knowledge across README files.

## Usage

Copy or symlink the whole `packages/skill` directory into your agent's skill directory (the `references/` subfolder must come along — `SKILL.md` points to it for DSL authoring). The skill uses standard YAML frontmatter (`name`, `description`, `version`) followed by markdown guidance.

## License

MIT
