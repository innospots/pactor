# Tasks: extend-header-component

## 1. Header 适配器扩展

- [x] 1.1 扩展 `packages/ui/src/components/components/Header/index.tsx`：新增 `logo` / `title` / `brandPosition` / `dropdown` / `menu` / `user` / `locales` props 与 `onMenuSelect` / `onDropdownSelect` / `onUserSelect` / `onLocaleChange` 事件 props（类型导出 `HeaderProps` 同步扩充）
- [x] 1.2 品牌区：logo 图片 + 标题文本（可二选一或并存，logo 在前），`brandPosition` 控制左右
- [x] 1.3 通用下拉：基于 `src/ui/` dropdown-menu 原语，label 触发器 + items，`position` 控制左右，选中透传 value 给 `onDropdownSelect`
- [x] 1.4 横向菜单：基于 Base UI 原语实现（类名对齐 horizontal Menu），嵌套 children 子菜单，选中透传 key 给 `onMenuSelect`
- [x] 1.5 用户区：avatar 原语（缺省首字符占位）+ 用户名 + 下拉菜单（items 为空时纯展示），选中透传 value 给 `onUserSelect`
- [x] 1.6 国际化切换：dropdown-menu 原语，触发器显示 `useI18n().locale` 对应 label，选中透传 locale 值给 `onLocaleChange`
- [x] 1.7 排布：左区（品牌?/下拉?/菜单?）— flex-1 中区（children）— 右区（下拉?/品牌?/locales/user）；保持 `data-slot="layout-header"` 与 className/style 挂载不变

## 2. 测试

- [x] 2.1 新建/扩充 Header 契约测试（`packages/ui/tests/components/`，可建 `header.test.tsx`）：覆盖 spec 全部场景——缺省纯容器回归、仅标题、logo+title 靠右、下拉左右位置与选中传值、菜单选中传 key、用户区选中传值与无菜单退化、locales 当前语言显示与切换传值、全区域组合排布、与 children 共存、通用 props 回归

## 3. 文档与收尾

- [x] 3.1 更新 `docs/src/content/docs/components/layout.md` 的 Header 小节：五个区域 props 表 + 事件表 + 全组合 YAML 示例 + 国际化闭环接线示例（setState 回写 locale）
- [x] 3.2 `pnpm -F @pactor-app/ui test`、`typecheck` 全绿；`pnpm -F pactor-docs build` 通过
