# Design: add-admin-layout-modes

## 配置面（AdminLayoutConfig 扩展，bootstrap.layout 透传）

```ts
interface AdminLayoutConfig {
  // 现有区域开关（不变）
  header?: boolean; sidebar?: boolean; tabs?: boolean; breadcrumb?: boolean; footer?: boolean;
  // 新增
  mode?: 'top-side' | 'top-bottom' | 'side-full' | 'two-column';  // 缺省 top-side（现状）
  fixedHeader?: boolean;   // 固定顶部（内容区独立滚动）
  fixedSider?: boolean;    // 固定侧边栏（sidebar 自身滚动，不随内容区）
  collapsible?: boolean;   // sidebar 收起/展开 trigger
  collapsed?: boolean;     // 初始收起（仅 collapsible 时有意义）
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';  // 视口小于断点自动收起
}
```

模式语义（对齐 antd Layout 演示）：

- `top-side`：header 在顶，下方 sidebar + content（现状）；
- `top-bottom`：上-中-下——强制无 sidebar（header + content + footer），语义糖，等价于 `sidebar:false`；
- `side-full`：通栏侧边——sidebar 全高居左（含品牌区入 sidebar 顶部），header + content 居右；
- `two-column`：侧边两列——第一列窄列渲染一级菜单（group/page），选中 group 时第二列渲染其子菜单；当前激活链自动选中。

组合约束：`mode: 'top-bottom'` 时 sidebar 相关配置（collapsible/fixedSider/breakpoint/two-column 语义）不生效；`side-full` 下 header 固定在右侧内容列顶部。

## antd 实现（AdminLayout）

- 结构按 mode 切换 Layout 嵌套：`top-side`/`top-bottom` 保持现嵌套；`side-full` 为 `Layout(hasSider) > Sider(全高) + Layout > Header + Content`；`two-column` 在 `top-side` 基础上把 Sider 内容换成两列（一级菜单 Menu mode="inline" 窄列自绘 + 子菜单列）。
- 固定：antd 侧用 CSS——`fixedHeader` 时 Header `position: sticky; top: 0; z-index`（或 fixed + 内容 padding 补偿；选 sticky，避免补偿计算）；`fixedSider` 时 Sider `position: sticky; top: headerHeight; height: calc(100vh - …)` + `overflow: auto`。
- 收起：`Sider collapsible collapsed={collapsed} trigger={自定义}`，collapsed 状态为组件内 state（初始取 config.collapsed）。
- 响应式：antd `Sider breakpoint={config.breakpoint}` + `onBreakpoint(broken)` → broken 时强制 collapsed。

## Radix 实现（RadixAdminLayout + styles.css）

- 同构 class 结构：`.pcr-admin-layout[data-mode='…']` 切换 flex 方向/嵌套；两列式第一列渲染一级菜单按钮列，第二列复用 MenuTree 渲染当前 group 子树。
- 固定：同语义 sticky；收起：collapsed 时 sidebar 宽度收窄为图标宽（title 截断为首字符/隐藏文字），trigger 按钮置底。
- 响应式：`useMediaQuery`（自实现 10 行 hook，matchMedia 监听）小于断点 → 强制 collapsed。断点像素映射对齐 antd：xs 480 / sm 576 / md 768 / lg 992 / xl 1200 / xxl 1600。

## app 透传

`pickLayoutConfig` 的布尔字段提取扩为：布尔五开关照旧；`mode` 校验枚举字符串透传；`collapsible/collapsed/fixedHeader/fixedSider` 布尔透传；`breakpoint` 枚举透传。bootstrap.layout 为开放记录，无需改 pactor-core 类型。

## 测试

- antd：各 mode 的 DOM 结构断言、collapsible trigger 交互、fixed class、breakpoint onBreakpoint 回调强制收起（mock matchMedia 或直调）。
- radix：同语义断言（class/data-mode）、两列式选中联动、trigger 交互、useMediaQuery mock。
- app：pickLayoutConfig 透传新字段单测。
- 浏览器：example-admin bootstrap 开 `collapsible: true, breakpoint: 'lg'` 与 example-admin-antd 同步，截图验证收起/展开 + 窄屏响应式；分别切 mode 截图（side-full / two-column / top-bottom）。

## 非目标

- 不做布局运行时切换 UI（配置驱动即可）；不做菜单图标体系（两列式窄列用标题首字符）；不改 login/blank/landing 布局。
