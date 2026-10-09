---
title: 独立表单页
slug: form-page
order: 7
summary: 单页完成字段录入与提交；与列表编辑共用同一表单结构（单Card / 分组多Card / 步骤条 / 裸表单 / 固定底栏 / 双列栅格）
sourceRef: innos-diagram/references/07-独立表单页.md
---

# 独立表单页

**组件类型：** 创建/编辑（管理端 **01 外壳** 内）  
**职责：** 单页完成字段录入与提交；与列表「编辑」共用同一表单结构。

---

## 布局选型速览

| 布局 | 要点 | 典型场景 |
| --- | --- | --- |
| **A** | 单 Card + 垂直 Form | 简单新建 |
| **B1** | 多 **Card 纵向** 分组（段标题） | 开通租户 |
| **B2** | 多 Card **宽屏横排** 或高级区折叠 | 字段多、域清晰拆分 |
| **C** | 步骤条 Wizard | 多步开通、需分步校验 |
| **D** | **无 Card** 裸表单区（仅标题 + Form） | 添加平台用户 |
| **E** | 长表单 + **底栏固定** 提交条 | 字段超一屏 |
| **F** | 单 Card 内 **双列栅格** 字段 | 联系人/地址等成对字段 |

---

## 布局 A — 单 Card 垂直表单

{{preview:01}}

```text
│ {模块} / {列表} / {新建|编辑}                                              │
│ {标题}                                                                     │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Form · layout: vertical                                                │ │
│ │  字段 * [________________]                                             │ │
│ │  …                                                                     │ │
│ │                                          [取消] [提交]                 │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
```

| 规则 | 说明 |
| --- | --- |
| 容器 | 整页一组字段 + 校验必须用 **Form** |
| 编辑 | 与新建同页；只读字段 `disabled` + 文案说明 |
| 提交 | 成功跳转详情或列表 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Breadcrumb
          props:
            items:
              - { label: 角色管理, href: /roles }
              - { label: 新建角色 }
        - type: Text
          props: { text: 新建角色, size: large, strong: true }
        - type: Card
          props: { className: w-full }
          children:
            - type: Form
              props: { layout: vertical }
              events:
                onSubmit:
                  - action: message
                    params: { messageType: success, text: 提交成功 }
              children:
                - type: Field
                  props: { label: 角色名称, required: true }
                  children:
                    - type: Input
                      props:
                        name: name
                        placeholder: 请输入角色名称
                        rules:
                          - { required: true, message: 请输入角色名称 }
                - type: Field
                  props: { label: 角色编码, required: true, description: 创建后不可修改 }
                  children:
                    - type: Input
                      props:
                        name: code
                        placeholder: 如 ROLE_OPERATOR
                        rules:
                          - { required: true, message: 请输入角色编码 }
                - type: Field
                  props: { label: 状态 }
                  children:
                    - type: Switch
                      props: { name: enabled, value: true }
                - type: Field
                  props: { label: 备注 }
                  children:
                    - type: Textarea
                      props: { name: remark, placeholder: 选填，说明角色用途 }
                - type: Field
                  children:
                    - type: Flex
                      props: { justify: end, gap: 8 }
                      children:
                        - type: Button
                          props: { text: 取消 }
                          events:
                            onClick:
                              - action: message
                                params: { messageType: info, text: 已取消 }
                        - type: Button
                          props: { text: 提交, variant: primary, submit: true }
