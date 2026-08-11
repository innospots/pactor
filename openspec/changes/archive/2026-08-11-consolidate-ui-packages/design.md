# Design: consolidate-ui-packages

## Context

8 个 UI 包整合为 2 个 `ui-*` 单元。约束：公开符号全部保留（仅导入路径变化）；测试全量保留；行为零变化。框架未发布，允许删除旧包。

约束：

- `export *` 合并时需排查符号冲突（如 components 与 layout 是否重名导出）；冲突时用显式导出消歧并注明。
- ui-radix 对契约类型的引用保持 type-only（不引入 antd 运行时依赖）。
- pactor-app 的默认 UI kit 仍为 antd（只是导入来源变为 pactor-ui-antd）。

## Goals / Non-Goals

**Goals:**

- pactor-ui-antd / pactor-ui-radix 各含 components/interaction/layout 三层，主子路径入口 + 预设对象 + 样式表（radix 侧）。
- 删除 6 个旧包，依赖方全部改接。
- 全部测试通过、文档同步。

**Non-Goals:**

- 不改任何组件/交互/布局的实现逻辑与公开 API 形状。
- 不动 pactor-core/schema/expression/runtime/permission/resource/router/markdown/chat。
- chat 的 antd 依赖不处理（此前已声明为边界）。

## Decisions

### D1: 目标结构（两个包同构）

```
packages/ui-antd/
  src/
    components/    # 原 packages/components/src（去掉其 src 层）
    interaction/   # 原 packages/interaction/src
    layout/        # 原 packages/layout/src
    index.ts       # export * 三层 + antdUiKit
  tests/           # 原三包 tests 迁入（按 components/interaction/layout 分子目录）
  package.json     # exports: "." "./components" "./interaction" "./layout"
```

- tsup 多入口：`src/index.ts` + 三个 `src/<layer>/index.ts`。
- exports 四个入口均含 types/import/require 条件。
- ui-radix 同构，外加 `styles.css`（合并原三包样式表内容为一个文件，比 @import 更稳——直接拼接源样式，删除三包样式文件）。

### D2: 符号冲突处理

合并前 grep 三层的 export 名清单；若 `export *` 冲突（如重名类型），主入口改用显式导出并优先保留各层原有名称；子路径入口不受影响。冲突清单写入汇报。

### D3: 契约类型与跨包引用

- ui-radix 的 components 层 `import type { ButtonProps, ... } from 'pactor-ui-antd'`（type-only）；package.json dependencies 加 `pactor-ui-antd: workspace:*`——因仅 type 引用，可在 README 注明不产生运行时依赖（或改用 devDependencies + 构建期 d.ts 引用——取实现干净者，若 d.ts 引用路径暴露问题则保留 dependencies 并注明）。
- ui-radix 的 interaction 层复用 OverlayManager 等：原来依赖 pactor-interaction（运行时值）→ 改为依赖 `pactor-ui-antd`（OverlayManager 从 interaction 层导出）。所以 ui-radix 对 ui-antd 是**真实运行时依赖**（OverlayManager/registerInteractionActions/createUiBridge 都来自 ui-antd 的 interaction 层）。这是合理的：Radix 交互层是 antd 交互层核心的不同渲染实现。文档注明：使用 ui-radix 会传递依赖 ui-antd（不含 antd 渲染代码被实际引入……注意：ui-antd 的 interaction 层 provider/host 引 antd——ui-radix 只 import interaction 层的 manager/actions，tree-shaking 可去除 host/provider，但 package 依赖链上 antd 仍是 peer。评估：把 OverlayManager/UiBridge/actions 这些 UI 无关核心保留在 ui-antd 是否会让 radix 用户被迫装 antd？peerDependencies 不自动安装，pnpm 会警告未满足 peer。缓解：ui-antd 的 peerDependenciesMeta 将 antd 标 optional？不行——主入口需要 antd。备选：将 UI 无关交互核心（manager/actions/bridge）上移到 pactor-runtime？改动面大。**本次决策**：ui-radix dependencies 加 pactor-ui-antd，ui-antd 的 antd peer 标注为非 optional（与现状一致：radix 套件此前就通过 components-radix → pactor-components 的类型引用存在同类关系；pnpm peer 警告可接受并在文档注明）。若实际验证中 peer 警告不可接受，再评估核心下沉。

### D4: 依赖方更新

- pactor-app：dependencies 删除 pactor-components/pactor-interaction/pactor-layout，加 `pactor-ui-antd`；import 改为子路径（`pactor-ui-antd/components` 等）或主入口——取 diff 最小者。devDependencies 中 radix 三包改为 `pactor-ui-radix`。
- pactor-chat：devDependencies 中 pactor-components/pactor-layout 改为 `pactor-ui-antd`，测试 import 同步。
- 根 package.json devDependencies：移除已删包引用（若有），确保根测试与冒烟通过。

### D5: 文档同步

- 删除六个旧模块页；重写 ui-antd.md / ui-radix.md（按 components/interaction/layout 三节组织，保留原页面关键内容与切换 recipe）。
- 侧边栏「模块」组移除六个旧条目；getting-started 模块概览表收敛（8 行 UI 相关 → 2 行）；README 工程结构同步。
- 设计文档（framework-design.md）第 6/7 节的包结构清单更新（pactor-components 等 → pactor-ui-*）——设计文档作为活文档同步。

## Risks / Trade-offs

- [大范围文件移动容易漏改 import] → 以 pnpm -r build + 全量测试 + typecheck 为准绳；测试随源码迁移并更新相对路径。
- [export * 符号冲突] → D2 机制；冲突清单公开。
- [ui-radix 依赖 ui-antd 带来的 antd peer 警告] → D3 已评估，文档注明；后续如需彻底解耦，把 UI 无关交互核心下沉 runtime（另立项）。

## Migration Plan

框架未发布，无外部迁移负担。顺序：ui-antd 整合 → ui-radix 整合 → app/chat 改接 → 删旧包 → 文档 → 全量验收。README/文档中的导入示例全部更新。

## Open Questions

- 主 spec（openspec/specs/）中按包名描述的能力归属文字，在下次归档同步时统一刷新包名引用。
