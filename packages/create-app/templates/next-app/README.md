# __APP_NAME__

基于 Next.js + Pactor DSL 的企业管理后台示例。工程结构与分层参考
`knowledge-base-ui`，保留模块导航、数据经营、工作台内置智能助手、系统管理、
主题和国际化能力；
不包含知识库、文档库、问答库、元数据页面及其示例数据。

## 已保留的能力

- **模块导航**：`sitemap.yaml` 驱动的侧边功能栏；多页面模块展开二级菜单，
  工作台直达页面不显示空的二级侧栏。
- **工作台**：统一入口、常用功能卡片和内嵌智能助手。
- **数据经营**：数据概览、报表中心、月报详情、数据列表。
- **智能助手**：运行在工作台内，支持本地会话历史、快捷提问和示例回复。
- **系统管理**：系统设置、字典管理、审计日志、角色管理、角色详情与授权、
  用户管理、主题设置、个人中心。
- **主题**：12 套中国传统色主题，默认 `qing-ming`，支持浅色、深色和跟随系统。
- **国际化**：`zh-CN` / `en-US`，覆盖菜单、页面标题、按钮和页面主要文案。
- **访问控制**：页面加载前执行 `pageKey` / `grantGroup` 校验，并展示 403 或跳转登录。
- **工程分层**：`src/app` 固定宿主入口、`src/backend` 服务端资源、
  `src/frontend` 前端运行时与业务组件。

## 快速开始

要求 Node.js 22+、pnpm 11+。本目录依赖仓库内 `packages/*` 的 `link:` 包。

```bash
cd starters/next-app-starter
pnpm --config.lockfile=false install
pnpm dev
```

打开 <http://localhost:9011>。默认 `APP_ENV=prototype`，无需真实后端。

模板源码中的账号使用占位符，生成新工程时由
`packages/create-app` 按 `placeholders.json` 渲染；未渲染时也可以用占位符字符串
登录本地原型：

| 角色 | 用户名 | 密码 | 权限 |
| --- | --- | --- | --- |
| 管理员 | `{{DEMO_ADMIN_USERNAME}}` | `{{DEMO_ADMIN_PASSWORD}}` | `report:view`、`user:view` |
| 访客 | `{{DEMO_GUEST_USERNAME}}` | `{{DEMO_GUEST_PASSWORD}}` | 仅访问无权限标记的页面 |

演示会话只用于本地原型。接入生产环境时应替换
`src/backend/auth/accounts.ts` 和登录接口，改用真实用户体系与会话。

## 配置说明

所有工程配置均以本 README 和源码为准，系统管理中不提供“配置说明”页面。
常用配置入口如下：

| 配置项 | 位置 |
| --- | --- |
| 应用环境与接口地址 | `next.config.js`、`scripts/build.mjs` |
| 服务端环境判断 | `src/backend/config.ts` |
| 浏览器端接口入口 | `src/frontend/config.ts` |
| 菜单、路由与布局 | `src/backend/resources/yaml/sitemap.yaml` |
| 页面访问权限 | `src/backend/resources/page-access.ts` |
| 中英文语言包 | `src/backend/resources/i18n/locales/*/app.yaml` |
| 主题与明暗模式 | `public/themes/*.css`、`src/frontend/skin.ts` |

### 环境与命令

| 命令 | `APP_ENV` | 数据来源 |
| --- | --- | --- |
| `pnpm dev` | `prototype`（默认） | `src/backend/mock` |
| `pnpm dev:backend` | `development` | `http://localhost:8106` |
| `pnpm build:prototype` | `prototype` | 本地 mock |
| `pnpm build:dev` | `development` | `http://localhost:8106` |
| `pnpm build:test` | `test` | `https://api-test.example.com`（占位） |
| `pnpm build` | `production` | `https://api.example.com`（占位） |
| `pnpm start` | 使用构建产物 | 由构建时的 `APP_ENV` 决定 |

