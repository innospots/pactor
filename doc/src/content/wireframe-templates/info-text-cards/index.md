---
title: 信息与文本卡片
slug: info-text-cards
order: 13
summary: 语义色提示块（info/success/warning/error）与 Card 承载的纯文本 / Markdown / HTML 阅读区
sourceRef: innos-diagram/references/13-信息与文本卡片.md
---

# 信息与文本卡片

**组件类型：** 只读内容块（可嵌在任意外壳页面内）  
**职责：** 用语义色提示用户（info / success / warning / error），或用 Card 承载纯文本、Markdown、HTML 排版内容。

与仪表盘页的 W1–W6 不同：W* 为指标/图表 Widget；本模板的 I* 为提示语义、T* 为富文本阅读区，二者可出现在仪表盘、表单、详情、列表顶栏等任意位置。

---

## 信息语义类型

| 类型 | 语义 | 线框旁注 | 典型场景 |
| --- | --- | --- | --- |
| **info** | 中性说明、引导 | `I-info` | 计费规则、功能说明、待办提示 |
| **success** | 已完成、正向结果 | `I-success` | 提交成功摘要、同步完成 |
| **warning** | 需留意、未阻断 | `I-warning` | 配额将满、配置缺失、演示环境 |
| **error** | 失败、阻断、风险 | `I-error` | 校验失败汇总、接口不可用、权限不足 |

**无障碍：** 状态须 **图标 + 文案**（或标题），不仅靠边框/背景色区分。

---

## 布局 I-A — 条带 Alert（无 Card 外框）

{{preview:01}}

贴在 **页头下**、**Form 顶**、**表格上** 的横向条，宽度随内容区。当前实现 `Alert` 仅支持 `message / description / variant / showIcon / icon`：线框中的 `[×]`（可关闭）与 `[重试]`（action）暂以 description 文案承载（如「服务暂时不可用，请稍后重试。」）。

```text
│ ╭─ I-info ───────────────────────────────────────────────────────────╮ │
│ │ ℹ  数据每 5 分钟刷新一次；实时 RPM 为近 1 分钟滑动窗口。      [×]   │ │
│ ╰────────────────────────────────────────────────────────────────────╯ │
│ ╭─ I-warning ────────────────────────────────────────────────────────╮ │
│ │ ⚠  当前为演示租户，部分 API 不会真实扣费。                          │ │
│ ╰────────────────────────────────────────────────────────────────────╯ │
│ ╭─ I-error ──────────────────────────────────────────────────────────╮ │
│ │ ✕  看板加载失败：服务暂时不可用。                    [重试] [×]   │ │
│ ╰────────────────────────────────────────────────────────────────────╯ │
```

| 字段 | 规则 |
| --- | --- |
| **message** | 主文案一行或短段 |
| **description** | 可选第二段，muted 或换行 |
| **action** | 可选 link / 按钮（重试、去设置）；当前实现无此 prop，以 description 文案承载 |
| **closable** | 可关闭时线框标 `[×]`，关闭后状态是否持久由 PRD 写明；当前实现不支持关闭 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16 }
      children:
        - type: Alert
          props:
            variant: info
            showIcon: true
            message: 数据每 5 分钟刷新一次
            description: 实时 RPM 为近 1 分钟滑动窗口。
        - type: Alert
          props:
            variant: warning
            showIcon: true
            message: 当前为演示租户
            description: 部分 API 不会真实扣费。
        - type: Alert
          props:
            variant: error
            showIcon: true
            message: 看板加载失败
            description: 服务暂时不可用，请稍后重试。
        - type: Text
          props:
            text: 条带贴页头下 / Form 顶 / 表格上，宽度随内容区；同屏多条按 error > warning > info > success 优先级自上而下排列。
            type: secondary
            size: small
