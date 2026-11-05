# 页面清单、目录结构与 sitemap 关系

在**已有 Pactor 工程**内按需求新增 **任意数量** 页面时，先产出「页面清单」，再按工程采用的 **YAML 布局模式** 创建文件并注册 `sitemap`（或 `StaticDslLoader`）。

> 新建空仓库请用 **`pactor-project`**；从 PRD 批量铺全站请用 **`pactor-prd`**。本参考只覆盖「加页 / 改目录」。

## 先识别 sitemap 接线模式

| 模式 | 页面清单 | 导航 | 访问鉴权 |
| --- | --- | --- | --- |
| 通用 Pactor / `SitemapApp` / `StaticDslLoader` | 本参考的 `pages[]` 与磁盘文件 | `sitemap.menus`、`bootstrap.menus` 或 app 提供的菜单 | Pactor `permission`，以及宿主自己的校验 |
| Nexus/Console 集成 | 本地 `sitemap.yaml` 的 `pages[]` + 磁盘文件 | 后端 `meta-sitemap.yaml` / 持久化菜单，经 `/api/sitemap` 合并 | 页面 `access-mode`；服务端懒加载时执行 page-access |

下文没有特别说明时，示例属于通用 Pactor。Nexus 项目不要直接照搬其中的本地 `menus` 部分，完整规则见 [`authorization-and-sitemap.md`](authorization-and-sitemap.md)。

## 一个页面真正可访问所需的链路（通用 Pactor）

```text
bootstrap / sitemap
  → pages[]（id + path + title + version）
  → menus[]（菜单 id + pageId + layout + 权限 + hidden/activeMenu）
  → layouts[layout]（DSL 外壳中的 PageOutlet）
  → pages[id] DSL（page.id + body）
```

只创建 YAML 文件而没有 `pages[]`，页面无法按路径解析；只有 `pages[]` 而没有菜单项，页面不可从导航到达；有菜单项但没有对应 layout / `PageOutlet`，页面内容不会挂载到外壳。

## 全局布局

内置布局注册在 `@pactor-app/ui` 的 `createLayoutRegistry()`：

| layout | 用途 | 页面写法 |
| --- | --- | --- |
| `admin` | 管理端侧栏 + 顶栏 + 内容区 | 业务页面通常以 `Page` 为根，不重复 `Sidebar/Header` |
| `blank` | 无外壳，页面铺满 | 可在页面内自由组合 `Page` / `Layout` / `Card` |
| `login` | 登录、注册、找回密码等认证页 | 使用 `Login` 业务组件或认证表单 |
| `landing` | 官网/落地页外壳 | 页面负责主体内容，CTA 接真实动作 |
| `chat` | AI 工作区外壳 | 使用 `Chat` / `ChatPage`，由宿主注入 chat services |

`layout` 可以来自：

1. `bootstrap.layout.type`（整站默认布局）；
2. `sitemap.menus[].layout`（单个菜单/路由覆盖默认布局）；
3. `SitemapApp` 的 `layouts` 映射（多个布局 DSL）。

布局 DSL 必须包含页面出口：

```yaml
layouts:
  admin:
    dsl: '1.0'
    body:
      type: Layout
      children:
        - type: Sidebar
          props:
            brand: { title: 我的应用, logo: /logo.svg }
            content:
              type: SitemapMenu
              props: { items: '${data.session.menus}', collapsible: true }
              events:
                onSelect:
                  - action: navigate
                    params: { to: '${event}' }
          children:
            - type: Header
            - type: Content
              children:
                - type: PageOutlet
  login:
    dsl: '1.0'
    body:
      type: PageOutlet
  blank:
    dsl: '1.0'
    body:
      type: PageOutlet
```

`PageOutlet` 与 `SitemapMenu` 是 `SitemapApp` 布局保留类型，不需要也不能通过普通 `components` 注册来替代。页面 DSL 本身不包含 `PageOutlet`。

## 两种 YAML 磁盘布局（二选一，勿混用）

