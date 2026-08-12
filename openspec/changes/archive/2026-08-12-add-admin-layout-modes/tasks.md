# Tasks: add-admin-layout-modes

## 1. antd 实现

- [x] 1.1 `AdminLayoutConfig` 扩展（mode/fixedHeader/fixedSider/collapsible/collapsed/breakpoint）+ AdminLayout 四种 mode 结构、sticky 固定、Sider collapsible/breakpoint
- [x] 1.2 antd 侧测试：mode DOM 结构、trigger 交互、固定样式、断点回调

## 2. Radix 实现

- [x] 2.1 RadixAdminLayout 同等实现（data-mode 结构、两列一级菜单列、trigger）+ useMediaQuery hook
- [x] 2.2 styles.css：各 mode / collapsed / fixed 的 `.pcr-admin-*` 规则
- [x] 2.3 Radix 侧测试

## 3. 集成与示例

- [x] 3.1 app `pickLayoutConfig` 透传新字段 + 单测
- [x] 3.2 example-admin / example-admin-antd bootstrap 演示 collapsible + breakpoint

## 4. 验收与收尾

- [x] 4.1 浏览器验收：收起/展开、窄屏响应式、side-full / two-column / top-bottom 截图评审（双 kit）
- [x] 4.2 文档站 packages/app、packages/ui-antd、packages/ui-radix 同步布局配置表
- [x] 4.3 根级 build / test / typecheck 全绿；MEMORY.md 更新
