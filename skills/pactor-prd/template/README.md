# pactor-prd 模板工程

可运行的参考实现：Next.js + pactor，页面全部 YAML DSL 描述（`src/server/yaml/`），数据一律 http 数据源，经纯转发层（`app/api/d/[...parts]`）转发到 `NEXT_PUBLIC_API_BASE_URL`；没有服务层接口时返回空数据，页面按空态渲染。

## 包含内容

- **公共页面**：`yaml/common/`（login 登录页、dashboard 仪表盘）
- **两个参考模块**：
  - `yaml/provider/`（供应商：卡片式列表 / 详情 / 新增 / 编辑）
  - `yaml/route/`（路由：卡片式列表 / 单页纵向详情 / 单页表单新增 / 编辑）
- **完整接线**：`src/pactor/`（SitemapApp 接线、pageEndpoint、皮肤加载、自定义组件与动作）、`src/server/`（yaml 递归加载 + 会话裁剪）、`app/api/`（sitemap / public/pages / d 转发层 / auth / users）
- **三套皮肤**：`public/skins/`（深浅色俱全），侧栏换肤入口

## 使用方式

生成新项目时**整体复制本目录**作为起点（而不是从空模板开始），然后：

1. `package.json` 的 name 改为新工程名
2. `src/server/yaml/sitemap.yaml`：app 名称、pages、menus 按 PRD 页面清单重写（保留 layouts）
3. 保留 `common/` 公共页面按需调整；参考模块目录可保留作样板，新模块照其结构新增
4. 数据接口：dataSources 的 url 直接写最终接口路径（`/api/d/...`，路径即契约）；接真实后端时改 `next.config.js` 的 `API_BASE_URLS` 即可，页面 yaml 不动
5. `pnpm install && pnpm dev`（端口 9011）验证（无后端时数据区为空态）

## 演示账号

见 `src/server/accounts.ts`（模板自带演示账号，按需替换）。
