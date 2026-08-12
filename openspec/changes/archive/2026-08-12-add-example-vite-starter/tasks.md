# Tasks: add-example-vite-starter

## 1. 工程骨架

- [x] 1.1 创建 `examples/vite-starter`：package.json（deps：pactor-app / pactor-resource / react / react-dom；devDeps 含 pactor-vite-plugin）、vite.config.ts（5499 strictPort + pactor()）、tsconfig.json、index.html

## 2. 源码

- [x] 2.1 `src/pages/home.page.yaml`：待办清单页（Alert 说明 + Form 查询 + Table + service 数据源）
- [x] 2.2 `src/services.ts` / `src/main.tsx` / `src/dsl-modules.d.ts`：mock service + 最简挂载
- [x] 2.3 编写 README.md（插件工作流：导入、校验、HMR、模块声明）

## 3. 验收

- [x] 3.1 `pnpm --filter example-vite-starter typecheck` 与 `build` 通过
- [x] 3.2 浏览器验证：页面渲染、关键词过滤；改 yaml 热更新；非法字段构建报错（验证后改回）
- [x] 3.3 根 README 补登 example-vite-starter；同步 MEMORY.md
