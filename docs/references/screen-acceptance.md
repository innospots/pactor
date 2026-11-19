# 整屏验收清单（模板 / starter / apps-shell）

面向「整屏预览」的验收口径：模板详情页的设备框、独立预览路由、starter 与 `apps-shell` 的整屏示例共用。先人工按清单走查，不引入 Playwright；若后续自动化，用一次性 CDP 脚本检查同样条目。

## 1. 尺寸与容器

- [ ] 根节点 `height: 100%` / `100dvh`、`width: 100%`，且是容器查询上下文（`container-type: inline-size` 或 Tailwind 的 `@container`）。
- [ ] 组件内部只用容器查询（`@md:`、`@4xl:` 等），不用视口断点（`md:`、`lg:`）判断布局。
- [ ] 三档设备（桌面 1280×800 / 平板 768×960 / 手机 390×780）下均无布局断裂。

## 2. 滚动

- [ ] 主内容区**只允许一个纵向滚动容器**；消息列表、侧栏、面板内部不出现嵌套滚动。
- [ ] 底部 composer / 操作条固定时，使用实测高度作为 `bottomInset`，不写死像素。
- [ ] 弹层、抽屉、Popover 留在屏幕框内，不 portal 到页面根。

## 3. 横向溢出

- [ ] 任意宽度下都没有 `scrollWidth > clientWidth` 的元素。
- [ ] chips / tags 允许换行；长文本截断或换行；payload（shell / diff / json）强制换行。
- [ ] 显式检查：不存在 `overflow-x: auto | scroll` 且实际溢出的元素。

## 4. 可见性

- [ ] 屏幕框外没有可见内容（绝对定位的装饰层不得溢出框外）。
- [ ] 覆盖层关闭后不残留焦点陷阱或 `inert`。
- [ ] 深色 / 浅色主题切换后，边框、背景、文字对比度仍然达标。

## 5. 无障碍与键盘

- [ ] 预览 iframe 有 `title`；装饰性缩略图外层带 `aria-hidden` + `inert`。
- [ ] 设备切换、变体切换是 `radiogroup` + 方向键 / Home / End 可操作。
- [ ] 纯键盘可完成页面主流程；焦点可见。
- [ ] 状态变化（审批、保存、错误）有 `aria-live` 播报。

## 6. 索引与元数据

- [ ] 独立预览路由带 `<meta name="robots" content="noindex, follow">`。
- [ ] canonical 指向对应详情页（模板为 `/templates/<slug>`，组件为 `/components/<category>/<slug>`）。
- [ ] 预览页不作为站点导航入口暴露。

## 7. 主题同步

- [ ] iframe 预览与宿主主题一致（localStorage + `storage` 事件）。
- [ ] 切换主题不需要重载 iframe。
- [ ] 预览页自身不写死 `data-theme`。
