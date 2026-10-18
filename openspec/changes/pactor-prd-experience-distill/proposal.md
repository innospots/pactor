# Proposal: pactor-prd-experience-distill

## Why

`skills/pactor-prd/template/` 是新建工程的唯一模板，但目前携带真实品牌、演示账号、专属皮肤与调试代码，并残留约 1.1GB 的 `node_modules/`、`.next/` 等本地产物。模板还存在会影响生成项目的实际问题：默认皮肤机制依赖真实皮肤文件、标准数据列表的请求体触发 runtime isOpaque、占位和验收规则无法机械执行。以该模板为起点会把残留和缺陷复制到每个新项目。

## What Changes

- 建立机器可读的占位符清单与安全替换/检查工具；占位符仅作为完整双引号字符串出现，替换值经 `JSON.stringify` 编码，避免破坏 YAML、TS、TSX，也不再使用会误伤 JSX 的 `grep "{{"` 零残留规则。
- 清理真实品牌、账号、演示文案、调试组件与样式、默认素材和构建产物；保留锁文件、通用页面骨架和可运行接线。
- 提供一套中性、精致、包含亮暗色令牌的默认皮肤，修正非法持久化皮肤值的回退，不接受空皮肤注册表或朴素无设计的回退。
- 修复标准数据列表的业务 `type` 字段触发 isOpaque 的提交缺陷，统一改用 `kind`，保持组件 DSL 的 `type` 键不变。
- 固化模板页的布局、Form/Field 间距和组件选择基线，并把模板检查接入现有 `skills/scripts/validate-skills.mjs`。
- 在临时副本完成占位替换、lint、build 和关键浏览器交互冒烟；最终 PRD 生成验收由后续 change 负责。

## Capabilities

### New Capabilities

- `prd-skill-template-placeholders`: 模板占位符、合法字符串编码、替换与残留检查、默认皮肤和源码级分发契约。

### Modified Capabilities

- `skill-prd-to-yaml-app`: 新建工程脚手架改为“复制 → 替换 → 检查 → 安装 → 页面生成”，模板必须先达到可运行基准。

## Impact

- `skills/pactor-prd/template/**`、`skills/pactor-prd/template-placeholders.json`、`skills/scripts/{prd-template,validate-skills}.mjs`。
- `skills/pactor-prd/SKILL.md` 及脚手架相关 references、`skills/README.md`。
- 不修改 `@pactor-app/*` 框架代码；不回改已有消费项目。
- 后续 change：`pactor-prd-ui-quality-contract`（生成/UI 契约）与 `pactor-prd-generated-project-acceptance`（最终生成项目端到端验收）。
