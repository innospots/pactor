---
title: "@pactor-app/skill"
description: 面向 AI agent 的 Pactor 开发 skill，用于快速构建 Server-Driven UI 应用
---

`@pactor-app/skill` 是一个 agent skill 包，帮助任意 AI agent 在协助开发者使用 Pactor 框架时提供上下文感知的指导。

## 位置

- 包目录：`packages/skill/`
- skill 文件：`packages/skill/SKILL.md`（英文）

## 用途

将 `packages/skill/SKILL.md` 复制或链接到 agent 的 skill 目录后，当用户询问 Pactor 相关问题时，agent 会自动加载该 skill，获得以下能力：

- 解释 Pactor 框架定位、架构分层与包职责
- 指导 `createPactorApplication` 启动应用
- 指导自定义组件、动作、服务、能力的注册
- 说明数据流、表达式、事件、动作编排
- 提供主题/皮肤、路由、资源加载、权限控制的接入思路
- 列出 Pactor 项目常用命令与示例工程入口

## 触发场景

skill 在以下场景激活：

- 构建、启动或扩展 Pactor 应用
- 使用 `createPactorApplication` 或 `@pactor-app/app`
- 编写 Pactor YAML/JSON DSL
- 创建自定义组件或自定义 UI 覆盖点
- 配置主题、布局、菜单、路由、资源、权限
- 处理事件联动、表单联动、动作编排
- 提到 `@pactor-app/core`、`@pactor-app/runtime`、`@pactor-app/app` 等包名

## 内容结构

`packages/skill/SKILL.md` 包含：

1. **When to activate** — 激活触发词
2. **What you can do with this skill** — skill 能力范围
3. **Framework in one sentence** — Pactor 框架定位
4. **Package map** — 各包职责一览
5. **Dependency rules** — 依赖方向与禁区
6. **Quick start** — 最小启动示例
7. **UI at a glance** — shadcn 组件目录与注意事项
8. **Workflows** — 自定义组件、事件与数据流、主题、路由/资源/权限、AI 对话工作区
9. **Common commands** — 常用命令
10. **Design principles** — 设计原则速查
11. **Common pitfalls** — 常见坑与禁止事项
12. **References** — 参考文档与示例工程

## 在项目中使用

1. 打开 `packages/skill/SKILL.md`
2. 将其复制到 agent 的 skill 目录（例如 `.agents/skills/pactor/SKILL.md`）
3. 当 agent 处理 Pactor 项目时，skill 会自动提供上下文指导

## 与文档站的关系

本页是 `@pactor-app/skill` 的说明入口；详细的 skill 内容请直接阅读 `packages/skill/SKILL.md`。skill 内容使用英文编写，以便不同 agent 平台通用。
