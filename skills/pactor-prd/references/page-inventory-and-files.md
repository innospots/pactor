# 按目录批量生成 DSL 文件与菜单关系

`pactor-prd` 在阶段 1 产出 **页面清单** 后，阶段 3 必须 **按清单逐文件创建** YAML，保证「磁盘目录 ↔ 模块 ↔ sitemap ↔ 导航 ↔ 授权元数据」一致。

先识别接线：

- **通用 Pactor starter**：`sitemap.yaml` 通常维护 `pages` + `menus` + `layouts`，页面使用 Pactor `permission`（若该工程已接入）。
- **Nexus/Console**：本地 `sitemap.yaml` 只维护 `pages` + `layouts`，导航来自后端 `meta-sitemap.yaml`/持久化菜单；页面写 `access-mode`、`domain`、`module`、`pageKey`、`grantGroup`。`pages` 全部 `lazy: true`。

完整授权与 sitemap 契约见 `pactor-dsl/references/authorization-and-sitemap.md`。

## 清单 → 文件映射（核心规则）

**一律采用模块分目录（模式 B）**：

```text
src/backend/resources/yaml/
  sitemap.yaml
  common/           # 可选：login、dashboard
  <模块>/           # PRD 模块，kebab-case
    <page-id>.page.yaml  # 一页一文件；page-id = 清单 id = page.id
```

| 清单列 | 写入位置 |
| --- | --- |
| 模块 `user` | 目录 `yaml/user/` |
| 页面 id `user-list` | 文件 `yaml/user/user-list.page.yaml` |
| 路由 `/users` | `sitemap.yaml` → `pages[].path` |
| 菜单「用户」 | 通用 Pactor：sitemap/bootstrap `menus` → `pageId: user-list`；Nexus：后端 `meta-sitemap.yaml` → `pageId: user-list` |
| access-mode / catalog grant | 页面 YAML 的 `page` 元数据；不在 sitemap 重复 |

**禁止**：清单 10 页只写 1 个合并 yaml；**禁止** id 与文件名不一致。

## 批量创建流程

1. **按模块建目录**：对清单中每个 distinct `<模块>` 执行 `mkdir -p src/backend/resources/yaml/<模块>`（生成时保持树形与 PRD 模块树一致）。
2. **按行建文件**：清单每一行 → 一个 `yaml/<模块>/<id>.page.yaml`；内容类型从线框图判定（列表 / 详情 / 表单），套 `references/page-templates.md`。
3. **一次更新 sitemap**：
   - `pages`：清单中每一页一条（含 hidden 的详情/编辑）；Nexus 页面必须 `lazy: true`
   - 通用 Pactor：`menus` 仅「进导航」的页进 group；hidden 页带 `activeMenu`
   - Nexus/Console：本地 sitemap 不写 `menus`；在后端 `meta-sitemap.yaml`/持久化菜单维护导航，本地页面仍保留在 `pages`
4. **数据源声明**：按 `references/data-api.md` 命名约定，每个 http 数据源在 yaml 内直接声明最终接口路径（prototype 走本地 mock，其他环境由 `/api/d` 原样转发，**无需注册**）。
5. **交叉检查**（生成后必做）：

```text
清单行数 N
  = yaml 业务页文件数（不含 sitemap.yaml）
  = sitemap.pages 中业务页条数（含 hidden）
  且 ∀ id: 存在文件 yaml/<模块>/<id>.page.yaml 且 DSL 内 page.id === id
  且 Nexus: access-mode 合法；grant 页 domain/module/pageKey 完整；pages[].lazy === true
  且 通用 Pactor: menus 引用存在；Nexus: 本地 sitemap 无重复 menus，后端导航 pageId 均可解析
```

## 清单模板（复制填充）

```markdown
| # | 模块目录 | page id | 文件路径 | path | 类型 | 菜单 | hidden | activeMenu | access-mode | domain/module/pageKey/grantGroup | P |
| 1 | project | project-list | yaml/project/project-list.page.yaml | /projects | 列表 | 是 | | | grant | operation/project/platform-project-main/view | P0 |
| 2 | project | project-edit | yaml/project/project-edit.page.yaml | /projects/:id/edit | 表单 | 否 | true | projects | grant | operation/project/platform-project-main/view | P0 |
```

- **P**：P0 必须生成；P2 只登记不建文件（在 SKILL 阶段 1 已约定）。
- **类型**：决定用 page-templates 哪一节；同一业务域列表+编辑共用表单规范（见 SKILL 红线）。
- **授权元数据**：通用 Pactor 可改记 `permission`；Nexus `public` / `authenticated` 页面即使无需 grant 字段，也必须明确记录 `access-mode`。

## 模板样板页（生成工程内）

脚手架生成工程后，可按需参考 `yaml/analytics/data-list.page.yaml`（列表 + 表单）、
`yaml/settings/users.page.yaml`（完整 CRUD）和 `yaml/settings/roles.page.yaml`
（主从/授权）。新模块沿用同样的目录深度和一页一文件规则；PRD 未要求的样板页面、
菜单、fixture 与 mock 在业务页面完成后统一清理。

## 已有工程（增量）

线框图只增改部分页面时：**不要**重新运行脚手架。走 **`incremental-wireframe-delta.md`**（delta 表、只改涉及文件、验收变更页 + 回归）。

## 与 `pactor-dsl` 的衔接

单页 DSL 语法、组件 props、表达式：读 **`pactor-dsl`** + `pactor-dsl/references/dsl-authoring.md`。  
本文件约束 **全量** 文件与 sitemap 对齐；增量见 **`incremental-wireframe-delta.md`**。
