# example-admin-antd

Pactor 管理后台示例的 **antd UI kit 版**：与 `example-admin`（Radix kit）共享完全相同的页面 DSL 与 mock 代码，仅 `main.tsx` 切换 `ui: antdUiKit`——演示"同一 DSL 双 UI kit 运行"。

## 启动

```bash
pnpm install
pnpm --filter example-admin-antd dev    # vite dev，端口 5299
pnpm --filter example-admin-antd build  # 构建（插件构建期强校验全部页面 YAML）
```

打开 <http://localhost:5299/>，以演示账号 **admin / pactor123** 登录。

## 与 example-admin 的差异（仅两处）

1. `src/main.tsx`：`createPactorApplication({ ui: antdUiKit, ... })`，样式导入为 `antd/dist/reset.css`（antd v5+ CSS-in-JS 无需组件样式表；不导入 `pactor-ui-radix/styles.css` 与 `--pcr-*` 皮肤 `theme.css`）。
2. 端口 5299（example-admin 为 5199）。

页面 DSL（`src/pages/*.page.yaml`）、`auth.ts` / `services.ts` / `bootstrap.ts` 与 Radix 版逐字节一致——DSL 只面向框架级协议，不感知 UI 实现。

## 演示点清单

与 example-admin 相同（登录全流程、布局随会话切换、菜单权限过滤、隐藏详情页、表达式绑定、service 数据源、Form 查询链路、抽屉编辑回填、命名动作结果链路、navigate、route.params、组件权限 denied、自定义动作扩展），差异仅在渲染层为 antd 组件。

详见 [example-admin 的 README](../admin/README.md)。
