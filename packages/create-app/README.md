# create-pactor-app

Pactor 应用脚手架：一条命令从内置模板生成业务工程。

## 用法

```bash
pnpm create pactor-app my-app            # 交互选择模板（非 TTY 默认 next-app）
pnpm create pactor-app my-app -t next-app  # Next.js 全栈模板（含 mock API）
pnpm create pactor-app my-app -t spa       # Vite 纯前端模板
```

等价于运行 npm 包 `create-pactor-app` 的 bin（`npm create` / `pnpm create` 约定）。

生成后：

```bash
cd my-app
pnpm install
pnpm dev
```

## 模板

- `next-app`：Next.js 全栈动态页面工程，含 mock API（dev 端口 9011）
- `spa`：Vite + React 纯前端工程（dev 端口 9012）

模板由 `pnpm sync-templates` 从仓库 `starters/` 同步生成，依赖中的 `link:` 会被改写为已发布的 `^<version>`。

## 退出码

- `0` 成功
- `2` 用法错误 / 目标目录已存在且非空（不覆盖任何内容）
