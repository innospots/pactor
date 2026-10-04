# @pactor-app/skills

面向 AI Agent 的 [Pactor](https://github.com/426-330/pactor) 开发技能集。技能目录均以 **`pactor-`** 为前缀，与 npm 脚手架包 `create-pactor-app` 区分。

本仓库路径：**根目录 `skills/`**（pnpm workspace 包 `@pactor-app/skills`）。

| 目录 / skill id | 用途 |
| --- | --- |
| **`pactor-dsl`** | 框架与 `*.page.yaml` DSL 编写 |
| **`pactor-project`** | 新建工程、`pnpm create pactor-app`、模板选型 |
| **`pactor-prd`** | PRD / 线框图 → 完整可运行后台（含 `template/`） |

## 在本仓库使用（Cursor / Claude Code）

`pactor-prd` 须连同 **`references/`** 与 **`template/`** 一起可见。

```bash
mkdir -p .cursor/skills
ln -sf ../../skills/pactor-dsl .cursor/skills/pactor-dsl
ln -sf ../../skills/pactor-project .cursor/skills/pactor-project
ln -sf ../../skills/pactor-prd .cursor/skills/pactor-prd
```

## 安装（业务仓库）

```bash
pnpm add -D @pactor-app/skills
```

```bash
ln -s node_modules/@pactor-app/skills/pactor-dsl ~/.claude/skills/pactor-dsl
ln -s node_modules/@pactor-app/skills/pactor-project ~/.claude/skills/pactor-project
ln -s node_modules/@pactor-app/skills/pactor-prd ~/.claude/skills/pactor-prd
```

---

## 技能一览

| Skill | 典型触发 | 产出 |
| --- | --- | --- |
| **`pactor-dsl`** | 写/改 YAML 页面、表达式、动作、组件、主题、Chat | 规范与示例（不生成新仓库） |
| **`pactor-project`** | 初始化项目、`pnpm create pactor-app` | next-app / spa 或最小 Vite 壳工程 |
| **`pactor-prd`** | PRD/线框图 → 页面（**新工程**复制 template，**已有工程**线框图增量） | YAML + sitemap/mock/样式 + 验收 |

关系：**`pactor-project`** 搭通用壳；**`pactor-prd`** 从自带 **`template/`** 批量铺页（勿用脚手架空起）；日常改页用 **`pactor-dsl`**。

---

## `pactor-dsl`

- **入口**：`pactor-dsl/SKILL.md`，深参考 `pactor-dsl/references/dsl-authoring.md`
- **能力**：DSL 语法；**按清单批量加页**（目录 A/B、`sitemap`/menus、`StaticDslLoader`）— `pactor-dsl/references/page-catalog-and-layout.md`；组件、dataSources、权限、Chat、`pactor validate`

---

## `pactor-project`

- **入口**：`pactor-project/SKILL.md`，`references/templates.md`、`references/minimal-vite.md`
- **能力**：`pnpm create pactor-app -t next-app|spa`（npm 包名仍为 **`create-pactor-app`**）、`pactor create`、starters 复制、脚手架后检查清单

---

## `pactor-prd`（PRD → 可运行应用）

**版本**：见 `pactor-prd/SKILL.md` frontmatter。

### 能力摘要

- 输入：产品总览 README + 分页 Markdown 线框图（可选原产品仓抽样式）
- 产出：Next + Pactor 工程 — `sitemap.yaml`、分模块 `*.page.yaml`、http 数据源 + `app/api/data/*` mock、懒加载页面 API、多套皮肤与验收清单
- **新建工程**：解析 → 复制 `template/` → 按清单建 `yaml/<模块>/<id>.yaml` → mock → 样式 → 全站验收（`page-inventory-and-files.md`）
- **增量**：摸底现状 → 线框图 **add/update** → 只改相关 yaml、sitemap、mock → 变更页验收 + 回归（`incremental-wireframe-delta.md`）
- 红线：dataSources 仅 `http`；表单一律 `Form`；列表操作列规范；功能闭环；文案跟线框图

### 捆绑资产

| 路径 | 作用 |
| --- | --- |
| `pactor-prd/template/` | 可运行模板工程（common + provider/route 参考模块） |
| `pactor-prd/references/*.md` | 目录结构、组件映射、页模板、mock、主题、验收清单 |

详见 [`pactor-prd/SKILL.md`](pactor-prd/SKILL.md) 与 [`pactor-prd/template/README.md`](pactor-prd/template/README.md)。

---

## 校验与发布

```bash
cd skills && pnpm validate   # 目录名与 SKILL frontmatter、references、template 存在性
```

## 新增技能

1. 在 `skills/` 下新建 **`pactor-<topic>/`**，`SKILL.md` 的 `name` 与目录名一致。  
2. 更新本 README 表格；`pnpm validate` 通过后发布 `@pactor-app/skills`。

## License

MIT