```

## 布局 I-B / I-C / I-D — 语义卡 · 结果卡 · 行内提示

{{preview:02}}

- **I-B 语义卡**：整块 Card 承载一条语义信息，图标 + 标题同一行，下方说明文案，右下角单主 link。
- **I-C 结果卡**：操作完成后的结果摘要（`Result`），可带后续操作按钮。
- **I-D 行内提示**：不占整行 Card，用 `Field` 的 `description` 在单字段旁给出警示。

```text
┌─ Card · I-info ────────────────────────────────────────────────────────┐
│ ℹ  计费说明                                                            │
│ 按 Token 用量计费；账单日每月 1 日结算。                               │
│                                                          [查看定价 →]  │
└────────────────────────────────────────────────────────────────────────┘
┌─ Card · I-success ───────────────────────────────────────────────────┐
│ ✓  租户已开通                                                          │
│ 租户编码 `acme-corp` 已生效。                                          │
│ [进入租户控制台 →]  [继续邀请用户]                                     │
└────────────────────────────────────────────────────────────────────────┘
│ 租户编码 * [______________]  ⚠ 创建后不可修改          ← I-warning·inline
```

| 规则 | 说明 |
| --- | --- |
| **标题** | 可选；有标题时 **图标 + 标题** 同一行 |
| **列表** | error / warning 常用 **bullet 多条** 汇总校验 |
| **底操作** | 单主 link 或右对齐按钮；危险跳转仍遵守确认规范 |

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16 }
      children:
        - type: Card
          props: { className: w-full }
          children:
            - type: Flex
              props: { direction: vertical, gap: 8, align: start }
              children:
                - type: Flex
                  props: { gap: 8, align: center }
                  children:
                    - type: Icon
                      props: { name: info, size: sm }
                    - type: Text
                      props: { text: 计费说明, strong: true }
                - type: Text
                  props:
                    text: 按 Token 用量计费；账单日每月 1 日结算。
                    type: secondary
                    size: small
                - type: Flex
                  props: { justify: end, className: w-full }
                  children:
                    - type: Button
                      props: { text: 查看定价 →, variant: link }
        - type: Card
          props: { className: w-full }
          children:
            - type: Result
              props:
                status: success
                title: 租户已开通
                subTitle: 租户编码 acme-corp 已生效。
              children:
                - type: Flex
                  props: { justify: center, gap: 8 }
                  children:
                    - type: Button
                      props: { text: 进入租户控制台, variant: primary }
                    - type: Button
                      props: { text: 继续邀请用户 }
        - type: Card
          props: { className: w-full }
          children:
            - type: Form
              children:
                - type: Field
                  props: { label: 租户编码, required: true, description: 创建后不可修改 }
                  children:
                    - type: Input
                      props: { name: code, placeholder: 如 acme-corp }
```

## 信息卡片摆放

| 位置 | 推荐形态 |
| --- | --- |
| 列表 / 看板顶 | I-A 条带 |
| 表单顶 / 段间 | I-A 或 I-B |
| 详情顶概览下 | I-B |
| 提交失败 | I-error 条带 + 字段级错误 |
| Modal 内 | I-A 窄条，无 Card |

**堆叠：** 同屏多条时按 **error > warning > info > success** 优先级自上而下排列。

---

## 布局 T-markdown — Markdown 文本卡

{{preview:03}}

文本 Card 用于说明文档、帮助、协议摘要、Release Note 等；PRD / 线框画「渲染后」结构，不贴原始 MD 源码块。

| 形态 | 标注 | 内容源 |
| --- | --- | --- |
| **T-plain** | 纯文本 | 字符串 / Typography 段落 |
| **T-markdown** | Markdown 渲染 | MD 源 → 组件树 |
| **T-html** | HTML 渲染 | 消毒后 HTML 子集 |

| MD 语法 | 渲染线框表达 | 规格要点 |
| --- | --- | --- |
| `#`–`####` | `## 标题` | Card 内默认 h3 起；全页文档页可用 h2 |
| 段落 / `**x**` | 普通文本行 / strong | 段间距一致 |
| `-` / `1.` | `·` 或 `1.` 列表 | 嵌套列表缩进 2 空格一级 |
| `` ` `` | `code` | 等宽字体 |
| ` ``` ` | `pre/code` 框 | 标明语言可选；横向滚动 |
| `>` | 引用块 | 可与 I-warning 视觉合并 |
| `[t](u)` / `![a](u)` | 链接 / 占位框 `图:a` | 外链新窗口 PRD 注明；alt 必填 |
| `\|…\|` 表 | ASCII 表格 | 列对齐：左 / 中 / 右 |

**长文：** 超过一屏时 Card body max-height + 内部滚动，或折叠「展开全文」。

```text
┌─ Card · T-markdown · title: 接入指南 ──────────────────────────────────┐
│ ## 准备工作                          ← h2（Card 内常用 h3–h4，h1 慎用） │
│ 请先创建客户端并记录 **Client ID**。   ← 段落 + strong                  │
│ ### 步骤                               ← h3                            │
│ 1. 控制台创建客户端                    ← ol                             │
│ 2. 下载凭证                                                            │
│ 3. 配置回调 URL                                                        │
│ > 注意：回调须为 HTTPS。               ← blockquote·语义色可选 I-warning │
│ 行内 `client_id` 与代码块：            ← inline code                    │
│ ┌─ pre/code ─────────────────────────────────────────────────────────┐ │
│ │ curl -X POST https://api.example.com/v1/token \                   │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ | 参数 | 必填 | 说明 |                  ← table（表头 + 对齐注明）      │
│ 详见 [开放平台文档](url)。             ← link                           │
└────────────────────────────────────────────────────────────────────────┘
```

