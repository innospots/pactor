# Tasks: add-antd-skin-settings

## 1. pactor-app 槽位

- [x] 1.1 options 增加 `providers` / `headerExtra`；handle 暴露；AppShell/ShellLayout 接线（providers 在 Router 内 InteractionKit 外；headerExtra 透传 admin 布局）
- [x] 1.2 app 测试：providers 包装、缺省不包装、headerExtra 渲染

## 2. example-admin-antd 皮肤设置

- [x] 2.1 `src/skin.ts` 皮肤 store（localStorage 持久化 + 订阅）
- [x] 2.2 `src/SkinProvider.tsx`（ThemeConfig 构造 + ConfigProvider + 暗黑页面底色）
- [x] 2.3 `src/SkinSettings.tsx`（头部按钮 + Drawer：主色预设/取色、暗黑开关、圆角、恢复默认）
- [x] 2.4 main.tsx 接入 providers / headerExtra

## 3. 验收与收尾

- [x] 3.1 浏览器走查：主色/暗黑/圆角即时生效、刷新保持
- [x] 3.2 文档站 packages/app options 表同步；MEMORY.md 更新
- [x] 3.3 根级 build / test / typecheck 全绿
