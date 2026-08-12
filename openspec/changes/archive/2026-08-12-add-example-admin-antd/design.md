# Design: add-example-admin-antd

## 决策

### D1：独立工程复用 DSL，而非参数化切换

新增 `examples/admin-antd` 拷贝 example-admin 的页面 YAML 与 mock TS（auth/services/bootstrap），不抽公共包。理由：示例的价值是可独立阅读、可整体拷贝走；跨示例抽象会让两个示例都难以自洽阅读。DSL 完全相同本身就是"契约一致性"的演示。

### D2：UI kit 切换点只在 main.tsx

`createPactorApplication({ ui: antdUiKit, ... })` + `import 'antd/dist/reset.css'`；不导入 `pactor-ui-radix/styles.css` 与 `theme.css`（后者是 `--pcr-*` 变量皮肤，antd 不适用）。其余代码（路由守卫、`service.call` / `app.reload` 自定义动作、loader）与 Radix 版一致。

### D3：端口与命名

包名 `example-admin-antd`，dev 端口 5299（strictPort），避免与 example-admin(5199) / docs(4334) 冲突。

## 影响面

- 新增 `examples/admin-antd/`：`package.json` / `vite.config.ts` / `tsconfig.json` / `index.html` / `README.md` / `src/{main.tsx,auth.ts,bootstrap.ts,services.ts,dsl-modules.d.ts}` / `src/pages/*.page.yaml`。
- 无框架代码改动。