#### DSL 配置

````yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Card
      props: { title: 接入指南, className: w-full }
      children:
        - type: Markdown
          props:
            content: |
              ## 准备工作

              请先创建客户端并记录 **Client ID**。

              ### 步骤

              1. 控制台创建客户端
              2. 下载凭证
              3. 配置回调 URL

              > 注意：回调须为 HTTPS。

              行内代码 `client_id` 与代码块：

              ```bash
              curl -X POST https://api.example.com/v1/token \
                -H "Authorization: Bearer <token>" \
                -d "client_id=<client_id>"
              ```

              | 参数 | 必填 | 说明 |
              | --- | --- | --- |
              | name | 是 | 显示名 |
              | client_id | 是 | 客户端 ID |
              | callback_url | 否 | 回调地址 |

              详见[开放平台文档](https://example.com/docs)。
````

## 布局 T-html / T-plain — HTML 与纯文本卡

{{preview:04}}

HTML 文本卡用于运营配置、邮件模板预览、旧系统迁移等；当前实现 `RichText` 经 **DOMPurify 白名单消毒**（`script` / `style` / `iframe` / `on*` 事件属性被剥离）。T-plain 则是一两句无排版的纯文本。

**推荐允许标签子集：** `p` `br` `h2` `h3` `h4` `strong` `em` `u` `a[href]` `ul` `ol` `li` `blockquote` `pre` `code` `table` `thead` `tbody` `tr` `th` `td` `img[src,alt]` `hr` `span[class]`（class 白名单可选）。

**禁止：** `script` `style` `iframe` `on*` 事件属性；须服务端或渲染前消毒。

| 选用 | 场景 |
| --- | --- |
| **T-markdown** | 研发/实施编写、Git 友好、默认文档卡 |
| **T-html** | 富文本编辑器输出、邮件/HTML 片段回显 |
| **T-plain** | 一两句话、无排版 |

**同屏不混排两种源：** 一张 Card 只一种内容类型（markdown / html / plain）。

```text
┌─ Card · T-html · title: 活动说明 ──────────────────────────────────────┐
│ <h3>限时优惠</h3>                         ← 映射为 h3 样式               │
│ <p>即日起至 …，<strong>年费 8 折</strong>。</p>                         │
│ <ul>                                                                     │
│   <li>仅限新购</li>                                                      │
│   <li>不可与代金券叠加</li>                                              │
│ </ul>                                                                    │
└────────────────────────────────────────────────────────────────────────┘
┌─ Card · T-plain · title: 备注 ─────────────────────────────────────────┐
│ 本订单仅用于内部测试，请勿绑定生产密钥。                               │
└────────────────────────────────────────────────────────────────────────┘
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Page
  children:
    - type: Flex
      props: { direction: vertical, gap: 16 }
      children:
        - type: Card
          props: { title: 活动说明, className: w-full }
          children:
            - type: RichText
              props:
                html: |
                  <h3>限时优惠</h3>
                  <p>即日起至年底，<strong>年费 8 折</strong>。</p>
                  <ul>
                    <li>仅限新购</li>
                    <li>不可与代金券叠加</li>
                  </ul>
        - type: Card
          props: { title: 备注, className: w-full }
          children:
            - type: Text
              props:
                text: 本订单仅用于内部测试，请勿绑定生产密钥。
```

## Card 壳层共用规则（I / T）

| 项 | 规则 |
| --- | --- |
| **title** | I-B / T* 可有 Card 标题；I-A 条带 **无** Card title |
| **extra** | 右上角 `[编辑]` `[复制]`（文档类） |
| **padding** | 正文区与 Form、键值 Card 对齐 |
| **宽度** | 默认内容区全宽；侧栏场景可 span 8/24（线框注明） |
| **加载** | Skeleton 段落行；**不**用 Lorem 冒充结构 |
| **空** | `暂无说明` + muted，或隐藏整张 Card（PRD 二选一） |

## 状态与异常

| 情况 | 表现 |
| --- | --- |
| MD 解析失败 | I-error 条带 + 降级 T-plain 显示原文（仅管理员） |
| HTML 含非法标签 | 静默剥离 + 可选 I-warning「部分内容已省略」 |
| 图片失败 | 占位框 + alt 文案 |

---

## 线框清单（提交 PRD 前自检）

1. 信息块标清 **info / success / warning / error** 与 **I-A / I-B / I-C / I-D**。
2. 文本卡标 **T-plain / T-markdown / T-html**；富文本画 **渲染结构**，不是大段源码。
3. 含 **链接、表格、代码块** 时各画一处代表结构即可。
4. 多条 I 条带写明 **顺序与是否可关闭**。
5. error 汇总与字段级错误 **分工**（条带总述 + 字段下文案）。
