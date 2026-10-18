# Spec Delta: skill-prd-to-yaml-app

## MODIFIED Requirements

### Requirement: 项目脚手架与目录约定

Skill SHALL 以包内可运行 `template/` 为新建项目起点，并约定 `src/server/yaml/sitemap.yaml`、按模块分目录的页面 YAML、sitemap/public pages/data API 路由结构。脚手架 SHALL 按“复制模板 → 按 PRD values 安全替换 → rendered 检查 → 安装与冒烟 → 页面生成”执行，禁止带着未替换占位符进入页面生成。

#### Scenario: 复制后先替换并检查

- **WHEN** 新建项目复制模板完成
- **THEN** 使用清单值执行 render，特殊字符不破坏源码，rendered 检查通过后才安装依赖和生成页面

#### Scenario: 模板基准不可用

- **WHEN** 源模板含真实项目数据、构建产物、缺失默认皮肤或已知阻断交互的骨架缺陷
- **THEN** skills 验证失败，不得将其作为新项目起点分发

#### Scenario: 未指定工程名称时从 README 派生

- **WHEN** 用户未明确指定工程名称
- **THEN** 根据原型目录 README 中的产品名生成英文 kebab-case 工程名，创建前向用户确认一次
