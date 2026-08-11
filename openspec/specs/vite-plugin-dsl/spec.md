# Spec: vite-plugin-dsl

YAML DSL 导入转换插件（`pactor-vite-plugin`，设计文档第 34、85 节）。


### Requirement: page DSL 导入转换

插件 SHALL 把 `*.page.yaml` / `*.page.yml` 文件转换为 JS 模块：YAML 解析 → `validatePageDsl` 校验 → 输出 `export default <PageDsl 对象>` 与 `export const dslVersion`。不匹配的文件 MUST 跳过（返回 null/undefined）。

#### Scenario: 合法 page 转换

- **WHEN** transform 一份合法 page.yaml（含 dsl/page/state/body）
- **THEN** 输出 JS 模块代码，default 导出为该 PageDsl 对象，dslVersion 为其 dsl 字段

#### Scenario: 普通 yaml 不处理

- **WHEN** transform 命中 `config.yaml`（无 .page/.fragment 后缀）
- **THEN** 返回空，文件保持原样处理

### Requirement: 构建期校验

校验失败或 YAML 语法错误 MUST 使构建报错，错误信息含文件标识与结构化校验错误（path/message）。

#### Scenario: 缺少 page.id 报错

- **WHEN** page.yaml 缺少 `page.id`
- **THEN** transform 抛错，信息含 `/page/id`

#### Scenario: YAML 语法错误

- **WHEN** 文件为非法 YAML
- **THEN** transform 抛错，信息含语法错误位置

### Requirement: fragment DSL 转换

`*.fragment.yaml` / `*.fragment.yml` SHALL 转换为 FragmentDsl 模块（结构宽松检查：存在 `dsl` 与 `body`），输出 `export default` 与 `dslVersion`。

#### Scenario: fragment 转换

- **WHEN** transform 合法 fragment.yaml
- **THEN** 输出 default 导出该 FragmentDsl 的模块

### Requirement: 选项

- `include`：自定义匹配规则（覆盖默认后缀约定）。
- `validate`：默认 true；为 false 时跳过 Schema 校验仅编译。

#### Scenario: validate 关闭

- **WHEN** validate: false 且 DSL 缺少 page.id
- **THEN** 转换成功不报错

#### Scenario: 自定义 include

- **WHEN** include 配置为匹配 `.dsl.yaml`
- **THEN** 该类文件被转换，默认后缀不再匹配

### Requirement: HMR

dev 时修改 DSL 文件 SHALL 触发热更新：依赖该模块的模块进入热更新，无模块记录时全量刷新。

#### Scenario: 修改 page.yaml 热更新

- **WHEN** dev server 中修改已导入的 page.yaml
- **THEN** handleHotUpdate 返回相关模块列表（或触发 full-reload）

### Requirement: 集成构建

在真实 vite build 中，入口 import `.page.yaml` SHALL 构建成功且产物包含 DSL 内容。

#### Scenario: vite build 集成

- **WHEN** 对 import page.yaml 的入口执行 vite build
- **THEN** 构建成功，产物 JS 含页面 id 内容
