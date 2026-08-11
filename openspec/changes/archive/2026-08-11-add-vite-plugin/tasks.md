# Tasks: add-vite-plugin

## 1. 包骨架

- [x] 1.1 创建 `packages/vite-plugin`：dependencies `pactor-core`/`pactor-schema`/`yaml`，peerDeps `vite >=5`，devDeps vite；tsconfig、tsup、LICENSE、README；`pnpm install`

## 2. 转换管线（spec: vite-plugin-dsl）

- [x] 2.1 默认匹配 `.page.yaml/.yml` 与 `.fragment.yaml/.yml`，`enforce: 'pre'`
- [x] 2.2 transform：YAML 解析（含语法错误位置）→ page 走 validatePageDsl / fragment 宽松检查（dsl+body）→ 输出 `export default` + `dslVersion` 模块
- [x] 2.3 错误聚合：校验失败信息含文件标识与 path/message (keyword)
- [x] 2.4 选项 include / validate
- [x] 2.5 handleHotUpdate：模块热更新或 full-reload

## 3. 测试

- [x] 3.1 单测覆盖 spec 各 scenario（直接调用插件钩子，mock plugin context/server）
- [x] 3.2 vite build 集成测试（临时 fixture 入口 import page.yaml）

## 4. 验收与文档

- [x] 4.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 4.2 文档站新增 `packages/vite-plugin.md`（用法、`declare module '*.page.yaml'` TS 声明片段、与 StaticDslLoader 组合 recipe、主推荐模式仍是 Runtime API 的说明）；侧边栏与快速开始模块表同步
- [x] 4.3 `pnpm docs:build` 通过；重启 docs dev server 验证新页面
