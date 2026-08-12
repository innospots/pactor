# Design: docs-developer-usage

## 内容架构

指南组扩为 5 篇，形成使用者的学习路径：

1. **快速开始**（重写）：环境 → 安装哪些包（按场景给组合：完整应用 / 只要渲染器 / 只要 chat）→ 最小可运行接入（照搬 example-vite-starter 结构）→ createPactorApplication 参数表 → 切 antd kit → vite 插件与 CLI。
2. **数据流**（新增）：加载链路（bootstrap → 菜单/布局 → 页面 DSL → dataSources autoLoad）+ 运行时数据通路图（state / data / actions / params / event / row 的产生与消费方）+ 重渲染模型（根节点订阅 StateStore/DataStore 版本号，任一变化重渲染整棵树；OverlayHost 同样订阅）+ 两个端到端走查（查询表单提交、抽屉编辑保存）。
3. **事件与表单联动**（已有，不动）。
4. **自定义组件**（新增）：契约 6 条（来自 renderer.tsx 实现）→ 最小组件 → 容器组件（renderChildren / withScope / dslChildren）→ 注册（createPactorApplication componentRegistry 工厂、ui 预设槽位、聊天 Safe Registry）→ 注意事项（props 已求值勿再 resolveTemplate、内嵌 DSL 子树不求值的 isOpaque 约定、permission 注入 disabled/readOnly 的承接）。
5. **主题与换肤**（已有，不动）。

## 快速开始重写要点

- 安装组合表：完整应用 `pactor-app pactor-ui-radix`（或 ui-antd + antd）；只用渲染器 `pactor-runtime`；chat `pactor-chat`；工具链 `pactor-vite-plugin -D`、`pactor-cli -D`。
- 最小接入四步：vite.config 挂插件 → dsl-modules.d.ts → 写 page.yaml → main.tsx（loader + createPactorApplication + styles.css）。
- createPactorApplication 参数表：appId / api|loader / ui / componentRegistry / layoutRegistry / interactionKit / services / actions / permissionStore?（以 packages/app/src/application.ts 实际签名为准）。
- monorepo 贡献者内容压成"参与框架开发"末节。

## reference/dsl 补充

- 组件目录加 `### Markdown`（content props、安全约束一句话、来自 pactor-markdown 需 registerMarkdownComponents 或 chat 场景内置）。
- 组件目录开头加一句链接到自定义组件指南。

## 验证

- 新增/修改页面后重启 docs dev server；`pnpm docs:build` 通过；
- 浏览器抽查新页面渲染（侧栏、代码块、表格）；
- createPactorApplication 参数表逐项对照 application.ts 源码核实（不凭空写）。