构建或启动前可覆盖接口地址：

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8106 \
PACTOR_SERVER_BASE_URL=http://localhost:8106 \
pnpm dev:backend
```

- `NEXT_PUBLIC_API_BASE_URL`：sitemap、页面加载和浏览器端 HTTP 请求的基准地址。
- `PACTOR_SERVER_BASE_URL`：`/api/d` 服务端转发目标；缺省读取
  `NEXT_PUBLIC_API_BASE_URL`，再回退 `http://localhost:8106`。
- 测试、生产域名只是占位值，部署前必须替换。

本 starter 不提交 lockfile，依赖安装会解析 `package.json` 中最新的兼容版本：

```bash
pnpm --config.lockfile=false install
```

## 工程结构

```text
next-app-starter/
├── public/
│   ├── themes/                 12 套主题 CSS
│   └── skins/neutral.css       基础语义令牌
├── scripts/build.mjs           按 APP_ENV 执行 Next 构建
├── src/
│   ├── app/
│   │   ├── [[...slug]]/        Next 动态页面入口
│   │   ├── api/                sitemap、pages、auth、page-access、/api/d
│   │   ├── layout.tsx          HTML 壳、主题首屏注入、PactorApp 挂载
│   │   └── globals.css         后台布局与系统管理页面样式
│   ├── backend/
│   │   ├── auth/               演示账号、会话 cookie
│   │   ├── fixtures/           用户、角色、系统设置示例数据
│   │   ├── mock/               原型模式业务接口
│   │   ├── config.ts           服务端地址与 prototype 判断
│   │   └── resources/
│   │       ├── i18n/           YAML 语言包与服务端本地化
│   │       ├── page-access.ts  pageKey / grantGroup 校验
│   │       ├── sitemap.ts      sitemap 构建、权限裁剪、语言解析
│   │       └── yaml/           sitemap.yaml 与页面 DSL
│   └── frontend/
│       ├── App.tsx             SitemapApp 宿主与页面访问门禁接线
│       ├── components/         auth、workbench、layout、settings、shared
│       ├── i18n/               宿主自身文案
│       ├── themes/             主题注册表
│       ├── config.ts           sitemap / pageAccess / apiBaseUrl 配置
│       ├── locale.tsx          中英文语言状态
│       ├── page-access.tsx     页面访问门禁 UI
│       └── skin.ts             主题换肤与持久化
├── next.config.js              环境地址、根路径重定向
└── package.json
```

固定公共接口保留在 `src/app/api`。新增业务数据统一走 `/api/d/...`：

- `prototype`：由 `src/backend/mock/index.ts` 分发到本地 mock。
- `development` / `test` / `production`：保留路径、方法、查询和请求体，
  转发到 `${PACTOR_SERVER_BASE_URL}/api/d/...`，并携带会话 cookie。

## 页面与导航

导航和路由以 `src/backend/resources/yaml/sitemap.yaml` 为唯一入口：

```yaml
menus:
  - id: analytics
    type: group
    title: 数据经营
    icon: chart-no-axes-combined
    children:
      - id: dashboard
        type: page
        pageId: dashboard
        path: /dashboard
        title: 数据概览
        layout: admin
```

`NavigationShell` 只消费 sitemap：

- 一级栏渲染非隐藏的直达页面和 `type: group` 模块。
- 二级栏仅在 group 展开时显示，并渲染该 group 的可见 children。
- 工作台是直达页面，不渲染空白二级栏；智能助手内嵌在页面右侧。
- 隐藏详情页通过 `hidden: true` 不进入菜单，通过 `activeMenu` 保持父菜单高亮。
- 菜单标题在服务端按 `locale` 解析后下发。

页面 DSL 位于 `src/backend/resources/yaml/<module>/<id>.page.yaml`。
`lazy: true` 的页面不内联到 sitemap，由
`GET /api/pages/{id}` 按需加载。

## 新增一个页面

1. 在 `src/backend/resources/yaml/<module>/` 新建 `<id>.page.yaml`。
2. 在 `sitemap.yaml` 的 `pages` 中声明 `id`、`path`、`title`、`version`；
   大页面建议设置 `lazy: true`。
