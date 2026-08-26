# Delta: chat-app-shell

## ADDED Requirements

### Requirement: 组件自持布局（嵌入契约）

`pactor-chat` 的外壳与工作区样式 SHALL 自持完整结构布局：调用方仅 `import 'pactor-chat/styles.css'`（无需任何调用端覆盖）即得到正确布局。高度语义 SHALL 为"填满父容器"（`height: 100%`，父级无定高时退化为内容高度），MUST NOT 硬编码视口高度（100vh/100dvh）；standalone 顶层挂载时宿主容器定高属宿主职责。shell content 区 SHALL 缺省为 flex 列布局并含内边距；其中对话工作区 SHALL 缺省限宽居中，列宽经 CSS 变量 `--pactor-chat-content-width` 可调（缺省 768px，置 `none` 关闭限宽）。

#### Scenario: 无定高嵌入

- **WHEN** 组件嵌入定高 flex 容器（如顶栏之下的剩余区域）且只导入包内样式
- **THEN** 外壳填满容器剩余高度，不溢出、不塌缩

#### Scenario: 对话列缺省居中

- **WHEN** shell content 区渲染对话工作区且无调用端 CSS
- **THEN** 对话列以 --pactor-chat-content-width 限宽并在 content 区内水平居中
