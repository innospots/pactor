# 风险分析 · 数据价值分析工作台

从 `nextjs-version` 拆出的独立单页工程，仅保留「风险分析 / 数据价值分析工作台」
（根路径 `/`），登录、其他工作台、任务、系统管理等均已移除。
页面铺满视口，左侧一二级菜单已移除。

## 运行

```bash
pnpm install
pnpm dev        # http://localhost:8021
```

生产构建：

```bash
pnpm build
pnpm start      # http://localhost:8021
```

## 结构

| 路径 | 说明 |
| --- | --- |
| `app/layout.tsx` | 根布局，挂载 `PactorApp`（跨路由常驻） |
| `app/api/sitemap/route.ts` | 下发内联了布局 / 页面 DSL 的 sitemap |
| `app/api/risk-analysis/*/route.ts` | standalone 薄路由，转调 `src/server/api/*` |
| `src/server/api/data-value.ts` | 页面数据响应（KPI / 分布 / 散点 / PSI） |
| `src/server/api/feature-source-summary.ts` | 特征来源汇总响应（服务端分页） |
| `module/server.ts` | 模块 server entry：逻辑路径 → 方法 handler |
| `src/server/yaml/` | sitemap 与页面 YAML DSL |
| `src/shared/data-value.ts` | 页面演示数据与按日期区间的派生逻辑 |
| `src/pactor/components/` | 外壳与页面样式 |

## 模块打包（tgz）

`pactor.module.json` 配置了 `serverEntry` 与 `apiPrefixes`，`pactor module build`
会把 `module/server.ts` 打成 `dist-module/server/index.mjs`，并把 DSL 中的
`/api/risk-analysis/*` 自动改写为 `/api/modules/pactor-app-risk-analysis/risk-analysis/*`。
服务端 API 随 tgz 分发，宿主 Shell 只需提供通用分发入口，无需复制业务路由。

- 公开 URL：`/api/modules/pactor-app-risk-analysis/risk-analysis/data-value`
  与 `/api/modules/pactor-app-risk-analysis/risk-analysis/feature-source-summary`。
- `app/api/risk-analysis/*` 仍保留，供本工程 standalone 运行使用。
- 使用 server entry 需要 `target: "innospots-web-shell@3"`。

```bash
pnpm build:module   # 构建 dist-module/（含 server/index.mjs）
pnpm pack:module    # 递增版本并生成 tgz
```

页面由 Pactor server-driven UI 渲染：`src/server/yaml/risk-analysis/risk-data-value.page.yaml`
与源工程保持一致，仅移除了依赖宿主应用的 `risk.enterPage` 生命周期。