3. 在对应 group 的 `children` 中增加菜单项，填写 `pageId`、`path`、`title`、
   `layout`。详情页增加 `hidden: true` 和 `activeMenu`。
4. 如需权限控制，在页面和菜单上配置 `permission`，并在
   `src/backend/resources/page-access.ts` 补齐 `grantGroup` 到权限码的映射。
5. 在 `src/backend/resources/i18n/locales/zh-CN/app.yaml` 和
   `en-US/app.yaml` 中增加 `menu.<id>`、`page.<id>.title` 及页面文案词条。
6. 自定义组件放在 `src/frontend/components/`，并在
   `src/frontend/components/index.ts` 注册。
7. 修改 lazy 页面后递增 sitemap 中的 `version`，避免浏览器使用旧缓存。

页面 DSL 可用作者态 Schema 校验：

```bash
node --input-type=module - <<'NODE'
import { readFileSync, globSync } from 'node:fs';
import YAML from 'yaml';
import { validateAuthorPageDsl } from '@pactor-app/schema';

for (const file of globSync('src/backend/resources/yaml/**/*.page.yaml')) {
  const result = validateAuthorPageDsl(YAML.parse(readFileSync(file, 'utf8')));
  if (!result.valid) {
    console.error(file, result.errors);
    process.exitCode = 1;
  }
}
NODE
```

## 国际化

服务端在 `/api/sitemap` 和 `/api/pages/{id}` 响应前完成本地化：

1. `src/frontend/locale.tsx` 从 URL `locale`、Cookie 和浏览器语言解析语言。
2. 页面 YAML 使用 `$i18n{key:默认值}` 或对象式 `$i18n`。
3. `src/backend/resources/i18n/index.ts` 使用 `YamlMessageProvider`
   加载 `zh-CN` / `en-US` 语言包。
4. 页面 DSL 下发前完成本地化，浏览器不加载业务语言包。

新增语言时需同步修改：

- `src/frontend/locale.tsx` 的 `Locale` 与 `supported()`。
- `src/frontend/components/layout/account-menu.tsx` 的语言选项。
- `src/backend/resources/i18n/index.ts` 的支持语言和词条清单。
- 新增 `src/backend/resources/i18n/locales/<locale>/app.yaml`。

## 主题

- 默认主题：`qing-ming`（青冥深蓝）。
- 主题 CSS：`public/themes/*.css`。
- 注册表：`src/frontend/themes/index.ts`。
- 运行时换肤：`src/frontend/skin.ts`。
- 首屏主题注入：`src/app/layout.tsx`。
- 持久化键：`mc-skin`、`mc-mode`。

账户菜单提供 12 套配色、浅色 / 深色 / 跟随系统切换，并同步
`data-pactor-theme`。

## 页面访问校验

页面切换前，宿主请求同源 `POST /api/page-access/verify`。服务端从页面 DSL
读取 `page.name`（回退 `page.id`）和 `page.grantGroup`，再调用权限中心或
原型 mock：

```yaml
page:
  id: users
  title: 用户管理
  name: users
  grantGroup: userGroup
```

原型映射位于 `src/backend/resources/page-access.ts`：

- `userGroup` → `user:view`
- `reportGroup` → `report:view`
- 公开页匿名放行，其余页面要求登录。

生产环境接真实权限中心时，替换
`src/app/api/page-access/verify/route.ts` 的代理目标和域 / 模块配置。

## 检查与构建

```bash
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint .
APP_ENV=prototype ./node_modules/.bin/next build
```

`pnpm build:*` 统一通过 Webpack 构建，避免 Turbopack 在受限环境中因
CSS 子进程端口权限失败；`pnpm dev` 仍使用 Next.js 默认开发构建器。

## 边界

本 starter 明确不迁移以下内容：

- 知识库列表、详情、检索和查询页面。
- 文档库、文档详情及本地文档存储。
- 问答库、元数据页面。
- 知识库相关 mock、fixture、组件和示例数据。

保留的是通用后台宿主能力、数据经营页面、工作台内置智能助手和系统管理能力。
