# Design: add-antd-skin-settings

## pactor-app 槽位

```ts
interface PactorApplicationOptions {
  // 新增
  /** 应用级包装（Router 之内、InteractionKit 之外）：业务 ConfigProvider / 全局 Context 入口 */
  providers?: ComponentType<{ children?: ReactNode }>;
  /** admin 布局头部右侧插槽 */
  headerExtra?: ReactNode;
}
```

- `providers` 挂接位置：`<Router><Providers><InteractionKit><ShellLayout/>`，保证 antd ConfigProvider 是 InteractionProvider（App）与 OverlayHost 的祖先（message/modal/drawer 都吃到主题）。handle 上暴露 `providers` / `headerExtra`，AppShell/ShellLayout 读取。
- `headerExtra` 仅在 admin 布局分支透传（其余布局无此概念）。

## example-admin-antd 皮肤设置

- `src/skin.ts`：皮肤 store——`{ colorPrimary: string; dark: boolean; borderRadius: number }`，localStorage 持久化（key `pactor-antd-skin`），`subscribe` / `getSkin` / `setSkin(partial)`（setSkin 通知订阅者）。
- `src/SkinProvider.tsx`（providers 槽位组件）：useSyncExternalStore 订阅 store → `ThemeConfig`（`token.colorPrimary/borderRadius`、`algorithm: dark ? theme.darkAlgorithm : defaultAlgorithm`、`cssVar: true`）→ `<ConfigProvider theme>`。暗黑模式同时切换 `document.documentElement` 背景色（antd 不管页面底色）。
- `src/SkinSettings.tsx`（headerExtra）：皮肤图标按钮 → antd Drawer：
  - 主色：6 个预设色块 + ColorPicker 自定义；
  - 暗黑模式：Switch；
  - 圆角：Slider（0–16）；
  - 恢复默认按钮。
  全部即时生效（ConfigProvider 在应用树内，无需刷新）。
- `main.tsx`：`providers: SkinProvider`、`headerExtra: <SkinSettings />`。

## 测试与验收

- app：providers 包装生效（内容被包一层记号元素）+ headerExtra 出现在头部；缺省不传时不渲染额外层。
- 浏览器（5299）：打开皮肤面板 → 换主色（按钮/菜单高亮色变化）、开暗黑（整体暗色）、调圆角（卡片圆角变化）、刷新后保持（localStorage）。
- 全量 build / test / typecheck。
