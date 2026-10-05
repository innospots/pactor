---
title: "@pactor-app/skills"
description: 面向 AI agent 的 Pactor 开发 skill 集合包——一次安装获得全部 skill，用于快速构建 Server-Driven UI 应用
---

`@pactor-app/skills` 是面向 AI agent 的 skill 集合包：一次安装获得全部 skill，帮助任意 AI agent 在协助开发者使用 Pactor 框架时提供上下文感知的指导。每个 skill 是一个自包含目录（`SKILL.md` + 可选 `references/`），目录名与 frontmatter `name` 均以 **`pactor-`** 为前缀。

在 Pactor monorepo 内，源目录位于**仓库根** [`skills/`](https://github.com/426-330/pactor/tree/main/skills)（pnpm workspace 成员）。

## 安装

```bash
npm install -D @pactor-app/skills
# 或
pnpm add -D @pactor-app/skills
```

安装后把需要的 skill 目录（`references/`、`template/` 须一并保留）复制或链接到 agent 的 skill 目录：

```bash
# 例如 Claude Code：~/.claude/skills/<skill-name>/
ln -s node_modules/@pactor-app/skills/pactor-dsl ~/.claude/skills/pactor-dsl
ln -s node_modules/@pactor-app/skills/pactor-project ~/.claude/skills/pactor-project
ln -s node_modules/@pactor-app/skills/pactor-prd ~/.claude/skills/pactor-prd
```

克隆本仓库时可直接链到仓库内 `skills/`：

```bash
ln -sf ../../skills/pactor-dsl .cursor/skills/pactor-dsl   # 在 .cursor/skills 下执行
```

## 已发布 skill

| Skill id | 说明 |
| --- | --- |
| `pactor-dsl` | Pactor 框架与 DSL：编写 `*.page.yaml`、组件/动作/服务、主题、路由/资源/权限、Chat |
| `pactor-project` | 初始化工程：`pnpm create pactor-app`（npm 包 `create-pactor-app`）、模板选型、脚手架后检查 |
| `pactor-prd` | PRD + Markdown 线框图 → 可运行 Next + Pactor 应用（http 数据源、mock、换肤、浏览器验收） |

## 位置与扩展

- 源目录：`skills/pactor-<topic>/`（`SKILL.md` + 可选 `references/` / `template/`）
- 新增 skill：在 `skills/` 下新建 `pactor-<topic>/`，`name` 与目录名一致，下次发布随包带上

## pactor-dsl 详情

`pactor-dsl`（源文件 `skills/pactor-dsl/SKILL.md`，英文）在以下场景激活：

- 构建、启动或扩展 Pactor 应用
- 使用 `createPactorApplication` 或 `@pactor-app/app`
- 编写 Pactor YAML/JSON DSL
- 创建自定义组件或自定义 UI 覆盖点
- 配置主题、布局、菜单、路由、资源、权限
- 处理事件联动、表单联动、动作编排
- 提到 `@pactor-app/core`、`@pactor-app/runtime`、`@pactor-app/app` 等包名

SKILL.md 包含：激活触发词、能力范围、框架定位、包职责一览、依赖规则、最小启动示例、shadcn 组件目录、Workflows、常用命令、设计原则、常见坑与参考文档。

## 与文档站的关系

本页是 skill 包集合的说明入口；详细的 skill 内容请直接阅读各 `SKILL.md` 与仓库内 [`skills/README.md`](https://github.com/426-330/pactor/blob/main/skills/README.md)。
