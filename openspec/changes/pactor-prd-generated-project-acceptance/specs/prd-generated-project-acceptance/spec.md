# Spec: prd-generated-project-acceptance

## Purpose

通过代表性 PRD 的真实生成和最终项目验收，证明当前技能在规定场景下能够交付结构正确、视觉合理、功能闭环且工程门禁通过的项目。

## ADDED Requirements

### Requirement: 真实生成与答案隔离

验收 SHALL 由新代理上下文仅从 PRD fixture 和空目录执行新建流程。生成代理 SHALL NOT 获得预期答案、静态检查器、mock 实现或黄金 YAML；生成结果不得经手工补丁后作为通过依据。

#### Scenario: 生成过程发现缺陷

- **WHEN** 生成或验收发现模板、skill、reference 缺陷
- **THEN** 修复来源后从空目录重新生成并复跑受影响门禁

### Requirement: 工程与结构门禁

最终项目 SHALL 通过 install、build、typecheck、lint、逐页 DSL validate 和静态结构检查。页面文件、sitemap、菜单、路由、dataSources、UI 计划和参考残留 SHALL 符合 fixture 与技能契约。

#### Scenario: 页面结构不一致

- **WHEN** 页面缺失、路由重复、菜单引用悬空、存在未求值占位或参考模块残留
- **THEN** 静态检查失败并报告具体文件，不得进入通过结论

### Requirement: 功能与负向分支验收

浏览器 SHALL 逐项验证 PRD 交互，包括登录、查询/重置、详情、新建/编辑/预填、空态 CTA、校验和错误重试。保存失败 SHALL 保留用户输入并给出反馈；正常与预期负向网络结果 SHALL 分开记录。

#### Scenario: 保存接口失败

- **WHEN** mock 处于 save-error 并提交合法表单
- **THEN** 用户看到错误反馈、抽屉不关闭、输入不丢失，恢复后可再次成功提交

### Requirement: 视觉与 UI 质量验收

验收 SHALL 包含桌面、窄屏、亮暗色和 empty/error 截图，并由主代理目检布局、间距、组件语义、信息层级和对比度。自动截图或元素存在 SHALL NOT 代替视觉目检。

#### Scenario: 窄屏或暗色不合格

- **WHEN** 页面出现异常横向滚动、遮挡、死色、低对比或 Field 间距破坏
- **THEN** 视觉验收不通过，修复后重验该页全部 UI 项

### Requirement: 结果口径与复跑

报告 SHALL 记录所有命令、路由与交互结果、网络/控制台、残留检查、截图和未覆盖范围。通过结论 SHALL 仅适用于最后生成的 fixture、当前依赖和已执行矩阵，不得表述为所有项目绝对无 BUG。

#### Scenario: 修复后重新验收

- **WHEN** 任一工程、功能或视觉门禁失败后完成修复
- **THEN** 从空目录重新生成并复跑受影响检查，报告只记录最后一次无手工补丁的结果
