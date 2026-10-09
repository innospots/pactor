---
title: 登录页布局选型
slug: login-layouts
order: 11
summary: 认证外壳布局骨架：分栏 / 居中 / 品牌双卡 / 叠压 / 沉浸背景，由 Login 业务组件的 layout variant 承载
sourceRef: innos-diagram/references/11-登录页布局选型.md
---

# 登录页布局选型

**组件类型：** 认证页容器（非管理端 Shell）  
**职责：** 为登录 / 注册 / 找回密码 / MFA 等提供布局骨架。

管理端页面套控制台外壳；未登录入口套本页所指布局。所有骨架由 `Login` 业务组件（DSL `type: Login`）的 `layout` variant 承载：结构模式（split / centered / brand-card / overlap / backdrop）与修饰配置（方向、比例、认证区容器、面板背景、装饰）正交组合，文案缺省走 i18n、同名 props 优先，登录请求与跳转由 DSL 编排。

## 布局族速查

| 族 | 编号 | 结构关键词 | 组件实现 |
| --- | --- | --- | --- |
| 分栏裸表单 | 01、04 | 左品牌 + 右 Form，无 Card | `layout: split` + `authVariant: plain` |
| 分栏卡片 | 02、03 | 右（或左）独立认证 Card | `layout: split` + `authVariant: card / float` |
| 居中认证 | 05、07 | 全屏底 + 居中 Card 或裸 Form | `layout: centered` |
| 品牌双卡 | 06、08 | 品牌 Card 与认证区组合 | `layout: brand-card` |
| 叠压 | 09 | 品牌卡与登录卡局部叠加 | `layout: overlap` |
| 反向分栏 | 10、12 | 认证与品牌左右对调 | `layout: split` + `brandSide: right` |
| 沉浸背景 | 11 | 渐变底 + 悬浮认证 Card | `layout: backdrop` |

编号 01–12 对应《登录页产品结构设计》的 12 套线框；组件侧由 5 个 `layout` variant + `brandSide` / `brandRatio` / `authVariant` / `brandPanelBackground` 组合覆盖（扫码登录的扫码区内容不在组件范围内，其反向分栏结构由 `brandSide: right` 承载）。

## 布局 split — 分栏（左品牌右认证）

{{preview:01}}

默认形态：左侧品牌面板（渐变底 + 背景装饰 + 插画），右侧认证列（认证卡 + 页脚）。`brandRatio` 控制品牌区占比，`authVariant` 控制认证区容器（`plain` 裸表单 / `card` 常规卡片 / `float` 大悬浮卡），`brandSide: right` 即反向分栏。

```text
┌───────────────────────────────┬───────────────────────────┐
│ [logo] Pactor                 │                           │
│                               │       欢迎回来            │
│ 动态页面引擎                  │  ┌─────────────────────┐  │
│ 用 YAML 描述页面…             │  │ 账号 / 密码          │  │
│ [品牌插画]                    │  │ [登录]               │  │
│                               │  │ 注册     忘记密码？  │  │
│                               │  └─────────────────────┘  │
│                               │      © 2026 Pactor        │
└───────────────────────────────┴───────────────────────────┘
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Login
  props:
    layout: split
    # 分栏族变体（与 layout: split 正交组合）：
    # brandSide: right             # 反向分栏（文档 10/12）：认证在左、品牌面板右置
    # brandRatio: 0.6              # 品牌区占比 0-1，默认 0.5；0.6 即品牌大区（文档 04）
    # authVariant: plain           # 裸表单（文档 01/04）；card 默认；float 大悬浮卡（文档 03）
    # brandPanelBackground: false  # 关闭品牌面板渐变底色
    # decor: false                 # 关闭背景装饰（圆斑/圆环/点阵/流线）
    brand:
      name: Pactor
      title: 动态页面引擎
      description: 用 YAML 描述页面，运行时渲染为生产级界面
    title: 欢迎回来
    subtitle: 登录以继续使用控制台
    forgotLink: { text: '忘记密码？', href: '/forgot' }
    registerLink: { text: 注册账号, href: '/register' }
    footer: '© 2026 Pactor'
```

## 布局 centered — 居中认证

{{preview:02}}

