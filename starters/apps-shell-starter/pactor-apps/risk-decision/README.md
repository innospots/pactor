# 风险决策 · 总览

从 `nextjs-version` 拆出的独立工程，保留「风险决策 / 总览」（根路径 `/`）
与「对接日志」（`/integration-logs`），登录、集成对接、策略沙盘、风险决策等
其他模块均已移除。页面铺满视口，左侧一二级菜单已移除。

## 运行

```bash
pnpm install
pnpm dev        # http://localhost:8022
```

生产构建：

```bash
pnpm build
pnpm start      # http://localhost:8022
```

## 结构

| 路径 | 说明 |
| --- | --- |
| `app/layout.tsx` | 根布局，挂载 `PactorApp`（跨路由常驻） |
| `app/api/sitemap/route.ts` | 下发内联了布局 / 页面 DSL 的 sitemap |
| `src/server/yaml/` | sitemap 与页面 YAML DSL |
| `src/pactor/components/` | 外壳与页面样式 |

页面由 Pactor server-driven UI 渲染：`src/server/yaml/risk-decision/` 下的
总览页与对接日志页与源工程保持一致，仅移除了依赖宿主应用的 `risk.enterPage`
生命周期。
