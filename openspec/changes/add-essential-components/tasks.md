# Tasks: add-essential-components

## 1. 数据录入（8）

- [x] 1.1 Rate / TimePicker / ColorPicker / Upload（各自目录 index.tsx + Form 集成）
- [x] 1.2 TreeSelect / Cascader / Transfer / Mentions
- [x] 1.3 tests/components/essential-input.test.tsx（渲染、事件值、Form 收集、通用 props）

## 2. 数据展示（7）

- [x] 2.1 List / Tree / Descriptions / Timeline
- [x] 2.2 Image / QRCode / Segmented（QRCode 用 qrcode 依赖输出 SVG）
- [x] 2.3 tests/components/essential-display.test.tsx

## 3. 反馈（7）

- [x] 3.1 vendored toast 原语扩展 warning 变体；Message / Notification 声明式触发器
- [x] 3.2 Popconfirm / Result / LoadingOverlay / Watermark / Tour
- [x] 3.3 tests/components/essential-feedback.test.tsx

## 4. 集成

- [x] 4.1 register.ts 注册 22 个类型（第五批注释）；components/index.ts 导出组件与 Props 类型
- [x] 4.2 register.test.ts EXTENDED_TYPES 补充第五批清单
- [x] 4.3 docs 组件分类页：form.md +8、display.mdx +7、feedback.md +7（沿用既有 ### 小节风格）

## 5. 验收

- [x] 5.1 `pnpm --filter @pactor-app/ui test` 全绿（513 通过，含 78 个新用例）
- [x] 5.2 `pnpm --filter @pactor-app/ui typecheck` 0 错误
- [x] 5.3 `pnpm --filter @pactor-app/ui build` 成功（含 styles.css，新工具类已编译进入）
