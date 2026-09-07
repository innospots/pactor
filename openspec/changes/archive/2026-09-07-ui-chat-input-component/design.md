# Design: ui-chat-input-component

## Context

`@pactor-app/ui` 的 registry 组件遵循统一适配模式（`shadcn-extended-components` / 统一适配约定）：`components/<Name>/index.tsx` 导出适配器（DSL props 契约 + vendored shadcn 原语映射 + 通用 className/style），`register.ts` 注册。槽位型 props（DslNode）经 `useRenderer().renderChildren` 渲染（AlertDialog trigger、Accordion item children 同款）。事件回调传 DSL 语义值（Textarea onChange 传 string）。

目标形态（截图，仅取结构）：圆角容器内垂直三层——多行输入区；工具栏行（左端附件类按钮、右端模型选择/麦克风/发送钮）；底部配置行（「选择工作空间⌄ 默认权限⌄」，带上分隔线）。工具栏与底部行的内容由业务自定义，组件只承担结构、发送交互与槽位。

## Goals / Non-Goals

**Goals:**

- `ChatInput` registry 组件：嵌套两层结构（容器 > 输入区 + 工具栏行 + 底部区），toolbar / footer 槽位 DSL 自定义
- 受控 `value` + `onChange` 闭环；`onSubmit` 发送语义（Enter / IME 守卫 / 空文本禁发 / 发送后清空）
- 零私有配色：结构样式经 Tailwind 工具类 + shadcn 语义令牌（border / ring / muted-foreground 等）

**Non-Goals:**

- 不实现截图中的具体业务按钮（附件、模型选择、麦克风、工作空间/权限选择）——它们是槽位内容示例
- 不做语音输入、附件上传、提及弹层等行为（`@pactor-app/chat` Composer 的领域能力，不在通用组件复刻）
- 不改动 `@pactor-app/chat`（Composer 保持包内自持；后续 chat 包可自愿改用本组件，另行评估）

## Decisions

### D1：结构与槽位

```
<div ChatInput 容器（rounded-xl border bg-background focus-within:ring）>
  <textarea（自适应高度，无边框无 ring，px-4 pt-3）/>
  <div toolbar 行（flex items-center gap-1 px-2 pb-2）>
    {toolbarStart 槽} <spacer/> {toolbarEnd 槽} {发送钮（hideSend 时省略）}
  </div>
  {footer 提供时：<div footer（border-t px-3 py-2）>{footer 槽}</div>}
</div>
```

槽位 props `toolbarStart` / `toolbarEnd` / `footer` 为 DslNode，经 `useRenderer().renderChildren` 渲染（AlertDialog trigger 同款）。「嵌套两层」即外容器 + 内容区（输入与工具栏）与底部区的层叠，footer 在结构上与工具栏分隔（border-t）。

### D2：受控值与发送语义

- `value !== undefined` 受控：显示值取自 props，变更只发 `onChange(value)`（DSL 侧 setState 闭环）；非受控：内部 state，发送后自动清空
- `onSubmit(value)` 触发：点击发送钮、Enter（Shift+Enter 换行；IME 合成中 Enter 不发送——`compositionstart/end` 守卫，与 chat Composer 同语义）；`value` 为空白（trim 后空）时不触发且发送钮禁用
- 发送后清空仅作用于非受控；受控场景由 DSL 侧在 onSubmit 里 setState 清空（文档给出示例）

### D3：发送钮

内建圆形 icon 钮（lucide `ArrowUp`，`rounded-full bg-primary text-primary-foreground`，空文本/disabled 置灰禁用）；`hideSend: true` 时整体省略（完全自定义右槽的场景）。

### D4：样式路径

结构类名直接写在适配器 JSX（Tailwind 工具类，随 `@pactor-app/ui` 预编译 styles.css 产出——与 vendored 组件同款；新增工具类需确认被预编译扫描覆盖，packages/ui 的 tailwind 输入为 src/styles.css 扫描 src）。颜色只引用语义令牌类（`border-border` / `bg-background` / `bg-primary` / `text-muted-foreground` / `ring-ring`），不引入任何字面色值。

### D5：测试与文档

- 测试（`packages/ui/tests/components/chat-input.test.tsx`，jsdom + 页面运行时渲染）：注册可用；placeholder / 受控 value；onChange 传 string；Enter / Shift+Enter / IME 守卫 / 空文本禁发；非受控发送后清空；toolbarStart / toolbarEnd / footer 槽渲染；hideSend
- 文档：`docs/src/content/docs/components/form.md` 新增 ChatInput 小节（props 表 + 最小 YAML 示例：受控闭环 + 槽位声明）；组件总数计数（69+1 registry 组件）在 `components/index.md` 与 docs 相关计数处同步

## Risks / Trade-offs

- [新增 Tailwind 工具类未进预编译 styles.css 导致结构样式缺失] → 实现后用 `pnpm --filter @pactor-app/ui build:styles` 验证类名出现在产物中；优先复用 vendored 组件已使用的工具类
- [与 chat 包 Composer 概念重叠导致用户误选] → 文档注明定位：ChatInput 是通用结构构件（无 transport/附件/提及）；对话场景首选 `@pactor-app/chat`
- [自适应高度实现（rows 计算 / scrollHeight）在 jsdom 不可测] → 高度逻辑保持极简（`field-sizing-content` 或 rows 下限），行为测试只覆盖受控与事件

## Migration Plan

纯新增组件，无迁移；根级 build/test/typecheck 全绿即完成。

## Open Questions

- 自适应高度用 CSS `field-sizing: content`（新特性，浏览器覆盖）还是 JS scrollHeight——倾向 JS（兼容性），实现期定稿
