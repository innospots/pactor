---
title: 详情页 — 纵向区块
slug: detail-sections
order: 6
summary: 按阅读顺序分 Card 展示信息；顶部概览 + 多块表格或键值对（顶概览多Card / 审计详情 / 主栏+侧栏元数据）
sourceRef: innos-diagram/references/06-详情页-纵向区块.md
---

# 详情页 — 纵向区块

**组件类型：** 只读/弱编辑详情  
**职责：** 按阅读顺序分 Card 展示信息；顶部概览 + 多块表格或键值对。

---

## 布局 A — 顶概览 + 多 Card

{{preview:01}}

```text
│ ← 返回列表                                                               │
│ ┌─ 顶概览 ─────────────────────────────────────────────────────────────┐ │
│ │ [图标] {名称}              [状态标签] [运行标签]        [主操作]       │ │
│ │        {描述}                                                          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ 基本信息 ───────────────────────────────────────────────────────────┐ │
│ │ 键值对网格                                                            │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ ┌─ 配置项（有则展示）──────────────────────────────────────────────────┐ │
│ │ 表格                                                                  │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
```

| 要点 | 说明 |
| --- | --- |
| 顶概览 | 图标 + 名称/描述居左，状态标签与主操作居右（`justify: space-between`） |
| 区块顺序 | 按阅读顺序纵向排列：概览 → 基本信息（Descriptions）→ 配置项（Table） |
| 可选区块 | 「配置项」等可选区块无数据时不渲染（见文末展示规则） |

**适用：** 插件详情、集成详情等「一个实体 + 若干信息块」的只读场景。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Card
          props: { className: w-full }
          children:
            - type: Flex
              props: { justify: space-between, align: center }
              children:
                - type: Flex
                  props: { gap: 12, align: center }
                  children:
                    - type: Flex
                      props: { className: rounded-md bg-muted p-3 }
                      children:
                        - type: Icon
                          props: { name: package, size: lg }
                    - type: Flex
                      props: { direction: vertical, align: start }
                      children:
                        - type: Text
                          props: { text: 数据同步插件, size: large, strong: true }
                        - type: Text
                          props:
                            text: 每日凌晨将业务库数据同步至分析库
                            size: small
                            type: secondary
                - type: Flex
                  props: { gap: 8, align: center }
                  children:
                    - type: Tag
                      props: { text: 已启用, color: success }
                    - type: Tag
                      props: { text: 运行中 }
                    - type: Button
                      props: { text: 手动触发, variant: primary }
        - type: Card
          props: { title: 基本信息, className: w-full }
          children:
            - type: Descriptions
              props:
                column: 3
                items:
                  - { label: 插件标识, value: data-sync }
                  - { label: 版本, value: v1.4.2 }
                  - { label: 发布方, value: 平台团队 }
                  - { label: 安装时间, value: '2026-08-12 09:30' }
                  - { label: 最近运行, value: '2026-10-09 02:00' }
                  - { label: 下次运行, value: '2026-10-10 02:00' }
        - type: Card
          props: { title: 配置项, className: w-full }
          children:
            - type: Table
              props:
                pagination: false
                columns:
                  - { title: 配置项, dataIndex: name }
                  - { title: 值, dataIndex: value }
                  - { title: 描述, dataIndex: description }
                dataSource:
                  - { id: 1, name: source.dsn, value: 'mysql://biz-db:3306/orders', description: 业务库连接串 }
                  - { id: 2, name: sync.cron, value: '0 2 * * *', description: 每日凌晨 2 点触发同步 }
                  - { id: 3, name: batch.size, value: '5000', description: 单批同步记录数上限 }
