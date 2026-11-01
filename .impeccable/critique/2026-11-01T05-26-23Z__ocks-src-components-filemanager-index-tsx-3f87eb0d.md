---
target: FileManager 组件
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "file:/Users/Zhuanz/Documents/workspace/pactor/packages/blocks/src/components/FileManager/index.tsx"
target_fingerprint: "sha256:8a1810b7d7d9b4134fe9c573d85faa117342c9bc164388a94eb57c2d0a635962"
target_path: /Users/Zhuanz/Documents/workspace/pactor/packages/blocks/src/components/FileManager/index.tsx
timestamp: 2026-11-01T05-26-23Z
slug: ocks-src-components-filemanager-index-tsx-3f87eb0d
---
# FileManager 设计评审

Method: dual-agent (A: agent-4 · B: agent-5)
Mode: Operate · 运行态 localhost:4336/components/blocks/file-manager

## Design Health Score: 20/40 (Acceptable)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | 编辑态/只读态视觉无差别；无 dirty 标记 |
| 2 | Match System / Real World | 3 | 「完成」语义含糊：既不保存也不放弃 |
| 3 | User Control and Freedom | 1 | 编辑中切文件草稿静默丢失，无确认/取消/Esc |
| 4 | Consistency and Standards | 2 | 树无文件/目录图标；编辑器暗色模式白底 |
| 5 | Error Prevention | 1 | selectFile 无条件 setDraft(undefined)，草稿零防护 |
| 6 | Recognition Rather Than Recall | 3 | 长文件名 truncate 无 tooltip |
| 7 | Flexibility and Efficiency | 1 | 树无键盘操作；无搜索；侧栏不可调宽 |
| 8 | Aesthetic and Minimalist Design | 3 | 编辑器固定 480px，短文件留白 |
| 9 | Error Recovery | 1 | 复制失败静默 |
| 10 | Help and Documentation | 3 | 空态引导在位；docs 完整 |

## Design Specificity Verdict
契约层有特异性（DSL 编排契约是库内标杆），体验层是通用件；「文件管理器」之名对能力过度承诺。
Deterministic scan: impeccable detect 0 findings（要害问题全在交互行为层，不在标记层）。
Browser evidence: 文本对比度全过；CM 行号槽 1.25:1 判假阳性；键盘实测确认 treeitem 全部 tabIndex=-1 无 roving tabindex，复制按钮无可访问名称（源头 ui CopyButton）。Overlay: preflight 可变注入 true，未实际启动。

## What's Working
1. DSL 契约标杆：受控/非受控分离、type 推断、事件载荷最小化。
2. 复制反馈闭环优雅（IconMorph copy→check + 自动还原）。
3. Skin Authority 全合规，零硬编码色值。

## Priority Issues
- [P0] 编辑草稿静默丢失（实测）：draft 非空时应拦截切换（确认/禁用树点击），或内建「保存/放弃」按钮。→ $impeccable harden
- [P0] 暗色模式编辑器白底：ScriptEditor 未传 CM theme。→ $impeccable colorize
- [P1] 树键盘不可达：role=tree 无 roving tabindex/方向键。→ $impeccable audit
- [P1] 窄视口无降级（390px 编辑器剩两字符宽）：断点下上下堆叠。→ $impeccable adapt
- [P2] 树节点无文件/目录图标。→ $impeccable polish

## Persona Red Flags
- Alex: 树无键盘接口、无 Ctrl+S、侧栏不可拖宽。
- Sam: 文件名 span 无 tabindex 不可聚焦；复制按钮无 aria-label；复制成功无 aria-live。
- Riley: 编辑中切文件草稿蒸发；files=[] 空树只剩标题；长文件名无 tooltip；暗色白底。

## Minor Observations
折叠含选中文件的目录后树高亮消失但内容区仍显示；路径 muted 弱化当前文件主角地位；空态图标 file-text 语义偏弱；编辑器固定高度短文件留白；「完成」按钮编辑态无视觉强调；只读/编辑态亮度差过小。

## Questions to Consider
1. 组件该假装能编辑，还是内建「保存/放弃」的真实承诺？
2. 「文件管理器」之名过度承诺还是能力欠债？
3. CodeMirror 主题适配：Skin Authority 的边界画在哪？
