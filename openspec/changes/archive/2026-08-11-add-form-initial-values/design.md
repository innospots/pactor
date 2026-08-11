# Design: add-form-initial-values

## Context

编辑场景需要表单回填。现状：radix kit 的 Form 上下文只跟踪用户输入（`values[name]` 初始为空），字段在 Form 内忽略 `value` prop；antd kit 的 Form 基于 antd Form（天然有 initialValues 机制，但 DSL 适配层未暴露）。

约束：双 kit 契约一致（同一份 DSL 行为相同）；不破坏既有表单行为与测试。

## Goals / Non-Goals

**Goals:**

- Form `initialValues` prop + 字段级 `value` 初始值（字段级优先）。
- 初始值参与提交与校验；双 kit 实现与测试。
- 示例抽屉回填 + 截图验证。

**Non-Goals:**

- 动态重置（initialValues 变化后重建表单——V1 仅创建时生效，key 重建由宿主控制）；
- 嵌套路径初始值（`a.b` 字段名按扁平键处理）。

## Decisions

### D1: DSL 契约

- `Form.props.initialValues?: Record<string, unknown>`——Renderer 已深度解析表达式，`${params}` 这类整体表达式可直接把对象传入。
- 字段 `value` prop：Form 内作为初始值（不再被忽略）；优先级：字段 `value` > `initialValues[name]`。
- 提交 values 包含未被触碰的初始值字段；required 校验以合并后的值判定。

### D2: radix kit 实现

- Form 上下文创建时：`values = { ...initialValues }`；字段挂载注册时若 `values[name]` 为空且字段有 `value`，写入字段级初始值。
- Input/Select 的 Form 分支渲染值 = `values[name]`（初始即回填）；校验与提交逻辑不变（values 已含初始值）。

### D3: antd kit 实现

- Form 适配器把 `initialValues` 透传 antd Form；字段 Form.Item 设 `initialValue: props.value`（存在时）。
- 校验/提交走 antd 既有机制，语义天然对齐。

### D4: 示例更新

- customer-list：overlay.open params 增加 `phone: ${row.phone}`、`level: ${row.level}`；抽屉表单字段加 `value: ${params.name}` 等（或 Form `initialValues: ${params}`——字段级 value 更直观，示例用字段级）。
- placeholder "留空则保持不变" 文案更新（现在会回填）。

## Risks / Trade-offs

- [字段挂载顺序与 initialValues 合并时序] → 挂载注册时合并（值已存在不覆盖），测试锁定。
- [overlay 每次打开重建表单] → host 重建即重新取初始值，行为正确。

## Migration Plan

无（向后兼容的新增 prop）。顺序：radix kit → antd kit → 示例 → 截图验证。

## Open Questions

- initialValues 变化重置表单：后续按反馈加（可用 key 重建绕过）。
