# Tasks: pactor-prd-experience-distill

## 1. 占位符与检查工具

- [x] 1.1 新增 `template-placeholders.json`（12 个键、说明、冒烟示例值）和 `skills/scripts/prd-template.mjs`，实现 `render`、`check --source`、`check --rendered`；先用合成临时目录验证普通 TSX `{{` 不受影响、特殊字符经 JSON 编码后合法、缺 key/未知 key/非字符串值会失败。
- [x] 1.2 将模板品牌、metadata、登录提示、日期、账号和演示文案应用到清单；日期保持 start/end 对象，权限与 `/api/users` 授权检查一致，`MOCK_USERS` 由演示账号派生。
- [x] 1.3 扩展 `skills/scripts/validate-skills.mjs` 调用源模板检查，并检查禁止路径、旧品牌/账号/皮肤、默认素材和 neutral 皮肤存在性。

## 2. 正确性与视觉基线

- [x] 2.1 将 `models/data-list.yaml` 业务字段 `type` 改为 `kind`，同步 Select、状态、筛选、行数据、表格列和提交体；验证 POST JSON 无 `${...}` 字面残留，组件 DSL `type` 不变。
- [x] 2.2 新增 `public/skins/neutral.css`，删除三套真实皮肤；更新 `skin.ts`、ThemeSwitcher 和 layout 首屏脚本，非法旧皮肤值回退 neutral，明暗初始化不依赖皮肤 link。
- [x] 2.3 核对 data-list、dashboard、login 的布局/间距/组件基线：搜索 Form inline、Field 标签与错误间距、统一 Flex/Grid gap、语义化控件和响应式表现；只修不符合项，不新增页面级间距补丁。

## 3. 清理与文档

- [x] 3.1 删除 node_modules、.next、tsbuildinfo、.DS_Store、默认 SVG/favicon、debug-chat/log-status 及其注册/注释/样式；移除未使用 TemplateCardLink 和 next.svg 引用，`.gitignore` 补 `.DS_Store`，保留 lockfile/workspace。
- [x] 3.2 更新 template README、SKILL.md 脚手架阶段、project-structure 和 acceptance-checklist：替换命令与脚本 CLI 一致，验收包含残留、默认皮肤、布局/间距和组件选择，删除三皮肤及过时目录描述。
- [x] 3.3 运行 `pnpm -C skills validate`、`node skills/scripts/prd-template.mjs check skills/pactor-prd/template --source`、`openspec validate pactor-prd-experience-distill --strict` 和 `git diff --check`。

## 4. 临时副本冒烟

- [x] 4.1 复制到临时目录，使用示例值和特殊字符值分别 render/check；install 后运行 lint、build 和 `tsc --noEmit`，确认源模板未重新产生构建产物。
- [x] 4.2 浏览器验证正确/错误登录、登出、dashboard 日期范围、data-list 新建/编辑提交、用户权限、neutral 亮暗色及窄屏；正常路径无新增 console error，最后复核模板体积和 layout 既有修改。
- [x] 4.3 阶段复审并补齐遗漏路径：route 整体 form 预填、provider/route 真实写操作结果分支、标准 data-list 保存失败保留输入、标准文档 kind 同步、Markdown/CSS/JS/MJS/SVG 残留扫描，以及 Login 分栏聚合样式级联修复；相关 ActionEngine/浏览器与静态门禁通过。
- [x] 4.4 端到端生成验收驱动修复：Sidebar 响应式 display 级联、Header 用户名为空时的安全回退、SitemapApp 默认 HTTP 拆包钩子接入，以及 dashboard 响应式栅格；最终生成项目静态门禁与浏览器功能场景通过。
