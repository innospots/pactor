---
title: "@pactor-app/skills"
description: 面向 AI agent 的 Pactor 开发 skill 集合包——一次安装获得全部 skill，用于快速构建 Server-Driven UI 应用
---

`@pactor-app/skills` 是面向 AI agent 的 skill 集合包：一次安装获得全部 skill，帮助任意 AI agent 在协助开发者使用 Pactor 框架时提供上下文感知的指导。每个 skill 是一个自包含目录（`SKILL.md` + 可选 `references/`），随包发布、随包扩展。

## 安装

```bash
npm install -D @pactor-app/skills
# 或
pnpm add -D @pactor-app/skills
```

安装后把需要的 skill 目录（`references/` 必须一并保留）复制或链接到 agent 的 skill 目录：

```bash
# 例如 Claude Code：~/.claude/skills/<skill-name>/
ln -s node_modules/@pactor-app/skills/pactor ~/.claude/skills/pactor
ln -s node_modules/@pactor-app/skills/prd-to-app ~/.claude/skills/prd-to-app
```

## 已发布 skill

| Skill | 说明 |
| --- | --- |
| `pactor` | Pactor 框架指导：DSL 编写、自定义组件/动作/服务、主题、路由/资源/权限 |
| `prd-to-app` | 将 PRD 文档 + Markdown 线框图生成可运行的 pactor 应用（页面 YAML DSL，http 数据源 + mock 路由） |

## 位置与扩展

- 源目录：`packages/skills/<skill-name>/`（`SKILL.md` + 可选 `references/`，直接位于包根）
- 新增 skill：在包根下新建 `<skill-name>/` 目录，编写带 YAML frontmatter（`name` 与目录名一致）的 `SKILL.md`，按需加 `references/`，下次发布随包自动带上

## pactor skill 详情

`pactor`（源文件 `packages/skills/pactor/SKILL.md`，英文）在以下场景激活：

- 构建、启动或扩展 Pactor 应用
- 使用 `createPactorApplication` 或 `@pactor-app/app`
- 编写 Pactor YAML/JSON DSL
- 创建自定义组件或自定义 UI 覆盖点
- 配置主题、布局、菜单、路由、资源、权限
- 处理事件联动、表单联动、动作编排
- 提到 `@pactor-app/core`、`@pactor-app/runtime`、`@pactor-app/app` 等包名

SKILL.md 包含：激活触发词、能力范围、框架定位、包职责一览、依赖规则、最小启动示例、shadcn 组件目录、Workflows（DSL 页面编写 / 自定义组件 / 事件与数据流 / 主题与皮肤 / 路由资源权限 / AI 对话工作区）、常用命令、设计原则、常见坑与参考文档。

## 与文档站的关系

本页是 skill 包集合的说明入口；详细的 skill 内容请直接阅读各 `SKILL.md`。skill 内容使用英文编写，以便不同 agent 平台通用。
