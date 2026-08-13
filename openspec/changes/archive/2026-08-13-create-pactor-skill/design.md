## Context

The pactor framework is a TypeScript/ React-based Server-Driven UI runtime. Its packages are documented in `README.md` and `docs/src/content/docs/`, but there is no reusable, agent-agnostic skill that any AI agent can load to help users rapidly build pactor applications. Existing agent skills in this environment (e.g., `agents-sdk`, `cloudflare`, `wrangler`) follow a consistent pattern: a single `SKILL.md` with frontmatter triggers, scope description, and structured guidance. This change follows the same pattern to create a skill whose primary goal is fast pactor application development.

## Goals / Non-Goals

**Goals:**

- Define an agent-agnostic skill package `pactor-skill` that activates automatically when a user wants to build a pactor application quickly.
- Provide concise, accurate, action-oriented guidance on framework architecture, package boundaries, dependency direction, and rapid-build workflows.
- Include practical examples and command references applicable to typical pactor projects.
- Follow the same `SKILL.md` format as existing agent skills.

**Non-Goals:**

- Modifying framework source code, examples, or tests.
- Replacing the full documentation site; the skill is a quick reference, not exhaustive docs.
- Adding new runtime features or API changes to pactor packages.

## Decisions

- **Skill package location: `packages/skill/`**
  The skill is distributed as a first-class pactor package named `pactor-skill`. It contains `SKILL.md` plus `package.json` metadata so it can be versioned, built, and installed alongside other pactor packages. This keeps the skill in the monorepo and lets users copy or link it into their agent's skill directory.

- **Single SKILL.md with frontmatter**
  Existing agent skills use YAML frontmatter (`name`, `description`, `version`) followed by markdown sections. This keeps the skill discoverable and lets agents parse activation metadata. We follow the same convention as the `innospots-nexus-base` reference doc provided at `docs/src/content/docs/SKILL.md`.

- **Activation triggers**
  Triggers cover building pactor apps, creating custom components, theming, routing, permissions, resources, and events. This prevents false activation while capturing the common intents of pactor developers.

- **Content scope**
  The skill focuses on "how to quickly build pactor applications" rather than "how pactor is implemented internally". It includes package map, dependency rules, common commands, and rapid-build workflow patterns (bootstrap → component → theme → route → permission → test).

- **No examples copied verbatim**
  The skill references example paths (e.g., `examples/admin`, `examples/admin-antd`) instead of duplicating their code, reducing maintenance when examples evolve.

## Risks / Trade-offs

- **[Risk] Skill drifts out of sync with framework changes** → Mitigation: keep the skill high-level and reference canonical files (`README.md`, `docs/src/content/docs/framework-design.md`, `MEMORY.md`). The skill tells users *where* to look, not every detail.
- **[Risk] Overly broad activation triggers false positives** → Mitigation: triggers explicitly include "pactor" and framework-specific package names (`pactor-core`, `pactor-runtime`, etc.), avoiding generic frontend terms.
- **[Trade-off] Skill is a package, but agents still need to load it** → The package lives in `packages/skill/`, so users must copy or symlink `SKILL.md` into their agent's skill directory (e.g., `.agents/skills/pactor/`). The content is written as a general, reusable skill so it is ready for wider distribution.

## Migration Plan

Not applicable. The skill is a new, additive documentation artifact with no runtime deployment or migration steps.
