## Context

`Menu`(`packages/ui/src/components/components/Menu/index.tsx`）是纯渲染导航组件，`children` 子菜单当前无条件静态展开（`MenuEntry` 递归渲染）。Sidebar 的 icon rail 折叠态经 `useSidebarDrawer` 注入，已存在；horizontal 模式用于 Header。

## Goals / Non-Goals

**Goals:**

- `collapsible: true` 时含 `children` 的目录项可展开/收起，chevron 指示
- 初始展开含 `selectedKey` 的祖先链 + `defaultExpandedKeys` 指定项，其余折叠
- 零破坏：缺省 `collapsible: false`，现有 DSL 渲染不变

**Non-Goals:**

- 展开状态的受控双向绑定（`expandedKeys` + `onToggle`)——DSL 场景无此需求，YAGNI
- horizontal 模式的子菜单折叠（现状 horizontal 递归平铺，不动）
- Sidebar 外壳自身 nav(SidebarNavItems）的折叠——那是另一套渲染，不在本变更

## Decisions

### D1: 非受控内部状态，初始展开按 selectedKey 祖先链推导

折叠状态用组件内 `useState<Set<string>>` 维护；初始值 = `defaultExpandedKeys` ∪ selectedKey 的全部祖先目录 key。理由：DSL 语义下「当前页所在目录应展开」是零配置的正确默认；受控 expandedKeys 会增加 DSL 状态编排负担而无对应诉求。`selectedKey` 后续变化时不重置用户手动的展开/收起（初始推导只在挂载时算一次）。

### D2: 目录项点击只 toggle，不触发 onSelect

`collapsible` 下含 children 的项是「目录」而非「页面」，点击语义为展开/收起；叶子项行为不变。这避免目录项被误当路由目标。chevron 用 Icon 白名单的 `chevron-down`，展开时旋转 180°(transition-transform)。

### D3: 缺省 false 保兼容

`collapsible` 缺省 `false`：既有 DSL（子菜单静态展开）渲染结果与行为完全不变。

## Risks / Trade-offs

- [初始展开在挂载时算一次，selectedKey 异步晚到（如 data 加载后）则所在链不自动展开] → 文档注明；需要时业务可用 defaultExpandedKeys 兜底
