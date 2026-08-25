# Delta: example-chat

## ADDED Requirements

### Requirement: DSL 页面驱动

示例的聊天页面 SHALL 以 DSL 声明（`*.page.yaml` 经 vite-plugin-dsl 编译），页面 body 为 `ChatWorkspace` 节点；宿主装配代码（创建 store/transport/safeRegistry/capabilities、附件伪上传、picker/提及/工具栏注入）经 `createChatWorkspace` 闭包注入并注册组件，页面经 `createPageRuntime` 渲染。DSL 中 SHALL 配置 title / greeting / suggestions 等标量 props。

#### Scenario: YAML 声明页面

- **WHEN** 查看 examples/chat 源码
- **THEN** 存在 chat.page.yaml 声明聊天页（含 greeting/suggestions），App 入口为宿主装配 + createPageRuntime 渲染

#### Scenario: 功能不回退

- **WHEN** 启动示例
- **THEN** 既有演示能力（mock 场景、Safe Registry、capability 确认链、附件伪上传、picker、提及、侧栏、明暗切换）全部可用
