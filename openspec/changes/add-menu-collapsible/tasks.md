## 1. 实现

- [x] 1.1 `packages/ui/src/components/components/Menu/index.tsx`:新增 `collapsible` / `defaultExpandedKeys` props;目录项点击 toggle(不触发 onSelect)、chevron 指示(展开旋转)、内部展开态(初始 = defaultExpandedKeys ∪ selectedKey 祖先链);缺省 false 行为不变;horizontal / icon rail 不受影响

## 2. 测试

- [x] 2.1 菜单测试文件(找到现有 Menu 用例所在文件)新增:目录项点击展开/收起且不触发 onSelect、选中项祖先链自动展开、defaultExpandedKeys、缺省 false 子菜单静态展开且目录项可 onSelect

## 3. 文档与验证

- [x] 3.1 `docs/src/content/docs/components/navigation.md` Menu 小节补 collapsible / defaultExpandedKeys(props 表 + YAML 示例)
- [x] 3.2 `pnpm --filter @pactor-app/ui test`、`pnpm --filter @pactor-app/ui build` 全绿;`openspec validate add-menu-collapsible --strict` 通过

## 4. icon rail 子菜单 flyout(交互修订)

- [x] 4.1 `Menu/index.tsx`:icon rail(collapsed)下含 children 的目录项改为右侧滑出浮层(参照 `layout/admin/AdminLayout.tsx` 的 `CollapsedGroupFlyout`:hover 延迟开/关、Popover side="right"、浮层内点选后关闭),浮层内子菜单完整形态渲染(label/icon/badge/dot/选中态);rail 内不再平铺子菜单图标;无 children 项维持 RailTooltip
- [x] 4.2 测试:hover 目录图标出现 flyout 且 rail 内无子菜单项、flyout 内点选叶子触发 onSelect 且浮层关闭
- [x] 4.3 `docs/src/content/docs/components/navigation.md` Menu 小节补 icon rail flyout 说明;复跑测试/构建与 `openspec validate add-menu-collapsible --strict`
