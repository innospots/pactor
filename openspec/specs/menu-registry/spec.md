# Spec: menu-registry

## Purpose

Menu Model 与 MenuRegistry（`@pactor-app/router`）：菜单树注册、按路径/ID 查找（设计文档第 30 节）。


## Requirements

### Requirement: MenuItem 模型

SHALL 定义 `MenuItem` 类型：`id`、`type: 'group' | 'page' | 'link'`、`title`，及可选 `icon` / `order` / `path` / `pageId` / `permission`（PermissionConfig）/ `hidden` / `disabled` / `external` / `target` / `keepAlive` / `badge` / `activeMenu` / `defaultOpen` / `breadcrumb` / `tab` / `children`。

#### Scenario: 完整菜单项类型检查

- **WHEN** 声明含 group 嵌套 page 与 hidden 详情页的菜单树
- **THEN** TypeScript 编译通过

### Requirement: MenuRegistry 构建

`MenuRegistry` SHALL 由菜单树构建：产出可见菜单树（过滤 `hidden` 项）与扁平的可路由条目列表（`type` 非 group 且有 `path`）。`list()` MUST 按 `order` 排序（未指定 order 的保持声明顺序置于其后）。

#### Scenario: 可见树过滤隐藏页

- **WHEN** 菜单树含 `hidden: true` 的详情页
- **THEN** 可见菜单树不含该项，但扁平可路由列表含该项

#### Scenario: order 排序

- **WHEN** 条目 order 分别为 2、1、未指定
- **THEN** list() 顺序为 order 1、order 2、未指定项

### Requirement: findByPath

`findByPath(pathname)` SHALL 按 list() 顺序逐个做路径模式匹配，命中返回 `{ menu, params }`；隐藏页 MUST 参与匹配；无命中返回 null。

#### Scenario: 匹配静态与参数路径

- **WHEN** 注册 `/customers` 与 `/customers/:id/edit`，分别查找 `/customers` 与 `/customers/123/edit`
- **THEN** 前者命中列表页（params 为空），后者命中编辑页且 params.id 为 '123'

#### Scenario: 隐藏页可匹配

- **WHEN** 查找隐藏详情页的路径
- **THEN** 正常命中返回该菜单项

#### Scenario: 未命中返回 null

- **WHEN** 查找未注册路径
- **THEN** 返回 null

### Requirement: findById

`findById(id)` SHALL 按菜单项 id 查找（含 group 与隐藏项），未找到返回 undefined。

#### Scenario: 按 id 查找

- **WHEN** 查找已注册的 page id 与不存在的 id
- **THEN** 分别返回该菜单项与 undefined