```

## 布局 B1 — 分组多 Card（纵向堆叠）

{{preview:02}}

同一页 **多个 Card** 上下排列，每 Card 一个 **段标题**（租户信息 / 企业档案）。仍是一个 Form；提交钮集中在最底一组，不每 Card 各一套。Form 可以直接包 Card——Field 只要求包控件。

```text
│ 开通租户                                                                   │
│ ┌─ 租户信息 ─────────────────────────────────────────────────────────────┐ │
│ │ 显示名称 * [________]   租户编码 * [________]  创建后不可修改          │ │
│ │ …                                                                      │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ 企业档案 ─────────────────────────────────────────────────────────────┐ │
│ │ 法定名称 * [________]  …                                               │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                              [取消]  [确认开通]                            │
```

| 规则 | 说明 |
| --- | --- |
| 与 A 区别 | 多段 **视觉分组**；提交钮通常在 **最底** 一组，不每 Card 各一套（除非分步） |
| 段内 | 可用 **F 双列栅格** 排字段 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Text
          props: { text: 开通租户, size: large, strong: true }
        - type: Form
          props: { layout: vertical, className: w-full }
          events:
            onSubmit:
              - action: message
                params: { messageType: success, text: 开通成功 }
          children:
            - type: Card
              props: { title: 租户信息 }
              children:
                - type: Field
                  props: { label: 显示名称, required: true }
                  children:
                    - type: Input
                      props:
                        name: displayName
                        placeholder: 请输入租户显示名称
                        rules:
                          - { required: true, message: 请输入租户显示名称 }
                - type: Field
                  props: { label: 租户编码, required: true, description: 创建后不可修改 }
                  children:
                    - type: Input
                      props:
                        name: tenantCode
                        placeholder: 如 acme-corp
                        rules:
                          - { required: true, message: 请输入租户编码 }
                - type: Field
                  props: { label: 套餐 }
                  children:
                    - type: Select
                      props:
                        name: plan
                        placeholder: 请选择套餐
                        options:
                          - { label: 基础版, value: basic }
                          - { label: 专业版, value: pro }
                          - { label: 旗舰版, value: flagship }
            - type: Card
              props: { title: 企业档案, className: mt-4 }
              children:
                - type: Field
                  props: { label: 法定名称, required: true }
                  children:
                    - type: Input
                      props:
                        name: legalName
                        placeholder: 请输入企业法定名称
                        rules:
                          - { required: true, message: 请输入企业法定名称 }
                - type: Field
                  props: { label: 统一信用代码 }
                  children:
                    - type: Input
                      props: { name: creditCode, placeholder: 18 位统一社会信用代码 }
                - type: Field
                  props: { label: 联系人 }
                  children:
                    - type: Input
                      props: { name: contact, placeholder: 请输入联系人姓名 }
                - type: Field
                  props: { label: 联系电话 }
                  children:
                    - type: Input
                      props: { name: phone, placeholder: 请输入联系电话 }
            - type: Field
              props: { className: mt-4 }
              children:
                - type: Flex
                  props: { justify: end, gap: 8 }
                  children:
                    - type: Button
                      props: { text: 取消 }
                      events:
                        onClick:
                          - action: message
                            params: { messageType: info, text: 已取消 }
                    - type: Button
                      props: { text: 确认开通, variant: primary, submit: true }
```

## 布局 B2 — 分组多 Card（宽屏横排 / 折叠高级区）

{{preview:03}}

字段 >8 且 **两段可并行阅读** 时用 B2；窄屏 **降为 B1 纵向**。低频配置收进 **Collapsible** 高级区，默认不干扰主流程。

```text
│ ┌ 基本信息 ─────────┐  ┌ 扩展配置 ─────────┐   ← 宽屏 2 列 Card
│ │ 字段…              │  │ 字段…              │
│ └────────────────────┘  └────────────────────┘
│ ┌ 高级选项（可折叠）──────────────────────────────────────────────────────┐ │
│ └────────────────────────────────────────────────────────────────────────┘ │
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Text
          props: { text: 新建接入应用, size: large, strong: true }
        - type: Form
          props: { layout: vertical, className: w-full }
          events:
            onSubmit:
              - action: message
                params: { messageType: success, text: 保存成功 }
          children:
            - type: Grid
              props: { columns: 2, gap: 16 }
              children:
                - type: Card
                  props: { title: 基本信息 }
                  children:
                    - type: Field
                      props: { label: 名称, required: true }
                      children:
                        - type: Input
                          props:
                            name: name
                            placeholder: 请输入应用名称
                            rules:
                              - { required: true, message: 请输入应用名称 }
                    - type: Field
                      props: { label: 编码, required: true, description: 创建后不可修改 }
                      children:
                        - type: Input
                          props:
                            name: code
                            placeholder: 如 data-sync
                            rules:
                              - { required: true, message: 请输入应用编码 }
                - type: Card
                  props: { title: 扩展配置 }
                  children:
                    - type: Field
                      props: { label: 接入区域 }
                      children:
                        - type: Select
                          props:
                            name: region
                            placeholder: 请选择接入区域
                            options:
                              - { label: 华东, value: cn-east }
                              - { label: 华北, value: cn-north }
                              - { label: 华南, value: cn-south }
                    - type: Field
                      props: { label: 回调地址 }
                      children:
                        - type: Input
                          props: { name: callbackUrl, placeholder: https://example.com/callback }
            - type: Collapsible
              props: { title: 高级选项, className: mt-4 }
              children:
                - type: Field
                  props: { label: 数据保留期 }
                  children:
                    - type: Select
                      props:
                        name: retention
                        value: d90
                        options:
                          - { label: 30 天, value: d30 }
                          - { label: 90 天, value: d90 }
                          - { label: 1 年, value: y1 }
                - type: Field
                  props: { label: 开启审计 }
                  children:
                    - type: Switch
                      props: { name: auditEnabled, value: false }
            - type: Field
              props: { className: mt-4 }
              children:
                - type: Flex
                  props: { justify: end, gap: 8 }
                  children:
                    - type: Button
                      props: { text: 取消 }
                      events:
                        onClick:
                          - action: message
                            params: { messageType: info, text: 已取消 }
                    - type: Button
                      props: { text: 保存, variant: primary, submit: true }
```

