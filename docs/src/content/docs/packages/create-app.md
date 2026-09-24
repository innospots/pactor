---
title: "create-pactor-app"
description: Pactor 应用脚手架——一条命令从内置模板生成业务工程（Next.js 全栈 / Vite 纯前端）
---

`create-pactor-app`（bin `create-pactor-app`，经 `pnpm create pactor-app` 调用）是 Pactor 应用脚手架：交互选择内置模板，生成可直接运行的业务工程。要求 Node.js >= 18。

```bash
pnpm create pactor-app my-app
```

## 用法

```bash
pnpm create pactor-app my-app -t next-app  # Next.js 全栈模板（含 mock API）
pnpm create pactor-app my-app -t spa       # Vite 纯前端模板
```

未指定 `-t` 时：交互终端编号选择模板（默认 next-app），非 TTY 环境直接使用 next-app。

```bash
pnpm create pactor-app my-app -t next-app -h  # 查看完整用法与退出码说明
```

生成后进入目录安装依赖并启动：

```bash
cd my-app
pnpm install
pnpm dev
```

## 模板

| 模板 | 形态 | dev 端口 | 说明 |
| --- | --- | --- | --- |
| `next-app` | Next.js 全栈动态页面工程 | 9011 | 含 mock API，覆盖运行时页面渲染链路 |
| `spa` | Vite + React 纯前端工程 | 9012 | 最小 DSL 渲染集成 |

模板由 `pnpm sync-templates` 从仓库 `starters/` 同步生成；同步时依赖中的 `link:` 协议会被改写为已发布版本号 `^<version>`。

## 退出码

| 退出码 | 语义 |
| --- | --- |
| `0` | 成功 |
| `2` | 用法错误；目标目录已存在且非空（不覆盖任何内容） |
