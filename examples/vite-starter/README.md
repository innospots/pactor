# example-vite-starter

最小 pactor 应用：演示 `@pactor/vite-plugin` 的"YAML 即模块"工作流——`.page.yaml` 在构建期完成 Parse → Validate → Compile，像普通 TS 模块一样 import，改文件即热更新。

## 启动

```bash
pnpm install
pnpm --filter example-vite-starter dev   # http://localhost:5499
```

## 它演示什么

- `vite.config.ts` 挂上 `pactor()` 插件后，`src/main.tsx` 直接 `import homePage from './pages/home.page.yaml'`；
- `src/pages/home.page.yaml`：一个待办清单页——Alert / Form（提交 → `setState` + `reload`）/ Table（`type: service` 数据源绑 `${state.keyword}`）；
- `src/services.ts`：内存 mock service（真实应用换成你的后端）；
- `src/dsl-modules.d.ts`：让 TS 识别 `*.page.yaml` 模块的声明文件（抄走即可）。

## 试试插件的两个特性

1. **HMR**：dev 状态下修改 `home.page.yaml`（比如改 `page.title`），页面即时更新。
2. **构建期校验**：把 yaml 改坏（比如删掉 `page.id` 或把 `dsl` 版本写错），dev/build 立即报错，信息含文件与字段路径，如 `/page/id: must have required property 'id'`（改回即恢复）。注意组件 `props` 是开放的（由各组件自行解释），Schema 校验管的是 DSL 结构。

## 下一步

需要登录、路由、权限、抽屉编辑、双 UI kit 的完整形态，看 `examples/admin`（Radix）与 `examples/admin-antd`（antd）；AI 对话场景看 `examples/chat`。