## 布局 C — 步骤条（Wizard）

{{preview:04}}

每步独立 **Form** 或同一 Form 分步校验；**确认步** 可只读摘要 + 提交。线框注明是否允许跳步、是否保存草稿。

真实场景中 `Steps` 的 `current` 绑定 `${state.step}`，按步切换 Field 并分步校验（「下一步」校验当前步、最后一步变「提交」）。本预览为静态展示，`current` 固定为 0。

```text
│  (1) 基本信息 ── (2) 配置 ── (3) 确认                                      │
│  【当前步骤 Form】                                                          │
│                                    [上一步] [下一步 | 提交]                │
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
# state: { step: 0 }
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Text
          props: { text: 开通服务, size: large, strong: true }
        - type: Card
          props: { className: w-full }
          children:
            - type: Flex
              props: { direction: vertical, gap: 16 }
              children:
                - type: Steps
                  props:
                    current: "${state.step}"
                    items:
                      - { title: 基本信息 }
                      - { title: 配置 }
                      - { title: 确认 }
                - type: Form
                  props: { layout: vertical }
                  events:
                    onSubmit:
                      - action: if
                        params:
                          condition: "${state.step == 0}"
                          then:
                            - action: setState
                              params: { step: 1 }
                          else:
                            - action: message
                              params: { messageType: success, text: 开通成功 }
                            - action: setState
                              params: { step: 0 }
                  children:
                    - type: Flex
                      when: "${state.step == 0}"
                      props: { direction: vertical, gap: 0 }
                      children:
                        - type: Field
                          props: { label: 名称, required: true }
                          children:
                            - type: Input
                              props:
                                name: name
                                placeholder: 请输入服务名称
                                rules:
                                  - { required: true, message: 请输入服务名称 }
                        - type: Field
                          props: { label: 负责人 }
                          children:
                            - type: Input
                              props: { name: owner, placeholder: 请输入负责人 }
                    - type: Flex
                      when: "${state.step == 1}"
                      props: { direction: vertical, gap: 0 }
                      children:
                        - type: Field
                          props: { label: 接入区域 }
                          children:
                            - type: Select
                              props:
                                name: region
                                value: cn-east
                                options:
                                  - { label: 华东, value: cn-east }
                                  - { label: 华北, value: cn-north }
                        - type: Field
                          props: { label: 数据保留期 }
                          children:
                            - type: Select
                              props:
                                name: retention
                                value: d90
                                options:
                                  - { label: 30 天, value: d30 }
                                  - { label: 90 天, value: d90 }
                    - type: Flex
                      when: "${state.step == 2}"
                      props: { direction: vertical, gap: 8 }
                      children:
                        - type: Text
                          props: { text: 请确认以下信息无误后提交, size: small, type: secondary }
                        - type: Flex
                          props: { gap: 8 }
                          children:
                            - type: Text
                              props: { text: 服务名称：, type: secondary }
                            - type: Text
                              props: { text: "${form.name}" }
                        - type: Flex
                          props: { gap: 8 }
                          children:
                            - type: Text
                              props: { text: 接入区域：, type: secondary }
                            - type: Text
                              props: { text: "${form.region}" }
                    - type: Flex
                      props: { justify: space-between, className: mt-4 }
                      children:
                        - type: Button
                          props:
                            text: 上一步
                            disabled: "${state.step == 0}"
                          events:
                            onClick:
                              - action: setState
                                params: { step: "${state.step - 1}" }
                        - type: Button
                          when: "${state.step == 0}"
                          props: { text: 下一步, variant: primary, submit: true }
                        - type: Button
                          when: "${state.step == 1}"
                          props: { text: 下一步, variant: primary }
                          events:
                            onClick:
                              - action: setState
                                params: { step: 2 }
                        - type: Button
                          when: "${state.step == 2}"
                          props: { text: 提交, variant: primary, submit: true }
```

