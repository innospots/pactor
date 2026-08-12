# Design: polish-chat-view

## 参考对象

DeepTutor web（`web/components/chat/home`、`web/hooks`、`web/components/common/RichMarkdownRenderer.tsx`）的技术选型：lucide-react 图标、CSS 变量主题（`--border`/`--card`/`--primary` 语义令牌）、react-markdown + remark-gfm + remark-math + rehype-katex + react-syntax-highlighter、rAF 打字机平滑（useSmoothStreamText）、贴底自动滚动（useChatAutoScroll）。**代码不照抄**，按 pactor 现有约定（零运行时依赖偏好、语义 class + 变量皮肤、vitest）独立实现同等机制。

## pactor-chat 视图重构

### 皮肤（styles.css）

新增 `pactor-chat/styles.css`（package.json `exports["./styles.css"]`），语义 class `pactor-chat-*`（沿用现有命名）+ CSS 变量：

- 令牌：`--pactor-chat-bg/fg/card/border/muted/muted-fg/primary/primary-fg/danger`，气泡专用 `--pactor-chat-user-bubble-bg/fg`，代码块 `--pactor-chat-code-bg`；
- light 默认值锚定 `#3C47DD` 主色（与 ui-radix 皮肤一致）；`[data-pactor-theme='dark']`（或 `.pactor-chat-view` 祖先上的同名 attr）覆盖暗色值；
- 视图组件不再写死颜色内联样式，布局尺寸类内联保留（与 ChatLayout 现有约定一致）。

### 组件

- **MessageBubble**：user → 右侧圆角气泡（max-width 75%、`user-bubble` 变量）；assistant → 左侧通栏排版（无气泡底色）；assistant 气泡 hover 显示操作条（复制 = lucide Copy/Check，`navigator.clipboard`，复制全部 text/markdown part 拼接）；消息级 class 保持 `pactor-chat-message--{role}`。
- **PartRenderer**：
  - thinking / tool-call / tool-result → 自绘折叠卡（`<button>` 头部 + 可展开区，lucide ChevronRight 旋转、Loader2 spin 表 running、CheckCircle2/XCircle 表 success/failed），默认折叠；
  - error → 自绘警示条（AlertCircle + danger 变量）；
  - dsl / text / markdown / status 渲染路径不变（markdown part 套 useSmoothStreamText，见下）。
- **Composer**：自适应高度 textarea（rows=1 起，按 scrollHeight 增长，上限 ~200px）；Enter 发送、Shift+Enter 换行（不变）；流式中（store 存在 pending/streaming 消息）发送按钮变为停止按钮（Square 图标）；空文本禁发（不变）。
- **ChatView**：订阅 store 派生 `isStreaming`；每个 turn 持有一个 `AbortController`，停止按钮 abort 后 assistant 消息以 `cancelled` 收尾；消息区挂 `useChatAutoScroll`，用户上翻 >80px 释放跟随，回底时恢复；释放跟随且流式中时显示"回到底部"浮动按钮（ArrowDown）。

### hooks（零依赖，可独立测试）

- `useSmoothStreamText(content, isStreaming, options?)`：rAF 循环按 `max(MIN, backlog/5)` 每帧揭示、封顶 120 字符/帧；流停止立即对齐全文；内容回缩（重新生成）即时回退；`enabled:false` 时直通。挂在 markdown/text part 的渲染上。
- `useChatAutoScroll(deps)`：单一 `useLayoutEffect` 写 `scrollTop = scrollHeight`（跟随期间唯一写者，容器 `overflow-anchor: none`）；scroll 监听实现 80px 释放/回底恢复；返回 `{ containerRef, endRef, isFollowing, scrollToBottom }`。

### 依赖变化

- 移除 peer `antd`；新增 dependency `lucide-react`；peer 仅 `react`（>=18）。
- ChatLayout 同步去内联色值，用变量。

## runChatTurn AbortSignal

`RunChatTurnOptions` 新增 `signal?: AbortSignal`：进入 transport 循环前与每次迭代后检查 `signal.aborted`；abort 时对该 assistant 消息 `updateMessage({ status: 'cancelled' })` 并正常返回（不抛错，与 error 收敛约定一致）。仍在 streaming 的 part 不强行置 ready（cancelled 语义保留现场）。

## pactor-markdown 增强

- remark 插件追加 `remark-math`；rehype 追加 `rehype-katex`（在现有链接协议白名单 sanitize 之前/之后顺序以安全为准：sanitize 最后）；
- 代码块经 `react-syntax-highlighter` Prism **Light** 构建渲染，注册常用语言（js/ts/tsx/jsx/json/bash/python/yaml/markdown/css）；`pre` 包裹、行内 code 保持原样；
- `MarkdownRenderer` 新增 props：`math?: boolean`（默认 true）、`codeHighlight?: boolean`（默认 true）；
- 安全约束不变：不启用 rehype-raw，链接协议白名单照旧；
- 使用方需 `import 'katex/dist/katex.min.css'`（katex 列为 pactor-markdown dependency；example-chat 直接依赖并在 app.css 引入）；
- 新增 dependency：react-syntax-highlighter、remark-math、rehype-katex、katex（+ @types/react-syntax-highlighter devDep）。

## 测试与验收

- chat：视图测试重写（原 antd 断言作废）——气泡 role 区分、hover 复制、thinking/tool 折叠卡交互、空文本禁发、流式停止（abort → cancelled）；hooks 单测（smooth text 用 fake rAF、auto scroll 用 jsdom scroll 模拟）；runChatTurn abort 测试。
- markdown：GFM 表格、代码高亮（断言 language class / 高亮 span）、行内与块级公式（katex 输出 class）测试。
- example-chat：四条链路浏览器走查（天气/报表/导出/普通提问）+ 流式中停止按钮 + 回到底部按钮 + 暗色皮肤截图。
- 全量：根 `pnpm build / test / typecheck`。

## 非目标

- 不引入 Tailwind / framer-motion / next 动态加载体系（保持库零构建耦合）；
- 不做会话历史侧栏、消息重生成、附件、语音（DeepTutor 有但超出本变更目标）；
- 不动 Safe Registry / capability 协议。
