# Spec: chat-activity-trace

## Purpose

助手消息的活动轨迹（`@pactor-app/chat`）：流式状态头与配对工具轨迹。


## Requirements

### Requirement: 流式状态头

assistant 消息流式期间 SHALL 在消息顶部渲染状态头：动画图标 + 状态文案 + 已用时长（秒级计时）。状态模式 SHALL 由纯函数 `detectStreamingMode(message)` 推导：存在 streaming 的 thinking part 且无更晚的活动 part → `reasoning`；存在 running/waiting 的 tool-call → `tool`；text/markdown/dsl part streaming → `responding`。消息结束后状态头 SHALL 定格为完成态（停止计时）。

#### Scenario: 模式推导

- **WHEN** 消息先收 thinking.delta 再收 tool.start
- **THEN** 状态模式先为 reasoning，后为 tool

#### Scenario: 结束定格

- **WHEN** message.end 使消息 completed
- **THEN** 状态头显示完成文案与最终时长，不再跳动

### Requirement: 配对工具轨迹

tool-call 与 tool-result part SHALL 经纯函数按 name + 出现顺序配对（同名取最早未完结的 call），渲染为单行可展开轨迹条目：工具名、人类可读摘要（含参数摘要）、状态图标（waiting/running/success/failed）。展开后显示参数与结果/错误详情。同一消息多个工具调用按序排列。配对结果（`ToolTraceEntry`）SHALL 携带配对 tool-call part 的 `args`（如有），供参数摘要与详情渲染。

#### Scenario: call 与 result 配对为一行

- **WHEN** 消息含 tool.start 与对应 tool.result
- **THEN** 渲染为单条轨迹条目，状态由 running 变为 success/failed，而非两张独立卡片

#### Scenario: 轨迹条目携带调用参数

- **WHEN** tool-call part 含 `args` 字段且与 tool-result 配对
- **THEN** 配对产生的 ToolTraceEntry 携带该 `args`，展开详情可展示调用参数

#### Scenario: 展开查看详情

- **WHEN** 点击轨迹条目
- **THEN** 展开显示该调用的参数与结果（或错误）内容

### Requirement: 轨迹自动折叠

轨迹区（状态头 + 工具调用列表 + 思考过程折叠卡；工具列表与思考过程为两个独立块）由状态头统一折叠/展开——折叠时全部内容隐藏，展开时同现。轨迹区在流式期间 SHALL 默认展开；当消息进入答案阶段（text/markdown part 开始 streaming 或消息结束）时 SHALL 自动折叠。自动折叠 SHALL 带单向闩锁：自动折叠发生一次后，该消息内 mode 回跳（答案阶段又来 tool / thinking 活动）MUST NOT 重新自动展开（防展开/折叠闪烁）。用户手动展开/折叠后 SHALL 固定（pin）其选择，该消息内不再自动变更。折叠状态按消息独立记忆。

#### Scenario: 答案阶段自动折叠

- **WHEN** 工具轨迹完成后正文 text part 开始流式输出
- **THEN** 轨迹区自动折叠为一行摘要

#### Scenario: 答案阶段活动回跳不重新展开

- **WHEN** 轨迹区已自动折叠后消息又出现工具调用或思考活动
- **THEN** 轨迹区保持折叠，不重新自动展开；用户仍可手动展开（pin）

#### Scenario: 用户固定展开

- **WHEN** 用户手动展开轨迹区后正文继续流式输出
- **THEN** 轨迹区保持展开，不再自动折叠
