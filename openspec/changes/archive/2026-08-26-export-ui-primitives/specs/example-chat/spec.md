# Delta: example-chat

## ADDED Requirements

### Requirement: 自定义槽位 UI 经 kit 原语构建

示例中经 Chat 槽位（toolbarStart/toolbarEnd/headerExtra/onMentionTrigger/onPlusMenu 等）注入的自定义 UI（顶栏、能力/模型选择器、上下文选择器、提及列表、"+"菜单等）SHALL 以 `pactor-ui/ui` 原语组件构建，MUST NOT 依赖示例私有 CSS 呈现基本外观——不引入示例私有样式表时，组件区域与槽位内容仍保持可用且视觉完整（示例私有样式表只允许承载宿主页面壳与品牌色等自有视觉）。

#### Scenario: 无私有样式表渲染

- **WHEN** 注释掉示例私有样式表导入后打开对话页
- **THEN** 顶栏、工具栏 chip、弹层等槽位内容保持正常布局与视觉，无塌陷/堆叠/内联文本流
