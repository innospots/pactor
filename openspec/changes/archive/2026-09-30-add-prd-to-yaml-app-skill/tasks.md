# Tasks: add-prd-to-yaml-app-skill

## 1. Skill 骨架

- [x] 1.1 创建 `packages/skills/prd-to-yaml-app/SKILL.md`：frontmatter（name: prd-to-yaml-app；description 含 PRD/线框图/yaml 页面/pactor 触发关键词）+ 输入要求 + 六阶段主干流程（输入解析 → 脚手架 → 页面生成 → mock 服务 → 样式移植 → 功能与视觉验收）+ references 索引 + 红线约定（dataSources 一律 type: http、文案以线框图为准、样式与功能必须与原产品一致、交互必须闭环可用、DSL 语法细节引用 pactor skill）
- [x] 1.2 创建 `packages/skills/prd-to-yaml-app/references/` 目录

## 2. references 模板

- [x] 2.1 `references/page-templates.md`：列表页 / 详情页 / 表单页三类 page.yaml 模板（含 http 数据源、筛选区、操作列、事件闭环的通用写法）
- [x] 2.2 `references/component-mapping.md`：线框图区域 → pactor 组件映射表（面包屑/页头/搜索筛选/卡片网格/表格/描述列表/Tab/表单分区/操作列），注明以 packages/ui 当前导出为准
- [x] 2.3 `references/mock-data-routes.md`：`app/api/data/[...path]/route.ts` 路由表模板（单段路径命名约定、handler 注册方式、替换真实接口的指引）
- [x] 2.4 `references/project-structure.md`：目标项目目录结构约定（sitemap.yaml / 模块分目录页面 yaml / 三个 api 路由 / 主题文件）与 sitemap.yaml 骨架示例
- [x] 2.5 `references/theme-and-style.md`：主题与样式移植指南——从原产品提取设计令牌（主色/前景背景/圆角，含深浅色）写入皮肤文件、页面级自定义 CSS 完整移植与挂载点、换肤入口与皮肤数量对齐、图表随肤切换
- [x] 2.6 `references/acceptance-checklist.md`：逐页验收清单（路由可达、http 数据源 200、渲染符合线框、交互逐项操作闭环含错误分支、控制台无错、深浅色切换、与原产品同页面视觉/功能对比）与验收结果输出格式

## 3. 校验

- [x] 3.1 校验 SKILL.md frontmatter 合法、references 索引与实际文件一一对应
- [x] 3.2 用 nexmux prd-diagram 中的一个模块（如 模型路由）走查 skill 流程，确认按指引能复现 nexmux-ui 对应页面（含样式与交互），补齐走查中发现的缺失指引