## 布局 D — 无 Card 裸表单区

{{preview:05}}

页面 **不包** 外层 Card：标题 + 描述（可选）后 **直接 Form vertical**，字段落在内容区背景上。

```text
│ 新建平台用户                                                               │
│  登录名 *     [________________________]  创建后不可修改                    │
│  显示名称     [________________________]                                  │
│  …                                                                         │
│  □ 创建后强制首次登录改密                                                    │
│                              [取消] [创建]                                 │
```

| 规则 | 说明 |
| --- | --- |
| 适用 | 字段 ≤10、无强「分段」诉求的实施表单 |
| 与 A | 交互相同，仅 **无 Card 边框**；线框勿画多余外框 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Breadcrumb
          props:
            items:
              - { label: 平台用户, href: /platform-users }
              - { label: 添加平台用户 }
        - type: Text
          props: { text: 添加平台用户, size: large, strong: true }
        - type: Text
          props: { text: 为平台运维团队创建登录账号, size: small, type: secondary }
        - type: Form
          props: { layout: vertical, className: w-full }
          events:
            onSubmit:
              - action: message
                params: { messageType: success, text: 创建成功 }
          children:
            - type: Field
              props: { label: 登录名, required: true, description: 创建后不可修改 }
              children:
                - type: Input
                  props:
                    name: username
                    placeholder: 请输入登录名
                    rules:
                      - { required: true, message: 请输入登录名 }
            - type: Field
              props: { label: 显示名称 }
              children:
                - type: Input
                  props: { name: displayName, placeholder: 请输入显示名称 }
            - type: Field
              props: { label: 邮箱 }
              children:
                - type: Input
                  props: { name: email, placeholder: name@example.com }
            - type: Field
              props: { label: 角色 }
              children:
                - type: Select
                  props:
                    name: role
                    placeholder: 请选择角色
                    options:
                      - { label: 平台管理员, value: admin }
                      - { label: 只读运维, value: readonly }
            - type: Field
              children:
                - type: Checkbox
                  props: { name: forceReset, label: 创建后强制首次登录改密, value: true }
            - type: Field
              children:
                - type: Flex
                  props: { justify: end, gap: 8 }
                  children:
                    - type: Button
                      props: { text: 取消 }
                      events:
                        onClick:
                          - action: message
                            params: { messageType: info, text: 已取消 }
                    - type: Button
                      props: { text: 创建, variant: primary, submit: true }
```

## 布局 E — 长表单 + 底栏固定提交

{{preview:06}}

字段超过一屏时，**主操作固定在视口底**（或内容区底 sticky），滚动时始终可见。与 **B1** 可组合：多 Card 滚动 + 底栏一组按钮。取消仍回列表/详情。

```text
│ ┌─ Form 内容（可滚动）───────────────────────────────────────────────────┐ │
│ │  字段… 字段… 字段…                                                       │ │
│ │  …                                                                       │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  [取消]  [提交]  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Text
          props: { text: 编辑供应商档案, size: large, strong: true }
        - type: Form
          props: { layout: vertical, className: w-full }
          events:
            onSubmit:
              - action: message
                params: { messageType: success, text: 提交成功 }
          children:
            - type: Card
              props: { title: 基本信息 }
              children:
                - type: Field
                  props: { label: 名称, required: true }
                  children:
                    - type: Input
                      props:
                        name: name
                        placeholder: 请输入供应商名称
                        rules:
                          - { required: true, message: 请输入供应商名称 }
                - type: Field
                  props: { label: 编码, required: true, description: 创建后不可修改 }
                  children:
                    - type: Input
                      props:
                        name: code
                        placeholder: 如 SUP-0001
                        rules:
                          - { required: true, message: 请输入供应商编码 }
                - type: Field
                  props: { label: 负责人 }
                  children:
                    - type: Input
                      props: { name: owner, placeholder: 请输入负责人 }
                - type: Field
                  props: { label: 联系电话 }
                  children:
                    - type: Input
                      props: { name: phone, placeholder: 请输入联系电话 }
            - type: Card
              props: { title: 扩展信息, className: mt-4 }
              children:
                - type: Field
                  props: { label: 地址 }
                  children:
                    - type: Input
                      props: { name: address, placeholder: 请输入地址 }
                - type: Field
                  props: { label: 行业 }
                  children:
                    - type: Select
                      props:
                        name: industry
                        placeholder: 请选择行业
                        options:
                          - { label: 制造业, value: manufacturing }
                          - { label: 零售, value: retail }
                          - { label: 软件服务, value: software }
                - type: Field
                  props: { label: 规模 }
                  children:
                    - type: Select
                      props:
                        name: scale
                        placeholder: 请选择规模
                        options:
                          - { label: 50 人以下, value: s }
                          - { label: 50-500 人, value: m }
                          - { label: 500 人以上, value: l }
                - type: Field
                  props: { label: 备注 }
                  children:
                    - type: Textarea
                      props: { name: remark, placeholder: 选填 }
            - type: Affix
              props: { offsetBottom: 0 }
              children:
                - type: Flex
                  props:
                    justify: end
                    gap: 8
                    className: border-t border-border bg-card px-4 py-3
                  children:
                    - type: Button
                      props: { text: 取消 }
                      events:
                        onClick:
                          - action: message
                            params: { messageType: info, text: 已取消 }
                    - type: Button
                      props: { text: 提交, variant: primary, submit: true }
