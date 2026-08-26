# Delta: example-chat

## MODIFIED Requirements

### Requirement: AI DSL 安全渲染

示例 SHALL 以 Safe Registry 白名单渲染 LLM 下发的 dsl part，白名单组件来自 `pactor-ui`（shadcn）；白名单外组件类型 SHALL 渲染为 ChatDenied 受控占位，不抛错、不执行。示例 MUST NOT 依赖 antd——toast/confirm 等反馈经 `pactor-ui` 交互层（createUiBridge + ShadcnInteractionProvider）或等价手段实现。

#### Scenario: 白名单内 DSL 卡片

- **WHEN** 发送含「报表」的提问
- **THEN** dsl part 渲染为白名单组件（Flex / Card / Statistic / Alert）组成的统计卡片（shadcn 实现）

#### Scenario: 白名单外类型受控占位

- **WHEN** mock 下发含白名单外类型（如 Table）的 dsl part
- **THEN** 该节点渲染为 ChatDenied 占位，其余白名单节点正常渲染
