# __APP_NAME__

由 `pactor create` 生成的 Pactor 业务工程：vite + react + pactor-app + pactor-ui + pactor-vite-plugin。

```bash
pnpm install
pnpm dev
```

- `src/pages/home.page.yaml`：示例 Page DSL，经 pactor-vite-plugin 在构建期转换为 JS 模块
- `src/main.tsx`：`createPactorApplication` + `StaticDslLoader`（本地 DSL 开发）；接入服务端后改用 `api: { baseURL: '/api/runtime' }`
- 默认 UI kit 为 shadcn，`pactor-ui/styles.css` 样式导入为必需步骤

## 说明

- 依赖版本为语义化占位（`^0.1.0` 等），请在 Pactor 发布后按实际版本对齐。
- 如需 `*.page.yaml` 的 TypeScript 类型声明，按 pactor-vite-plugin 文档添加 `src/dsl-modules.d.ts`。
- 常用命令：`pactor validate src/pages/*.page.yaml`、`pactor lint src`、`pactor build src/pages -o dist/runtime`。
