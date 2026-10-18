# Tasks: pactor-prd-generated-project-acceptance

## 1. Fixture 与检查器

- [x] 1.1 新增 `tests/fixtures/pactor-prd/startrack/`：README、login/dashboard/project-list/project-detail 线框、expected-project.json 和无依赖 mock-server；固定账号、接口、空态/错误态和 UI 约束。
- [x] 1.2 新增 `tests/scripts/check-prd-project.mjs` 与 acceptance-runbook，覆盖 YAML/sitemap/菜单/路由/http 数据源、参考残留、占位和真实品牌检查；先用故意缺失页面和残留样例验证检查器会失败。

## 2. 真实生成与工程门禁

- [x] 2.1 在空临时目录由新代理上下文仅从 PRD 执行新建流程：复制并替换模板、生成页面清单和 `docs/prd/ui-plan.md`、生成 YAML/sitemap/数据/样式、删除参考模块并保存日志；不向生成代理提供 expected/checker/mock/黄金 YAML。
- [x] 2.2 对生成项目运行 install、逐页 DSL validate、静态检查、build、tsc、lint；任何失败都回到模板/skill 修复并从空目录重跑，不手工补丁生成结果。

## 3. 浏览器功能与视觉门禁

- [x] 3.1 启动 mock 与生成项目，按 runbook 验证正确/错误登录、dashboard、搜索/重置、详情、新建/编辑/预填、空态 CTA、list/detail/save 错误与重试；正常路径无意外 401/404/500 和 console error，负向响应单独记录。
- [x] 3.2 完成桌面/窄屏/亮暗色及 empty/error 截图；自动检查溢出和主题属性，主代理用 ReadMediaFile 对照 PRD 与 UI 计划目检布局、Field 间距、组件选择、遮挡和对比度。
- [x] 3.3 输出 acceptance 报告（命令、4/4 路由、交互、网络/控制台、残留、截图和未覆盖范围），关闭浏览器与临时进程；运行三个 change 的 `openspec validate <name> --strict` 和 `git diff --check`。
- [x] 3.4 记录验收遗留：窄屏 Drawer 固定 720px 导致面板和字段越出视口；按用户决定挂起后续处理，不宣称视觉矩阵全部通过。