```

## 布局 B — 日志/审计详情

{{preview:02}}

```text
│ {操作标题}                                    ● 成功 · 120 ms            │
│ ┌ 操作信息 ─────────────────────────────────────────────────────────────┐ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ ┌ 执行结果 ─────────────────────────────────────────────────────────────┘ │
│ ┌ 请求参数（脱敏）────────────────────────────── [展开全部] ────────────┐ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                    [复制 ID] [返回]                      │
```

| 要点 | 说明 |
| --- | --- |
| 标题行 | 操作标题居左，右侧 Status + 耗时（`justify: space-between`） |
| 正文 | 操作信息 / 执行结果两张 Card，均为 Descriptions 键值对 |
| 请求参数 | 用 **Collapsible** 实现线框中的「展开全部」，内部 JSONViewer 展示脱敏后的参数 |
| 底部操作 | Flex `justify: end` 右对齐：复制 ID + 返回 |

**适用：** 审计日志详情、任务执行记录等追溯类只读页面。

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16, align: start }
      children:
        - type: Flex
          props: { justify: space-between, align: center, className: w-full }
          children:
            - type: Text
              props: { text: 导出用户列表, size: large, strong: true }
            - type: Flex
              props: { gap: 8, align: center }
              children:
                - type: Status
                  props: { status: success, text: 成功 }
                - type: Text
                  props: { text: 120 ms, size: small, type: secondary }
        - type: Card
          props: { title: 操作信息, className: w-full }
          children:
            - type: Descriptions
              props:
                column: 3
                items:
                  - { label: 操作人, value: 张三 }
                  - { label: 操作时间, value: '2026-10-09 14:32:08' }
                  - { label: 来源 IP, value: '103.86.*.*' }
                  - { label: 模块, value: 用户管理 }
                  - { label: 操作类型, value: 导出 }
                  - { label: 结果, value: 成功 }
        - type: Card
          props: { title: 执行结果, className: w-full }
          children:
            - type: Descriptions
              props:
                column: 2
                items:
                  - { label: 导出记录数, value: '1,284' }
                  - { label: 文件有效期, value: 24 小时 }
        - type: Collapsible
          props: { title: 请求参数（脱敏）, className: w-full }
          children:
            - type: JSONViewer
              props:
                expandedDepth: 2
                copyable: false
                data:
                  keyword: ''
                  status: active
                  page: 1
                  pageSize: 2000
                  password: '******'
        - type: Flex
          props: { justify: end, gap: 8, className: w-full }
          children:
            - type: Button
              props: { text: 复制 ID }
            - type: Button
              props: { text: 返回, variant: primary }
```

## 布局 C — 主栏 + 侧栏元数据

{{preview:03}}

```text
│ {配置中心} / {配置名称}                                                  │
│ {配置名称}                                                               │
│ ┌─ 配置内容（主栏 7）──────────────────┐  ┌─ 元数据（侧栏 3）─────────┐ │
│ │ JSON / Diff 宽内容                   │  │ 更新时间 / 更新人          │ │
│ │                                      │  │ 追踪 ID / 来源             │ │
│ └──────────────────────────────────────┘  └────────────────────────────┘ │
```

主栏放宽内容（JSON、Diff），右侧窄栏固定元数据（时间、操作者、追踪 ID）。用 Flex 内联 `style: { flex: 7 }` / `style: { flex: 3 }` 实现 7:3 分栏，主栏加 `minWidth: 0` 防止长内容撑破布局。

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
              - { label: 配置中心, href: /configs }
              - { label: 支付网关配置 }
        - type: Text
          props: { text: 支付网关配置, size: large, strong: true }
        - type: Flex
          props: { gap: 24, align: start, className: w-full }
          children:
            - type: Flex
              props: { direction: vertical, gap: 16, style: { flex: 7, minWidth: 0 } }
              children:
                - type: Card
                  props: { title: 配置内容 }
                  children:
                    - type: CodeBlock
                      props:
                        language: json
                        copyable: true
                        code: |
                          {
                            "endpoint": "https://pay-gateway.example.com/v2",
                            "timeout": 3000,
                            "retry": {
                              "maxAttempts": 3,
                              "backoff": "exponential"
                            }
                          }
            - type: Flex
              props: { direction: vertical, gap: 16, style: { flex: 3 } }
              children:
                - type: Card
                  props: { title: 元数据 }
                  children:
                    - type: Descriptions
                      props:
                        column: 1
                        items:
                          - { label: 更新时间, value: '2026-10-08 11:20' }
                          - { label: 更新人, value: 李四 }
                          - { label: 追踪 ID, value: tr-8f3k2 }
                          - { label: 来源, value: 控制台 }
```

## 展示规则

1. 可选区块 **无数据则不渲染标题**（不画空表）。
2. 敏感字段脱敏；不提供「查看明文」。
3. 长文本默认折叠，支持展开。
