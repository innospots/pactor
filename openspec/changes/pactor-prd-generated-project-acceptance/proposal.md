# Proposal: pactor-prd-generated-project-acceptance

## Why

模板和 references 通过检查，仍不能证明技能根据 PRD 生成的最终项目合格。必须用一个代表性需求文档，从空目录实际执行技能，并对生成结果做工程、结构、功能、视觉和交付清洁验收，才能建立“规定场景全部通过、已知问题清零”的质量闭环。

## What Changes

- 新增虚构产品 PRD fixture，覆盖 login、dashboard、list、detail、抽屉 Form、空态和列表/详情/保存错误分支，并提供无依赖 mock 上游服务。
- 新增轻量静态检查器和可重复浏览器 runbook，核对 YAML/sitemap/菜单/路由、数据源类型、参考残留和占位/真实品牌残留。
- 由新的代理上下文仅从 PRD 输入执行一次真实新建流程，保留页面清单、UI 计划和生成日志；不向生成代理提供黄金 YAML 或预期检查文件。
- 对生成项目执行 install/build/typecheck/lint/DSL 检查、正常与负向浏览器交互，以及桌面/窄屏/亮暗色截图目检。
- 任何模板或 skill 缺陷都回到来源修复并从空目录重跑，不允许手工修补生成结果后宣称通过。

## Capabilities

### New Capabilities

- `prd-generated-project-acceptance`: 代表性 PRD 的真实生成、确定性数据、静态门禁、浏览器交互与视觉矩阵、复跑和报告契约。

## Impact

- `tests/fixtures/pactor-prd/**`、`tests/scripts/check-prd-project.mjs`。
- 依赖前两个 change 的模板、占位工具、UI 计划与验收规则。
- 不引入大型测试框架或第三方运行时依赖；浏览器使用现有 playwright-cli。