全屏渐变底 + 背景装饰，认证卡居中。`centered` 下 `brand` 仅展示 logo + name 紧凑标识（配置了才渲染），不渲染品牌标题 / 说明 / 插画；`authVariant` 仍可在 `plain` / `card` / `float` 间切换认证区容器。

```text
┌─────────────────────────────────────────────────────────┐
│                   [logo] Pactor                         │
│              ┌─────────────────────┐                    │
│              │ 登录                │                    │
│              │ 账号 / 密码          │                    │
│              │ [登录]              │                    │
│              └─────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Login
  props:
    layout: centered
    brand: { name: Pactor }  # centered 下仅展示 logo + name
    title: 登录
    subtitle: 使用账号密码继续
    # authVariant: plain  # 居中裸表单（文档 07 极简形态）
```

## 布局 brand-card — 品牌双卡

{{preview:03}}

品牌区收敛为一张独立卡片（约 45% 宽），认证区为右侧裸表单，品牌与认证等量呈现，适合品牌与登录并重的门户。

```text
┌──────────────────────────────────────────────────────────┐
│ ┌─────────────────────┐                                  │
│ │ [logo] Pactor       │       欢迎回来                   │
│ │ 动态页面引擎        │       账号 / 密码（裸表单）      │
│ │ [品牌插画]          │       [登录]                     │
│ └─────────────────────┘                                  │
└──────────────────────────────────────────────────────────┘
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Login
  props:
    layout: brand-card
    brand:
      name: Pactor
      title: 动态页面引擎
      description: 用 YAML 描述页面，运行时渲染为生产级界面
    title: 欢迎回来
```

## 布局 overlap — 叠压

{{preview:04}}

品牌卡（约 52% 宽）与登录卡同排，登录卡左移与品牌卡局部叠加并投影浮起，层次更强；窄屏自动取消重叠退化为上下排列。

```text
┌──────────────────────────────────────────────────────────┐
│  ┌────────────────────────┐                              │
│  │ [logo] Pactor          │ ┌──────────────────┐         │
│  │ 动态页面引擎  [插画]   │ │ 欢迎回来         │         │
│  │                        │ │ 账号/密码 [登录] │         │
│  └────────────────────────┘ └──────────────────┘         │
│        （登录卡左移，与品牌卡局部叠加）                   │
└──────────────────────────────────────────────────────────┘
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Login
  props:
    layout: overlap
    brand:
      name: Pactor
      title: 动态页面引擎
      description: 用 YAML 描述页面，运行时渲染为生产级界面
    title: 欢迎回来
```

## 布局 backdrop — 沉浸背景

{{preview:05}}

整页品牌渐变 + 背景装饰，无分栏边界：左侧直接展示品牌标识与插画，右侧悬浮认证卡。品牌表达最强，适合强品牌门户。

```text
┌──────────────────── 整页品牌渐变背景 ────────────────────┐
│ [logo] Pactor                             ┌───────────┐  │
│ 动态页面引擎                               │ 登录      │  │
│ [品牌插画]                                 │ 账号/密码 │  │
│                                           │ [登录]    │  │
│                                           └───────────┘  │
└──────────────────────────────────────────────────────────┘
```

#### DSL 配置

```yaml
# 与上方预览同源的可运行 DSL（示例数据内联，人工提炼入库）
body:
  type: Login
  props:
    layout: backdrop
    brand: { name: Pactor }  # 可加 title / description 充实左侧品牌区
    title: 登录
```

## 结构说明

```text
LoginPage
├─ 页面背景 / 视觉基底
├─ 品牌展示区（可选）
├─ 认证区（Form：账号、密码、主按钮、辅助链接）
└─ 页脚（语言、协议，可选）
```

## 选型建议

| 场景 | 推荐布局 |
| --- | --- |
| 企业 B2B、品牌与登录并重 | `split`（`brandRatio` 加大品牌区）、`overlap` |
| 控制台、SSO、步骤多 | `centered`、`overlap` |
| 极简、开发者/AI 产品 | `centered` + `authVariant: plain` |
| 反向分栏（认证在左、品牌右置） | `split` + `brandSide: right` |
| 强品牌门户 | `backdrop`、`brand-card` |
