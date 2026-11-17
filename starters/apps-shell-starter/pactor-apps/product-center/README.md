# 产品中心（product-center）

产品管理 / 产品配置设置 / 产品状态任务看板三个页面示例，以 **Pactor UI 模块** 交付。

## 页面

| 路径（模块内） | 页面 | 内容 |
| --- | --- | --- |
| `/products` | 产品管理 | 产品指标、筛选条、产品列表（编码 / 分类 / 负责人 / 状态）、新建产品弹窗、跳转任务看板 |
| `/settings` | 产品配置设置 | 基础配置（产品线 / 编码前缀 / 默认分类与负责人）、流程配置（审核 / 通知 / 上架周期）、通知配置 |
| `/board` | 产品状态任务看板 | 待规划 / 进行中 / 评审中 / 已上线四列任务卡片，展示优先级、负责人、截止时间，支持详情弹层与推进反馈 |

页面全部是纯 DSL 示例（静态 state 数据），没有服务端依赖；接入真实接口时把 `state` 换成 `dataSources` / `request`，并把表单提交改成 `request`。

## 运行

```bash
pnpm install
pnpm dev        # http://localhost:8022（/ 跳转 /products）
```

独立运行时由 `ModuleSidebar` 提供二级导航；接入 Shell 后由 Shell 的 `admin` 布局与 Shell 菜单接管。

## 打包与接入

```bash
pnpm build:module   # dist-module/（Manifest V1 + DSL + client + assets）
pnpm pack:module    # product-center-0.1.0.tgz
```

Shell 侧以 `file:` 安装 tgz，并在 `web-shell/src/modules/module-list.json` 中启用：

```json
{ "package": "product-center", "enabled": true, "menuMode": "hidden" }
```

导航由 `web-shell/src/shell/sitemap.yaml` 统一定义（模块菜单不参与），公开路径为
`/product-center/products`、`/product-center/settings`、`/product-center/board`。

## 结构

| 路径 | 说明 |
| --- | --- |
| `app/` | 独立运行入口（PactorApp 常驻 layout、sitemap API） |
| `module/client.ts` | 模块 client entry：样式入口 + `ModuleSidebar` 注册 |
| `src/server/yaml/` | sitemap 与三个页面 DSL |
| `src/pactor/` | PactorApp 配置、`ModuleSidebar`、页面样式 |
| `app/theme.css` | 独立运行时的基础皮肤令牌（接入 Shell 后由 Shell 提供） |
