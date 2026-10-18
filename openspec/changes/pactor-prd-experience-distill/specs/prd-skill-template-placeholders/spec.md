# Spec: prd-skill-template-placeholders

## Purpose

定义 pactor-prd 源模板的占位、替换、默认视觉和源码分发契约，使复制后的项目能够安全替换并继续构建运行。

## ADDED Requirements

### Requirement: 占位符清单与合法编码

模板占位符 SHALL 使用清单登记的 `{{SCREAMING_SNAKE}}` 键，并作为完整双引号字符串出现。替换工具 SHALL 使用 `JSON.stringify` 编码值，SHALL NOT 对普通 TSX `{{...}}` 或 DSL `${...}` 做替换。

#### Scenario: 特殊字符替换

- **WHEN** 替换值包含引号、反斜杠或换行
- **THEN** 替换后的 YAML、TS、TSX 仍保持合法字符串和原数据形状

#### Scenario: 不误伤源码语法

- **WHEN** 文件包含 `style={{...}}` 或 `${state.x}`
- **THEN** 检查和替换不会把这些内容当作占位符

### Requirement: 替换完整性与失败前置

工具 SHALL 在写入前校验缺失键、未知键和非字符串值；源检查 SHALL 验证清单与模板一致，rendered 检查 SHALL 验证占位符和真实项目数据零残留。

#### Scenario: 值集合不合法

- **WHEN** values 缺少键、包含未知键或任一值不是字符串
- **THEN** 工具非零退出且不写入部分结果

#### Scenario: 替换后仍有残留

- **WHEN** rendered 目录仍有清单占位符、真实品牌、旧账号或旧皮肤
- **THEN** rendered 检查非零退出并报告文件

### Requirement: 中性默认视觉与本地偏好回退

模板 SHALL 提供一套完整亮暗色的中性默认皮肤。非法或不存在的持久化皮肤值 SHALL 回退到默认皮肤；皮肤加载失败不得影响明暗模式初始化。

#### Scenario: 旧皮肤值已失效

- **WHEN** localStorage 保存已删除的皮肤名
- **THEN** 页面使用 neutral，无 404 循环或白屏，明暗切换仍可用

### Requirement: 模板源码级分发与骨架正确性

模板 SHALL NOT 包含构建产物、真实项目专属组件/样式/素材或已知会阻断交互的骨架缺陷；锁文件和通用页面结构 SHALL 保留。标准数据列表提交体 SHALL NOT 因业务 `type` 键触发 isOpaque 而保留未求值表达式。

#### Scenario: 标准列表提交

- **WHEN** 新建或编辑标准数据列表记录
- **THEN** POST JSON 中业务字段均为实际值，不出现 `${...}` 字面量

#### Scenario: 模板目录检查

- **WHEN** 检查源模板
- **THEN** 不存在 node_modules、.next、真实调试代码和默认 Next 素材，目录为源码级规模