```

## 布局 F — Card 内双列栅格

{{preview:07}}

单段内 `Grid columns: 2`：短字段并排（联系人+电话、编码+类型）；整行字段用 `style: { gridColumn: '1 / -1' }` 跨列，线框对跨列字段注明。

```text
│ ┌─ 企业档案 ─────────────────────────────────────────────────────────────┐ │
│ │ 法定名称 * [____________________]  信用代码   [____________________] │ │
│ │ 联系人     [________]  电话 [________]  邮箱 [________]              │ │
│ │ 注册地址     [________________________________________]  （跨列整行）  │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Text
          props: { text: 编辑企业档案, size: large, strong: true }
        - type: Card
          props: { title: 企业档案, className: w-full }
          children:
            - type: Form
              props: { layout: vertical }
              events:
                onSubmit:
                  - action: message
                    params: { messageType: success, text: 保存成功 }
              children:
                - type: Grid
                  props: { columns: 2, gap: 16 }
                  children:
                    - type: Field
                      props: { label: 法定名称, required: true }
                      children:
                        - type: Input
                          props:
                            name: legalName
                            placeholder: 请输入企业法定名称
                            rules:
                              - { required: true, message: 请输入企业法定名称 }
                    - type: Field
                      props: { label: 统一信用代码 }
                      children:
                        - type: Input
                          props: { name: creditCode, placeholder: 18 位统一社会信用代码 }
                    - type: Field
                      props: { label: 联系人 }
                      children:
                        - type: Input
                          props: { name: contact, placeholder: 请输入联系人姓名 }
                    - type: Field
                      props: { label: 联系电话 }
                      children:
                        - type: Input
                          props: { name: phone, placeholder: 请输入联系电话 }
                    - type: Field
                      props: { label: 邮箱 }
                      children:
                        - type: Input
                          props: { name: email, placeholder: name@example.com }
                    - type: Field
                      props: { label: 注册地址, style: { gridColumn: '1 / -1' } }
                      children:
                        - type: Input
                          props: { name: regAddress, placeholder: 请输入注册地址 }
                - type: Field
                  props: { className: mt-4 }
                  children:
                    - type: Flex
                      props: { justify: end, gap: 8 }
                      children:
                        - type: Button
                          props: { text: 取消 }
                          events:
                            onClick:
                              - action: message
                                params: { messageType: info, text: 已取消 }
                        - type: Button
                          props: { text: 保存, variant: primary, submit: true }
```

---

## 页头与操作（各布局共用）

```text
│ {面包屑}                                                                   │
│ {标题}                                                                     │
```

| 元素 | 规则 |
| --- | --- |
| **取消** | 回列表或详情；未保存离开可 confirm（线框写明） |
| **提交** | `submit: true`；主按钮文案与 API 语义一致（创建/保存/开通） |
| **次要** | 「保存草稿」仅 Wizard 或长表单需要时增加 |
| **页头主操作** | **不要** 与表单底重复提交；页头仅保留返回类或没有按钮 |

---

## 与列表的关系

- 列表「编辑」与「新建」**同一路由表单**；编辑 `initialValues` 预填。
- 操作列 **link**「编辑」跳转，不在列表行内嵌大表单。
