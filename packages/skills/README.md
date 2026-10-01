# @pactor-app/skills

Agent skills for rapidly building [Pactor](https://github.com/426-330/pactor) Server-Driven UI applications. One install, all skills.

## Install

```bash
npm install -D @pactor-app/skills
# 或
pnpm add -D @pactor-app/skills
```

## Shipped skills

| Skill | Description |
| --- | --- |
| `pactor` | Pactor framework guidance: DSL authoring, custom components/actions/services, theming, routing, resources, permissions. See `pactor/SKILL.md`. |
| `prd-to-app` | Generate a runnable pactor app from PRD documents and markdown wireframes (pages in YAML DSL, http dataSources + mock API routes). See `prd-to-app/SKILL.md`. |

## Usage

Each skill is a self-contained directory (`SKILL.md` + optional `references/` and `template/`). Copy or symlink the skill directory you need into your agent's skill directory (the `references/` subfolder must come along — `SKILL.md` points to it; `prd-to-app` additionally needs its `template/` starter project):

```bash
# 例如 Claude Code：~/.claude/skills/<skill-name>/
ln -s node_modules/@pactor-app/skills/pactor ~/.claude/skills/pactor
ln -s node_modules/@pactor-app/skills/prd-to-app ~/.claude/skills/prd-to-app
```

Skills use standard YAML frontmatter (`name`, `description`, `version`) followed by markdown guidance.

## Adding a skill

1. Create `<skill-name>/` directly under the package root.
2. Write `SKILL.md` with standard YAML frontmatter (`name` consistent with the directory name) and add `references/` if the skill needs deep documentation.
3. The skill ships with the package automatically on next publish.

## License

MIT
