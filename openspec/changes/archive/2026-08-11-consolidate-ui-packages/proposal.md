# Proposal: consolidate-ui-packages

## Why

UI 相关包目前多达 8 个（antd 侧 components/interaction/layout + radix 侧三个 + 两个聚合包 ui-antd/ui-radix），导航与依赖关系过碎。框架尚未发布 npm，无外部使用者，现在是整合的最佳窗口：以 `ui-*` 为单元——`pactor-ui-antd` 与 `pactor-ui-radix` 各自吸收本侧三个实现包，内部按 `components` / `interaction` / `layout` 子路径组织，对外一个包名、一个 `ui` 预设。

## What Changes

**BREAKING（包名/导入路径层面；框架未发布，无外部影响）**：

- `pactor-ui-antd` 吸收 `pactor-components` + `pactor-interaction` + `pactor-layout`：
  - 源码迁入 `src/components/`、`src/interaction/`、`src/layout/`，测试随迁。
  - 主入口 `pactor-ui-antd` 导出全部 + `antdUiKit`；子路径入口 `pactor-ui-antd/components`、`/interaction`、`/layout` 供按需导入。
  - 删除 packages/components、packages/interaction、packages/layout。
- `pactor-ui-radix` 同样吸收三个 radix 实现包（`src/components/`、`src/interaction/`、`src/layout/` + `radixUiKit` + styles.css），子路径入口同构；删除 packages/components-radix、packages/interaction-radix、packages/layout-radix。
- **契约类型归属**：Radix 实现此前 `import type` 自 pactor-components；整合后改为 `import type` 自 `pactor-ui-antd`（仍 type-only，无运行时依赖，antd 保持 peer）。
- **依赖方更新**：pactor-app（deps 与 import 改为 pactor-ui-antd 子路径/主入口）、pactor-chat（devDep 改 pactor-ui-antd）、根 package.json。
- **文档站**：六个旧模块页删除，ui-antd / ui-radix 两页重写为按层组织（components/interaction/layout 三节）；侧边栏、快速开始模块表、README 工程结构同步。
- 公开 API（组件类型名、props 契约、`create*Registry`、`OverlayManager`、`AdminLayout` 等符号）全部保留，仅导入路径变化。

## Capabilities

### New Capabilities

- `ui-package-structure`: UI 包整合结构——`pactor-ui-antd` / `pactor-ui-radix` 两个单元、子路径入口、预设对象、旧包移除。

### Modified Capabilities

- `ui-kit-antd-preset`: antdUiKit 迁移至整合后的 pactor-ui-antd（符号与语义不变）。
- `ui-kit-preset`: radixUiKit 迁移至整合后的 pactor-ui-radix（符号与语义不变）。
- `application-bootstrap`: pactor-app 的依赖与导入更新（行为不变）。

## Impact

- **删除**：packages/components、interaction、layout、components-radix、interaction-radix、layout-radix（6 个包）。
- **修改**：packages/ui-antd、ui-radix、app、chat、根 package.json、README、文档站。
- **不变**：全部运行时行为与公开符号；全部测试保留（随包迁移并更新导入）。
- **后续**：归档同步时，既有能力 spec（builtin-components、overlay-*、admin-layout 等）的主 spec 内容不变，仅归属包名变化。
