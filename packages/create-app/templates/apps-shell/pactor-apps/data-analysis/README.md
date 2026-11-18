# 数据分析（data-analysis）

数据看板 / 数据报表 / 用户分析 / 数据详情四个页面示例，以 **Pactor UI 模块** 交付。

## 页面

| 路径（模块内） | 页面 | 内容 |
| --- | --- | --- |
| `/dashboard` | 数据看板 | 累计访问 / 活跃用户 / 转化率 / 人均停留，访问趋势、渠道构成、新增用户、数据健康、热门页面 |
| `/reports` | 数据报表 | 报表指标、筛选条、报表列表（类型 / 周期 / 负责人 / 状态）、查看与下载 |
| `/users` | 用户分析 | 活跃 / 新增 / 留存 / 付费指标，活跃趋势、用户分层、地域分布、关键洞察、分层明细 |
| `/detail` | 数据详情 | 报表元信息、核心指标趋势、渠道构成、逐日明细；从「数据报表」页查看进入 |

页面全部是纯 DSL 示例（静态 state 数据），没有服务端依赖；接入真实接口时把 `state` 换成 `dataSources` / `request` 即可。

## 运行

```bash
pnpm install
pnpm dev        # http://localhost:8021（/ 跳转 /dashboard）
```

独立运行时由 `ModuleSidebar` 提供二级导航；接入 Shell 后由 Shell 的 `admin` 布局与 Shell 菜单接管。

## 打包与接入

```bash
pnpm build:module   # dist-module/（Manifest V1 + DSL + client + assets）
pnpm pack:module    # data-analysis-0.1.0.tgz
```

Shell 侧以 `file:` 安装 tgz，并在 `web-shell/src/modules/module-list.json` 中启用：

```json
{ "package": "data-analysis", "enabled": true, "menuMode": "hidden" }
```

导航由 `web-shell/src/shell/sitemap.yaml` 统一定义（模块菜单不参与），公开路径为
`/data-analysis/dashboard`、`/data-analysis/reports`、`/data-analysis/users`、
`/data-analysis/detail`。

## 结构

| 路径 | 说明 |
| --- | --- |
| `src/app/` | 独立运行入口（PactorApp 常驻 layout、sitemap API） |
| `module/client.ts` | 模块 client entry：样式入口 + `ModuleSidebar` 注册 |
| `src/backend/pages/yaml/` | sitemap 与四个页面 DSL |
| `src/frontend/` | PactorApp 配置、`ModuleSidebar`、页面样式 |
| `src/app/theme.css` | 独立运行时的基础皮肤令牌（接入 Shell 后由 Shell 提供） |
