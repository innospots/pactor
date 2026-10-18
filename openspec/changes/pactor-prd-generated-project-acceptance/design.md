# Design: pactor-prd-generated-project-acceptance

## Context

pactor-prd 是代理执行的技能，不是单一生成器命令。真实验收必须让新代理上下文加载 SKILL.md，仅从 PRD fixture 和空目标目录开始，避免由作者手工拼出“理想项目”再假装是生成结果。

## Decisions

### D1. 代表性 fixture 与确定性上游

虚构产品“星轨项目台”包含 `/login`、`/`、`/projects`、`/projects/:id`，覆盖登录、仪表盘、列表搜索、新建/编辑共用抽屉、详情、空态与错误重试。`mock-server.mjs` 使用 node:http 提供内存数据和 normal/list-error/detail-error/save-error 模式，让页面经过真实 Next `/api/d` 转发链路。

### D2. 生成输入与验收答案隔离

生成代理只获得 README、分页线框和目标空目录，不获得 `expected-project.json`、静态检查器、mock 实现或黄金 YAML。页面清单、`docs/prd/ui-plan.md` 和生成日志保存在工作目录供后续审计。发现问题只能修模板/skill/reference 后从空目录重跑。

### D3. 静态门禁与浏览器门禁互补

`check-prd-project.mjs` 使用 Node 标准库和项目已有 yaml 依赖，验证 YAML 可解析、页面/sitemap/菜单一致、路由唯一、dataSources 全为 http、无参考模块和占位/真实品牌残留。它不判断美观，也不替代组件 props 和浏览器检查。

工程门禁为 install、build、tsc、lint、逐页 DSL validate。随后按 runbook 验证登录、搜索/重置、详情、新建/编辑/预填、空态 CTA、错误重试、保存失败不丢数据及正常路径 console/network。

### D4. 视觉矩阵与报告

截图覆盖 1440×900 浅色、390×844 浅色、桌面暗色及空态/错误态。自动检查横向溢出和主题属性；主代理必须用 ReadMediaFile 目检信息层级、间距、组件选择、遮挡、对比度和状态下一步操作。验收报告注明覆盖率、命令结果、截图与未覆盖范围，不承诺所有 PRD/后端/设备绝对无 BUG。

## Risks / Trade-offs

- **fixture 覆盖有限** → 结论只针对代表性场景，后续可扩充，不夸大为普遍证明。
- **浏览器负向响应误判** → 预期 401/500 单独记录，正常路径与错误注入分别统计。
- **生成过程不可程序化调用 skill** → 可由操作者在全新上下文严格执行同一输入，报告标为“人工驱动的真实 skill 执行”，不得伪称自动生成。
