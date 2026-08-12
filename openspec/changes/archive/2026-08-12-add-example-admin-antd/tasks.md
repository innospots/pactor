# Tasks: add-example-admin-antd

## 1. 工程骨架

- [x] 1.1 创建 `examples/admin-antd`：package.json（`example-admin-antd`，deps 含 antd ^6 / pactor-ui-antd）、vite.config.ts（5299 strictPort）、tsconfig.json、index.html、src/dsl-modules.d.ts

## 2. 源码

- [x] 2.1 拷贝并适配 `src/`：auth.ts / services.ts / bootstrap.ts / pages/*.page.yaml 原样复用；main.tsx 切换 `ui: antdUiKit` + `antd/dist/reset.css`（去除 radix styles 与 theme.css）
- [x] 2.2 编写 README.md（启动方式、与 example-admin 的差异点）

## 3. 验收

- [x] 3.1 `pnpm install` 后 `pnpm --filter example-admin-antd typecheck` 与 `build` 通过
- [x] 3.2 浏览器验证：未登录跳 /login、antd 渲染、登录成功进工作台、抽屉回填、删除禁用、退出登录回 /login
