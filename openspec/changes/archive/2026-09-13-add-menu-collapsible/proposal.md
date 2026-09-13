## Why

`Menu` 组件的子菜单(`children`）目前无条件静态展开，菜单层级深时侧栏冗长、无法收起。业务后台的标准诉求是可折叠子菜单：目录项点击展开/收起，选中项所在链自动展开。

## What Changes

- `Menu` 新增 `collapsible?: boolean` prop（缺省 `false`，保持现状兼容）:`true` 时含 `children` 的目录项可折叠——点击目录项展开/收起（不触发 `onSelect`)，右端渲染 chevron 指示（展开时旋转）
- 折叠状态组件内部维护（非受控）：初始展开含 `selectedKey` 的祖先链，其余目录折叠；新增 `defaultExpandedKeys?: string[]` 指定额外初始展开的目录 key
- horizontal 模式与 icon rail（侧栏折叠降级）行为不变

## Capabilities

### New Capabilities
（无）

### Modified Capabilities
- `layout-components`: `Menu 导航菜单组件` 需求块新增可折叠子菜单语义（collapsible / defaultExpandedKeys / 目录项点击不触发 onSelect / 选中链自动展开）

## Impact

- `packages/ui`:`src/components/components/Menu/index.tsx`；测试 `tests/components/`（菜单相关用例文件）
- 文档：`docs/src/content/docs/components/navigation.md` 的 Menu 小节
- 无破坏性变更（`collapsible` 缺省 false，现有 DSL 行为不变）
