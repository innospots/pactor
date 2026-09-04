# Tasks: add-layout-components

## 1. 布局组件实现（@pactor-app/ui）

- [x] 1.1 新建 `packages/ui/src/components/components/Layout/index.tsx`：flex 容器；遍历直接子 DSL 节点含 `type: 'Sider'` 时 horizontal 否则 vertical，`direction` prop 显式覆盖；支持通用 props（className/style）
- [x] 1.2 新建 `Header/index.tsx`：顶部区域容器（横向 flex、垂直居中、下边框，shadcn 语义令牌），通用 props
- [x] 1.3 新建 `Sider/index.tsx`：`width`（默认 200）、`collapsible`（折叠触发器）、受控 `collapsed` + `collapsedWidth`（默认 64）、事件 `onCollapse`（传出 boolean）；通用 props
- [x] 1.4 新建 `Content/index.tsx`：主内容区容器（`flex: 1`），通用 props
- [x] 1.4.1 新建 `Footer/index.tsx`：底部区域容器（默认居中、弱化文本样式），通用 props
- [x] 1.5 新建 `Menu/index.tsx`：`items`（`{ key, label, icon?, children? }[]`，可含表达式）、`mode: inline | horizontal`、受控 `selectedKey`、事件 `onSelect`（传出 key）；通用 props
- [x] 1.6 注册进 shadcn 组件表（`packages/ui/src/components/register.ts`）并导出 props 契约类型

## 2. 测试

- [x] 2.1 Layout 方向推导：含/不含 Sider 子节点、direction 显式覆盖（对应 spec: Layout 容器）
- [x] 2.2 Sider 受控折叠闭环（collapsed 绑 state + onCollapse 回写）、自定义 width（对应 spec: Sider 侧边区域）
- [x] 2.3 Content 占据剩余空间（flex-grow 生效）（对应 spec: Header / Content 语义容器）
- [x] 2.4 通用 props 契约：common-props.test.tsx 补 6 个组件用例（含 Menu / Footer）；Fragment 引用 Sider 子树用例（对应 spec: 布局组件与普通组件同权）
- [x] 2.5 Menu：inline/horizontal 渲染、受控 selectedKey 高亮、onSelect 传出 key 并驱动 navigate（对应 spec: Menu 导航菜单组件）
- [x] 2.6 注册表契约：18 个类型名全部可解析（对应 builtin-components delta）

## 3. 文档与示例

- [x] 3.1 `docs/src/content/docs/reference/dsl.md` 组件目录新增 Layout / Header / Sider / Content / Footer / Menu 六节（props 表 + 自由组合示例）
- [x] 3.2 `docs/src/content/docs/guides/getting-started.md` 或布局相关指引补「外壳布局 vs 布局组件」选用规则（对应 basic-layouts delta）
- [x] 3.3 examples/admin 新增一个 blank 外壳 + DSL 自由布局的示例页（如双栏工具页），验证端到端可用

## 4. 验证

- [x] 4.1 `pnpm build && pnpm typecheck && pnpm test` 全绿
- [x] 4.2 `pnpm docs:build` 通过；`pnpm --filter example-admin build` 通过
