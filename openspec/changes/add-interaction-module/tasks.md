# Tasks: add-interaction-module

## 1. core / runtime 扩展（spec: overlay-actions）

- [x] 1.1 core：`ActionConfig` 增加可选 `id?: string` + 类型测试
- [x] 1.2 runtime：引擎记录命名动作结果（成功 data / 失败 `{ ok: false, error }`），buildScope 增加 `actions` 键；PageRuntime 页面级共享 actionResults、destroy 清理
- [x] 1.3 runtime 测试：命名结果引用、未命名行为不变；既有测试不回归

## 2. OverlayManager（spec: overlay-manager）

- [x] 2.1 包骨架：`packages/interaction`（dependencies `pactor-core`/`pactor-runtime` workspace:*，peerDeps `react >=18`/`antd >=5`，devDeps antd + react 测试栈 + `pactor-components`）、tsconfig、tsup、LICENSE、README
- [x] 2.2 OverlayManager：open（生成 id、入栈、通知、返回 Promise）/ close（id 或栈顶、payload resolve、取消语义 `{ success: false }`）/ stack / parentScopeOf / subscribe
- [x] 2.3 manager 纯 Node 单测（嵌套、payload、取消、栈顶、订阅退订、parent 快照）

## 3. 动作注册（spec: overlay-actions）

- [x] 3.1 UiBridge（可变引用，Provider 注入 modal/message 实例）
- [x] 3.2 registerInteractionActions：overlay.open / overlay.close / confirm / message（未注入 UI 时 confirm/message 受控失败）
- [x] 3.3 动作单测（含 overlay.open + if 读取 actions.<id> 的引擎级链路）

## 4. React 渲染层（spec: overlay-host）

- [x] 4.1 `<InteractionProvider>`（antd App 捕获实例注入 UiBridge）
- [x] 4.2 `<OverlayHost>`：订阅堆栈渲染 Modal/Drawer（title/width），UI 取消触发取消语义 close
- [x] 4.3 content 渲染：runtime Renderer + `{ params, parent }` 作用域（读 runtime 公开 API，必要时在 runtime 做最小补充导出并注明）
- [x] 4.4 page overlay：注入 resolvePage 加载渲染；未注入时受控错误提示；close 时清理
- [x] 4.5 组件测试（jsdom + antd + runtime + components 端到端：DSL 按钮 → overlay.open → 渲染 → close 携带 payload → if 分支）

## 5. 验收与文档

- [x] 5.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 5.2 文档站新增 `packages/interaction.md`，侧边栏与快速开始模块表同步，`pnpm docs:build` 通过
