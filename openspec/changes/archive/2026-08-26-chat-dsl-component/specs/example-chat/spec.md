# Delta: example-chat

## MODIFIED Requirements

### Requirement: DSL 页面驱动

示例的聊天页面 SHALL 以 DSL 声明（`*.page.yaml` 经 vite-plugin-dsl 编译），页面 body 为一等组件 `Chat` 节点——左侧菜单、header、title、greeting、suggestions 等均由 YAML 配置，菜单交互经 `events.onMenuSelect` + DSL state 表达。宿主装配代码 SHALL 仅负责：以 `ChatServicesProvider` 注入服务（transport/safeRegistry/capabilities/附件伪上传/提及与 picker 回调/工具栏槽）、`registerChatComponent` 注册组件、`createPageRuntime` 渲染。

#### Scenario: YAML 声明页面

- **WHEN** 查看 examples/chat 源码
- **THEN** 存在 chat.page.yaml 以 Chat 组件声明页面（含 menu/header/greeting/suggestions），宿主入口无聊天结构 JSX

#### Scenario: 功能不回退

- **WHEN** 启动示例
- **THEN** 既有演示能力（mock 场景、Safe Registry、capability 确认链、附件伪上传、picker、提及、侧栏交互、明暗切换）全部可用