| 模式 | 适用 | 路径规则 | 页面 id |
| --- | --- | --- | --- |
| **A. 演示平铺** | 官方 `pnpm create pactor-app -t next-app` / `starters/next-app-starter`；页面 ≤5、模块单一 | `src/server/yaml/pages/<id>.page.yaml` | `page.id` = 文件名去掉 `.page.yaml`（如 `home.page.yaml` → `home`） |
| **B. 模块分目录** | `pactor-prd` 模板及多模块后台（模块 ≥2 或页面 >5） | `src/server/yaml/<模块>/<id>.yaml` | `page.id` = 文件名去掉 `.yaml`（**无** `.page` 后缀） |

`src/server/sitemap.ts`（或等价加载器）递归扫描 `yaml/` 子目录建立 **id → 文件路径** 索引；**id 全局唯一**，且与 `sitemap.yaml` 里 `pages[].id`、`menus[].pageId` 一致。

从模式 A 扩到模式 B：新建模块子目录，把新页放进 `<模块>/`；旧页可逐步迁移，同一时刻不要两个文件共用一个 id。

## 页面清单（Agent 先输出，再写文件）

对用户给的 N 个页面，先填表（N 任意）：

| page id | page type | 模块目录 | 文件路径（相对 YAML 根） | path | 菜单分组 | 进菜单? | layout | access-mode | domain / module / pageKey / grantGroup | Pactor permission | 主要数据源 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| user-list | list | user | `user/user-list.yaml` 或 `pages/user-list.page.yaml` | `/users` | 系统管理 | 是 | admin | grant | `operation / user / platform-user-main / view` | — | `GET /api/users` |
| user-edit | form | user | `user/user-edit.yaml` | `/users/:id/edit` | — | 否 hidden | admin | grant | `operation / user / platform-user-main / view` | — | `GET /api/users/:id`, `PUT /api/users/:id` |

约定：

- **模块目录**：kebab-case 英文域（`user`、`order`、`report`），与 PRD 模块树对齐；模式 A 可填 `pages` 或 `-`。
- **详情 / 编辑 / 新建**：`hidden: true` + `activeMenu` 指向列表菜单项 id；path 用 `:param` 与框架 Path Matcher 一致。
- **page.id**：全局唯一 kebab-case；= DSL 内 `page.id` = 文件名（模式 B）。
- **page type**：`list` / `detail` / `form` / `drawer-form` / `dashboard` / `card-list` / `tree-master-detail` / `grant-panel` / `login` / `chat` / `settings` / `overlay` / `info` / `other:<类型>`；用于选择 `page-blueprints.md` 的骨架。
- **layout**：必须是内置五种之一或工程已注册布局；不要写菜单里不存在的布局名。
- **access-mode**：Nexus/Console 必填（`public` / `authenticated` / `grant`）；通用 Pactor 没有该强制字段。
- **domain/module/pageKey/grantGroup**：Nexus `grant` 页面必须确认前三项；非 `view` 时显式填写 `grantGroup`。通用 Pactor 不要为满足“看起来完整”而添加。
- **Pactor permission**：仅当工程实际接入 `@pactor-app/permission` 时使用；不要同时用它模拟 Nexus grant。

## 创建步骤（按数量批量执行）

1. **定布局模式**：看工程现有 `yaml/` 是 `pages/*.page.yaml` 还是 `<模块>/*.yaml`，新页跟随现状；大规模新增优先模式 B。
2. **按清单建文件**：每个页面一个 YAML；先按 `references/page-blueprints.md` 选择页面类型骨架，再用 `references/dsl-authoring.md` 写合法语法；数据源类型按工程约定 http 或 service。
3. **改 `sitemap.yaml`**（next-app / SitemapApp）：
   - `pages` 数组：每个 id 一条，`lazy: true`（推荐懒加载）
   - `menus`：group / page 树与模块一致；`pageId` 指向清单 id
   - `layouts`：确认目标 layout 存在，且最内层有 `PageOutlet`
4. **StaticDslLoader 工程**：
   - `import` 每个 yaml，`loader` 的 `pages: { [id]: doc }` 与 `bootstrap.menus` 的 `pageId` 与清单一致
   - 若使用全局 DSL 布局，确认 bootstrap 的 `layout` 选择与 loader 提供的页面一致
5. **校验**：在消费项目中用 `npx pactor validate <file...>` 校验显式文件，或用 `npx pactor lint <dsl-directory>` 递归校验整个 YAML 目录，要求已安装 `@pactor-app/cli`
6. **页面完整性验收**：执行 `references/page-blueprints.md` 的 R1–R13，并在浏览器实际走一遍入口、返回、查询和写操作。
7. **重启 dev**：服务端加载 yaml 的 Next 模板常需重启 dev server 后才能在浏览器看到新页

