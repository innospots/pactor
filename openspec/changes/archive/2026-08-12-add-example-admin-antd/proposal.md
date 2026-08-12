# Proposal: add-example-admin-antd

## Why

现有示例 `example-admin`（examples/admin）使用默认 Radix kit，框架的"同一 DSL 双 UI kit 运行"能力缺少一个可运行的 antd 侧实证；用户也需要一份 antd 接入的参考工程。

## What Changes

- 新增 `examples/admin-antd`（包名 `example-admin-antd`，private，端口 **5299**）：复用 example-admin 的全部页面 DSL（login / dashboard / customer-list / customer-edit，**零修改**）与 mock 代码（auth / services / bootstrap），仅切换 `ui: antdUiKit` 并引入 `antd/dist/reset.css`。
- 验证同一份 DSL 在 antd kit 下的登录全流程、列表/抽屉编辑、权限禁用等行为与 Radix 版一致。

## Capabilities

### New Capabilities

- `example-admin-antd`: antd UI kit 版管理后台示例工程（examples/admin-antd），DSL 与 example-admin 共享语义、可启动可构建可验证。

### Modified Capabilities

（无）

## Impact

- 新增：`examples/admin-antd/**`；workspace 成员（pnpm-workspace.yaml 已含 `examples/*`，无需改动）。
- 依赖：antd ^6（与 packages/ui-antd 的 peer `antd>=5` 及 workspace 现有 antd@6.6.0 对齐）。
- 不影响任何现有包代码。
