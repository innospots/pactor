---
title: 自定义组件
description: 开发并注册业务组件——Renderer 契约、容器组件、注册路径与完整示例
---

内置组件不够用或要接入公司组件库时，把 React 组件注册进 ComponentRegistry，DSL 的 `type` 即可引用。自定义组件与内置组件走完全相同的渲染管线：表达式求值、事件绑定、权限处理、`when` 显隐一视同仁。

## Renderer 契约（六条）

渲染器对组件的约定（实现见 `@pactor-app/runtime` 的 renderer）：

1. **props 已求值**：DSL props 中的 `${...}` 表达式在到达组件前已深度求值完毕——组件**不要**再调 `resolveTemplate`，把 props 当普通 React props 用。
2. **events 变成函数 props**：DSL 的 `events: { onClick: ... }` 会被绑定为 `props.onClick = (event) => 执行动作`。组件在合适的时机调用它并传出事件载荷（Button 无参、Input 传 string、Form 传 values），动作引擎会把载荷放进 `event` 作用域键。
3. **children 已渲染**：普通组件的 `props.children` 是渲染好的 ReactNode，直接 `{children}` 输出即可。
4. **`when` / `permission` 由渲染器处理**：`when: false` 时组件根本不会被创建；权限 denied 策略为 `disabled` / `readonly` 时，对应 prop 会被**注入**（覆盖 DSL 同名字段）——组件应承接这两个 prop（如传给底层控件）。
5. **内嵌 DSL 子树不求值**：props 里带字符串 `type` 字段的对象（如 Table 的 `columns[].cell`）被视为内嵌 DSL 节点，原样保留不提前求值，留给组件用 `renderChildren` 以局部作用域渲染（见容器组件）。
6. **未注册的 type** 渲染为 `UnsupportedComponent` 占位，不抛错——DSL 写错组件名时页面其他部分不受影响。

## 最小示例：一个 Tag 组件

```tsx
// components/BizTag.tsx
export interface BizTagProps {
  text?: string;
  color?: 'blue' | 'green' | 'red';
}

export function BizTag({ text, color = 'blue' }: BizTagProps) {
  return <span className={`biz-tag biz-tag--${color}`}>{text}</span>;
}
```

```tsx
// main.tsx：经 options.components 注册（叠加在内置注册表之上）
import { BizTag } from './components/BizTag';

createPactorApplication({
  appId: 'my-app',
  loader,
  components: { BizTag },   // DSL type: BizTag 即可使用
}).mount('#root');
```

```yaml
- type: BizTag
  props:
    text: ${data.order.statusText}   # 表达式照常可用
    color: green
```

`options.components` 的值也可以是 `{ component, withScope: true }` 条目（见下节）。

## 容器组件：renderChildren 与 withScope

需要自己控制子树渲染时机（行模板、页签 pane、虚拟列表等）时，以 `{ component, withScope: true }` 注册：组件收到**原始 DSL 子树** `dslChildren` prop（不预渲染），经 `useRenderer().renderChildren(children, extraScope)` 在注入局部作用域后渲染：

```tsx
import { useRenderer } from '@pactor-app/runtime';
import type { DslNode } from '@pactor-app/core';

interface RowCardProps {
  dslChildren?: DslNode[];
  rows?: Array<Record<string, unknown>>;
}

export function RowCardList({ dslChildren, rows = [] }: RowCardProps) {
  const { renderChildren } = useRenderer();
  return (
    <div className="row-card-list">
      {rows.map((row, index) => (
        <div key={index} className="row-card">
          {/* 每个卡片以 row / rowIndex 局部作用域渲染同一棵 DSL 子树 */}
          {renderChildren(dslChildren, { row, rowIndex: index })}
        </div>
      ))}
    </div>
  );
}
```

```tsx
components: {
  RowCardList: { component: RowCardList, withScope: true },
}
```

```yaml
- type: RowCardList
  props:
    rows: ${data.orders}
  children:              # 作为 dslChildren 传入，由组件按行渲染
    - type: BizTag
      props: { text: ${row.statusText} }
```

内置 Table 的 `cell` 行模板、Tabs 的 pane 都是这个机制。

## 注册路径对比

| 路径 | 适用 |
| --- | --- |
| `createPactorApplication({ components })` | 最常用：应用级业务组件，叠加在内置注册表之上，可覆盖同名内置组件 |
| `componentRegistry` 工厂 / `ui` 预设 | 整体替换组件集（自研 UI kit） |
| `registerMarkdownComponents(registry)` 模式 | 包级扩展组件（参考 @pactor-app/markdown 的注册函数约定） |
| chat 的 Safe Registry | AI 下发 DSL 场景：`createSafeRegistry(source, ['BizTag'])` 白名单放行后才可被 LLM DSL 使用 |

不用 @pactor-app/app 的组合方式下，直接 `registry.register('BizTag', BizTag)` 即可（Registry 来自 @pactor-app/core）。

## 注意事项

自定义组件与槽位内容需要 UI 元素时，推荐用 `@pactor-app/ui/ui` 子路径导出的原语组件（Button / Input / Popover / Dialog 等）——视觉自动跟随语义令牌皮肤，无需自写样式。

- **props 命名避开 `on*`**：props 里 key 以 `on` 开头且值为字符串时渲染器原样保留不求值（事件统一走 `events` 字段）。
- **组件要"受控友好"**：state/data 变化会触发整棵子树重渲染，组件应纯由 props 驱动，避免内部状态与 DSL 状态双写。
- **权限注入优先**：denied 策略注入的 `disabled` / `readOnly` 会覆盖 DSL 同名字段，组件应尊重这两个 prop。
- **TypeScript**：组件 props 接口即 DSL props 契约，建议导出供业务侧复用（内置组件均如此，如 `ButtonProps`）。