如果目标是 Nexus/Console：

- `pages` 中每个页面同样必须 `lazy: true`（当前宿主会强制校验）；
- `sitemap.yaml` 只维护页面路由与布局，不增加本地 `menus`；
- 在页面 YAML 写 `access-mode` 和所需 grant 元数据；
- 页面 `/system/...` 等路由的导航项放在后端 `meta-sitemap.yaml` 或持久化菜单中；
- 后端未返回导航的详情/编辑页仍保留在 `pages`，由 Next.js 生成 hidden route；
- 用后端菜单 **menu id** 配置页面条目 `activeMenu`，用 page id 关联 `pageId`。

## 通用 Pactor sitemap 片段（模式 B，两页）

```yaml
pages:
  - { id: user-list, path: /users, title: 用户列表, version: 1, lazy: true }
  - { id: user-edit, path: /users/:id/edit, title: 编辑用户, version: 1, lazy: true }

menus:
  - id: system
    type: group
    title: 系统管理
    icon: settings
    children:
      - { id: nav-users, type: page, pageId: user-list, title: 用户 }
      - { id: nav-user-edit, type: page, pageId: user-edit, title: 编辑用户, hidden: true, activeMenu: nav-users }
```

检查 `activeMenu` 指向的是菜单元数据中的 **menu id**（如 `nav-users`），不是 page id。列表页跳转地址要与 `pages[].path` 一致；参数页使用 `:id`，动作中使用 `/users/${row.id}/edit`。

## Nexus/Console sitemap 片段

```yaml
id: site
resourceType: sitemap
version: 1
dslVersion: '1.0'
app: { name: Nexus Console }
auth: { loginPath: /login }

pages:
  - { id: user-list, path: /ops/users, title: 用户列表, version: 1, lazy: true }
  - { id: user-edit, path: /ops/users/:id/edit, title: 编辑用户, version: 1, lazy: true, activeMenu: nav-users }

layouts:
  admin: { dsl: '1.0', body: { type: PageOutlet } }
  login: { dsl: '1.0', body: { type: PageOutlet } }
```

这里没有 `menus`。后端导航示例：

```yaml
menus:
  - id: nav-users
    type: page
    pageId: user-list
    title: 用户列表
    domainKey: operation
    moduleKey: user
    viewGroup: view
```

对应页面的访问配置在 `user/user-list.yaml` 和 `user/user-edit.yaml` 的 `page` 元数据中。sitemap 不重复 `access-mode`、`domain`、`module` 或 `grantGroup`。

## StaticDslLoader 注册片段

```tsx
import { createPactorApplication } from '@pactor-app/app';
import { StaticDslLoader } from '@pactor-app/resource';
import '@pactor-app/ui/styles.css';
import userListPage from './yaml/user/user-list.yaml';
import userEditPage from './yaml/user/user-edit.yaml';

const loader = new StaticDslLoader({
  bootstrap: {
    app: { name: 'My App' },
    permissions: ['user:view', 'user:edit'],
    menus: [
      {
        id: 'users',
        type: 'group',
        title: '系统管理',
        children: [
          {
            id: 'user-list',
            type: 'page',
            title: '用户列表',
            path: '/users',
            pageId: 'user-list',
          },
          {
            id: 'user-edit',
            type: 'page',
            title: '编辑用户',
            path: '/users/:id/edit',
            pageId: 'user-edit',
            hidden: true,
            activeMenu: 'user-list',
          },
        ],
      },
    ],
    layout: { type: 'admin' },
  },
  pages: {
    'user-list': userListPage,
    'user-edit': userEditPage,
  },
});

createPactorApplication({ appId: 'my-app', loader }).mount('#root');
```

使用图表、业务区块或聊天组件时，在 `createPactorApplication` 中合并对应注册表；只有默认 UI 组件的页面不需要额外注册。

## 与 `pactor-prd` 的分工

| 场景 | 使用 |
| --- | --- |
| 已有工程加 1～N 页、改菜单 | **本参考** + `pactor-dsl` |
| 从 PRD 目录一次性生成全站文件 + mock + 验收 | 使用独立的 **`pactor-prd`** 技能（当环境中可用时） |
