# 最小 Vite 工程：`pactor create` 与手写接入

## `pactor create`（@pactor-app/cli）

```bash
pnpm add -D @pactor-app/cli
pnpm pactor create my-app
cd my-app && pnpm install && pnpm dev
```

- 当前仅模板 id **`app`**（`-t app` 可省略）
- 生成物：Vite + React + `@pactor-app/vite-plugin` + `StaticDslLoader` + 示例 `*.page.yaml`
- 适合：单页或少量静态 DSL、原型、学习 Runtime，**不含** sitemap / Next / 登录 mock

与官方 `create-pactor-app` 关系：

| 命令 | 包 | 产出 |
| --- | --- | --- |
| `pnpm create pactor-app` | npm 包 `create-pactor-app`（skill：`pactor-project`） | next-app 或 spa（SitemapApp 驱动） |
| `pnpm pactor create` | `@pactor-app/cli` | 最小 Vite + StaticDslLoader |

## 手写接入检查表（已有 Vite 项目）

1. 依赖：

```bash
pnpm add @pactor-app/app @pactor-app/ui @pactor-app/resource react react-dom
pnpm add -D @pactor-app/vite-plugin
```

2. `vite.config.ts`：`plugins: [react(), pactor()]`
3. 入口：`import '@pactor-app/ui/styles.css'`
4. `StaticDslLoader` 的 `bootstrap.menus` + `pages` 与 YAML 里 `page.id` 一致
5. 校验：`pnpm pactor validate 'src/**/*.page.yaml'`

## monorepo 参考

- `examples/vite-starter` — 与 CLI `app` 模板同思路的 workspace 示例（:5499）
- 修改 `packages/*` 后需根目录 `pnpm build`，示例才读到新 dist
