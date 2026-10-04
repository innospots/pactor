# 页面清单、目录结构与 sitemap 关系

在**已有 Pactor 工程**内按需求新增 **任意数量** 页面时，先产出「页面清单」，再按工程采用的 **YAML 布局模式** 创建文件并注册 `sitemap`（或 `StaticDslLoader`）。

> 新建空仓库请用 **`pactor-project`**；从 PRD 批量铺全站请用 **`pactor-prd`**。本参考只覆盖「加页 / 改目录」。

## 两种 YAML 磁盘布局（二选一，勿混用）

| 模式 | 适用 | 路径规则 | 页面 id |
| --- | --- | --- | --- |
| **A. 演示平铺** | 官方 `pnpm create pactor-app -t next-app` / `starters/next-app-starter`；页面 ≤5、模块单一 | `src/server/yaml/pages/<id>.page.yaml` | `page.id` = 文件名去掉 `.page.yaml`（如 `home.page.yaml` → `home`） |
| **B. 模块分目录** | `pactor-prd` 模板及多模块后台（模块 ≥2 或页面 >5） | `src/server/yaml/<模块>/<id>.yaml` | `page.id` = 文件名去掉 `.yaml`（**无** `.page` 后缀） |

`src/server/sitemap.ts`（或等价加载器）递归扫描 `yaml/` 子目录建立 **id → 文件路径** 索引；**id 全局唯一**，且与 `sitemap.yaml` 里 `pages[].id`、`menus[].pageId` 一致。

从模式 A 扩到模式 B：新建模块子目录，把新页放进 `<模块>/`；旧页可逐步迁移，同一时刻不要两个文件共用一个 id。

## 页面清单（Agent 先输出，再写文件）

对用户给的 N 个页面，先填表（N 任意）：

| page id | 模块目录 | 文件路径（相对 `src/server/yaml/`） | path | 菜单分组 | 进菜单? | layout | permission |
| --- | --- | --- | --- | --- | --- | --- | --- |
| user-list | user | `user/user-list.yaml` 或 `pages/user-list.page.yaml` | `/users` | 系统管理 | 是 | admin | user:view |
| user-edit | user | `user/user-edit.yaml` | `/users/:id/edit` | — | 否 hidden | admin | user:edit |

约定：

- **模块目录**：kebab-case 英文域（`user`、`order`、`report`），与 PRD 模块树对齐；模式 A 可填 `pages` 或 `-`。
- **详情 / 编辑 / 新建**：`hidden: true` + `activeMenu` 指向列表菜单项 id；path 用 `:param` 与框架 Path Matcher 一致。
- **page.id**：全局唯一 kebab-case；= DSL 内 `page.id` = 文件名（模式 B）。

## 创建步骤（按数量批量执行）

1. **定布局模式**：看工程现有 `yaml/` 是 `pages/*.page.yaml` 还是 `<模块>/*.yaml`，新页跟随现状；大规模新增优先模式 B。
2. **按清单建文件**：每个页面一个 YAML；从 `references/dsl-authoring.md` 骨架 + 列表/详情/表单模板（`pactor-prd/references/page-templates.md` 可复用结构，数据源类型按工程约定 http 或 service）。
3. **改 `sitemap.yaml`**（next-app / SitemapApp）：
   - `pages` 数组：每个 id 一条，`lazy: true`（推荐懒加载）
   - `menus`：group / page 树与模块一致；`pageId` 指向清单 id
4. **StaticDslLoader 工程**（如 `examples/vite-starter`）：
   - `import` 每个 yaml，`loader` 的 `pages: { [id]: doc }` 与 `bootstrap.menus` 的 `pageId` 与清单一致
5. **校验**：`npx pactor validate 'path/to/**/*.yaml'`（或 monorepo 内 `node packages/cli/dist/cli.js validate …`）
6. **重启 dev**：服务端加载 yaml 的 Next 模板常需重启 dev server 后才能在浏览器看到新页

## sitemap 片段示例（模式 B，两页）

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

## 与 `pactor-prd` 的分工

| 场景 | 使用 |
| --- | --- |
| 已有工程加 1～N 页、改菜单 | **本参考** + `pactor-dsl` |
| 从 PRD 目录一次性生成全站文件 + mock + 验收 | **`pactor-prd`** + `references/page-inventory-and-files.md` |
